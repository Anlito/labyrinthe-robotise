// Programmes volontairement faux (au moins trois par exercice) et le début du message attendu.
// Les messages sont ceux de Labo Blocs : ils décrivent ce que fait le programme, sans jamais dire « faux ».
const { att, servo, variable, affecter, joystick, direction, reetalonner, comparer, siSinon, prog, deuxAxes } = require('./outils.js');

const axeX = (min, max, de1, de2) => prog([], [affecter('VRX', joystick('x')), affecter('MoteurX', reetalonner(variable('VRX'), de1, de2, min, max)), servo('D5', variable('MoteurX'))]);

module.exports = {
  1: [
    { nom: 'mauvais angle', programme: prog([servo('D5', 180)]), message: 'devrait être à 90°' },
    { nom: 'mauvaise broche', programme: prog([servo('D6', 90)]), message: 'devrait être à 90°' },
    { nom: 'programme vide', programme: prog([], []), message: 'devrait être à 90°' },
  ],
  2: [
    { nom: 'oubli des « attendre »', programme: prog([], [servo('D5', 60), servo('D5', 120)]), message: 'Axe X (D5)' },
    { nom: 'attente de 2 s', programme: prog([], [servo('D5', 60), att(2), servo('D5', 120), att(2)]), message: 'Axe X (D5)' },
    { nom: 'angles 0° et 180°', programme: prog([], [servo('D5', 0), att(1), servo('D5', 180), att(1)]), message: 'Axe X (D5)' },
  ],
  3: [
    { nom: 'condition inversée', programme: prog([], [affecter('VRX', joystick('x')), siSinon(comparer('<', variable('VRX'), 700), [servo('D5', 120)], [servo('D5', 90)])]), message: 'Quand le joystick est au centre' },
    { nom: 'axe Y au lieu de X', programme: prog([], [affecter('VRX', joystick('y')), siSinon(comparer('>', variable('VRX'), 700), [servo('D5', 120)], [servo('D5', 90)])]), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'pas de « sinon »', programme: prog([], [affecter('VRX', joystick('x')), siSinon(comparer('>', variable('VRX'), 700), [servo('D5', 120)], [])]), message: 'Quand le joystick est' },
  ],
  4: [
    { nom: 'droite et gauche inversées', programme: prog([], [siSinon(direction('droite'), [servo('D5', 120)], [siSinon(direction('gauche'), [servo('D5', 60)], [servo('D5', 90)])])]), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'oubli du centre', programme: prog([], [siSinon(direction('droite'), [servo('D5', 60)], [servo('D5', 120)])]), message: 'Quand le joystick est au centre' },
    { nom: 'seulement la droite', programme: prog([], [siSinon(direction('droite'), [servo('D5', 60)], [servo('D5', 90)])]), message: 'Quand le joystick est poussé vers la gauche' },
  ],
  5: [
    { nom: 'joystick inversé', programme: axeX(0, 180, 0, 1023), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'angles 60° à 120° trop tôt', programme: axeX(60, 120, 1023, 0), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'servomoteur jamais réglé', programme: prog([], [affecter('VRX', joystick('x')), affecter('MoteurX', reetalonner(variable('VRX'), 1023, 0, 0, 180))]), message: 'Quand le joystick est au centre' },
  ],
  6: [
    { nom: 'axe Y oublié', programme: axeX(0, 180, 1023, 0), message: 'Quand le joystick est au centre' },
    { nom: 'axe X inversé', programme: deuxAxes(0, 180, { inverserX: true }), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'déjà limité à 60–120°', programme: deuxAxes(60, 120), message: 'Quand le joystick est poussé vers la droite' },
  ],
  7: [
    { nom: 'programme de départ (0° à 180°)', programme: deuxAxes(0, 180), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'limite 80–100° au lieu de 60–120°', programme: deuxAxes(80, 100), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'axe X inversé', programme: deuxAxes(60, 120, { inverserX: true }), message: 'Quand le joystick est poussé vers la droite' },
  ],
  8: [
    { nom: 'programme de départ (60° à 120°)', programme: deuxAxes(60, 120), message: 'Quand le joystick est poussé vers la droite' },
    { nom: 'mouvement doux sans le bouton', programme: deuxAxes(80, 100), message: 'Quand on appuie sur le bouton du joystick' },
    { nom: 'bouton sans mouvement doux', programme: deuxAxes(60, 120, { bouton: true }), message: 'Quand le joystick est poussé vers la droite' },
  ],
};
