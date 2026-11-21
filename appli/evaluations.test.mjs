// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/evaluations.js";

const { normNote, preuvesNote, texteCriteres, preuvesLecon, ajouterEvaluation } = globalThis;

test("une note chiffrée reste telle quelle", () => {
  const n = normNote({ intitule: "Fractions", valeur: "15", sur: 20, date: "2026-11-02" });
  assert.equal(n.valeur, 15);
  assert.equal(n.sur, 20);
  assert.equal(n.date, "2026-11-02");
  assert.deepEqual(n.criteres, []);
});

test("des niveaux de 1 à 4 deviennent une note sur 4, la moyenne au quart de point", () => {
  const n = normNote({ intitule: "Dictée bilan", valeur: 17, sur: 20, criteres: [
    { nom: "Accord GN", valeur: 2 }, { nom: "Accord S/V", valeur: 3 }, { nom: "Homophones", valeur: 4 }, { nom: "Lexique", valeur: 1 }] });
  assert.equal(n.sur, 4);
  assert.equal(n.valeur, 2.5);
  assert.equal(n.criteres.length, 4);
  assert.equal(texteCriteres(n), "Accord GN 2 · Accord S/V 3 · Homophones 4 · Lexique 1");
});

test("un critère impossible est écarté, et sans rien de valable il n'y a pas de note", () => {
  assert.equal(normNote({ criteres: [{ nom: "Lexique", valeur: 7 }, { nom: "GN", valeur: 3 }] }).valeur, 3);
  assert.equal(normNote({ intitule: "Évaluation", valeur: null, sur: null }), null);
  assert.equal(normNote({ criteres: [{ nom: "GN", valeur: "rien" }] }), null);
  assert.equal(normNote({ valeur: 3, sur: 4, date: "le 3 octobre" }).date, null);
});

test("chaque critère compte pour ses propres objectifs", () => {
  const n = normNote({ criteres: [{ nom: "Accord GN", valeur: 2, competences: ["f-7-4"] }, { nom: "Lexique", valeur: 4, competences: ["f-4-6"] }] });
  assert.deepEqual(preuvesNote(n), [{ id: "f-7-4", ok: 0.5 }, { id: "f-4-6", ok: 1 }]);
  assert.deepEqual(preuvesNote({ valeur: 15, sur: 20, competences: ["m-1-1"] }), [{ id: "m-1-1", ok: 0.75 }]);
});

test("les objectifs passent par le filtre donné", () => {
  const n = normNote({ valeur: 3, sur: 4, competences: ["bon", "faux"] }, c => c.filter(x => x === "bon"));
  assert.deepEqual(n.competences, ["bon"]);
});

test("les évaluations gardées sur une leçon comptent critère par critère pour le suivi", () => {
  const l = { titre: "Dictées bilan", date: "2026-09-07", evaluations: [
    { intitule: "Dictée bilan n°1", date: "2026-09-11", criteres: [{ nom: "Lexique", valeur: 1, sur: 4, competences: ["f-4-6"] }, { nom: "Anglais", valeur: 3, sur: 4, competences: [] }] }] };
  assert.deepEqual(preuvesLecon(l), [{ id: "f-4-6", ok: 0.25, date: "2026-09-11", intitule: "Dictée bilan n°1", nom: "Lexique", valeur: 1, sur: 4 }]);
  assert.deepEqual(preuvesLecon({ titre: "Sans évaluation" }), []);
});

test("une évaluation rangée deux fois n'est gardée qu'une fois, dans l'ordre des dates", () => {
  const a = { intitule: "Bilan n°2", date: "2026-09-18", criteres: [] }, b = { intitule: "Bilan n°1", date: "2026-09-11", criteres: [] };
  const l = ajouterEvaluation(ajouterEvaluation([a], b), { ...a, criteres: [{ nom: "GN", valeur: 3 }] });
  assert.deepEqual(l.map(e => e.intitule), ["Bilan n°1", "Bilan n°2"]);
  assert.equal(l[1].criteres.length, 1);
});
