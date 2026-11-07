// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/tables.js";

const { limiteCalcul, periodeDefi, bonusTables } = globalThis;
const cours = { periodes: [1, 2, 3, 4, 5], semaines: [{ n: 1, periode: 1 }, { n: 7, periode: 1 }, { n: 8, periode: 2 }, { n: 36, periode: 5 }] };

test("le temps diminue selon la période et la difficulté", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(p => [limiteCalcul(2, 3, p), limiteCalcul(3, 8, p), limiteCalcul(7, 8, p)]),
    [[12, 16, 20], [10, 14, 18], [8, 12, 16], [8, 10, 14], [6, 10, 12]]);
});
test("le plus facile des deux nombres décide, dans les deux sens", () => {
  assert.equal(limiteCalcul(2, 9, 2), 10);
  assert.equal(limiteCalcul(9, 2, 2), 10);
  assert.equal(limiteCalcul(10, 7, 2), 10);
  assert.equal(limiteCalcul(4, 7, 2), 14);
  assert.equal(limiteCalcul(7, 1, 2), 10);
});
test("une période inattendue reste dans la grille", () => {
  assert.equal(limiteCalcul(7, 8, 0), 20);
  assert.equal(limiteCalcul(7, 8, 9), 12);
});
test("la période suit la semaine de classe en cours", () => {
  assert.equal(periodeDefi(cours, { n: 8, maintenant: true }), 2);
});
test("pendant les vacances, on garde la période qui vient de finir", () => {
  assert.equal(periodeDefi(cours, { n: 8, maintenant: false }), 1);
});
test("avant la toute première semaine, c'est la période 1", () => {
  assert.equal(periodeDefi(cours, { n: 1, maintenant: false }), 1);
});
test("après la dernière semaine, c'est la dernière période", () => {
  assert.equal(periodeDefi(cours, null), 5);
});
test("sans progression, c'est la période 1", () => {
  assert.equal(periodeDefi(null, { n: 8, maintenant: true }), 1);
  assert.equal(periodeDefi({ err: true, semaines: [], periodes: [] }, null), 1);
});
test("le bonus ne vaut que pour 10 ou 11 sur 12", () => {
  assert.deepEqual([12, 11, 10, 9].map(s => bonusTables(s, 12)), [0, 4, 4, 0]);
});
