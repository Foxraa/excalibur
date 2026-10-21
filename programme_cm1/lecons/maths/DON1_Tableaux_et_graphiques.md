# DON1 — Lire et construire des tableaux et des graphiques
<!-- objectifs : maths-14-1 maths-14-2 maths-14-3 -->

## Le tableau

Un tableau a des **lignes** (horizontales) et des **colonnes** (verticales). Pour lire une case, je croise une ligne et une colonne.

| Élève | Lundi | Mardi | Mercredi |
|---|---|---|---|
| **Léo** | 20 min | 15 min | 30 min |
| **Léa** | 10 min | 25 min | 20 min |

→ *Combien de temps Léa a-t-elle lu mardi ?* → je croise **Léa** et **Mardi** → **25 min**.

```schema dessin
taille: 420x150
legende: Je suis la **ligne** de Léa et la **colonne** de mardi : la réponse est dans la case où elles **se croisent**.
<rect class="cellule" x="10" y="10" width="100" height="36"/><rect class="cellule" x="110" y="10" width="100" height="36"/><rect class="cellule" x="210" y="10" width="100" height="36"/><rect class="cellule" x="310" y="10" width="100" height="36"/>
<rect class="cellule" x="10" y="46" width="100" height="36"/><rect class="cellule" x="110" y="46" width="100" height="36"/><rect class="cellule" x="210" y="46" width="100" height="36"/><rect class="cellule" x="310" y="46" width="100" height="36"/>
<g class="k-bleu"><rect class="f" x="10" y="82" width="400" height="36"/></g><g class="k-orange"><rect class="f" x="210" y="10" width="100" height="108" opacity=".75"/></g>
<g class="k-vert"><rect class="plein" x="212" y="84" width="96" height="32"/></g>
<text x="60" y="34" font-size="14" font-weight="700" text-anchor="middle">Élève</text><text x="160" y="34" font-size="14" font-weight="700" text-anchor="middle">Lundi</text><text x="260" y="34" font-size="14" font-weight="700" text-anchor="middle">Mardi</text><text x="360" y="34" font-size="14" font-weight="700" text-anchor="middle">Mercredi</text>
<text x="60" y="70" font-size="14" font-weight="700" text-anchor="middle">Léo</text><text x="160" y="70" font-size="14" text-anchor="middle">20 min</text><text x="260" y="70" font-size="14" text-anchor="middle">15 min</text><text x="360" y="70" font-size="14" text-anchor="middle">30 min</text>
<text x="60" y="106" font-size="14" font-weight="700" text-anchor="middle">Léa</text><text x="160" y="106" font-size="14" text-anchor="middle">10 min</text><text x="260" y="106" font-size="15" font-weight="700" text-anchor="middle">25 min</text><text x="360" y="106" font-size="14" text-anchor="middle">20 min</text>
<g class="k-bleu"><text class="t" x="10" y="140" font-size="13" font-weight="700">→ la ligne de Léa</text></g><g class="k-orange"><text class="t" x="410" y="140" font-size="13" font-weight="700" text-anchor="end">la colonne de mardi ↑</text></g>
```

## Le diagramme en barres (en bâtons)

Chaque **barre** représente une **quantité**. Plus la barre est **haute**, plus la quantité est **grande**.

```schema barres
unite: élèves
max: 10
pomme : 8 | rouge
banane : 10 | jaune
fraise : 6 | rouge
kiwi : 4 | vert
legende: **Fruits préférés de la classe.** Je lis la hauteur de chaque barre sur l'axe vertical (le nombre est aussi écrit en haut de la barre).
```
→ Le fruit préféré est la **banane** (10). La pomme a **2 voix de plus** que la fraise.

**Pour lire** : je regarde l'**axe vertical** (les nombres) et sa graduation (de combien en combien ?).

## Le graphique en courbe

Il montre comment une quantité **évolue dans le temps** (température dans la journée, taille d'une plante…). Les points sont reliés par une ligne.

```schema dessin
taille: 424x220
legende: **Température dans la journée.** La courbe **monte** jusqu'à 14 h (17 °C), puis **descend**.
<line class="grille" x1="50" x2="410" y1="190.0" y2="190.0"/><text x="42" y="194.0" font-size="11.5" text-anchor="end" class="mute">0</text><line class="grille" x1="50" x2="410" y1="147.5" y2="147.5"/><text x="42" y="151.5" font-size="11.5" text-anchor="end" class="mute">5</text><line class="grille" x1="50" x2="410" y1="105.0" y2="105.0"/><text x="42" y="109.0" font-size="11.5" text-anchor="end" class="mute">10</text><line class="grille" x1="50" x2="410" y1="62.5" y2="62.5"/><text x="42" y="66.5" font-size="11.5" text-anchor="end" class="mute">15</text><line class="grille" x1="50" x2="410" y1="20.0" y2="20.0"/><text x="42" y="24.0" font-size="11.5" text-anchor="end" class="mute">20</text><line class="axe" x1="50" x2="410" y1="190" y2="190" stroke-width="2"/><line class="axe" x1="50" x2="50" y1="14" y2="190" stroke-width="2"/><g class="k-rouge"><polyline class="l" stroke-width="3" points="80,139.0 140,105.0 200,62.5 260,45.5 320,71.0 380,105.0"/><circle class="p" cx="80" cy="139.0" r="5"/><text x="80" y="129.0" font-size="12.5" text-anchor="middle" class="t" font-weight="700">6</text><circle class="p" cx="140" cy="105.0" r="5"/><text x="140" y="95.0" font-size="12.5" text-anchor="middle" class="t" font-weight="700">10</text><circle class="p" cx="200" cy="62.5" r="5"/><text x="200" y="52.5" font-size="12.5" text-anchor="middle" class="t" font-weight="700">15</text><circle class="p" cx="260" cy="45.5" r="5"/><text x="260" y="35.5" font-size="12.5" text-anchor="middle" class="t" font-weight="700">17</text><circle class="p" cx="320" cy="71.0" r="5"/><text x="320" y="61.0" font-size="12.5" text-anchor="middle" class="t" font-weight="700">14</text><circle class="p" cx="380" cy="105.0" r="5"/><text x="380" y="95.0" font-size="12.5" text-anchor="middle" class="t" font-weight="700">10</text></g><text x="80" y="208" font-size="12.5" text-anchor="middle">8 h</text><text x="140" y="208" font-size="12.5" text-anchor="middle">10 h</text><text x="200" y="208" font-size="12.5" text-anchor="middle">12 h</text><text x="260" y="208" font-size="12.5" text-anchor="middle">14 h</text><text x="320" y="208" font-size="12.5" text-anchor="middle">16 h</text><text x="380" y="208" font-size="12.5" text-anchor="middle">18 h</text><text x="42" y="12" font-size="11.5" text-anchor="end" class="mute" font-weight="700">°C</text>
```

## Construire un diagramme en barres

1. Je trace deux axes.
2. En bas, j'écris les **catégories**. Sur le côté, une **graduation régulière** (de 1 en 1, de 2 en 2…).
3. Je trace chaque barre à la bonne hauteur, **toutes de la même largeur**.
4. J'écris un **titre**.

## Exercices (avec le diagramme des fruits)

1. Combien d'élèves préfèrent le kiwi ?
2. Combien d'élèves ont voté en tout ?
3. Quelle est la différence entre la banane et le kiwi ?

## Corrigé

1. 4 · 2. 8 + 10 + 6 + 4 = 28 · 3. 10 − 4 = 6
