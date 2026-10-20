// Labyrinthe robotisé — modèle du plateau : données, normalisation, empreinte, vérifications.
// Fichier pur (aucun accès à la page) : utilisé par le navigateur et par les tests sous Node.
//
// Le plateau mesure 16 × 16 cm, découpé en 8 × 8 cases de 2 cm (comme le gabarit papier).
// Une case est repérée par { c, l } : colonne c (0 à gauche → 7) et ligne l (0 en haut → 7).
// Un mur est posé sur un bord de case et noté par un texte :
//   "h-c-l" : mur horizontal sur le bord du HAUT de la case (c, l)   (l de 1 à 7)
//   "v-c-l" : mur vertical sur le bord GAUCHE de la case (c, l)      (c de 1 à 7)
// Le cadre du plateau (bords extérieurs) est toujours un mur : il n'est pas rangé dans les données.
// Un tunnel est un couloir couvert d'un toit : `tunnels` liste les cases couvertes. Des cases couvertes voisines
// forment un même tunnel. La bille roule dessous comme ailleurs (pas de raccourci), mais on ne la voit plus.

(function (racine) {
  'use strict';

  const L = (racine.Labyrinthe = racine.Labyrinthe || {});

  const VERSION = 1;
  const CASES = 8; // 8 × 8 cases
  const CASE_MM = 20; // une case = 2 cm
  const COTE_MM = CASES * CASE_MM; // 160 mm
  const BILLE_MM = 12; // diamètre de la bille
  const CHEMIN_MIN_MM = 14; // largeur minimale du chemin (cahier des charges)
  const TEMPS_MIN_S = 10; // durée minimale du parcours (cahier des charges)
  const EPAISSEUR = { defaut: 2, min: 1, max: 8, pas: 0.5 };
  const INCLINAISON = { defaut: 30, min: 5, max: 45, pas: 1 };
  const TEMPS_GARDES = 5;

  function vide() {
    return {
      version: VERSION,
      epaisseurMur: EPAISSEUR.defaut,
      inclinaisonMax: INCLINAISON.defaut,
      murs: [],
      trous: [],
      tunnels: [],
      depart: null,
      arrivee: null,
      meilleursTemps: [],
    };
  }

  // ---------- Outils sur les cases et les murs ----------

  const entier = (n) => typeof n === 'number' && Number.isInteger(n);
  const dansPlateau = (c, l) => entier(c) && entier(l) && c >= 0 && c < CASES && l >= 0 && l < CASES;
  const cleCase = (p) => p.c + ',' + p.l;
  const memeCase = (a, b) => !!a && !!b && a.c === b.c && a.l === b.l;

  function lireCase(p) {
    if (!p || typeof p !== 'object') return null;
    const c = Number(p.c);
    const l = Number(p.l);
    return dansPlateau(c, l) ? { c, l } : null;
  }

  // Mur valide et intérieur (les bords du cadre ne sont pas rangés).
  function lireMur(texte) {
    const m = /^([hv])-(\d)-(\d)$/.exec(String(texte));
    if (!m) return null;
    const sens = m[1];
    const c = Number(m[2]);
    const l = Number(m[3]);
    if (sens === 'h' && c < CASES && l >= 1 && l < CASES) return { sens, c, l };
    if (sens === 'v' && l < CASES && c >= 1 && c < CASES) return { sens, c, l };
    return null;
  }
  const cleMur = (sens, c, l) => sens + '-' + c + '-' + l;

  function trierCases(liste) {
    return liste.sort((a, b) => a.l - b.l || a.c - b.c);
  }

  // Remet des données venues d'un fichier dans un état sûr : champs manquants, doublons, valeurs hors limites.
  // Une case ne porte qu'un seul objet : départ, arrivée, trou ou toit de tunnel (dans cet ordre de priorité).
  function normaliser(entree) {
    const d = vide();
    const e = entree && typeof entree === 'object' ? entree : {};

    const ep = Number(e.epaisseurMur);
    if (Number.isFinite(ep)) d.epaisseurMur = Math.min(EPAISSEUR.max, Math.max(EPAISSEUR.min, Math.round(ep / EPAISSEUR.pas) * EPAISSEUR.pas));
    const inc = Number(e.inclinaisonMax);
    if (Number.isFinite(inc)) d.inclinaisonMax = Math.min(INCLINAISON.max, Math.max(INCLINAISON.min, Math.round(inc)));

    const murs = new Set();
    for (const t of Array.isArray(e.murs) ? e.murs : []) {
      const m = lireMur(t);
      if (m) murs.add(cleMur(m.sens, m.c, m.l));
    }
    d.murs = [...murs].sort();

    const occupees = new Set();
    d.depart = lireCase(e.depart);
    if (d.depart) occupees.add(cleCase(d.depart));
    d.arrivee = lireCase(e.arrivee);
    if (d.arrivee && occupees.has(cleCase(d.arrivee))) d.arrivee = null;
    if (d.arrivee) occupees.add(cleCase(d.arrivee));

    for (const t of Array.isArray(e.trous) ? e.trous : []) {
      const p = lireCase(t);
      if (p && !occupees.has(cleCase(p))) {
        occupees.add(cleCase(p));
        d.trous.push(p);
      }
    }
    trierCases(d.trous);

    // Cases couvertes. L'ancien format { entree, sortie } (version d'essai) est lu comme deux cases couvertes.
    for (const t of Array.isArray(e.tunnels) ? e.tunnels : []) {
      const cases = t && (t.entree || t.sortie) ? [t.entree, t.sortie] : [t];
      for (const x of cases) {
        const p = lireCase(x);
        if (p && !occupees.has(cleCase(p))) {
          occupees.add(cleCase(p));
          d.tunnels.push(p);
        }
      }
    }
    trierCases(d.tunnels);

    for (const t of Array.isArray(e.meilleursTemps) ? e.meilleursTemps : []) {
      if (!t || !(Number(t.temps) > 0)) continue;
      d.meilleursTemps.push({
        temps: Math.round(Number(t.temps) * 10) / 10,
        chutes: Math.max(0, Math.round(Number(t.chutes) || 0)),
        date: typeof t.date === 'string' ? t.date : '',
        empreinte: typeof t.empreinte === 'string' ? t.empreinte : '',
      });
    }
    d.meilleursTemps.sort((a, b) => a.temps - b.temps);
    d.meilleursTemps = d.meilleursTemps.slice(0, TEMPS_GARDES * 2);
    return d;
  }

  // Empreinte du plan (murs, objets, épaisseur) : un temps n'est valable que pour le plan qui l'a donné.
  function empreinte(donnees) {
    const d = normaliser(donnees);
    const texte = JSON.stringify([d.epaisseurMur, d.murs, d.trous, d.tunnels, d.depart, d.arrivee]);
    let h = 5381;
    for (let i = 0; i < texte.length; i++) h = ((h * 33) ^ texte.charCodeAt(i)) >>> 0;
    return h.toString(16).padStart(8, '0');
  }

  // Ce qui se trouve sur une case : 'depart', 'arrivee', 'trou', 'tunnel' (case couverte) ou null.
  function objetSur(d, p) {
    if (memeCase(d.depart, p)) return { type: 'depart' };
    if (memeCase(d.arrivee, p)) return { type: 'arrivee' };
    if (d.trous.some((t) => memeCase(t, p))) return { type: 'trou' };
    if (d.tunnels.some((t) => memeCase(t, p))) return { type: 'tunnel' };
    return null;
  }

  // Tunnels : groupes de cases couvertes voisines (sans mur entre elles), pour les compter et les dessiner.
  function groupesTunnels(donnees) {
    const d = normaliser(donnees);
    const murs = new Set(d.murs);
    const reste = new Map(d.tunnels.map((p) => [cleCase(p), p]));
    const groupes = [];
    for (const depart of d.tunnels) {
      if (!reste.has(cleCase(depart))) continue;
      const groupe = [];
      const file = [depart];
      reste.delete(cleCase(depart));
      while (file.length) {
        const p = file.shift();
        groupe.push(p);
        for (const q of voisines(murs, p)) {
          if (reste.has(cleCase(q))) {
            reste.delete(cleCase(q));
            file.push(q);
          }
        }
      }
      groupes.push(trierCases(groupe));
    }
    return groupes;
  }

  // ---------- Chemin ----------

  // Cases voisines accessibles depuis p (pas de mur entre les deux).
  function voisines(murs, p) {
    const r = [];
    if (p.l > 0 && !murs.has(cleMur('h', p.c, p.l))) r.push({ c: p.c, l: p.l - 1 });
    if (p.l < CASES - 1 && !murs.has(cleMur('h', p.c, p.l + 1))) r.push({ c: p.c, l: p.l + 1 });
    if (p.c > 0 && !murs.has(cleMur('v', p.c, p.l))) r.push({ c: p.c - 1, l: p.l });
    if (p.c < CASES - 1 && !murs.has(cleMur('v', p.c + 1, p.l))) r.push({ c: p.c + 1, l: p.l });
    return r;
  }

  // Parcours de la grille du départ vers l'arrivée. Les trous sont infranchissables ; sous un toit de tunnel,
  // la bille roule comme ailleurs (les murs comptent, il n'y a pas de raccourci).
  // Renvoie le nombre de cases du plus court chemin (départ et arrivée compris), ou 0 s'il n'y en a pas.
  function longueurChemin(donnees) {
    const d = normaliser(donnees);
    if (!d.depart || !d.arrivee) return 0;
    const murs = new Set(d.murs);
    const trous = new Set(d.trous.map(cleCase));
    const vues = new Map([[cleCase(d.depart), 1]]);
    const file = [d.depart];
    while (file.length) {
      const p = file.shift();
      const n = vues.get(cleCase(p));
      if (memeCase(p, d.arrivee)) return n;
      for (const q of voisines(murs, p)) {
        const k = cleCase(q);
        if (vues.has(k) || trous.has(k)) continue;
        vues.set(k, n + 1);
        file.push(q);
      }
    }
    return 0;
  }
  const cheminPossible = (donnees) => longueurChemin(donnees) > 0;

  // Largeur du passage le plus étroit. Un mur intérieur est centré sur le bord de case (il prend e/2 de chaque
  // côté) ; le cadre est collé à l'intérieur du plateau (il prend e entier). Le couloir le long du cadre est donc
  // le plus étroit : 20 − e − e/2.
  const largeurChemin = (epaisseur) => Math.round((CASE_MM - 1.5 * epaisseur) * 10) / 10;

  // Meilleurs temps du plan actuel (les temps d'une version précédente du plan ne comptent plus).
  function tempsDuPlan(donnees) {
    const d = normaliser(donnees);
    const e = empreinte(d);
    return d.meilleursTemps.filter((t) => t.empreinte === e).sort((a, b) => a.temps - b.temps);
  }

  // Range un essai réussi ; garde les meilleurs temps du plan actuel. Renvoie de nouvelles données.
  function ajouterTemps(donnees, temps, chutes, date) {
    const d = normaliser(donnees);
    const e = empreinte(d);
    const liste = d.meilleursTemps.filter((t) => t.empreinte === e);
    liste.push({ temps: Math.round(temps * 10) / 10, chutes: Math.max(0, chutes | 0), date: date || '', empreinte: e });
    liste.sort((a, b) => a.temps - b.temps);
    d.meilleursTemps = liste.slice(0, TEMPS_GARDES);
    return d;
  }

  const virgule = (n) => String(n).replace('.', ',');

  // Vérifications du cahier des charges, sans donner la solution.
  // Chaque point : { cle, etat: 'ok' | 'ecart' | 'attente', texte }. 'attente' = pas encore mesurable.
  function verifier(donnees) {
    const d = normaliser(donnees);
    const points = [];
    const ajouter = (cle, etat, texte) => points.push({ cle, etat, texte });

    ajouter('depart', d.depart ? 'ok' : 'ecart', d.depart ? 'Le départ D est placé.' : 'Le départ D n’est pas encore placé.');
    ajouter('arrivee', d.arrivee ? 'ok' : 'ecart', d.arrivee ? 'L’arrivée A est placée.' : 'L’arrivée A n’est pas encore placée.');

    const n = longueurChemin(d);
    if (!d.depart || !d.arrivee) ajouter('chemin', 'attente', 'Le chemin sera vérifié quand D et A seront placés.');
    else if (n) ajouter('chemin', 'ok', 'Un chemin relie D à A.');
    else ajouter('chemin', 'ecart', 'Aucun chemin ne relie D à A pour l’instant : des murs ou des trous ferment le passage.');

    const largeur = largeurChemin(d.epaisseurMur);
    if (largeur >= CHEMIN_MIN_MM)
      ajouter('largeur', 'ok', `Le chemin mesure ${virgule(largeur)} mm de large (au moins ${CHEMIN_MIN_MM} mm demandés).`);
    else
      ajouter('largeur', 'ecart', `Le chemin mesure ${virgule(largeur)} mm de large avec des murs de ${virgule(d.epaisseurMur)} mm : il faut au moins ${CHEMIN_MIN_MM} mm.`);

    const temps = tempsDuPlan(d);
    if (!temps.length) ajouter('duree', 'attente', `Durée du parcours : à mesurer dans « Essayer » (au moins ${TEMPS_MIN_S} s demandées).`);
    else if (temps[0].temps >= TEMPS_MIN_S)
      ajouter('duree', 'ok', `Meilleur temps : ${virgule(temps[0].temps)} s (au moins ${TEMPS_MIN_S} s demandées).`);
    else
      ajouter('duree', 'ecart', `Meilleur temps : ${virgule(temps[0].temps)} s. Le cahier des charges demande un parcours d’au moins ${TEMPS_MIN_S} s.`);

    return {
      reussi: points.every((p) => p.etat === 'ok'),
      bien: points.filter((p) => p.etat === 'ok').length,
      total: points.length,
      points,
      chemin: n > 0,
      largeur,
    };
  }

  Object.assign(L, {
    VERSION,
    CASES,
    CASE_MM,
    COTE_MM,
    BILLE_MM,
    CHEMIN_MIN_MM,
    TEMPS_MIN_S,
    EPAISSEUR,
    INCLINAISON,
    vide,
    normaliser,
    empreinte,
    objetSur,
    groupesTunnels,
    lireMur,
    cleMur,
    memeCase,
    longueurChemin,
    cheminPossible,
    largeurChemin,
    tempsDuPlan,
    ajouterTemps,
    verifier,
    virgule,
  });
  if (typeof module === 'object' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
