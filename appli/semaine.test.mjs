// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/semaine.js";

const { soireePause, horsRoutine, serieDe, meilleureSerieDe } = globalThis;
// Semaine du lundi 2 novembre 2026.
const [LUN, MAR, MER, JEU, VEN, SAM, DIM] = ["02", "03", "04", "05", "06", "07", "08"].map(j => `2026-11-${j}`);

test("le mardi et le vendredi soir sont des soirées de pause", () => {
  assert.deepEqual([LUN, MAR, MER, JEU, VEN, SAM, DIM].filter(soireePause), [MAR, VEN]);
});

test("pas de cartable à préparer le mardi, le vendredi et le samedi", () => {
  assert.deepEqual([LUN, MAR, MER, JEU, VEN, SAM, DIM].filter(j => horsRoutine("cartable", j)), [MAR, VEN, SAM]);
});

test("pas de ligne devoirs dans la routine des soirées de pause", () => {
  assert.deepEqual([LUN, MAR, MER, JEU, VEN, SAM, DIM].filter(j => horsRoutine("devoirs", j)), [MAR, VEN]);
});

test("la lecture de l'agenda reste tous les jours", () => {
  assert.equal([LUN, MAR, MER, JEU, VEN, SAM, DIM].some(j => horsRoutine("agenda", j)), false);
});

test("une soirée de pause sans travail ne casse pas la série", () => {
  assert.deepEqual(serieDe(new Set([LUN, MER, JEU]), VEN), { n: 3, aujourdhui: false });
  assert.deepEqual(serieDe(new Set([LUN, MER, JEU, SAM]), SAM), { n: 4, aujourdhui: true });
});

test("une soirée de pause travaillée compte dans la série", () => {
  assert.equal(serieDe(new Set([LUN, MAR, MER]), MER).n, 3);
});

test("un autre jour sans travail casse la série", () => {
  assert.equal(serieDe(new Set([LUN, JEU]), JEU).n, 1);
});

test("la meilleure série saute les soirées de pause", () => {
  assert.equal(meilleureSerieDe(new Set([LUN, MER, JEU, SAM])), 4);
  assert.equal(meilleureSerieDe(new Set([LUN, JEU, SAM])), 2);
  assert.equal(meilleureSerieDe(new Set()), 0);
});
