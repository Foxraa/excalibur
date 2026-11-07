# Badge de quiz : plan

**Spec :** `docs/superpowers/specs/2026-11-07-badge-quiz-design.md`

**Exécution :** directe dans la session, Rémi ayant demandé « code-le ».

## Contrainte

Hors de l'écran du quiz, une fin de génération ou de vérification ne doit jamais appeler `render()`.

## Points à surveiller

- Échec de génération pendant que l'enfant est ailleurs : le badge passe en ⚠️.
- Question en attente en plein quiz : le badge le dit au lieu de « Reprendre ».
- Sur téléphone : le badge ne recouvre pas « Ajouter une photo ».
- « Réessayer » après une erreur ne déclenche pas le choix reprendre / remplacer.
- Refaire un quiz depuis l'écran de fin : pas de choix, et le retour reste valable.

## Tâche 1 : état du badge (testé)

`etatBadgeQuiz(q)` dans `public/questions.js`, renvoie `null` ou `{ico,texte,ton}`, testée dans `questions.test.mjs`.

## Tâche 2 : badge et départ libre

Dans `public/index.html` :
- `#quiz-badge` en bas à gauche, `majBadgeQuiz()` appelée par `renderHeader()` et `prepareQuestions()`.
- `q.retour` mémorise la page de départ ; action `quiz-ailleurs` et `quiz-reprendre`.
- `prepareQuestions`, `repondre` et « explique » ne redessinent que sur l'écran du quiz.

## Tâche 3 : quiz déjà en cours

`lancerQuiz` vérifie le conflit, `demarrerQuiz` lance ; `state.nouveauQuiz` affiche le choix dans `vQuiz`.

## Tâche 4 : vérification

`npm test`, puis parcours réel dans le navigateur, y compris en largeur téléphone.
