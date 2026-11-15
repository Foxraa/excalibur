# Session parent : plan

> **Pour les agents :** sous-skill requis : superpowers:executing-plans (ou subagent-driven-development). Cases à cocher `- [ ]`.

**But :** le serveur refuse sans jeton parent les écritures réservées aux parents, et vérifie le bon sens des quiz et des notes.

**Architecture :** les règles vont dans un module pur `appli/parent.mjs` (sessions + autorisations), testé à part comme `epee.js` ou `tables.js`. `server.mjs` ne fait que brancher ces fonctions sur `/api/pin`, `/api/db` et `/api/ia`. La page reçoit le jeton, le transmet par `local.js` et annule l'affichage quand le serveur refuse.

**Pile :** Node (`node:test`, `node:crypto`), DuckDB, page HTML sans framework.

**Spec :** `docs/superpowers/specs/2026-11-08-session-parent-design.md`

## Contraintes globales

- Expiration du jeton : **15 minutes** sans requête qui le porte.
- En-tête du jeton : `x-parent`.
- Refus faute de jeton : `403 { code: "parent" }`. Document incohérent : `400 { code: "invalide" }`.
- Quiz : `score <= total` et `etoiles <= 2 * (total + 5) + 4`. Notes : `sur > 0` et `0 <= valeur <= sur`.
- Tant qu'aucun code parent n'existe, tout est permis.
- Commentaires et messages en français, dans le style du code existant.

## Points à surveiller

