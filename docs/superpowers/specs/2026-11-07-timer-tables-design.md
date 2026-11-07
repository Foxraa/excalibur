# Timer du défi éclair des tables

## Intention

Le défi des tables est trop facile : on peut prendre son temps et compter sur ses doigts. La durée s'affiche à la fin, mais elle ne change ni le déroulement ni les étoiles. Une limite par calcul doit obliger à répondre de mémoire, avec une exigence qui monte pendant l'année et qui tient compte de la difficulté du calcul.

## Objectifs

- Une limite de temps par calcul, visible sous forme de barre qui se vide.
- Un temps qui dépend de la période de l'année et de la difficulté du calcul.
- Temps écoulé : le calcul compte comme raté et la question suivante arrive toute seule.

## Hors sujet

- Le défi d'orthographe garde son fonctionnement actuel, sans timer.
- Les quiz des leçons ne changent pas.
- Pas de points qui déclinent selon la vitesse.

## À éviter

- Un défi qui devient décourageant : les temps restent généreux et une seule hésitation ne doit pas coûter plus de la moitié des étoiles.
- Un timer remis à zéro par un redessin de la page : il se calcule à partir de l'heure de départ du calcul, pas d'un compteur.

## Approches étudiées

1. **Limite puis question suivante (retenue).** Empêche vraiment de compter sur ses doigts et reste facile à comprendre pour un enfant.
2. **Points qui déclinent sans limite.** Écartée : on peut encore compter en perdant un peu, et le coût de la lenteur n'apparaît qu'à la fin.
3. **Limite et points dégressifs ensemble.** Écartée : plus de règles à expliquer, sans gain sur l'objectif.

## Temps par calcul (en secondes)

Choix de l'utilisateur : les temps de la première grille sont doublés, sur toute l'année scolaire.

| Période | Calcul avec 2, 5 ou 10 | Calcul avec 3 ou 4 | Calcul avec 6, 7, 8 ou 9 seulement |
|---|---|---|---|
| 1 | 12 | 16 | 20 |
| 2 | 10 | 14 | 18 |
| 3 | 8 | 12 | 16 |
| 4 | 8 | 10 | 14 |
| 5 | 6 | 10 | 12 |

- La colonne dépend des deux nombres du calcul : le plus facile décide. 2 × 9 est dans la première colonne, 3 × 8 dans la deuxième, 7 × 8 dans la troisième.
- Le facteur 1 (7 × 1) est dans la première colonne.
- Les valeurs sont regroupées à un seul endroit du code, pour être ajustées après des essais réels.
- Ces temps ne dépendent pas de la table du jour, puisque le défi mélange 8 calculs de cette table et 4 calculs d'autres tables.

## Déroulement

- **Bonne réponse :** elle est confirmée brièvement, puis la question suivante arrive sans cliquer.
- **Mauvaise réponse :** la bonne réponse reste affichée environ 2 secondes, puis on passe à la suite sans cliquer.
- **Temps écoulé :** même affichage, avec la mention « Trop lent ». Ce qui était en cours de saisie n'est pas compté.
- **Dernier calcul :** on arrive directement à l'écran de résultat.
- **Écran de résultat :** les calculs trop lents apparaissent dans « Je revois mes erreurs ».
- **Pendant l'affichage de la correction :** le temps est arrêté.

## Étoiles

- Le doublement reste réservé au sans-faute.
- Choix de Claude : 10 ou 11 bonnes réponses sur 12 donnent +4 étoiles, avant les réductions existantes. Sinon, 11/12 rapporterait 16 étoiles contre 34 pour 12/12.
- Ce bonus ne concerne que le défi des tables.

## Choix de Claude à vérifier

- Les délais d'enchaînement ci-dessus.
- Le bonus de +4 étoiles.
- « Fin de l'année » est compris comme la fin de l'année scolaire : le double s'applique aux 5 périodes.
- Pendant les vacances, on garde les temps de la période qui vient de se terminer.
- Si la progression n'est pas chargée, on prend les temps de la période 1.

## Laissé au développeur

- `semaineDuJour()` renvoie la semaine de classe à venir pendant les vacances (`maintenant: false`) : il faut donc prendre la semaine précédente pour obtenir la période qui vient de se terminer. Après la dernière semaine, elle renvoie `null` : on prend alors la dernière période.
- Garder le calcul de la limite dans une fonction pure, testable sans navigateur.
- Le bouton « Arrêter » garde son fonctionnement actuel : rien n'est enregistré et le défi peut être relancé avec d'autres calculs.
