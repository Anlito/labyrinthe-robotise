// Labyrinthe robotisé — dessin du plateau en SVG (texte), vu de dessus. 1 unité = 1 mm.
// Pur : sert à l'écran (concepteur, simulateur), à l'impression à l'échelle 1 et à l'aperçu de l'outil professeur.

(function (racine) {
  'use strict';

  const L = (racine.Labyrinthe = racine.Labyrinthe || {});
  if (!L.normaliser && typeof require === 'function') Object.assign(L, require('./modele.js'));

  const RAYON_TROU = 8; // trou Ø 16 mm
  const RAYON_REPERE = 8; // disque du départ et de l'arrivée

  const n = (x) => String(Math.round(x * 100) / 100);
  const centre = (p) => ({ x: (p.c + 0.5) * L.CASE_MM, y: (p.l + 0.5) * L.CASE_MM });

  // Rectangles des murs en mm : { x, y, l, h }. Le cadre est à l'intérieur du plateau ; un mur intérieur est
  // centré sur son bord de case et dépasse de e/2 à chaque bout pour bien fermer les angles.
  function rectanglesMurs(donnees) {
    const d = L.normaliser(donnees);
    const e = d.epaisseurMur;
    const C = L.COTE_MM;
    const r = [
      { x: 0, y: 0, l: C, h: e, cadre: true },
      { x: 0, y: C - e, l: C, h: e, cadre: true },
      { x: 0, y: 0, l: e, h: C, cadre: true },
      { x: C - e, y: 0, l: e, h: C, cadre: true },
    ];
    for (const t of d.murs) {
      const m = L.lireMur(t);
      if (m.sens === 'h') r.push({ x: m.c * L.CASE_MM - e / 2, y: m.l * L.CASE_MM - e / 2, l: L.CASE_MM + e, h: e, cle: t });
      else r.push({ x: m.c * L.CASE_MM - e / 2, y: m.l * L.CASE_MM - e / 2, l: e, h: L.CASE_MM + e, cle: t });
    }
    return r;
  }

  // Contenu du SVG (sans la balise <svg>). options.impression : noir sur blanc, repères de perçage ;
  // options.sansToits : les toits des tunnels sont dessinés à part (au-dessus de la bille, dans le simulateur).
  function contenu(donnees, options) {
    const d = L.normaliser(donnees);
    const imp = !!(options && options.impression);
    const C = L.COTE_MM;
    const morceaux = [];

    morceaux.push(`<rect class="lab-fond" x="0" y="0" width="${C}" height="${C}" fill="${imp ? '#FFFFFF' : '#F6E7C8'}"/>`);

    // Grille de 2 cm
    const lignes = [];
    for (let i = 1; i < L.CASES; i++) {
      const v = i * L.CASE_MM;
      lignes.push(`M${v} 0V${C}M0 ${v}H${C}`);
    }
    morceaux.push(`<path class="lab-grille" d="${lignes.join('')}" fill="none" stroke="${imp ? '#9AA5AB' : '#D9C59E'}" stroke-width="${imp ? 0.25 : 0.4}" stroke-dasharray="${imp ? '1 1' : '2 2'}"/>`);

    // Trous
    for (const t of d.trous) {
      const p = centre(t);
      if (imp) {
        morceaux.push(`<g class="lab-trou"><circle cx="${n(p.x)}" cy="${n(p.y)}" r="${RAYON_TROU}" fill="#FFFFFF" stroke="#000" stroke-width="0.4"/>` +
          `<path d="M${n(p.x - 3)} ${n(p.y)}H${n(p.x + 3)}M${n(p.x)} ${n(p.y - 3)}V${n(p.y + 3)}" stroke="#000" stroke-width="0.3"/>` +
          `<text x="${n(p.x)}" y="${n(p.y + 6)}" font-size="2.6" text-anchor="middle" font-family="Segoe UI, sans-serif">trou Ø16</text></g>`);
      } else {
        morceaux.push(`<g class="lab-trou"><circle cx="${n(p.x)}" cy="${n(p.y)}" r="${RAYON_TROU}" fill="#2A2420" stroke="#6B5B4B" stroke-width="0.8"/>` +
          `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${RAYON_TROU - 3}" fill="#0F0C0A"/></g>`);
      }
    }

    // Départ et arrivée : lettre dans un disque (jamais la couleur seule)
    const repere = (p, lettre, couleur, classe) => {
      const q = centre(p);
      morceaux.push(`<g class="${classe}"><circle cx="${n(q.x)}" cy="${n(q.y)}" r="${RAYON_REPERE}" fill="${imp ? '#FFFFFF' : couleur}" stroke="${imp ? '#000' : '#1F2A30'}" stroke-width="${imp ? 0.6 : 0.8}"/>` +
        `<text x="${n(q.x)}" y="${n(q.y + 3.6)}" font-size="10" font-weight="800" text-anchor="middle" fill="${imp ? '#000' : '#1F2A30'}" font-family="Segoe UI, sans-serif">${lettre}</text></g>`);
    };
    if (d.depart) repere(d.depart, 'D', '#FAB22B', 'lab-depart');
    if (d.arrivee) repere(d.arrivee, 'A', '#9ED29B', 'lab-arrivee');

    // Murs (le cadre compris)
    const murs = rectanglesMurs(d)
      .map((m) => `<rect x="${n(m.x)}" y="${n(m.y)}" width="${n(m.l)}" height="${n(m.h)}"/>`)
      .join('');
    morceaux.push(`<g class="lab-murs" fill="${imp ? '#000000' : '#6B4423'}">${murs}</g>`);

    // Toits des tunnels : posés sur les murs, donc dessinés par-dessus.
    if (!(options && options.sansToits)) morceaux.push(toits(d, imp ? 'impression' : 'transparent'));

    // Bord du plateau (ligne de découpe à l'impression)
    morceaux.push(`<rect x="0.1" y="0.1" width="${C - 0.2}" height="${C - 0.2}" fill="none" stroke="${imp ? '#000' : '#4A2F17'}" stroke-width="0.2"/>`);
    return morceaux.join('');
  }

  // Toits des tunnels (cases couvertes), hachurés, avec leur contour.
  // style : 'transparent' (concepteur : on voit les murs dessous), 'opaque' (simulateur : la bille disparaît
  // dessous), 'impression' (noir sur blanc, mention « toit »).
  function toits(donnees, style) {
    const d = L.normaliser(donnees);
    if (!d.tunnels.length) return '';
    const C = L.CASE_MM;
    const couvert = new Set(d.tunnels.map((p) => p.c + ',' + p.l));
    const st = {
      transparent: { fond: '#4D6B79', opacite: 0.3, hachure: '#2F4A56', contour: '#1F3540' },
      opaque: { fond: '#9BB0BB', opacite: 1, hachure: '#6F8794', contour: '#2F4A56' },
      impression: { fond: 'none', opacite: 1, hachure: '#000', contour: '#000' },
    }[style || 'transparent'];
    const fonds = [];
    let hachures = '';
    let contours = '';
    for (const p of d.tunnels) {
      const x = p.c * C;
      const y = p.l * C;
      fonds.push(`<rect x="${x}" y="${y}" width="${C}" height="${C}"/>`);
      for (let s = 4; s < 2 * C; s += 4) {
        const a = Math.max(0, s - C);
        const b = Math.min(s, C);
        hachures += `M${x + a} ${y + b}L${x + b} ${y + a}`;
      }
      // Contour du toit : les côtés qui ne touchent pas une autre case couverte.
      if (!couvert.has(p.c + ',' + (p.l - 1))) contours += `M${x} ${y}H${x + C}`;
      if (!couvert.has(p.c + ',' + (p.l + 1))) contours += `M${x} ${y + C}H${x + C}`;
      if (!couvert.has(p.c - 1 + ',' + p.l)) contours += `M${x} ${y}V${y + C}`;
      if (!couvert.has(p.c + 1 + ',' + p.l)) contours += `M${x + C} ${y}V${y + C}`;
    }
    let texte = '';
    if (style === 'impression') {
      for (const g of L.groupesTunnels(d)) {
        const q = centre(g[0]);
        texte += `<rect x="${n(q.x - 5)}" y="${n(q.y - 3)}" width="10" height="5" fill="#FFFFFF"/>` +
          `<text x="${n(q.x)}" y="${n(q.y + 1.2)}" font-size="3.6" font-weight="700" text-anchor="middle" font-family="Segoe UI, sans-serif">toit</text>`;
      }
    }
    return `<g class="lab-toits">` +
      `<g fill="${st.fond}" fill-opacity="${st.opacite}">${fonds.join('')}</g>` +
      `<path d="${hachures}" stroke="${st.hachure}" stroke-width="${style === 'impression' ? 0.25 : 0.5}" stroke-opacity="${style === 'transparent' ? 0.6 : 1}" fill="none"/>` +
      `<path d="${contours}" stroke="${st.contour}" stroke-width="${style === 'impression' ? 0.5 : 0.9}" stroke-dasharray="${style === 'impression' ? '2 1' : 'none'}" fill="none"/>` +
      texte + '</g>';
  }

  // Aperçu complet (pour l'outil professeur) : <svg> autonome, carré, à la taille demandée.
  // options.largeur : taille CSS (par défaut 100 %), options.impression, options.titre (texte d'accessibilité).
  function apercu(donnees, options) {
    const o = options || {};
    const largeur = o.largeur || '100%';
    const titre = String(o.titre || 'Plan du labyrinthe').replace(/[<&>"]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;', '"': '&quot;' })[c]);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.COTE_MM} ${L.COTE_MM}" width="${largeur}" height="${largeur}" role="img" aria-label="${titre}">` +
      contenu(donnees, o) + '</svg>';
  }

  Object.assign(L, { RAYON_TROU, RAYON_REPERE, centre, rectanglesMurs, contenu, toits, apercu });
  if (typeof module === 'object' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
