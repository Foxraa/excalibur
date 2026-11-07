// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/epee.js";

const { COULEURS_EPEE, tempsQuestion, noteDuJour, conseilEpee, nomEpee } = globalThis;
const J = "2026-11-07";
let n = 0;
const q = (score, total, o = {}) => ({ score, total, duree: 300, date: J, createdAt: n++, termine: true, leconIds: ["l" + n], niveau: "normal", ...o });
const couleur = (liste) => noteDuJour(liste, J)?.couleur;

test("les cinq couleurs de l'épée", () => {
  assert.deepEqual(COULEURS_EPEE.map(c => c.id), ["rouge", "orange", "jaune", "vert", "bleu"]);
  assert.equal(COULEURS_EPEE[3].nomF, "verte");
  assert.equal(COULEURS_EPEE[4].c, "#228be6");
});

test("aucun quiz : pas de note", () => assert.equal(noteDuJour([], J), null));
test("moins de 3 réponses : rouge", () => assert.equal(couleur([q(2, 2)]), "rouge"));
test("quiz bâclé : rouge", () => assert.equal(couleur([q(2, 12, { duree: 84 })]), "rouge"));
test("rapide mais juste, trop court : jaune", () => assert.equal(couleur([q(12, 12, { duree: 48, defi: true })]), "jaune"));
test("60 % à 10 s par question n'est pas bâclé : jaune", () => assert.equal(couleur([q(6, 10, { duree: 100 })]), "jaune"));
test("40 % à 11 s par question est bâclé : rouge", () => assert.equal(couleur([q(4, 10, { duree: 110 })]), "rouge"));
test("peu de réussite : orange", () => assert.equal(couleur([q(3, 10)]), "orange"));
test("assez juste mais bien en dessous de 85 % : jaune", () => assert.equal(couleur([q(6, 10, { duree: 900 })]), "jaune"));
test("juste mais moins de 15 minutes : jaune", () => assert.equal(couleur([q(9, 10)]), "jaune"));
test("juste et 15 minutes : vert", () => assert.equal(couleur([q(8, 10, { duree: 900 })]), "vert"));
test("très juste, 15 minutes, vrai quiz : bleu", () => assert.equal(couleur([q(9, 10, { duree: 900 })]), "bleu"));
test("un défi n'est pas un vrai quiz : vert", () => assert.equal(couleur([q(9, 10, { duree: 900, defi: true })]), "vert"));
test("le niveau facile n'est pas un vrai quiz : vert", () => assert.equal(couleur([q(9, 10, { duree: 900, niveau: "facile" })]), "vert"));

test("leçon déjà réussie à 80 % il y a 2 jours : pas un vrai quiz", () => {
  const ancien = q(8, 10, { date: "2026-11-05", leconIds: ["x"] });
  assert.equal(couleur([ancien, q(9, 10, { duree: 900, leconIds: ["x"] })]), "vert");
});
test("leçon réussie il y a plus de 7 jours : reste un vrai quiz", () => {
  const ancien = q(8, 10, { date: "2026-10-25", leconIds: ["x"] });
  assert.equal(couleur([ancien, q(9, 10, { duree: 900, leconIds: ["x"] })]), "bleu");
});

test("la couleur ne descend jamais", () => {
  const note = noteDuJour([q(9, 10, { duree: 900 }), q(0, 10, { duree: 200 })], J);
  assert.equal(note.couleur, "bleu");
  assert.equal(note.reponses, 20);
});
test("elle remonte avec les quiz suivants", () => assert.equal(couleur([q(3, 10), q(10, 10), q(10, 10)]), "vert"));
test("elle quitte le rouge", () => assert.equal(couleur([q(2, 12, { duree: 84 }), q(10, 12, { duree: 900 })]), "jaune"));
test("sans durée, 20 s par question", () => assert.equal(couleur([q(40, 45, { duree: undefined })]), "bleu"));

test("quiz validé, d'un autre jour ou vide : pas de note", () => {
  assert.equal(couleur([q(9, 10, { duree: 900, valide: true })]), undefined);
  assert.equal(couleur([q(9, 10, { duree: 900, date: "2026-11-06" })]), undefined);
  assert.equal(couleur([q(0, 0)]), undefined);
});
test("deux quiz sans createdAt ne plantent pas", () => {
  const a = q(9, 10, { duree: 900 }), b = q(9, 10, { duree: 900 });
  delete a.createdAt; delete b.createdAt;
  assert.equal(couleur([a, b]), "bleu");
});

test("la note donne le cumul actuel", () => {
  const note = noteDuJour([q(8, 10, { duree: 900 })], J);
  assert.equal(note.rang, 3);
  assert.equal(note.pct, 0.8);
  assert.equal(note.reponses, 10);
  assert.equal(note.minutes, 15);
});

test("tempsQuestion plafonne à 180 s", () => {
  assert.equal(tempsQuestion(200000), 180000);
  assert.equal(tempsQuestion(5000), 5000);
});
test("conseil : minutes restantes", () => {
  const c = conseilEpee(noteDuJour([q(9, 10)], J), { ton: "ton épée", feminin: true });
  assert.match(c, /minutes/);
});
test("conseil : rouge, justesse, vrai quiz, bleu", () => {
  const arme = { ton: "ton épée", feminin: true };
  assert.match(conseilEpee(noteDuJour([q(2, 12, { duree: 84 })], J), arme), /calme/);
  assert.match(conseilEpee(noteDuJour([q(3, 10)], J), arme), /justesse/);
  assert.match(conseilEpee(noteDuJour([q(9, 10, { duree: 900, defi: true })], J), arme), /vrai quiz/);
  assert.match(conseilEpee(noteDuJour([q(9, 10, { duree: 900 })], J), arme), /Bravo/);
});
test("nom de l'arme accordé", () => {
  const note = noteDuJour([q(8, 10, { duree: 900 })], J);
  assert.equal(nomEpee(note, { nom: "Massue", feminin: true }), "Massue verte");
  assert.equal(nomEpee(note, { nom: "Katana", feminin: false }), "Katana vert");
});
