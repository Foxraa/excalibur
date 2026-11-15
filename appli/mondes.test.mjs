// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/mondes.js";

const { SEUILS_MONDES, mondeOuvert, prochainMonde } = globalThis;

test("huit mondes, Excalibur ouvert d'emblée, seuils tous différents", () => {
  const seuils = Object.values(SEUILS_MONDES);
  assert.equal(seuils.length, 8);
  assert.equal(SEUILS_MONDES.excalibur, 0);
  assert.equal(new Set(seuils).size, 8);
});

test("un monde s'ouvre pile au seuil, pas une étoile avant", () => {
  assert.equal(mondeOuvert("manga", 2999), false);
  assert.equal(mondeOuvert("manga", 3000), true);
  assert.equal(mondeOuvert("excalibur", 0), true);
  assert.equal(mondeOuvert("inconnu", 0), true);
});

test("prochainMonde donne le suivant, puis null quand tout est ouvert", () => {
  assert.deepEqual(prochainMonde(1780), { id: "manga", seuil: 3000 });
  assert.deepEqual(prochainMonde(3000), { id: "fee", seuil: 4500 });
  assert.equal(prochainMonde(12000), null);
});
