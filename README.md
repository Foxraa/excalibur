# Excalibur

Un cartable numérique de CM1 sur le thème des chevaliers. Il tourne sur un PC Windows de la maison, avec une IA installée elle aussi sur le PC (Ollama) : rien ne part sur internet.

L'enfant photographie son cahier ou son agenda : Excalibur en tire une fiche de leçon, la liste des devoirs et des quiz. Le dossier `programme_cm1` contient le programme officiel de CM1 et 88 leçons, réparties semaine par semaine.

## Installer et lancer

Il faut un PC Windows 64 bits avec au moins 10 Go libres.

1. Installer **Node.js** (version LTS) depuis https://nodejs.org.
2. Installer **Ollama** depuis https://ollama.com/download.
3. Sur cette page GitHub, cliquer sur **Code → Download ZIP**, puis décompresser le fichier où vous voulez. Gardez les dossiers `appli` et `programme_cm1` côte à côte.
4. Double-cliquer sur **`appli\Demarrer le cartable.bat`**.

Au premier lancement, les modules et le modèle d'IA (`gemma4:e4b`, plusieurs Go) se téléchargent : comptez plusieurs minutes. Le navigateur s'ouvre ensuite sur http://localhost:3000. Le prénom de l'enfant et le code parent se choisissent dans l'appli.

Pour arrêter Excalibur, fermer la fenêtre noire.

Aucun réglage n'est obligatoire. Pour les options (tablette, chiffrement de la base…), copier `appli\.env.example` en `appli\.env` et suivre les commentaires.

## En savoir plus

Le mode d'emploi complet est dans [appli/LISEZMOI.md](appli/LISEZMOI.md) : les onglets, les étoiles, la sauvegarde et la version sur clé USB, qui fonctionne sans rien installer sur le PC.
