# Hibou chevalier pendant les chargements

## Pourquoi

Quand l'enfant ajoute des photos puis appuie sur « Lire mes photos », rien ne montre
que ça avance : un petit crayon et un texte figé, alors que gemma peut mettre une à
deux minutes avant d'écrire. Il faut voir que l'appli travaille, et savoir quelle
photo est en train de se charger.

## Ce qu'on fait

- Le crayon d'attente est remplacé par le hibou d'Excalibur (la mascotte de la page
  d'accueil) qui tranche avec son épée des mauvaises notes rouges (« 3/20 », « 5/20 »…).
- **Chargement des photos** (bouton photo et scan de l'agenda) : « Je charge la photo
  2 sur 4… » avec une case par photo qui se remplit. C'est le vrai numéro : chaque
  photo est réduite l'une après l'autre. Le bouton « Lire mes photos » attend la fin
  du chargement.
- **Pendant que l'IA lit** : « Je lis tes photos… 0:12 », un compteur de secondes qui
  avance même quand gemma ne dit rien, puis « J'écris ta fiche… (1 240 caractères) »
  dès qu'il écrit.
- Le même hibou partout où l'IA travaille : photos, agenda, leçon à partir d'un sujet,
  leçon spéciale.

## Ce qu'on ne fait pas

- Pas de numéro de photo pendant la lecture par l'IA : elle lit toutes les photos d'un
  coup, et on garde ainsi le regroupement des pages d'une même leçon (choix des
  parents). Pas de fausse progression.
- Rien ne change côté serveur ni dans ce qu'on demande à l'IA.

## Contraintes

- Rien à télécharger : dessin SVG et animation CSS dans `index.html`, comme la mascotte.
- Lisible en thème clair et sombre.
- Si Windows demande de réduire les animations, le hibou reste immobile et seuls les
  textes changent.
- Pas plus lourd pour le PC que le crayon actuel (animation CSS simple).

## Façons envisagées

- **La roue** : un cercle qui tourne. Simple, mais sans surprise.
- **Le hibou chevalier** (retenu) : l'idée des parents, avec la mascotte que l'enfant
  connaît déjà, pour rendre l'attente drôle.

## Laissé au choix de celui qui construit

Le dessin exact du hibou et de l'épée, la vitesse de l'animation, les notes qui
défilent et la formulation des textes.
