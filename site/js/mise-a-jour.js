// Outil du professeur · « Mettre à jour les exercices » (cahier des charges de Labo Blocs §4.10, écran C13).
//
// Les exercices de programmation viennent de Labo Blocs : le site garde sa copie, site/parcours/<parcours>.js.
// Le professeur récupère une nouvelle version (en ligne, ou fichier .labo-parcours.json exporté par Labo Blocs), voit
// les différences, puis valide : le fichier est réécrit dans le dossier du site (Chrome, Edge), l'ancien est gardé
// dans parcours/<parcours>-precedent.js pour « Revenir à la version précédente ». Sans accès au dossier (Firefox,
// site en ligne), le nouveau fichier est téléchargé, à copier à la main.
//
// Le travail des élèves est protégé par Labo Blocs à l'ouverture de leur fichier : blocs gardés, réussites gardées,
// un exercice réussi qui a changé est marqué « modifié, à revérifier ».
(function (global) {
  'use strict';

  const A = global.Atelier;
  const LB = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const $$ = (sel, racine) => [...(racine || document).querySelectorAll(sel)];
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Adresse de la dernière version publiée par Labo Blocs (GitHub Pages du dépôt labo-blocs).
  const SOURCE_EN_LIGNE = 'https://anlito.github.io/labo-blocs/parcours/' + A.projet.parcours + '.labo-parcours.json';
  const FICHIER = A.projet.parcours + '.js';
  const PRECEDENT = A.projet.parcours + '-precedent.js';

  const etat = { candidat: null, origine: '', precedent: undefined, vueAvant: 'accueil', message: null };
  const actuel = () => A.catalogue.paquet().brut;
  const dateFr = (iso) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR') : '');
  const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`;

  // ---------- Lecture d'un parcours ----------

  // Texte d'un fichier parcours (script « definirParcours({...}); » ou fichier d'échange .json) → objet.
  function lireTexte(texte) {
    const t = String(texte).replace(/^﻿/, '').trim();
    const m = t.match(/definirParcours\(([\s\S]*)\);?\s*$/);
    return JSON.parse(m ? m[1] : t);
  }

  // Charge un script du dossier parcours/ (lisible en file://) sans toucher au parcours en cours.
  function chargerScript(nom) {
    return new Promise((resolve) => {
      const avant = global.definirParcours;
      let lu = null;
      global.definirParcours = (p) => (lu = p);
      const s = document.createElement('script');
      const fin = () => {
        global.definirParcours = avant;
        s.remove();
        resolve(lu);
      };
      s.onload = fin;
      s.onerror = fin;
      s.src = 'parcours/' + nom + '?v=' + Date.now();
      document.body.append(s);
    });
  }

  // Ce que le professeur doit savoir d'un candidat : problèmes bloquants, différences, effets.
  function analyser(candidat) {
    const courant = actuel();
    const problemes = LB.controler(candidat, LB.VERSION_MOTEUR);
    if (!problemes.length && candidat.id !== courant.id) problemes.push(`Ce parcours est « ${candidat.titre || candidat.id} » : ce n’est pas celui du projet ${A.projet.titre}.`);
    if (problemes.length) return { problemes };
    const diff = LB.comparer(courant, candidat);
    const ordre = LB.comparerVersions(candidat.versionParcours, courant.versionParcours);
    const rien = !diff.ajoutes.length && !diff.supprimes.length && !diff.modifies.length && !diff.deplaces.length && !diff.textes.length;
    return { problemes: [], diff, ordre, rien };
  }

  // Ce qui change dans un exercice modifié (pour l'aperçu).
  function partiesModifiees(avant, apres) {
    const parties = [
      ['titre', 'le titre'],
      ['consigne', 'la consigne'],
      ['composants', 'les composants ou les broches'],
      ['blocsAutorises', 'les blocs proposés'],
      ['scenarios', 'les tests'],
      ['solutionReference', 'la solution de référence'],
      ['indices', 'les indices'],
      ['aSavoir', 'la fiche « À savoir »'],
    ];
    return parties.filter(([k]) => LB.canonique(avant[k] === undefined ? null : avant[k]) !== LB.canonique(apres[k] === undefined ? null : apres[k])).map(([, nom]) => nom);
  }

  // ---------- Affichage ----------

  function exerciceHtml(ex, ancien) {
    const composants = (ex.composants || []).map((c) => `${echapper(c.nom ? c.type + ' ' + c.nom : c.type)} ${echapper(c.broche)}`).join(' · ');
    let h = `<details class="mj-apercu"><summary><strong>${echapper(ex.numero)}</strong> · ${echapper(ex.titre)}`;
    if (ancien) h += ` <span class="mj-parties">— ${echapper(partiesModifiees(ancien, ex).join(', ') || 'mise en forme')}</span>`;
    h += '</summary>';
    if (ancien && ancien.consigne !== ex.consigne) h += `<p class="mj-avant"><span>Avant</span>${echapper(ancien.consigne)}</p><p class="mj-apres"><span>Après</span>${echapper(ex.consigne)}</p>`;
    else h += `<p class="mj-apres"><span>Consigne</span>${echapper(ex.consigne)}</p>`;
    if (composants) h += `<p class="mj-composants">Composants : ${composants}</p>`;
    return h + '</details>';
  }

  function listeHtml(titre, ids, liste, anciens, aide) {
    if (!ids.length) return '';
    const parId = (l, id) => l.find((e) => e.id === id);
    return (
      `<section class="mj-groupe"><h4>${titre} (${ids.length})</h4>` +
      (aide ? `<p class="mj-aide">${aide}</p>` : '') +
      ids.map((id) => exerciceHtml(parId(liste, id) || parId(anciens, id), anciens && liste !== anciens ? parId(anciens, id) : null)).join('') +
      '</section>'
    );
  }

  function dessiner() {
    const zone = $('.mj-contenu');
    const p = actuel();
    let h =
      '<section class="pe-carte mj-actuelle"><h3>Version installée</h3>' +
      `<p><strong>${echapper(p.titre)} · version ${echapper(p.versionParcours)}</strong>${p.date ? ' du ' + dateFr(p.date) : ''} · ${pluriel(p.exercices.length, 'exercice')}</p>` +
      `<p class="mj-aide">Moteur Labo Blocs ${echapper(LB.VERSION_MOTEUR)} · fichier <code>parcours/${FICHIER}</code> du site.</p>`;
    if (etat.precedent) {
      h +=
        `<p class="mj-aide">Version précédente gardée : ${echapper(etat.precedent.versionParcours)}${etat.precedent.date ? ' du ' + dateFr(etat.precedent.date) : ''}.</p>` +
        '<div class="mj-actions"><button type="button" class="btn-secondaire btn-revenir">Revenir à la version précédente</button></div>';
    }
    h += '</section>';

    h +=
      '<section class="pe-carte mj-sources"><h3>Chercher une nouvelle version</h3>' +
      '<div class="mj-actions">' +
      '<button type="button" class="btn-principal btn-en-ligne">Chercher en ligne</button>' +
      '<label class="btn-secondaire mj-fichier">Choisir un fichier…<input type="file" class="entree-parcours" accept=".json,.js,application/json" hidden></label>' +
      '</div>' +
      '<p class="mj-aide">En ligne : la dernière version publiée par Labo Blocs (connexion internet nécessaire). ' +
      'Fichier : un parcours exporté par Labo Blocs (<code>' + A.projet.parcours + '-….labo-parcours.json</code>), par exemple déposé sur le réseau.</p>' +
      '</section>';

    if (etat.message) h += `<p class="mj-message ${etat.message.genre}" role="status">${etat.message.html}</p>`;
    if (etat.candidat) h += candidatHtml();
    zone.innerHTML = h;
    lier();
  }

  function candidatHtml() {
    const c = etat.candidat;
    const r = analyser(c);
    let h = `<section class="pe-carte mj-candidat"><h3>Version ${echapper(c.versionParcours)}${c.date ? ' du ' + dateFr(c.date) : ''} <span class="mj-origine">(${echapper(etat.origine)})</span></h3>`;
    if (r.problemes.length) {
      return h + `<div class="mj-bloque" role="alert"><strong>Cette version ne peut pas être installée :</strong><ul>${r.problemes.map((x) => `<li>${echapper(x)}</li>`).join('')}</ul></div></section>`;
    }
    if (r.rien) return h + '<p class="mj-message info">Les exercices sont déjà à jour : cette version est identique à celle installée.</p></section>';
    const nouveaux = LB.preparer(c).exercices;
    const anciens = A.catalogue.paquet().exercices;
    const d = r.diff;
    if (r.ordre < 0) h += `<p class="mj-message attention">Cette version (${echapper(c.versionParcours)}) est plus ancienne que celle installée (${echapper(actuel().versionParcours)}).</p>`;
    h +=
      listeHtml('Exercices modifiés', d.modifies, nouveaux, anciens, 'Une équipe qui l’avait réussi le verra « modifié, à revérifier » : ses blocs sont gardés, elle relance la vérification.') +
      listeHtml('Exercices ajoutés', d.ajoutes, nouveaux, null) +
      listeHtml('Exercices supprimés', d.supprimes, anciens, null, 'Le travail des équipes reste dans leur fichier (visible dans l’outil du professeur).') +
      listeHtml('Exercices déplacés', d.deplaces.filter((id) => !d.modifies.includes(id)), nouveaux, null) +
      listeHtml('Textes retouchés', d.textes, nouveaux, anciens, 'Titre, indices ou fiche : sans effet sur les réussites.');
    h +=
      '<div class="mj-effet"><strong>Pour les élèves :</strong> les blocs et les réussites sont gardés. Les nouveaux exercices apparaissent quand ils rechargent l’atelier (F5).</div>' +
      '<div class="mj-actions"><button type="button" class="btn-principal btn-valider">Valider la mise à jour</button>' +
      '<button type="button" class="btn-secondaire btn-abandonner">Ne rien changer</button></div>' +
      '<p class="mj-aide">Avec Chrome ou Edge, choisissez ensuite le dossier du site (celui qui contient <code>index.html</code> et <code>parcours</code>). ' +
      'Sinon, le fichier est téléchargé : copiez-le dans <code>parcours/</code> à la place de l’ancien.</p></section>';
    return h;
  }

  function lier() {
    const zone = $('.mj-contenu');
    $('.btn-en-ligne', zone).addEventListener('click', chercherEnLigne);
    $('.entree-parcours', zone).addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (f) proposer(await f.text(), 'fichier ' + f.name);
    });
    const valider = $('.btn-valider', zone);
    if (valider) valider.addEventListener('click', () => installer(etat.candidat, 'mise à jour'));
    const abandonner = $('.btn-abandonner', zone);
    if (abandonner) abandonner.addEventListener('click', () => ((etat.candidat = null), (etat.message = null), dessiner()));
    const revenir = $('.btn-revenir', zone);
    if (revenir) {
      revenir.addEventListener('click', () => {
        if (confirm(`Revenir à la version ${etat.precedent.versionParcours} des exercices ? La version actuelle sera gardée à sa place.`)) installer(etat.precedent, 'retour');
      });
    }
  }

  function message(genre, html) {
    etat.message = { genre, html };
    dessiner();
  }

  function proposer(texte, origine) {
    try {
      etat.candidat = lireTexte(texte);
      etat.origine = origine;
      etat.message = null;
    } catch {
      etat.candidat = null;
      return message('attention', 'Ce fichier n’est pas un parcours Labo Blocs lisible (il faut un fichier <code>.labo-parcours.json</code> exporté par Labo Blocs).');
    }
    dessiner();
  }

  async function chercherEnLigne() {
    message('info', 'Recherche de la dernière version…');
    try {
      const r = await fetch(SOURCE_EN_LIGNE, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      proposer(await r.text(), 'en ligne');
    } catch {
      message('attention', 'La version en ligne est introuvable (pas de connexion internet, ou site de Labo Blocs indisponible). Vous pouvez choisir un fichier à la place.');
    }
  }

  // ---------- Écriture dans le dossier du site ----------

  // Dossier parcours/ du site : le professeur choisit le dossier du site (ou directement parcours/).
  async function dossierParcours() {
    const choisi = await global.showDirectoryPicker({ id: A.projet.id + '-site', mode: 'readwrite' });
    let dossier = choisi;
    if (choisi.name !== 'parcours') {
      try {
        dossier = await choisi.getDirectoryHandle('parcours');
      } catch {
        throw new Error('Ce dossier n’est pas celui du site : il n’a pas de sous-dossier « parcours ». Choisissez le dossier qui contient index.html.');
      }
    }
    try {
      await dossier.getFileHandle(FICHIER);
    } catch {
      throw new Error(`Le dossier « parcours » choisi n’a pas de fichier ${FICHIER}.`);
    }
    return dossier;
  }

  async function lireDans(dossier, nom) {
    try {
      return await (await (await dossier.getFileHandle(nom)).getFile()).text();
    } catch {
      return null;
    }
  }

  async function ecrireDans(dossier, nom, texte) {
    const f = await dossier.getFileHandle(nom, { create: true });
    const w = await f.createWritable();
    await w.write(texte);
    await w.close();
  }

  function telecharger(paquet) {
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(new Blob([LB.scriptParcours(paquet)], { type: 'text/javascript' }));
    lien.download = FICHIER;
    document.body.append(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(lien.href), 1000);
  }

  // Installe un parcours (mise à jour, ou retour à la version précédente) : l'actuel devient « précédent ».
  async function installer(paquet, quoi) {
    const courant = actuel();
    // Écriture possible depuis le dossier du site (file://) ou un serveur sur ce poste (npm start) ; pas depuis le site en ligne.
    const local = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (!global.showDirectoryPicker || !local) {
      telecharger(paquet);
      return message(
        'info',
        `Le fichier <strong>${FICHIER}</strong> (version ${echapper(paquet.versionParcours)}) est dans vos téléchargements. ` +
          (local
            ? `Dans le dossier du site, renommez <code>parcours/${FICHIER}</code> en <code>${PRECEDENT}</code>, puis copiez le nouveau fichier dans <code>parcours/</code>.`
            : 'Le site en ligne se met à jour par son dépôt GitHub : remplacez <code>site/parcours/' + FICHIER + '</code> par ce fichier.'),
      );
    }
    try {
      const dossier = await dossierParcours();
      const texteActuel = await lireDans(dossier, FICHIER);
      let surDisque = null;
      try {
        surDisque = lireTexte(texteActuel);
      } catch {
        /* illisible : on le garde quand même comme précédent */
      }
      // Le fichier du dossier choisi doit être celui que la page affiche (sinon : autre copie du site).
      if (surDisque && LB.canonique(surDisque) !== LB.canonique(courant)) {
        throw new Error(`Le dossier choisi contient la version ${surDisque.versionParcours}, pas la version ${courant.versionParcours} affichée ici : ce n’est pas la copie du site ouverte. Ouvrez prof.html depuis ce dossier.`);
      }
      await ecrireDans(dossier, PRECEDENT, texteActuel);
      await ecrireDans(dossier, FICHIER, LB.scriptParcours(paquet));
      A.catalogue.definirParcours(paquet);
      etat.precedent = courant;
      etat.candidat = null;
      message(
        'reussi',
        (quoi === 'retour' ? `Retour à la version ${echapper(paquet.versionParcours)} fait.` : `Mise à jour installée : version ${echapper(paquet.versionParcours)}.`) +
          ' Les élèves l’auront en rechargeant l’atelier (F5). Les équipes dont un exercice réussi a changé le verront « modifié, à revérifier ».',
      );
    } catch (e) {
      if (e && e.name === 'AbortError') return; // fenêtre fermée sans choisir
      message('attention', echapper((e && e.message) || 'L’écriture dans le dossier du site n’a pas marché.') + ' Rien n’a été changé.');
    }
  }

  // ---------- Vue ----------

  async function ouvrir() {
    etat.vueAvant = ($$('.vue').find((v) => !v.hidden) || {}).className || '';
    for (const v of $$('.vue')) v.hidden = !v.classList.contains('vue-exercices');
    $('.pb-actions').hidden = true;
    $('.pb-atelier').hidden = true;
    $('.pb-exercices').hidden = true;
    etat.message = null;
    dessiner();
    scrollTo(0, 0);
    if (etat.precedent === undefined) {
      etat.precedent = await chargerScript(PRECEDENT);
      dessiner();
    }
  }

  function fermer() {
    const avant = etat.vueAvant.match(/vue-(\w+)/);
    const nom = avant ? avant[1] : 'accueil';
    for (const v of $$('.vue')) v.hidden = !v.classList.contains('vue-' + nom);
    $('.pb-actions').hidden = nom === 'accueil';
    $('.pb-atelier').hidden = nom !== 'accueil';
    $('.pb-exercices').hidden = nom !== 'accueil';
    majAccueil();
  }

  function majAccueil() {
    const p = actuel();
    $('.prof-exercices-version').textContent = `Exercices : version ${p.versionParcours} (${pluriel(p.exercices.length, 'exercice')}).`;
  }

  $('.pb-exercices').addEventListener('click', ouvrir);
  $('.btn-ouvrir-mise-a-jour').addEventListener('click', ouvrir);
  $('.btn-retour-exercices').addEventListener('click', fermer);
  // Le bouton « Exercices » du bandeau suit le lien « Atelier enseignant » (visible sur l'accueil).
  new MutationObserver(() => ($('.pb-exercices').hidden = $('.pb-atelier').hidden || !$('.vue-exercices').hidden)).observe($('.pb-atelier'), { attributes: true, attributeFilter: ['hidden'] });
  majAccueil();

  Object.assign(A, { miseAJour: { ouvrir, analyser, lireTexte, SOURCE_EN_LIGNE } });
})(this);
