// Les données du projet restent complètes et cohérentes : le parcours venu de Labo Blocs (exercices, fiches,
// lexique) et les fichiers modifiables par le professeur (site/donnees/).
const test = require('node:test');
const assert = require('node:assert/strict');
const LB = require('../site/vendor/labo-blocs/labo-blocs-noyau.js');
const { catalogue, projet, carnet, chargerDonnees } = require('../site/js/moteur/catalogue.js');
const K = require('../site/js/moteur/carnet.js');
const { chargerExercices } = require('./outils.js');

const exercices = chargerExercices();
const { fiches, lexique } = catalogue.paquet();

test('identité du projet : un seul fichier, lu partout', () => {
  assert.equal(projet.id, 'labyrinthe-robotise');
  assert.equal(projet.parcours, catalogue.paquet().id);
  assert.equal(projet.dossier, 'LABYRINTHE ROBOTISE');
});

test('le parcours de Labo Blocs est complet : 8 exercices, identifiants stables, aucun problème', () => {
  const paquet = catalogue.paquet();
  assert.deepEqual(LB.controler(paquet.brut), []);
  assert.equal(paquet.id, 'labyrinthe');
  assert.deepEqual(exercices.map((e) => e.idParcours), ['lab-01', 'lab-02', 'lab-03', 'lab-04', 'lab-05', 'lab-06', 'lab-07', 'lab-08']);
  // Plus de mBlock : la carte reçoit le programme « Dans la carte » (pas de mode « En direct »).
  assert.deepEqual(paquet.modes, ['simulateur', 'carte']);
});

test('chaque exercice a deux indices écrits et une fiche « À savoir »', () => {
  for (const ex of exercices) {
    assert.equal((ex.indices || []).length, 2, `exercice ${ex.id} : indices 1 et 2`);
    for (const t of ex.indices) assert.ok(t.length > 10, `exercice ${ex.id} : indice trop court`);
    const f = fiches[ex.aSavoir];
    assert.ok(f, `exercice ${ex.id} : fiche ${ex.aSavoir} absente`);
    assert.ok(f.lignes.length >= 3 && f.lignes.length <= 6, `fiche ${ex.aSavoir} : 3 à 6 lignes`);
  }
});

test('le lexique contient les mots du projet, en deux phrases au plus', () => {
  const mots = lexique.map((e) => e.mot.toLowerCase());
  for (const m of ['broche', 'analogique', 'servomoteur', 'joystick', 'variable', 'ré-étalonner', 'butée']) {
    assert.ok(mots.some((x) => x.includes(m)), `mot absent : ${m}`);
  }
  for (const e of lexique) {
    const phrases = e.definition.split(/[.!?](\s|$)/).filter((p) => p && p.trim().length > 1);
    assert.ok(phrases.length <= 2, `« ${e.mot} » : ${phrases.length} phrases`);
  }
});

test('carnet : chaque onglet renvoie à des parties qui existent, chaque partie est dans un onglet', () => {
  const ids = carnet.parties.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'identifiants en double');
  const dansOnglets = carnet.onglets.flatMap((o) => o.parties);
  for (const id of dansOnglets) assert.ok(ids.includes(id), `partie inconnue : ${id}`);
  for (const id of ids) assert.ok(dansOnglets.includes(id), `partie dans aucun onglet : ${id}`);
  const types = ['info', 'classement', 'trous', 'questions', 'tableau', 'cases', 'choix', 'echelle', 'labyrinthe', 'programmation'];
  for (const p of carnet.parties) assert.ok(types.includes(p.type), `${p.id} : type ${p.type}`);
});

test('carnet : chaque case à compléter a sa réponse dans la liste des choix', () => {
  for (const p of carnet.parties.filter((x) => x.type === 'trous')) {
    const trous = K.trousDe(p);
    assert.ok(trous.length, `${p.id} : aucune case`);
    for (const t of trous) assert.ok(p.choix.includes(t.reponse), `${p.id} : « ${t.reponse} » absent des choix`);
  }
  for (const p of carnet.parties.filter((x) => x.type === 'classement')) {
    const cles = p.colonnes.map((c) => c.cle);
    for (const e of p.elements) assert.ok(cles.includes(e.place), `${p.id} : ${e.nom}`);
  }
});

test('carnet : branchements de 5e = câblage du parcours (mêmes broches que les programmes)', () => {
  const p = carnet.parties.find((x) => x.id === 'branchements-5');
  const reponses = Object.fromEntries(p.lignes.map((l) => [l.split('→')[0].trim(), K.trousDe({ lignes: [l] })[0].reponse]));
  const ex = exercices.find((e) => e.id === '8');
  const j = ex.composants.find((c) => c.type === 'joystick');
  assert.equal(reponses['Joystick · VRX (axe gauche – droite)'], j.broche);
  assert.equal(reponses['Joystick · VRY (axe haut – bas)'], j.y);
  assert.equal(reponses['Joystick · SW (bouton)'], j.bouton);
  const servos = ex.composants.filter((c) => c.type === 'servo');
  assert.equal(reponses['Servomoteur de l’axe X · fil de signal (orange)'], servos.find((s) => s.nom === 'Axe X').broche);
  assert.equal(reponses['Servomoteur de l’axe Y · fil de signal (orange)'], servos.find((s) => s.nom === 'Axe Y').broche);
});

test('carnet : une partie de 5e et des parties de 4e ; chaque niveau a un onglet Câblage', () => {
  const c5 = K.ongletsCarnet(carnet, '5').find((o) => o.cle === 'cablage');
  const c4 = K.ongletsCarnet(carnet, '4').find((o) => o.cle === 'cablage');
  assert.deepEqual(c5.parties.map((p) => p.id), ['branchements-5']);
  assert.ok(c4.parties.length >= 3 && c4.parties.every((p) => p.niveaux.includes('4')));
});

test('barème : coefficients des exercices obligatoires, parties notées du carnet qui existent et sont corrigées', () => {
  const b = chargerDonnees('notation', 'definirBareme');
  for (const id of ['1', '2', '3', '4', '5', '6', '7']) assert.ok(b.coefficients[id] > 0, `exercice ${id}`);
  for (const id of Object.keys(b.carnet)) {
    const p = carnet.parties.find((x) => x.id === id);
    assert.ok(p, `partie inconnue : ${id}`);
    assert.ok(K.TYPES_CORRIGES.includes(p.type), `${id} n'a pas de « Vérifier »`);
  }
});
