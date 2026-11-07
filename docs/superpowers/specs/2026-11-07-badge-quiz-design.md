# Badge de quiz dans le coin

## Pourquoi

La génération des questions est lente avec l'IA locale. L'enfant doit pouvoir faire autre chose pendant qu'elles se préparent, voir où ça en est, et revenir au quiz d'un clic.

## Buts

- Laisser l'enfant quitter l'écran du quiz pendant la préparation, sans rien perdre.
- Montrer l'avancement sur toutes les pages.
- Revenir au quiz d'un clic, là où on en était.

## Hors sujet

- Le quiz ne survit pas à un rechargement de la page (comme aujourd'hui).
- Les défis éclair ne changent pas.
- Un seul quiz à la fois.

## À éviter absolument

Redessiner une page pendant que l'enfant y écrit : ses saisies seraient effacées.

## Approches

- **Badge flottant dans le coin (retenue, choix de Rémi).** Toujours visible, mise à jour limitée au badge.
- Onglet « Quiz » dans le menu : menu changeant et plus chargé sur petit écran.
- Préparation côté serveur : survivrait au rechargement, mais chaque question dépend des réponses déjà données, donc trop de logique à déplacer.

## Fonctionnement

**Au lancement (choix de Rémi : « Leçon, puis libre »).** L'écran d'attente avec la leçon à relire reste le premier écran. Il gagne un bouton « Faire autre chose en attendant », qui ramène à la page d'où le quiz a été lancé.

**En plein quiz.** L'écran « Je prépare la question suivante » gagne le même bouton.

**Le badge.** En bas à gauche, le coin bas droit étant pris par « Ajouter une photo ». Il s'affiche sur toutes les pages sauf l'écran du quiz et l'écran d'accueil de première ouverture, dès qu'un quiz n'est pas terminé. Un clic ouvre le quiz.

| Situation | Texte du badge |
|---|---|
| Rien de prêt | ⏳ Je prépare ton quiz… |
| Questions en préparation, quiz pas commencé | ⏳ Quiz : 3/8 prêtes (la première suffit à commencer) |
| Toutes prêtes, quiz pas commencé | ✅ Ton quiz est prêt ! |
| Quiz commencé, question suivante prête | ▶️ Reprendre mon quiz (question 4/8) |
| Quiz commencé, question suivante pas encore prête | ⏳ Question 4/8 en préparation… |
| Échec de la préparation | ⚠️ Quiz : un souci, appuie ici |

**Quand c'est prêt.** Si l'enfant est ailleurs au moment où la première question arrive, un message rapide le prévient une seule fois.

**Nouveau quiz alors qu'un autre est en cours.** Un écran demande de choisir entre reprendre le quiz en cours et le remplacer. Il n'apparaît pas si le quiz en cours n'a encore aucune réponse et porte sur la même leçon : on le rouvre simplement.

## Laissé à l'appréciation du développeur (choix de Claude)

- Un bouton « Annuler » n'est pas ajouté au badge : on annule depuis l'écran du quiz.
- Wording exact et style du badge, en suivant les thèmes existants.
- Quand l'enfant est hors de l'écran du quiz, la fin d'une génération ne met à jour que le badge, jamais la page.
