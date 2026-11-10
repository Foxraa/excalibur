// Excalibur — serveur local.
// Sert l'appli (public/), garde les données dans data/cartable.duckdb et appelle l'IA choisie :
// Ollama (sur ce PC ou un autre) ou Claude, avec une clé API qui reste dans .env et n'est jamais envoyée au navigateur.
import http from "node:http";
import https from "node:https";
import crypto from "node:crypto";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { DuckDBInstance } from "@duckdb/node-api";
import { marked } from "marked";
import { creerSessions, autorise, fileUneParUne, delaiEchec } from "./parent.mjs";
import { avecSchemas, schema } from "./schemas.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(path.join(here, ".env")); } catch {}

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
// Pour payer moins : Sonnet pour le gros du travail, Haiku pour les petites réponses.
const MODEL = process.env.MODEL || "claude-sonnet-5-5";
const MODEL_QUICK = process.env.MODEL_QUICK || "claude-haiku-5-5";
const PUBLIC = path.join(here, "public");
// DATA_DIR sert au test du parcours : il tourne sur un dossier jetable, jamais sur les vraies données.
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(here, "data");
const DB_FILE = path.join(DATA, "cartable.duckdb");
const OLD_JSON = path.join(DATA, "db.json");
const CONSO_FILE = path.join(DATA, "consommation.log");
const COLS = new Set(["lecons", "quiz", "notes", "devoirs", "routine", "recompenses", "achats", "config", "programme"]);
const MAX_IMAGES = 4;

