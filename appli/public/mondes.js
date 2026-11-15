/* Les mondes s'ouvrent avec les étoiles gagnées depuis le début (celles dépensées au trésor comptent aussi :
   un monde ouvert ne se referme jamais). Excalibur est ouvert d'emblée, puis un nouveau monde tous les 1 500 étoiles.
   Réglage de novembre 2026 : environ 420 étoiles par semaine, soit le dernier monde en six mois environ.
   Pour changer l'ordre ou les seuils, il suffit de modifier cette liste.
   Un monde déjà choisi reste utilisable, même s'il n'est pas encore ouvert. */
(function(global){
  const SEUILS_MONDES={
    excalibur:0,
    gotham:2000,
    dresseur:3000,
    fee:4500,
    dino:6000,
    galaxie:7500,
    manga:9000,
    champignon:10500,
    sorcier:12000
  };
  // Un monde absent de la liste est ouvert.
  const mondeOuvert=(id,etoiles)=>!(id in SEUILS_MONDES)||SEUILS_MONDES[id]<=etoiles;
  // Le prochain monde à s'ouvrir, avec son seuil, ou null s'ils sont tous ouverts.
  const prochainMonde=etoiles=>{
    const e=Object.entries(SEUILS_MONDES).filter(([,s])=>s>etoiles).sort((a,b)=>a[1]-b[1])[0];
    return e?{id:e[0],seuil:e[1]}:null;
  };
  Object.assign(global,{SEUILS_MONDES,mondeOuvert,prochainMonde});
})(typeof window!=='undefined'?window:globalThis);
