/* Une fiche prise en photo : est-elle déjà dans le cartable, et est-elle remplie ?
   etatFiche(exercices) dit combien de questions ont une réponse écrite.
   dejaRangee(lecon, empreintes, lecons) cherche la même fiche parmi les leçons rangées :
   d'abord la même photo (empreinte du fichier, ou miniature identique pour les leçons d'avant),
   puis le même contenu (mêmes énoncés d'exercices, ou même titre quand il n'y a pas d'exercices). */
(function(global){
  const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9,.]+/g,' ').replace(/\b(le|la|les|l|un|une|des|du|de|d)\b/g,' ').replace(/\s+/g,' ').trim();
  // Ce que l'IA écrit parfois à la place d'une réponse absente.
  const SANS_REPONSE=/^[\s(«"-]*(rien|vide|aucune?|non (fait|rempli|repondu)e?|pas (fait|rempli|de reponse|repondu)e?|neant|\?+|-+|…|\.\.\.)[\s)»".!]*$/i;
  const repondu=x=>{const r=String(x&&x.reponseEleve||'').trim();return !!r&&!SANS_REPONSE.test(norm(r)||r)};

  function etatFiche(exercices){
    const ex=Array.isArray(exercices)?exercices:[];if(!ex.length)return null;
    const faites=ex.filter(repondu).length;
    return {total:ex.length,faites,etat:faites===0?'vierge':faites===ex.length?'complete':'partielle'};
  }

  const mots=s=>new Set(norm(s).split(' ').filter(w=>w.length>2));
  const recouvre=(A,B)=>{if(!A.size||!B.size)return 0;let n=0;A.forEach(w=>{if(B.has(w))n++});return n/Math.min(A.size,B.size)};
  const enonces=ex=>new Set((Array.isArray(ex)?ex:[]).map(x=>norm(x&&x.enonce)).filter(Boolean));

  function dejaRangee(lecon,empreintes,lecons){
    const fp=new Set((empreintes||[]).filter(Boolean));
    const L=(lecons||[]).filter(x=>x&&x.id);
    if(fp.size){const m=L.find(x=>[...(x.empreintes||[]),...(x.thumbs||[])].some(f=>fp.has(f)));if(m)return {lecon:m,par:'photo'}}
    if(!lecon)return null;
    const exN=enonces(lecon.exercices),titre=norm(lecon.titre),motsT=mots(lecon.titre);
    let mieux=null,score=0;
    for(const x of L){
      if(x.matiere!==lecon.matiere)continue;
      const exA=enonces(x.exercices);let s=0;
      // Deux fiches d'exercices : seuls les énoncés comptent (deux fiches sur les fractions ne sont pas la même fiche).
      if(exN.size>=2&&exA.size>=2)s=recouvre(exN,exA)>=.6?recouvre(exN,exA):0;
      else if(!exN.size&&!exA.size&&titre)s=norm(x.titre)===titre?1:recouvre(motsT,mots(x.titre))>=.8&&motsT.size>=2?.8:0;
      if(s>score){score=s;mieux=x}
    }
    return mieux?{lecon:mieux,par:'contenu'}:null;
  }

  global.etatFiche=etatFiche;
  global.dejaRangee=dejaRangee;
})(globalThis);
