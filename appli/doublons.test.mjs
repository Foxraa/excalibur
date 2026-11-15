// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/doublons.js";

const { etatFiche, dejaRangee } = globalThis;
const ex = (enonce, reponseEleve = "") => ({ enonce, reponseEleve });

test("une fiche sans réponse écrite est vierge, même si l'IA a mis « rien »", () => {
  assert.equal(etatFiche([ex("3/4 + 1/4"), ex("2/3 + 1/3", "(rien)"), ex("1/2 + 1/2", "non fait")]).etat, "vierge");
});

test("une fiche à moitié remplie, puis complète", () => {
  assert.deepEqual(etatFiche([ex("3/4 + 1/4", "1"), ex("2/3 + 1/3")]), { total: 2, faites: 1, etat: "partielle" });
  assert.equal(etatFiche([ex("Vrai ou faux ?", "non"), ex("2/3 + 1/3", "1")]).etat, "complete");
});

test("une simple leçon n'a pas d'état de fiche", () => {
  assert.equal(etatFiche([]), null);
});

test("la même photo est reconnue, même pour une leçon rangée avant les empreintes", () => {
  const lecons = [{ id: "a", matiere: "maths", titre: "Fractions", thumbs: ["data:mini"] }, { id: "b", matiere: "maths", titre: "Angles", empreintes: ["sha1"] }];
  assert.deepEqual(dejaRangee(null, ["sha1"], lecons), { lecon: lecons[1], par: "photo" });
  assert.deepEqual(dejaRangee(null, ["x", "data:mini"], lecons), { lecon: lecons[0], par: "photo" });
  assert.equal(dejaRangee(null, ["autre"], lecons), null);
});

test("la même fiche reprise en photo est reconnue par ses énoncés", () => {
  const avant = { id: "a", matiere: "maths", titre: "Fractions", exercices: [ex("Calcule 3/4 + 1/4"), ex("Calcule 2/3 + 1/3"), ex("Range les fractions")] };
  const nouvelle = { matiere: "maths", titre: "Exercices sur les fractions", exercices: [ex("Calcule 3/4 + 1/4", "1"), ex("Calcule 2/3 + 1/3", "1"), ex("Range les fractions", "1/2 < 3/4")] };
  assert.equal(dejaRangee(nouvelle, [], [avant]).lecon, avant);
});

test("deux fiches différentes sur la même notion ne sont pas confondues", () => {
  const avant = { id: "a", matiere: "maths", titre: "Fractions", exercices: [ex("Calcule 3/4 + 1/4"), ex("Calcule 2/3 + 1/3")] };
  const autre = { matiere: "maths", titre: "Fractions", exercices: [ex("Colorie la moitié du carré"), ex("Écris trois quarts en chiffres")] };
  assert.equal(dejaRangee(autre, [], [avant]), null);
  assert.equal(dejaRangee({ ...avant, matiere: "francais", id: undefined }, [], [avant]), null);
});

test("une leçon sans exercices est reconnue par son titre", () => {
  const avant = { id: "a", matiere: "francais", titre: "Le passé composé avec être" };
  assert.equal(dejaRangee({ matiere: "francais", titre: "Le passé composé avec être" }, [], [avant]).lecon, avant);
  assert.equal(dejaRangee({ matiere: "francais", titre: "Le passé composé avec avoir" }, [], [avant]), null);
});
