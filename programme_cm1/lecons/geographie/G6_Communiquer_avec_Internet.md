# G6 — Communiquer avec Internet

## À quoi sert Internet ?

**Internet** est un immense **réseau** qui relie des milliards d'ordinateurs, de téléphones et de tablettes dans le monde entier.

On l'utilise pour :
- **communiquer** : messages, mails, appels vidéo avec la famille loin ;
- **s'informer** et **apprendre** : recherches, encyclopédies, journaux, cours ;
- **se divertir** : vidéos, musique, jeux ;
- **acheter** et **vendre** en ligne ;
- faire des **démarches** (inscriptions, impôts, rendez-vous chez le médecin) ;
- **travailler** à distance.

## Comment ça marche ? Internet n'est pas « dans les airs » !

Les informations voyagent surtout par des **câbles** :
- à la maison : la **box** reliée à la **fibre optique** ou au fil de téléphone ; le **Wi-Fi** relie la box aux appareils sur quelques mètres ;
- entre les villes et les pays : des câbles enterrés ;
- entre les continents : des **câbles sous-marins** posés **au fond des océans** (plus de 500 dans le monde !).
  📌 **Marseille** est l'un des plus grands **points d'arrivée de câbles sous-marins** du monde : une quinzaine de câbles y arrivent, venant d'Afrique, du Moyen-Orient et d'Asie.
- les **antennes** relaient le réseau des téléphones portables (4G, 5G) ;
- des **satellites** autour de la Terre relient les endroits isolés (montagnes, bateaux, déserts).

```schema chaine
Ma tablette | bleu
-> Wi-Fi (quelques mètres)
La box | vert
-> fibre optique
Câbles enterrés | orange
->
Câbles sous-marins / au fond des océans (Marseille !) | bleu
->
Centre de données / des serveurs | violet
legende: Le **trajet d'une information** sur Internet : surtout par des **câbles**, pas « dans les airs ».
```

Les données sont stockées dans des **centres de données** (*data centers*) : de grands bâtiments remplis d'ordinateurs (serveurs), qui consomment beaucoup d'**électricité**. Il y en a plusieurs à Marseille.

## Un accès inégal à Internet

**Dans le monde** :
- environ **2 personnes sur 3** utilisent Internet ; mais environ **2,5 milliards** n'y ont pas accès.
- En Europe et en Amérique du Nord, presque tout le monde est connecté ; en **Afrique subsaharienne**, moins d'une personne sur deux.
- Raisons : pas de câbles ni d'antennes, pas d'électricité, appareils et abonnements trop chers.

