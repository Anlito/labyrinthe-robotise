// Barème de la note (outil professeur). Le professeur peut le modifier ici, ou le régler dans
// le panneau « Barème » de prof.html (ces réglages-là ne durent que le temps de la page).
definirBareme({
  // Note sur :
  "sur": 20,
  // Exercices attendus à ce moment du projet (les N premiers ; 0 = tout le parcours, soit 7 exercices).
  // La note est calculée sur eux. À augmenter au fil des séances : la note reste juste même si une équipe ne finit pas.
  "objectif": 0,
  // Exercice réussi AU-DELÀ des exercices attendus : part de ses points ajoutée en bonus.
  // 0 = l'avance ne rapporte rien, pour qu'elle ne compense pas les erreurs sur le travail attendu.
  "avance": 0,
  // Coefficient de chaque exercice de programmation (selon sa difficulté). 0 = l'exercice ne compte pas.
  //   1 plateau à plat · 2 pencher le plateau · 3 lire le joystick · 4 trois positions · 5 ré-étalonner un axe ·
  //   6 les deux axes · 7 programme final 60° à 120°
  "coefficients": { "1": 1, "2": 1, "3": 1.5, "4": 1.5, "5": 2, "6": 2, "7": 3 },
  // Points de bonus par défi réussi (exercice 8 : mouvement doux et bouton du joystick). La note ne dépasse jamais « sur ».
  "bonusDefi": 1,
  // Exercice commencé (au moins une vérification) mais pas réussi : part des points accordée.
  "participation": 0.2,
  // Retenue par indice ouvert avant la réussite, et retenue maximale.
  "penaliteIndice": 0.1,
  "penaliteIndiceMax": 0.3,
  // Vérifications ratées sans retenue (0 : seule une réussite du premier coup garde tous les points),
  // puis retenue par vérification ratée en plus, et maximum.
  "essaisGratuits": 0,
  "penaliteEchec": 0.05,
  "penaliteEchecMax": 0.25,
  // Parties du carnet de projet notées et leur coefficient (0 = ne compte pas). Même principe que la
  // programmation : réussi = tous les points, moins les vérifications ratées avant la réussite.
  // « branchements-5 » n'existe qu'en 5e : en 4e, il ne compte pas (le câblage réel est noté à la main).
  // Les autres parties ne sont pas notées : leur travail reste visible dans l'outil professeur.
  "carnet": { "classement": 1, "chaines": 1, "phrase": 1, "branchements-5": 1, "familles": 1 },
  // Arrondi de la note (0.5 = au demi-point, 0.25 = au quart de point, 0 = au centième).
  "arrondi": 0.5
});
