# Hibou chevalier pendant les chargements — plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le crayon d'attente par le hibou chevalier animé, avec le vrai numéro de photo pendant le chargement et un compteur de secondes pendant que l'IA travaille.

**Architecture:** Tout est dans `appli/public/index.html` (script classique, rendu par `render()` qui reconstruit `app.innerHTML`). Une fonction `attente()` produit le bloc d'attente ; un seul minuteur global met à jour les éléments `[data-chrono]` chaque seconde ; le chargement des photos met à jour le DOM directement entre deux photos, sans re-rendu complet.

**Tech Stack:** HTML, CSS, JavaScript sans dépendance, SVG en ligne. Pas de framework de test dans le projet : les vérifications se font dans l'appli ouverte (`http://localhost:3000`) avec des scripts dans la page, sans écrire dans la base.

**Spec:** `docs/superpowers/specs/2026-11-03-hibou-chargement-design.md`

## Global Constraints

- Rien à télécharger : SVG et CSS en ligne dans `index.html`.
- Animation seulement sous `@media (prefers-reduced-motion:no-preference)`, comme `.pencil` et `.mascotte` aujourd'hui.
- Couleurs du hibou reprises de `MASCOTTE` (#845ef7, #7048e8, #e5dbff, #ffd43b/#f08c00, bouclier #2f6fd8) ; lisible en thème clair et sombre.
- Textes : « Je charge la photo 2 sur 4… », « Je lis tes photos… 0:12 », « J'écris ta fiche… (1 240 caractères) » (ce dernier existe déjà via `progressAdd`).
- Ni le serveur ni les demandes à l'IA ne changent.
- Pas de commit sans l'accord de l'utilisateur.

## Review Focus

- L'enfant tape une précision pendant que les photos se chargent : le texte tapé ne doit pas disparaître (pas de `render()` entre deux photos, et la précision déjà tapée est gardée au `render()` final).
- Un re-rendu pendant l'attente (mise à jour de la base) : le compteur repart de l'heure de début, jamais de 0:00.
- De nouvelles photos ajoutées pendant un chargement : ignorées, on ne dépasse jamais `maxImages`.
- Une photo illisible par le navigateur (HEIC) : `prepImage` retombe sur le fichier brut, le compteur avance quand même et le bloc d'attente disparaît.
- Une erreur de l'IA : le bloc d'attente disparaît et le message d'erreur s'affiche (chemin `busy=false` existant).

---

### Task 1: Le bloc d'attente avec le hibou et le compteur

**Files:**
- Modify: `appli/public/index.html` — CSS `.thinking`/`.pencil` (vers la ligne 415), `PENCIL` (vers 1949), les 5 blocs `.thinking` (leçon spéciale ×2, photos, sujet, agenda), les débuts d'attente (`analyser`, `scan-lire`, `sujet`, `leconSpeciale`).

**Interfaces:**
- Produces: `HIBOU` (chaîne SVG) ; `duree(ms:number) -> string` au format `m:ss` ; `attente(texte:string, o={}) -> string` où `o.debut:number` ajoute `<span data-chrono="…">` après le texte dans `[data-progress]`, et `o.charge:{i:number,n:number}` ajoute `[data-charge]` et `n` cases (les `i-1` premières pleines, la `i`-ième « en cours ») ; champ `debut:number` posé sur `state.add`, `state.scan` et `state.special` au début de l'attente.

- [ ] **Step 1:** Ajouter `HIBOU` : la mascotte en petit (environ 96×66), une épée qui frappe (rotation autour de la garde, cycle de 1,4 s) et trois notes rouges (« 3/20 », « 5/20 », « 2/10 ») qui arrivent l'une après l'autre (délais 0, 1,4 s, 2,8 s sur un cycle de 4,2 s) et éclatent au moment du coup. Supprimer `PENCIL` et le CSS `.pencil`/`@keyframes write` devenus inutiles.
- [ ] **Step 2:** Écrire `duree` et `attente`, et lancer un seul `setInterval` (1 s) qui met dans chaque `[data-chrono]` la valeur `duree(Date.now()-debut)` ; `attente` calcule déjà cette valeur au rendu, pour qu'un re-rendu ne montre jamais 0:00.
- [ ] **Step 3:** Remplacer les 5 blocs `.thinking` par `attente(...)` : photos « Je lis tes photos… » (+ petite ligne « Cela peut prendre une ou deux minutes. »), sujet « Je prépare ta fiche… », agenda « Je lis ton agenda… », leçon spéciale « J'écris ta leçon spéciale… », tous avec `debut`. Poser `debut=Date.now()` là où `busy` passe à `true`.
- [ ] **Step 4: Vérifier dans l'appli**

Dans la page : `state.add.busy=true; state.add.images=[{thumb:''}]; state.add.debut=Date.now()-65000; go('ajouter')`, puis lire le bloc.
Attendu : le hibou est affiché, le texte contient « Je lis tes photos… 1:05 », puis « 1:06 » une seconde plus tard ; aucun `.pencil` dans la page ; aucune erreur dans la console. Remettre `state.add` à zéro ensuite.

### Task 2: Le numéro de photo pendant le chargement

**Files:**
- Modify: `appli/public/index.html` — `ajouterFichiers`, `vAjouter` (bloc photos), `vScan` (bloc agenda).

**Interfaces:**
- Consumes: `attente(texte, {charge})` de la tâche 1.
- Produces: champ `charge:{i:number,n:number}|null` sur `state.add` et `state.scan` ; `majCharge(a)` qui met à jour le texte et les cases de `[data-charge]` sans `render()`.

- [ ] **Step 1:** Dans `ajouterFichiers` : si `a.charge` est déjà posé, ne rien faire ; sinon garder la précision déjà tapée (champ `add-indice` ou `scan-indice`), poser `a.charge={i:1,n:arr.length}`, `render()`, puis pour chaque photo `a.charge.i=k+1; majCharge(a)` avant `prepImage` ; dans un `finally`, `a.charge=null` et `render()`.
- [ ] **Step 2:** Afficher `attente(`Je charge la photo ${i} sur ${n}…`, {charge})` sous les miniatures dans `vAjouter` et `vScan` ; désactiver « Lire mes photos » et « Lire mes devoirs » tant que `charge` est posé.
- [ ] **Step 3: Vérifier dans l'appli**

Dans la page : fabriquer 4 images de 3000×4000 avec un `canvas` (`toBlob` → `File`), appeler `ajouterFichiers(files)` sans `await`, puis relever le texte de `[data-charge]` toutes les 50 ms jusqu'à la fin.
Attendu : les textes « photo 1 sur 4 » à « photo 4 sur 4 » apparaissent dans l'ordre, le bouton « Lire mes photos » est désactivé pendant ce temps, à la fin `state.add.images.length===4` et le bloc d'attente a disparu. Un second appel pendant le chargement ne change rien.

### Task 3: Vérification d'ensemble

- [ ] **Step 1:** Remplacer `sample` dans la page par une fausse IA lente (3 s de silence, puis du texte par morceaux, puis un JSON vide), cliquer « Lire mes photos » : le compteur avance pendant le silence, puis « J'écris ta fiche… (n caractères) » prend la place, puis l'aperçu s'affiche. Rien n'est écrit dans la base.
- [ ] **Step 2:** Vérifier que les animations sont bien sous `prefers-reduced-motion:no-preference`, que le bloc tient en largeur téléphone (375 px) et qu'il est lisible en thème sombre (capture d'écran).
- [ ] **Step 3:** Recharger la page pour effacer l'état de test.
