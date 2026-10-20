// Photos du professeur : lecture seule des JPG du dossier de l'équipe.
// Les photos restent hors du JSON élève : aucune écriture concurrente avec le professeur.
(function (global) {
  'use strict';
  const A = global.Atelier;
  const echapper = (s) => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const cle = d => JSON.stringify([d.equipe.classe || '', A.nomEquipe(d.equipe.eleves)]);
  function base() { return new Promise((ok, ko) => { const r = indexedDB.open(A.projet.id + '-photos', 1); r.onupgradeneeded = () => r.result.createObjectStore('dossiers'); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }); }
  async function memoriserDossier(d, dossier) {
    try { const db = await base(); await new Promise((ok, ko) => { const t = db.transaction('dossiers', 'readwrite'); t.objectStore('dossiers').put(dossier, cle(d)); t.oncomplete = ok; t.onerror = () => ko(t.error); }); db.close(); } catch { /* dossier redemandé au prochain clic */ }
  }
  async function retrouver(d) {
    try { const db = await base(); const h = await new Promise((ok, ko) => { const r = db.transaction('dossiers').objectStore('dossiers').get(cle(d)); r.onsuccess = () => ok(r.result || null); r.onerror = () => ko(r.error); }); db.close(); return h; } catch { return null; }
  }
  async function verifierDossier(dossier, session) {
    const nom = session.handle ? session.handle.name : A.fichiers.nomFichier(session.donnees);
    const h = await dossier.getFileHandle(nom);
    if (session.handle && typeof h.isSameEntry === 'function') return h.isSameEntry(session.handle);
    const r = A.lireSauvegarde(await (await h.getFile()).text());
    return r.ok && cle(r.donnees) === cle(session.donnees);
  }
  function monter(zone, session) {
    let actif = true, dossier = session.dossier || null, urls = [], lecture = 0;
    zone.innerHTML = '<h3>Notre labyrinthe sur papier</h3><p>Ton professeur peut photographier votre feuille dans « Croquis et dessins ». Retrouve ici les photos rangées dans le dossier de ton équipe. Tu peux utiliser le dessin sur papier ou le concepteur du site.</p>' +
      '<div class="photos-actions"><button type="button" class="btn-secondaire photos-ouvrir">Retrouver les photos de notre équipe</button><button type="button" class="btn-secondaire photos-actualiser" hidden>Actualiser les photos</button>' +
      '<label class="btn-secondaire photos-importer">Ouvrir des photos…<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label></div><p class="photos-etat" role="status"></p><div class="photos-galerie"></div>';
    const $ = s => zone.querySelector(s);
    function liberer() { urls.forEach(u => URL.revokeObjectURL(u)); urls = []; }
    function message(s) { if (actif) $('.photos-etat').textContent = s; }
    function afficher(fichiers) {
      if (!actif) return; liberer();
      $('.photos-galerie').innerHTML = fichiers.map(f => { const url = URL.createObjectURL(f); urls.push(url); return `<figure><a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="Photo de la feuille : ${echapper(f.name)}" loading="lazy"></a><figcaption>${echapper(f.name)}</figcaption></figure>`; }).join('');
      message(fichiers.length ? `${fichiers.length} photo(s). Clique sur une photo pour l’agrandir.` : 'Pas encore de photo dans le dossier. Clique sur « Actualiser les photos » après l’enregistrement par ton professeur.');
    }
    async function actualiser() {
      if (!dossier || !actif) return;
      const numero = ++lecture;
      try {
        if (dossier.queryPermission && await dossier.queryPermission({mode:'read'}) !== 'granted') { message('Clique sur « Retrouver les photos » pour autoriser la lecture du dossier.'); return; }
        const fichiers = [];
        for await (const h of dossier.values()) if (h.kind === 'file' && /^(Croquis|Dessin_technique|Feuille|Labyrinthe)_.*\.(jpe?g|png|webp)$/i.test(h.name)) fichiers.push(await h.getFile());
        fichiers.sort((a,b) => b.lastModified-a.lastModified);
        if (actif && numero === lecture) { $('.photos-actualiser').hidden = false; afficher(fichiers); }
      } catch { message('Le dossier n’est pas accessible. Clique sur « Retrouver les photos » pour le rouvrir.'); }
    }
    $('.photos-ouvrir').addEventListener('click', async () => {
      if (!global.showDirectoryPicker) { message('Utilise « Ouvrir des photos… » et sélectionne les photos de ton équipe dans son dossier.'); return; }
      try {
        const choisi = await showDirectoryPicker({id:A.projet.id+'-photos',mode:'read'});
        if (!await verifierDossier(choisi, session)) { message('Ce dossier ne contient pas votre sauvegarde. Choisis le dossier de ton équipe.'); return; }
        if (!actif) return;
        dossier = choisi; session.dossier = choisi; await memoriserDossier(session.donnees, choisi); await actualiser();
      } catch (e) { if (e.name !== 'AbortError') message('Choisis le dossier contenant votre fichier de travail et les photos du professeur.'); }
    });
    $('.photos-actualiser').addEventListener('click', actualiser);
    $('.photos-importer input').addEventListener('change', e => afficher([...e.target.files]));
    (async () => { dossier = dossier || await retrouver(session.donnees); if (actif && dossier) await actualiser(); })();
    return () => { actif = false; lecture++; liberer(); };
  }
  A.photos = { monter, memoriserDossier, verifierDossier };
})(this);