/* ---------- Choix de l'IA ---------- */
// Réglé dans l'espace parents, gardé dans .env (le lanceur le lit aussi, pour ne pas installer Ollama pour rien).
// IA=ollama : modèle local, gratuit et plus lent. IA_QUICK permet de choisir à part pour les petites réponses.
const clientClaude = cle => cle ? new Anthropic({ apiKey: cle }) : null;
const OLLAMA_LOCAL = process.env.OLLAMA_LOCAL_URL || "http://127.0.0.1:11434"; // autre port sur la clé USB
// Accepte ce que tape un parent : « 192.168.1.20 », « PC-SALON:11434 », « \\PC-SALON » ou une adresse complète.
function lireUrlOllama(s) {
  let t = String(s).trim().replace(/^\\+/, "").replace(/\\/g, "/");
  if (!/^https?:\/\//i.test(t)) t = "http://" + t;
  const u = new URL(t);
  if (!u.port && u.protocol === "http:") u.port = "11434";
  return new URL(u.origin);
}
const urlDepart = () => {
  try { return lireUrlOllama(process.env.OLLAMA_URL || OLLAMA_LOCAL); }
  catch { console.log(`Adresse d'Ollama illisible dans .env : ${process.env.OLLAMA_URL}`); return lireUrlOllama(OLLAMA_LOCAL); }
};
let client = clientClaude(process.env.ANTHROPIC_API_KEY);
let OLLAMA_URL = urlDepart();
let OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma4:e4b";
const OLLAMA_CTX = Number(process.env.OLLAMA_CTX || 16384);
let IA = (process.env.IA || (client ? "claude" : "ollama")).toLowerCase();
let IA_QUICK = (process.env.IA_QUICK || IA).toLowerCase();
const iaPrete = ia => ia === "ollama" || !!client;
// Lecture des photos : par l'IA du cartable (OCR=ia), ou d'abord par Mistral OCR (OCR=mistral, avec MISTRAL_API_KEY),
// qui en recopie le texte ; l'IA reçoit alors ce texte au lieu des images.
let CLE_MISTRAL = process.env.MISTRAL_API_KEY || "";
let OCR = (process.env.OCR || "").toLowerCase() === "mistral" ? "mistral" : "ia";
const ollamaLocal = () => OLLAMA_URL.origin === lireUrlOllama(OLLAMA_LOCAL).origin || ["localhost", "127.0.0.1", "[::1]"].includes(OLLAMA_URL.hostname);

// Change les lignes voulues de .env sans toucher au reste ; null retire la ligne.
async function majEnv(vals) {
  const f = path.join(here, ".env");
  const lignes = (await fs.readFile(f, "utf8").catch(() => "")).trimEnd().split(/\r?\n/);
  for (const [k, v] of Object.entries(vals)) {
    const i = lignes.findIndex(l => new RegExp(`^\\s*${k}\\s*=`).test(l));
    if (v === null) { if (i >= 0) lignes.splice(i, 1); }
    else if (i >= 0) lignes[i] = `${k}=${v}`;
    else lignes.push(`${k}=${v}`);
  }
  await fs.writeFile(f, lignes.join("\n").trimStart() + "\n");
}

/* ---------- Stockage : base DuckDB, une ligne par document ---------- */
// Avec DB_KEY dans .env, le fichier est chiffré (AES-256) : la copie dans OneDrive est illisible sans la clé.
await fs.mkdir(DATA, { recursive: true });
const duck = await (await DuckDBInstance.create(":memory:")).connect();
const sqlStr = s => "'" + s.replaceAll("'", "''") + "'";
await duck.run(`ATTACH ${sqlStr(DB_FILE.replaceAll("\\", "/"))} AS cartable` + (process.env.DB_KEY ? ` (ENCRYPTION_KEY ${sqlStr(process.env.DB_KEY)})` : ""));
await duck.run("USE cartable");
await duck.run(`CREATE TABLE IF NOT EXISTS docs (
  col VARCHAR NOT NULL, id VARCHAR NOT NULL, data JSON NOT NULL,
  maj TIMESTAMP NOT NULL DEFAULT current_timestamp, PRIMARY KEY (col, id))`);

// Une seule opération à la fois sur la connexion.
let file = Promise.resolve();
const tour = fn => (file = file.then(fn, fn));
// DuckDB note d'abord les changements dans cartable.duckdb.wal, et ne les recopie dans cartable.duckdb qu'au-delà de 16 Mo.
// On les recopie 3 s après la dernière modification : le fichier cartable.duckdb seul est toujours complet (copie, OneDrive).
let attente = null;
const consolider = () => tour(() => duck.run("CHECKPOINT")).catch(e => console.error("CHECKPOINT :", e.message));
const plusTard = () => { clearTimeout(attente); attente = setTimeout(consolider, 3000); };
const ecrire = (col, id, data) => tour(() => duck.run(
  "INSERT OR REPLACE INTO docs (col, id, data, maj) VALUES ($1, $2, $3, current_timestamp)", [col, id, JSON.stringify(data)])).finally(plusTard);
const effacer = (col, id) => tour(() => duck.run("DELETE FROM docs WHERE col = $1 AND id = $2", [col, id])).finally(plusTard);
const toutLire = () => tour(async () => {
  const out = {};
  for (const [col, id, data] of (await duck.runAndReadAll("SELECT col, id, data::VARCHAR FROM docs")).getRows())
    (out[col] ||= {})[id] = JSON.parse(data);
  return out;
});

// Première fois : on reprend l'ancien data/db.json, puis on le renomme.
const [[nb]] = (await duck.runAndReadAll("SELECT count(*)::INTEGER FROM docs")).getRows();
const ancien = nb === 0 && await fs.readFile(OLD_JSON, "utf8").then(JSON.parse, () => null);
if (ancien) {
  await duck.run("BEGIN TRANSACTION");
  try {
    let n = 0;
    for (const [col, docs] of Object.entries(ancien)) if (COLS.has(col))
      for (const [id, data] of Object.entries(docs || {})) { await ecrire(col, id, data); n++; }
    await duck.run("COMMIT");
    await duck.run("CHECKPOINT");
    await fs.rename(OLD_JSON, OLD_JSON + ".importe");
    console.log(`${n} documents repris de db.json (l'ancien fichier est gardé sous db.json.importe).`);
  } catch (e) { await duck.run("ROLLBACK"); throw e; }
}
// Au démarrage : ce qui restait dans le journal (fenêtre fermée d'un coup, coupure) part tout de suite dans le fichier.
await duck.run("CHECKPOINT");

/* ---------- Code parent ---------- */
// Gardé haché (scrypt) dans config/pin : jamais envoyé au navigateur, ni lisible ni modifiable par /api/db.
// Le navigateur le vérifie par POST /api/pin.
const hacher = (pin, sel) => crypto.scryptSync(String(pin), sel, 32).toString("hex");
const lireDoc = async (col, id) => {
  const rows = (await tour(() => duck.runAndReadAll("SELECT data::VARCHAR FROM docs WHERE col = $1 AND id = $2", [col, id]))).getRows();
  return rows.length ? JSON.parse(rows[0][0]) : null;
};
// Jetons de session parent (15 min sans usage) : le code n'est vérifié qu'à l'ouverture, ensuite le jeton suffit.
const sessions = creerSessions();
// Les essais passent un par un, attente comprise : des essais en parallèle ne contournent pas la seconde par erreur.
const unEssai = fileUneParUne();
let echecsPin = 0;
const pinCorrect = pin => unEssai(async () => {
  const doc = await lireDoc("config", "pin");
  const ok = !!doc && crypto.timingSafeEqual(Buffer.from(hacher(pin, doc.sel), "hex"), Buffer.from(doc.hash, "hex"));
  if (ok) echecsPin = 0;
  else await new Promise(r => setTimeout(r, delaiEchec(++echecsPin))); // l'attente double à chaque erreur de suite : deviner au hasard devient très long
  return ok;
});
const enregistrerPin = pin => { const sel = crypto.randomBytes(16).toString("hex"); return ecrire("config", "pin", { sel, hash: hacher(pin, sel) }); };
// Avant le 21/10/2026, le code était en clair dans config/main : on le range à l'abri.
{
  const main = await lireDoc("config", "main");
  if (main?.pin) {
    if (!(await lireDoc("config", "pin"))) await enregistrerPin(main.pin);
    const { pin, ...reste } = main;
    await ecrire("config", "main", reste);
    console.log("Code parent rangé à l'abri (haché).");
  }
}

/* ---------- Outils HTTP ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2" };
function json(res, code, body) {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
async function readBody(req, limit = 40e6) {
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > limit) throw Object.assign(new Error("trop gros"), { status: 413 }); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

/* ---------- Claude ---------- */
// "quick" = petites réponses (vérifier une réponse, résoudre une question de maths pour la confirmer, réexpliquer, relier au programme) : Haiku, effort bas.
const TIERS = {
  quick: { model: MODEL_QUICK, effort: "low", max_tokens: 4000 },
  // "light" = travail long mais peu réfléchi (recopier l'agenda, rédiger un cours à partir d'un sujet) : Sonnet, effort bas.
  light: { model: MODEL, effort: "low", max_tokens: 32000 },
  default: { model: MODEL, effort: "medium", max_tokens: 32000 },
};
// Le repli automatique en cas de refus n'existe pas pour Haiku.
const avecRepli = m => !/haiku/.test(m);

function codeErreur(e) {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return "bad_key";
  if (e instanceof Anthropic.RateLimitError) return "rate_limited";
  if (e instanceof Anthropic.BadRequestError) return /image/i.test(e.message) ? "image_rejected" : /too long|too large|prompt is too long/i.test(e.message) ? "prompt_too_large" : "bad_request";
  if (e instanceof Anthropic.APIConnectionError) return "network";
  if (e instanceof Anthropic.APIError) return e.status === 529 ? "rate_limited" : "api_error";
  return "api_error";
}

/* ---------- Ollama (modèle local) ---------- */
// node:http plutôt que fetch : sur ce PC, lire une longue demande peut prendre plus de 5 minutes avant le premier mot.
const httpDe = u => u.protocol === "https:" ? https : http;
function ollama(chemin, corps, signal) {
  return new Promise((ok, ko) => {
    const req = httpDe(OLLAMA_URL).request(new URL(chemin, OLLAMA_URL), { method: "POST", headers: { "content-type": "application/json" }, signal }, ok);
    req.on("error", ko);
    req.end(JSON.stringify(corps));
  });
}
// Les modèles installés ; une erreur si personne ne répond (ou pas un Ollama) dans le délai.
async function modelesOllama(url, delai = 8000) {
  const rep = await new Promise((ok, ko) => {
    const req = httpDe(url).get(new URL("/api/tags", url), ok).on("error", ko);
    req.setTimeout(delai, () => req.destroy(new Error("pas de réponse")));
  });
  let s = ""; for await (const c of rep) s += c;
  return JSON.parse(s).models.map(m => m.name);
}
const modeleInstalle = (noms, m) => noms.includes(m) || noms.includes(m + ":latest");

// Essaie un réglage sans le garder. Lister les modèles de Claude ne consomme pas de jetons.
async function essaiIA({ ia, url, modele, cle }) {
  if (ia === "claude") {
    const c = cle ? new Anthropic({ apiKey: cle }) : client;
    if (!c) return { ok: false, code: "no_key" };
    try { await c.models.list({ limit: 1 }, { maxRetries: 0, timeout: 15000 }); return { ok: true }; }
    catch (e) { return { ok: false, code: codeErreur(e) }; }
  }
  try {
    const modeles = await modelesOllama(url);
    return modeleInstalle(modeles, modele) ? { ok: true, modeles } : { ok: false, code: "no_model", modeles };
  } catch { return { ok: false, code: "no_ollama" }; }
}

/* ---------- Mistral OCR (lecture des photos) ---------- */
// Payé à la page lue, pas aux jetons. Une demande par photo, toutes en même temps.
const MISTRAL = "https://api.mistral.ai/v1/";
const MODELE_OCR = process.env.MISTRAL_OCR_MODEL || "mistral-ocr-latest";
const erreurOCR = (code, message) => Object.assign(new Error(message), { code });
async function appelMistral(chemin, cle, { corps, signal, delai = 90000 } = {}) {
  const limite = AbortSignal.timeout(delai);
  let r;
  try {
    r = await fetch(MISTRAL + chemin, {
      method: corps ? "POST" : "GET",
      headers: { authorization: `Bearer ${cle}`, ...(corps ? { "content-type": "application/json" } : {}) },
      body: corps ? JSON.stringify(corps) : undefined,
      signal: signal ? AbortSignal.any([signal, limite]) : limite,
    });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw erreurOCR("ocr_network", e.message);
  }
  if (r.status === 401 || r.status === 403) throw erreurOCR("ocr_bad_key", "clé refusée");
  if (r.status === 429) throw erreurOCR("rate_limited", "trop de demandes");
  if (!r.ok) throw erreurOCR("ocr_error", `${r.status} ${(await r.text().catch(() => "")).slice(0, 300)}`);
  return r.json();
}
async function lireAvecMistral(images, signal) {
  const reps = await Promise.all(images.map(im => appelMistral("ocr", CLE_MISTRAL, {
    signal,
    corps: { model: MODELE_OCR, document: { type: "image_url", image_url: `data:${im.media_type || "image/jpeg"};base64,${im.data}` } },
  })));
  const n = reps.reduce((s, r) => s + (r.usage_info?.pages_processed || 1), 0);
  noterConso(`Mistral OCR ${MODELE_OCR} : ${n} page${n > 1 ? "s" : ""} lue${n > 1 ? "s" : ""}`);
  // Le Markdown renvoyé cite les dessins découpés dans la photo (![img-0.jpeg](img-0.jpeg)) : ils ne servent à rien ici.
  return reps.map((r, i) => {
    const txt = (r.pages || []).map(p => p.markdown || "").join("\n\n").replace(/!\[[^\]]*\]\([^)]*\)/g, "").trim();
    return `--- Photo ${i + 1} ---\n${txt || "(rien de lisible)"}`;
  }).join("\n\n");
}
const avecTexteOCR = (prompt, texte) => `${prompt}

Les photos ne te sont pas montrées : un logiciel de lecture (OCR) en a recopié le texte ci-dessous, photo par photo, dans l'ordre. Les couleurs ne sont pas rendues : une correction de la maîtresse (stylo rouge ou vert, croix, coches) peut apparaître comme du texte en plus, ou manquer. Quand tu ne sais pas si une réponse a été corrigée, mets "juste" à null. N'invente pas ce qui est illisible.

${texte}`;

