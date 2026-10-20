// Recette automatique des critères du brief, dans de vrais navigateurs (Chrome et Edge installés sur le poste) :
//   npm run recette
// Pour chaque navigateur, en ouvrant index.html directement (file://, comme depuis l'archive ZIP)
// et par un serveur web (comme GitHub Pages) :
//   - les solutions de référence du parcours réussissent « Vérifier mon programme » dans l'interface ;
//   - aucun défilement de la page à 1366×768 et 1920×1080, rien ne déborde du simulateur ;
//   - une boucle sans « attendre » ne fige pas l'onglet ;
//   - aucune requête réseau hors du site, aucune erreur dans la console ;
//   - enregistrer, fermer, rouvrir et reprendre (serveur seulement : dossier simulé) ;
//   - le fichier d'équipe s'ouvre dans l'outil professeur ;
//   - l'élève envoie son programme final (exercice 7) dans la carte (carte Arduino virtuelle à la place du câble USB)
//     et « Vider la carte » du carnet efface le programme, noté dans le fichier de l'équipe ;
//   - une équipe de 5e et une de 4e n'ont pas le même onglet Câblage ; le concepteur de labyrinthe s'ouvre ;
//   - jalon 1 bis de Labo Blocs : un exercice modifié, installé par « Mettre à jour les exercices », arrive chez une
//     équipe test sans perdre son travail (copie du site servie à part, le dépôt n'est pas modifié).
// Le résultat est écrit dans RECETTE-AUTO.md.

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const puppeteer = require('puppeteer-core');
const { catalogue, projet } = require('../site/js/moteur/catalogue.js');

