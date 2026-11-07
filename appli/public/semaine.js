/* Le rythme de la semaine. Pas de classe le mercredi, le samedi ni le dimanche :
   le mardi et le vendredi soir sont des soirées de pause, et le samedi soir n'a pas de cartable à préparer non plus.
   Une soirée de pause ne compte pas contre l'enfant : sans travail, elle ne casse pas sa série. */
(function(global){
  const jourSemaine=iso=>new Date(iso+'T12:00:00Z').getUTCDay();
  const veille=iso=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10)};
  const MARDI=2,VENDREDI=5,SAMEDI=6;

  const soireePause=iso=>[MARDI,VENDREDI].includes(jourSemaine(iso));
  // Lignes de la routine du soir qui n'ont pas lieu d'être ce jour-là.
  const horsRoutine=(id,iso)=>(id==='cartable'&&[MARDI,VENDREDI,SAMEDI].includes(jourSemaine(iso)))||(id==='devoirs'&&soireePause(iso));

  function serieDe(actifs,aujourdhui){
    let d=actifs.has(aujourdhui)?aujourdhui:veille(aujourdhui),n=0;
    while(actifs.has(d)||soireePause(d)){if(actifs.has(d))n++;d=veille(d)}
    return {n,aujourdhui:actifs.has(aujourdhui)};
  }
  function meilleureSerieDe(actifs){
    const jours=[...actifs].sort(),seSuivent=(a,b)=>veille(b)===a||(soireePause(veille(b))&&veille(veille(b))===a);
    let best=0,cur=0;
    jours.forEach((d,i)=>{cur=i&&seSuivent(jours[i-1],d)?cur+1:1;best=Math.max(best,cur)});
    return best;
  }

  Object.assign(global,{soireePause,horsRoutine,serieDe,meilleureSerieDe});
})(globalThis);
