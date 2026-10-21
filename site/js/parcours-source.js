// Le script du parcours publié a été chargé depuis le site Labo Blocs.
(function (global) {
  'use strict';
  const A = global.Atelier, LB = global.LaboBlocs;
  const p = A.catalogue.paquet();
  if (!p || p.brut.id !== 'labyrinthe') throw new Error('Parcours labyrinthe indisponible.');
  const problemes = LB.controler(p.brut, LB.VERSION_MOTEUR);
  const numeros = p.exercices.map(e => String(e.numero));
  if (problemes.length || numeros.join(',') !== '1,2,3,4,5,6,7,8')
    throw new Error('Le parcours publié n’est pas compatible avec ce carnet.');
  A.origineParcours = 'Labo Blocs en ligne';
  A.parcoursPret = Promise.resolve();
})(this);
