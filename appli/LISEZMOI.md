# Excalibur (le cartable de l'enfant) — version locale

L'appli tourne sur ce PC, avec une IA installée elle aussi sur ce PC (Ollama) : rien ne part sur internet. Les données sont dans `data/cartable.duckdb`.

## Première installation (une seule fois)

1. Installer Ollama depuis https://ollama.com/download.
2. Dans ce dossier, copier `.env.example` en `.env` et y mettre `IA=ollama`.

Au premier lancement, le modèle (`gemma4:e4b`, plusieurs Go) se télécharge tout seul.

## Lancer le cartable

Double-cliquer sur **Demarrer le cartable.bat**. Il démarre Ollama si besoin, puis le navigateur s'ouvre sur http://localhost:3000.
Pour arrêter, fermer la fenêtre noire.

L'IA de ce PC est lente : une question de quiz prend 30 à 40 secondes, la lecture d'une photo plusieurs minutes. Sans Ollama, tout fonctionne sauf la lecture des photos, les quiz et les explications.

## Les quatre onglets

- **Aujourd'hui** (ou **Mes vacances** pendant les vacances) : une seule mission du jour. C'est d'abord un devoir qui presse, sinon une leçon à réviser, un point à retravailler ou la leçon de la semaine. On trouve aussi le « code du chevalier », c'est-à-dire la routine du soir.
- **Apprendre** :
  - *Mes leçons* : ce qu'il a fait en classe, rangé par matière. Le bouton « 📷 Ajouter une photo », en bas à droite, transforme une photo du cahier en fiche reliée aux objectifs du programme.
  - *Mon année* : les 88 leçons du dossier `programme_cm1`, semaine par semaine selon `programme_cm1/10_Progression_annuelle.md`. Pour déplacer une leçon, déplacer sa ligne dans ce fichier, puis recharger la page.
- **Devoirs** : « Scanner mon agenda » relève les devoirs sur une photo de l'agenda, et on vérifie la liste avant de l'ajouter. Pour un contrôle, les révisions J-3, J-2 et J-1 se planifient toutes seules.
- **Mon trésor** :
  - *Mes étoiles* : les récompenses et les badges ;
  - *Mes notes* ;
  - *Espace parents* (avec un code) : valider les récompenses, et le **programme officiel de CM1** avec ce qui est su, en bonne voie ou à retravailler.

## Les étoiles

+1 par bonne réponse, +5 par chose finie, ×2 sans faute. On gagne moitié moins pour un quiz Facile, les tables de 2, 5 ou 10, ou un quiz déjà réussi dans la semaine (le quart si déjà réussi deux fois).

## Le code parent

Il est gardé haché par le serveur. On ne peut donc pas le lire dans la page, même avec les outils du navigateur. Code oublié : supprimer la ligne `config / pin` de la base, puis en créer un nouveau.

## Les calculs des quiz

L'IA donne l'opération de chaque question de calcul, et le cartable refait le calcul lui-même. Si l'IA s'est trompée dans son corrigé, la bonne réponse est rétablie, ou la question est écartée.

## Depuis une tablette de la maison

Ajouter `HOST=0.0.0.0` dans `.env`, relancer, puis ouvrir `http://<nom-ou-IP-du-PC>:3000` sur la tablette.
Windows demandera d'autoriser Node.js sur le réseau privé.

## Sur une clé USB (autre PC, sans rien installer)

Fermer le cartable, brancher une clé en **exFAT ou NTFS** (le modèle fait 5,5 Go, trop gros pour FAT32) avec au moins 10 Go libres, puis double-cliquer sur `cle-usb\Preparer la cle USB.bat`. La clé reçoit un dossier `Excalibur` avec le cartable, les leçons, Node, Ollama et gemma. Sur l'autre PC (Windows 64 bits), double-cliquer sur `Excalibur\Demarrer Excalibur.bat`. L'Ollama de la clé utilise le port 11435 et ses propres fichiers, donc il ne gêne pas un Ollama déjà installé. Les données de l'enfant sont copiées, mais ensuite les deux cartables vivent chacun de leur côté. Pour une clé avec un cartable vide, lancer `preparer-cle.ps1 -SansDonnees`.

## Sauvegarde

Tout est dans `data/cartable.duckdb`. Le serveur y recopie chaque modification au bout de 3 secondes, ainsi qu'au démarrage et à la fermeture. Si un fichier `cartable.duckdb.wal` traîne à côté, c'est seulement que la dernière modification a moins de 3 secondes : il sera vidé au prochain lancement. Pour une copie à la main, fermer le cartable, puis copier `data/cartable.duckdb`. Le dossier est dans OneDrive, donc il est déjà sauvegardé.

Le code est suivi par git (dossier `excalibur`). Les données, les photos et le fichier `.env` n'y sont pas.

Sources du programme : français et maths, BO n°16 du 17 avril 2025 ; histoire-géographie, BO n°22 du 28 mai 2026. Pour les sciences et l'EMC, la liste est indicative, car le programme officiel n'est pas découpé par année.
