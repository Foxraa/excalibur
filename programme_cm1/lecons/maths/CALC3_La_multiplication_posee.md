# CALC3 — La multiplication posée
<!-- objectifs : maths-5-4 maths-5-5 maths-4-8 -->

## Ce qu'est une multiplication

*4 × 6* = **4 fois 6** = 6 + 6 + 6 + 6 = **24**. Le résultat s'appelle le **produit**.
On peut changer l'ordre : *4 × 6 = 6 × 4*.

```schema dessin
taille: 276x154
legende: **4 lignes de 6** : 6 + 6 + 6 + 6 = **24**. C'est *4 × 6*.
<g class="k-bleu"><circle class="p" cx="100" cy="40" r="8"/><circle class="p" cx="126" cy="40" r="8"/><circle class="p" cx="152" cy="40" r="8"/><circle class="p" cx="178" cy="40" r="8"/><circle class="p" cx="204" cy="40" r="8"/><circle class="p" cx="230" cy="40" r="8"/><circle class="p" cx="100" cy="66" r="8"/><circle class="p" cx="126" cy="66" r="8"/><circle class="p" cx="152" cy="66" r="8"/><circle class="p" cx="178" cy="66" r="8"/><circle class="p" cx="204" cy="66" r="8"/><circle class="p" cx="230" cy="66" r="8"/><circle class="p" cx="100" cy="92" r="8"/><circle class="p" cx="126" cy="92" r="8"/><circle class="p" cx="152" cy="92" r="8"/><circle class="p" cx="178" cy="92" r="8"/><circle class="p" cx="204" cy="92" r="8"/><circle class="p" cx="230" cy="92" r="8"/><circle class="p" cx="100" cy="118" r="8"/><circle class="p" cx="126" cy="118" r="8"/><circle class="p" cx="152" cy="118" r="8"/><circle class="p" cx="178" cy="118" r="8"/><circle class="p" cx="204" cy="118" r="8"/><circle class="p" cx="230" cy="118" r="8"/></g><g class="k-rouge"><path class="l" stroke-width="2" d="M90 18 H240"/><text class="t" x="165.0" y="12" font-size="15" font-weight="700" text-anchor="middle">6 colonnes</text></g><g class="k-vert"><path class="l" stroke-width="2" d="M78 30 V128"/><text class="t" x="70" y="84.0" font-size="15" font-weight="700" text-anchor="end">4 lignes</text></g>
```

## Multiplier par un nombre à 1 chiffre

```schema operation
calcul: 347 x 6
legende: Les **retenues** (en orange) s'ajoutent **après** avoir multiplié le chiffre suivant.
```
6 × 7 = 42 → j'écris 2, je retiens 4 · 6 × 4 = 24, + 4 = 28 → j'écris 8, je retiens 2 · 6 × 3 = 18, + 2 = 20 → j'écris 20.

⚠️ On **multiplie d'abord**, **puis** on ajoute la retenue.

## Multiplier par un nombre à 2 chiffres

On fait **deux lignes** puis on les additionne.

```schema operation
calcul: 245 x 32
legende: 1re ligne : 245 × **2**. 2e ligne : 245 × **30** : on écrit d'abord le **0** orange, puis 245 × 3. On additionne les deux lignes.
```

1. Je multiplie par le chiffre des **unités** (2).
2. Je multiplie par le chiffre des **dizaines** (3), mais comme ce sont des **dizaines**, j'écris d'abord un **0** dans la colonne des unités.
3. J'additionne les deux lignes.

## Vérifier

- **Ordre de grandeur** : *245 × 32 ≈ 250 × 30 = 7 500*. Mon résultat 7 840 est proche ✅.
- Chaque retenue barrée au fur et à mesure (pour ne pas les mélanger entre la 1re et la 2e ligne).

## Calcul réfléchi utile

- *× 11* : *23 × 11 = 230 + 23 = 253*
- *× 20* : *× 2 puis × 10* → *34 × 20 = 68 × 10 = 680*
- *× 99* : *× 100 puis − une fois* → *12 × 99 = 1 200 − 12 = 1 188*

## Exercices

Pose et calcule :
1. 268 × 4 2. 1 507 × 7 3. 63 × 25 4. 418 × 36

## Corrigé

1. 1 072 · 2. 10 549 · 3. 1 575 · 4. 15 048