async function reglerOCR(req, res) {
  const { essai = false, ocr, cle = "", oublierCle = false } = await readBody(req, 5000);
  if (!sessions.valide(req.headers["x-parent"])) return json(res, 403, { code: "parent" });
  if (ocr !== "ia" && ocr !== "mistral") return json(res, 400, { code: "bad_request" });
  const laCle = String(cle).trim();
  if (laCle && !/^[\w-]{10,300}$/.test(laCle)) return json(res, 400, { code: "bad_key_format" });
  if (oublierCle) {
    CLE_MISTRAL = ""; OCR = "ia";
    await majEnv({ MISTRAL_API_KEY: null, OCR: null });
    return json(res, 200, { ok: true, enregistre: true });
  }
  let resultat = { ok: true };
  if (ocr === "mistral") {
    const c = laCle || CLE_MISTRAL;
    if (!c) return json(res, 200, { ok: false, code: "no_key" });
    // Lister les modèles ne lit aucune page : l'essai est gratuit.
    try { await appelMistral("models", c, { delai: 15000 }); }
    catch (e) { resultat = { ok: false, code: e.code || "ocr_error" }; }
    // Une clé refusée n'est pas gardée ; Mistral injoignable, si : la connexion est peut-être seulement coupée.
    if (essai || resultat.code === "ocr_bad_key") return json(res, 200, resultat);
  } else if (essai) return json(res, 200, resultat);
  OCR = ocr;
  const env = { OCR: ocr === "mistral" ? "mistral" : null };
  if (laCle) { CLE_MISTRAL = laCle; env.MISTRAL_API_KEY = laCle; }
  await majEnv(env);
  json(res, 200, { ...resultat, enregistre: true });
}

