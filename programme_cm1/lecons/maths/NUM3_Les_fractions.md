# NUM3 — Les fractions
<!-- objectifs : maths-2-1 maths-2-2 maths-2-4 maths-2-5 maths-2-6 maths-2-7 maths-2-9 -->

## À retenir

Une **fraction** sert à dire une **partie d'un tout** partagé en **parts égales**.

> **3/4** → « trois quarts »
> - **4** (en bas) = le **dénominateur** : en combien de parts égales on a coupé l'unité
> - **3** (en haut) = le **numérateur** : combien de parts on prend

```schema dessin
taille: 520x150
legende: La barre et la pizza sont coupées en **4 parts égales** (le dénominateur) ; on en prend **3** (le numérateur) : **3/4**.
<rect class="plein k-bleu" x="20" y="40" width="70" height="60"/><rect class="plein k-bleu" x="90" y="40" width="70" height="60"/><rect class="plein k-bleu" x="160" y="40" width="70" height="60"/><rect class="vide k-bleu" x="230" y="40" width="70" height="60"/><rect class="l k-bleu" fill="none" x="20" y="40" width="280" height="60" stroke-width="3"/><text x="160" y="128" font-size="14" text-anchor="middle" font-weight="700">3/4 de la barre</text><circle class="vide k-gris" cx="420" cy="72" r="55"/><path class="plein k-orange" stroke-width="1.5" d="M420 72 L420.0 17.0 A55 55 0 0 1 475.0 72.0 Z"/><path class="plein k-orange" stroke-width="1.5" d="M420 72 L475.0 72.0 A55 55 0 0 1 420.0 127.0 Z"/><path class="plein k-orange" stroke-width="1.5" d="M420 72 L420.0 127.0 A55 55 0 0 1 365.0 72.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M420 72 L365.0 72.0 A55 55 0 0 1 420.0 17.0 Z"/><circle class="l" fill="none" cx="420" cy="72" r="55" stroke-width="2.5"/><text x="420" y="144" font-size="14" text-anchor="middle" font-weight="700">3/4 de la pizza</text>
```

### Lire une fraction

| 1/2 | 1/3 | 1/4 | 1/5 | 1/10 | 1/100 |
|---|---|---|---|---|---|
| un demi | un tiers | un quart | un cinquième | un dixième | un centième |

```schema barre
1/2 : un demi
1/3 : un tiers
1/4 : un quart
1/5 : un cinquième
1/10 : un dixième
legende: Toutes les barres ont la **même longueur**. Plus on coupe en **beaucoup** de parts, plus chaque part est **petite**.
```

Au-delà : on ajoute **-ième** → *7/8 = sept huitièmes*, *5/12 = cinq douzièmes*.

### Comparer une fraction à 1

- Numérateur **plus petit** que le dénominateur → fraction **< 1** : *3/4 < 1*
- Numérateur **égal** au dénominateur → fraction **= 1** : *4/4 = 1*
- Numérateur **plus grand** → fraction **> 1** : *5/4 > 1*

```schema barre
3/4 : plus petit que 1 | bleu
4/4 : égal à 1 | vert
5/4 : plus grand que 1 | orange
legende: Une **barre entière** = 1. Avec 5 quarts, il faut **commencer une deuxième barre**.
```

### Les fractions plus grandes que 1

*7/4 = 4/4 + 3/4 = 1 + 3/4* → on peut l'écrire comme **entier + fraction**.
Pour encadrer : *1 < 7/4 < 2*.

```schema barre
7/4 : 4/4 + 3/4 = 1 + 3/4 | violet
legende: 7 quarts : une barre **pleine** (= 1) et encore **3 quarts**.
```

### Placer sur une droite graduée

Je coupe chaque unité en autant de parts que le **dénominateur**.

```schema droite
min: 0
max: 2
graduations: 4
3/4
6/4 : 6/4 = 1 + 2/4
legende: Chaque unité est coupée en **4** (le dénominateur). Pour 3/4, j'avance de **3 petits bonds** depuis 0.
```

### Comparer des fractions de même dénominateur

C'est facile : la plus grande est celle qui a **le plus grand numérateur** : *5/8 > 3/8*.

### Comparer des fractions de même numérateur

