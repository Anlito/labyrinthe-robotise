// Tests du module « Mon labyrinthe » : données, vérifications, chemin (tunnels, trous), dessin, simulation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

require('../site/js/labyrinthe/modele.js');
require('../site/js/labyrinthe/dessin.js');
const L = require('../site/js/labyrinthe/physique.js');

const cas = (c, l) => ({ c, l });
const point = (r, cle) => r.points.find((p) => p.cle === cle);

// Mur vertical complet sur la ligne x = c (toute la hauteur) : coupe le plateau en deux.
const murVerticalComplet = (c) => Array.from({ length: 8 }, (_, l) => `v-${c}-${l}`);

// Simule `duree` secondes à l'inclinaison donnée ; renvoie les évènements.
function simuler(sim, duree, inclinaison) {
  const ev = [];
  for (let t = 0; t < duree; t += 1 / 60) ev.push(...L.Simulation.avancer(sim, 1 / 60, inclinaison));
  return ev;
}

test('un plateau vide est complet et sérialisable', () => {
  const d = L.vide();
  assert.equal(d.version, 1);
  assert.equal(d.epaisseurMur, 2);
  assert.equal(d.inclinaisonMax, 30);
  assert.deepEqual(d.murs, []);
  assert.equal(d.depart, null);
  assert.deepEqual(JSON.parse(JSON.stringify(d)), d);
  assert.deepEqual(L.normaliser(d), d);
});

test('sérialisation : un plan passe par JSON sans rien perdre', () => {
  const d = L.normaliser({
    murs: ['v-3-2', 'h-1-4', 'v-3-2'],
    trous: [cas(5, 5)],
    tunnels: [cas(2, 1), cas(1, 1), cas(3, 1)],
    depart: cas(0, 0),
    arrivee: cas(7, 7),
    epaisseurMur: 3,
  });
  const relu = L.normaliser(JSON.parse(JSON.stringify(d)));
  assert.deepEqual(relu, d);
  assert.deepEqual(d.murs, ['h-1-4', 'v-3-2'], 'doublon retiré, ordre stable');
  assert.deepEqual(d.tunnels, [cas(1, 1), cas(2, 1), cas(3, 1)], 'cases couvertes triées');
  assert.equal(L.empreinte(relu), L.empreinte(d));
});

test('normalisation : valeurs hors limites, murs du cadre et cases en double écartés', () => {
  const d = L.normaliser({
    murs: ['v-0-2', 'h-3-0', 'h-3-8', 'v-8-1', 'x-1-1', 'h-9-1', 'h-2-3'],
    trous: [cas(0, 0), cas(9, 9), cas(2, 2), cas(2, 2)],
    tunnels: [cas(4, 4), cas(4, 4), cas(2, 2), cas(0, 0), cas(12, 1), { entree: cas(1, 6), sortie: cas(6, 1) }],
    depart: cas(0, 0),
    arrivee: cas(0, 0),
    epaisseurMur: 40,
    inclinaisonMax: -5,
    meilleursTemps: [{ temps: 'rien' }, { temps: 12.34, chutes: 2 }],
  });
  assert.deepEqual(d.murs, ['h-2-3']);
  assert.deepEqual(d.trous, [cas(2, 2)], 'le trou sur le départ et le doublon sont écartés');
  assert.equal(d.arrivee, null, 'l’arrivée ne peut pas être sur le départ');
  // Toits : doublon, case du trou, case du départ et case hors plateau écartés ; l'ancien format est relu.
  assert.deepEqual(d.tunnels, [cas(6, 1), cas(4, 4), cas(1, 6)]);
  assert.equal(d.epaisseurMur, L.EPAISSEUR.max);
  assert.equal(d.inclinaisonMax, L.INCLINAISON.min);
  assert.deepEqual(d.meilleursTemps, [{ temps: 12.3, chutes: 2, date: '', empreinte: '' }]);
  assert.deepEqual(L.normaliser(null), L.vide());
  assert.deepEqual(L.normaliser('n’importe quoi'), L.vide());
});

test('vérifier : départ et arrivée manquants, sans donner de solution', () => {
  const r = L.verifier(L.vide());
  assert.equal(r.reussi, false);
  assert.equal(point(r, 'depart').etat, 'ecart');
  assert.equal(point(r, 'arrivee').etat, 'ecart');
  assert.equal(point(r, 'chemin').etat, 'attente');
  assert.equal(point(r, 'largeur').etat, 'ok');
  assert.equal(point(r, 'duree').etat, 'attente');
  for (const p of r.points) assert.doesNotMatch(p.texte, /faux|erreur/i);
});

