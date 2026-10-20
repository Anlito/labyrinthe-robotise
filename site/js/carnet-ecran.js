// Carnet de projet : la page de l'équipe après l'ouverture du projet. Les onglets et leurs parties viennent de
// donnees/carnet.js (types : info, classement, trous, questions, tableau, cases, choix, echelle, labyrinthe,
// programmation) ; les parties propres à un niveau (5e, 4e) ne sont montrées qu'aux classes de ce niveau.
// Tout est rangé dans le même fichier que les exercices (session commune).
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Couleurs des colonnes de classement (titres et explications du « ? » dans donnees/carnet.js).
  const COULEURS_COLONNES = { capteur: '#1E88E5', carte: '#7B1FA2', actionneur: '#E65100' };
  const SYMBOLE = { fait: '✓', en_cours: '●', a_faire: '○' };
  const MOT_ETAT = { fait: 'fait', en_cours: 'en cours', a_faire: 'à faire' };

  // Mélange stable (le même ordre pendant toute la séance), à partir d'une graine.
  function melanger(liste, graine) {
    let x = 0;
    for (const c of graine) x = (x * 31 + c.charCodeAt(0)) >>> 0;
    const r = liste.slice();
    for (let i = r.length - 1; i > 0; i--) {
      x = (x * 1103515245 + 12345) >>> 0;
      const j = x % (i + 1);
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  // Exercice final (le dernier qui n'est pas un défi) et défis du parcours, par numéro.
  function exercicesCles() {
    const ex = A.catalogue.exercices();
    const obligatoires = ex.filter((e) => !e.defi && !e.libre);
    return { final: obligatoires.length ? obligatoires[obligatoires.length - 1].id : null, defis: ex.filter((e) => e.defi).map((e) => e.id), obligatoires: obligatoires.length };
  }

  function creerCarnet(session) {
    const D = session.donnees;
    const C = A.carnet || { onglets: [], parties: [] };
    const racine = $('.ecran-carnet');
    const exercices = A.catalogue.exercices();
    const niveau = A.niveauDe(D.equipe.classe);
    D.carnet = A.harmoniserCarnet(A.completerCarnet(D.carnet), C);
    const K = D.carnet;
    const ONGLETS = A.ongletsCarnet(C, niveau);
    const ui = { onglet: ONGLETS.length ? ONGLETS[0].cle : null, choisi: null, revoir: {}, retour: {}, aideColonne: null };
    const graine = A.nomEquipe(D.equipe.eleves);
    let fermerPhotos = [];
    let labyrinthe = null; // module « Mon labyrinthe » posé dans l'onglet Conception

    A.poserIcones(racine);
    $('.carnet-equipe', racine).textContent = D.equipe.eleves.join(', ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');

    // Une modification du carnet : copie de secours tout de suite, fichier de l'équipe peu après.
    let minuteur = null;
    function modifie(geste) {
      D.modifieLe = A.horodatage();
      majEntete();
      if (geste) return session.aEnregistrer(true, true);
      clearTimeout(minuteur);
      minuteur = setTimeout(() => session.aEnregistrer(false), 600);
    }

    // ---------- En-tête : avancement et onglets ----------

    function etatOnglet(o, etats) {
      const e = [];
      for (const p of o.parties) {
        if (p.type === 'programmation') {
          const n = A.avancement(D);
          e.push(n >= exercicesCles().obligatoires ? 'fait' : Object.keys(D.exercices).length ? 'en_cours' : 'a_faire');
        } else if (etats[p.id]) e.push(etats[p.id]);
      }
      if (!e.length) return null;
      if (e.every((x) => x === 'fait')) return 'fait';
      return e.some((x) => x !== 'a_faire') ? 'en_cours' : 'a_faire';
    }
    function majEntete() {
      const etats = A.etatsCarnet(K, C, niveau);
      const av = A.avancementCarnet(K, C, niveau);
      const nProg = exercicesCles().obligatoires;
      $('.carnet-avancement', racine).innerHTML =
        `<span><strong>Carnet</strong> ${av.fait}/${av.total}</span>` +
        `<span class="barre"><span style="width:${av.total ? Math.round((av.fait / av.total) * 100) : 0}%"></span></span>` +
        `<span><strong>Programmation</strong> ${A.avancement(D)}/${nProg}</span>` +
        `<span class="barre"><span style="width:${nProg ? Math.round((A.avancement(D) / nProg) * 100) : 0}%"></span></span>`;
      $('.carnet-onglets', racine).innerHTML = ONGLETS.map((o) => {
        const e = etatOnglet(o, etats);
        return (
          `<button type="button" role="tab" class="onglet${e ? ' etat-' + e : ' sans-etat'}" data-onglet="${o.cle}" aria-selected="${ui.onglet === o.cle}">` +
          `${A.icone(o.icone || 'info', { epaisseur: 2.4 })}<span>${echapper(o.titre)}</span>` +
          (e ? `<span class="onglet-etat" aria-label="${MOT_ETAT[e]}">${SYMBOLE[e]}</span>` : '') +
          '</button>'
        );
      }).join('');
    }

    function montrer(cle) {
      // Changer d'onglet abandonne l'élément choisi ; un simple réaffichage le garde.
      const nouvelOnglet = !!cle && cle !== ui.onglet;
      if (nouvelOnglet) ui.choisi = null;
      if (cle && ONGLETS.some((o) => o.cle === cle)) ui.onglet = cle;
      majEntete();
      const o = ONGLETS.find((x) => x.cle === ui.onglet);
      const zone = $('.carnet-contenu', racine);
      if (labyrinthe) labyrinthe.demonter();
      labyrinthe = null;
      fermerPhotos.forEach(fermer => fermer());
      fermerPhotos = [];
      zone.classList.toggle('revision-page', !!o && o.cle === 'retenir');
      zone.innerHTML = o ? (o.cle === 'retenir' ? introductionRevision(o.parties) : '') + o.parties.map(partieHtml).join('') : '';
      if (o && o.cle === 'conception' && A.photos) {
        const photos = document.createElement('section'); photos.className = 'carte-carnet photos-eleves'; zone.prepend(photos);
        fermerPhotos.push(A.photos.monter(photos, session));
      }
      poserLabyrinthe(zone);
      if (nouvelOnglet) racine.scrollTop = 0;
    }

    // ---------- Parties ----------

    function entete(p, h) {
      if (p.id.startsWith('retenir-')) {
        const numero = C.parties.filter(x => x.id.startsWith('retenir-')).findIndex(x => x.id === p.id) + 1;
        return `<section class="carte-carnet revision-section" data-partie="${p.id}"><h2 id="revision-${p.id}" tabindex="-1"><span class="revision-numero">${String(numero).padStart(2, '0')}</span>${echapper(p.titre)}</h2>${h}</section>`;
      }
      const etat = A.etatPartie(K, p);
      return (
        `<section class="carte-carnet partie-${p.type}${p.encadre ? ' encadre-' + p.encadre : ''}" data-partie="${p.id}">` +
        `<h2>${echapper(p.titre)}${etat ? `<span class="etat-partie etat-${etat}">${SYMBOLE[etat]} ${MOT_ETAT[etat]}</span>` : ''}</h2>` +
        (p.consigne ? `<p class="mode-emploi">${echapper(p.consigne)}</p>` : '') +
        h + '</section>'
      );
    }

    function partieHtml(p) {
      const rendu = { info, classement, trous, questions, tableau, cases, choix, echelle, labyrinthe: partieLabyrinthe, programmation }[p.type];
      return rendu ? entete(p, rendu(p)) : '';
    }

    function info(p) {
      if (p.id.startsWith('retenir-')) return ficheRevision(p);
      return `<ul class="info-lignes">${(p.lignes || []).map((l) => `<li>${echapper(l)}</li>`).join('')}</ul>` + (p.schemaChaines ? schemaChaines() : '');
    }

    function introductionRevision(parties) {
      const noms = ['Les deux chaînes', 'Les composants', 'Programmer', 'Ré-étalonner', 'La sécurité', 'Les matériaux'];
      return '<header class="revision-intro"><p class="revision-surtitre">FICHE DE RÉVISION</p><h2>Les idées essentielles du projet</h2><p>Relis une notion à la fois. Les mots en gras et les exemples t’aident à expliquer le fonctionnement du labyrinthe.</p></header>' +
        '<nav class="revision-sommaire" aria-label="Notions à retenir">' + parties.map((p, i) => `<a href="#revision-${p.id}"><span>${String(i + 1).padStart(2, '0')}</span>${noms[i] || echapper(p.titre)}</a>`).join('') + '</nav>';
    }
    function ficheRevision(p) {
      const notion = (ligne) => {
        const i = ligne.indexOf(' : ');
        if (i > 0 && i < 60) return `<div class="revision-notion"><h3>${echapper(ligne.slice(0, i))}</h3><p>${echapper(ligne.slice(i + 3))}</p></div>`;
        return `<p class="revision-paragraphe">${echapper(ligne)}</p>`;
      };
      if (p.id === 'retenir-chaines') {
        const lignes = p.lignes || [];
        return '<div class="revision-deux-chaines"><section class="revision-information"><h3>La chaîne d’information</h3><p class="revision-role">Recevoir des informations et décider quoi faire.</p><p class="revision-etapes">Acquérir <span>→</span> Traiter <span>→</span> Communiquer</p>' +
          lignes.slice(1, -1).map(notion).join('') + '</section><section class="revision-energie"><h3>La chaîne d’énergie</h3><p class="revision-role">Fournir et transformer l’énergie pour réaliser l’action.</p><p class="revision-etapes">Alimenter <span>→</span> Distribuer <span>→</span> Convertir <span>→</span> Transmettre</p>' +
          '<dl class="revision-fonctions"><dt>Alimenter</dt><dd>Le câble USB apporte l’énergie électrique.</dd><dt>Distribuer</dt><dd>L’électronique des servomoteurs commande l’énergie envoyée aux moteurs.</dd><dt>Convertir</dt><dd>Les moteurs transforment l’énergie électrique en mouvement.</dd><dt>Transmettre</dt><dd>Les liaisons mécaniques transmettent le mouvement au plateau.</dd></dl><p class="revision-exemple"><strong>Action obtenue :</strong> le plateau s’incline et la bille se déplace.</p></section></div>' +
          '<p class="revision-lien"><strong>Le lien entre les deux :</strong> la chaîne d’information envoie un ordre de commande à la chaîne d’énergie.</p>';
      }
      if (p.id === 'retenir-etalonnage') return '<div class="revision-conversion"><div><strong>0 à 1023</strong><span>valeur du joystick</span></div><span aria-hidden="true">→</span><div><strong>0° à 180°</strong><span>angle du servomoteur</span></div></div>' +
        '<p class="revision-exemple"><strong>Exemple au centre :</strong> une valeur proche de 512 correspond à 90°.</p>' + (p.lignes || []).slice(1).map(notion).join('');
      return '<div class="revision-notions">' + (p.lignes || []).map(notion).join('') + '</div>';
    }

    // Structure fonctionnelle : https://eduscol.education.fr/document/17425/download
    function schemaChaines() {
      const bloc = (nom, definition) => `<details class="schema-fonction"><summary>${nom}<span aria-hidden="true"> ?</span></summary><p>${definition}</p></details>`;
      return '<figure class="schema-chaines"><figcaption>Deux chaînes reliées pour réaliser une action</figcaption>' +
        '<p class="schema-legende">Clique sur une fonction pour lire son explication. Chaque flèche porte le nom de ce qui circule.</p>' +
        '<section class="schema-information" aria-label="Chaîne d’information"><h3>Chaîne d’information</h3><p>Une information entre dans le système.</p><div class="schema-flux">' +
        bloc('Acquérir', 'Mesurer une grandeur ou détecter un événement grâce à un capteur : position, appui, lumière…') +
        '<span class="schema-fleche">information →</span>' + bloc('Traiter', 'Exécuter le programme pour décider de la réponse à apporter aux informations reçues.') +
        '<span class="schema-fleche">décision →</span>' + bloc('Communiquer', 'Transmettre la décision sous forme d’un ordre à la partie qui réalise l’action.') + '</div></section>' +
        '<div class="schema-liaison"><svg class="schema-lien" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="M850 0 V18 H360 V98"/><path d="M350 82 L360 98 L370 82"/></svg><strong>Ordre de commande</strong><span>La chaîne d’information pilote la distribution de l’énergie. Un ordre indique quoi faire ; l’énergie permet de le faire.</span></div>' +
        '<section class="schema-energie" aria-label="Chaîne d’énergie"><h3>Chaîne d’énergie</h3><p>Une source fournit de l’énergie au système.</p><div class="schema-flux">' +
        bloc('Alimenter', 'Fournir l’énergie nécessaire au fonctionnement du système.') + '<span class="schema-fleche">énergie →</span>' +
        bloc('Distribuer', 'Commander le passage ou la quantité d’énergie envoyée à l’actionneur, selon l’ordre reçu. Dans un servomoteur, cette commande est intégrée à son électronique.') + '<span class="schema-fleche">énergie →</span>' +
        bloc('Convertir', 'Transformer l’énergie en une autre forme. Un moteur transforme de l’énergie électrique en énergie mécanique.') + '<span class="schema-fleche">mouvement →</span>' +
        bloc('Transmettre', 'Faire parvenir le mouvement à la pièce à déplacer, par exemple avec un axe ou une liaison mécanique.') + '</div>' +
        '<p class="schema-action">→ <strong>Agir</strong> : réaliser l’action attendue, ici incliner le plateau pour déplacer la bille.</p></section>' +
        '<p class="schema-legende">Dans le labyrinthe, les fils d’alimentation transportent l’énergie électrique. Les fils de signal transmettent les informations ou les ordres. L’électronique de chaque servomoteur commande son moteur.</p></figure>';
    }

    // Classement : cliquer (ou glisser) un élément, puis sa colonne.
    function classement(p) {
      const placements = A.reponseCarnet(K, p);
      const colonnes = p.colonnes || [];
      const restants = melanger(p.elements || [], graine + p.id).filter((e) => !placements[e.nom]);
      const revoir = ui.revoir[p.id] || [];
      const choisi = ui.choisi && ui.choisi.partie === p.id ? ui.choisi.element : null;
      const carteObjet = (e, place) =>
        `<button type="button" class="carte-objet${place ? ' placee' : ''}${choisi === e.nom ? ' choisie' : ''}${revoir.includes(e.nom) ? ' a-revoir' : ''}" ` +
        `data-partie-element="${p.id}" data-element="${echapper(e.nom)}"${place ? ` data-place="${place}"` : ''} draggable="true" ` +
        `aria-label="${echapper(e.nom)}${place ? ' : remettre dans la liste' : ''}">` +
        (e.image ? `<img src="${echapper(e.image)}" alt="" draggable="false">` : '') +
        `<span class="carte-objet-nom">${echapper(e.nom)}</span>` +
        `${place ? '<span class="retirer" aria-hidden="true">×</span>' : ''}${revoir.includes(e.nom) ? '<span class="marque">à revoir</span>' : ''}</button>`;
      let h = '<div class="chaine" aria-label="Capteurs, puis carte programmable, puis actionneurs">' +
        colonnes.map((c, i) =>
          `<span class="chaine-maillon" style="--col:${COULEURS_COLONNES[c.cle] || '#455A64'}">${echapper(c.titre)}</span>` +
          (i < colonnes.length - 1 ? `<span class="chaine-fleche">${i === 0 ? 'l’information' : 'les ordres'} →</span>` : ''),
        ).join('') +
        '</div>' +
        '<p class="mode-emploi"><strong>1.</strong> Clique sur un élément (ou fais-le glisser), <strong>2.</strong> clique sur sa colonne. ' +
        'Clique sur un élément déjà placé pour le remettre dans la liste. Le <strong>?</strong> explique chaque colonne.</p>' +
        `<div class="reserve reserve-objets" data-zone="reserve" data-partie-zone="${p.id}"><span class="reserve-titre">À classer : ${restants.length}</span>` +
        (restants.length ? restants.map((e) => carteObjet(e)).join('') : '<span class="tout-place">Tous les éléments sont placés.</span>') +
        '</div><div class="colonnes">';
      for (const col of colonnes) {
        const dedans = (p.elements || []).filter((e) => placements[e.nom] === col.cle);
        const ouverte = ui.aideColonne === p.id + ':' + col.cle;
        h += `<div class="colonne" data-partie-colonne="${p.id}" data-colonne="${col.cle}" style="--col:${COULEURS_COLONNES[col.cle] || '#455A64'}">` +
          `<div class="colonne-titre"><span class="colonne-nom">${echapper(col.titre)}` +
          (col.explication ? `<button type="button" class="aide-colonne" data-aide-colonne="${p.id}:${col.cle}" aria-expanded="${ouverte}" aria-label="Qu’est-ce que c’est : ${echapper(col.titre)} ?">?</button>` : '') +
          `</span><small>${echapper(col.aide)}</small></div>` +
          (ouverte ? `<p class="explication-colonne">${echapper(col.explication)}</p>` : '') +
          `<div class="colonne-corps">${dedans.map((e) => carteObjet(e, col.cle)).join('') || '<span class="vide">Clique ici pour placer</span>'}</div></div>`;
      }
      return h + '</div>' + boutonVerifier(p, 'Vérifier mon classement');
    }

    // Cases à compléter : une liste déroulante par case (réponses et autres propositions, mélangées).
    function trous(p) {
      const choisis = A.reponseCarnet(K, p);
      const options = melanger(p.choix || [], graine + p.id);
      const revoir = ui.revoir[p.id] || [];
      const juste = ui.retour[p.id] && ui.retour[p.id].reussi;
      const liste = (p.lignes || []).map((ligne, i) =>
        '<li class="ligne-trous">' + A.morceauxTrous(ligne).map((m) => {
          if (m.trou === undefined) return `<span>${echapper(m.texte)}</span>`;
          const cle = `${i}.${m.trou}`;
          const v = choisis[cle] || '';
          const aRevoir = revoir.includes(cle);
          return `<select class="trou${v ? ' rempli' : ''}${aRevoir ? ' a-revoir' : ''}${juste ? ' juste' : ''}" data-trou="${p.id}" data-cle="${cle}" aria-label="Case à compléter${aRevoir ? ', à revoir' : ''}">` +
            `<option value="">choisir…</option>${options.map((o) => `<option${o === v ? ' selected' : ''}>${echapper(o)}</option>`).join('')}</select>` +
            (aRevoir ? '<span class="marque-trou">à revoir</span>' : '');
        }).join('') + '</li>').join('');
      return `<ol class="liste-trous">${liste}</ol>` + boutonVerifier(p, 'Vérifier');
    }

    function questions(p) {
      const r = A.reponseCarnet(K, p);
      return '<div class="questions">' + (p.questions || []).map((q, i) =>
        `<label>${echapper(q)}<textarea rows="2" data-question="${p.id}" data-i="${i}" placeholder="Votre réponse…">${echapper(r[i])}</textarea></label>`).join('') + '</div>';
    }

    function tableau(p) {
      const r = A.reponseCarnet(K, p);
      const titres = Array.isArray(p.lignes);
      const lignes = A.lignesTableau(p);
      let h = '<div class="table-defile"><table class="table-libre"><thead><tr>' + (p.colonnes || []).map((c) => `<th scope="col">${echapper(c)}</th>`).join('') + '</tr></thead><tbody>';
      lignes.forEach((titre, i) => {
        h += '<tr>' + (p.colonnes || []).map((c, j) =>
          titres && j === 0
            ? `<th scope="row">${echapper(titre)}</th>`
            : `<td><input type="text" data-tableau="${p.id}" data-i="${i}" data-j="${j}" value="${echapper((r[i] || [])[j])}" aria-label="${echapper(c)}${titres ? ' · ' + echapper(titre) : ' · ligne ' + (i + 1)}"></td>`).join('') + '</tr>';
      });
      h += '</tbody></table></div>';
      if (p.total) h += `<p class="total-tableau" data-total="${p.id}">${totalHtml(p)}</p>`;
      return h;
    }
    // Total d'une colonne de nombres (ex. poids estimé du plateau), comparé au maximum du cahier des charges.
    function totalHtml(p) {
      const t = p.total;
      const r = A.reponseCarnet(K, p);
      const somme = r.reduce((s, l) => s + (parseFloat(String((l || [])[t.colonne] || '').replace(',', '.')) || 0), 0);
      const depasse = t.maximum && somme > t.maximum;
      return `${echapper(t.titre)} : <strong>${A.nombreFr ? A.nombreFr(somme) : somme} ${echapper(t.unite || '')}</strong>` +
        (t.maximum ? (depasse ? ` <span class="depasse">plus que le maximum de ${t.maximum} ${echapper(t.unite || '')} : allège le plateau</span>` : ` (maximum ${t.maximum} ${echapper(t.unite || '')})`) : '');
    }

    function cases(p) {
      const r = A.reponseCarnet(K, p);
      return '<ul class="liste-cases">' + (p.cases || []).map((c, i) =>
        `<li><label><input type="checkbox" data-case-cochee="${p.id}" data-i="${i}"${r[i] ? ' checked' : ''}><span>${echapper(c)}</span></label></li>`).join('') + '</ul>';
    }

    function choix(p) {
      const r = A.reponseCarnet(K, p);
      const type = p.plusieurs ? 'checkbox' : 'radio';
      return `<div class="choix-options" role="${p.plusieurs ? 'group' : 'radiogroup'}" aria-label="${echapper(p.titre)}">` + (p.options || []).map((o) =>
        `<label><input type="${type}" name="choix-${p.id}" data-choix="${p.id}" value="${echapper(o)}"${r.choisis.includes(o) ? ' checked' : ''}><span>${echapper(o)}</span></label>`).join('') + '</div>' +
        (p.question ? `<label class="choix-question">${echapper(p.question)}<textarea rows="2" data-choix-texte="${p.id}" placeholder="Votre réponse…">${echapper(r.texte)}</textarea></label>` : '');
    }

    function echelle(p) {
      const r = A.reponseCarnet(K, p);
      const degres = p.degres || ['Pas encore', 'Plutôt bien', 'Très bien'];
      return '<table class="table-echelle"><thead><tr><th></th>' + degres.map((d) => `<th scope="col">${echapper(d)}</th>`).join('') + '</tr></thead><tbody>' +
        (p.lignes || []).map((l) => `<tr><th scope="row">${echapper(l)}</th>` + degres.map((d, k) =>
          `<td><input type="radio" name="echelle-${p.id}-${echapper(l)}" data-echelle="${p.id}" data-ligne="${echapper(l)}" value="${k}"${r[l] === k ? ' checked' : ''} aria-label="${echapper(l)} : ${echapper(d)}"></td>`).join('') + '</tr>').join('') +
        '</tbody></table>';
    }

    // « Mon labyrinthe » : le module est posé après l'affichage de l'onglet (poserLabyrinthe).
    function partieLabyrinthe(p) {
      return `<div class="hote-labyrinthe" data-labyrinthe="${p.id}"></div>`;
    }
    function poserLabyrinthe(zone) {
      const hote = $('[data-labyrinthe]', zone);
      if (!hote || !global.Labyrinthe) return;
      const p = A.partieCarnet(C, hote.dataset.labyrinthe);
      labyrinthe = global.Labyrinthe.monter(hote, {
        donnees: K.reponses[p.id] || global.Labyrinthe.vide(),
        lecture: !!session.lecture,
        surChangement(d) {
          K.reponses[p.id] = d;
          const titre = $(`[data-partie="${p.id}"] .etat-partie`, zone);
          const etat = A.etatPartie(K, p);
          if (titre && etat) {
            titre.className = 'etat-partie etat-' + etat;
            titre.textContent = `${SYMBOLE[etat]} ${MOT_ETAT[etat]}`;
          }
          modifie(false);
        },
      });
    }

    // ---------- Vérification d'une partie ----------

    function boutonVerifier(p, texte) {
      const r = ui.retour[p.id];
      const essais = (K.verifications[p.id] || []).length;
      let retour = '';
      if (r) {
        retour = r.reussi
          ? `<p class="retour-verif juste">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}Bravo, tout est juste !</p>`
          : `<p class="retour-verif">${echapper(r.message)}</p>`;
      }
      return (
        `<div class="verifier-partie"><button type="button" class="btn-verifier-partie" data-verifier="${p.id}">${A.icone('coche')}${texte}</button>` +
        `${essais ? `<span class="essais">${essais} vérification${essais > 1 ? 's' : ''}</span>` : ''}${retour}</div>`
      );
    }

    function verifier(id) {
      const p = A.partieCarnet(C, id);
      const r = p && A.corrigerPartie(K, p);
      if (!r) return;
      ui.revoir[id] = r.aRevoir || [];
      ui.retour[id] = r;
      A.noterVerificationCarnet(D, id, r);
      modifie(true);
      montrer();
    }

    // ---------- Programmation ----------

    function programmation() {
      const suivant = A.exerciceAReprendre(D);
      const cles = exercicesCles();
      let h = `<button type="button" class="btn-principal btn-continuer" data-exercice="${suivant}">${A.LECTURE}Continuer : exercice ${suivant}</button>` +
        '<div class="liste-programmation">';
      for (const ex of exercices) {
        const p = D.exercices[ex.id];
        const ouvert = A.estDebloque(D, ex.id);
        // « à revérifier » : réussi, mais le professeur a modifié l'exercice depuis (mise à jour des exercices).
        const statut = !ouvert ? 'verrouille' : p ? (p.statut === 'reussi' && p.aReverifier ? 'a_reverifier' : p.statut) : 'non_commence';
        const symbole = { verrouille: '🔒', reussi: '✓', a_reverifier: '↻', en_cours: '●', non_commence: '○' }[statut];
        const mot = { verrouille: 'verrouillé', reussi: 'réussi', a_reverifier: 'modifié, à revérifier', en_cours: 'en cours', non_commence: 'à faire' }[statut];
        h += `<button type="button" class="ligne-exercice statut-${statut}" data-exercice="${ex.id}"${ouvert ? '' : ' disabled'}>` +
          `<span class="liste-numero">${ex.id}</span><span class="liste-titre">${echapper(ex.titre)}${ex.defi ? ' <em class="defi">défi</em>' : ''}</span>` +
          `<span class="liste-statut"><span aria-hidden="true">${symbole}</span> ${mot}${p && p.tentatives ? ` · ${p.tentatives} vérification${p.tentatives > 1 ? 's' : ''}` : ''}</span></button>`;
      }
      // Le vrai labyrinthe : l'élève envoie SON programme final (ou du défi) dans la carte Arduino.
      const version = versionMaquette();
      const reussiFinal = cles.final && D.exercices[cles.final] && D.exercices[cles.final].statut === 'reussi';
      h += '</div><div class="tester-maquette">' +
        `<h3>${A.icone('lumiere', { epaisseur: 2.4 })}Tester sur le vrai labyrinthe</h3>` +
        (!version
          ? `<p>Quand l’exercice ${cles.final} sera ouvert, tu pourras envoyer ton programme dans la carte Arduino du labyrinthe.</p>` +
            '<button type="button" class="btn-principal btn-envoi-carte" disabled>Envoyer mon programme dans la carte Arduino</button>'
          : (reussiFinal
              ? `<p>Ton programme est validé${cles.defis.includes(version) ? ' (défi compris)' : ''} : fais-le valider par le professeur avant d’installer le plateau, puis envoie-le dans la carte Arduino.</p>`
              : `<p>Ton programme de l’exercice ${version} n’est pas encore validé : ne pose pas le plateau. Tu peux l’essayer sur les servomoteurs seuls.</p>`) +
            `<button type="button" class="btn-principal btn-envoi-carte" data-version="${version}">Envoyer mon programme dans la carte Arduino</button>`) +
        '<p class="demontage">Fin de séance : <button type="button" class="btn-secondaire btn-vider-carte">Vider la carte</button></p>' +
        '</div>';
      return h;
    }

    // ---------- Saisies (textes, cases, listes) ----------

    racine.addEventListener('input', (e) => {
      const t = e.target;
      if (t.closest('.hote-labyrinthe')) return;
      const d = t.dataset;
      if (d.question) A.reponseCarnet(K, A.partieCarnet(C, d.question))[Number(d.i)] = t.value;
      else if (d.tableau) {
        const p = A.partieCarnet(C, d.tableau);
        const r = A.reponseCarnet(K, p);
        r[Number(d.i)][Number(d.j)] = t.value;
        const total = $(`[data-total="${p.id}"]`, racine);
        if (total) total.innerHTML = totalHtml(p);
      } else if (d.choixTexte) A.reponseCarnet(K, A.partieCarnet(C, d.choixTexte)).texte = t.value;
      else return;
      majEtatPartie(t);
      modifie(false);
    });
    racine.addEventListener('change', (e) => {
      const t = e.target;
      if (t.closest('.hote-labyrinthe')) return;
      const d = t.dataset;
      if (d.trou) {
        const r = A.reponseCarnet(K, A.partieCarnet(C, d.trou));
        if (t.value) r[d.cle] = t.value;
        else delete r[d.cle];
        ui.revoir[d.trou] = (ui.revoir[d.trou] || []).filter((c) => c !== d.cle);
        ui.retour[d.trou] = null;
        t.classList.toggle('rempli', !!t.value);
        t.classList.remove('a-revoir', 'juste');
        const marque = t.nextElementSibling;
        if (marque && marque.classList.contains('marque-trou')) marque.remove();
        const retour = t.closest('section').querySelector('.retour-verif');
        if (retour) retour.remove();
      } else if (d.caseCochee) A.reponseCarnet(K, A.partieCarnet(C, d.caseCochee))[Number(d.i)] = t.checked;
      else if (d.choix) {
        const p = A.partieCarnet(C, d.choix);
        const r = A.reponseCarnet(K, p);
        if (p.plusieurs) r.choisis = [...racine.querySelectorAll(`[data-choix="${p.id}"]:checked`)].map((x) => x.value);
        else r.choisis = t.checked ? [t.value] : [];
      } else if (d.echelle) A.reponseCarnet(K, A.partieCarnet(C, d.echelle))[d.ligne] = Number(t.value);
      else return;
      majEtatPartie(t);
      modifie(false);
    });
    // L'état affiché dans le titre de la partie suit la saisie (sans tout réafficher : le curseur reste en place).
    function majEtatPartie(el) {
      const s = el.closest('[data-partie]');
      const p = s && A.partieCarnet(C, s.dataset.partie);
      const t = s && $('.etat-partie', s);
      const etat = p && A.etatPartie(K, p);
      if (t && etat) {
        t.className = 'etat-partie etat-' + etat;
        t.textContent = `${SYMBOLE[etat]} ${MOT_ETAT[etat]}`;
      }
    }

    // ---------- Clics et glisser-déposer ----------

    function placerElement(idPartie, nom, place) {
      const r = A.reponseCarnet(K, A.partieCarnet(C, idPartie));
      if (place) r[nom] = place;
      else delete r[nom];
      ui.choisi = null;
      ui.revoir[idPartie] = [];
      ui.retour[idPartie] = null;
      modifie(false);
      montrer();
    }

    racine.addEventListener('click', (e) => {
      if (e.target.closest('.hote-labyrinthe')) return;
      const o = e.target.closest('[data-onglet]');
      if (o) return montrer(o.dataset.onglet);
      const b = e.target.closest('button');
      if (b && racine.contains(b)) {
        if (b.dataset.verifier) return verifier(b.dataset.verifier);
        if (b.dataset.exercice) return A.ouvrirExercice(b.dataset.exercice);
        if (b.classList.contains('btn-envoi-carte')) return A.ouvrirExercice(b.dataset.version, { mode: 'carte' });
        if (b.classList.contains('btn-vider-carte')) return viderLaCarte();
        // « ? » d'une colonne : ouvre ou ferme son explication.
        if (b.dataset.aideColonne) {
          ui.aideColonne = ui.aideColonne === b.dataset.aideColonne ? null : b.dataset.aideColonne;
          return montrer();
        }
        if (b.dataset.element) {
          if (b.dataset.place) return placerElement(b.dataset.partieElement, b.dataset.element, null);
          const deja = ui.choisi && ui.choisi.partie === b.dataset.partieElement && ui.choisi.element === b.dataset.element;
          ui.choisi = deja ? null : { partie: b.dataset.partieElement, element: b.dataset.element };
          return montrer();
        }
      }
      // Clic sur une colonne du classement, un élément étant choisi.
      const col = e.target.closest('[data-colonne]');
      if (col && ui.choisi && ui.choisi.partie === col.dataset.partieColonne && !e.target.closest('button[data-place], .aide-colonne')) {
        placerElement(col.dataset.partieColonne, ui.choisi.element, col.dataset.colonne);
      }
    });
    racine.addEventListener('dragstart', (e) => {
      const b = e.target.closest('[draggable="true"][data-element]');
      if (!b) return;
      ui.glisse = { partie: b.dataset.partieElement, element: b.dataset.element };
      e.dataTransfer.setData('text/plain', 'carnet');
      e.dataTransfer.effectAllowed = 'move';
    });
    racine.addEventListener('dragover', (e) => {
      if (ui.glisse && e.target.closest('[data-colonne], [data-zone="reserve"]')) e.preventDefault();
    });
    racine.addEventListener('drop', (e) => {
      const g = ui.glisse;
      ui.glisse = null;
      if (!g) return;
      e.preventDefault();
      const col = e.target.closest('[data-colonne]');
      const reserve = e.target.closest('[data-zone="reserve"]');
      if (col && col.dataset.partieColonne === g.partie) placerElement(g.partie, g.element, col.dataset.colonne);
      else if (reserve && reserve.dataset.partieZone === g.partie) placerElement(g.partie, g.element, null);
    });

    return { montrer, rafraichir: () => montrer(), premierOnglet: () => (ONGLETS[0] || {}).cle };
  }

  // ---------- Navigation entre le carnet et les exercices ----------

  let session = null;
  let carnet = null;
  function demarrerProjet(s) {
    session = s;
    A.sessionCourante = s;
    carnet = creerCarnet(s);
    montrerCarnet(carnet.premierOnglet());
  }
  function montrerCarnet(onglet) {
    if (A.programmation) A.programmation.quitter();
    $('.ecran-programmation').hidden = true;
    $('.ecran-carnet').hidden = false;
    document.title = 'Carnet de projet — ' + A.projet.titre;
    carnet.montrer(onglet);
  }
  // Exercices : écran de Labo Blocs, posé à la première ouverture ; « Carnet » ramène à l'onglet Programmation.
  //   options : { mode: 'carte' } (« Tester sur le vrai labyrinthe » : envoyer son programme dans la carte)
  function ouvrirExercice(numero, options) {
    if (!A.idExercice(numero) || !A.estDebloque(session.donnees, numero)) return;
    $('.ecran-carnet').hidden = true;
    $('.ecran-programmation').hidden = false;
    if (!A.programmation) A.programmation = A.monterProgrammation(session, { retour: { texte: 'Carnet', action: () => montrerCarnet('programmation') } });
    A.programmation.ouvrir(A.idExercice(numero));
    A.programmation.choisirModeTest(options && options.mode === 'carte' ? 'carte' : 'simulateur');
  }

  // Programme à envoyer dans le labyrinthe : le défi s'il est réussi, sinon l'exercice final (s'il est ouvert).
  function versionMaquette() {
    const D = session.donnees;
    const cles = exercicesCles();
    const defi = cles.defis.find((id) => D.exercices[id] && D.exercices[id].statut === 'reussi');
    if (defi) return defi;
    return cles.final && A.estDebloque(D, cles.final) ? cles.final : null;
  }

  // Fin de séance : la carte du labyrinthe est vidée, son programme effacé.
  function viderLaCarte() {
    const D = session.donnees;
    global.LaboBlocs.ouvrirDialogueCarte({
      carte: 'uno',
      titre: 'Vider la carte Arduino',
      intro: 'Fin de séance : on efface le programme de la carte. Les servomoteurs ne bougeront plus jusqu’au prochain envoi.',
      seulementVider: true,
      surVidage(r) {
        if (session.lecture) return;
        global.LaboBlocs.noterVidage(D, A.idExercice(exercicesCles().final), { carte: 'uno', reussi: !!(r && r.ok) });
        session.aEnregistrer(true, true);
      },
    });
  }

  Object.assign(A, { demarrerProjet, montrerCarnet, ouvrirExercice, exercicesCles });
})(this);
