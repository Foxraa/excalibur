# GEO4 — La symétrie axiale
<!-- objectifs : maths-12-11 maths-12-12 maths-12-13 -->

## À retenir

Une figure a un **axe de symétrie** si, quand on la **plie** le long de cet axe, les deux parties se **superposent exactement**.

Exemples : un papillon, un cœur, la lettre A, un visage (presque).

- Un **carré** a **4** axes de symétrie.
- Un **rectangle** en a **2**.
- Un **triangle équilatéral** en a **3**.
- Un **cercle** en a **une infinité** (tous les diamètres).

```schema dessin
taille: 640x176
legende: Les **axes de symétrie** sont en pointillés rouges : si je plie la figure le long d'un axe, les deux moitiés se superposent.
<rect class="f k-bleu" x="35" y="33" width="90" height="90"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="80" y1="16" x2="80" y2="140"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="18" y1="78" x2="142" y2="78"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="22" y1="20" x2="138" y2="136"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="22" y1="136" x2="138" y2="20"/><text x="80" y="166" font-size="13.5" text-anchor="middle" font-weight="700">carré : 4 axes</text><rect class="f k-vert" x="182" y="44" width="116" height="68"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="240" y1="22" x2="240" y2="134"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="166" y1="78" x2="314" y2="78"/><text x="240" y="166" font-size="13.5" text-anchor="middle" font-weight="700">rectangle : 2 axes</text><polygon class="f k-orange" points="400.0,30.0 448.5,114.0 351.5,114.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="400.0" y1="18.0" x2="400.0" y2="126.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="458.9" y1="120.0" x2="365.4" y2="66.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="341.1" y1="120.0" x2="434.6" y2="66.0"/><text x="400" y="166" font-size="13.5" text-anchor="middle" font-weight="700">triangle équilatéral : 3</text><circle class="f k-violet" cx="560" cy="78" r="48"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="500.0" y1="78.0" x2="620.0" y2="78.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="508.0" y1="48.0" x2="612.0" y2="108.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="530.0" y1="26.0" x2="590.0" y2="130.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="560.0" y1="18.0" x2="560.0" y2="138.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="590.0" y1="26.0" x2="530.0" y2="130.0"/><line class="l k-rouge" stroke-width="2" stroke-dasharray="6 4" x1="612.0" y1="48.0" x2="508.0" y2="108.0"/><text x="560" y="166" font-size="13.5" text-anchor="middle" font-weight="700">cercle : une infinité</text>
```

## Le symétrique d'une figure

Le **symétrique** d'une figure, c'est son **reflet dans un miroir** posé sur l'axe.

**Sur un quadrillage** :
1. Pour chaque **point** de la figure, je **compte les carreaux** jusqu'à l'axe.
2. Je compte **le même nombre de carreaux de l'autre côté** de l'axe, et je place le point symétrique.
3. Je relie les points dans le même ordre.

```schema dessin
taille: 376x252
legende: Le pied du drapeau est à **2 carreaux** de l'axe : son symétrique aussi. La pointe A est à **5 carreaux** de l'axe : A' aussi. Le drapeau est **retourné**, comme dans un miroir.
<line class="grille" x1="20" x2="20" y1="14" y2="238"/><line class="grille" x1="48" x2="48" y1="14" y2="238"/><line class="grille" x1="76" x2="76" y1="14" y2="238"/><line class="grille" x1="104" x2="104" y1="14" y2="238"/><line class="grille" x1="132" x2="132" y1="14" y2="238"/><line class="grille" x1="160" x2="160" y1="14" y2="238"/><line class="grille" x1="188" x2="188" y1="14" y2="238"/><line class="grille" x1="216" x2="216" y1="14" y2="238"/><line class="grille" x1="244" x2="244" y1="14" y2="238"/><line class="grille" x1="272" x2="272" y1="14" y2="238"/><line class="grille" x1="300" x2="300" y1="14" y2="238"/><line class="grille" x1="328" x2="328" y1="14" y2="238"/><line class="grille" x1="356" x2="356" y1="14" y2="238"/><line class="grille" x1="20" x2="356" y1="14" y2="14"/><line class="grille" x1="20" x2="356" y1="42" y2="42"/><line class="grille" x1="20" x2="356" y1="70" y2="70"/><line class="grille" x1="20" x2="356" y1="98" y2="98"/><line class="grille" x1="20" x2="356" y1="126" y2="126"/><line class="grille" x1="20" x2="356" y1="154" y2="154"/><line class="grille" x1="20" x2="356" y1="182" y2="182"/><line class="grille" x1="20" x2="356" y1="210" y2="210"/><line class="grille" x1="20" x2="356" y1="238" y2="238"/><line class="l k-rouge" stroke-width="3" stroke-dasharray="8 5" x1="188" x2="188" y1="8" y2="244"/><g class="k-bleu"><polygon class="plein" points="132,42 48,70 132,98"/><line class="l" x1="132" y1="42" x2="132" y2="210" stroke-width="4"/></g><g class="k-vert"><polygon class="plein" points="244,42 328,70 244,98"/><line class="l" x1="244" y1="42" x2="244" y2="210" stroke-width="4"/></g><circle class="axe-p" cx="48" cy="70" r="4"/><text x="40" y="75" font-size="15" text-anchor="end" font-weight="700">A</text><circle class="axe-p" cx="328" cy="70" r="4"/><text x="336" y="75" font-size="15" text-anchor="start" font-weight="700">A'</text><g class="k-orange"><line class="l" x1="135" y1="210" x2="185" y2="210" stroke-width="3"/><line class="l" x1="191" y1="210" x2="241" y2="210" stroke-width="3"/><text x="160" y="230" font-size="14" text-anchor="middle" class="t" font-weight="700">2</text><text x="216" y="230" font-size="14" text-anchor="middle" class="t" font-weight="700">2</text></g><g class="k-rouge"><text x="194" y="234" font-size="13" text-anchor="start" class="t" font-weight="700">axe</text></g>
```

⚠️ Le symétrique est **retourné** (comme dans un miroir), pas juste décalé.
⚠️ Si l'axe est **oblique** (en diagonale), on compte les carreaux **en diagonale**.

## Ce qui ne change pas

La figure et son symétrique ont **les mêmes longueurs**, **les mêmes angles**, **la même aire**. Seule la **position** (et le sens) change.

## Exercices

1. Combien d'axes de symétrie ont ces lettres : A · B · H · N · O ?
2. Sur ton cahier, trace un axe vertical, dessine un petit drapeau à gauche et trace son symétrique.

## Corrigé

1. A : 1 · B : 1 (horizontal) · H : 2 · N : 0 · O : 2 (si c'est un ovale ; une infinité si c'est un cercle parfait)