test('chemin : plateau ouvert, puis fermé par un mur complet', () => {
  const d = { depart: cas(0, 0), arrivee: cas(7, 7) };
  assert.equal(L.cheminPossible(d), true);
  assert.equal(L.longueurChemin(d), 15);
  const ferme = { ...d, murs: murVerticalComplet(4) };
  assert.equal(L.cheminPossible(ferme), false);
  const r = L.verifier(ferme);
  assert.equal(point(r, 'chemin').etat, 'ecart');
  assert.match(point(r, 'chemin').texte, /Aucun chemin/);
  // Une ouverture d'une case suffit
  const ouvert = { ...d, murs: murVerticalComplet(4).filter((m) => m !== 'v-4-6') };
  assert.equal(L.cheminPossible(ouvert), true);
});

test('chemin : un tunnel est un couloir couvert, pas un raccourci', () => {
  const d = {
    depart: cas(0, 0),
    arrivee: cas(7, 7),
    murs: murVerticalComplet(4),
    tunnels: [cas(3, 3), cas(4, 3), cas(5, 3)],
  };
  // Le toit ne traverse pas le mur : le passage reste fermé
  assert.equal(L.cheminPossible(d), false);
  // Une ouverture sous le toit : la bille passe dessous
  const ouvert = { ...d, murs: murVerticalComplet(4).filter((m) => m !== 'v-4-3') };
  assert.equal(L.cheminPossible(ouvert), true);
  // Même longueur de chemin avec ou sans toit
  assert.equal(L.longueurChemin(ouvert), L.longueurChemin({ ...ouvert, tunnels: [] }));
  // Plusieurs cases couvertes voisines forment un seul tunnel, même avec un virage
  assert.equal(L.groupesTunnels({ tunnels: [cas(1, 1), cas(2, 1), cas(2, 2), cas(6, 6)] }).length, 2);
  // Un mur entre deux cases couvertes les sépare en deux tunnels
  assert.equal(L.groupesTunnels({ tunnels: [cas(1, 1), cas(2, 1)], murs: ['v-2-1'] }).length, 2);
});

test('chemin : les trous ferment le passage, même sous un toit', () => {
  // Couloir sur la ligne 0 : des murs la séparent de la ligne 1.
  const murs = [];
  for (let c = 0; c < 8; c++) murs.push(`h-${c}-1`);
  const d = { depart: cas(0, 0), arrivee: cas(7, 0), murs };
  assert.equal(L.cheminPossible(d), true);
  assert.equal(L.cheminPossible({ ...d, trous: [cas(4, 0)] }), false);
  // Un toit autour du trou ne le saute pas
  assert.equal(L.cheminPossible({ ...d, trous: [cas(4, 0)], tunnels: [cas(3, 0), cas(5, 0)] }), false);
  // Un trou et un toit ne peuvent pas être sur la même case : le trou reste
  assert.deepEqual(L.normaliser({ trous: [cas(4, 0)], tunnels: [cas(4, 0)] }).tunnels, []);
});

test('largeur du chemin selon l’épaisseur des murs', () => {
  assert.equal(L.largeurChemin(2), 17);
  assert.equal(L.largeurChemin(4), 14);
  assert.equal(point(L.verifier({ epaisseurMur: 4 }), 'largeur').etat, 'ok');
  const r = point(L.verifier({ epaisseurMur: 5 }), 'largeur');
  assert.equal(r.etat, 'ecart');
  assert.match(r.texte, /12,5 mm/);
});

test('durée : seuls les temps du plan actuel comptent', () => {
  let d = L.normaliser({ depart: cas(0, 0), arrivee: cas(7, 7) });
  d = L.ajouterTemps(d, 8.04, 1, '2026-10-19');
  assert.equal(point(L.verifier(d), 'duree').etat, 'ecart');
  d = L.ajouterTemps(d, 11.26, 0, '2026-10-19');
  d = L.ajouterTemps(d, 15, 2, '2026-10-19');
  assert.deepEqual(L.tempsDuPlan(d).map((t) => t.temps), [8, 11.3, 15]);
  // Le meilleur temps (le plus court) est sous 10 s : écart
  assert.equal(point(L.verifier(d), 'duree').etat, 'ecart');
  // Le plan change : les anciens temps ne comptent plus
  const modifie = { ...d, murs: ['h-3-3'] };
  assert.equal(L.tempsDuPlan(modifie).length, 0);
  assert.equal(point(L.verifier(modifie), 'duree').etat, 'attente');
  const bon = L.ajouterTemps(modifie, 12, 0, '');
  assert.equal(point(L.verifier(bon), 'duree').etat, 'ok');
  assert.equal(bon.meilleursTemps.length, 1, 'les temps de l’ancien plan sont retirés');
  assert.equal(L.verifier(bon).reussi, true);
});

