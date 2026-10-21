# MES2 — Les aires
<!-- objectifs : maths-10-1 maths-10-2 maths-10-3 -->

## À retenir

L'**aire** d'une figure, c'est la **mesure de sa surface** (ce qu'il y a **à l'intérieur**).
Le **périmètre**, c'est le **tour**.

> 🖍️ Le périmètre : ce que je **repasse** au feutre autour.
> 🎨 L'aire : ce que je **colorie** à l'intérieur.

```schema dessin
taille: 520x150
legende: Même figure, deux mesures différentes : le **tour** (périmètre) et **l'intérieur** (aire).
<path class="l k-rouge" stroke-width="5" stroke-linejoin="round" fill="none" d="M20 30 H200 V80 H140 V130 H20 Z"/><text x="110" y="146" font-size="13.5" text-anchor="middle" class="t k-rouge" font-weight="700">le périmètre : le TOUR</text><path class="plein k-bleu" stroke-width="1.5" d="M300 30 H480 V80 H420 V130 H300 Z"/><text x="390" y="146" font-size="13.5" text-anchor="middle" class="t k-bleu" font-weight="700">l'aire : l'INTÉRIEUR</text>
```

## Comparer des aires

- **Superposer** : je pose une figure sur l'autre.
- **Découper et recoller** : une figure découpée et recollée autrement garde **la même aire**.
- **Compter des carreaux** : je compte combien de carreaux identiques recouvrent la figure.

```schema dessin
taille: 420x110
legende: **3 carreaux × 2 rangées = 6 carreaux.** Je numérote les carreaux pour ne pas en oublier.
<line class="grille" x1="10" x2="10" y1="10" y2="98"/><line class="grille" x1="54" x2="54" y1="10" y2="98"/><line class="grille" x1="98" x2="98" y1="10" y2="98"/><line class="grille" x1="142" x2="142" y1="10" y2="98"/><line class="grille" x1="10" x2="142" y1="10" y2="10"/><line class="grille" x1="10" x2="142" y1="54" y2="54"/><line class="grille" x1="10" x2="142" y1="98" y2="98"/><rect class="plein k-bleu" x="11" y="11" width="42" height="42" rx="2"/><text x="32.0" y="38.0" font-size="16" text-anchor="middle" font-weight="700">1</text><rect class="plein k-bleu" x="55" y="11" width="42" height="42" rx="2"/><text x="76.0" y="38.0" font-size="16" text-anchor="middle" font-weight="700">2</text><rect class="plein k-bleu" x="99" y="11" width="42" height="42" rx="2"/><text x="120.0" y="38.0" font-size="16" text-anchor="middle" font-weight="700">3</text><rect class="plein k-bleu" x="11" y="55" width="42" height="42" rx="2"/><text x="32.0" y="82.0" font-size="16" text-anchor="middle" font-weight="700">4</text><rect class="plein k-bleu" x="55" y="55" width="42" height="42" rx="2"/><text x="76.0" y="82.0" font-size="16" text-anchor="middle" font-weight="700">5</text><rect class="plein k-bleu" x="99" y="55" width="42" height="42" rx="2"/><text x="120.0" y="82.0" font-size="16" text-anchor="middle" font-weight="700">6</text><text x="170" y="50" font-size="14" text-anchor="start" font-weight="700">3 carreaux par rangée</text><text x="170" y="74" font-size="14" text-anchor="start" font-weight="700">× 2 rangées</text><text x="170" y="100" font-size="15" text-anchor="start" class="t k-vert" font-weight="700">= 6 carreaux</text>
```

## Le centimètre carré (cm²)

Un **cm²** est l'aire d'un **carré de 1 cm de côté**.
Si chaque carreau mesure 1 cm de côté, le rectangle ci-dessus a une aire de **6 cm²**.

Deux demi-carreaux font un carreau entier : un triangle qui coupe un carreau en deux vaut **½ cm²**.

```schema dessin
taille: 430x110
legende: 4 carreaux entiers (bleus) + 2 demi-carreaux (orange) = **5 carreaux**.
<line class="grille" x1="10" x2="10" y1="10" y2="98"/><line class="grille" x1="54" x2="54" y1="10" y2="98"/><line class="grille" x1="98" x2="98" y1="10" y2="98"/><line class="grille" x1="142" x2="142" y1="10" y2="98"/><line class="grille" x1="186" x2="186" y1="10" y2="98"/><line class="grille" x1="10" x2="186" y1="10" y2="10"/><line class="grille" x1="10" x2="186" y1="54" y2="54"/><line class="grille" x1="10" x2="186" y1="98" y2="98"/><rect class="plein k-bleu" x="11" y="55" width="42" height="42" rx="2"/><rect class="plein k-bleu" x="55" y="55" width="42" height="42" rx="2"/><rect class="plein k-bleu" x="99" y="55" width="42" height="42" rx="2"/><rect class="plein k-bleu" x="55" y="11" width="42" height="42" rx="2"/><polygon class="plein k-orange" points="54,10 54,54 10,54"/><polygon class="plein k-orange" points="98,10 98,54 142,54"/><text x="210" y="40" font-size="14" text-anchor="start" class="t k-bleu" font-weight="700">4 entiers</text><text x="210" y="64" font-size="14" text-anchor="start" class="t k-orange" font-weight="700">+ 2 demis = 1 entier</text><text x="210" y="92" font-size="15" text-anchor="start" class="t k-vert" font-weight="700">aire = 5 carreaux</text>
```

