// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import { creerSessions, autorise, fileUneParUne } from "./parent.mjs";

const MIN = 60e3;
const horloge = () => { let t = 1000; return { maintenant: () => t, avance: ms => { t += ms; } }; };
const recompenses = { r1: { titre: "Glace", cout: 30 } };
const base = { pinDefini: true, parent: false, recompenses, existant: null };
const a = o => autorise({ ...base, ...o });

test("une session ouverte est valide", () => {
  const s = creerSessions();
  const j = s.ouvrir();
  assert.match(j, /^[0-9a-f]{64}$/);
  assert.equal(s.valide(j), true);
});
test("la session expire après 15 minutes sans usage", () => {
  const h = horloge();
  const s = creerSessions({ maintenant: h.maintenant });
  const j = s.ouvrir();
  h.avance(15 * MIN + 1);
  assert.equal(s.valide(j), false);
});
test("chaque usage prolonge la session", () => {
  const h = horloge();
  const s = creerSessions({ maintenant: h.maintenant });
  const j = s.ouvrir();
  h.avance(14 * MIN);
  assert.equal(s.valide(j), true);
  h.avance(14 * MIN);
  assert.equal(s.valide(j), true);
});
test("fermer invalide la session", () => {
  const s = creerSessions();
  const j = s.ouvrir();
  s.fermer(j);
  assert.equal(s.valide(j), false);
});
test("jeton vide, absent ou inconnu : refusé", () => {
  const s = creerSessions();
  assert.equal(s.valide(""), false);
  assert.equal(s.valide(undefined), false);
  assert.equal(s.valide("inconnu"), false);
});

test("sans code parent défini, tout est permis", () => {
  assert.equal(a({ pinDefini: false, col: "recompenses", id: "r1", data: { titre: "x", cout: 1 } }), null);
  assert.equal(a({ pinDefini: false, col: "config", id: "pin", data: {} }), null);
});
test("récompenses, config/main et programme demandent le parent", () => {
  assert.equal(a({ col: "recompenses", id: "r1", data: { titre: "x", cout: 1 } }), "parent");
  assert.equal(a({ col: "recompenses", id: "r1", suppression: true }), "parent");
  assert.equal(a({ col: "config", id: "main", data: {} }), "parent");
  assert.equal(a({ col: "programme", id: "x", data: {} }), "parent");
  assert.equal(a({ col: "recompenses", id: "r1", data: { titre: "x", cout: 1 }, parent: true }), null);
});
test("config/pin est refusé même avec le jeton", () => {
  assert.equal(a({ col: "config", id: "pin", data: {}, parent: true }), "parent");
});

test("achats : une demande de récompense au bon prix passe sans jeton", () => {
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: 30, statut: "demandé" } }), null);
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: "30", statut: "demandé" } }), null);
});
test("achats : un cadeau de palier passe sans jeton", () => {
  assert.equal(a({ col: "achats", id: "a2", data: { cout: 0, palier: 10, statut: "demandé" } }), null);
});
test("achats : mauvais prix, statut, existant ou suppression demandent le parent", () => {
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: 5, statut: "demandé" } }), "parent");
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "zz", cout: 30, statut: "demandé" } }), "parent");
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: 30, statut: "validé" } }), "parent");
  assert.equal(a({ col: "achats", id: "a1", data: { cout: 0, statut: "demandé" } }), "parent");
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: 30, statut: "demandé" }, existant: { statut: "demandé" } }), "parent");
  assert.equal(a({ col: "achats", id: "a1", suppression: true }), "parent");
});
test("achats : avec le jeton, on valide", () => {
  assert.equal(a({ col: "achats", id: "a1", data: { recompenseId: "r1", cout: 30, statut: "validé" }, existant: { statut: "demandé" }, parent: true }), null);
});

test("quiz : score au-dessus du total refusé", () => {
  assert.equal(a({ col: "quiz", id: "q", data: { score: 13, total: 12 } }), "invalide");
});
test("quiz : plafond d'étoiles", () => {
  assert.equal(a({ col: "quiz", id: "q", data: { score: 12, total: 12, etoiles: 38 } }), null);
  assert.equal(a({ col: "quiz", id: "q", data: { score: 12, total: 12, etoiles: 39 } }), "invalide");
  assert.equal(a({ col: "quiz", id: "q", data: { score: 12, total: 12, etoiles: 39 }, parent: true }), "invalide");
});
test("quiz en cours sans total ni étoiles : pas de contrôle", () => {
  assert.equal(a({ col: "quiz", id: "q", data: { questions: [], termine: false } }), null);
  assert.equal(a({ col: "quiz", id: "q", data: { score: 3, termine: false } }), null);
});
test("une suppression n'est pas soumise aux contrôles de bon sens", () => {
  assert.equal(a({ col: "quiz", id: "q", suppression: true }), null);
  assert.equal(a({ col: "notes", id: "n", suppression: true }), null);
});

test("notes : valeurs incohérentes refusées", () => {
  assert.equal(a({ col: "notes", id: "n", data: { valeur: 21, sur: 20 } }), "invalide");
  assert.equal(a({ col: "notes", id: "n", data: { valeur: 5, sur: 0 } }), "invalide");
  assert.equal(a({ col: "notes", id: "n", data: { valeur: -1, sur: 20 } }), "invalide");
  assert.equal(a({ col: "notes", id: "n", data: { valeur: 20, sur: 20 } }), null);
});

test("les autres collections restent libres", () => {
  assert.equal(a({ col: "config", id: "badges", data: {} }), null);
  assert.equal(a({ col: "config", id: "etoile-jour", data: {} }), null);
  assert.equal(a({ col: "config", id: "vac-2026", data: {} }), null);
  assert.equal(a({ col: "devoirs", id: "d", data: {} }), null);
  assert.equal(a({ col: "lecons", id: "l", data: {} }), null);
  assert.equal(a({ col: "routine", id: "r", data: {} }), null);
});

test("fileUneParUne : les tâches ne se chevauchent pas", async () => {
  const run = fileUneParUne();
  let actives = 0, max = 0;
  const tache = v => async () => {
    actives++; max = Math.max(max, actives);
    await new Promise(r => setTimeout(r, 10));
    actives--;
    return v;
  };
  const res = await Promise.all([run(tache(1)), run(tache(2)), run(tache(3))]);
  assert.deepEqual(res, [1, 2, 3]);
  assert.equal(max, 1);
});
test("fileUneParUne : une tâche qui échoue ne bloque pas la suivante", async () => {
  const run = fileUneParUne();
  const p1 = run(async () => { throw new Error("raté"); });
  const p2 = run(async () => "ok");
  await assert.rejects(p1, /raté/);
  assert.equal(await p2, "ok");
});
