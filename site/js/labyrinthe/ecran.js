// Labyrinthe robotisé — module « Mon labyrinthe » : concepteur du plateau + simulateur + impression du gabarit.
// À poser dans une page (onglet Conception du carnet) :
//   const lab = Labyrinthe.monter(hote, { donnees, surChangement(donnees) {…}, lecture: false });
//   lab.donnees() → copie des données ; lab.definir(donnees) ; lab.lecture(true|false) ; lab.demonter()
// Scripts à charger avant : modele.js, dessin.js, physique.js (puis ce fichier) et css/labyrinthe.css.

(function (racine) {
  'use strict';

  const L = (racine.Labyrinthe = racine.Labyrinthe || {});
  const NS = 'http://www.w3.org/2000/svg';
  const VITESSE_SERVO = 300; // °/s : le plateau rejoint l'inclinaison demandée à la vitesse d'un servomoteur
  const VITESSE_CLAVIER = 20; // °/s : une flèche tenue incline de plus en plus
  const ECHELLE_VUE = 0.35; // le plateau dessiné penche moins que le vrai (lisible, ne déborde pas) ; la physique utilise le vrai angle
  const HISTOIRE_MAX = 60;

  const OUTILS = [
    { cle: 'mur', nom: 'Mur', aide: 'Clique sur un trait de la grille pour poser un mur, reclique pour l’enlever. Glisse pour en poser plusieurs.' },
    { cle: 'trou', nom: 'Trou', aide: 'Clique sur une case pour y percer un trou (Ø 16 mm). La bille qui y tombe repart du départ.' },
    { cle: 'tunnel', nom: 'Tunnel', aide: 'Clique sur une case pour la couvrir d’un toit (couloir couvert), reclique pour l’enlever. Glisse pour couvrir plusieurs cases. Sous le toit, la bille roule comme ailleurs, mais on ne la voit plus.' },
    { cle: 'depart', nom: 'Départ D', aide: 'Clique sur la case où la bille est posée au départ.' },
    { cle: 'arrivee', nom: 'Arrivée A', aide: 'Clique sur la case que la bille doit atteindre.' },
    { cle: 'gomme', nom: 'Gomme', aide: 'Clique sur un mur ou sur une case pour enlever ce qui s’y trouve.' },
  ];

  const ICONES = {
    mur: '<path d="M3 6h18M3 12h8M15 12h6M3 18h18" stroke-width="3"/>',
    trou: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
    tunnel: '<path d="M3 19V11l9-6 9 6v8"/><path d="M7 19v-5a5 5 0 0 1 10 0v5"/>',
    depart: '<circle cx="12" cy="12" r="8"/><text x="12" y="16" font-size="11" text-anchor="middle" fill="currentColor" stroke="none" font-weight="800">D</text>',
    arrivee: '<circle cx="12" cy="12" r="8"/><text x="12" y="16" font-size="11" text-anchor="middle" fill="currentColor" stroke="none" font-weight="800">A</text>',
    gomme: '<path d="M4 16l8-8 6 6-5 5H8z"/><path d="M13 19h7"/>',
    annuler: '<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12" transform="translate(0 -6)"/>',
    imprimer: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><path d="M7 14h10v7H7z"/>',
    recommencer: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>',
  };
  const icone = (cle) =>
    `<svg class="lab-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[cle]}</svg>`;

  const copie = (d) => JSON.parse(JSON.stringify(d));
  const virgule = (n, chiffres) => (chiffres == null ? String(n) : n.toFixed(chiffres)).replace('.', ',');
  const borne = (x, a, b) => Math.max(a, Math.min(b, x));
  // Garde le pointeur sur l'élément pendant un glisser (sans effet si le pointeur n'existe plus).
  function capturer(el, e) {
    try {
      el.setPointerCapture(e.pointerId);
    } catch (_) {
      /* pointeur déjà relâché */
    }
  }
  const echapper = (t) => String(t).replace(/[<&>"]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Modifications du plan (pures, sur une copie normalisée) ----------

  // Retire ce qui occupe la case.
  function liberer(d, p) {
    if (L.memeCase(d.depart, p)) d.depart = null;
    if (L.memeCase(d.arrivee, p)) d.arrivee = null;
    d.trous = d.trous.filter((t) => !L.memeCase(t, p));
    d.tunnels = d.tunnels.filter((t) => !L.memeCase(t, p));
  }

  // ---------- Feuille d'impression (gabarit à l'échelle 1) ----------

  function feuilleImpression(donnees) {
    const d = L.normaliser(donnees);
    const v = L.verifier(d);
    const feuille = document.createElement('div');
    feuille.className = 'lab-feuille';
    // Règle de contrôle de 10 cm, graduée tous les centimètres.
    let traits = 'M0 0H100';
    let chiffres = '';
    for (let i = 0; i <= 100; i += 10) {
      traits += `M${i} 0v${i % 50 ? 3 : 5}`;
      chiffres += `<text x="${i}" y="9" text-anchor="middle">${i / 10}</text>`;
    }
    feuille.innerHTML =
      '<h1>Mon labyrinthe — gabarit à l’échelle 1</h1>' +
      '<p class="lab-feuille-consigne">Imprimer en taille réelle (échelle 100 %). Le carré mesure 16 cm de côté : vérifier avec la règle avant de découper.</p>' +
      `<div class="lab-feuille-plateau">${L.apercu(d, { largeur: '160mm', impression: true, titre: 'Gabarit du labyrinthe, 16 cm de côté' })}</div>` +
      `<svg class="lab-feuille-regle" viewBox="-4 -1 108 12" width="108mm" height="12mm" aria-hidden="true"><path d="${traits}" stroke="#000" stroke-width="0.3" fill="none"/><g font-size="3.5" font-family="Segoe UI, sans-serif">${chiffres}</g></svg>` +
      '<p class="lab-feuille-regle-texte">Règle de contrôle : 10 cm</p>' +
      '<ul class="lab-feuille-legende">' +
      '<li><b>D</b> départ de la bille, <b>A</b> arrivée</li>' +
      `<li>Traits noirs : murs de ${virgule(d.epaisseurMur)} mm (le cadre est à l’intérieur du carré)</li>` +
      (d.trous.length ? `<li>Cercles avec une croix : ${d.trous.length} trou${d.trous.length > 1 ? 's' : ''} Ø 16 mm à percer</li>` : '') +
      (d.tunnels.length ? `<li>Cases hachurées « toit » : tunnel, couloir couvert d’un toit posé sur les murs (hauteur sous le toit : plus de ${L.BILLE_MM} mm)</li>` : '') +
      `<li>Bille Ø ${L.BILLE_MM} mm · chemin le plus étroit ${virgule(v.largeur)} mm (au moins ${L.CHEMIN_MIN_MM} mm) · plateau 150 g au plus</li>` +
      '</ul>';
    return feuille;
  }

  function imprimer(donnees) {
    const ancienne = document.querySelector('body > .lab-feuille');
    if (ancienne) ancienne.remove();
    const feuille = feuilleImpression(donnees);
    document.body.appendChild(feuille);
    document.documentElement.classList.add('lab-impression');
    const finir = () => {
      document.documentElement.classList.remove('lab-impression');
      feuille.remove();
      window.removeEventListener('afterprint', finir);
    };
    window.addEventListener('afterprint', finir);
    window.print();
  }

  // ---------- Le module ----------

  function monter(hote, options) {
    const o = options || {};
    let D = L.normaliser(o.donnees);
    let enLecture = !!o.lecture;
    let mode = 'concevoir';
    let outil = 'mur';
    let message = '';
    const histoire = [];

    hote.classList.add('lab');
    hote.innerHTML =
      '<div class="lab-barre">' +
      '<div class="lab-modes" role="tablist" aria-label="Mon labyrinthe">' +
      '<button type="button" role="tab" class="lab-mode" data-mode="concevoir">Concevoir</button>' +
      '<button type="button" role="tab" class="lab-mode" data-mode="essayer">Essayer</button>' +
      '</div>' +
      '<span class="lab-lecture-etiquette" hidden>Lecture seule</span>' +
      `<button type="button" class="lab-btn lab-annuler" title="Annuler la dernière modification">${icone('annuler')}<span>Annuler</span></button>` +
      `<button type="button" class="lab-btn lab-imprimer">${icone('imprimer')}<span>Imprimer le gabarit</span></button>` +
      '</div>' +
      '<div class="lab-corps">' +
      '<div class="lab-outils">' +
      '<div class="lab-outils-liste" role="radiogroup" aria-label="Outils">' +
      OUTILS.map((t) => `<button type="button" role="radio" class="lab-outil" data-outil="${t.cle}">${icone(t.cle)}<span>${t.nom}</span></button>`).join('') +
      '</div>' +
      '<label class="lab-reglage">Épaisseur des murs <output class="lab-epaisseur-valeur"></output>' +
      `<input type="range" class="lab-epaisseur" min="${L.EPAISSEUR.min}" max="${L.EPAISSEUR.max}" step="${L.EPAISSEUR.pas}"></label>` +
      '<button type="button" class="lab-btn lab-effacer">Tout effacer</button>' +
      '</div>' +
      '<div class="lab-scene">' +
      '<div class="lab-plateau">' +
      `<svg class="lab-svg" viewBox="0 0 ${L.COTE_MM} ${L.COTE_MM}" role="img" aria-label="Plateau du labyrinthe, 16 cm de côté">` +
      '<defs><radialGradient id="lab-reflet" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.35" stop-color="#C9D3D8"/><stop offset="1" stop-color="#5E6B72"/></radialGradient></defs>' +
      '<g class="lab-dessin"></g><g class="lab-calque"></g>' +
      `<circle class="lab-bille" r="${L.BILLE_MM / 2}" fill="url(#lab-reflet)" stroke="#3B464C" stroke-width="0.5"/>` +
      '<g class="lab-toits-calque"></g>' + // au-dessus de la bille : elle disparaît sous les toits
      '</svg>' +
      '</div>' +
      '<p class="lab-scene-message" hidden></p>' +
      '</div>' +
      '<aside class="lab-panneau">' +
      // Concevoir
      '<section class="lab-volet lab-volet-concevoir">' +
      '<p class="lab-aide"></p>' +
      '<h3>Vérifications <span class="lab-bilan"></span></h3>' +
      '<ul class="lab-verifs"></ul>' +
      '<p class="lab-info" role="status"></p>' +
      '</section>' +
      // Essayer
      '<section class="lab-volet lab-volet-essayer">' +
      '<div class="lab-compteurs">' +
      '<div class="lab-compteur"><span>Temps</span><strong class="lab-chrono">0,0 s</strong></div>' +
      '<div class="lab-compteur"><span>Chutes</span><strong class="lab-chutes">0</strong></div>' +
      '</div>' +
      '<p class="lab-statut" role="status"></p>' +
      '<div class="lab-commande">' +
      '<div class="lab-joystick" aria-label="Joystick : glisser pour incliner le plateau"><div class="lab-joystick-croix"></div><div class="lab-manette"></div></div>' +
      '<div class="lab-angles">' +
      '<div>Gauche ↔ droite <strong class="lab-angle-x">0°</strong></div>' +
      '<div>Haut ↕ bas <strong class="lab-angle-y">0°</strong></div>' +
      '<div class="lab-servos">Servo X <strong class="lab-servo-x">90°</strong> · Servo Y <strong class="lab-servo-y">90°</strong></div>' +
      '</div>' +
      '</div>' +
      '<label class="lab-reglage">Inclinaison maximale <output class="lab-inclinaison-valeur"></output>' +
      `<input type="range" class="lab-inclinaison" min="${L.INCLINAISON.min}" max="${L.INCLINAISON.max}" step="${L.INCLINAISON.pas}"></label>` +
      '<p class="lab-astuce">Flèches du clavier, joystick ou glisser sur le plateau.</p>' +
      `<button type="button" class="lab-btn lab-recommencer">${icone('recommencer')}<span>Recommencer</span></button>` +
      '<h3>Meilleurs temps</h3>' +
      '<ol class="lab-temps"></ol>' +
      '</section>' +
      '</aside>' +
      '</div>';

    const $ = (s) => hote.querySelector(s);
    const svg = $('.lab-svg');
    const calque = $('.lab-calque');
    const bille = $('.lab-bille');
    const plateau = $('.lab-plateau');

    function retenir() {
      histoire.push(JSON.stringify(D));
      if (histoire.length > HISTOIRE_MAX) histoire.shift();
    }

    // Nouveau plan. choix.sansHistoire : ne pas l'ajouter à « Annuler » ; choix.garderBille : le plan
    // lui-même ne change pas (réglage d'inclinaison), la bille reste où elle est.
    function changer(nouveau, choix) {
      if (enLecture) return;
      const c = choix || {};
      if (!c.sansHistoire) retenir();
      D = L.normaliser(nouveau);
      if (!c.garderBille) sim = null;
      dessiner();
      if (typeof o.surChangement === 'function') o.surChangement(copie(D));
    }

    // ---------- Affichage ----------

    function dessiner() {
      $('.lab-dessin').innerHTML = L.contenu(D, { sansToits: true });
      // Toits : transparents pour concevoir (on voit les murs dessous), opaques pour essayer (la bille est cachée).
      $('.lab-toits-calque').innerHTML = L.toits(D, mode === 'essayer' ? 'opaque' : 'transparent');
      hote.classList.toggle('lab-en-lecture', enLecture);
      hote.dataset.mode = mode;
      $('.lab-lecture-etiquette').hidden = !enLecture;
      for (const b of hote.querySelectorAll('.lab-mode')) {
        b.setAttribute('aria-selected', String(b.dataset.mode === mode));
      }
      for (const b of hote.querySelectorAll('.lab-outil')) {
        b.setAttribute('aria-checked', String(b.dataset.outil === outil));
        b.disabled = enLecture;
      }
      $('.lab-annuler').disabled = enLecture || !histoire.length;
      $('.lab-annuler').hidden = mode !== 'concevoir';
      $('.lab-effacer').disabled = enLecture;
      const ep = $('.lab-epaisseur');
      ep.value = D.epaisseurMur;
      ep.disabled = enLecture;
      $('.lab-epaisseur-valeur').textContent = virgule(D.epaisseurMur) + ' mm';
      const inc = $('.lab-inclinaison');
      inc.value = D.inclinaisonMax;
      inc.disabled = enLecture;
      $('.lab-inclinaison-valeur').textContent = '± ' + D.inclinaisonMax + '°';
      $('.lab-aide').textContent = enLecture
        ? 'Lecture seule : le plan ne peut pas être modifié.'
        : OUTILS.find((t) => t.cle === outil).aide;

      const v = L.verifier(D);
      $('.lab-bilan').textContent = `${v.bien} sur ${v.total}`;
      const symbole = { ok: '✓', ecart: '!', attente: '…' };
      const mot = { ok: 'respecté', ecart: 'à revoir', attente: 'à venir' };
      $('.lab-verifs').innerHTML = v.points
        .map((p) => `<li class="lab-verif lab-${p.etat}"><span class="lab-verif-symbole" aria-hidden="true">${symbole[p.etat]}</span><span><span class="lab-lecteur">${mot[p.etat]} : </span>${echapper(p.texte)}</span></li>`)
        .join('');
      $('.lab-info').textContent = message;
      $('.lab-info').hidden = !message;

      const temps = L.tempsDuPlan(D);
      const anciens = D.meilleursTemps.length && !temps.length;
      $('.lab-temps').innerHTML = temps.length
        ? temps.map((t) => `<li><strong>${virgule(t.temps, 1)} s</strong> · ${t.chutes} chute${t.chutes > 1 ? 's' : ''}${t.temps >= L.TEMPS_MIN_S ? ' · ✓ au moins 10 s' : ''}</li>`).join('')
        : `<li class="lab-vide">${anciens ? 'Les temps enregistrés concernaient une version précédente du plan.' : 'Pas encore de parcours réussi.'}</li>`;
      dessinerCalque();
      if (mode === 'essayer') preparerSimulation();
      else {
        bille.style.display = 'none';
        $('.lab-scene-message').hidden = true;
      }
    }

    // Survol du pointeur.
    let survol = null;
    function dessinerCalque() {
      const morceaux = [];
      if (survol && mode === 'concevoir' && !enLecture) {
        if (survol.mur) {
          const m = L.lireMur(survol.mur);
          const x1 = m.c * L.CASE_MM;
          const y1 = m.l * L.CASE_MM;
          const x2 = m.sens === 'h' ? x1 + L.CASE_MM : x1;
          const y2 = m.sens === 'h' ? y1 : y1 + L.CASE_MM;
          morceaux.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1A6E8E" stroke-width="${Math.max(2, D.epaisseurMur)}" stroke-linecap="round" opacity="0.55"/>`);
        } else if (survol.case) {
          const c = survol.case;
          morceaux.push(`<rect x="${c.c * L.CASE_MM + 0.5}" y="${c.l * L.CASE_MM + 0.5}" width="${L.CASE_MM - 1}" height="${L.CASE_MM - 1}" fill="#1A6E8E" opacity="0.15" stroke="#1A6E8E" stroke-width="0.6"/>`);
        }
      }
      calque.innerHTML = morceaux.join('');
    }

    // ---------- Concepteur ----------

    // Point du plateau (mm) sous le pointeur.
    function pointMm(e) {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    }

    const dehors = (p) => !p || p.x < 0 || p.y < 0 || p.x > L.COTE_MM || p.y > L.COTE_MM;
    const caseSous = (p) =>
      dehors(p) ? null : { case: { c: borne(Math.floor(p.x / L.CASE_MM), 0, L.CASES - 1), l: borne(Math.floor(p.y / L.CASE_MM), 0, L.CASES - 1) } };

    // Ce que vise le pointeur : un bord de case (mur) s'il est assez près, sinon la case (pourMur : jamais la case).
    // sens : 'h' ou 'v' pour ne viser que des murs de ce sens (glisser le long d'un trait sans accrocher les croisements).
    function cible(p, pourMur, sens) {
      if (dehors(p)) return null;
      const C = L.CASE_MM;
      const { c, l } = caseSous(p).case;
      const lh = Math.round(p.y / C);
      const lv = Math.round(p.x / C);
      const dh = Math.abs(p.y - lh * C);
      const dv = Math.abs(p.x - lv * C);
      const seuil = pourMur ? C / 2 : 4;
      const murH = lh >= 1 && lh < L.CASES && sens !== 'v' ? L.cleMur('h', c, lh) : null;
      const murV = lv >= 1 && lv < L.CASES && sens !== 'h' ? L.cleMur('v', lv, l) : null;
      if (murH && dh <= dv && dh < seuil) return { mur: murH };
      if (murV && dv < dh && dv < seuil) return { mur: murV };
      if (murH && !murV && dh < seuil) return { mur: murH };
      if (murV && !murH && dv < seuil) return { mur: murV };
      return pourMur ? null : { case: { c, l } };
    }

    // Ce que l'outil choisi vise sous le pointeur.
    function viseParOutil(p) {
      if (outil === 'mur') return cible(p, true);
      if (outil === 'gomme') return cible(p, false);
      return caseSous(p);
    }

    // Glisser avec l'outil mur (sens : 'h' | 'v') ou tunnel : le premier mur ou la première case décide de l'action.
    let trace = null; // { type: 'mur' | 'tunnel', action: 'poser' | 'enlever', sens, vus: Set, d }

    function appliquerMur(d, cle, action) {
      const a = new Set(d.murs);
      if (action === 'poser') a.add(cle);
      else a.delete(cle);
      d.murs = [...a];
    }

    function appliquerToit(d, p, action) {
      liberer(d, p);
      if (action === 'poser') d.tunnels.push(p);
    }

    function cliquerCase(p) {
      const d = copie(D);
      const objet = L.objetSur(D, p);
      message = '';
      if (outil === 'gomme') {
        if (!objet) return;
        liberer(d, p);
      } else if (outil === 'trou') {
        if (objet && objet.type === 'trou') liberer(d, p);
        else {
          liberer(d, p);
          d.trous.push(p);
        }
      } else if (outil === 'depart' || outil === 'arrivee') {
        liberer(d, p);
        d[outil] = p;
      }
      changer(d);
    }

    svg.addEventListener('pointerdown', (e) => {
      if (mode !== 'concevoir' || enLecture || e.button !== 0) return;
      const t = viseParOutil(pointMm(e));
      if (!t) return;
      e.preventDefault();
      if (t.mur) {
        const action = outil === 'gomme' || D.murs.includes(t.mur) ? 'enlever' : 'poser';
        retenir();
        trace = { type: 'mur', action, sens: t.mur[0], vus: new Set([t.mur]), d: copie(D) };
        appliquerMur(trace.d, t.mur, action);
        D = L.normaliser(trace.d);
        dessiner();
        capturer(svg, e);
      } else if (outil === 'tunnel') {
        const objet = L.objetSur(D, t.case);
        const action = objet && objet.type === 'tunnel' ? 'enlever' : 'poser';
        retenir();
        message = '';
        trace = { type: 'tunnel', action, vus: new Set([t.case.c + ',' + t.case.l]), d: copie(D) };
        appliquerToit(trace.d, t.case, action);
        D = L.normaliser(trace.d);
        dessiner();
        capturer(svg, e);
      } else {
        cliquerCase(t.case);
      }
    });

    svg.addEventListener('pointermove', (e) => {
      if (mode !== 'concevoir' || enLecture) return;
      const p = pointMm(e);
      if (trace && trace.type === 'mur') {
        const t = cible(p, true, trace.sens);
        if (t && t.mur && !trace.vus.has(t.mur)) {
          trace.vus.add(t.mur);
          appliquerMur(trace.d, t.mur, trace.action);
          D = L.normaliser(trace.d);
          dessiner();
        }
      } else if (trace && trace.type === 'tunnel') {
        const t = caseSous(p);
        const cle = t && t.case.c + ',' + t.case.l;
        if (t && !trace.vus.has(cle)) {
          trace.vus.add(cle);
          // En glissant, on ne recouvre pas le départ, l'arrivée ni les trous déjà placés.
          const objet = L.objetSur(trace.d, t.case);
          if (trace.action === 'enlever' ? objet && objet.type === 'tunnel' : !objet) {
            appliquerToit(trace.d, t.case, trace.action);
            D = L.normaliser(trace.d);
            dessiner();
          }
        }
      }
      const avant = JSON.stringify(survol);
      survol = viseParOutil(p);
      if (JSON.stringify(survol) !== avant) dessinerCalque();
    });

    const finirTrace = () => {
      if (!trace) return;
      trace = null;
      changer(D, { sansHistoire: true });
    };
    svg.addEventListener('pointerup', finirTrace);
    svg.addEventListener('pointercancel', finirTrace);
    svg.addEventListener('pointerleave', () => {
      if (!trace && survol) {
        survol = null;
        dessinerCalque();
      }
    });

    hote.querySelector('.lab-outils-liste').addEventListener('click', (e) => {
      const b = e.target.closest('.lab-outil');
      if (!b || enLecture) return;
      outil = b.dataset.outil;
      message = '';
      dessiner();
    });

    $('.lab-epaisseur').addEventListener('input', (e) => {
      const d = copie(D);
      d.epaisseurMur = Number(e.target.value);
      changer(d);
    });

    $('.lab-annuler').addEventListener('click', () => {
      if (enLecture || !histoire.length) return;
      message = '';
      changer(JSON.parse(histoire.pop()), { sansHistoire: true });
    });

    let effacerDemande = 0;
    $('.lab-effacer').addEventListener('click', (e) => {
      if (enLecture) return;
      const b = e.currentTarget;
      if (Date.now() - effacerDemande > 4000) {
        effacerDemande = Date.now();
        b.textContent = 'Confirmer : tout effacer ?';
        b.classList.add('lab-confirmer');
        setTimeout(() => {
          b.textContent = 'Tout effacer';
          b.classList.remove('lab-confirmer');
        }, 4000);
        return;
      }
      effacerDemande = 0;
      b.textContent = 'Tout effacer';
      b.classList.remove('lab-confirmer');
      const d = L.vide();
      d.epaisseurMur = D.epaisseurMur;
      d.inclinaisonMax = D.inclinaisonMax;
      d.meilleursTemps = D.meilleursTemps;
      message = 'Plateau effacé. « Annuler » le fait revenir.';
      changer(d);
    });

    $('.lab-imprimer').addEventListener('click', () => imprimer(D));

    for (const b of hote.querySelectorAll('.lab-mode')) {
      b.addEventListener('click', () => {
        if (mode === b.dataset.mode) return;
        mode = b.dataset.mode;
        survol = null;
        message = '';
        dessiner();
      });
    }

    // ---------- Simulateur ----------

    let sim = null;
    let incline = { x: 0, y: 0 }; // inclinaison réelle du plateau (°)
    let demande = { x: 0, y: 0 }; // inclinaison demandée (joystick, souris), de −1 à 1
    let clavier = { x: 0, y: 0 }; // inclinaison demandée au clavier (°)
    const touches = new Set();
    let boucle = 0;
    let dernier = 0;
    let statut = '';
    let statutEcart = false; // message en ambre (écart au cahier des charges)

    function preparerSimulation() {
      if (!sim) {
        sim = L.Simulation.creer(D);
        incline = { x: 0, y: 0 };
        statutEcart = false;
        statut = !D.depart ? '' : 'Incline le plateau pour faire rouler la bille jusqu’à A.' + (enLecture ? ' Lecture seule : les temps ne sont pas enregistrés.' : '');
      }
      const sans = !D.depart;
      $('.lab-scene-message').hidden = !sans && !!D.arrivee;
      $('.lab-scene-message').textContent = sans
        ? 'Place le départ D dans « Concevoir » pour essayer le labyrinthe.'
        : 'Il n’y a pas encore d’arrivée A : la bille roule, mais le parcours ne peut pas se terminer.';
      afficherSimulation();
      if (!boucle) {
        dernier = performance.now();
        boucle = requestAnimationFrame(tourner);
      }
    }

    function afficherSimulation() {
      if (!sim) return;
      const b = sim.bille;
      bille.style.display = sim.depart ? '' : 'none';
      bille.setAttribute('cx', b.x.toFixed(2));
      bille.setAttribute('cy', b.y.toFixed(2));
      bille.setAttribute('r', ((L.BILLE_MM / 2) * b.echelle).toFixed(2));
      plateau.style.transform = `rotateX(${(-incline.y * ECHELLE_VUE).toFixed(2)}deg) rotateY(${(incline.x * ECHELLE_VUE).toFixed(2)}deg)`;
      $('.lab-chrono').textContent = virgule(L.Simulation.tempsEcoule(sim), 1) + ' s';
      $('.lab-chutes').textContent = String(sim.chutes);
      $('.lab-angle-x').textContent = Math.round(incline.x) + '°';
      $('.lab-angle-y').textContent = Math.round(incline.y) + '°';
      $('.lab-servo-x').textContent = Math.round(90 + incline.x) + '°';
      $('.lab-servo-y').textContent = Math.round(90 + incline.y) + '°';
      const st = $('.lab-statut');
      st.textContent = statut;
      st.classList.toggle('lab-statut-ecart', statutEcart);
      const m = $('.lab-manette');
      const vx = clavier.x || clavier.y ? clavier.x / D.inclinaisonMax : demande.x;
      const vy = clavier.x || clavier.y ? clavier.y / D.inclinaisonMax : demande.y;
      m.style.transform = `translate(${(vx * 50).toFixed(1)}%, ${(vy * 50).toFixed(1)}%)`;
    }

    function tourner(t) {
      boucle = 0;
      if (mode !== 'essayer' || !hote.isConnected) return;
      const dt = Math.min(0.05, (t - dernier) / 1000);
      dernier = t;
      const max = D.inclinaisonMax;

      // Clavier : une flèche tenue incline progressivement ; relâchée, le plateau revient à plat.
      const dirX = (touches.has('ArrowRight') ? 1 : 0) - (touches.has('ArrowLeft') ? 1 : 0);
      const dirY = (touches.has('ArrowDown') ? 1 : 0) - (touches.has('ArrowUp') ? 1 : 0);
      clavier.x = dirX ? borne(clavier.x + dirX * VITESSE_CLAVIER * dt, -max, max) : 0;
      clavier.y = dirY ? borne(clavier.y + dirY * VITESSE_CLAVIER * dt, -max, max) : 0;
      const cible = touches.size ? { x: clavier.x, y: clavier.y } : { x: demande.x * max, y: demande.y * max };

      // Le plateau suit à la vitesse d'un servomoteur.
      const pas = VITESSE_SERVO * dt;
      incline.x += borne(cible.x - incline.x, -pas, pas);
      incline.y += borne(cible.y - incline.y, -pas, pas);

      const ev = L.Simulation.avancer(sim, dt, incline);
      if (ev.length) statutEcart = false;
      if (ev.includes('demarrage')) statut = 'C’est parti : le chronomètre tourne.';
      if (ev.includes('chute')) statut = `La bille est tombée dans un trou : elle repart du départ (chute n° ${sim.chutes}). Le chronomètre continue.`;
      if (ev.includes('arrivee')) arrivee();
      afficherSimulation();
      boucle = requestAnimationFrame(tourner);
    }

    function arrivee() {
      const temps = sim.tempsFinal;
      const chutes = sim.chutes;
      const texte = `Arrivée en ${virgule(temps, 1)} s avec ${chutes} chute${chutes > 1 ? 's' : ''}.`;
      statutEcart = temps < L.TEMPS_MIN_S;
      statut = temps >= L.TEMPS_MIN_S
        ? `${texte} ✓ Le parcours dure au moins ${L.TEMPS_MIN_S} s.`
        : `${texte} Le cahier des charges demande un parcours d’au moins ${L.TEMPS_MIN_S} s : il peut être allongé.`;
      if (enLecture) {
        statut += ' (Lecture seule : temps non enregistré.)';
        return;
      }
      D = L.ajouterTemps(D, temps, chutes, new Date().toISOString().slice(0, 16));
      if (typeof o.surChangement === 'function') o.surChangement(copie(D));
      dessiner();
    }

    $('.lab-recommencer').addEventListener('click', () => {
      sim = null;
      demande = { x: 0, y: 0 };
      dessiner();
    });

    $('.lab-inclinaison').addEventListener('input', (e) => {
      const d = copie(D);
      d.inclinaisonMax = Number(e.target.value);
      changer(d, { sansHistoire: true, garderBille: true });
    });

    // Joystick à l'écran et glisser sur le plateau : la manette revient au centre quand on la lâche.
    function suivre(zone, rayon) {
      let actif = null;
      zone.addEventListener('pointerdown', (e) => {
        if (mode !== 'essayer' || e.button !== 0) return;
        actif = e.pointerId;
        capturer(zone, e);
        bouger(e);
        e.preventDefault();
      });
      const bouger = (e) => {
        if (e.pointerId !== actif) return;
        const r = zone.getBoundingClientRect();
        const R = rayon(r);
        let x = (e.clientX - (r.left + r.width / 2)) / R;
        let y = (e.clientY - (r.top + r.height / 2)) / R;
        const n = Math.hypot(x, y);
        if (n > 1) {
          x /= n;
          y /= n;
        }
        demande = { x, y };
      };
      zone.addEventListener('pointermove', bouger);
      const lacher = (e) => {
        if (e.pointerId !== actif) return;
        actif = null;
        demande = { x: 0, y: 0 };
      };
      zone.addEventListener('pointerup', lacher);
      zone.addEventListener('pointercancel', lacher);
    }
    suivre($('.lab-joystick'), (r) => r.width / 2);
    suivre($('.lab-scene'), (r) => Math.min(r.width, r.height) / 2);

    const visible = () => hote.isConnected && hote.offsetParent !== null && mode === 'essayer';
    const FLECHES = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    function toucheBas(e) {
      if (!FLECHES.includes(e.key) || !visible()) return;
      const cibleSaisie = e.target && e.target.closest && e.target.closest('input, textarea, select, [contenteditable]');
      if (cibleSaisie) return;
      e.preventDefault();
      touches.add(e.key);
    }
    function toucheHaut(e) {
      touches.delete(e.key);
    }
    const toutLacher = () => touches.clear();
    document.addEventListener('keydown', toucheBas);
    document.addEventListener('keyup', toucheHaut);
    window.addEventListener('blur', toutLacher);

    dessiner();

    return {
      donnees: () => copie(D),
      definir(d) {
        D = L.normaliser(d);
        histoire.length = 0;
        sim = null;
        dessiner();
      },
      lecture(oui) {
        enLecture = !!oui;
        trace = null;
        sim = null;
        dessiner();
      },
      verifier: () => L.verifier(D),
      imprimer: () => imprimer(D),
      demonter() {
        if (boucle) cancelAnimationFrame(boucle);
        boucle = 0;
        document.removeEventListener('keydown', toucheBas);
        document.removeEventListener('keyup', toucheHaut);
        window.removeEventListener('blur', toutLacher);
        hote.innerHTML = '';
        hote.classList.remove('lab', 'lab-en-lecture');
        delete hote.dataset.mode;
      },
    };
  }

  Object.assign(L, { monter, imprimer, feuilleImpression });
})(typeof window !== 'undefined' ? window : globalThis);
