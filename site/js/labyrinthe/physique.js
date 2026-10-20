// Labyrinthe robotisé — simulation de la bille vue de dessus (pure, testable sous Node). Unités : mm, s, degrés.
// La bille (Ø 12 mm) roule sous l'effet de la pente : a = 5/7 · g · sin(angle) (bille pleine qui roule sans glisser),
// avec une résistance au roulement. Elle rebondit sur les murs et tombe dans les trous (retour au départ).
// Sous le toit d'un tunnel, elle roule comme ailleurs : seul l'affichage la cache (voir sousToit).

(function (racine) {
  'use strict';

  const L = (racine.Labyrinthe = racine.Labyrinthe || {});
  if (!L.rectanglesMurs && typeof require === 'function') Object.assign(L, require('./dessin.js'));

  const G = 9810; // mm/s²
  const ROULEMENT = 250; // résistance au roulement (mm/s²) : sous ~2° la bille ne démarre pas
  const REBOND = 0.35; // part de la vitesse gardée en rebondissant sur un mur
  const PAS_MAX_MM = 1; // déplacement maximal par sous-pas (pour ne jamais traverser un mur)
  const DUREE_CHUTE = 0.7; // s
  const RAYON = 6; // bille Ø 12 mm
  const SEUIL_TROU = 7; // la bille tombe quand son centre est à moins de 7 mm du centre du trou
  const SEUIL_ARRIVEE = 6;
  const SEUIL_DEMARRAGE = 2; // le chronomètre part quand la bille a quitté le départ de 2 mm

  const rad = (a) => (a * Math.PI) / 180;
  const distance = (ax, ay, b) => Math.hypot(ax - b.x, ay - b.y);

  function creer(donnees) {
    const d = L.normaliser(donnees);
    const sim = {
      d,
      murs: L.rectanglesMurs(d),
      trous: d.trous.map(L.centre),
      toits: new Set(d.tunnels.map((p) => p.c + ',' + p.l)),
      arrivee: d.arrivee ? L.centre(d.arrivee) : null,
      depart: d.depart ? L.centre(d.depart) : null,
      bille: null,
      etat: 'pret', // pret → roule → (chute → roule) → arrivee
      t: 0,
      debut: null,
      tempsFinal: null,
      chutes: 0,
      chuteRestante: 0,
      chuteVers: null,
    };
    remettre(sim);
    return sim;
  }

  // Bille au départ, chronomètre et chutes à zéro.
  function remettre(sim) {
    sim.etat = sim.depart ? 'pret' : 'sans-depart';
    sim.t = 0;
    sim.debut = null;
    sim.tempsFinal = null;
    sim.chutes = 0;
    sim.chuteRestante = 0;
    replacer(sim);
  }

  function replacer(sim) {
    const p = sim.depart || { x: L.COTE_MM / 2, y: L.COTE_MM / 2 };
    sim.bille = { x: p.x, y: p.y, vx: 0, vy: 0, echelle: 1 };
  }

  function tempsEcoule(sim) {
    if (sim.tempsFinal != null) return sim.tempsFinal;
    return sim.debut == null ? 0 : sim.t - sim.debut;
  }

  // Repousse la bille hors d'un mur et amortit la vitesse vers le mur.
  function collisions(sim) {
    const b = sim.bille;
    for (const m of sim.murs) {
      const qx = Math.max(m.x, Math.min(b.x, m.x + m.l));
      const qy = Math.max(m.y, Math.min(b.y, m.y + m.h));
      let dx = b.x - qx;
      let dy = b.y - qy;
      const d2 = dx * dx + dy * dy;
      if (d2 >= RAYON * RAYON) continue;
      let nx;
      let ny;
      let enfonce;
      if (d2 > 1e-9) {
        const dist = Math.sqrt(d2);
        nx = dx / dist;
        ny = dy / dist;
        enfonce = RAYON - dist;
      } else {
        // Centre dans le mur : sortie par le côté le plus proche.
        const g = b.x - m.x;
        const dr = m.x + m.l - b.x;
        const h = b.y - m.y;
        const ba = m.y + m.h - b.y;
        const min = Math.min(g, dr, h, ba);
        nx = min === g ? -1 : min === dr ? 1 : 0;
        ny = min === h ? -1 : min === ba ? 1 : 0;
        if (nx && ny) ny = 0;
        enfonce = min + RAYON;
      }
      b.x += nx * enfonce;
      b.y += ny * enfonce;
      const vn = b.vx * nx + b.vy * ny;
      if (vn < 0) {
        b.vx -= (1 + REBOND) * vn * nx;
        b.vy -= (1 + REBOND) * vn * ny;
      }
    }
  }

  // Avance la simulation de dt secondes avec l'inclinaison { x, y } en degrés
  // (x > 0 : le côté droit descend ; y > 0 : le côté bas descend).
  // Renvoie la liste des évènements : 'demarrage', 'chute', 'arrivee'.
  function avancer(sim, dt, inclinaison) {
    const ev = [];
    if (sim.etat === 'sans-depart' || sim.etat === 'arrivee') return ev;
    dt = Math.min(Math.max(dt, 0), 1 / 20);
    sim.t += dt;
    const b = sim.bille;

    if (sim.etat === 'chute') {
      sim.chuteRestante -= dt;
      b.x += (sim.chuteVers.x - b.x) * Math.min(1, dt * 12);
      b.y += (sim.chuteVers.y - b.y) * Math.min(1, dt * 12);
      b.echelle = Math.max(0.2, sim.chuteRestante / DUREE_CHUTE);
      if (sim.chuteRestante <= 0) {
        replacer(sim);
        sim.etat = 'roule';
      }
      return ev;
    }

    const ix = (inclinaison && inclinaison.x) || 0;
    const iy = (inclinaison && inclinaison.y) || 0;
    const ax = (5 / 7) * G * Math.sin(rad(ix));
    const ay = (5 / 7) * G * Math.sin(rad(iy));

    const vitesse = Math.hypot(b.vx, b.vy);
    const sousPas = Math.min(60, Math.max(1, Math.ceil(((vitesse + Math.hypot(ax, ay) * dt) * dt) / PAS_MAX_MM)));
    const h = dt / sousPas;

    for (let i = 0; i < sousPas; i++) {
      b.vx += ax * h;
      b.vy += ay * h;
      // Résistance au roulement : freine sans jamais faire repartir en arrière.
      const v = Math.hypot(b.vx, b.vy);
      if (v > 0) {
        const nv = Math.max(0, v - ROULEMENT * h);
        b.vx *= nv / v;
        b.vy *= nv / v;
      }
      b.x += b.vx * h;
      b.y += b.vy * h;
      collisions(sim);

      if (sim.debut == null && sim.depart && distance(b.x, b.y, sim.depart) > SEUIL_DEMARRAGE) {
        sim.debut = sim.t - dt + h * (i + 1);
        sim.etat = 'roule';
        ev.push('demarrage');
      }

      const trou = sim.trous.find((p) => distance(b.x, b.y, p) < SEUIL_TROU);
      if (trou) {
        sim.chutes++;
        sim.etat = 'chute';
        sim.chuteRestante = DUREE_CHUTE;
        sim.chuteVers = trou;
        b.vx = 0;
        b.vy = 0;
        ev.push('chute');
        return ev;
      }

      if (sim.arrivee && distance(b.x, b.y, sim.arrivee) < SEUIL_ARRIVEE && sim.debut != null) {
        sim.etat = 'arrivee';
        sim.tempsFinal = Math.round((sim.t - sim.debut) * 10) / 10;
        b.vx = 0;
        b.vy = 0;
        ev.push('arrivee');
        return ev;
      }
    }
    return ev;
  }

  // La bille est-elle sous le toit d'un tunnel ? (son centre est sur une case couverte)
  function sousToit(sim) {
    const b = sim.bille;
    const c = Math.floor(b.x / L.CASE_MM);
    const l = Math.floor(b.y / L.CASE_MM);
    return sim.toits.has(c + ',' + l);
  }

  L.Simulation = { creer, remettre, avancer, tempsEcoule, sousToit, RAYON, G };
  if (typeof module === 'object' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
