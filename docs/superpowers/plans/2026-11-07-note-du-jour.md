# Note du jour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner à l'enfant une épée colorée selon son travail du jour, visible sur la page du jour et reportée chaque soir dans « Mes épées » avec un commentaire sur la dynamique.

**Architecture:** Un fichier pur `appli/public/epee.js`, sans accès à la page, calcule tout à la volée depuis la liste des quiz, sur le modèle de `semaine.js`. `index.html` mesure la durée des quiz, dessine l'épée et ajoute le sous-onglet.

**Tech Stack:** JavaScript sans dépendance, tests `node --test` (`npm test` dans `appli/`).

**Spec:** `docs/superpowers/specs/2026-11-07-note-du-jour-design.md`

## Global Constraints

- Textes en français, avec des phrases courtes et toujours encourageantes. Jamais de reproche.
- Le prénom de l'enfant ne doit pas être écrit en dur : le dépôt reste générique.
- Pas de nouvelle collection ni de donnée stockée, sauf `duree` (secondes) sur chaque quiz.
- Seuils : 3 réponses minimum, 50 %, 70 %, 85 %, 15 minutes, quiz bâclé sous 50 % et sous 12 s par question, 3 minutes maximum par question, 20 s par réponse pour un quiz sans durée, report à partir de 18 h.
- Une autre session modifie aussi `index.html`. Avant chaque commit, ajouter uniquement ses propres changements (`git add -p`, ou attendre que l'autre travail soit commité).

## Review Focus

1. Quiz du jour sans `createdAt` : l'ordre reste stable et le calcul ne plante pas. (Tâche 1)
2. Quiz à `total` 0 : ignoré, pas de division par zéro. (Tâche 1)
3. Quiz bâclé suivi d'un quiz sérieux de même taille : l'épée quitte le rouge. (Tâche 1)
4. Thème autre qu'Excalibur : accord correct (« Katana vert », « Massue verte »). (Tâche 1)
5. Quiz fini juste après minuit : compté sur `q.date`, comme le reste de l'appli. (Tâche 1)

---

### Task 1: Le calcul de la note

**Files:**
- Create: `appli/public/epee.js`
- Create: `appli/epee.test.mjs`

**Interfaces:**
- Produces, sur `globalThis` comme `semaine.js` :
  - `COULEURS_EPEE` : tableau de 5 `{id,nom,nomF,c}` (`rouge` `#e03131`, `orange` `#f76707`, `jaune` `#fab005`, `vert`/`verte` `#40c057`, `bleu`/`bleue` `#228be6`).
  - `tempsQuestion(ms): number` : `ms` plafonné à 180000.
  - `noteDuJour(tous, jour): null | {rang, couleur, nom, nomF, pct, reponses, minutes}`. `rang` 0 à 4 est le meilleur atteint, `pct` (0 à 1), `reponses` et `minutes` sont le cumul actuel.
  - `conseilEpee(note, arme): string`. `arme` vaut `{ton:'ton épée', feminin:true}`.

- [ ] **Step 1: Écrire les tests qui échouent**

Fabrique `q(score,total,o={})` : `{score,total,duree:300,date:J,createdAt:n++,termine:true,leconIds:['l'+n],niveau:'normal',...o}`, avec `J='2026-11-07'`. Chaque ligne est un `test` qui vérifie `noteDuJour(liste,J)?.couleur` :

| Quiz | Attendu |
|---|---|
| aucun | `null` (`noteDuJour` renvoie `null`) |
| `q(2,2)` | rouge (moins de 3 réponses) |
| `q(2,12,{duree:84})` | rouge (bâclé) |
| `q(12,12,{duree:48,defi:true})` | jaune (rapide mais juste, trop court) |
| `q(3,10)` | orange |
| `q(6,10,{duree:900})` | jaune |
| `q(9,10)` | jaune (moins de 15 minutes) |
| `q(8,10,{duree:900})` | vert |
| `q(9,10,{duree:900})` | bleu |
| `q(9,10,{duree:900,defi:true})` | vert (pas de vrai quiz) |
| `q(9,10,{duree:900,niveau:'facile'})` | vert |
| le même quiz, après un quiz sur la même leçon réussi à 80 % il y a 2 jours | vert |
| `q(9,10,{duree:900})`, puis `q(0,10,{duree:200})` | bleu (ne descend jamais) |
| `q(3,10)`, `q(10,10)`, `q(10,10)` | vert (remonte, 23/30 et 900 s) |
| `q(2,12,{duree:84})`, puis `q(10,12,{duree:900})` | jaune (quitte le rouge) |
| `q(40,45,{duree:undefined})` | bleu (45 × 20 s = 900 s) |
| `q(9,10,{duree:900,valide:true})` | `null` |
| `q(9,10,{duree:900,date:'2026-11-06'})` | `null` |
| `q(0,0)` | `null` |
| deux quiz sans `createdAt` | ne plante pas |

Ajoute aussi :

```js
assert.equal(tempsQuestion(200000), 180000);
assert.match(conseilEpee(noteDuJour([q(9,10)],J), {ton:'ton épée',feminin:true}), /minutes/);
assert.equal(nomEpee(noteDuJour([q(8,10,{duree:900})],J), {nom:'Massue',feminin:true}), 'Massue verte');
assert.equal(nomEpee(noteDuJour([q(8,10,{duree:900})],J), {nom:'Katana',feminin:false}), 'Katana vert');
```

- [ ] **Step 2: Vérifier l'échec**

Run: `cd appli && node --test epee.test.mjs`
Expected: FAIL, `noteDuJour is not a function`.

- [ ] **Step 3: Écrire `epee.js`**

Seuils regroupés dans une constante `SEUILS` en haut du fichier, avec un commentaire par seuil.

Algorithme de `noteDuJour` : garder les quiz `q.date===jour && q.termine && !q.valide && q.total>0`, triés par `createdAt` (0 si absent), puis pour chaque préfixe calculer le rang et garder le maximum. Pour un préfixe, dans l'ordre : `réponses<3` ou `réponses des quiz bâclés > réponses/2` donne 0 ; `pct<.5` donne 1 ; `pct<.7` ou `temps<900 s` donne 2 ; `pct>=.85` et au moins un vrai quiz donne 4 ; sinon 3.

Vrai quiz : pas `defi`, `niveau!=='facile'`, et aucun autre quiz non-défi de `tous` avec les mêmes `leconIds`, terminé plus tôt de moins de 7 jours et réussi à 80 % ou plus.

`nomEpee(note, arme)` donne `Massue verte`. `conseilEpee` choisit sa phrase selon ce qui manque : au rouge, inviter à reprendre calmement ; sous 70 %, viser la justesse ; sous 15 minutes, dire combien de minutes il reste ; au vert à 85 % ou plus, proposer un vrai quiz ; au bleu, féliciter.

- [ ] **Step 4: Vérifier le succès**

Run: `cd appli && node --test epee.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add appli/public/epee.js appli/epee.test.mjs
git commit -m "Note du jour : calcul de la couleur de l'épée"
```

### Task 2: Le report du soir et la dynamique

**Files:**
- Modify: `appli/public/epee.js`
- Modify: `appli/epee.test.mjs`

**Interfaces:**
- Consumes: `noteDuJour`.
- Produces :
  - `joursEpees(tous, aujourdhui, heure): {date, note}[]`, jours travaillés du plus récent au plus ancien.
  - `dynamique(jours, arme): string`, commentaire du haut de page, `''` si `jours` est vide.

- [ ] **Step 1: Écrire les tests qui échouent**

- `joursEpees` : avec un quiz aujourd'hui, le jour est absent à `heure=17` et présent à `heure=18`. Les jours passés sont toujours présents. Un jour sans quiz n'apparaît pas.
- `dynamique([], arme) === ''`.
- Un seul jour : le texte contient `première`.
- Sept jours à 86 % après sept à 72 % : le texte contient `72 %` et `86 %`.
- Sept jours à 72 % après sept à 86 % : le texte contient `continué` et ne contient ni `mauvais`, ni `baisse`, ni `dommage`.
- Écart de moins de 3 points : le texte contient `cap`.
- Les 3 derniers jours au vert ou mieux : le texte contient `de suite`.

- [ ] **Step 2: Vérifier l'échec**

Run: `cd appli && node --test epee.test.mjs`
Expected: FAIL, `joursEpees is not a function`.

- [ ] **Step 3: Écrire les deux fonctions dans `epee.js`**

`dynamique` compare la moyenne des `pct` des 7 derniers jours de `jours` à celle des 7 d'avant. Écart de 3 points ou plus vers le haut : phrase « Tes réponses montent : A % puis B %. » Vers le bas : « Période plus difficile, mais tu as continué. Un quiz bien posé et {arme.ton} repart ! » Sinon : « Tu tiens le cap : A % de bonnes réponses. » Ajouter une deuxième phrase si les 3 derniers jours sont au vert ou mieux : « Trois jours de suite au vert ou mieux ! »

- [ ] **Step 4: Vérifier le succès**

Run: `cd appli && node --test epee.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add appli/public/epee.js appli/epee.test.mjs
git commit -m "Note du jour : report du soir et commentaire sur la dynamique"
```

### Task 3: Durée des quiz et épée sur la page du jour

**Files:**
- Modify: `appli/public/index.html` (balise `<script>` près de `semaine.js`, `vQuiz`, `case 'suivant'`, `finirQuiz`, `suiteDefi`, `vJour`, `vVacances`, `SKINS`, feuille de style près de `.hello`)

**Interfaces:**
- Consumes: `noteDuJour`, `nomEpee`, `conseilEpee`, `tempsQuestion`.
- Produces :
  - `SK().arme = {nom, ton, feminin}` pour les 4 thèmes : épée, katana, baguette, massue.
  - `dessinEpee(couleur): string` : le SVG de l'objet du thème, `couleur` vaut `null` pour l'objet au repos en gris `#adb5bd`.
  - `carteEpee(): string` : le bloc affiché dans la carte `.hello`.

- [ ] **Step 1: Mesurer la durée**

Dans `vQuiz`, à l'affichage d'une question prête : `if(q.vu!==q.i){q.vu=q.i;q.t0=Date.now()}`. Dans `case 'suivant'`, avant de passer à la suite : `q.ms=(q.ms||0)+tempsQuestion(Date.now()-q.t0)`. Dans `finirQuiz`, ajouter `duree:Math.round((q.ms||0)/1000)` au `put`. L'attente de l'IA n'est pas comptée, car `t0` part de l'affichage de la question.

- [ ] **Step 2: Dessiner l'épée**

Réutiliser le dessin de la maquette A : lame `M33 39h14v66H33z`, halo, manche, rocher, sur `viewBox="0 0 80 130"`. Pour les autres thèmes, reprendre leur objet de `HIBOU_MANGA`, `HIBOU_FEE` et `HIBOU_DINO` avec la couleur sur la lame, la tige ou le bois.

- [ ] **Step 3: Afficher `carteEpee()` dans les cartes `.hello` de `vJour` et de `vVacances`**

Elle montre le dessin, le titre (`nomEpee`, ou « Épée au repos » si la note est `null`), et le conseil. Au repos : « Fais un quiz pour la réveiller. » La grille de `.hello` a déjà une 3e colonne `auto`. La carte reste visible sur téléphone, où la mascotte est masquée.

- [ ] **Step 4: Annoncer la montée**

Nouvelle fonction `annonceEpee(rangAvant)` : si le rang a monté, `toast("Ton épée passe au vert !")` avec le nom du thème, et `confettis()` au bleu. L'appeler à côté de `annonceMission` dans `finirQuiz` et `suiteDefi`, avec le rang lu avant le `put`.

- [ ] **Step 5: Vérifier dans l'appli**

Lancer l'appli, faire un défi éclair, puis constater que l'épée apparaît sans erreur en console, sur les 4 thèmes et à 375 px de large. Vérifier dans `/api/db` que le quiz enregistré porte `duree`.

- [ ] **Step 6: Commit**

```bash
git add -p appli/public/index.html
git commit -m "Note du jour : durée des quiz et épée sur la page du jour"
```

### Task 4: La page « Mes épées »

**Files:**
- Modify: `appli/public/index.html` (`SOUS`, `TAB_ICO`, table des vues de `render`, nouvelle fonction `vEpees`)
- Modify: `appli/LISEZMOI.md`

**Interfaces:**
- Consumes: `joursEpees`, `dynamique`, `dessinEpee`, `nomEpee`.
- Produces: la vue `epees` : sous-onglet `['epees','⚔️ Mes épées']`, entre « Mes étoiles » et « Mes notes ».

- [ ] **Step 1: Écrire `vEpees()`**

Commentaire en haut de la page, puis une ligne par jour : petit dessin, date longue, pourcentage et nom de la couleur, comme sur la maquette `mes-epees.html`. Sans aucun jour : « Ton premier quiz forgera ta première épée. »

- [ ] **Step 2: Documenter**

Ajouter à `LISEZMOI.md` un court paragraphe sur les couleurs et leurs règles, avec l'emplacement des seuils.

- [ ] **Step 3: Vérifier dans l'appli**

Run: `cd appli && npm test`
Expected: tout passe.

Ouvrir Mon trésor, puis Mes épées : les 10 jours réels s'affichent, le commentaire est présent, aucune erreur en console.

- [ ] **Step 4: Commit**

```bash
git add -p appli/public/index.html
git add appli/LISEZMOI.md
git commit -m "Note du jour : page Mes épées dans Mon trésor"
```
