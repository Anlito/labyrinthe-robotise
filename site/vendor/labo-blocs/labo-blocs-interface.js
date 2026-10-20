// Labo Blocs 0.4.0 — interface. Fichier construit par « npm run module » : ne pas modifier ici.
// ===== interface/gabarits.js =====
// Gabarits HTML des écrans partagés : le bandeau et l'écran d'exercice (A4, A5). Le site de Labo Blocs et les
// projets (distributeur de céréales…) affichent ainsi exactement le même écran.
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});

  const BANDEAU = `<header class="bandeau">
  <div class="bandeau-accent"></div>
  <div class="bandeau-barre">
    <img class="logo" alt="" width="34" height="34">
    <div class="bandeau-titre">
      <strong class="titre-projet"></strong>
      <span class="equipe-texte"></span>
    </div>
    <button type="button" class="btn-onglet btn-vers-parcours" hidden><span data-icone="retour" data-epaisseur="2.8"></span>Parcours</button>
    <div class="bandeau-avancement" hidden>
      <span class="avancement-texte"></span>
      <div class="segments" role="img"></div>
    </div>
    <span class="espace"></span>
    <button type="button" class="btn-onglet btn-plein-ecran" hidden><span data-icone="pleinEcran" data-epaisseur="2.4"></span><span class="texte-plein-ecran">Plein écran</span></button>
    <span class="etat-enregistrement" aria-live="polite" hidden></span>
    <button type="button" class="btn-onglet btn-enregistrer" hidden><span data-icone="disquette" data-epaisseur="2.4"></span>Enregistrer</button>
  </div>
</header>`;

  const EXERCICE = `<div class="ecran ecran-exercice" hidden>
  <section class="carte consigne" aria-label="Consigne">
    <div class="consigne-tete">
      <span class="consigne-numero"></span>
      <h1 class="titre-exercice"></h1>
      <div class="consigne-actions">
        <button type="button" class="btn-aide" data-aide="fiche" aria-expanded="false"><span data-icone="info"></span>À savoir</button>
        <button type="button" class="btn-aide btn-lexique"><span data-icone="livre"></span>Lexique</button>
        <button type="button" class="btn-reduire-consigne" aria-expanded="true"><span class="texte-reduire">Masquer le texte</span></button>
      </div>
    </div>
    <div class="consigne-texte"></div>
    <div class="bulle" role="dialog" aria-label="Définition" hidden>
      <div class="bulle-entete"><strong class="bulle-mot"></strong><button type="button" class="bulle-fermer" aria-label="Fermer">×</button></div>
      <p class="bulle-definition"></p>
    </div>
  </section>

  <aside class="colonne-aide">
    <button type="button" class="bande-repliee" data-colonne="gauche" aria-expanded="false" title="Afficher les composants et l’aide">
      <span data-icone="chevronDroite" data-epaisseur="2.8"></span><span class="bande-texte">Composants et aide</span>
    </button>
    <section class="carte carte-aide" aria-label="Indices">
      <div class="aide-tete"><h2>Besoin d’aide ?</h2><span class="compteur compteur-indices"></span></div>
      <p class="aide-texte">Les indices s’ouvrent un par un. Ton professeur voit combien tu en as utilisé.</p>
      <button type="button" class="btn-secondaire btn-indice" data-aide="indice" aria-expanded="false"><span data-icone="ampoule"></span><span class="texte-indice">Ouvrir l’indice 1</span></button>
    </section>
    <section class="carte composants-liste" aria-label="Composants">
      <h2>Composants</h2>
      <ul class="liste-composants"></ul>
      <p class="composants-note" hidden></p>
    </section>
  </aside>

  <main class="colonne-programme">
    <div class="programme-tete">
      <h2>Mon programme</h2>
      <button type="button" class="btn-onglet btn-solution" hidden title="Remplacer le programme affiché par la solution de référence"><span data-icone="oeil" data-epaisseur="2.4"></span>Solution</button>
      <div class="niveaux" role="group" aria-label="Niveau">
        <span class="niveaux-libelle">Niveau</span>
        <button type="button" class="btn-niveau" data-niveau="1" aria-pressed="true">1 · Premiers pas</button>
        <button type="button" class="btn-niveau" data-niveau="2" aria-pressed="false">2 · Boucles</button>
        <button type="button" class="btn-niveau" data-niveau="3" aria-pressed="false">3 · Code</button>
      </div>
    </div>
    <section class="editeur" aria-label="Éditeur de blocs">
      <div class="editeur-blockly"></div>
      <div class="editeur-etiquettes" aria-hidden="true"></div>
      <aside class="panneau-aide" aria-labelledby="titre-aide" hidden>
        <div class="panneau-aide-entete">
          <span class="panneau-aide-icone"></span>
          <h2 class="panneau-aide-titre" id="titre-aide"></h2>
          <button type="button" class="panneau-aide-fermer" aria-label="Fermer">×</button>
        </div>
        <div class="panneau-aide-corps"></div>
      </aside>
      <div class="editeur-outils">
        <div class="groupe-outils">
          <button type="button" class="btn-annuler" aria-label="Annuler" title="Annuler (Ctrl+Z)"><span data-icone="annuler"></span></button>
          <button type="button" class="btn-retablir" aria-label="Rétablir" title="Rétablir (Ctrl+Y)"><span data-icone="retablir"></span></button>
        </div>
        <div class="groupe-outils">
          <button type="button" class="btn-zoom-moins" aria-label="Dézoomer">−</button>
          <span class="zoom-valeur">100 %</span>
          <button type="button" class="btn-zoom-plus" aria-label="Zoomer">+</button>
        </div>
        <div class="groupe-outils">
          <button type="button" class="btn-recentrer" aria-label="Recentrer" title="Recentrer"><span data-icone="recentrer"></span></button>
        </div>
        <div class="groupe-outils">
          <button type="button" class="btn-commentaire" title="Ajouter un commentaire : sur le bloc choisi, sinon une note dans l’espace des blocs"><span data-icone="commentaire"></span>Commentaire</button>
        </div>
      </div>
    </section>
    <section class="code-arduino" aria-label="Code Arduino" hidden>
      <div class="code-tete"><strong>Code Arduino · niveau 3, lecture seule</strong><span>Clique sur un bloc : ses lignes se surlignent</span></div>
      <pre class="code-lignes"></pre>
    </section>
    <!-- Languettes sur les bords : replier ou rouvrir la colonne voisine -->
    <button type="button" class="btn-plier" data-colonne="gauche" aria-expanded="true" title="Replier les composants et l’aide pour agrandir le programme">
      <span data-icone="chevronGauche" data-epaisseur="2.8"></span><span class="texte-plier">Replier les composants et l’aide</span>
    </button>
    <button type="button" class="btn-plier" data-colonne="droite" aria-expanded="true" title="Replier le simulateur pour agrandir le programme">
      <span class="texte-plier">Replier le simulateur</span><span data-icone="chevronDroite" data-epaisseur="2.8"></span>
    </button>
  </main>

  <aside class="colonne-test">
    <button type="button" class="bande-repliee" data-colonne="droite" aria-expanded="false" title="Afficher le simulateur">
      <span data-icone="chevronGauche" data-epaisseur="2.8"></span><span class="bande-texte">Tester et vérifier</span>
    </button>
    <section class="carte simulateur" aria-label="Tester">
      <div class="simu-titre">
        <span>Tester</span>
        <div class="modes" role="group" aria-label="Mode">
          <button type="button" class="btn-mode" data-mode="simulateur" aria-pressed="true">Simulateur</button>
          <button type="button" class="btn-mode" data-mode="direct" aria-pressed="false" hidden>En direct</button>
          <button type="button" class="btn-mode" data-mode="carte" aria-pressed="false" hidden>Dans la carte</button>
        </div>
      </div>
      <div class="panneau-carte" aria-live="polite" hidden></div>
      <div class="simu-carte"></div>
      <div class="simu-milieu">
        <div class="simu-composants"></div>
        <div class="simu-distributeur"></div>
      </div>
      <div class="simu-ligne">
        <span class="simu-note" aria-live="polite"></span>
        <div class="chrono" aria-label="Temps de la simulation"><span data-icone="horloge" data-epaisseur="2.4"></span><span class="chrono-valeur">00:00</span></div>
      </div>
      <p class="simu-clavier" hidden></p>
      <div class="simu-commandes">
        <button type="button" class="btn-lancer" aria-pressed="false"><span data-icone="lecture"></span>Lancer</button>
        <button type="button" class="btn-commande btn-pause" disabled><span data-icone="pause" data-epaisseur="3.4"></span>Pause</button>
        <button type="button" class="btn-commande btn-pas" title="Pas à pas : un bloc à la fois"><span data-icone="pas" data-epaisseur="2.6"></span>Pas</button>
        <button type="button" class="btn-commande btn-recommencer" disabled aria-label="Recommencer"><span data-icone="recommencer" data-epaisseur="2.8"></span></button>
        <div class="vitesse" role="group" aria-label="Vitesse">
          <button type="button" class="btn-vitesse" data-vitesse="1" aria-pressed="true">×1</button>
          <button type="button" class="btn-vitesse" data-vitesse="2" aria-pressed="false">×2</button>
          <button type="button" class="btn-vitesse" data-vitesse="5" aria-pressed="false">×5</button>
        </div>
      </div>
    </section>
    <section class="carte camera-ia" aria-label="Caméra et IA" hidden></section>
    <section class="carte verification">
      <button type="button" class="btn-verifier"><span data-icone="coche"></span>Vérifier mon programme</button>
      <button type="button" class="btn-verifier btn-terminer" hidden><span data-icone="coche"></span>J’ai terminé</button>
      <div class="resultat" role="status" aria-live="polite" hidden></div>
    </section>
  </aside>

  <dialog class="dialogue-lexique" aria-label="Lexique">
    <div class="dialogue-entete">
      <span data-icone="livre" data-epaisseur="2.4"></span>
      <strong>Lexique</strong>
      <button type="button" class="btn-fermer-lexique" aria-label="Fermer">×</button>
    </div>
    <div class="lexique-outils">
      <input type="search" class="lexique-recherche" placeholder="Chercher un mot…" aria-label="Chercher un mot">
      <label class="lexique-filtre"><input type="checkbox" class="lexique-vus"> Mots déjà vus</label>
    </div>
    <div class="lexique-grille" aria-live="polite"></div>
  </dialog>
</div>`;

  const GABARITS = { bandeau: BANDEAU, exercice: EXERCICE };

  // Remplace chaque élément <… data-gabarit="nom"> de la racine par son gabarit.
  function poserGabarits(racine) {
    for (const el of racine.querySelectorAll('[data-gabarit]')) el.outerHTML = GABARITS[el.dataset.gabarit];
  }

  Object.assign(A, { GABARITS, poserGabarits });
})(this);

