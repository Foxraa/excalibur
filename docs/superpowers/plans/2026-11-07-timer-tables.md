# Timer du défi des tables : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner à chaque calcul du défi éclair des tables une limite de temps qui dépend de la période de l'année et de la difficulté du calcul, avec passage automatique à la suite.

**Architecture:** Les règles pures (limite, période, bonus) vont dans `appli/public/tables.js`, sur le modèle de `semaine.js`, et sont testées avec `node --test`. `index.html` garde l'interface : chaque question porte sa `limite`, un seul `setTimeout` par question déclenche le temps écoulé, et la barre est une animation CSS recalée sur l'heure de départ, donc un redessin ne la remet pas à zéro.

**Tech Stack:** JavaScript sans dépendance, HTML/CSS dans `index.html`, tests `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-07-timer-tables-design.md`

## Global Constraints

- Temps en secondes, colonnes 2-5-10 / 3-4 / 6-7-8-9 : P1 12-16-20, P2 10-14-18, P3 8-12-16, P4 8-10-14, P5 6-10-12.
- Le plus facile des deux nombres décide de la colonne. Le facteur 1 (7 × 1) va dans la première colonne : la spec ne le citait pas, c'est un calcul immédiat.
- Le défi d'orthographe et les quiz des leçons ne changent pas.
- Temps arrêté pendant l'affichage de la correction.
- Bonne réponse : suite après 800 ms. Mauvaise réponse ou temps écoulé : suite après 2000 ms.
- Ce qui est en cours de saisie à la fin du temps n'est pas compté.
- Bonus : 10 ou 11 bonnes réponses sur 12 donnent +4 étoiles, avant les réductions. Doublement réservé au sans-faute. Tables uniquement.
- Vacances : période de la semaine de classe précédente. Après la dernière semaine : dernière période. Progression absente ou en erreur : période 1.
- Textes affichés en français, adaptés à un enfant de CM1.
- **Données réelles :** `appli/data/cartable.duckdb` contient les vraies étoiles. Pendant les essais dans le navigateur, neutraliser `put` avant de finir un défi (`put=async()=>{}` dans la console), puis recharger la page.
- **Commits :** `index.html` contient déjà du travail non commité sur d'autres sujets. Ne pas commencer tant que ce travail n'est pas commité, sinon `git add appli/public/index.html` l'embarquerait. Vérifier avec `git diff --stat appli/public/index.html`, qui doit être vide. Repérer le code par nom de fonction, pas par numéro de ligne.

## Review Focus

- Le bouton « Arrêter » pendant un calcul : aucun passage automatique ne doit se déclencher ensuite, ni modifier un défi relancé après. Testé à la tâche 2, étape 5.
- Une synchro qui redessine la page pendant la saisie : les chiffres tapés restent et la barre ne repart pas à zéro. Testé à la tâche 2, étape 5.
- Une réponse validée au moment où le temps se termine : une seule réponse est comptée, sans saut de question. Testé à la tâche 2, étape 5.
- Le dernier calcul en temps écoulé : l'écran de résultat s'affiche, avec le calcul dans « Je revois mes erreurs ». Testé à la tâche 2, étape 5.
- Un défi lancé avant le chargement de la progression : il utilise la période 1 sans erreur. Testé à la tâche 1 (`periodeDefi(null, …)`).

---

### Task 1: Les règles de temps et de bonus

**Files:**
- Create: `appli/public/tables.js`
- Create: `appli/tables.test.mjs`
- Modify: `appli/public/index.html` (balise `<script src="tables.js">` après `semaine.js`)

**Interfaces:**
- Produces, sur `globalThis` comme `semaine.js` :
  - `limiteCalcul(a: number, b: number, periode: number) -> number` : secondes ; `periode` ramenée entre 1 et 5.
  - `periodeDefi(cours: {err?, semaines: [{n, periode}], periodes: []} | null, sd: {n, maintenant} | null) -> number`.
  - `bonusTables(score: number, total: number) -> number`.

- [ ] **Step 1: Écrire les tests qui échouent**

