# NUM2 — Comparer, ranger, encadrer, arrondir
<!-- objectifs : maths-1-7 maths-1-8 maths-1-9 maths-1-10 -->

## Comparer deux nombres entiers

1. Le nombre qui a **le plus de chiffres** est le plus grand : *10 234 > 9 876*.
2. S'ils ont **autant de chiffres**, on compare **chiffre par chiffre en partant de la gauche** :
   *45 **3**12* et *45 **1**99* → 3 > 1 donc *45 312 > 45 199*.

```schema numeration
nombre: 45 312
nombre: 45 199
legende: Je compare **colonne par colonne en partant de la gauche** : 4 = 4, 5 = 5, puis **3 > 1**. Pas besoin d'aller plus loin : *45 312 > 45 199*.
```

**Les signes** : **<** plus petit que · **>** plus grand que · **=** égal
Astuce : la **pointe** est tournée vers le **plus petit** (le « bec » mange le plus grand).

## Ranger

- Ordre **croissant** : du plus petit au plus grand → *12 < 120 < 1 200*
- Ordre **décroissant** : du plus grand au plus petit → *1 200 > 120 > 12*

## Encadrer

Encadrer, c'est trouver un nombre **juste avant** et **juste après**.
- *4 563* encadré **à la dizaine** : *4 560 < 4 563 < 4 570*
- **à la centaine** : *4 500 < 4 563 < 4 600*
- **au millier** : *4 000 < 4 563 < 5 000*

```schema droite
min: 4500
max: 4600
pas: 10
4563 : 4 563
entre 4560 et 4570 : 4 560 < 4 563 < 4 570
legende: Encadrer **à la dizaine** : je cherche les deux dizaines « pleines » qui entourent 4 563.
```

## Placer sur une droite graduée

1. Je regarde **de combien en combien** on avance entre deux graduations.
2. Je compte les petits traits à partir d'un nombre connu.

```schema droite
min: 3000
max: 3300
pas: 50
etiquettes: 100
3150 : 3 150 ?
legende: Entre 3 000 et 3 100, il y a **2 petits bonds** : chaque petit trait vaut **50**. Le point est donc sur **3 150**.
```

## Arrondir

Arrondir, c'est prendre la valeur **la plus proche** dans l'encadrement.
- *4 563* arrondi à la **centaine** : il est entre 4 500 et 4 600 ; plus proche de **4 600** (car 63 > 50).
- Si on est pile au milieu (*4 550*), on arrondit **au-dessus** : **4 600**.

```schema droite
min: 4500
max: 4600
pas: 10
4563 : 4 563
4550 : milieu | gris
entre 4550 et 4600 : plus près de 4 600
legende: 4 563 est **après le milieu** (4 550) : il est plus près de **4 600**. Arrondi à la centaine : **4 600**.
```

Arrondir sert à **estimer** un calcul : *398 + 503 ≈ 400 + 500 = 900*.

## Exercices

1. Complète par < ou > : 9 999 … 10 001 · 54 320 … 54 302 · 100 000 … 99 999
2. Range dans l'ordre croissant : 7 080 · 7 800 · 708 · 7 008
3. Encadre 38 452 au millier.
4. Arrondis 12 748 à la centaine.

## Corrigé

1. < · > · >
2. 708 < 7 008 < 7 080 < 7 800
3. 38 000 < 38 452 < 39 000
4. 12 700
