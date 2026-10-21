// Fabrique des sauvegardes d'équipes d'exemple, pour essayer l'outil professeur (prof.html) :
//   npm run exemples
// Les fichiers sont créés dans exemples/<dossier du projet>/<Équipe>/<Équipe>.json, comme sur le réseau.
// Les tentatives sont réalistes : de vrais programmes faux passés au validateur de Labo Blocs, puis la solution,
// notées comme le fait l'écran d'exercice. Des équipes de 5e et de 4e (carnets différents). Données fictives.

const fs = require('node:fs');
const path = require('node:path');
const LB = require(require('./dependances-tests.js').noyau);
const P = require('../site/js/moteur/progression.js');
const { catalogue, projet, carnet: contenu } = require('../site/js/moteur/catalogue.js');
const { chargerExercices } = require('../tests/outils.js');
const faux = require('../tests/programmes-faux.js');

const exercices = chargerExercices();
const RACINE = path.join(__dirname, '..', 'exemples', projet.dossier);

// Horloge fictive : chaque action avance le temps, pour des dates et des durées crédibles.
let horloge = new Date('2026-10-12T09:00:00');
const avancer = (minutes) => (horloge = new Date(horloge.getTime() + minutes * 60000));
const iso = () => {
  const d = horloge;
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
};

const duParcours = (ex) => catalogue.paquet().exercices.find((e) => e.id === ex.idParcours);

function verifier(d, ex, programme) {
  const r = LB.valider(duParcours(ex), programme);
  LB.noterVerification(d, duParcours(ex), { reussi: r.reussi, message: r.message, programme: LB.versV1(programme) });
  const e = d.exercices[ex.id];
  e.historique[e.historique.length - 1].date = iso();
  if (r.reussi && e.historique.filter((h) => h.type === 'verification' && h.reussi).length === 1) e.premiereReussite = iso();
}

// profil : jusqu'où l'équipe est allée, combien d'erreurs et d'indices par exercice.
function equipe(eleves, classe, profil) {
  const d = P.creerProgression({ eleves, classe });
  d.creeLe = iso();
  for (const ex of exercices) {
    if (!P.estDebloque(d, ex.id)) break;
    const p = profil(ex.id);
    if (!p) break;
    LB.noterOuverture(d, ex.idParcours);
    for (let n = 1; n <= p.indices; n++) {
      avancer(2);
      LB.noterIndice(d, ex.idParcours, n);
      const h = d.exercices[ex.id].historique;
      h[h.length - 1].date = iso();
    }
    const erreurs = faux[ex.id] || [];
    for (let i = 0; i < p.erreurs; i++) {
      avancer(3);
      verifier(d, ex, erreurs[i % erreurs.length].programme);
    }
    if (p.reussi) {
      avancer(2);
      verifier(d, ex, ex.solutionReference);
    }
    d.exercices[ex.id].tempsPasseSecondes = Math.round((p.minutes || 3 + p.erreurs * 3) * 60);
    d.exercices[ex.id].programme = null;
  }
  d.modifieLe = iso();
  return d;
}

const n = (id) => Number.parseInt(id, 10);
const equipes = [
  // Équipe rapide : tout réussi, défi compris.
  equipe(['Léa', 'Hugo'], '5A', (id) => ({ reussi: true, erreurs: ['3', '5', '7'].includes(id) ? 1 : 0, indices: 0 })),
  // Équipe régulière, en cours à l'exercice 6.
  equipe(['Inès', 'Tom', 'Sacha'], '5A', (id) => (n(id) <= 6 ? { reussi: id !== '6', erreurs: id === '5' ? 2 : id === '6' ? 1 : 0, indices: id === '5' ? 1 : 0 } : null)),
  // Équipe bloquée à l'exercice 5 (ré-étalonner) : beaucoup de tentatives et les trois indices.
  equipe(['Noah', 'Jade'], '5A', (id) => (n(id) <= 5 ? { reussi: id !== '5', erreurs: id === '5' ? 7 : 1, indices: id === '5' ? 3 : 0, minutes: id === '5' ? 26 : 4 } : null)),
  // Équipe seule, bloquée par le temps à l'exercice 3.
  equipe(['Maël'], '5A', (id) => (n(id) <= 3 ? { reussi: id !== '3', erreurs: id === '3' ? 2 : 0, indices: id === '3' ? 2 : 1, minutes: id === '3' ? 24 : 6 } : null)),
  // Classe de 4e : ils câblent eux-mêmes.
  equipe(['Chloé', 'Lucas'], '4B', (id) => (n(id) <= 7 ? { reussi: true, erreurs: id === '7' ? 3 : 0, indices: id === '7' ? 2 : 0 } : null)),
  equipe(['Emma', 'Yanis'], '4B', (id) => (n(id) <= 2 ? { reussi: id === '1', erreurs: id === '2' ? 1 : 0, indices: 0 } : null)),
];

