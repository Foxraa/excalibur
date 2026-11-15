// Coût des requêtes IA, jour par jour, calculé à partir de data/consommation.log (une ligne par appel payant).
// Prix publics en dollars US par million de jetons (lus, écrits), ou par page pour l'OCR. À mettre à jour si les tarifs changent.
export const PRIX = {
  "claude-sonnet-5-5": { lu: 2, ecrit: 10 },
  "claude-haiku-5-5": { lu: 0.1, ecrit: 0.5 },
  "claude-opus-5-5": { lu: 4, ecrit: 20 },
  "mistral-small-latest": { lu: 0.1, ecrit: 0.3 },
  "mistral-large-latest": { lu: 0.5, ecrit: 1.5 },
  "mistral-ocr-latest": { page: 0.002 },
};

// « 15/11/2026 10:57:45  Mistral mistral-large-latest (juge) : 180 jetons lus, 1458 écrits »
// « 10/11/2026 22:52:54  Mistral OCR mistral-ocr-latest : 4 pages lues »
const LIGNE = /^(\d{2})\/(\d{2})\/(\d{4}) [\d:]+\s+(?:Claude|Mistral)(?: OCR)? (\S+)[^:]*: (?:(\d+|\?) jetons lus, (\d+|\?) écrits|(\d+) pages? lues?)/;

// Renvoie les jours du plus récent au plus ancien : { jour: "2026-11-15", requetes, cout, modeles: { nom: { requetes, cout } } }.
// Un modèle sans prix connu compte dans les requêtes mais pas dans le coût (inconnu: true).
export function coutsParJour(texte) {
  const jours = new Map();
  for (const ligne of String(texte).split(/\r?\n/)) {
    const m = ligne.match(LIGNE);
    if (!m) continue;
    const [, jj, mm, aaaa, modele, lus, ecrits, pages] = m;
    const prix = PRIX[modele];
    let cout = null;
    if (prix && pages != null) cout = Number(pages) * (prix.page || 0);
    else if (prix && prix.lu != null) cout = ((Number(lus) || 0) * prix.lu + (Number(ecrits) || 0) * prix.ecrit) / 1e6;
    const jour = `${aaaa}-${mm}-${jj}`;
    const j = jours.get(jour) || { jour, requetes: 0, cout: 0, inconnu: false, modeles: {} };
    const parModele = j.modeles[modele] || (j.modeles[modele] = { requetes: 0, cout: 0 });
    j.requetes++; parModele.requetes++;
    if (cout == null) j.inconnu = parModele.inconnu = true;
    else { j.cout += cout; parModele.cout += cout; }
    jours.set(jour, j);
  }
  return [...jours.values()].sort((a, b) => b.jour.localeCompare(a.jour));
}
