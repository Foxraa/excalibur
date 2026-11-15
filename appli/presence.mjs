// Arrêt du cartable quand sa fenêtre est fermée. Chaque page ouverte garde une connexion /api/presence ;
// quand il n'en reste aucune pendant `delai` (le temps de recharger la page), on appelle quandVide.
// Au démarrage, la fenêtre a `delaiDemarrage` pour se connecter (si elle est fermée avant, le serveur s'arrête aussi).
export function creerPresence({ delai = 15e3, delaiDemarrage = 3 * 60e3, quandVide, minuteur = setTimeout, annuler = clearTimeout }) {
  let n = 0, t = null;
  const armer = ms => { annuler(t); t = minuteur(() => { t = null; if (n === 0) quandVide(); }, ms); };
  armer(delaiDemarrage);
  return {
    entre() { n++; annuler(t); t = null; },
    sort() { n = Math.max(0, n - 1); if (n === 0) armer(delai); },
    get pages() { return n; },
  };
}
