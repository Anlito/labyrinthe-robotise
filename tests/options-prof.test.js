const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const P = require('../site/js/moteur/progression.js');
const N = require('../site/js/moteur/notation.js');
const equipe = () => P.creerProgression({eleves:['Équipe test'], classe:'5A'});
const b = {coefficients:Object.fromEntries(N.exercicesObligatoires().map(id=>[id,0])),carnet:{labyrinthe:2},arrondi:0,bonusDefi:0};
test('notation manuelle : les quatre niveaux donnent leur part des points ; non évalué reste hors du total',()=>{
 const d=equipe(); let r=N.noterEquipe(d,b); assert.equal(r.detail[0].attenteEvaluation,true);assert.equal(r.detail[0].pointsNoteMax,0);
 for(const niveau of [1,2,3,4]) {d.evaluationsProf={labyrinthe:niveau};r=N.noterEquipe(d,b);assert.equal(r.note,niveau*5);assert.equal(r.detail[0].fraction,niveau/4);}
});
test('non noté : une partie désactivée ne rapporte et ne retire aucun point',()=>{
 const d=equipe();d.evaluationsProf={labyrinthe:1,tests:4};const r=N.noterEquipe(d,{...b,carnet:{labyrinthe:0,tests:1}});assert.equal(r.note,20);assert.equal(r.detail.length,1);assert.equal(r.detail[0].partie,'tests');
});
test('défi désactivé : aucun bonus malgré la réussite',()=>{
 const d=equipe();P.noterVerification(d,'8',{reussi:true});assert.equal(N.noterEquipe(d,{...b,bonusDefi:1,defis:{'8':false}}).bonus,0);
});
test('évaluations professeur : persistance, export/import et rejet sans perdre les notes',()=>{
 const stockage=new Map();const context=()=>({Atelier:{projet:{id:'labyrinthe-robotise'}},localStorage:{getItem:k=>stockage.get(k)||null,setItem:(k,v)=>stockage.set(k,v)}});
 const code=fs.readFileSync(require('node:path').join(__dirname,'../site/js/notes-prof.js'),'utf8');const c=context();vm.runInNewContext(code,c);const a=c.Atelier.notesProf;
 a.regler(N.completerBareme());a.noter(equipe(),'labyrinthe','3');const texte=a.texte();const c2=context();vm.runInNewContext(code,c2);assert.equal(c2.Atelier.notesProf.pour(equipe()).labyrinthe,3);
 assert.throws(()=>a.importer('{"format":"invalide"}'));assert.equal(a.pour(equipe()).labyrinthe,3);
 const mauvais=JSON.parse(texte);Object.values(mauvais.notes)[0].labyrinthe=9;assert.throws(()=>a.importer(JSON.stringify(mauvais)));assert.equal(a.pour(equipe()).labyrinthe,3);
 a.importer(texte);assert.equal(a.pour(equipe()).labyrinthe,3);
});

test('parcours en ligne : refuse une version incompatible, garde les exercices locaux et ne contacte rien en file://', async()=>{
 const code=fs.readFileSync(require('node:path').join(__dirname,'../site/js/parcours-en-ligne.js'),'utf8');
 let appels=0;const courant={id:'labyrinthe',versionParcours:'1.0.0'};
 const creer=protocol=>{
  let brut={...courant};const A={projet:{id:'labyrinthe-robotise',parcours:'labyrinthe'},catalogue:{paquet:()=>({brut}),definirParcours:p=>{brut=p;}}};
  return {Atelier:A,LaboBlocs:{VERSION_MOTEUR:'0.4.0',controler:p=>p.incompatible?['moteur trop ancien']:[],comparerVersions:(a,b)=>a.localeCompare(b),parcoursDefinis:[brut]},location:{protocol},localStorage:{getItem:()=>null,setItem:()=>{}},AbortController,setTimeout,clearTimeout,fetch:async()=>{appels++;return{ok:true,json:async()=>({id:'labyrinthe',versionParcours:'2.0.0',incompatible:true})}}};
 };
 const enLigne=creer('https:');vm.runInNewContext(code,enLigne);await enLigne.Atelier.parcoursPret;assert.equal(enLigne.Atelier.catalogue.paquet().brut.versionParcours,'1.0.0');assert.match(enLigne.Atelier.messageParcoursEnLigne,/mise à jour du module/);assert.equal(appels,1);
 const fichier=creer('file:');vm.runInNewContext(code,fichier);await fichier.Atelier.parcoursPret;assert.equal(appels,1);
});
