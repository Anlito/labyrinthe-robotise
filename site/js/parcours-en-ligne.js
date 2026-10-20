// À chaque ouverture en ligne : dernière version compatible publiée par Labo Blocs.
// Le téléchargement ne contient que le parcours public, aucune donnée d'élève.
(function (global) {
  'use strict';
  const A = global.Atelier, LB = global.LaboBlocs;
  const cle = A.projet.id + '-parcours-publie';
  const source = 'https://anlito.github.io/labo-blocs/parcours/' + A.projet.parcours + '.labo-parcours.json';
  function appliquer(p) {
    const actuel = A.catalogue.paquet().brut;
    if (!p || p.id !== A.projet.parcours) return false;
    if (LB.controler(p, LB.VERSION_MOTEUR).length) { A.messageParcoursEnLigne = 'Le parcours publié demande une mise à jour du module Labo Blocs ; la version compatible est conservée.'; return false; }
    if (LB.comparerVersions(p.versionParcours, actuel.versionParcours) < 0) return false;
    A.catalogue.definirParcours(p);
    A.messageParcoursEnLigne = '';
    const i = LB.parcoursDefinis.findIndex((x) => x.id === p.id);
    if (i >= 0) LB.parcoursDefinis[i] = p;
    else LB.parcoursDefinis.push(p);
    return true;
  }
  const enLigne = /^https?:$/.test(location.protocol);
  if (enLigne && global.document) { document.body.inert = true; const attente = document.createElement('p'); attente.id = 'parcours-chargement'; attente.setAttribute('role', 'status'); attente.textContent = 'Préparation des exercices…'; document.body.append(attente); }
  A.parcoursPret = (async () => {
    A.origineParcours = 'copie intégrée';
    if (!/^https?:$/.test(location.protocol)) return;
    try { if (appliquer(JSON.parse(localStorage.getItem(cle)))) A.origineParcours = 'dernière version en ligne mémorisée'; } catch { /* copie intégrée disponible */ }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    try {
      const r = await fetch(source, { cache: 'no-store', credentials: 'omit', signal: ctrl.signal });
      if (!r.ok) return;
      const p = await r.json();
      if (appliquer(p)) {
        A.origineParcours = 'Labo Blocs en ligne';
        try { localStorage.setItem(cle, JSON.stringify(p)); } catch { /* stockage plein */ }
      }
    } catch { /* hors ligne : copie intégrée ou version compatible mémorisée */ }
    finally { clearTimeout(timer); }
  })().finally(() => { if (enLigne && global.document) { document.body.inert = false; document.getElementById('parcours-chargement')?.remove(); } });
})(this);
