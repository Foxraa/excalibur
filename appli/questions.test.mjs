// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/questions.js";

const { controlerQuestion: c, memeReponse, memeEcriture } = globalThis;
const vf = (question, bonne = true) => c({ type: "vf", question, bonne });
const courte = (question, ...reponses) => c({ type: "courte", question, reponses });

test("un vrai/faux qui propose deux mots est refusé", () => {
  assert.ok(vf("Dans la phrase « Nous allons à la plage », le mot « à » est-il un verbe ou une préposition ?").refus);
  assert.ok(vf("Le total sera plus proche de 4 € ou de 5 € ?").refus);
  assert.ok(vf("Quels sont les deux mots qui riment ?").refus);
  assert.ok(vf("Trouve deux mots de la même famille.").refus);
});

test("un vrai/faux normal passe, sans « Vrai ou faux : » au début", () => {
  assert.equal(vf("Vrai ou faux : Un carré a quatre côtés.").question.question, "Un carré a quatre côtés.");
  assert.equal(vf("Le mot « à » est ici une préposition.").question.type, "vf");
});

test("une question en oui ou non reçoit les boutons Oui et Non", () => {
  const r = vf("Est-ce qu'un carré a quatre côtés ?", false).question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["Oui", "Non"], 1]);
  const s = courte("Cette figure est-elle un carré ? Réponds par oui ou non.", "oui").question;
  assert.deepEqual([s.type, s.question, s.bonne], ["qcm", "Cette figure est-elle un carré ?", 0]);
});

test("sans texte à lire, rien ne fait croire à une dictée", () => {
  assert.ok(courte("Écoute bien la phrase et écris-la.", "chat").refus);
  assert.ok(courte("Écris le mot que tu entends.", "chat").refus);
  assert.ok(c({ type: "qcm", question: "Dictée : quel mot est bien écrit ?", choix: ["a", "b"], bonne: 0 }).refus);
  assert.equal(vf("Pour dire « Écoutez » en anglais, on dit « Listen ».").question.type, "vf");
});

const OK = { matiere: "francais", voix: true };
const orale = (question, oral, reponses, ctx = OK, reste = {}) => c({ type: "courte", question, oral, reponses, ...reste }, ctx);

test("une question orale bien faite passe, en français avec la voix française", () => {
  const r = orale("Écoute et écris le verbe.", "Les enfants mangent une pomme.", ["mangent"]).question;
  assert.deepEqual([r.type, r.oral, r.langue], ["courte", "Les enfants mangent une pomme.", "fr-FR"]);
});

test("en anglais, la voix est anglaise et la réponse peut être une traduction", () => {
  const r = orale("Écoute et écris le mot en français.", "apple", ["pomme"], { matiere: "anglais", voix: true }).question;
  assert.deepEqual([r.oral, r.langue, r.reponses], ["apple", "en-US", ["pomme"]]);
});

test("pas d'oral là où il ne sert à rien, ni sans voix", () => {
  assert.ok(orale("Écoute et écris.", "douze", ["12"], { matiere: "maths", voix: true }).refus);
  assert.ok(orale("Écoute et écris.", "les enfants", ["enfants"], { matiere: "francais", voix: false }).refus);
  assert.ok(orale("Écoute et écris.", "les enfants", ["enfants"], {}).refus);
  assert.ok(c({ type: "qcm", question: "Écoute et choisis.", oral: "chat", choix: ["a", "b"], bonne: 0 }, OK).refus);
});

test("en français, la réponse doit être dans ce qui est lu", () => {
  assert.ok(orale("Écoute et écris le verbe.", "Les enfants jouent.", ["mangent"]).refus);
});

test("le texte lu est court", () => {
  const long = "un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize";
  assert.ok(orale("Écoute et écris.", long, [long]).refus);
  assert.ok(orale("Écoute et écris.", "   ", ["chat"]).refus);
});

test("ce qui est lu n'est jamais affiché, ni dans la question ni dans l'indice", () => {
  const r = orale("Écris : les enfants mangent.", "les enfants mangent", ["les enfants mangent"], OK, { indice: "On écrit les enfants mangent." }).question;
  assert.doesNotMatch(r.question, /mangent/);
  assert.equal(r.indice, undefined);
  const s = orale("Écoute et écris.", "le chat dort", ["le chat dort"], OK, { indice: "Pense au verbe." }).question;
  assert.equal(s.indice, "Pense au verbe.");
});

