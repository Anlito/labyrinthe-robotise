// Outils communs aux tests : chargement des exercices et petits constructeurs de programmes.
const { catalogue } = require('../site/js/moteur/catalogue.js');

// Exercices du parcours de Labo Blocs (site/parcours/labyrinthe.js), au format de l'atelier (id = numéro).
function chargerExercices() {
  return catalogue.exercices();
}

// Constructeurs d'instructions et d'expressions.
const att = (duree) => ({ bloc: 'attendre', duree });
const servo = (broche, angle) => ({ bloc: 'servo_angle', broche, angle });
const variable = (nom) => ({ bloc: 'variable', variable: nom });
const affecter = (nom, valeur) => ({ bloc: 'affecter', variable: nom, valeur });
const joystick = (axe) => ({ bloc: 'joystick_valeur', axe });
const direction = (d) => ({ bloc: 'joystick_direction', direction: d });
const boutonJoystick = { bloc: 'joystick_bouton' };
const reetalonner = (valeur, de1, de2, vers1, vers2) => ({ bloc: 'reetalonner', valeur, de1, de2, vers1, vers2 });
const comparer = (op, a, b) => ({ bloc: 'comparaison', op, a, b });
const si = (condition, alors) => ({ bloc: 'si_alors', condition, alors });
const siSinon = (condition, alors, sinon) => ({ bloc: 'si_sinon', condition, alors, sinon });
const prog = (demarrage, boucle) => ({ demarrage: demarrage || [], boucle: boucle || [] });

// Programme des deux axes du kit : X depuis (1023, 0), Y depuis (0, 1023) vers (max, min).
function deuxAxes(min, max, options) {
  const o = options || {};
  const servos = [servo('D5', variable('MoteurX')), servo('D6', variable('MoteurY'))];
  return prog([], [
    affecter('VRX', joystick('x')),
    affecter('VRY', joystick('y')),
    affecter('MoteurX', reetalonner(variable('VRX'), o.inverserX ? 0 : 1023, o.inverserX ? 1023 : 0, min, max)),
    affecter('MoteurY', reetalonner(variable('VRY'), 0, 1023, max, min)),
    ...(o.bouton ? [siSinon(boutonJoystick, [servo('D5', 90), servo('D6', 90)], servos)] : servos),
  ]);
}

module.exports = {
  chargerExercices,
  att,
  servo,
  variable,
  affecter,
  joystick,
  direction,
  boutonJoystick,
  reetalonner,
  comparer,
  si,
  siSinon,
  prog,
  deuxAxes,
};
