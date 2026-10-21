# CALC4 — La division
<!-- objectifs : maths-5-6 maths-1-12 maths-1-13 -->

## Ce qu'est une division

Diviser, c'est **partager en parts égales** ou chercher **combien de fois** un nombre est dans un autre.
- *Je partage 24 billes entre 4 enfants* → chacun en a **6** → *24 ÷ 4 = 6*.

```schema dessin
taille: 394x100
legende: 24 billes partagées entre **4 enfants** : chacun en a **6**. *24 ÷ 4 = 6*.
<rect class="f k-gris" x="14" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="33.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="55.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="77.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="33.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="55.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="77.0" cy="55.0" r="8"/><text x="55.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">enfant 1</text><rect class="f k-gris" x="108" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="127.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="149.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="171.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="127.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="149.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="171.0" cy="55.0" r="8"/><text x="149.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">enfant 2</text><rect class="f k-gris" x="202" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="221.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="243.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="265.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="221.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="243.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="265.0" cy="55.0" r="8"/><text x="243.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">enfant 3</text><rect class="f k-gris" x="296" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="315.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="337.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="359.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="315.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="337.0" cy="55.0" r="8"/><circle class="p k-bleu" cx="359.0" cy="55.0" r="8"/><text x="337.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">enfant 4</text>
```

- *Combien de boîtes de 6 œufs pour 30 œufs ?* → **5** boîtes → *30 ÷ 6 = 5*.

La division est l'**inverse de la multiplication** : *6 × 4 = 24* donc *24 ÷ 4 = 6*.

## La division euclidienne : quotient et reste

Parfois, ça ne tombe pas juste : il y a un **reste**.
*17 bonbons pour 5 enfants* → 3 chacun, et il en reste 2.

```schema dessin
taille: 562x78
legende: 17 bonbons pour 5 enfants : **3 chacun**, et il en **reste 2** (pas assez pour en redonner un à chacun).
<rect class="f k-gris" x="14" y="14" width="82" height="38" rx="8"/><circle class="p k-vert" cx="33.0" cy="33.0" r="8"/><circle class="p k-vert" cx="55.0" cy="33.0" r="8"/><circle class="p k-vert" cx="77.0" cy="33.0" r="8"/><text x="55.0" y="70" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">1</text><rect class="f k-gris" x="108" y="14" width="82" height="38" rx="8"/><circle class="p k-vert" cx="127.0" cy="33.0" r="8"/><circle class="p k-vert" cx="149.0" cy="33.0" r="8"/><circle class="p k-vert" cx="171.0" cy="33.0" r="8"/><text x="149.0" y="70" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">2</text><rect class="f k-gris" x="202" y="14" width="82" height="38" rx="8"/><circle class="p k-vert" cx="221.0" cy="33.0" r="8"/><circle class="p k-vert" cx="243.0" cy="33.0" r="8"/><circle class="p k-vert" cx="265.0" cy="33.0" r="8"/><text x="243.0" y="70" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">3</text><rect class="f k-gris" x="296" y="14" width="82" height="38" rx="8"/><circle class="p k-vert" cx="315.0" cy="33.0" r="8"/><circle class="p k-vert" cx="337.0" cy="33.0" r="8"/><circle class="p k-vert" cx="359.0" cy="33.0" r="8"/><text x="337.0" y="70" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">4</text><rect class="f k-gris" x="390" y="14" width="82" height="38" rx="8"/><circle class="p k-vert" cx="409.0" cy="33.0" r="8"/><circle class="p k-vert" cx="431.0" cy="33.0" r="8"/><circle class="p k-vert" cx="453.0" cy="33.0" r="8"/><text x="431.0" y="70" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">5</text><circle class="p k-rouge" cx="513.0" cy="33.0" r="8"/><circle class="p k-rouge" cx="535.0" cy="33.0" r="8"/><g class="k-rouge"><text x="524.0" y="70" font-size="12.5" text-anchor="middle" class="t" font-weight="700">reste</text></g>
```

> **17 = (5 × 3) + 2**
> - 17 est le **dividende**
> - 5 est le **diviseur**
> - 3 est le **quotient**
> - 2 est le **reste**

⚠️ Le **reste est toujours plus petit que le diviseur** (sinon on pourrait encore donner une part à chacun).

## La division posée (diviseur à 1 chiffre)

**Exemple : 745 ÷ 3**

