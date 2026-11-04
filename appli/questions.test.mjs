// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/questions.js";

const { controlerQuestion: c, memeReponse } = globalThis;
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

test("rien ne fait croire à une dictée", () => {
  assert.ok(courte("Écoute bien la phrase et écris-la.", "chat").refus);
  assert.ok(courte("Écris le mot que tu entends.", "chat").refus);
  assert.ok(c({ type: "qcm", question: "Dictée : quel mot est bien écrit ?", choix: ["a", "b"], bonne: 0 }).refus);
  assert.equal(vf("Pour dire « Écoutez » en anglais, on dit « Listen ».").question.type, "vf");
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