```js
// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/tables.js";

const { limiteCalcul, periodeDefi, bonusTables } = globalThis;
const cours = { periodes: [1, 2, 3, 4, 5], semaines: [{ n: 1, periode: 1 }, { n: 7, periode: 1 }, { n: 8, periode: 2 }, { n: 36, periode: 5 }] };

test("le temps diminue selon la période et la difficulté", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(p => [limiteCalcul(2, 3, p), limiteCalcul(3, 8, p), limiteCalcul(7, 8, p)]),
    [[12, 16, 20], [10, 14, 18], [8, 12, 16], [8, 10, 14], [6, 10, 12]]);
});
test("le plus facile des deux nombres décide, dans les deux sens", () => {
  assert.equal(limiteCalcul(2, 9, 2), 10);
  assert.equal(limiteCalcul(9, 2, 2), 10);
  assert.equal(limiteCalcul(10, 7, 2), 10);
  assert.equal(limiteCalcul(4, 7, 2), 14);
  assert.equal(limiteCalcul(7, 1, 2), 10);
});
test("une période inattendue reste dans la grille", () => {
  assert.equal(limiteCalcul(7, 8, 0), 20);
  assert.equal(limiteCalcul(7, 8, 9), 12);
});
test("la période suit la semaine de classe en cours", () => {
  assert.equal(periodeDefi(cours, { n: 8, maintenant: true }), 2);
});
test("pendant les vacances, on garde la période qui vient de finir", () => {
  assert.equal(periodeDefi(cours, { n: 8, maintenant: false }), 1);
});
test("avant la toute première semaine, c'est la période 1", () => {
  assert.equal(periodeDefi(cours, { n: 1, maintenant: false }), 1);
});
test("après la dernière semaine, c'est la dernière période", () => {
  assert.equal(periodeDefi(cours, null), 5);
});
test("sans progression, c'est la période 1", () => {
  assert.equal(periodeDefi(null, { n: 8, maintenant: true }), 1);
  assert.equal(periodeDefi({ err: true, semaines: [], periodes: [] }, null), 1);
});
test("le bonus ne vaut que pour 10 ou 11 sur 12", () => {
  assert.deepEqual([12, 11, 10, 9].map(s => bonusTables(s, 12)), [0, 4, 4, 0]);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `cd appli && node --test tables.test.mjs`
Expected: FAIL, le fichier `public/tables.js` est introuvable.

- [ ] **Step 3: Implémenter `appli/public/tables.js`**

Même forme que `semaine.js` (IIFE, `Object.assign(global,{…})`) avec un en-tête en français. La grille est une seule constante, `SECONDES`, facile à ajuster. Pour `periodeDefi`, la semaine utile est `sd.n` si `sd.maintenant`, sinon `sd.n-1`. Si aucune semaine ne correspond dans `cours.semaines`, renvoyer 1.

- [ ] **Step 4: Ajouter `<script src="tables.js"></script>` après `semaine.js` dans `index.html`**

- [ ] **Step 5: Vérifier que tout passe**

Run: `cd appli && npm test`
Expected: PASS, aucun échec.

- [ ] **Step 6: Commiter**

```bash
git add appli/public/tables.js appli/tables.test.mjs appli/public/index.html
git commit -m "Tables : règles de temps par période et par calcul"
```

### Task 2: Le défi chronométré

**Files:**
- Modify: `appli/public/index.html` (CSS `.defi`, `requestRender`, l'écouteur `focusout`, `lancerDefi`, `vDefi`, `repDefi`, `suiteDefi`)

**Interfaces:**
- Consumes: `limiteCalcul`, `periodeDefi` (tâche 1), `semaineDuJour()`, `COURS`.
- Produces :
  - `x.limite` : secondes sur chaque question des tables, absent en orthographe. C'est lui qui active le minuteur.
  - `d.debutQ` : heure de départ du calcul en cours.
  - `d.rep[i].lent === true` : temps écoulé, avec `v:''` et `ok:false`.

- [ ] **Step 1: Poser la limite au lancement**

Dans `lancerDefi`, calculer une fois `const p=periodeDefi(COURS,COURS&&semaineDuJour())` et ajouter `limite:limiteCalcul(a,b,p)` à chaque question des tables.

- [ ] **Step 2: Ajouter le minuteur**

- `armerDefi(d)` : si la question courante a une `limite`, poser `d.debutQ=Date.now()` et un `d.minuteur=setTimeout(…,limite*1000)`. L'appeler dans `lancerDefi` après `go('defi')` et dans `suiteDefi` après `d.i++`, avant `render()`, pour que la barre parte de la nouvelle heure.
- `enchainerDefi(d)` : `const i=d.i`, puis `setTimeout` de 800 ms si la réponse est bonne, sinon 2000 ms, qui appelle `suiteDefi()` seulement si `state.view==='defi'&&state.defi===d&&d.i===i&&!d.fini`.
- Le rappel du temps écoulé applique la même condition, et vérifie aussi `!d.rep[d.i]`. Il pose `d.rep[d.i]={v:'',ok:false,lent:true}`, appelle `render()` puis `enchainerDefi(d)`.
- `repDefi` : après avoir enregistré la réponse, si `x.limite`, faire `clearTimeout(d.minuteur)`, puis `render()` et `enchainerDefi(d)`.
- `suiteDefi` : garder la logique actuelle, et ajouter `lent:r.lent` dans les `reponses` enregistrées.

- [ ] **Step 3: Afficher la barre et la correction dans `vDefi`**

- Barre, seulement si `x.limite` et pas de réponse : `<div class="tempsq" role="presentation"><i style="animation-duration:${x.limite}s;animation-delay:${-(Date.now()-d.debutQ)/1000}s"></i></div>`.
- CSS : piste de 12 px de haut aux coins arrondis, `<i>` plein en `var(--accent)`, animation `linear forwards` de `scaleX(1)` à `scaleX(0)` avec `transform-origin:left`.
- Correction d'un calcul chronométré : pas de bouton « Suivant ». Si `r.lent`, le titre devient « Trop lent ! ». La bonne réponse reste affichée. Dans la grande ligne, afficher `…` à la place d'une valeur vide.
- Résultat : `d.fautes` garde `lent` (`{...x,lent:d.rep[i].lent}`), et « Je revois mes erreurs » ajoute « (trop lent) » après le calcul concerné.
- Le défi d'orthographe garde son bouton « Suivant ».

- [ ] **Step 4: Protéger le défi des redessins**

Dans `requestRender` et l'écouteur `focusout`, traiter un défi en cours comme un quiz en cours : `state.view==='defi'&&state.defi&&!state.defi.fini`.

- [ ] **Step 5: Vérifier dans le navigateur**

Lancer `preview_start {name:"cartable"}`, puis `put=async()=>{}` dans la console, puis `lancerDefi('tables',7)`. Si le défi du jour est déjà fait, neutraliser aussi `defiDuJour=()=>false`. Vérifier :

1. La barre se vide en un temps conforme à la grille, et l'orthographe n'a pas de barre (`lancerDefi('ortho')`).
2. Bonne réponse : suite seule après environ 1 s. Mauvaise réponse : bonne réponse affichée, suite après environ 2 s.
3. Temps écoulé : « Trop lent ! », puis suite seule, sans compter les chiffres tapés.
4. Taper un chiffre, lancer `requestRender()` : le chiffre reste, la barre continue.
5. Lancer `render()` forcé pendant un calcul : la barre continue au même niveau.
6. Valider à la dernière seconde : une seule réponse comptée, pas de question sautée.
7. Cliquer « Arrêter », attendre la fin du temps : rien ne se passe, aucune erreur en console.
8. Laisser expirer le dernier calcul : résultat affiché, calcul marqué « (trop lent) ».

Expected: les 8 points sont conformes et `read_console_messages {onlyErrors:true}` est vide. Recharger la page ensuite.

- [ ] **Step 6: Vérifier que les tests passent**

Run: `cd appli && npm test`
Expected: PASS, aucun échec.

- [ ] **Step 7: Commiter**

```bash
git add appli/public/index.html
git commit -m "Défi des tables : limite de temps et enchaînement automatique"
```

### Task 3: Le bonus d'étoiles et les règles affichées

**Files:**
- Modify: `appli/public/index.html` (`calculEtoiles`, commentaire des règles au-dessus, écran des règles)
- Modify: `appli/LISEZMOI.md` (ligne des étoiles et description du défi)

**Interfaces:**
- Consumes: `bonusTables(score, total)` (tâche 1).

- [ ] **Step 1: Ajouter le bonus dans `calculEtoiles`**

Juste avant la réduction « Table facile » : si `q.defi&&q.type==='tables'`, lire `bonusTables(q.score,q.total)` et, s'il est positif, l'ajouter à `pts` et pousser `Presque parfait : +4` dans `d`.

- [ ] **Step 2: Vérifier le calcul dans le navigateur**

Dans la console, avec `leconIds:['test']` pour éviter la réduction « déjà réussi » :

```js
[12,11,10,9].map(s=>calculEtoiles({defi:true,type:'tables',n:7,score:s,total:12,leconIds:['test']}).pts)
calculEtoiles({defi:true,type:'tables',n:5,score:11,total:12,leconIds:['test']}).pts
calculEtoiles({defi:true,type:'ortho',score:9,total:10,leconIds:['test']}).pts
```

Expected: `[34,20,19,14]`, puis `10`, puis `14`.

- [ ] **Step 3: Mettre à jour les textes**

- Écran des règles, après la ligne `×2` : « 10 ou 11 sur 12 aux tables : 4 étoiles en plus ».
- `LISEZMOI.md` : compléter la ligne des étoiles avec le même bonus, et indiquer que le défi des tables a une limite de temps par calcul, définie dans `appli/public/tables.js`.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `cd appli && npm test`
Expected: PASS, aucun échec.

- [ ] **Step 5: Commiter**

```bash
git add appli/public/index.html appli/LISEZMOI.md
git commit -m "Défi des tables : bonus de 4 étoiles à 10 ou 11 sur 12"
```