// ===== interface/icones.js =====
// Icônes en trait épais (d'après les maquettes Claude Design). Chaque icône est un chemin SVG 24×24.
(function (global) {
  'use strict';

  const CHEMINS = {
    retour: 'M15 5l-7 7 7 7',
    equipe: 'M9 4.5a3.5 3.5 0 1 0 0.01 0zM2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2',
    crayon: 'M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3',
    livre: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5',
    chevronHaut: 'M6 15l6-6 6 6',
    chevronBas: 'M6 9l6 6 6-6',
    chevronGauche: 'M15 6l-6 6 6 6',
    chevronDroite: 'M9 6l6 6-6 6',
    horloge: 'M12 5a8 8 0 1 0 0.01 0zM12 9v4l2.5 2M9.5 2.5h5',
    pause: 'M8 5v14M16 5v14',
    recommencer: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
    info: 'M12 3a9 9 0 1 0 0.01 0zM12 11v6M12 7.5v.5',
    ampoule: 'M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.8-1.5 1.8-1.5 3.5h-4c0-1.7-.6-2.7-1.5-3.5z',
    disquette: 'M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7',
    coche: 'M12 3a9 9 0 1 0 0.01 0zM8 12.5l2.8 2.8L16.5 9.5',
    corbeille: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5',
    annuler: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
    retablir: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
    recentrer: 'M12 8a4 4 0 1 0 0.01 0zM12 2v3M12 19v3M2 12h3M19 12h3',
    pas: 'M6 5v14M10 5l9 7-9 7z',
    oeil: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0.01 0z',
    camera: 'M3 8h3l2-3h8l2 3h3v11H3zM12 10a3.5 3.5 0 1 0 0.01 0z',
    clavier: 'M2 6h20v12H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10',
    commentaire: 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5',
    joystick: 'M5 21h14v-4H5zM12 17V10M12 4a3 3 0 1 0 0.01 0z',
    suivant: 'M9 5l7 7-7 7',
    // Catégories de blocs
    lumiere: 'M8 15V10a4 4 0 0 1 8 0v5zM6 15h12M10 15v5M14 15v4',
    temps: 'M12 3.5a8.5 8.5 0 1 0 0.01 0zM12 7.5V12l3 2',
    bouton: 'M4 14h16v6H4zM8 14v-3a4 4 0 0 1 8 0v3',
    moteur: 'M4 12h16v8H4zM8 12V8M5 8h14',
    decisions: 'M12 3l9 9-9 9-9-9zM12 8v5M12 16v.5',
    variables: 'M5 8h14v12H5zM8 8V5h8v3M9 13h6',
    evenements: 'M5 21V4M5 4h11l-2 4 2 4H5',
    boucles: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
    calculs: 'M5 8h6M8 5v6M14 8h6M5 16h6M14 14h6M14 18h6',
    son: 'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
    puzzle: 'M10 4a2 2 0 114 0v2h4a1 1 0 011 1v4h-2a2 2 0 100 4h2v4a1 1 0 01-1 1h-4v-2a2 2 0 10-4 0v2H6a1 1 0 01-1-1v-4h2a2 2 0 100-4H5V7a1 1 0 011-1h4V4z',
    dossier: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    importer: 'M12 15V4M7 9l5-5 5 5M5 20h14',
    telecharger: 'M12 4v11M7 10l5 5 5-5M5 20h14',
    imprimer: 'M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z',
    reglages: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4',
    alerte: 'M12 3l9.5 16.5h-19zM12 10v4M12 17.5v.01',
    cadenas: 'M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3',
    pleinEcran: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
    quitterPleinEcran: 'M9 4v5H4M15 4v5h5M20 15h-5v5M4 15h5v5',
  };

  // <svg> prêt à insérer dans du HTML.
  function icone(nom, options) {
    const o = options || {};
    const epaisseur = o.epaisseur || 2.6;
    const couleur = o.couleur || 'currentColor';
    return (
      `<svg class="icone ${o.classe || ''}" viewBox="0 0 24 24" aria-hidden="true" ` +
      `style="fill:none;stroke:${couleur};stroke-width:${epaisseur};stroke-linecap:round;stroke-linejoin:round">` +
      `<path d="${CHEMINS[nom]}"></path></svg>`
    );
  }

  // Icône pleine « lecture » (triangle).
  const LECTURE = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor"><path d="M7 4.5v15l12-7.5z"></path></svg>';

  // Image data: URI (pour les blocs Blockly et les tuiles de catégorie).
  function imageIcone(nom, couleur, epaisseur) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${couleur || '#1F2A30'}" ` +
      `stroke-width="${epaisseur || 2.4}" stroke-linecap="round" stroke-linejoin="round"><path d="${CHEMINS[nom]}"/></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  global.LaboBlocs = global.LaboBlocs || {};
  Object.assign(global.LaboBlocs, { icone, imageIcone, LECTURE, CHEMINS_ICONES: CHEMINS });
})(this);

// ===== interface/blocs.js =====
// Blocs Blockly en français (libellés de Vittascience), thème de l'atelier du distributeur (décision du 14/10/2026 :
// même rendu pour tous les projets) et palette limitée aux blocs autorisés par l'exercice.
// Un bloc ne dépend jamais d'un projet : seule la liste des blocs proposés change.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  // Directions du joystick dans les menus (« le joystick est poussé vers le haut », « … est au centre »).
  const DIRECTIONS_JOYSTICK = [['poussé vers le haut', 'haut'], ['poussé vers le bas', 'bas'], ['poussé vers la gauche', 'gauche'], ['poussé vers la droite', 'droite'], ['au centre', 'centre']];

  // Familles de blocs : couleur pastel soutenu en aplat, texte foncé (maquette 3b).
  const COULEURS = {
    debut: '#86C595',
    lumiere: '#F7AE5E',
    decision: '#F7AE5E',
    bleu: '#78B5D6',
    valeur: '#BCDAEB',
    servo: '#E78AB3',
    variable: '#EC8780',
    extension: '#C3B1E1', // blocs d'une carte ou d'une extension (mBot, micro:bit…) : lilas, pictogramme puzzle
  };

  // Broches proposées dans les menus.
  // Toutes les broches numériques D2 à D13 pour les LED et les boutons : c'est à l'élève de lire la consigne
  // et de choisir la bonne (le bloc de la palette part toujours de D2, il ne donne pas la réponse).
  const BROCHES_NUMERIQUES = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'];
  const BROCHES_LED = BROCHES_NUMERIQUES;
  const BROCHES_BOUTON = BROCHES_NUMERIQUES;
  const BROCHES_SERVO = ['D5', 'D6'];
  const menu = (liste) => liste.map((b) => [b, b]);
  // Broches de la carte de l'exercice (A.carteCourante, réglée à l'ouverture de l'exercice) : D2…D13 pour l'Uno,
  // P0…P2 pour la micro:bit. Sans carte connue : celles de l'Uno.
  function brochesCarte(type) {
    const p = A.profil ? A.profil(A.carteCourante) : null;
    const liste = p && p.broches[type] && p.broches[type].length ? p.broches[type] : { led: BROCHES_LED, bouton: BROCHES_BOUTON, servo: BROCHES_SERVO, buzzer: BROCHES_NUMERIQUES }[type];
    return menu(liste);
  }
  // Pour une LED, on dit aussi ce que fait l'état : HAUT = allumée, BAS = éteinte.
  const HAUT_BAS_LED = [
    ['HAUT (1) : allumée', '1'],
    ['BAS (0) : éteinte', '0'],
  ];
  const HAUT_BAS = [
    ['HAUT (1)', '1'],
    ['BAS (0)', '0'],
  ];

  const image = (nom, alt) => ({ type: 'field_image', src: A.imageIcone(nom, '#1F2A30', 2.6), width: 22, height: 22, alt });

  const DEFINITIONS = [
    {
      type: 'demarrage',
      message0: 'Au démarrage %1 %2',
      args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent une seule fois, au démarrage de la carte.',
    },
    {
      type: 'boucle',
      message0: 'Répéter indéfiniment %1 %2',
      args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      style: 'debut',
      tooltip: 'Les blocs placés ici recommencent sans fin, de haut en bas.',
    },
    {
      type: 'led_etat',
      message0: '%1 contrôler la LED à l’état %2 sur la broche %3',
      args0: [
        image('lumiere', 'LED'),
        { type: 'field_dropdown', name: 'ETAT', options: HAUT_BAS },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_LED) },
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'lumiere',
      tooltip: 'HAUT : la LED s’allume. BAS : elle s’éteint.',
    },
    {
      type: 'attendre',
      message0: 'attendre %1 seconde(s)',
      args0: [{ type: 'input_value', name: 'DUREE', check: 'Number' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'bleu',
      tooltip: 'La carte attend avant de passer au bloc suivant. On peut écrire 0.5 pour une demi-seconde.',
    },
    {
      type: 'bouton_etat',
      message0: '%1 état sur la broche %2',
      args0: [image('bouton', 'Module bouton'), { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_BOUTON) }],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'Donne HAUT (1) si le bouton est appuyé, BAS (0) sinon.',
    },
    // Joystick (composant de l'exercice : ses broches X, Y et bouton sont dans « Composants »).
    {
      type: 'joystick_position',
      message0: '%1 position du joystick sur %2',
      args0: [image('joystick', 'Joystick'), { type: 'field_dropdown', name: 'AXE', options: [['X (gauche – droite)', 'x'], ['Y (bas – haut)', 'y']] }],
      output: 'Number',
      style: 'valeur',
      tooltip: 'De -100 (tout à gauche, tout en bas) à 100 (tout à droite, tout en haut) ; 0 au centre.',
    },
    {
      type: 'joystick_valeur',
      message0: '%1 valeur du joystick sur %2 (0 à 1023)',
      args0: [image('joystick', 'Joystick'), { type: 'field_dropdown', name: 'AXE', options: [['X (gauche – droite)', 'x'], ['Y (bas – haut)', 'y']] }],
      output: 'Number',
      style: 'valeur',
      tooltip: 'La valeur lue sur la broche analogique de cet axe : de 0 à 1023, environ 512 au centre.',
    },
    {
      type: 'joystick_direction',
      message0: '%1 le joystick est %2',
      args0: [image('joystick', 'Joystick'), { type: 'field_dropdown', name: 'DIRECTION', options: DIRECTIONS_JOYSTICK }],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'Vrai quand le joystick est poussé dans cette direction (au-delà de la moitié de sa course).',
    },
    {
      type: 'joystick_bouton',
      message0: '%1 le bouton du joystick est appuyé',
      args0: [image('joystick', 'Joystick')],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'Vrai quand on enfonce le manche du joystick.',
    },
    {
      type: 'quand_joystick',
      message0: '%1 quand le joystick est %2 %3 %4',
      args0: [image('joystick', 'Joystick'), { type: 'field_dropdown', name: 'DIRECTION', options: DIRECTIONS_JOYSTICK }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent une fois chaque fois que le joystick arrive dans cette direction, en même temps que « Répéter indéfiniment ».',
    },
    {
      type: 'valeur_haut_bas',
      message0: '%1',
      args0: [{ type: 'field_dropdown', name: 'VALEUR', options: HAUT_BAS }],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'HAUT (1) ou BAS (0).',
    },
    {
      type: 'comparaison',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A' },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['=', 'EQ'],
            ['≠', 'NEQ'],
            ['<', 'LT'],
            ['≤', 'LTE'],
            ['>', 'GT'],
            ['≥', 'GTE'],
          ],
        },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'bleu',
      tooltip: '« = » : les deux valeurs sont égales. « ≠ » : elles sont différentes. « < » : plus petite, « > » : plus grande.',
    },
    {
      type: 'quand_bouton',
      message0: '%1 quand le bouton de la broche %2 est %3 %4 %5',
      args0: [
        image('bouton', 'Bouton'),
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_BOUTON) },
        { type: 'field_dropdown', name: 'FRONT', options: [['appuyé', 'appui'], ['relâché', 'relache']] },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' },
      ],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent à chaque appui (ou relâchement), en même temps que « Répéter indéfiniment ».',
    },
    {
      // Caméra et IA (jalon 6) : l'étiquette vient de l'exercice ouvert (menu A.optionsEtiquettes, 0 = rien).
      type: 'quand_camera',
      message0: '%1 quand la caméra %2 %3 %4 %5',
      args0: [
        image('camera', 'Caméra'),
        { type: 'field_dropdown', name: 'FRONT', options: [['reconnaît', 'voit'], ['ne reconnaît plus', 'plus']] },
        { type: 'field_dropdown', name: 'ETIQUETTE', options: () => A.optionsEtiquettes() },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' },
      ],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent une fois chaque fois que l’IA de la caméra se met à reconnaître (ou cesse de reconnaître) cette étiquette.',
    },
    {
      // Clavier de l'ordinateur : simulateur et mode « En direct » (pas « Dans la carte »).
      type: 'quand_touche',
      message0: '%1 quand la touche %2 est %3 %4 %5',
      args0: [
        image('clavier', 'Clavier'),
        { type: 'field_dropdown', name: 'TOUCHE', options: A.TOUCHES || [['espace', 'espace']] },
        { type: 'field_dropdown', name: 'FRONT', options: [['appuyée', 'appui'], ['relâchée', 'relache']] },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' },
      ],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent une fois à chaque appui (ou relâchement) sur cette touche du clavier de l’ordinateur. Simulateur et mode « En direct » seulement.',
    },
    {
      type: 'repeter_n',
      message0: 'répéter %1 fois %2 %3',
      args0: [{ type: 'input_value', name: 'FOIS', check: 'Number' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Les blocs à l’intérieur s’exécutent ce nombre de fois, puis le programme continue.',
    },
    {
      type: 'tant_que',
      message0: 'tant que %1 répéter %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Tant que la condition est vraie, les blocs à l’intérieur recommencent.',
    },
    {
      type: 'repeter_jusqua',
      message0: 'répéter jusqu’à %1 %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Les blocs à l’intérieur recommencent jusqu’à ce que la condition devienne vraie.',
    },
    {
      type: 'operation',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A', check: 'Number' },
        { type: 'field_dropdown', name: 'OP', options: [['+', 'ADD'], ['−', 'SUB'], ['×', 'MUL'], ['÷', 'DIV'], ['reste de ÷', 'MOD']] },
        { type: 'input_value', name: 'B', check: 'Number' },
      ],
      inputsInline: true,
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un calcul avec deux nombres.',
    },
    {
      type: 'hasard',
      message0: 'nombre au hasard entre %1 et %2',
      args0: [
        { type: 'input_value', name: 'MIN', check: 'Number' },
        { type: 'input_value', name: 'MAX', check: 'Number' },
      ],
      inputsInline: true,
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un nombre entier tiré au hasard, bornes comprises.',
    },
    {
      type: 'reetalonner',
      message0: 'ré-étalonner %1 depuis ( %2 , %3 ) vers ( %4 , %5 )',
      args0: [
        { type: 'input_value', name: 'VALEUR', check: 'Number' },
        { type: 'input_value', name: 'DE_MIN', check: 'Number' },
        { type: 'input_value', name: 'DE_MAX', check: 'Number' },
        { type: 'input_value', name: 'VERS_MIN', check: 'Number' },
        { type: 'input_value', name: 'VERS_MAX', check: 'Number' },
      ],
      inputsInline: true,
      output: 'Number',
      style: 'bleu',
      tooltip: 'Passe une valeur d’une échelle à une autre en gardant les proportions (ex. joystick 0 à 1023 → angle 0 à 180°). Le résultat est arrondi à l’entier.',
    },
    {
      type: 'logique',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A', check: 'Boolean' },
        { type: 'field_dropdown', name: 'OP', options: [['et', 'ET'], ['ou', 'OU']] },
        { type: 'input_value', name: 'B', check: 'Boolean' },
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'bleu',
      tooltip: '« et » : les deux conditions sont vraies. « ou » : au moins une est vraie.',
    },
    {
      type: 'non',
      message0: 'non %1',
      args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }],
      output: 'Boolean',
      style: 'bleu',
      tooltip: 'Vrai si la condition est fausse.',
    },
    {
      type: 'ajouter_a',
      message0: 'ajouter à %1 la valeur %2',
      args0: [
        { type: 'field_dropdown', name: 'VAR', options: [['CHOIX', 'CHOIX']] },
        { type: 'input_value', name: 'VALEUR', check: 'Number' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'variable',
      tooltip: 'Augmente la valeur rangée dans la boîte (ou la diminue avec un nombre négatif).',
    },
    {
      type: 'son',
      message0: '%1 jouer la note %2 Hz pendant %3 s sur la broche %4',
      args0: [
        image('son', 'Buzzer'),
        { type: 'input_value', name: 'FREQUENCE', check: 'Number' },
        { type: 'input_value', name: 'DUREE', check: 'Number' },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_NUMERIQUES) },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'lumiere',
      tooltip: 'Le buzzer joue une note (440 Hz = la). Le programme continue sans attendre la fin de la note.',
    },
    {
      type: 'si_alors',
      message0: 'si %1 alors %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'ALORS' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Si la condition est vraie, alors les blocs à l’intérieur s’exécutent.',
    },
    {
      type: 'si_sinon',
      message0: 'si %1 alors %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'ALORS' }],
      message1: 'sinon %1',
      args1: [{ type: 'input_statement', name: 'SINON' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Si la condition est vraie, les blocs de « alors » s’exécutent. Sinon, ceux de « sinon ».',
    },
    {
      type: 'servo_angle',
      message0: '%1 contrôler l’angle à %2 ° sur la broche %3',
      args0: [
        image('moteur', 'Servomoteur'),
        { type: 'input_value', name: 'ANGLE', check: 'Number' },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_SERVO) },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'servo',
      tooltip: 'Le servomoteur tourne jusqu’à l’angle choisi, entre 0° et 180°.',
    },
    {
      type: 'affecter',
      message0: 'affecter à %1 la valeur %2',
      args0: [
        { type: 'field_dropdown', name: 'VAR', options: [['CHOIX', 'CHOIX']] },
        { type: 'input_value', name: 'VALEUR', check: 'Number' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'variable',
      tooltip: 'Range une valeur dans la variable choisie (une boîte qui garde un nombre).',
    },
    {
      type: 'variable',
      message0: '%1',
      args0: [{ type: 'field_label_serializable', name: 'VAR', text: 'CHOIX' }],
      output: 'Number',
      style: 'variable',
      tooltip: 'La valeur rangée dans la variable choisie.',
    },
    {
      type: 'nombre',
      message0: '%1',
      args0: [{ type: 'field_number', name: 'NUM', value: 0 }],
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un nombre. Les nombres à virgule s’écrivent avec un point : 0.5',
    },
  ];

  // Blocs des cartes (mBot, micro:bit), décrits dans noyau/cartes.js.
  for (const [type, d] of Object.entries(A.BLOCS_CARTES || {})) {
    const args = [d.categorie === 'camera' ? image('camera', 'Caméra') : d.categorie === 'clavier' ? image('clavier', 'Clavier') : image('puzzle', 'Bloc de la carte')];
    let n = 1;
    const message = d.texte.replace(/%([A-Z]+)/g, (m, nom) => {
      n++;
      if (d.champs && nom in d.champs) {
        const c = d.champs[nom];
        if (c === 'etiquette') args.push({ type: 'field_dropdown', name: nom, options: () => A.optionsEtiquettes() });
        else if (c === 'dessin' || c === 'dessin5') args.push({ type: c === 'dessin' ? 'field_dessin_matrice' : 'field_dessin_microbit', name: nom, value: (d.defauts || {})[nom] });
        else args.push(Array.isArray(c) ? { type: 'field_dropdown', name: nom, options: c } : { type: 'field_input', name: nom, text: (d.defauts || {})[nom] || '' });
      } else args.push({ type: 'input_value', name: nom, check: 'Number' });
      return '%' + n;
    });
    const def = { type, message0: '%1 ' + message, args0: args, inputsInline: true, style: 'extension', tooltip: d.texte.replace(/%[A-Z]+/g, '…') };
    if (d.sorte === 'instruction') Object.assign(def, { previousStatement: null, nextStatement: null });
    else def.output = d.sorte === 'condition' ? 'Boolean' : 'Number';
    DEFINITIONS.push(def);
  }

  // Catégories de la palette, dans l'ordre. Chaque bloc a sa forme de départ dans la palette.
  const CATEGORIES = [
    { nom: 'Événements', cle: 'evenements', couleur: COULEURS.debut, blocs: ['quand_bouton'] },
    { nom: 'Lumière', cle: 'lumiere', couleur: COULEURS.lumiere, blocs: ['led_etat'] },
    { nom: 'Son', cle: 'son', couleur: COULEURS.lumiere, blocs: ['son'] },
    { nom: 'Temps', cle: 'temps', couleur: COULEURS.bleu, blocs: ['attendre'] },
    { nom: 'Bouton', cle: 'bouton', couleur: COULEURS.bleu, blocs: ['bouton_etat', 'valeur_haut_bas'] },
    { nom: 'Joystick', cle: 'joystick', couleur: COULEURS.bleu, blocs: ['quand_joystick', 'joystick_direction', 'joystick_position', 'joystick_valeur', 'joystick_bouton'] },
    { nom: 'Moteur', cle: 'moteur', couleur: COULEURS.servo, blocs: ['servo_angle'] },
    { nom: 'Décisions', cle: 'decisions', couleur: COULEURS.decision, blocs: ['si_alors', 'si_sinon', 'comparaison', 'logique', 'non'] },
    { nom: 'Boucles', cle: 'boucles', couleur: COULEURS.decision, blocs: ['repeter_n', 'tant_que', 'repeter_jusqua'] },
    { nom: 'Calculs', cle: 'calculs', couleur: COULEURS.bleu, blocs: ['operation', 'hasard', 'reetalonner'] },
    { nom: 'Variables', cle: 'variables', couleur: COULEURS.variable, blocs: ['affecter', 'ajouter_a', 'variable', 'nombre'] },
    // Une carte à la fois : la palette d'un exercice ne montre que les blocs autorisés.
    ...(A.CATEGORIES_CARTES || []).map((c) => ({ nom: c.nom, cle: c.cle, couleur: COULEURS.extension, icone: c.cle === 'camera' || c.cle === 'clavier' ? c.cle : 'puzzle', carte: c.carte, blocs: c.cle === 'camera' ? ['quand_camera'].concat(c.blocs) : c.cle === 'clavier' ? ['quand_touche'].concat(c.blocs) : c.blocs })),
  ];

  const FORMES_PALETTE = {
    attendre: { inputs: { DUREE: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    servo_angle: { inputs: { ANGLE: { shadow: { type: 'nombre', fields: { NUM: 90 } } } } },
    affecter: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 0 } } } } },
    led_etat: { fields: { ETAT: '1', BROCHE: 'D2' } },
    quand_bouton: { fields: { BROCHE: 'D2', FRONT: 'appui' } },
    quand_camera: { fields: { FRONT: 'voit', ETIQUETTE: '1' } },
    quand_touche: { fields: { TOUCHE: 'espace', FRONT: 'appui' } },
    touche_appuyee: { fields: { TOUCHE: 'espace' } },
    repeter_n: { inputs: { FOIS: { shadow: { type: 'nombre', fields: { NUM: 3 } } } } },
    ajouter_a: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    son: { fields: { BROCHE: 'D2' }, inputs: { FREQUENCE: { shadow: { type: 'nombre', fields: { NUM: 440 } } }, DUREE: { shadow: { type: 'nombre', fields: { NUM: 0.5 } } } } },
    operation: { inputs: { A: { shadow: { type: 'nombre', fields: { NUM: 1 } } }, B: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    // Case à droite pour taper une valeur (ex. distance < 20) ; on peut y glisser un autre bloc (HAUT / BAS, variable…).
    comparaison: { inputs: { B: { shadow: { type: 'nombre', fields: { NUM: 0 } } } } },
    hasard: { inputs: { MIN: { shadow: { type: 'nombre', fields: { NUM: 1 } } }, MAX: { shadow: { type: 'nombre', fields: { NUM: 6 } } } } },
    reetalonner: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 0 } } }, DE_MIN: { shadow: { type: 'nombre', fields: { NUM: 0 } } }, DE_MAX: { shadow: { type: 'nombre', fields: { NUM: 1023 } } }, VERS_MIN: { shadow: { type: 'nombre', fields: { NUM: 0 } } }, VERS_MAX: { shadow: { type: 'nombre', fields: { NUM: 180 } } } } },
  };
  for (const [type, d] of Object.entries(A.BLOCS_CARTES || {})) {
    if (!d.entrees) continue;
    FORMES_PALETTE[type] = { inputs: {} };
    for (const [nom, v] of Object.entries(d.entrees)) FORMES_PALETTE[type].inputs[nom] = { shadow: { type: 'nombre', fields: { NUM: v } } };
  }

  // Menu des étiquettes des blocs de la caméra : celles de l'exercice ouvert (réglées par interface/camera.js et
  // l'éditeur de parcours), 0 = « rien ».
  A.etiquettesCamera = ['Rien', 'Étiquette 1', 'Étiquette 2'];
  A.optionsEtiquettes = () => A.etiquettesCamera.map((nom, n) => [n ? nom : 'rien', String(n)]);

  const SORTE_BROCHE = { led_etat: 'led', quand_bouton: 'bouton', bouton_etat: 'bouton', son: 'buzzer', servo_angle: 'servo' };

  // Variables connues de l'éditeur en cours (celles de l'exercice, celles de la sauvegarde, celles créées) : les menus
  // des blocs de variables les proposent. Réglé par l'éditeur à chaque chargement (interface/editeur.js).
  A.variablesConnues = ['CHOIX'];
  const BLOCS_VARIABLE = ['affecter', 'ajouter_a', 'variable'];
  const optionsVariables = () => (A.variablesConnues.length ? A.variablesConnues.map((n) => [n, n]) : [['?', '?']]);

  // Palette d'un exercice : seulement ses blocs autorisés ; une catégorie vide n'apparaît pas.
  //   options : { variables (noms proposés), creerVariables (bouton « Créer une variable ») }
  function palette(blocsAutorises, composants, options) {
    const o = options || {};
    const variables = o.variables || A.variablesConnues;
    const autorises = new Set(blocsAutorises || []);
    // Les blocs de la palette ne donnent pas la broche de l'exercice : l'élève la choisit en lisant la consigne.
    void composants;
    const contenu = [];
    for (const cat of CATEGORIES) {
      // Blocs de variables : seulement s'il y a au moins une variable (sinon l'élève commence par en créer une).
      const blocs = cat.blocs.filter((t) => autorises.has(t) && (!BLOCS_VARIABLE.includes(t) || variables.length));
      const bouton = cat.cle === 'variables' && o.creerVariables;
      if (!blocs.length && !bouton) continue;
      contenu.push({
        kind: 'category',
        name: cat.nom,
        categorystyle: cat.cle,
        cssConfig: {
          container: 'blocklyToolboxCategoryContainer',
          row: 'blocklyToolboxCategory cat-ligne',
          icon: `cat-tuile cat-${cat.cle}`,
          label: 'blocklyToolboxCategoryLabel cat-libelle',
          selected: 'blocklyToolboxSelected cat-choisie',
        },
        contents: (bouton ? [{ kind: 'button', text: 'Créer une variable', callbackKey: 'creerVariable' }] : []).concat(blocs.map((type) => {
          const forme = JSON.parse(JSON.stringify(FORMES_PALETTE[type] || {}));
          // Variable de départ : la dernière créée (ou la première de l'exercice).
          if (BLOCS_VARIABLE.includes(type)) forme.fields = Object.assign({}, forme.fields, { VAR: variables[variables.length - 1] });
          // Broche de départ : la première de la carte (D2 sur l'Uno, P0 sur la micro:bit), jamais celle de l'exercice.
          const sorte = SORTE_BROCHE[type];
          if (sorte && forme.fields && forme.fields.BROCHE) {
            const liste = brochesDe(A.carteCourante, sorte);
            if (!liste.includes(forme.fields.BROCHE)) forme.fields.BROCHE = liste[0];
          }
          return Object.assign({ kind: 'block', type }, forme);
        })),
      });
    }
    return { kind: 'categoryToolbox', contents: contenu };
  }

  // Champs « dessin » : l'afficheur du mBot (16 × 8 points) et l'écran de la micro:bit (5 × 5), vus en petit sur le
  // bloc. Un clic ouvre la grille : on clique (ou on glisse) sur les points pour les allumer ou les éteindre.
  // Valeurs (comme noyau/cartes.js) : mBot, 32 chiffres hexadécimaux, 2 par colonne de gauche à droite, bit 0 = point
  // du haut ; micro:bit, 25 caractères « 0 » / « 1 », ligne par ligne.
  const CHAMPS_DESSIN = {
    field_dessin_matrice: {
      largeur: 16,
      hauteur: 8,
      pas: 3.4,
      allume: '#8EC5FF',
      titre: 'Dessin de l’afficheur',
      valide: /^[0-9a-f]{32}$/i,
      // Valeur → points (ligne par ligne) et retour.
      lire: (v) => {
        const cols = A.lireDessinMatrice ? A.lireDessinMatrice(v) : new Array(16).fill(0);
        return Array.from({ length: 128 }, (_, i) => (cols[i % 16] >> Math.floor(i / 16)) & 1);
      },
      ecrire: (points) => Array.from({ length: 16 }, (_, x) => points.reduce((c, p, i) => (i % 16 === x && p ? c | (1 << Math.floor(i / 16)) : c), 0).toString(16).padStart(2, '0')).join(''),
    },
    field_dessin_microbit: {
      largeur: 5,
      hauteur: 5,
      pas: 6,
      allume: '#FF6B5E',
      taille: '2.75rem', // points plus gros : il n'y en a que 25
      titre: 'Dessin de l’écran de la micro:bit',
      valide: /^[01]{25}$/,
      lire: (v) => (A.lireDessinMicrobit ? A.lireDessinMicrobit(v) : new Array(25).fill(0)),
      ecrire: (points) => points.map((p) => (p ? '1' : '0')).join(''),
    },
  };
  function definirChampDessin(Blockly, nomChamp, d) {
    const L = d.largeur;
    const H = d.hauteur;
    const PAS = d.pas;
    const vide = d.ecrire(new Array(L * H).fill(0));
    const compter = (points) => points.reduce((t, p) => t + (p ? 1 : 0), 0);
    class ChampDessin extends Blockly.Field {
      constructor(valeur, validateur, config) {
        super(valeur || vide, validateur, config);
        this.SERIALIZABLE = true;
        this.CURSOR = 'pointer';
        this.points = [];
      }
      static fromJson(o) {
        return new ChampDessin(o.value, undefined, o);
      }
      doClassValidation_(v) {
        return d.valide.test(String(v)) ? String(v).toLowerCase() : null;
      }
      initView() {
        const svg = Blockly.utils.dom.createSvgElement;
        // Couleurs en style (le thème de Blockly colore les rectangles des champs modifiables).
        svg('rect', { x: 0, y: 0, width: L * PAS + 3, height: H * PAS + 3, rx: 3, style: 'fill: #1F2A30' }, this.fieldGroup_);
        for (let y = 0; y < H; y++)
          for (let x = 0; x < L; x++) this.points.push(svg('rect', { x: 2 + x * PAS, y: 2 + y * PAS, width: PAS - 1, height: PAS - 1, rx: 1 }, this.fieldGroup_));
        this.size_ = new Blockly.utils.Size(L * PAS + 3, H * PAS + 3);
      }
      updateSize_() {
        this.size_ = new Blockly.utils.Size(L * PAS + 3, H * PAS + 3);
      }
      render_() {
        const points = d.lire(this.getValue());
        this.points.forEach((p, i) => (p.style.fill = points[i] ? d.allume : '#3B4A52'));
        this.updateSize_();
      }
      getText_() {
        const n = compter(d.lire(this.getValue()));
        return n ? `dessin de ${n} point${n > 1 ? 's' : ''}` : 'dessin vide';
      }
      // La grille s'ouvre dans une petite fenêtre au-dessus de la page (le menu de Blockly serait coupé par la zone
      // des blocs). Échap, « Fermer » ou un clic à côté la ferme.
      showEditor_() {
        const fenetre = document.createElement('dialog');
        fenetre.className = 'blocklyDessinMatrice';
        fenetre.setAttribute('aria-label', d.titre);
        fenetre.innerHTML =
          `<p class="dessin-titre">${d.titre}</p>` +
          '<p class="dessin-aide">Clique sur les points (ou glisse) pour dessiner.</p>' +
          `<div class="dessin-grille" role="group" aria-label="${L} colonnes et ${H} lignes de points" style="--colonnes: ${L}; --allume: ${d.allume}${d.taille ? '; --case: ' + d.taille : ''}"></div>` +
          '<p class="dessin-actions"><span class="dessin-compte" aria-live="polite"></span>' +
          '<button type="button" class="dessin-effacer">Tout effacer</button><button type="button" class="dessin-fermer">Fermer</button></p>';
        const grille = fenetre.querySelector('.dessin-grille');
        const cases = [];
        let points = d.lire(this.getValue());
        let peinture = null; // allumer (true) ou éteindre (false) pendant un glissé
        const montrer = () => {
          cases.forEach((b, i) => b.setAttribute('aria-pressed', points[i] ? 'true' : 'false'));
          const n = compter(points);
          fenetre.querySelector('.dessin-compte').textContent = n ? `${n} point${n > 1 ? 's' : ''} allumé${n > 1 ? 's' : ''}` : 'Aucun point allumé';
        };
        const poser = (i, allume) => {
          points = points.slice();
          points[i] = allume ? 1 : 0;
          this.setValue(d.ecrire(points));
          montrer();
        };
        for (let y = 0; y < H; y++)
          for (let x = 0; x < L; x++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'dessin-point';
            b.setAttribute('aria-label', `point colonne ${x + 1}, ligne ${y + 1}`);
            const i = y * L + x;
            b.addEventListener('pointerdown', (e) => {
              e.preventDefault();
              // Au doigt, le point touché garde le pointeur : on le lâche pour que le glissé passe aux autres points.
              if (b.hasPointerCapture(e.pointerId)) b.releasePointerCapture(e.pointerId);
              peinture = !points[i];
              poser(i, peinture);
            });
            b.addEventListener('pointerenter', () => {
              if (peinture !== null) poser(i, peinture);
            });
            // Clavier (Entrée, Espace) : un clic sans pointeur.
            b.addEventListener('click', (e) => {
              if (e.detail === 0) poser(i, !points[i]);
            });
            cases.push(b);
            grille.appendChild(b);
          }
        const finir = () => (peinture = null);
        fenetre.addEventListener('pointerup', finir);
        grille.addEventListener('pointerleave', finir);
        fenetre.querySelector('.dessin-effacer').addEventListener('click', () => {
          points = new Array(L * H).fill(0);
          this.setValue(vide);
          montrer();
        });
        fenetre.querySelector('.dessin-fermer').addEventListener('click', () => fenetre.close());
        // Clic sur le fond (hors de la fenêtre) : fermer.
        fenetre.addEventListener('click', (e) => {
          if (e.target === fenetre) fenetre.close();
        });
        fenetre.addEventListener('close', () => fenetre.remove());
        montrer();
        document.body.appendChild(fenetre);
        fenetre.showModal();
        cases[0].focus();
      }
    }
    Blockly.fieldRegistry.register(nomChamp, ChampDessin);
  }

  let defini = false;
  function definirBlocs(Blockly) {
    if (defini) return;
    defini = true;
    for (const [nom, d] of Object.entries(CHAMPS_DESSIN)) definirChampDessin(Blockly, nom, d);
    // Commentaires : sur un bloc (clic droit › « Ajouter un commentaire ») et notes libres dans l'espace des blocs
    // (clic droit dans le vide). Les mots que la traduction française de Blockly n'a pas.
    const reg = Blockly.ContextMenuRegistry.registry;
    if (Blockly.ContextMenuItems && Blockly.ContextMenuItems.registerCommentOptions && !reg.getItem('commentCreate')) Blockly.ContextMenuItems.registerCommentOptions();
    Object.assign(Blockly.Msg, {
      COLLAPSE_COMMENT: 'Réduire le commentaire',
      EXPAND_COMMENT: 'Ouvrir le commentaire',
      COMMENT: 'Commentaire',
      WORKSPACE_COMMENT_DEFAULT_TEXT: 'Écris ton commentaire ici…',
    });
    Blockly.common.defineBlocksWithJsonArray(DEFINITIONS);
    // Menu HAUT/BAS du bloc LED : « : allumée / : éteinte » pendant les premiers exercices seulement
    // (A.aideLed est réglé à l'ouverture de chaque exercice, voir parametres.js).
    const initLed = Blockly.Blocks.led_etat.init;
    Blockly.Blocks.led_etat.init = function () {
      initLed.call(this);
      const entree = this.getField('ETAT').getParentInput();
      const rang = entree.fieldRow.findIndex((f) => f.name === 'ETAT');
      entree.removeField('ETAT');
      entree.insertFieldAt(rang, new Blockly.FieldDropdown(() => (A.aideLed ? HAUT_BAS_LED : HAUT_BAS)), 'ETAT');
    };
    // Menus de variables : celles de l'exercice et celles créées par l'élève (le bloc « valeur » aussi).
    for (const type of BLOCS_VARIABLE) {
      const init = Blockly.Blocks[type].init;
      Blockly.Blocks[type].init = function () {
        init.call(this);
        const champ = this.getField('VAR');
        const entree = champ.getParentInput();
        const rang = entree.fieldRow.indexOf(champ);
        entree.removeField('VAR');
        entree.insertFieldAt(rang, new Blockly.FieldDropdown(optionsVariables), 'VAR');
      };
    }
    // Menus de broches selon la carte de l'exercice.
    for (const [type, sorte] of [['led_etat', 'led'], ['bouton_etat', 'bouton'], ['quand_bouton', 'bouton'], ['servo_angle', 'servo'], ['son', 'buzzer']]) {
      const init = Blockly.Blocks[type].init;
      Blockly.Blocks[type].init = function () {
        init.call(this);
        const champ = this.getField('BROCHE');
        if (!champ) return;
        const entree = champ.getParentInput();
        const rang = entree.fieldRow.indexOf(champ);
        entree.removeField('BROCHE');
        entree.insertFieldAt(rang, new Blockly.FieldDropdown(() => brochesCarte(sorte)), 'BROCHE');
      };
    }
    // Pastille « ? » sur « Au démarrage » et « Répéter indéfiniment » : un clic ouvre l'explication
    // des deux blocs (A.surAideChapeau est branché par l'écran d'exercice).
    const ICONE_AIDE =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>' +
          '<text x="12" y="17" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" font-weight="800" fill="#1A6E8E">?</text></svg>',
      );
    for (const type of ['demarrage', 'boucle']) {
      const init = Blockly.Blocks[type].init;
      Blockly.Blocks[type].init = function () {
        init.call(this);
        const aide = new Blockly.FieldImage(ICONE_AIDE, 24, 24, 'Aide sur ce bloc', () => A.surAideChapeau && A.surAideChapeau(type));
        this.inputList[0].appendField(aide, 'AIDE');
      };
    }
    const style = (c) => ({ colourPrimary: c, colourSecondary: c, colourTertiary: assombrir(c) });
    const blockStyles = {};
    for (const [cle, c] of Object.entries(COULEURS)) blockStyles[cle] = style(c);
    blockStyles.debut.hat = 'cap';
    const categoryStyles = {};
    for (const cat of CATEGORIES) categoryStyles[cat.cle] = { colour: cat.couleur };
    A.themeBlockly = Blockly.Theme.defineTheme('atelier', {
      base: Blockly.Themes.Classic,
      blockStyles,
      categoryStyles,
      componentStyles: {
        workspaceBackgroundColour: '#F7FAFB',
        toolboxBackgroundColour: '#FAFBFC',
        toolboxForegroundColour: '#1F2A30',
        flyoutBackgroundColour: '#EAF0F3',
        flyoutForegroundColour: '#1F2A30',
        flyoutOpacity: 1,
        scrollbarColour: '#9AA8B0',
        insertionMarkerColour: '#1F2A30',
        insertionMarkerOpacity: 0.3,
      },
      fontStyle: { family: "'Segoe UI', system-ui, sans-serif", weight: '700', size: 12 },
      startHats: false,
    });
  }

  function assombrir(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.round(v * 0.72);
    const r = f(n >> 16);
    const g = f((n >> 8) & 255);
    const b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // Noms des blocs pour l'éditeur du professeur (cases « blocs proposés aux élèves »), dans les mots de la palette.
  const NOMS_BLOCS_BASE = {
    quand_bouton: 'quand le bouton est appuyé',
    quand_camera: 'quand la caméra reconnaît…',
    quand_touche: 'quand la touche … est appuyée',
    quand_joystick: 'quand le joystick est poussé vers …',
    joystick_direction: 'le joystick est poussé vers …',
    joystick_position: 'position du joystick (X ou Y)',
    joystick_valeur: 'valeur du joystick, 0 à 1023 (X ou Y)',
    joystick_bouton: 'le bouton du joystick est appuyé',
    led_etat: 'contrôler la LED',
    son: 'jouer une note',
    attendre: 'attendre … seconde(s)',
    bouton_etat: 'état sur la broche (bouton)',
    valeur_haut_bas: 'HAUT / BAS',
    servo_angle: 'contrôler l’angle (servomoteur)',
    si_alors: 'si … alors',
    si_sinon: 'si … alors … sinon',
    comparaison: 'comparaison (=, ≠, <, >)',
    logique: 'et / ou',
    non: 'non',
    repeter_n: 'répéter … fois',
    tant_que: 'tant que … répéter',
    repeter_jusqua: 'répéter jusqu’à',
    operation: 'calcul (+, −, ×, ÷)',
    hasard: 'nombre au hasard',
    reetalonner: 'ré-étalonner … depuis (… , …) vers (… , …)',
    affecter: 'affecter une valeur à une variable',
    ajouter_a: 'ajouter à une variable',
    variable: 'valeur d’une variable',
    nombre: 'nombre',
  };
  const NOMS_BLOCS = Object.assign({}, NOMS_BLOCS_BASE);
  for (const [type, d] of Object.entries(A.BLOCS_CARTES || {})) NOMS_BLOCS[type] = d.texte.replace(/%[A-Z]+/g, '…').replace(/\s+/g, ' ');
  // Broches que proposent les menus des blocs, par sorte de composant et par carte (l'éditeur du professeur
  // propose les mêmes).
  const brochesDe = (carte, type) => {
    const p = A.profil ? A.profil(carte) : null;
    return p && p.broches[type] && p.broches[type].length ? p.broches[type] : { led: BROCHES_LED, bouton: BROCHES_BOUTON, servo: BROCHES_SERVO, buzzer: BROCHES_NUMERIQUES }[type];
  };
  const BROCHES_COMPOSANTS = { led: BROCHES_LED, bouton: BROCHES_BOUTON, servo: BROCHES_SERVO, buzzer: BROCHES_NUMERIQUES };

  Object.assign(A, { definirBlocs, palette, CATEGORIES, COULEURS_BLOCS: COULEURS, NOMS_BLOCS, BROCHES_COMPOSANTS, brochesDe });
})(this);

// ===== interface/editeur.js =====
// Éditeur de blocs (repris de l'atelier) : Blockly, palette de l'exercice, blocs de départ, surlignage des blocs en cours,
// blocs restés seuls hors du programme, zoom, annuler / rétablir.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  function creerEditeur(conteneur, rappels) {
    const Blockly = global.Blockly;
    A.definirBlocs(Blockly);
    const zone = conteneur.querySelector('.editeur-blockly');
    const calque = conteneur.querySelector('.editeur-etiquettes');
    // Tuiles des catégories : couleur de la famille et pictogramme.
    if (!document.getElementById('style-categories')) {
      const style = document.createElement('style');
      style.id = 'style-categories';
      style.textContent = A.CATEGORIES.map(
        (c) => `.cat-${c.cle}{background-color:${c.couleur};background-image:url("${A.imageIcone(c.icone || c.cle, '#1F2A30', 2.4)}")}`,
      ).join('\n');
      document.head.appendChild(style);
    }
    const echelle = () => Number(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1;

    const ws = Blockly.inject(zone, {
      toolbox: { kind: 'categoryToolbox', contents: [] },
      renderer: 'zelos',
      // Images de Blockly (corbeille…) copiées dans le dépôt : aucun appel réseau.
      media: A.mediaBlockly || 'vendor/blockly/media/', // un projet le règle (monterExercice)
      theme: A.themeBlockly,
      trashcan: true,
      sounds: false,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: false, wheel: false, pinch: true, startScale: 0.9 * echelle(), maxScale: 2, minScale: 0.4, scaleSpeed: 1.15 },
      grid: { spacing: 22, length: 2, colour: '#C9D4DA', snap: false },
      maxInstances: { demarrage: 1, boucle: 1 },
    });
    let enChargement = false;
    let enCours = null;

    // ---------- Chargement / sauvegarde ----------

    // Variables : celles de l'exercice (CHOIX si l'exercice n'en dit rien), celles déjà dans le programme, et celles que
    // l'élève crée (« Créer une variable », si l'exercice le permet).
    let exerciceCourant = null;
    const optionsPalette = () => ({ variables: A.variablesConnues, creerVariables: !!(exerciceCourant && exerciceCourant.variablesLibres) });
    function creerVariable() {
      let message = 'Nom de ta nouvelle variable (par exemple : vitesse, compteur) :';
      for (;;) {
        const texte = global.prompt(message, '');
        if (texte === null) return;
        const r = A.nomDeVariable(texte, A.variablesConnues);
        if (r.ok) {
          A.variablesConnues = A.variablesConnues.concat(r.nom);
          ws.updateToolbox(A.palette(exerciceCourant.blocsAutorises, exerciceCourant.composants, optionsPalette()));
          return;
        }
        message = r.message + ' Nouveau nom :';
      }
    }
    ws.registerButtonCallback('creerVariable', creerVariable);

    function charger(exercice, sauvegarde) {
      enChargement = true;
      exerciceCourant = exercice;
      // Carte de l'exercice : les menus de broches des blocs la suivent (Uno : D2…D13, micro:bit : P0…P2).
      A.carteCourante = exercice.carte || 'uno';
      // Les événements de Blockly partent un instant plus tard : on les coupe pendant le chargement,
      // sinon ils passeraient pour une modification de l'élève (et arrêteraient la simulation).
      Blockly.Events.disable();
      try {
        const depart = sauvegarde || A.versBlockly(exercice.blocsDepart || { demarrage: [], boucle: [] });
        const fournies = Array.isArray(exercice.variables) ? exercice.variables : ['CHOIX'];
        A.variablesConnues = [...new Set(fournies.concat(A.variablesDeSauvegarde(depart)))];
        ws.updateToolbox(A.palette(exercice.blocsAutorises, exercice.composants, optionsPalette()));
        ws.clear();
        Blockly.serialization.workspaces.load(depart, ws);
        // « Au démarrage » et « Répéter indéfiniment » ne se suppriment pas, même dans une sauvegarde.
        for (const b of ws.getTopBlocks(false)) if (b.type === 'demarrage' || b.type === 'boucle') b.setDeletable(false);
      } finally {
        Blockly.Events.enable();
      }
      ws.clearUndo();
      ws.setScale(0.9 * echelle());
      ws.scroll(0, 0);
      enChargement = false;
      majHorsProgramme();
    }

    function sauvegarder() {
      return Blockly.serialization.workspaces.save(ws);
    }

    function lire() {
      return A.depuisBlockly(sauvegarder());
    }

    // ---------- Étiquettes posées à côté des blocs ----------

    function position(bloc) {
      const r = bloc.getSvgRoot().getBoundingClientRect();
      const z = zone.getBoundingClientRect();
      // Pour un bloc en C, on se cale sur sa première ligne (son en-tête).
      const hauteur = Math.min(r.height, 44 * ws.scale);
      return { x: r.right - z.left, y: r.top - z.top + hauteur / 2 };
    }

    function dessinerEtiquettes() {
      calque.innerHTML = '';
      const ajouter = (bloc, classe, texte, decalage) => {
        const p = position(bloc);
        const e = document.createElement('span');
        e.className = 'etiquette-bloc ' + classe;
        e.textContent = texte;
        e.style.left = p.x + (decalage || 12) + 'px';
        e.style.top = p.y + 'px';
        calque.appendChild(e);
      };
      const b = enCours && ws.getBlockById(enCours);
      if (b && !b.isInFlyout) {
        // Bloc en C : l'étiquette se place après la ligne d'en-tête, à droite du bloc.
        ajouter(b, 'etiquette-en-cours', '◀ en cours');
      }
      for (const h of horsProgramme) {
        const bloc = ws.getBlockById(h);
        if (bloc) ajouter(bloc, 'etiquette-hors', 'hors du programme', 14);
      }
    }

    // ---------- Bloc en cours ----------

    // id : un bloc, ou une liste (un bloc en cours par fil : « Répéter indéfiniment » et les blocs « quand… »).
    let tousEnCours = [];
    function surligner(id) {
      const ids = Array.isArray(id) ? id.filter(Boolean) : id ? [id] : [];
      if (ids.join() === tousEnCours.join()) return;
      for (const ancien of tousEnCours) {
        const b = ws.getBlockById(ancien);
        if (b && b.getSvgRoot()) b.getSvgRoot().classList.remove('bloc-en-cours');
      }
      tousEnCours = ids;
      enCours = ids[0] || null;
      for (const x of ids) {
        const b = ws.getBlockById(x);
        if (b && b.getSvgRoot()) b.getSvgRoot().classList.add('bloc-en-cours');
      }
      dessinerEtiquettes();
    }

    // ---------- Blocs restés seuls hors du programme ----------

    let horsProgramme = [];
    function majHorsProgramme() {
      for (const b of ws.getAllBlocks(false)) b.getSvgRoot().classList.remove('bloc-hors-programme');
      horsProgramme = [];
      for (const b of ws.getTopBlocks(false)) {
        if (b.type === 'demarrage' || b.type === 'boucle' || b.type === 'quand_bouton' || b.type === 'quand_camera' || b.type === 'quand_touche' || b.type === 'quand_joystick' || b.isInsertionMarker()) continue;
        if (b.isDragging && b.isDragging()) continue;
        horsProgramme.push(b.id);
        b.getSvgRoot().classList.add('bloc-hors-programme');
      }
      dessinerEtiquettes();
    }

    ws.addChangeListener((e) => {
      if (enChargement) return;
      const deplacementVue = e.type === Blockly.Events.VIEWPORT_CHANGE;
      if (deplacementVue || e.type === Blockly.Events.BLOCK_DRAG || e.isUiEvent) {
        if (e.type === Blockly.Events.BLOCK_DRAG && !e.isStart) majHorsProgramme();
        else dessinerEtiquettes();
        if (deplacementVue) rappels.zoom(Math.round((ws.scale / echelle()) * 100));
        return;
      }
      majHorsProgramme();
      rappels.modifie();
    });

    // ---------- Boutons de l'espace de travail ----------

    function zoomer(sens) {
      const centre = zone.getBoundingClientRect();
      ws.zoom(centre.width / 2, centre.height / 2, sens);
    }

    function recentrer() {
      ws.setScale(0.9 * echelle());
      ws.scroll(0, 0);
    }

    // Bouton « Commentaire » : un commentaire sur le bloc choisi (ouvert), sinon une note en haut à gauche de ce qu'on
    // voit. Le texte s'écrit tout de suite.
    function commenter() {
      const choisi = Blockly.getSelected && Blockly.getSelected();
      if (choisi && choisi.workspace === ws && typeof choisi.setCommentText === 'function') {
        if (choisi.getCommentText() === null) choisi.setCommentText('');
        const icone = choisi.getIcon && choisi.getIcon(Blockly.icons.IconType.COMMENT);
        if (icone && icone.setBubbleVisible) icone.setBubbleVisible(true);
        // La zone de texte de la bulle qui vient de s'ouvrir (celle qui a le texte du bloc, la dernière posée).
        setTimeout(() => {
          const texte = choisi.getCommentText() || '';
          const zones = [...ws.getParentSvg().parentNode.querySelectorAll('textarea')].filter((t) => t.value === texte && !t.closest('.blocklyWorkspaceComment, .blocklyComment'));
          const zoneTexte = zones.pop();
          if (zoneTexte) zoneTexte.focus();
        }, 50);
        return;
      }
      // À droite des blocs (sans les cacher), en restant dans ce qu'on voit.
      const vue = ws.getMetricsManager().getViewMetrics(true);
      const blocs = ws.getBlocksBoundingBox();
      const droite = blocs && blocs.right > blocs.left ? blocs.right + 40 : vue.left + 30;
      const x = Math.max(vue.left + 20, Math.min(droite, vue.left + vue.width - 240));
      const decalage = ws.getTopComments().length * 24; // une note de plus ne cache pas la précédente
      const note = new Blockly.comments.RenderedWorkspaceComment(ws);
      note.setText('');
      note.setSize(new Blockly.utils.Size(220, 110));
      note.moveTo(new Blockly.utils.Coordinate(x, vue.top + 20 + decalage));
      setTimeout(() => {
        const zoneTexte = note.getSvgRoot && note.getSvgRoot().querySelector('textarea');
        if (zoneTexte) zoneTexte.focus();
      }, 50);
    }

    // La zone change de taille (fenêtre, consigne réduite) : Blockly doit se redimensionner.
    new ResizeObserver(() => {
      Blockly.svgResize(ws);
      dessinerEtiquettes();
    }).observe(zone);

    return {
      ws,
      charger,
      sauvegarder,
      lire,
      surligner,
      zoomer,
      recentrer,
      commenter,
      annuler: () => ws.undo(false),
      retablir: () => ws.undo(true),
      horsProgramme: () => horsProgramme.slice(),
      // Éditeur du professeur : les blocs proposés changent sans recharger le programme.
      changerPalette: (blocsAutorises) => ws.updateToolbox(A.palette(blocsAutorises, null, optionsPalette())),
    };
  }

  A.creerEditeur = creerEditeur;
})(this);

// ===== interface/simulateur-vue.js =====
// Affichage du simulateur (repris de l'atelier) : carte Arduino stylisée (dessin original, sans logo), fils, cartes des
// composants, et l'illustration propre au projet s'il en a une (« illustration » de l'exercice, ex. le distributeur).
// Aucune logique de programme ici : on affiche des états.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const NS = 'http://www.w3.org/2000/svg';

  // Position des broches sur la rangée DIGITAL du dessin de la carte.
  const XS = { GND: 144.5, D13: 154.5, D12: 164, D11: 174, D10: 183.5, D9: 193.5, D8: 203, D7: 219.5, D6: 229, D5: 239, D4: 248.5, D3: 258.5, D2: 268 };
  const PY = 57;
  const FILS = { D3: '#D32F2F', D4: '#1976D2', D5: '#F9A825', D6: '#7B1FA2', D8: '#2E7D32', D9: '#00838F', D10: '#455A64', D7: '#6D4C41', D11: '#AD1457', GND: '#7B4A2A' };
  const FAMILLES = { led: '#FAB22B', bouton: '#1A6E8E', servo: '#C2185B', buzzer: '#6D4C41', joystick: '#00838F' };
  const COULEURS_LED = { PetiteDose: '#F5B800', GrandeDose: '#2F80ED', Trappe: '#E53935' };

  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function couleurFil(broche) {
    return FILS[broche] || '#455A64';
  }
  function couleurLed(c) {
    return c.couleur || COULEURS_LED[c.nom] || '#E53935';
  }
  function libelle(c) {
    const type = { led: 'LED', bouton: 'BOUTON', servo: 'Servomoteur', buzzer: 'Buzzer', joystick: 'Joystick' }[c.type] || c.type;
    return c.nom ? `${type} ${c.nom}` : type;
  }

  // ---------- Carte Arduino ----------

  function dessinCarte(composants, recadrer) {
    const etiquettes = ['GND', '13', '12', '~11', '~10', '~9', '8', '7', '~6', '~5', '4', '~3', '2'];
    const broches = ['GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2'];
    let trous = '';
    broches.forEach((b, i) => {
      const x = XS[b];
      trous += `<rect x="${x - 3.2}" y="${PY - 3.2}" width="6.4" height="6.4" rx="1" fill="#0E1418" stroke="#C9A227" stroke-width="0.8"/>`;
      trous += `<text x="${x}" y="74" class="carte-etiquette" text-anchor="middle">${etiquettes[i]}</text>`;
    });
    // Fils : de chaque broche utilisée vers le haut, le long du bord droit, puis vers les cartes.
    // Le joystick : seul son bouton (SW) est sur la rangée DIGITAL ; ses axes vont aux entrées analogiques.
    const utilises = [{ broche: 'GND' }].concat(composants.map((c) => (c.type === 'joystick' ? { broche: c.bouton } : c))).filter((c) => XS[c.broche] !== undefined);
    const vus = new Set();
    const fils = utilises
      .filter((c) => (vus.has(c.broche) ? false : vus.add(c.broche)))
      .sort((a, b) => XS[b.broche] - XS[a.broche]);
    let traces = '';
    fils.forEach((f, r) => {
      const x = XS[f.broche];
      const y = 34 - r * 4;
      const lx = 334 + r * 4.5;
      const coul = couleurFil(f.broche);
      traces +=
        `<polyline points="${x},${PY} ${x},${y} ${lx},${y} ${lx},${recadrer ? 94 : 280}" fill="none" stroke="${coul}" ` +
        `stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${PY}" r="2.6" fill="${coul}" stroke="#FFFFFF" stroke-width="1"/>`;
    });
    const vb = recadrer ? '128 2 246 92' : '0 0 372 280';
    return (
      `<svg class="carte-arduino" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Carte Arduino UNO et ses fils">` +
      // Circuit imprimé
      '<rect x="14" y="44" width="308" height="228" rx="12" fill="#1C7286" stroke="#11505F" stroke-width="2"/>' +
      '<circle cx="30" cy="60" r="5" fill="#F4F7F9" stroke="#11505F"/><circle cx="306" cy="60" r="5" fill="#F4F7F9" stroke="#11505F"/>' +
      '<circle cx="30" cy="256" r="5" fill="#F4F7F9" stroke="#11505F"/><circle cx="306" cy="256" r="5" fill="#F4F7F9" stroke="#11505F"/>' +
      // Prise USB et prise d'alimentation
      '<rect x="2" y="78" width="46" height="40" rx="3" fill="#C5CFD5" stroke="#7C8B94" stroke-width="1.5"/>' +
      '<rect x="8" y="86" width="34" height="24" rx="2" fill="#9AA8B0"/>' +
      '<rect x="4" y="196" width="40" height="36" rx="4" fill="#2B3338"/>' +
      '<circle cx="24" cy="214" r="8" fill="#11171A"/>' +
      // Rangée DIGITAL
      '<rect x="137" y="49" width="138" height="16" rx="2" fill="#1B2226"/>' +
      trous +
      '<text x="206" y="88" class="carte-titre" text-anchor="middle">DIGITAL</text>' +
      // Rangées du bas (alimentation et analogique), pour l'allure
      '<rect x="96" y="250" width="80" height="14" rx="2" fill="#1B2226"/>' +
      '<rect x="196" y="250" width="66" height="14" rx="2" fill="#1B2226"/>' +
      '<text x="136" y="244" class="carte-etiquette" text-anchor="middle">POWER</text>' +
      '<text x="229" y="244" class="carte-etiquette" text-anchor="middle">ANALOG IN</text>' +
      // Microcontrôleur et quartz
      '<rect x="150" y="176" width="120" height="34" rx="3" fill="#2B3338"/>' +
      '<rect x="72" y="150" width="26" height="12" rx="6" fill="#B8C4CA"/>' +
      // Bouton reset et voyants
      '<rect x="62" y="56" width="16" height="16" rx="3" fill="#C5CFD5"/><circle cx="70" cy="64" r="4.5" fill="#D32F2F"/>' +
      '<rect x="110" y="104" width="7" height="4" fill="#F9A825"/><text x="122" y="108" class="carte-etiquette">L</text>' +
      '<rect x="270" y="112" width="7" height="4" fill="#4CAF50"/><text x="282" y="116" class="carte-etiquette">ON</text>' +
      '<text x="180" y="140" class="carte-nom" text-anchor="middle">UNO</text>' +
      '<g class="carte-surlignage"></g>' +
      traces +
      '</svg>'
    );
  }

  function surlignerBroche(conteneur, broche) {
    const g = conteneur.querySelector('.carte-surlignage');
    if (!g) return;
    g.innerHTML =
      broche && XS[broche] !== undefined
        ? `<rect x="${XS[broche] - 6}" y="${PY - 7}" width="12" height="36" rx="3" fill="rgba(255,196,0,.35)" stroke="#FFC400" stroke-width="2.5"/>`
        : '';
  }

  // ---------- Cartes des composants ----------

  function dessinLed(couleur) {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      `<circle class="led-halo" cx="24" cy="18" r="18" fill="${couleur}" opacity="0"/>` +
      '<path class="led-verre" d="M14 30V18a10 10 0 0 1 20 0v12z" fill="#EEF3F6" stroke="#7C8B94" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path class="led-reflet" d="M18.5 18a6 6 0 0 1 3.5-5.5" fill="none" stroke="#FFFFFF" opacity=".95" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect class="led-socle" x="11" y="29" width="26" height="5" rx="2" fill="#7C8B94"/>' +
      '<path d="M20 34v12M28 34v9" fill="none" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function dessinBouton() {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<rect x="5" y="30" width="38" height="12" rx="3" fill="#3B4A52"/>' +
      '<rect class="bouton-capuchon" x="13" y="12" width="22" height="18" rx="4" fill="#1A6E8E" stroke="#12506A" stroke-width="2"/>' +
      '<path d="M12 42v5M36 42v5" fill="none" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function dessinServo() {
    let graduations = '';
    for (let a = 0; a <= 180; a += 30) {
      const r = (a * Math.PI) / 180;
      const x1 = 24 + 19 * Math.cos(r);
      const y1 = 36 - 19 * Math.sin(r);
      const x2 = 24 + (a % 90 === 0 ? 15 : 16.5) * Math.cos(r);
      const y2 = 36 - (a % 90 === 0 ? 15 : 16.5) * Math.sin(r);
      graduations += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#4F5D66" stroke-width="${a % 90 === 0 ? 2.5 : 1.5}" stroke-linecap="round"/>`;
    }
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<path d="M5 36A19 19 0 0 1 43 36" fill="none" stroke="#9AA8B0" stroke-width="2"/>' +
      graduations +
      '<text x="47" y="45" class="servo-texte" text-anchor="end">0°</text>' +
      '<text x="24" y="12" class="servo-texte" text-anchor="middle">90°</text>' +
      '<text x="1" y="45" class="servo-texte">180°</text>' +
      '<rect x="15" y="33" width="18" height="13" rx="2" fill="#3B4A52"/>' +
      '<g class="servo-bras" style="transform-origin:24px 36px">' +
      '<line x1="24" y1="36" x2="39" y2="36" stroke="#1F2A30" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="24" y1="36" x2="39" y2="36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>' +
      '</g>' +
      '<circle cx="24" cy="36" r="3.5" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>' +
      '</svg>'
    );
  }

  function dessinBuzzer() {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="16" fill="#2B3338"/><circle cx="24" cy="24" r="4" fill="#11171A"/>' +
      '<path class="buzzer-onde" d="M40 14a16 16 0 0 1 0 20M44 9a22 22 0 0 1 0 30" fill="none" stroke="#6D4C41" stroke-width="2.5" stroke-linecap="round" opacity="0"/>' +
      '</svg>'
    );
  }

  // Joystick : le manche (à tirer à la souris, au doigt ou aux flèches) et son bouton (SW, en appuyant dessus).
  function dessinJoystick() {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<rect x="3" y="3" width="42" height="42" rx="8" fill="#3B4A52"/>' +
      '<circle cx="24" cy="24" r="17" fill="#26323A" stroke="#7C8B94" stroke-width="1.5"/>' +
      '<path d="M24 9v30M9 24h30" stroke="#4F5D66" stroke-width="1.2"/>' +
      '<circle class="joystick-manche" cx="24" cy="24" r="8" fill="#00838F" stroke="#FFFFFF" stroke-width="2"/>' +
      '</svg>'
    );
  }

  function carteComposant(c, compact) {
    const fam = FAMILLES[c.type];
    let dessin;
    if (c.type === 'joystick') {
      const nom = echapper(libelle(c));
      return (
        `<div class="composant composant-joystick${compact ? ' compact' : ''}" data-broche="${c.broche}" data-type="joystick" style="--famille:${fam}">` +
        `<div class="composant-dessin joystick-plateau" tabindex="0" role="slider" aria-valuemin="-100" aria-valuemax="100" aria-valuenow="0" ` +
        `aria-label="${nom} : tire le manche (ou flèches du clavier)">${dessinJoystick()}</div>` +
        `<button type="button" class="composant-dessin bouton-poussoir" aria-pressed="false" ` +
        `aria-label="Bouton du joystick ${c.bouton} : maintenir pour appuyer">${dessinBouton()}</button>` +
        '<div class="composant-texte">' +
        `<div class="composant-nom"><span class="composant-fil" style="background:${couleurFil(c.bouton)}"></span>` +
        `<span>${nom} · X ${c.broche} · Y ${c.y} · bouton ${c.bouton}</span></div>` +
        `<div class="composant-etat"><span class="pastille-etat" aria-live="polite"></span>` +
        (compact ? '' : '<span class="composant-aide">Tire le manche ; maintiens le bouton pour appuyer</span>') +
        '</div></div></div>'
      );
    }
    if (c.type === 'led') dessin = `<div class="composant-dessin">${dessinLed(couleurLed(c))}</div>`;
    else if (c.type === 'bouton')
      dessin =
        `<button type="button" class="composant-dessin bouton-poussoir" aria-pressed="false" ` +
        `aria-label="Bouton poussoir ${echapper(libelle(c))} ${c.broche} : maintenir pour appuyer">${dessinBouton()}</button>`;
    else if (c.type === 'buzzer') dessin = `<div class="composant-dessin">${dessinBuzzer()}</div>`;
    else dessin = `<div class="composant-dessin">${dessinServo()}</div>`;
    const aide = c.type === 'bouton' && !compact ? '<span class="composant-aide">Maintiens le clic pour appuyer</span>' : '';
    return (
      `<div class="composant composant-${c.type}${compact ? ' compact' : ''}" data-broche="${c.broche}" data-type="${c.type}" style="--famille:${fam};--led:${couleurLed(c)}">` +
      dessin +
      '<div class="composant-texte">' +
      `<div class="composant-nom"><span class="composant-fil" style="background:${couleurFil(c.broche)}"></span>` +
      `<span>${echapper(libelle(c))} · ${c.broche}</span></div>` +
      `<div class="composant-etat"><span class="pastille-etat" aria-live="polite"></span>${aide}</div>` +
      '</div></div>'
    );
  }

  // ---------- Distributeur de céréales ----------

  function dessinDistributeur() {
    let grains = '';
    const pos = [
      [38, 56], [48, 50], [58, 58], [70, 52], [82, 57], [44, 66], [56, 70], [66, 64], [78, 68], [50, 78], [62, 80], [72, 76],
      [34, 44], [46, 40], [60, 44], [74, 40], [86, 46], [40, 32], [54, 30], [68, 32], [80, 30],
    ];
    for (const [x, y] of pos) grains += `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="3.2" fill="#E0A44A" stroke="#A86A1E" stroke-width="1"/>`;
    let chute = '';
    for (let i = 0; i < 6; i++)
      chute += `<ellipse class="grain-chute" style="animation-delay:${(i * 0.13).toFixed(2)}s" cx="${57 + (i % 3) * 3}" cy="100" rx="3.4" ry="2.6" fill="#E0A44A" stroke="#A86A1E" stroke-width="0.8"/>`;
    const voyant = (cle, x, nom) =>
      `<g class="voyant" data-voyant="${cle}"><circle cx="${x}" cy="150" r="7" fill="#EEF3F6" stroke="#7C8B94" stroke-width="2"/>` +
      `<text x="${x}" y="166" text-anchor="middle" class="voyant-nom">${nom}</text></g>`;
    return (
      '<svg class="distributeur" viewBox="0 0 120 200" role="img" aria-label="Distributeur de céréales">' +
      // Trémie transparente pleine de céréales
      '<path d="M22 18h76l-28 70H50z" fill="#F4F7F9" stroke="#4F5D66" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<clipPath id="tremie"><path d="M23 26h74l-27 61H51z"/></clipPath>' +
      `<g clip-path="url(#tremie)">${grains}</g>` +
      '<rect x="18" y="12" width="84" height="8" rx="3" fill="#4F5D66"/>' +
      // Trappe (tourne autour de sa charnière, à gauche du goulot)
      '<g class="trappe" style="transform-origin:50px 90px"><rect x="48" y="88" width="24" height="5" rx="2" fill="#C2185B" stroke="#7A0F39" stroke-width="1"/></g>' +
      '<circle cx="50" cy="90.5" r="2.4" fill="#1F2A30"/>' +
      `<g class="chute">${chute}</g>` +
      // Boîtier et voyants
      '<rect x="14" y="132" width="92" height="44" rx="8" fill="#FFFFFF" stroke="#4F5D66" stroke-width="2.5"/>' +
      voyant('PetiteDose', 34, 'Petite') +
      voyant('GrandeDose', 60, 'Grande') +
      voyant('Trappe', 86, 'Trappe') +
      // Bol
      '<path d="M36 182h48a24 14 0 0 1-48 0z" fill="#1A6E8E" stroke="#12506A" stroke-width="2"/>' +
      '<text x="60" y="126" text-anchor="middle" class="trappe-etat"></text>' +
      '</svg>'
    );
  }


  // ---------- micro:bit et mBot (jalon 3) ----------

  // Réglage d'un capteur : curseur + valeur écrite (jamais la couleur seule).
  function curseur(nom, libelle, min, max, pas, valeur, unite) {
    return (
      `<label class="capteur"><span class="capteur-nom">${libelle}</span>` +
      `<input type="range" data-capteur="${nom}" min="${min}" max="${max}" step="${pas}" value="${valeur}">` +
      `<output class="capteur-valeur" data-valeur="${nom}">${valeur}${unite ? ' ' + unite : ''}</output></label>`
    );
  }
  function choix(nom, libelle, options, valeur) {
    return (
      `<label class="capteur"><span class="capteur-nom">${libelle}</span>` +
      `<select data-capteur="${nom}">${options.map(([t, v]) => `<option value="${v}"${String(v) === String(valeur) ? ' selected' : ''}>${echapper(t)}</option>`).join('')}</select></label>`
    );
  }

  function htmlMicrobit() {
    let points = '';
    for (let i = 0; i < 25; i++) points += '<span class="mb-point"></span>';
    const bouton = (n) => `<button type="button" class="mb-bouton poussoir-carte" data-entree="${n}" aria-pressed="false" aria-label="Bouton ${n} de la micro:bit : maintenir pour appuyer">${n}</button>`;
    return (
      '<div class="mb-carte" role="group" aria-label="Carte micro:bit">' +
      bouton('A') +
      '<div class="mb-centre">' +
      '<button type="button" class="mb-logo poussoir-carte" data-entree="logo" aria-pressed="false" aria-label="Logo tactile de la micro:bit : maintenir pour le toucher">' +
      '<svg viewBox="0 0 40 20" aria-hidden="true"><rect x="2" y="2" width="36" height="16" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="12" cy="10" r="3" fill="currentColor"/><circle cx="28" cy="10" r="3" fill="currentColor"/></svg>' +
      '<span>logo</span></button>' +
      `<div class="mb-ecran" role="img" aria-label="Écran de la micro:bit : éteint">${points}</div>` +
      '<div class="mb-son" aria-live="polite"></div>' +
      '</div>' +
      bouton('B') +
      '</div>'
    );
  }

  // Afficheur LED Matrix 8×16 (port 4) : seulement dans les exercices qui ont ses blocs.
  function htmlMatrice() {
    let points = '';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) points += '<span class="matrice-point"></span>';
    return `<figure class="mbot-matrice"><div class="matrice-points" role="img" aria-label="Afficheur : éteint">${points}</div><figcaption>Afficheur (port 4)</figcaption></figure>`;
  }

  function htmlMbot(avecMatrice) {
    const roue = (x, cote) =>
      `<g class="mbot-roue" data-roue="${cote}"><rect x="${x}" y="30" width="22" height="60" rx="6" fill="#2B3338"/>` +
      `<text x="${x + 11}" y="66" text-anchor="middle" class="mbot-fleche"></text></g>`;
    const led = (x, cote) => `<circle class="mbot-led" data-led="${cote}" cx="${x}" cy="44" r="7" fill="#EEF3F6" stroke="#7C8B94" stroke-width="2"/>`;
    return (
      '<div class="mbot" role="group" aria-label="Robot mBot">' +
      '<svg class="mbot-dessin" viewBox="0 0 160 112" aria-hidden="true">' +
      // capteur à ultrasons (avant), châssis, roues, LED de la carte, suiveur de ligne
      '<rect x="56" y="2" width="48" height="16" rx="4" fill="#1A6E8E"/><circle cx="70" cy="10" r="6" fill="#DCE6EA"/><circle cx="90" cy="10" r="6" fill="#DCE6EA"/>' +
      '<rect x="30" y="20" width="100" height="84" rx="12" fill="#2F80ED" stroke="#1B4F9B" stroke-width="2"/>' +
      '<rect x="46" y="34" width="68" height="48" rx="4" fill="#1C7286"/>' +
      roue(6, 'gauche') +
      roue(132, 'droite') +
      led(62, 'gauche') +
      led(98, 'droite') +
      '<text x="80" y="66" text-anchor="middle" class="mbot-texte">mCore</text>' +
      '<rect x="66" y="92" width="28" height="8" rx="2" fill="#1F2A30"/>' +
      '</svg>' +
      '<ul class="mbot-etats">' +
      '<li>Moteur gauche : <strong data-etat="moteur gauche">arrêté</strong></li>' +
      '<li>Moteur droit : <strong data-etat="moteur droit">arrêté</strong></li>' +
      '<li>LED gauche : <strong data-etat="LED gauche">éteinte</strong></li>' +
      '<li>LED droite : <strong data-etat="LED droite">éteinte</strong></li>' +
      '<li class="mbot-son" aria-live="polite"></li>' +
      '</ul>' +
      '<button type="button" class="mbot-bouton poussoir-carte" data-entree="bouton" aria-pressed="false" aria-label="Bouton de la carte mCore : maintenir pour appuyer">Bouton de la carte</button>' +
      (avecMatrice ? htmlMatrice() : '') +
      '</div>'
    );
  }

  function htmlCapteurs(carte, c) {
    if (carte === 'microbit') {
      return (
        curseur('temperature', 'Température', -10, 50, 1, c.temperature, '°C') +
        curseur('lumiere', 'Lumière', 0, 255, 1, c.lumiere, '') +
        curseur('x', 'Accélération x', -1024, 1024, 16, c.x, 'mg') +
        curseur('y', 'Accélération y', -1024, 1024, 16, c.y, 'mg') +
        curseur('z', 'Accélération z', -1024, 1024, 16, c.z, 'mg') +
        choix('geste', 'Geste', [['aucun', 0]].concat(A.GESTES || []), c.geste)
      );
    }
    return (
      curseur('distance', 'Distance (ultrasons)', 2, 400, 1, c.distance, 'cm') +
      choix(
        'ligne',
        'Suiveur de ligne',
        [
          ['noir sous les deux capteurs (0)', 0],
          ['noir à gauche seulement (1)', 1],
          ['noir à droite seulement (2)', 2],
          ['blanc sous les deux capteurs (3)', 3],
        ],
        c.ligne,
      ) +
      curseur('lumiere', 'Lumière', 0, 1023, 1, c.lumiere, '')
    );
  }

  const sensMoteur = (v) => (!v ? 'arrêté' : `${Math.abs(v)} % ${v > 0 ? 'en avant' : 'en arrière'}`);

  // Partie « carte » de la vue : micro:bit (écran, boutons, logo) ou mBot (moteurs, LED, bouton), et ses capteurs.
  function vueCarte(racine, carte, rappels, avecMatrice) {
    const zone = racine.querySelector('.simu-carte');
    zone.innerHTML = `<div class="simu-carte-dessin simu-${carte}">${carte === 'microbit' ? htmlMicrobit() : htmlMbot(avecMatrice)}</div>`;
    for (const vieux of racine.querySelectorAll('.simu-capteurs')) vieux.remove();
    const capteurs = A.capteursDepart ? A.capteursDepart(carte) : {};
    const panneau = document.createElement('details');
    panneau.className = 'simu-capteurs';
    panneau.open = true;
    panneau.innerHTML = `<summary>Capteurs de la carte <span class="capteurs-aide">à régler à la main pendant la simulation</span></summary><div class="capteurs-liste">${htmlCapteurs(carte, capteurs)}</div>`;
    zone.insertAdjacentElement('afterend', panneau);
    panneau.addEventListener('input', (e) => {
      const nom = e.target.dataset.capteur;
      if (!nom) return;
      capteurs[nom] = Number(e.target.value);
      const sortie = panneau.querySelector(`[data-valeur="${nom}"]`);
      if (sortie) sortie.textContent = sortie.textContent.replace(/^-?[\d.]+/, e.target.value);
    });
    const appuyes = {};
    for (const b of zone.querySelectorAll('.poussoir-carte')) {
      poussoir(b, (valeur) => {
        appuyes[b.dataset.entree] = valeur;
        b.setAttribute('aria-pressed', valeur ? 'true' : 'false');
        rappels.appuyerBouton(b.dataset.entree, valeur);
      });
    }

    const points = [...zone.querySelectorAll('.mb-point')];
    const pointsMatrice = [...zone.querySelectorAll('.matrice-point')];
    let ecranAvant = '';
    function son(sim, nom) {
      const note = sim && sim.journal.filter((e) => e.type === 'son' && e.broche === nom).pop();
      return note && note.valeur && sim.t < note.t + note.duree ? `♪ ${Math.round(note.valeur)} Hz` : '';
    }
    function afficher(sim) {
      if (carte === 'microbit') {
        const ecran = sim && sim.carte ? A.ecranA(sim.carte, sim.t) : new Array(25).fill(0);
        const cle = ecran.join('');
        if (cle !== ecranAvant) {
          ecranAvant = cle;
          ecran.forEach((v, i) => points[i].style.setProperty('--allume', String(v / 9)));
          const n = ecran.filter(Boolean).length;
          zone.querySelector('.mb-ecran').setAttribute('aria-label', n ? `Écran de la micro:bit : ${n} point${n > 1 ? 's' : ''} allumé${n > 1 ? 's' : ''}` : 'Écran de la micro:bit : éteint');
        }
        zone.querySelector('.mb-son').textContent = son(sim, 'haut-parleur');
      } else {
        const sorties = (sim && sim.sorties) || {};
        for (const cote of ['gauche', 'droite']) {
          const moteur = cote === 'gauche' ? 'moteur gauche' : 'moteur droit';
          const v = sorties[moteur] || 0;
          zone.querySelector(`[data-etat="${moteur}"]`).textContent = sensMoteur(v);
          zone.querySelector(`[data-roue="${cote}"] .mbot-fleche`).textContent = v > 0 ? '▲' : v < 0 ? '▼' : '';
          const rgb = sorties['LED ' + cote] || 0;
          zone.querySelector(`[data-etat="LED ${cote}"]`).textContent = A.nomCouleur ? A.nomCouleur(rgb) : String(rgb);
          zone.querySelector(`[data-led="${cote}"]`).setAttribute('fill', rgb ? '#' + rgb.toString(16).padStart(6, '0') : '#EEF3F6');
        }
        zone.querySelector('.mbot-son').textContent = son(sim, 'D8');
        if (pointsMatrice.length) {
          const colonnes = sim && sim.carte && A.matriceA ? A.matriceA(sim.carte, sim.t) : new Array(16).fill(0);
          const cle = colonnes.join(',');
          if (cle !== ecranAvant) {
            ecranAvant = cle;
            let n = 0;
            pointsMatrice.forEach((p, i) => {
              const allume = (colonnes[i % 16] >> Math.floor(i / 16)) & 1;
              n += allume;
              p.classList.toggle('allume', !!allume);
            });
            zone.querySelector('.matrice-points').setAttribute('aria-label', n ? `Afficheur : ${n} point${n > 1 ? 's' : ''} allumé${n > 1 ? 's' : ''}` : 'Afficheur : éteint');
          }
        }
      }
      // Curseurs des capteurs : suivent les valeurs changées par un test rejoué.
      for (const champ of panneau.querySelectorAll('[data-capteur]')) {
        const v = capteurs[champ.dataset.capteur];
        if (document.activeElement === champ || String(v) === champ.value) continue;
        champ.value = v;
        const sortie = panneau.querySelector(`[data-valeur="${champ.dataset.capteur}"]`);
        if (sortie) sortie.textContent = sortie.textContent.replace(/^-?[\d.]+/, String(v));
      }
      // Boutons de la carte : appuyés tant qu'on les tient (ou dans un test rejoué).
      for (const b of zone.querySelectorAll('.poussoir-carte')) {
        const v = sim ? sim.entrees[b.dataset.entree] : appuyes[b.dataset.entree];
        b.setAttribute('aria-pressed', v ? 'true' : 'false');
      }
    }
    // En direct, les capteurs sont ceux de la vraie carte : les curseurs montrent leurs valeurs sans se régler.
    function verrouillerCapteurs(oui) {
      for (const champ of panneau.querySelectorAll('[data-capteur]')) champ.disabled = !!oui;
      const aide = panneau.querySelector('.capteurs-aide');
      if (aide) aide.textContent = oui ? 'valeurs lues sur la vraie carte' : 'à régler à la main pendant la simulation';
    }
    return { afficher, capteurs, verrouillerCapteurs };
  }

  // ---------- Vue complète ----------

  // Bouton poussoir : appuyé tant qu'on garde le clic (ou la touche Espace / Entrée), relâché dès qu'on lâche.
  function poussoir(el, appuyer) {
    let tenu = false;
    const lacher = () => {
      if (!tenu) return;
      tenu = false;
      appuyer(0);
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      tenu = true;
      appuyer(1);
    });
    el.addEventListener('pointerup', lacher);
    el.addEventListener('pointercancel', lacher);
    el.addEventListener('lostpointercapture', lacher);
    el.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (e.repeat || tenu) return;
      tenu = true;
      appuyer(1);
    });
    el.addEventListener('keyup', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      lacher();
    });
    el.addEventListener('blur', lacher);
  }

  // Position (-100 à 100) d'un axe lu sur sa broche (0 à 1023), comme le bloc « position du joystick ».
  function positionAffichee(brut, inverse) {
    const p = Math.round(((Number(brut) - 512) * 100) / 512);
    return Math.max(-100, Math.min(100, inverse ? -p : p));
  }
  // Valeur brute d'une position (-100 à 100) : le contraire.
  const brutDe = (position, inverse) => Math.max(0, Math.min(1023, Math.round(512 + (inverse ? -position : position) * 5.11)));

  // Manche du joystick : tiré à la souris ou au doigt (lâché, il revient au centre, comme un vrai), ou aux flèches.
  function manche(el, c, rappels) {
    let tenu = false;
    let clavier = { x: 0, y: 0 };
    const regler = (x, y) => rappels.reglerJoystick && rappels.reglerJoystick(brutDe(x, c.inverserX), brutDe(y, c.inverserY));
    const suivre = (e) => {
      const r = el.getBoundingClientRect();
      const borne = (v) => Math.max(-100, Math.min(100, Math.round(v)));
      // Le cercle du plateau fait 34/48 de la case : son bord = 100.
      const rayon = (r.width * 17) / 48;
      regler(borne(((e.clientX - r.left - r.width / 2) / rayon) * 100), borne((-(e.clientY - r.top - r.height / 2) / rayon) * 100));
    };
    const lacher = () => {
      if (!tenu) return;
      tenu = false;
      regler(0, 0);
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      el.focus();
      el.setPointerCapture(e.pointerId);
      tenu = true;
      suivre(e);
    });
    el.addEventListener('pointermove', (e) => tenu && suivre(e));
    el.addEventListener('pointerup', lacher);
    el.addEventListener('pointercancel', lacher);
    el.addEventListener('lostpointercapture', lacher);
    // Flèches : le manche est poussé à fond tant que la flèche est tenue (sans gêner les blocs « quand la touche »,
    // qui écoutent le clavier seulement quand le plateau n'a pas le focus).
    const FLECHES = { ArrowUp: ['y', 100], ArrowDown: ['y', -100], ArrowLeft: ['x', -100], ArrowRight: ['x', 100] };
    el.addEventListener('keydown', (e) => {
      const f = FLECHES[e.key];
      if (!f) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      clavier = Object.assign({}, clavier, { [f[0]]: f[1] });
      regler(clavier.x, clavier.y);
    });
    el.addEventListener('keyup', (e) => {
      const f = FLECHES[e.key];
      if (!f) return;
      e.preventDefault();
      e.stopPropagation();
      clavier = Object.assign({}, clavier, { [f[0]]: 0 });
      regler(clavier.x, clavier.y);
    });
    el.addEventListener('blur', () => {
      if (clavier.x || clavier.y) regler(0, 0);
      clavier = { x: 0, y: 0 };
    });
  }

  function creerVue(racine, exercice, rappels) {
    const composants = exercice.composants || [];
    const compact = composants.length > 4;
    const recadrer = composants.length > 4;
    const carte = exercice.carte === 'microbit' || exercice.carte === 'mbot' ? exercice.carte : 'uno';
    racine.classList.toggle('avec-carte', carte !== 'uno');
    for (const vieux of racine.querySelectorAll('.simu-capteurs')) vieux.remove();
    const avecMatrice = carte === 'mbot' && (exercice.blocsAutorises || []).some((t) => /^mbot_matrice_/.test(t));
    const vueDeCarte = carte === 'uno' ? null : vueCarte(racine, carte, rappels, avecMatrice);
    if (!vueDeCarte) racine.querySelector('.simu-carte').innerHTML = `<div class="simu-carte-dessin">${dessinCarte(composants, recadrer)}</div>`;
    // Illustration du projet (distributeur : exercices 8 et 13) : à droite des cartes des composants.
    const distributeur = exercice.illustration === 'distributeur';
    racine.querySelector('.simu-distributeur').innerHTML = distributeur ? dessinDistributeur() : '';
    racine.querySelector('.simu-milieu').classList.toggle('avec-distributeur', distributeur);
    const grille = racine.querySelector('.simu-composants');
    grille.classList.toggle('compact', compact);
    grille.innerHTML = composants.map((c) => carteComposant(c, compact)).join('');

    // Une carte par composant (dans un exercice libre, deux composants peuvent partager une broche : signalé).
    const cartes = [];
    for (const [k, el] of [...grille.querySelectorAll('.composant')].entries()) {
      const broche = el.dataset.broche;
      cartes[k] = el;
      if (composants[k] && composants[k].conflit) {
        el.classList.add('conflit');
        el.insertAdjacentHTML('beforeend', '<span class="composant-conflit" role="note">⚠ Broche partagée avec un autre composant</span>');
      }
      el.addEventListener('mouseenter', () => {
        surlignerBroche(racine, broche);
        el.classList.add('survol');
      });
      el.addEventListener('mouseleave', () => {
        surlignerBroche(racine, null);
        el.classList.remove('survol');
      });
      const b = el.querySelector('.bouton-poussoir');
      const c = composants[k];
      if (b && c && c.type === 'joystick') {
        poussoir(b, (valeur) => rappels.appuyerBouton(c.bouton, valeur));
        manche(el.querySelector('.joystick-plateau'), c, rappels);
      } else if (b) poussoir(b, (valeur) => rappels.appuyerBouton(broche, valeur));
    }

    const memoire = [];
    function maj(k, valeur, quoi) {
      if (memoire[k] === valeur) return;
      memoire[k] = valeur;
      const el = cartes[k];
      const c = composants[k];
      if (el && c) {
        const pastille = el.querySelector('.pastille-etat');
        if (c.type === 'led') {
          el.classList.toggle('actif', !!valeur);
          pastille.textContent = valeur ? '● Allumée (HAUT)' : '○ Éteinte (BAS)';
        } else if (c.type === 'bouton') {
          el.classList.toggle('actif', !!valeur);
          el.querySelector('.bouton-poussoir').setAttribute('aria-pressed', valeur ? 'true' : 'false');
          pastille.textContent = valeur ? 'ON' : 'OFF';
        } else if (c.type === 'buzzer') {
          el.classList.toggle('actif', !!valeur);
          pastille.textContent = valeur ? `♪ ${Math.round(valeur)} Hz` : 'Silence';
        } else if (c.type === 'joystick') {
          // « x,y,bouton » : valeurs brutes (0 à 1023) des deux axes, bouton 0/1.
          const [bx, by, bouton] = String(valeur || '512,512,0').split(',').map(Number);
          const x = positionAffichee(bx, c.inverserX);
          const y = positionAffichee(by, c.inverserY);
          el.querySelector('.joystick-manche').setAttribute('transform', `translate(${(x * 0.09).toFixed(1)} ${(-y * 0.09).toFixed(1)})`);
          el.querySelector('.joystick-plateau').setAttribute('aria-valuetext', `X ${x}, Y ${y}`);
          el.querySelector('.bouton-poussoir').setAttribute('aria-pressed', bouton ? 'true' : 'false');
          el.classList.toggle('actif', !!bouton);
          pastille.textContent = `X : ${x} · Y : ${y} · bouton ${bouton ? 'appuyé' : 'relâché'}`;
        } else if (c.type === 'servo') {
          el.querySelector('.servo-bras').style.transform = `rotate(${-valeur}deg)`;
          pastille.textContent = Math.round(valeur) + '°';
        }
      }
      if (quoi) quoi();
    }

    // Distributeur : voyants (LED nommées PetiteDose / GrandeDose / Trappe) et trappe.
    const distri = racine.querySelector('.distributeur');
    function majDistributeur(etats, enMarche) {
      if (!distri) return;
      for (const c of composants) {
        if (c.type !== 'led' || !COULEURS_LED[c.nom]) continue;
        const v = distri.querySelector(`[data-voyant="${c.nom}"] circle`);
        const on = !!etats[c.broche];
        v.setAttribute('fill', on ? COULEURS_LED[c.nom] : '#EEF3F6');
        v.setAttribute('stroke', on ? '#5B3A00' : '#7C8B94');
      }
      // Servo : 90° = trappe fermée, 0° = ouverte. Sans servo (exercice 8), la LED Trappe ouvre la trappe.
      const servo = composants.find((c) => c.type === 'servo');
      const ledTrappe = composants.find((c) => c.type === 'led' && c.nom === 'Trappe');
      let ouverture = 0; // 0 fermée, 1 ouverte
      if (servo) ouverture = Math.min(1, Math.max(0, (90 - (etats[servo.broche] || 0)) / 90));
      else if (ledTrappe) ouverture = etats[ledTrappe.broche] ? 1 : 0;
      distri.querySelector('.trappe').style.transform = `rotate(${ouverture * 80}deg)`;
      // Les céréales ne tombent que pendant la simulation.
      distri.classList.toggle('ouverte', ouverture > 0.6 && !!enMarche);
      distri.querySelector('.trappe-etat').textContent = ouverture > 0.6 ? 'Trappe ouverte' : 'Trappe fermée';
    }

    // etats : { broche: valeur } (LED 0/1, servo en degrés, boutons 0/1)
    // sim : le simulateur en cours (écran de la micro:bit, moteurs du mBot…), ou rien s'il est arrêté.
    function afficher(etats, enMarche, sim) {
      // État par « broche|sorte » s'il est donné (deux composants sur une broche), sinon par broche.
      composants.forEach((c, k) => {
        const cle = c.broche + '|' + c.type;
        maj(k, (cle in etats ? etats[cle] : etats[c.broche]) || 0);
      });
      majDistributeur(etats, enMarche);
      if (vueDeCarte) vueDeCarte.afficher(sim || null);
    }

    // capteurs : valeurs réglées à la main, à passer au simulateur (creerSimulation({ capteurs })).
    return { afficher, carte, capteurs: vueDeCarte ? vueDeCarte.capteurs : null, verrouillerCapteurs: (oui) => vueDeCarte && vueDeCarte.verrouillerCapteurs(oui) };
  }

  Object.assign(A, { creerVueSimulateur: creerVue, couleurFil });
})(this);

