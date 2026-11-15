// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import { coutsParJour } from "./couts.mjs";

const journal = `08/11/2026 12:05:01  Claude claude-sonnet-5-5 (default, effort medium) : 1000000 jetons lus, 100000 écrits
08/11/2026 12:06:01  Claude claude-haiku-5-5 (quick, effort low, 2 photos) : 1000000 jetons lus, 0 écrits
10/11/2026 22:52:54  Mistral OCR mistral-ocr-latest : 4 pages lues
10/11/2026 22:53:00  Mistral mistral-small-latest (default) : 2000000 jetons lus, 1000000 écrits
10/11/2026 22:54:00  Mistral un-modele-inconnu (default) : 10 jetons lus, 10 écrits
ligne qui ne ressemble à rien
11/11/2026 09:00:00  Claude claude-sonnet-5-5 (default, effort medium) : ? jetons lus, ? écrits
`;

test("un total par jour, du plus récent au plus ancien", () => {
  const j = coutsParJour(journal);
  assert.deepEqual(j.map(x => x.jour), ["2026-11-11", "2026-11-10", "2026-11-08"]);
  assert.equal(j[2].requetes, 2);
  assert.ok(Math.abs(j[2].cout - (2 + 1 + 0.1)) < 1e-9); // Sonnet : 2 $ lus + 1 $ écrits ; Haiku : 0,10 $
});

test("OCR à la page, modèle inconnu signalé, jetons « ? » comptés à zéro", () => {
  const [onze, dix] = coutsParJour(journal);
  assert.ok(Math.abs(dix.cout - (4 * 0.002 + 0.2 + 0.3)) < 1e-9);
  assert.equal(dix.inconnu, true);
  assert.equal(dix.modeles["un-modele-inconnu"].inconnu, true);
  assert.equal(dix.modeles["mistral-ocr-latest"].requetes, 1);
  assert.equal(onze.requetes, 1);
  assert.equal(onze.cout, 0);
});

test("journal vide", () => assert.deepEqual(coutsParJour(""), []));
