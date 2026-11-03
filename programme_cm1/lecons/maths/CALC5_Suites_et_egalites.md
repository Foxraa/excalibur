# CALC5 — Suites, motifs et égalités (pensée algébrique)
<!-- objectifs : maths-7-1 maths-7-2 maths-7-4 maths-7-5 maths-7-6 maths-5-2 -->

Nouveauté du programme : on apprend à **trouver une règle** et à **raisonner sur des nombres inconnus**. C'est le début de l'algèbre du collège.

## Les suites de nombres

On cherche **ce qui se passe d'un nombre au suivant**.

- *3, 7, 11, 15, …* → **+ 4** à chaque fois → *19, 23*
- *2, 4, 8, 16, …* → **× 2** (le double) → *32, 64*
- *100, 91, 82, 73, …* → **− 9** → *64, 55*

```schema bonds
depart: 3
+4 > 7
+4 > 11
+4 > 15
+4 > 19
couleur: violet
legende: Je regarde **le saut** d'un nombre au suivant : toujours **+ 4**.
```

## Les motifs qui se répètent ou grandissent

*◯ △ ◯ △ ◯ …* → on répète **◯ △** → le 10e est **△** (les rangs pairs sont des △).

Un motif qui grandit : 1 carré, puis 3, puis 5, puis 7… → **+ 2 carrés** à chaque étape. À l'étape 10 : *1 + (9 × 2) = 19 carrés*.

```schema dessin
taille: 508x106
legende: À chaque étape, on ajoute **2 carrés** (en orange), un de chaque côté.
<rect class="plein k-bleu" x="20" y="30" width="20" height="20" rx="3"/><text x="31.0" y="78" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">étape 1</text><text x="31.0" y="96" font-size="13" text-anchor="middle" font-weight="700">1 carré</text><rect class="plein k-orange" x="76" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="98" y="30" width="20" height="20" rx="3"/><rect class="plein k-orange" x="120" y="30" width="20" height="20" rx="3"/><text x="109.0" y="78" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">étape 2</text><text x="109.0" y="96" font-size="13" text-anchor="middle" font-weight="700">3 carrés</text><rect class="plein k-orange" x="176" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="198" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="220" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="242" y="30" width="20" height="20" rx="3"/><rect class="plein k-orange" x="264" y="30" width="20" height="20" rx="3"/><text x="231.0" y="78" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">étape 3</text><text x="231.0" y="96" font-size="13" text-anchor="middle" font-weight="700">5 carrés</text><rect class="plein k-orange" x="320" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="342" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="364" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="386" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="408" y="30" width="20" height="20" rx="3"/><rect class="plein k-bleu" x="430" y="30" width="20" height="20" rx="3"/><rect class="plein k-orange" x="452" y="30" width="20" height="20" rx="3"/><text x="397.0" y="78" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">étape 4</text><text x="397.0" y="96" font-size="13" text-anchor="middle" font-weight="700">7 carrés</text>
```

## Les égalités à trous

Le signe **=** veut dire « **vaut autant que** », pas « le résultat est ».
- *… + 7 = 15* → *15 − 7 = 8*
- *4 × … = 36* → *36 ÷ 4 = 9*
- *12 + 5 = … + 10* → les deux côtés valent 17 → *7*

## Les balances

Une balance **en équilibre** = les deux plateaux ont la **même masse**.

```schema dessin
taille: 700x165
legende: J'enlève **une boule de chaque côté** : la balance reste en équilibre. Il reste **2 boules = 10 g**, donc une boule = **5 g**.
<path class="trait" d="M170 150 V60 M130 156 H210"/><polygon class="axe-p" points="170,52 162,64 178,64"/><path class="trait" d="M50 62 H290"/><path class="trait" d="M70 62 V92 M10 92 H130"/><circle class="p k-bleu" cx="42.0" cy="79" r="11"/><circle class="p k-bleu" cx="70.0" cy="79" r="11"/><circle class="p k-bleu" cx="98.0" cy="79" r="11"/><path class="trait" d="M270 62 V92 M210 92 H330"/><circle class="p k-bleu" cx="245.4" cy="79" r="11"/><g class="k-orange"><path class="f" d="M264.4 90 L268.4 68 H299.59999999999997 L303.59999999999997 90 Z"/><text x="284.0" y="84" font-size="13" text-anchor="middle" class="t" font-weight="700">10 g</text></g><path class="trait" d="M530 150 V60 M490 156 H570"/><polygon class="axe-p" points="530,52 522,64 538,64"/><path class="trait" d="M410 62 H650"/><path class="trait" d="M430 62 V92 M370 92 H490"/><circle class="p k-bleu" cx="416.0" cy="79" r="11"/><circle class="p k-bleu" cx="444.0" cy="79" r="11"/><path class="trait" d="M630 62 V92 M570 92 H690"/><g class="k-orange"><path class="f" d="M610.4 90 L614.4 68 H645.6 L649.6 90 Z"/><text x="630.0" y="84" font-size="13" text-anchor="middle" class="t" font-weight="700">10 g</text></g><g class="k-vert"><path class="l" stroke-width="2.5" d="M334 120 H352"/><polygon class="p" points="360,120 350,114 350,126"/></g><text x="347" y="150" font-size="12.5" text-anchor="middle" class="t k-vert" font-weight="700">j'enlève 1 boule de chaque côté</text>
```
On enlève **la même chose des deux côtés** : on enlève une boule de chaque côté → *● ● = 10 g* → une boule = **5 g**.

⚠️ **Règle importante** : dans un exercice, **des objets identiques ont la même masse**.

💡 **Rappel** : sur une balance, même dessin = même masse.

## Exercices

1. Continue : 5, 12, 19, 26, … · 1, 3, 9, 27, … · 64, 32, 16, …
2. Complète : … − 18 = 30 · 7 × … = 56 · 25 + … = 20 + 15
3. Une balance : 3 cubes + 2 g = 1 cube + 12 g. Combien pèse un cube ?

## Corrigé

1. 33, 40 · 81, 243 · 8, 4
2. 48 · 8 · 10
3. On enlève 1 cube de chaque côté : 2 cubes + 2 g = 12 g → 2 cubes = 10 g → un cube = **5 g**.
