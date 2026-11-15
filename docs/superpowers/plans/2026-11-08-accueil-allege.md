# Accueil allégé : plan

> **Pour les agents :** sous-skill requis : superpowers:executing-plans (ou subagent-driven-development). Cases à cocher `- [ ]`.

**But :** la page « Aujourd'hui » montre d'abord la mission, avec le code du héros en bande compacte, l'astuce et les défis éclair repliés.

**Architecture :** les petites règles d'affichage (libellés courts, ouverture des blocs) vont dans `public/accueil.js`, sur le modèle de `public/tables.js`, testées dans `accueil.test.mjs`. `vJour()` dans `public/index.html` est réécrite avec ces règles, et le CSS de la bande est ajouté dans la feuille de style de la page.

**Pile :** page HTML sans framework, `node:test`.

**Spec :** `docs/superpowers/specs/2026-11-08-accueil-allege-design.md`

## Contraintes globales

- Libellés courts : 📒 Agenda, ✏️ Devoirs, 📖 Leçon, 🎒 Cartable (ids `agenda`, `devoirs`, `relire`, `cartable`) ; le libellé complet en `title` et `aria-label`.
- Compteur du code : « n/N · +5 ⭐ ».
- Défis : repliés derrière « ⚡ Défis éclair » tant que la mission n'est pas faite ; dépliés sous « Encore envie ? Un défi éclair » une fois accomplie ; le choix de l'enfant est gardé jusqu'au rechargement.
- Astuce : `<details>` « 💡 <titre> », ouverte d'office les soirs de pause.
- Aucune règle de mission, d'étoiles ou de routine ne change. Fichiers en fins de ligne LF.

## Points à surveiller

1. **Redessin :** cocher une pastille redessine la page ; l'astuce et les défis ne doivent pas se refermer.
2. **Jours sans certaines lignes :** le mardi, la bande n'a que 2 ou 3 pastilles et le compteur suit `routineDu(t)`.
3. **Mission « vacances » ou chargement :** pendant « J'ouvre ton cartable… », les défis restent repliés.
4. **Habillages :** la bande reste lisible dans les quatre skins, en clair comme en sombre.
5. **Petit écran (375 px) :** les pastilles passent à la ligne sans débordement horizontal.

---

### Tâche 1 : règles d'affichage testées

**Fichiers :** créer `appli/public/accueil.js`, `appli/accueil.test.mjs`.

**Produit :** `globalThis.libelleCourt(id)` → `string` ; `globalThis.defisOuverts({ missionFaite, choix })` → `boolean` (`choix` vaut `true`, `false` ou `undefined`).

- [ ] Tests : `libelleCourt('agenda') === '📒 Agenda'`, idem pour `devoirs`, `relire` (📖 Leçon), `cartable` ; un id inconnu renvoie l'id. `defisOuverts` : `{missionFaite:false}` → false ; `{missionFaite:true}` → true ; `choix:true` l'emporte sur `missionFaite:false` ; `choix:false` l'emporte sur `missionFaite:true`.
- [ ] `node --test accueil.test.mjs` → échec, puis écrire `accueil.js`, puis → passe.

### Tâche 2 : la page

**Fichiers :** `appli/public/index.html` (`vJour()` vers la ligne 1925, `<script src>` vers la ligne 652, feuille de style).

- [ ] Ajouter `<script src="accueil.js"></script>` après `tables.js`.
- [ ] `state.defis` (`undefined` au départ) : l'action `defis-toggle` (sur le `summary`) l'inverse ; l'astuce garde son état dans `state.astuce` de la même façon (`undefined` = ouverte seulement si `tip.pause`).
- [ ] Réécrire `vJour()` : bande du bonjour (classe `hello mince`), mission seule sur toute la largeur (sortir du `.cols`), bande `.code-bande` de pastilles `<label class="pastille">` avec la case existante `data-act="routine"`, astuce en `<details>`, défis en `<details>` avec `open` selon `defisOuverts({missionFaite: fini, choix: state.defis})` et titre « Encore envie ? Un défi éclair » quand `fini`.
- [ ] CSS : `.hello.mince` (hibou réduit, une ligne), `.code-bande` (flex, `flex-wrap:wrap`, `gap`), `.pastille` (bord arrondi, état coché avec `--ok-bg`), sans couleur codée en dur (variables de thème).
- [ ] `npm test` → tout passe ; contrôle de syntaxe du script en ligne avec `new Function`.
- [ ] Vérifier dans le navigateur : à 800 × 600, bonjour + mission + code visibles sans défiler ; cocher une pastille garde l'astuce et les défis dans leur état ; à 375 px, pas de défilement horizontal ; un habillage clair et un sombre.
- [ ] Commit `Accueil allégé : la mission d'abord`.