## Aire du rectangle (pour aller plus loin)

On compte les carreaux d'une rangée et on multiplie par le nombre de rangées :
*rectangle de 5 cm sur 3 cm → 5 × 3 = **15 cm²***.

## ⚠️ Aire et périmètre sont différents

Deux figures peuvent avoir **la même aire** et des **périmètres différents** :
- rectangle 6 × 1 : aire **6**, périmètre **14**
- rectangle 3 × 2 : aire **6**, périmètre **10**

```schema dessin
taille: 520x130
legende: Les deux rectangles ont **6 carreaux** (même aire), mais le premier a un **tour plus long** (14 contre 10).
<line class="grille" x1="10" x2="10" y1="30" y2="66"/><line class="grille" x1="46" x2="46" y1="30" y2="66"/><line class="grille" x1="82" x2="82" y1="30" y2="66"/><line class="grille" x1="118" x2="118" y1="30" y2="66"/><line class="grille" x1="154" x2="154" y1="30" y2="66"/><line class="grille" x1="190" x2="190" y1="30" y2="66"/><line class="grille" x1="226" x2="226" y1="30" y2="66"/><line class="grille" x1="10" x2="226" y1="30" y2="30"/><line class="grille" x1="10" x2="226" y1="66" y2="66"/><rect class="plein k-bleu" x="11" y="31" width="34" height="34" rx="2"/><rect class="plein k-bleu" x="47" y="31" width="34" height="34" rx="2"/><rect class="plein k-bleu" x="83" y="31" width="34" height="34" rx="2"/><rect class="plein k-bleu" x="119" y="31" width="34" height="34" rx="2"/><rect class="plein k-bleu" x="155" y="31" width="34" height="34" rx="2"/><rect class="plein k-bleu" x="191" y="31" width="34" height="34" rx="2"/><rect class="l k-rouge" fill="none" stroke-width="3.5" x="10" y="30" width="216" height="36"/><text x="118" y="92" font-size="13.5" text-anchor="middle" font-weight="700">6 × 1 : aire 6, périmètre 14</text><line class="grille" x1="330" x2="330" y1="12" y2="84"/><line class="grille" x1="366" x2="366" y1="12" y2="84"/><line class="grille" x1="402" x2="402" y1="12" y2="84"/><line class="grille" x1="438" x2="438" y1="12" y2="84"/><line class="grille" x1="330" x2="438" y1="12" y2="12"/><line class="grille" x1="330" x2="438" y1="48" y2="48"/><line class="grille" x1="330" x2="438" y1="84" y2="84"/><rect class="plein k-vert" x="331" y="13" width="34" height="34" rx="2"/><rect class="plein k-vert" x="367" y="13" width="34" height="34" rx="2"/><rect class="plein k-vert" x="403" y="13" width="34" height="34" rx="2"/><rect class="plein k-vert" x="331" y="49" width="34" height="34" rx="2"/><rect class="plein k-vert" x="367" y="49" width="34" height="34" rx="2"/><rect class="plein k-vert" x="403" y="49" width="34" height="34" rx="2"/><rect class="l k-rouge" fill="none" stroke-width="3.5" x="330" y="12" width="108" height="72"/><text x="384" y="108" font-size="13.5" text-anchor="middle" font-weight="700">3 × 2 : aire 6, périmètre 10</text>
```

## Exercices

1. Dessine sur ton cahier un rectangle de 4 carreaux sur 3. Quelle est son aire en carreaux ? Son périmètre en côtés de carreaux ?
2. Un carré de 4 cm de côté. Quelle est son aire ? Son périmètre ?
3. Vrai ou faux : si deux figures ont la même aire, elles ont le même périmètre.

## Corrigé

1. 12 carreaux · 14 côtés de carreaux
2. Aire 16 cm² · périmètre 16 cm (même nombre mais pas la même chose !)
3. Faux (voir l'exemple 6 × 1 et 3 × 2).
