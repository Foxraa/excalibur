// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/mondes.js";

const { CALENDRIER_MONDES, mondeOuvert, prochainMonde } = globalThis;

test("huit mondes, Excalibur ouvert dès le départ, le dernier avant fin mai 2027", () => {
  const dates = Object.values(CALENDRIER_MONDES).sort();
  assert.equal(dates.length, 8);
  assert.equal(CALENDRIER_MONDES.excalibur, dates[0]);
  assert.ok(dates.at(-1) <= "2027-05-31");
  assert.equal(new Set(dates).size, 8);
});

test("un monde s'ouvre le jour dit, pas la veille", () => {
  assert.equal(mondeOuvert("manga", "2026-12-05"), false);
  assert.equal(mondeOuvert("manga", "2026-12-06"), true);
  assert.equal(mondeOuvert("excalibur", "2026-11-15"), true);
  assert.equal(mondeOuvert("inconnu", "2000-01-01"), true);
});

test("prochainMonde donne le suivant, puis null quand tout est ouvert", () => {
  assert.deepEqual(prochainMonde("2026-11-15"), { id: "manga", date: "2026-12-06" });
  assert.deepEqual(prochainMonde("2026-12-06"), { id: "fee", date: "2027-01-01" });
  assert.equal(prochainMonde("2027-05-11"), null);
});
