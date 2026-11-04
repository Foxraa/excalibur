/* Contrôle des questions écrites par l'IA, avant de les montrer à l'enfant.
   Le modèle local ne suit pas toujours ses consignes : ce qui se répare est réparé
   (une réponse courte « a ou à ? » devient un QCM), le reste est refusé et l'IA recommence.
   controlerQuestion(x) renvoie {question} ou {refus:"la raison"}. */
(function(global){
  const propre=s=>String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/^[\s.,;:!?«»"“”]+|[\s.,;:!?«»"“”]+$/g,'').replace(/\s+/g,' ');
  const sansDetail=s=>String(s??'').replace(/\s*\(.*$/,'');

  // Tout est écrit à l'écran : rien à écouter, rien à dicter.
  const ORAL=/(?<!\p{L})(dict[ée]e|dicte|je (te |vais (te )?)?(dicte|lis|lire|dire)|tu entends|tu as entendu|à voix haute|à l['’]oral)(?!\p{L})|(?<!\p{L})[ée]coute (bien|attentivement|la |le |les |ce |cette |ces )/iu;
  // L'enfant ne voit pas les questions d'avant.
  const BAVARDAGE=/(?<!\p{L})(tu t['’]es tromp[ée]|tu as vu l['’]erreur|tu as dit que|on travaille sur|nous avons travaill[ée]|comme tout à l['’]heure|question pr[ée]c[ée]dente)(?!\p{L})/iu;
  const PIEGE=/\s*\(?\b(?:attention|pense bien)\b[^.!?)]*\bpi[èe]ge\b[^.!?)]*[.!?]?\)?/gi;
  const JUSTIFIER=/\s*\(?\b(?:explique|justifie)\b[^.!?)]*\b(?:choix|réponse|pourquoi)\b[^.!?)]*[.!?]?\)?/gi;
  const OUVERTE=/^(quels?|quelles?|combien|comment|pourquoi|où|ou\b|qui\b|que\b|qu['’]|à quoi|de quoi|dans quel|avec quoi|lequel|laquelle|lesquels|lesquelles)/i;
  const CONSIGNE=/^(trouve|donne|cite|écris|ecris|choisis|complète|complete|conjugue|indique|nomme|souligne|recopie|entoure|classe|transforme|mets|calcule|range|relie|corrige)\b/i;
  const ORTHOGRAPHE=/s['’][ée]cri|[ée]crire|orthographe/i;
  const NOMS='mots?|noms?|verbes?|adjectifs?|pronoms?|exemples?|[ée]l[ée]ments?|choses?|r[ée]ponses?|multiples?|diviseurs?|nombres?|fractions?|villes?|pays|animaux';
  const PLUSIEURS=new RegExp(`(?:^|[.!?,]\\s+)(?:donne|cite|trouve|[ée]cris|nomme|indique)\\b[^.?!]{0,40}\\b(?:deux|trois|quatre|cinq|[2-5])\\s+(?:[a-zéèê]+\\s+)?(?:${NOMS})\\b|\\bquels? sont les (?:deux|trois|quatre|cinq|[2-5])\\b`,'i');

  // Les mots proposés dans le texte : « a » ou « à » ; soit ses, ces, soit c'est ; choisir : ses, ces ou c'est ?
  function optionsDansTexte(t){
    const Q=`[«"“'‘]\\s*[^«»"“”]{1,30}?\\s*[»"”'’]`;
    const m=t.match(new RegExp(`${Q}(?:\\s*(?:\\([^)]*\\)\\s*)?(?:,|\\bou bien\\b|\\bou\\b|\\bsoit\\b)\\s*(?:\\bsoit\\b\\s*)?${Q})+`));
    if(m)return [...m[0].matchAll(new RegExp(Q,'g'))].map(o=>propre(o[0].replace(/^[«"“'‘]|[»"”'’]$/g,'')));
    const l=t.match(/(?::|\bsoit\b|\bavec\b)\s*([^:?()]{1,40}?\s(?:ou|soit)\s[^:?().]{1,20})\s*(?:[?).:]|$)/);
    if(l){const o=l[1].split(/,|\bou\b|\bsoit\b/).map(propre).filter(Boolean);if(o.length>=2&&o.every(x=>x.split(' ').length<=3))return o}
    return null;
  }
  const contient=(t,mot)=>{const m=propre(mot).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return !!m&&new RegExp(`(?<![\\p{L}\\p{N}])${m}(?![\\p{L}\\p{N}])`,'iu').test(propre(t))};
  const ouiNon=(texte,oui,x)=>({...x,type:'qcm',question:texte,choix:['Oui','Non'],bonne:oui?0:1,reponses:undefined,calcul:undefined});

  function controlerVf(x,t){
    const bonne=x.bonne===true||x.bonne==='true'||x.bonne==='vrai';
    if(CONSIGNE.test(t))return {refus:"c'est une consigne, pas une affirmation à juger vrai ou faux"};
    if(!/\?\s*$/.test(t))return {question:{...x,question:t}};
    if(OUVERTE.test(t)||/\bou\b/.test(t))return {refus:"une question à choix entre deux mots a été mise en vrai/faux : il fallait un qcm"};
    return {question:ouiNon(t,bonne,x)};
  }
  function controlerCourte(x,t){
    t=t.replace(PIEGE,'').replace(JUSTIFIER,'').replace(/\?\s*\.$/,'?').trim();
    const reps=(Array.isArray(x.reponses)?x.reponses:[]).map(String).filter(Boolean);
    if(!reps.length)return {refus:'aucune réponse attendue'};
    if(reps.every(r=>/^(oui|non|vrai|faux)$/.test(propre(r)))){
      const oui=/^(oui|vrai)$/.test(propre(reps[0]));
      t=t.replace(/\s*\(?réponds? (?:par )?oui ou (?:par )?non\.?\)?/i,'').trim();
      return {question:ouiNon(t,oui,x)};
    }
    const opts=optionsDansTexte(t);
    if(opts){
      const j=[...new Set(reps.map(r=>opts.indexOf(propre(sansDetail(r)))).filter(i=>i>=0))];
      if(j.length===1)return {question:{...x,type:'qcm',question:t,choix:[...new Set(opts)],bonne:[...new Set(opts)].indexOf(opts[j[0]]),reponses:undefined,calcul:undefined}};
    }
    if(ORTHOGRAPHE.test(t)&&reps.some(r=>propre(sansDetail(r)).length>1&&contient(t,sansDetail(r))))return {refus:"le mot à écrire est déjà affiché dans la question : proposer plutôt une phrase à trou en qcm"};
    if(PLUSIEURS.test(t))return {refus:'la question demande plusieurs réponses : une seule chose à la fois'};
    return {question:{...x,question:t,reponses:reps}};
  }
  function controlerQcm(x,t){
    const bonne=Number(x.bonne),vus=new Map();
    (Array.isArray(x.choix)?x.choix:[]).forEach((c,i)=>{const k=propre(c);if(!vus.has(k)||i===bonne)vus.set(k,{t:String(c),ok:i===bonne||vus.get(k)?.ok})});
    const ch=[...vus.values()],b=ch.findIndex(c=>c.ok);
    if(ch.length<2||b<0)return {refus:'les choix du qcm sont incomplets'};
    return {question:{...x,question:t,choix:ch.map(c=>c.t),bonne:b}};
  }
  function controlerQuestion(x){
    let t=String(x.question??'').trim();
    if(!t)return {refus:'question vide'};
    t=t.replace(/^(?:vrai ou faux|vrai\/faux)\s*[:?.]\s*/i,'').replace(PIEGE,'').trim();
    if(ORAL.test(t))return {refus:"tout est écrit à l'écran : rien à écouter, pas de dictée"};
    if(BAVARDAGE.test(t))return {refus:'la question parle de ce qui a été fait avant'};
    if(/soulign/i.test(t)&&!/<u>/i.test(t))return {refus:'il est question d\'un mot souligné, mais rien n\'est souligné'};
    const cite=t.match(/phrase\s*:?\s*[«"“]([^»"”]+)[»"”][^«»"“”]{0,30}\bmot\s+[«"“'‘]\s*([^»"”'’]+?)\s*[»"”'’]/i);
    if(cite&&!contient(cite[1],cite[2]))return {refus:'le mot dont parle la question n\'est pas dans la phrase citée'};
    if(x.type==='vf')return controlerVf(x,t);
    if(x.type==='courte')return controlerCourte(x,t);
    if(x.type==='qcm')return controlerQcm(x,t);
    return {refus:'type de question inconnu'};
  }
  // Textes déjà passés par norm() : « tu as » et « as » valent la même réponse, pas « il as » et « tu as ».
  const sansPronom=s=>s.replace(/^(je|j|tu|il|elle|on|nous|vous|ils|elles) (?=\S)/,'');
  const memeReponse=(rep,attendu)=>!!rep&&!!attendu&&(rep===attendu||rep===sansPronom(attendu)||sansPronom(rep)===attendu);
  global.controlerQuestion=controlerQuestion;
  global.memeReponse=memeReponse;
})(globalThis);
