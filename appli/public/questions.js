/* Contrôle des questions écrites par l'IA, avant de les montrer à l'enfant.
   Le modèle local ne suit pas toujours ses consignes : ce qui se répare est réparé
   (une réponse courte « a ou à ? » devient un QCM), le reste est refusé et l'IA recommence.
   controlerQuestion(x,{matiere,voix}) renvoie {question} ou {refus:"la raison"}.
   Une question orale porte le texte à lire dans x.oral, jamais affiché : voix dit si le navigateur sait le lire. */
(function(global){
  const propre=s=>String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/^[\s.,;:!?«»"“”]+|[\s.,;:!?«»"“”]+$/g,'').replace(/\s+/g,' ');
  const sansDetail=s=>String(s??'').replace(/\s*\(.*$/,'');

  // Sans texte à lire dans x.oral, la question ne peut rien faire écouter.
  const ORAL=/(?<!\p{L})(dict[ée]e|dicte|je (te |vais (te )?)?(dicte|lis|lire|dire)|tu entends|tu as entendu|à voix haute|à l['’]oral)(?!\p{L})|(?<!\p{L})[ée]coute (bien|attentivement|et |la |le |les |ce |cette |ces )/iu;
  // L'enfant ne voit pas les questions d'avant.
  const BAVARDAGE=/(?<!\p{L})(tu t['’]es tromp[ée]|tu as vu l['’]erreur|tu as dit que|on travaille sur|nous avons travaill[ée]|comme tout à l['’]heure|question pr[ée]c[ée]dente)(?!\p{L})/iu;
  // Seul le texte s'affiche : « le paysage que tu observes » ou « la carte ci-dessous » renvoient à une image absente.
  const IMAGES='paysage|photo|photographie|image|illustration|dessin|sch[ée]ma|carte|plan|document|graphique|frise|croquis|figure';
  const DET="(?:le|la|l['’]|ce|cet|cette|les|ces)\\s*";
  const IMAGE_ABSENTE=new RegExp(`(?<!\\p{L})(?:${DET}(?:${IMAGES})s?(?!\\p{L})[^.?!]{0,30}?(?<!\\p{L})(?:que tu (?:vois|observes|regardes|as sous les yeux)|ci-(?:dessous|dessus|contre)|suivante?s?)|(?:observe|regarde|examine)\\s+(?:bien\\s+|attentivement\\s+)?${DET}(?:${IMAGES})s?)(?!\\p{L})`,'iu');
  const PIEGE=/\s*\(?\b(?:attention|pense bien)\b[^.!?)]*\bpi[èe]ge\b[^.!?)]*[.!?]?\)?/gi;
  const JUSTIFIER=/\s*\(?\b(?:explique|justifie)\b[^.!?)]*\b(?:choix|réponse|pourquoi)\b[^.!?)]*[.!?]?\)?/gi;
  const OUVERTE=/^(quels?|quelles?|combien|comment|pourquoi|où|ou\b|qui\b|que\b|qu['’]|à quoi|de quoi|dans quel|avec quoi|lequel|laquelle|lesquels|lesquelles)/i;
  const CONSIGNE=/^(trouve|donne|cite|écris|ecris|choisis|complète|complete|conjugue|indique|nomme|souligne|recopie|entoure|classe|transforme|mets|calcule|range|relie|corrige)\b/i;
  const ORTHOGRAPHE=/s['’][ée]cri|[ée]crire|[ée]crit[- ]on|on [ée]crit|orthographe|conjugue/i;
  const NOMS='mots?|noms?|verbes?|adjectifs?|pronoms?|exemples?|[ée]l[ée]ments?|choses?|r[ée]ponses?|multiples?|diviseurs?|nombres?|fractions?|villes?|pays|animaux';
  const PLUSIEURS=new RegExp(`(?:^|[.!?,]\\s+)(?:donne|cite|trouve|[ée]cris|nomme|indique)\\b[^.?!]{0,40}\\b(?:deux|trois|quatre|cinq|[2-5])\\s+(?:[a-zéèê]+\\s+)?(?:${NOMS})\\b|\\bquels? sont les (?:deux|trois|quatre|cinq|[2-5])\\b`,'i');

  // Les mots proposés dans le texte : « a » ou « à » ; soit ses, ces, soit c'est ; choisir : ses, ces ou c'est ?
  function optionsDansTexte(t){
    const Q=`[«"“'‘]\\s*[^«»"“”]{1,30}?\\s*[»"”'’]`;
    const m=t.match(new RegExp(`${Q}(?:\\s*(?:\\([^)]*\\)\\s*)?(?:,|\\bou bien\\b|\\bou\\b|\\bet\\b|\\bsoit\\b)\\s*(?:\\bsoit\\b\\s*)?${Q})+`));
    if(m)return [...m[0].matchAll(new RegExp(Q,'g'))].map(o=>propre(o[0].replace(/^[«"“'‘]|[»"”'’]$/g,'')));
    const l=t.match(/(?::|\bsoit\b|\bavec\b)\s*([^:?()]{1,40}?\s(?:ou|soit)\s[^:?().]{1,20})\s*(?:[?).:]|$)/);
    if(l){const o=l[1].split(/,|\bou\b|\bsoit\b/).map(propre).filter(Boolean);if(o.length>=2&&o.every(x=>x.split(' ').length<=3))return o}
    return null;
  }
  const contient=(t,mot)=>{const m=propre(mot).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return !!m&&new RegExp(`(?<![\\p{L}\\p{N}])${m}(?![\\p{L}\\p{N}])`,'iu').test(propre(t))};
  const ouiNon=(texte,oui,x)=>({...x,type:'qcm',question:texte,choix:['Oui','Non'],bonne:oui?0:1,reponses:undefined,calcul:undefined});

  // « Dans "Mon papa a un chien", quel mot est le bon ? » : le mot à trouver est sous les yeux de l'enfant.
  // Il disparaît de la phrase, et il ne reste qu'une phrase à compléter.
  const CHOIX_MOT=/(?<!\p{L})quel(?:le)?\s+(?:mot|homophone|forme|orthographe)(?!\p{L})[^?]*(?<!\p{L})(?:bon|bonne|correct|correcte|juste|exact|exacte|choisir|faut|convient|dois|doit|[ée]crire|mettre)(?!\p{L})|(?<!\p{L})(?:dois-tu|doit-on|faut-il|peut-on)(?!\p{L})[^?]*(?<!\p{L})(?:[ée]crire|choisir|mettre|utiliser)(?!\p{L})/iu;
  const PHRASE=/[«"“]\s*([^«»"“”]*\s[^«»"“”]*?)\s*[»"”]/;
  const MOTS_MIN_TROU=8;
  // La phrase citée n'a ni trou ni la réponse : l'enfant n'a rien à en faire.
  const phraseInutile=(t,reponse)=>{const p=t.match(PHRASE);return !!p&&!/_{2,}/.test(t)&&CHOIX_MOT.test(t)&&!contient(p[1],sansDetail(reponse))};
  const REFUS_PHRASE="la phrase citée n'a ni trou ni la réponse : écrire une phrase avec ___ à la place du mot";
  function aTrou(t,reponse){
    const p=t.match(PHRASE),mot=String(reponse??'').trim();
    if(!p||/_{2,}/.test(t)||!CHOIX_MOT.test(t)||!contient(p[1],mot))return null;
    const m=propre(mot).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return `Complète la phrase : « ${p[1].trim().replace(new RegExp(`(?<![\\p{L}\\p{N}])${m}(?![\\p{L}\\p{N}])`,'iu'),'___')} »`;
  }

  // La voix ne sert qu'à faire écrire ce qu'on entend : en français, et en anglais.
  const LANGUES={francais:'fr-FR',anglais:'en-US'};
  const MOTS_MAX_ORAL=15;
  const CONSIGNE_ORALE='Écoute et écris ce que tu entends.';
  // Ces mots seuls se confondent à l'oreille avec un autre : il faut une phrase pour les distinguer.
  const HOMOPHONES=new Set("a à as et est es ai on ont son sont ou où ce se ces ses sais sait c'est s'est sa ça la là mes mais mets met leur leurs peu peut peux dans dent mer mère maire ver vert verre vers pain pin sang cent sans vingt vin fin faim sel selle cour cours court pair père paire voix voie foie fois foi toi toit".split(' '));
  // « ils mangent » s'entend comme « il mange » devant une consonne : l'écran doit préciser le nombre.
  const PRONOM_MUET=/(?<!\p{L})(ils|elles|il|elle)\s+(?=[bcdfgjklmnpqrstvwxz])/iu;
  function controlerOral(x,t,{matiere,voix}={}){
    const o=String(x.oral).trim(),langue=LANGUES[matiere];
    if(!voix)return {refus:"pas de voix pour lire : la question doit être écrite"};
    if(!langue)return {refus:"l'oral ne sert qu'en français et en anglais : la question doit être écrite"};
    if(x.type!=='courte')return {refus:"une question à écouter attend une réponse à écrire : type courte"};
    const reps=(Array.isArray(x.reponses)?x.reponses:[]).map(String).filter(Boolean);
    if(!reps.length)return {refus:'aucune réponse attendue'};
    if(o.split(/\s+/).length>MOTS_MAX_ORAL)return {refus:'le texte à lire est trop long : un mot ou une courte phrase'};
    const francais=langue==='fr-FR';
    if(francais&&!reps.some(r=>contient(o,sansDetail(r))))return {refus:"la réponse attendue n'est pas dans le texte lu"};
    if(francais&&HOMOPHONES.has(propre(o)))return {refus:"ce mot seul s'entend comme un autre : lire une petite phrase"};
    const montre=s=>contient(s,o)||reps.some(r=>propre(sansDetail(r)).length>1&&contient(s,sansDetail(r)));
    if(montre(t))t=CONSIGNE_ORALE;
    const pronom=francais&&o.match(PRONOM_MUET);
    if(pronom&&!/pluriel|singulier/i.test(t))t=`${t.replace(/[.?!\s]+$/,'')}, au ${/s$/i.test(pronom[1])?'pluriel':'singulier'}.`;
    return {question:{...x,question:t,oral:o,langue,reponses:reps,indice:x.indice&&!montre(x.indice)?x.indice:undefined}};
  }

  // « Quel mot est mal écrit ? » : le modèle pose souvent la question sur une phrase sans faute.
  // Il doit donc nommer le mot fautif (x.faute) tel qu'il est dans la phrase, et sa correction dans x.reponses.
  const CHERCHE_FAUTE=/(?<!\p{L})mots?(?!\p{L})[^.?!]*(?<!\p{L})(?:mal [ée]crits?|mal orthographi[ée]s?|fautes?|erreurs?)(?!\p{L})|(?<!\p{L})(?:fautes?|erreurs?) d['’]orthographe(?!\p{L})|(?<!\p{L})où est la faute(?!\p{L})/iu;
  const A_RECOPIER=/^(?:recopie|corrige|réécris|reecris)(?!\p{L})/iu;
  const REFUS_FAUTE=`pour faire trouver une faute : type courte, le mot fautif tel qu'il est écrit dans la phrase dans "faute", sa correction dans "reponses"`;
  function controlerFaute(x,t,{matiere}={}){
    if(matiere&&matiere!=='francais')return {refus:"l'orthographe ne compte qu'en français : poser une question sur la leçon"};
    const reps=(Array.isArray(x.reponses)?x.reponses:[]).map(String).filter(Boolean);
    if(A_RECOPIER.test(t))return reps.some(r=>contient(t,sansDetail(r)))?{refus:"la phrase contient déjà la réponse : il n'y a aucune faute à corriger"}:null;
    const faute=String(x.faute??'').trim(),corrige=reps.filter(r=>propre(r)!==propre(faute));
    if(x.type!=='courte'||!corrige.length||!contient(t,faute))return {refus:REFUS_FAUTE};
    return {question:{...x,question:t,reponses:[...corrige,faute]}};
  }

  // « Comment la légende t'aide-t-elle ? » → « En consultant la légende » : relire la question suffit.
  // En français et en anglais, retrouver un mot dans une phrase est souvent l'exercice lui-même.
  const MATIERES_SAVOIR=new Set(['maths','sciences','histoire','geographie','emc']);
  const MOTS_VIDES=new Set("les une des aux dans sur sous avec par pour grâce ce cet cette ces son ses mon mes ton tes elle ils elles nous vous est sont qui que quoi faut regarder regarde regardant lire lit lisant consulter consulte consultant utiliser utilise utilisant observer observe observant chercher cherche cherchant oui non vrai faux".split(' '));
  const motsCles=s=>(propre(sansDetail(s)).replace(/(?<!\p{L})en \p{L}+ant(?!\p{L})/gu,' ').match(/[\p{L}\p{N}]+/gu)||[]).filter(m=>m.length>2&&!MOTS_VIDES.has(m)).map(m=>m.replace(/[sx]$/,''));
  function reponseRepetee(x,t,{matiere}={}){
    if(!MATIERES_SAVOIR.has(matiere))return false;
    const lus=new Set(motsCles(t));
    const repete=r=>{const m=motsCles(r);return !/\d/.test(r)&&m.length>0&&m.every(w=>lus.has(w))};
    if(x.type==='courte'){
      const reps=(Array.isArray(x.reponses)?x.reponses:[]).map(String).filter(Boolean);
      return reps.length>0&&reps.every(repete);
    }
    if(x.type!=='qcm'||!Array.isArray(x.choix))return false;
    const bonne=Number(x.bonne),autres=x.choix.filter((_,i)=>i!==bonne);
    // Une question qui nomme les choix (« une légende et une échelle ») peut en nommer plusieurs : là, il faut réfléchir.
    return repete(String(x.choix[bonne]??''))&&autres.filter(c=>repete(String(c))).length*2<autres.length;
  }

  function controlerVf(x,t){
    const bonne=x.bonne===true||x.bonne==='true'||x.bonne==='vrai';
    if(CONSIGNE.test(t))return {refus:"c'est une consigne, pas une affirmation à juger vrai ou faux"};
    if(!/\?\s*$/.test(t))return {question:{...x,question:t}};
    if(OUVERTE.test(t)||/\bou\b/.test(t))return {refus:"une question à choix entre deux mots a été mise en vrai/faux : il fallait un qcm"};
    return {question:ouiNon(t,bonne,x)};
  }
  function controlerCourte(x,t,ctx){
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
      if(j.length===1)return controlerQcm({...x,type:'qcm',choix:opts,bonne:j[0],reponses:undefined,calcul:undefined},t);
    }
    if(phraseInutile(t,reps[0]))return {refus:REFUS_PHRASE};
    const trou=aTrou(t,sansDetail(reps[0]));
    if(trou)return {question:{...x,question:trou,reponses:reps}};
    const affichees=reps.map(sansDetail).filter(r=>propre(r).length>1&&contient(t,r)).sort((a,b)=>b.length-a.length);
    if(ORTHOGRAPHE.test(t)&&affichees.length){
      if(ctx.voix&&LANGUES[ctx.matiere])return controlerOral({...x,oral:affichees[0]},t,ctx);
      return {refus:"le mot à écrire est déjà affiché dans la question : proposer plutôt une phrase à trou en qcm"};
    }
    if(PLUSIEURS.test(t))return {refus:'la question demande plusieurs réponses : une seule chose à la fois'};
    return {question:{...x,question:t,reponses:reps}};
  }
  function controlerQcm(x,t){
    const bonne=Number(x.bonne),vus=new Map();
    (Array.isArray(x.choix)?x.choix:[]).forEach((c,i)=>{const k=propre(c);if(!vus.has(k)||i===bonne)vus.set(k,{t:String(c),ok:i===bonne||vus.get(k)?.ok})});
    let ch=[...vus.values()];
    if(ch.length<2||!ch.some(c=>c.ok))return {refus:'les choix du qcm sont incomplets'};
    t=t.replace(JUSTIFIER,'').replace(/\?\s*\.$/,'?').trim();
    // Si la question nomme les mots à départager, les boutons sont ces mots-là, et rien d'autre.
    const nommes=CHOIX_MOT.test(t)?optionsDansTexte(t):null;
    if(nommes){
      const bon=ch.find(c=>c.ok);
      if(!nommes.includes(propre(bon.t)))return {refus:'la bonne réponse ne fait pas partie des mots nommés dans la question'};
      ch=[...new Set(nommes)].map(n=>propre(bon.t)===n?bon:{t:n,ok:false});
    }
    const b=ch.findIndex(c=>c.ok);
    if(phraseInutile(t,ch[b].t))return {refus:REFUS_PHRASE};
    return {question:{...x,question:aTrou(t,ch[b].t)||t,choix:ch.map(c=>c.t),bonne:b}};
  }
  function controlerQuestion(x,ctx={}){
    let t=String(x.question??'').trim();
    if(!t)return {refus:'question vide'};
    t=t.replace(/^(?:vrai ou faux|vrai\/faux)\s*[:?.]\s*/i,'').replace(PIEGE,'').trim();
    const oral=String(x.oral??'').trim();
    if(!oral&&ORAL.test(t))return {refus:"rien n'est lu à voix haute : il faut le texte à lire dans \"oral\", ou une question écrite"};
    if(BAVARDAGE.test(t))return {refus:'la question parle de ce qui a été fait avant'};
    if(IMAGE_ABSENTE.test(t))return {refus:"aucune image n'est affichée : décrire avec des mots ce qu'on voit (« Sur une photo de campagne, on voit… »)"};
    if(/soulign/i.test(t)&&!/<u>/i.test(t))return {refus:'il est question d\'un mot souligné, mais rien n\'est souligné'};
    const cite=t.match(/phrase\s*:?\s*[«"“]([^»"”]+)[»"”][^«»"“”]{0,30}\bmot\s+[«"“'‘]\s*([^»"”'’]+?)\s*[»"”'’]/i);
    if(cite&&!contient(cite[1],cite[2]))return {refus:'le mot dont parle la question n\'est pas dans la phrase citée'};
    if(oral)return controlerOral(x,t,ctx);
    x={...x,oral:undefined};
    if(CHERCHE_FAUTE.test(t)){const f=controlerFaute(x,t,ctx);if(f)return f}
    // En français, passé le premier niveau, une phrase à trou de 4 mots ne fait pas réfléchir.
    if(ctx.matiere==='francais'&&Number(x.difficulte)>=2&&/_{2,}/.test(t)&&(t.match(PHRASE)?.[1]??t).trim().split(/\s+/).length<MOTS_MIN_TROU)return {refus:`phrase à trou trop simple : au moins ${MOTS_MIN_TROU} mots, avec un vrai contexte`};
    if(reponseRepetee(x,t,ctx))return {refus:'la bonne réponse répète les mots de la question : demander quelque chose qui ne se devine pas en la relisant'};
    if(x.type==='vf')return controlerVf(x,t);
    if(x.type==='courte')return controlerCourte(x,t,ctx);
    if(x.type==='qcm')return controlerQcm(x,t);
    return {refus:'type de question inconnu'};
  }
  // Textes déjà passés par norm() : « tu as » et « as » valent la même réponse, pas « il as » et « tu as ».
  const sansPronom=s=>s.replace(/^(je|j|tu|il|elle|on|nous|vous|ils|elles) (?=\S)/,'');
  const memeReponse=(rep,attendu)=>!!rep&&!!attendu&&(rep===attendu||rep===sansPronom(attendu)||sansPronom(rep)===attendu);
  // À l'oreille, ces mots ne se distinguent pas : lire la phrase complète ne donne pas la réponse.
  const SONS=["a à as","et est es ai","ou où","son sont","on ont","ce se","ces ses c'est s'est sait sais","mes mais met mets","la là l'a","leur leurs","peu peut peux","sa ça","ma m'a","ta t'a","mon m'ont","ton t'ont","ni n'y","si s'y","dans d'en","quand quant qu'en"].map(g=>g.split(' '));
  const groupeSon=m=>SONS.find(g=>g.includes(propre(m)));
  // Le texte de la consigne pour la voix. Le trou est lu avec le bon mot s'il se confond à l'oreille avec un autre choix ;
  // sinon, le dire donnerait la réponse : la voix marque une pause.
  function texteAEcouter(x){
    const t=String(x.question??'').replace(/<[^>]+>/g,'').replace(/\*+/g,'').replace(/[«»"“”]/g,'').replace(/\s+/g,' ').trim();
    const trous=t.match(/_{2,}/g)||[];
    if(!trous.length)return t;
    const qcm=x.type==='qcm',bon=sansDetail(qcm?x.choix?.[x.bonne]:x.reponses?.[0]),g=groupeSon(bon);
    const sansRisque=!!g&&(!qcm||x.choix.some((c,i)=>i!==x.bonne&&g.includes(propre(c))));
    return t.replace(/_{2,}/g,trous.length===1&&sansRisque?bon:'…');
  }
  // En maths, le modèle se trompe parfois en écrivant la question, mais retrouve la bonne réponse
  // quand on lui donne l'exercice seul : on compare les deux, sans lui montrer la réponse proposée.
  const enChoix=x=>x.type==='vf'?{choix:['Vrai','Faux'],bonne:x.bonne?0:1}:x;
  function promptResolution(x){
    const choix=x.type==='courte'?null:enChoix(x).choix;
    return `Résous cet exercice de mathématiques de CM1, pas à pas, sans te presser.

${x.question}${choix?`\nChoix : ${choix.join(' ; ')}`:''}

Réponds uniquement en JSON : {"raisonnement":"...","resultat":"le nombre trouvé"${choix?',"choix":"le choix exact"':''}}`;
  }
  const nombres=s=>(String(s??'').match(/\d(?:[\d ]*\d)?(?:[.,]\d+)?/g)||[]).map(n=>Number(n.replace(/ /g,'').replace(',','.')));
  const memesNombres=(a,b)=>a.length===b.length&&a.every((n,i)=>Math.abs(n-b[i])<1e-6);
  // true : même réponse ; false : réponse différente ; null : impossible à comparer, la question n'est pas jugée.
  function accordResolution(x,r){
    if(!r||typeof r!=='object')return null;
    const vus=nombres(r.resultat);
    if(x.type==='courte'){
      const attendus=(x.reponses||[]).map(nombres).filter(n=>n.length);
      return vus.length&&attendus.length?attendus.some(n=>memesNombres(n,vus)):null;
    }
    const {choix,bonne}=enChoix(x),j=choix.findIndex(c=>propre(c)===propre(r.choix));
    if(j>=0)return j===bonne;
    const attendu=nombres(choix[bonne]);
    return vus.length&&attendu.length?memesNombres(attendu,vus):null;
  }
  // Ce que dit le badge du coin sur le quiz en cours : null s'il n'y a rien à montrer.
  function etatBadgeQuiz(q){
    if(!q||q.fini)return null;
    const k=q.questions.length,commence=!q.attente||q.rep.length>0,echec=!q.gen&&!!q.genErr;
    if(q.err||(echec&&k<=q.i))return {ico:'⚠️',texte:'Quiz : un souci, appuie ici',ton:'souci'};
    if(commence)return k>q.i?{ico:'▶️',texte:`Reprendre mon quiz (question ${q.i+1}/${q.n})`,ton:'pret'}:{ico:'⏳',texte:`Question ${q.i+1}/${q.n} en préparation…`,ton:'attente'};
    if(!k)return {ico:'⏳',texte:'Je prépare ton quiz…',ton:'attente'};
    if(k>=q.n||echec)return {ico:'✅',texte:'Ton quiz est prêt !',ton:'pret'};
    return {ico:'⏳',texte:`Quiz : ${k}/${q.n} prêtes`,ton:'attente'};
  }
  global.etatBadgeQuiz=etatBadgeQuiz;
  global.promptResolution=promptResolution;
  global.accordResolution=accordResolution;
  global.controlerQuestion=controlerQuestion;
  global.memeReponse=memeReponse;
  global.texteAEcouter=texteAEcouter;
  // Pour une dictée, l'orthographe est ce qu'on vérifie : les accents comptent, pas la majuscule ni le point.
  global.memeEcriture=(rep,attendu)=>memeReponse(propre(rep),propre(sansDetail(attendu)));
  global.LANGUES_ORAL=LANGUES;
})(globalThis);