// ===== interface/aides.js =====
// Aides pédagogiques (reprises de l'atelier) : indices (3 niveaux), fiches « À savoir » (avec schéma), lexique.
// Les textes viennent du paquet de parcours (exercices, fiches, lexique).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const C = () => A.COULEURS_BLOCS;
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Petits blocs (même allure que l'éditeur), pour les fiches et la silhouette ----------

  // trous : true → chaque valeur (broche, HAUT/BAS, nombre, symbole) devient une case « ? ».
  function blocsHtml(programme, options) {
    const o = options || {};
    const trous = !!o.trous;
    const trou = '<span class="pb-trou" aria-label="à compléter">?</span>';
    const pastille = (texte) => (trous ? trou : `<span class="pb-champ">${echapper(texte)}</span>`);
    const image = (nom) => `<img class="pb-icone" alt="" src="${A.imageIcone(nom, '#1F2A30', 2.6)}">`;
    const hautBas = (v) => (v ? 'HAUT (1)' : 'BAS (0)');
    const hautBasLed = (v) => (A.aideLed ? (v ? 'HAUT (1) : allumée' : 'BAS (0) : éteinte') : hautBas(v));

    // Bloc d'une carte (mBot, micro:bit) : dessiné d'après sa description (noyau/cartes.js), en lilas avec le puzzle.
    function blocCarte(b) {
      const d = A.BLOCS_CARTES && A.BLOCS_CARTES[b.bloc];
      if (!d) return null;
      const texte = echapper(d.texte).replace(/%([A-Z]+)/g, (_, nom) => {
        const cle = nom.toLowerCase();
        const champ = (d.champs || {})[nom];
        if (champ === 'texte') return pastille(b[cle] !== undefined ? b[cle] : (d.defauts || {})[nom] || '');
        if (champ) {
          const option = champ.find((o) => String(o[1]) === String(b[cle])) || champ[0];
          return pastille(option[0]);
        }
        return expression(b[cle] !== undefined ? b[cle] : (d.entrees || {})[nom]);
      });
      const fond = `background:${C().extension}`;
      if (d.sorte === 'instruction') return `<div class="pb-bloc" style="${fond}">${image('puzzle')} ${texte}</div>`;
      return `<span class="${d.sorte === 'condition' ? 'pb-hexa' : 'pb-rond'} pb-grand" style="${fond}">${texte}</span>`;
    }

    function expression(e) {
      if (e === null || e === undefined) return '<span class="pb-vide" aria-label="case vide"></span>';
      if (typeof e === 'number') return pastille(String(e));
      switch (e.bloc) {
        case 'nombre':
          return pastille(String(e.valeur));
        case 'variable':
          return `<span class="pb-rond" style="background:${C().variable}">${echapper(e.variable || 'CHOIX')}</span>`;
        case 'operation':
          return `<span class="pb-rond pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : echapper(e.op === 'mod' ? 'reste de ÷' : e.op)} ${expression(e.b)}</span>`;
        case 'hasard':
          return `<span class="pb-rond pb-grand" style="background:${C().bleu}">nombre au hasard entre ${expression(e.min)} et ${expression(e.max)}</span>`;
        case 'reetalonner':
          return `<span class="pb-rond pb-grand" style="background:${C().bleu}">ré-étalonner ${expression(e.valeur)} depuis ( ${expression(e.de1)} , ${expression(e.de2)} ) vers ( ${expression(e.vers1)} , ${expression(e.vers2)} )</span>`;
        case 'joystick_position':
          return `<span class="pb-rond" style="background:${C().valeur}">${image('joystick')} position du joystick sur ${pastille(e.axe === 'y' ? 'Y' : 'X')}</span>`;
        case 'joystick_valeur':
          return `<span class="pb-rond" style="background:${C().valeur}">${image('joystick')} valeur du joystick sur ${pastille(e.axe === 'y' ? 'Y' : 'X')} (0 à 1023)</span>`;
        case 'joystick_direction': {
          const d = (A.DIRECTIONS_JOYSTICK || []).find((x) => x[1] === e.direction);
          return `<span class="pb-hexa" style="background:${C().valeur}">${image('joystick')} le joystick est ${pastille(d ? (e.direction === 'centre' ? d[0] : 'poussé ' + d[0]) : e.direction || '')}</span>`;
        }
        case 'joystick_bouton':
          return `<span class="pb-hexa" style="background:${C().valeur}">${image('joystick')} le bouton du joystick est appuyé</span>`;
        case 'logique':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : e.op} ${expression(e.b)}</span>`;
        case 'non':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">non ${expression(e.a)}</span>`;
        case 'bouton_etat':
          return `<span class="pb-hexa" style="background:${C().valeur}">${image('bouton')} état sur la broche ${pastille(e.broche)}</span>`;
        case 'valeur_haut_bas':
          return `<span class="pb-hexa" style="background:${C().valeur}">${trous ? trou : hautBas(e.valeur)}</span>`;
        case 'comparaison':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : e.op} ${expression(e.b)}</span>`;
        default:
          return blocCarte(e) || '';
      }
    }

    function instruction(i) {
      const style = (c) => `style="background:${c}"`;
      switch (i.bloc) {
        case 'led_etat':
          return `<div class="pb-bloc" ${style(C().lumiere)}>${image('lumiere')} contrôler la LED à l’état ${pastille(hautBasLed(i.etat))} sur la broche ${pastille(i.broche)}</div>`;
        case 'attendre':
          return `<div class="pb-bloc" ${style(C().bleu)}>attendre ${expression(i.duree)} seconde(s)</div>`;
        case 'servo_angle':
          return `<div class="pb-bloc" ${style(C().servo)}>${image('moteur')} contrôler l’angle à ${expression(i.angle)} ° sur la broche ${pastille(i.broche)}</div>`;
        case 'affecter':
          return `<div class="pb-bloc" ${style(C().variable)}>affecter à <span class="pb-champ">${echapper(i.variable || 'CHOIX')}</span> la valeur ${expression(i.valeur)}</div>`;
        case 'ajouter_a':
          return `<div class="pb-bloc" ${style(C().variable)}>ajouter à <span class="pb-champ">${echapper(i.variable || 'CHOIX')}</span> la valeur ${expression(i.valeur)}</div>`;
        case 'son':
          return `<div class="pb-bloc" ${style(C().lumiere)}>${image('son')} jouer la note ${expression(i.frequence)} Hz pendant ${expression(i.duree)} s sur la broche ${pastille(i.broche)}</div>`;
        case 'repeter_n':
        case 'tant_que':
        case 'repeter_jusqua': {
          const tete = i.bloc === 'repeter_n' ? `répéter ${expression(i.fois)} fois` : i.bloc === 'tant_que' ? `tant que ${expression(i.condition)} répéter` : `répéter jusqu’à ${expression(i.condition)}`;
          return `<div class="pb-c" style="--c:${C().decision}"><div class="pb-tete">${tete}</div><div class="pb-corps">${pile(i.corps)}</div><div class="pb-pied"></div></div>`;
        }
        case 'si_alors':
        case 'si_sinon': {
          const c = C().decision;
          let h = `<div class="pb-c" style="--c:${c}"><div class="pb-tete">si ${expression(i.condition)} alors</div>`;
          h += `<div class="pb-corps">${pile(i.alors)}</div>`;
          if (i.bloc === 'si_sinon') h += `<div class="pb-tete pb-milieu">sinon</div><div class="pb-corps">${pile(i.sinon)}</div>`;
          return h + '<div class="pb-pied"></div></div>';
        }
        default:
          return blocCarte(i) || '';
      }
    }

    function pile(liste) {
      if (!liste || !liste.length) return '<div class="pb-emplacement"></div>';
      return liste.map(instruction).join('');
    }

    const chapeau = (titre, liste) =>
      `<div class="pb-c pb-chapeau" style="--c:${C().debut}"><div class="pb-tete">${titre}</div>` +
      `<div class="pb-corps">${pile(liste)}</div><div class="pb-pied"></div></div>`;

    // Programme v1 (fils) ou programme de l'atelier ({ demarrage, boucle }).
    const fils = A.versV1(programme || {}).fils;
    const fil = (q) => fils.find((f) => f.quand === q);
    let h = '<div class="petits-blocs">';
    const demarrage = fil('demarrage');
    if (demarrage && (demarrage.corps.length || o.avecVides)) h += chapeau('Au démarrage', demarrage.corps);
    if (fil('boucle')) h += chapeau('Répéter indéfiniment', fil('boucle').corps);
    for (const f of fils.filter((x) => x.quand === 'appui' || x.quand === 'relache')) {
      h += chapeau(`${image('bouton')} quand le bouton de la broche ${pastille(f.broche)} est ${f.quand === 'appui' ? 'appuyé' : 'relâché'}`, f.corps);
    }
    return h + '</div>';
  }

  // ---------- Schémas des fiches ----------

  function chronogramme(series) {
    const total = Math.max(...series.map((s) => s.etats.reduce((t, e) => t + e[0], 0)));
    const largeur = 300;
    const gauche = 92;
    const hLigne = 44;
    const ech = (largeur - gauche - 8) / total;
    let svg = `<svg class="schema-svg" viewBox="0 0 ${largeur} ${series.length * hLigne + 26}" role="img" aria-label="Chronogramme">`;
    series.forEach((s, i) => {
      const y0 = 10 + i * hLigne;
      svg += `<text x="0" y="${y0 + 20}" class="schema-texte">${echapper(s.nom)}</text>`;
      let x = gauche;
      for (const [duree, etat] of s.etats) {
        const w = duree * ech;
        const haut = etat === 'HAUT' || /^9|^18/.test(etat);
        const y = haut ? y0 + 2 : y0 + 22;
        svg += `<rect x="${x}" y="${y}" width="${w}" height="${haut ? 28 : 8}" rx="3" fill="${haut ? '#FAB22B' : '#D5DEE3'}" stroke="#1F2A30" stroke-width="1.2"/>`;
        if (w > 22) svg += `<text x="${x + w / 2}" y="${haut ? y + 18 : y - 4}" text-anchor="middle" class="schema-petit">${echapper(etat)}</text>`;
        x += w;
      }
    });
    // Axe du temps, en secondes
    const yAxe = series.length * hLigne + 12;
    svg += `<line x1="${gauche}" y1="${yAxe}" x2="${largeur - 8}" y2="${yAxe}" stroke="#4F5D66" stroke-width="1.2"/>`;
    for (let t = 0; t <= total; t += total > 4 ? 2 : 1) {
      const x = gauche + t * ech;
      svg += `<line x1="${x}" y1="${yAxe - 3}" x2="${x}" y2="${yAxe + 3}" stroke="#4F5D66"/>`;
      svg += `<text x="${x}" y="${yAxe + 13}" text-anchor="middle" class="schema-petit">${t} s</text>`;
    }
    return svg + '</svg>';
  }

  function ledSchema() {
    const led = (x, on) =>
      `<g transform="translate(${x},0)">` +
      (on ? '<circle cx="24" cy="30" r="22" fill="#FAB22B" opacity=".3"/>' : '') +
      `<path d="M12 46V30a12 12 0 0 1 24 0v16z" fill="${on ? '#FAB22B' : '#EEF3F6'}" stroke="${on ? '#5B3A00' : '#7C8B94'}" stroke-width="2.5"/>` +
      '<path d="M20 46v14M28 46v10" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      `<text x="24" y="78" text-anchor="middle" class="schema-texte">${on ? 'HAUT (1)' : 'BAS (0)'}</text>` +
      `<text x="24" y="92" text-anchor="middle" class="schema-petit">${on ? 'allumée' : 'éteinte'}</text></g>`;
    return `<svg class="schema-svg schema-etroit" viewBox="0 0 200 96" role="img" aria-label="LED éteinte et LED allumée">${led(30, false)}${led(122, true)}</svg>`;
  }

  function servoSchema(angles) {
    const cadran = (cx, angle, legende) => {
      const r = (angle * Math.PI) / 180;
      return (
        `<g><path d="M${cx - 30} 50A30 30 0 0 1 ${cx + 30} 50" fill="none" stroke="#9AA8B0" stroke-width="2"/>` +
        `<line x1="${cx}" y1="50" x2="${cx + 24 * Math.cos(r)}" y2="${50 - 24 * Math.sin(r)}" stroke="#1F2A30" stroke-width="6" stroke-linecap="round"/>` +
        `<line x1="${cx}" y1="50" x2="${cx + 24 * Math.cos(r)}" y2="${50 - 24 * Math.sin(r)}" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="50" r="4" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>` +
        `<text x="${cx}" y="68" text-anchor="middle" class="schema-texte">${angle}°</text>` +
        (legende ? `<text x="${cx}" y="82" text-anchor="middle" class="schema-petit">${legende}</text>` : '') +
        '</g>'
      );
    };
    if (!angles) {
      return (
        '<svg class="schema-svg" viewBox="0 0 300 90" role="img" aria-label="Servo-moteur à 0°, 90° et 180°">' +
        cadran(50, 0, 'bras à droite') + cadran(150, 90, 'bras en haut') + cadran(250, 180, 'bras à gauche') + '</svg>'
      );
    }
    const pas = 300 / angles.length;
    let svg = `<svg class="schema-svg" viewBox="0 0 300 90" role="img" aria-label="Suite de positions du servo-moteur">`;
    angles.forEach((a, i) => {
      svg += cadran(pas / 2 + i * pas, a, '');
      if (i < angles.length - 1) svg += `<text x="${pas * (i + 1)}" y="44" text-anchor="middle" class="schema-texte">›</text>`;
    });
    return svg + '</svg>';
  }

  function fourche() {
    return (
      '<svg class="schema-svg" viewBox="0 0 300 120" role="img" aria-label="Fourche si alors sinon">' +
      '<rect x="95" y="4" width="110" height="30" rx="8" fill="#78B5D6" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="150" y="24" text-anchor="middle" class="schema-texte">bouton appuyé ?</text>' +
      '<path d="M150 34v14M150 48H70v18M150 48h80v18" fill="none" stroke="#1F2A30" stroke-width="2"/>' +
      '<text x="96" y="62" class="schema-petit">oui</text><text x="186" y="62" class="schema-petit">non</text>' +
      '<rect x="10" y="68" width="120" height="44" rx="8" fill="#F7AE5E" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="70" y="86" text-anchor="middle" class="schema-texte">alors</text><text x="70" y="102" text-anchor="middle" class="schema-petit">LED allumée</text>' +
      '<rect x="170" y="68" width="120" height="44" rx="8" fill="#F7AE5E" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="230" y="86" text-anchor="middle" class="schema-texte">sinon</text><text x="230" y="102" text-anchor="middle" class="schema-petit">LED éteinte</text>' +
      '</svg>'
    );
  }

  function capteurActionneur() {
    const boite = (x, couleur, titre, sous) =>
      `<rect x="${x}" y="20" width="84" height="48" rx="8" fill="${couleur}" stroke="#1F2A30" stroke-width="1.5"/>` +
      `<text x="${x + 42}" y="40" text-anchor="middle" class="schema-texte">${titre}</text>` +
      `<text x="${x + 42}" y="56" text-anchor="middle" class="schema-petit">${sous}</text>`;
    const fleche = (x) => `<path d="M${x} 44h20m-6-6 6 6-6 6" fill="none" stroke="#1F2A30" stroke-width="2" stroke-linecap="round"/>`;
    return (
      '<svg class="schema-svg" viewBox="0 0 300 88" role="img" aria-label="Le capteur commande l’actionneur">' +
      boite(0, '#78B5D6', 'Bouton', 'capteur') + fleche(88) + boite(108, '#BCDAEB', 'Carte', 'programme') + fleche(196) +
      boite(216, '#E78AB3', 'Moteur', 'actionneur') + '</svg>'
    );
  }

  function variableSchema(nom, valeur) {
    return (
      '<svg class="schema-svg schema-etroit" viewBox="0 0 200 100" role="img" aria-label="Une variable est une boîte avec une étiquette">' +
      '<path d="M40 40h120v52H40z" fill="#FFF4DD" stroke="#1F2A30" stroke-width="2"/>' +
      '<path d="M40 40l14-16h92l14 16" fill="#F0D9A8" stroke="#1F2A30" stroke-width="2" stroke-linejoin="round"/>' +
      `<rect x="62" y="6" width="76" height="22" rx="6" fill="#EC8780" stroke="#1F2A30" stroke-width="1.5"/>` +
      `<text x="100" y="22" text-anchor="middle" class="schema-texte">${echapper(nom)}</text>` +
      `<text x="100" y="76" text-anchor="middle" class="schema-grand">${echapper(valeur)}</text>` +
      '</svg>'
    );
  }

  // Au démarrage (une fois), puis Répéter indéfiniment (sans fin).
  function deroulement() {
    return (
      '<svg class="schema-svg" viewBox="0 0 300 116" role="img" aria-label="Au démarrage une fois, puis Répéter indéfiniment sans fin">' +
      '<rect x="4" y="34" width="112" height="44" rx="14" fill="#86C595" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="60" y="54" text-anchor="middle" class="schema-texte">Au démarrage</text>' +
      '<text x="60" y="69" text-anchor="middle" class="schema-petit">une seule fois</text>' +
      '<path d="M118 56h40m-7-7 7 7-7 7" fill="none" stroke="#1F2A30" stroke-width="2.2" stroke-linecap="round"/>' +
      '<rect x="162" y="34" width="134" height="44" rx="14" fill="#86C595" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="229" y="54" text-anchor="middle" class="schema-texte">Répéter indéfiniment</text>' +
      '<text x="229" y="69" text-anchor="middle" class="schema-petit">puis sans fin</text>' +
      '<path d="M270 80c0 26-82 26-82 0" fill="none" stroke="#1A6E8E" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M182 86l6-7 6 7" fill="none" stroke="#1A6E8E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="229" y="112" text-anchor="middle" class="schema-petit">on recommence au début</text>' +
      '<text x="60" y="22" text-anchor="middle" class="schema-petit">la carte s’allume</text>' +
      '</svg>'
    );
  }

  function schemaHtml(s) {
    if (!s) return '';
    switch (s.type) {
      case 'led':
        return ledSchema();
      case 'chronogramme':
        return chronogramme(s.series);
      case 'blocs':
        return blocsHtml(s.programme, {});
      case 'fourche':
        return fourche();
      case 'servo':
        return servoSchema();
      case 'angles':
        return servoSchema(s.angles);
      case 'capteur-actionneur':
        return capteurActionneur();
      case 'deroulement':
        return deroulement();
      case 'variable':
        return variableSchema(s.nom || 'CHOIX', s.valeur === undefined ? 3 : s.valeur);
      default:
        return '';
    }
  }

  // ---------- Panneau qui glisse par-dessus l'éditeur ----------

  function creerAides(rappels) {
    const panneau = document.querySelector('.panneau-aide');
    const titre = panneau.querySelector('.panneau-aide-titre');
    const corps = panneau.querySelector('.panneau-aide-corps');
    const icone = panneau.querySelector('.panneau-aide-icone');
    let ouvert = null; // 'fiche' | 'indice'
    let exercice = null;

    function ouvrir(sorte, nomIcone, texteTitre, html) {
      ouvert = sorte;
      icone.innerHTML = A.icone(nomIcone, { couleur: '#1A6E8E' });
      titre.textContent = texteTitre;
      corps.innerHTML = html;
      panneau.hidden = false;
      panneau.querySelector('.panneau-aide-fermer').focus();
      for (const b of document.querySelectorAll('[data-aide]')) b.setAttribute('aria-expanded', String(b.dataset.aide === sorte));
    }
    function fermer() {
      ouvert = null;
      panneau.hidden = true;
      for (const b of document.querySelectorAll('[data-aide]')) b.setAttribute('aria-expanded', 'false');
    }
    panneau.querySelector('.panneau-aide-fermer').addEventListener('click', fermer);

    // ----- Fiche « À savoir » -----

    // Fiche choisie par sa clé (ex. l'explication des blocs « Au démarrage » et « Répéter indéfiniment »).
    function explication(cle) {
      const f = (A.fiches || {})[cle];
      if (!f) return;
      ouvrir('explication', 'info', f.titre,
        '<ul class="fiche-lignes">' + f.lignes.map((l) => `<li>${echapper(l)}</li>`).join('') + '</ul>' +
          `<div class="fiche-schema">${schemaHtml(f.schema)}</div>`);
    }

    function fiche() {
      if (ouvert === 'fiche') return fermer();
      const f = (A.fiches || {})[exercice.aSavoir];
      if (!f) return ouvrir('fiche', 'info', 'À savoir', '<p>Pas de fiche pour cet exercice.</p>');
      let html = '<ul class="fiche-lignes">' + f.lignes.map((l) => `<li>${echapper(l)}</li>`).join('') + '</ul>';
      if (f.etapes) {
        html += '<div class="fiche-etapes" aria-live="polite"></div>' +
          '<div class="fiche-navigation"><button type="button" class="btn-secondaire btn-etape-prec">Précédent</button>' +
          '<span class="etape-numero"></span>' +
          '<button type="button" class="btn-principal btn-etape-suiv">Suivant</button></div>';
      } else html += `<div class="fiche-schema">${schemaHtml(f.schema)}</div>`;
      ouvrir('fiche', 'info', f.titre, html);
      if (f.etapes) {
        let n = 0;
        const montrer = () => {
          const e = f.etapes[n];
          corps.querySelector('.fiche-etapes').innerHTML = `<p class="etape-texte">${echapper(e.texte)}</p>${blocsHtml(e.programme, {})}`;
          corps.querySelector('.etape-numero').textContent = `Étape ${n + 1} sur ${f.etapes.length}`;
          corps.querySelector('.btn-etape-prec').disabled = n === 0;
          corps.querySelector('.btn-etape-suiv').disabled = n === f.etapes.length - 1;
        };
        corps.querySelector('.btn-etape-prec').addEventListener('click', () => {
          n = Math.max(0, n - 1);
          montrer();
        });
        corps.querySelector('.btn-etape-suiv').addEventListener('click', () => {
          n = Math.min(f.etapes.length - 1, n + 1);
          montrer();
        });
        montrer();
      }
    }

    // ----- Indices : révélés un par un, jamais la solution complète -----

    const NOMS = ['La consigne en une phrase', 'Les blocs à utiliser', 'La silhouette du programme'];
    function indiceHtml(niveau) {
      if (niveau === 3) {
        const solution = exercice.silhouette || exercice.solutionReference;
        return '<p>Les cases « ? » sont à compléter : à toi de trouver les broches et les valeurs.</p>' + blocsHtml(solution, { trous: true });
      }
      return `<p>${echapper((exercice.indices || [])[niveau - 1] || '')}</p>`;
    }
    function dessinerIndices() {
      const vus = rappels.indicesOuverts();
      let html = '';
      for (let n = 1; n <= vus; n++) {
        html += `<section class="indice"><h3><span class="indice-niveau">${n}</span>${NOMS[n - 1]}</h3>${indiceHtml(n)}</section>`;
      }
      if (vus < 3) {
        html +=
          (vus ? '' : '<p class="indice-intro">Trois indices, du plus léger au plus fort. Ouvre-les un par un.</p>') +
          '<p class="indice-note">Les indices s’ouvrent un par un. Ton professeur voit combien tu en as utilisé : essaie d’abord sans !</p>' +
          `<button type="button" class="btn-principal btn-indice-suivant">${A.icone('ampoule')}Voir l’indice ${vus + 1}</button>`;
      } else html += '<p class="indice-intro">Tu as vu les trois indices. La solution complète n’est jamais montrée : à toi de jouer !</p>';
      ouvrir('indice', 'ampoule', `Indices (${vus}/3)`, html);
      const b = corps.querySelector('.btn-indice-suivant');
      if (b) {
        b.addEventListener('click', () => {
          rappels.ouvrirIndice(vus + 1);
          dessinerIndices();
          const dernier = corps.querySelectorAll('.indice');
          if (dernier.length) dernier[dernier.length - 1].scrollIntoView({ block: 'nearest' });
        });
      }
    }
    function indice() {
      if (ouvert === 'indice') return fermer();
      dessinerIndices();
    }

    return {
      changerExercice(ex) {
        exercice = ex;
        fermer();
      },
      fiche,
      indice,
      explication,
      fermer,
    };
  }

  // ---------- Lexique : toutes les définitions, avec recherche ----------

  function creerLexique(motsVus) {
    const dialogue = document.querySelector('.dialogue-lexique');
    const recherche = dialogue.querySelector('.lexique-recherche');
    const filtre = dialogue.querySelector('.lexique-vus');
    const grille = dialogue.querySelector('.lexique-grille');
    const simple = (s) => A.simplifierNom(s);

    function dessiner() {
      const q = simple(recherche.value);
      const vus = motsVus();
      const entrees = (A.lexique || []).map((e, i) => ({ e, i })).filter(({ e, i }) => {
        if (filtre.checked && !vus.has(i)) return false;
        return !q || simple(e.mot).includes(q) || simple(e.definition).includes(q) || (e.formes || []).some((f) => simple(f).includes(q));
      });
      if (!entrees.length) {
        grille.innerHTML = `<p class="lexique-vide">Aucun mot ne correspond${recherche.value ? ` à « ${echapper(recherche.value)} »` : ''}.</p>`;
        return;
      }
      grille.innerHTML = entrees
        .map(
          ({ e, i }) =>
            `<article class="lexique-carte${vus.has(i) ? ' vu' : ''}">` +
            `<div class="lexique-picto">${A.icone(e.icone || 'livre', { couleur: '#1A6E8E', epaisseur: 2.4 })}</div>` +
            `<div><h3>${echapper(e.mot)}${vus.has(i) ? '<span class="lexique-badge">déjà vu</span>' : ''}</h3>` +
            `<p>${echapper(e.definition)}</p></div></article>`,
        )
        .join('');
    }
    recherche.addEventListener('input', dessiner);
    filtre.addEventListener('change', dessiner);
    dialogue.querySelector('.btn-fermer-lexique').addEventListener('click', () => dialogue.close());

    return {
      ouvrir() {
        recherche.value = '';
        dessiner();
        dialogue.showModal();
        recherche.focus();
      },
    };
  }

  // Le mot apparaît-il tel quel dans le texte (pas au milieu d'un autre mot) ?
  function contientMot(texte, mot) {
    const echappe = mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?<![\\p{L}\\d])' + echappe + '(?![\\p{L}\\d])', 'u').test(texte);
  }

  Object.assign(A, { blocsHtml, schemaHtml, creerAides, creerLexique, contientMot });
})(this);

// ===== interface/televersement.js =====
// Installation du programme de la carte (cartes/firmwares.js) dans une Arduino Uno ou un mBot (carte mCore),
// depuis le navigateur (Chrome, Edge : Web Serial). Repris de l'atelier du distributeur (flasher.js) et de la page
// d'essai du jalon 0. On parle au « bootloader » de la carte (le petit programme qui écoute pendant une seconde après
// chaque redémarrage) avec le protocole STK500, comme l'IDE Arduino :
//   - Uno et mCore (optiboot) : 115200 bauds ; anciens bootloaders (clones) : 57600 bauds.
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});

  const VITESSES_BOOTLOADER = [115200, 57600];
  const TAILLE_PAGE = 128; // octets par page de mémoire flash (ATmega328P)
  const TAILLE_MAX = 32256; // place pour le programme (32 Ko moins le bootloader)

  // Codes du protocole STK500.
  const STK = {
    OK: 0x10,
    INSYNC: 0x14,
    EOP: 0x20,
    GET_SYNC: 0x30,
    ENTER_PROGMODE: 0x50,
    LEAVE_PROGMODE: 0x51,
    LOAD_ADDRESS: 0x55,
    PROG_PAGE: 0x64,
    READ_PAGE: 0x74,
    READ_SIGN: 0x75,
  };

  // Messages en français, avec la prochaine action.
  const MESSAGES = {
    pasDeBootloader: 'La carte ne se laisse pas programmer. Débranche et rebranche le câble USB, puis réessaie. Si ça recommence, demande au professeur.',
    mauvaisePuce: 'Cette carte n’est ni une Arduino Uno ni un mBot : impossible d’y installer le programme. Demande au professeur.',
    verificationRatee: 'L’installation n’a pas été vérifiée correctement. Réessaie, sans débrancher le câble.',
    portOccupe: 'La carte est déjà utilisée par un autre programme (IDE Arduino, mBlock, autre onglet…). Ferme-le, puis réessaie.',
    fichierAbime: 'Le programme de la carte est introuvable ou abîmé. Recharge la page, puis réessaie.',
  };

  class ErreurTeleversement extends Error {}

  // ---------- Fichier .hex (Intel HEX) → image de la mémoire flash ----------
  function lireHex(texte) {
    const octets = new Uint8Array(TAILLE_MAX).fill(0xff);
    let taille = 0;
    let base = 0;
    for (const brut of String(texte).split(/\r?\n/)) {
      const ligne = brut.trim();
      if (!ligne) continue;
      if (ligne[0] !== ':' || ligne.length < 11) throw new ErreurTeleversement(MESSAGES.fichierAbime);
      const enr = [];
      for (let i = 1; i < ligne.length; i += 2) enr.push(parseInt(ligne.slice(i, i + 2), 16));
      if (enr.some(Number.isNaN) || enr.reduce((a, b) => a + b, 0) % 256 !== 0) throw new ErreurTeleversement(MESSAGES.fichierAbime);
      const [longueur, haut, bas, type] = enr;
      const donnees = enr.slice(4, 4 + longueur);
      if (type === 0x00) {
        const adresse = base + (haut << 8) + bas;
        if (adresse + longueur > TAILLE_MAX) throw new ErreurTeleversement(MESSAGES.fichierAbime);
        octets.set(donnees, adresse);
        taille = Math.max(taille, adresse + longueur);
      } else if (type === 0x01) break;
      else if (type === 0x02) base = ((donnees[0] << 8) + donnees[1]) * 16;
      else if (type === 0x04) base = ((donnees[0] << 8) + donnees[1]) * 65536;
    }
    if (taille === 0) throw new ErreurTeleversement(MESSAGES.fichierAbime);
    return octets.slice(0, taille);
  }

  // ---------- Lecture des octets reçus, avec délai maximal ----------
  class Lecteur {
    constructor(flux) {
      this.tampon = [];
      this.reveil = null;
      this.lecteur = flux.getReader();
      this.fini = this.boucle();
    }
    async boucle() {
      try {
        for (;;) {
          const { value, done } = await this.lecteur.read();
          if (done) break;
          for (const o of value) this.tampon.push(o);
          if (this.reveil) this.reveil();
        }
      } catch {
        // port fermé ou câble arraché
      } finally {
        this.lecteur.releaseLock();
        if (this.reveil) this.reveil();
      }
    }
    // n octets, ou null si rien n'arrive à temps.
    async lire(n, ms) {
      const fin = Date.now() + ms;
      while (this.tampon.length < n) {
        const reste = fin - Date.now();
        if (reste <= 0) return null;
        await new Promise((r) => {
          const t = setTimeout(r, reste);
          this.reveil = () => {
            clearTimeout(t);
            r();
          };
        });
        this.reveil = null;
      }
      return this.tampon.splice(0, n);
    }
    vider() {
      this.tampon.length = 0;
    }
    async arreter() {
      await this.lecteur.cancel().catch(() => {});
      await this.fini;
    }
  }

  const pause = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- Une séance avec le bootloader, à une vitesse donnée ----------
  class Seance {
    constructor(port) {
      this.port = port;
    }
    async ouvrir(bauds) {
      try {
        await this.port.open({ baudRate: bauds });
      } catch (e) {
        throw new ErreurTeleversement(e && e.name === 'InvalidStateError' ? MESSAGES.portOccupe : MESSAGES.pasDeBootloader);
      }
      this.entree = new Lecteur(this.port.readable);
      this.sortie = this.port.writable.getWriter();
    }
    async fermer() {
      if (this.entree) await this.entree.arreter();
      try {
        if (this.sortie) this.sortie.releaseLock();
      } catch {
        // déjà libéré
      }
      await this.port.close().catch(() => {});
      this.entree = this.sortie = null;
    }
    // Redémarre la carte (comme l'IDE Arduino) : le bootloader écoute pendant environ une seconde.
    async redemarrer() {
      await this.port.setSignals({ dataTerminalReady: false, requestToSend: false });
      await pause(250);
      await this.port.setSignals({ dataTerminalReady: true, requestToSend: true });
      await pause(50);
      this.entree.vider();
    }
    async envoyer(octets) {
      await this.sortie.write(Uint8Array.from(octets));
    }
    // Envoie une commande, attend INSYNC, « extra » octets de données, puis OK.
    async commande(octets, extra, ms) {
      await this.envoyer([...octets, STK.EOP]);
      const r = await this.entree.lire((extra || 0) + 2, ms || 500);
      if (!r || r[0] !== STK.INSYNC || r[r.length - 1] !== STK.OK) return null;
      return r.slice(1, -1);
    }
    // Juste après le redémarrage, le bootloader fait clignoter la LED L sans lire : une demande à la fois.
    async synchroniser() {
      for (let i = 0; i < 5; i++) {
        if (await this.commande([STK.GET_SYNC], 0, i === 0 ? 800 : 300)) {
          await pause(50);
          this.entree.vider();
          if (await this.commande([STK.GET_SYNC], 0, 300)) return true;
        }
      }
      return false;
    }
    adresse(octet) {
      const mot = octet >> 1; // le bootloader compte en mots de 2 octets
      return this.commande([STK.LOAD_ADDRESS, mot & 0xff, mot >> 8]);
    }
  }

  // ---------- Installation complète ----------
  // port : SerialPort fermé ; image : octets (lireHex) ; progression({ phase, fraction }) avec phase
  // 'connexion' | 'ecriture' | 'verification' | 'fin'. Renvoie { ok: true, bauds } ou { ok: false, message }.
  async function installerProgrammeCarte(port, image, options) {
    const o = options || {};
    const progression = o.progression || (() => {});
    const s = new Seance(port);
    try {
      progression({ phase: 'connexion', fraction: 0 });
      let bauds = null;
      for (const b of o.vitesses || VITESSES_BOOTLOADER) {
        await s.ouvrir(b);
        await s.redemarrer();
        if (await s.synchroniser()) {
          bauds = b;
          break;
        }
        await s.fermer();
        await pause(200);
      }
      if (!bauds) throw new ErreurTeleversement(MESSAGES.pasDeBootloader);

      // Signature du microcontrôleur : 1E 95 xx = ATmega328 / 328P (Uno, mCore).
      const signature = await s.commande([STK.READ_SIGN], 3);
      if (!signature || signature[0] !== 0x1e || signature[1] !== 0x95) throw new ErreurTeleversement(MESSAGES.mauvaisePuce);
      if (!(await s.commande([STK.ENTER_PROGMODE]))) throw new ErreurTeleversement(MESSAGES.pasDeBootloader);

      const pages = Math.ceil(image.length / TAILLE_PAGE);
      const page = (i) => {
        const p = new Uint8Array(TAILLE_PAGE).fill(0xff);
        p.set(image.subarray(i * TAILLE_PAGE, (i + 1) * TAILLE_PAGE));
        return p;
      };
      for (let i = 0; i < pages; i++) {
        const ok = (await s.adresse(i * TAILLE_PAGE)) && (await s.commande([STK.PROG_PAGE, 0, TAILLE_PAGE, 0x46, ...page(i)], 0, 1000));
        if (!ok) throw new ErreurTeleversement(MESSAGES.pasDeBootloader);
        progression({ phase: 'ecriture', fraction: (i + 1) / pages });
      }
      for (let i = 0; i < pages; i++) {
        const lu = (await s.adresse(i * TAILLE_PAGE)) && (await s.commande([STK.READ_PAGE, 0, TAILLE_PAGE, 0x46], TAILLE_PAGE, 1000));
        if (!lu) throw new ErreurTeleversement(MESSAGES.pasDeBootloader);
        const attendu = page(i);
        if (lu.some((b, k) => b !== attendu[k])) throw new ErreurTeleversement(MESSAGES.verificationRatee);
        progression({ phase: 'verification', fraction: (i + 1) / pages });
      }
      await s.commande([STK.LEAVE_PROGMODE]); // la carte démarre son nouveau programme
      progression({ phase: 'fin', fraction: 1 });
      return { ok: true, bauds };
    } catch (e) {
      return { ok: false, message: e instanceof ErreurTeleversement ? e.message : MESSAGES.pasDeBootloader };
    } finally {
      await s.fermer();
    }
  }

  A.televersement = { lireHex, installerProgrammeCarte, MESSAGES, STK };
})(this);

// ===== interface/carte.js =====
// Envoi du programme de l'élève dans la carte (mode « Dans la carte », écran A6 de la maquette).
// Arduino Uno, mBot (carte mCore) et micro:bit V2 : la carte a un programme de base (cartes/, « programme de la
// carte », installé une fois) qui reçoit le code octet de l'élève par le câble USB (Web Serial, Chrome et Edge) et
// le garde : il redémarre seul, même câble débranché. « Vider la carte » l'efface (fin de séance).
//
// Protocole v2 (une ligne par commande, une ligne de réponse) :
//   PING → PONG v2 <version> <carte> <octets gardés> <place>
//   PROG <n> → OK · H <hexadécimal> → OK (64 caractères au plus) · FIN → OK <n> · EFFACE → OK
//   erreurs : ERR CMD, ERR PIN, ERR TAILLE, ERR CRC, ERR FORMAT
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));

  // Fichier des programmes de carte (cartes/firmwares.js), chargé seulement quand il faut installer.
  const CHEMIN_FIRMWARES = 'cartes/firmwares.js';
  const ICI = global.document && global.document.currentScript ? global.document.currentScript.src : '';

  const DEMARRAGE_CARTE = 1800; // ms : la Uno et le mCore redémarrent quand on ouvre le port
  const TAILLE_LIGNE_HEX = 64;

  // ---------- Liaison série : une commande, une réponse ----------
  function creerLiaison(port) {
    const encodeur = new TextEncoder();
    let lecteur = null;
    let tampon = '';
    let attentes = [];
    let fermee = false;
    const l = {
      surEvenement: null, // « E <broche> <niveau> » (surveillance du mode direct)
      async ouvrir() {
        await port.open({ baudRate: 115200 });
        (async () => {
          const decodeur = new TextDecoder();
          lecteur = port.readable.getReader();
          try {
            for (;;) {
              const { value, done } = await lecteur.read();
              if (done) break;
              tampon += decodeur.decode(value, { stream: true });
              let i;
              while ((i = tampon.indexOf('\n')) >= 0) {
                // Sans les caractères invisibles : au redémarrage, la carte envoie quelques octets parasites.
                const ligne = tampon.slice(0, i).replace(/[^\x20-\x7e]/g, '').trim();
                tampon = tampon.slice(i + 1);
                if (!ligne) continue;
                if (/^E /.test(ligne)) {
                  if (l.surEvenement) l.surEvenement(ligne);
                  continue;
                }
                if (attentes.length) attentes.shift()(ligne);
              }
            }
          } catch {
            // port fermé ou câble débranché
          } finally {
            lecteur.releaseLock();
            fermee = true;
            for (const a of attentes) a(null);
            attentes = [];
          }
        })();
      },
      // Envoie une ligne et attend la réponse, ou null après « delai » ms.
      commande(texte, delai) {
        if (fermee) return Promise.resolve(null);
        return new Promise((resoudre) => {
          let fini = false;
          const minuteur = setTimeout(() => {
            fini = true;
            attentes = attentes.filter((a) => a !== recevoir);
            resoudre(null);
          }, delai || 1000);
          function recevoir(ligne) {
            if (fini) return;
            clearTimeout(minuteur);
            resoudre(ligne);
          }
          attentes.push(recevoir);
          const w = port.writable.getWriter();
          w.write(encodeur.encode(texte + '\n'))
            .catch(() => {})
            .finally(() => w.releaseLock());
        });
      },
      vider() {
        tampon = '';
      },
      async fermer() {
        try {
          if (lecteur) await lecteur.cancel();
        } catch {
          // déjà fermé
        }
        await pause(50);
        await port.close().catch(() => {});
      },
    };
    return l;
  }

  // ---------- Clé 2.4G du mBot (WebHID) ----------
  // La clé « 2.4G Wireless Serial » de Makeblock n'est pas un port série pour l'ordinateur : c'est un périphérique HID.
  // De l'autre côté, le module 2.4G du robot est branché sur la liaison série de la carte mCore : le protocole v2 passe
  // tel quel. Chaque rapport HID porte un morceau : 1 octet de longueur, puis les octets (comme mBlock).
  // À VÉRIFIER avec la vraie clé (recette du jalon 4).
  function portCle(appareil) {
    const taille = () => {
      for (const col of appareil.collections || []) {
        for (const r of col.outputReports || []) {
          const bits = (r.items || []).reduce((t, i) => t + (i.reportSize || 0) * (i.reportCount || 0), 0);
          if (bits) return { id: r.reportId || 0, octets: bits / 8 };
        }
      }
      return { id: 0, octets: 32 };
    };
    let surRapport = null;
    const port = {
      sansFil: true, // pas de redémarrage à l'ouverture, pas d'installation possible
      readable: null,
      writable: null,
      appareil,
      getInfo: () => ({ usbVendorId: appareil.vendorId, usbProductId: appareil.productId }),
      async open() {
        if (!appareil.opened) await appareil.open();
        let controleur = null;
        port.readable = new ReadableStream({
          start(c) {
            controleur = c;
          },
        });
        surRapport = (e) => {
          const n = Math.min(e.data.getUint8(0), e.data.byteLength - 1);
          if (n > 0 && controleur) controleur.enqueue(new Uint8Array(e.data.buffer, e.data.byteOffset + 1, n).slice());
        };
        appareil.addEventListener('inputreport', surRapport);
        const { id, octets } = taille();
        port.writable = new WritableStream({
          async write(morceau) {
            for (let i = 0; i < morceau.length; i += octets - 1) {
              const partie = morceau.slice(i, i + octets - 1);
              const rapport = new Uint8Array(octets);
              rapport[0] = partie.length;
              rapport.set(partie, 1);
              await appareil.sendReport(id, rapport);
            }
          },
        });
      },
      async close() {
        if (surRapport) appareil.removeEventListener('inputreport', surRapport);
        surRapport = null;
        await appareil.close().catch(() => {});
      },
      async setSignals() {},
    };
    return port;
  }

  // « PONG v2 0.2 uno 120 1012 » → { version, nom, octets, place }
  function lirePong(ligne) {
    const m = /PONG v2 (\S+) (\S+) (\d+) (\d+)/.exec(ligne || '');
    return m ? { version: m[1], nom: m[2], octets: Number(m[3]), place: Number(m[4]) } : null;
  }

  // Nom de la carte qui a répondu (« PONG … mcore … »), pour les messages.
  const NOMS_REPONSE = { uno: 'Arduino Uno', mcore: 'mBot (carte mCore)', 'microbit-v2': 'micro:bit V2', 'microbit-v1': 'micro:bit V1' };

  // ---------- Connexion à la carte (une seule pour toute la page) ----------
  //   etat.cle : 'sans-usb' | 'aucune' | 'choisir' | 'connexion' | 'a-installer' | 'installation' | 'connectee' |
  //              'envoi' | 'envoye' | 'vide' | 'occupee' | 'pas-a-jour' | 'mauvaise-carte' | 'erreur' | 'programme'
  function creerConnexion() {
    const serie = global.navigator && global.navigator.serial;
    const hid = global.navigator && global.navigator.hid;
    const ecouteurs = new Set();
    let port = null;
    let liaison = null;
    let occupe = false;
    const c = {
      etat: { cle: serie ? 'aucune' : 'sans-usb' },
      profil: A.profil ? A.profil('uno') : { id: 'uno', nom: 'Arduino Uno', reponse: 'uno', installation: 'serie', firmware: 'uno' },
      carte: null, // réponse au dernier PING
      cleDisponible: !!hid, // clé 2.4G du mBot (WebHID)
      parCle: () => !!(port && port.sansFil),
      ecouter(f) {
        ecouteurs.add(f);
        f(c.etat);
        return () => ecouteurs.delete(f);
      },
      // Carte de l'exercice ouvert : la connexion vérifiera que c'est bien elle.
      choisirProfil(profil) {
        const change = c.profil.id !== profil.id;
        c.profil = profil;
        if (change && ['connectee', 'envoye', 'vide', 'mauvaise-carte', 'pas-a-jour', 'a-installer'].includes(c.etat.cle)) verifier();
        else if (change) changer(c.etat.cle === 'sans-usb' ? c.etat : { cle: port ? c.etat.cle : 'aucune' });
      },
      // (installer, envoyer… sont définis plus bas)
      connecter: (...a) => connecter(...a),
      installer: (...a) => installer(...a),
      envoyer: (...a) => envoyer(...a),
      vider: (...a) => vider(...a),
      deconnecter: (...a) => deconnecter(...a),
      demarrerDirect: (...a) => demarrerDirect(...a),
      arreterDirect: (...a) => arreterDirect(...a),
      enDirect: () => !!enCours,
      reprendre: () => changer({ cle: c.carte ? 'connectee' : 'aucune', carte: c.carte }),
      signaler: (etat) => changer(etat),
    };

    function changer(etat) {
      c.etat = etat;
      for (const f of ecouteurs) f(etat);
    }

    function debranche() {
      arreterBoucle();
      liaison = null;
      port = null;
      c.carte = null;
      if (!occupe) changer({ cle: 'aucune', debranchee: true });
    }
    if (serie) serie.addEventListener('disconnect', (e) => port && e.target === port && debranche());
    if (hid) hid.addEventListener('disconnect', (e) => port && port.appareil === e.device && debranche());

    async function fermerLiaison() {
      if (liaison) await liaison.fermer();
      liaison = null;
    }

    // Une action à la fois (un clic de plus pendant un envoi ne fait rien).
    function action(f) {
      return async (...args) => {
        if (occupe) return null;
        occupe = true;
        try {
          return await f(...args);
        } catch (e) {
          changer({ cle: 'erreur', message: 'Erreur inattendue : ' + (e && e.message ? e.message : e) + '. Débranche et rebranche le câble USB, puis réessaie.' });
          return null;
        } finally {
          occupe = false;
        }
      };
    }

    // Choisir la carte : une carte déjà autorisée sur ce poste est reprise sans fenêtre.
    //   moyen : 'cable' (port série USB) ou 'cle' (clé 2.4G du mBot)
    async function choisirPort(nouvelle, moyen) {
      if (moyen === 'cle' || (!moyen && port && port.sansFil)) return choisirCle(nouvelle);
      if (port && port.sansFil) {
        await fermerLiaison();
        port = null;
      }
      if (port && !nouvelle) return true;
      if (!nouvelle) {
        const connus = await serie.getPorts().catch(() => []);
        if (connus.length === 1) {
          port = connus[0];
          return true;
        }
      }
      changer({ cle: 'choisir' });
      try {
        port = await serie.requestPort();
        return true;
      } catch {
        changer({ cle: 'aucune' }); // fenêtre fermée sans choisir
        return false;
      }
    }

    async function choisirCle(nouvelle) {
      if (port && port.sansFil && !nouvelle) return true;
      await fermerLiaison();
      port = null;
      if (!nouvelle) {
        const connues = await hid.getDevices().catch(() => []);
        if (connues.length === 1) {
          port = portCle(connues[0]);
          return true;
        }
      }
      changer({ cle: 'choisir', cle24: true });
      try {
        const [appareil] = await hid.requestDevice({ filters: [] });
        if (!appareil) throw new Error('aucune');
        port = portCle(appareil);
        return true;
      } catch {
        changer({ cle: 'aucune' });
        return false;
      }
    }

    // Ouvre le port si besoin et demande à la carte qui elle est.
    async function ouvrirEtDemander() {
      if (!liaison) {
        liaison = creerLiaison(port);
        try {
          await liaison.ouvrir();
        } catch {
          liaison = null;
          changer({ cle: 'occupee' });
          return null;
        }
        liaison.surEvenement = (ligne) => {
          if (enCours) enCours.direct.evenement(ligne);
        };
        if (c.profil.installation === 'serie' && !port.sansFil) await pause(DEMARRAGE_CARTE);
      }
      // Jusqu'à 3 essais : juste après l'ouverture, la réponse peut être brouillée.
      for (let essai = 0; essai < 3; essai++) {
        const r = await liaison.commande('PING', 900);
        const pong = lirePong(r);
        if (pong) return pong;
        await pause(250);
        liaison.vider();
      }
      return false;
    }

    // Décide de l'état d'après la réponse au PING.
    function constater(pong) {
      if (pong === null) return false; // déjà dit (carte occupée)
      c.carte = null;
      if (pong === false) {
        changer({ cle: 'a-installer', parCle: !!port.sansFil });
        return false;
      }
      const attendue = c.profil.reponse;
      const microbitAttendue = /^microbit/.test(attendue);
      const microbitBranchee = /^microbit/.test(pong.nom);
      if (pong.nom !== attendue && microbitAttendue !== microbitBranchee) {
        changer({ cle: 'mauvaise-carte', branchee: NOMS_REPONSE[pong.nom] || pong.nom });
        return false;
      }
      // Version attendue : celle de la carte (le mBot a la sienne, pour l'afficheur), sinon la version commune.
      if (pong.nom !== attendue || pong.version !== (c.profil.version || A.VERSION_FIRMWARE || pong.version)) {
        changer({ cle: 'pas-a-jour', branchee: NOMS_REPONSE[pong.nom] || pong.nom, version: pong.version, parCle: !!port.sansFil });
        return false;
      }
      c.carte = pong;
      return true;
    }

    async function verifierCarte() {
      changer({ cle: 'connexion' });
      const ok = constater(await ouvrirEtDemander());
      if (ok) changer({ cle: 'connectee', carte: c.carte, parCle: !!port.sansFil });
      return ok;
    }
    const verifier = action(verifierCarte);

    // moyen : 'cable', 'cle', ou rien (le même qu'avant)
    async function connecter(nouvelle, moyen) {
      if (!moyen && port && port.sansFil) moyen = 'cle';
      if (moyen === 'cle' ? !hid : !serie) return changer({ cle: 'sans-usb' });
      if (occupe) return null;
      arreterBoucle();
      if (nouvelle) await fermerLiaison();
      if (!(await choisirPort(nouvelle, moyen))) return null;
      return verifier();
    }

    // Programme de la carte (cartes/firmwares.js), chargé à la demande.
    function chargerFirmwares() {
      if (A.firmwares) return Promise.resolve(A.firmwares);
      return new Promise((resoudre) => {
        global.definirFirmwares = (f) => (A.firmwares = f);
        const s = global.document.createElement('script');
        s.src = ICI ? new URL(CHEMIN_FIRMWARES, ICI).href : CHEMIN_FIRMWARES;
        s.onload = () => resoudre(A.firmwares || null);
        s.onerror = () => resoudre(null);
        global.document.head.appendChild(s);
      });
    }

    const installer = action(async () => {
      const f = await chargerFirmwares();
      const hex = f && f[c.profil.firmware];
      if (!hex) return changer({ cle: 'erreur', message: A.televersement.MESSAGES.fichierAbime });
      if (c.profil.installation === 'fichier') {
        // micro:bit : le fichier se copie sur le lecteur MICROBIT (le navigateur ne peut pas l'y écrire lui-même).
        const lien = global.document.createElement('a');
        lien.href = URL.createObjectURL(new Blob([hex], { type: 'application/octet-stream' }));
        lien.download = `labo-blocs-${c.profil.id}-${(f.versions || {})[c.profil.firmware] || f.version}.hex`;
        global.document.body.appendChild(lien);
        lien.click();
        lien.remove();
        await fermerLiaison(); // la micro:bit redémarre après la copie : il faudra rouvrir le port
        return changer({ cle: 'a-installer', fichier: lien.download });
      }
      if (port && port.sansFil) return changer({ cle: 'a-installer', parCle: true, cableNecessaire: true });
      if (!port && !(await choisirPort(false))) return null;
      await fermerLiaison();
      changer({ cle: 'installation', fraction: 0 });
      const r = await A.televersement.installerProgrammeCarte(port, A.televersement.lireHex(hex), {
        progression({ phase, fraction }) {
          const f2 = phase === 'connexion' ? 0 : phase === 'ecriture' ? fraction * 0.7 : phase === 'verification' ? 0.7 + fraction * 0.3 : 1;
          changer({ cle: 'installation', fraction: f2 });
        },
      });
      if (!r.ok) return changer({ cle: /déjà utilisée/.test(r.message) ? 'occupee' : 'erreur', message: r.message });
      return verifierCarte();
    });

    const MESSAGES_ENVOI = {
      'ERR TAILLE': 'Le programme n’est pas arrivé en entier. Réessaie, sans débrancher le câble.',
      'ERR CRC': 'Le programme est arrivé abîmé. Réessaie, sans débrancher le câble.',
      'ERR FORMAT': 'La carte ne comprend pas ce programme : son programme de base n’est pas à jour. Installe-le à nouveau.',
    };

    // octets : code octet du programme de l'élève (compilé par le noyau).
    const envoyer = action(async (octets) => {
      await arreterBoucle(true);
      if (!(await verifierCarte())) return { ok: false };
      if (octets.length > c.carte.place) {
        changer({ cle: 'programme', message: `Ton programme est trop grand pour cette carte (${octets.length} octets pour ${c.carte.place} de place). Essaie de le raccourcir.` });
        return { ok: false };
      }
      changer({ cle: 'envoi', fraction: 0, parCle: !!port.sansFil });
      const hex = Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('').toUpperCase();
      let r = await liaison.commande('PROG ' + octets.length, 1500);
      const morceaux = Math.ceil(hex.length / TAILLE_LIGNE_HEX);
      for (let i = 0; r === 'OK' && i < morceaux; i++) {
        r = await liaison.commande('H ' + hex.slice(i * TAILLE_LIGNE_HEX, (i + 1) * TAILLE_LIGNE_HEX), 1500);
        changer({ cle: 'envoi', fraction: (i + 1) / (morceaux + 1), parCle: !!port.sansFil });
      }
      if (r === 'OK') r = await liaison.commande('FIN', 3000);
      if (!r || !/^OK/.test(r)) {
        const message = MESSAGES_ENVOI[r] || 'La carte ne répond plus. Débranche et rebranche le câble USB, puis réessaie.';
        changer({ cle: r === 'ERR FORMAT' ? 'pas-a-jour' : 'erreur', message });
        return { ok: false, message };
      }
      c.carte = Object.assign({}, c.carte, { octets: octets.length });
      changer({ cle: 'envoye', octets: octets.length, parCle: !!port.sansFil });
      return { ok: true };
    });

    const vider = action(async () => {
      await arreterBoucle(true);
      if (!(await verifierCarte())) return { ok: false };
      let r = await liaison.commande('EFFACE', 2000);
      if (r !== 'OK') r = await liaison.commande('EFFACE', 2000); // la 1re réponse peut être brouillée
      if (r !== 'OK') {
        changer({ cle: 'erreur', message: 'La carte n’a pas été vidée : elle ne répond plus. Débranche et rebranche le câble USB, puis réessaie.' });
        return { ok: false };
      }
      c.carte = Object.assign({}, c.carte, { octets: 0 });
      changer({ cle: 'vide', parCle: !!port.sansFil });
      return { ok: true };
    });

    // ---------- Mode « En direct » ----------
    // direct : objet de noyau/direct.js. Le programme avance au rythme de l'horloge ; ses ordres partent un par un
    // (chacun attend sa réponse) ; les capteurs sont relus quand rien d'autre n'attend ; un PING par seconde au moins
    // (sans message pendant 3 s, la carte éteint tout).
    let enCours = null;
    async function demarrerDirect(direct, options) {
      const o = options || {};
      if (enCours || occupe) return false;
      if (!c.carte || !liaison) {
        if (!(await verifierCarte())) return false;
      }
      const boucle = { direct, file: [], arret: false, sansReponse: 0, dernierEnvoi: 0, lecture: 0, surErreur: o.surErreur };
      enCours = boucle;
      changer({ cle: 'direct', carte: c.carte, parCle: !!port.sansFil });
      const envoyerLigne = async (ligne) => {
        const r = await liaison.commande(ligne, 700);
        boucle.dernierEnvoi = Date.now();
        if (r === null) boucle.sansReponse++;
        else boucle.sansReponse = 0;
        if (boucle.sansReponse >= 3 && !boucle.arret) {
          boucle.arret = true;
          enCours = null;
          changer({ cle: 'erreur', message: 'La carte ne répond plus : le mode direct s’est arrêté. Vérifie le câble (ou que le robot est allumé), puis reconnecte la carte.' });
          if (boucle.surErreur) boucle.surErreur();
        }
        return r;
      };
      for (const ligne of direct.depart) await envoyerLigne(ligne);
      const t0 = performance.now();
      boucle.t0 = t0;
      (async () => {
        while (!boucle.arret) {
          boucle.file.push(...direct.avancer(performance.now() - t0));
          if (boucle.file.length) {
            await envoyerLigne(boucle.file.shift());
            continue;
          }
          if (direct.lectures.length) {
            const l = direct.lectures[boucle.lecture++ % direct.lectures.length];
            direct.lire(l, await envoyerLigne(l.ligne));
          } else if (Date.now() - boucle.dernierEnvoi > 800) await envoyerLigne('PING');
          await pause(direct.lectures.length ? 15 : 20);
        }
      })();
      return true;
    }
    // Arrête la boucle ; avecFin : la carte éteint tout (W, OFF).
    async function arreterBoucle(avecFin) {
      const b = enCours;
      if (!b) return;
      b.arret = true;
      enCours = null;
      if (avecFin && liaison) {
        await pause(30);
        for (const ligne of b.direct.fin) await liaison.commande(ligne, 700);
      }
    }
    async function arreterDirect() {
      if (!enCours) return;
      await arreterBoucle(true);
      if (c.carte) changer({ cle: 'connectee', carte: c.carte, parCle: !!(port && port.sansFil) });
    }

    const deconnecter = action(async () => {
      await arreterBoucle(true);
      await fermerLiaison();
      c.carte = null;
      changer({ cle: 'aucune', deconnectee: true });
    });

    return c;
  }

  let connexion = null;
  A.connexionCarte = () => connexion || (connexion = creerConnexion());

  // ---------- Panneau « Dans la carte » (A6) ----------

  // Textes des états : titre, statut (avec pictogramme : jamais la couleur seule), message, ton.
  // seulementVider : fenêtre « Vider la carte » (fin de séance), sans programme à envoyer.
  // options : { seulementVider, pourDirect, cleDisponible }
  function decrire(e, profil, options) {
    const o = typeof options === 'object' && options ? options : { seulementVider: !!options };
    const seulementVider = !!o.seulementVider;
    const avecCle = profil.id === 'mbot' && !!o.cleDisponible;
    const nom = profil.nom + (e.parCle ? ' (clé 2.4G)' : '');
    const microbit = profil.installation === 'fichier';
    switch (e.cle) {
      case 'sans-usb':
        return { ton: 'blocage', titre: 'Accès USB impossible', statut: 'Navigateur sans accès USB', message: 'Ce navigateur ne peut pas envoyer de programme dans la carte. Ouvre Labo Blocs dans Chrome ou Edge.' };
      case 'aucune':
        return {
          ton: 'neutre',
          titre: e.debranchee ? 'Carte débranchée' : 'Aucune carte connectée',
          statut: 'En attente de la carte',
          message: avecCle
            ? `${e.debranchee ? 'La carte a été débranchée. ' : ''}Branche le robot avec le câble USB, ou branche la clé 2.4G et allume le robot, puis clique sur le bouton qui correspond.`
            : `${e.debranchee ? 'Le câble a été débranché. ' : ''}Branche la carte (${nom}) avec le câble USB, puis clique sur « Connecter la carte ».`,
          boutons: [{ cle: 'connecter', texte: avecCle ? 'Connecter par le câble' : 'Connecter la carte', principal: true }].concat(
            avecCle ? [{ cle: 'connecter-cle', texte: 'Connecter par la clé 2.4G' }] : [],
          ),
        };
      case 'choisir':
        if (e.cle24) return { ton: 'neutre', titre: 'Choisir la clé 2.4G', statut: 'Une fenêtre est ouverte', message: 'Choisis la ligne de la clé 2.4G (souvent « Makeblock » ou « HID »), puis clique sur « Connexion ». Si tu ne vois rien, demande au professeur.' };
        return { ton: 'neutre', titre: 'Choisir la carte', statut: 'Une fenêtre est ouverte', message: 'Choisis la ligne qui parle de ta carte, puis clique sur « Connexion ». Si tu ne vois rien, demande au professeur.' };
      case 'connexion':
        return { ton: 'neutre', titre: 'Connexion…', statut: 'La carte démarre', message: e.parCle ? 'Garde le robot allumé, près de l’ordinateur.' : 'Ne débranche pas le câble.' };
      case 'a-installer':
        if (microbit) {
          return {
            ton: 'neutre',
            titre: 'Installer le programme de la carte',
            statut: 'Étape faite une seule fois',
            message: e.fichier
              ? `Le fichier « ${e.fichier} » est dans tes téléchargements. Glisse-le sur le lecteur MICROBIT : la lumière de la carte clignote pendant la copie. Quand elle s’arrête, clique sur « Connecter la carte ».`
              : 'La micro:bit n’a pas encore le programme de base de Labo Blocs. Clique sur « Enregistrer le fichier », puis glisse-le sur le lecteur MICROBIT (une seule fois).',
            boutons: [
              { cle: 'installer', texte: 'Enregistrer le fichier', principal: !e.fichier },
              { cle: 'reconnecter', texte: 'Connecter la carte', principal: !!e.fichier },
            ],
          };
        }
        if (e.parCle) {
          return {
            ton: 'neutre',
            titre: 'Installer le programme de la carte',
            statut: 'Avec le câble USB, une seule fois',
            message: 'Le robot répond mal par la clé 2.4G : il n’a sans doute pas encore le programme de base de Labo Blocs. Il s’installe avec le câble USB (une seule fois) : branche le câble, puis clique sur « Connecter par le câble ». Ensuite, la clé 2.4G marchera.',
            boutons: [{ cle: 'connecter-cable', texte: 'Connecter par le câble', principal: true }],
          };
        }
        return {
          ton: 'neutre',
          titre: 'Installer le programme de la carte',
          statut: 'Étape faite une seule fois',
          message: 'La carte n’a pas encore le programme de base de Labo Blocs (ou elle a servi avec mBlock ou l’IDE Arduino). Installe-le : c’est fait une fois pour toutes.',
          boutons: [{ cle: 'installer', texte: 'Installer le programme de la carte', principal: true }],
        };
      case 'installation':
        return { ton: 'neutre', titre: 'Installer le programme de la carte', statut: 'Étape faite une seule fois', message: 'La carte reçoit son programme de base. Ne débranche pas le câble.', progression: e.fraction, libelle: 'Installation' };
      case 'direct':
        return {
          ton: 'reussi',
          titre: 'En direct',
          statut: `${nom} · le programme tourne`,
          message: e.parCle
            ? 'Garde la clé branchée et le robot allumé, près de l’ordinateur : ton programme tourne dans l’ordinateur et s’arrête si tu fermes l’onglet.'
            : 'Garde le câble branché : ton programme tourne dans l’ordinateur et s’arrête si tu fermes l’onglet.',
          boutons: [{ cle: 'arreter-direct', texte: 'Arrêter', principal: true }],
        };
      case 'connectee':
        if (o.pourDirect) {
          return {
            ton: 'reussi',
            titre: 'Carte connectée',
            statut: `${nom} · prête`,
            message: 'Clique sur « Lancer » : ton programme tourne dans l’ordinateur et la carte obéit tout de suite. Le câble (ou la clé) doit rester branché.',
            boutons: [{ cle: 'deconnecter', texte: 'Déconnecter' }],
          };
        }
        if (seulementVider) {
          return {
            ton: 'reussi',
            titre: 'Carte connectée',
            statut: `${nom} · prête`,
            message: 'Clique sur « Vider la carte » : son programme sera effacé et elle ne commandera plus rien.',
            boutons: [
              { cle: 'vider', texte: 'Vider la carte', principal: true },
              { cle: 'deconnecter', texte: 'Déconnecter' },
            ],
          };
        }
        return {
          ton: 'reussi',
          titre: 'Carte connectée',
          statut: `${nom} · prête`,
          message: `La carte répond. Tu peux lui envoyer ton programme.${e.carte && e.carte.octets ? ' Elle garde déjà un programme : il sera remplacé.' : ''}`,
          boutons: [
            { cle: 'envoyer', texte: 'Envoyer mon programme', principal: true },
            { cle: 'vider', texte: 'Vider la carte' },
            { cle: 'deconnecter', texte: 'Déconnecter' },
          ],
        };
      case 'envoi':
        return { ton: 'neutre', titre: 'Envoi en cours', statut: 'Programme en route', message: e.parCle ? 'Garde le robot allumé, près de l’ordinateur, jusqu’à la fin.' : 'Ne débranche pas le câble avant la fin.', progression: e.fraction, libelle: 'Envoi' };
      case 'envoye':
        return {
          ton: 'reussi',
          titre: 'Programme envoyé',
          statut: 'Dans la carte',
          message: e.parCle
            ? 'Le programme est dans le robot : il le garde, même éteint puis rallumé.'
            : 'Le programme est dans la carte. Tu peux débrancher le câble : la carte le garde et redémarre avec lui.',
          boutons: [
            { cle: 'terminer', texte: 'Terminé', principal: true },
            { cle: 'vider', texte: 'Vider la carte' },
          ],
        };
      case 'vide':
        return {
          ton: 'reussi',
          titre: 'Carte vidée',
          statut: 'Plus aucun programme',
          message: 'Le programme est effacé : la carte ne commande plus rien. Vérifie que le robot (ou la maquette) est bien arrêté avant de ranger.',
          boutons: [{ cle: 'terminer', texte: 'Terminé', principal: true }],
        };
      case 'occupee':
        return {
          ton: 'blocage',
          titre: 'Carte déjà utilisée',
          statut: 'Connexion impossible',
          message: 'La carte est déjà utilisée par un autre programme (IDE Arduino, mBlock, autre onglet…). Ferme-le, puis réessaie.',
          boutons: [{ cle: 'reconnecter', texte: 'Réessayer', principal: true }],
        };
      case 'pas-a-jour':
        if (e.parCle) {
          return {
            ton: 'blocage',
            titre: 'Carte pas à jour',
            statut: 'Mauvais programme de base',
            message: 'Le programme de base du robot n’est pas à jour. Il s’installe avec le câble USB : branche le câble, puis clique sur « Connecter par le câble » ; si ça recommence, demande au professeur.',
            boutons: [{ cle: 'connecter-cable', texte: 'Connecter par le câble', principal: true }],
          };
        }
        return {
          ton: 'blocage',
          titre: 'Carte pas à jour',
          statut: 'Mauvais programme de base',
          message: microbit
            ? 'La micro:bit a un ancien programme de base. Clique sur « Enregistrer le fichier », puis glisse-le sur le lecteur MICROBIT ; si ça recommence, demande au professeur.'
            : 'La carte a sans doute servi à un autre projet. Clique sur « Installer le programme de la carte » ; si ça recommence, demande au professeur.',
          boutons: [{ cle: 'installer', texte: microbit ? 'Enregistrer le fichier' : 'Installer le programme de la carte', principal: true }],
        };
      case 'mauvaise-carte':
        return {
          ton: 'blocage',
          titre: 'Ce n’est pas la bonne carte',
          statut: `Carte branchée : ${e.branchee}`,
          message: `Cet exercice se fait avec : ${nom}. Branche la bonne carte, puis clique sur « Réessayer ».`,
          boutons: [{ cle: 'changer', texte: 'Réessayer', principal: true }],
        };
      case 'programme':
        return { ton: 'ecart', titre: 'Programme à revoir', statut: 'Pas envoyé', message: e.message, boutons: [{ cle: 'terminer', texte: 'Retour' }] };
      default:
        return {
          ton: 'blocage',
          titre: 'La carte ne répond pas',
          statut: 'Connexion perdue',
          message: e.message || 'Débranche et rebranche le câble USB, puis clique sur « Réessayer ».',
          boutons: [{ cle: 'reconnecter', texte: 'Réessayer', principal: true }],
        };
    }
  }

  const ICONES_TON = { reussi: 'coche', blocage: 'alerte', ecart: 'alerte', neutre: 'info' };

  // racine : élément qui reçoit le panneau. options : { programme() → { octets, erreurs }, surEnvoi(r), surVidage(r) }
  function creerPanneauCarte(racine, options) {
    const o = options || {};
    const connexion = A.connexionCarte();
    function dessiner(e) {
      const pourDirect = typeof o.pourDirect === 'function' ? o.pourDirect() : !!o.pourDirect;
      const d = decrire(e, connexion.profil, { seulementVider: !!o.seulementVider, pourDirect, cleDisponible: connexion.cleDisponible });
      const icone = A.icone ? A.icone(ICONES_TON[d.ton] || 'info', { epaisseur: 2.6 }) : '';
      let h = `<div class="pc-tete"><span class="pc-carte" aria-hidden="true">${dessinUsb()}</span><div class="pc-titres"><strong class="pc-titre">${echapper(d.titre)}</strong>`;
      h += `<span class="pc-statut">${icone}<span>${echapper(d.statut)}</span></span></div></div>`;
      if (d.progression !== undefined) {
        const p = Math.round((d.progression || 0) * 100);
        h += `<div class="pc-barre" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="${d.libelle} : ${p} %"><div style="width:${p}%"></div></div>`;
        h += `<div class="pc-avance">${d.libelle} : ${p} %</div>`;
      }
      h += `<p class="pc-message">${echapper(d.message)}</p>`;
      if (d.boutons && d.boutons.length) {
        h += '<div class="pc-actions">' + d.boutons.map((b) => `<button type="button" class="${b.principal ? 'btn-principal' : 'btn-secondaire'}" data-action="${b.cle}">${echapper(b.texte)}</button>`).join('') + '</div>';
      }
      racine.className = `panneau-carte pc-${d.ton}`;
      racine.dataset.etat = e.cle;
      racine.innerHTML = h;
    }
    const arreter = connexion.ecouter(dessiner);
    racine.addEventListener('click', async (evt) => {
      const b = evt.target.closest('button[data-action]');
      if (!b) return;
      switch (b.dataset.action) {
        case 'connecter':
          return connexion.connecter(false, 'cable');
        case 'connecter-cable':
          return connexion.connecter(true, 'cable');
        case 'connecter-cle':
          return connexion.connecter(false, 'cle');
        case 'arreter-direct':
          return o.surArretDirect ? o.surArretDirect() : connexion.arreterDirect();
        case 'reconnecter':
          return connexion.connecter(false);
        case 'changer':
          return connexion.connecter(true);
        case 'installer':
          return connexion.installer();
        case 'deconnecter':
          return connexion.deconnecter();
        case 'terminer':
          return connexion.reprendre();
        case 'envoyer': {
          const p = o.programme ? o.programme() : null;
          if (!p || (p.erreurs && p.erreurs.length)) {
            return connexion.signaler({ cle: 'programme', message: 'Ton programme a un bloc incomplet ou inconnu : complète-le, puis réessaie.' });
          }
          if (p.clavier) {
            return connexion.signaler({ cle: 'programme', message: 'Ton programme utilise le clavier de l’ordinateur : une fois dans la carte, il ne le verrait pas. Essaie-le en mode « En direct ».' });
          }
          const r = await connexion.envoyer(p.octets);
          if (r && o.surEnvoi) o.surEnvoi(Object.assign({ octets: p.octets.length }, r));
          return r;
        }
        case 'vider': {
          const r = await connexion.vider();
          if (r && o.surVidage) o.surVidage(r);
          return r;
        }
        default:
          return null;
      }
    });
    return { choisirProfil: (p) => connexion.choisirProfil(p), arreter, connexion, redessiner: () => dessiner(connexion.etat) };
  }

  function dessinUsb() {
    return (
      '<svg width="46" height="34" viewBox="0 0 46 34"><rect x="2" y="4" width="34" height="26" rx="5" fill="#3F4E66"/>' +
      '<rect x="36" y="12" width="8" height="10" rx="2" fill="#A9B6CC"/><circle cx="12" cy="14" r="3" fill="#F5C45E"/><circle cx="22" cy="14" r="3" fill="#55B0F0"/></svg>'
    );
  }

  // Fenêtre autonome (ex. « Vider la carte » en fin de séance, depuis une page du projet).
  //   options : { carte ('uno' | 'mbot' | 'microbit'), titre, intro, seulementVider, programme(), surEnvoi(r), surVidage(r) }
  function ouvrirDialogueCarte(options) {
    const o = options || {};
    const d = global.document.createElement('dialog');
    d.className = 'dialogue-carte-hote';
    d.setAttribute('aria-label', o.titre || 'Carte');
    d.style.cssText = 'border:none;border-radius:16px;padding:0;width:min(34rem, calc(100% - 2rem));background:transparent';
    d.innerHTML =
      '<div class="labo-blocs"><div class="dialogue-carte">' +
      `<div class="dialogue-entete"><strong>${echapper(o.titre || 'Carte')}</strong><button type="button" class="btn-fermer-carte" aria-label="Fermer">×</button></div>` +
      (o.intro ? `<p class="dc-intro">${echapper(o.intro)}</p>` : '') +
      '<div class="panneau-carte" aria-live="polite"></div></div></div>';
    global.document.body.append(d);
    const panneau = creerPanneauCarte(d.querySelector('.panneau-carte'), o);
    panneau.choisirProfil(A.profil ? A.profil(o.carte || 'uno') : connexion.profil);
    if (['envoye', 'vide', 'programme'].includes(panneau.connexion.etat.cle)) panneau.connexion.reprendre();
    d.querySelector('.btn-fermer-carte').addEventListener('click', () => d.close());
    d.addEventListener('close', () => {
      panneau.arreter();
      d.remove();
    });
    d.showModal();
    return d;
  }

  Object.assign(A, { creerPanneauCarte, ouvrirDialogueCarte, lirePong, decrireEtatCarte: decrire });
})(this);

// ===== interface/fichiers.js =====
// Fichier de l'équipe : choix du dossier, ouverture, enregistrement, copie de secours (repris de l'atelier).
// Chrome (et Edge) : on choisit le dossier de l'équipe une fois, puis le fichier s'y réécrit tout seul.
// Firefox : pas d'accès aux dossiers ; « Enregistrer » télécharge le fichier, à ranger ensuite.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  // Clés propres au projet (un projet = son dossier, son fichier mémorisé, sa copie de secours).
  const cle = () => 'labo-blocs-' + ((A.projet && A.projet.id) || 'projet');
  const CLE_SECOURS = () => cle() + '-secours';

  const accesDossiers = typeof global.showDirectoryPicker === 'function';
  const accesFichiers = typeof global.showOpenFilePicker === 'function' && typeof global.showSaveFilePicker === 'function';
  const TYPES = [{ description: 'Sauvegarde de l’équipe', accept: { 'application/json': ['.json'] } }];

  const nomFichier = (donnees) => A.nomEquipe(donnees.equipe.eleves) + '.json';
  const texte = (donnees) => JSON.stringify(donnees, null, 1);

  // Droit d'écrire dans le fichier. demander = false : on regarde seulement, sans afficher la fenêtre
  // « Autoriser ce site à modifier … ? » (elle n'est montrée qu'au premier vrai travail de l'équipe).
  async function autorise(handle, demander) {
    const options = { mode: 'readwrite' };
    if ((await handle.queryPermission(options)) === 'granted') return true;
    if (demander === false) return false;
    return (await handle.requestPermission(options)) === 'granted';
  }

  async function lireHandle(handle) {
    return A.lireSauvegarde(await (await handle.getFile()).text());
  }

  // ---------- Choix du dossier de l'équipe (nouvelle équipe) ----------

  // Renvoie { dossier, nom } ou null si l'élève a fermé la fenêtre.
  async function choisirDossier() {
    try {
      const dossier = await global.showDirectoryPicker({ id: cle(), mode: 'readwrite' });
      return { dossier, nom: dossier.name };
    } catch (e) {
      if (e && e.name === 'AbortError') return null;
      throw e;
    }
  }

  // Le dossier choisi est-il le dossier du projet (ex. « DISTRIBUTEUR DE CEREALES », celui qui contient les dossiers des
  // équipes), celui de l'équipe, ou un autre ? parent : nom attendu du dossier du projet ({classe} déjà remplacé).
  function analyserDossier(nomDossier, equipe, parent) {
    const s = A.simplifierNom(nomDossier);
    const projet = parent !== undefined ? parent : A.projet && A.projet.cheminSauvegarde ? A.projet.cheminSauvegarde[A.projet.cheminSauvegarde.length - 2] : '';
    if (projet && s === A.simplifierNom(projet)) return 'parent';
    if (s === A.simplifierNom(equipe)) return 'equipe';
    return 'autre';
  }

  async function creerSousDossier(dossier, nom) {
    return dossier.getDirectoryHandle(nom, { create: true });
  }

  // Une sauvegarde existe-t-elle déjà dans ce dossier ? On regarde tous les fichiers .json, pour ne pas
  // créer un deuxième fichier si l'équipe a écrit son prénom autrement (« Lea » au lieu de « Léa »).
  // Renvoie d'abord le fichier au nom de l'équipe, sinon la première sauvegarde valide, sinon un .json
  // invalide qui porte le nom de l'équipe (à ne pas écraser), sinon null.
  async function sauvegardeExistante(dossier, nom) {
    const cible = A.simplifierNom(nom.replace(/\.json$/i, ''));
    let premiere = null;
    let homonymeInvalide = null;
    try {
      for await (const entree of dossier.values()) {
        if (entree.kind !== 'file' || !/\.json$/i.test(entree.name)) continue;
        let lecture;
        try {
          lecture = await lireHandle(entree);
        } catch {
          continue;
        }
        const memeNom = A.simplifierNom(entree.name.replace(/\.json$/i, '')) === cible;
        if (lecture.ok && memeNom) return { handle: entree, lecture };
        if (lecture.ok && !premiere) premiere = { handle: entree, lecture };
        if (!lecture.ok && memeNom) homonymeInvalide = { handle: entree, lecture };
      }
    } catch {
      return null;
    }
    return premiere || homonymeInvalide;
  }

  async function fichierDansDossier(dossier, nom) {
    return dossier.getFileHandle(nom, { create: true });
  }

  // ---------- Ouvrir une sauvegarde ----------

  // Renvoie { lecture, handle } (handle nul sur Firefox) ou null si annulé.
  async function ouvrir() {
    if (accesFichiers) {
      let handle;
      try {
        [handle] = await global.showOpenFilePicker({ id: cle(), types: TYPES, multiple: false });
      } catch (e) {
        if (e && e.name === 'AbortError') return null;
        throw e;
      }
      const lecture = await lireHandle(handle);
      return { lecture, handle };
    }
    // Repli : sélecteur de fichier classique.
    return new Promise((resoudre) => {
      const entree = document.createElement('input');
      entree.type = 'file';
      entree.accept = '.json,application/json';
      entree.addEventListener('change', async () => {
        const f = entree.files && entree.files[0];
        if (!f) return resoudre(null);
        resoudre({ lecture: A.lireSauvegarde(await f.text()), handle: null });
      });
      entree.addEventListener('cancel', () => resoudre(null));
      entree.click();
    });
  }

  // ---------- Enregistrer ----------

  // Écrit dans le fichier connu si possible. Renvoie { ok, handle, telecharge }.
  async function enregistrer(donnees, handle, options) {
    const o = options || {};
    if (handle) {
      if (!(await autorise(handle, !o.silencieux))) {
        if (o.silencieux) return { ok: false, handle, permission: true };
        throw new Error('permission');
      }
      const flux = await handle.createWritable();
      await flux.write(texte(donnees));
      await flux.close();
      return { ok: true, handle };
    }
    if (o.silencieux) return { ok: false, handle: null };
    if (accesFichiers) {
      let nouveau;
      try {
        nouveau = await global.showSaveFilePicker({ id: cle(), suggestedName: nomFichier(donnees), types: TYPES });
      } catch (e) {
        if (e && e.name === 'AbortError') return { ok: false, handle: null };
        throw e;
      }
      return enregistrer(donnees, nouveau);
    }
    // Firefox : téléchargement classique.
    const url = URL.createObjectURL(new Blob([texte(donnees)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nomFichier(donnees);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return { ok: true, handle: null, telecharge: true };
  }

  // ---------- Fichier de l'équipe mémorisé entre deux ouvertures de la page (IndexedDB) ----------

  function base() {
    return new Promise((resoudre, rejeter) => {
      const r = indexedDB.open(cle(), 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fichiers');
      r.onsuccess = () => resoudre(r.result);
      r.onerror = () => rejeter(r.error);
    });
  }
  async function memoriserHandle(handle) {
    try {
      const db = await base();
      await new Promise((ok, ko) => {
        const t = db.transaction('fichiers', 'readwrite');
        if (handle) t.objectStore('fichiers').put(handle, 'equipe');
        else t.objectStore('fichiers').delete('equipe');
        t.oncomplete = ok;
        t.onerror = () => ko(t.error);
      });
    } catch {
      /* stockage indisponible : on redemandera le fichier */
    }
  }
  async function handleMemorise() {
    try {
      const db = await base();
      return await new Promise((ok) => {
        const r = db.transaction('fichiers').objectStore('fichiers').get('equipe');
        r.onsuccess = () => ok(r.result || null);
        r.onerror = () => ok(null);
      });
    } catch {
      return null;
    }
  }

  // ---------- Copie de secours dans le navigateur ----------

  function sauverSecours(donnees) {
    try {
      localStorage.setItem(CLE_SECOURS(), JSON.stringify(donnees));
    } catch {
      /* navigation privée ou stockage plein */
    }
  }
  function lireSecours() {
    try {
      const t = localStorage.getItem(CLE_SECOURS());
      if (!t) return null;
      const r = A.lireSauvegarde(t);
      return r.ok ? r.donnees : null;
    } catch {
      return null;
    }
  }
  function effacerSecours() {
    try {
      localStorage.removeItem(CLE_SECOURS());
    } catch {
      /* rien */
    }
  }

  A.fichiers = {
    accesDossiers,
    accesFichiers,
    nomFichier,
    choisirDossier,
    analyserDossier,
    creerSousDossier,
    sauvegardeExistante,
    fichierDansDossier,
    ouvrir,
    enregistrer,
    autorise,
    memoriserHandle,
    handleMemorise,
    sauverSecours,
    lireSecours,
    effacerSecours,
  };
})(this);

// ===== interface/session.js =====
// Session de l'équipe : un seul fichier (Prénom_Prénom.json) pour le carnet de projet et les exercices.
// Copie de secours dans le navigateur à chaque modification ; fichier de l'équipe réécrit tout seul
// (Chrome, Edge) ou par le bouton « Enregistrer » (Firefox : téléchargement).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  // options : { donnees, handle, lecture (mode enseignant : rien n'est enregistré) }
  function creerSession(options) {
    const s = {
      donnees: options.donnees,
      handle: options.handle || null,
      lecture: !!options.lecture,
      nonEnregistre: false,
      dernierEnregistrement: null,
      attenteAutorisation: false,
    };
    const avantEcriture = []; // ex. l'écran d'exercice range le programme affiché dans les données
    let minuteurFichier = null;
    let enCours = null;

    const preparer = () => avantEcriture.forEach((f) => f());

    // Une modification a eu lieu. Avec le fichier de l'équipe, il est réécrit tout seul
    // (tout de suite, ou après 10 s). geste : l'élève vient de cliquer (vérifier, indice…) ; si le
    // navigateur n'a pas encore donné le droit d'écrire dans le fichier, c'est le moment de le demander.
    function aEnregistrer(maintenant, geste) {
      if (s.lecture) return;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      s.nonEnregistre = true;
      majEtat();
      if (!s.handle) return;
      clearTimeout(minuteurFichier);
      if (geste) enregistrer('geste');
      else minuteurFichier = setTimeout(() => enregistrer('auto'), maintenant ? 0 : 10000);
    }

    // mode : 'auto' (minuteur : jamais de fenêtre), 'geste' (après un clic, sans message),
    // ou autre (bouton « Enregistrer » : message de confirmation).
    async function enregistrer(mode) {
      const automatique = mode === 'auto';
      const discret = automatique || mode === 'geste';
      if (s.lecture) return null;
      if (enCours) return enCours;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      majEtat('…');
      enCours = (async () => {
        try {
          const r = await A.fichiers.enregistrer(s.donnees, s.handle, { silencieux: automatique });
          if (r.ok) {
            if (r.handle && r.handle !== s.handle) {
              s.handle = r.handle;
              A.fichiers.memoriserHandle(r.handle);
            }
            s.nonEnregistre = false;
            s.dernierEnregistrement = new Date();
            s.attenteAutorisation = false;
            if (r.telecharge) message(`Le fichier « ${A.fichiers.nomFichier(s.donnees)} » est dans Téléchargements : range-le dans le dossier de ton équipe.`, 6000);
            else if (!discret) message('C’est enregistré dans le dossier de ton équipe.');
          } else if (r.permission) s.attenteAutorisation = true; // on attendra un clic de l'élève
        } catch {
          if (!automatique) message('L’enregistrement n’a pas marché. Clique encore sur « Enregistrer » et choisis le dossier de ton équipe.', 6000);
        } finally {
          enCours = null;
          majEtat();
        }
      })();
      return enCours;
    }

    // « Enregistré à 10:42 » à côté de chaque bouton Enregistrer (carnet et exercice).
    function majEtat(texte) {
      for (const el of document.querySelectorAll('.etat-enregistrement')) {
        if (texte) el.textContent = 'Enregistrement' + texte;
        else if (!s.nonEnregistre && s.dernierEnregistrement)
          el.textContent = 'Enregistré à ' + s.dernierEnregistrement.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        else el.textContent = s.nonEnregistre ? 'Pas encore enregistré' : '';
        el.classList.toggle('a-faire', !texte && s.nonEnregistre && (!s.handle || s.attenteAutorisation));
      }
    }

    let minuteurMessage = null;
    function message(texte, duree) {
      const t = document.querySelector('.message-bref');
      t.textContent = texte;
      t.hidden = false;
      clearTimeout(minuteurMessage);
      minuteurMessage = setTimeout(() => (t.hidden = true), duree || 2600);
    }

    for (const b of document.querySelectorAll('.btn-enregistrer')) {
      if (s.lecture) b.hidden = true;
      else b.addEventListener('click', () => enregistrer('bouton'));
    }
    if (s.lecture) for (const el of document.querySelectorAll('.etat-enregistrement')) el.hidden = true;

    // Rappel à la fermeture de l'onglet si le fichier n'est pas à jour.
    addEventListener('beforeunload', (e) => {
      if (s.lecture) return;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      if (s.nonEnregistre) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    Object.assign(s, { aEnregistrer, enregistrer, majEtat, message, surAvantEcriture: (f) => avantEcriture.push(f) });
    majEtat();
    return s;
  }

  A.creerSession = creerSession;
})(this);

// ===== interface/accueil.js =====
// Accueil (A1, A2 ; repris de l'atelier) : « Nouvelle équipe » (prénoms, classe, dossier de l'équipe),
// « Ouvrir notre sauvegarde », ou « Reprendre le travail de … ».
// Pas de compte : l'équipe tape ses prénoms. Le fichier est la seule référence ; la copie du
// navigateur sert seulement à reprendre après une fermeture d'onglet.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const F = A.fichiers;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function dateFr(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // paquet : parcours préparé (pour l'avancement d'une sauvegarde trouvée dans le dossier).
  function demarrer(commencer, paquet) {
    const racine = $('.ecran-accueil');
    const nouvelleSauvegarde = () => A.creerSauvegarde(equipe, { parcours: paquet, projet: A.projet.id, application: A.projet.application });
    function avancementTexte(d) {
      const copie = JSON.parse(JSON.stringify(d));
      A.relierParcours(copie, paquet);
      const a = A.avancement(copie, paquet);
      return `${a.reussis}/${a.total} exercices réussis`;
    }
    racine.hidden = false;
    let equipe = null; // { eleves, classe, nom }

    for (const el of racine.querySelectorAll('[data-icone]')) el.outerHTML = A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });

    const panneaux = [...racine.querySelectorAll('.accueil-panneau')];
    function montrer(nom) {
      for (const p of panneaux) p.hidden = p.dataset.panneau !== nom;
      const champ = racine.querySelector(`[data-panneau="${nom}"] input, [data-panneau="${nom}"] button.btn-principal`);
      if (champ) champ.focus();
    }
    function erreur(nomPanneau, message) {
      const zone = $('.erreur-' + nomPanneau, racine);
      zone.textContent = message || '';
      zone.hidden = !message;
    }

    // ----- Choix -----

    const secours = F.lireSecours();
    const carte = $('.accueil-reprendre', racine);
    if (secours) {
      carte.hidden = false;
      $('.reprendre-equipe', carte).textContent = secours.equipe.eleves.join(', ') + (secours.equipe.classe ? ' · ' + secours.equipe.classe : '');
      $('.reprendre-date', carte).textContent = 'Dernière modification le ' + dateFr(secours.modifieLe);
    }
    $('.btn-reprendre', racine).addEventListener('click', async () => {
      // Le fichier mémorisé est réutilisé s'il est bien celui de cette équipe ; on prend la version la plus récente.
      let handle = await F.handleMemorise();
      let donnees = secours;
      if (handle) {
        try {
          // Pas de fenêtre d'autorisation ici : on lit le fichier seulement si c'est déjà permis.
          // L'autorisation d'écrire sera demandée au premier vrai travail (vérification, indice, Enregistrer).
          if ((await handle.queryPermission({ mode: 'read' })) === 'granted') {
            const lecture = A.lireSauvegarde(await (await handle.getFile()).text());
            const meme = lecture.ok && A.nomEquipe(lecture.donnees.equipe.eleves) === A.nomEquipe(secours.equipe.eleves);
            if (!meme) handle = null;
            else if (lecture.donnees.modifieLe > secours.modifieLe) donnees = lecture.donnees;
          }
        } catch {
          handle = null;
        }
      }
      fin(donnees, handle);
    });
    $('.btn-pas-nous', racine).addEventListener('click', () => (carte.hidden = true));

    $('.btn-ouvrir', racine).addEventListener('click', async () => {
      erreur('choix', '');
      let r;
      try {
        r = await F.ouvrir();
      } catch {
        return erreur('choix', 'Le fichier n’a pas pu être ouvert. Réessaie.');
      }
      if (!r) return;
      if (!r.lecture.ok) return erreur('choix', r.lecture.raison + ' Rien n’a été modifié.');
      // Pas de demande d'autorisation à l'ouverture : rien n'a encore été fait. Elle viendra au premier
      // vrai travail de l'équipe (vérification, indice ou clic sur « Enregistrer »).
      fin(r.lecture.donnees, r.handle);
    });

    // ----- Équipe -----

    $('.info-firefox', racine).hidden = F.accesDossiers;

    // Classes proposées et chemin du dossier (modèle) : redessinés si la liste du collège en ligne arrive après.
    const choixClasse = $('.champ-classe', racine);
    function majClasses() {
      const modele = A.projet.cheminSauvegarde || ['{classe}', '{equipe}'];
      $('.chemin-texte', racine).textContent = A.remplirChemin(modele, (A.projet.classes || ['5A'])[0] || '5A', 'Prénom_Prénom').join(' › ');
      const choisie = choixClasse.value;
      choixClasse.innerHTML =
        '<option value="">Choisis ta classe</option>' + (A.projet.classes || []).map((c) => `<option>${echapper(c)}</option>`).join('');
      if ((A.projet.classes || []).includes(choisie)) choixClasse.value = choisie;
    }
    majClasses();
    A.surCollege = majClasses;

    $('.formulaire-equipe', racine).addEventListener('submit', (e) => {
      e.preventDefault();
      const eleves = [...racine.querySelectorAll('.champ-prenom')].map((c) => c.value.trim()).filter(Boolean);
      if (!eleves.length) return erreur('equipe', 'Écris au moins un prénom.');
      if (eleves.some((p) => !/^[\p{L}][\p{L}' -]*$/u.test(p))) return erreur('equipe', 'Un prénom ne doit contenir que des lettres.');
      if (!choixClasse.value) return erreur('equipe', 'Choisis ta classe.');
      erreur('equipe', '');
      equipe = { eleves, classe: choixClasse.value, nom: A.nomEquipe(eleves) };
      preparerDossier();
      montrer('dossier');
    });

    // ----- Dossier de l'équipe -----

    function preparerDossier() {
      const chemin = A.remplirChemin(A.projet.cheminSauvegarde || ['{classe}', '{equipe}'], equipe.classe, equipe.nom);
      // Le chemin jusqu'au dossier du projet, celui-ci surligné : l'élève le sélectionne, Labo Blocs y crée le dossier de l'équipe.
      const cible = chemin.length - 2;
      $('.chemin', racine).innerHTML = chemin
        .slice(0, -1)
        .map((p, i) => `<span class="chemin-dossier${i === cible ? ' cible' : ''}">${echapper(p)}</span>`)
        .join('<span class="chemin-fleche" aria-hidden="true">›</span>');
      $('.nom-fichier', racine).textContent = equipe.nom + '.json';
      $('.nom-dossier-equipe', racine).textContent = equipe.nom;
      // Dossier du projet : celui que l'élève choisit ; Labo Blocs y crée lui-même le dossier de l'équipe.
      equipe.parent = chemin.length > 1 ? chemin[chemin.length - 2] : '';
      for (const el of racine.querySelectorAll('.nom-dossier-projet')) el.textContent = equipe.parent || 'du projet';
      racine.querySelector('[data-panneau="dossier"]').classList.toggle('sans-acces', !F.accesDossiers);
      $('.dossier-resultat', racine).innerHTML = '';
      $('.btn-choisir-dossier', racine).hidden = !F.accesDossiers;
      $('.btn-commencer-sans-dossier', racine).hidden = F.accesDossiers;
    }

    function resultat(html) {
      $('.dossier-resultat', racine).innerHTML = html;
    }

    async function choisirDossier() {
      erreur('dossier', '');
      let choix;
      try {
        choix = await F.choisirDossier();
      } catch {
        return erreur('dossier', 'Ce dossier ne peut pas être utilisé. Choisis-en un autre.');
      }
      if (!choix) return;
      // Le dossier de l'équipe est toujours créé (ou retrouvé) par Labo Blocs dans le dossier du projet.
      const creer = async () =>
        valider(await F.creerSousDossier(choix.dossier, equipe.nom), `Le dossier « ${equipe.nom} » est prêt dans « ${choix.nom} ».`);
      const sorte = F.analyserDossier(choix.nom, equipe.nom, equipe.parent);
      if (sorte === 'parent') return creer();
      if (sorte === 'equipe') {
        // L'élève est allé un cran trop loin : le dossier du projet est celui qui contient ce dossier.
        resultat(
          `<div class="avertissement"><p>Tu as choisi le dossier <strong>« ${echapper(choix.nom)} »</strong>. ` +
            `Choisis plutôt le dossier qui le contient, <strong>« ${echapper(equipe.parent || 'du projet')} »</strong> : Labo Blocs y retrouve ou y crée lui-même le dossier de ton équipe.</p>` +
            '<div class="accueil-actions"><button type="button" class="btn-principal btn-autre-dossier">Choisir le dossier du projet</button></div></div>',
        );
        $('.btn-autre-dossier', racine).addEventListener('click', choisirDossier);
        return;
      }
      // Un autre dossier : on demande à l'élève (le dossier de l'équipe sera quand même créé par Labo Blocs).
      resultat(
        `<div class="avertissement"><p>Le dossier choisi s’appelle <strong>« ${echapper(choix.nom)} »</strong>. ` +
          `Le dossier du projet s’appelle <strong>« ${echapper(equipe.parent || 'du projet')} »</strong>.</p>` +
          '<div class="accueil-actions">' +
          '<button type="button" class="btn-principal btn-autre-dossier">Choisir un autre dossier</button>' +
          `<button type="button" class="btn-secondaire btn-creer-ici">Créer « ${echapper(equipe.nom)} » dans « ${echapper(choix.nom)} »</button>` +
          '</div></div>',
      );
      $('.btn-autre-dossier', racine).addEventListener('click', choisirDossier);
      $('.btn-creer-ici', racine).addEventListener('click', creer);
    }

    async function valider(dossier, note) {
      const nom = equipe.nom + '.json';
      // Ne jamais écraser une sauvegarde qui existe déjà : on propose de l'ouvrir.
      const existante = await F.sauvegardeExistante(dossier, nom);
      if (existante) {
        if (!existante.lecture.ok) {
          return resultat(
            `<div class="avertissement"><p>Ce dossier contient déjà un fichier « ${echapper(nom)} » qui n’est pas une sauvegarde d’équipe. ` +
              'Il n’a pas été touché. Choisis un autre dossier.</p></div>',
          );
        }
        const d = existante.lecture.donnees;
        resultat(
          `<div class="avertissement"><p>Ce dossier contient déjà la sauvegarde de <strong>${echapper(d.equipe.eleves.join(', '))}</strong> ` +
            `(${avancementTexte(d)}, modifiée le ${dateFr(d.modifieLe)}). Elle n’a pas été touchée.</p>` +
            '<div class="accueil-actions">' +
            '<button type="button" class="btn-principal btn-ouvrir-existante">Ouvrir cette sauvegarde</button>' +
            '<button type="button" class="btn-secondaire btn-autre-dossier">Choisir un autre dossier</button></div></div>',
        );
        $('.btn-ouvrir-existante', racine).addEventListener('click', () => fin(d, existante.handle));
        $('.btn-autre-dossier', racine).addEventListener('click', choisirDossier);
        return;
      }
      const donnees = nouvelleSauvegarde();
      let handle;
      try {
        handle = await F.fichierDansDossier(dossier, nom);
        await F.enregistrer(donnees, handle);
      } catch {
        return erreur('dossier', 'Impossible d’écrire dans ce dossier. Vérifie que c’est bien le dossier de ton équipe, ou demande à ton professeur.');
      }
      resultat(
        `<div class="confirmation">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}<div>` +
          `<p><strong>Dossier validé.</strong> ${echapper(note)}</p>` +
          `<p>Ton travail s’enregistre dans le fichier « ${echapper(nom)} » de ce dossier.</p></div></div>` +
          `<div class="accueil-actions"><button type="button" class="btn-principal btn-commencer">Commencer${A.icone('suivant', { epaisseur: 2.8 })}</button></div>`,
      );
      $('.btn-choisir-dossier', racine).hidden = true;
      const b = $('.btn-commencer', racine);
      b.addEventListener('click', () => fin(donnees, handle));
      b.focus();
    }

    $('.btn-choisir-dossier', racine).addEventListener('click', choisirDossier);
    $('.btn-commencer-sans-dossier', racine).addEventListener('click', () => fin(nouvelleSauvegarde(), null));
    $('.btn-retour-equipe', racine).addEventListener('click', () => montrer('choix'));

    function fin(donnees, handle) {
      F.memoriserHandle(handle);
      F.sauverSecours(donnees);
      racine.hidden = true;
      commencer({ donnees, handle });
    }

    montrer('choix');
  }

  A.demarrerAccueil = demarrer;
})(this);

// ===== interface/ecran-parcours.js =====
// A3 · Parcours : les exercices dans l'ordre, l'état de chacun (verrouillé, à faire, en cours, réussi,
// à revérifier), les défis facultatifs, l'avancement. État toujours dit par un mot et un pictogramme.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const ETATS = {
    reussi: { mot: 'Réussi', icone: 'coche' },
    a_reverifier: { mot: 'À revérifier', icone: 'alerte' },
    en_cours: { mot: 'En cours', icone: 'lecture' },
    a_faire: { mot: 'À faire', icone: 'suivant' },
    verrouille: { mot: 'Réussis le précédent pour l’ouvrir', icone: 'cadenas' },
  };

  // contexte : { session, paquet, toutDebloquer, ouvrirExercice(id) }
  function creerEcranParcours(contexte) {
    const { session, paquet } = contexte;
    const D = session.donnees;
    const opts = { toutDebloquer: !!contexte.toutDebloquer };
    const ecran = $('.ecran-parcours');

    function dessiner() {
      const a = A.avancement(D, paquet);
      $('.parcours-compte', ecran).textContent = `${a.reussis} exercice${a.reussis > 1 ? 's' : ''} réussi${a.reussis > 1 ? 's' : ''} sur ${a.total}`;
      const barre = $('.barre', ecran);
      barre.setAttribute('aria-label', `${a.reussis} sur ${a.total}`);
      $('span', barre).style.width = Math.round((a.reussis / Math.max(1, a.total)) * 100) + '%';
      $('.pilule-revoir', ecran).hidden = !a.aReverifier;
      $('.revoir-texte', ecran).textContent = `${a.aReverifier} exercice${a.aReverifier > 1 ? 's' : ''} à revérifier`;
      const reprendre = paquet.exercices.find((e) => e.id === A.exerciceAReprendre(D, paquet, opts));
      const continuer = $('.btn-continuer', ecran);
      continuer.innerHTML = `<span>Continuer : exercice ${echapper(reprendre.numero)}</span>${A.icone('suivant', { epaisseur: 2.8 })}`;
      continuer.onclick = () => contexte.ouvrirExercice(reprendre.id);

      $('.parcours-grille', ecran).innerHTML = paquet.exercices
        .map((ex) => {
          const etat = A.etat(D, paquet, ex.id, opts);
          const courant = ex.id === reprendre.id && etat !== 'reussi' && etat !== 'verrouille';
          const e = courant ? { mot: 'En cours', icone: 'lecture' } : ETATS[etat];
          const motEtat = ex.libre && etat === 'reussi' ? 'Terminé' : e.mot;
          const prefixe = ex.defi ? 'Défi facultatif' : ex.libre ? 'Exercice libre' : '';
          const mot = prefixe ? (etat === 'verrouille' ? prefixe + ' · verrouillé' : prefixe + ' · ' + motEtat.toLowerCase()) : motEtat;
          const classes = ['carte-exercice', 'etat-' + etat, courant ? 'courant' : '', ex.defi ? 'defi' : ''].join(' ');
          return (
            `<button type="button" class="${classes}" data-id="${echapper(ex.id)}"${etat === 'verrouille' ? ' aria-disabled="true"' : ''}>` +
            `<span class="numero-exercice">${echapper(ex.numero)}</span>` +
            `<span class="exercice-texte"><strong>${echapper(ex.titre)}</strong>` +
            `<span class="exercice-etat">${e.icone === 'lecture' ? A.LECTURE : A.icone(e.icone, { epaisseur: 2.6 })}${echapper(mot)}</span>` +
            (etat === 'a_reverifier' ? '<span class="exercice-note">La consigne a changé. Tes blocs sont gardés : relance la vérification.</span>' : '') +
            '</span></button>'
          );
        })
        .join('');
    }

    $('.parcours-grille', ecran).addEventListener('click', (e) => {
      const b = e.target.closest('.carte-exercice');
      if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') return session.message('Cet exercice s’ouvrira quand tu auras réussi le précédent.');
      contexte.ouvrirExercice(b.dataset.id);
    });

    return { dessiner };
  }

  Object.assign(A, { creerEcranParcours });
})(this);

// ===== interface/camera.js =====
// Caméra et IA (jalon 6) : panneau de l'exercice. L'élève allume la webcam, fait apprendre à l'IA les étiquettes de
// l'exercice (« Loup », « Roi »… et « Rien » : la caméra sans rien devant) en prenant des photos, puis l'IA dit au
// programme ce qu'elle reconnaît : capteurs.camera (n° de l'étiquette, 0 = rien) et capteurs.certitudes.
// Sans webcam (ou avant d'avoir appris), des boutons « Faire comme si la caméra voyait… » règlent la même valeur.
//
// L'IA : MobileNet (vendor/vision, chargé seulement quand on allume la caméra) transforme l'image en 1280 nombres,
// les exemples les plus proches votent (noyau/knn.js). Tout reste dans l'ordinateur : rien n'est envoyé.
//
//   const p = A.creerPanneauCamera(racine, { lecture, donnees() → { modele, exemples, etiquettes? }, enregistrer(camera),
//     surEtiquettes(noms) })
//   p.ouvrir(exercice, capteurs)   (exercice.camera : { etiquettes: ['Loup', 'Roi'], etiquettesLibres? })   p.fermer()
// etiquettesLibres : l'équipe crée, renomme et supprime (la dernière) ses étiquettes ; celles de l'exercice sont le départ.
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});
  const $ = (sel, racine) => racine.querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const MODELE = 'mobilenet_v2_050_224';
  const PHOTOS_CONSEILLEES = 10;
  const IMAGES_PAR_SECONDE = 10;

  // Dossier de l'IA : à côté du module (projets : vendor/labo-blocs/vision/) ou dans le site (vendor/vision/).
  const ICI = (global.document && global.document.currentScript && global.document.currentScript.src) || '';
  if (!A.cheminVision) A.cheminVision = /labo-blocs-interface\.js/.test(ICI) ? ICI.replace(/[^/]*$/, '') + 'vision/' : 'vendor/vision/';

  global.definirModeleVision = (m) => {
    A.modeleVision = m;
  };

  function chargerScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = () => ko(new Error('fichier introuvable : ' + src));
      document.head.appendChild(s);
    });
  }

  // MobileNet, chargé une seule fois (une dizaine de secondes la première fois).
  let chargement = null;
  function chargerIA() {
    if (A.extraireCaracteristiques) return Promise.resolve();
    if (!chargement) {
      chargement = (async () => {
        const base = A.cheminVision;
        if (!global.tf) await chargerScript(base + 'tf.min.js');
        if (!global.mobilenet) await chargerScript(base + 'mobilenet.min.js');
        if (!A.modeleVision) await chargerScript(base + 'modele-mobilenet.js');
        const m = A.modeleVision;
        const binaire = atob(m.donnees);
        const octets = new Uint8Array(binaire.length);
        for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
        const lecteur = { load: async () => ({ modelTopology: m.topologie, weightSpecs: m.poids, weightData: octets.buffer, format: m.format }) };
        await global.tf.ready();
        const modele = await global.mobilenet.load({ version: 2, alpha: 0.5, modelUrl: lecteur, inputRange: [0, 1] });
        A.extraireCaracteristiques = async (video) => {
          const t = modele.infer(video, true);
          const d = await t.data();
          t.dispose();
          return d;
        };
      })();
      chargement.catch(() => (chargement = null));
    }
    return chargement;
  }

  function vignette(video) {
    const c = document.createElement('canvas');
    c.width = 96;
    c.height = 72;
    c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.7);
  }

  const ETIQUETTES_MAX = 8;
  // Nom d'une étiquette créée par l'élève : 20 caractères au plus, pas « Rien », pas déjà pris.
  //   → { ok, nom } ou { ok: false, message }
  function nomEtiquette(texte, existantes) {
    const nom = String(texte || '').trim().replace(/\s+/g, ' ');
    if (!nom) return { ok: false, message: 'Écris un nom pour ton étiquette (par exemple : Loup).' };
    if (nom.length > 20) return { ok: false, message: 'Ce nom est trop long : 20 caractères au plus.' };
    const pris = (existantes || []).concat(['Rien']).some((x) => x.toLowerCase() === nom.toLowerCase());
    if (pris) return { ok: false, message: `L’étiquette « ${nom} » existe déjà.` };
    return { ok: true, nom };
  }

  function creerPanneauCamera(racine, options) {
    const o = options || {};
    racine.innerHTML = `
      <div class="cam-titre"><strong>Caméra et IA</strong>
        <button type="button" class="btn-secondaire cam-allumer">Allumer la caméra</button></div>
      <div class="cam-video" hidden><video playsinline muted></video><p class="cam-vu" aria-live="polite"></p></div>
      <details class="cam-reflexion" open hidden>
        <summary>Ce que pense l’IA, en direct</summary>
        <ul class="cam-barres"></ul>
        <p class="cam-seuil-aide">Le programme voit une étiquette quand l’IA en est sûre à <strong>${A.creerStabilite().seuil} %</strong> au moins, pendant <strong>${A.creerStabilite().images} images</strong> de suite.</p>
        <p class="cam-suite"></p>
        <div class="cam-proche"></div>
      </details>
      <p class="cam-message" role="status" hidden></p>
      <p class="cam-aide">Pour chaque étiquette, montre-la à la caméra et prends des photos (${PHOTOS_CONSEILLEES} au moins, sous plusieurs angles).
        Chaque clic en ajoute 10 : si l’IA hésite, ajoute des photos. « Rien » : la caméra sans rien devant.
        ${o.lecture ? 'Mode enseignant : les photos ne sont pas enregistrées.' : 'Ce que tu apprends à l’IA est gardé dans le fichier de ton équipe.'}</p>
      <ul class="cam-etiquettes"></ul>
      <form class="cam-nouvelle" hidden>
        <label>Nouvelle étiquette<input class="cam-nouveau-nom" maxlength="20" autocomplete="off" placeholder="ex. Loup"></label>
        <button type="submit" class="btn-secondaire">Ajouter</button>
      </form>
      <p class="cam-ecart" role="status" hidden></p>
      <div class="cam-sans"><span>Sans caméra, faire comme si elle voyait :</span><span class="cam-sans-boutons"></span></div>`;
    const video = $('video', racine);
    const ia = A.creerReconnaissance();
    let stable = A.creerStabilite();
    let flux = null;
    let boucle = null;
    let exercice = null;
    let capteurs = {};
    let camera = { modele: MODELE, exemples: {} };
    let noms = []; // 0 = « Rien », puis les étiquettes de l'exercice (ou celles créées par l'équipe)
    let libres = false;
    let manuel = 0;

    const message = (texte) => {
      const m = $('.cam-message', racine);
      m.textContent = texte || '';
      m.hidden = !texte;
    };
    const ecart = (texte) => {
      const m = $('.cam-ecart', racine);
      m.textContent = texte || '';
      m.hidden = !texte;
    };

    // Les exemples gardés pour les étiquettes de cet exercice → l'IA.
    function apprendreTout() {
      ia.vider();
      noms.forEach((nom, n) => {
        for (const e of camera.exemples[nom] || []) ia.ajouter(n, A.depuisTexte(e.f));
      });
    }

    function dessiner() {
      const dernier = noms.length - 1;
      $('.cam-etiquettes', racine).innerHTML = noms
        .map((nom, n) => {
          const ex = camera.exemples[nom] || [];
          const peu = ex.length < PHOTOS_CONSEILLEES;
          const modifiable = libres && n > 0;
          return `<li class="cam-etiquette" data-n="${n}">
            <span class="cam-nom">${echapper(nom)}</span>
            <span class="cam-nb${peu ? ' cam-peu' : ''}">${ex.length} photo${ex.length > 1 ? 's' : ''}${peu ? ` · ${PHOTOS_CONSEILLEES} conseillées` : ''}</span>
            <span class="cam-vignettes">${ex.slice(-4).map((e) => `<img src="${e.v}" alt="" width="48" height="36">`).join('')}</span>
            <span class="cam-actions">
              <button type="button" class="btn-principal cam-photo" ${flux ? '' : 'disabled'}>+ 10 photos</button>
              <button type="button" class="btn-secondaire cam-effacer" ${ex.length ? '' : 'disabled'}>Effacer les photos</button>
              ${modifiable ? '<button type="button" class="btn-secondaire cam-renommer">Renommer</button>' : ''}
              ${modifiable && n === dernier ? '<button type="button" class="btn-secondaire cam-supprimer">Supprimer</button>' : ''}
            </span></li>`;
        })
        .join('');
      $('.cam-nouvelle', racine).hidden = !libres || noms.length - 1 >= ETIQUETTES_MAX;
      $('.cam-sans-boutons', racine).innerHTML = noms
        .map((nom, n) => `<button type="button" class="btn-secondaire cam-comme" data-n="${n}" aria-pressed="${!flux && manuel === n}">${echapper(nom)}</button>`)
        .join('');
      $('.cam-sans', racine).hidden = !!flux;
      $('.cam-reflexion', racine).hidden = !flux;
      $('.cam-allumer', racine).textContent = flux ? 'Éteindre la caméra' : 'Allumer la caméra';
    }

    // « Ce que pense l'IA » : une barre par étiquette (votes des photos les plus proches), le seuil, la photo la plus
    // ressemblante et l'étiquette en train de gagner.
    function dessinerReflexion(r, vu) {
      const seuil = stable.seuil;
      $('.cam-barres', racine).innerHTML = noms
        .map((nom, n) => {
          const c = r.certitudes[n] || 0;
          const etat = n === vu ? ' cam-barre-vue' : c >= seuil ? ' cam-barre-sure' : '';
          return `<li class="cam-barre${etat}"><span class="cam-barre-nom">${echapper(nom)}${n === vu ? ' · vu par le programme' : ''}</span>` +
            `<span class="cam-barre-fond" style="--seuil:${seuil}%"><span class="cam-barre-valeur" style="width:${c}%"></span></span>` +
            `<span class="cam-barre-pc">${c} %</span></li>`;
        })
        .join('');
      const candidat = noms[stable.candidat];
      $('.cam-suite', racine).textContent = r.certitudes[r.etiquette] >= seuil && candidat
        ? `« ${candidat} » : ${stable.suite} image${stable.suite > 1 ? 's' : ''} sur ${stable.images} de suite.`
        : 'L’IA hésite : aucune étiquette n’atteint le seuil.';
      const p = r.proche;
      const photo = p && (camera.exemples[noms[p.n]] || [])[p.i];
      $('.cam-proche', racine).innerHTML = photo
        ? `<img src="${photo.v}" alt="" width="64" height="48"><span>Photo apprise qui ressemble le plus : <strong>${echapper(noms[p.n])}</strong> (ressemblance ${p.ressemblance} %)</span>`
        : '';
    }

    function regler(n, certitudes) {
      capteurs.camera = n;
      capteurs.certitudes = certitudes || null;
    }

    function enregistrer() {
      if (libres) camera.etiquettes = noms.slice(1);
      if (!o.lecture && o.enregistrer) o.enregistrer(camera);
    }

    // Les noms ont changé (étiquettes de l'équipe) : menus des blocs et page.
    function etiquettesChangees() {
      A.etiquettesCamera = noms;
      apprendreTout();
      enregistrer();
      dessiner();
      if (o.surEtiquettes) o.surEtiquettes(noms);
    }

    // ----- Webcam et reconnaissance -----

    async function allumer() {
      message('Chargement de l’IA… (quelques secondes la première fois)');
      try {
        await chargerIA();
      } catch {
        message('L’IA n’a pas pu se charger : vérifie que le dossier « vision » est bien à côté de Labo Blocs, puis réessaie.');
        return;
      }
      try {
        flux = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      } catch {
        flux = null;
        message('La caméra ne s’allume pas : autorise la caméra dans le navigateur (icône à gauche de l’adresse), vérifie qu’une webcam est branchée, puis réessaie.');
        return;
      }
      video.srcObject = flux;
      await video.play().catch(() => {});
      $('.cam-video', racine).hidden = false;
      message('');
      stable = A.creerStabilite();
      dessiner();
      let occupe = false;
      boucle = setInterval(async () => {
        if (occupe || !flux || video.readyState < 2) return;
        occupe = true;
        try {
          const r = ia.reconnaitre(await A.extraireCaracteristiques(video));
          const vu = stable.pousser(r);
          regler(vu, r.certitudes);
          const appris = Object.keys(r.certitudes).length;
          $('.cam-vu', racine).textContent = appris
            ? `L’IA reconnaît : ${noms[vu] || noms[0]} (${r.certitudes[vu] || 0} %)`
            : 'Prends d’abord des photos pour chaque étiquette.';
          if (appris) dessinerReflexion(r, vu);
        } finally {
          occupe = false;
        }
      }, 1000 / IMAGES_PAR_SECONDE);
    }

    function eteindre() {
      clearInterval(boucle);
      boucle = null;
      if (flux) for (const piste of flux.getTracks()) piste.stop();
      flux = null;
      video.srcObject = null;
      $('.cam-video', racine).hidden = true;
      regler(manuel, null);
      dessiner();
    }

    // 10 photos de plus pour cette étiquette (elles s'ajoutent aux précédentes).
    async function photographier(n, bouton) {
      const nom = noms[n];
      bouton.disabled = true;
      for (let i = 0; i < 10 && flux; i++) {
        bouton.textContent = `Photo ${i + 1} sur 10…`;
        const f = await A.extraireCaracteristiques(video);
        ia.ajouter(n, f);
        (camera.exemples[nom] = camera.exemples[nom] || []).push({ f: A.versTexte(f), v: vignette(video) });
        await new Promise((ok) => setTimeout(ok, 150));
      }
      camera.modele = MODELE;
      enregistrer();
      dessiner();
    }

    racine.addEventListener('submit', (e) => {
      e.preventDefault();
      const champ = $('.cam-nouveau-nom', racine);
      const r = nomEtiquette(champ.value, noms.slice(1));
      if (!r.ok) return ecart(r.message);
      ecart('');
      champ.value = '';
      noms.push(r.nom);
      etiquettesChangees();
    });

    racine.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.type === 'submit') return;
      if (b.classList.contains('cam-allumer')) return flux ? eteindre() : allumer();
      if (b.classList.contains('cam-comme')) {
        manuel = Number(b.dataset.n);
        regler(manuel, null);
        return dessiner();
      }
      const ligne = b.closest('.cam-etiquette');
      if (!ligne) return;
      const n = Number(ligne.dataset.n);
      if (b.classList.contains('cam-photo')) photographier(n, b);
      if (b.classList.contains('cam-effacer')) {
        delete camera.exemples[noms[n]];
        apprendreTout();
        enregistrer();
        dessiner();
      }
      if (b.classList.contains('cam-renommer')) {
        const ancien = noms[n];
        const texte = global.prompt(`Nouveau nom pour « ${ancien} » :`, ancien);
        if (texte === null) return;
        const r = nomEtiquette(texte, noms.slice(1).filter((x) => x !== ancien));
        if (!r.ok) return ecart(r.message);
        ecart('');
        if (camera.exemples[ancien]) {
          camera.exemples[r.nom] = camera.exemples[ancien];
          delete camera.exemples[ancien];
        }
        noms[n] = r.nom;
        etiquettesChangees();
      }
      // Seulement la dernière : les numéros des autres étiquettes (utilisés par les blocs) ne changent pas.
      if (b.classList.contains('cam-supprimer') && n === noms.length - 1) {
        if (!global.confirm(`Supprimer l’étiquette « ${noms[n]} » et ses photos ?`)) return;
        delete camera.exemples[noms[n]];
        noms.pop();
        if (manuel >= noms.length) manuel = 0;
        etiquettesChangees();
      }
    });

    return {
      // Un exercice avec caméra : ses étiquettes (ou celles créées par l'équipe) ; le panneau est caché pour les autres.
      ouvrir(ex, c) {
        exercice = ex;
        capteurs = c || {};
        const reglage = ex && ex.camera;
        racine.hidden = !reglage;
        if (!reglage) return eteindre();
        const lues = (o.donnees && o.donnees()) || {};
        libres = !!reglage.etiquettesLibres;
        const depart = libres && Array.isArray(lues.etiquettes) && lues.etiquettes.length ? lues.etiquettes : reglage.etiquettes || [];
        noms = ['Rien'].concat(depart);
        A.etiquettesCamera = noms;
        // Un autre modèle d'IA : les anciennes photos ne servent plus (les nombres ne se comparent pas).
        camera = { modele: MODELE, exemples: lues.modele && lues.modele !== MODELE ? {} : Object.assign({}, lues.exemples) };
        if (Array.isArray(lues.etiquettes)) camera.etiquettes = lues.etiquettes.slice();
        apprendreTout();
        manuel = 0;
        ecart('');
        regler(0, null);
        dessiner();
      },
      // Les capteurs du simulateur ouvert (créés après le chargement des blocs).
      relier(c) {
        capteurs = c || {};
        regler(capteurs === c && flux ? capteurs.camera || 0 : manuel, null);
      },
      fermer: () => eteindre(),
      get allumee() {
        return !!flux;
      },
      exercice: () => exercice,
    };
  }

  Object.assign(A, { creerPanneauCamera, chargerIA, nomEtiquette });
})(this);

// ===== interface/ecran-exercice.js =====
// A4 · Écran d'exercice (repris de l'atelier) : consigne en bandeau, composants, indices, éditeur de blocs, code Arduino
// (niveau 3), simulateur, vérification et son résultat (A5).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Consigne ----------

  // Souligne la première apparition de chaque mot du lexique.
  function souligner(texteEchappe, lexique, dejaVus) {
    const formes = [];
    lexique.forEach((entree, i) => (entree.formes || []).forEach((f) => formes.push({ f, i })));
    formes.sort((a, b) => b.f.length - a.f.length);
    if (!formes.length) return texteEchappe;
    const motif = new RegExp('(?<![\\p{L}\\d])(' + formes.map((x) => x.f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\d])', 'gu');
    return texteEchappe.replace(motif, (m) => {
      const x = formes.find((y) => y.f === m);
      if (!x || dejaVus.has(x.i)) return m;
      dejaVus.add(x.i);
      return `<button type="button" class="mot-cle" data-mot="${x.i}">${m}</button>`;
    });
  }

  // Les broches (D3, P0, A1) en pastille, comme dans la maquette.
  const broches = (html) => html.replace(/(?<![\p{L}\d>])([DPA]\d{1,2})(?![\p{L}\d])/gu, '<span class="broche">$1</span>');

  // Mots qui construisent le programme, mis en évidence (comme les blocs « Décisions » et « Boucles »).
  const STRUCTURE = /(?<![\p{L}\d])(sinon|si|alors|tant que|répéter|jusqu’à|jusqu'à|quand)(?![\p{L}\d])/giu;
  // Dans du HTML : seulement le texte, jamais l'intérieur des balises.
  const marquerStructure = (html) =>
    html
      .split(/(<[^>]+>)/)
      .map((morceau) => (morceau.startsWith('<') ? morceau : morceau.replace(STRUCTURE, '<strong class="mot-structure">$1</strong>')))
      .join('');

  // Une phrase « si … alors … sinon … » est coupée comme les blocs : chaque « si » commence une ligne,
  // « alors » et « sinon » vont à la ligne, en retrait.
  function decouper(phrase) {
    const coupe = /(?<![\p{L}\d])(sinon|si|alors)(?![\p{L}\d])/giu;
    const morceaux = [];
    let debut = 0;
    let niveau = 0;
    for (const m of phrase.matchAll(coupe)) {
      if (m.index > debut && phrase.slice(debut, m.index).trim()) morceaux.push({ texte: phrase.slice(debut, m.index).trim(), niveau });
      if (m.index > debut || !morceaux.length) debut = m.index;
      niveau = m[1].toLowerCase() === 'si' ? 0 : 1;
    }
    morceaux.push({ texte: phrase.slice(debut).trim(), niveau });
    return morceaux.filter((x) => x.texte);
  }

  function consigneHtml(texte, lexique) {
    const vus = new Set();
    const rendre = (t) => marquerStructure(broches(souligner(echapper(t), lexique, vus)));
    let html = '';
    let etiquettes = [];
    const vider = () => {
      if (etiquettes.length) html += `<div class="consigne-etiquettes">${etiquettes.join('')}</div>`;
      etiquettes = [];
    };
    for (const l of texte.split('\n')) {
      if (/^\s*-\s/.test(l)) etiquettes.push(`<span class="consigne-etiquette">${rendre(l.replace(/^\s*-\s/, ''))}</span>`);
      else {
        vider();
        const morceaux = decouper(l);
        if (morceaux.length > 1) html += `<p class="consigne-structure">${morceaux.map((m) => `<span class="consigne-ligne niveau-${m.niveau}">${rendre(m.texte)}</span>`).join('')}</p>`;
        else html += `<p>${rendre(l)}</p>`;
      }
    }
    vider();
    return html;
  }

  const NOMS_COMPOSANTS = { led: 'LED', bouton: 'Bouton', servo: 'Servomoteur', buzzer: 'Buzzer', joystick: 'Joystick' };
  const ICONES_COMPOSANTS = { led: 'lumiere', bouton: 'bouton', servo: 'moteur', buzzer: 'son', joystick: 'joystick' };
  // Broches d'un composant dans la liste « Composants » (le joystick en a trois).
  const brochesDuComposant = (c) =>
    c.type === 'joystick'
      ? `<span class="broches-joystick">X <span class="broche">${c.broche}</span> Y <span class="broche">${c.y}</span> bouton <span class="broche">${c.bouton}</span></span>`
      : `<span class="broche">${c.broche}</span>`;

  // contexte : { session, paquet, toutDebloquer, majBandeau(exercice), solution (bouton « Solution » du mode enseignant),
  //   actionsReussite(exercice) → [{ texte, principal, action }] (boutons ajoutés au message de réussite, ex. envoi dans
  //   la carte du projet) }
  function creerEcranExercice(contexte) {
    const { session, paquet } = contexte;
    const D = session.donnees;
    const exercices = paquet.exercices;
    const lexique = paquet.lexique || [];
    const lecture = !!session.lecture;
    const opts = { toutDebloquer: !!contexte.toutDebloquer };
    A.fiches = paquet.fiches || {};
    A.lexique = lexique;

    const etat = { exercice: null, mode: 'arrete', vitesse: 1, sim: null, servos: {}, rejeu: null, niveau: 1, boutonsAvant: null, joystickAvant: null };
    const ecran = $('.ecran-exercice');

    const editeur = A.creerEditeur($('.editeur', ecran), {
      modifie() {
        if (etat.mode !== 'arrete') arreter();
        fermerResultat();
        programmeModifie();
        majCode();
        if (etat.exercice && etat.exercice.libre) majComposantsLibres();
      },
      zoom(pourcent) {
        $('.zoom-valeur', ecran).textContent = pourcent + ' %';
      },
    });
    let vue = null;

    // ----- Caméra et IA (exercices avec « camera » : étiquettes à apprendre, blocs de la caméra) -----
    const panneauCamera = A.creerPanneauCamera
      ? A.creerPanneauCamera($('.camera-ia', ecran), {
          lecture,
          donnees: () => A.lireCamera(D),
          enregistrer(camera) {
            A.noterCamera(D, camera);
            session.aEnregistrer(true, true);
          },
          // Étiquettes créées ou renommées par l'équipe : les blocs déjà posés affichent les nouveaux noms.
          surEtiquettes() {
            const Blockly = global.Blockly;
            Blockly.Events.disable();
            try {
              for (const b of editeur.ws.getAllBlocks(false)) {
                const f = b.getField('ETIQUETTE');
                if (!f) continue;
                f.getOptions(false);
                if (f.doValueUpdate_) f.doValueUpdate_(f.getValue());
                if (f.forceRerender) f.forceRerender();
              }
            } finally {
              Blockly.Events.enable();
            }
          },
        })
      : null;

    // ----- Aides : indices, fiche « À savoir », lexique -----

    const aides = A.creerAides({
      indicesOuverts: () => A.progressionExercice(D, etat.exercice.id).indicesOuverts,
      ouvrirIndice(niveau) {
        A.noterIndice(D, etat.exercice.id, niveau);
        majIndices();
        session.aEnregistrer(true, true);
      },
    });
    function majIndices() {
      const n = A.progressionExercice(D, etat.exercice.id).indicesOuverts;
      $('.compteur-indices', ecran).textContent = `${n} sur 3 utilisés`;
      $('.texte-indice', ecran).textContent = n >= 3 ? 'Revoir les indices' : n ? `Revoir · ouvrir l’indice ${n + 1}` : 'Ouvrir l’indice 1';
    }
    // Mots du lexique déjà rencontrés : ceux des consignes des exercices ouverts par l'équipe.
    function motsVus() {
      const vus = new Set();
      for (const ex of exercices) {
        if (!D.programmation.exercices[ex.id]) continue;
        lexique.forEach((entree, i) => {
          if ((entree.formes || []).some((forme) => A.contientMot(ex.consigne, forme))) vus.add(i);
        });
      }
      return vus;
    }
    const lexiqueComplet = A.creerLexique(motsVus);
    // Pastille « ? » des blocs « Au démarrage » et « Répéter indéfiniment ».
    A.surAideChapeau = () => {
      fermerResultat();
      aides.explication('demarrage-boucle');
    };
    $('[data-aide="fiche"]', ecran).addEventListener('click', () => aides.fiche());
    $('[data-aide="indice"]', ecran).addEventListener('click', () => aides.indice());
    $('.btn-lexique', ecran).addEventListener('click', () => lexiqueComplet.ouvrir());

    // ----- Ouverture d'un exercice -----

    // programme : sauvegarde Blockly ou programme à montrer à la place de celui de l'équipe (lecture par le professeur).
    function ouvrir(ex, programme) {
      if (!A.estDebloque(D, paquet, ex.id, opts)) return false;
      if (etat.exercice) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      A.aideLed = !!ex.aideLed; // menu de la LED : « HAUT (1) : allumée » pendant les premiers exercices
      arreter();
      fermerResultat();
      fermerBulle();
      // Exercice libre : une copie dont les composants suivent le programme de l'élève.
      etat.exercice = ex.libre ? Object.assign({}, ex, { composants: [] }) : ex;
      $('.consigne-numero', ecran).textContent = (ex.defi ? 'Défi · ' : '') + 'Exercice ' + ex.numero;
      $('.titre-exercice', ecran).textContent = ex.titre;
      document.title = `Exercice ${ex.numero} · ${ex.titre} — ${A.projet.titre}`;
      $('.consigne-texte', ecran).innerHTML = consigneHtml(ex.consigne, lexique);
      $('.consigne', ecran).classList.toggle('longue', ex.consigne.length > 300);
      const avant = A.progressionExercice(D, ex.id);
      const statutAvant = avant.statut;
      // Étiquettes de la caméra d'abord : les menus des blocs de la caméra les proposent au chargement.
      if (panneauCamera) panneauCamera.ouvrir(ex, {});
      editeur.charger(ex, programme ? (programme.blocks ? programme : A.versBlockly(programme)) : avant.programme);
      const libres = ex.libre ? composantsLibres() : null;
      if (libres) etat.exercice.composants = libres.composants;
      dessinerComposants(libres && libres.conflits);
      vue = A.creerVueSimulateur($('.simulateur', ecran), etat.exercice, { appuyerBouton, reglerJoystick });
      // Ce que voit la caméra arrive dans les capteurs du simulateur (et du mode « En direct »).
      if (!vue.capteurs) vue.capteurs = {};
      if (panneauCamera) panneauCamera.relier(vue.capteurs);
      // Exercice libre : « J'ai terminé » à la place de « Vérifier » ; ni indice ni solution s'il n'y en a pas.
      $('.btn-verifier:not(.btn-terminer)', ecran).hidden = !!ex.libre;
      $('.btn-terminer', ecran).hidden = !ex.libre || lecture;
      $('.verification', ecran).hidden = !!ex.libre && lecture; // mode enseignant : rien à vérifier ni à terminer
      $('.carte-aide', ecran).hidden = !!ex.libre && !(ex.indices || []).some(Boolean);
      btnSolution.hidden = !contexte.solution || !!ex.libre;
      if (panneauCarte) panneauCarte.choisirProfil(A.profil(ex.carte));
      montrerModes(ex);
      if (vue.verrouillerCapteurs) vue.verrouillerCapteurs(etat.modeTest === 'direct');
      niveauDeLExercice(ex);
      touches.clear();
      verifierClavier();
      afficher();
      A.noterOuverture(D, ex.id);
      aides.changerExercice(ex);
      majIndices();
      majCode();
      if (avant.aReverifier) montrerRevoir();
      if (contexte.majBandeau) contexte.majBandeau(ex);
      // Rouvrir un exercice déjà commencé n'est pas un travail à enregistrer.
      if (A.progressionExercice(D, ex.id).statut !== statutAvant) session.aEnregistrer(true);
      return true;
    }

    // ----- Composants : ceux de l'exercice, ou ceux que le programme utilise (exercice libre) -----

    function composantsLibres() {
      const ex = etat.exercice;
      // mBot, micro:bit : tout est sur la carte (sauf le joystick de la micro:bit, sur P0, P1, P2).
      if (ex.carte === 'microbit') return { composants: A.composantsDuProgramme(editeur.lire().programme, 'microbit').composants.filter((c) => c.type === 'joystick'), conflits: [] };
      if (ex.carte && ex.carte !== 'uno') return { composants: [], conflits: [] };
      return A.composantsDuProgramme(editeur.lire().programme, 'uno');
    }
    function dessinerComposants(conflits) {
      const ex = etat.exercice;
      // Beaucoup de composants (exercice 13) : le simulateur prend plus de place.
      ecran.classList.toggle('beaucoup', (ex.composants || []).length > 4);
      $('.liste-composants', ecran).innerHTML = (ex.composants || [])
        .map(
          (c) =>
            `<li${c.conflit ? ' class="composant-en-conflit"' : ''}><span class="composant-pastille composant-${c.type}">${A.icone(ICONES_COMPOSANTS[c.type] || 'info', { epaisseur: 2.4 })}</span>` +
            `<span>${echapper(NOMS_COMPOSANTS[c.type] || c.type)}${c.nom ? ' ' + echapper(c.nom) : ''} ${brochesDuComposant(c)}${c.conflit ? ' <span class="broche-partagee">⚠ broche partagée</span>' : ''}</span></li>`,
        )
        .join('');
      // Ce qui est déjà sur la carte (rien à brancher).
      const surLaCarte = { mbot: 'Sur le robot : moteurs, LED, buzzer, bouton, capteur à ultrasons (port 3) et suiveur de ligne (port 2).', microbit: 'Sur la carte : écran 5 × 5, boutons A et B, logo tactile, haut-parleur et capteurs.' }[ex.carte];
      if (surLaCarte) $('.liste-composants', ecran).insertAdjacentHTML('beforeend', `<li class="composants-carte"><span class="composant-pastille composant-carte">${A.icone('puzzle', { epaisseur: 2.4 })}</span><span>${surLaCarte}</span></li>`);
      const note = $('.composants-note', ecran);
      const liste = conflits || [];
      note.classList.toggle('ecart', liste.length > 0);
      if (liste.length) {
        const nom = (t) => {
          const n = NOMS_COMPOSANTS[t] || t;
          return n === n.toUpperCase() ? n : n.toLowerCase();
        };
        note.textContent =
          liste.map((c) => `La broche ${c.broche} sert à deux composants (${c.types.map(nom).join(' et ')}).`).join(' ') +
          ' Une broche ne peut brancher qu’un seul composant : choisis une autre broche pour l’un d’eux.';
        note.hidden = false;
      } else if (ex.libre && (!ex.carte || ex.carte === 'uno')) {
        note.textContent = ex.composants.length ? 'Les composants suivent ton programme : à brancher sur ces broches.' : 'Pose un bloc (LED, bouton, servomoteur, buzzer) : son composant apparaît ici et dans le simulateur.';
        note.hidden = false;
      } else note.hidden = true;
    }
    // Le programme a changé : si ses composants aussi, la liste et le simulateur suivent.
    function majComposantsLibres() {
      const ex = etat.exercice;
      const r = composantsLibres();
      const avant = JSON.stringify(ex.composants);
      ex.composants = r.composants;
      dessinerComposants(r.conflits);
      if (JSON.stringify(r.composants) === avant || !vue) return;
      vue = A.creerVueSimulateur($('.simulateur', ecran), ex, { appuyerBouton });
      if (!vue.capteurs) vue.capteurs = {};
      if (panneauCamera) panneauCamera.relier(vue.capteurs);
      if (vue.verrouillerCapteurs) vue.verrouillerCapteurs(etat.modeTest === 'direct');
      afficher();
    }

    // ----- Consigne : bulle de définition -----

    let motOuvert = null;
    $('.consigne-texte', ecran).addEventListener('click', (e) => {
      const mot = e.target.closest('.mot-cle');
      if (!mot) return;
      if (motOuvert === mot.dataset.mot) return fermerBulle();
      motOuvert = mot.dataset.mot;
      const entree = lexique[Number(motOuvert)];
      const bulle = $('.bulle', ecran);
      $('.bulle-mot', bulle).textContent = entree.mot;
      $('.bulle-definition', bulle).textContent = entree.definition;
      bulle.hidden = false;
      // Sous le mot cliqué, sans sortir du bandeau de la consigne.
      const cadre = $('.consigne', ecran).getBoundingClientRect();
      const r = mot.getBoundingClientRect();
      bulle.style.left = Math.max(8, Math.min(r.left - cadre.left, cadre.width - bulle.offsetWidth - 8)) + 'px';
      bulle.style.top = r.bottom - cadre.top + 6 + 'px';
      $('.bulle-fermer', bulle).focus();
    });
    $('.bulle-fermer', ecran).addEventListener('click', fermerBulle);
    function fermerBulle() {
      motOuvert = null;
      $('.bulle', ecran).hidden = true;
    }
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !ecran.hidden) {
        fermerBulle();
        aides.fermer();
      }
    });

    // ----- Colonnes repliables : plus de place pour le programme (choix gardé sur ce poste) -----

    const CLE_COLONNES = 'labo-blocs-colonnes';
    const replie = { gauche: false, droite: false, consigne: false };
    try {
      Object.assign(replie, JSON.parse(localStorage.getItem(CLE_COLONNES)) || {});
    } catch {
      /* stockage indisponible : tout est déplié */
    }
    function majColonnes() {
      for (const cote of ['gauche', 'droite']) {
        ecran.classList.toggle('replie-' + cote, !!replie[cote]);
        const nom = cote === 'gauche' ? 'les composants et l’aide' : 'le simulateur';
        for (const b of ecran.querySelectorAll(`.btn-plier[data-colonne="${cote}"]`)) {
          b.setAttribute('aria-expanded', String(!replie[cote]));
          $('.texte-plier', b).textContent = (replie[cote] ? 'Afficher ' : 'Replier ') + nom;
          b.title = replie[cote] ? `Afficher ${nom}` : `Replier ${nom} pour agrandir le programme`;
          const icone = b.querySelector('.icone');
          const vers = (cote === 'gauche') === !replie[cote] ? 'chevronGauche' : 'chevronDroite';
          if (icone) icone.outerHTML = A.icone(vers, { epaisseur: 2.8 });
        }
      }
      // Texte de la consigne masqué : il reste le titre, « À savoir » et « Lexique ».
      $('.consigne', ecran).classList.toggle('reduite', !!replie.consigne);
      const bouton = $('.btn-reduire-consigne', ecran);
      bouton.setAttribute('aria-expanded', String(!replie.consigne));
      $('.texte-reduire', bouton).textContent = replie.consigne ? 'Afficher le texte' : 'Masquer le texte';
      if (replie.consigne) fermerBulle();
    }
    function basculerColonne(cote) {
      replie[cote] = !replie[cote];
      try {
        localStorage.setItem(CLE_COLONNES, JSON.stringify(replie));
      } catch {
        /* rien */
      }
      majColonnes();
    }
    for (const b of ecran.querySelectorAll('.btn-plier, .bande-repliee')) b.addEventListener('click', () => basculerColonne(b.dataset.colonne));
    $('.btn-reduire-consigne', ecran).addEventListener('click', () => basculerColonne('consigne'));
    majColonnes();

    // ----- Niveaux : 3 = code Arduino en lecture seule, relié aux blocs -----

    function choisirNiveau(n) {
      etat.niveau = n;
      for (const b of ecran.querySelectorAll('.btn-niveau')) b.setAttribute('aria-pressed', String(Number(b.dataset.niveau) === n));
      $('.code-arduino', ecran).hidden = n !== 3;
      ecran.classList.toggle('avec-code', n === 3);
      majCode();
    }
    for (const b of ecran.querySelectorAll('.btn-niveau')) b.addEventListener('click', () => choisirNiveau(Number(b.dataset.niveau)));
    // Niveau choisi par le professeur pour l'exercice (ex.niveau), éventuellement verrouillé (évaluation).
    // Le niveau 3 (code Arduino) n'existe que pour l'Arduino Uno.
    function niveauDeLExercice(ex) {
      const avecCode = !ex.carte || ex.carte === 'uno';
      if (ex.niveau) choisirNiveau(Number(ex.niveau));
      if (!avecCode && etat.niveau === 3) choisirNiveau(2);
      for (const b of ecran.querySelectorAll('.btn-niveau')) {
        const autre = Number(b.dataset.niveau) !== Number(ex.niveau);
        const sansCode = !avecCode && b.dataset.niveau === '3';
        b.disabled = (!!ex.niveauVerrouille && autre) || sansCode;
        b.title = sansCode ? 'Le code Arduino n’est montré que pour l’Arduino Uno.' : b.disabled ? 'Ton professeur a choisi le niveau de cet exercice.' : '';
      }
      $('.niveaux-libelle', ecran).textContent = ex.niveauVerrouille ? 'Niveau imposé' : 'Niveau';
    }
    let code = null;
    let blocChoisi = null;
    function majCode() {
      if (etat.niveau !== 3 || !etat.exercice) return;
      try {
        code = A.versArduino(editeur.lire().programme, { titre: `Exercice ${etat.exercice.numero} · ${etat.exercice.titre}`, boutonsVersMasse: etat.exercice.boutonsVersMasse, composants: etat.exercice.composants });
      } catch {
        code = null;
      }
      dessinerCode();
    }
    function dessinerCode() {
      const zone = $('.code-lignes', ecran);
      if (!code) {
        zone.textContent = '';
        return;
      }
      const plage = blocChoisi && code.lignes[blocChoisi];
      zone.innerHTML = code.code
        .replace(/\n$/, '')
        .split('\n')
        .map((l, i) => `<span class="ligne${plage && i + 1 >= plage[0] && i + 1 <= plage[1] ? ' surlignee' : ''}">${echapper(l) || ' '}</span>`)
        .join('');
      const premiere = zone.querySelector('.surlignee');
      if (premiere) premiere.scrollIntoView({ block: 'nearest' });
    }
    editeur.ws.addChangeListener((e) => {
      if (e.type !== global.Blockly.Events.SELECTED) return;
      blocChoisi = e.newElementId || null;
      if (etat.niveau === 3) dessinerCode();
    });

    // ----- Modes : ceux que le parcours propose, ou ceux de l'exercice s'il en choisit d'autres -----
    //   simulateur · direct (« En direct » : le programme tourne dans l'ordinateur, la carte obéit) · carte

    // La caméra est dans l'ordinateur : un exercice avec caméra ne se fait pas « Dans la carte ».
    const modesDe = (ex) => ((ex && ex.modes) || paquet.modes || ['simulateur']).filter((m) => !(ex && ex.camera && m === 'carte'));
    const tousLesModes = new Set([paquet.modes || ['simulateur'], ...exercices.map((e) => e.modes || [])].flat());
    etat.modeTest = 'simulateur';
    const sectionTest = $('.simulateur', ecran);
    function montrerModes(ex) {
      const m = modesDe(ex);
      for (const b of ecran.querySelectorAll('.btn-mode')) b.hidden = !m.includes(b.dataset.mode);
      ecran.querySelector('.modes').hidden = m.length < 2;
      if (!m.includes(etat.modeTest)) choisirModeTest('simulateur');
    }
    function choisirModeTest(m) {
      if (m === etat.modeTest) return;
      if (etat.mode !== 'arrete') arreter();
      etat.modeTest = m;
      for (const b of ecran.querySelectorAll('.btn-mode')) b.setAttribute('aria-pressed', String(b.dataset.mode === m));
      sectionTest.classList.toggle('mode-carte', m === 'carte');
      sectionTest.classList.toggle('mode-direct', m === 'direct');
      $('.panneau-carte', ecran).hidden = m === 'simulateur';
      if (vue && vue.verrouillerCapteurs) vue.verrouillerCapteurs(m === 'direct');
      if (panneauCarte) panneauCarte.redessiner();
      $('.simu-note', ecran).textContent = '';
      majCommandes();
    }
    for (const b of ecran.querySelectorAll('.btn-mode')) b.addEventListener('click', () => choisirModeTest(b.dataset.mode));

    // « Dans la carte » : le programme de l'élève, compilé comme pour le simulateur, part dans la carte du parcours.
    // « En direct » : le même panneau connecte la carte ; « Lancer » fait tourner le programme et la carte obéit.
    const panneauCarte = tousLesModes.has('carte') || tousLesModes.has('direct')
      ? A.creerPanneauCarte($('.panneau-carte', ecran), {
          pourDirect: () => etat.modeTest === 'direct',
          surArretDirect: () => arreter(),
          programme() {
            const ex = etat.exercice;
            const prog = editeur.lire().programme;
            // clavier : le programme utilise le clavier de l'ordinateur (il ne part pas dans la carte, voir carte.js).
            return Object.assign(A.codeOctet.compiler(prog, { composants: ex.composants, boutonsVersMasse: ex.boutonsVersMasse }), { clavier: !!(A.utiliseClavier && A.utiliseClavier(prog)) });
          },
          surEnvoi(r) {
            if (lecture || !etat.exercice) return;
            A.noterEnvoi(D, etat.exercice.id, { carte: etat.exercice.carte, reussi: r.ok, octets: r.octets, message: r.message, programme: editeur.lire().programme });
            session.aEnregistrer(true, true);
          },
          surVidage(r) {
            if (lecture || !etat.exercice) return;
            A.noterVidage(D, etat.exercice.id, { carte: etat.exercice.carte, reussi: r.ok });
            session.aEnregistrer(true, true);
          },
        })
      : null;

    // ----- Simulation -----

    function nouvelleSimulation() {
      touches.clear();
      verifierClavier();
      const { programme } = editeur.lire();
      etat.sim = A.creerSimulation(programme, { composants: etat.exercice.composants, boutonsVersMasse: etat.exercice.boutonsVersMasse, carte: etat.exercice.carte, capteurs: vue && vue.capteurs });
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note', ecran).textContent = '';
    }
    // En direct : le programme tourne au rythme de l'horloge dans l'ordinateur (noyau/direct.js), la carte obéit.
    async function lancerDirect() {
      if (etat.mode === 'direct') return;
      const connexion = A.connexionCarte();
      if (!connexion.carte) {
        $('.simu-note', ecran).textContent = 'Connecte d’abord la carte (au-dessus), puis clique sur « Lancer ».';
        return;
      }
      const ex = etat.exercice;
      if (vue && vue.capteurs && A.capteursDepart) Object.assign(vue.capteurs, A.capteursDepart(ex.carte));
      const direct = A.creerDirect(editeur.lire().programme, { composants: ex.composants, boutonsVersMasse: ex.boutonsVersMasse, carte: ex.carte, capteurs: vue && vue.capteurs });
      if (refuserProgramme(direct.sim)) return;
      etat.sim = direct.sim;
      touches.clear();
      verifierClavier();
      etat.servos = {};
      etat.rejeu = null;
      etat.mode = 'direct';
      $('.simu-note', ecran).textContent = '';
      majCommandes();
      const ok = await connexion.demarrerDirect(direct, { surErreur: () => etat.mode === 'direct' && arreter() });
      if (!ok && etat.mode === 'direct') arreter();
    }
    // Un programme qui ne peut pas tourner (trop de blocs « quand… », bloc inconnu) : on le dit au lieu de ne rien faire.
    function refuserProgramme(sim) {
      if (!sim || !sim.erreurs || !sim.erreurs.length) return false;
      $('.simu-note', ecran).textContent = 'Ton programme ne peut pas démarrer : ' + sim.erreurs[0];
      return true;
    }
    function lancer() {
      if (etat.modeTest === 'direct') return lancerDirect();
      if (etat.mode === 'pause') etat.mode = 'marche';
      else if (etat.mode === 'arrete') {
        nouvelleSimulation();
        if (refuserProgramme(etat.sim)) {
          etat.sim = null;
          return;
        }
        etat.mode = 'marche';
      }
      majCommandes();
    }
    function pause() {
      if (etat.mode === 'direct') return arreter(); // en direct, « Pause » arrête (la carte éteint tout)
      if (etat.mode === 'marche') etat.mode = 'pause';
      majCommandes();
    }
    function pasAPas() {
      if (etat.mode === 'arrete') nouvelleSimulation();
      etat.mode = 'pause';
      appliquerBoutonsAvant();
      etat.sim.pas();
      afficher();
      majCommandes();
    }
    function recommencer() {
      nouvelleSimulation();
      etat.mode = 'marche';
      majCommandes();
    }
    function arreter() {
      if (etat.mode === 'direct') A.connexionCarte().arreterDirect();
      etat.mode = 'arrete';
      etat.sim = null;
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note', ecran).textContent = '';
      majCommandes();
      afficher();
    }
    // ----- Clavier de l'ordinateur (blocs « quand la touche … », « la touche … est appuyée ») -----
    // Pendant que le programme tourne (simulateur ou « En direct »), les touches de son programme sont pour lui :
    // elles ne font plus défiler la page ni ne cliquent les boutons. Jamais dans un champ de texte, ni avec Ctrl / Alt.
    const touches = new Set();
    let clavierDuProgramme = false;
    function verifierClavier() {
      clavierDuProgramme = !!(etat.exercice && A.utiliseClavier && A.utiliseClavier(editeur.lire().programme));
    }
    function toucher(t, valeur) {
      if (valeur) touches.add(t);
      else touches.delete(t);
      if (etat.sim && !etat.rejeu) etat.sim.changerEntree(A.entreeTouche(t), valeur ? 1 : 0);
      afficherClavier();
    }
    function lacherTouches() {
      for (const t of [...touches]) toucher(t, false);
    }
    function afficherClavier() {
      const p = $('.simu-clavier', ecran);
      p.hidden = !clavierDuProgramme;
      if (p.hidden) return;
      const marche = etat.mode === 'marche' || etat.mode === 'direct';
      const noms = [...touches].map((t) => (A.TOUCHES.find((x) => x[1] === t) || [t])[0]);
      p.textContent = !marche
        ? 'Ton programme utilise le clavier : clique sur « Lancer », puis appuie sur ses touches.'
        : `Clavier de l’ordinateur : ${noms.length ? `touche${noms.length > 1 ? 's' : ''} appuyée${noms.length > 1 ? 's' : ''} : ${noms.join(', ')}` : 'aucune touche appuyée'}.`;
    }
    function ecouterClavier(e, valeur) {
      if (ecran.hidden || !clavierDuProgramme || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = A.toucheDuClavier(e.key);
      const cible = e.target;
      if (!t || (cible && cible.closest && cible.closest('input, textarea, select, [contenteditable="true"], dialog, .joystick-plateau'))) return;
      if (etat.mode !== 'marche' && etat.mode !== 'direct') return;
      e.preventDefault();
      e.stopPropagation();
      if (valeur && e.repeat) return;
      toucher(t, valeur);
    }
    // Phase de capture : avant l'éditeur de blocs (les flèches y déplaceraient le curseur).
    addEventListener('keydown', (e) => ecouterClavier(e, true), true);
    addEventListener('keyup', (e) => ecouterClavier(e, false), true);
    addEventListener('blur', lacherTouches);

    // Joystick du simulateur : le manche tiré à la souris (ou au doigt), 0 à 1023 sur chaque axe.
    function reglerJoystick(x, y) {
      if (etat.rejeu) return;
      const j = A.joystickDe(etat.exercice.composants);
      if (!j) return;
      if (etat.modeTest === 'direct') {
        $('.simu-note', ecran).textContent = 'En direct, bouge le vrai joystick : l’écran montre ce que lit la carte.';
        return;
      }
      if (!etat.sim) {
        etat.joystickAvant = { x, y };
        if (x !== 512 || y !== 512) $('.simu-note', ecran).textContent = 'Clique sur « Lancer » pour que ton programme réagisse au joystick.';
      } else {
        etat.sim.changerAnalogique(j.broche, x);
        etat.sim.changerAnalogique(j.y, y);
      }
      afficher();
    }
    function appliquerBoutonsAvant() {
      const j = A.joystickDe(etat.exercice && etat.exercice.composants);
      if (etat.joystickAvant && etat.sim && j) {
        etat.sim.changerAnalogique(j.broche, etat.joystickAvant.x);
        etat.sim.changerAnalogique(j.y, etat.joystickAvant.y);
        etat.joystickAvant = null;
      }
      if (!etat.boutonsAvant || !etat.sim) return;
      for (const [b, v] of Object.entries(etat.boutonsAvant)) etat.sim.changerEntree(b, v);
      etat.boutonsAvant = null;
    }
    // Bouton poussoir du simulateur : appuyé tant qu'on le tient. Programme arrêté : l'élève est invité à le lancer.
    function appuyerBouton(broche, valeur) {
      if (etat.rejeu) return;
      if (etat.modeTest === 'direct') {
        if (valeur) $('.simu-note', ecran).textContent = 'En direct, appuie sur le vrai bouton : l’écran montre ce que fait la carte.';
        return;
      }
      if (!etat.sim) {
        etat.boutonsAvant = etat.boutonsAvant || {};
        etat.boutonsAvant[broche] = valeur;
        if (valeur) $('.simu-note', ecran).textContent = 'Clique sur « Lancer » pour que ton programme réagisse au bouton.';
      } else etat.sim.changerEntree(broche, valeur);
      afficher();
    }
    function majCommandes() {
      const marche = etat.mode === 'marche' || etat.mode === 'direct';
      afficherClavier();
      const b = $('.btn-lancer', ecran);
      b.classList.toggle('actif', marche);
      b.setAttribute('aria-pressed', String(marche));
      $('.btn-pause', ecran).disabled = !marche;
      $('.btn-recommencer', ecran).disabled = etat.mode === 'arrete';
      for (const v of ecran.querySelectorAll('.btn-vitesse')) v.setAttribute('aria-pressed', String(Number(v.dataset.vitesse) === etat.vitesse));
    }
    $('.btn-lancer', ecran).addEventListener('click', lancer);
    $('.btn-pause', ecran).addEventListener('click', pause);
    $('.btn-pas', ecran).addEventListener('click', pasAPas);
    $('.btn-recommencer', ecran).addEventListener('click', recommencer);
    for (const v of ecran.querySelectorAll('.btn-vitesse')) {
      v.addEventListener('click', () => {
        etat.vitesse = Number(v.dataset.vitesse);
        majCommandes();
      });
    }

    const chrono = (ms) => {
      const s = Math.floor(ms / 1000);
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    };

    // Valeur affichée d'un composant (deux composants d'un exercice libre peuvent partager une broche).
    function etatComposant(c, sim) {
      if (c.type === 'joystick') {
        const av = etat.joystickAvant || { x: 512, y: 512 };
        const bouton = sim ? sim.entrees[c.bouton] || 0 : (etat.boutonsAvant && etat.boutonsAvant[c.bouton]) || 0;
        return sim ? `${sim.entrees[c.broche] ?? 512},${sim.entrees[c.y] ?? 512},${bouton}` : `${av.x},${av.y},${bouton}`;
      }
      if (c.type === 'bouton') return sim ? sim.entrees[c.broche] || 0 : (etat.boutonsAvant && etat.boutonsAvant[c.broche]) || 0;
      if (c.type === 'buzzer') {
        const note = sim && sim.journal.filter((e) => e.broche === c.broche && e.type === 'son').pop();
        return note && note.valeur && sim.t < note.t + note.duree ? note.valeur : 0;
      }
      if (c.type === 'servo') return etat.servos[c.broche] || 0;
      return sim ? sim.sorties[c.broche] || 0 : 0;
    }
    function afficher(dtVirtuel) {
      if (!vue) return;
      const sim = etat.sim;
      const etats = {};
      for (const c of etat.exercice.composants || []) {
        if (c.type === 'joystick') etats[c.broche] = etatComposant(c, sim);
        else if (c.type === 'bouton') etats[c.broche] = sim ? sim.entrees[c.broche] || 0 : (etat.boutonsAvant && etat.boutonsAvant[c.broche]) || 0;
        else if (c.type === 'led') etats[c.broche] = sim ? sim.sorties[c.broche] || 0 : 0;
        else if (c.type === 'buzzer') {
          const note = sim && sim.journal.filter((e) => e.broche === c.broche && e.type === 'son').pop();
          etats[c.broche] = note && note.valeur && sim.t < note.t + note.duree ? note.valeur : 0;
        } else {
          // Le bras du servo tourne à vitesse constante (180° en 0,3 s) vers sa consigne.
          const cible = sim ? sim.sorties[c.broche] || 0 : 0;
          const pos = etat.servos[c.broche] === undefined ? 0 : etat.servos[c.broche];
          const pasMax = (dtVirtuel || 0) * A.VITESSE_SERVO;
          etats[c.broche] = etat.servos[c.broche] = Math.abs(cible - pos) <= pasMax ? cible : pos + Math.sign(cible - pos) * pasMax;
          if (!sim) etats[c.broche] = etat.servos[c.broche] = 0;
        }
      }
      for (const c of etat.exercice.composants || []) etats[c.broche + '|' + c.type] = etatComposant(c, sim, dtVirtuel);
      vue.afficher(etats, !!sim, sim);
      editeur.surligner(sim ? sim.blocsEnCours : null);
      $('.chrono-valeur', ecran).textContent = chrono(sim ? sim.t : 0);
    }

    let dernier = performance.now();
    function image(maintenant) {
      const dt = Math.min(100, maintenant - dernier);
      dernier = maintenant;
      let dtVirtuel = 0;
      if (etat.mode === 'marche' && etat.sim && !ecran.hidden) {
        appliquerBoutonsAvant();
        dtVirtuel = dt * etat.vitesse;
        let cible = etat.sim.t + dtVirtuel;
        if (etat.rejeu && cible >= etat.rejeu.fin) {
          cible = etat.rejeu.fin;
          etat.mode = 'pause';
          $('.simu-note', ecran).textContent = 'Fin du test : regarde l’état des composants.';
          majCommandes();
        }
        etat.sim.avancerJusqua(cible);
        // Le journal ne sert pas à l'affichage : on évite qu'il grossisse sans fin.
        if (etat.sim.journal.length > 20000) etat.sim.journal.splice(0, 15000);
      }
      if (etat.mode === 'direct') afficher(dt);
      else if (etat.mode !== 'pause' || dtVirtuel) afficher(dtVirtuel);
      requestAnimationFrame(image);
    }
    requestAnimationFrame(image);

    // ----- Vérification et résultat (A5) -----

    const resultat = $('.resultat', ecran);
    const suivantDe = (ex) => exercices.slice(exercices.findIndex((x) => x.id === ex.id) + 1).find((x) => A.estDebloque(D, paquet, x.id, opts));

    function verifier() {
      fermerBulle();
      aides.fermer();
      const { programme, horsProgramme, incomplets } = editeur.lire();
      const ex = etat.exercice;
      const r = A.valider(ex, programme);
      const notes = [];
      if (horsProgramme.length) notes.push('Un bloc est resté seul, hors du programme : il ne s’exécute pas. Accroche-le dans « Au démarrage » ou « Répéter indéfiniment ».');
      if (incomplets.length) notes.push('Un bloc a une case vide : complète-la.');
      A.noterProgramme(D, ex.id, editeur.sauvegarder());
      A.noterVerification(D, ex, { reussi: r.reussi, message: r.message, programme });
      session.aEnregistrer(true, true);
      if (contexte.majBandeau) contexte.majBandeau(ex);
      resultat.className = 'resultat ' + (r.reussi ? 'reussi' : 'ecart');
      if (r.reussi) {
        const suivant = suivantDe(ex);
        resultat.innerHTML =
          `<div class="resultat-message">${A.icone('coche', { epaisseur: 2.8 })}<div><strong>Ton programme fait ce qu’on attend.</strong>` +
          (suivant ? `<span>L’exercice ${echapper(suivant.numero)} est ouvert.</span>` : '<span>Tu as fini le parcours. Bravo !</span>') +
          (session.handle || lecture ? '' : '<span class="resultat-note">Pense à enregistrer ton travail dans le dossier de ton équipe.</span>') +
          '</div></div><div class="resultat-actions">' +
          (suivant ? `<button type="button" class="btn-principal btn-suivant">Exercice suivant${A.icone('suivant', { epaisseur: 2.8 })}</button>` : '') +
          `<button type="button" class="btn-secondaire btn-rester">${suivant ? 'Rester sur cet exercice' : 'Fermer'}</button></div>`;
        if (suivant) $('.btn-suivant', resultat).addEventListener('click', () => ouvrir(suivant));
        // Actions propres au projet (ex. « Envoyer dans la carte Arduino » après l'exercice 13).
        const actions = (contexte.actionsReussite && contexte.actionsReussite(ex)) || [];
        for (const a of actions.slice().reverse()) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = a.principal ? 'btn-principal' : 'btn-secondaire';
          b.textContent = a.texte;
          b.addEventListener('click', a.action);
          $('.resultat-actions', resultat).prepend(b);
        }
        $('.btn-rester', resultat).addEventListener('click', fermerResultat);
      } else {
        resultat.innerHTML =
          `<div class="resultat-message">${A.icone('info', { epaisseur: 2.4 })}<div><span>${echapper(r.message)}</span>` +
          notes.map((n) => `<span class="resultat-note">${echapper(n)}</span>`).join('') +
          '</div></div><div class="resultat-actions">' +
          `<button type="button" class="btn-secondaire btn-voir-test">${A.icone('oeil')}Voir le test</button></div>`;
        $('.btn-voir-test', resultat).addEventListener('click', () => rejouer(r));
      }
      resultat.hidden = false;
      resultat.scrollIntoView({ block: 'nearest' });
    }
    function montrerRevoir() {
      resultat.className = 'resultat ecart';
      resultat.innerHTML = `<div class="resultat-message">${A.icone('alerte', { epaisseur: 2.4 })}<div><span>Cet exercice a été modifié par ton professeur. Tes blocs sont gardés : relance la vérification.</span></div></div>`;
      resultat.hidden = false;
    }

    // Rejoue le test raté dans le simulateur : les boutons s'appuient tout seuls.
    function rejouer(r) {
      fermerResultat();
      // Les capteurs repartent des valeurs du test (celles de départ), pas de celles réglées à la main.
      if (vue && vue.capteurs && A.capteursDepart) Object.assign(vue.capteurs, A.capteursDepart(etat.exercice.carte));
      nouvelleSimulation();
      etat.boutonsAvant = null;
      for (const e of r.entrees) if (e.capteur !== undefined) etat.sim.planifierCapteur(e.t, e.capteur, e.valeur);
        else etat.sim.planifierEntree(e.t, e.broche, e.valeur);
      etat.rejeu = { fin: r.temps + 600 };
      etat.mode = 'marche';
      $('.simu-note', ecran).textContent = r.entrees.some((e) => e.capteur !== undefined) ? 'Le test se rejoue : les boutons et les capteurs changent tout seuls.' : 'Le test se rejoue : les boutons s’appuient tout seuls.';
      majCommandes();
    }
    function fermerResultat() {
      resultat.hidden = true;
    }
    // Exercice libre : l'équipe a terminé. Pas de correction : le programme est gardé, le professeur le regardera.
    function terminer() {
      fermerBulle();
      aides.fermer();
      const { programme } = editeur.lire();
      const ex = etat.exercice;
      A.noterProgramme(D, ex.id, editeur.sauvegarder());
      A.noterTermine(D, ex, programme);
      session.aEnregistrer(true, true);
      if (contexte.majBandeau) contexte.majBandeau(ex);
      const suivant = suivantDe(ex);
      resultat.className = 'resultat reussi';
      resultat.innerHTML =
        `<div class="resultat-message">${A.icone('coche', { epaisseur: 2.8 })}<div><strong>Ton programme est enregistré.</strong>` +
        '<span>C’est un exercice libre : ton professeur regardera ce que tu as inventé. Tu peux encore le modifier.</span>' +
        (suivant ? `<span>L’exercice ${echapper(suivant.numero)} est ouvert.</span>` : '') +
        (session.handle || lecture ? '' : '<span class="resultat-note">Pense à enregistrer ton travail dans le dossier de ton équipe.</span>') +
        '</div></div><div class="resultat-actions">' +
        (suivant ? `<button type="button" class="btn-principal btn-suivant">Exercice suivant${A.icone('suivant', { epaisseur: 2.8 })}</button>` : '') +
        `<button type="button" class="btn-secondaire btn-rester">${suivant ? 'Rester sur cet exercice' : 'Fermer'}</button></div>`;
      if (suivant) $('.btn-suivant', resultat).addEventListener('click', () => ouvrir(suivant));
      $('.btn-rester', resultat).addEventListener('click', fermerResultat);
      resultat.hidden = false;
      resultat.scrollIntoView({ block: 'nearest' });
    }
    $('.btn-verifier:not(.btn-terminer)', ecran).addEventListener('click', verifier);
    $('.btn-terminer', ecran).addEventListener('click', terminer);

    // Mode enseignant : remplacer le programme par la solution de référence (démonstration en classe).
    const btnSolution = $('.btn-solution', ecran);
    btnSolution.hidden = !contexte.solution;
    btnSolution.addEventListener('click', () => {
      if (!etat.exercice || !confirm('Remplacer le programme affiché par la solution de référence ?')) return;
      arreter();
      editeur.charger(etat.exercice, A.versBlockly(etat.exercice.solutionReference));
      majCode();
    });

    // ----- Outils de l'espace de travail -----

    $('.btn-annuler', ecran).addEventListener('click', editeur.annuler);
    $('.btn-retablir', ecran).addEventListener('click', editeur.retablir);
    $('.btn-zoom-moins', ecran).addEventListener('click', () => editeur.zoomer(-1));
    $('.btn-zoom-plus', ecran).addEventListener('click', () => editeur.zoomer(1));
    $('.btn-recentrer', ecran).addEventListener('click', editeur.recentrer);
    // Le bouton ne prend pas la main au clic : le bloc choisi le reste (sinon Blockly le « déchoisit »).
    $('.btn-commentaire', ecran).addEventListener('mousedown', (e) => e.preventDefault());
    $('.btn-commentaire', ecran).addEventListener('click', editeur.commenter);

    // ----- Enregistrement -----

    let minuteurSecours = null;
    function programmeModifie() {
      verifierClavier();
      afficherClavier();
      clearTimeout(minuteurSecours);
      minuteurSecours = setTimeout(() => session.aEnregistrer(false), 800);
    }
    // Avant chaque écriture, le programme affiché est rangé dans les données de l'équipe.
    session.surAvantEcriture(() => {
      if (etat.exercice && !ecran.hidden) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
    });
    // Temps passé : seulement l'activité réelle (onglet visible et actif).
    setInterval(() => {
      if (etat.exercice && !ecran.hidden && document.visibilityState === 'visible' && document.hasFocus()) A.ajouterTemps(D, etat.exercice.id, 1);
    }, 1000);

    function quitter() {
      if (etat.exercice) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      arreter();
      aides.fermer();
    }

    // Fermer l'onglet en direct : la carte éteint tout (sinon, au plus tard 3 s après, faute de signe de vie).
    addEventListener('pagehide', () => {
      if (etat.mode === 'direct') A.connexionCarte().arreterDirect();
    });

    choisirNiveau(1);
    majCommandes();
    return { ouvrir, quitter, editeur, etat, arreter, choisirModeTest };
  }

  Object.assign(A, { creerEcranExercice });
})(this);

// ===== interface/app.js =====
// Démarrage de Labo Blocs côté élève : projet (site/projet.js), parcours (parcours/<id>/parcours.js), accueil,
// puis parcours et exercices. ?enseignant=1 : tout est ouvert et rien n'est enregistré (démonstration en classe).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  global.definirProjet = (p) => (A.projet = p);

  // Taille de l'interface : ×1 jusqu'à 1536×864, puis jusqu'à ×1,25 en 1920×1080 (vidéoprojecteur : ×1,4).
  function ajusterEchelle() {
    const projecteur = document.body.classList.contains('projecteur');
    const s = Math.min(projecteur ? 1.4 : 1.25, Math.max(projecteur ? 1.2 : 1, Math.min(innerWidth / 1536, innerHeight / 864)));
    document.documentElement.style.setProperty('--s', String(s));
    document.documentElement.style.fontSize = 16 * s + 'px';
  }

  // Icônes déclarées dans le HTML par data-icone.
  function poserIcones(racine) {
    for (const el of racine.querySelectorAll('[data-icone]')) {
      el.outerHTML = el.dataset.icone === 'lecture' ? A.LECTURE : A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });
    }
  }

  // Plein écran du navigateur : plus de place pour le programme (Échap ou le même bouton pour en sortir).
  function preparerPleinEcran(racine) {
    const bouton = $('.btn-plein-ecran', racine);
    if (!bouton || !document.fullscreenEnabled) return;
    bouton.hidden = false;
    const maj = () => {
      const actif = !!document.fullscreenElement;
      bouton.querySelector('.icone').outerHTML = A.icone(actif ? 'quitterPleinEcran' : 'pleinEcran', { epaisseur: 2.4 });
      $('.texte-plein-ecran', bouton).textContent = actif ? 'Quitter le plein écran' : 'Plein écran';
      bouton.title = actif ? 'Revenir à la fenêtre normale (touche Échap)' : 'Afficher la page sur tout l’écran';
    };
    bouton.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else
        document.documentElement.requestFullscreen().catch(() => {
          const t = $('.message-bref');
          if (!t) return;
          t.textContent = 'Le plein écran n’est pas possible sur ce poste : appuie sur la touche F11.';
          t.hidden = false;
          setTimeout(() => (t.hidden = true), 5000);
        });
    });
    document.addEventListener('fullscreenchange', maj);
    maj();
  }

  // Avancement dans le bandeau : « Exercice 4 sur 14 » et un segment par exercice (réussi, en cours, à faire).
  function majAvancement(bandeau, D, paquet, ex, options) {
    const liste = paquet.exercices;
    const rang = liste.indexOf(ex);
    $('.avancement-texte', bandeau).textContent = `Exercice ${rang + 1} sur ${liste.length}`;
    const a = A.avancement(D, paquet);
    const segments = $('.segments', bandeau);
    segments.setAttribute('aria-label', `Progression : ${a.reussis} exercices réussis sur ${a.total}`);
    segments.innerHTML = liste
      .map((e, i) => `<span class="segment segment-${A.etat(D, paquet, e.id, options)}${i === rang ? ' segment-courant' : ''}"></span>`)
      .join('');
  }

  function erreurFatale(texte) {
    document.body.innerHTML = `<main class="erreur-fatale"><h1>Labo Blocs ne peut pas démarrer</h1><p>${echapper(texte)}</p><p>Demande à ton professeur.</p></main>`;
  }

  function demarrerApplication() {
    const q = new URLSearchParams(location.search);
    if (q.has('projecteur')) document.body.classList.add('projecteur');
    ajusterEchelle();
    addEventListener('resize', ajusterEchelle);
    A.poserGabarits(document);
    poserIcones(document);
    preparerPleinEcran(document);

    if (!A.projet) return erreurFatale('Le fichier du projet (projet.js) est absent.');
    // ?parcours=<id> : un autre parcours chargé par la page (essais des cartes mBot et micro:bit), comme un projet à part.
    const autre = q.get('parcours') && q.get('parcours') !== A.projet.parcours ? A.parcoursDefinis.find((p) => p.id === q.get('parcours')) : null;
    // Un autre parcours du site : ses classes (tous les niveaux) et son dossier (nom du parcours) dans le dossier de la classe.
    if (autre) {
      const dossier = autre.titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
      A.projet = Object.assign({}, A.projet, { id: autre.id, titre: autre.titre, parcours: autre.id, accent: '#2547D0', niveaux: null, classes: null, cheminSauvegarde: null, cheminProjet: [dossier] });
    }
    const brut = A.parcoursDefinis.find((p) => p.id === A.projet.parcours);
    if (!brut) return erreurFatale(`Le parcours « ${A.projet.parcours} » est introuvable.`);
    // Classes et dossier de l'équipe : réglages du collège (liste commune), sauf s'ils sont réglés dans le parcours
    // (éditeur › Réglages, sur le site de Labo Blocs) ; un projet qui garde ses propres réglages
    // (reglagesDuProjetPrioritaires) les garde. Recalculé quand la version en ligne des réglages du collège arrive.
    const base = A.projet;
    const calculer = () => {
      let p = A.projetAvecCollege ? A.projetAvecCollege(base) : base;
      if (!base.reglagesDuProjetPrioritaires) {
        const r = {};
        if (brut.classes && brut.classes.length) r.classes = brut.classes.slice();
        if (brut.cheminSauvegarde && brut.cheminSauvegarde.includes('{equipe}')) r.cheminSauvegarde = brut.cheminSauvegarde.slice();
        p = Object.assign({}, p, r);
      }
      if (!p.cheminSauvegarde) p = Object.assign({}, p, { cheminSauvegarde: ['{classe}', '{equipe}'] });
      return p;
    };
    A.projet = calculer();
    document.addEventListener(A.EVENEMENT_COLLEGE || 'labo-blocs:college', () => {
      A.projet = Object.assign({}, A.projet, { classes: calculer().classes, cheminSauvegarde: calculer().cheminSauvegarde });
      if (A.surCollege) A.surCollege();
    });
    const projet = A.projet;
    const problemes = A.controler(brut);
    if (problemes.length) return erreurFatale(problemes.join(' '));
    const paquet = A.preparer(brut);

    document.documentElement.style.setProperty('--accent', projet.accent || '#2547D0');
    // Page d'un projet (npm run nouveau-projet) : les couleurs de Labo Blocs sont posées sur body.labo-blocs.
    if (document.body.classList.contains('labo-blocs')) document.body.style.setProperty('--accent', projet.accent || '#2547D0');
    for (const el of document.querySelectorAll('.bandeau .logo')) el.src = projet.logo || 'img/logo.svg';
    for (const el of document.querySelectorAll('.titre-projet')) el.textContent = projet.titre;
    document.title = `${projet.titre} — Labo Blocs`;

    if (q.has('enseignant')) {
      const donnees = A.creerSauvegarde({ eleves: ['Mode enseignant'], classe: '' }, { parcours: paquet, projet: projet.id });
      A.relierParcours(donnees, paquet);
      return lancer(A.creerSession({ donnees, lecture: true }), paquet, { toutDebloquer: true, exercice: q.get('exercice') });
    }
    A.demarrerAccueil((r) => {
      const changes = A.relierParcours(r.donnees, paquet);
      const session = A.creerSession(r);
      lancer(session, paquet, {});
      if (changes.length) session.message(`Ton professeur a modifié ${changes.length > 1 ? changes.length + ' exercices' : 'un exercice'}. Tes blocs sont gardés : relance la vérification.`, 6000);
    }, paquet);
  }

  function lancer(session, paquet, options) {
    const D = session.donnees;
    const bandeau = $('.bandeau');
    if (!session.lecture) for (const el of bandeau.querySelectorAll('.etat-enregistrement, .btn-enregistrer')) el.hidden = false;
    $('.equipe-texte', bandeau).textContent = 'Équipe ' + D.equipe.eleves.join(' · ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');
    if (session.lecture) $('.equipe-texte', bandeau).textContent = 'Mode enseignant · rien n’est enregistré';

    const ecrans = { parcours: $('.ecran-parcours'), exercice: $('.ecran-exercice') };
    function montrer(nom) {
      for (const [k, el] of Object.entries(ecrans)) el.hidden = k !== nom;
      $('.btn-vers-parcours', bandeau).hidden = nom !== 'exercice';
      $('.bandeau-avancement', bandeau).hidden = nom !== 'exercice';
    }

    const majBandeau = (ex) => majAvancement(bandeau, D, paquet, ex, options);

    const ecranExercice = A.creerEcranExercice({ session, paquet, toutDebloquer: options.toutDebloquer, solution: session.lecture, majBandeau });
    const ecranParcours = A.creerEcranParcours({
      session,
      paquet,
      toutDebloquer: options.toutDebloquer,
      ouvrirExercice(id) {
        const ex = paquet.exercices.find((e) => e.id === id);
        montrer('exercice');
        if (!ecranExercice.ouvrir(ex)) montrer('parcours');
      },
    });
    function versParcours() {
      ecranExercice.quitter();
      ecranParcours.dessiner();
      montrer('parcours');
      document.title = `${A.projet.titre} — Labo Blocs`;
    }
    $('.btn-vers-parcours', bandeau).addEventListener('click', versParcours);

    ecranParcours.dessiner();
    if (options.exercice && paquet.exercices.some((e) => e.id === options.exercice)) {
      montrer('exercice');
      ecranExercice.ouvrir(paquet.exercices.find((e) => e.id === options.exercice));
    } else montrer('parcours');
    A.app = { session, paquet, ecranExercice, ecranParcours, versParcours };
  }

  // Site de Labo Blocs : charge tous les parcours de la liste (dossier/index.js, puis dossier/<id>/parcours.js), sans
  // avoir à écrire chaque parcours dans la page. En file:// comme en ligne (scripts classiques).
  function chargerParcoursDuSite(dossier) {
    const charger = (src) =>
      new Promise((ok) => {
        const s = document.createElement('script');
        s.src = src + '?t=' + Date.now(); // un parcours déposé ou republié apparaît tout de suite
        s.onload = ok;
        s.onerror = ok;
        document.body.append(s);
      });
    let ids = [];
    global.definirIndexParcours = (liste) => (ids = liste);
    return charger(dossier + 'index.js')
      .then(() => Promise.all(ids.map((id) => charger(`${dossier}${encodeURIComponent(id)}/parcours.js`))))
      .then(() => {
        // Ordre de la liste, quel que soit l'ordre de chargement.
        A.parcoursDefinis.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        return ids;
      });
  }

  Object.assign(A, { chargerParcoursDuSite, demarrerApplication, ajusterEchelle, poserIcones, preparerPleinEcran, majAvancement });
})(this);

// ===== interface/integration.js =====
// Labo Blocs dans un projet (distributeur de céréales…) : le projet garde ses pages (accueil, carnet, outil du
// professeur) et sa session d'équipe ; l'écran d'exercice est celui de Labo Blocs, posé dans un élément de sa page.
//
//   const ecran = LaboBlocs.monterExercice(element, {
//     session,                 // donnees (avec la rubrique « programmation »), lecture, aEnregistrer, enregistrer…
//     paquet,                  // parcours préparé (LaboBlocs.preparer)
//     projet: { id, titre, accent, logo },
//     media: 'vendor/labo-blocs/blockly/media/',   // images de Blockly, relatives à la page
//     retour: { texte: 'Carnet', action() {} },   // bouton en haut à gauche
//     toutDebloquer, solution, // mode enseignant
//     listeExercices,          // sans « retour » : le bouton « Exercices » ouvre la liste des exercices (mode enseignant)
//     actionsReussite(exercice) → [{ texte, principal, action }],
//   });
//   ecran.ouvrir(id, programme)  ·  ecran.quitter()
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function monterExercice(hote, options) {
    const o = options || {};
    const { session, paquet } = o;
    const D = session.donnees;
    A.projet = Object.assign({}, A.projet, o.projet);
    if (o.media) A.mediaBlockly = o.media;

    hote.classList.add('labo-blocs', 'labo-blocs-page');
    hote.innerHTML = A.GABARITS.bandeau + A.GABARITS.exercice;
    A.poserIcones(hote);
    if (A.projet.accent) hote.style.setProperty('--accent', A.projet.accent);
    const bandeau = $('.bandeau', hote);
    const logo = $('.logo', bandeau);
    if (A.projet.logo) logo.src = A.projet.logo;
    else logo.remove();
    $('.titre-projet', bandeau).textContent = A.projet.titre || '';
    $('.equipe-texte', bandeau).textContent = session.lecture
      ? 'Mode enseignant · rien n’est enregistré'
      : 'Équipe ' + D.equipe.eleves.join(' · ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');
    $('.bandeau-avancement', bandeau).hidden = false;
    $('.ecran-exercice', hote).hidden = false;

    const retour = $('.btn-vers-parcours', bandeau);
    if (o.retour) {
      retour.hidden = false;
      retour.lastChild.textContent = o.retour.texte || 'Retour';
      retour.addEventListener('click', () => {
        ecran.quitter();
        o.retour.action();
      });
    }
    if (!o.retour && o.listeExercices) {
      retour.hidden = false;
      retour.lastChild.textContent = 'Exercices';
      const liste = document.createElement('dialog');
      liste.className = 'dialogue-liste';
      liste.setAttribute('aria-label', 'Choisir un exercice');
      hote.append(liste);
      retour.addEventListener('click', () => {
        liste.innerHTML =
          '<div class="dialogue-entete"><strong>Choisir un exercice</strong><button type="button" class="btn-fermer-liste" aria-label="Fermer">×</button></div><div class="liste-exercices">' +
          paquet.exercices
            .map((e) => `<button type="button" data-id="${e.id}"><span class="liste-numero">${e.numero}</span><span>${echapper(e.titre)}</span></button>`)
            .join('') +
          '</div>';
        liste.showModal();
      });
      liste.addEventListener('click', (e) => {
        if (e.target.closest('.btn-fermer-liste')) return liste.close();
        const b = e.target.closest('button[data-id]');
        if (!b) return;
        liste.close();
        ecran.quitter();
        ecran.ouvrir(paquet.exercices.find((x) => x.id === b.dataset.id));
      });
    }
    if (!session.lecture) {
      for (const el of bandeau.querySelectorAll('.etat-enregistrement, .btn-enregistrer')) el.hidden = false;
      $('.btn-enregistrer', bandeau).addEventListener('click', () => session.enregistrer('bouton'));
      if (session.majEtat) session.majEtat();
    }
    A.preparerPleinEcran(bandeau);

    const opts = { toutDebloquer: !!o.toutDebloquer };
    const ecran = A.creerEcranExercice({
      session,
      paquet,
      toutDebloquer: opts.toutDebloquer,
      solution: !!o.solution,
      actionsReussite: o.actionsReussite,
      majBandeau: (ex) => A.majAvancement(bandeau, D, paquet, ex, opts),
    });

    return {
      // Ouvre l'exercice demandé s'il est ouvert, sinon celui où l'équipe en est.
      ouvrir(id, programme) {
        const parId = (x) => paquet.exercices.find((e) => e.id === x);
        let ex = id && parId(id);
        if (!ex || !A.estDebloque(D, paquet, ex.id, opts)) ex = parId(A.exerciceAReprendre(D, paquet, opts)) || paquet.exercices[0];
        ecran.ouvrir(ex, programme);
        return ex;
      },
      quitter: ecran.quitter,
      // 'simulateur' | 'carte' (si le parcours propose ce mode)
      choisirModeTest: ecran.choisirModeTest,
      ecran,
    };
  }

  A.monterExercice = monterExercice;
})(this);

// ===== interface/professeur.js =====
// Outil du professeur de Labo Blocs (jalon 5, site/prof.html) : suivre une classe (maquette B10), fiche d'une
// équipe (B11) avec le programme de chaque exercice rejouable dans le simulateur, niveaux par compétence (forcés si
// besoin), commentaire, exports (CSV, et fichier de résultats pour le Carnet de classe).
// Les fichiers des élèves ne sont jamais modifiés : les réglages du professeur vont dans labo-blocs-professeur.json,
// dans le dossier de la classe (ou dans le navigateur quand les fichiers sont importés un par un).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const $$ = (sel, racine) => [...(racine || document).querySelectorAll(sel)];
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nombreFr = (x, d) => (x === null || x === undefined ? '—' : String(Math.round(x * Math.pow(10, d || 1)) / Math.pow(10, d || 1)).replace('.', ','));
  const SYMBOLES = { reussi: '✓', en_cours: '▶', a_reverifier: '!', a_faire: '·', verrouille: '' };
  const MOTS = { reussi: 'réussi', en_cours: 'en cours', a_reverifier: 'modifié, à revérifier', a_faire: 'à faire', verrouille: 'pas encore ouvert' };
  const CLE_LOCALE = 'labo-blocs-professeur';

  const etat = {
    dossier: null,
    fichiersDossier: [],
    fichiersImportes: [],
    equipes: [],
    refuses: [],
    prof: A.professeurVide(),
    vue: 'accueil',
    equipe: null,
    derniereLecture: null,
    lecteurs: new Map(),
  };
  let paquets = [];

  function message(texte, duree) {
    const m = $('.message-bref');
    m.textContent = texte;
    m.hidden = false;
    clearTimeout(message.t);
    message.t = setTimeout(() => (m.hidden = true), duree || 3000);
  }

  // ---------- Dossier mémorisé (pour « Reprendre ») ----------
  function base() {
    return new Promise((ok, ko) => {
      const r = indexedDB.open('labo-blocs-professeur', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('dossiers');
      r.onsuccess = () => ok(r.result);
      r.onerror = () => ko(r.error);
    });
  }
  async function memoriser(handle) {
    try {
      const db = await base();
      db.transaction('dossiers', 'readwrite').objectStore('dossiers').put(handle, 'classe');
    } catch {
      // pas de mémoire : on redemandera le dossier
    }
  }
  async function memorise() {
    try {
      const db = await base();
      return await new Promise((ok) => {
        const r = db.transaction('dossiers').objectStore('dossiers').get('classe');
        r.onsuccess = () => ok(r.result || null);
        r.onerror = () => ok(null);
      });
    } catch {
      return null;
    }
  }

  // ---------- Lecture des fichiers ----------
  const cache = new Map();
  async function lireDossier(dossier, chemin, profondeur) {
    const sortie = [];
    for await (const entree of dossier.values()) {
      if (entree.kind === 'file' && /\.json$/i.test(entree.name)) {
        const nom = chemin + entree.name;
        let f;
        try {
          f = await entree.getFile();
        } catch {
          continue; // fichier en cours d'écriture par une équipe : relu au prochain passage
        }
        const connu = cache.get(nom);
        if (connu && connu.date === f.lastModified && connu.taille === f.size) sortie.push({ nom, texte: connu.texte });
        else {
          const texte = await f.text();
          cache.set(nom, { date: f.lastModified, taille: f.size, texte });
          sortie.push({ nom, texte });
        }
      } else if (entree.kind === 'directory' && profondeur < 4) {
        sortie.push(...(await lireDossier(entree, chemin + entree.name + ' › ', profondeur + 1)));
      }
    }
    return sortie;
  }
  async function lireFichiers(liste) {
    const sortie = [];
    for (const f of liste) if (/\.json$/i.test(f.name)) sortie.push({ nom: f.name, texte: await f.text() });
    return sortie;
  }

  // ---------- Réglages du professeur ----------
  async function lireReglages() {
    if (etat.dossier) {
      try {
        const f = await (await etat.dossier.getFileHandle(A.NOM_FICHIER_PROFESSEUR)).getFile();
        etat.prof = A.lireProfesseur(await f.text());
        return;
      } catch {
        etat.prof = A.professeurVide();
        return;
      }
    }
    try {
      etat.prof = A.lireProfesseur(localStorage.getItem(CLE_LOCALE) || '');
    } catch {
      etat.prof = A.professeurVide();
    }
  }
  let minuteurReglages = null;
  function reglagesModifies() {
    $('.pr-etat').textContent = 'Réglages modifiés…';
    clearTimeout(minuteurReglages);
    minuteurReglages = setTimeout(ecrireReglages, 600);
  }
  async function ecrireReglages() {
    const texte = JSON.stringify(etat.prof, null, 2) + '\n';
    if (etat.dossier) {
      try {
        if ((await etat.dossier.requestPermission({ mode: 'readwrite' })) !== 'granted') throw new Error('refus');
        const h = await etat.dossier.getFileHandle(A.NOM_FICHIER_PROFESSEUR, { create: true });
        const w = await h.createWritable();
        await w.write(texte);
        await w.close();
        $('.pr-etat').textContent = 'Réglages enregistrés dans le dossier de la classe';
        return;
      } catch {
        $('.pr-etat').textContent = 'Réglages gardés dans ce navigateur (le dossier n’a pas pu être écrit)';
      }
    }
    try {
      localStorage.setItem(CLE_LOCALE, texte);
      if (!etat.dossier) $('.pr-etat').textContent = 'Réglages gardés dans ce navigateur';
    } catch {
      $('.pr-etat').textContent = 'Réglages non enregistrés';
    }
  }

  // ---------- Classe ----------
  function recalculer() {
    const r = A.chargerEquipes([...etat.fichiersDossier, ...etat.fichiersImportes], paquets);
    etat.equipes = r.equipes;
    etat.refuses = r.refuses;
    if (etat.vue === 'fiche' && !etat.equipes.some((e) => e.cle === etat.equipe)) etat.vue = 'classe';
    dessiner();
  }

  async function actualiser() {
    if (!etat.dossier) return recalculer();
    try {
      etat.fichiersDossier = await lireDossier(etat.dossier, etat.dossier.name + ' › ', 0);
      etat.derniereLecture = new Date();
    } catch {
      message('Le dossier n’a pas pu être relu (réseau ?). Nouvel essai dans 30 secondes.', 5000);
    }
    recalculer();
  }

  async function ouvrirDossier(handle) {
    try {
      if ((await handle.queryPermission({ mode: 'read' })) !== 'granted' && (await handle.requestPermission({ mode: 'read' })) !== 'granted') throw new Error('refus');
    } catch {
      return erreurAccueil('Le dossier n’est pas accessible. Choisis-le à nouveau.');
    }
    etat.dossier = handle;
    etat.fichiersImportes = [];
    cache.clear();
    await memoriser(handle);
    await lireReglages();
    etat.vue = 'classe';
    await actualiser();
    clearInterval(actualiser.minuteur);
    actualiser.minuteur = setInterval(() => document.visibilityState === 'visible' && actualiser(), 30000);
  }

  async function importer(fichiers) {
    if (!fichiers.length) return;
    if (!etat.dossier && !etat.fichiersImportes.length) await lireReglages();
    // Le même fichier importé deux fois remplace le premier.
    const noms = new Set(fichiers.map((f) => f.nom));
    etat.fichiersImportes = etat.fichiersImportes.filter((f) => !noms.has(f.nom)).concat(fichiers);
    etat.vue = etat.vue === 'accueil' ? 'classe' : etat.vue;
    recalculer();
    if (!etat.equipes.length) {
      etat.vue = 'accueil';
      dessiner();
      erreurAccueil(etat.refuses.length ? `Aucune sauvegarde d’équipe dans ces fichiers (${etat.refuses[0].raison})` : 'Aucune sauvegarde d’équipe dans ces fichiers.');
    }
  }

  function erreurAccueil(texte) {
    const e = $('.pr-erreur');
    e.textContent = texte;
    e.hidden = !texte;
  }

  // ---------- Dessin ----------
  function dessiner() {
    $('.pr-accueil').hidden = etat.vue !== 'accueil';
    $('.pr-classe').hidden = etat.vue !== 'classe';
    $('.pr-fiche').hidden = etat.vue !== 'fiche';
    $('.pr-btn-changer').hidden = etat.vue === 'accueil';
    if (etat.vue === 'classe') dessinerClasse();
    if (etat.vue === 'fiche') dessinerFiche();
  }

  const reglagesDe = (e) => A.reglagesEquipe(etat.prof, e.cle);
  const resumer = (e) => A.resumerEquipe(e, { forces: reglagesDe(e).forces, bareme: { objectif: etat.prof.objectif } });
  const nomEquipe = (e) => e.eleves.join(' · ');

  function paquetPrincipal() {
    const p = etat.equipes[0] && etat.equipes[0].paquet;
    return p || paquets.find((x) => x.id === (A.projet && A.projet.parcours)) || paquets[0];
  }

  function dessinerClasse() {
    const paquet = paquetPrincipal();
    const classes = [...new Set(etat.equipes.map((e) => e.classe).filter(Boolean))];
    $('.pr-titre-classe').textContent = classes.length ? `Classe ${classes.join(', ')}` : 'Classe';
    const lu = etat.derniereLecture ? ` · lu à ${etat.derniereLecture.getHours()} h ${String(etat.derniereLecture.getMinutes()).padStart(2, '0')}` : '';
    $('.pr-chemin').textContent = (etat.dossier ? etat.dossier.name : 'Fichiers importés') + ` · ${paquet.titre}` + lu;
    // Exercices attendus
    const choix = $('.pr-choix-objectif');
    choix.innerHTML =
      `<option value="">Tous (${paquet.exercices.length})</option>` +
      paquet.exercices.map((e, i) => `<option value="${i + 1}"${etat.prof.objectif === i + 1 ? ' selected' : ''}>Jusqu’à l’exercice ${echapper(e.numero)}</option>`).join('');
    const resumes = etat.equipes.map((e) => ({ e, r: resumer(e) }));
    const c = A.resumerClasse(resumes.map((x) => x.r));
    const tuile = (n, texte, attention) => `<div class="pr-chiffre${attention && n ? ' pr-attention' : ''}"><b>${n}</b><span>${texte}</span></div>`;
    $('.pr-chiffres').innerHTML =
      tuile(c.equipes, c.equipes > 1 ? 'équipes' : 'équipe') +
      tuile(c.bloquees, 'bloquée(s) depuis plus de 10 min', true) +
      tuile(c.envoisAujourdhui, 'envoi(s) dans la carte aujourd’hui') +
      tuile(c.aReverifier, 'exercice(s) modifié(s), à revérifier', true);
    const refus = $('.pr-refuses');
    refus.hidden = !etat.refuses.length;
    refus.textContent = etat.refuses.length ? `${etat.refuses.length} fichier(s) ignoré(s) : ${etat.refuses.map((r) => `${r.nom} (${r.raison})`).join(' ; ')}` : '';
    const codes = resumes.length ? resumes[0].r.evaluation.competences.map((x) => x.code) : [];
    let h =
      '<thead><tr><th scope="col">Équipe</th>' +
      `<th scope="col">Exercices ${echapper(paquet.exercices[0].numero)} à ${echapper(paquet.exercices[paquet.exercices.length - 1].numero)}</th>` +
      '<th scope="col">Indices</th><th scope="col">Dernier envoi carte</th><th scope="col">Activité</th>' +
      codes.map((k) => `<th scope="col" title="${echapper(A.COMPETENCES.find((x) => x.code === k).libelle)}">${k}</th>`).join('') +
      '<th scope="col">Note /20</th><th scope="col">État</th></tr></thead><tbody>';
    for (const { e, r } of resumes) {
      const cellules = r.cellules
        .map((x) => `<span class="pr-cel pr-${x.etat}" title="Exercice ${echapper(x.numero)} : ${MOTS[x.etat]}">${SYMBOLES[x.etat]}</span>`)
        .join('');
      h +=
        `<tr data-cle="${echapper(e.cle)}"><th scope="row"><button type="button" class="pr-lien-equipe" data-cle="${echapper(e.cle)}">${echapper(nomEquipe(e))}</button>` +
        `<span class="pr-sous">${e.classe ? echapper(e.classe) + ' · ' : ''}${r.reussis} réussi(s) sur ${r.total}${r.defisReussis ? ' + défi' : ''}</span></th>` +
        `<td><span class="pr-cellules" role="img" aria-label="${r.reussis} exercices réussis sur ${r.total}${r.enCours ? ', exercice ' + echapper(r.enCours) + ' en cours' : ''}">${cellules}</span></td>` +
        `<td class="pr-nombre">${r.indices}</td>` +
        `<td>${r.dernierEnvoi ? `${echapper(r.dernierEnvoi.numero)} · ${A.ilYa(r.dernierEnvoi.date)}` : 'Aucun envoi'}</td>` +
        `<td>${A.ilYa(r.derniereActivite)}</td>` +
        r.evaluation.competences.map((k) => `<td>${k.niveau ? `<span class="pr-niveau pr-niveau-${k.niveau}" title="${A.nomNiveau(k.niveau)}${k.force ? ' (forcé)' : ''}">${k.niveau}${k.force ? '*' : ''}</span>` : '—'}</td>`).join('') +
        `<td class="pr-nombre">${nombreFr(r.evaluation.note)}</td>` +
        `<td><span class="pr-etat-equipe pr-etat-${r.etat.cle}">${r.etat.cle === 'bloquee' ? '⚠ ' : ''}${echapper(r.etat.texte)}</span></td></tr>`;
    }
    $('.pr-tableau').innerHTML = h + '</tbody>';
  }

  function dessinerFiche() {
    const e = etat.equipes.find((x) => x.cle === etat.equipe);
    const r = resumer(e);
    const reg = reglagesDe(e);
    const ex = e.donnees.programmation.exercices;
    const options = (k) =>
      `<option value="">Calculé${k.calcule ? ` : ${k.calcule} · ${A.nomNiveau(k.calcule)}` : ' : pas évalué'}</option>` +
      A.NIVEAUX_COMPETENCE.map((n) => `<option value="${n.v}"${k.force === n.v ? ' selected' : ''}>Forcer : ${n.v} · ${n.pronote}</option>`).join('');
    let h =
      '<div class="pr-fiche-tete"><button type="button" class="btn-secondaire pr-retour">← Classe</button>' +
      `<div><h1>${echapper(nomEquipe(e))}</h1><p class="pr-chemin">${e.classe ? 'Classe ' + echapper(e.classe) + ' · ' : ''}${echapper(e.nom)} · ${r.reussis} réussi(s) sur ${r.total} · ${echapper(r.etat.texte)}</p></div></div>` +
      '<div class="pr-fiche-grille">' +
      '<section class="carte ed-carte"><div class="ed-carte-tete"><h3>Compétences</h3><span class="ed-aide">Programme de technologie du cycle 4 (BO 2024)</span></div>' +
      '<table class="pr-competences"><tbody>' +
      r.evaluation.competences
        .map(
          (k) =>
            `<tr><th scope="row"><b>${k.code}</b> ${echapper(k.libelle)}<span class="pr-sous">${k.exercices.length} exercice(s) attendu(s)${k.moyenne !== null ? ` · réussite ${Math.round(k.moyenne * 100)} %` : ''}</span></th>` +
            `<td>${k.niveau ? `<span class="pr-niveau pr-niveau-${k.niveau}">${k.niveau}</span> ${A.nomNiveau(k.niveau)}` : '—'}</td>` +
            `<td><select class="pr-forcer" data-code="${k.code}" aria-label="Niveau ${k.code}">${options(k)}</select></td></tr>`,
        )
        .join('') +
      `</tbody></table><p class="pr-note">Note : <b>${nombreFr(r.evaluation.note)}</b> / 20 <span class="ed-aide">(moyenne des niveaux × 5)</span></p>` +
      `<label>Commentaire du professeur<textarea class="pr-commentaire" rows="3" placeholder="Visible dans l’export et dans le Carnet de classe.">${echapper(reg.commentaire)}</textarea></label></section>` +
      '<section class="carte ed-carte"><div class="ed-carte-tete"><h3>Exercices</h3><span class="ed-aide">« Voir » ouvre le programme de l’équipe dans le simulateur (lecture seule).</span></div>' +
      '<table class="pr-exercices"><thead><tr><th scope="col">Exercice</th><th scope="col">État</th><th scope="col">Vérifications</th><th scope="col">Indices</th><th scope="col">Temps</th><th scope="col">Carte</th><th scope="col"></th></tr></thead><tbody>';
    for (const x of e.paquet.exercices) {
      const p = ex[x.id];
      const st = A.etat(e.donnees, e.paquet, x.id);
      const envois = p ? (p.historique || []).filter((y) => y.type === 'envoi' && y.reussi) : [];
      const minutes = p ? Math.round((p.tempsPasseSecondes || 0) / 60) : 0;
      h +=
        `<tr><th scope="row">${echapper(x.numero)} · ${echapper(x.titre)}${x.defi ? ' <span class="pr-sous">défi</span>' : ''}<span class="pr-sous">${echapper(A.competenceDe(x))}</span></th>` +
        `<td><span class="pr-cel pr-${st}">${SYMBOLES[st]}</span> ${MOTS[st]}</td>` +
        `<td class="pr-nombre">${p ? p.tentatives : 0}</td><td class="pr-nombre">${p ? p.indicesOuverts : 0}</td>` +
        `<td class="pr-nombre">${minutes ? minutes + ' min' : '—'}</td>` +
        `<td>${envois.length ? `${envois.length} envoi(s)` : '—'}</td>` +
        `<td>${p && p.programme ? `<button type="button" class="btn-secondaire pr-voir" data-id="${echapper(x.id)}">Voir</button>` : ''}</td></tr>`;
    }
    h += '</tbody></table></section></div>';
    const fiche = $('.pr-fiche');
    fiche.innerHTML = h;
    $('.pr-retour', fiche).onclick = () => {
      etat.vue = 'classe';
      dessiner();
    };
    for (const s of $$('.pr-forcer', fiche)) {
      s.onchange = () => {
        const r2 = (etat.prof.equipes[e.cle] = Object.assign({ forces: {}, commentaire: '' }, etat.prof.equipes[e.cle]));
        if (s.value) r2.forces[s.dataset.code] = Number(s.value);
        else delete r2.forces[s.dataset.code];
        reglagesModifies();
        dessinerFiche();
      };
    }
    $('.pr-commentaire', fiche).oninput = (evt) => {
      const r2 = (etat.prof.equipes[e.cle] = Object.assign({ forces: {}, commentaire: '' }, etat.prof.equipes[e.cle]));
      r2.commentaire = evt.target.value;
      reglagesModifies();
    };
    for (const b of $$('.pr-voir', fiche)) b.onclick = () => voirProgramme(e, b.dataset.id);
  }

  // Programme d'un exercice, dans l'écran d'exercice de Labo Blocs (lecture seule : rien n'est enregistré).
  function voirProgramme(e, id) {
    const dlg = $('.pr-programme');
    let l = etat.lecteurs.get(e.cle);
    if (!l || l.modifieLe !== e.modifieLe) {
      const hote = document.createElement('div');
      hote.className = 'pr-programme-hote';
      $('.pr-programme-hote', dlg).replaceWith(hote);
      const session = A.creerSession({ donnees: JSON.parse(JSON.stringify(e.donnees)), lecture: true });
      A.relierParcours(session.donnees, e.paquet);
      const ecran = A.monterExercice(hote, {
        session,
        paquet: e.paquet,
        projet: { titre: `${nomEquipe(e)} · programme de l’équipe`, accent: '#14213D' },
        toutDebloquer: true,
        retour: { texte: 'Fermer', action: () => dlg.close() },
      });
      l = { ecran, hote, modifieLe: e.modifieLe };
      etat.lecteurs.set(e.cle, l);
    } else if ($('.pr-programme-hote', dlg) !== l.hote) $('.pr-programme-hote', dlg).replaceWith(l.hote);
    dlg.showModal();
    l.ecran.ouvrir(id, e.donnees.programmation.exercices[id].programme);
    $('.equipe-texte', l.hote).textContent = `Équipe ${nomEquipe(e)} · lecture seule, rien n’est enregistré`;
  }

  // ---------- Exports ----------
  function telecharger(nom, texte, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texte], { type }));
    a.download = nom;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function resultats() {
    const paquet = paquetPrincipal();
    return A.resultatsClasse(etat.equipes, etat.prof, { projet: { id: (A.projet && A.projet.id) || paquet.id, titre: (A.projet && A.projet.titre) || paquet.titre }, paquet });
  }
  function nomExport(ext) {
    const classes = [...new Set(etat.equipes.map((e) => e.classe).filter(Boolean))].join('-') || 'classe';
    const jour = new Date().toISOString().slice(0, 10);
    return `labo-blocs-${paquetPrincipal().id}-${classes}-${jour}.${ext}`.replace(/\s+/g, '_');
  }

  // ---------- Démarrage ----------
  async function demarrerProfesseur() {
    for (const el of $$('[data-icone]')) el.outerHTML = A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });
    for (const p of A.parcoursDefinis) if (!A.controler(p).length) paquets.push(A.preparer(p));
    const q = new URLSearchParams(location.search);
    if (q.get('parcours')) paquets.sort((a, b) => (a.id === q.get('parcours') ? -1 : b.id === q.get('parcours') ? 1 : 0));
    else if (A.projet) paquets.sort((a, b) => (a.id === A.projet.parcours ? -1 : b.id === A.projet.parcours ? 1 : 0));
    $('.pr-projet').textContent = `Suivi de classe · ${(A.projet && A.projet.titre) || paquets[0].titre}`;
    document.title = `Suivi de classe — ${(A.projet && A.projet.titre) || 'Labo Blocs'}`;

    const peutDossier = 'showDirectoryPicker' in global;
    const ouvrir = $('.pr-ouvrir');
    // Réglages du collège (liste commune) appliqués au projet.
    if (A.projet && A.projetAvecCollege) A.projet = A.projetAvecCollege(A.projet);
    // Exemple du dossier d'une classe, d'après les réglages du projet (dossier des équipes sans « {equipe} »).
    const chemin = A.projet && A.projet.cheminSauvegarde;
    if (chemin && chemin.length > 1) {
      const classe = (A.projet.classes && A.projet.classes[0]) || '5A';
      // À partir du dossier de la classe (« Bureau › Classe » avant lui n'aide pas à reconnaître le dossier).
      const debut = Math.max(0, chemin.indexOf('{classe}'));
      const dossier = A.remplirChemin(chemin.slice(debut, chemin.indexOf('{equipe}') >= 0 ? chemin.indexOf('{equipe}') : chemin.length), classe);
      const court = dossier.length > 2 ? [dossier[0], '…', dossier[dossier.length - 1]] : dossier;
      ouvrir.querySelector('span').textContent = `Ex. ${court.join(' › ')}. Relu toutes les 30 secondes (Chrome, Edge).`;
    }
    if (!peutDossier) {
      ouvrir.disabled = true;
      ouvrir.querySelector('span').textContent = 'Avec Chrome ou Edge seulement. Ici : importe les fichiers des équipes.';
    }
    ouvrir.onclick = async () => {
      try {
        await ouvrirDossier(await global.showDirectoryPicker({ id: 'labo-blocs-classe', mode: 'readwrite' }));
      } catch {
        // fenêtre fermée
      }
    };
    const connu = peutDossier ? await memorise() : null;
    if (connu) {
      $('.pr-reprendre').hidden = false;
      $('.pr-reprendre-nom').textContent = connu.name;
      $('.pr-reprendre').onclick = () => ouvrirDossier(connu);
    }
    for (const entree of $$('.pr-fichiers')) {
      entree.onchange = async () => {
        await importer(await lireFichiers([...entree.files]));
        entree.value = '';
      };
    }
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', async (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length) await importer(await lireFichiers([...e.dataTransfer.files]));
    });
    $('.pr-actualiser').onclick = () => actualiser().then(() => message('Classe relue.'));
    $('.pr-btn-changer').onclick = () => {
      clearInterval(actualiser.minuteur);
      Object.assign(etat, { dossier: null, fichiersDossier: [], fichiersImportes: [], equipes: [], vue: 'accueil' });
      erreurAccueil('');
      dessiner();
    };
    $('.pr-choix-objectif').onchange = (evt) => {
      etat.prof.objectif = evt.target.value ? Number(evt.target.value) : null;
      reglagesModifies();
      dessiner();
    };
    $('.pr-tableau').onclick = (evt) => {
      const b = evt.target.closest('[data-cle]');
      if (!b) return;
      etat.equipe = b.dataset.cle;
      etat.vue = 'fiche';
      dessiner();
      scrollTo(0, 0);
    };
    $('.pr-csv').onclick = () => {
      telecharger(nomExport('csv'), A.csvResultats(resultats()), 'text/csv;charset=utf-8');
      message('Le tableau (.csv) est dans tes téléchargements.');
    };
    $('.pr-carnet').onclick = () => {
      telecharger(nomExport('labo-resultats.json'), JSON.stringify(resultats(), null, 2) + '\n', 'application/json');
      message('Fichier pour le Carnet de classe téléchargé : Carnet › projet › Notes › « Importer des résultats Labo Blocs ».', 6000);
    };
    dessiner();
  }

  A.demarrerProfesseur = demarrerProfesseur;
})(this);

// ===== interface/college.js =====
// Réglages du collège, communs à tous les outils de la classe (Labo Blocs, atelier du distributeur, projets…) :
// la liste des classes et le chemin des dossiers de classe sur le réseau. Un seul fichier, modifié par le professeur
// dans la page Réglages de Labo Blocs (« Réglages du collège », liée depuis l'accueil) : https://anlito.github.io/labo-blocs/site/college.js
//
//   definirCollege({ format: 'labo-blocs/college', version: 1, classes: ['5A', '4B', …],
//                    cheminClasse: ['Bureau', 'Classe', '{classe}', 'COMMUN', 'TECHNOLOGIE'] })
//
// Chaque outil garde une copie de secours (son propre college.js, lu en premier : hors ligne, c'est elle qui sert),
// puis lit la version en ligne si internet répond (rien n'est envoyé : simple lecture du fichier).
// Un projet dit seulement ses niveaux (niveaux: ['5']) et la fin de son chemin (cheminProjet: ['DISTRIBUTEUR DE CEREALES']).
// Groupes : une classe qui finit par un chiffre après la lettre (3D1, 3C2) est un groupe de la classe 3D, 3C.
// Son dossier est dans celui de la classe : Bureau › Classe › 3D › COMMUN › TECHNOLOGIE › 3D1 › (projet).
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});
  const FORMAT = 'labo-blocs/college';
  const ADRESSE = 'https://anlito.github.io/labo-blocs/site/college.js';
  const CHEMIN_CLASSE_DEFAUT = ['{classe}'];
  const EVENEMENT = 'labo-blocs:college';

  // Appelé par college.js (la copie de secours, puis la version en ligne) : la dernière lue compte.
  global.definirCollege = (c) => {
    if (!c || !Array.isArray(c.classes)) return;
    const avant = A.college ? JSON.stringify(A.college) : '';
    A.college = c;
    if (avant !== JSON.stringify(c) && global.document && global.CustomEvent) global.document.dispatchEvent(new global.CustomEvent(EVENEMENT, { detail: c }));
  };

  // Lit la version en ligne (si internet répond), sans jamais bloquer la page ni garder une ancienne copie.
  function chargerCollegeEnLigne(adresse) {
    const doc = global.document;
    if (!doc) return;
    const s = doc.createElement('script');
    s.src = (adresse || ADRESSE) + '?t=' + Date.now();
    s.async = true;
    s.onerror = () => s.remove(); // hors ligne : la copie de secours reste
    (doc.head || doc.documentElement).appendChild(s);
  }

  // « 5A » → '5' ; « 4e B » → '4' ; « SEGPA » → ''
  const niveauDe = (classe) => (String(classe).match(/\d/) || [''])[0];

  // « 3D1 » → { classe: '3D', groupe: '3D1' } ; « 5A » → { classe: '5A', groupe: '' }
  function classeEtGroupe(classe) {
    const c = String(classe || '').trim();
    const m = c.match(/^(\d+\s*[A-Za-z]+)\s*\d+$/);
    return m ? { classe: m[1], groupe: c } : { classe: c, groupe: '' };
  }

  // Chemin d'une équipe : {classe} → dossier de la classe, {groupe} → dossier du groupe (retiré s'il n'y en a pas),
  // {equipe} → dossier de l'équipe.
  function remplirChemin(chemin, classe, equipe) {
    const g = classeEtGroupe(classe);
    return (chemin || [])
      .filter((p) => p !== '{groupe}' || g.groupe)
      .map((p) => String(p).replace('{classe}', g.classe).replace('{groupe}', g.groupe).replace('{equipe}', equipe == null ? '{equipe}' : equipe));
  }

  // Classes d'un projet : celles du collège de ses niveaux (tous les niveaux si le projet n'en dit rien).
  function classesDuCollege(college, niveaux) {
    const n = (niveaux || []).map((x) => niveauDe(x)).filter(Boolean);
    return (college.classes || []).filter((c) => !n.length || n.includes(niveauDe(c)));
  }

  // Réglages d'un projet complétés par ceux du collège :
  //   projet.cheminProjet (fin du chemin, ex. ['DISTRIBUTEUR DE CEREALES']) → cheminClasse + {groupe} + cheminProjet + {equipe}
  //   projet.niveaux → classes du collège de ces niveaux.
  // Des classes ou un chemin écrits dans le projet lui-même restent prioritaires (anciens réglages).
  function projetAvecCollege(projet, college) {
    const c = college || A.college;
    if (!projet || !c) return projet;
    const r = Object.assign({}, projet);
    if (!projet.classes || !projet.classes.length) r.classes = classesDuCollege(c, projet.niveaux);
    if (!projet.cheminSauvegarde && projet.cheminProjet) r.cheminSauvegarde = (c.cheminClasse || CHEMIN_CLASSE_DEFAUT).concat(['{groupe}'], projet.cheminProjet, ['{equipe}']);
    return r;
  }

  // Liste tapée par le professeur (« 5A, 5B » ou une par ligne) → classes sans doublon, dans l'ordre.
  function lireListeClasses(texte) {
    const vues = new Set();
    return String(texte || '')
      .split(/[\n,;]+/)
      .map((x) => x.trim().replace(/\s+/g, ' '))
      .filter((x) => x && !vues.has(x.toLowerCase()) && vues.add(x.toLowerCase()));
  }

  // Chemin tapé (« Bureau › Classe › {classe} › COMMUN ») → morceaux ; {classe} doit y être.
  function lireCheminClasse(texte) {
    const morceaux = String(texte || '')
      .split(/[›/\\>]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (!morceaux.includes('{classe}')) return { ok: false, message: 'Le chemin doit contenir {classe} (le dossier de la classe).' };
    if (morceaux.includes('{equipe}')) return { ok: false, message: 'Le chemin s’arrête au dossier des projets de la classe : sans {equipe}.' };
    return { ok: true, chemin: morceaux };
  }

  function scriptCollege(c) {
    const donnees = { format: FORMAT, version: 1, classes: c.classes, cheminClasse: c.cheminClasse, modifieLe: c.modifieLe || new Date().toISOString().slice(0, 10) };
    return (
      '// Réglages du collège, communs à tous les outils : liste des classes et chemin des dossiers de classe.\n' +
      '// Modifié dans la page Réglages de Labo Blocs (« Réglages du collège »). Chaque outil en garde une copie de secours.\n' +
      `definirCollege(${JSON.stringify(donnees, null, 2)});\n`
    );
  }

  const api = { FORMAT_COLLEGE: FORMAT, ADRESSE_COLLEGE: ADRESSE, EVENEMENT_COLLEGE: EVENEMENT, chargerCollegeEnLigne, classesDuCollege, projetAvecCollege, lireListeClasses, lireCheminClasse, scriptCollege, niveauDe, classeEtGroupe, remplirChemin };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign(A, api);
})(this);
