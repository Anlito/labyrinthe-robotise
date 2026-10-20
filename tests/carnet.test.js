// Carnet de projet : réponses, corrections, états et avancement, d'après donnees/carnet.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const K = require('../site/js/moteur/carnet.js');
const P = require('../site/js/moteur/progression.js');
const { carnet: C } = require('../site/js/moteur/catalogue.js');
const Lab = require('../site/js/labyrinthe/modele.js');

const partie = (id) => K.partieCarnet(C, id);

test('niveau de la classe : 5A → 5, 4D1 → 4, sans classe → toutes les parties', () => {
  assert.equal(K.niveauDe('5A'), '5');
  assert.equal(K.niveauDe('4D1'), '4');
  assert.equal(K.niveauDe(''), null);
  const tout = K.partiesSuivies(C, null).length;
  assert.ok(K.partiesSuivies(C, '5').length < tout && K.partiesSuivies(C, '4').length < tout);
});

test('cases à compléter : justes, à revoir, vides ; le message ne donne jamais la réponse', () => {
  const k = K.carnetVide();
  const p = partie('phrase');
  const r = K.reponseCarnet(k, p);
  r['0.0'] = 'joystick';
  r['0.1'] = 'bille';
  r['1.0'] = 'servomoteurs';
  const c = K.corrigerPartie(k, p);
  assert.equal(c.total, 4);
  assert.equal(c.bien, 2);
  assert.deepEqual(c.mal, ['0.1']);
  assert.deepEqual(c.vides, ['2.0']);
  assert.equal(c.message, '2 cases sur 4 sont justes. 1 case est à revoir et 1 case est encore vide.');
  assert.ok(!/Arduino|plateau/.test(c.message));
  for (const t of K.trousDe(p)) r[t.cle] = t.reponse;
  assert.equal(K.corrigerPartie(k, p).reussi, true);
});

test('classement : bien placés, mal placés, non placés', () => {
  const k = K.carnetVide();
  const p = partie('classement');
  const r = K.reponseCarnet(k, p);
  r.Joystick = 'capteur';
  r['Carte Arduino Uno'] = 'actionneur';
  const c = K.corrigerPartie(k, p);
  assert.equal(c.bien, 1);
  assert.deepEqual(c.mal, ['Carte Arduino Uno']);
  assert.equal(c.nonPlaces.length, p.elements.length - 2);
  for (const e of p.elements) r[e.nom] = e.place;
  assert.equal(K.corrigerPartie(k, p).reussi, true);
});

test('élément renommé : la réponse placée sous l’ancien nom est reprise', () => {
  const C2 = JSON.parse(JSON.stringify(C));
  const p = C2.parties.find((x) => x.id === 'classement');
  p.elements[0].ancienNom = p.elements[0].nom;
  p.elements[0].nom = 'Manette joystick';
  const k = K.carnetVide();
  k.reponses.classement = { [p.elements[0].ancienNom]: 'capteur' };
  K.harmoniserCarnet(k, C2);
  assert.deepEqual(k.reponses.classement, { 'Manette joystick': 'capteur' });
});

test('états : questions, tableau (au moins une ligne pleine), cases, choix, échelle', () => {
  const k = K.carnetVide();
  const q = partie('reflexion');
  assert.equal(K.etatPartie(k, q), 'a_faire');
  K.reponseCarnet(k, q)[0] = 'Les virages sont serrés';
  assert.equal(K.etatPartie(k, q), 'en_cours');
  K.reponseCarnet(k, q)[1] = 'Le dernier virage';
  assert.equal(K.etatPartie(k, q), 'fait');

  const t = partie('materiaux');
  K.reponseCarnet(k, t)[0][0] = 'carton';
  assert.equal(K.etatPartie(k, t), 'en_cours');
  K.reponseCarnet(k, t)[0].splice(0, 4, 'carton', 'plateau', '60', 'léger');
  assert.equal(K.etatPartie(k, t), 'fait');

  // Tableau à titres de ligne : la première colonne est déjà écrite.
  const tests = partie('tests');
  K.reponseCarnet(k, tests)[0][1] = 'On a ajouté des bordures';
  assert.equal(K.etatPartie(k, tests), 'fait');

  const c = partie('etapes-4');
  K.reponseCarnet(k, c).fill(true);
  assert.equal(K.etatPartie(k, c), 'fait');

  const ch = partie('amelioration');
  K.reponseCarnet(k, ch).choisis = ['LED'];
  assert.equal(K.etatPartie(k, ch), 'en_cours', 'la question « pourquoi » reste à remplir');
  K.reponseCarnet(k, ch).texte = 'Pour voir quand le jeu commence';
  assert.equal(K.etatPartie(k, ch), 'fait');

  const e = partie('autoevaluation');
  for (const l of e.lignes) K.reponseCarnet(k, e)[l] = 2;
  assert.equal(K.etatPartie(k, e), 'fait');
});

test('labyrinthe : à faire, en cours, puis fait quand toutes les vérifications du concepteur passent', () => {
  const k = K.carnetVide();
  const p = partie('labyrinthe');
  assert.equal(K.etatPartie(k, p), 'a_faire');
  k.reponses.labyrinthe = Object.assign(Lab.vide(), { depart: { c: 0, l: 0 } });
  assert.equal(K.etatPartie(k, p), 'en_cours');
  const c = K.corrigerPartie(k, p);
  assert.equal(c.reussi, false);
  assert.match(c.message, /arrivée/);
});

test('avancement du carnet par niveau et vérifications gardées dans le fichier', () => {
  const d = P.creerProgression({ eleves: ['Léa', 'Hugo'], classe: '5A' });
  const av = K.avancementCarnet(d.carnet, C, '5');
  assert.equal(av.fait, 0);
  assert.equal(av.total, K.partiesSuivies(C, '5').length);
  const p = partie('familles');
  for (const t of K.trousDe(p)) K.reponseCarnet(d.carnet, p)[t.cle] = t.reponse;
  K.noterVerificationCarnet(d, 'familles', K.corrigerPartie(d.carnet, p));
  assert.equal(d.carnet.verifications.familles.length, 1);
  assert.equal(K.etatPartie(d.carnet, p), 'fait');
  assert.equal(K.avancementCarnet(d.carnet, C, '5').fait, 1);
  // Le fichier relu garde les réponses et les vérifications.
  const relu = P.lireSauvegarde(JSON.stringify(d));
  assert.ok(relu.ok);
  assert.deepEqual(relu.donnees.carnet, JSON.parse(JSON.stringify(d.carnet)));
});

test('une sauvegarde sans carnet reçoit un carnet vide', () => {
  const d = P.creerProgression({ eleves: ['Léa'], classe: '4B' });
  delete d.carnet;
  const r = P.lireSauvegarde(JSON.stringify(d));
  assert.ok(r.ok);
  assert.deepEqual(r.donnees.carnet, { reponses: {}, verifications: {} });
});
