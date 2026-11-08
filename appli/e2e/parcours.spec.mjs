// Le parcours d'un cartable neuf, joué dans Edge : accueil, page du jour, quiz, trésor, espace parents.
// Lancer avec : npm run test:parcours
import { test, expect } from "@playwright/test";
import { simulerIA } from "./ia-simulee.mjs";

// Code de test, valable seulement pour le cartable jetable de ce test.
const CODE = "4826";

test("parcours d'un cartable neuf", async ({ page }) => {
  // Un mercredi soir de classe : la mission et la routine ne dépendent pas du jour où le test tourne.
  await page.clock.setFixedTime(new Date("2026-11-18T18:30:00"));
  const ia = await simulerIA(page);
  const erreurs = [];
  page.on("pageerror", e => erreurs.push(e.message));
  const etoiles = async () => Number((await page.locator("#wallet").innerText()).match(/\d+/)[0]);
  const lire = async (col, id) => (await (await page.request.get("/api/db")).json())[col]?.[id];

  await page.goto("/");

  await test.step("accueil d'un cartable neuf", async () => {
    await expect(page.getByText("Étape 1 sur 5")).toBeVisible();
    await page.getByLabel("Code parent").fill(CODE);
    await page.getByLabel("Le même code, encore une fois").fill(CODE);
    await page.getByRole("button", { name: "Créer le code" }).click();

    await expect(page.getByText("Étape 2 sur 5")).toBeVisible();
    await page.getByLabel("Prénom de l'enfant").fill("Léo");
    await page.getByRole("button", { name: "Continuer" }).click();

    await expect(page.getByText("Étape 3 sur 5")).toBeVisible();
    await page.getByRole("button", { name: "Régler plus tard" }).click();

    // Une petite récompense en plus des suggestions, pour pouvoir la demander avec les étoiles du test.
    await expect(page.getByText("Étape 4 sur 5")).toBeVisible();
    await page.getByLabel("Une autre récompense").fill("Une image");
    await page.getByLabel("Prix en étoiles", { exact: true }).fill("10");
    await page.getByRole("button", { name: "Continuer" }).click();

    await expect(page.getByText("Étape 5 sur 5")).toBeVisible();
    await page.getByRole("button", { name: "C'est parti !" }).click();
    await expect(page.getByRole("heading", { name: /Bonjour Léo/ })).toBeVisible();
    expect(await etoiles()).toBe(0);
  });

  await test.step("un quiz depuis la mission du jour", async () => {
    await expect(page.getByText("Ma mission du jour")).toBeVisible();
    await page.getByRole("button", { name: "Ouvrir la leçon" }).click();
    await page.getByRole("button", { name: "Facile (6 questions)" }).click();
    await page.locator('[data-act="quiz-go"]').first().click();
    // Cinq bonnes réponses, puis une fausse.
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: i < 5 ? "Vrai" : "Faux", exact: true }).click();
      await page.locator('[data-act="suivant"]').click();
    }
    await expect(page.getByText("5/6")).toBeVisible();
    await expect(page.getByText("+5 étoiles", { exact: true })).toBeVisible();
    await expect.poll(etoiles).toBe(5);
  });

  await test.step("la mission accomplie et le code du héros", async () => {
    await page.getByRole("button", { name: "Retour à aujourd'hui" }).click();
    await expect(page.getByText("Mission accomplie !")).toBeVisible();
    // Une fois la mission faite, les défis éclair s'ouvrent d'eux-mêmes.
    await expect(page.locator("#defis-jour")).toHaveAttribute("open", "");
    for (const nom of ["Agenda", "Devoirs", "Leçon", "Cartable"]) await page.locator(".pastille", { hasText: nom }).click();
    await expect(page.locator(".code-bande")).toContainText("4/4");
    await expect.poll(etoiles).toBe(10);
  });

  await test.step("demander une récompense", async () => {
    await page.getByRole("button", { name: "Mon trésor", exact: true }).click();
    const ligne = page.locator(".reward, .item", { hasText: "Une image" }).first();
    await ligne.getByRole("button", { name: "Je la demande" }).click();
    await expect(page.getByText("En attente des parents")).toBeVisible();
  });

  await test.step("sans le code, le serveur refuse les écritures des parents", async () => {
    const refus = await page.request.put("/api/db/config/main", { data: { prenom: "Pirate" } });
    expect(refus.status()).toBe(403);
    const achat = Object.values((await (await page.request.get("/api/db")).json()).achats)[0];
    expect(achat.statut).toBe("demandé");
  });

  await test.step("l'espace parents : valider la demande et régler la zone", async () => {
    await page.getByRole("button", { name: "🔒 Espace parents" }).click();
    await page.getByPlaceholder("Code parent").fill(CODE);
    await page.getByRole("button", { name: "Ouvrir" }).click();

    await expect(page.getByRole("heading", { name: "À valider" })).toBeVisible();
    await expect(page.getByText("Une image")).toBeVisible();
    await page.getByRole("button", { name: "Accorder" }).click();
    await expect(page.getByText("Aucune demande en attente.")).toBeVisible();
    await expect.poll(async () => Object.values((await (await page.request.get("/api/db")).json()).achats)[0].statut).toBe("validé");

    await page.getByRole("button", { name: "⚙️ Réglages" }).click();
    await page.getByLabel("Zone de vacances").selectOption("C");
    await expect.poll(async () => (await lire("config", "main")).zone).toBe("C");

    await page.getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByPlaceholder("Code parent")).toBeVisible();
  });

  expect(erreurs).toEqual([]);
  expect(ia.inconnus).toEqual([]);
});