// Les clés API se règlent à part du choix de l'IA : on les enregistre (après essai), on les teste ou on les oublie.
// Oublier la clé de l'outil en service repasse sur l'autre choix : Ollama pour l'IA, l'IA du cartable pour les photos.
async function reglerCle(req, res) {
  const { fournisseur, cle = "", essai = false, oublier = false } = await readBody(req, 5000);
  if (!sessions.valide(req.headers["x-parent"])) return json(res, 403, { code: "parent" });
  if (fournisseur !== "anthropic" && fournisseur !== "mistral") return json(res, 400, { code: "bad_request" });
  const anthropic = fournisseur === "anthropic";
  if (oublier) {
    if (anthropic) {
      client = null;
      const env = { ANTHROPIC_API_KEY: null };
      if (IA === "claude" || IA_QUICK === "claude") { IA = IA_QUICK = "ollama"; env.IA = "ollama"; env.IA_QUICK = null; }
      await majEnv(env);
    } else {
      CLE_MISTRAL = ""; OCR = "ia";
      await majEnv({ MISTRAL_API_KEY: null, OCR: null });
    }
    return json(res, 200, { ok: true, enregistre: true });
  }
  const laCle = String(cle).trim();
  if (laCle && !/^[\w-]{10,300}$/.test(laCle)) return json(res, 400, { code: "bad_key_format" });
  if (!laCle && !essai) return json(res, 200, { ok: false, code: "no_key" });
  let resultat;
  if (anthropic) resultat = await essaiIA({ ia: "claude", cle: laCle });
  else {
    const c = laCle || CLE_MISTRAL;
    if (!c) return json(res, 200, { ok: false, code: "no_key" });
    try { await appelMistral("models", c, { delai: 15000 }); resultat = { ok: true }; }
    catch (e) { resultat = { ok: false, code: e.code || "ocr_error" }; }
  }
  if (essai || !resultat.ok) return json(res, 200, resultat); // une clé n'est gardée que si elle marche
  if (anthropic) { client = clientClaude(laCle); await majEnv({ ANTHROPIC_API_KEY: laCle }); }
  else { CLE_MISTRAL = laCle; await majEnv({ MISTRAL_API_KEY: laCle }); }
  json(res, 200, { ...resultat, enregistre: true });
}

