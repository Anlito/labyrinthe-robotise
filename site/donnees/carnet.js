// Carnet de projet (ancien dossier de travail papier, 5e et 4e) : onglets, parties, textes et réponses attendues.
// Le professeur peut modifier ce fichier (textes, éléments à classer, réponses des cases à compléter).
//
// Chaque partie a un « type » :
//   info        texte à lire (pas de réponse)                      lignes, encadre (« attention » ou « regle »)
//   classement  ranger des éléments dans des colonnes, « Vérifier »   colonnes, elements { nom, image, place }
//   trous       cases à compléter en choisissant dans une liste,      lignes : « texte [[réponse]] texte »,
//               « Vérifier » (les réponses ne sont jamais montrées)   choix (réponses et autres propositions)
//   questions   réponses écrites librement                           questions
//   tableau     tableau à remplir librement                          colonnes, lignes (nombre ou titres de ligne)
//   cases       liste à cocher                                       cases
//   choix       un choix (ou plusieurs avec « plusieurs »)           options, question (texte libre en plus)
//   echelle     auto-évaluation (un degré par ligne)                 lignes, degres
//   labyrinthe  « Mon labyrinthe » : dessiner le plateau et l'essayer
//   programmation  les exercices de Labo Blocs (onglet Programmation)
// « niveaux » (facultatif) : la partie n'est montrée qu'aux classes de ces niveaux (« 5 » : 5A, 5B… ; « 4 »).
// « note » : la partie compte dans la note (seules les parties qui ont « Vérifier » peuvent être notées ; le
// coefficient est dans donnees/notation.js). Les autres sont visibles par le professeur, pas notées.
// Les réponses de l'équipe sont gardées sous l'identifiant de la partie : ne pas le changer en cours d'année.
definirCarnet({
  "titre": "Labyrinthe robotisé",
  "onglets": [
    { "cle": "mission", "titre": "La mission", "icone": "drapeau", "parties": ["mission", "contraintes", "securite"] },
    { "cle": "systeme", "titre": "Le système", "icone": "variables", "parties": ["classement", "chaines-aide", "chaines", "phrase"] },
    { "cle": "cablage", "titre": "Câblage", "icone": "bouton", "parties": ["branchements-5", "rails-4", "etapes-4", "verification-4", "question-4"] },
    { "cle": "programmation", "titre": "Programmation", "icone": "lumiere", "parties": ["programmation"] },
    { "cle": "conception", "titre": "Conception", "icone": "crayon", "parties": ["labyrinthe", "comparaison-4", "materiaux", "reflexion"] },
    { "cle": "tests", "titre": "Tests et améliorations", "icone": "recommencer", "parties": ["tests", "amelioration"] },
    { "cle": "comprendre", "titre": "Comprendre", "icone": "livre", "parties": ["familles", "roles"] },
    { "cle": "bilan", "titre": "Bilan et oral", "icone": "coche", "parties": ["fonctionne", "autoevaluation", "bilan", "oral"] },
    { "cle": "retenir", "titre": "À retenir", "icone": "info", "parties": ["retenir-chaines", "retenir-familles", "retenir-programme", "retenir-etalonnage", "retenir-securite", "retenir-materiaux"] }
  ],
  "parties": [
    // ---------- La mission ----------
    { "id": "mission", "type": "info", "titre": "La mission",
      "lignes": [
        "Concevoir un jeu de labyrinthe interactif piloté par un joystick.",
        "Une bille se déplace sur un plateau incliné par deux servomoteurs, commandés par une carte Arduino Uno.",
        "Critères de réussite : la bille peut aller du départ à l’arrivée ; le parcours dure au moins 10 secondes ; ça fonctionne sans aide, avec le joystick seulement."
      ] },
    { "id": "contraintes", "type": "info", "titre": "Les contraintes du cahier des charges",
      "lignes": [
        "Plateau : 16 cm × 16 cm au maximum.",
        "Chemin : 14 mm de large au minimum (la bille mesure 12 mm).",
        "Poids du plateau : 150 g au maximum (sinon les servomoteurs cassent).",
        "Départ (D) et arrivée (A) clairement marqués sur le plateau.",
        "Énergie : alimentation par le câble USB seulement."
      ] },
    { "id": "securite", "type": "info", "titre": "Consignes de sécurité", "encadre": "attention",
      "lignes": [
        "Ne jamais forcer les moteurs à la main.",
        "Toujours débrancher le câble USB avant de modifier le câblage.",
        "Ne pas installer le plateau avant que l’exercice 7 (angles de 60° à 120°) soit réussi et validé par le professeur : avec 0° à 180°, les servomoteurs vont en butée et cassent.",
        "Manipuler la bille et le plateau avec soin, ranger le matériel après chaque séance."
      ] },

    // ---------- Le système ----------
    { "id": "classement", "type": "classement", "titre": "Capteur, carte programmable ou actionneur ?", "note": true,
      "consigne": "Range chaque élément dans sa famille.",
      "colonnes": [
        { "cle": "capteur", "titre": "Capteurs", "aide": "Prennent une information",
          "explication": "Un capteur prend une information dans le monde réel (une position, un appui, la lumière, une distance…) et l’envoie à la carte programmable." },
        { "cle": "carte", "titre": "Carte programmable", "aide": "Traite et décide",
          "explication": "La carte programmable reçoit les informations des capteurs, exécute le programme et décide quoi faire." },
        { "cle": "actionneur", "titre": "Actionneurs", "aide": "Agissent sur le monde",
          "explication": "Un actionneur agit sur le monde réel quand la carte le lui demande : il bouge, éclaire ou fait du bruit." }
      ],
      "elements": [
        { "nom": "Joystick", "image": "img/objets/joystick.svg", "place": "capteur" },
        { "nom": "Bouton du joystick (SW)", "image": "img/objets/bouton.png", "place": "capteur" },
        { "nom": "Carte Arduino Uno", "image": "img/objets/arduino.png", "place": "carte" },
        { "nom": "Servomoteur", "image": "img/objets/servo.png", "place": "actionneur" },
        { "nom": "LED", "image": "img/objets/ampoule.png", "place": "actionneur" },
        { "nom": "Buzzer", "image": "img/objets/enceinte.png", "place": "actionneur" },
        { "nom": "Capteur de distance", "image": "img/objets/distance.png", "place": "capteur" }
      ] },
    { "id": "chaines-aide", "type": "info", "titre": "Comprendre les deux chaînes", "schemaChaines": true,
      "lignes": ["La chaîne d’information reçoit des informations, les traite et envoie des ordres. Elle répond à la question : que doit faire le système ?", "La chaîne d’énergie fournit et transforme l’énergie nécessaire au mouvement. Elle répond à la question : comment réaliser l’action ?"] },
    { "id": "chaines", "type": "trous", "titre": "La chaîne d’information et la chaîne d’énergie", "note": true,
      "consigne": "Complète chaque fonction avec l’élément du labyrinthe qui la réalise.",
      "lignes": [
        "Chaîne d’information · Acquérir : [[le joystick]]",
        "Chaîne d’information · Traiter : [[la carte Arduino]]",
        "Chaîne d’information · Communiquer : [[l’ordre d’angle envoyé aux servomoteurs]]",
        "Chaîne d’énergie · Alimenter : [[le câble USB]]",
        "Chaîne d’énergie · Acheminer l’énergie : [[les fils électriques]]",
        "Chaîne d’énergie · Convertir l’énergie en mouvement : [[les servomoteurs]]"
      ],
      "choix": ["le joystick", "la carte Arduino", "l’ordre d’angle envoyé aux servomoteurs", "le câble USB", "les fils électriques", "les servomoteurs", "la bille", "le plateau"] },
    { "id": "phrase", "type": "trous", "titre": "Le fonctionnement global", "note": true,
      "consigne": "Complète la phrase.",
      "lignes": [
        "Quand on bouge le [[joystick]], il envoie une information à la carte [[Arduino]].",
        "Le programme traite cette information puis envoie un ordre aux [[servomoteurs]].",
        "Les servomoteurs font bouger le [[plateau]] pour déplacer la bille."
      ],
      "choix": ["joystick", "Arduino", "servomoteurs", "plateau", "bille", "câble USB"] },

    // ---------- Câblage ----------
    { "id": "branchements-5", "type": "trous", "titre": "Complète les branchements", "niveaux": ["5"], "note": true,
      "consigne": "Les modules sont déjà câblés : suis les fils du kit pour trouver où chacun est branché sur la carte Arduino. Couleurs des fils : rouge ou blanc = +5V, noir ou marron = GND (la masse).",
      "lignes": [
        "Joystick · VRX (axe gauche – droite) → [[A0]]",
        "Joystick · VRY (axe haut – bas) → [[A1]]",
        "Joystick · SW (bouton) → [[D4]]",
        "Joystick · GND → [[GND]]",
        "Joystick · +5V → [[5V]]",
        "Servomoteur de l’axe X · fil de signal (orange) → [[D5]]",
        "Servomoteur de l’axe Y · fil de signal (orange) → [[D6]]",
        "Servomoteurs · fil rouge → [[5V]]",
        "Servomoteurs · fil marron → [[GND]]"
      ],
      "choix": ["A0", "A1", "A2", "D2", "D4", "D5", "D6", "5V", "3.3V", "GND"] },
    { "id": "rails-4", "type": "info", "titre": "Câbler avec les rails d’alimentation", "niveaux": ["4"], "encadre": "regle",
      "lignes": [
        "Vous câblez vous-mêmes le système à partir des composants séparés (fils, platine d’essai).",
        "Sur la platine, tous les fils plantés dans la même colonne sont reliés entre eux. On regroupe donc tous les +5V dans la colonne « + » et tous les GND dans la colonne « − » : un seul fil rejoint ensuite chaque colonne vers l’Arduino.",
        "Couleurs des fils : rouge ou blanc = +5V, noir ou marron = GND (la masse).",
        "Signaux : VRX du joystick → A0, VRY → A1, SW (bouton) → D4, signal du servomoteur de l’axe X → D5, signal du servomoteur de l’axe Y → D6."
      ] },
    { "id": "etapes-4", "type": "cases", "titre": "Les étapes du câblage", "niveaux": ["4"],
      "cases": [
        "Étape 1 · Fil +5V du joystick et des deux servomoteurs dans la colonne « + » de la platine",
        "Étape 1 · Fil GND du joystick et des deux servomoteurs dans la colonne « − » de la platine",
        "Étape 2 · Colonne « + » de la platine reliée au 5V de l’Arduino",
        "Étape 2 · Colonne « − » de la platine reliée au GND de l’Arduino",
        "Étape 3 · VRX → A0 et VRY → A1",
        "Étape 3 · SW → D4",
        "Étape 3 · Signal du servomoteur de l’axe X → D5, de l’axe Y → D6"
      ] },
    { "id": "verification-4", "type": "cases", "titre": "Avant de brancher le câble USB", "niveaux": ["4"], "encadre": "attention",
      "cases": [
        "Aucun fil ne relie directement +5V et GND (pas de court-circuit)",
        "Chaque fil est bien enfoncé (continuité vérifiée)",
        "Le câblage correspond exactement au schéma (A0, A1, D4, D5, D6, GND, +5V)",
        "Un professeur a validé notre câblage : nous pouvons mettre sous tension"
      ] },
    { "id": "question-4", "type": "questions", "titre": "Comprendre le câblage", "niveaux": ["4"],
      "questions": [
        "Pourquoi regroupe-t-on tous les GND dans une seule colonne de la platine ?",
        "Que se passerait-il si un fil reliait directement +5V et GND ?"
      ] },

    // ---------- Programmation ----------
    { "id": "programmation", "type": "programmation", "titre": "Programmation",
      "consigne": "Programme le labyrinthe en blocs, exercice par exercice. Réussis un exercice pour ouvrir le suivant. Le plateau s’installe seulement quand l’exercice 7 (angles de 60° à 120°) est réussi et validé par le professeur." },

    // ---------- Conception ----------
    { "id": "labyrinthe", "type": "labyrinthe", "titre": "Mon labyrinthe",
      "consigne": "Dessine ton labyrinthe sur le plateau de 16 × 16 cm (une case = 2 cm), puis essaie-le avec la bille. Tu peux aussi le dessiner sur papier : ton professeur le photographiera." },
    { "id": "comparaison-4", "type": "tableau", "titre": "Comparer les matériaux avant de choisir", "niveaux": ["4"],
      "consigne": "Compare au moins 2 ou 3 matériaux candidats avant de choisir celui du plateau.",
      "colonnes": ["Matériau candidat", "Poids estimé (g)", "Résistance", "Disponibilité", "Facilité de découpe"],
      "lignes": 3 },
    { "id": "materiaux", "type": "tableau", "titre": "Les matériaux du plateau",
      "consigne": "Le plateau doit peser 150 g au maximum. En classe : carton et cure-dents. Tu peux apporter des matériaux légers de chez toi (boîte de céréales, Lego…).",
      "colonnes": ["Matériau choisi", "Utilisation", "Poids estimé (g)", "Pourquoi ce choix ?"],
      "lignes": 3,
      "total": { "colonne": 2, "titre": "Poids total estimé", "unite": "g", "maximum": 150 } },
    { "id": "reflexion", "type": "questions", "titre": "Réflexion sur ton labyrinthe",
      "questions": ["Pourquoi ton labyrinthe est-il difficile MAIS possible ?", "Quelle est la partie la plus délicate ?"] },

    // ---------- Tests et améliorations ----------
    { "id": "tests", "type": "tableau", "titre": "Problèmes et solutions",
      "consigne": "Note chaque problème observé pendant les essais et la solution que vous avez appliquée.",
      "colonnes": ["Problème observé", "Solution appliquée"],
      "lignes": ["La bille tombe", "Le plateau est trop rapide", "Le joystick est inversé", "Autre"] },
    { "id": "amelioration", "type": "choix", "titre": "L’amélioration choisie", "plusieurs": true,
      "options": ["Bouton du joystick (SW) : remettre le plateau à plat", "Buzzer (son)", "LED", "Autre"],
      "question": "Pourquoi cette amélioration ?" },

    // ---------- Comprendre ----------
    { "id": "familles", "type": "trous", "titre": "Qui fait quoi ?", "note": true,
      "lignes": [
        "Le joystick est un [[capteur]] : il mesure la position que lui donnent les doigts.",
        "L’Arduino est une [[carte programmable]] : elle exécute le programme et décide.",
        "Le servomoteur est un [[actionneur]] : il incline le plateau."
      ],
      "choix": ["capteur", "carte programmable", "actionneur"] },
    { "id": "roles", "type": "questions", "titre": "Explique avec tes mots",
      "questions": [
        "À quoi sert le bloc « ré-étalonner » dans ton programme ?",
        "Pourquoi limite-t-on les angles entre 60° et 120° ?",
        "Quelle est la différence entre la chaîne d’information et la chaîne d’énergie ?"
      ] },

    // ---------- Bilan et oral ----------
    { "id": "fonctionne", "type": "choix", "titre": "Notre projet fonctionne ?",
      "options": ["Oui, complètement", "Oui, en partie", "Non, à améliorer"] },
    { "id": "autoevaluation", "type": "echelle", "titre": "Auto-évaluation",
      "lignes": ["Comprendre le système", "Câblage", "Programmation", "Conception", "Présentation"],
      "degres": ["Pas encore", "Plutôt bien", "Très bien"] },
    { "id": "bilan", "type": "questions", "titre": "Bilan",
      "questions": ["Ce que j’ai appris :", "Ce que je dois améliorer :"] },
    { "id": "oral", "type": "questions", "titre": "Préparer la présentation orale",
      "consigne": "Tu dois savoir expliquer : le fonctionnement du système (chaîne d’information et chaîne d’énergie), ton labyrinthe et tes choix, ton programme et les exercices réussis, tes améliorations et les problèmes résolus. Prépare 3 phrases clés.",
      "questions": ["Phrase 1", "Phrase 2", "Phrase 3"] },

    // ---------- À retenir (fiche « Ce qu'il faut retenir ») ----------
    { "id": "retenir-chaines", "type": "info", "titre": "La chaîne d’information et la chaîne d’énergie",
      "lignes": [
        "Chaîne d’information : ACQUÉRIR → TRAITER → COMMUNIQUER. Elle permet au système de « comprendre » ce qui se passe, pour décider quoi faire.",
        "Acquérir : c’est le rôle d’un CAPTEUR. Il transforme une grandeur physique (position, lumière, distance…) en un signal que la carte peut lire. Ici, le joystick capte la position que tu lui donnes.",
        "Traiter : c’est le rôle de la CARTE PROGRAMMABLE. Elle exécute le programme et décide. Ici, l’Arduino lit la position du joystick, la range dans une variable et calcule l’angle des servomoteurs.",
        "Communiquer : la carte envoie un ORDRE à un actionneur, ou une INFORMATION à un humain (écran, LED, son). Ici, l’ordre d’angle aux servomoteurs.",
        "Chaîne d’énergie : ALIMENTER → DISTRIBUER → CONVERTIR → TRANSMETTRE. L’énergie électrique arrive par le câble USB ; l’électronique des servomoteurs commande les moteurs, qui la transforment en mouvement transmis au plateau."
      ] },
    { "id": "retenir-familles", "type": "info", "titre": "Les 3 familles de composants",
      "lignes": [
        "CAPTEUR : il mesure une information (le joystick mesure une position).",
        "CARTE PROGRAMMABLE : elle traite l’information et décide (l’Arduino Uno).",
        "ACTIONNEUR : il agit sur le monde réel (les servomoteurs qui inclinent le plateau)."
      ] },
    { "id": "retenir-programme", "type": "info", "titre": "Programmer : le vocabulaire",
      "lignes": [
        "VARIABLE : une boîte qui garde une valeur pour la réutiliser (VRX garde la position du joystick).",
        "CONDITION (« si… alors ») : des blocs qui ne s’exécutent que si quelque chose est vrai (si le bouton est appuyé, alors…).",
        "BOUCLE (« Répéter indéfiniment ») : les blocs se répètent sans arrêt tant que l’Arduino est allumé.",
        "ALGORITHME : la suite d’étapes logiques imaginée avant de programmer. Le traduire en programme, c’est l’écrire avec les blocs de Labo Blocs."
      ] },
    { "id": "retenir-etalonnage", "type": "info", "titre": "Le ré-étalonnage",
      "lignes": [
        "Le joystick donne une valeur de 0 à 1023, mais un servomoteur attend un angle de 0° à 180°.",
        "Le bloc « ré-étalonner » passe d’une échelle à l’autre en gardant les proportions : 512 (le centre) devient 90°.",
        "Réduire l’écart entre les deux valeurs d’arrivée réduit l’amplitude du mouvement : (60, 120) est plus doux que (0, 180), et protège les servomoteurs.",
        "Inverser les deux valeurs de départ inverse le sens du mouvement (joystick inversé)."
      ] },
    { "id": "retenir-securite", "type": "info", "titre": "Câbler en sécurité",
      "lignes": [
        "Un court-circuit se produit quand +5V et GND sont reliés directement, sans passer par un composant.",
        "La continuité d’un fil : le courant passe bien d’un bout à l’autre (fil bien enfoncé, pas abîmé).",
        "Un câblage se vérifie TOUJOURS avant la mise sous tension, jamais après."
      ] },
    { "id": "retenir-materiaux", "type": "info", "titre": "Comparer plusieurs matériaux",
      "lignes": [
        "Avant de choisir un matériau, on compare plusieurs candidats selon des critères : poids, résistance, disponibilité, facilité de découpe.",
        "Un choix argumenté s’appuie sur cette comparaison, pas seulement sur une intuition ou sur l’aspect."
      ] }
  ]
});
