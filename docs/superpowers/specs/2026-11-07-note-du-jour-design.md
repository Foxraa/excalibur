# Note du jour : l'épée en couleurs

Design court, validé par étapes le 2026-11-07.

## Pourquoi

Donner à l'enfant une couleur pour son travail du jour, fondée surtout sur ses réponses et un peu sur le temps. Le but est qu'il ait envie de revenir : la couleur montre où il en est et comment progresser, elle ne le sanctionne pas.

## Ce qui est décidé

- **Cinq couleurs :** rouge, orange, jaune, vert, bleu.
- **Rouge :** réservé au travail bâclé ou presque inexistant. Un travail sérieux avec beaucoup d'erreurs est orange.
- **Bleu :** environ 2 jours sur 7.
- **Dessin :** l'épée dans le rocher, dont toute la lame prend la couleur du jour (maquette A).
- **Méthode :** calcul à la volée à partir des quiz enregistrés. Rien n'est stocké en plus, sauf la durée des quiz.

## Règles du calcul (mes propositions)

On prend les quiz et défis terminés du jour. Les révisions validées à la main ne comptent pas. On regarde le cumul de la journée.

Dans l'ordre :

| Couleur | Condition |
|---|---|
| Aucune (épée au repos) | Aucune réponse aujourd'hui |
| 🔴 Rouge | Moins de 3 réponses, ou plus de la moitié des réponses viennent de quiz bâclés |
| 🟠 Orange | Moins de 50 % de bonnes réponses |
| 🟡 Jaune | Moins de 70 % de bonnes réponses, ou moins de 15 minutes de travail |
| 🔵 Bleu | Au moins 85 % de bonnes réponses, 15 minutes de travail et au moins un vrai quiz |
| 🟢 Vert | Tous les autres cas |

- **Quiz bâclé :** moins de 50 % de bonnes réponses et moins de 12 secondes par question. Les deux sont nécessaires : un 12/12 très rapide sur les tables reste du vrai travail.
- **Vrai quiz :** un quiz, pas un défi, ni en mode Facile, ni déjà réussi à 80 % dans les 7 jours.
- **La couleur ne descend jamais :** l'appli rejoue les quiz du jour un par un et garde la meilleure couleur atteinte.
- **Temps de travail :** du début à la fin du quiz, sans l'attente de l'IA et avec 3 minutes maximum par question, pour qu'une pause ne compte pas. Pour les défis, on reprend la durée déjà enregistrée.
- **Réglages :** tous les seuils sont regroupés en haut du code pour les ajuster facilement. Les 15 minutes restent à vérifier sur de vrais jours.

Sur les données réelles (sans le temps, qui n'était pas mesuré) : 2 jours jaunes, 3 verts et 5 bleus sur 3 semaines, aucun rouge ni orange.

## Ce que voit l'enfant

- **Page « Aujourd'hui » et page des vacances :** l'épée à côté du « Bonjour », avec le nom de la couleur écrit en toutes lettres et une phrase qui dit quoi faire pour monter d'un cran.
- **Quand la couleur monte :** une annonce à la fin du quiz, et des confettis pour le bleu.
- **Rouge :** une phrase qui invite à reprendre calmement, jamais un reproche. Par exemple : « Prends ton temps, ton épée peut encore briller aujourd'hui. »
- **Épée au repos :** aucun message négatif. Elle est grise, avec une invitation à faire un quiz.
- **Autres thèmes :** même principe avec leur propre objet (katana, baguette, massue) et leur vocabulaire.

## La page « Mes épées » dans Mon trésor

Demandé par Rémi le 2026-11-07 : chaque soir, la couleur du jour est reportée sur une page de Mon trésor, avec un petit commentaire sur la dynamique.

- **Nouveau sous-onglet de Mon trésor :** une épée par jour travaillé, la plus récente en premier, avec la date et le nom de la couleur.
- **Report du soir (mon choix) :** le jour apparaît à partir de 18 h et continue de se mettre à jour jusqu'à minuit, car l'enfant travaille aussi le soir. Rien n'est figé : la page utilise le même calcul à la volée.
- **Commentaire sur la dynamique (mon choix) :** une ou deux phrases en haut de la page, recalculées chaque soir. Elles comparent les 7 derniers jours travaillés aux 7 d'avant : couleurs et pourcentage de bonnes réponses. Exemple : « Tes réponses montent : 72 % puis 86 %. Trois épées vertes de suite ! » Le commentaire est écrit par des règles, pas par l'IA, pour rester fiable même si Ollama est éteint.
- **Si ça baisse :** le commentaire reste encourageant et cite ce qui a tenu bon. Par exemple : « Semaine plus difficile, mais tu as continué. Un quiz bien posé et ton épée repart. »
- **Jours sans travail :** ils n'apparaissent pas et ne comptent pas contre l'enfant.
- **Jours d'avant cette fonction :** ils sont affichés aussi. Leur temps est estimé à 20 secondes par réponse, car il n'était pas mesuré.

## Ce qu'on ne fait pas

- Pas d'étoiles en plus pour une couleur : le barème reste celui des 3 règles.
- Pas d'affichage dans l'espace parents pour l'instant.
- Les devoirs cochés, le code du chevalier et les leçons relues ne changent pas la couleur : ils ne donnent aucune réponse à évaluer.
- Pas de jugement par l'IA.

## Approches envisagées

- **Calcul à la volée (retenu) :** simple, toujours exact, facile à tester. Si les seuils changent, les épées passées de « Mes épées » changent aussi.
- **Couleur figée chaque jour :** une couleur passée ne bouge plus, mais il faut une nouvelle donnée à stocker et à synchroniser.
- **Jugement par l'IA :** écarté, car la même journée pourrait recevoir deux couleurs différentes.

## Laissé au moment de construire

- Le fichier du calcul, sur le modèle de `appli/public/questions.js` et de ses tests.
- Les phrases exactes pour chaque couleur et chaque thème.
