/* Le chrono du défi éclair des tables. Le temps de chaque calcul dépend de la période de l'année et de sa difficulté :
   c'est le plus facile des deux nombres qui décide (2 × 9 reste facile, même avec un 9).
   Le temps diminue au fil de l'année pour obliger à répondre de mémoire plutôt qu'à compter sur ses doigts. */
(function(global){
  // Secondes par période, pour les colonnes : 1-2-5-10 / 3-4 / 6-7-8-9. À ajuster ici après des essais réels.
  const SECONDES=[[12,16,20],[10,14,18],[8,12,16],[8,10,14],[6,10,12]];
  const colonne=x=>[1,2,5,10].includes(x)?0:[3,4].includes(x)?1:2;

  function limiteCalcul(a,b,periode){
    const p=Math.min(SECONDES.length,Math.max(1,periode));
    return SECONDES[p-1][Math.min(colonne(a),colonne(b))];
  }
  // Pendant les vacances, sd désigne la semaine de classe à venir : on garde la période qui vient de finir.
  function periodeDefi(cours,sd){
    if(!cours||cours.err||!cours.semaines.length)return 1;
    if(!sd)return cours.periodes.length;
    const n=sd.maintenant?sd.n:sd.n-1,s=cours.semaines.find(x=>x.n===n);
    return s?s.periode:1;
  }
  // Une seule hésitation ne doit pas coûter plus de la moitié des étoiles du sans-faute.
  const bonusTables=(score,total)=>total===12&&(score===10||score===11)?4:0;

  Object.assign(global,{limiteCalcul,periodeDefi,bonusTables});
})(globalThis);