```schema operation
calcul: 745 : 3
legende: Les flèches violettes montrent les chiffres que l'on **abaisse**. Quotient **248** (en vert), reste **1** (en rouge).
```

1. **Combien de chiffres au quotient ?** 7 centaines ÷ 3 → au moins 1 centaine → le quotient a **3 chiffres** (c, d, u). Je trace 3 petits traits.
2. **Centaines** : dans 7, combien de fois 3 ? → **2** (car 3 × 2 = 6). 7 − 6 = **1**.
3. J'**abaisse** le 4 → **14**. Dans 14, combien de fois 3 ? → **4** (3 × 4 = 12). 14 − 12 = **2**.
4. J'abaisse le 5 → **25**. Dans 25, combien de fois 3 ? → **8** (3 × 8 = 24). 25 − 24 = **1**.
5. **Quotient : 248, reste : 1**.

**Vérification** : *(3 × 248) + 1 = 744 + 1 = 745* ✅

### Quand le premier chiffre est trop petit

*256 ÷ 4* : dans 2, pas de 4 → je prends **25** (dizaines) → le quotient a **2 chiffres**.
25 ÷ 4 = 6 reste 1 → j'abaisse le 6 → 16 ÷ 4 = 4 → **quotient 64, reste 0**.

```schema operation
calcul: 256 : 4
legende: Dans 2, pas de 4 : je commence avec **25**. Le quotient n'a que **2 chiffres**.
```

### Quand un chiffre du quotient est 0

*612 ÷ 3* : 6 ÷ 3 = 2 · j'abaisse 1 → dans 1, 0 fois 3 → j'écris **0** au quotient · j'abaisse 2 → 12 ÷ 3 = 4 → **204**.
⚠️ Ne pas oublier le **0** !

```schema operation
calcul: 612 : 3
legende: Après avoir abaissé le 1 : dans 1, **0 fois** 3. J'écris **0** au quotient, puis j'abaisse le 2.
```

## Bien utiliser le reste dans un problème

*Il faut transporter 26 élèves dans des voitures de 4 places.* → 26 = (4 × 6) + 2 → il faut **7 voitures** (les 2 élèves restants ont besoin d'une voiture en plus).

```schema dessin
taille: 676x100
legende: 6 voitures pleines, et une **7e voiture** pour les 2 derniers élèves (2 places restent vides).
<rect class="f k-gris" x="14" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="33.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="55.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="77.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="33.0" cy="55.0" r="8"/><text x="55.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">1</text><rect class="f k-gris" x="108" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="127.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="149.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="171.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="127.0" cy="55.0" r="8"/><text x="149.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">2</text><rect class="f k-gris" x="202" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="221.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="243.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="265.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="221.0" cy="55.0" r="8"/><text x="243.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">3</text><rect class="f k-gris" x="296" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="315.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="337.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="359.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="315.0" cy="55.0" r="8"/><text x="337.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">4</text><rect class="f k-gris" x="390" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="409.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="431.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="453.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="409.0" cy="55.0" r="8"/><text x="431.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">5</text><rect class="f k-gris" x="484" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="503.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="525.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="547.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="503.0" cy="55.0" r="8"/><text x="525.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">6</text><rect class="f k-gris" x="578" y="14" width="82" height="60" rx="8"/><circle class="p k-bleu" cx="597.0" cy="33.0" r="8"/><circle class="p k-bleu" cx="619.0" cy="33.0" r="8"/><circle class="l k-gris" cx="641.0" cy="33.0" r="7" stroke-dasharray="3 2" stroke-width="1.5"/><circle class="l k-gris" cx="597.0" cy="55.0" r="7" stroke-dasharray="3 2" stroke-width="1.5"/><text x="619.0" y="92" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">7</text>
```

## Exercices

1. Calcule le quotient et le reste : 29 ÷ 4 · 50 ÷ 7
2. Pose et calcule : 864 ÷ 4 · 935 ÷ 6 · 3 015 ÷ 5
3. Problème : 125 œufs à ranger par boîtes de 6. Combien de boîtes pleines ? Combien d'œufs restent ?

## Corrigé

1. 29 = (4 × 7) + 1 → q = 7, r = 1 · 50 = (7 × 7) + 1 → q = 7, r = 1
2. 216 r 0 · 155 r 5 · 603 r 0
3. 125 = (6 × 20) + 5 → 20 boîtes pleines, il reste 5 œufs.