test("il et ils s'entendent pareil : le nombre est précisé à l'écran", () => {
  assert.match(orale("Écoute et écris.", "ils mangent", ["ils mangent"]).question.question, /au pluriel/);
  assert.match(orale("Écoute et écris.", "elle chante", ["elle chante"]).question.question, /au singulier/);
  assert.doesNotMatch(orale("Écoute et écris.", "ils arrivent", ["ils arrivent"]).question.question, /pluriel/);
  assert.doesNotMatch(orale("Écoute et écris.", "tu chantes", ["tu chantes"]).question.question, /pluriel|singulier/);
  assert.doesNotMatch(orale("Écoute et écris.", "Les enfants mangent.", ["mangent"]).question.question, /pluriel/);
  assert.equal(orale("Écris au pluriel.", "ils mangent", ["ils mangent"]).question.question.match(/pluriel/g).length, 1);
});

test("un mot seul qui se prononce comme un autre est refusé", () => {
  assert.ok(orale("Écoute et écris.", "à", ["à"]).refus);
  assert.ok(orale("Écoute et écris.", "ces", ["ces"]).refus);
  assert.ok(orale("Écoute et écris.", "mer", ["mer"]).refus);
  assert.ok(orale("Écoute et écris.", "Ces chats dorment.", ["Ces chats dorment."]).question);
});

test("une question qui affiche le mot à écrire devient une question orale", () => {
  const r = c({ type: "courte", question: "Comment écrit-on ils mangent ?", reponses: ["ils mangent"] }, OK).question;
  assert.equal(r.oral, "ils mangent");
  assert.doesNotMatch(r.question, /mangent/);
  assert.match(r.question, /au pluriel/);
  const s = c({ type: "courte", question: "Quel est l'orthographe du mot « maison » ?", reponses: ["maison"] }, OK).question;
  assert.equal(s.oral, "maison");
});

test("sans voix, ou hors français et anglais, cette question reste refusée", () => {
  const x = { type: "courte", question: "Comment écrit-on ils mangent ?", reponses: ["ils mangent"] };
  assert.ok(c(x).refus);
  assert.ok(c(x, { matiere: "francais", voix: false }).refus);
  assert.ok(c(x, { matiere: "maths", voix: true }).refus);
});

test("un choix entre mots tapé à la main devient un QCM", () => {
  const r = courte("Dans la phrase : « Le chat ___ faim », dois-tu écrire « a » ou « à » ? Explique ton choix en remplaçant le mot.", "a", "a (car on peut dire avait)").question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["a", "à"], 0]);
  assert.doesNotMatch(r.question, /Explique/);
  const s = courte("Quel homophone faut-il choisir : ses, ces ou c'est ?", "ces").question;
  assert.deepEqual([s.type, s.choix, s.bonne], ["qcm", ["ses", "ces", "c'est"], 1]);
});

test("« Complète avec a ou à » devient un QCM", () => {
  const r = courte("Complète avec a ou à : La maîtresse donne le livre ___ Lucas.", "à").question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["a", "à"], 1]);
});

test("le mot cité doit être dans la phrase citée", () => {
  assert.ok(vf("Dans la phrase « Mon frère est intelligent », le mot 'son' est un déterminant.").refus);
  assert.equal(vf("Dans la phrase « Il est grand et fort », le mot 'et' lie deux idées.").question.type, "vf");
});

test("le mot à trouver n'est pas sous les yeux : la phrase devient une phrase à trou", () => {
  const r = c({ type: "qcm", question: 'Dans la phrase "Mon papa a un chien", quel mot est le bon entre "a" (sans accent) et "à" (avec accent) ?', choix: ["mes", "et", "à", "a"], bonne: 3 }).question;
  assert.equal(r.question, "Complète la phrase : « Mon papa ___ un chien »");
  assert.deepEqual([r.choix, r.choix[r.bonne]], [["a", "à"], "a"]);
  const s = courte("Dans la phrase « Il va à Paris », quel mot est le bon ?", "à").question;
  assert.equal(s.question, "Complète la phrase : « Il va ___ Paris »");
});

