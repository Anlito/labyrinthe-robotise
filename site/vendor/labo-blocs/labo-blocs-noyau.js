// Labo Blocs 0.4.0 — moteur. Fichier construit par « npm run module » : ne pas modifier ici.
(function () {
  var module, exports, require;
// ===== noyau/cartes.js =====
// Cartes de Labo Blocs (jalon 3) : profils (Arduino Uno, mBot, micro:bit V2) et blocs propres à une carte.
//
// Un profil dit ce qu'on branche où (broches proposées dans les menus des blocs), quel programme de la carte installer
// (cartes/firmwares.js) et comment (« serie » : depuis le navigateur ; « fichier » : à copier sur le lecteur de la carte).
//
// Les blocs d'une carte (mBot, micro:bit) sont décrits ici une seule fois : l'éditeur de blocs (interface/blocs.js), le
// programme (noyau/programme.js) et le compilateur (noyau/code-octet.js) lisent cette description. Chaque bloc se
// « déroule » en blocs de base : commande d'extension (ext), attendre, son, calculs. Le même code octet tourne dans
// le simulateur et dans la carte.
//   Extension 1 = mBot : 1 moteurs (gauche, droite) · 2 ultrasons (port) → cm · 3 suiveur de ligne (port) → 0..3 ·
//     4 bouton de la carte · 5 lumière · 6 LED RGB (quelle, rouge, vert, bleu) · 9 un moteur (1 gauche | 2 droite, vitesse) ·
//     afficheur LED Matrix 8×16 sur le port 4 (programme de la carte 0.3) : 10 dessin, colonnes 0 à 7 (4 valeurs de
//     2 colonnes : paire + impaire × 256) · 11 dessin, colonnes 8 à 15, puis affichage · 12 nombre (en centièmes) ·
//     13 heure (heures, minutes) · 14 lettres du texte à suivre (4 par commande) · 15 dernières lettres, puis affichage
//   Extension 2 = micro:bit : 1 nombre · 2 image · 3 pixel (x, y, 0..9) · 4 effacer · 5 bouton A · 6 bouton B ·
//     7 accélération (axe) · 8 température · 9 logo touché · 10 lumière · 11 texte (codes des lettres) ·
//     12 note (Hz, s) · 13 geste · 14 lettres du texte à suivre (4 par commande) · 15 dessin 5 × 5 (programme de la
//     carte 0.3) : 2 valeurs, lignes 0 à 2 puis lignes 3 et 4, bit y×5 + x (rangé par moitié), 1 = allumé
//   Extension 3 = caméra (toutes les cartes) : 1 la caméra reconnaît (étiquette n°, 0 = rien) → 0/1 ·
//     2 certitude de l'IA pour l'étiquette → 0..100. La webcam et l'IA sont dans l'ordinateur : ces commandes ne
//     partent jamais vers la carte (simulateur et mode « En direct » seulement, jamais « Dans la carte »).
//   Extension 4 = clavier de l'ordinateur (toutes les cartes) : 1 la touche (code) est appuyée → 0/1. Comme la caméra,
//     le clavier est dans l'ordinateur : simulateur et « En direct » seulement.
(function (global) {
  'use strict';

  // Version du programme de la carte attendue par cet outil (« carte pas à jour » si la carte répond autre chose).
  const VERSION_FIRMWARE = '0.2';

  const serie = (debut, fin, prefixe) => Array.from({ length: fin - debut + 1 }, (_, i) => prefixe + (debut + i));
  const D = serie(2, 13, 'D');
  const P = ['P0', 'P1', 'P2'];

  const PROFILS = {
    uno: {
      id: 'uno',
      nom: 'Arduino Uno',
      firmware: 'uno',
      reponse: 'uno', // nom de la carte dans « PONG v2 <version> <carte> … »
      installation: 'serie',
      broches: { led: D, bouton: D, servo: ['D5', 'D6'], buzzer: D, joystick: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'] },
      composants: ['led', 'bouton', 'servo', 'buzzer', 'joystick'],
    },
    mbot: {
      id: 'mbot',
      nom: 'mBot (carte mCore)',
      firmware: 'mbot',
      reponse: 'mcore',
      installation: 'serie',
      broches: { led: [], bouton: [], servo: [], buzzer: [] },
      composants: [],
      // Branchements imposés aux élèves (décision du 14/10/2026 ; afficheur : 19/10/2026).
      ports: { ultrasons: 3, ligne: 2, matrice: 4 },
      // Programme de la carte propre au mBot (afficheur) : l'Uno et la micro:bit restent en 0.2.
      version: '0.3',
    },
    microbit: {
      id: 'microbit',
      nom: 'micro:bit V2',
      firmware: 'microbitV2',
      reponse: 'microbit-v2',
      // Programme de la carte propre à la micro:bit (dessin 5 × 5) : l'Uno reste en 0.2.
      version: '0.3',
      installation: 'fichier',
      broches: { led: P, bouton: P, servo: P, buzzer: P, joystick: P },
      composants: ['led', 'bouton', 'servo', 'joystick'],
    },
  };

  const profil = (carte) => PROFILS[carte] || PROFILS.uno;

  // ---------- Blocs propres à une carte ----------

  const ext = (extension, commande, args) => ({ bloc: 'ext', extension, commande, arguments: args || [] });
  const oppose = (v) => ({ bloc: 'operation', op: '×', a: v, b: -1 });
  const cmp = (op, a, b) => ({ bloc: 'comparaison', op, a, b });
  const attendre = (duree) => ({ bloc: 'attendre', duree });

  // Notes de la gamme (la fréquence en Hz est la valeur). Libellés sans suffixe commun : Blockly le sortirait du menu.
  const NOTES = [
    ['Do', '262'],
    ['Ré', '294'],
    ['Mi', '330'],
    ['Fa', '349'],
    ['Sol', '392'],
    ['La', '440'],
    ['Si', '494'],
    ['Do aigu', '523'],
  ];
  const COULEURS_LED = {
    rouge: [255, 0, 0],
    vert: [0, 255, 0],
    bleu: [0, 0, 255],
    jaune: [255, 200, 0],
    violet: [200, 0, 255],
    cyan: [0, 200, 255],
    blanc: [255, 255, 255],
    eteinte: [0, 0, 0],
  };
  const IMAGES = [
    ['sourire', '1'],
    ['triste', '2'],
    ['cœur', '3'],
    ['oui ✓', '4'],
    ['non ✗', '5'],
    ['flèche haut', '6'],
    ['flèche droite', '7'],
    ['flèche bas', '8'],
    ['flèche gauche', '9'],
  ];
  const GESTES = [
    ['secouée', '1'],
    ['logo vers le haut', '2'],
    ['logo vers le bas', '3'],
    ['penchée à gauche', '4'],
    ['penchée à droite', '5'],
    ['écran vers le haut', '6'],
    ['écran vers le bas', '7'],
  ];

  // Les lettres que l'écran du micro:bit sait afficher : sans accents, 40 au plus.
  function codesTexte(texte) {
    return String(texte || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\x20-\x7e]/g, '?')
      .slice(0, 40)
      .split('')
      .map((c) => c.charCodeAt(0));
  }

  // ---------- Afficheur LED Matrix 8×16 du mBot ----------
  // 16 colonnes de 8 points ; une colonne est un octet, le bit 0 est le point du haut. Les mêmes tables sont dans le
  // programme de la carte (cartes/arduino/labo_blocs/labo_blocs.ino) : un test vérifie qu'elles sont identiques.
  // Police 5 × 7 (lettres 32 à 126), 5 colonnes par lettre.
  const POLICE_MATRICE = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5f, 0x00, 0x00, 0x00, 0x07, 0x00, 0x07, 0x00, 0x14, 0x7f, 0x14, 0x7f, 0x14,
    0x24, 0x2a, 0x7f, 0x2a, 0x12, 0x23, 0x13, 0x08, 0x64, 0x62, 0x36, 0x49, 0x55, 0x22, 0x50, 0x00, 0x05, 0x03, 0x00, 0x00,
    0x00, 0x1c, 0x22, 0x41, 0x00, 0x00, 0x41, 0x22, 0x1c, 0x00, 0x08, 0x2a, 0x1c, 0x2a, 0x08, 0x08, 0x08, 0x3e, 0x08, 0x08,
    0x00, 0x50, 0x30, 0x00, 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x60, 0x60, 0x00, 0x00, 0x20, 0x10, 0x08, 0x04, 0x02,
    0x3e, 0x51, 0x49, 0x45, 0x3e, 0x00, 0x42, 0x7f, 0x40, 0x00, 0x42, 0x61, 0x51, 0x49, 0x46, 0x21, 0x41, 0x45, 0x4b, 0x31,
    0x18, 0x14, 0x12, 0x7f, 0x10, 0x27, 0x45, 0x45, 0x45, 0x39, 0x3c, 0x4a, 0x49, 0x49, 0x30, 0x01, 0x71, 0x09, 0x05, 0x03,
    0x36, 0x49, 0x49, 0x49, 0x36, 0x06, 0x49, 0x49, 0x29, 0x1e, 0x00, 0x36, 0x36, 0x00, 0x00, 0x00, 0x56, 0x36, 0x00, 0x00,
    0x08, 0x14, 0x22, 0x41, 0x00, 0x14, 0x14, 0x14, 0x14, 0x14, 0x00, 0x41, 0x22, 0x14, 0x08, 0x02, 0x01, 0x51, 0x09, 0x06,
    0x32, 0x49, 0x79, 0x41, 0x3e, 0x7e, 0x11, 0x11, 0x11, 0x7e, 0x7f, 0x49, 0x49, 0x49, 0x36, 0x3e, 0x41, 0x41, 0x41, 0x22,
    0x7f, 0x41, 0x41, 0x22, 0x1c, 0x7f, 0x49, 0x49, 0x49, 0x41, 0x7f, 0x09, 0x09, 0x09, 0x01, 0x3e, 0x41, 0x49, 0x49, 0x7a,
    0x7f, 0x08, 0x08, 0x08, 0x7f, 0x00, 0x41, 0x7f, 0x41, 0x00, 0x20, 0x40, 0x41, 0x3f, 0x01, 0x7f, 0x08, 0x14, 0x22, 0x41,
    0x7f, 0x40, 0x40, 0x40, 0x40, 0x7f, 0x02, 0x0c, 0x02, 0x7f, 0x7f, 0x04, 0x08, 0x10, 0x7f, 0x3e, 0x41, 0x41, 0x41, 0x3e,
    0x7f, 0x09, 0x09, 0x09, 0x06, 0x3e, 0x41, 0x51, 0x21, 0x5e, 0x7f, 0x09, 0x19, 0x29, 0x46, 0x46, 0x49, 0x49, 0x49, 0x31,
    0x01, 0x01, 0x7f, 0x01, 0x01, 0x3f, 0x40, 0x40, 0x40, 0x3f, 0x1f, 0x20, 0x40, 0x20, 0x1f, 0x3f, 0x40, 0x38, 0x40, 0x3f,
    0x63, 0x14, 0x08, 0x14, 0x63, 0x07, 0x08, 0x70, 0x08, 0x07, 0x61, 0x51, 0x49, 0x45, 0x43, 0x00, 0x7f, 0x41, 0x41, 0x00,
    0x02, 0x04, 0x08, 0x10, 0x20, 0x00, 0x41, 0x41, 0x7f, 0x00, 0x04, 0x02, 0x01, 0x02, 0x04, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x00, 0x01, 0x02, 0x04, 0x00, 0x20, 0x54, 0x54, 0x54, 0x78, 0x7f, 0x48, 0x44, 0x44, 0x38, 0x38, 0x44, 0x44, 0x44, 0x20,
    0x38, 0x44, 0x44, 0x48, 0x7f, 0x38, 0x54, 0x54, 0x54, 0x18, 0x08, 0x7e, 0x09, 0x01, 0x02, 0x0c, 0x52, 0x52, 0x52, 0x3e,
    0x7f, 0x08, 0x04, 0x04, 0x78, 0x00, 0x44, 0x7d, 0x40, 0x00, 0x20, 0x40, 0x44, 0x3d, 0x00, 0x7f, 0x10, 0x28, 0x44, 0x00,
    0x00, 0x41, 0x7f, 0x40, 0x00, 0x7c, 0x04, 0x18, 0x04, 0x78, 0x7c, 0x08, 0x04, 0x04, 0x78, 0x38, 0x44, 0x44, 0x44, 0x38,
    0x7c, 0x14, 0x14, 0x14, 0x08, 0x08, 0x14, 0x14, 0x18, 0x7c, 0x7c, 0x08, 0x04, 0x04, 0x08, 0x48, 0x54, 0x54, 0x54, 0x20,
    0x04, 0x3f, 0x44, 0x40, 0x20, 0x3c, 0x40, 0x40, 0x20, 0x7c, 0x1c, 0x20, 0x40, 0x20, 0x1c, 0x3c, 0x40, 0x30, 0x40, 0x3c,
    0x44, 0x28, 0x10, 0x28, 0x44, 0x0c, 0x50, 0x50, 0x50, 0x3c, 0x44, 0x64, 0x54, 0x4c, 0x44, 0x00, 0x08, 0x36, 0x41, 0x00,
    0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0x41, 0x36, 0x08, 0x00, 0x08, 0x04, 0x08, 0x10, 0x08,
  ];
  // Chiffres étroits 3 × 7 (nombres et heure) : 0 à 9, puis « - ». Le point et les deux points de l'heure font une
  // colonne.
  const CHIFFRES_MATRICE = [
    0x7f, 0x41, 0x7f, 0x42, 0x7f, 0x40, 0x79, 0x49, 0x4f, 0x49, 0x49, 0x7f, 0x0f, 0x08, 0x7f, 0x4f, 0x49, 0x79, 0x7f, 0x49,
    0x79, 0x01, 0x01, 0x7f, 0x7f, 0x49, 0x7f, 0x4f, 0x49, 0x7f, 0x08, 0x08, 0x08,
  ];
  const POINT_MATRICE = 0x40;
  const DEUX_POINTS_MATRICE = 0x14;
  const DUREE_COLONNE_MATRICE = 100; // le texte avance d'une colonne toutes les 100 ms
  // Dessin de départ du bloc (un sourire) : 32 chiffres hexadécimaux, 2 par colonne, de gauche à droite.
  const DESSIN_DEPART = '00000000264640404040462600000000';
  const lireDessinMatrice = (hex) => {
    const s = /^[0-9a-f]{32}$/i.test(String(hex || '')) ? String(hex) : '0'.repeat(32);
    return Array.from({ length: 16 }, (_, i) => parseInt(s.slice(i * 2, i * 2 + 2), 16));
  };
  const centrer = (colonnes) => {
    const ecran = new Array(16).fill(0);
    const debut = Math.max(0, Math.floor((16 - colonnes.length) / 2));
    colonnes.slice(0, 16).forEach((c, i) => (ecran[debut + i] = c));
    return ecran;
  };

  // Dessin de l'écran de la micro:bit : 25 caractères « 0 » / « 1 », ligne par ligne, du haut à gauche. Dessin de
  // départ du bloc : un cœur.
  const DESSIN_MICROBIT_DEPART = '0101011111111110111000100';
  const lireDessinMicrobit = (s) => (/^[01]{25}$/.test(String(s || '')) ? String(s) : '0'.repeat(25)).split('').map(Number);
  // 25 points → 2 valeurs exactes en nombre à virgule (24 bits au plus) : lignes 0 à 2 (15 bits), lignes 3 et 4.
  function valeursDessinMicrobit(s) {
    const p = lireDessinMicrobit(s);
    const somme = (debut, fin) => p.slice(debut, fin).reduce((v, b, i) => v + b * 2 ** i, 0);
    return [somme(0, 15), somme(15, 25)];
  }

  // Lettres d'un texte : 5 colonnes chacune, séparées par une colonne vide.
  function colonnesTexte(codes) {
    const colonnes = [];
    codes.forEach((code, i) => {
      if (i) colonnes.push(0);
      const k = code >= 32 && code <= 126 ? code - 32 : 31; // « ? » pour une lettre inconnue
      for (let x = 0; x < 5; x++) colonnes.push(POLICE_MATRICE[k * 5 + x]);
    });
    return colonnes;
  }

  // Arrondi d'un entier n / d au plus proche (moitié : loin de zéro), comme la carte (calcul en entiers).
  const diviserArrondi = (n, d) => (n < 0 ? -Math.floor((-n + d / 2) / d) : Math.floor((n + d / 2) / d));
  // Texte d'un nombre donné en centièmes, avec 2, 1 ou 0 chiffres après la virgule (zéros de fin enlevés) : le plus
  // précis qui tient sur l'afficheur en chiffres étroits ; sinon (trop grand) le nombre entier, qui défilera.
  function texteNombre(centiemes) {
    const c = Math.round(Number(centiemes) || 0);
    let dernier = '';
    for (const d of [2, 1, 0]) {
      const q = diviserArrondi(c, d === 2 ? 1 : d === 1 ? 10 : 100);
      const p = d === 2 ? 100 : d === 1 ? 10 : 1;
      const a = Math.abs(q);
      let s = (q < 0 ? '-' : '') + Math.floor(a / p);
      if (d) {
        const f = String(a % p).padStart(d, '0').replace(/0+$/, '');
        if (f) s += '.' + f;
      }
      dernier = s;
      if (largeurChiffres(s) <= 16) return { texte: s, etroit: true };
    }
    return { texte: dernier, etroit: false };
  }
  const largeurChiffres = (s) => s.split('').reduce((l, ch, i) => l + (i ? 1 : 0) + (ch === '.' ? 1 : 3), 0);
  function colonnesChiffres(s) {
    const colonnes = [];
    s.split('').forEach((ch, i) => {
      if (i) colonnes.push(0);
      if (ch === '.') return colonnes.push(POINT_MATRICE);
      const k = ch === '-' ? 10 : Number(ch);
      for (let x = 0; x < 3; x++) colonnes.push(CHIFFRES_MATRICE[k * 3 + x]);
    });
    return colonnes;
  }
  // « 12:30 » : heures aux colonnes 0 et 4, deux points à la colonne 7, minutes aux colonnes 9 et 13 (16 colonnes
  // en tout : la colonne 8 sépare les deux points des minutes).
  function colonnesHeure(h, m) {
    const ecran = new Array(16).fill(0);
    const poser = (chiffre, x) => {
      for (let i = 0; i < 3; i++) ecran[x + i] = CHIFFRES_MATRICE[chiffre * 3 + i];
    };
    const hh = Math.max(0, Math.min(99, Math.round(Number(h) || 0)));
    const mm = Math.max(0, Math.min(99, Math.round(Number(m) || 0)));
    poser(Math.floor(hh / 10), 0);
    poser(hh % 10, 4);
    ecran[7] = DEUX_POINTS_MATRICE;
    poser(Math.floor(mm / 10), 9);
    poser(mm % 10, 13);
    return ecran;
  }
  // Ce que montre l'afficheur pour un texte : immobile et centré s'il tient, sinon il défile une fois.
  function animationTexte(colonnes, debut) {
    return colonnes.length <= 16 ? { ecran: centrer(colonnes) } : { colonnes, debut };
  }

  // ---------- Clavier de l'ordinateur ----------
  // Touches proposées : les flèches, espace, les lettres et les chiffres. Valeur du menu : nom court ; code envoyé au
  // programme : flèches 1 à 4, espace 32, chiffres et lettres (majuscules) en ASCII.
  const TOUCHES = [['flèche haut', 'haut'], ['flèche bas', 'bas'], ['flèche gauche', 'gauche'], ['flèche droite', 'droite'], ['espace', 'espace']]
    .concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => [l, l.toLowerCase()]))
    .concat('0123456789'.split('').map((c) => [c, c]));
  const CODES_TOUCHES = { haut: 1, bas: 2, gauche: 3, droite: 4, espace: 32 };
  const codeTouche = (t) => CODES_TOUCHES[t] || (/^[a-z0-9]$/.test(t) ? t.toUpperCase().charCodeAt(0) : 0);
  const toucheDuCode = (c) => (TOUCHES.find(([, t]) => codeTouche(t) === Number(c)) || [null, null])[1];
  // Nom d'une touche du clavier de l'ordinateur (event.key) → valeur du menu, ou null.
  function toucheDuClavier(cle) {
    const fleches = { ArrowUp: 'haut', ArrowDown: 'bas', ArrowLeft: 'gauche', ArrowRight: 'droite', ' ': 'espace', Spacebar: 'espace' };
    if (fleches[cle]) return fleches[cle];
    const l = String(cle || '').toLowerCase();
    return /^[a-z0-9]$/.test(l) ? l : null;
  }
  // Entrée du simulateur pour une touche (comme un bouton : les scénarios peuvent l'appuyer) : « touche:haut ».
  const entreeTouche = (t) => 'touche:' + t;
  const BLOCS_CLAVIER = ['quand_touche', 'touche_appuyee'];
  // Les touches, comme des boutons déjà là, dans les exercices qui proposent les blocs du clavier.
  function composantsClavier(exercice) {
    if (!exercice || !(exercice.blocsAutorises || []).some((b) => BLOCS_CLAVIER.includes(b))) return [];
    return TOUCHES.map(([nom, t]) => ({ type: 'bouton', broche: entreeTouche(t), libelle: `la touche ${nom}`, integre: true, clavier: true, feminin: true }));
  }

  // ---------- Joystick (module 2 axes + bouton, ex. KY-023) ----------
  // Composant de l'exercice : { type: 'joystick', broche: X, y: Y, bouton: SW, inverserX?, inverserY? } (« broche »
  // est l'axe X : ce que lisent les outils qui ne voient qu'une broche par composant). Les axes sont des entrées
  // analogiques (0 à 1023, 512 au centre), le bouton va à la masse (appuyé = 0 V) : résistance interne, toujours.
  // Pour l'élève : position de -100 (gauche, bas) à 100 (droite, haut) ; direction au-delà de ±50.
  const JOYSTICK_DEPART = { uno: { broche: 'A0', y: 'A1', bouton: 'D2' }, microbit: { broche: 'P0', y: 'P1', bouton: 'P2' } };
  const DIRECTIONS_JOYSTICK = [['vers le haut', 'haut'], ['vers le bas', 'bas'], ['vers la gauche', 'gauche'], ['vers la droite', 'droite'], ['au centre', 'centre']];
  const SEUIL_JOYSTICK = 50;
  // Réglage « joystick » des scénarios de test (comme un capteur) : 0 au centre, 1 haut, 2 bas, 3 gauche, 4 droite.
  const CODES_JOYSTICK = ['centre', 'haut', 'bas', 'gauche', 'droite'];
  const BLOCS_JOYSTICK = ['joystick_position', 'joystick_valeur', 'joystick_direction', 'joystick_bouton', 'quand_joystick'];
  const joystickDe = (composants) => (composants || []).find((c) => c.type === 'joystick') || null;
  function nouveauJoystick(carte) {
    return Object.assign({ type: 'joystick' }, JOYSTICK_DEPART[carte === 'microbit' ? 'microbit' : 'uno']);
  }
  // Valeurs brutes (0 à 1023) des deux axes pour une direction (scénarios de test, simulateur).
  function brutsJoystick(direction, j) {
    const x = { gauche: 0, droite: 1023 }[direction] ?? 512;
    const y = { bas: 0, haut: 1023 }[direction] ?? 512;
    return { x: j && j.inverserX ? 1023 - x : x, y: j && j.inverserY ? 1023 - y : y };
  }
  // Position (-100 à 100, entière) lue sur la broche de l'axe : blocs de base pour le code octet.
  function positionJoystick(axe, j) {
    const op = (o, a, b) => ({ bloc: 'operation', op: o, a, b });
    const brut = { bloc: 'entree_analogique', broche: axe === 'y' ? j.y : j.broche };
    const inverse = axe === 'y' ? j.inverserY : j.inverserX;
    // (brut - 512) × 100 / 512, arrondi : t - (t mod 1) avec t = valeur + 0,5 (le reste a le signe du diviseur).
    const t = op('+', op('×', op('÷', op('×', op('-', brut, 512), 100), 512), inverse ? -1 : 1), 0.5);
    return op('-', t, op('mod', t, 1));
  }
  function directionJoystick(direction, j) {
    const cmp = (o, a, b) => ({ bloc: 'comparaison', op: o, a, b });
    const x = positionJoystick('x', j);
    const y = positionJoystick('y', j);
    switch (direction) {
      case 'haut':
        return cmp('>', y, SEUIL_JOYSTICK);
      case 'bas':
        return cmp('<', y, -SEUIL_JOYSTICK);
      case 'gauche':
        return cmp('<', x, -SEUIL_JOYSTICK);
      case 'droite':
        return cmp('>', x, SEUIL_JOYSTICK);
      default: {
        const et = (a, b) => ({ bloc: 'logique', op: 'et', a, b });
        return et(et(cmp('≤', x, SEUIL_JOYSTICK), cmp('≥', x, -SEUIL_JOYSTICK)), et(cmp('≤', y, SEUIL_JOYSTICK), cmp('≥', y, -SEUIL_JOYSTICK)));
      }
    }
  }
  // Blocs du joystick → blocs de base. Le joystick vient des composants de l'exercice (null : il n'y en a pas).
  function deroulerJoystick(e, composants) {
    const j = joystickDe(composants);
    if (!j) return null;
    if (e.bloc === 'joystick_position') return positionJoystick(e.axe === 'y' ? 'y' : 'x', j);
    // Valeur brute : ce que lit la broche (0 à 1023), sans tenir compte de « Inverser ».
    if (e.bloc === 'joystick_valeur') return { bloc: 'entree_analogique', broche: e.axe === 'y' ? j.y : j.broche };
    if (e.bloc === 'joystick_direction') return directionJoystick(e.direction, j);
    if (e.bloc === 'joystick_bouton') return { bloc: 'comparaison', op: '=', a: { bloc: 'bouton_etat', broche: j.bouton }, b: 1 };
    return null;
  }
  // Le bouton du joystick, comme un bouton de l'exercice : les scénarios l'appuient.
  function composantsJoystick(composants) {
    const j = joystickDe(composants);
    return j ? [{ type: 'bouton', broche: j.bouton, libelle: 'le bouton du joystick', integre: true, joystick: true }] : [];
  }

  // Description d'un bloc :
  //   carte, categorie, sorte ('instruction' | 'valeur' | 'condition'), texte (message Blockly : %CHAMP ou %ENTREE),
  //   champs { NOM: options [[libellé, valeur]] | 'texte' | 'etiquette' (caméra) | 'dessin' (afficheur du mBot) }, entrees { NOM: valeur de départ }, derouler(p) → blocs de base
  //   (p : les champs et entrées du bloc, nommés en minuscules : DIRECTION → p.direction)
  const BLOCS = {
    // ----- Caméra et IA (toutes les cartes) : l'étiquette est un numéro (1, 2… ; 0 = rien), son nom vient de l'exercice -----
    camera_reconnait: {
      carte: '*',
      categorie: 'camera',
      sorte: 'condition',
      texte: 'la caméra reconnaît %ETIQUETTE',
      champs: { ETIQUETTE: 'etiquette' },
      defauts: { ETIQUETTE: '1' },
      derouler: (p) => cmp('=', ext(3, 1, [Number(p.etiquette) || 0]), 1),
    },
    camera_certitude: {
      carte: '*',
      categorie: 'camera',
      sorte: 'valeur',
      texte: 'certitude de l’IA pour %ETIQUETTE (%)',
      champs: { ETIQUETTE: 'etiquette' },
      defauts: { ETIQUETTE: '1' },
      derouler: (p) => ext(3, 2, [Number(p.etiquette) || 0]),
    },
    // ----- Clavier de l'ordinateur (toutes les cartes) -----
    touche_appuyee: {
      carte: '*',
      categorie: 'clavier',
      sorte: 'condition',
      texte: 'la touche %TOUCHE est appuyée',
      champs: { TOUCHE: TOUCHES },
      derouler: (p) => cmp('=', ext(4, 1, [codeTouche(p.touche)]), 1),
    },
    // ----- mBot : moteurs -----
    mbot_deplacer: {
      carte: 'mbot',
      categorie: 'mbot_moteurs',
      sorte: 'instruction',
      texte: '%DIRECTION à la vitesse %VITESSE %',
      champs: { DIRECTION: [['avancer', 'avancer'], ['reculer', 'reculer'], ['tourner à gauche', 'gauche'], ['tourner à droite', 'droite']] },
      entrees: { VITESSE: 50 },
      derouler: (p) => ext(1, 1, vitesses(p.direction, p.vitesse)),
    },
    mbot_deplacer_pendant: {
      carte: 'mbot',
      categorie: 'mbot_moteurs',
      sorte: 'instruction',
      texte: '%DIRECTION à la vitesse %VITESSE % pendant %DUREE s',
      champs: { DIRECTION: [['avancer', 'avancer'], ['reculer', 'reculer'], ['tourner à gauche', 'gauche'], ['tourner à droite', 'droite']] },
      entrees: { VITESSE: 50, DUREE: 1 },
      derouler: (p) => [ext(1, 1, vitesses(p.direction, p.vitesse)), attendre(p.duree), ext(1, 1, [0, 0])],
    },
    mbot_arreter: { carte: 'mbot', categorie: 'mbot_moteurs', sorte: 'instruction', texte: 'arrêter les moteurs', derouler: () => ext(1, 1, [0, 0]) },
    mbot_moteur: {
      carte: 'mbot',
      categorie: 'mbot_moteurs',
      sorte: 'instruction',
      texte: 'moteur %MOTEUR à la vitesse %VITESSE %',
      champs: { MOTEUR: [['gauche', '1'], ['droit', '2']] },
      entrees: { VITESSE: 50 },
      derouler: (p) => ext(1, 9, [Number(p.moteur) || 1, p.vitesse]),
    },
    // ----- mBot : capteurs (ultrasons sur le port 3, suiveur de ligne sur le port 2 : imposés) -----
    mbot_distance: { carte: 'mbot', categorie: 'mbot_capteurs', sorte: 'valeur', texte: 'distance mesurée par les ultrasons (cm)', derouler: () => ext(1, 2, [3]) },
    mbot_ligne: { carte: 'mbot', categorie: 'mbot_capteurs', sorte: 'valeur', texte: 'valeur du suiveur de ligne (0 à 3)', derouler: () => ext(1, 3, [2]) },
    mbot_ligne_voit: {
      carte: 'mbot',
      categorie: 'mbot_capteurs',
      sorte: 'condition',
      texte: 'le capteur %COTE du suiveur de ligne voit du %COULEUR',
      champs: { COTE: [['gauche', 'gauche'], ['droit', 'droit']], COULEUR: [['noir', 'noir'], ['blanc', 'blanc']] },
      // 0 : noir à gauche et à droite · 1 : noir à gauche · 2 : noir à droite · 3 : blanc des deux côtés (comme mBlock).
      derouler: (p) => {
        const v = ext(1, 3, [2]);
        if (p.cote === 'gauche') return p.couleur === 'noir' ? cmp('<', v, 2) : cmp('≥', v, 2);
        const reste = { bloc: 'operation', op: 'mod', a: v, b: 2 };
        return cmp('=', reste, p.couleur === 'noir' ? 0 : 1);
      },
    },
    mbot_bouton: { carte: 'mbot', categorie: 'mbot_capteurs', sorte: 'condition', texte: 'le bouton de la carte est appuyé', derouler: () => cmp('=', ext(1, 4, []), 1) },
    mbot_lumiere: { carte: 'mbot', categorie: 'mbot_capteurs', sorte: 'valeur', texte: 'lumière (capteur de la carte, 0 à 1023)', derouler: () => ext(1, 5, []) },
    // ----- mBot : LED et son -----
    mbot_led: {
      carte: 'mbot',
      categorie: 'mbot_led_son',
      sorte: 'instruction',
      texte: 'LED %QUELLE en %COULEUR',
      champs: {
        QUELLE: [['les deux', '0'], ['gauche', '2'], ['droite', '1']],
        COULEUR: [['rouge', 'rouge'], ['vert', 'vert'], ['bleu', 'bleu'], ['jaune', 'jaune'], ['violet', 'violet'], ['cyan', 'cyan'], ['blanc', 'blanc'], ['éteinte', 'eteinte']],
      },
      derouler: (p) => ext(1, 6, [Number(p.quelle) || 0, ...(COULEURS_LED[p.couleur] || COULEURS_LED.eteinte)]),
    },
    mbot_note: {
      carte: 'mbot',
      categorie: 'mbot_led_son',
      sorte: 'instruction',
      texte: 'jouer la note %NOTE pendant %DUREE s',
      champs: { NOTE: NOTES },
      entrees: { DUREE: 0.5 },
      // Le buzzer du mCore est sur D8. La note est jouée jusqu'au bout avant le bloc suivant (comme mBlock).
      derouler: (p) => [{ bloc: 'son', broche: 'D8', frequence: Number(p.note) || 440, duree: p.duree }, attendre(p.duree)],
    },
    // ----- mBot : afficheur LED Matrix 8×16 (port 4, imposé) -----
    mbot_matrice_dessin: {
      carte: 'mbot',
      categorie: 'mbot_afficheur',
      sorte: 'instruction',
      texte: 'afficher le dessin %DESSIN',
      champs: { DESSIN: 'dessin' },
      defauts: { DESSIN: DESSIN_DEPART },
      // Une commande porte 4 valeurs au plus : 2 colonnes par valeur, le dessin part en deux moitiés.
      derouler: (p) => {
        const c = lireDessinMatrice(p.dessin);
        const moitie = (debut) => [0, 1, 2, 3].map((i) => c[debut + i * 2] + c[debut + i * 2 + 1] * 256);
        return [ext(1, 10, moitie(0)), ext(1, 11, moitie(8))];
      },
    },
    mbot_matrice_texte: {
      carte: 'mbot',
      categorie: 'mbot_afficheur',
      sorte: 'instruction',
      texte: 'afficher le texte %TEXTE',
      champs: { TEXTE: 'texte' },
      defauts: { TEXTE: 'Bonjour' },
      derouler: (p) => {
        const codes = codesTexte(p.texte);
        const morceaux = [];
        for (let i = 0; i < codes.length; i += 4) morceaux.push(codes.slice(i, i + 4));
        if (!morceaux.length) morceaux.push([]);
        return morceaux.map((m, i) => ext(1, i === morceaux.length - 1 ? 15 : 14, m));
      },
    },
    mbot_matrice_nombre: {
      carte: 'mbot',
      categorie: 'mbot_afficheur',
      sorte: 'instruction',
      texte: 'afficher le nombre %VALEUR',
      entrees: { VALEUR: 0 },
      // En centièmes : le mode « En direct » n'envoie que des entiers.
      derouler: (p) => ext(1, 12, [{ bloc: 'operation', op: '×', a: p.valeur, b: 100 }]),
    },
    mbot_matrice_heure: {
      carte: 'mbot',
      categorie: 'mbot_afficheur',
      sorte: 'instruction',
      texte: 'afficher l’heure %HEURES : %MINUTES',
      entrees: { HEURES: 12, MINUTES: 30 },
      derouler: (p) => ext(1, 13, [p.heures, p.minutes]),
    },

    // ----- micro:bit : écran -----
    mb_nombre: { carte: 'microbit', categorie: 'mb_ecran', sorte: 'instruction', texte: 'afficher le nombre %VALEUR', entrees: { VALEUR: 0 }, derouler: (p) => ext(2, 1, [p.valeur]) },
    mb_image: { carte: 'microbit', categorie: 'mb_ecran', sorte: 'instruction', texte: 'afficher l’image %IMAGE', champs: { IMAGE: IMAGES }, derouler: (p) => ext(2, 2, [Number(p.image) || 1]) },
    mb_texte: {
      carte: 'microbit',
      categorie: 'mb_ecran',
      sorte: 'instruction',
      texte: 'faire défiler le texte %TEXTE',
      champs: { TEXTE: 'texte' },
      defauts: { TEXTE: 'Bonjour' },
      // Une commande porte 4 valeurs au plus : le texte part en morceaux de 4 lettres (14), le dernier le fait défiler (11).
      derouler: (p) => {
        const codes = codesTexte(p.texte);
        const morceaux = [];
        for (let i = 0; i < codes.length; i += 4) morceaux.push(codes.slice(i, i + 4));
        if (!morceaux.length) morceaux.push([]);
        return morceaux.map((m, i) => ext(2, i === morceaux.length - 1 ? 11 : 14, m));
      },
    },
    mb_dessin: {
      carte: 'microbit',
      categorie: 'mb_ecran',
      sorte: 'instruction',
      texte: 'afficher le dessin %DESSIN',
      champs: { DESSIN: 'dessin5' },
      defauts: { DESSIN: DESSIN_MICROBIT_DEPART },
      derouler: (p) => ext(2, 15, valeursDessinMicrobit(p.dessin)),
    },
    mb_pixel: {
      carte: 'microbit',
      categorie: 'mb_ecran',
      sorte: 'instruction',
      texte: '%ETAT le point x %X y %Y',
      champs: { ETAT: [['allumer', '9'], ['éteindre', '0']] },
      entrees: { X: 2, Y: 2 },
      derouler: (p) => ext(2, 3, [p.x, p.y, Number(p.etat) || 0]),
    },
    mb_effacer: { carte: 'microbit', categorie: 'mb_ecran', sorte: 'instruction', texte: 'effacer l’écran', derouler: () => ext(2, 4, []) },
    // ----- micro:bit : boutons et gestes -----
    mb_bouton: {
      carte: 'microbit',
      categorie: 'mb_entrees',
      sorte: 'condition',
      texte: 'le bouton %BOUTON est appuyé',
      champs: { BOUTON: [['A', 'A'], ['B', 'B'], ['A et B', 'AB']] },
      derouler: (p) => (p.bouton === 'B' ? cmp('=', ext(2, 6, []), 1) : p.bouton === 'AB' ? { bloc: 'logique', op: 'et', a: cmp('=', ext(2, 5, []), 1), b: cmp('=', ext(2, 6, []), 1) } : cmp('=', ext(2, 5, []), 1)),
    },
    mb_logo: { carte: 'microbit', categorie: 'mb_entrees', sorte: 'condition', texte: 'le logo est touché', derouler: () => cmp('=', ext(2, 9, []), 1) },
    mb_geste: { carte: 'microbit', categorie: 'mb_entrees', sorte: 'condition', texte: 'la carte est %GESTE', champs: { GESTE: GESTES }, derouler: (p) => cmp('=', ext(2, 13, [Number(p.geste) || 1]), 1) },
    // ----- micro:bit : capteurs -----
    mb_acceleration: {
      carte: 'microbit',
      categorie: 'mb_capteurs',
      sorte: 'valeur',
      texte: 'accélération sur l’axe %AXE (mg)',
      champs: { AXE: [['x', '1'], ['y', '2'], ['z', '3']] },
      derouler: (p) => ext(2, 7, [Number(p.axe) || 1]),
    },
    mb_temperature: { carte: 'microbit', categorie: 'mb_capteurs', sorte: 'valeur', texte: 'température (°C)', derouler: () => ext(2, 8, []) },
    mb_lumiere: { carte: 'microbit', categorie: 'mb_capteurs', sorte: 'valeur', texte: 'lumière (0 à 255)', derouler: () => ext(2, 10, []) },
    // ----- micro:bit : son -----
    mb_note: {
      carte: 'microbit',
      categorie: 'mb_son',
      sorte: 'instruction',
      texte: 'jouer la note %NOTE pendant %DUREE s',
      champs: { NOTE: NOTES },
      entrees: { DUREE: 0.5 },
      derouler: (p) => [ext(2, 12, [Number(p.note) || 440, p.duree]), attendre(p.duree)],
    },
  };

  // avancer : les deux roues en avant ; tourner à gauche : la roue gauche recule (comme mBlock).
  function vitesses(direction, v) {
    switch (direction) {
      case 'reculer':
        return [oppose(v), oppose(v)];
      case 'gauche':
        return [oppose(v), v];
      case 'droite':
        return [v, oppose(v)];
      default:
        return [v, v];
    }
  }

  // Catégories de la palette pour ces blocs (famille « extensions » : lilas, pictogramme puzzle).
  const CATEGORIES_CARTES = [
    { nom: 'Caméra', cle: 'camera', carte: '*' },
    { nom: 'Clavier', cle: 'clavier', carte: '*' },
    { nom: 'Moteurs', cle: 'mbot_moteurs', carte: 'mbot' },
    { nom: 'Capteurs', cle: 'mbot_capteurs', carte: 'mbot' },
    { nom: 'LED et son', cle: 'mbot_led_son', carte: 'mbot' },
    { nom: 'Afficheur', cle: 'mbot_afficheur', carte: 'mbot' },
    { nom: 'Écran', cle: 'mb_ecran', carte: 'microbit' },
    { nom: 'Boutons', cle: 'mb_entrees', carte: 'microbit' },
    { nom: 'Capteurs', cle: 'mb_capteurs', carte: 'microbit' },
    { nom: 'Musique', cle: 'mb_son', carte: 'microbit' },
  ].map((c) => Object.assign(c, { blocs: Object.keys(BLOCS).filter((t) => BLOCS[t].categorie === c.cle) }));

  // Bloc de carte → blocs de base (une instruction ou une liste ; une expression pour les valeurs et conditions).
  function derouler(bloc) {
    const d = BLOCS[bloc.bloc];
    if (!d) return null;
    const r = d.derouler(bloc);
    return r;
  }


  // ---------- Carte simulée (micro:bit : écran, boutons, capteurs ; mBot : moteurs, LED, capteurs) ----------
  //
  // Le simulateur (noyau/simulation.js) fait tourner le même code octet ; les commandes d'extension arrivent ici.
  // Boutons : entrées du simulateur nommées « A », « B », « logo » (micro:bit) et « bouton » (mBot), pour que les
  // scénarios puissent les appuyer comme un bouton branché. Moteurs et LED du mBot : sorties « moteur gauche »,
  // « moteur droit » (vitesse en %), « LED gauche », « LED droite » (couleur 0xRRVVBB).

  // Images de la micro:bit (même dessin que MicroPython), 5 lignes de 5 points (0 à 9).
  const DESSINS = {
    1: '00000:09090:00000:90009:09990',
    2: '00000:09090:00000:09990:90009',
    3: '09090:99999:99999:09990:00900',
    4: '00000:00009:00090:90900:09000',
    5: '90009:09090:00900:09090:90009',
    6: '00900:09990:90909:00900:00900',
    7: '00900:00090:99999:00090:00900',
    8: '00900:00900:90909:09990:00900',
    9: '00900:09000:99999:09000:00900',
  };
  const lireDessin = (d) => d.split(':').join('').split('').map(Number);

  // Petite police 5 × 5 pour l'écran simulé (majuscules, chiffres, quelques signes ; minuscules → majuscules).
  const POLICE = {
    ' ': '00000:00000:00000:00000:00000',
    0: '01100:10010:10010:10010:01100',
    1: '00100:01100:00100:00100:01110',
    2: '11100:00010:01100:10000:11110',
    3: '11110:00010:00100:10010:01100',
    4: '00110:01010:10010:11111:00010',
    5: '11111:10000:11110:00001:11110',
    6: '00010:00100:01110:10001:01110',
    7: '11111:00010:00100:01000:10000',
    8: '01110:10001:01110:10001:01110',
    9: '01110:10001:01110:00100:01000',
    A: '01100:10010:11110:10010:10010',
    B: '11100:10010:11100:10010:11100',
    C: '01110:10000:10000:10000:01110',
    D: '11100:10010:10010:10010:11100',
    E: '11110:10000:11100:10000:11110',
    F: '11110:10000:11100:10000:10000',
    G: '01110:10000:10011:10001:01110',
    H: '10010:10010:11110:10010:10010',
    I: '11100:01000:01000:01000:11100',
    J: '11111:00010:00010:10010:01100',
    K: '10010:10100:11000:10100:10010',
    L: '10000:10000:10000:10000:11110',
    M: '10001:11011:10101:10001:10001',
    N: '10001:11001:10101:10011:10001',
    O: '01100:10010:10010:10010:01100',
    P: '11100:10010:11100:10000:10000',
    Q: '01100:10010:10010:01100:00110',
    R: '11100:10010:11100:10010:10001',
    S: '01110:10000:01100:00010:11100',
    T: '11111:00100:00100:00100:00100',
    U: '10010:10010:10010:10010:01100',
    V: '10001:10001:10001:01010:00100',
    W: '10001:10001:10101:11011:10001',
    X: '10010:10010:01100:10010:10010',
    Y: '10001:01010:00100:00100:00100',
    Z: '11110:00100:01000:10000:11110',
    '!': '10000:10000:10000:00000:10000',
    '?': '11100:00010:01100:00000:01000',
    '.': '00000:00000:00000:00000:10000',
    ',': '00000:00000:00000:01000:10000',
    ':': '00000:01000:00000:01000:00000',
    '-': '00000:00000:11100:00000:00000',
    '+': '00000:01000:11100:01000:00000',
    '=': '00000:11100:00000:11100:00000',
    "'": '10000:10000:00000:00000:00000',
    '(': '01000:10000:10000:10000:01000',
    ')': '10000:01000:01000:01000:10000',
    '/': '00001:00010:00100:01000:10000',
    '*': '00000:01010:00100:01010:00000',
  };
  const glyphe = (c) => lireDessin(POLICE[String(c).toUpperCase()] || POLICE['?']).map((v) => v * 9);
  const DUREE_LETTRE = 400; // display.show(texte) : une lettre toutes les 400 ms
  const DUREE_COLONNE = 150; // display.scroll(texte) : une colonne toutes les 150 ms

  const CAPTEURS = {
    microbit: { temperature: 21, lumiere: 128, x: 0, y: 0, z: -1024, geste: 0 },
    mbot: { distance: 100, ligne: 3, lumiere: 500 },
  };
  const capteursDepart = (carte) => Object.assign({}, CAPTEURS[carte] || {});
  const couleurRgb = (r, v, b) => ((r & 255) << 16) | ((v & 255) << 8) | (b & 255);
  const borner = (v, min, max) => Math.max(min, Math.min(max, Math.round(Number(v) || 0)));

  // sim : le simulateur (t, entrees, capteurs, ecrire(nom, valeur, type), son(nom, frequence, ms)).
  function creerCarteSimulee(carte, sim) {
    // matrice : afficheur du mBot (16 colonnes) ; defile : texte qui défile ; dessin : moitié gauche reçue (10).
    const etat = { id: carte, ecran: new Array(25).fill(0), animation: null, lettres: [], matrice: new Array(16).fill(0), defile: null, dessin: new Array(16).fill(0) };
    // Le même texte redonné pendant qu'il défile continue de défiler (comme la carte).
    function afficherMatrice(a) {
      const d = etat.defile;
      if (d && a.colonnes && d.colonnes.join() === a.colonnes.join() && sim.t < d.debut + (d.colonnes.length + 16) * DUREE_COLONNE_MATRICE) return;
      etat.matrice = a.ecran || new Array(16).fill(0);
      etat.defile = a.ecran ? null : a;
    }
    const octets = (v) => [borner(v, 0, 65535) & 255, borner(v, 0, 65535) >> 8];
    // Écran au temps t : l'animation (texte ou nombre de plusieurs chiffres) prend le pas sur les points.
    function poser(points) {
      etat.ecran = points.slice();
      etat.animation = null;
    }
    function ext(e, c, a) {
      if (carte === 'microbit' && e === 2) {
        switch (c) {
          case 1: {
            const v = Number(a[0]) || 0;
            const texte = Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
            if (texte.length === 1) poser(glyphe(texte));
            else etat.animation = { sorte: 'suite', texte, debut: sim.t };
            return 0;
          }
          case 2:
            poser(lireDessin(DESSINS[a[0]] || DESSINS[1]));
            return 0;
          case 3: {
            const ecran = ecranA(etat, sim.t);
            ecran[borner(a[1], 0, 4) * 5 + borner(a[0], 0, 4)] = borner(a[2], 0, 9);
            poser(ecran);
            return 0;
          }
          case 4:
            poser(new Array(25).fill(0));
            return 0;
          case 15: {
            const bits = (v, n) => Array.from({ length: n }, (_, i) => (Math.floor(borner(v, 0, 2 ** n - 1) / 2 ** i) % 2) * 9);
            poser(bits(a[0], 15).concat(bits(a[1], 10)));
            return 0;
          }
          case 5:
            return sim.entrees.A ? 1 : 0;
          case 6:
            return sim.entrees.B ? 1 : 0;
          case 7:
            return Number(sim.capteurs[['x', 'y', 'z'][(Number(a[0]) || 1) - 1] || 'x']) || 0;
          case 8:
            return Number(sim.capteurs.temperature) || 0;
          case 9:
            return sim.entrees.logo ? 1 : 0;
          case 10:
            return Number(sim.capteurs.lumiere) || 0;
          case 14:
            etat.lettres.push(...a);
            return 0;
          case 11:
            etat.animation = { sorte: 'defile', texte: etat.lettres.concat(a).map((x) => String.fromCharCode(x)).join(''), debut: sim.t };
            etat.lettres = [];
            return 0;
          case 12:
            sim.son('haut-parleur', Number(a[0]) || 0, Math.round((Number(a[1]) || 0) * 1000));
            return 0;
          case 13:
            return Number(sim.capteurs.geste) === Number(a[0]) ? 1 : 0;
          default:
            return 0;
        }
      }
      if (carte === 'mbot' && e === 1) {
        switch (c) {
          case 1:
            sim.ecrire('moteur gauche', borner(a[0], -100, 100), 'moteur');
            sim.ecrire('moteur droit', borner(a[1], -100, 100), 'moteur');
            return 0;
          case 9:
            if (Number(a[0]) === 1) sim.ecrire('moteur gauche', borner(a[1], -100, 100), 'moteur');
            else if (Number(a[0]) === 2) sim.ecrire('moteur droit', borner(a[1], -100, 100), 'moteur');
            return 0;
          case 2:
            return Number(sim.capteurs.distance) || 0;
          case 3:
            return borner(sim.capteurs.ligne, 0, 3);
          case 4:
            return sim.entrees.bouton ? 1 : 0;
          case 5:
            return Number(sim.capteurs.lumiere) || 0;
          case 10:
            etat.dessin = [].concat(...a.slice(0, 4).map(octets), etat.dessin.slice(8));
            return 0;
          case 11:
            etat.dessin = etat.dessin.slice(0, 8).concat(...a.slice(0, 4).map(octets));
            afficherMatrice({ ecran: etat.dessin.slice(0, 16) });
            return 0;
          case 12: {
            const n = texteNombre(a[0]);
            afficherMatrice(n.etroit ? { ecran: centrer(colonnesChiffres(n.texte)) } : animationTexte(colonnesTexte(codesTexte(n.texte)), sim.t));
            return 0;
          }
          case 13:
            afficherMatrice({ ecran: colonnesHeure(a[0], a[1]) });
            return 0;
          case 14:
            etat.lettres.push(...a);
            return 0;
          case 15:
            afficherMatrice(animationTexte(colonnesTexte(etat.lettres.concat(a).slice(0, 40).map((x) => borner(x, 0, 255))), sim.t));
            etat.lettres = [];
            return 0;
          case 6: {
            // 0 : les deux, 1 : droite, 2 : gauche (à vérifier sur le robot).
            const couleur = couleurRgb(a[1], a[2], a[3]);
            const quelle = Number(a[0]) || 0;
            if (quelle !== 1) sim.ecrire('LED gauche', couleur, 'rgb');
            if (quelle !== 2) sim.ecrire('LED droite', couleur, 'rgb');
            return 0;
          }
          default:
            return 0;
        }
      }
      return 0;
    }
    return { etat, ext };
  }

  // Les 25 points de l'écran de la micro:bit au temps t (0 à 9).
  function ecranA(etat, t) {
    const a = etat && etat.animation;
    if (!a) return etat ? etat.ecran.slice() : new Array(25).fill(0);
    const ecoule = Math.max(0, t - a.debut);
    if (a.sorte === 'suite') {
      // Les chiffres l'un après l'autre ; le dernier reste affiché.
      const i = Math.min(a.texte.length - 1, Math.floor(ecoule / DUREE_LETTRE));
      return glyphe(a.texte[i]);
    }
    // Texte qui défile de droite à gauche : chaque lettre fait 5 colonnes, suivies d'une colonne vide.
    const colonnes = [];
    for (const lettre of a.texte) {
      const g = glyphe(lettre);
      for (let x = 0; x < 5; x++) colonnes.push([0, 1, 2, 3, 4].map((y) => g[y * 5 + x]));
      colonnes.push([0, 0, 0, 0, 0]);
    }
    const debut = Math.floor(ecoule / DUREE_COLONNE) - 5; // entre par la droite
    const ecran = new Array(25).fill(0);
    for (let x = 0; x < 5; x++) {
      const col = colonnes[debut + x];
      if (col) for (let y = 0; y < 5; y++) ecran[y * 5 + x] = col[y];
    }
    return ecran;
  }

  // Les 16 colonnes de l'afficheur du mBot au temps t. Un texte trop long entre par la droite et sort par la gauche,
  // une fois ; l'afficheur est vide ensuite.
  function matriceA(etat, t) {
    const d = etat && etat.defile;
    if (!d) return etat && etat.matrice ? etat.matrice.slice() : new Array(16).fill(0);
    const decalage = Math.floor(Math.max(0, t - d.debut) / DUREE_COLONNE_MATRICE) - 16;
    return Array.from({ length: 16 }, (_, x) => d.colonnes[decalage + x] || 0);
  }

  // Ce qui est déjà sur la carte (pas à brancher) : les scénarios de test peuvent l'appuyer ou le vérifier comme un
  // composant. libelle : son nom dans les phrases (« Quand le bouton A est appuyé… »).
  const COMPOSANTS_CARTE = {
    microbit: [
      { type: 'bouton', broche: 'A', libelle: 'le bouton A', integre: true },
      { type: 'bouton', broche: 'B', libelle: 'le bouton B', integre: true },
      { type: 'bouton', broche: 'logo', libelle: 'le logo', integre: true },
    ],
    mbot: [
      { type: 'bouton', broche: 'bouton', libelle: 'le bouton de la carte', integre: true },
      { type: 'moteur', broche: 'moteur gauche', libelle: 'le moteur gauche', integre: true },
      { type: 'moteur', broche: 'moteur droit', libelle: 'le moteur droit', integre: true },
    ],
  };
  const composantsCarte = (carte) => (COMPOSANTS_CARTE[carte] || []).map((c) => Object.assign({}, c));

  // Capteurs réglables à la main (simulateur) ou par un scénario de test ({ regler: { distance: 10 } }).
  const LIGNE = [
    ['noir sous les deux capteurs', 0],
    ['noir à gauche seulement', 1],
    ['noir à droite seulement', 2],
    ['blanc sous les deux capteurs', 3],
  ];
  const CAPTEURS_CARTE = {
    microbit: [
      { nom: 'temperature', libelle: 'température', unite: '°C', min: -10, max: 50 },
      { nom: 'lumiere', libelle: 'lumière', unite: '', min: 0, max: 255 },
      { nom: 'x', libelle: 'accélération x', unite: 'mg', min: -1024, max: 1024 },
      { nom: 'y', libelle: 'accélération y', unite: 'mg', min: -1024, max: 1024 },
      { nom: 'z', libelle: 'accélération z', unite: 'mg', min: -1024, max: 1024 },
      { nom: 'geste', libelle: 'geste', options: [['aucun', 0]].concat(GESTES.map(([t, v]) => [t, Number(v)])) },
    ],
    mbot: [
      { nom: 'distance', libelle: 'distance (ultrasons)', unite: 'cm', min: 2, max: 400 },
      { nom: 'ligne', libelle: 'suiveur de ligne', options: LIGNE },
      { nom: 'lumiere', libelle: 'lumière', unite: '', min: 0, max: 1023 },
    ],
  };
  const capteursCarte = (carte) => CAPTEURS_CARTE[carte] || [];

  // « l’obstacle est à 10 cm », « la température est de 30 °C » (phrases des scénarios).
  function decrireCapteur(nom, valeur) {
    const v = String(valeur).replace('.', ',');
    switch (nom) {
      case 'distance':
        return `l’obstacle est à ${v} cm`;
      case 'ligne':
        return `le suiveur de ligne voit ${((LIGNE.find((l) => l[1] === Number(valeur)) || LIGNE[3])[0]).replace('noir', 'du noir').replace('blanc', 'du blanc')}`;
      case 'lumiere':
        return `la lumière vaut ${v}`;
      case 'temperature':
        return `la température est de ${v} °C`;
      case 'camera':
        return Number(valeur) ? `la caméra reconnaît l’étiquette ${v}` : 'la caméra ne reconnaît rien';
      case 'joystick': {
        const d = CODES_JOYSTICK[Number(valeur)] || 'centre';
        return d === 'centre' ? 'le joystick est au centre' : `le joystick est poussé ${DIRECTIONS_JOYSTICK.find((x) => x[1] === d)[0]}`;
      }
      case 'geste': {
        const g = GESTES.find((x) => Number(x[1]) === Number(valeur));
        return g ? `la carte est ${g[0]}` : 'la carte est immobile';
      }
      default:
        return `l’accélération sur ${nom} vaut ${v} mg`;
    }
  }

  // Nom d'une couleur de LED du mBot (jamais la couleur seule à l'écran).
  function nomCouleur(rgb) {
    const r = (rgb >> 16) & 255;
    const v = (rgb >> 8) & 255;
    const b = rgb & 255;
    for (const [nom, c] of Object.entries(COULEURS_LED)) if (c[0] === r && c[1] === v && c[2] === b) return nom === 'eteinte' ? 'éteinte' : nom;
    return `rouge ${r}, vert ${v}, bleu ${b}`;
  }

  const api = { VERSION_FIRMWARE, PROFILS, profil, BLOCS_CARTES: BLOCS, CATEGORIES_CARTES, deroulerBlocCarte: derouler, codesTexte, NOTES, matriceA, lireDessinMatrice, texteNombre, colonnesTexte, colonnesChiffres, colonnesHeure, POLICE_MATRICE, CHIFFRES_MATRICE, DESSIN_DEPART, DUREE_COLONNE_MATRICE, DESSIN_MICROBIT_DEPART, lireDessinMicrobit, valeursDessinMicrobit, IMAGES, GESTES, COULEURS_LED, creerCarteSimulee, ecranA, capteursDepart, nomCouleur, composantsCarte, capteursCarte, decrireCapteur, TOUCHES, codeTouche, toucheDuCode, toucheDuClavier, entreeTouche, composantsClavier, BLOCS_CLAVIER, JOYSTICK_DEPART, DIRECTIONS_JOYSTICK, SEUIL_JOYSTICK, CODES_JOYSTICK, BLOCS_JOYSTICK, joystickDe, nouveauJoystick, brutsJoystick, deroulerJoystick, composantsJoystick };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/programme.js =====
// Conversion entre la sauvegarde Blockly (JSON) et le programme de Labo Blocs (format v1, docs/PLAN.md §3).
// Aucun besoin de Blockly ici : on lit et on écrit le JSON de Blockly.serialization.workspaces.
// Les types et les noms de champs des blocs de l'atelier du distributeur sont gardés : ses sauvegardes se relisent.
//
// Programme v1 :
//   { format: 'labo-blocs/programme', version: 1,
//     fils: [ { quand: 'demarrage' | 'boucle' | 'appui' | 'relache', broche?, corps: [instruction…] }
//             { quand: 'camera', etiquette: n° (0 = rien), front: 'voit' | 'plus', corps }  (caméra : jalon 6)
//             { quand: 'touche', touche: 'haut' | 'espace' | 'a' | '0'…, front: 'appui' | 'relache', corps }
//             { quand: 'joystick', direction: 'haut' | 'bas' | 'gauche' | 'droite' | 'centre', corps } ],
//     notes?: [ { texte, x, y, largeur?, hauteur? } ] }  (clavier ; notes : commentaires posés dans l'espace des blocs)
// Tout bloc (instruction, expression, fil) peut porter « commentaire » : le texte de son commentaire Blockly.
// Instructions : led_etat, attendre, servo_angle, affecter, ajouter_a, si_alors, si_sinon, repeter_n, tant_que,
//   repeter_jusqua, son ; expressions : nombre, variable, bouton_etat, valeur_haut_bas, comparaison, operation,
//   logique, non, hasard (détail : noyau/code-octet.js). Chaque nœud venu de Blockly porte son « id ».
// L'ancien « programme simplifié » de l'atelier { demarrage, boucle } se lit aussi (versV1).

(function (global) {
  'use strict';

  const FORMAT = 'labo-blocs/programme';
  const VERSION = 1;

  const COMPARAISONS = { EQ: '=', NEQ: '≠', LT: '<', LTE: '≤', GT: '>', GTE: '≥' };
  const OPERATIONS = { ADD: '+', SUB: '-', MUL: '×', DIV: '÷', MOD: 'mod' };
  const inverse = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));
  const COMPARAISONS_BLOCKLY = inverse(COMPARAISONS);
  const OPERATIONS_BLOCKLY = inverse(OPERATIONS);

  // Entrées « nombre » des blocs et valeur de leur bloc fantôme.
  const ENTREES_NOMBRE = {
    attendre: { DUREE: 1 },
    servo_angle: { ANGLE: 90 },
    affecter: { VALEUR: 0 },
    ajouter_a: { VALEUR: 1 },
    repeter_n: { FOIS: 3 },
    son: { FREQUENCE: 440, DUREE: 0.5 },
    hasard: { MIN: 1, MAX: 6 },
    reetalonner: { VALEUR: 0, DE_MIN: 0, DE_MAX: 1023, VERS_MIN: 0, VERS_MAX: 180 },
    operation: { A: 0, B: 0 },
  };

  function entree(bloc, nom) {
    const e = bloc.inputs && bloc.inputs[nom];
    return e ? e.block || e.shadow || null : null;
  }
  const champ = (bloc, nom) => (bloc.fields ? bloc.fields[nom] : undefined);

  // Description des blocs des cartes (mBot, micro:bit), lue au moment de l'utiliser.
  const CARTES = () => (typeof module === 'object' && module.exports ? require('./cartes.js') : global.LaboBlocs);

  // Programme simplifié de l'atelier → v1 (un v1 est rendu tel quel).
  function versV1(p) {
    if (p && Array.isArray(p.fils)) return p;
    const v1 = {
      format: FORMAT,
      version: VERSION,
      fils: [
        { quand: 'demarrage', corps: (p && p.demarrage) || [] },
        { quand: 'boucle', corps: (p && p.boucle) || [] },
      ],
    };
    if (p && Array.isArray(p.notes) && p.notes.length) v1.notes = p.notes;
    return v1;
  }

  // v1 → programme simplifié de l'atelier { demarrage, boucle } (outils des projets qui lisent encore ce format).
  // Les autres fils (« quand on appuie… ») sont gardés à part dans « fils ».
  function versSimplifie(p) {
    if (!p || !Array.isArray(p.fils)) return p;
    const corps = (quand) => p.fils.filter((f) => f.quand === quand).flatMap((f) => f.corps || []);
    const autres = p.fils.filter((f) => f.quand !== 'demarrage' && f.quand !== 'boucle');
    const r = { demarrage: corps('demarrage'), boucle: corps('boucle') };
    if (autres.length) r.fils = autres;
    if (Array.isArray(p.notes) && p.notes.length) r.notes = p.notes;
    return r;
  }

  // Lit une sauvegarde Blockly. Renvoie le programme v1, les blocs restés seuls hors du programme et les blocs
  // incomplets (une entrée vide).
  function depuisBlockly(sauvegarde) {
    const hauts = (sauvegarde && sauvegarde.blocks && sauvegarde.blocks.blocks) || [];
    const fils = [];
    const horsProgramme = [];
    const incomplets = [];
    let demarrage = false;
    let boucle = false;

    // Commentaire Blockly d'un bloc (clic droit › « Ajouter un commentaire ») : gardé dans « commentaire ».
    function commenter(n, b) {
      const texte = b && b.icons && b.icons.comment && b.icons.comment.text;
      if (n && typeof texte === 'string' && texte.trim()) n.commentaire = texte;
      return n;
    }

    function pile(bloc) {
      const liste = [];
      for (let b = bloc; b; b = b.next && b.next.block) {
        const i = commenter(instruction(b), b);
        if (i) liste.push(i);
      }
      return liste;
    }

    const expression = (bloc, parent) => commenter(expressionSeule(bloc, parent), bloc);
    function expressionSeule(bloc, parent) {
      if (!bloc) {
        incomplets.push(parent.id);
        return null;
      }
      const e = { id: bloc.id };
      switch (bloc.type) {
        case 'nombre':
          return Object.assign(e, { bloc: 'nombre', valeur: Number(champ(bloc, 'NUM')) || 0 });
        case 'variable':
          return Object.assign(e, { bloc: 'variable', variable: champ(bloc, 'VAR') || 'CHOIX' });
        case 'bouton_etat':
          return Object.assign(e, { bloc: 'bouton_etat', broche: champ(bloc, 'BROCHE') });
        case 'valeur_haut_bas':
          return Object.assign(e, { bloc: 'valeur_haut_bas', valeur: Number(champ(bloc, 'VALEUR')) ? 1 : 0 });
        case 'comparaison':
          return Object.assign(e, {
            bloc: 'comparaison',
            op: COMPARAISONS[champ(bloc, 'OP')] || '=',
            a: expression(entree(bloc, 'A'), bloc),
            b: expression(entree(bloc, 'B'), bloc),
          });
        case 'operation':
          return Object.assign(e, {
            bloc: 'operation',
            op: OPERATIONS[champ(bloc, 'OP')] || '+',
            a: expression(entree(bloc, 'A'), bloc),
            b: expression(entree(bloc, 'B'), bloc),
          });
        case 'logique':
          return Object.assign(e, { bloc: 'logique', op: champ(bloc, 'OP') === 'OU' ? 'ou' : 'et', a: expression(entree(bloc, 'A'), bloc), b: expression(entree(bloc, 'B'), bloc) });
        case 'non':
          return Object.assign(e, { bloc: 'non', a: expression(entree(bloc, 'A'), bloc) });
        case 'hasard':
          return Object.assign(e, { bloc: 'hasard', min: expression(entree(bloc, 'MIN'), bloc), max: expression(entree(bloc, 'MAX'), bloc) });
        case 'reetalonner':
          return Object.assign(e, {
            bloc: 'reetalonner',
            valeur: expression(entree(bloc, 'VALEUR'), bloc),
            de1: expression(entree(bloc, 'DE_MIN'), bloc),
            de2: expression(entree(bloc, 'DE_MAX'), bloc),
            vers1: expression(entree(bloc, 'VERS_MIN'), bloc),
            vers2: expression(entree(bloc, 'VERS_MAX'), bloc),
          });
        case 'joystick_position':
          return Object.assign(e, { bloc: 'joystick_position', axe: champ(bloc, 'AXE') === 'y' ? 'y' : 'x' });
        case 'joystick_valeur':
          return Object.assign(e, { bloc: 'joystick_valeur', axe: champ(bloc, 'AXE') === 'y' ? 'y' : 'x' });
        case 'joystick_direction':
          return Object.assign(e, { bloc: 'joystick_direction', direction: champ(bloc, 'DIRECTION') || 'haut' });
        case 'joystick_bouton':
          return Object.assign(e, { bloc: 'joystick_bouton' });
        default:
          return blocCarte(bloc, e, ['valeur', 'condition']);
      }
    }

    // Bloc d'une carte (noyau/cartes.js) : ses champs et ses entrées, nommés en minuscules (DIRECTION → direction).
    function blocCarte(bloc, e, sortes) {
      const d = CARTES().BLOCS_CARTES[bloc.type];
      if (!d || !sortes.includes(d.sorte)) return null;
      e.bloc = bloc.type;
      for (const nom of Object.keys(d.champs || {})) e[nom.toLowerCase()] = champ(bloc, nom);
      for (const nom of Object.keys(d.entrees || {})) e[nom.toLowerCase()] = expression(entree(bloc, nom), bloc);
      return e;
    }

    function instruction(b) {
      const i = { bloc: b.type, id: b.id };
      switch (b.type) {
        case 'led_etat':
          return Object.assign(i, { broche: champ(b, 'BROCHE'), etat: Number(champ(b, 'ETAT')) ? 1 : 0 });
        case 'attendre':
          return Object.assign(i, { duree: expression(entree(b, 'DUREE'), b) });
        case 'servo_angle':
          return Object.assign(i, { broche: champ(b, 'BROCHE'), angle: expression(entree(b, 'ANGLE'), b) });
        case 'affecter':
        case 'ajouter_a':
          return Object.assign(i, { variable: champ(b, 'VAR') || 'CHOIX', valeur: expression(entree(b, 'VALEUR'), b) });
        case 'si_alors':
          return Object.assign(i, { condition: expression(entree(b, 'CONDITION'), b), alors: pile(entree(b, 'ALORS')) });
        case 'si_sinon':
          return Object.assign(i, {
            condition: expression(entree(b, 'CONDITION'), b),
            alors: pile(entree(b, 'ALORS')),
            sinon: pile(entree(b, 'SINON')),
          });
        case 'repeter_n':
          return Object.assign(i, { fois: expression(entree(b, 'FOIS'), b), corps: pile(entree(b, 'DO')) });
        case 'tant_que':
        case 'repeter_jusqua':
          return Object.assign(i, { condition: expression(entree(b, 'CONDITION'), b), corps: pile(entree(b, 'DO')) });
        case 'son':
          return Object.assign(i, { broche: champ(b, 'BROCHE'), frequence: expression(entree(b, 'FREQUENCE'), b), duree: expression(entree(b, 'DUREE'), b) });
        default:
          return blocCarte(b, i, ['instruction']);
      }
    }

    for (const b of hauts) {
      if (b.type === 'demarrage' && !demarrage) {
        demarrage = true;
        fils.push({ quand: 'demarrage', id: b.id, corps: pile(entree(b, 'DO')) });
      } else if (b.type === 'boucle' && !boucle) {
        boucle = true;
        fils.push({ quand: 'boucle', id: b.id, corps: pile(entree(b, 'DO')) });
      } else if (b.type === 'quand_bouton') {
        fils.push({ quand: champ(b, 'FRONT') === 'relache' ? 'relache' : 'appui', broche: champ(b, 'BROCHE'), id: b.id, corps: pile(entree(b, 'DO')) });
      } else if (b.type === 'quand_joystick') {
        fils.push({ quand: 'joystick', direction: champ(b, 'DIRECTION') || 'haut', id: b.id, corps: pile(entree(b, 'DO')) });
      } else if (b.type === 'quand_touche') {
        fils.push({ quand: 'touche', touche: champ(b, 'TOUCHE') || 'espace', front: champ(b, 'FRONT') === 'relache' ? 'relache' : 'appui', id: b.id, corps: pile(entree(b, 'DO')) });
      } else if (b.type === 'quand_camera') {
        fils.push({ quand: 'camera', etiquette: Number(champ(b, 'ETIQUETTE')) || 0, front: champ(b, 'FRONT') === 'plus' ? 'plus' : 'voit', id: b.id, corps: pile(entree(b, 'DO')) });
      } else {
        horsProgramme.push(b.id);
        continue;
      }
      commenter(fils[fils.length - 1], b);
    }
    // « Au démarrage » d'abord, comme sur la carte.
    fils.sort((a, b) => (a.quand === 'demarrage' ? -1 : b.quand === 'demarrage' ? 1 : 0));
    const programme = { format: FORMAT, version: VERSION, fils };
    // Notes posées dans l'espace des blocs (clic droit dans le vide › « Ajouter un commentaire », ou le bouton).
    const notes = ((sauvegarde && sauvegarde.workspaceComments) || [])
      .filter((c) => typeof c.text === 'string' && c.text.trim())
      .map((c) => ({ texte: c.text, x: Math.round(Number(c.x) || 0), y: Math.round(Number(c.y) || 0), largeur: Math.round(Number(c.width) || 200), hauteur: Math.round(Number(c.height) || 100) }));
    if (notes.length) programme.notes = notes;
    return { programme, horsProgramme, incomplets };
  }

  // Écrit un programme (v1 ou atelier) en sauvegarde Blockly (blocs de départ, solution de référence, indice 3).
  function versBlockly(programme, options) {
    const opts = options || {};
    let compteur = 0;
    const nouvelId = () => (opts.prefixe || 'b') + ++compteur;

    function nombreBloc(valeur) {
      return { type: 'nombre', id: nouvelId(), fields: { NUM: Number(valeur) || 0 } };
    }

    // Commentaire d'un nœud → commentaire Blockly, ouvert (le professeur s'en sert pour donner une information).
    function commenter(b, n) {
      if (b && n && typeof n.commentaire === 'string' && n.commentaire.trim()) b.icons = { comment: { text: n.commentaire, pinned: true, height: 80, width: 200 } };
      return b;
    }
    const expression = (e) => commenter(expressionSeule(e), e);
    function expressionSeule(e) {
      if (e === null || e === undefined) return null;
      if (typeof e === 'number') return nombreBloc(e);
      const id = e.id || nouvelId();
      const deux = (type, op, a, b) => {
        const bloc = { type, id, fields: { OP: op }, inputs: {} };
        entreeValeur(bloc, 'A', a);
        entreeValeur(bloc, 'B', b);
        return bloc;
      };
      switch (e.bloc) {
        case 'nombre':
          return { type: 'nombre', id, fields: { NUM: Number(e.valeur) || 0 } };
        case 'variable':
          return { type: 'variable', id, fields: { VAR: e.variable || 'CHOIX' } };
        case 'bouton_etat':
          return { type: 'bouton_etat', id, fields: { BROCHE: e.broche } };
        case 'valeur_haut_bas':
          return { type: 'valeur_haut_bas', id, fields: { VALEUR: e.valeur ? '1' : '0' } };
        case 'comparaison':
          return deux('comparaison', COMPARAISONS_BLOCKLY[e.op] || 'EQ', e.a, e.b);
        case 'operation':
          return deux('operation', OPERATIONS_BLOCKLY[e.op] || 'ADD', e.a, e.b);
        case 'logique':
          return deux('logique', e.op === 'ou' ? 'OU' : 'ET', e.a, e.b);
        case 'non': {
          const bloc = { type: 'non', id, inputs: {} };
          entreeValeur(bloc, 'A', e.a);
          return bloc;
        }
        case 'joystick_position':
          return { type: 'joystick_position', id, fields: { AXE: e.axe === 'y' ? 'y' : 'x' } };
        case 'joystick_valeur':
          return { type: 'joystick_valeur', id, fields: { AXE: e.axe === 'y' ? 'y' : 'x' } };
        case 'joystick_direction':
          return { type: 'joystick_direction', id, fields: { DIRECTION: e.direction || 'haut' } };
        case 'joystick_bouton':
          return { type: 'joystick_bouton', id };
        case 'hasard': {
          const bloc = { type: 'hasard', id, inputs: {} };
          entreeNombre(bloc, 'MIN', e.min);
          entreeNombre(bloc, 'MAX', e.max);
          return bloc;
        }
        case 'reetalonner': {
          const bloc = { type: 'reetalonner', id, inputs: {} };
          entreeNombre(bloc, 'VALEUR', e.valeur);
          entreeNombre(bloc, 'DE_MIN', e.de1);
          entreeNombre(bloc, 'DE_MAX', e.de2);
          entreeNombre(bloc, 'VERS_MIN', e.vers1);
          entreeNombre(bloc, 'VERS_MAX', e.vers2);
          return bloc;
        }
        default:
          return versBlocCarte({ type: e.bloc, id, inputs: {} }, e);
      }
    }

    function versBlocCarte(b, p) {
      const d = CARTES().BLOCS_CARTES[b.type];
      if (!d) return null;
      const champs = Object.keys(d.champs || {});
      if (champs.length) b.fields = {};
      for (const nom of champs) {
        const v = p[nom.toLowerCase()];
        const options = d.champs[nom];
        b.fields[nom] = v !== undefined && v !== null ? String(v) : Array.isArray(options) ? options[0][1] : (d.defauts || {})[nom] || '';
      }
      for (const nom of Object.keys(d.entrees || {})) entreeNombre(b, nom, p[nom.toLowerCase()] === undefined ? d.entrees[nom] : p[nom.toLowerCase()]);
      if (!Object.keys(b.inputs).length) delete b.inputs;
      return b;
    }

    function entreeValeur(bloc, nom, e) {
      const b = expression(e);
      if (b) bloc.inputs[nom] = { block: b };
    }

    // Entrée « nombre » : un nombre devient le bloc fantôme, une autre expression se pose dessus.
    function entreeNombre(bloc, nom, e) {
      const defaut = (ENTREES_NOMBRE[bloc.type] || (CARTES().BLOCS_CARTES[bloc.type] || {}).entrees || {})[nom] || 0;
      if (typeof e === 'number' || (e && e.bloc === 'nombre')) {
        bloc.inputs[nom] = { shadow: expressionSeule(e) }; // un bloc fantôme ne porte pas de commentaire
      } else {
        bloc.inputs[nom] = { shadow: nombreBloc(defaut) };
        const b = expression(e);
        if (b) bloc.inputs[nom].block = b;
      }
    }

    function corps(bloc, nom, liste) {
      const p = pile(liste);
      if (p) bloc.inputs[nom] = { block: p };
    }

    function instruction(i) {
      const b = { type: i.bloc, id: i.id || nouvelId(), inputs: {} };
      switch (i.bloc) {
        case 'led_etat':
          b.fields = { ETAT: i.etat ? '1' : '0', BROCHE: i.broche };
          break;
        case 'attendre':
          entreeNombre(b, 'DUREE', i.duree);
          break;
        case 'servo_angle':
          b.fields = { BROCHE: i.broche };
          entreeNombre(b, 'ANGLE', i.angle);
          break;
        case 'affecter':
        case 'ajouter_a':
          b.fields = { VAR: i.variable || 'CHOIX' };
          entreeNombre(b, 'VALEUR', i.valeur);
          break;
        case 'si_alors':
        case 'si_sinon':
          entreeValeur(b, 'CONDITION', i.condition);
          corps(b, 'ALORS', i.alors);
          if (i.bloc === 'si_sinon') corps(b, 'SINON', i.sinon);
          break;
        case 'repeter_n':
          entreeNombre(b, 'FOIS', i.fois);
          corps(b, 'DO', i.corps);
          break;
        case 'tant_que':
        case 'repeter_jusqua':
          entreeValeur(b, 'CONDITION', i.condition);
          corps(b, 'DO', i.corps);
          break;
        case 'son':
          b.fields = { BROCHE: i.broche };
          entreeNombre(b, 'FREQUENCE', i.frequence);
          entreeNombre(b, 'DUREE', i.duree);
          break;
        default:
          return versBlocCarte(b, i);
      }
      if (!Object.keys(b.inputs).length) delete b.inputs;
      return b;
    }

    function pile(liste) {
      let premier = null;
      let dernier = null;
      for (const i of liste || []) {
        const b = commenter(instruction(i), i);
        if (!b) continue;
        if (dernier) dernier.next = { block: b };
        else premier = b;
        dernier = b;
      }
      return premier;
    }

    const v1 = versV1(programme);
    const blocs = [];
    let y = 24;
    const trouver = (q) => v1.fils.find((f) => f.quand === q);
    // « Au démarrage » et « Répéter indéfiniment » sont toujours là (on ne peut pas les supprimer).
    const ordre = [trouver('demarrage') || { quand: 'demarrage', corps: [] }, trouver('boucle') || { quand: 'boucle', corps: [] }, ...v1.fils.filter((f) => f.quand === 'appui' || f.quand === 'relache' || f.quand === 'camera' || f.quand === 'touche' || f.quand === 'joystick')];
    for (const f of ordre) {
      const evenement = f.quand === 'appui' || f.quand === 'relache';
      const b = f.quand === 'joystick'
        ? { type: 'quand_joystick', id: f.id || nouvelId(), x: 24, y, fields: { DIRECTION: f.direction || 'haut' } }
        : f.quand === 'touche'
        ? { type: 'quand_touche', id: f.id || nouvelId(), x: 24, y, fields: { TOUCHE: f.touche || 'espace', FRONT: f.front === 'relache' ? 'relache' : 'appui' } }
        : f.quand === 'camera'
        ? { type: 'quand_camera', id: f.id || nouvelId(), x: 24, y, fields: { ETIQUETTE: String(f.etiquette || 0), FRONT: f.front === 'plus' ? 'plus' : 'voit' } }
        : evenement
          ? { type: 'quand_bouton', id: f.id || nouvelId(), x: 24, y, fields: { BROCHE: f.broche, FRONT: f.quand } }
          : { type: f.quand, id: f.quand, x: 24, y, deletable: false };
      const p = pile(f.corps);
      if (p) b.inputs = { DO: { block: p } };
      commenter(b, f);
      blocs.push(b);
      y += 76 + Math.max(1, compterBlocs(f.corps)) * 44 + 28;
    }
    const sauvegarde = { blocks: { languageVersion: 0, blocks: blocs } };
    if (Array.isArray(v1.notes) && v1.notes.length) {
      sauvegarde.workspaceComments = v1.notes.map((n) => ({ id: nouvelId(), text: String(n.texte || ''), x: Number(n.x) || 0, y: Number(n.y) || 0, width: Number(n.largeur) || 200, height: Number(n.hauteur) || 100 }));
    }
    return sauvegarde;
  }

  function compterBlocs(liste) {
    let n = 0;
    for (const i of liste || []) {
      n += 1;
      for (const k of ['alors', 'sinon', 'corps']) if (i[k]) n += 1 + compterBlocs(i[k]);
    }
    return n;
  }

  // Remplace les chaînes « $nom » par la valeur du paramètre du parcours (ex. « $dureeGrandeDose »).
  function appliquerParametres(valeur, parametres) {
    if (typeof valeur === 'string' && valeur[0] === '$') {
      const nom = valeur.slice(1);
      if (!parametres || !(nom in parametres)) throw new Error('Paramètre inconnu : ' + valeur);
      return parametres[nom];
    }
    if (Array.isArray(valeur)) return valeur.map((v) => appliquerParametres(v, parametres));
    if (valeur && typeof valeur === 'object') {
      const copie = {};
      for (const k of Object.keys(valeur)) copie[k] = appliquerParametres(valeur[k], parametres);
      return copie;
    }
    return valeur;
  }

  // Types de blocs utilisés par un programme (indice 3, tableau du professeur).
  function typesDeBlocs(programme) {
    const types = [];
    const voir = (x) => {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(voir);
      if (x.bloc) types.push(x.bloc);
      if (x.quand) types.push(x.quand === 'appui' || x.quand === 'relache' ? 'quand_bouton' : x.quand === 'camera' ? 'quand_camera' : x.quand === 'touche' ? 'quand_touche' : x.quand === 'joystick' ? 'quand_joystick' : x.quand);
      for (const v of Object.values(x)) if (v && typeof v === 'object') voir(v);
    };
    voir(versV1(programme).fils);
    return types;
  }

  // Exercice libre (Arduino Uno) : les composants que le programme utilise, dans l'ordre où ils apparaissent.
  //   → { composants: [{ type, broche, conflit? }], conflits: [{ broche, types: ['led', 'bouton'] }] }
  // Une broche employée pour deux sortes de composants est un conflit : les deux composants restent (l'élève les voit
  // dans le simulateur), marqués « conflit », et le conflit est signalé.
  const SORTE_DU_BLOC = { led_etat: 'led', servo_angle: 'servo', son: 'buzzer', bouton_etat: 'bouton' };
  // carte : celle de l'exercice (le joystick se branche sur A0, A1, D2 sur l'Uno ; P0, P1, P2 sur la micro:bit).
  function composantsDuProgramme(programme, carte) {
    const composants = [];
    let joystick = false;
    const voir = (type, broche) => {
      if (!broche || composants.some((c) => c.type === type && c.broche === broche)) return;
      composants.push({ type, broche });
    };
    (function parcourir(x) {
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (!x || typeof x !== 'object') return;
      if (x.quand === 'appui' || x.quand === 'relache') voir('bouton', x.broche);
      if (SORTE_DU_BLOC[x.bloc]) voir(SORTE_DU_BLOC[x.bloc], x.broche);
      if (x.quand === 'joystick' || CARTES().BLOCS_JOYSTICK.includes(x.bloc)) joystick = true;
      for (const k of Object.keys(x)) if (x[k] && typeof x[k] === 'object') parcourir(x[k]);
    })(programme ? versV1(programme).fils : []);
    if (joystick) composants.push(CARTES().nouveauJoystick(carte));
    const conflits = [];
    for (const c of composants) {
      const memes = composants.filter((x) => x.broche === c.broche);
      if (memes.length < 2) continue;
      c.conflit = true;
      if (!conflits.some((x) => x.broche === c.broche)) conflits.push({ broche: c.broche, types: memes.map((x) => x.type) });
    }
    return { composants, conflits };
  }

  // Nom d'une variable créée par un élève (« ma vitesse » → « ma_vitesse ») : lettres sans accent, chiffres et « _ »,
  // une lettre au début, 16 caractères au plus, pas un mot du langage Arduino, pas déjà pris (majuscules comprises).
  //   → { ok, nom } ou { ok: false, message }
  const MOTS_RESERVES = new Set(
    'if else for while do switch case break continue return int float long char bool boolean byte void true false const static setup loop delay millis digitalWrite digitalRead analogRead analogWrite pinMode tone noTone random HIGH LOW INPUT OUTPUT Serial Servo'
      .toLowerCase()
      .split(' '),
  );
  function nomDeVariable(texte, existantes) {
    const nom = String(texte || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s'’-]+/g, '_')
      .replace(/[^A-Za-z0-9_]/g, '');
    if (!nom) return { ok: false, message: 'Écris un nom pour ta variable (par exemple : vitesse).' };
    if (!/^[A-Za-z]/.test(nom)) return { ok: false, message: 'Le nom d’une variable commence par une lettre.' };
    if (nom.length > 16) return { ok: false, message: 'Ce nom est trop long : 16 lettres au plus.' };
    if (MOTS_RESERVES.has(nom.toLowerCase())) return { ok: false, message: `« ${nom} » est déjà un mot du langage de la carte : choisis un autre nom.` };
    if ((existantes || []).some((v) => v.toLowerCase() === nom.toLowerCase())) return { ok: false, message: `La variable « ${nom} » existe déjà.` };
    return { ok: true, nom };
  }

  // Noms des variables d'une sauvegarde Blockly (champs VAR), pour que les menus les connaissent avant le chargement.
  function variablesDeSauvegarde(sauvegarde) {
    const noms = new Set();
    (function parcourir(x) {
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (!x || typeof x !== 'object') return;
      if (x.fields && typeof x.fields.VAR === 'string' && x.fields.VAR) noms.add(x.fields.VAR);
      for (const k of Object.keys(x)) if (x[k] && typeof x[k] === 'object') parcourir(x[k]);
    })(sauvegarde);
    return [...noms];
  }

  // Le programme utilise-t-il la caméra (événement « quand la caméra… » ou bloc de la caméra) ?
  function utiliseCamera(programme) {
    let oui = false;
    (function parcourir(x) {
      if (oui || !x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (x.quand === 'camera' || (typeof x.bloc === 'string' && x.bloc.indexOf('camera_') === 0) || (x.bloc === 'ext' && x.extension === 3)) oui = true;
      for (const k of Object.keys(x)) if (x[k] && typeof x[k] === 'object') parcourir(x[k]);
    })(programme ? versV1(programme).fils : []);
    return oui;
  }

  // Le programme utilise-t-il le clavier de l'ordinateur (« quand la touche … » ou « la touche … est appuyée ») ?
  function utiliseClavier(programme) {
    let oui = false;
    (function parcourir(x) {
      if (oui || !x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (x.quand === 'touche' || x.bloc === 'touche_appuyee' || (x.bloc === 'ext' && x.extension === 4)) oui = true;
      for (const k of Object.keys(x)) if (x[k] && typeof x[k] === 'object') parcourir(x[k]);
    })(programme ? versV1(programme).fils : []);
    return oui;
  }

  const api = { utiliseCamera, utiliseClavier, nomDeVariable, variablesDeSauvegarde, composantsDuProgramme, depuisBlockly, versBlockly, versV1, versSimplifie, appliquerParametres, typesDeBlocs, FORMAT_PROGRAMME: FORMAT };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/code-octet.js =====
// Compilateur « programme en blocs → code octet » de Labo Blocs.
// Le même code octet est exécuté par le simulateur (noyau/vm.js), la Uno et le mBot (firmware/labo_blocs/vm.c)
// et le micro:bit (microbit/main.py) : un seul programme, le même comportement partout (jalon 0).
// Le format est décrit dans vm.c.
//
// Entrée : un programme v1 (voir docs/PLAN.md §3) ou un programme simplifié de l'atelier { demarrage, boucle }.
//   { fils: [ { quand: 'demarrage' | 'boucle' | 'appui' | 'relache', broche?, corps: [...] } ],
//     fonctions: [ { nom, parametres: [...], corps: [...] } ], listes: [ { nom, capacite } ] }
// Options : { composants: [{ type, broche }], boutonsVersMasse: true }
// Sortie : { octets: Uint8Array, erreurs: [], carte: [[adresse, idBloc], …] (pour surligner le bloc en cours),
//           noms: { variables: [nom par n°], broches: { n°: nom écrit dans le programme } } }

(function (global) {
  'use strict';

  // Description des blocs des cartes, lue au moment de compiler (l'ordre de chargement des scripts n'importe pas).
  const CARTES = () => (typeof module === 'object' && module.exports ? require('./cartes.js') : global.LaboBlocs);

  const FORMAT = 1;
  const BROCHE = { sortie: 1, boutonMasse: 2, boutonHaut: 3, servo: 4, son: 5, analogique: 6, pwm: 7 };
  const FIL = { demarrage: 0, boucle: 1, appui: 2, relache: 3 };
  const OP = {
    FIN: 0x00, NOMBRE: 0x01, ENTIER: 0x02, LIRE_VAR: 0x03, ECRIRE_VAR: 0x04,
    ADD: 0x05, SUB: 0x06, MUL: 0x07, DIV: 0x08, MOD: 0x09,
    EGAL: 0x0a, DIFF: 0x0b, INF: 0x0c, INF_EGAL: 0x0d, SUP: 0x0e, SUP_EGAL: 0x0f,
    ET: 0x10, OU: 0x11, NON: 0x12, OPPOSE: 0x13, SAUT: 0x14, SAUT_SI_FAUX: 0x15,
    LIRE_NUM: 0x16, LIRE_ANA: 0x17, ECRIRE_NUM: 0x18, ECRIRE_ANA: 0x19, SERVO: 0x1a, SON: 0x1b, SILENCE: 0x1c,
    ATTENDRE: 0x1d, HASARD: 0x1e, APPEL: 0x1f, RETOUR: 0x20,
    LISTE_LIRE: 0x21, LISTE_ECRIRE: 0x22, LISTE_AJOUTER: 0x23, LISTE_TAILLE: 0x24, LISTE_VIDER: 0x25,
    TEMPS: 0x26, DEPILER: 0x27, EXT: 0x28, PASSER: 0x29,
  };
  const COMPARAISONS = { '=': OP.EGAL, '≠': OP.DIFF, '<': OP.INF, '≤': OP.INF_EGAL, '>': OP.SUP, '≥': OP.SUP_EGAL };
  const OPERATIONS = { '+': OP.ADD, '-': OP.SUB, '×': OP.MUL, '÷': OP.DIV, mod: OP.MOD };

  // « ré-étalonner v depuis (a, b) vers (c, d) » → blocs de base, aucun nouvel ordre pour les cartes :
  // c + (v − a) × (d − c) ÷ (b − a), arrondi à l'entier le plus proche (t − (t mod 1) avec t = x + 0,5 : le reste
  // a le signe du diviseur). Si a = b, la division donne 0 (comme dans les cartes) : le résultat vaut c.
  function deroulerReetalonner(e) {
    const op = (o, a, b) => ({ bloc: 'operation', op: o, a, b });
    const x = op('+', e.vers1, op('÷', op('×', op('-', e.valeur, e.de1), op('-', e.vers2, e.vers1)), op('-', e.de2, e.de1)));
    const t = op('+', x, 0.5);
    return op('-', t, op('mod', t, 1));
  }

  // « D3 » → 3, « A0 » → 14 (numérotation Arduino Uno) ; micro:bit : « P0 » → 0 … « P20 » → 20.
  function numeroBroche(b) {
    const s = String(b).trim().toUpperCase();
    const p = /^P(\d+)$/.exec(s);
    if (p && Number(p[1]) <= 20) return Number(p[1]);
    let m = /^D?(\d+)$/.exec(s);
    if (m && Number(m[1]) <= 19) return Number(m[1]);
    m = /^A(\d)$/.exec(s);
    if (m && Number(m[1]) <= 7) return 14 + Number(m[1]);
    throw new Error('Broche inconnue : ' + b);
  }

  // Programme simplifié de l'atelier → programme v1.
  function versV1(p) {
    if (p && Array.isArray(p.fils)) return p;
    return {
      format: 'labo-blocs/programme',
      version: 1,
      fils: [
        { quand: 'demarrage', corps: (p && p.demarrage) || [] },
        { quand: 'boucle', corps: (p && p.boucle) || [] },
      ],
    };
  }

  function compiler(programme, options) {
    const opts = options || {};
    const prog = versV1(programme);
    const erreurs = [];
    const code = [];
    const variables = new Map();
    const listes = new Map();
    const broches = new Map();
    const fonctions = new Map();
    const appelsAResoudre = []; // { position, nom }
    let cachees = 0;

    const typeBouton = opts.boutonsVersMasse === false ? BROCHE.boutonHaut : BROCHE.boutonMasse;
    const TYPES_COMPOSANTS = { led: BROCHE.sortie, bouton: typeBouton, servo: BROCHE.servo, buzzer: BROCHE.son, potentiometre: BROCHE.analogique, capteur: BROCHE.analogique, pwm: BROCHE.pwm };
    for (const c of opts.composants || []) {
      if (TYPES_COMPOSANTS[c.type]) broches.set(numeroBroche(c.broche), TYPES_COMPOSANTS[c.type]);
    }
    const nomsBroches = {};
    for (const c of opts.composants || []) nomsBroches[numeroBroche(c.broche)] = c.broche;
    // Joystick : deux axes analogiques, un bouton vers la masse (toujours, quel que soit le réglage du parcours).
    const joystick = (opts.composants || []).find((c) => c.type === 'joystick');
    if (joystick) {
      for (const [b, type] of [[joystick.broche, BROCHE.analogique], [joystick.y, BROCHE.analogique], [joystick.bouton, BROCHE.boutonMasse]]) {
        broches.set(numeroBroche(b), type);
        nomsBroches[numeroBroche(b)] = b;
      }
    }
    const MANQUE_JOYSTICK = 'Ce programme utilise le joystick : il manque dans les composants de l’exercice.';
    const sansJoystick = () => erreurs.includes(MANQUE_JOYSTICK) || erreurs.push(MANQUE_JOYSTICK);
    const declarer = (b, type) => {
      const n = numeroBroche(b);
      if (!broches.has(n)) broches.set(n, type);
      if (!(n in nomsBroches)) nomsBroches[n] = b;
      return n;
    };
    const carte = []; // [position dans le code, id du bloc] au début de chaque instruction

    let portee = null; // paramètres de la fonction en cours de compilation : nom → n° de variable
    const variable = (nom) => {
      if (portee && portee.has(nom)) return portee.get(nom);
      if (!variables.has(nom)) variables.set(nom, variables.size);
      return variables.get(nom);
    };
    const cachee = (etiquette) => variable(`\u0000${etiquette}${cachees++}`);
    const liste = (nom) => {
      if (!listes.has(nom)) listes.set(nom, { n: listes.size, capacite: 16 });
      return listes.get(nom).n;
    };
    for (const l of prog.listes || []) {
      liste(l.nom || l);
      if (l.capacite) listes.get(l.nom).capacite = l.capacite;
    }
    for (const v of prog.variables || []) variable(v);

    const o8 = (x) => code.push(x & 0xff);
    const o16 = (x) => code.push(x & 0xff, (x >> 8) & 0xff);
    const trou16 = () => {
      const p = code.length;
      o16(0);
      return p;
    };
    const boucher = (p, valeur) => {
      code[p] = valeur & 0xff;
      code[p + 1] = (valeur >> 8) & 0xff;
    };
    // Les adresses sont relatives au début du code ; elles sont décalées de la taille de l'en-tête à la fin.
    const adresses = []; // positions des opérandes d'adresse à décaler

    function nombre(v) {
      const x = Number(v) || 0;
      if (Number.isInteger(x) && x >= -128 && x <= 127) {
        o8(OP.ENTIER);
        o8(x);
      } else {
        o8(OP.NOMBRE);
        const f = new Float32Array([x]);
        code.push(...new Uint8Array(f.buffer));
      }
    }

    function saut(op, cible) {
      o8(op);
      adresses.push(code.length);
      if (cible === undefined) return trou16();
      o16(cible);
      return null;
    }

    function expression(e) {
      if (e === null || e === undefined) return nombre(0);
      if (typeof e === 'number') return nombre(e);
      switch (e.bloc) {
        case 'nombre':
          return nombre(e.valeur);
        case 'valeur_haut_bas':
          return nombre(e.valeur ? 1 : 0);
        case 'variable':
          o8(OP.LIRE_VAR);
          return o8(variable(e.variable || 'CHOIX'));
        case 'bouton_etat':
          o8(OP.LIRE_NUM);
          return o8(declarer(e.broche, typeBouton));
        case 'entree_numerique':
          o8(OP.LIRE_NUM);
          return o8(declarer(e.broche, typeBouton));
        case 'entree_analogique':
          o8(OP.LIRE_ANA);
          return o8(declarer(e.broche, BROCHE.analogique));
        case 'comparaison':
          expression(e.a);
          expression(e.b);
          if (!(e.op in COMPARAISONS)) erreurs.push('Comparaison inconnue : ' + e.op);
          return o8(COMPARAISONS[e.op] || OP.EGAL);
        case 'operation':
          expression(e.a);
          expression(e.b);
          if (!(e.op in OPERATIONS)) erreurs.push('Opération inconnue : ' + e.op);
          return o8(OPERATIONS[e.op] || OP.ADD);
        case 'logique':
          expression(e.a);
          expression(e.b);
          return o8(e.op === 'ou' ? OP.OU : OP.ET);
        case 'non':
          expression(e.a);
          return o8(OP.NON);
        case 'hasard':
          expression(e.min);
          expression(e.max);
          return o8(OP.HASARD);
        case 'temps':
          return o8(OP.TEMPS);
        case 'liste_element':
          expression(e.position);
          o8(OP.LISTE_LIRE);
          return o8(liste(e.liste));
        case 'liste_taille':
          o8(OP.LISTE_TAILLE);
          return o8(liste(e.liste));
        case 'appel':
          return appel(e);
        case 'ext':
          return ext(e);
        case 'reetalonner':
          return expression(deroulerReetalonner(e));
        case 'joystick_position':
        case 'joystick_valeur':
        case 'joystick_direction':
        case 'joystick_bouton': {
          const d = CARTES().deroulerJoystick(e, opts.composants);
          if (d) return expression(d);
          sansJoystick();
          return nombre(0);
        }
        default: {
          // Bloc d'une carte (mBot, micro:bit) : déroulé en blocs de base (noyau/cartes.js).
          const d = CARTES().deroulerBlocCarte(e);
          if (d) return expression(d);
          erreurs.push('Bloc inconnu : ' + e.bloc);
          return nombre(0);
        }
      }
    }

    function appel(e) {
      const f = fonctions.get(e.fonction);
      if (!f) {
        erreurs.push('Fonction inconnue : ' + e.fonction);
        return nombre(0);
      }
      (e.arguments || []).forEach((a, i) => {
        expression(a);
        o8(OP.ECRIRE_VAR);
        o8(f.parametres[i]);
      });
      o8(OP.APPEL);
      adresses.push(code.length);
      appelsAResoudre.push({ position: code.length, nom: e.fonction });
      o16(0);
    }

    function ext(e) {
      // La carte reçoit 4 valeurs au plus par commande (vm.c, main.py).
      if ((e.arguments || []).length > 4) erreurs.push('Une commande de carte reçoit 4 valeurs au plus.');
      for (const a of e.arguments || []) expression(a);
      o8(OP.EXT);
      o8(e.extension);
      o8(e.commande);
      o8((e.arguments || []).length);
    }

    function suite(liste) {
      for (const i of liste || []) instruction(i);
    }

    function instruction(i) {
      if (i.id !== undefined) carte.push([code.length, i.id]);
      switch (i.bloc) {
        case 'led_etat':
          nombre(i.etat ? 1 : 0);
          o8(OP.ECRIRE_NUM);
          return o8(declarer(i.broche, BROCHE.sortie));
        case 'sortie_numerique':
          expression(i.valeur);
          o8(OP.ECRIRE_NUM);
          return o8(declarer(i.broche, BROCHE.sortie));
        case 'sortie_pwm':
          expression(i.valeur);
          o8(OP.ECRIRE_ANA);
          return o8(declarer(i.broche, BROCHE.pwm));
        case 'servo_angle':
          expression(i.angle);
          o8(OP.SERVO);
          return o8(declarer(i.broche, BROCHE.servo));
        case 'son':
          expression(i.frequence);
          expression(i.duree);
          o8(OP.SON);
          return o8(declarer(i.broche, BROCHE.son));
        case 'silence':
          o8(OP.SILENCE);
          return o8(declarer(i.broche, BROCHE.son));
        case 'attendre':
          expression(i.duree);
          return o8(OP.ATTENDRE);
        case 'affecter':
          expression(i.valeur);
          o8(OP.ECRIRE_VAR);
          return o8(variable(i.variable || 'CHOIX'));
        case 'ajouter_a': {
          const v = variable(i.variable);
          o8(OP.LIRE_VAR);
          o8(v);
          expression(i.valeur);
          o8(OP.ADD);
          o8(OP.ECRIRE_VAR);
          return o8(v);
        }
        case 'si_alors':
        case 'si_sinon': {
          expression(i.condition);
          const versSinon = saut(OP.SAUT_SI_FAUX);
          suite(i.alors);
          if (i.bloc === 'si_sinon') {
            const versFin = saut(OP.SAUT);
            boucher(versSinon, code.length);
            suite(i.sinon);
            boucher(versFin, code.length);
          } else boucher(versSinon, code.length);
          return;
        }
        case 'repeter_n': {
          const compteur = cachee('n');
          expression(i.fois);
          o8(OP.ECRIRE_VAR);
          o8(compteur);
          const debut = code.length;
          o8(OP.LIRE_VAR);
          o8(compteur);
          nombre(0);
          o8(OP.SUP);
          const sortie = saut(OP.SAUT_SI_FAUX);
          suite(i.corps);
          o8(OP.LIRE_VAR);
          o8(compteur);
          nombre(1);
          o8(OP.SUB);
          o8(OP.ECRIRE_VAR);
          o8(compteur);
          saut(OP.SAUT, debut);
          return boucher(sortie, code.length);
        }
        case 'tant_que':
        case 'repeter_jusqua': {
          const debut = code.length;
          expression(i.condition);
          if (i.bloc === 'repeter_jusqua') o8(OP.NON);
          const sortie = saut(OP.SAUT_SI_FAUX);
          suite(i.corps);
          saut(OP.SAUT, debut);
          return boucher(sortie, code.length);
        }
        case 'liste_ajouter':
          expression(i.valeur);
          o8(OP.LISTE_AJOUTER);
          return o8(liste(i.liste));
        case 'liste_remplacer':
          expression(i.position);
          expression(i.valeur);
          o8(OP.LISTE_ECRIRE);
          return o8(liste(i.liste));
        case 'liste_vider':
          o8(OP.LISTE_VIDER);
          return o8(liste(i.liste));
        case 'appeler':
          appel({ fonction: i.fonction, arguments: i.arguments });
          return o8(OP.DEPILER);
        case 'retourner':
          expression(i.valeur);
          return o8(OP.RETOUR);
        case 'ext':
          ext(i);
          return o8(OP.DEPILER);
        default: {
          const d = CARTES().deroulerBlocCarte(i);
          if (d) return (Array.isArray(d) ? d : [d]).forEach(instruction);
          erreurs.push('Bloc inconnu : ' + i.bloc);
        }
      }
    }

    // Fonctions : paramètres = variables cachées (pas d'appel récursif).
    for (const f of prog.fonctions || []) {
      fonctions.set(f.nom, { parametres: (f.parametres || []).map((p) => variable(`\u0000${f.nom}:${p}`)), adresse: 0, corps: f.corps });
    }

    const fils = [];
    let cameras = 0;
    for (const f of prog.fils) {
      // « Quand la caméra reconnaît X » (ou « ne reconnaît plus X ») : une boucle qui surveille la caméra et lance le
      // corps une fois à chaque changement (variable cachée « déjà vu »). Rien de nouveau pour la machine virtuelle.
      // « Quand le joystick est poussé vers … » : la même surveillance ; le corps part une fois, quand le joystick
      // arrive dans cette direction.
      if (f.quand === 'joystick') {
        const vu = CARTES().deroulerJoystick({ bloc: 'joystick_direction', direction: f.direction }, opts.composants);
        if (!vu) {
          sansJoystick();
          continue;
        }
        const deja = { bloc: 'variable', variable: `\u0000joystick${cameras++}` };
        const noter = (v) => ({ bloc: 'affecter', variable: deja.variable, valeur: v });
        const garde = { bloc: 'si_sinon', condition: vu, alors: [{ bloc: 'si_alors', condition: { bloc: 'non', a: deja }, alors: [noter(1), ...(f.corps || [])] }], sinon: [noter(0)] };
        if (f.id !== undefined) carte.push([code.length, f.id]);
        fils.push({ type: FIL.boucle, broche: 0, adresse: code.length });
        instruction(garde);
        o8(OP.FIN);
        continue;
      }
      // « Quand la touche X est appuyée (relâchée) » : la même surveillance, avec le clavier de l'ordinateur.
      if (f.quand === 'touche') {
        const deja = { bloc: 'variable', variable: `\u0000touche${cameras++}` };
        const vu = { bloc: 'comparaison', op: '=', a: { bloc: 'ext', extension: 4, commande: 1, arguments: [CARTES().codeTouche(f.touche)] }, b: 1 };
        const noter = (v) => ({ bloc: 'affecter', variable: deja.variable, valeur: v });
        const corps = f.corps || [];
        const garde = f.front === 'relache'
          ? { bloc: 'si_sinon', condition: vu, alors: [noter(1)], sinon: [{ bloc: 'si_alors', condition: deja, alors: [noter(0), ...corps] }] }
          : { bloc: 'si_sinon', condition: vu, alors: [{ bloc: 'si_alors', condition: { bloc: 'non', a: deja }, alors: [noter(1), ...corps] }], sinon: [noter(0)] };
        if (f.id !== undefined) carte.push([code.length, f.id]);
        fils.push({ type: FIL.boucle, broche: 0, adresse: code.length });
        instruction(garde);
        o8(OP.FIN);
        continue;
      }
      if (f.quand === 'camera') {
        const deja = { bloc: 'variable', variable: `\u0000camera${cameras++}` };
        const vu = { bloc: 'comparaison', op: '=', a: { bloc: 'ext', extension: 3, commande: 1, arguments: [Number(f.etiquette) || 0] }, b: 1 };
        const noter = (v) => ({ bloc: 'affecter', variable: deja.variable, valeur: v });
        const corps = f.corps || [];
        const garde = f.front === 'plus'
          ? { bloc: 'si_sinon', condition: vu, alors: [noter(1)], sinon: [{ bloc: 'si_alors', condition: deja, alors: [noter(0), ...corps] }] }
          : { bloc: 'si_sinon', condition: vu, alors: [{ bloc: 'si_alors', condition: { bloc: 'non', a: deja }, alors: [noter(1), ...corps] }], sinon: [noter(0)] };
        if (f.id !== undefined) carte.push([code.length, f.id]);
        fils.push({ type: FIL.boucle, broche: 0, adresse: code.length });
        instruction(garde);
        o8(OP.FIN);
        continue;
      }
      if (!(f.quand in FIL)) {
        erreurs.push('Événement inconnu : ' + f.quand);
        continue;
      }
      const broche = f.broche ? declarer(f.broche, typeBouton) : 0;
      fils.push({ type: FIL[f.quand], broche, adresse: code.length });
      suite(f.corps);
      o8(OP.FIN);
    }
    for (const [nom, f] of fonctions) {
      f.adresse = code.length;
      // Dans le corps, un paramètre se lit par son nom.
      const noms = prog.fonctions.find((x) => x.nom === nom).parametres || [];
      portee = new Map(noms.map((p, i) => [p, f.parametres[i]]));
      suite(f.corps);
      nombre(0);
      o8(OP.RETOUR);
      portee = null;
    }
    for (const a of appelsAResoudre) boucher(a.position, fonctions.get(a.nom).adresse);

    // En-tête.
    const tete = [];
    tete.push(Math.min(variables.size, 255));
    tete.push(listes.size);
    for (const l of listes.values()) tete.push(l.capacite);
    tete.push(broches.size);
    for (const [n, t] of [...broches].sort((a, b) => a[0] - b[0])) tete.push(n, t);
    tete.push(fils.length);
    const posFils = tete.length;
    for (const f of fils) tete.push(f.type, f.broche, 0, 0);
    const decalage = 7 + tete.length;
    fils.forEach((f, i) => {
      const a = f.adresse + decalage;
      tete[posFils + i * 4 + 2] = a & 0xff;
      tete[posFils + i * 4 + 3] = a >> 8;
    });
    for (const c of carte) c[0] += decalage;
    for (const p of adresses) {
      const a = code[p] + code[p + 1] * 256 + decalage;
      code[p] = a & 0xff;
      code[p + 1] = a >> 8;
    }

    const corps = tete.concat(code);
    const longueur = 7 + corps.length;
    let crc = 0xffff;
    for (const o of corps) crc = crc16(crc, o);
    const octets = new Uint8Array(longueur);
    octets.set([0x4c, 0x42, FORMAT, longueur & 0xff, longueur >> 8, crc & 0xff, crc >> 8]);
    octets.set(corps, 7);
    if (variables.size > 24) erreurs.push('Trop de variables (24 au plus).');
    // La carte garde 6 fils au plus. Un programme avec « quand la touche… » ou « quand la caméra… » ne va jamais dans la
    // carte (il tourne dans l'ordinateur) : 16 fils, une touche ou une étiquette par bloc (ex. les 4 flèches, appuyées
    // et relâchées).
    const dansLOrdinateur = prog.fils.some((f) => f.quand === 'touche' || f.quand === 'camera');
    const maxFils = dansLOrdinateur ? 16 : 6;
    if (fils.length > maxFils) erreurs.push(`Trop de blocs « quand… » : ${maxFils} au plus, avec « Au démarrage » et « Répéter indéfiniment ».`);
    const nomsVariables = [];
    for (const [nom, n] of variables) nomsVariables[n] = nom;
    return {
      octets,
      erreurs,
      carte,
      noms: { variables: nomsVariables, broches: nomsBroches },
      variables: variables.size,
      fils: fils.length,
      broches: broches.size,
    };
  }

  function crc16(crc, octet) {
    crc ^= octet << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    return crc;
  }

  const api = { compiler, versV1, numeroBroche, crc16, deroulerReetalonner, OP, FORMAT };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (global.LaboBlocs = global.LaboBlocs || {}).codeOctet = api;
})(this);

// ===== noyau/vm.js =====
// Interpréteur du code octet de Labo Blocs, dans le navigateur : la traduction ligne à ligne de
// firmware/labo_blocs/vm.c (Uno, mBot) et de microbit/main.py. Mêmes instructions, mêmes fils, mêmes arrondis :
// le simulateur fait exactement ce que fera la carte (tests/vm.test.js le vérifie contre l'interpréteur C).
//
// La carte (réelle ou simulée) est donnée par « materiel » :
//   { configurer(b, type), ecrireNum(b, v), ecrireAna(b, v), servo(b, angle), son(b, frequence, ms), silence(b),
//     lireNum(b, type) → 0/1 (bouton : 1 = appuyé), lireAna(b), hasard(min, max), ext(extension, commande, args) }

(function (global) {
  'use strict';

  const FORMAT = 1;
  // fils : 6 dans la carte (vm.c) ; 16 ici, pour les programmes qui restent dans l'ordinateur (clavier, caméra :
  // noyau/code-octet.js garde la limite de 6 pour tous les autres).
  const MAX = { fils: 16, pile: 12, appels: 6, variables: 24, listes: 4, elements: 48, broches: 16 };
  const TRANCHE = 200;
  const ERREUR = { ok: 0, marque: 1, format: 2, crc: 3, tropGrand: 4, pile: 5, code: 6 };
  const FIL = { demarrage: 0, boucle: 1, appui: 2, relache: 3 };

  function crc16(crc, o) {
    crc ^= o << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    return crc;
  }

  const arrondi = (x) => (x >= 0 ? Math.floor(x + 0.5) : -Math.floor(-x + 0.5));

  function egal(a, b) {
    const m = Math.max(Math.abs(a), Math.abs(b), 1);
    return Math.abs(a - b) <= 1e-5 * m;
  }

  function creerVM(materiel) {
    const h = materiel;
    let P = new Uint8Array(0);
    let fils = [];
    let variables = [];
    let listes = []; // { capacite, elements }
    let types = new Map();
    let longueur = 0;
    let erreur = ERREUR.marque;
    let enMarche = false;
    let demarrageFini = false;
    let origine = 0;
    const vf = new DataView(new ArrayBuffer(4));

    const o8 = (a) => (a < P.length ? P[a] : 0);
    const u16 = (a) => o8(a) | (o8(a + 1) << 8);
    function f32(a) {
      for (let i = 0; i < 4; i++) vf.setUint8(i, o8(a + i));
      return vf.getFloat32(0, true);
    }
    const typeBroche = (b) => (types.has(b) ? types.get(b) : 1);

    function charger(octets) {
      P = octets instanceof Uint8Array ? octets : Uint8Array.from(octets || []);
      enMarche = false;
      fils = [];
      if (o8(0) !== 0x4c || o8(1) !== 0x42) return (erreur = ERREUR.marque);
      if (o8(2) !== FORMAT) return (erreur = ERREUR.format);
      longueur = u16(3);
      if (longueur < 11 || longueur > P.length) return (erreur = ERREUR.crc);
      let crc = 0xffff;
      for (let a = 7; a < longueur; a++) crc = crc16(crc, P[a]);
      if (crc !== u16(5)) return (erreur = ERREUR.crc);
      let a = 7;
      const nbVariables = o8(a++);
      const nbListes = o8(a++);
      if (nbVariables > MAX.variables || nbListes > MAX.listes) return (erreur = ERREUR.tropGrand);
      variables = new Array(nbVariables).fill(0);
      listes = [];
      let place = 0;
      for (let i = 0; i < nbListes; i++) {
        const capacite = o8(a++);
        place += capacite;
        listes.push({ capacite, elements: [] });
      }
      if (place > MAX.elements) return (erreur = ERREUR.tropGrand);
      const nbBroches = o8(a++);
      if (nbBroches > MAX.broches) return (erreur = ERREUR.tropGrand);
      types = new Map();
      for (let i = 0; i < nbBroches; i++) {
        types.set(o8(a), o8(a + 1));
        a += 2;
      }
      const nbFils = o8(a++);
      if (nbFils > MAX.fils) return (erreur = ERREUR.tropGrand);
      for (let i = 0; i < nbFils; i++) {
        fils.push({ type: o8(a), broche: o8(a + 1), debut: u16(a + 2), actif: false, pc: 0, ici: null, reveil: 0, tour: 0, pile: [], appels: [], dernier: 0 });
        a += 4;
      }
      return (erreur = ERREUR.ok);
    }

    function lancer(f, t) {
      f.actif = true;
      f.pc = f.debut;
      f.ici = null;
      f.pile = [];
      f.appels = [];
      f.reveil = t;
      f.tour = t;
    }

    function demarrer(t) {
      if (erreur !== ERREUR.ok) return;
      origine = t;
      variables.fill(0);
      for (const l of listes) l.elements = [];
      for (const [b, type] of types) h.configurer(b, type);
      demarrageFini = false;
      for (const f of fils) {
        f.actif = false;
        if (f.type === FIL.demarrage) lancer(f, t);
      }
      enMarche = true;
    }

    function arreter() {
      enMarche = false;
      for (const f of fils) f.actif = false;
    }

    function apresDemarrage(t) {
      demarrageFini = true;
      for (const f of fils) {
        if (f.type === FIL.boucle) lancer(f, t);
        else if (f.type === FIL.appui || f.type === FIL.relache) f.dernier = h.lireNum(f.broche, typeBroche(f.broche)) ? 1 : 0;
      }
    }

    // Exécute un fil jusqu'à ce qu'il rende la main. limite : nombre d'instructions au plus (pas à pas).
    // Renvoie 'ok', 'limite' (arrêté par la limite, rien d'autre ne change) ou 'erreur'.
    function courir(f, t, limite) {
      const s = f.pile;
      const pop = () => {
        if (!s.length) throw new Error('pile');
        return s.pop();
      };
      const push = (v) => {
        if (s.length >= MAX.pile) throw new Error('pile');
        s.push(v);
      };
      const max = limite || TRANCHE;
      try {
        for (let n = 0; n < max; n++) {
          let pc = f.pc;
          f.ici = pc; // début de la dernière instruction exécutée (bloc à surligner)
          const op = o8(pc++);
          let a;
          let b;
          let x;
          switch (op) {
            case 0x00:
            case 0x29:
              if (f.type === FIL.boucle || op === 0x29) {
                if (op === 0x00) {
                  pc = f.debut;
                  f.pile = [];
                  f.appels = [];
                }
                f.pc = pc;
                f.reveil = t === f.tour ? t + 1 : t;
                f.tour = f.reveil;
                return 'ok';
              }
              f.actif = false;
              return 'ok';
            case 0x01:
              push(f32(pc));
              pc += 4;
              break;
            case 0x02:
              x = o8(pc++);
              push(x > 127 ? x - 256 : x);
              break;
            case 0x03:
              x = o8(pc++);
              push(x < variables.length ? variables[x] : 0);
              break;
            case 0x04:
              x = o8(pc++);
              a = pop();
              if (x < variables.length) variables[x] = a;
              break;
            case 0x05: b = pop(); a = pop(); push(a + b); break;
            case 0x06: b = pop(); a = pop(); push(a - b); break;
            case 0x07: b = pop(); a = pop(); push(a * b); break;
            case 0x08: b = pop(); a = pop(); push(b === 0 ? 0 : a / b); break;
            case 0x09: {
              b = pop();
              a = pop();
              if (b === 0) push(0);
              else {
                let r = a - b * Math.trunc(a / b);
                if (r !== 0 && r < 0 !== b < 0) r += b; // comme Scratch : le reste a le signe du diviseur
                push(r);
              }
              break;
            }
            case 0x0a: b = pop(); a = pop(); push(egal(a, b) ? 1 : 0); break;
            case 0x0b: b = pop(); a = pop(); push(egal(a, b) ? 0 : 1); break;
            case 0x0c: b = pop(); a = pop(); push(a < b && !egal(a, b) ? 1 : 0); break;
            case 0x0d: b = pop(); a = pop(); push(a < b || egal(a, b) ? 1 : 0); break;
            case 0x0e: b = pop(); a = pop(); push(a > b && !egal(a, b) ? 1 : 0); break;
            case 0x0f: b = pop(); a = pop(); push(a > b || egal(a, b) ? 1 : 0); break;
            case 0x10: b = pop(); a = pop(); push(a !== 0 && b !== 0 ? 1 : 0); break;
            case 0x11: b = pop(); a = pop(); push(a !== 0 || b !== 0 ? 1 : 0); break;
            case 0x12: push(pop() === 0 ? 1 : 0); break;
            case 0x13: push(-pop()); break;
            case 0x14:
              pc = u16(pc);
              break;
            case 0x15: {
              const cible = u16(pc);
              pc += 2;
              if (pop() === 0) pc = cible;
              break;
            }
            case 0x16:
              x = o8(pc++);
              push(h.lireNum(x, typeBroche(x)) ? 1 : 0);
              break;
            case 0x17:
              x = o8(pc++);
              push(h.lireAna(x));
              break;
            case 0x18:
              x = o8(pc++);
              h.ecrireNum(x, pop() !== 0 ? 1 : 0);
              break;
            case 0x19:
              x = o8(pc++);
              a = pop();
              h.ecrireAna(x, a < 0 ? 0 : a > 255 ? 255 : Math.floor(a + 0.5));
              break;
            case 0x1a:
              x = o8(pc++);
              a = pop();
              h.servo(x, a < 0 ? 0 : a > 180 ? 180 : Math.floor(a + 0.5));
              break;
            case 0x1b:
              x = o8(pc++);
              b = pop();
              a = pop();
              h.son(x, Math.trunc(a < 31 ? 31 : a > 20000 ? 20000 : a), b < 0 ? 0 : Math.floor(b * 1000 + 0.5));
              break;
            case 0x1c:
              h.silence(o8(pc++));
              break;
            case 0x1d: {
              a = pop();
              const ms = a > 0 ? Math.floor(a * 1000 + 0.5) : 0;
              if (ms > 0) {
                f.pc = pc;
                f.reveil = t + ms;
                return 'ok';
              }
              break;
            }
            case 0x1e:
              b = pop();
              a = pop();
              push(h.hasard(arrondi(Math.min(a, b)), arrondi(Math.max(a, b))));
              break;
            case 0x1f:
              if (f.appels.length >= MAX.appels) throw new Error('pile');
              f.appels.push(pc + 2);
              pc = u16(pc);
              break;
            case 0x20:
              if (!f.appels.length) throw new Error('pile');
              pc = f.appels.pop();
              break;
            case 0x21: case 0x22: case 0x23: case 0x24: case 0x25: {
              x = o8(pc++);
              const l = listes[x];
              if (op === 0x21) {
                const i = arrondi(pop());
                push(l && i >= 1 && i <= l.elements.length ? l.elements[i - 1] : 0);
              } else if (op === 0x22) {
                const v = pop();
                const i = arrondi(pop());
                if (l && i >= 1 && i <= l.elements.length) l.elements[i - 1] = v;
              } else if (op === 0x23) {
                const v = pop();
                if (l && l.elements.length < l.capacite) l.elements.push(v);
              } else if (op === 0x24) push(l ? l.elements.length : 0);
              else if (l) l.elements = [];
              break;
            }
            case 0x26:
              push((t - origine) / 1000);
              break;
            case 0x27:
              pop();
              break;
            case 0x28: {
              const e = o8(pc);
              const c = o8(pc + 1);
              const k = o8(pc + 2);
              pc += 3;
              if (k > 4 || k > s.length) throw new Error('pile');
              const args = s.splice(s.length - k, k);
              push(h.ext(e, c, args));
              break;
            }
            default:
              erreur = ERREUR.code;
              return 'erreur';
          }
          f.pc = pc;
        }
      } catch (e) {
        erreur = ERREUR.pile;
        return 'erreur';
      }
      if (limite) return 'limite';
      // Trop longtemps sans attente : on laisse la main, reprise 1 ms plus tard.
      f.reveil = t + 1;
      return 'ok';
    }

    function detecterEvenements(t) {
      for (const f of fils) {
        if (f.type !== FIL.appui && f.type !== FIL.relache) continue;
        const v = h.lireNum(f.broche, typeBroche(f.broche)) ? 1 : 0;
        if (v !== f.dernier) {
          f.dernier = v;
          if (!f.actif && v === (f.type === FIL.appui ? 1 : 0)) lancer(f, t);
        }
      }
    }

    function finDuDemarrage(t) {
      if (demarrageFini) return false;
      if (fils.some((f) => f.type === FIL.demarrage && f.actif)) return false;
      apresDemarrage(t);
      return true;
    }

    function prochainReveil() {
      let r = Infinity;
      for (const f of fils) if (f.actif && f.reveil < r) r = f.reveil;
      return r;
    }

    // Exécute tout ce qui peut l'être à l'instant t. Renvoie l'instant du prochain réveil (Infinity : plus rien).
    function avancer(t) {
      if (!enMarche || erreur !== ERREUR.ok) return Infinity;
      for (let garde = 0; garde < 50; garde++) {
        let travail = false;
        if (demarrageFini) detecterEvenements(t);
        for (const f of fils) {
          if (!f.actif || f.reveil > t) continue;
          if (courir(f, t) === 'erreur') {
            arreter();
            return Infinity;
          }
          travail = true;
        }
        if (finDuDemarrage(t)) travail = true;
        if (!travail) break;
      }
      return prochainReveil();
    }

    // Pas à pas. filPret(t) : le premier fil prêt à l'instant t (sans rien exécuter), ou null s'il faut avancer
    // l'horloge. unPas(t) : exécute une seule instruction de ce fil et le renvoie.
    function filPret(t) {
      if (!enMarche || erreur !== ERREUR.ok) return null;
      if (demarrageFini) detecterEvenements(t);
      finDuDemarrage(t);
      return fils.find((x) => x.actif && x.reveil <= t) || null;
    }
    function unPas(t) {
      const f = filPret(t);
      if (!f) return null;
      if (courir(f, t, 1) === 'erreur') {
        arreter();
        return null;
      }
      finDuDemarrage(t);
      return f;
    }

    return {
      charger,
      demarrer,
      avancer,
      filPret,
      unPas,
      arreter,
      prochainReveil,
      get enMarche() {
        return enMarche;
      },
      get erreur() {
        return erreur;
      },
      get longueur() {
        return erreur === ERREUR.ok ? longueur : 0;
      },
      get fils() {
        return fils;
      },
      get variables() {
        return variables;
      },
    };
  }

  const api = { creerVM, ERREUR_VM: ERREUR, FIL };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/simulation.js =====
// Simulateur de Labo Blocs : exécute un programme en temps virtuel (millisecondes), sans affichage.
// Il compile le programme en code octet et le fait tourner dans noyau/vm.js : exactement ce que fera la carte.
// L'écran l'avance au rythme de l'horloge (×1, ×2, ×5), la vérification l'avance d'un coup et lit son journal.
// Même interface que le simulateur de l'atelier du distributeur (dont la vérification par scénarios est reprise).
//
// Règles (comme setup et loop sur Arduino, et comme la carte) :
// - « Au démarrage » s'exécute une fois, puis « Répéter indéfiniment » et les blocs « quand… ».
// - Les blocs sont instantanés, sauf « attendre ». Un tour de boucle consomme au moins 1 ms.
// - Un bloc « quand… » qui tourne déjà ignore un nouvel appui.
// - Les angles du servo sont limités à 0–180.

(function (global) {
  'use strict';

  const N = typeof module === 'object' && module.exports ? { ...require('./code-octet.js'), ...require('./vm.js') } : { ...global.LaboBlocs.codeOctet, ...global.LaboBlocs };

  // Cartes (micro:bit, mBot) : lues au moment de simuler (l'ordre de chargement des scripts n'importe pas).
  const CARTES = () => (typeof module === 'object' && module.exports ? require('./cartes.js') : global.LaboBlocs);

  const VITESSE_SERVO = 180 / 300; // degrés par ms : 0° → 180° en 0,3 s

  // options : { composants, boutonsVersMasse, graine (hasard reproductible), surSon(broche, frequence, ms),
  //             carte ('uno' | 'microbit' | 'mbot'), capteurs (valeurs des capteurs de la carte, modifiables en marche),
  //             surExtension(e, c, args) (mode « En direct ») }
  function creerSimulation(programme, options) {
    const opts = options || {};
    const compile = N.compiler(programme || { demarrage: [], boucle: [] }, { composants: opts.composants, boutonsVersMasse: opts.boutonsVersMasse });
    const debuts = new Map(compile.carte); // adresse du début d'un bloc → id
    const adresses = compile.carte.map((c) => c[0]);
    const nom = (n) => compile.noms.broches[n] || 'D' + n;

    const sim = {
      t: 0,
      journal: [], // { t, broche, valeur, type: 'led' | 'servo' | 'pwm' | 'son' | 'entree' | 'variable' }
      sorties: {}, // broche → valeur (LED 0/1, servo en degrés)
      entrees: {}, // broche → 0/1 (boutons : 1 = appuyé)
      variables: {},
      blocEnCours: null,
      blocsEnCours: [],
      initiales: {},
      erreurs: compile.erreurs,
      octets: compile.octets,
      avancerJusqua,
      avancer: (ms) => avancerJusqua(sim.t + ms),
      pas,
      changerEntree: (broche, valeur) => planifierEntree(sim.t, broche, valeur),
      // Entrée analogique (axe du joystick) : 0 à 1023, gardée telle quelle.
      changerAnalogique: (broche, valeur) => planifierEntree(sim.t, broche, valeur, true),
      planifierEntree,
      planifierCapteur,
      valeur: (broche) => (broche in sim.sorties ? sim.sorties[broche] : sim.entrees[broche] || 0),
    };

    for (const c of opts.composants || []) {
      if (c.type === 'joystick') {
        // Axes au centre (512), bouton relâché.
        sim.entrees[c.broche] = sim.initiales[c.broche] = 512;
        sim.entrees[c.y] = sim.initiales[c.y] = 512;
        sim.entrees[c.bouton] = sim.initiales[c.bouton] = 0;
        continue;
      }
      if (c.type === 'bouton') sim.entrees[c.broche] = 0;
      else sim.sorties[c.broche] = 0;
      sim.initiales[c.broche] = 0;
    }
    const joystick = (opts.composants || []).find((c) => c.type === 'joystick');

    // Carte micro:bit ou mBot : écran, boutons, capteurs, moteurs et LED de la carte (noyau/cartes.js).
    let carteSimulee = null;
    if ((opts.carte === 'microbit' || opts.carte === 'mbot') && !opts.extension) {
      const K = CARTES();
      sim.capteurs = opts.capteurs || K.capteursDepart(opts.carte);
      sim.ecrire = (nom, valeur, type) => ecrireNom(nom, valeur, type);
      sim.son = (nom, frequence, ms) => {
        sim.journal.push({ t: sim.t, broche: nom, valeur: frequence, duree: ms, type: 'son' });
        if (opts.surSon) opts.surSon(nom, frequence, ms);
      };
      carteSimulee = K.creerCarteSimulee(opts.carte, sim);
      sim.carte = carteSimulee.etat;
      const entrees = opts.carte === 'microbit' ? ['A', 'B', 'logo'] : ['bouton'];
      const sorties = opts.carte === 'mbot' ? ['moteur gauche', 'moteur droit', 'LED gauche', 'LED droite'] : [];
      for (const n of entrees) sim.entrees[n] = sim.initiales[n] = 0;
      for (const n of sorties) sim.sorties[n] = sim.initiales[n] = 0;
    }

    // Caméra (extension 3) : ce que l'IA reconnaît, réglé par la page (webcam), par un scénario (« regler: { camera: 2 } »)
    // ou à la main dans le simulateur. capteurs.camera : n° de l'étiquette reconnue (0 = rien) ;
    // capteurs.certitudes (facultatif) : { n°: 0..100 } donnés par l'IA.
    if (!sim.capteurs) sim.capteurs = opts.capteurs || {};
    if (!('camera' in sim.capteurs)) sim.capteurs.camera = 0;
    function camera(c, args) {
      const n = Math.round(Number(args[0]) || 0);
      const vue = Math.round(Number(sim.capteurs.camera) || 0);
      if (c === 1) return vue === n ? 1 : 0;
      if (c === 2) {
        const certitudes = sim.capteurs.certitudes;
        if (certitudes && n in certitudes) return Math.round(Number(certitudes[n]) || 0);
        return vue === n ? 100 : 0;
      }
      return 0;
    }

    function ecrire(n, valeur, type) {
      ecrireNom(nom(n), valeur, type);
    }
    function ecrireNom(b, valeur, type) {
      if (sim.sorties[b] === valeur) return;
      sim.sorties[b] = valeur;
      sim.journal.push({ t: sim.t, broche: b, valeur, type });
    }
    let alea = opts.graine === undefined ? null : opts.graine >>> 0;
    const vm = N.creerVM({
      configurer() {},
      ecrireNum: (n, v) => ecrire(n, v, 'led'),
      ecrireAna: (n, v) => ecrire(n, v, 'pwm'),
      servo: (n, a) => ecrire(n, a, 'servo'),
      son(n, frequence, ms) {
        sim.journal.push({ t: sim.t, broche: nom(n), valeur: frequence, duree: ms, type: 'son' });
        if (opts.surSon) opts.surSon(nom(n), frequence, ms);
      },
      silence(n) {
        sim.journal.push({ t: sim.t, broche: nom(n), valeur: 0, duree: 0, type: 'son' });
        if (opts.surSon) opts.surSon(nom(n), 0, 0);
      },
      lireNum: (n) => (sim.entrees[nom(n)] ? 1 : 0),
      lireAna: (n) => sim.entrees[nom(n)] || 0,
      hasard(min, max) {
        if (alea === null) return min + Math.floor(Math.random() * (max - min + 1));
        alea = (Math.imul(alea, 1103515245) + 12345) >>> 0;
        return min + ((alea >>> 8) % (max - min + 1));
      },
      ext(e, c, args) {
        if (e === 3) return camera(c, args); // la caméra est dans l'ordinateur : rien ne part vers la carte
        // Clavier de l'ordinateur : une touche est une entrée du simulateur (« touche:haut »), appuyée par la page ou par
        // un scénario, comme un bouton. Rien ne part vers la carte.
        if (e === 4) return c === 1 && sim.entrees[CARTES().entreeTouche(CARTES().toucheDuCode(args[0]))] ? 1 : 0;
        if (opts.extension) return Number(opts.extension(e, c, args)) || 0;
        const r = carteSimulee ? Number(carteSimulee.ext(e, c, args)) || 0 : 0;
        // Mode « En direct » : la commande part aussi vers la vraie carte (noyau/direct.js).
        if (opts.surExtension) opts.surExtension(e, c, args);
        return r;
      },
    });
    vm.charger(compile.octets);
    vm.demarrer(0);

    const planifiees = []; // entrées à appliquer : { t, broche, valeur }, triées par t
    let reveil = 0;

    function planifierEntree(t, broche, valeur, analogique) {
      const e = { t: Math.max(t, sim.t), broche, valeur: analogique ? Math.max(0, Math.min(1023, Math.round(Number(valeur) || 0))) : valeur ? 1 : 0 };
      let i = planifiees.length;
      while (i > 0 && planifiees[i - 1].t > e.t) i--;
      planifiees.splice(i, 0, e);
      appliquerEntrees();
    }

    // Capteur de la carte (distance, température…) réglé à l'instant t : scénarios de test et test rejoué.
    function planifierCapteur(t, capteur, valeur) {
      const e = { t: Math.max(t, sim.t), capteur, valeur: Number(valeur) || 0 };
      let i = planifiees.length;
      while (i > 0 && planifiees[i - 1].t > e.t) i--;
      planifiees.splice(i, 0, e);
      appliquerEntrees();
    }

    function appliquerEntrees() {
      while (planifiees.length && planifiees[0].t <= sim.t) {
        const e = planifiees.shift();
        if (e.capteur === 'joystick' && joystick) {
          // Scénario « régler le joystick » : les deux axes prennent la valeur de cette direction.
          const b = CARTES().brutsJoystick(CARTES().CODES_JOYSTICK[e.valeur] || 'centre', joystick);
          for (const [broche, v] of [[joystick.broche, b.x], [joystick.y, b.y]]) {
            if (sim.entrees[broche] !== v) {
              sim.entrees[broche] = v;
              sim.journal.push({ t: sim.t, broche, valeur: v, type: 'entree' });
            }
          }
          continue;
        }
        if (e.capteur !== undefined) {
          if (sim.capteurs) sim.capteurs[e.capteur] = e.valeur;
          continue;
        }
        if (sim.entrees[e.broche] !== e.valeur) {
          sim.entrees[e.broche] = e.valeur;
          sim.journal.push({ t: sim.t, broche: e.broche, valeur: e.valeur, type: 'entree' });
        }
      }
    }

    // Bloc en cours de chaque fil actif : le dernier bloc commencé avant son adresse.
    function blocA(pc) {
      let lo = 0;
      let hi = adresses.length - 1;
      let r = -1;
      while (lo <= hi) {
        const m = (lo + hi) >> 1;
        if (adresses[m] <= pc) {
          r = m;
          lo = m + 1;
        } else hi = m - 1;
      }
      return r < 0 ? null : compile.carte[r][1];
    }
    function noterVariables() {
      compile.noms.variables.forEach((n, i) => {
        if (!n || n.charCodeAt(0) === 0) return;
        const v = vm.variables[i] || 0;
        if (sim.variables[n] !== v) {
          if (n in sim.variables) sim.journal.push({ t: sim.t, broche: n, valeur: v, type: 'variable' });
          sim.variables[n] = v;
        }
      });
    }
    // Bloc en cours de chaque fil : celui de la dernière instruction exécutée (un fil qui attend est encore dans
    // son bloc « attendre » ; un fil pas encore parti montre son premier bloc).
    function noterBlocs() {
      sim.blocsEnCours = vm.fils
        .filter((f) => f.actif)
        .map((f) => blocA(f.ici === null ? f.pc : f.ici))
        .filter((id) => id !== null);
      sim.blocEnCours = sim.blocsEnCours.length ? sim.blocsEnCours[0] : null;
    }
    noterVariables();

    function executer() {
      reveil = vm.avancer(sim.t);
      noterVariables();
    }

    function avancerJusqua(cible) {
      for (;;) {
        appliquerEntrees();
        executer();
        if (sim.t >= cible) break;
        let suivant = Math.min(reveil, cible);
        if (planifiees.length && planifiees[0].t < suivant) suivant = planifiees[0].t;
        if (suivant <= sim.t) suivant = sim.t + 1;
        sim.t = suivant;
      }
      noterBlocs();
    }

    // Pas à pas : exécute le bloc surligné et s'arrête au début du suivant, sans l'exécuter (les attentes sont
    // sautées). Au premier appel, rien n'est exécuté : le premier bloc est seulement surligné.
    let arret = null; // { fil, pc } : bloc surligné par le pas précédent
    function pas() {
      let premier = true;
      for (let n = 0; n < 5000; n++) {
        appliquerEntrees();
        const f = vm.filPret(sim.t);
        if (!f) {
          const r = vm.prochainReveil();
          const prochaine = planifiees.length ? planifiees[0].t : Infinity;
          const t = Math.min(r, prochaine);
          if (t === Infinity) break;
          sim.t = Math.max(t, sim.t);
          continue;
        }
        const dejaSurligne = premier && arret && arret.fil === f && arret.pc === f.pc;
        if (debuts.has(f.pc) && !dejaSurligne) {
          arret = { fil: f, pc: f.pc };
          sim.blocEnCours = debuts.get(f.pc);
          sim.blocsEnCours = [sim.blocEnCours];
          return;
        }
        vm.unPas(sim.t);
        noterVariables();
        premier = false;
      }
      noterBlocs();
    }

    return sim;
  }

  // Position réelle du bras d'un servo à l'instant t (il tourne à vitesse constante vers sa consigne).
  function positionServo(journal, broche, t, initiale) {
    let pos = initiale || 0;
    let cible = pos;
    let depuis = 0;
    for (const e of journal) {
      if (e.t > t) break;
      if (e.broche !== broche || e.type !== 'servo') continue;
      pos = approcher(pos, cible, (e.t - depuis) * VITESSE_SERVO);
      cible = e.valeur;
      depuis = e.t;
    }
    return approcher(pos, cible, (t - depuis) * VITESSE_SERVO);
  }

  function approcher(pos, cible, pasMax) {
    if (Math.abs(cible - pos) <= pasMax) return cible;
    return pos + Math.sign(cible - pos) * pasMax;
  }

  // Chronologie « visible » d'une broche entre t0 et t1 : liste de segments { debut, fin, valeur }.
  // Un état qui dure moins de « seuil » ms (5 ms) est invisible : il est fusionné avec ses voisins.
  function chronologie(journal, broche, initiale, t0, t1, seuil) {
    const s = seuil === undefined ? 5 : seuil;
    const brut = [{ debut: 0, valeur: initiale || 0 }];
    for (const e of journal) {
      if (e.t > t1) break;
      if (e.broche !== broche || e.type === 'variable' || e.type === 'son') continue;
      const dernier = brut[brut.length - 1];
      if (e.t === dernier.debut) dernier.valeur = e.valeur;
      else brut.push({ debut: e.t, valeur: e.valeur });
    }
    for (let i = 0; i < brut.length; i++) brut[i].fin = i + 1 < brut.length ? brut[i + 1].debut : t1;
    // On retire les états trop courts (sauf le dernier, encore en cours), puis on fusionne.
    const visibles = [];
    for (let i = 0; i < brut.length; i++) {
      const seg = brut[i];
      const court = seg.fin - seg.debut < s && i < brut.length - 1;
      if (court && visibles.length) {
        visibles[visibles.length - 1].fin = seg.fin;
        continue;
      }
      if (court && !visibles.length) {
        // Premier état trop court : il est absorbé par le suivant.
        brut[i + 1].debut = seg.debut;
        continue;
      }
      const prec = visibles[visibles.length - 1];
      if (prec && egales(prec.valeur, seg.valeur)) prec.fin = seg.fin;
      else visibles.push({ debut: seg.debut, fin: seg.fin, valeur: seg.valeur });
    }
    // Découpe sur [t0, t1].
    const resultat = [];
    for (const seg of visibles) {
      if (seg.fin <= t0 && !(seg.fin === t0 && t0 === t1)) continue;
      if (seg.debut > t1) break;
      resultat.push({ debut: Math.max(seg.debut, t0), fin: Math.min(seg.fin, t1), valeur: seg.valeur });
    }
    if (!resultat.length) resultat.push({ debut: t0, fin: t1, valeur: visibles[visibles.length - 1].valeur });
    return resultat;
  }

  function egales(a, b) {
    return Math.abs(a - b) < 0.5;
  }

  const api = { creerSimulation, positionServo, chronologie, egales, VITESSE_SERVO };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/direct.js =====
// Mode « En direct » (jalon 4) : le programme tourne dans le navigateur — le même simulateur, au rythme de l'horloge —
// et la vraie carte obéit : chaque changement d'une sortie part en commande du protocole v2, les boutons de la carte
// reviennent en événements (« E <broche> <niveau> ») et ses capteurs sont relus régulièrement.
// Ici, rien n'est envoyé : on calcule seulement les lignes à envoyer (testable sans carte). L'envoi, l'attente des
// réponses et le signe de vie sont dans interface/carte.js.
//
//   const d = creerDirect(programme, { composants, boutonsVersMasse, carte, capteurs });
//   d.depart            lignes à envoyer avant de lancer (OFF, modes des boutons, surveillance W)
//   d.avancer(t)        fait tourner le programme jusqu'à t (ms) → lignes à envoyer (sorties changées)
//   d.evenement(ligne)  « E 3 0 » reçu de la carte → le bouton change dans le programme
//   d.lectures          capteurs à relire : [{ ligne: 'X 1 2 3', appliquer(valeur) }]
//   d.fin               lignes à envoyer à l'arrêt (plus de surveillance, tout éteindre)
(function (global) {
  'use strict';

  const enNode = typeof module === 'object' && module.exports;
  const S = enNode ? require('./simulation.js') : global.LaboBlocs;
  const N = enNode ? require('./code-octet.js') : global.LaboBlocs.codeOctet;
  const K = () => (enNode ? require('./cartes.js') : global.LaboBlocs);

  // Commandes d'extension qui lisent un capteur (les autres agissent : moteurs, LED, écran, son).
  const LECTURES = { 1: [2, 3, 4, 5], 2: [5, 6, 7, 8, 9, 10, 13] };
  const estLecture = (e, c) => (LECTURES[e] || []).includes(c);

  // La carte ne lit que des entiers (« X 1 1 50 50 ») : les valeurs sont arrondies. Une note de la micro:bit dure
  // au moins 1 s en direct (sa durée est en secondes dans la commande) ; la suivante la remplace à son heure.
  function ligneExtension(e, c, args) {
    let a = args.map((x) => Math.round(Number(x) || 0));
    if (e === 2 && c === 12) a = [a[0], Math.max(1, Math.round(Number(args[1]) || 0))];
    return ['X', e, c, ...a].join(' ');
  }

  // Lectures que fait le programme : on cherche les commandes d'extension de lecture dans ses blocs (blocs de carte
  // déroulés). Seuls ces capteurs sont relus pendant le mode direct.
  function lecturesDuProgramme(programme) {
    const vues = new Map();
    const voir = (x) => {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(voir);
      if (x.bloc === 'ext' && estLecture(x.extension, x.commande)) {
        const args = (x.arguments || []).map((v) => (typeof v === 'number' ? v : v && v.bloc === 'nombre' ? Number(v.valeur) : 0));
        vues.set(`${x.extension} ${x.commande} ${args.join(' ')}`.trim(), { e: x.extension, c: x.commande, args });
      }
      if (x.bloc && K().BLOCS_CARTES && K().BLOCS_CARTES[x.bloc]) voir(K().deroulerBlocCarte(x));
      for (const v of Object.values(x)) if (v && typeof v === 'object') voir(v);
    };
    voir(programme);
    return [...vues.values()];
  }

  function creerDirect(programme, options) {
    const o = options || {};
    const carte = o.carte || 'uno';
    const versMasse = o.boutonsVersMasse !== false;
    const envoisExt = [];
    // Une commande qui redonne le même ordre (boucle sans attente : « avancer à 50 % » mille fois par seconde)
    // ne repart pas. Ordres liés : les deux moteurs ensemble ou chacun seul ; les deux LED ensemble ou chacune ;
    // l'écran de la micro:bit (une image, un point, un texte) ; l'afficheur du mBot. Un texte qui défile repart
    // quand il a fini de défiler (comme dans le simulateur).
    const derniers = new Map();
    // Ordres en plusieurs morceaux (texte, dessin de l'afficheur) : les morceaux attendent la dernière commande et
    // partent avec elle, ou pas du tout si l'ordre entier redonne le précédent.
    const MORCEAUX = { 1: [10, 14], 2: [14] };
    let morceaux = [];
    function groupe(e, c, a) {
      if (e === 1 && (c === 1 || c === 9)) return { cle: c === 1 ? 'moteurs' : 'moteur' + a[0], efface: c === 1 ? ['moteur1', 'moteur2'] : ['moteurs'] };
      if (e === 1 && c === 6) return { cle: 'led' + a[0], efface: Number(a[0]) === 0 ? ['led1', 'led2'] : ['led0'] };
      if (e === 2 && [1, 2, 3, 4, 11, 15].includes(c)) return { cle: 'ecran', efface: [] };
      if (e === 1 && [11, 12, 13, 15].includes(c)) return { cle: 'matrice', efface: [] };
      return null;
    }
    // Durée d'un texte qui défile (ms) ; un ordre qui ne défile pas reste valable tant qu'un autre ne le remplace pas.
    function dureeDefilement(e, c, ordre) {
      const lettres = ordre.reduce((n, l) => n + l.split(' ').length - 3, 0);
      if (e === 2 && c === 11) return (lettres * 6 + 5) * 150;
      let colonnes = e === 1 && c === 15 ? lettres * 6 - 1 : 0;
      if (e === 1 && c === 12) {
        const n = K().texteNombre(Number(ordre[ordre.length - 1].split(' ')[3]));
        if (!n.etroit) colonnes = n.texte.length * 6 - 1;
      }
      return colonnes > 16 ? (colonnes + 16) * K().DUREE_COLONNE_MATRICE : Infinity;
    }
    function envoyerExtension(e, c, args) {
      if (e === 3 || e === 4) return; // caméra, clavier : dans l'ordinateur, jamais vers la carte
      const ligne = ligneExtension(e, c, args);
      if ((MORCEAUX[e] || []).includes(c)) return morceaux.push(ligne);
      const ordre = morceaux.concat(ligne);
      morceaux = [];
      const g = groupe(e, c, args.map((x) => Math.round(Number(x) || 0)));
      if (g) {
        const avant = derniers.get(g.cle);
        if (avant && avant.ordre === ordre.join('\n') && sim.t < avant.jusqua) return;
        derniers.set(g.cle, { ordre: ordre.join('\n'), jusqua: sim.t + dureeDefilement(e, c, ordre) });
        for (const k of g.efface) derniers.delete(k);
      }
      envoisExt.push(...ordre);
    }
    const sim = S.creerSimulation(programme, {
      composants: o.composants,
      boutonsVersMasse: o.boutonsVersMasse,
      carte,
      capteurs: o.capteurs,
      surExtension: (e, c, args) => {
        if (!estLecture(e, c)) envoyerExtension(e, c, args);
      },
    });
    const numero = (b) => N.numeroBroche(b);
    // Le bouton du joystick va toujours à la masse (résistance interne), quel que soit le réglage du parcours.
    const boutons = (o.composants || []).filter((c) => c.type === 'bouton').concat(K().composantsJoystick(o.composants).map((c) => Object.assign({}, c, { masse: true })));
    const aLaMasse = (b) => b.masse || versMasse;

    // Au départ : tout éteint, boutons en entrée (avec la résistance interne s'ils vont à la masse), surveillés.
    const depart = ['OFF'];
    for (const b of boutons) depart.push(`M ${numero(b.broche)} ${aLaMasse(b) ? 'P' : 'I'}`);
    if (boutons.length) depart.push('W ' + boutons.map((b) => numero(b.broche)).join(' '));

    let lu = 0; // entrées du journal déjà traduites en commandes
    function avancer(t) {
      envoisExt.length = 0;
      sim.avancerJusqua(Math.max(t, sim.t));
      const parBroche = new Map(); // une broche changée plusieurs fois : seul son dernier état part
      const lignes = [];
      for (; lu < sim.journal.length; lu++) {
        const j = sim.journal[lu];
        if (!/^[DP]\d+$/.test(j.broche)) continue; // moteurs, LED du mBot, haut-parleur : par les commandes X
        const n = numero(j.broche);
        if (j.type === 'led') parBroche.set(n, `D ${n} ${j.valeur ? 1 : 0}`);
        else if (j.type === 'pwm') parBroche.set(n, `A ${n} ${Math.round(j.valeur)}`);
        else if (j.type === 'servo') parBroche.set(n, `S ${n} ${Math.max(0, Math.min(180, Math.round(j.valeur)))}`);
        else if (j.type === 'son' && j.valeur > 0) lignes.push(`T ${n} ${Math.round(j.valeur)} ${Math.max(1, Math.round(j.duree))}`);
      }
      // Les sorties d'abord, puis les commandes de carte, dans l'ordre où le programme les a données.
      return [...parBroche.values(), ...lignes, ...envoisExt.splice(0)];
    }

    // « E 3 0 » : niveau électrique de la broche 3. Bouton vers la masse : appuyé = niveau 0.
    function evenement(ligne) {
      const m = /^E (\d+) ([01])/.exec(ligne || '');
      if (!m) return false;
      const b = boutons.find((x) => numero(x.broche) === Number(m[1]));
      if (!b) return false;
      const niveau = Number(m[2]);
      sim.changerEntree(b.broche, aLaMasse(b) ? (niveau ? 0 : 1) : niveau);
      return true;
    }

    // Capteurs relus pendant le mode direct, rangés là où le programme les lit (sim.capteurs, sim.entrees).
    const lectures = lecturesDuProgramme(programme).map(({ e, c, args }) => {
      const ligne = ['X', e, c, ...args].join(' ');
      let appliquer = () => {};
      const entree = (nom) => (v) => {
        if ((sim.entrees[nom] || 0) !== (v ? 1 : 0)) sim.changerEntree(nom, v ? 1 : 0);
      };
      const capteur = (nom) => (v) => {
        if (sim.capteurs) sim.capteurs[nom] = v;
      };
      if (e === 1) appliquer = { 2: capteur('distance'), 3: capteur('ligne'), 4: entree('bouton'), 5: capteur('lumiere') }[c];
      else if (e === 2) {
        if (c === 5) appliquer = entree('A');
        else if (c === 6) appliquer = entree('B');
        else if (c === 9) appliquer = entree('logo');
        else if (c === 7) appliquer = capteur(['x', 'y', 'z'][(args[0] || 1) - 1] || 'x');
        else if (c === 8) appliquer = capteur('temperature');
        else if (c === 10) appliquer = capteur('lumiere');
        else if (c === 13) {
          // Geste : la carte dit seulement « oui » pour le geste demandé.
          appliquer = (v) => {
            if (!sim.capteurs) return;
            if (v) sim.capteurs.geste = args[0];
            else if (Number(sim.capteurs.geste) === Number(args[0])) sim.capteurs.geste = 0;
          };
        }
      }
      return { ligne, appliquer };
    });
    // Joystick : ses deux axes sont relus (« RA 14 » → « V 14 512 »), le programme les lit dans le simulateur.
    const joystick = K().joystickDe(o.composants);
    if (joystick) {
      for (const b of [joystick.broche, joystick.y]) {
        lectures.push({ ligne: `RA ${numero(b)}`, broche: true, appliquer: (v) => sim.entrees[b] !== v && sim.changerAnalogique(b, v) });
      }
    }

    // Réponse « V 12 » à une lecture (« V <broche> <valeur> » pour une broche).
    function lire(lecture, reponse) {
      const m = (lecture.broche ? /^V \d+ (-?[\d.]+)/ : /^V (-?[\d.]+)/).exec(reponse || '');
      if (!m) return false;
      lecture.appliquer(Number(m[1]));
      return true;
    }

    return { sim, depart, avancer, evenement, lectures, lire, fin: boutons.length ? ['W', 'OFF'] : ['OFF'] };
  }

  const api = { creerDirect, lecturesDuProgramme, ligneExtension };
  if (enNode) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/validation.js =====
// Vérification d'un exercice (reprise de l'atelier du distributeur) : rejoue ses scénarios dans le moteur, en temps virtuel, et observe
// le comportement (jamais la forme du programme). Seul le premier écart est signalé, avec une
// phrase observable et bienveillante, par exemple :
// « Quand le bouton D8 est appuyé, la LED D3 devrait être allumée. Dans ton programme, elle reste éteinte. »
//
// Étapes d'un scénario (durées en secondes) :
//   { attendre: 1 }
//   { appuyer: 'D8' }                 appui de 0,2 s, puis le bouton est relâché tout seul
//   { maintenir: 'D8' } / { relacher: 'D8' }
//   { verifier: { D3: 1, D4: 0 }, delai: 0.3 }               l'état doit être atteint dans le délai
//   { sequence: 'D3', valeurs: [1, 0], intervalle: 2, duree: 10, changements: 4 }
//   { opposees: ['D3', 'D4'], duree: 10 }
//   { impulsion: { D5: 1 }, duree: 5, tolerance: 0.5, delai: 0.3 }   allumé 5 s ±0,5 puis éteint
//   { stable: { D6: 90 }, duree: 2 }
//   { regler: { distance: 10 } }      capteur de la carte (mBot, micro:bit) réglé à cette valeur
//   { regler: { camera: 2 } }         la caméra reconnaît l'étiquette n° 2 de l'exercice (0 = rien)
// Toute vérification accepte « contexte » et « attendu » pour remplacer le début de la phrase.

(function (global) {
  'use strict';

  const M = typeof module === 'object' && module.exports ? require('./simulation.js') : global.LaboBlocs;
  const CARTES = () => (typeof module === 'object' && module.exports ? require('./cartes.js') : global.LaboBlocs);
  // Composants branchés + ce qui est déjà sur la carte (boutons A et B de la micro:bit, moteurs du mBot…).
  // Les touches du clavier de l'ordinateur aussi, dans les exercices qui ont ses blocs (« la touche flèche haut »).
  const tous = (exercice) => (exercice.composants || []).concat(exercice.carte && exercice.carte !== 'uno' ? CARTES().composantsCarte(exercice.carte) : [], CARTES().composantsClavier(exercice), CARTES().composantsJoystick(exercice.composants));

  const SEUIL = 5; // ms : deux changements plus proches sont simultanés
  const TOLERANCE = 300; // ms sur les durées
  const DUREE_APPUI = 200; // ms

  const ms = (s) => Math.round(Number(s) * 1000);

  function nombreFr(x) {
    const r = Math.round(x * 10) / 10;
    return String(r).replace('.', ',');
  }
  const secondes = (d) => nombreFr(d / 1000) + ' s';

  function majuscule(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // « la caméra reconnaît « Loup » » : le nom de l'étiquette vient de l'exercice (camera.etiquettes, n° 1, 2…).
  function decrireCamera(exercice, valeur) {
    const n = Math.round(Number(valeur) || 0);
    const noms = (exercice.camera && exercice.camera.etiquettes) || [];
    if (!n) return 'la caméra ne reconnaît rien';
    return noms[n - 1] ? `la caméra reconnaît « ${noms[n - 1]} »` : `la caméra reconnaît l’étiquette ${n}`;
  }

  // ---------- Noms des composants dans les phrases ----------

  function composant(exercice, broche) {
    return tous(exercice).find((c) => c.broche === broche) || { type: deviner(broche), broche };
  }

  function deviner(broche) {
    return broche === 'D5' || broche === 'D6' ? 'servo' : 'led';
  }

  function nomComposant(c) {
    if (c.libelle) return c.libelle;
    if (c.type === 'joystick') return 'le joystick';
    const mot = { led: 'la LED', bouton: 'le bouton', servo: 'le moteur' }[c.type] || 'la broche';
    return c.nom ? `${mot} ${c.nom} (${c.broche})` : `${mot} ${c.broche}`;
  }

  const pronom = (c) => (c.type === 'led' ? 'elle' : 'il');

  function etatLed(v) {
    return v ? 'allumée' : 'éteinte';
  }

  // « être allumée », « être à 90° »
  function etreA(c, v) {
    if (c.type === 'moteur') return v ? `tourner à ${nombreFr(v)} %` : 'être arrêté';
    return c.type === 'servo' ? `être à ${nombreFr(v)}°` : `être ${etatLed(v)}`;
  }
  // « reste éteinte », « reste à 0° », « est allumée »
  function constat(c, v, reste) {
    const verbe = reste ? 'reste' : 'est';
    if (c.type === 'moteur') return v ? `il tourne à ${nombreFr(v)} %` : `il ${verbe} arrêté`;
    return c.type === 'servo' ? `${pronom(c)} ${verbe} à ${nombreFr(v)}°` : `${pronom(c)} ${verbe} ${etatLed(v)}`;
  }

  function phrase(contexte, attendu, observe, indice) {
    const debut = contexte ? `${contexte}, ${attendu}` : majuscule(attendu);
    return `${majuscule(debut)}. Dans ton programme, ${observe}.${indice ? ' ' + indice : ''}`;
  }

  // ---------- Scénario ----------

  function jouerScenario(exercice, programme, scenario) {
    const sim = M.creerSimulation(programme, { composants: exercice.composants, carte: exercice.carte });
    const boutons = tous(exercice).filter((c) => c.type === 'bouton');
    const maintenus = [];
    let appuis = [];
    let relache = null;
    let curseur = 0;
    const entrees = []; // pour rejouer le test à l'écran : { t, broche, valeur }

    const initiale = (b) => sim.initiales[b] || 0;
    const segments = (b, t0, t1) => M.chronologie(sim.journal, b, initiale(b), t0, t1, SEUIL);
    function valeurA(b, t) {
      const segs = segments(b, 0, Math.max(t, sim.t));
      for (const s of segs) if (s.debut <= t && t < s.fin) return s.valeur;
      return segs[segs.length - 1].valeur;
    }
    function aChange(b, t0, t1) {
      return segments(b, t0, t1).length > 1;
    }
    let reglage = null; // dernier capteur réglé : { nom, valeur }
    function regler(etape) {
      const t = (curseur = Math.max(curseur, sim.t));
      for (const [nom, valeur] of Object.entries(etape.regler || {})) {
        sim.planifierCapteur(t, nom, valeur);
        entrees.push({ t, capteur: nom, valeur: Number(valeur) || 0 });
        reglage = { nom, valeur };
      }
    }
    function planifier(t, broche, valeur) {
      sim.planifierEntree(t, broche, valeur);
      entrees.push({ t: Math.max(t, sim.t), broche, valeur });
    }

    function contexte(etape) {
      if (etape.contexte) return etape.contexte;
      const nom = (b) => nomComposant(composant(exercice, b));
      // « la touche … est appuyée » : accord au féminin (composant « feminin »).
      const e = (liste) => (liste.every((b) => composant(exercice, b).feminin) ? 'e' : '');
      if (maintenus.length === 1) return `quand ${nom(maintenus[0])} est appuyé${e(maintenus)}`;
      if (maintenus.length > 1) return `quand ${maintenus.map(nom).join(' et ')} sont appuyé${e(maintenus)}s`;
      if (relache) return `quand ${nom(relache)} est relâché${e([relache])}`;
      if (appuis.length) {
        const derniers = appuis.slice(-2).map(nom);
        return derniers.length === 2
          ? `après un appui sur ${derniers[0]} puis sur ${derniers[1]}`
          : `après un appui sur ${derniers[0]}`;
      }
      if (reglage && reglage.nom === 'camera') return `quand ${decrireCamera(exercice, reglage.valeur)}`;
      if (reglage) return `quand ${CARTES().decrireCapteur(reglage.nom, reglage.valeur)}`;
      if (boutons.length) return 'quand aucun bouton n’est appuyé';
      // Sans bouton, seule une vérification d'état à un instant donné a besoin d'un repère de temps.
      return 'verifier' in etape ? `au bout de ${secondes(curseur)}` : '';
    }

    // Une sortie attendue jamais écrite, mais une autre broche du même genre l'a été : on le dit.
    const declarees = new Set(tous(exercice).map((x) => x.broche));
    function indiceSortie(broche) {
      if (sim.journal.some((e) => e.broche === broche && e.type !== 'entree')) return '';
      const c = composant(exercice, broche);
      // Une sortie du même genre sur une broche où l'exercice n'a pas de composant de ce genre.
      const memeGenre = new Set(tous(exercice).filter((x) => x.type === c.type).map((x) => x.broche));
      const autre = sim.journal.find((e) => e.type === c.type && !memeGenre.has(e.broche));
      return autre ? `Ton programme agit sur la broche ${autre.broche} : vérifie la broche choisie dans le bloc.` : '';
    }
    // Le programme lit un bouton sur une broche où il n'y a pas de bouton (ex. D9 au lieu de D8).
    const boutonsLus = (() => {
      const lus = new Set();
      const voir = (x) => {
        if (!x || typeof x !== 'object') return;
        if (Array.isArray(x)) return x.forEach(voir);
        if (x.bloc === 'bouton_etat' && x.broche) lus.add(x.broche);
        for (const v of Object.values(x)) if (v && typeof v === 'object') voir(v);
      };
      voir(programme);
      return [...lus].filter((b) => !declarees.has(b));
    })();
    function indiceBroche(broche) {
      const sortie = indiceSortie(broche);
      if (sortie || !boutons.length || !boutonsLus.length) return sortie;
      return `Ton programme lit un bouton sur la broche ${boutonsLus[0]} : vérifie la broche choisie dans le bloc « état sur la broche ».`;
    }

    const ecart = (message) => ({ reussi: false, message, temps: curseur, entrees, journal: sim.journal });

    // ----- Vérifications -----

    function verifier(etape) {
      const attendus = etape.verifier;
      const delai = ms(etape.delai === undefined ? 0.3 : etape.delai);
      // L'état est lu à la fin du délai : avant, le programme n'a peut-être pas encore réagi.
      const debut = curseur;
      const fin = debut + delai;
      sim.avancerJusqua(fin + SEUIL);
      curseur = fin;
      const b = Object.keys(attendus).find((x) => !M.egales(valeurA(x, fin), attendus[x]));
      if (!b) return null;
      const c = composant(exercice, b);
      const v = valeurA(b, fin);
      const reste = !aChange(b, Math.max(0, debut - 500), fin + SEUIL);
      return ecart(
        phrase(
          contexte(etape),
          etape.attendu || `${nomComposant(c)} devrait ${etreA(c, attendus[b])}`,
          constat(c, v, reste),
          indiceBroche(b),
        ),
      );
    }

    function sequence(etape) {
      const b = etape.sequence;
      const c = composant(exercice, b);
      const valeurs = etape.valeurs;
      const intervalle = ms(etape.intervalle);
      const t0 = curseur;
      const t1 = curseur + ms(etape.duree);
      sim.avancerJusqua(t1 + SEUIL);
      curseur = t1;
      const segs = segments(b, t0, t1);
      const acceptes = (v) => {
        const autres = etape.intervalles && etape.intervalles[String(v)];
        return (autres || [etape.intervalle]).map(ms);
      };
      const attendu =
        etape.attendu ||
        (c.type === 'servo'
          ? `${nomComposant(c)} devrait passer par ${valeurs.map((v) => nombreFr(v) + '°').join(', ')}, ` +
            `puis recommencer, en changeant toutes les ${secondes(intervalle)}`
          : `${nomComposant(c)} devrait s’allumer et s’éteindre en changeant toutes les ${secondes(intervalle)}`);
      const dire = (observe) => ecart(phrase(etape.contexte || '', attendu, observe, indiceBroche(b)));

      if (segs.length === 1) return dire(constat(c, segs[0].valeur, true));

      // Ordre des valeurs : la suite doit suivre le motif, en commençant n'importe où.
      const n = valeurs.length;
      let meilleur = -1;
      let rupture = 0;
      for (let k = 0; k < n; k++) {
        let i = 0;
        while (i < segs.length && M.egales(segs[i].valeur, valeurs[(k + i) % n])) i++;
        if (i === segs.length) {
          meilleur = k;
          break;
        }
        if (i > rupture) rupture = i;
      }
      if (meilleur < 0) {
        const a = segs[Math.max(0, rupture - 1)].valeur;
        const z = segs[Math.max(1, rupture)].valeur;
        const val = (v) => (c.type === 'servo' ? nombreFr(v) + '°' : etatLed(v));
        return dire(
          rupture === 0
            ? `${pronom(c)} commence ${c.type === 'servo' ? 'à ' : ''}${val(segs[0].valeur)}`
            : `${pronom(c)} passe ${c.type === 'servo' ? 'de ' + val(a) + ' à ' + val(z) : 'de ' + val(a) + ' à ' + val(z)}`,
        );
      }

      // Durée de chaque état (le premier et le dernier sont coupés par la fenêtre d'observation).
      for (let i = 1; i < segs.length - 1; i++) {
        const d = segs[i].fin - segs[i].debut;
        if (!acceptes(segs[i].valeur).some((a) => Math.abs(d - a) <= TOLERANCE)) {
          return dire(
            c.type === 'servo'
              ? `${pronom(c)} reste ${secondes(d)} à ${nombreFr(segs[i].valeur)}°`
              : `${pronom(c)} reste ${etatLed(segs[i].valeur)} pendant ${secondes(d)}`,
          );
        }
      }
      const der = segs[segs.length - 1];
      const maxi = Math.max(...acceptes(der.valeur));
      if (der.fin - der.debut > maxi + TOLERANCE) return dire(`${pronom(c)} change, puis ${constat(c, der.valeur, true)}`);

      const changements = segs.length - 1;
      if (changements < etape.changements) {
        return dire(`${pronom(c)} ne change que ${changements} fois en ${secondes(t1 - t0)}`);
      }
      return null;
    }

    function opposees(etape) {
      const [a, b] = etape.opposees;
      const ca = composant(exercice, a);
      const cb = composant(exercice, b);
      const t0 = curseur;
      const t1 = curseur + ms(etape.duree);
      sim.avancerJusqua(t1 + SEUIL);
      curseur = t1;
      const sa = segments(a, t0, t1);
      const sb = segments(b, t0, t1);
      const bornes = [...new Set([t0, t1, ...sa.map((s) => s.debut), ...sb.map((s) => s.debut)])].sort((x, y) => x - y);
      for (let i = 0; i + 1 < bornes.length; i++) {
        if (bornes[i + 1] - bornes[i] < SEUIL) continue;
        const m = (bornes[i] + bornes[i + 1]) / 2;
        const va = sa.find((s) => s.debut <= m && m < s.fin).valeur;
        const vb = sb.find((s) => s.debut <= m && m < s.fin).valeur;
        if (va === vb) {
          const attendu =
            etape.attendu ||
            `${nomComposant(ca)} et ${nomComposant(cb)} devraient toujours faire l’inverse : ` +
              'quand l’une est allumée, l’autre est éteinte';
          return ecart(
            phrase(
              etape.contexte || '',
              attendu,
              `elles sont toutes les deux ${va ? 'allumées' : 'éteintes'} en même temps`,
              indiceBroche(va ? a : b) || indiceBroche(a) || indiceBroche(b),
            ),
          );
        }
      }
      return null;
    }

    function impulsion(etape) {
      const attendus = etape.impulsion;
      const duree = ms(etape.duree);
      const tol = ms(etape.tolerance === undefined ? 0.5 : etape.tolerance);
      const delai = ms(etape.delai === undefined ? 0.3 : etape.delai);
      const t0 = curseur;
      const tmax = t0 + delai + 2 * duree + tol + 1000;
      const broches = Object.keys(attendus);
      // L'état attendu, s'il a commencé dans le délai et s'il est déjà terminé (suivi d'un autre état visible).
      const etatAttendu = (b) =>
        segments(b, t0, sim.t).find((s) => M.egales(s.valeur, attendus[b]) && s.debut <= t0 + delai && s.fin > t0);
      const termine = (b) => {
        const s = etatAttendu(b);
        return !s || sim.t - s.fin >= SEUIL;
      };
      // On avance par petits pas jusqu'à la fin de l'impulsion, pour ne pas décaler la suite du scénario.
      sim.avancerJusqua(t0 + delai + SEUIL);
      while (sim.t < tmax && !broches.every(termine)) sim.avancerJusqua(Math.min(tmax, sim.t + 50));
      let fin = t0;
      for (const b of broches) {
        const c = composant(exercice, b);
        const v = attendus[b];
        const attendu =
          etape.attendu ||
          (c.type === 'servo'
            ? `${nomComposant(c)} devrait rester à ${nombreFr(v)}° pendant ${secondes(duree)}`
            : `${nomComposant(c)} devrait rester ${etatLed(v)} ${secondes(duree)}, puis ${v ? 's’éteindre' : 's’allumer'}`);
        const dire = (observe) => ecart(phrase(contexte(etape), attendu, observe, indiceBroche(b)));
        const seg = etatAttendu(b);
        if (!seg) {
          const action = c.type === 'servo' ? `ne va pas à ${nombreFr(v)}°` : `ne s’${v ? 'allume' : 'éteint'} pas`;
          return dire(`${pronom(c)} ${action}`);
        }
        // Début réel de l'état (il a pu commencer avant t0, pendant la vérification précédente).
        const debut = segments(b, 0, sim.t).find((s) => s.debut <= seg.debut && seg.debut < s.fin).debut;
        const d = seg.fin - debut;
        const dit = c.type === 'servo' ? `${pronom(c)} reste à ${nombreFr(v)}°` : `${pronom(c)} reste ${etatLed(v)}`;
        if (sim.t - seg.fin < SEUIL) return dire(`${dit} et ne ${c.type === 'servo' ? 'revient' : v ? 's’éteint' : 's’allume'} plus`);
        if (Math.abs(d - duree) > tol) return dire(`${dit} pendant ${secondes(d)}`);
        fin = Math.max(fin, seg.fin);
      }
      curseur = fin;
      return null;
    }

    function stable(etape) {
      const attendus = etape.stable;
      const t0 = curseur;
      const t1 = curseur + ms(etape.duree);
      sim.avancerJusqua(t1 + SEUIL);
      for (const b of Object.keys(attendus)) {
        const c = composant(exercice, b);
        const v = attendus[b];
        const autre = segments(b, t0, t1).find((s) => !M.egales(s.valeur, v));
        if (!autre) continue;
        const attendu =
          etape.attendu ||
          (c.type === 'servo' ? `${nomComposant(c)} devrait rester à ${nombreFr(v)}°` : `${nomComposant(c)} devrait rester ${etatLed(v)}`);
        // Avec une phrase « attendu » personnalisée, le pronom ne renverrait à rien : on nomme le composant.
        const qui = etape.attendu ? nomComposant(c) : pronom(c);
        const observe =
          c.type === 'servo'
            ? `${qui} va à ${nombreFr(autre.valeur)}°`
            : `${qui} ${autre.valeur ? 's’allume' : 's’éteint'}`;
        return ecart(phrase(contexte(etape), attendu, observe, ''));
      }
      curseur = t1;
      return null;
    }

    for (const etape of scenario.etapes) {
      let r = null;
      if ('attendre' in etape) {
        curseur += ms(etape.attendre);
        sim.avancerJusqua(curseur);
      } else if ('appuyer' in etape) {
        const t = (curseur = Math.max(curseur, sim.t));
        planifier(t, etape.appuyer, 1);
        planifier(t + DUREE_APPUI, etape.appuyer, 0);
        appuis.push(etape.appuyer);
        relache = null;
      } else if ('maintenir' in etape) {
        planifier((curseur = Math.max(curseur, sim.t)), etape.maintenir, 1);
        if (!maintenus.includes(etape.maintenir)) maintenus.push(etape.maintenir);
        appuis = [];
        relache = null;
      } else if ('relacher' in etape) {
        planifier((curseur = Math.max(curseur, sim.t)), etape.relacher, 0);
        maintenus.splice(maintenus.indexOf(etape.relacher), 1);
        appuis = [];
        relache = etape.relacher;
      } else if ('regler' in etape) regler(etape);
      else if ('verifier' in etape) r = verifier(etape);
      else if ('sequence' in etape) r = sequence(etape);
      else if ('opposees' in etape) r = opposees(etape);
      else if ('impulsion' in etape) r = impulsion(etape);
      else if ('stable' in etape) r = stable(etape);
      else throw new Error('Étape de scénario inconnue : ' + JSON.stringify(etape));
      if (r) return r;
    }
    return { reussi: true, temps: curseur, entrees, journal: sim.journal };
  }

  // Lance tous les scénarios d'un exercice. Renvoie { reussi } ou le premier écart :
  // { reussi: false, message, scenario (indice), temps, entrees (à rejouer), journal }.
  function valider(exercice, programme) {
    const scenarios = exercice.scenarios || [];
    for (let i = 0; i < scenarios.length; i++) {
      const r = jouerScenario(exercice, programme, scenarios[i]);
      if (!r.reussi) return Object.assign(r, { scenario: i, nomScenario: scenarios[i].nom || '' });
    }
    return { reussi: true };
  }

  const api = { valider, jouerScenario, nomComposant };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/arduino.js =====
// Traduction d'un programme (v1 ou atelier) en programme Arduino (C++), pour le panneau « code » du niveau 3
// (lecture seule) et l'export de secours vers l'IDE Arduino. Chaque bloc connaît ses lignes : un clic sur un bloc
// surligne son code.
//
// Choix électriques (comme l'atelier du distributeur) :
//   - LED : sortie numérique, HAUT = allumée ;
//   - bouton poussoir à 2 fils (signal + GND) : résistance interne (INPUT_PULLUP), appuyé = broche à la masse ;
//     dans les blocs, « état du bouton = HAUT » veut toujours dire « appuyé » : la fonction bouton() traduit.
//     Option boutonsVersMasse = false : module bouton qui donne HAUT quand on appuie (INPUT) ;
//   - servo-moteur : bibliothèque Servo, angle borné à 0–180.
// Sortie : { code, lignes: { idBloc: [première, dernière] } } (lignes comptées à partir de 1).

(function (global) {
  'use strict';

  const P = typeof module === 'object' && module.exports ? require('./programme.js') : global.LaboBlocs;
  const K = () => (typeof module === 'object' && module.exports ? require('./cartes.js') : global.LaboBlocs);

  const numero = (broche) => {
    const s = String(broche).toUpperCase();
    const a = /^A(\d)$/.exec(s);
    if (a) return 'A' + a[1];
    const n = Number(s.replace(/^[DP]/, ''));
    if (!Number.isInteger(n) || n < 0 || n > 20) throw new Error('Broche inconnue : ' + broche);
    return String(n);
  };
  const OPS = { '+': '+', '-': '-', '×': '*', '÷': '/' };
  const COMP = { '=': '==', '≠': '!=', '<': '<', '≤': '<=', '>': '>', '≥': '>=' };
  const nomC = (v) => String(v || 'CHOIX').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_]/g, '_').replace(/^(\d)/, '_$1');

  function versArduino(programme, options) {
    const o = options || {};
    const v1 = P.versV1(programme);
    const versMasse = o.boutonsVersMasse !== false;
    const leds = new Set();
    const boutons = new Set();
    const servos = new Set();
    const sons = new Set();
    const variables = new Set();
    let hasard = false;
    let modulo = false;
    let reetalonner = false;
    let joystickUtilise = false;
    // Joystick : le composant de l'exercice (broches X, Y, bouton).
    const J = K().joystickDe(o.composants);

    (function parcourir(x) {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (x.bloc === 'led_etat') leds.add(numero(x.broche));
      if (x.bloc === 'bouton_etat' || x.quand === 'appui' || x.quand === 'relache') boutons.add(numero(x.broche));
      if (x.bloc === 'servo_angle') servos.add(numero(x.broche));
      if (x.bloc === 'son') sons.add(numero(x.broche));
      if (x.bloc === 'variable' || x.bloc === 'affecter' || x.bloc === 'ajouter_a') variables.add(nomC(x.variable));
      if (x.bloc === 'hasard') hasard = true;
      if (x.bloc === 'operation' && x.op === 'mod') modulo = true;
      if (x.bloc === 'reetalonner') reetalonner = true;
      if (x.quand === 'joystick' || K().BLOCS_JOYSTICK.includes(x.bloc)) joystickUtilise = true;
      for (const v of Object.values(x)) if (v && typeof v === 'object') parcourir(v);
    })(v1.fils);

    const lignes = [];
    const carte = {};
    const ajouter = (t) => lignes.push(t);
    const nombre = (n) => String(Number(n) || 0);

    function expression(e) {
      if (e === null || e === undefined) return '0';
      if (typeof e === 'number') return nombre(e);
      switch (e.bloc) {
        case 'nombre':
          return nombre(e.valeur);
        case 'variable':
          return nomC(e.variable);
        case 'bouton_etat':
          return `bouton(${numero(e.broche)})`;
        case 'valeur_haut_bas':
          return e.valeur ? 'HIGH' : 'LOW';
        case 'comparaison':
          return `(${expression(e.a)} ${COMP[e.op] || '=='} ${expression(e.b)})`;
        case 'operation':
          return e.op === 'mod' ? `reste(${expression(e.a)}, ${expression(e.b)})` : `(${expression(e.a)} ${OPS[e.op] || '+'} ${expression(e.b)})`;
        case 'logique':
          return `(${expression(e.a)} ${e.op === 'ou' ? '||' : '&&'} ${expression(e.b)})`;
        case 'non':
          return `!(${expression(e.a)})`;
        case 'hasard':
          return `random(${expression(e.min)}, ${expression(e.max)} + 1)`;
        case 'reetalonner':
          return `reetalonner(${[e.valeur, e.de1, e.de2, e.vers1, e.vers2].map(expression).join(', ')})`;
        case 'joystick_valeur':
          return J ? `analogRead(${numero(e.axe === 'y' ? J.y : J.broche)})` : '0';
        case 'joystick_position':
          return J ? `${(e.axe === 'y' ? J.inverserY : J.inverserX) ? '-' : ''}positionJoystick(${numero(e.axe === 'y' ? J.y : J.broche)})` : '0';
        case 'joystick_direction':
          return J ? directionC(e.direction) : 'false';
        case 'joystick_bouton':
          return J ? `(digitalRead(${numero(J.bouton)}) == LOW)` : 'false';
        default:
          return '0';
      }
    }

    // « le joystick est poussé vers … » : au-delà de la moitié de la course (comme dans Labo Blocs).
    function directionC(direction) {
      const p = (axe) => expression({ bloc: 'joystick_position', axe });
      const s = K().SEUIL_JOYSTICK;
      return {
        haut: `(${p('y')} > ${s})`,
        bas: `(${p('y')} < -${s})`,
        gauche: `(${p('x')} < -${s})`,
        droite: `(${p('x')} > ${s})`,
      }[direction] || `(abs(${p('x')}) <= ${s} && abs(${p('y')}) <= ${s})`;
    }
    const evenementsJoystick = J ? v1.fils.filter((f) => f.quand === 'joystick') : [];

    let profondeur = 0; // compteurs des boucles « répéter n fois » : i, j, k…
    // Commentaire d'un bloc (écrit par l'élève ou le professeur) : une ligne « // … » par ligne du commentaire.
    function commentaire(n, r) {
      if (!n || typeof n.commentaire !== 'string' || !n.commentaire.trim()) return;
      for (const l of n.commentaire.trim().split(/\r?\n/)) ajouter(`${r}// ${l}`);
    }
    function instructions(liste, retrait) {
      const r = ' '.repeat(retrait);
      for (const i of liste || []) {
        const debut = lignes.length + 1;
        const avantCommentaire = lignes.length;
        commentaire(i, r);
        switch (i.bloc) {
          case 'led_etat':
            ajouter(`${r}digitalWrite(${numero(i.broche)}, ${i.etat ? 'HIGH' : 'LOW'});`);
            break;
          case 'attendre':
            ajouter(`${r}attendre(${expression(i.duree)});`);
            break;
          case 'servo_angle':
            ajouter(`${r}servo${numero(i.broche)}.write(constrain((int)(${expression(i.angle)}), 0, 180));`);
            break;
          case 'son':
            ajouter(`${r}tone(${numero(i.broche)}, ${expression(i.frequence)}, (unsigned long)(${expression(i.duree)} * 1000));`);
            break;
          case 'affecter':
            ajouter(`${r}${nomC(i.variable)} = ${expression(i.valeur)};`);
            break;
          case 'ajouter_a':
            ajouter(`${r}${nomC(i.variable)} = ${nomC(i.variable)} + ${expression(i.valeur)};`);
            break;
          case 'si_alors':
          case 'si_sinon':
            ajouter(`${r}if (${expression(i.condition)}) {`);
            instructions(i.alors, retrait + 2);
            if (i.bloc === 'si_sinon') {
              ajouter(`${r}} else {`);
              instructions(i.sinon, retrait + 2);
            }
            ajouter(`${r}}`);
            break;
          case 'repeter_n': {
            const c = 'ijklmn'[Math.min(profondeur, 5)];
            profondeur++;
            ajouter(`${r}for (int ${c} = 0; ${c} < ${expression(i.fois)}; ${c}++) {`);
            instructions(i.corps, retrait + 2);
            ajouter(`${r}}`);
            profondeur--;
            break;
          }
          case 'tant_que':
          case 'repeter_jusqua':
            ajouter(`${r}while (${i.bloc === 'tant_que' ? expression(i.condition) : `!${expression(i.condition)}`}) {`);
            instructions(i.corps, retrait + 2);
            ajouter(`${r}}`);
            break;
          default:
            lignes.length = avantCommentaire; // bloc qui n'a pas d'équivalent ici : son commentaire non plus
            continue;
        }
        if (i.id !== undefined) carte[i.id] = [debut, lignes.length];
      }
    }

    const fil = (q) => v1.fils.find((f) => f.quand === q) || { corps: [] };
    const evenements = v1.fils.filter((f) => f.quand === 'appui' || f.quand === 'relache');
    const trier = (e) => [...e].sort((a, b) => String(a).localeCompare(String(b), 'fr', { numeric: true }));

    ajouter(`// ${o.titre || 'Programme'} — écrit par Labo Blocs à partir des blocs.`);
    ajouter(versMasse ? '// LED : HAUT = allumée. Bouton poussoir (signal + GND) : HAUT = appuyé. Servo : 0° à 180°.' : '// LED : HAUT = allumée. Module bouton : HAUT = appuyé. Servo : 0° à 180°.');
    // Caméra et IA : dans l'ordinateur, pas dans la carte (ses blocs valent 0 ici, ses événements ne sont pas écrits).
    if (JSON.stringify(v1.fils).includes('camera')) {
      ajouter('// La caméra et son IA sont dans l’ordinateur : ce programme marche seulement en mode « En direct ».');
      ajouter('// Ici, les blocs de la caméra valent 0 et les « quand la caméra … » ne sont pas écrits.');
    }
    // Clavier de l'ordinateur : même chose que la caméra.
    if (P.utiliseClavier && P.utiliseClavier(v1)) {
      ajouter('// Le clavier est celui de l’ordinateur : ce programme marche seulement en mode « En direct ».');
      ajouter('// Ici, « la touche … est appuyée » vaut 0 et les « quand la touche … » ne sont pas écrits.');
    }
    if (servos.size) ajouter('#include <Servo.h>');
    ajouter('');
    for (const n of trier(servos)) ajouter(`Servo servo${n};`);
    for (const v of trier(variables)) ajouter(`float ${v} = 0;`);
    if (servos.size || variables.size) ajouter('');
    ajouter('// « attendre » en secondes (les nombres à virgule sont acceptés).');
    ajouter('void attendre(float secondes) {');
    ajouter('  if (secondes > 0) delay((unsigned long)(secondes * 1000.0));');
    ajouter('}');
    ajouter('');
    if (boutons.size) {
      ajouter(versMasse ? '// État du bouton : HAUT quand il est appuyé (il relie alors la broche à la masse).' : '// État du bouton : HAUT quand il est appuyé.');
      ajouter('int bouton(int broche) {');
      ajouter(versMasse ? '  return digitalRead(broche) == LOW ? HIGH : LOW;' : '  return digitalRead(broche);');
      ajouter('}');
      ajouter('');
    }
    if (modulo) {
      ajouter('// Reste de la division, du signe du diviseur (comme dans les blocs).');
      ajouter('float reste(float a, float b) {');
      ajouter('  if (b == 0) return 0;');
      ajouter('  float r = fmod(a, b);');
      ajouter('  return (r != 0 && ((r < 0) != (b < 0))) ? r + b : r;');
      ajouter('}');
      ajouter('');
    }
    if (reetalonner) {
      ajouter('// Ré-étalonner : passe v de l’échelle (a, b) à l’échelle (c, d), arrondi à l’entier (comme dans les blocs).');
      ajouter('float reetalonner(float v, float a, float b, float c, float d) {');
      ajouter('  if (b == a) return c;');
      ajouter('  return floor(c + (v - a) * (d - c) / (b - a) + 0.5);');
      ajouter('}');
      ajouter('');
    }
    evenements.forEach((f, k) => {
      ajouter(`// Quand le bouton ${numero(f.broche)} est ${f.quand === 'appui' ? 'appuyé' : 'relâché'}.`);
      ajouter(`// (Dans Labo Blocs, ce bloc tourne en même temps que « Répéter indéfiniment ».)`);
      ajouter(`int avant${k + 1} = LOW;`);
      ajouter(`void quand${k + 1}() {`);
      commentaire(f, '  ');
      instructions(f.corps, 2);
      ajouter('}');
      ajouter('');
    });
    if (J && joystickUtilise) {
      ajouter('// Position du joystick : de -100 à 100, 0 au centre.');
      ajouter('int positionJoystick(int broche) {');
      ajouter('  return round((analogRead(broche) - 512) * 100.0 / 512);');
      ajouter('}');
      ajouter('');
    }
    evenementsJoystick.forEach((f, k) => {
      ajouter(`// Quand le joystick est ${f.direction === 'centre' ? 'au centre' : 'poussé ' + K().DIRECTIONS_JOYSTICK.find((d) => d[1] === f.direction)[0]}.`);
      ajouter(`bool avantJoystick${k + 1} = false;`);
      ajouter(`void quandJoystick${k + 1}() {`);
      commentaire(f, '  ');
      instructions(f.corps, 2);
      ajouter('}');
      ajouter('');
    });
    ajouter('void setup() {');
    for (const n of trier(leds)) {
      ajouter(`  pinMode(${n}, OUTPUT);`);
      ajouter(`  digitalWrite(${n}, LOW);`);
    }
    for (const n of trier(boutons)) ajouter(`  pinMode(${n}, ${versMasse ? 'INPUT_PULLUP' : 'INPUT'});`);
    for (const n of trier(sons)) ajouter(`  pinMode(${n}, OUTPUT);`);
    // Bouton du joystick : il relie la broche à la masse quand on enfonce le manche.
    if (J && joystickUtilise) ajouter(`  pinMode(${numero(J.bouton)}, INPUT_PULLUP);`);
    if (hasard) ajouter('  randomSeed(analogRead(A5));');
    // Angle de départ : le premier angle fixe donné dans « Au démarrage », réglé AVANT d'activer le servo
    // (sinon le bras saute d'abord à 0°) ; 0° sinon, comme le simulateur.
    for (const n of trier(servos)) {
      const premier = fil('demarrage').corps.find((i) => i.bloc === 'servo_angle' && numero(i.broche) === n);
      const angle = premier && (typeof premier.angle === 'number' || (premier.angle && premier.angle.bloc === 'nombre')) ? expression(premier.angle) : '0';
      ajouter(`  servo${n}.write(${angle});`);
      ajouter(`  servo${n}.attach(${n});`);
    }
    commentaire(fil('demarrage'), '  ');
    instructions(fil('demarrage').corps, 2);
    ajouter('}');
    ajouter('');
    ajouter('void loop() {');
    evenements.forEach((f, k) => {
      const n = numero(f.broche);
      ajouter(`  if (bouton(${n}) != avant${k + 1}) {`);
      ajouter(`    avant${k + 1} = bouton(${n});`);
      ajouter(`    if (avant${k + 1} == ${f.quand === 'appui' ? 'HIGH' : 'LOW'}) quand${k + 1}();`);
      ajouter('  }');
    });
    evenementsJoystick.forEach((f, k) => {
      ajouter(`  if (${directionC(f.direction)} != avantJoystick${k + 1}) {`);
      ajouter(`    avantJoystick${k + 1} = !avantJoystick${k + 1};`);
      ajouter(`    if (avantJoystick${k + 1}) quandJoystick${k + 1}();`);
      ajouter('  }');
    });
    commentaire(fil('boucle'), '  ');
    instructions(fil('boucle').corps, 2);
    // Un tour de boucle dure au moins 1 ms, comme dans le simulateur.
    ajouter('  delay(1);');
    ajouter('}');
    return { code: lignes.join('\n') + '\n', lignes: carte };
  }

  const api = { versArduino };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/parcours.js =====
// Paquet de parcours (cahier des charges §4.10) : un parcours d'exercices versionné, partagé entre Labo Blocs et
// les projets. Le même objet sert de script (definirParcours({...}), lisible en file://) et de fichier d'échange
// (.json) pour l'import, l'export et la mise à jour.
//
//   { format: 'labo-blocs/parcours', version: 1, id, titre, versionParcours, date, moteurMinimum, carte, modes,
//     boutonsVersMasse, parametres, exercices: [ { id (stable, jamais réutilisé), numero, titre, defi, consigne,
//     composants, blocsAutorises, blocsDepart, scenarios, indices (2 écrits), aSavoir, solutionReference, libre
//     (exercice libre : composants déduits du programme de l'élève, pas de solution, « J'ai terminé »), variables
//     (noms donnés aux élèves ; absent : ['CHOIX']), variablesLibres (bouton « Créer une variable »), … } ],
//     fiches, lexique, classes (facultatif : classes proposées aux élèves), cheminSauvegarde (facultatif : dossier de
//     l'équipe, ex. ['{classe}', 'COMMUN', 'TECHNOLOGIE', 'ROBOT', '{equipe}']) }
//
// L'« empreinte » d'un exercice résume ce qui décide de sa réussite (consigne, composants, blocs, scénarios,
// solution, paramètres) : si elle change, un exercice déjà réussi passe « à revérifier ».

(function (global) {
  'use strict';

  const P = typeof module === 'object' && module.exports ? require('./programme.js') : global.LaboBlocs;

  const FORMAT = 'labo-blocs/parcours';
  const VERSION_MOTEUR = '0.4.0';

  // JSON aux clés triées : deux objets égaux donnent toujours le même texte.
  function canonique(x) {
    if (Array.isArray(x)) return '[' + x.map(canonique).join(',') + ']';
    if (x && typeof x === 'object') {
      return '{' + Object.keys(x).filter((k) => x[k] !== undefined).sort().map((k) => JSON.stringify(k) + ':' + canonique(x[k])).join(',') + '}';
    }
    return JSON.stringify(x === undefined ? null : x);
  }

  // Empreinte courte et stable (FNV-1a sur 2 × 32 bits), en hexadécimal.
  function hacher(texte) {
    let a = 0x811c9dc5;
    let b = 0x01000193 ^ 0x5bd1e995;
    for (let i = 0; i < texte.length; i++) {
      const c = texte.charCodeAt(i);
      a = Math.imul(a ^ c, 0x01000193) >>> 0;
      b = Math.imul(b ^ c, 0x5bd1e995) >>> 0;
    }
    return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
  }

  function empreinte(exercice) {
    const { consigne, composants, blocsAutorises, scenarios, solutionReference } = exercice;
    return hacher(canonique({ consigne, composants, blocsAutorises, scenarios, solutionReference }));
  }

  function comparerVersions(a, b) {
    const pa = String(a || '0').split('.').map(Number);
    const pb = String(b || '0').split('.').map(Number);
    for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) < (pb[i] || 0) ? -1 : 1;
    return 0;
  }

  // Problèmes d'un paquet (liste vide : il est utilisable). Phrases pour le professeur.
  const MODES = ['simulateur', 'direct', 'carte'];
  function controler(paquet, versionMoteur) {
    const pb = [];
    if (!paquet || paquet.format !== FORMAT) return ['Ce fichier n’est pas un parcours Labo Blocs.'];
    if (paquet.version > 1) pb.push('Ce parcours a été fait avec une version plus récente de Labo Blocs.');
    if (comparerVersions(versionMoteur || VERSION_MOTEUR, paquet.moteurMinimum) < 0) {
      pb.push(`Ce parcours demande Labo Blocs ${paquet.moteurMinimum} ou plus récent (version installée : ${versionMoteur || VERSION_MOTEUR}).`);
    }
    if (!paquet.id) pb.push('Le parcours n’a pas d’identifiant.');
    const vus = new Set();
    for (const [i, e] of (paquet.exercices || []).entries()) {
      const nom = `Exercice ${e.numero || i + 1}`;
      if (!e.id) pb.push(`${nom} : pas d’identifiant.`);
      else if (vus.has(e.id)) pb.push(`${nom} : l’identifiant « ${e.id} » est déjà utilisé.`);
      vus.add(e.id);
      if (!e.titre) pb.push(`${nom} : pas de titre.`);
      // Exercice libre : ni solution ni scénario (l'élève fait ce qu'il veut avec les blocs proposés).
      if (!e.libre && !e.solutionReference) pb.push(`${nom} : pas de solution de référence.`);
      if (!e.libre && !(e.scenarios || []).length) pb.push(`${nom} : pas de scénario de test.`);
    }
    if (!(paquet.exercices || []).length) pb.push('Le parcours n’a aucun exercice.');
    // Modes proposés (parcours, ou exercice qui en choisit d'autres) : le simulateur reste toujours (« Vérifier »).
    const modesValides = (m) => Array.isArray(m) && m.includes('simulateur') && m.every((x) => MODES.includes(x));
    if (paquet.modes && !modesValides(paquet.modes)) pb.push('Modes du parcours inconnus (simulateur, direct, carte ; le simulateur est obligatoire).');
    for (const [i, e] of (paquet.exercices || []).entries()) {
      if (e.modes && !modesValides(e.modes)) pb.push(`Exercice ${e.numero || i + 1} : modes inconnus (simulateur, direct, carte ; le simulateur est obligatoire).`);
      if (e.variables !== undefined && !(Array.isArray(e.variables) && e.variables.every((v) => typeof v === 'string' && /^[A-Za-z][A-Za-z0-9_]{0,15}$/.test(v)))) {
        pb.push(`Exercice ${e.numero || i + 1} : noms de variables invalides (lettres sans accent, chiffres, « _ »).`);
      }
    }
    // Classes et dossier de l'équipe (réglages facultatifs du parcours, pour le site de Labo Blocs).
    if (paquet.classes !== undefined && !(Array.isArray(paquet.classes) && paquet.classes.length && paquet.classes.every((c) => typeof c === 'string' && c.trim()))) {
      pb.push('Classes du parcours : une liste de noms de classes (ex. 4A, 4B).');
    }
    if (paquet.cheminSauvegarde !== undefined && !(Array.isArray(paquet.cheminSauvegarde) && paquet.cheminSauvegarde.includes('{equipe}'))) {
      pb.push('Dossier de l’équipe du parcours : il doit contenir {equipe}.');
    }
    return pb;
  }

  // Paquet prêt à l'emploi : paramètres remplacés, rang et empreinte de chaque exercice.
  function preparer(paquet) {
    const parametres = paquet.parametres || {};
    const exercices = (paquet.exercices || []).map((e, rang) => {
      const x = P.appliquerParametres(e, parametres);
      x.rang = rang;
      x.numero = x.numero || String(rang + 1);
      x.empreinte = empreinte(x);
      if (x.boutonsVersMasse === undefined) x.boutonsVersMasse = paquet.boutonsVersMasse !== false;
      // Carte du parcours (après l'empreinte : les exercices existants gardent la leur).
      if (!x.carte) x.carte = paquet.carte || 'uno';
      return x;
    });
    return Object.assign({}, paquet, { exercices, parametres });
  }

  // Différences entre deux versions d'un parcours (écran « Mettre à jour les exercices »).
  function comparer(ancien, nouveau) {
    const a = preparer(ancien).exercices;
    const n = preparer(nouveau).exercices;
    const parId = (liste) => new Map(liste.map((e) => [e.id, e]));
    const ia = parId(a);
    const inn = parId(n);
    const ajoutes = n.filter((e) => !ia.has(e.id)).map((e) => e.id);
    const supprimes = a.filter((e) => !inn.has(e.id)).map((e) => e.id);
    const modifies = n.filter((e) => ia.has(e.id) && ia.get(e.id).empreinte !== e.empreinte).map((e) => e.id);
    // Déplacé : l'ordre relatif des exercices communs a changé.
    const communsA = a.filter((e) => inn.has(e.id)).map((e) => e.id);
    const communsN = n.filter((e) => ia.has(e.id)).map((e) => e.id);
    const deplaces = communsN.filter((id, i) => communsA[i] !== id);
    const sansRang = (e) => canonique(Object.assign({}, e, { rang: undefined }));
    const textes = n.filter((e) => ia.has(e.id) && ia.get(e.id).empreinte === e.empreinte && sansRang(ia.get(e.id)) !== sansRang(e)).map((e) => e.id);
    return { ajoutes, supprimes, modifies, deplaces, textes };
  }

  // Indice 3 : la silhouette du programme (forme de la solution, sans les broches ni les valeurs).
  function silhouette(exercice) {
    return exercice.silhouette || P.versV1(exercice.solutionReference);
  }

  // Texte du fichier parcours d'un projet (site/parcours/<id>.js) : un script, pour rester lisible en file://.
  function scriptParcours(paquet) {
    return (
      `// Parcours « ${paquet.titre} », version ${paquet.versionParcours} (Labo Blocs).\n` +
      '// Ce fichier est écrit par « Mettre à jour les exercices » (outil du professeur) : ne pas le modifier à la main.\n' +
      `definirParcours(${JSON.stringify(paquet, null, 2)});\n`
    );
  }

  const parcoursDefinis = [];
  const api = { FORMAT_PARCOURS: FORMAT, VERSION_MOTEUR, scriptParcours, controler, preparer, comparer, empreinte, comparerVersions, silhouette, canonique, parcoursDefinis };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
    global.definirParcours = (p) => parcoursDefinis.push(p);
  }
})(this);

// ===== noyau/sauvegarde.js =====
// Sauvegarde d'une équipe et progression dans un parcours (cahier des charges §4.8, exigence R6).
// Un seul fichier .json par équipe, celui du projet : Labo Blocs y écrit seulement sa rubrique « programmation »,
// versionnée, et ne touche pas au reste (carnet de projet, etc.).
//
//   { application, formatVersion, equipe: { eleves, classe }, creeLe, modifieLe, …(rubriques du projet),
//     programmation: { format: 'labo-blocs/sauvegarde', version: 1, parcours: { id, version },
//       exerciceCourant, exercices: { <id stable>: { statut, tentatives, indicesOuverts, tempsPasseSecondes,
//         premiereReussite, empreinte, aReverifier, programme (sauvegarde Blockly), historique } },
//       camera: { modele, exemples: { <nom de l'étiquette>: [{ f: caractéristiques (base64), v: vignette }] },
//                 etiquettes?: [noms créés par l'équipe, dans l'ordre : n° 1, 2…] } } }
//   (« camera » : ce que l'équipe a appris à l'IA de la caméra, jalon 6 ; partagé par les exercices du parcours.)
//
// Les sauvegardes de l'atelier du distributeur (exercices « 1 » … « 13B ») se lisent : leur travail est recopié
// dans la rubrique « programmation » sous les identifiants du parcours (« dist-01 » …), rien n'est effacé.

(function (global) {
  'use strict';

  const FORMAT = 'labo-blocs/sauvegarde';
  const VERSION = 1;
  const APPLICATION = 'labo-blocs';
  const FORMAT_FICHIER = 1;
  // Applications dont Labo Blocs sait lire le fichier (chaque projet garde le sien).
  const APPLICATIONS = { 'labo-blocs': 1, 'atelier-cereales': 2 };

  // Date et heure locales : 2026-10-12T09:03:00
  function maintenant() {
    const d = new Date();
    const deux = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}T${deux(d.getHours())}:${deux(d.getMinutes())}:${deux(d.getSeconds())}`;
  }

  const prenom = (p) => {
    const t = String(p).trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // « Léa », « hugo » → « Léa_Hugo » (nom du dossier et du fichier de l'équipe).
  function nomEquipe(eleves) {
    return eleves
      .map((p) => String(p).trim().replace(/[\\/:*?"<>|.]+/g, '').replace(/\s+/g, '-'))
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('_');
  }

  // Pour comparer des noms de dossier sans tenir compte des accents, majuscules et séparateurs.
  function simplifier(nom) {
    return String(nom).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function creerSauvegarde(equipe, options) {
    const o = options || {};
    const date = maintenant();
    return {
      application: o.application || APPLICATION,
      formatVersion: FORMAT_FICHIER,
      projet: o.projet || null,
      equipe: { eleves: equipe.eleves.map(prenom).filter(Boolean), classe: equipe.classe || '' },
      creeLe: date,
      modifieLe: date,
      programmation: rubriqueVide(o.parcours),
    };
  }

  function rubriqueVide(paquet) {
    return { format: FORMAT, version: VERSION, parcours: paquet ? { id: paquet.id, version: paquet.versionParcours } : null, exerciceCourant: null, exercices: {} };
  }

  // Vérifie un fichier ouvert par l'équipe. Rien n'est modifié si le fichier est refusé.
  function lireSauvegarde(texte) {
    let d;
    try {
      d = JSON.parse(String(texte).replace(/^﻿/, ''));
    } catch {
      return { ok: false, raison: 'Ce fichier n’est pas une sauvegarde : il est illisible.' };
    }
    // Fichier d'un autre projet (son application, ses rubriques) : lisible s'il porte une rubrique « programmation » de
    // Labo Blocs ; son propre format reste l'affaire du projet.
    const autreProjet = d && !(d.application in APPLICATIONS) && typeof d.application === 'string' && d.programmation && d.programmation.format === FORMAT;
    if (!d || (!(d.application in APPLICATIONS) && !autreProjet)) return { ok: false, raison: 'Ce fichier vient d’une autre application : ce n’est pas une sauvegarde d’équipe.' };
    if (!autreProjet && (typeof d.formatVersion !== 'number' || d.formatVersion > APPLICATIONS[d.application])) {
      return { ok: false, raison: 'Cette sauvegarde vient d’une version plus récente : demande à ton professeur.' };
    }
    if (d.programmation && d.programmation.version > VERSION) return { ok: false, raison: 'Cette sauvegarde vient d’une version plus récente de Labo Blocs : demande à ton professeur.' };
    if (!d.equipe || !Array.isArray(d.equipe.eleves)) return { ok: false, raison: 'Cette sauvegarde est incomplète : il manque l’équipe.' };
    return { ok: true, donnees: d };
  }

  // Relie la sauvegarde au parcours : crée ou reprend la rubrique « programmation » (en recopiant le travail d'une
  // sauvegarde de l'atelier), note la version du parcours, et marque « à revérifier » les exercices réussis qui ont
  // changé depuis. Renvoie la liste des exercices passés « à revérifier ».
  function relierParcours(d, paquet) {
    if (!d.programmation) {
      d.programmation = rubriqueVide(paquet);
      if (d.application === 'atelier-cereales' && d.exercices) migrerAtelier(d, paquet);
    }
    const p = d.programmation;
    p.exercices = p.exercices || {};
    const parId = new Map(paquet.exercices.map((e) => [e.id, e]));
    const changes = [];
    for (const [id, e] of Object.entries(p.exercices)) {
      e.historique = e.historique || [];
      const ex = parId.get(id);
      if (!ex) {
        e.supprime = true; // gardé en lecture seule
        continue;
      }
      delete e.supprime;
      if (e.statut === 'reussi' && e.empreinte && e.empreinte !== ex.empreinte && !e.aReverifier) {
        e.aReverifier = true;
        e.historique.push({ date: maintenant(), type: 'modifie', versionParcours: paquet.versionParcours });
        changes.push(id);
      }
    }
    p.parcours = { id: paquet.id, version: paquet.versionParcours };
    return changes;
  }

  // Sauvegarde de l'atelier : exercices « 1 » … « 13B » → identifiants du parcours (par leur numéro).
  function migrerAtelier(d, paquet) {
    const parNumero = new Map(paquet.exercices.map((e) => [String(e.numero), e]));
    for (const [num, ancien] of Object.entries(d.exercices)) {
      const ex = parNumero.get(String(num));
      if (!ex) continue;
      const e = JSON.parse(JSON.stringify(ancien));
      // Réussi dans l'atelier : avec l'exercice tel qu'il était, repris à l'identique dans ce parcours.
      if (e.statut === 'reussi') e.empreinte = ex.empreinte;
      e.historique = e.historique || [];
      e.historique.push({ date: maintenant(), type: 'migration', depuis: 'atelier-cereales', exercice: num });
      d.programmation.exercices[ex.id] = e;
    }
    const courant = parNumero.get(String(d.exerciceCourant));
    if (courant) d.programmation.exerciceCourant = courant.id;
  }

  function exercice(d, id) {
    const ex = d.programmation.exercices;
    if (!ex[id]) {
      ex[id] = { statut: 'non_commence', tentatives: 0, indicesOuverts: 0, tempsPasseSecondes: 0, premiereReussite: null, programme: null, historique: [] };
    }
    return ex[id];
  }

  const modifie = (d) => (d.modifieLe = maintenant());

  function noterOuverture(d, id) {
    const e = exercice(d, id);
    if (e.statut === 'non_commence') e.statut = 'en_cours';
    d.programmation.exerciceCourant = id;
    modifie(d);
  }

  function noterProgramme(d, id, programme) {
    exercice(d, id).programme = programme;
    modifie(d);
  }

  const sansIds = (programme) => (programme ? JSON.parse(JSON.stringify(programme, (k, v) => (k === 'id' ? undefined : v))) : null);

  // Chaque clic sur « Vérifier mon programme » est une tentative, gardée dans l'historique.
  //   resultat : { reussi, message, programme (v1) } ; exercice : celui du parcours préparé (pour l'empreinte).
  function noterVerification(d, ex, resultat) {
    const e = exercice(d, ex.id);
    const date = maintenant();
    e.tentatives += 1;
    const trace = { date, type: 'verification', reussi: !!resultat.reussi };
    if (!resultat.reussi) trace.message = resultat.message || '';
    trace.programme = sansIds(resultat.programme);
    e.historique.push(trace);
    if (resultat.reussi) {
      e.statut = 'reussi';
      e.empreinte = ex.empreinte;
      delete e.aReverifier;
      if (!e.premiereReussite) e.premiereReussite = date;
    } else if (e.statut === 'non_commence') e.statut = 'en_cours';
    modifie(d);
  }

  // Exercice libre : l'équipe dit qu'elle a terminé. L'exercice compte comme fait (le suivant s'ouvre), sans niveau.
  function noterTermine(d, ex, programme) {
    const e = exercice(d, ex.id);
    const date = maintenant();
    e.historique.push({ date, type: 'termine', programme: sansIds(programme) });
    e.statut = 'reussi';
    e.empreinte = ex.empreinte;
    delete e.aReverifier;
    if (!e.premiereReussite) e.premiereReussite = date;
    modifie(d);
  }

  // Indices révélés un par un : on garde le plus haut niveau ouvert et chaque ouverture.
  function noterIndice(d, id, niveau) {
    const e = exercice(d, id);
    if (niveau <= e.indicesOuverts) return;
    e.indicesOuverts = niveau;
    e.historique.push({ date: maintenant(), type: 'indice', niveau });
    modifie(d);
  }

  // Mode « Dans la carte » : chaque envoi du programme et chaque « Vider la carte », gardés dans l'historique de
  // l'exercice ouvert (bilan du professeur). envoi : { carte, reussi, octets, message, programme (v1) }
  function noterEnvoi(d, id, envoi) {
    const trace = { date: maintenant(), type: 'envoi', carte: envoi.carte, reussi: !!envoi.reussi };
    if (envoi.octets !== undefined) trace.octets = envoi.octets;
    if (!envoi.reussi && envoi.message) trace.message = envoi.message;
    if (envoi.programme) trace.programme = sansIds(envoi.programme);
    exercice(d, id).historique.push(trace);
    modifie(d);
  }
  function noterVidage(d, id, vidage) {
    exercice(d, id).historique.push({ date: maintenant(), type: 'vider', carte: vidage.carte, reussi: !!vidage.reussi });
    modifie(d);
  }

  function ajouterTemps(d, id, secondes) {
    exercice(d, id).tempsPasseSecondes += secondes;
  }

  const reussi = (d, id) => {
    const e = d.programmation && d.programmation.exercices[id];
    return !!(e && e.statut === 'reussi');
  };

  // Déblocage : un exercice s'ouvre quand le précédent est réussi. Un défi est facultatif : l'exercice qui le suit
  // ne dépend que du dernier exercice qui n'est pas un défi.
  function estDebloque(d, paquet, id, options) {
    if (options && options.toutDebloquer) return true;
    const liste = paquet.exercices;
    const i = liste.findIndex((e) => e.id === id);
    if (i <= 0) return i === 0;
    if (liste[i].defi) return reussi(d, liste[i - 1].id);
    for (let k = i - 1; k >= 0; k--) if (!liste[k].defi) return reussi(d, liste[k].id);
    return true;
  }

  // État d'un exercice pour l'écran du parcours.
  function etat(d, paquet, id, options) {
    const e = d.programmation && d.programmation.exercices[id];
    if (e && e.statut === 'reussi') return e.aReverifier ? 'a_reverifier' : 'reussi';
    if (!estDebloque(d, paquet, id, options)) return 'verrouille';
    return e && e.statut === 'en_cours' ? 'en_cours' : 'a_faire';
  }

  // Exercice à ouvrir en reprenant : celui de la dernière fois s'il est ouvert et pas encore réussi, sinon le
  // premier exercice ouvert (hors défi) non réussi, sinon le dernier.
  function aReprendre(d, paquet, options) {
    const courant = d.programmation && d.programmation.exerciceCourant;
    const ids = paquet.exercices.map((e) => e.id);
    if (courant && ids.includes(courant) && estDebloque(d, paquet, courant, options) && !reussi(d, courant)) return courant;
    const ouvert = paquet.exercices.find((e) => !e.defi && estDebloque(d, paquet, e.id, options) && !reussi(d, e.id));
    return ouvert ? ouvert.id : ids[ids.length - 1];
  }

  // Avancement : exercices obligatoires réussis (les défis sont comptés à part).
  function avancement(d, paquet) {
    const obligatoires = paquet.exercices.filter((e) => !e.defi);
    const defis = paquet.exercices.filter((e) => e.defi);
    const n = (l) => l.filter((e) => reussi(d, e.id)).length;
    const aReverifier = paquet.exercices.filter((e) => etat(d, paquet, e.id) === 'a_reverifier').length;
    return { reussis: n(obligatoires), total: obligatoires.length, defisReussis: n(defis), defis: defis.length, aReverifier };
  }

  // Ce que l'équipe a appris à l'IA de la caméra (par nom d'étiquette : « Loup » sert à tous les exercices).
  function lireCamera(d) {
    const c = d.programmation && d.programmation.camera;
    return c && c.exemples ? c : { modele: null, exemples: {} };
  }
  function noterCamera(d, camera) {
    d.programmation.camera = { modele: camera.modele || null, exemples: camera.exemples || {} };
    if (Array.isArray(camera.etiquettes)) d.programmation.camera.etiquettes = camera.etiquettes.slice();
    d.modifieLe = maintenant();
  }

  const api = {
    lireCamera,
    noterCamera,
    noterTermine,
    FORMAT_SAUVEGARDE: FORMAT,
    APPLICATION,
    nomEquipe,
    simplifierNom: simplifier,
    maintenant,
    creerSauvegarde,
    lireSauvegarde,
    relierParcours,
    progressionExercice: exercice,
    noterOuverture,
    noterProgramme,
    noterVerification,
    noterIndice,
    noterEnvoi,
    noterVidage,
    ajouterTemps,
    estDebloque,
    etat,
    exerciceAReprendre: aReprendre,
    avancement,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/competences.js =====
// Compétences et niveaux (jalon 5) : chaque exercice d'un parcours est rattaché à une compétence du programme de
// technologie du cycle 4 (BO n° 9 du 29 février 2024 ; libellés repris mot pour mot du Carnet de classe). Le travail
// d'une équipe donne un niveau par compétence (1 Non atteint · 2 Partiellement atteint · 3 Atteint · 4 Dépassé) et une
// note /20 = moyenne des niveaux × 5 (comme le Carnet de classe).
//
// Score d'un exercice (de 0 à 1), d'après l'historique de la sauvegarde :
//   réussi : 1, moins une retenue par indice ouvert et par vérification ratée AVANT la réussite (plafonnées) ;
//   commencé (au moins une vérification) sans réussite : « participation » ; pas commencé : 0.
// Niveau d'une compétence : moyenne des scores de ses exercices attendus (hors défis) —
//   sous « partiel » : Non atteint ; sous « atteint » : Partiellement atteint ; sinon Atteint ;
//   Dépassé : Atteint, et un défi de la compétence réussi.
// Le professeur peut forcer un niveau (fiche de l'équipe) : le niveau forcé remplace le niveau calculé.
(function (global) {
  'use strict';

  const COMPETENCES = [
    { code: 'C5', n: 5, libelle: 'Identifier un dysfonctionnement d’un objet technique et y remédier' },
    { code: 'C6', n: 6, libelle: 'Comprendre et modifier un programme associé à une fonctionnalité d’un objet ou d’un système technique' },
    { code: 'C8', n: 8, libelle: 'Valider les solutions techniques par des simulations ou par des protocoles de tests' },
    { code: 'C9', n: 9, libelle: 'Concevoir, écrire, tester et mettre au point un programme' },
  ];
  const COMPETENCE_PAR_DEFAUT = 'C9';
  const SOURCE = 'Programme de technologie du cycle 4 · BO n° 9 du 29 février 2024';

  const NIVEAUX = [
    { v: 1, pronote: 'Non atteint' },
    { v: 2, pronote: 'Partiellement atteint' },
    { v: 3, pronote: 'Atteint' },
    { v: 4, pronote: 'Dépassé' },
  ];
  const nomNiveau = (v) => (NIVEAUX[v - 1] || {}).pronote || '';

  const BAREME = {
    participation: 0.2,
    penaliteIndice: 0.1,
    penaliteIndiceMax: 0.3,
    penaliteEchec: 0.05,
    penaliteEchecMax: 0.25,
    partiel: 0.25,
    atteint: 0.6,
    // Exercices attendus à ce moment : les N premiers du parcours (null : tous).
    objectif: null,
  };
  const completerBareme = (b) => Object.assign({}, BAREME, b || {});

  const competenceDe = (ex) => ex.competence || COMPETENCE_PAR_DEFAUT;

  // Indices et vérifications ratées avant la première réussite.
  function avantReussite(e) {
    let indices = 0;
    let echecs = 0;
    for (const h of (e && e.historique) || []) {
      if (h.type === 'verification' && h.reussi) break;
      if (h.type === 'indice') indices = Math.max(indices, h.niveau || indices + 1);
      if (h.type === 'verification') echecs++;
    }
    return { indices, echecs };
  }

  function scoreExercice(e, bareme) {
    const b = completerBareme(bareme);
    if (!e) return { score: 0, etat: 'non_commence' };
    if (e.statut === 'reussi') {
      const { indices, echecs } = avantReussite(e);
      const retenue = Math.min(indices * b.penaliteIndice, b.penaliteIndiceMax) + Math.min(echecs * b.penaliteEchec, b.penaliteEchecMax);
      return { score: Math.round(Math.max(0, 1 - retenue) * 10000) / 10000, etat: 'reussi', indices, echecs };
    }
    const verifs = ((e.historique || []).filter((h) => h.type === 'verification')).length;
    if (verifs) return { score: b.participation, etat: 'commence', echecs: verifs };
    return { score: 0, etat: 'non_commence' };
  }

  // donnees : sauvegarde de l'équipe (rubrique programmation) ; paquet : parcours préparé.
  // options : { bareme, forces: { C9: 4 } }
  function evaluerEquipe(donnees, paquet, options) {
    const o = options || {};
    const b = completerBareme(o.bareme || paquet.bareme);
    const forces = o.forces || {};
    const ex = (donnees && donnees.programmation && donnees.programmation.exercices) || {};
    const liste = paquet.exercices || [];
    const attendus = b.objectif ? liste.slice(0, b.objectif) : liste;
    // Exercices libres : pas de niveau (le professeur juge lui-même), ils ne comptent dans aucune compétence.
    const evalues = liste.filter((e) => !e.libre);
    const codes = COMPETENCES.map((c) => c.code).filter((code) => evalues.some((e) => competenceDe(e) === code));
    const competences = codes.map((code) => {
      const c = COMPETENCES.find((x) => x.code === code);
      const siens = attendus.filter((e) => competenceDe(e) === code && !e.defi && !e.libre);
      const scores = siens.map((e) => scoreExercice(ex[e.id], b).score);
      let calcule = null;
      let moyenne = null;
      if (scores.length) {
        moyenne = Math.round((scores.reduce((s, x) => s + x, 0) / scores.length) * 10000) / 10000;
        calcule = moyenne < b.partiel ? 1 : moyenne < b.atteint ? 2 : 3;
        const defis = evalues.filter((e) => competenceDe(e) === code && e.defi);
        if (calcule === 3 && defis.some((e) => ex[e.id] && ex[e.id].statut === 'reussi')) calcule = 4;
      }
      const force = forces[code] >= 1 && forces[code] <= 4 ? Number(forces[code]) : null;
      return { code, libelle: c.libelle, n: c.n, niveau: force || calcule, calcule, force, moyenne, exercices: siens.map((e) => e.id) };
    });
    const notes = competences.filter((c) => c.niveau);
    const note = notes.length ? Math.round((notes.reduce((s, c) => s + c.niveau, 0) / notes.length) * 5 * 100) / 100 : null;
    const reussis = liste.filter((e) => ex[e.id] && ex[e.id].statut === 'reussi').length;
    return { competences, note, reussis, total: liste.length, attendus: attendus.length };
  }

  // ---------- Fichier « résultats Labo Blocs » (importé par le Carnet de classe) ----------
  //   { format: 'labo-blocs/resultats', version: 1, date, projet: { id, titre }, parcours: { id, version },
  //     source, competences: [{ code, n, libelle }], niveaux: [{ v, pronote }],
  //     equipes: [{ eleves: ['Léa', 'Hugo'], classe, niveaux: { C9: 3 }, note, commentaire, reussis, total }] }
  const FORMAT_RESULTATS = 'labo-blocs/resultats';

  function creerResultats(options) {
    const o = options || {};
    const codes = new Set();
    const equipes = (o.equipes || []).map((x) => {
      const niveaux = {};
      for (const c of x.evaluation.competences) {
        codes.add(c.code);
        if (c.niveau) niveaux[c.code] = c.niveau;
      }
      return {
        eleves: (x.eleves || []).slice(),
        classe: x.classe || '',
        niveaux,
        note: x.evaluation.note,
        commentaire: x.commentaire || '',
        reussis: x.evaluation.reussis,
        total: x.evaluation.total,
      };
    });
    return {
      format: FORMAT_RESULTATS,
      version: 1,
      date: o.date || new Date().toISOString().slice(0, 10),
      projet: o.projet || null,
      parcours: o.paquet ? { id: o.paquet.id, titre: o.paquet.titre, version: o.paquet.versionParcours } : null,
      source: SOURCE,
      competences: COMPETENCES.filter((c) => codes.has(c.code)).map((c) => ({ code: c.code, n: c.n, libelle: c.libelle })),
      niveaux: NIVEAUX.map((n) => Object.assign({}, n)),
      equipes,
    };
  }

  // CSV pour Excel en français (point-virgule, UTF-8 avec BOM) : une ligne par équipe.
  function csvResultats(r) {
    const cel = (v) => {
      const t = v === null || v === undefined ? '' : String(v);
      return /[;"\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
    };
    const nombre = (x) => (x === null || x === undefined ? '' : String(Math.round(x * 100) / 100).replace('.', ','));
    const entete = ['Classe', 'Élèves', ...r.competences.map((c) => `${c.code} ${c.libelle}`), 'Note /20', 'Exercices réussis', 'Commentaire'];
    const lignes = r.equipes.map((e) => [
      e.classe,
      e.eleves.join(', '),
      ...r.competences.map((c) => (e.niveaux[c.code] ? `${e.niveaux[c.code]} - ${nomNiveau(e.niveaux[c.code])}` : '')),
      nombre(e.note),
      `${e.reussis}/${e.total}`,
      e.commentaire,
    ]);
    return '﻿' + [entete, ...lignes].map((l) => l.map(cel).join(';')).join('\r\n') + '\r\n';
  }

  function lireResultats(texte) {
    let r;
    try {
      r = typeof texte === 'string' ? JSON.parse(texte) : texte;
    } catch {
      return { ok: false, message: 'Ce fichier n’est pas un fichier de résultats Labo Blocs.' };
    }
    if (!r || r.format !== FORMAT_RESULTATS || !Array.isArray(r.equipes)) return { ok: false, message: 'Ce fichier n’est pas un fichier de résultats Labo Blocs.' };
    if (r.version > 1) return { ok: false, message: 'Ce fichier vient d’une version plus récente de Labo Blocs.' };
    return { ok: true, resultats: r };
  }

  const api = {
    COMPETENCES,
    COMPETENCE_PAR_DEFAUT,
    NIVEAUX_COMPETENCE: NIVEAUX,
    nomNiveau,
    BAREME_COMPETENCES: BAREME,
    competenceDe,
    scoreExercice,
    evaluerEquipe,
    FORMAT_RESULTATS,
    creerResultats,
    csvResultats,
    lireResultats,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/classe.js =====
// Suivi d'une classe (jalon 5, outil du professeur) : les fichiers des équipes lus d'un coup, une ligne par équipe
// (progression par exercice, indices, dernier envoi dans la carte, dernière activité, état), les niveaux par compétence
// et la note, et les réglages du professeur (niveaux forcés, commentaires) gardés dans un fichier à part du dossier
// de la classe : labo-blocs-professeur.json (les fichiers des élèves ne sont jamais modifiés).
(function (global) {
  'use strict';

  const enNode = typeof module === 'object' && module.exports;
  const S = enNode ? require('./sauvegarde.js') : global.LaboBlocs;
  const K = enNode ? require('./competences.js') : global.LaboBlocs;

  const BLOQUEE_APRES = 10 * 60 * 1000; // une équipe qui ne réussit pas son exercice depuis 10 min…
  const BLOQUEE_ECHECS = 3; // … après au moins 3 vérifications ratées
  const INACTIVE_APRES = 45 * 60 * 1000;

  // « 2026-10-12T09:03:00 » (heure locale) → Date
  const date = (t) => (t ? new Date(t) : null);

  // fichiers : [{ nom (chemin), texte }] ; paquets : parcours préparés (celui de chaque équipe, par identifiant).
  // Renvoie { equipes: [...], refuses: [{ nom, raison }] }. Deux fichiers de la même équipe : le plus récent compte.
  function chargerEquipes(fichiers, paquets) {
    const parId = new Map((Array.isArray(paquets) ? paquets : [paquets]).map((p) => [p.id, p]));
    const defaut = Array.isArray(paquets) ? paquets[0] : paquets;
    const refuses = [];
    const parCle = new Map();
    for (const f of fichiers) {
      if (/labo-blocs-professeur\.json$/i.test(f.nom)) continue;
      const r = S.lireSauvegarde(f.texte);
      if (!r.ok) {
        refuses.push({ nom: f.nom, raison: r.raison });
        continue;
      }
      const d = r.donnees;
      const id = d.programmation && d.programmation.parcours && d.programmation.parcours.id;
      const paquet = (id && parId.get(id)) || defaut;
      S.relierParcours(d, paquet);
      const nomFichier = String(f.nom).split(/[\\/›]/).pop().trim();
      const cle = nomFichier.replace(/\.json$/i, '');
      const equipe = { cle, nom: f.nom, donnees: d, paquet, eleves: d.equipe.eleves.slice(), classe: d.equipe.classe || '', modifieLe: d.modifieLe || '' };
      const deja = parCle.get(cle);
      if (!deja || String(deja.modifieLe) < String(equipe.modifieLe)) parCle.set(cle, equipe);
    }
    const equipes = [...parCle.values()].sort((a, b) => a.classe.localeCompare(b.classe, 'fr') || a.eleves.join().localeCompare(b.eleves.join(), 'fr'));
    return { equipes, refuses };
  }

  // Résumé d'une équipe pour le tableau de classe.
  //   options : { maintenant (Date), forces, bareme }
  function resumerEquipe(equipe, options) {
    const o = options || {};
    const maintenant = o.maintenant || new Date();
    const d = equipe.donnees;
    const paquet = equipe.paquet;
    const ex = d.programmation.exercices;
    const cellules = paquet.exercices.map((e) => ({ id: e.id, numero: e.numero, defi: !!e.defi, etat: S.etat(d, paquet, e.id) }));
    let indices = 0;
    let dernierEnvoi = null;
    let derniere = null;
    for (const e of paquet.exercices) {
      const p = ex[e.id];
      if (!p) continue;
      indices += p.indicesOuverts || 0;
      for (const h of p.historique || []) {
        if (!derniere || h.date > derniere) derniere = h.date;
        if (h.type === 'envoi' && h.reussi && (!dernierEnvoi || h.date > dernierEnvoi.date)) dernierEnvoi = { date: h.date, numero: e.numero };
      }
    }
    if (d.modifieLe && (!derniere || d.modifieLe > derniere)) derniere = d.modifieLe;
    const av = S.avancement(d, paquet);
    const courant = paquet.exercices.find((e) => e.id === S.exerciceAReprendre(d, paquet));
    // Bloquée : l'exercice en cours n'est pas réussi, au moins 3 vérifications ratées, la première il y a plus de 10 min.
    let bloquee = null;
    const pc = courant && ex[courant.id];
    if (pc && pc.statut !== 'reussi') {
      const verifs = (pc.historique || []).filter((h) => h.type === 'verification');
      if (verifs.length >= BLOQUEE_ECHECS && maintenant - date(verifs[0].date) > BLOQUEE_APRES) bloquee = courant.numero;
    }
    const inactive = derniere ? maintenant - date(derniere) > INACTIVE_APRES : true;
    let etat;
    if (av.reussis === av.total) etat = { cle: 'fini', texte: 'Parcours terminé' };
    else if (bloquee && !inactive) etat = { cle: 'bloquee', texte: `Bloquée sur le ${bloquee}` };
    else if (inactive) etat = { cle: 'inactive', texte: derniere ? 'Pas d’activité récente' : 'Pas encore commencé' };
    else etat = { cle: 'rythme', texte: 'Au travail' };
    const evaluation = K.evaluerEquipe(d, paquet, { forces: o.forces, bareme: o.bareme });
    return {
      cellules,
      reussis: av.reussis,
      total: av.total,
      defisReussis: av.defisReussis,
      aReverifier: av.aReverifier,
      indices,
      dernierEnvoi,
      derniereActivite: derniere,
      enCours: courant && pc && pc.statut !== 'reussi' ? courant.numero : null,
      bloquee,
      etat,
      evaluation,
    };
  }

  // Chiffres du haut de la page.
  function resumerClasse(resumes, maintenant) {
    const jour = (maintenant || new Date()).toISOString().slice(0, 10);
    const local = (t) => String(t || '').slice(0, 10);
    return {
      equipes: resumes.length,
      bloquees: resumes.filter((r) => r.etat.cle === 'bloquee').length,
      envoisAujourdhui: resumes.filter((r) => r.dernierEnvoi && local(r.dernierEnvoi.date) === jour).length,
      aReverifier: resumes.reduce((s, r) => s + r.aReverifier, 0),
    };
  }

  // « il y a 3 min », « hier », « le 12/10 »
  function ilYa(t, maintenant) {
    if (!t) return '—';
    const m = (maintenant || new Date()) - date(t);
    if (m < 60 * 1000) return 'à l’instant';
    if (m < 60 * 60 * 1000) return `il y a ${Math.round(m / 60000)} min`;
    const d = date(t);
    const auj = maintenant || new Date();
    if (d.toDateString() === auj.toDateString()) return `à ${d.getHours()} h ${String(d.getMinutes()).padStart(2, '0')}`;
    const hier = new Date(auj);
    hier.setDate(auj.getDate() - 1);
    if (d.toDateString() === hier.toDateString()) return 'hier';
    return `le ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // ---------- Fichier du professeur (dans le dossier de la classe) ----------
  //   { format: 'labo-blocs/professeur', version: 1, objectif: null | n, equipes: { <clé>: { forces, commentaire } } }
  const FORMAT_PROFESSEUR = 'labo-blocs/professeur';
  const NOM_FICHIER_PROFESSEUR = 'labo-blocs-professeur.json';
  function professeurVide() {
    return { format: FORMAT_PROFESSEUR, version: 1, objectif: null, equipes: {} };
  }
  function lireProfesseur(texte) {
    try {
      const p = JSON.parse(texte);
      if (p && p.format === FORMAT_PROFESSEUR && p.equipes) return Object.assign(professeurVide(), p);
    } catch {
      // fichier abîmé : on repart de zéro (l'ancien reste sur le disque jusqu'au prochain enregistrement)
    }
    return professeurVide();
  }
  const reglagesEquipe = (prof, cle) => prof.equipes[cle] || { forces: {}, commentaire: '' };

  // Résultats de la classe pour le Carnet de classe (et le CSV).
  function resultatsClasse(equipes, prof, options) {
    const o = options || {};
    const paquet = o.paquet || (equipes[0] && equipes[0].paquet);
    return K.creerResultats({
      projet: o.projet,
      paquet,
      date: o.date,
      equipes: equipes.map((e) => {
        const r = reglagesEquipe(prof, e.cle);
        return {
          eleves: e.eleves,
          classe: e.classe,
          commentaire: r.commentaire,
          evaluation: K.evaluerEquipe(e.donnees, e.paquet, { forces: r.forces, bareme: { objectif: prof.objectif } }),
        };
      }),
    });
  }

  const api = {
    chargerEquipes,
    resumerEquipe,
    resumerClasse,
    ilYa,
    FORMAT_PROFESSEUR,
    NOM_FICHIER_PROFESSEUR,
    professeurVide,
    lireProfesseur,
    reglagesEquipe,
    resultatsClasse,
  };
  if (enNode) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

// ===== noyau/knn.js =====
// IA de la caméra (jalon 6) : reconnaître une image parmi les étiquettes apprises par l'élève.
// MobileNet (interface/camera.js) transforme chaque image en 1280 nombres ; ici, les k exemples les plus proches
// (cosinus) votent. Tout est calculé dans le navigateur : rien n'est envoyé.
//
//   const ia = creerReconnaissance();            ia.ajouter(n° étiquette, caracteristiques) ; ia.retirer(n°, i)
//   ia.reconnaitre(caracteristiques) → { etiquette, certitudes: { n°: 0..100 }, proche: { n, i, ressemblance } }
//     (étiquette 0 = rien appris ; « proche » : la photo apprise qui ressemble le plus, n° de l'étiquette, rang, 0..100)
//   const stable = creerStabilite({ seuil: 80, images: 5 }) ; stable.pousser(resultat) → n° vu de façon stable
(function (global) {
  'use strict';

  const K = 10;

  function normer(v) {
    let s = 0;
    for (let i = 0; i < v.length; i++) s += v[i] * v[i];
    const n = Math.sqrt(s) || 1;
    const r = new Float32Array(v.length);
    for (let i = 0; i < v.length; i++) r[i] = v[i] / n;
    return r;
  }

  function creerReconnaissance(options) {
    const k = (options && options.k) || K;
    const exemples = new Map(); // n° → [Float32Array normés]
    return {
      ajouter(n, caracteristiques) {
        if (!exemples.has(n)) exemples.set(n, []);
        exemples.get(n).push(normer(caracteristiques));
      },
      retirer(n, i) {
        const l = exemples.get(n);
        if (l) l.splice(i, 1);
      },
      vider(n) {
        if (n === undefined) exemples.clear();
        else exemples.delete(n);
      },
      nombre: (n) => (exemples.get(n) || []).length,
      reconnaitre(caracteristiques) {
        const q = normer(caracteristiques);
        const proches = [];
        for (const [n, liste] of exemples) {
          liste.forEach((e, rang) => {
            let s = 0;
            for (let i = 0; i < q.length; i++) s += q[i] * e[i];
            proches.push({ n, s, rang });
          });
        }
        if (!proches.length) return { etiquette: 0, certitudes: {} };
        proches.sort((a, b) => b.s - a.s);
        const votants = proches.slice(0, Math.min(k, proches.length));
        const votes = {};
        for (const v of votants) votes[v.n] = (votes[v.n] || 0) + 1;
        const certitudes = {};
        for (const n of exemples.keys()) certitudes[n] = Math.round(((votes[n] || 0) * 100) / votants.length);
        let etiquette = votants[0].n;
        for (const n of Object.keys(votes)) if (votes[n] > votes[etiquette]) etiquette = Number(n);
        const p = proches[0];
        return { etiquette: Number(etiquette), certitudes, proche: { n: p.n, i: p.rang, ressemblance: Math.max(0, Math.min(100, Math.round(p.s * 100))) } };
      },
    };
  }

  // Une étiquette n'est « vue » qu'après plusieurs images de suite au-dessus du seuil : pas de clignotement.
  function creerStabilite(options) {
    const seuil = (options && options.seuil) || 80;
    const images = (options && options.images) || 5;
    let candidat = 0;
    let suite = 0;
    let vue = 0;
    return {
      pousser(r) {
        const n = r && r.certitudes && r.certitudes[r.etiquette] >= seuil ? r.etiquette : null;
        if (n === null) return vue;
        if (n === candidat) suite++;
        else {
          candidat = n;
          suite = 1;
        }
        if (suite >= images) vue = candidat;
        return vue;
      },
      get vue() {
        return vue;
      },
      // Pour montrer la « réflexion » : l'étiquette en train de gagner et depuis combien d'images (sur « images »).
      get candidat() {
        return candidat;
      },
      get suite() {
        return Math.min(suite, images);
      },
      images,
      seuil,
      remettre() {
        candidat = 0;
        suite = 0;
        vue = 0;
      },
    };
  }

  // Caractéristiques ↔ texte (sauvegarde de l'équipe) : Float32 en base64.
  function versTexte(caracteristiques) {
    const octets = new Uint8Array(Float32Array.from(caracteristiques).buffer);
    if (typeof Buffer !== 'undefined') return Buffer.from(octets).toString('base64');
    let s = '';
    for (let i = 0; i < octets.length; i++) s += String.fromCharCode(octets[i]);
    return btoa(s);
  }
  function depuisTexte(texte) {
    let octets;
    if (typeof Buffer !== 'undefined') octets = Uint8Array.from(Buffer.from(texte, 'base64'));
    else octets = Uint8Array.from(atob(texte), (c) => c.charCodeAt(0));
    return new Float32Array(octets.buffer);
  }

  const api = { creerReconnaissance, creerStabilite, versTexte, depuisTexte };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.LaboBlocs = global.LaboBlocs || {}), api);
})(this);

}).call(typeof globalThis !== 'undefined' ? globalThis : this);
if (typeof module === 'object' && module.exports) module.exports = globalThis.LaboBlocs;
