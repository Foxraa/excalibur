# Session parent : le serveur protège ce qui est réservé aux parents

Design court, validé par étapes le 2026-11-08.

## Pourquoi

Aujourd'hui, c'est la page qui cache les boutons réservés aux parents. Le serveur, lui, enregistre tout ce qu'on lui envoie par `PUT /api/db` : une simple requête suffit pour valider une récompense, changer un prix ou modifier les réglages, sans le code parent. Le but est que le serveur refuse lui-même ces actions sans le code, pour que l'enfant ne puisse pas les contourner en bidouillant.

## Ce qu'on ne fait pas

- **Recalculer les étoiles sur le serveur.** Ce serait un gros chantier (garder les quiz côté serveur, recopier toute l'économie), pour un gain limité : les devoirs faits, la routine et les notes restent des cases cochées ou des valeurs tapées que personne ne peut vérifier, sauf un parent. Le vrai garde-fou reste la validation de chaque récompense par le parent.
- **Protéger contre les autres appareils du réseau ou les autres sites web.** C'est un sujet à part (option `HOST=0.0.0.0`, en-têtes `Host` et `Origin`).

## Approches envisagées

- **A. Jeton de session (choisi).** Le code parent correct donne un jeton tiré au hasard, gardé en mémoire par la page et joint aux actions parents. Il expire après 15 minutes sans activité, ou dès qu'on ferme l'espace parents. Le code ne reste plus dans la page.
- B. Envoyer le code à chaque action parent, comme le réglage de l'IA aujourd'hui. Plus simple, mais le code reste en mémoire dans la page et il n'y a pas d'expiration.
- C. Des routes dédiées aux parents. Plus propre sur le papier, mais il faudrait réécrire une dizaine d'actions qui marchent déjà, pour le même résultat.

## Ce qui est décidé

### La session

- `POST /api/pin` avec le bon code (ou à la création du code) renvoie `{ ok: true, jeton }`. Le jeton fait 32 octets aléatoires et n'est gardé qu'en mémoire sur le serveur : un redémarrage du cartable oblige à retaper le code.
- La page joint le jeton dans l'en-tête `x-parent` de ses écritures pendant que l'espace parents est ouvert.
- **Expiration :** 15 minutes sans requête qui porte le jeton. Fermer l'espace parents (ou finir l'accueil) appelle `DELETE /api/pin` pour l'effacer tout de suite.
- **Le réglage de l'IA** (`POST /api/ia`) prend le jeton au lieu du code. La page ne garde plus `pinParent`.
- **Codes essayés un par un :** les vérifications du code passent l'une après l'autre, pour que l'attente d'une seconde par erreur tienne même avec des essais en parallèle.
- **Cartable neuf :** tant qu'aucun code parent n'existe, tout reste permis, pour ne pas bloquer l'accueil.

### Ce qui demande le jeton

| Collection | Sans jeton | Avec jeton |
|---|---|---|
| `recompenses` | refusé (création, modification, suppression) | permis |
| `achats` | seulement **créer** une demande neuve, au statut `demandé`, dont le coût est celui de la récompense (ou 0 pour un cadeau de niveau) | tout permis (valider, refuser…) |
| `config/main` (prénom, zone, habillage, accueil) | refusé | permis |
| `programme` (états du programme officiel) | refusé | permis |
| `config/pin` | refusé | refusé (comme aujourd'hui) |
| autres (`quiz`, `devoirs`, `lecons`, `notes`, `routine`, autres `config`) | permis, avec les contrôles ci-dessous | permis |

Un refus renvoie `403 { code: "parent" }`.

### Contrôles de bon sens, même sans jeton

- **Quiz :** le score ne dépasse pas le total, et les étoiles ne dépassent pas `2 × (total + 5) + 4` (le maximum que permettent les règles : sans faute et bonus des tables).
- **Notes :** le barème est positif et la note ne le dépasse pas.
- Un document refusé renvoie `400 { code: "invalide" }`.

### La page

- **Refus du serveur :** la page remet le changement affiché comme avant (relecture de la collection), et pour un `403 parent` ferme l'espace parents avec le message « Code parent demandé à nouveau ».
- **Détail des étoiles à la validation (mon choix) :** sous les demandes en attente, dans l'espace parents, la liste repliable des étoiles gagnées depuis 7 jours, tirée de `bilan().gains`. Un bond suspect se voit au moment de valider.

## Laissé au constructeur

- Le découpage du code serveur (une fonction `autorise(col, id, data, existant, parent)` testable à part est recommandée).
- Les tests : règles d'autorisation, expiration du jeton, contrôles de bon sens.
