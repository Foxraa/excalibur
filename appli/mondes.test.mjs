// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/mondes.js";

const { SEUILS_MONDES, mondeOuvert, prochainMonde } = globalThis;

test("dix mondes, Excalibur ouvert d'emblée, seuils tous différents", () => {
  const seuils = Object.values(SEUILS_MONDES);
  assert.equal(seuils.length, 10);
  assert.equal(SEUILS_MONDES.excalibur, 0);
  assert.equal(new Set(seuils).size, 10);
});

test("un monde s'ouvre pile au seuil, pas une étoile avant", () => {
  assert.equal(mondeOuvert("dresseur", 2999), false);
  assert.equal(mondeOuvert("dresseur", 3000), true);
  assert.equal(mondeOuvert("excalibur", 0), true);
  assert.equal(mondeOuvert("inconnu", 0), true);
});

test("prochainMonde donne le suivant, puis null quand tout est ouvert", () => {
  assert.deepEqual(prochainMonde(0), { id: "peche", seuil: 250 });
  assert.deepEqual(prochainMonde(1780), { id: "gotham", seuil: 2000 });
  assert.deepEqual(prochainMonde(3000), { id: "fee", seuil: 4500 });
  assert.equal(prochainMonde(12000), null);
});
