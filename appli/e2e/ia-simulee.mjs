// IA simulée pour le test du parcours : le navigateur ne parle jamais au serveur pour /api/sample.
// Elle répond au même format que le serveur (NDJSON : un morceau de texte, puis « done »),
// avec des questions Vrai/Faux fixes dont la bonne réponse est toujours « Vrai ».
let numero = 0;
const inconnus = [];

function reponseIA(prompt) {
  if (prompt.includes('{"questions":[')) {
    numero++;
    return { questions: [{ type: "vf", question: `Le nombre ${numero} vient avant le nombre ${numero + 1}.`, bonne: true,
      explication: "On compte dans l'ordre : chaque nombre vient avant le suivant.", indice: "Compte dans l'ordre.", difficulte: 1 }] };
  }
  if (prompt.includes('"liens"')) return { liens: [] };
  if (prompt.includes('"correct"')) return { correct: true, commentaire: "Bien vu." };
  inconnus.push(prompt.slice(0, 160));
  return {};
}

export async function simulerIA(page) {
  await page.route("**/api/sample", async route => {
    const { prompt = "" } = route.request().postDataJSON() || {};
    const texte = JSON.stringify(reponseIA(prompt));
    await route.fulfill({ status: 200, contentType: "application/x-ndjson",
      body: JSON.stringify({ t: "text", text: texte }) + "\n" + JSON.stringify({ t: "done" }) + "\n" });
  });
  return { inconnus };
}
