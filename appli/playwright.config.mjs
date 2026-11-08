// Test du parcours : un vrai navigateur (Edge, déjà installé sur Windows) joue le cartable de bout en bout.
// Le serveur de test tourne sur le port 3100 avec un dossier de données jetable : la vraie base n'est jamais touchée.
// L'IA est simulée dans le navigateur (voir e2e/ia-simulee.mjs) : ni Ollama ni Claude ne sont appelés.
import { defineConfig } from "@playwright/test";
import os from "node:os";
import path from "node:path";

import fs from "node:fs";

// Un dossier neuf à chaque lancement ; ceux des lancements précédents sont effacés (le serveur les tenait ouverts jusqu'au bout).
// Ce fichier est relu par chaque processus de test (TEST_WORKER_INDEX) : seul le processus principal fait le ménage,
// sinon il effacerait le dossier du serveur en cours.
if (!process.env.TEST_WORKER_INDEX)
  for (const nom of fs.readdirSync(os.tmpdir()).filter(n => n.startsWith("excalibur-e2e-")))
    try { fs.rmSync(path.join(os.tmpdir(), nom), { recursive: true, force: true }); } catch {}
const DATA_DIR = path.join(os.tmpdir(), `excalibur-e2e-${process.pid}`);

export default defineConfig({
  testDir: "e2e",
  timeout: 120_000,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: process.env.E2E_NAVIGATEUR || "msedge",
    viewport: { width: 1000, height: 800 },
    locale: "fr-FR",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:3100/api/status",
    reuseExistingServer: false,
    timeout: 60_000,
    // Les valeurs données ici l'emportent sur celles du fichier .env. OLLAMA_URL vise une adresse vide :
    // le serveur ne précharge aucun modèle, et l'IA est de toute façon simulée dans la page.
    env: { PORT: "3100", HOST: "127.0.0.1", DATA_DIR, IA: "ollama", IA_QUICK: "ollama", OLLAMA_URL: "http://127.0.0.1:9", DB_KEY: "" },
  },
});
