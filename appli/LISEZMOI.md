# Excalibur (le cartable de l'enfant) — version locale

L'appli tourne sur ce PC. Les données sont dans `data/cartable.duckdb` (base DuckDB, chiffrée si `DB_KEY` est rempli dans `.env`), et la clé API reste sur le PC : elle n'est jamais envoyée au navigateur.

## Première installation (une seule fois)

1. Créer une clé API sur https://platform.claude.com (rubrique **API Keys**) et ajouter un peu de crédit (rubrique **Billing**).
2. Dans ce dossier, copier `.env.example` en `.env`, puis coller la clé après `ANTHROPIC_API_KEY=`.

## Lancer le cartable

Double-cliquer sur **Demarrer le cartable.bat**. Le navigateur s'ouvre sur http://localhost:3000.
Pour arrêter, fermer la fenêtre noire.

Sans clé, tout fonctionne sauf l'aide de Claude : lecture des photos du cahier et de l'agenda, quiz et questions.

## Les deux parties

- **Ce qu'il fait en classe** (onglets *Ajouter un cours*, *Mes matières*) : on prend le cahier en photo, Claude en fait une fiche et la relie aux objectifs du programme.
- **Devoirs** : « Scanner mon agenda » : on photographie la page de l'agenda (ou une fiche de devoirs). Claude relève chaque devoir avec sa matière, son type et sa date. On vérifie la liste avant de l'ajouter. Les devoirs déjà notés ou à une date passée restent décochés. Pour un contrôle, les révisions J-3, J-2 et J-1 se planifient toutes seules.
- **Programme CM1** : tous les objectifs officiels de l'année, matière par matière. Chacun est marqué « Pas encore vu », « Vu en classe » ou « Je sais ! ». L'état change tout seul, par une leçon reliée ou par un quiz réussi à 80 % ou plus. On peut aussi le changer d'un clic. Le bouton « M'entraîner » lance un quiz sur l'objectif.

- **Mon année** : les 88 leçons du dossier `programme_cm1`, rangées semaine par semaine selon `programme_cm1/10_Progression_annuelle.md`. La semaine en cours est encadrée, et l'accueil montre les leçons de la semaine (ou celles de la rentrée pendant les vacances). Chaque leçon s'ouvre dans le cartable, avec ses exercices, un corrigé caché et un quiz. Les quiz font avancer les objectifs du programme reliés à la leçon. Pour déplacer une leçon dans l'année, il suffit de déplacer sa ligne dans `10_Progression_annuelle.md`, puis de recharger la page. Une leçon corrigée dans le dossier est aussi mise à jour tout de suite.

Sources du programme : français et maths, BO n°16 du 17 avril 2025 ; histoire-géographie, BO n°22 du 28 mai 2026. Pour les sciences et l'EMC, la liste est indicative, car le programme officiel n'est pas découpé par année.

## Depuis une tablette de la maison

Ajouter `HOST=0.0.0.0` dans `.env`, relancer, puis ouvrir `http://<nom-ou-IP-du-PC>:3000` sur la tablette.
Windows demandera d'autoriser Node.js sur le réseau privé.

## Sauvegarde

Tout est dans `data/cartable.duckdb`. Le serveur y recopie chaque modification au bout de 3 secondes, ainsi qu'au démarrage et à la fermeture. Si un fichier `cartable.duckdb.wal` traîne à côté, c'est seulement que la dernière modification a moins de 3 secondes : il sera vidé au prochain lancement. Pour une copie à la main, fermer le cartable, puis copier `data/cartable.duckdb`. Le dossier est dans OneDrive, donc il est déjà sauvegardé.

Le code est suivi par git (dossier `excalibur`). Les données, les photos et le fichier `.env` n'y sont pas. Avec `DB_KEY`, la copie OneDrive est illisible sans la clé : la noter en lieu sûr.

Au premier lancement, l'ancien `data/db.json` est repris automatiquement, puis renommé `db.json.importe`.
