import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const code = await readFile(new URL("./public/local.js", import.meta.url), "utf8");

// Charge local.js avec un faux serveur : renvoie le pont et de quoi déclencher la synchro à la main.
async function monter(donnees) {
  const f = { serveur: donnees, tic: null, attente: null };
  const reponse = () => ({ ok: true, json: async () => JSON.parse(JSON.stringify(f.serveur)) });
  const fetch = async (url, o = {}) => {
    if (o.method === "PUT") return { ok: true };
    if (f.attente) await f.attente;
    return reponse();
  };
  const window = {};
  vm.runInNewContext(code, { window, fetch, document: { hidden: false }, setInterval: cb => { f.tic = cb; }, console });
  f.db = await window.claude.use("db");
  return f;
}
function compter(db, col) {
  const appels = [];
  db.collection(col).onSnapshot(s => appels.push(s.docs.map(d => d.id)));
  appels.length = 0;
  return appels;
}

test("la synchro ne redessine rien quand rien n'a changé", async () => {
  const f = await monter({ lecons: { a: { t: 1 } }, quiz: {} });
  const l = compter(f.db, "lecons"), q = compter(f.db, "quiz");
  await f.tic();
  assert.equal(l.length, 0);
  assert.equal(q.length, 0);
});

test("elle ne prévient que la collection changée par l'autre appareil", async () => {
  const f = await monter({ lecons: { a: { t: 1 } }, quiz: {} });
  const l = compter(f.db, "lecons"), q = compter(f.db, "quiz");
  f.serveur = { lecons: { a: { t: 2 } }, quiz: {} };
  await f.tic();
  assert.equal(l.length, 1);
  assert.equal(q.length, 0);
});

test("l'ordre renvoyé par le serveur ne compte pas comme un changement", async () => {
  const f = await monter({ lecons: { a: { t: 1 } } });
  const l = compter(f.db, "lecons");
  await f.db.collection("lecons").doc("b").set({ t: 2 });
  f.serveur = { lecons: { b: { t: 2 }, a: { t: 1 } } };
  await f.tic();
  assert.equal(l.length, 0);
});

test("une lecture commencée avant un enregistrement est ignorée", async () => {
  const f = await monter({ lecons: { a: { t: 1 } } });
  const l = compter(f.db, "lecons");
  let lacher;
  f.attente = new Promise(ok => { lacher = ok; });
  const tic = f.tic();                                  // lit la base…
  await f.db.collection("lecons").doc("b").set({ t: 2 }); // …pendant qu'on enregistre
  lacher();
  await tic;
  assert.equal(l.length, 0);
  f.attente = null;
  f.serveur = { lecons: { a: { t: 1 }, b: { t: 2 } } };
  await f.tic();
  assert.equal(l.length, 0, "la leçon enregistrée n'a pas disparu du cache");
});
