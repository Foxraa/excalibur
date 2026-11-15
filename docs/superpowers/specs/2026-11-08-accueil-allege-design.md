# Accueil allégé : la mission d'abord

Design court, validé par étapes le 2026-11-08.

## Pourquoi

La page « Aujourd'hui » empile six blocs (bonjour, mission, code du héros, astuce, défis éclair, bouton photo). Le principe « une seule mission du jour » s'y perd. Le but : qu'en ouvrant le cartable, l'enfant voie d'abord ce qu'il doit faire, et que le reste soit plus compact ou replié.

## Ce qu'on ne fait pas

- Toucher aux règles de la mission, du code du héros, des étoiles ou des défis.
- Changer l'en-tête (étoiles, niveau, onglets), le bouton « Ajouter une photo » ou la page des vacances.

## Approches envisagées

- **A. Réorganiser la page (choisie).** La mission seule en grand, le code du héros en bande compacte, l'astuce et les défis repliés. Tout reste sur la même page.
- B. Tout replier en accordéon sauf la mission. Plus radical, mais le code du héros, qui rapporte des étoiles chaque soir, serait moins utilisé.
- C. Seulement réordonner les blocs. Peu de travail, mais la page reste aussi longue.

## Ce qui est décidé

1. **Bonjour en une bande mince :** hibou en petit, « Bonjour <prénom> ! », série de jours et épée du jour sur la même ligne ; la date en petit au-dessus du prénom.
2. **Mission du jour seule, sur toute la largeur,** juste sous le bonjour. Contenu et boutons inchangés.
3. **Code du héros en bande compacte sous la mission :** une pastille cochable par ligne de la routine du jour, sur une seule ligne qui passe à la ligne si l'écran est étroit, avec le compteur « n/N · +5 ⭐ ». Libellés courts (mon choix) : 📒 Agenda, ✏️ Devoirs, 📖 Leçon, 🎒 Cartable. Le libellé complet (« J'ai regardé mon agenda »…) reste dans l'infobulle et pour les lecteurs d'écran. Les jours sans certaines lignes (mardi, vendredi, samedi) gardent leurs règles actuelles.
4. **Astuce en une ligne repliable** (`<details>`) : « 💡 <titre de l'astuce> », le détail s'ouvre d'un clic. Les soirs de pause, elle est ouverte d'office.
5. **Défis éclair :**
   - mission pas encore faite : repliés derrière « ⚡ Défis éclair » ;
   - mission accomplie : dépliés d'office, sous le titre « Encore envie ? Un défi éclair ».
   L'état ouvert ou fermé choisi par l'enfant est gardé jusqu'au rechargement de la page (mon choix), pour qu'un redessin ne le referme pas.

**Résultat attendu :** sur un écran de portable (environ 800 × 600), le bonjour, la mission et le code du héros tiennent sans faire défiler.

## Laissé au constructeur

- Le style exact des pastilles et de la bande, dans les couleurs de chaque habillage (chevaliers, manga, fée, préhisto).
- Sur téléphone, les pastilles peuvent passer sur deux lignes.
