# Excalibur

Un cartable numérique de CM1 sur le thème des chevaliers, ou au choix en manga, en fées ou à la préhistoire avec des dinosaures. Il tourne sur un PC Windows de la maison, avec une IA installée elle aussi sur le PC (Ollama) : rien ne part sur internet.

L'enfant photographie son cahier ou son agenda : Excalibur en tire une fiche de leçon, la liste des devoirs et des quiz. Le dossier `programme_cm1` contient le programme officiel de CM1 et 88 leçons, réparties semaine par semaine.

## Installer et lancer

Il faut un PC Windows 10 ou 11 (64 bits) avec au moins 10 Go libres.

1. Sur cette page GitHub, cliquer sur **Code → Download ZIP**, puis décompresser le fichier où vous voulez. Gardez les dossiers `appli` et `programme_cm1` côte à côte.
2. Double-cliquer sur **`appli\Demarrer le cartable.bat`**.

Au premier lancement, le lanceur installe tout seul Node.js et Ollama s'ils manquent (Windows demande d'accepter l'installation de Node.js), puis télécharge les modules et le modèle d'IA (`gemma4:e4b`, plusieurs Go) : comptez plusieurs minutes. Si l'installation automatique échoue, la fenêtre indique où télécharger ce qui manque. Le navigateur s'ouvre ensuite sur http://localhost:3000. Un cartable neuf s'ouvre sur un accueil en quatre étapes. Le parent choisit d'abord le code parent, puis donne le prénom de l'enfant et la zone de vacances, et choisit les récompenses. Le dernier écran explique les étoiles à l'enfant. L'habillage se choisit ensuite dans l'espace parents.

Pour arrêter Excalibur, fermer la fenêtre noire. Pour repartir d'un cartable vide, double-cliquer sur **`appli\Reinitialiser le cartable.bat`** : l'ancien cartable est mis de côté, pas effacé.

Aucun réglage n'est obligatoire. Pour les options (tablette, chiffrement de la base…), copier `appli\.env.example` en `appli\.env` et suivre les commentaires.

## En savoir plus

Le mode d'emploi complet est dans [appli/LISEZMOI.md](appli/LISEZMOI.md) : les onglets, les étoiles, la sauvegarde et la version sur clé USB, qui fonctionne sans rien installer sur le PC.
