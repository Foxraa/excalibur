/* Les notes d'évaluation.
   La maîtresse note souvent par compétence, avec des niveaux de 1 à 4 (« accord GN : 2, lexique : 1 »)
   plutôt qu'avec une note chiffrée. normNote(n, ok) range les deux formes :
   - une note chiffrée (15/20) reste telle quelle ;
   - des critères deviennent une note sur 4, la moyenne des niveaux (au quart de point), et chaque critère est gardé.
   preuvesNote(n) dit ce que la note apprend sur chaque objectif du programme : un critère compte pour ses propres objectifs. */
(function(global){
  const DATE=/^\d{4}-\d{2}-\d{2}$/;
  const nombre=v=>{const x=Number(String(v??'').replace(',','.'));return isFinite(x)?x:NaN};

  function normNote(n,ok){
    if(!n||typeof n!=='object')return null;
    const valides=c=>typeof ok==='function'?ok(c):Array.isArray(c)?c:[];
    const criteres=(Array.isArray(n.criteres)?n.criteres:[]).map(c=>{
      if(!c||typeof c!=='object')return null;
      const sur=nombre(c.sur)>0?nombre(c.sur):4,v=nombre(c.valeur);
      return c.nom&&v>=0&&v<=sur?{nom:String(c.nom).trim(),valeur:v,sur,competences:valides(c.competences)}:null}).filter(Boolean);
    let valeur=nombre(n.valeur),sur=nombre(n.sur);
    if(criteres.length){sur=4;valeur=Math.round(criteres.reduce((s,c)=>s+4*c.valeur/c.sur,0)/criteres.length*4)/4}
    if(!(sur>0&&valeur>=0&&valeur<=sur))return null;
    return {intitule:n.intitule?String(n.intitule):'',matiere:n.matiere,valeur,sur,
      commentaire:n.commentaire?String(n.commentaire):'',date:DATE.test(n.date||'')?n.date:null,
      competences:valides(n.competences),criteres};
  }

  // [{id, ok}] : ok entre 0 et 1.
  function preuvesNote(n){
    const cr=(n&&Array.isArray(n.criteres)?n.criteres:[]).filter(c=>(c.competences||[]).length);
    if(cr.length)return cr.flatMap(c=>c.competences.map(id=>({id,ok:c.valeur/(c.sur||4)})));
    return ((n&&n.competences)||[]).map(id=>({id,ok:n.valeur/n.sur}));
  }

  /* Les évaluations notées par critère ne vont pas dans « Mes notes » : elles servent au suivi.
     Elles sont gardées sur la leçon : lecon.evaluations = [{intitule, date, criteres}].
     preuvesLecon(l) : [{id, ok, date, intitule, nom, valeur, sur}], un élément par objectif de chaque critère. */
  function preuvesLecon(l){
    return ((l&&Array.isArray(l.evaluations))?l.evaluations:[]).flatMap(e=>(e.criteres||[]).flatMap(c=>(c.competences||[]).map(id=>
      ({id,ok:c.valeur/(c.sur||4),date:e.date||l.date,intitule:e.intitule||l.titre,nom:c.nom,valeur:c.valeur,sur:c.sur||4}))));
  }
  // Ajoute une évaluation à la liste d'une leçon, sans doublon (même intitulé, même date).
  function ajouterEvaluation(liste,e){
    const autres=(Array.isArray(liste)?liste:[]).filter(x=>!(x.intitule===e.intitule&&x.date===e.date));
    return [...autres,e].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  }

  const texteCriteres=n=>(n&&n.criteres||[]).map(c=>`${c.nom} ${String(c.valeur).replace('.',',')}`).join(' · ');

  global.normNote=normNote;
  global.preuvesNote=preuvesNote;
  global.texteCriteres=texteCriteres;
  global.preuvesLecon=preuvesLecon;
  global.ajouterEvaluation=ajouterEvaluation;
})(globalThis);
