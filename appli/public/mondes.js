/* Le calendrier des mondes : Excalibur est ouvert dès le départ, puis un nouveau monde s'ouvre toutes les 3 à 4 semaines,
   jusqu'au dernier à la mi-mai 2027 (six mois). Pour changer l'ordre ou les dates, il suffit de modifier cette liste.
   Un monde déjà choisi reste utilisable, même s'il n'est pas encore ouvert dans ce calendrier. */
(function(global){
  const CALENDRIER_MONDES={
    excalibur:'2026-11-15',
    manga:'2026-12-06',
    fee:'2027-01-01',
    dino:'2027-01-27',
    galaxie:'2027-02-22',
    dresseur:'2027-03-20',
    champignon:'2027-04-15',
    sorcier:'2027-05-11'
  };
  // jour au format AAAA-MM-JJ (date locale) ; un monde absent du calendrier est ouvert.
  const mondeOuvert=(id,jour)=>!CALENDRIER_MONDES[id]||CALENDRIER_MONDES[id]<=jour;
  // Le prochain monde à s'ouvrir après ce jour, ou null s'ils sont tous ouverts.
  const prochainMonde=jour=>{
    const e=Object.entries(CALENDRIER_MONDES).filter(([,d])=>d>jour).sort((a,b)=>a[1]<b[1]?-1:1)[0];
    return e?{id:e[0],date:e[1]}:null;
  };
  Object.assign(global,{CALENDRIER_MONDES,mondeOuvert,prochainMonde});
})(typeof window!=='undefined'?window:globalThis);
