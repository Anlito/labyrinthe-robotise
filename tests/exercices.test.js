const test = require('node:test');
const assert = require('node:assert/strict');
// Le moteur est celui de Labo Blocs (module copié dans site/vendor/labo-blocs) : ces tests vérifient que les exercices
// du labyrinthe (parcours site/parcours/labyrinthe.js) se corrigent comme prévu. Le simulateur lui-même est testé dans
// le dépôt labo-blocs.
const { creerSimulation, positionServo, valider, depuisBlockly, versBlockly } = require(require('../tools/dependances-tests.js').noyau);
const { chargerExercices, att, servo, prog, deuxAxes } = require('./outils.js');
const faux = require('./programmes-faux.js');

const exercices = chargerExercices();
const parId = Object.fromEntries(exercices.map((e) => [e.id, e]));

test('les 8 exercices sont chargés dans l’ordre ; le 8 est le défi', () => {
  assert.deepEqual(exercices.map((e) => e.id), ['1', '2', '3', '4', '5', '6', '7', '8']);
  assert.deepEqual(exercices.filter((e) => e.defi).map((e) => e.id), ['8']);
});

test('matériel du kit : servomoteurs D5 (axe X) et D6 (axe Y), joystick A0 / A1, bouton SW sur D4', () => {
  const ex8 = parId['8'];
  assert.deepEqual(ex8.composants.find((c) => c.type === 'joystick'), { type: 'joystick', broche: 'A0', y: 'A1', bouton: 'D4' });
  assert.deepEqual(ex8.composants.filter((c) => c.type === 'servo').map((c) => c.broche), ['D5', 'D6']);
});

for (const ex of exercices) {
  test(`exercice ${ex.id} : la solution de référence réussit en moins de 2 s`, () => {
    const debut = performance.now();
    const r = valider(ex, ex.solutionReference);
    const duree = performance.now() - debut;
    assert.equal(r.reussi, true, r.message);
    assert.ok(duree < 2000, `validation trop lente : ${Math.round(duree)} ms`);
  });

  test(`exercice ${ex.id} : la solution passe par Blockly sans changer de comportement`, () => {
    const { programme, horsProgramme, incomplets } = depuisBlockly(versBlockly(ex.solutionReference));
    assert.deepEqual(horsProgramme, []);
    assert.deepEqual(incomplets, []);
    assert.equal(valider(ex, programme).reussi, true);
  });

  if (ex.blocsDepart) {
    test(`exercice ${ex.id} : le programme de départ ne réussit pas tout seul`, () => {
      assert.equal(valider(ex, ex.blocsDepart).reussi, false);
    });
  }

  const liste = faux[ex.id] || [];
  test(`exercice ${ex.id} : au moins trois programmes faux`, () => assert.ok(liste.length >= 3));
  for (const f of liste) {
    test(`exercice ${ex.id} : « ${f.nom} » échoue avec le bon message`, () => {
      const r = valider(ex, f.programme);
      assert.equal(r.reussi, false, 'le programme faux devrait échouer');
      assert.ok(r.message.includes(f.message), `message reçu : « ${r.message} »`);
      assert.ok(!/faux|erreur/i.test(r.message), 'jamais « faux » ni « erreur »');
    });
  }
}

test('chaque exercice de 6 à 8 part du programme de l’exercice précédent', () => {
  assert.deepEqual(parId['6'].blocsDepart, parId['5'].solutionReference);
  assert.deepEqual(parId['7'].blocsDepart, parId['6'].solutionReference);
  assert.deepEqual(parId['8'].blocsDepart, parId['7'].solutionReference);
});

test('le défi réussi suffit aussi pour l’exercice final, pas l’inverse', () => {
  assert.equal(valider(parId['8'], parId['7'].solutionReference).reussi, false);
  assert.equal(valider(parId['7'], deuxAxes(60, 120, { bouton: true })).reussi, true);
});

test('exercice final : les servomoteurs restent entre 60° et 120° quel que soit le joystick', () => {
  const sim = creerSimulation(parId['7'].solutionReference, { composants: parId['7'].composants });
  for (const [x, y] of [[0, 0], [1023, 1023], [0, 1023], [1023, 0], [512, 512], [300, 800]]) {
    sim.changerAnalogique('A0', x);
    sim.changerAnalogique('A1', y);
    sim.avancerJusqua(sim.t + 100);
    for (const b of ['D5', 'D6']) assert.ok(sim.sorties[b] >= 60 && sim.sorties[b] <= 120, `${b} à ${sim.sorties[b]}° pour (${x}, ${y})`);
  }
});

test('angles du servo limités à 0–180 et mouvement en 0,3 s', () => {
  const sim = creerSimulation(prog([servo('D5', 250), att(1), servo('D5', -40)]), { composants: [{ type: 'servo', broche: 'D5' }] });
  sim.avancerJusqua(500);
  assert.equal(sim.sorties.D5, 180);
  assert.equal(positionServo(sim.journal, 'D5', 150), 90);
  sim.avancerJusqua(2000);
  assert.equal(sim.sorties.D5, 0);
});

test('une boucle sans « attendre » ne fige pas : 1 ms par tour au minimum', () => {
  const sim = creerSimulation(prog([], [servo('D5', 60), servo('D5', 120)]), { composants: [{ type: 'servo', broche: 'D5' }] });
  const debut = performance.now();
  sim.avancerJusqua(60000);
  assert.equal(sim.t, 60000);
  assert.ok(performance.now() - debut < 1000);
});
