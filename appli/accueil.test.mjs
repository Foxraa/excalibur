// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/accueil.js";

const { libelleCourt, defisOuverts } = globalThis;

test("chaque bouton de l'accueil a son libellé court", () => {
  assert.equal(libelleCourt("agenda"), "📒 Agenda");
  assert.equal(libelleCourt("devoirs"), "✏️ Devoirs");
  assert.equal(libelleCourt("relire"), "📖 Leçon");
  assert.equal(libelleCourt("cartable"), "🎒 Cartable");
});
test("un id inconnu renvoie l'id", () => {
  assert.equal(libelleCourt("inconnu"), "inconnu");
});
test("les défis restent repliés tant que la mission n'est pas faite", () => {
  assert.equal(defisOuverts({ missionFaite: false }), false);
});
test("les défis s'ouvrent une fois la mission faite", () => {
  assert.equal(defisOuverts({ missionFaite: true }), true);
});
test("le choix de l'enfant l'emporte sur la mission, dans les deux sens", () => {
  assert.equal(defisOuverts({ missionFaite: false, choix: true }), true);
  assert.equal(defisOuverts({ missionFaite: true, choix: false }), false);
});