// Carnets de projet plus ou moins remplis (0 : rien, 3 : presque tout, avec quelques essais ratés).
const Cn = require('../site/js/moteur/carnet.js');
const Lab = require('../site/js/labyrinthe/modele.js');
const partie = (id) => Cn.partieCarnet(contenu, id);
function remplirTrous(d, id, essaisRates) {
  const p = partie(id);
  const r = Cn.reponseCarnet(d.carnet, p);
  for (const t of Cn.trousDe(p)) r[t.cle] = t.reponse;
  const total = Cn.trousDe(p).length;
  for (let i = 0; i < essaisRates; i++) Cn.noterVerificationCarnet(d, id, { reussi: false, bien: total - 1, total });
  Cn.noterVerificationCarnet(d, id, { reussi: true, bien: total, total });
}
function remplirCarnet(d, niveau) {
  const K = d.carnet;
  const cinquieme = Cn.niveauDe(d.equipe.classe) === '5';
  if (niveau >= 1) {
    const p = partie('classement');
    for (const e of p.elements) Cn.reponseCarnet(K, p)[e.nom] = e.place;
    Cn.noterVerificationCarnet(d, 'classement', { reussi: false, bien: 5, total: 7 });
    Cn.noterVerificationCarnet(d, 'classement', { reussi: true, bien: 7, total: 7 });
    remplirTrous(d, 'phrase', 0);
  }
  if (niveau >= 2) {
    remplirTrous(d, 'chaines', 1);
    if (cinquieme) remplirTrous(d, 'branchements-5', 0);
    else {
      Cn.reponseCarnet(K, partie('etapes-4')).fill(true);
      Cn.reponseCarnet(K, partie('verification-4')).fill(true);
      Object.assign(Cn.reponseCarnet(K, partie('question-4')), ['Pour n’avoir qu’un seul fil vers la carte.', 'Un court-circuit : la carte peut chauffer.']);
      Cn.reponseCarnet(K, partie('comparaison-4'))[0].splice(0, 5, 'carton', '60', 'moyenne', 'en classe', 'facile');
    }
    Cn.reponseCarnet(K, partie('materiaux'))[0].splice(0, 4, 'carton', 'plateau et murs', '70', 'léger et facile à couper');
  }
  if (niveau >= 3) {
    remplirTrous(d, 'familles', 0);
    // Un petit labyrinthe : départ en haut à gauche, arrivée en bas à droite.
    K.reponses.labyrinthe = Object.assign(Lab.vide(), { depart: { c: 0, l: 0 }, arrivee: { c: 7, l: 7 }, murs: ['h-0-1', 'h-1-1', 'h-2-1', 'v-4-2', 'v-4-3', 'h-5-5', 'h-6-5'] });
    Object.assign(Cn.reponseCarnet(K, partie('reflexion')), ['Les couloirs sont étroits mais la bille passe.', 'Le virage avant l’arrivée.']);
    Cn.reponseCarnet(K, partie('amelioration')).choisis = ['Bouton du joystick (SW) : remettre le plateau à plat'];
    Cn.reponseCarnet(K, partie('amelioration')).texte = 'Pour recommencer vite quand la bille tombe.';
  }
}
[3, 2, 1, 1, 3, 0].forEach((niv, i) => {
  const date = equipes[i].modifieLe;
  remplirCarnet(equipes[i], niv);
  equipes[i].modifieLe = date;
});

fs.rmSync(RACINE, { recursive: true, force: true });
for (const d of equipes) {
  const nom = P.nomEquipe(d.equipe.eleves);
  fs.mkdirSync(path.join(RACINE, nom), { recursive: true });
  fs.writeFileSync(path.join(RACINE, nom, nom + '.json'), JSON.stringify(d, null, 1));
  console.log(`${nom.padEnd(18)} ${d.equipe.classe}  ${P.avancement(d)}/${exercices.filter((e) => !e.defi).length}`);
}
// Un fichier qui n'est pas une sauvegarde, pour voir qu'il est ignoré.
fs.writeFileSync(path.join(RACINE, 'Léa_Hugo', 'notes.json'), '{"titre":"pas une sauvegarde"}');
// Une ancienne copie d'une équipe : l'outil garde la plus récente et le signale.
const ancienne = JSON.parse(JSON.stringify(equipes[4]));
ancienne.modifieLe = '2026-10-05T10:00:00';
fs.writeFileSync(path.join(RACINE, 'Chloé_Lucas', 'Chloé_Lucas (ancienne copie).json'), JSON.stringify(ancienne, null, 1));
console.log('\nDossier :', RACINE);