test('aperçu : SVG autonome avec D, A, trous, tunnels et murs', () => {
  const s = L.apercu({
    depart: cas(0, 0),
    arrivee: cas(7, 7),
    murs: ['h-1-1', 'v-2-2'],
    trous: [cas(3, 3)],
    tunnels: [cas(1, 5), cas(2, 5), cas(2, 6)],
  }, { largeur: '160mm', impression: true });
  assert.match(s, /^<svg [^>]*viewBox="0 0 160 160"[^>]*width="160mm"/);
  assert.match(s, />D</);
  assert.match(s, />A</);
  assert.equal((s.match(/>toit</g) || []).length, 1, 'un seul tunnel de trois cases');
  assert.equal((s.match(/class="lab-toits"/g) || []).length, 1);
  assert.doesNotMatch(L.apercu({ tunnels: [cas(1, 1)] }, { sansToits: true }), /lab-toits/);
  assert.equal((s.match(/class="lab-trou"/g) || []).length, 1);
  // 4 côtés du cadre + 2 murs + 3 cases couvertes + l'étiquette « toit » + la ligne de découpe
  assert.equal((s.match(/<rect x/g) || []).length, 4 + 2 + 3 + 1 + 1);
});

test('simulation : la bille roule dans le sens de la pente et s’arrête contre le cadre', () => {
  const sim = L.Simulation.creer({ depart: cas(3, 3), arrivee: cas(7, 0) });
  const ev = simuler(sim, 2, { x: 10, y: 0 });
  assert.ok(ev.includes('demarrage'));
  assert.ok(Math.abs(sim.bille.y - 70) < 0.5, 'pas de déviation');
  // Cadre intérieur de 2 mm : la bille (rayon 6) s'arrête à 160 − 2 − 6 = 152 mm
  assert.ok(Math.abs(sim.bille.x - 152) < 0.5, 'x = ' + sim.bille.x);
  assert.ok(L.Simulation.tempsEcoule(sim) > 1.5);
});

test('simulation : sous 2° la bille ne démarre pas', () => {
  const sim = L.Simulation.creer({ depart: cas(3, 3) });
  const ev = simuler(sim, 2, { x: 1.5, y: 0 });
  assert.equal(ev.length, 0);
  assert.equal(L.Simulation.tempsEcoule(sim), 0);
});

test('simulation : un mur arrête la bille, même lancée vite', () => {
  const sim = L.Simulation.creer({ depart: cas(0, 3), murs: ['v-2-3'], epaisseurMur: 2 });
  simuler(sim, 2, { x: 45, y: 0 });
  // Mur centré sur x = 40, épaisseur 2 : la bille s'arrête à 40 − 1 − 6 = 33 mm
  assert.ok(Math.abs(sim.bille.x - 33) < 0.5, 'x = ' + sim.bille.x);
});

test('simulation : chute dans un trou, retour au départ, puis arrivée chronométrée', () => {
  const sim = L.Simulation.creer({ depart: cas(0, 0), arrivee: cas(7, 0), trous: [cas(3, 0)] });
  let ev = [];
  while (!ev.includes('chute') && sim.t < 3) ev = L.Simulation.avancer(sim, 1 / 60, { x: 8, y: 0 });
  assert.equal(sim.chutes, 1);
  assert.equal(sim.etat, 'chute');
  simuler(sim, 0.75, { x: 0, y: 0 });
  assert.equal(sim.etat, 'roule');
  assert.deepEqual([sim.bille.x, sim.bille.y], [10, 10], 'retour au départ');
  assert.ok(L.Simulation.tempsEcoule(sim) > 0.75, 'le chronomètre continue');
  // Tunnel : la bille roule sous le toit sans changer de trajectoire, cachée pendant ce temps
  const sim2 = L.Simulation.creer({ depart: cas(0, 0), arrivee: cas(7, 0), tunnels: [cas(3, 0), cas(4, 0)] });
  let cachee = false;
  let ev2 = [];
  for (let t = 0; t < 3 && !ev2.includes('arrivee'); t += 1 / 60) {
    ev2 = L.Simulation.avancer(sim2, 1 / 60, { x: 8, y: 0 });
    if (L.Simulation.sousToit(sim2)) {
      cachee = true;
      assert.ok(Math.abs(sim2.bille.y - 10) < 0.01, 'même trajectoire sous le toit');
    }
  }
  assert.ok(cachee, 'la bille est passée sous le toit');
  assert.equal(sim2.etat, 'arrivee');
  assert.equal(L.Simulation.sousToit(sim2), false);
  const sim3 = L.Simulation.creer({ depart: cas(0, 0), arrivee: cas(7, 0) });
  const ev3 = simuler(sim3, 3, { x: 8, y: 0 });
  assert.ok(ev3.includes('arrivee'));
  assert.equal(sim3.etat, 'arrivee');
  assert.ok(sim3.tempsFinal > 0 && sim3.tempsFinal < 3);
});

test('les fichiers du module sont des scripts classiques (pas de modules, pas de ressource en ligne)', () => {
  const dossier = path.join(__dirname, '..', 'site', 'js', 'labyrinthe');
  for (const f of fs.readdirSync(dossier)) {
    const texte = fs.readFileSync(path.join(dossier, f), 'utf8');
    assert.doesNotMatch(texte, /^\s*(import|export)\s/m, f);
    assert.doesNotMatch(texte, /https?:\/\/(?!www\.w3\.org)/, f);
    assert.doesNotThrow(() => new vm.Script(texte, { filename: f }), f);
  }
});
