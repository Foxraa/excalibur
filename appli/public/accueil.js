/* Règles d'affichage de l'accueil allégé : libellés courts des boutons et ouverture des défis éclair.
   Les défis restent repliés tant que la mission n'est pas faite ; le choix de l'enfant, s'il existe, l'emporte. */
(function(global){
  const LIBELLES={agenda:"📒 Agenda",devoirs:"✏️ Devoirs",relire:"📖 Leçon",cartable:"🎒 Cartable"};
  const libelleCourt=id=>LIBELLES[id]??id;
  // Un choix explicite (true ou false) gagne sur l'état de la mission ; sans choix, c'est la mission qui décide.
  const defisOuverts=({missionFaite,choix})=>typeof choix==="boolean"?choix:!!missionFaite;

  Object.assign(global,{libelleCourt,defisOuverts});
})(globalThis);
