// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/semaine.js";

const { soireePause, horsRoutine, serieDe, meilleureSerieDe, astuceDu } = globalThis;
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

// Trois mois de jours, pour couvrir toutes les astuces de chaque jour de la semaine.
const JOURS = Array.from({ length: 91 }, (_, i) => new Date(Date.UTC(2026, 10, 2 + i)).toISOString().slice(0, 10));
const ASTUCES = [{ t: "travail" }, { t: "cartable", cartable: true }, { t: "autre" }, { t: "repos", pause: true }];
const titres = jours => [...new Set(jours.map(j => astuceDu(j, ASTUCES).t))].sort();
const jourSem = i => JOURS.filter((_, n) => n % 7 === i);

test("les soirées de pause n'ont que l'astuce du repos", () => {
  assert.deepEqual(titres(jourSem(1)), ["repos"]); // mardis
  assert.deepEqual(titres(jourSem(4)), ["repos"]); // vendredis
});

test("le samedi n'a ni l'astuce du cartable ni celle du repos", () => {
  assert.deepEqual(titres(jourSem(5)), ["autre", "travail"]);
});

test("les soirs de cartable gardent l'astuce du cartable, sans celle du repos", () => {
  for (const i of [0, 2, 3, 6]) assert.deepEqual(titres(jourSem(i)), ["autre", "cartable", "travail"]);
});
