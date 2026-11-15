// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import { creerPresence } from "./presence.mjs";

// Minuteur à la main : avancer(ms) déclenche ce qui est dû.
function horloge() {
  let maintenant = 0, id = 0;
  const attentes = new Map();
  return {
    minuteur: (f, ms) => { attentes.set(++id, { f, a: maintenant + ms }); return id; },
    annuler: i => attentes.delete(i),
    avancer(ms) {
      maintenant += ms;
      for (const [i, x] of [...attentes]) if (x.a <= maintenant) { attentes.delete(i); x.f(); }
    },
  };
}
const creer = h => { const r = { arrets: 0 }; r.p = creerPresence({ delai: 15, delaiDemarrage: 180, quandVide: () => r.arrets++, ...h }); return r; };

test("la fenêtre fermée arrête le cartable après le délai", () => {
  const h = horloge(), r = creer(h);
  r.p.entre(); h.avancer(1000); assert.equal(r.arrets, 0);
  r.p.sort(); h.avancer(14); assert.equal(r.arrets, 0);
  h.avancer(1); assert.equal(r.arrets, 1);
});

test("recharger la page n'arrête rien", () => {
  const h = horloge(), r = creer(h);
  r.p.entre(); r.p.sort(); h.avancer(2); r.p.entre(); h.avancer(1000);
  assert.equal(r.arrets, 0);
});

test("deux fenêtres : il faut fermer les deux", () => {
  const h = horloge(), r = creer(h);
  r.p.entre(); r.p.entre(); r.p.sort(); h.avancer(100);
  assert.equal(r.arrets, 0);
  r.p.sort(); h.avancer(15);
  assert.equal(r.arrets, 1);
});

test("aucune fenêtre au démarrage : arrêt après le délai de démarrage", () => {
  const h = horloge(), r = creer(h);
  h.avancer(179); assert.equal(r.arrets, 0);
  h.avancer(1); assert.equal(r.arrets, 1);
});
