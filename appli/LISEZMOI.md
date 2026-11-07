# Excalibur — version locale

L'appli tourne sur ce PC. L'IA est au choix : Ollama sur ce PC, Ollama sur un autre ordinateur de la maison, ou Claude avec une clé API. Avec Ollama, rien ne part sur internet. Les données sont dans `data/cartable.duckdb`.

## Première installation (une seule fois)

Au premier lancement, **Demarrer le cartable.bat** installe Node.js s'il manque (avec winget ; Windows demande d'accepter l'installation), puis demande où tourne l'IA. Si c'est sur ce PC, il installe aussi Ollama et télécharge le modèle (`gemma4:e4b`, plusieurs Go). Sinon, il n'installe rien de plus.

Un cartable vide s'ouvre sur un accueil en cinq étapes : le code parent, puis le prénom et la zone de vacances, l'IA, les récompenses, et enfin un écran qui explique les étoiles à l'enfant. Les onglets n'apparaissent qu'à la fin. Si la page est rechargée en cours de route, l'accueil reprend après le code parent.

## Lancer le cartable

Double-cliquer sur **Demarrer le cartable.bat**. Il démarre Ollama si l'IA tourne sur ce PC, puis le navigateur s'ouvre sur http://localhost:3000.
Pour arrêter, fermer la fenêtre noire.

Sur un petit PC, Ollama est lent : une question de quiz prend 30 à 40 secondes, la lecture d'une photo plusieurs minutes. Sans IA, tout fonctionne sauf la lecture des photos, les quiz et les explications.

## Choisir l'IA

Le choix se fait dans l'**espace parents**, rubrique « L'IA du cartable » (aussi à l'accueil d'un cartable neuf). Le bouton **Tester** essaie le réglage sans le garder ; **Enregistrer** l'applique tout de suite, sans relancer.

