# Projet Labyrinthe robotisé

Carnet de projet numérique du Labyrinthe robotisé (technologie, 5e et 4e) : les élèves y comprennent le système
(joystick, Arduino Uno, deux servomoteurs), retrouvent ou réalisent le câblage, programment en blocs avec
[Labo Blocs](https://github.com/Anlito/labo-blocs) (simulateur, vérification, envoi dans la carte), dessinent et
essaient leur plateau (« Mon labyrinthe »), puis font le bilan. Sans compte ni serveur : le travail de chaque équipe
tient dans un fichier `.json` enregistré dans son dossier réseau.

En ligne : https://anlito.github.io/labyrinthe-robotise/ (élèves) · `prof.html` (professeur)

- `site/index.html` : carnet des élèves (`?enseignant=1` : mode enseignant)
- `site/prof.html` : outil professeur (suivi en direct, alertes, note, carnet de chaque équipe, exports, photo des croquis)
- **Pour le professeur** : [LISEZ-MOI.md](LISEZ-MOI.md) (matériel, utilisation, note, modification des contenus).
- Modèle : l'atelier du distributeur de céréales ([Anlito/atelier-cereales](https://github.com/Anlito/atelier-cereales)) ;
  liaison à Labo Blocs : [docs/BRIEF-LABO-BLOCS.md](docs/BRIEF-LABO-BLOCS.md).

## Organisation

| Dossier | Contenu |
|---|---|
| `site/vendor/labo-blocs/` | **module de Labo Blocs** 0.4.0 (copié depuis le dépôt labo-blocs, ne pas modifier ici) |
| `site/parcours/` | `labyrinthe.js` : les 8 exercices, leurs fiches et le lexique, venus de Labo Blocs |
| `site/donnees/` | `projet.js` (identité du projet, lue partout), `carnet.js` (onglets et parties typées, parties de 5e / 4e), `notation.js` (barème), `classes.js` (niveaux, dossier), `college.js` (copie de secours des réglages du collège) |
| `site/js/moteur/` | moteur, aussi exécuté sous Node : catalogue, progression, carnet (états, corrections, avancement par niveau), notation, tableau de classe, export Excel |
| `site/js/labyrinthe/` | « Mon labyrinthe » : modèle (plan, vérifications), dessin SVG, physique de la bille, écran |
| `site/js/` | interface : accueil, fichiers, carnet, exercices (écran de Labo Blocs), outil professeur, mise à jour des exercices |
| `tests/` | tests Node (`node:test`) |
| `tools/` | serveur local, recette dans de vrais navigateurs, archive ZIP, équipes d'exemple (fictives), carte Arduino virtuelle |

Les fichiers de `site/parcours/` et `site/donnees/` sont des scripts (`definirXxx({...})`) et non du JSON pur, pour que
le site fonctionne aussi ouvert directement depuis un dossier (`file://`). Tout le code est en scripts classiques.

## Charte graphique

Les interfaces élève et professeur reprennent la présentation « Labyrinthe RETRO » : bleu nuit
`#1A1A2E`, jaune `#FFD60A`, bleu vif `#0A84FF`, liseré multicolore, titres Trebuchet MS et texte Arial.
Les espaces de lecture restent clairs. Les boutons utilisent un bleu plus sombre pour assurer le contraste.

Le thème commun est dans `site/css/retro.css`, chargé après les autres feuilles de style dans les trois pages.
Il adapte aussi les variables visuelles de Labo Blocs, sans modifier `site/vendor/labo-blocs/` ni les couleurs
des blocs de programmation. L'icône du projet est dans `site/img/favicon.svg`.

## Commandes

```bash
npm install          # puppeteer-core (recette)
npm run labo-blocs   # recopie le module de Labo Blocs (dépôt labo-blocs à côté de celui-ci) dans site/vendor
npm test             # tests du moteur, du carnet, de la notation, des données, des exercices, du labyrinthe
npm start            # http://localhost:8080
npm run recette      # critères dans Chrome/Edge (file:// et serveur) → RECETTE-AUTO.md
npm run exemples     # équipes d'exemple fictives (5e et 4e) dans exemples/
npm run archive      # dist/labyrinthe-robotise.zip (site + LISEZ-MOI)
```

## Publication

Chaque envoi sur `main` lance les tests puis publie `site/` sur GitHub Pages (`.github/workflows/pages.yml`).
Dans les réglages du dépôt : *Settings › Pages › Source : GitHub Actions*.