// Une ligne par appel payant, dans le terminal et dans data/consommation.log, pour voir ce qui consomme les crédits.
function noterConso(ligne) {
  console.log(ligne);
  fs.appendFile(CONSO_FILE, `${new Date().toLocaleString("fr-FR")}  ${ligne}\n`).catch(e => console.error("Journal de consommation :", e.message));
}

// Règles d'écriture (parent.mjs) : renvoie null si permis, sinon la réponse de refus.
async function verifier(req, col, id, data, suppression) {
  const verdict = autorise({
    col, id, data, suppression,
    existant: await lireDoc(col, id),
    pinDefini: !!(await lireDoc("config", "pin")),
    parent: sessions.valide(req.headers["x-parent"]),
    recompenses: col === "achats" ? (await toutLire()).recompenses : undefined,
  });
  if (!verdict) return null;
  return res => json(res, verdict === "invalide" ? 400 : 403, { code: verdict });
}

async function reglerIA(req, res) {
  const { essai = false, ia, ollamaUrl = "", ollamaModel = "", cle = "", oublierCle = false } = await readBody(req, 5000);
  if (!sessions.valide(req.headers["x-parent"])) return json(res, 403, { code: "parent" });
  if (ia !== "ollama" && ia !== "claude") return json(res, 400, { code: "bad_request" });
  let url = OLLAMA_URL;
  if (ia === "ollama") {
    try { url = lireUrlOllama(ollamaUrl || OLLAMA_LOCAL); }
    catch { return json(res, 400, { code: "bad_url" }); }
  }
  const modele = String(ollamaModel).trim() || OLLAMA_MODEL;
  const laCle = String(cle).trim();
  if (!/^[\w.:\/-]{1,100}$/.test(modele)) return json(res, 400, { code: "bad_model" });
  if (laCle && !/^[\w-]{10,300}$/.test(laCle)) return json(res, 400, { code: "bad_key_format" });
  const resultat = await essaiIA({ ia, url, modele, cle: laCle });
  // Une clé refusée n'est pas gardée ; une IA injoignable, si : l'autre ordinateur est peut-être seulement éteint.
  if (essai || (!oublierCle && ["bad_key", "no_key"].includes(resultat.code))) return json(res, 200, resultat);

  IA = IA_QUICK = ia;
  const env = { IA: ia, IA_QUICK: null };
  if (ia === "ollama") {
    OLLAMA_URL = url; OLLAMA_MODEL = modele;
    env.OLLAMA_URL = ollamaUrl ? url.origin : null;
    env.OLLAMA_MODEL = modele;
  }
  if (laCle) { client = clientClaude(laCle); env.ANTHROPIC_API_KEY = laCle; }
  else if (oublierCle) { client = null; env.ANTHROPIC_API_KEY = null; }
  await majEnv(env);
  if (ia === "ollama" && resultat.ok) verifierOllama();
  json(res, 200, { ...resultat, enregistre: true });
}

