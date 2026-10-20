// Code Arduino du niveau 3 (panneau « Code ») : traduction des blocs du labyrinthe en C++.
// (Le programme de l'élève part dans la carte en code octet : voir le module Labo Blocs, mode « Dans la carte ».)
const test = require('node:test');
const assert = require('node:assert/strict');
// Générateur C++ de Labo Blocs (le même que le panneau « Code » du niveau 3).
const LB = require('../site/vendor/labo-blocs/labo-blocs-noyau.js');
const { chargerExercices } = require('./outils.js');

const exercices = chargerExercices();
const code = (id) => {
  const ex = exercices.find((e) => e.id === id);
  return LB.versArduino(ex.solutionReference, { composants: ex.composants }).code;
};

test('exercice final traduit en Arduino : axes lus sur A0 et A1, ré-étalonnage, servomoteurs D5 et D6', () => {
  const c = code('7');
  assert.match(c, /#include <Servo\.h>/);
  assert.match(c, /VRX = analogRead\(A0\);/);
  assert.match(c, /VRY = analogRead\(A1\);/);
  assert.match(c, /float reetalonner\(float v, float a, float b, float c, float d\)/);
  assert.match(c, /MoteurX = reetalonner\(VRX, 1023, 0, 60, 120\);/);
  assert.match(c, /MoteurY = reetalonner\(VRY, 0, 1023, 120, 60\);/);
  assert.match(c, /servo5\.attach\(5\)/);
  assert.match(c, /servo6\.attach\(6\)/);
});

test('défi : bouton du joystick sur D4, avec la résistance interne (appuyé = LOW)', () => {
  const c = code('8');
  assert.match(c, /pinMode\(4, INPUT_PULLUP\)/);
  assert.match(c, /digitalRead\(4\) == LOW/);
  assert.match(c, /reetalonner\(VRX, 1023, 0, 80, 100\)/);
});
