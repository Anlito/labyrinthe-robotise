# Labyrinthe robotisé

<!-- suivi-maintenance:debut -->
## État du projet et améliorations documentées — 21 octobre 2026

- Le moteur, Blockly, le simulateur et le parcours sont chargés depuis Labo Blocs en ligne, sans copie embarquée ; un rechargement récupère le parcours publié.
- La page À retenir a été réorganisée pour la lisibilité, avec sommaire, rubriques et explications du ré-étalonnage.
- Les photos du plan papier et de la réalisation finale, enregistrées par le professeur dans le dossier de l’équipe, sont retrouvées dans Conception côté élève.
- Ouvrir notre équipe donne accès à la sauvegarde et aux images avec un même choix de dossier. Le navigateur peut demander de renouveler son autorisation.
- Le barème permet de choisir les parties notées et les coefficients ; les parties manuelles utilisent quatre niveaux de maîtrise. Les évaluations professeur sont sauvegardables et exportables séparément des fichiers élèves.
- La rubrique Croquis et dessin technique ajoutée par erreur a été retirée : ce projet utilise Plan du labyrinthe et Réalisation finale.
- Le carnet et les réglages du projet restent dans site/donnees/ ; les exercices se modifient dans le parcours labyrinthe de Labo Blocs. Les tests et contrôles navigateur ont été réalisés lors des améliorations précédentes.

### Référence locale et maintenance

Dossier de travail de référence : **Documents/LabyrintheRobotise**. Dépôt : [Anlito/labyrinthe-robotise](https://github.com/Anlito/labyrinthe-robotise). La branche principale est **main**. Les copies temporaires d’un chat ou les worktrees servent au travail intermédiaire ; elles ne remplacent pas ce dossier.

À chaque intervention :

1. Vérifier les modifications locales et la version publiée avant de commencer ; sauvegarder le travail non enregistré.
2. Décrire dans ce README les améliorations, les vérifications, les limites et les opérations restantes.
3. Publier les changements autorisés, puis synchroniser le dossier local de référence avec le même commit.
4. Contrôler le commit local, le commit distant et les fichiers restants avant d’annoncer que le projet est à jour. Signaler explicitement tout décalage ou travail conservé hors publication.

Cette règle permet de reprendre le projet dans un autre outil local sans perdre les dernières améliorations. Une publication du site ne met pas automatiquement à jour les dossiers du PC.

<!-- suivi-maintenance:fin -->

Carnet de projet des classes de 5e et 4e.

Le moteur, Blockly, le simulateur et le parcours sont chargés depuis Labo Blocs en ligne, sans copie dans ce dépôt. Une connexion Internet est nécessaire, même depuis le ZIP. Les JSON élèves, photos et évaluations restent propres au projet.

Élèves : https://anlito.github.io/labyrinthe-robotise/ · Professeur : prof.html

`npm test` télécharge les dépendances publiques dans `.cache/` (ignoré par Git et exclu du site) puis lance les tests. `npm run archive` crée le ZIP léger. `npm start` lance le serveur local.

Les contenus du carnet, les niveaux, le barème et les réglages du projet restent dans `site/donnees/`. Les sources de programmation sont exclusivement dans Labo Blocs.