1. **Fin de l'accueil :** `acc-fin` écrit `config/main` puis ferme la session. L'écriture doit partir avec le jeton **avant** le `DELETE /api/pin`, sinon le cartable neuf reste bloqué sur l'accueil.
2. **Création du code :** juste après `POST /api/pin {creer:true}`, l'accueil écrit `config/main` : le jeton renvoyé à la création doit déjà servir.
3. **Refus d'une écriture :** la page ne doit pas garder l'affichage optimiste (sinon la synchro des 30 s ne le corrige jamais, puisque le cache de `local.js` n'a pas changé).
4. **Jeton expiré dans l'espace parents ouvert :** au premier refus `parent`, l'espace se ferme avec « Code parent demandé à nouveau. », sans boucle de messages.
5. **Anciennes données :** un quiz déjà enregistré qui dépasserait le plafond ne doit pas empêcher d'enregistrer autre chose (le contrôle ne porte que sur le document écrit).

---

### Tâche 1 : module `parent.mjs` (sessions et règles), testé

**Fichiers :**
- Créer : `appli/parent.mjs`
- Test : `appli/parent.test.mjs`

**Interfaces produites :**
- `creerSessions({ duree = 15 * 60e3, maintenant = Date.now } = {})` → `{ ouvrir(): string, valide(jeton): boolean, fermer(jeton): void }`. `valide` prolonge la session ; jeton = 32 octets aléatoires en hexadécimal.
- `autorise({ col, id, data, existant, parent, pinDefini, recompenses, suppression = false })` → `null` si permis, sinon `"parent"` ou `"invalide"`. `recompenses` = objet `{ id: doc }` de la collection.
- `fileUneParUne()` → `fn => Promise` : exécute les fonctions async l'une après l'autre (pour les codes essayés).

- [ ] **Étape 1 : écrire les tests qui échouent** dans `parent.test.mjs` :
  - session : `valide(ouvrir())` vrai ; faux après 15 min + 1 ms sans usage (horloge factice) ; vrai à 14 min, puis encore vrai 14 min après cet usage ; faux après `fermer` ; faux pour `""`, `undefined`, un jeton inconnu.
  - `pinDefini: false` : tout permis, y compris `recompenses` sans jeton.
  - sans jeton : `recompenses` (écriture et suppression), `config/main`, `programme/x` → `"parent"` ; `config/pin` → `"parent"` même avec jeton.
  - `achats` sans jeton : création `{ recompenseId: "r1", cout: 30, statut: "demandé" }` avec `recompenses.r1.cout === 30` → `null` ; `cout: 0` avec `palier: 10` → `null` ; `cout: 5` pour une récompense à 30 → `"parent"` ; `statut: "validé"` → `"parent"` ; document `existant` → `"parent"` ; suppression → `"parent"`. Avec jeton : passer à `validé` → `null`.
  - quiz : `{ score: 13, total: 12 }` → `"invalide"` ; `{ score: 12, total: 12, etoiles: 38 }` → `null` ; `etoiles: 39` → `"invalide"` (même avec jeton).
  - notes : `{ valeur: 21, sur: 20 }`, `{ valeur: 5, sur: 0 }`, `{ valeur: -1, sur: 20 }` → `"invalide"` ; `{ valeur: 20, sur: 20 }` → `null`.
  - autres `config` (`badges`, `etoile-jour`, `vac-…`), `devoirs`, `lecons`, `routine` sans jeton → `null`.
  - `fileUneParUne` : deux tâches lancées ensemble ne se chevauchent pas ; une tâche qui échoue ne bloque pas la suivante.
- [ ] **Étape 2 :** `cd appli && node --test parent.test.mjs` → échec (module absent).
- [ ] **Étape 3 :** écrire `parent.mjs`. Les contrôles de bon sens passent avant le test du jeton ; un quiz sans `etoiles` ou sans `total` (quiz en cours) n'est pas contrôlé sur ces champs.
- [ ] **Étape 4 :** `node --test parent.test.mjs` puis `npm test` → tout passe.
- [ ] **Étape 5 : commit** `Session parent : règles et sessions testées`.

### Tâche 2 : brancher le serveur

**Fichiers :** modifier `appli/server.mjs` (routes `/api/pin`, `/api/db/<col>/<id>`, `reglerIA`, `pinCorrect`).

**Consomme :** `creerSessions`, `autorise`, `fileUneParUne` de la tâche 1.

- [ ] **Étape 1 :** `pinCorrect` passe par `fileUneParUne()` (l'attente d'une seconde est dans la file).
- [ ] **Étape 2 :** `POST /api/pin` renvoie `{ ok: true, jeton }` si le code est bon ou vient d'être créé ; `{ ok: false }` sinon. `DELETE /api/pin` avec `x-parent` ferme la session, répond `{ ok: true }`.
- [ ] **Étape 3 :** `PUT` et `DELETE` sur `/api/db/<col>/<id>` appellent `autorise` avec `existant = lireDoc(col, id)`, `pinDefini = !!lireDoc("config","pin")`, `parent = sessions.valide(req.headers["x-parent"])`, `recompenses` lues seulement pour `achats`. Refus : `403 { code: "parent" }` ou `400 { code: "invalide" }`.
- [ ] **Étape 4 :** `reglerIA` accepte `jeton` (en-tête `x-parent`) à la place de `pin`.
- [ ] **Étape 5 : vérifier à la main** avec le serveur lancé : `curl -X PUT localhost:3000/api/db/recompenses/x -d "{}"` → 403 ; après `POST /api/pin` avec le bon code, la même requête avec `-H "x-parent: <jeton>"` → 200 (puis supprimer `x`).
- [ ] **Étape 6 : commit** `Session parent : le serveur refuse les écritures parents sans jeton`.

### Tâche 3 : la page

**Fichiers :** modifier `appli/public/local.js`, `appli/public/index.html` ; test `appli/local.test.mjs`.

**Interfaces :** `window.claude.parent` (jeton ou `null`) lu par `local.js` ; `set` et `delete` lèvent `{ code: "parent" }` sur 403 et `{ code: "invalide" }` sur 400.

- [ ] **Étape 1 : tests qui échouent** dans `local.test.mjs` : avec `window.claude.parent = "abc"`, le `PUT` porte l'en-tête `x-parent: abc` ; sans jeton, pas d'en-tête ; un 403 rejette avec `{ code: "parent" }` et laisse le cache inchangé ; un `DELETE` refusé rejette aussi et garde le document dans le cache.
- [ ] **Étape 2 :** `node --test local.test.mjs` → échec.
- [ ] **Étape 3 :** adapter `local.js` (en-tête, codes d'erreur, `delete` vérifie `r.ok`).
- [ ] **Étape 4 :** `node --test local.test.mjs` → passe.
- [ ] **Étape 5 :** dans `index.html` :
  - `state.pinParent` remplacé par `state.jeton`, recopié dans `window.claude.parent` à l'ouverture (code bon ou créé) ;
  - `put` et `del` remettent l'ancienne valeur de `S[col]` en cas d'erreur ; sur `parent`, appel de `finParent("Code parent demandé à nouveau.")` ;
  - `finParent(message)` : `state.parent=false`, jeton oublié, `DELETE /api/pin` ; utilisé par `parent-off` et `acc-fin` (qui **attend** son `put('config','main',…)` avant) ;
  - `/api/ia` envoie le jeton dans `x-parent` ;
  - sous les demandes en attente de l'espace parents, `<details>` « D'où viennent les étoiles (7 derniers jours) » listant `bilan().gains` des 7 derniers jours (date, raison, points).
- [ ] **Étape 6 :** `npm test` → tout passe.
- [ ] **Étape 7 : vérifier dans le navigateur :** ouvrir l'espace parents, changer l'habillage (accepté), fermer, puis `fetch('/api/db/config/main',{method:'PUT',body:'{}'})` dans la console → 403 ; valider une demande ; le détail des étoiles s'affiche ; aucun message d'erreur dans la console.
- [ ] **Étape 8 :** mettre à jour `appli/LISEZMOI.md` (rubrique « Le code parent » : session de 15 minutes, ce qui est protégé).
- [ ] **Étape 9 : commit** `Session parent : la page utilise le jeton`.