async function sampleOllama({ prompt, images, max_tokens }, send, signal) {
  const rep = await ollama("/api/chat", {
    model: OLLAMA_MODEL,
    messages: [{ role: "user", content: prompt, images: images.slice(0, MAX_IMAGES).map(im => im.data) }],
    stream: true,
    think: false, // la réflexion double le temps de réponse sur ce PC
    keep_alive: "30m",
    options: { num_ctx: OLLAMA_CTX, num_predict: max_tokens },
  }, signal);
  if (rep.statusCode !== 200) {
    let msg = ""; for await (const c of rep) msg += c;
    console.error("Ollama :", rep.statusCode, msg);
    return send({ t: "error", code: /not found/i.test(msg) ? "no_model" : "api_error" });
  }
  let buf = "", fin = null;
  for await (const c of rep) {
    buf += c;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const ligne = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!ligne) continue;
      const ev = JSON.parse(ligne);
      if (ev.error) { console.error("Ollama :", ev.error); return send({ t: "error", code: "api_error" }); }
      if (ev.message?.content) send({ t: "text", text: ev.message.content });
      if (ev.done) fin = ev;
    }
  }
  if (!fin) return send({ t: "error", code: "network" });
  send({ t: "done", truncated: fin.done_reason === "length" });
}

async function sample(req, res) {
  const { prompt, images = [], tier = "default" } = await readBody(req);
  if (typeof prompt !== "string" || !prompt) return json(res, 400, { code: "bad_request" });
  const ia = tier === "quick" ? IA_QUICK : IA;
  if (!iaPrete(ia)) return json(res, 503, { code: "no_key" });
  // Réponse en NDJSON : une ligne {t:"text"} par morceau, puis {t:"done"} ou {t:"error"}.
  res.writeHead(200, { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" });
  const send = o => res.write(JSON.stringify(o) + "\n");
  const ac = new AbortController();
  res.on("close", () => { if (!res.writableEnded) ac.abort(); });
  const t = TIERS[tier] || TIERS.default;
  let photos = images.slice(0, MAX_IMAGES), texte = prompt;
  if (photos.length && OCR === "mistral" && CLE_MISTRAL) {
    try { texte = avecTexteOCR(prompt, await lireAvecMistral(photos, ac.signal)); photos = []; }
    catch (e) {
      if (!ac.signal.aborted) { console.error("Mistral OCR :", e.message); send({ t: "error", code: e.code || "ocr_error" }); }
      return res.end();
    }
  }
  if (ia === "ollama") {
    try { await sampleOllama({ prompt: texte, images: photos, max_tokens: t.max_tokens }, send, ac.signal); }
    catch (e) {
      if (!ac.signal.aborted) { console.error("Ollama :", e.message); send({ t: "error", code: "no_ollama" }); }
    }
    return res.end();
  }
  const content = [
    ...photos.map(im => ({ type: "image", source: { type: "base64", media_type: im.media_type || "image/jpeg", data: im.data } })),
    { type: "text", text: texte },
  ];
  try {
    const stream = client.beta.messages.stream({
      model: t.model,
      max_tokens: t.max_tokens,
      thinking: { type: "adaptive" },
      output_config: { effort: t.effort },
      ...(avecRepli(t.model) ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } : {}),
      messages: [{ role: "user", content }],
    }, { signal: ac.signal });
    for await (const ev of stream) {
      if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") send({ t: "text", text: ev.delta.text });
    }
    const msg = await stream.finalMessage();
    const u = msg.usage || {};
    noterConso(`Claude ${t.model} (${tier}, effort ${t.effort}${photos.length ? `, ${photos.length} photo${photos.length > 1 ? "s" : ""}` : ""}) : ${u.input_tokens ?? "?"} jetons lus, ${u.output_tokens ?? "?"} écrits`);
    if (msg.stop_reason === "refusal") send({ t: "error", code: "refused" });
    else send({ t: "done", truncated: msg.stop_reason === "max_tokens" });
  } catch (e) {
    if (!ac.signal.aborted) { console.error("Claude :", e.message); send({ t: "error", code: codeErreur(e) }); }
  }
  res.end();
}

/* ---------- Leçons du programme et progression de l'année ---------- */
// Lues à chaque demande dans ../programme_cm1 : une leçon corrigée dans le dossier apparaît telle quelle dans le cartable.
const PROG_DIR = path.join(here, "..", "programme_cm1");
const LECONS_DIR = path.join(PROG_DIR, "lecons");
const idDe = f => path.relative(LECONS_DIR, f).replaceAll("\\", "/").replace(/\.md$/, "");

async function fichiersMd(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await fichiersMd(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function htmlLecon(md, fichier) {
  let html = marked.parse(avecSchemas(md).replace(/^# .+\n/, "").replace(/^<!--.*-->\n/m, ""));
  // Liens vers une autre leçon : ouverts dans le cartable.
  html = html.replace(/<a href="([^"]+\.md)"/g, (m, href) => {
    const id = idDe(path.resolve(path.dirname(fichier), decodeURI(href)));
    return `<a href="#" data-act="cours" data-id="${id}"`;
  });
  html = html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
  html = html.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, "</table></div>");
  // Le corrigé reste caché tant qu'on ne l'ouvre pas.
  return html.replace(/<h2>Corrigé<\/h2>([\s\S]*)$/, '<details class="corrige"><summary>Voir le corrigé</summary>$1</details>');
}

async function coursEtProgression() {
  const lecons = {};
  for (const f of await fichiersMd(LECONS_DIR)) {
    const md = await fs.readFile(f, "utf8");
    const id = idDe(f);
    const titre = (md.match(/^# (.+)$/m) || [, path.basename(f, ".md")])[1].trim();
    lecons[id] = {
      id, titre, code: titre.split(" — ")[0],
      matiere: id.split("/")[0],
      complement: id.includes("/complements/"),
      objectifs: ((md.match(/<!-- objectifs :(.*)-->/) || [, ""])[1]).trim().split(/\s+/).filter(Boolean),
      texte: md.replace(/^<!--.*-->\n/m, ""),
      html: htmlLecon(md, f),
    };
  }
  // Progression : « ## Période … », « ### Semaine N · … », puis une ligne par leçon (lien vers le fichier).
  const prog = await fs.readFile(path.join(PROG_DIR, "10_Progression_annuelle.md"), "utf8").catch(() => "");
  const periodes = [], semaines = [];
  let sem = null;
  for (const ligne of prog.split(/\r?\n/)) {
    let m;
    if ((m = ligne.match(/^## (Période (\d+).*)$/))) { periodes.push({ n: Number(m[2]), titre: m[1].replace(/\*/g, "").trim() }); sem = null; }
    else if ((m = ligne.match(/^### Semaine (\d+)/))) semaines.push(sem = { n: Number(m[1]), periode: periodes.length, items: [], notes: [] });
    else if (sem && (m = ligne.match(/\]\((lecons\/[^)]+\.md)\)/))) {
      const id = idDe(path.join(PROG_DIR, decodeURI(m[1])));
      if (lecons[id]) sem.items.push({ id, revision: /révision/i.test(ligne) });
    }
    else if (sem && (m = ligne.match(/^>\s*(.+)$/))) sem.notes.push(m[1].trim());
  }
  return { lecons, periodes, semaines };
}

/* ---------- Ouverture aux autres appareils de la maison ---------- */
// HOST=0.0.0.0 dans .env : le cartable répond aussi sur le wifi. On donne au parent les adresses à taper.
function reseauMaison() {
  const ouvert = HOST === "0.0.0.0" || HOST === "::";
  const adresses = Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === "IPv4" && !i.internal && !i.address.startsWith("169.254."))
    .map(i => i.address);
  return { ouvert, port: PORT, nom: os.hostname(), adresses };
}

/* ---------- Routes ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = decodeURIComponent(url.pathname);
  try {
    if (p === "/api/status") return json(res, 200, {
      reseau: reseauMaison(),
      ai: iaPrete(IA) && iaPrete(IA_QUICK), ia: IA, iaQuick: IA_QUICK, maxImages: MAX_IMAGES,
      ollamaUrl: OLLAMA_URL.origin, ollamaLocal: ollamaLocal(), ollamaModel: OLLAMA_MODEL, cle: !!client,
      ocr: OCR, cleMistral: !!CLE_MISTRAL,
      model: IA === "ollama" ? OLLAMA_MODEL : MODEL, modelQuick: IA_QUICK === "ollama" ? OLLAMA_MODEL : MODEL_QUICK,
    });
    if (p === "/api/db" && req.method === "GET") {
      const db = await toutLire();
      if (db.config?.pin) db.config.pin = { defini: true };
      if (db.config?.main) delete db.config.main.pin;
      return json(res, 200, db);
    }
    if (p === "/api/pin" && req.method === "POST") {
      const { pin = "", creer = false } = await readBody(req, 1000);
      const doc = await lireDoc("config", "pin");
      if (creer) {
        if (doc) return json(res, 409, { code: "deja" });
        if (!/^\d{4,8}$/.test(String(pin))) return json(res, 400, { code: "format" });
        await enregistrerPin(pin);
        return json(res, 200, { ok: true, jeton: sessions.ouvrir() });
      }
      if (!await pinCorrect(pin)) return json(res, 200, { ok: false });
      return json(res, 200, { ok: true, jeton: sessions.ouvrir() });
    }
    if (p === "/api/pin" && req.method === "DELETE") {
      sessions.fermer(req.headers["x-parent"]);
      return json(res, 200, { ok: true });
    }
    if (p === "/api/ia" && req.method === "POST") return await reglerIA(req, res);
    if (p === "/api/ocr" && req.method === "POST") return await reglerOCR(req, res);
    if (p === "/api/cle" && req.method === "POST") return await reglerCle(req, res);
    if (p === "/api/cours") return json(res, 200, await coursEtProgression());
    const m = p.match(/^\/api\/db\/([a-z]+)\/([^/]+)$/);
    if (m) {
      const [, col, id] = m;
      if (!COLS.has(col)) return json(res, 404, { code: "unknown_collection" });
      if (col === "config" && id === "pin") return json(res, 403, { code: "forbidden" });
      if (req.method === "PUT") {
        const data = await readBody(req);
        if (col === "config" && id === "main") delete data.pin; // un ancien onglet pourrait renvoyer l'ancien code en clair
        const refus = await verifier(req, col, id, data, false);
        if (refus) return refus(res);
        await ecrire(col, id, data); return json(res, 200, { ok: true });
      }
      if (req.method === "DELETE") {
        const refus = await verifier(req, col, id, undefined, true);
        if (refus) return refus(res);
        await effacer(col, id); return json(res, 200, { ok: true });
      }
    }
    if (p === "/api/sample" && req.method === "POST") return await sample(req, res);
    // Schémas proposés par Claude dans les leçons du cahier ; « dessin » (SVG brut) n'est pas permis.
    if (p === "/api/schemas" && req.method === "POST") {
      const { blocs = [] } = await readBody(req, 1e5);
      const html = (Array.isArray(blocs) ? blocs : []).slice(0, 12).map(b => {
        const type = String(b?.type || "").trim().toLowerCase(), corps = String(b?.corps || "").slice(0, 4000);
        return type === "dessin" ? "" : schema(type, corps);
      });
      return json(res, 200, { html });
    }
    if (p.startsWith("/api/")) return json(res, 404, { code: "not_found" });

    // Fichiers statiques
    const file = path.join(PUBLIC, p === "/" ? "index.html" : p);
    if (!file.startsWith(PUBLIC)) return json(res, 403, {});
    const data = await fs.readFile(file).catch(() => null);
    if (!data) { res.writeHead(404); return res.end("Introuvable"); }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) json(res, e.status || 500, { code: "server_error" });
    else res.end();
  }
});

// Fermeture (Ctrl+C, ou la fenêtre noire fermée : SIGHUP sous Windows) : on vide le journal dans le fichier.
const fermer = async () => { clearTimeout(attente); await consolider(); process.exit(0); };
for (const s of ["SIGINT", "SIGHUP", "SIGBREAK", "SIGTERM"]) process.on(s, fermer);

server.listen(PORT, HOST, () => {
  console.log(`\nExcalibur est ouvert : http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
  if (IA === "claude" || IA_QUICK === "claude")
    console.log(client ? `Claude est prêt (${MODEL}).` : "Pas de clé API : ajoute-la dans l'espace parents pour activer l'aide de Claude.");
  if (IA === "ollama" || IA_QUICK === "ollama") verifierOllama();
});

async function verifierOllama() {
  const qui = IA === IA_QUICK ? "tout" : IA === "ollama" ? "les grosses demandes" : "les petites réponses";
  try {
    const noms = await modelesOllama(OLLAMA_URL, 15000);
    if (modeleInstalle(noms, OLLAMA_MODEL)) {
      console.log(`Ollama est prêt (${OLLAMA_MODEL} sur ${OLLAMA_URL.origin}, pour ${qui}). Chargement du modèle en mémoire...`);
      // Précharge le modèle (près d'une minute sur ce PC) pour que la première question ne l'attende pas.
      // Même num_ctx que sampleOllama, sinon Ollama recharge le modèle.
      const t0 = Date.now();
      const rep = await ollama("/api/generate", { model: OLLAMA_MODEL, keep_alive: "30m", options: { num_ctx: OLLAMA_CTX } });
      for await (const _ of rep);
      console.log(`Modèle chargé en ${Math.round((Date.now() - t0) / 1000)} s.`);
    }
    else console.log(`Ollama tourne, mais le modèle ${OLLAMA_MODEL} manque. Tape : ollama pull ${OLLAMA_MODEL}`);
  } catch {
    console.log(`Ollama ne répond pas sur ${OLLAMA_URL.origin}. Lance Ollama, ou change l'adresse dans l'espace parents.`);
  }
}