const RACINE = path.join(__dirname, '..');
const SITE = path.join(RACINE, 'site');
const PORT = 8093;
const NAVIGATEURS = [
  { nom: 'Chrome', chemin: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
  { nom: 'Edge', chemin: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
].filter((n) => fs.existsSync(n.chemin));
// Sans Chrome ni Edge (poste Linux, intégration continue) : Chromium, ou le navigateur indiqué dans CHROME.
if (!NAVIGATEURS.length) {
  const autre = [process.env.CHROME, '/usr/bin/google-chrome', '/usr/bin/chromium', '/opt/pw-browsers/chromium'].filter(Boolean).find((c) => fs.existsSync(c));
  if (autre) NAVIGATEURS.push({ nom: 'Chromium', chemin: autre });
}
const ARGS = ['--lang=fr-FR', '--allow-file-access-from-files', ...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : [])];
const TAILLES = [
  [1366, 768],
  [1920, 1080],
];
const IDS = catalogue.exercices().map((e) => e.id);
const OBLIGATOIRES = catalogue.exercices().filter((e) => !e.defi).length;
const FINAL = catalogue.exercices().filter((e) => !e.defi).pop().id;
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Réglages du collège : la page lit aussi la version en ligne de Labo Blocs (seule adresse hors du site permise).
// La recette ne dépend ni d'internet ni des classes publiées par le professeur : copie de secours et version
// « en ligne » sont remplacées par des réglages d'essai fixes (5A à 5C, 4A à 4C, 3A) ; seul un appel marqué __recette passe tel quel.
const ADRESSE_PARCOURS = 'https://anlito.github.io/labo-blocs/parcours/' + projet.parcours + '.labo-parcours.json';
const ADRESSE_COLLEGE = 'https://anlito.github.io/labo-blocs/site/college.js';
const COLLEGE_ESSAI = { format: 'labo-blocs/college', version: 1, classes: ['5A', '5B', '5C', '4A', '4B', '4C', '3A'], cheminClasse: ['Bureau', 'Classe', '{classe}', 'COMMUN', 'TECHNOLOGIE'] };
const COLLEGE_LOCAL = `definirCollege(${JSON.stringify(COLLEGE_ESSAI)});`;
function collegeDEssai(essai) {
  let vraie;
  Object.defineProperty(window, 'definirCollege', {
    configurable: true,
    get: () => (c) => vraie && vraie(c && c.__recette ? c : essai),
    set: (f) => { vraie = f; },
  });
}
async function lancer(nav) {
  const b = await puppeteer.launch({ executablePath: nav.chemin, headless: true, args: ARGS });
  const nouvellePage = b.newPage.bind(b);
  b.newPage = async () => {
    const p = await nouvellePage();
    await p.setRequestInterception(true);
    p.on('request', (r) => r.url().startsWith(ADRESSE_COLLEGE) ? r.respond({ status: 200, contentType: 'text/javascript', body: COLLEGE_LOCAL }) : r.url().startsWith(ADRESSE_PARCOURS) ? r.respond({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin':'*'}, body: JSON.stringify(catalogue.paquet().brut)}) : r.continue());
    await p.evaluateOnNewDocument(collegeDEssai, COLLEGE_ESSAI);
    const naviguer = p.goto.bind(p);
    p.goto = async (...args) => { const r = await naviguer(...args); await p.evaluate(() => globalThis.Atelier && Atelier.parcoursPret); return r; };
    return p;
  };
  return b;
}

const resultats = []; // { critere, contexte, ok, detail }
function noter(critere, contexte, ok, detail) {
  resultats.push({ critere, contexte, ok, detail: detail || '' });
  console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${critere} · ${contexte}${detail ? ' · ' + detail : ''}`);
}

// Surveille la console et le réseau d'une page.
function surveiller(page, origine) {
  const s = { erreurs: [], externes: [] };
  page.on('console', (m) => m.type() === 'error' && s.erreurs.push(m.text()));
  page.on('pageerror', (e) => s.erreurs.push(String(e.message || e)));
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(origine) && !u.startsWith('data:') && !u.startsWith('blob:') && !u.startsWith(ADRESSE_COLLEGE) && !u.startsWith(ADRESSE_PARCOURS)) s.externes.push(u);
  });
  return s;
}

async function ouvrirExercice(page, base, id) {
  await page.goto(`${base}index.html?enseignant=1&exercice=${id}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.Atelier && Atelier.programmation && Atelier.programmation.ecran.etat.exercice, { timeout: 10000 });
}

async function recetteNavigateur(nav, mode, base, origine) {
  const contexte = `${nav.nom}, ${mode}`;
  let navigateur;
  try {
    navigateur = await lancer(nav);
  } catch (e) {
    noter('Le navigateur démarre en mode automatique', contexte, false, String(e.message || e).split('\n')[0]);
    return false;
  }
  try {
    const page = await navigateur.newPage();
    const s = surveiller(page, origine);

    // Accueil
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    const accueil = await page.evaluate(() => !document.querySelector('.ecran-accueil').hidden);
    noter('Accueil affiché', contexte, accueil);

    // Les solutions du parcours, aux deux tailles d'écran
    for (const [w, h] of TAILLES) {
      await page.setViewport({ width: w, height: h });
      const echecs = [];
      const defilements = [];
      for (const id of IDS) {
        await ouvrirExercice(page, base, id);
        const r = await page.evaluate(async () => {
          const E = Atelier.programmation.ecran;
          const ex = E.etat.exercice;
          E.editeur.charger(ex, LaboBlocs.versBlockly(ex.solutionReference));
          await new Promise((x) => setTimeout(x, 150));
          document.querySelector('.btn-lancer').click();
          await new Promise((x) => setTimeout(x, 300));
          document.querySelector('.btn-verifier').click();
          const panneau = document.querySelector('.resultat');
          const sim = document.querySelector('.simulateur');
          const cmd = document.querySelector('.simu-commandes');
          const de = document.documentElement;
          return {
            reussi: !panneau.hidden && panneau.classList.contains('reussi'),
            message: panneau.innerText.slice(0, 120),
            defile: de.scrollHeight > innerHeight + 1 || de.scrollWidth > innerWidth + 1,
            deborde: sim.scrollHeight > sim.clientHeight + 1 || cmd.scrollWidth > cmd.clientWidth + 1,
          };
        });
        if (!r.reussi) echecs.push(`${id} (${r.message})`);
        if (r.defile || r.deborde) defilements.push(`${id}${r.defile ? ' page' : ''}${r.deborde ? ' simulateur' : ''}`);
      }
      noter(`Les ${IDS.length} solutions réussissent la vérification (${w}×${h})`, contexte, !echecs.length, echecs.join(', '));
      noter(`Aucun défilement ni débordement (${w}×${h})`, contexte, !defilements.length, defilements.join(', '));
    }

    // Boucle sans « attendre » : l'onglet reste réactif et le temps avance.
    await page.setViewport({ width: 1366, height: 768 });
    await ouvrirExercice(page, base, '2');
    const boucle = await page.evaluate(async () => {
      const E = Atelier.programmation.ecran;
      E.editeur.charger(E.etat.exercice, LaboBlocs.versBlockly({ demarrage: [], boucle: [
        { bloc: 'servo_angle', broche: 'D5', angle: 60 }, { bloc: 'servo_angle', broche: 'D5', angle: 120 } ] }));
      await new Promise((x) => setTimeout(x, 150));
      document.querySelector('.btn-lancer').click();
      const debut = performance.now();
      let tours = 0;
      while (performance.now() - debut < 2000) {
        await new Promise((x) => setTimeout(x, 20));
        tours++;
      }
      return { tours, t: E.etat.sim.t };
    });
    noter('Une boucle sans « attendre » ne fige pas l’onglet', contexte, boucle.tours > 40 && boucle.t > 500, `${boucle.tours} réponses en 2 s, horloge ${Math.round(boucle.t)} ms`);

    // Outil professeur : s'ouvre, lit une sauvegarde d'exemple.
    const exemple = path.join(RACINE, 'exemples', projet.dossier, 'Léa_Hugo', 'Léa_Hugo.json');
    await page.goto(base + 'prof.html', { waitUntil: 'load' });
    if (fs.existsSync(exemple)) {
      const lignes = await page.evaluate(async (texte) => {
        const dt = new DataTransfer();
        dt.items.add(new File([texte], 'Léa_Hugo.json', { type: 'application/json' }));
        document.querySelector('.zone-depot').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
        await new Promise((x) => setTimeout(x, 400));
        return [...document.querySelectorAll('.ligne-equipe')].map((l) => l.innerText.replace(/\s+/g, ' ').slice(0, 60));
      }, fs.readFileSync(exemple, 'utf8'));
      noter('Outil professeur : une sauvegarde apparaît dans le tableau', contexte, lignes.length === 1, lignes[0] || '');
    }

    // Enregistrer, fermer, rouvrir, reprendre (dossier simulé dans le stockage du navigateur).
    if (mode === 'serveur') {
      const cycle = await cycleSauvegarde(navigateur, base);
      noter('Enregistrer, fermer, rouvrir et reprendre à l’exercice en cours', contexte, cycle.ok, cycle.detail);
      if (cycle.texte) {
        const p2 = await navigateur.newPage();
        await p2.goto(base + 'prof.html', { waitUntil: 'load' });
        const ligne = await p2.evaluate(async (texte) => {
          const dt = new DataTransfer();
          dt.items.add(new File([texte], 'Recette_Test.json', { type: 'application/json' }));
          document.querySelector('.zone-depot').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
          await new Promise((x) => setTimeout(x, 400));
          const l = document.querySelector('.ligne-equipe');
          return l ? l.innerText.replace(/\s+/g, ' ') : '';
        }, cycle.texte);
        noter('Le fichier enregistré par l’atelier s’ouvre dans l’outil professeur', contexte, /Recette, Test/.test(ligne) && new RegExp(`1/${OBLIGATOIRES}`).test(ligne), ligne.slice(0, 80));
        await p2.close();
      }
    }

    // Carnet de 5e et de 4e, concepteur de labyrinthe.
    {
      const c = await carnetNiveaux(navigateur, base);
      noter('Carnet : onglet Câblage propre à la 5e et à la 4e, concepteur de labyrinthe dans Conception', contexte, c.ok, c.detail);
    }

    // Réglages du collège : classes de 5e et de 4e seulement, mises à jour par la version en ligne ; dossier de l'équipe imposé.
    if (mode === 'serveur') {
      const r = await reglagesCollege(navigateur, base);
      noter('Réglages du collège : classes du niveau, mises à jour en ligne, dossier de l’équipe créé par l’atelier', contexte, r.ok, r.detail);
    }

    noter('Lectures extérieures limitées aux réglages et au parcours Labo Blocs', contexte, !s.externes.length, [...new Set(s.externes)].slice(0, 3).join(' '));
    noter('Aucune erreur dans la console', contexte, !s.erreurs.length, [...new Set(s.erreurs)].slice(0, 3).join(' | '));
  } catch (e) {
    noter('Recette interrompue', contexte, false, String(e.message || e));
  } finally {
    await navigateur.close();
  }
  return true;
}

async function reglagesCollege(navigateur, base) {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const r = await page.evaluate(async () => {
    const pause = (ms) => new Promise((x) => setTimeout(x, ms));
    const options = () => [...document.querySelectorAll('.champ-classe option')].map((o) => o.value).filter(Boolean);
    localStorage.clear();
    const avant = options();
    document.querySelector('.btn-nouvelle').click();
    document.querySelector('.champ-classe').value = avant[0];
    // La version en ligne arrive : une 3e est ignorée (projet de 5e et de 4e), le chemin change.
    definirCollege({ format: 'labo-blocs/college', version: 1, classes: ['5A', '5G', '5D1', '4A', '3A'], cheminClasse: ['Reseau', '{classe}'], __recette: true });
    // Groupe : 5D1 est un groupe de la 5D, son dossier est dans celui de la classe.
    const groupe = LaboBlocs.remplirChemin(Atelier.cheminSauvegarde, '5D1', 'X').join(' › ');
    const apres = options();
    const garde = document.querySelector('.champ-classe').value;
    const c = document.querySelectorAll('.champ-prenom');
    c[0].value = 'college';
    c[1].value = 'test';
    document.querySelector('.formulaire-equipe button[type=submit]').click();
    const chemin = document.querySelector('.chemin').innerText.replace(/\s+/g, ' ');
    // L'élève choisit le dossier de son équipe : refusé, l'atelier le crée lui-même.
    const racine = await navigator.storage.getDirectory();
    for await (const [n] of racine.entries()) await racine.removeEntry(n, { recursive: true });
    const projet = await racine.getDirectoryHandle(Atelier.projet.dossier, { create: true });
    const equipe = await projet.getDirectoryHandle('College_Test', { create: true });
    window.showDirectoryPicker = async () => equipe;
    document.querySelector('.btn-choisir-dossier').click();
    await pause(400);
    const refus = document.querySelector('.dossier-resultat').innerText;
    window.showDirectoryPicker = async () => projet;
    document.querySelector('.btn-autre-dossier').click();
    await pause(500);
    let cree = false;
    try {
      await (await projet.getDirectoryHandle('College_Test')).getFileHandle('College_Test.json');
      cree = true;
    } catch {}
    return { avant, apres, garde, chemin, groupe, refus, cree, commencer: !!document.querySelector('.btn-commencer') };
  });
  await page.close();
  const ok =
    r.avant.length && r.avant.every((c) => /^[54]/.test(c)) && r.apres.join() === '5A,5G,5D1,4A' && r.groupe === `Reseau › 5D › 5D1 › ${projet.dossier} › X` && r.garde === '5A' &&
    r.chemin.includes(`Reseau › 5A › ${projet.dossier}`) && /qui le contient/.test(r.refus) && r.cree && r.commencer;
  return { ok, detail: ok ? r.apres.join(', ') : JSON.stringify(r).slice(0, 300) };
}

// Carnet : équipe de 5e et équipe de 4e (sans fichier, rien n'est enregistré), puis l'onglet Conception.
async function carnetNiveaux(navigateur, base) {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const r = await page.evaluate(async () => {
    const pause = (ms) => new Promise((x) => setTimeout(x, ms));
    const ouvrir = async (classe) => {
      document.querySelector('.ecran-accueil').hidden = true;
      Atelier.demarrerProjet(Atelier.creerSession({ donnees: Atelier.creerProgression({ eleves: ['Essai'], classe }), lecture: true }));
      document.querySelector('[data-onglet="cablage"]').click();
      await pause(150);
      return [...document.querySelectorAll('.carnet-contenu [data-partie]')].map((x) => x.dataset.partie);
    };
    const cinq = await ouvrir('5A');
    const quatre = await ouvrir('4B');
    document.querySelector('[data-onglet="conception"]').click();
    await pause(300);
    const lab = document.querySelector('.hote-labyrinthe.lab, .hote-labyrinthe .lab, .hote-labyrinthe');
    const de = document.documentElement;
    return { cinq, quatre, labyrinthe: !!(lab && lab.querySelector('svg')), defile: de.scrollWidth > innerWidth + 1 };
  });
  await page.close();
  const ok = r.cinq.join() === 'branchements-5' && r.quatre.length >= 3 && !r.quatre.includes('branchements-5') && r.labyrinthe && !r.defile;
  return { ok, detail: `5e : ${r.cinq.join(', ')} ; 4e : ${r.quatre.join(', ')} ; labyrinthe ${r.labyrinthe ? 'affiché' : 'absent'}${r.defile ? ' ; défilement horizontal' : ''}` };
}

// Nouvelle équipe → dossier (simulé) → exercice 1 réussi → la page est fermée → « Reprendre ».
async function cycleSauvegarde(navigateur, base) {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const texte = await page.evaluate(async () => {
    localStorage.clear();
    const racine = await navigator.storage.getDirectory();
    for await (const [n] of racine.entries()) await racine.removeEntry(n, { recursive: true });
    const parent = await racine.getDirectoryHandle(Atelier.projet.dossier, { create: true });
    window.showDirectoryPicker = async () => parent;
    document.querySelector('.btn-nouvelle').click();
    const c = document.querySelectorAll('.champ-prenom');
    c[0].value = 'recette';
    c[1].value = 'test';
    document.querySelector('.champ-classe').value = '5A';
    document.querySelector('.formulaire-equipe button[type=submit]').click();
    document.querySelector('.btn-choisir-dossier').click();
    await new Promise((x) => setTimeout(x, 500));
    document.querySelector('.btn-commencer').click();
    await new Promise((x) => setTimeout(x, 500));
    // Le carnet de projet s'ouvre d'abord : une case à compléter (onglet « Le système »), puis l'exercice 1.
    if (document.querySelector('.ecran-carnet').hidden) throw new Error('le carnet ne s’ouvre pas après l’accueil');
    document.querySelector('[data-onglet="systeme"]').click();
    const trou = document.querySelector('select[data-trou="phrase"][data-cle="0.0"]');
    trou.value = 'joystick';
    trou.dispatchEvent(new Event('change', { bubbles: true }));
    Atelier.ouvrirExercice('1');
    await new Promise((x) => setTimeout(x, 500));
    const E = Atelier.programmation.ecran;
    E.editeur.charger(E.etat.exercice, LaboBlocs.versBlockly(E.etat.exercice.solutionReference));
    await new Promise((x) => setTimeout(x, 200));
    document.querySelector('.btn-verifier').click();
    await new Promise((x) => setTimeout(x, 800));
    const dossier = await parent.getDirectoryHandle('Recette_Test');
    return (await (await dossier.getFileHandle('Recette_Test.json')).getFile()).text();
  });
  // On « ferme » : nouvelle page, puis Reprendre.
  await page.goto('about:blank');
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const reprise = await page.evaluate(async () => {
    const carte = !document.querySelector('.accueil-reprendre').hidden;
    document.querySelector('.btn-reprendre').click();
    await new Promise((x) => setTimeout(x, 800));
    const carnet = !document.querySelector('.ecran-carnet').hidden;
    document.querySelector('[data-onglet="systeme"]').click();
    const idee = document.querySelector('select[data-trou="phrase"][data-cle="0.0"]').value;
    document.querySelector('[data-onglet="programmation"]').click();
    document.querySelector('.btn-continuer').click();
    await new Promise((x) => setTimeout(x, 800));
    const E = Atelier.programmation && Atelier.programmation.ecran;
    return { carte, carnet, idee, exercice: E && E.etat.exercice.numero, fichier: !!(Atelier.sessionCourante && Atelier.sessionCourante.handle), equipe: document.querySelector('.labo-blocs .equipe-texte').innerText };
  });
  await page.close();
  const d = JSON.parse(texte);
  const ok = d.programmation.exercices['lab-01'].statut === 'reussi' && d.carnet.reponses.phrase['0.0'] === 'joystick' && reprise.carte && reprise.carnet && reprise.idee && reprise.exercice === '2' && reprise.fichier;
  return {
    ok,
    texte,
    detail: `fichier écrit (ex. 1 ${d.programmation.exercices['lab-01'].statut}, réponse du carnet ${d.carnet.reponses.phrase['0.0'] ? 'gardée' : 'perdue'}), reprise : carnet ${reprise.carnet ? 'ouvert' : 'absent'}, ` +
      `« Continuer » ouvre l’exercice ${reprise.exercice}, équipe ${reprise.equipe}, fichier ${reprise.fichier ? 'retrouvé' : 'perdu'}`,
  };
}

// Envoi du programme final de l'élève dans la carte du labyrinthe, puis « Vider la carte ».
// Une carte Arduino virtuelle (tools/carte-virtuelle.js) remplace le câble USB.
const CARTE_VIRTUELLE = fs.readFileSync(path.join(__dirname, 'carte-virtuelle.js'), 'utf8');
async function maquette(nav, base) {
  const contexte = `${nav.nom}, serveur`;
  const navigateur = await lancer(nav);
  try {
    // 1. Exercice final, « Dans la carte » : carte neuve → programme de base installé → programme de l'élève envoyé.
    const page = await navigateur.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.evaluateOnNewDocument(`${CARTE_VIRTUELLE};installerCarteVirtuelle({ modele: 'uno' });`);
    await ouvrirExercice(page, base, FINAL);
    const r = await page.evaluate(async () => {
      const pause = (ms) => new Promise((x) => setTimeout(x, ms));
      const E = Atelier.programmation.ecran;
      E.editeur.charger(E.etat.exercice, LaboBlocs.versBlockly(E.etat.exercice.solutionReference));
      document.querySelector('.btn-mode[data-mode="carte"]').click();
      const panneau = document.querySelector('.panneau-carte');
      const etapes = [];
      async function cliquer(action, attendu) {
        const avant = panneau.dataset.etat + panneau.textContent;
        panneau.querySelector(`[data-action="${action}"]`).click();
        for (let i = 0; i < 80; i++) {
          await pause(250);
          const e = panneau.dataset.etat;
          if (!['connexion', 'installation', 'envoi', 'choisir'].includes(e) && e + panneau.textContent !== avant) break;
        }
        etapes.push(panneau.dataset.etat);
        if (panneau.dataset.etat !== attendu) throw new Error(`${action} → ${panneau.dataset.etat} : ${panneau.querySelector('.pc-message').textContent}`);
      }
      await cliquer('connecter', 'a-installer');
      await cliquer('installer', 'connectee');
      await cliquer('envoyer', 'envoye');
      const ex = E.etat.exercice;
      const attendu = Array.from(LaboBlocs.codeOctet.compiler(ex.solutionReference, { composants: ex.composants, boutonsVersMasse: ex.boutonsVersMasse }).octets, (x) => x.toString(16).padStart(2, '0')).join('');
      return { etapes, identique: carteVirtuelle.programmeHex() === attendu, octets: attendu.length / 2, firmware: carteVirtuelle.firmware };
    });
    noter(`Labyrinthe : l’élève envoie son programme de l’exercice ${FINAL} dans la carte Arduino`, contexte, r.identique,
      `${r.etapes.join(' → ')} ; programme de base ${r.firmware && r.firmware.version} installé, ${r.octets} octets envoyés ${r.identique ? '= programme de l’élève' : '≠ programme de l’élève'}`);
    await page.close();

    // 2. Équipe, carnet › Programmation › « Vider la carte » : fenêtre de Labo Blocs, vidage noté dans le fichier.
    const p2 = await navigateur.newPage();
    await p2.setViewport({ width: 1366, height: 768 });
    await p2.evaluateOnNewDocument(`${CARTE_VIRTUELLE};installerCarteVirtuelle({ modele: 'uno', firmware: '0.2' });`);
    await p2.goto(base + 'index.html', { waitUntil: 'load' });
    const v = await p2.evaluate(async () => {
      const pause = (ms) => new Promise((x) => setTimeout(x, ms));
      localStorage.clear();
      const racine = await navigator.storage.getDirectory();
      for await (const [n] of racine.entries()) await racine.removeEntry(n, { recursive: true });
      const parent = await racine.getDirectoryHandle(Atelier.projet.dossier, { create: true });
      window.showDirectoryPicker = async () => parent;
      document.querySelector('.btn-nouvelle').click();
      const c = document.querySelectorAll('.champ-prenom');
      c[0].value = 'carte';
      c[1].value = 'test';
      document.querySelector('.champ-classe').value = '5A';
      document.querySelector('.formulaire-equipe button[type=submit]').click();
      document.querySelector('.btn-choisir-dossier').click();
      await pause(500);
      document.querySelector('.btn-commencer').click();
      await pause(500);
      document.querySelector('[data-onglet="programmation"]').click();
      await pause(300);
      carteVirtuelle.programme = Uint8Array.of(1, 2, 3); // un ancien programme dans la carte
      const envoiBloque = document.querySelector('.btn-envoi-carte').disabled;
      document.querySelector('.btn-vider-carte').click();
      await pause(300);
      const dialogue = document.querySelector('.dialogue-carte-hote');
      const panneau = dialogue.querySelector('.panneau-carte');
      const attendre = async () => {
        for (let i = 0; i < 60; i++) {
          await pause(250);
          if (!['connexion', 'choisir'].includes(panneau.dataset.etat)) return panneau.dataset.etat;
        }
        return panneau.dataset.etat;
      };
      panneau.querySelector('[data-action="connecter"]').click();
      const connectee = await attendre();
      const sansEnvoi = !panneau.querySelector('[data-action="envoyer"]');
      panneau.querySelector('[data-action="vider"]').click();
      await pause(400);
      const vide = await attendre();
      await pause(1200);
      const dossier = await parent.getDirectoryHandle('Carte_Test');
      const d = JSON.parse(await (await (await dossier.getFileHandle('Carte_Test.json')).getFile()).text());
      const h = Object.values(d.programmation.exercices).flatMap((e) => e.historique || []);
      return { envoiBloque, connectee, sansEnvoi, vide, carteVide: !carteVirtuelle.programme, note: h.some((x) => x.type === 'vider' && x.reussi) };
    });
    noter('Labyrinthe : « Vider la carte » (carnet) efface le programme, noté dans le fichier de l’équipe', contexte,
      v.connectee === 'connectee' && v.sansEnvoi && v.vide === 'vide' && v.carteVide && v.note && v.envoiBloque,
      `connexion : ${v.connectee}, après « Vider » : ${v.vide}, carte ${v.carteVide ? 'vide' : 'pas vide'}, ${v.note ? 'noté dans le fichier' : 'non noté'} ; envoi depuis le carnet ${v.envoiBloque ? 'fermé tant que l’exercice final n’est pas ouvert' : 'ouvert'}`);
    await p2.close();
  } catch (e) {
    noter('Envoi dans la carte interrompu', contexte, false, String(e.message || e));
  } finally {
    await navigateur.close();
  }
}

// Jalon 1 bis de Labo Blocs : une équipe réussit l'exercice 1 ; le professeur installe une version où l'exercice 1
// a changé (« Mettre à jour les exercices », dossier du site simulé) ; l'équipe rouvre son travail.
// Attendu : exercice 1 « à revérifier », réussite et blocs gardés, nouvelle consigne affichée, rien d'autre perdu.
async function miseAJourExercices(nav) {
  const os = require('node:os');
  const vm = require('node:vm');
  const copie = fs.mkdtempSync(path.join(os.tmpdir(), projet.id + '-recette-'));
  fs.cpSync(SITE, copie, { recursive: true });
  const port = PORT + 1;
  const base = `http://localhost:${port}/`;
  const serveur = spawn(process.execPath, [path.join(__dirname, 'serve.js')], { env: { ...process.env, PORT: String(port), SITE: copie }, stdio: 'ignore' });
  await attendre(800);
  const navigateur = await lancer(nav);
  try {
    const page = await navigateur.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    page.on('dialog', (d) => d.accept());
    // 1. L'équipe réussit l'exercice 1 avec ses blocs (dossier de l'équipe simulé).
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    await page.evaluate(async () => {
      localStorage.clear();
      const racine = await navigator.storage.getDirectory();
      for await (const [n] of racine.entries()) await racine.removeEntry(n, { recursive: true });
      const parent = await racine.getDirectoryHandle(Atelier.projet.dossier, { create: true });
      window.showDirectoryPicker = async () => parent;
      document.querySelector('.btn-nouvelle').click();
      const c = document.querySelectorAll('.champ-prenom');
      c[0].value = 'equipe';
      c[1].value = 'test';
      document.querySelector('.champ-classe').value = '5A';
      document.querySelector('.formulaire-equipe button[type=submit]').click();
      document.querySelector('.btn-choisir-dossier').click();
      await new Promise((x) => setTimeout(x, 500));
      document.querySelector('.btn-commencer').click();
      await new Promise((x) => setTimeout(x, 500));
      Atelier.ouvrirExercice('1');
      await new Promise((x) => setTimeout(x, 500));
      const E = Atelier.programmation.ecran;
      E.editeur.charger(E.etat.exercice, LaboBlocs.versBlockly(E.etat.exercice.solutionReference));
      await new Promise((x) => setTimeout(x, 200));
      document.querySelector('.btn-verifier').click();
      await new Promise((x) => setTimeout(x, 800));
    });
    // 2. Nouvelle version du parcours : la consigne de l'exercice 1 change.
    let brut;
    vm.runInNewContext(fs.readFileSync(path.join(copie, 'parcours', projet.parcours + '.js'), 'utf8'), { definirParcours: (x) => (brut = JSON.parse(JSON.stringify(x))) });
    const NOUVELLE = 'Placer le servomoteur D5 à 90° dès le démarrage : le plateau est à plat.';
    brut.versionParcours = brut.versionParcours.replace(/\d+$/, (n) => String(Number(n) + 1));
    brut.exercices[0].consigne = NOUVELLE;
    const fichierParcours = path.join(copie, 'nouvelle.labo-parcours.json');
    fs.writeFileSync(fichierParcours, JSON.stringify(brut));
    const prof = await navigateur.newPage();
    await prof.goto(base + 'prof.html', { waitUntil: 'load' });
      await prof.evaluate(async (texte) => {
      const racine = await navigator.storage.getDirectory();
      const site = await racine.getDirectoryHandle('site', { create: true });
      const parcours = await site.getDirectoryHandle('parcours', { create: true });
      const w = await (await parcours.getFileHandle(Atelier.projet.parcours + '.js', { create: true })).createWritable();
      await w.write(texte);
      await w.close();
      window.showDirectoryPicker = async () => site;
      document.querySelector('.pb-exercices').click();
    }, fs.readFileSync(path.join(copie, 'parcours', projet.parcours + '.js'), 'utf8'));
    await attendre(300);
    await (await prof.$('.entree-parcours')).uploadFile(fichierParcours);
    await attendre(400);
    const differences = await prof.evaluate(() => document.querySelector('.mj-candidat').innerText);
    await prof.evaluate(() => document.querySelector('.btn-valider').click());
    await attendre(600);
    const installe = await prof.evaluate(async () => {
      const racine = await navigator.storage.getDirectory();
      const parcours = await (await racine.getDirectoryHandle('site')).getDirectoryHandle('parcours');
      const lire = async (n) => (await (await parcours.getFileHandle(n)).getFile()).text();
      return { message: (document.querySelector('.mj-message') || {}).innerText || '', nouveau: await lire(Atelier.projet.parcours + '.js'), precedent: await lire(Atelier.projet.parcours + '-precedent.js').catch(() => '') };
    });
    await prof.close();
    if (!installe.nouveau.includes(NOUVELLE)) return noter('Mise à jour d’un exercice : le travail d’une équipe test est gardé', nav.nom, false, 'fichier non écrit : ' + installe.message.slice(0, 120));
    fs.writeFileSync(path.join(copie, 'parcours', projet.parcours + '.js'), installe.nouveau);
    // 3. L'équipe rouvre son travail (Reprendre), puis l'exercice 1.
    await page.goto('about:blank');
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    const apres = await page.evaluate(async () => {
      document.querySelector('.btn-reprendre').click();
      await new Promise((x) => setTimeout(x, 800));
      const message = document.querySelector('.message-bref').innerText;
      const d = Atelier.sessionCourante.donnees;
      const e1 = d.exercices['1'];
      Atelier.ouvrirExercice('1');
      await new Promise((x) => setTimeout(x, 600));
      return {
        message,
        statut: e1.statut,
        aReverifier: !!e1.aReverifier,
        ouvert2: Atelier.estDebloque(d, '2'),
        consigne: document.querySelector('.consigne-texte').innerText,
        blocs: Blockly.getMainWorkspace().getAllBlocks(false).length,
        revoir: document.querySelector('.resultat').innerText,
      };
    });
    const ok =
      apres.statut === 'reussi' && apres.aReverifier && apres.ouvert2 && apres.blocs >= 2 && apres.consigne.includes('dès le démarrage') && /modifié/.test(apres.message) && /modifié/.test(apres.revoir) && installe.precedent.length > 1000;
    noter(
      'Mise à jour d’un exercice : le travail d’une équipe test est gardé',
      `${nav.nom}, serveur`,
      ok,
      `différences vues : ${/Exercices modifiés \(1\)/.test(differences) ? 'exercice 1 modifié' : '?'} ; ${installe.message.slice(0, 60)} ; élève : « ${apres.message.slice(0, 50)}… », ` +
        `exercice 1 ${apres.statut}${apres.aReverifier ? ' à revérifier' : ''}, ${apres.blocs} blocs gardés, exercice 2 ${apres.ouvert2 ? 'ouvert' : 'fermé'}, nouvelle consigne ${apres.consigne.includes('dès le démarrage') ? 'affichée' : 'absente'}`,
    );
  } catch (e) {
    noter('Mise à jour d’un exercice : le travail d’une équipe test est gardé', nav.nom, false, String(e.message || e));
  } finally {
    await navigateur.close();
    serveur.kill();
    fs.rmSync(copie, { recursive: true, force: true });
  }
}

(async () => {
  if (!NAVIGATEURS.length) throw new Error('Aucun navigateur Chrome ou Edge trouvé.');
  // Sauvegardes d'exemple pour l'outil professeur.
  require('node:child_process').execFileSync(process.execPath, [path.join(__dirname, 'exemples-equipes.js')], { stdio: 'ignore' });
  const serveur = spawn(process.execPath, [path.join(__dirname, 'serve.js')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  await attendre(800);
  const debut = Date.now();
  try {
    for (const nav of NAVIGATEURS) {
      // Un navigateur qui ne démarre pas en mode automatique (ex. Edge déjà ouvert sur le poste) : noté, puis le suivant.
      if (!(await recetteNavigateur(nav, 'fichier', pathToFileURL(SITE).href + '/', 'file://'))) continue;
      await recetteNavigateur(nav, 'serveur', `http://localhost:${PORT}/`, `http://localhost:${PORT}/`);
      await maquette(nav, `http://localhost:${PORT}/`);
      await miseAJourExercices(nav);
    }
  } finally {
    serveur.kill();
  }

  const ok = resultats.filter((r) => r.ok).length;
  const lignes = [
    '# Recette automatique',
    '',
    `Lancée le ${new Date().toLocaleString('fr-FR')} avec \`npm run recette\` (${Math.round((Date.now() - debut) / 1000)} s).`,
    `Navigateurs : ${NAVIGATEURS.map((n) => n.nom).join(', ')} ; modes : fichier (index.html ouvert directement, comme l’archive ZIP) et serveur (comme GitHub Pages).`,
    '',
    `**${ok} / ${resultats.length} vérifications réussies.**`,
    '',
    '| Résultat | Critère | Navigateur, mode | Détail |',
    '|---|---|---|---|',
    ...resultats.map((r) => `| ${r.ok ? '✓' : '✗ ÉCHEC'} | ${r.critere} | ${r.contexte} | ${r.detail.replace(/\|/g, '/').replace(/\n/g, ' ')} |`),
    '',
  ];
  fs.writeFileSync(path.join(RACINE, 'RECETTE-AUTO.md'), lignes.join('\n'));
  console.log(`\n${ok}/${resultats.length} vérifications réussies — RECETTE-AUTO.md`);
  process.exitCode = ok === resultats.length ? 0 : 1;
})();