```schema dessin
taille: 528x268
legende: Dans le monde, **2 personnes sur 3** utilisent Internet.
<circle class="p k-bleu" cx="26.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="26.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="50.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="74.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="98.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="122.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="194.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="218.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="242.0" cy="146.0" r="9"/><circle class="p k-bleu" cx="26.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="50.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="74.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="98.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="122.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="146.0" cy="170.0" r="9"/><circle class="p k-bleu" cx="170.0" cy="170.0" r="9"/><circle class="p k-gris" cx="194.0" cy="170.0" r="9"/><circle class="p k-gris" cx="218.0" cy="170.0" r="9"/><circle class="p k-gris" cx="242.0" cy="170.0" r="9"/><circle class="p k-gris" cx="26.0" cy="194.0" r="9"/><circle class="p k-gris" cx="50.0" cy="194.0" r="9"/><circle class="p k-gris" cx="74.0" cy="194.0" r="9"/><circle class="p k-gris" cx="98.0" cy="194.0" r="9"/><circle class="p k-gris" cx="122.0" cy="194.0" r="9"/><circle class="p k-gris" cx="146.0" cy="194.0" r="9"/><circle class="p k-gris" cx="170.0" cy="194.0" r="9"/><circle class="p k-gris" cx="194.0" cy="194.0" r="9"/><circle class="p k-gris" cx="218.0" cy="194.0" r="9"/><circle class="p k-gris" cx="242.0" cy="194.0" r="9"/><circle class="p k-gris" cx="26.0" cy="218.0" r="9"/><circle class="p k-gris" cx="50.0" cy="218.0" r="9"/><circle class="p k-gris" cx="74.0" cy="218.0" r="9"/><circle class="p k-gris" cx="98.0" cy="218.0" r="9"/><circle class="p k-gris" cx="122.0" cy="218.0" r="9"/><circle class="p k-gris" cx="146.0" cy="218.0" r="9"/><circle class="p k-gris" cx="170.0" cy="218.0" r="9"/><circle class="p k-gris" cx="194.0" cy="218.0" r="9"/><circle class="p k-gris" cx="218.0" cy="218.0" r="9"/><circle class="p k-gris" cx="242.0" cy="218.0" r="9"/><circle class="p k-gris" cx="26.0" cy="242.0" r="9"/><circle class="p k-gris" cx="50.0" cy="242.0" r="9"/><circle class="p k-gris" cx="74.0" cy="242.0" r="9"/><circle class="p k-gris" cx="98.0" cy="242.0" r="9"/><circle class="p k-gris" cx="122.0" cy="242.0" r="9"/><circle class="p k-gris" cx="146.0" cy="242.0" r="9"/><circle class="p k-gris" cx="170.0" cy="242.0" r="9"/><circle class="p k-gris" cx="194.0" cy="242.0" r="9"/><circle class="p k-gris" cx="218.0" cy="242.0" r="9"/><circle class="p k-gris" cx="242.0" cy="242.0" r="9"/><circle class="p k-bleu" cx="287" cy="35" r="9"/><text x="304" y="40" font-size="15" text-anchor="start" class="t k-bleu" font-weight="700">utilisent Internet</text><text x="304" y="60" font-size="13" text-anchor="start" class="mute">67 sur 100</text><circle class="p k-gris" cx="287" cy="89" r="9"/><text x="304" y="94" font-size="15" text-anchor="start" class="t k-gris" font-weight="700">n'y ont pas accès</text><text x="304" y="114" font-size="13" text-anchor="start" class="mute">33 sur 100</text>
```

**En France** :
- presque tout le monde est connecté, mais il reste des **« zones blanches »** (dans certaines campagnes et montagnes) où le réseau passe mal.
- Sur la **carte du déploiement de la 5G**, on voit que les **grandes villes** et les grands axes sont très bien couverts, alors que certaines **campagnes** et **montagnes** le sont beaucoup moins.
- Certaines personnes (âgées, ou sans argent) ne savent pas ou ne peuvent pas utiliser Internet : c'est la **fracture numérique**. C'est un problème, car beaucoup de démarches se font en ligne.

📍 **Repères** : les câbles sous-marins sont très **concentrés** dans l'Atlantique Nord (entre l'Europe et l'Amérique du Nord), en Méditerranée et autour de l'Asie de l'Est. Une aire **très bien reliée** : l'Europe ou l'Amérique du Nord. Une aire **faiblement reliée** : l'Afrique subsaharienne.

## Bien utiliser Internet

Voir [EMC4 — Internet, les médias et les écrans](../emc/EMC4_Internet_et_ecrans.md) : vérifier les informations, protéger ses données personnelles, limiter les écrans.

## Exercices

1. Cite 3 usages d'Internet.
2. Par où passent la plupart des informations entre l'Europe et l'Afrique ?
3. Pourquoi Marseille est-elle importante pour Internet ?
4. Qu'est-ce qu'une zone blanche ?

## Corrigé

1. Communiquer, s'informer, se divertir, acheter, faire des démarches, travailler…
2. Par des câbles sous-marins.
3. Parce que de nombreux câbles sous-marins y arrivent et qu'il y a des centres de données.
4. Un endroit où le réseau Internet ou téléphone ne passe pas (ou très mal).
