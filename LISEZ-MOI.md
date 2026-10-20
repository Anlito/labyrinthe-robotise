# Projet Labyrinthe robotisé — LISEZ-MOI (professeur)

Le carnet de projet numérique du Labyrinthe robotisé (5e et 4e) : il remplace le dossier de travail papier et
mBlock. Les élèves y font tout le projet : comprendre le système, le câblage, la programmation en blocs (avec
**Labo Blocs**, simulateur et envoi dans la carte Arduino), la conception du plateau (outil « Mon labyrinthe »), les
tests, le bilan. Pas de compte, pas de serveur : tout se passe dans le navigateur, et le travail de chaque équipe est
enregistré dans **un fichier** dans le dossier de l'équipe.

- **Élèves** : `index.html` — en ligne : https://anlito.github.io/labyrinthe-robotise/
- **Professeur** : `prof.html` (aucun lien depuis l'écran des élèves)
- **Mode enseignant** (exercices tous ouverts, bouton « Solution », rien n'est enregistré) : `index.html?enseignant=1`,
  ou le lien en haut de `prof.html`.

---

## 1. Le matériel (une maquette par binôme)

| Élément | Branchement |
|---|---|
| Arduino Uno | câble USB vers l'ordinateur (seule alimentation) |
| Joystick | VRX (axe gauche – droite) → **A0**, VRY (axe haut – bas) → **A1**, SW (bouton du joystick) → **D4**, +5V et GND |
| Servomoteur de l'axe X | signal → **D5** |
| Servomoteur de l'axe Y | signal → **D6** |

Les +5V et les GND passent par les rails de la platine d'essai (un seul fil de chaque rail vers l'Arduino).
**5e** : le kit est déjà câblé, les élèves retrouvent les branchements. **4e** : ils câblent eux-mêmes.

Contraintes du plateau : 16 × 16 cm au maximum, chemin d'au moins 14 mm (bille de 12 mm), 150 g au maximum, départ D
et arrivée A marqués, parcours d'au moins 10 s.

## 2. Ouvrir le carnet

**En ligne** : l'adresse ci-dessus. **Depuis le dossier réseau** : décompresser `labyrinthe-robotise.zip`, puis
ouvrir `labyrinthe-robotise/index.html` (double-clic). Le site marche sans connexion internet.

**Navigateurs** : Chrome ou Edge (obligatoires pour envoyer le programme dans la carte et pour l'enregistrement
automatique). Firefox fonctionne pour le reste, mais « Enregistrer » y télécharge le fichier, à ranger à la main.

## 3. Ce que font les élèves

1. **Accueil** : « Nouvelle équipe » (1 à 3 prénoms et la classe, 5e ou 4e) ou « Ouvrir notre sauvegarde ».
2. **Dossier de l'équipe** : le chemin s'affiche (`Bureau › Classe › 5A › COMMUN › TECHNOLOGIE › LABYRINTHE ROBOTISE`).
   L'élève sélectionne seulement `LABYRINTHE ROBOTISE` : le carnet y crée le dossier de l'équipe (`Prénom_Prénom`).
   Le professeur n'a que le dossier LABYRINTHE ROBOTISE à créer dans chaque classe. Une sauvegarde déjà présente
   n'est jamais écrasée.
3. **Le carnet de projet**, en onglets (les parties propres à un niveau ne sont montrées qu'aux classes de ce niveau) :

   | Onglet | Contenu | « Vérifier » |
   |---|---|---|
   | La mission | mission, critères, contraintes, consignes de sécurité | — |
   | Le système | classement capteur / carte / actionneur ; chaîne d'information et d'énergie ; phrase à trous | oui |
   | Câblage | **5e** : retrouver les broches en suivant les fils. **4e** : rails, étapes du câblage, vérification avant mise sous tension, questions | 5e : oui |
   | Programmation | les 8 exercices de Labo Blocs, l'envoi dans la carte, « Vider la carte » | par Labo Blocs |
   | Conception | **Mon labyrinthe** (dessiner, essayer avec la bille, imprimer le gabarit), comparaison des matériaux (4e), matériaux et poids, réflexion | vérifications du plateau |
   | Tests et améliorations | problèmes et solutions, amélioration choisie | — |
   | Comprendre | qui fait quoi (capteur, carte, actionneur), questions | oui |
   | Bilan et oral | le projet fonctionne ?, auto-évaluation, bilan, 3 phrases clés | — |
   | À retenir | la fiche « Ce qu'il faut retenir » | — |

   « Vérifier » dit combien de réponses sont justes et marque « à revoir » ce qui ne l'est pas, sans donner la réponse.
4. **Exercices de programmation** : on réussit l'exercice N pour ouvrir le N+1.
   1 plateau à plat (D5 à 90°) · 2 pencher le plateau (60° ↔ 120°) · 3 lire le joystick (VRX > 700) · 4 trois positions ·
   5 ré-étalonner un axe (1023, 0) → (0, 180) · 6 les deux axes · **7 programme final : angles de 60° à 120°** ·
   8 **défi** : mouvement doux (80° à 100°) et bouton du joystick qui remet le plateau à plat.
   Les exercices 6 à 8 partent du programme de l'exercice précédent : on le modifie.
5. **Le plateau ne s'installe qu'après l'exercice 7 réussi et validé par le professeur** (avec 0° à 180°, les
   servomoteurs vont en butée). L'outil professeur montre pour chaque équipe si l'exercice 7 est réussi.
6. **Envoyer dans la carte** : depuis l'exercice 7 ou 8 réussi (« Envoyer dans la carte Arduino »), ou depuis le carnet
   (onglet Programmation). La première fois, la carte reçoit son **programme de base Labo Blocs** (une dizaine de
   secondes, une fois pour toutes) ; ensuite chaque envoi prend quelques secondes et la carte garde le programme,
   même débranchée. Fin de séance : « Vider la carte ».
7. **Mon labyrinthe** : le plateau de 16 × 16 cm en cases de 2 cm ; murs, trous (la bille tombe et repart du
   départ), tunnels, départ et arrivée. Les vérifications (départ, arrivée, chemin, largeur, durée d'au moins 10 s)
   s'affichent à côté. « Essayer » fait rouler une bille de 12 mm (flèches du clavier ou joystick à l'écran). « Imprimer
   le gabarit » sort le plan à l'échelle 1, pour la fabrication. Les élèves peuvent aussi dessiner sur papier : le
   professeur photographie la feuille (outil professeur, « Croquis et dessins »).
8. **Un seul fichier** `Prénom_Prénom.json` garde le carnet, le labyrinthe et les exercices ; il se réenregistre tout
   seul (Chrome, Edge). Si l'onglet est fermé par erreur, l'accueil propose « Reprendre le travail de … ».

## 4. Outil professeur (`prof.html`)

- **Accueil** : « Ouvrir le dossier de la classe » (`LABYRINTHE ROBOTISE` de la classe, tous les dossiers d'équipes
  sont lus d'un coup et relus toutes les 30 s), « Reprendre » le dernier dossier, ou « Importer des fichiers .json ».
- **Classe** : chiffres clés (note moyenne, exercices réussis, part du carnet faite, programmes finals réussis,
  équipes bloquées), **alertes « bloqué »** (6 tentatives ou 10 minutes sur un exercice, réglables ; son et
  notification), tableau ✓ ● ○ avec tentatives, avancement, carnet (parties faites / parties du niveau), ★ réussites
  du premier coup, note.
- **Équipe** (‹ › pour passer à l'équipe voisine, Échap pour revenir) :
  **Bilan** (note et composition, avancement, programme final et défi), **Programmation** (chaque exercice, ses
  points ; « Lancer le programme » le rouvre en lecture), **Carnet de projet** (chaque partie du niveau de l'équipe, son
  état, ses réponses case par case avec ✓ / ✗, le labyrinthe dessiné et ses vérifications, les points),
  **Historique** (vérifications, erreurs, indices), **Croquis et dessins** (photo de la feuille par webcam, rangée en
  .jpg dans le dossier de l'équipe).
- **Bandeau** : « Barème », « Excel », « CSV », « Carnet de classe » (niveaux par compétence de Labo Blocs à importer
  dans le Carnet de classe), « Imprimer », « Autre classe », « Exercices » (mise à jour du parcours).

### La note

Bouton « Barème » : choix de notation, coefficients et niveaux conservés dans le navigateur du professeur. Exporter les évaluations fournit une sauvegarde à conserver dans son dossier personnel. Le fichier `donnees/notation.js` définit les valeurs de départ. Par défaut, sur 20 :

- **coefficient par exercice** : 1 et 2 → 1 ; 3 et 4 → 1,5 ; 5 et 6 → 2 ; 7 (programme final) → 3 ;
- **réussi** : tous ses points **du premier coup et sans indice** ; sinon −10 % par indice (au plus −30 %) et −5 % par
  essai raté (au plus −25 %), comptés avant la réussite ; **commencé** : 20 % ; **non commencé** : 0 ;
- **défi (exercice 8) réussi** : +1 point (la note ne dépasse jamais 20) ;
- **exercices attendus** : réglage « objectif » (0 = les 7), à augmenter au fil des séances ;
- **carnet** : les parties avec « Vérifier » comptent (coefficient 1) : classement, chaînes, phrase, qui fait quoi, et
  en 5e les branchements. Une partie d'un autre niveau ne compte jamais pour une équipe. Chaque partie peut être activée ou désactivée dans le barème. Les autres parties se notent manuellement : Non atteint (1/4), Partiellement atteint (2/4), Atteint (3/4), Dépassé (4/4). Tant que le professeur ne choisit pas de niveau, la partie reste hors du total.

La grille de compétences du BO 2024 (C3 à C9, `Notation_Labyrinthe_Robotise.xlsx`) se remplit à côté : l'export
Excel et le détail de chaque équipe (réponses, labyrinthe, câblage de 4e coché) servent d'appui.

### Retrouver les photos des feuilles

Dans la fiche d'une équipe : **Croquis et dessins → Plan du labyrinthe**, photographier ou importer l'image,
puis **Enregistrer dans le dossier de l'équipe**. Les fichiers JPG restent séparés du JSON des élèves pour
éviter les écrasements pendant leur travail. Ils ne sont jamais publiés sur GitHub.

Côté élèves : **Conception → Les photos de notre labyrinthe → Retrouver les photos de notre équipe**, puis choisir
le dossier de l'équipe (celui qui contient sa sauvegarde). Le site le vérifie, affiche les photos et peut le mémoriser.
**Actualiser les photos** affiche les nouvelles prises de vue sans fermer le travail. Sans accès aux dossiers,
**Ouvrir des photos…** permet de sélectionner les images. Sur un autre poste, rouvrir le même dossier réseau.
Avec seulement des JSON importés dans l'outil professeur, la photo est téléchargée : il faut la déposer dans
le dossier de l'équipe pour qu'elle soit retrouvée par les élèves.

### Noter chaque partie ou la laisser non notée

Dans **Barème**, chaque exercice et chaque partie du carnet possède une case **Noter** et un coefficient.
Les contenus d'information restent non évalués. Le défi possède son propre choix de bonus.
Les classements et les phrases à compléter restent automatiques. Pour les autres parties, activer **Noter**, puis
ouvrir **équipe → Carnet de projet** et choisir un des quatre niveaux de maîtrise. Les choix et les niveaux sont
conservés sur le poste professeur, sans écrire dans le JSON de l'équipe. Utiliser **Exporter mes évaluations**
pour une sauvegarde durable, puis **Importer une sauvegarde** sur un autre poste. L'import fusionne les niveaux
fournis avec ceux déjà présents et reprend le barème importé ; les niveaux déjà renseignés dans la sauvegarde remplacent ceux du poste.

### Mettre à jour les exercices

**Sur le site en ligne**, à chaque ouverture, le parcours public « labyrinthe » est lu depuis Labo Blocs.
Il faut **publier le parcours dans Labo Blocs** : une modification encore dans l'éditeur ne suffit pas.
Une session déjà ouverte garde sa version jusqu'au rechargement. La dernière version compatible peut être
mémorisée dans le navigateur. Sans connexion, la copie intégrée (ou la version mémorisée) reste utilisable.
Si le nouveau parcours nécessite un moteur plus récent, l'outil professeur le signale et garde la version compatible :
il faut alors mettre à jour le module partagé depuis le dépôt Labo Blocs, puis republier le projet.

**Depuis le dossier réseau (`file://`)**, la copie intégrée sert et la mise à jour reste volontaire :

Les exercices viennent de **Labo Blocs** : le site en garde une copie, `parcours/labyrinthe.js`. Bouton
**« Exercices »** de `prof.html` : « Chercher en ligne » ou « Choisir un fichier… » (`labyrinthe-….labo-parcours.json`),
les différences s'affichent, « Valider la mise à jour » puis choisir le dossier du site ; l'ancienne version est gardée
dans `parcours/labyrinthe-precedent.js`. Le travail des élèves est protégé : blocs et réussites gardés, un exercice
modifié apparaît « à revérifier ».

---

## 5. Modifier les contenus (sans toucher au programme)

Fichiers texte du dossier du site (`site/` dans le dépôt, `labyrinthe-robotise/` dans l'archive), à ouvrir avec le
Bloc-notes. Garder les guillemets droits, les virgules, les crochets et accolades ; recharger la page (F5) après une
modification.

| Je veux modifier… | Fichier |
|---|---|
| les **onglets et parties du carnet** (textes, éléments à classer, réponses des cases à compléter, parties de 5e / 4e) | `donnees/carnet.js` (chaque type de partie est expliqué en tête du fichier) |
| le **barème** de la note | `donnees/notation.js` |
| les **niveaux** (5, 4) et le **dossier du projet** | `donnees/classes.js` |
| la **liste des classes** et le début du chemin, communs à tous les outils | Labo Blocs › « Réglages du collège » |
| le nom, les titres, la couleur du projet | `donnees/projet.js` |
| les **exercices** (consignes, broches, tests, indices, fiches « À savoir », lexique) | dans **Labo Blocs** (parcours « labyrinthe »), puis « Exercices › Mettre à jour » |

Les réponses des élèves sont rangées sous l'identifiant de chaque partie : ne pas changer un `"id"` en cours d'année.

## 6. À vérifier en classe

- Sur un poste de 5e et un de 4e : ouverture depuis le dossier réseau, choix du dossier de l'équipe, onglet Câblage.
- Envoi du programme de l'exercice 7 dans une vraie carte : les deux servomoteurs suivent le joystick, entre 60° et
  120°, dans le bon sens (sinon : inverser les deux nombres de « depuis » dans `labyrinthe` côté Labo Blocs).
- Le bouton SW sur D4 (défi) et « Vider la carte ».
- « Imprimer le gabarit » : le plateau mesure bien 16 cm sur la feuille (imprimer à 100 %, sans « ajuster à la page »).

### Croquis et dessin technique côté élèves

L’onglet **Croquis et dessin technique** rappelle le travail attendu sur papier avec deux listes à cocher :
un croquis à main levée pour expliquer l’idée, puis un dessin technique à la règle et coté pour fabriquer.
Chaque document dispose de sa galerie. Dans l’outil professeur, utiliser le type **Croquis** ou **Dessin technique**
pour classer les photos. Les images du plan et toutes les photos de l’équipe restent également accessibles dans
**Conception → Les photos de notre labyrinthe**. Les élèves ouvrent leur dossier une première fois ; **Actualiser**
relit les images sans fermer leur travail. Ces deux nouvelles parties peuvent être activées dans **Barème**
pour une évaluation manuelle sur quatre niveaux.
