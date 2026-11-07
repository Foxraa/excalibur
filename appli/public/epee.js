/* La note du jour : la couleur de l'épée, de rouge à bleu.
   Elle se calcule sur les quiz terminés aujourd'hui et ne redescend jamais dans la journée :
   on garde le meilleur rang atteint, quiz après quiz. */
(function(global){
  const COULEURS_EPEE=[
    {id:'rouge', nom:'rouge', nomF:'rouge', c:'#e03131'},
    {id:'orange',nom:'orange',nomF:'orange',c:'#f76707'},
    {id:'jaune', nom:'jaune', nomF:'jaune', c:'#fab005'},
    {id:'vert',  nom:'vert',  nomF:'verte', c:'#40c057'},
    {id:'bleu',  nom:'bleu',  nomF:'bleue', c:'#228be6'}
  ];
  const SEUILS={
    reponsesMin:3,        // en dessous, trop peu de réponses pour juger : rouge
    baclePct:.7,          // un quiz sous ce taux de réussite ...
    bacleSecParQuestion:10, // ... répondu en moins de ce temps par question est bâclé
    orangePct:.5,         // sous ce taux de réussite : orange
    justessePct:.7,       // sous ce taux : jaune
    tempsSec:900,         // 15 minutes de travail pour passer au vert
    bleuPct:.85,          // taux de réussite du bleu
    vraiQuizPct:.8,       // leçon réussie à ce taux : le quiz suivant n'est plus un vrai quiz
    vraiQuizJours:7,      // ... pendant ce nombre de jours
    secParQuestionDefaut:20, // durée supposée par question quand la durée est inconnue
    tempsQuestionMax:180000  // plafond du temps d'une question, en ms
  };

  const tempsQuestion=ms=>Math.min(ms,SEUILS.tempsQuestionMax);

  const jours=iso=>Date.parse(iso+'T12:00:00Z')/864e5;
  const cle=q=>q.date+'#'+String(q.createdAt||0).padStart(15,'0');
  const duree=q=>q.duree??q.total*SEUILS.secParQuestionDefaut;
  const pctDe=q=>q.score/q.total;
  const bacle=q=>pctDe(q)<SEUILS.baclePct&&duree(q)/q.total<SEUILS.bacleSecParQuestion;

  // Un vrai quiz : ni défi, ni niveau facile, et la leçon n'a pas déjà été bien réussie ces derniers jours.
  function vraiQuiz(q,tous){
    if(q.defi||q.niveau==='facile')return false;
    const lecons=[...(q.leconIds||[])].sort().join();
    return !tous.some(o=>o!==q&&o.termine&&!o.defi&&o.total>0&&cle(o)<cle(q)
      &&[...(o.leconIds||[])].sort().join()===lecons
      &&pctDe(o)>=SEUILS.vraiQuizPct&&jours(q.date)-jours(o.date)<SEUILS.vraiQuizJours);
  }

  // Le rang (0 rouge à 4 bleu) d'une suite de quiz du jour.
  function rangDe(qs,tous){
    const reponses=qs.reduce((s,q)=>s+q.total,0);
    const pct=qs.reduce((s,q)=>s+q.score,0)/reponses;
    const temps=qs.reduce((s,q)=>s+duree(q),0);
    const baclees=qs.filter(bacle).reduce((s,q)=>s+q.total,0);
    if(reponses<SEUILS.reponsesMin||baclees>reponses/2)return 0;
    if(pct<SEUILS.orangePct)return 1;
    if(pct<SEUILS.justessePct||temps<SEUILS.tempsSec)return 2;
    return pct>=SEUILS.bleuPct&&qs.some(q=>vraiQuiz(q,tous))?4:3;
  }

  function noteDuJour(tous,jour){
    const qs=(tous||[]).filter(q=>q.date===jour&&q.termine&&!q.valide&&q.total>0).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    if(!qs.length)return null;
    let rang=0;
    for(let i=1;i<=qs.length;i++)rang=Math.max(rang,rangDe(qs.slice(0,i),tous));
    const reponses=qs.reduce((s,q)=>s+q.total,0);
    const temps=qs.reduce((s,q)=>s+duree(q),0);
    const c=COULEURS_EPEE[rang];
    return {rang,couleur:c.id,nom:c.nom,nomF:c.nomF,pct:qs.reduce((s,q)=>s+q.score,0)/reponses,reponses,minutes:Math.floor(temps/60)};
  }

  const nomEpee=(note,arme)=>`${arme.nom} ${arme.feminin?note.nomF:note.nom}`;

  // Une phrase courte et encourageante, selon ce qui manque encore.
  function conseilEpee(note,arme){
    if(note.rang===0)return `Reprends calmement, une question à la fois : ${arme.ton} va changer de couleur.`;
    if(note.rang===4)return `Bravo, ${arme.ton} est au plus beau !`;
    if(note.pct<SEUILS.justessePct)return `Vise la justesse : prends ton temps pour bien répondre et ${arme.ton} brillera davantage.`;
    const restant=SEUILS.tempsSec/60-note.minutes;
    if(restant>0)return `Encore ${restant} minute${restant>1?'s':''} de travail pour que ${arme.ton} brille davantage.`;
    return `Réussis un vrai quiz sur une leçon nouvelle pour atteindre le bleu avec ${arme.ton}.`;
  }

  Object.assign(global,{COULEURS_EPEE,tempsQuestion,noteDuJour,nomEpee,conseilEpee});
})(globalThis);