Plus le dénominateur est **grand**, plus les parts sont **petites** : *1/10 < 1/3*.
(Une pizza coupée en 10 donne des parts plus petites qu'une pizza coupée en 3.)

```schema dessin
taille: 420x160
legende: Une part sur 3 est **bien plus grosse** qu'une part sur 10 : *1/3 > 1/10*.
<circle class="vide k-gris" cx="100" cy="70" r="55"/><path class="plein k-vert" stroke-width="1.5" d="M100 70 L100.0 15.0 A55 55 0 0 1 147.6 97.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M100 70 L147.6 97.5 A55 55 0 0 1 52.4 97.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M100 70 L52.4 97.5 A55 55 0 0 1 100.0 15.0 Z"/><circle class="l" fill="none" cx="100" cy="70" r="55" stroke-width="2.5"/><text x="100" y="148" font-size="16" text-anchor="middle" font-weight="700">1/3</text><circle class="vide k-gris" cx="310" cy="70" r="55"/><path class="plein k-rouge" stroke-width="1.5" d="M310 70 L310.0 15.0 A55 55 0 0 1 342.3 25.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L342.3 25.5 A55 55 0 0 1 362.3 53.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L362.3 53.0 A55 55 0 0 1 362.3 87.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L362.3 87.0 A55 55 0 0 1 342.3 114.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L342.3 114.5 A55 55 0 0 1 310.0 125.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L310.0 125.0 A55 55 0 0 1 277.7 114.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L277.7 114.5 A55 55 0 0 1 257.7 87.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L257.7 87.0 A55 55 0 0 1 257.7 53.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L257.7 53.0 A55 55 0 0 1 277.7 25.5 Z"/><path class="vide k-gris" stroke-width="1.5" d="M310 70 L277.7 25.5 A55 55 0 0 1 310.0 15.0 Z"/><circle class="l" fill="none" cx="310" cy="70" r="55" stroke-width="2.5"/><text x="310" y="148" font-size="16" text-anchor="middle" font-weight="700">1/10</text>
```

### Fraction d'une quantité

*1/4 de 20 bonbons* → je partage 20 en 4 : *20 ÷ 4 = 5 bonbons*.
*3/4 de 20* → *3 × 5 = 15 bonbons*.

```schema dessin
taille: 480x90
legende: Je coupe 20 en **4 parts égales** de 5. **3 parts** (en vert) font **15**.
<text x="94.0" y="33" font-size="14" text-anchor="end" font-weight="700">20 bonbons</text><g class="k-vert"><rect class="plein" x="104.0" y="10" width="90" height="34" rx="3"/><text x="149.0" y="33" font-size="14" text-anchor="middle" font-weight="700">5</text></g><g class="k-vert"><rect class="plein" x="194.0" y="10" width="90" height="34" rx="3"/><text x="239.0" y="33" font-size="14" text-anchor="middle" font-weight="700">5</text></g><g class="k-vert"><rect class="plein" x="284.0" y="10" width="90" height="34" rx="3"/><text x="329.0" y="33" font-size="14" text-anchor="middle" font-weight="700">5</text></g><g class="k-gris"><rect class="vide" x="374.0" y="10" width="90" height="34" rx="3" stroke-dasharray="5 4"/><text x="419.0" y="33" font-size="14" text-anchor="middle" class="t" font-weight="700">5</text></g><g class="k-vert"><path class="l" stroke-width="2" d="M104.0 50 v8 H464.0 v-8"/><text x="284.0" y="76" font-size="13.5" text-anchor="middle" class="t" font-weight="700">3/4 de 20 = 3 × 5 = 15</text></g>
```

## Exercices

1. Écris en lettres : 2/3 · 5/10 · 1/4
2. Plus petit, égal ou plus grand que 1 ? 6/5 · 3/3 · 2/7
3. Encadre entre deux entiers : 9/4 · 11/10
4. Range : 3/5, 1/5, 4/5, 2/5
5. Combien font 1/3 de 18 ? 2/3 de 18 ?

## Corrigé

1. deux tiers · cinq dixièmes · un quart
2. plus grand · égal · plus petit
3. 2 < 9/4 < 3 · 1 < 11/10 < 2
4. 1/5 < 2/5 < 3/5 < 4/5
5. 6 · 12