test("une question de grammaire garde sa phrase", () => {
  const q = "Dans la phrase « Le chat dort », quel mot est le verbe ?";
  assert.equal(c({ type: "qcm", question: q, choix: ["chat", "dort"], bonne: 1 }).question.question, q);
});

test("une phrase sans trou ni réponse est refusée", () => {
  assert.ok(c({ type: "qcm", question: "Dans la phrase : « Les dessins sont magnifiques », quel mot faut-il choisir entre « est » (verbe être) et « et » (conjonction) ?", choix: ["est", "et"], bonne: 0 }).refus);
  assert.ok(courte("Dans la phrase « Les dessins sont magnifiques », quel mot faut-il choisir ?", "est").refus);
});

test("en français, une phrase à trou trop courte ne passe qu'au premier niveau", () => {
  const q = (question, difficulte) => c({ type: "qcm", question, choix: ["a", "à"], bonne: 0, difficulte }, { matiere: "francais" });
  assert.ok(q("Complète la phrase : « Le chien ___ faim »", 1).question);
  assert.ok(q("Complète la phrase : « Le chien ___ faim »", 2).refus);
  assert.ok(q("Complète : « Pendant les vacances, ma cousine ___ appris le piano toute seule. »", 2).question);
});

test("la bonne réponse doit être parmi les mots nommés", () => {
  assert.ok(c({ type: "qcm", question: "Quel mot est le bon : « a » ou « à » ?", choix: ["a", "à", "et"], bonne: 2 }).refus);
});

test("le mot à écrire ne doit pas être déjà affiché", () => {
  assert.ok(courte("Quel est le mot exact à écrire pour dire « J'ai faim » ? Écris le verbe conjugué.", "j'ai").refus);
  assert.equal(courte("Dans « Les nouveaux exercices », quel mot est un adjectif ?", "nouveaux").question.type, "courte");
});

test("une réponse courte ne demande qu'une chose", () => {
  assert.ok(courte("Donne-moi trois exemples de choses qui sont de l'eau.", "glace").refus);
  assert.ok(courte("Quels sont les quatre éléments d'une carte ?", "titre").refus);
  assert.equal(courte("Recopie la phrase en corrigeant les deux mots mal écrits : « Au debu, un reve. »", "Au début, un rêve.").question.type, "courte");
  assert.equal(courte("Calcule 12 × 3.", "36").question.type, "courte");
});

test("pas de bavardage ni de piège annoncé", () => {
  assert.ok(courte("Tu t'es trompé sur ce verbe. Conjugue finir avec nous.", "finissons").refus);
  assert.equal(courte("Conjugue finir avec nous. (Attention, il y a un piège.)", "finissons").question.question, "Conjugue finir avec nous.");
});

test("un mot souligné doit vraiment l'être", () => {
  assert.ok(c({ type: "qcm", question: "Remplace le mot souligné.", choix: ["a", "b"], bonne: 0 }).refus);
  assert.ok(c({ type: "qcm", question: "Quel est le mot souligné dans « Il <u>part</u> » ?", choix: ["a", "b"], bonne: 0 }).question);
});

test("les choix en double d'un QCM disparaissent, la bonne réponse reste", () => {
  const r = c({ type: "qcm", question: "Quel mot ?", choix: ["ces", "ses", "ses", "son"], bonne: 2 }).question;
  assert.deepEqual(r.choix, ["ces", "ses", "son"]);
  assert.equal(r.choix[r.bonne], "ses");
  assert.ok(c({ type: "qcm", question: "Quel mot ?", choix: ["ses", "ses"], bonne: 0 }).refus);
});

test("le pronom ne fait pas échouer une réponse", () => {
  assert.ok(memeReponse("tu as", "as"));
  assert.ok(memeReponse("as", "tu as"));
  assert.ok(memeReponse("prends", "je prends"));
  assert.ok(memeReponse("ai", "j ai"));
  assert.ok(!memeReponse("il as", "tu as"));
  assert.ok(!memeReponse("elle", "il"));
  assert.ok(!memeReponse("a", "tu as"));
});

test("une dictée compte l'orthographe, pas la majuscule ni le point", () => {
  assert.ok(memeEcriture("La mère.", "la mère"));
  assert.ok(memeEcriture("ils mangent", "mangent"));
  assert.ok(!memeEcriture("la mere", "la mère"));
  assert.ok(!memeEcriture("ils mange", "ils mangent"));
});