- **Ollama sur ce PC** : gratuit, rien ne sort de la maison. Si Ollama n'était pas encore installé, fermer la fenêtre noire et relancer le cartable.
- **Ollama sur le réseau** : un ordinateur plus puissant de la maison fait le travail. On donne son adresse (`192.168.1.20`, `PC-SALON`, ou une adresse complète ; le port 11434 est ajouté tout seul). Sur cet ordinateur, Ollama doit accepter le réseau : mettre la variable d'environnement `OLLAMA_HOST=0.0.0.0`, relancer Ollama et autoriser le port 11434 dans le pare-feu. Ollama n'a pas de mot de passe : à réserver au réseau de la maison.
- **Claude** : payant selon les jetons utilisés, avec une clé API créée sur [platform.claude.com](https://platform.claude.com). Plus rapide et plus fiable, surtout pour lire les photos. Les photos, les leçons et le prénom sont alors envoyés à Anthropic.

Le choix et la clé sont gardés dans `.env`. La clé ne revient jamais au navigateur et n'est pas copiée sur une clé USB. Le bouton **Oublier la clé** la retire.

## Les quatre onglets

- **Aujourd'hui** (ou **Mes vacances** pendant les vacances) : une seule mission du jour. C'est d'abord un devoir qui presse (en retard, pour aujourd'hui ou pour demain ; le mercredi, ceux de jeudi et de vendredi aussi ; le samedi et le dimanche, ceux de lundi et de mardi aussi). Les jours de classe sans devoir, c'est un défi éclair pour réviser les bases : les tables le lundi, l'orthographe le jeudi. Aux tables, chaque calcul a une limite de temps, qui dépend de la période de l'année et de la difficulté du calcul (la grille est dans `public/tables.js`). Ensuite vient une leçon à réviser, un point à retravailler ou la leçon de la semaine. Le mardi et le vendredi soir sont des soirées de pause : sans devoir qui presse, la mission est « Soirée tranquille », et l'enfant peut en demander une quand même. Une soirée de pause sans travail ne casse pas la série de jours. On trouve aussi le « code du chevalier » (son nom suit l'habillage), c'est-à-dire la routine du soir : pas de ligne cartable le mardi, le vendredi et le samedi, pas de ligne devoirs le mardi et le vendredi, et les étoiles se gagnent en cochant les lignes du jour.
- **Apprendre** :
  - *Mes leçons* : ce qu'il a fait en classe, rangé par matière. Le bouton « 📷 Ajouter une photo », en bas à droite, transforme une photo du cahier en fiche reliée aux objectifs du programme.
  - *Mon année* : les 88 leçons du dossier `programme_cm1`, semaine par semaine selon `programme_cm1/10_Progression_annuelle.md`. Pour déplacer une leçon, déplacer sa ligne dans ce fichier, puis recharger la page.
- **Devoirs** : « Scanner mon agenda » relève les devoirs sur une photo de l'agenda, et on vérifie la liste avant de l'ajouter. Pour un contrôle, les révisions J-3, J-2 et J-1 se planifient toutes seules.
- **Mon trésor** :
  - *Mes étoiles* : les récompenses et les badges ;
  - *Mes épées* : une épée par jour travaillé, avec un commentaire sur la tendance ;
  - *Mes notes* ;
  - *Espace parents* (avec un code) : valider les récompenses, choisir l'habillage du cartable, et le **programme officiel de CM1** avec ce qui est su, en bonne voie ou à retravailler.

## Les habillages

Dans l'espace parents, « Habillage du cartable » propose quatre skins :

- **Excalibur · chevaliers** (par défaut) : couronne, bouclier et épée, niveaux de Page à Légende de Camelot ;
- **Manga · héros** : planche de BD (trame de points, traits noirs épais, bulles), torii et shuriken, hibou au bandeau et au katana, niveaux de Débutant à Légende du dojo ;
- **Fée · magie** : pastels et étincelles, baguette étoilée, hibou couronné de fleurs avec des ailes, niveaux de Petite graine à Légende enchantée ;
- **Préhisto · dinosaures** : sable et dalles de pierre, petit dinosaure, hibou des cavernes avec sa massue, niveaux d'Œuf de dino à Légende de la préhistoire. L'IA rappelle si besoin que les humains n'ont pas connu les dinosaures.

Le skin change les couleurs et les formes, le logo et l'icône de l'onglet, les hiboux, le nom des niveaux et des badges, les encouragements et le ton de l'IA. Les étoiles, les niveaux atteints et les données restent les mêmes. Il y a 50 niveaux dans chaque skin : le premier coûte 150 étoiles, chaque suivant 40 de plus (54 390 étoiles au total pour le niveau 50). Atteindre le niveau N rapporte N étoiles, qui comptent pour les récompenses mais pas pour monter de niveau. Tous les 10 niveaux, l'enfant choisit une récompense offerte, que les parents valident comme les autres ; si elle est refusée, il peut en choisir une autre. Les couleurs des onglets ne changent pas, pour que l'enfant se repère toujours.

## Les étoiles

+1 par bonne réponse, +5 par chose finie, ×2 sans faute, +4 pour 10 ou 11 sur 12 au défi des tables. On gagne moitié moins pour un quiz Facile, les tables de 2, 5 ou 10, ou un quiz déjà réussi dans la semaine (le quart si déjà réussi deux fois).

## Les couleurs de l'épée

L'épée du jour va du rouge au bleu et ne redescend jamais dans la journée. Rouge : moins de 3 réponses, ou quiz bâclés. Orange : moins de 50 % de bonnes réponses. Jaune : moins de 70 %, ou moins de 15 minutes de travail. Vert : le reste. Bleu : au moins 85 % sur un vrai quiz (leçon nouvelle ou pas réussie récemment). Les défis et les quiz Faciles ne comptent pas comme vrais quiz. Dans « Mes épées », le jour même n'apparaît qu'à partir de 18 h. Tous les seuils sont en haut de `public/epee.js` (objet `SEUILS`).

## Le code parent

Il est gardé haché par le serveur. On ne peut donc pas le lire dans la page, même avec les outils du navigateur. Code oublié : supprimer la ligne `config / pin` de la base, puis en créer un nouveau.

## Les calculs des quiz

L'IA donne l'opération de chaque question de calcul, et le cartable refait le calcul lui-même. Si l'IA s'est trompée dans son corrigé, la bonne réponse est rétablie, ou la question est écartée.

## Depuis une tablette de la maison

Ajouter `HOST=0.0.0.0` dans `.env`, relancer, puis ouvrir `http://<nom-ou-IP-du-PC>:3000` sur la tablette.
Windows demandera d'autoriser Node.js sur le réseau privé.

## Sur une clé USB (autre PC, sans rien installer)

Fermer le cartable, brancher une clé en **exFAT ou NTFS** (le modèle fait 5,5 Go, trop gros pour FAT32) avec au moins 10 Go libres, puis double-cliquer sur `cle-usb\Preparer la cle USB.bat`. La clé reçoit un dossier `Excalibur` avec le cartable, les leçons, Node, Ollama et gemma. Sur l'autre PC (Windows 64 bits), double-cliquer sur `Excalibur\Demarrer Excalibur.bat`. L'Ollama de la clé utilise le port 11435 et ses propres fichiers, donc il ne gêne pas un Ollama déjà installé. Les données du cartable sont copiées, mais ensuite les deux cartables vivent chacun de leur côté. Pour une clé avec un cartable vide, lancer `preparer-cle.ps1 -SansDonnees`.

## Sauvegarde

Tout est dans `data/cartable.duckdb`. Le serveur y recopie chaque modification au bout de 3 secondes, ainsi qu'au démarrage et à la fermeture. Si un fichier `cartable.duckdb.wal` traîne à côté, c'est seulement que la dernière modification a moins de 3 secondes : il sera vidé au prochain lancement. Pour une copie à la main, fermer le cartable, puis copier `data/cartable.duckdb`. Le dossier est dans OneDrive, donc il est déjà sauvegardé.

## Repartir de zéro

Fermer le cartable, puis double-cliquer sur **Reinitialiser le cartable.bat** et taper `OUI`. Rien n'est effacé : le dossier `data` est renommé en `data-avant-reinitialisation-<date>`, et le cartable démarre vide au lancement suivant, sur l'accueil (code parent, prénom, récompenses, étoiles). Pour revenir en arrière, supprimer le nouveau dossier `data` et redonner son nom `data` à l'ancien.

Le code est suivi par git. Les données, les photos et le fichier `.env` n'y sont pas.

Sources du programme : français et maths, BO n°16 du 17 avril 2025 ; histoire-géographie, BO n°22 du 28 mai 2026. Pour les sciences et l'EMC, la liste est indicative, car le programme officiel n'est pas découpé par année.
