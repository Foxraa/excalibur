# GEO2 — Les polygones, triangles et quadrilatères
<!-- objectifs : maths-12-3 maths-12-7 maths-12-8 maths-12-9 -->

## Les polygones *(vu en période 1)*

Un **polygone** est une figure **fermée** faite de **segments** (côtés droits).
- Les **côtés** sont les segments ; les **sommets** sont les points où deux côtés se rencontrent.
- Un cercle n'est **pas** un polygone (pas de côtés droits).

| Nombre de côtés | Nom |
|---|---|
| 3 | triangle |
| 4 | quadrilatère |
| 5 | pentagone |
| 6 | hexagone |
| 8 | octogone |

```schema dessin
taille: 640x158
legende: Les **côtés** sont droits ; les petits points sont les **sommets**. Il y a autant de sommets que de côtés.
<g class="k-bleu"><polygon class="f k-bleu" points="64.0,18.0 102.1,84.0 25.9,84.0"/><circle class="p" cx="64.0" cy="18.0" r="3.5"/><circle class="p" cx="102.1" cy="84.0" r="3.5"/><circle class="p" cx="25.9" cy="84.0" r="3.5"/><text x="64" y="130" font-size="14" text-anchor="middle" class="t" font-weight="700">triangle</text></g><text x="64" y="148" font-size="12.5" text-anchor="middle" class="mute">3 côtés</text><g class="k-vert"><polygon class="f k-vert" points="223.1,30.9 223.1,93.1 160.9,93.1 160.9,30.9"/><circle class="p" cx="223.1" cy="30.9" r="3.5"/><circle class="p" cx="223.1" cy="93.1" r="3.5"/><circle class="p" cx="160.9" cy="93.1" r="3.5"/><circle class="p" cx="160.9" cy="30.9" r="3.5"/><text x="192" y="130" font-size="14" text-anchor="middle" class="t" font-weight="700">quadrilatère</text></g><text x="192" y="148" font-size="12.5" text-anchor="middle" class="mute">4 côtés</text><g class="k-orange"><polygon class="f k-orange" points="320.0,18.0 361.8,48.4 345.9,97.6 294.1,97.6 278.2,48.4"/><circle class="p" cx="320.0" cy="18.0" r="3.5"/><circle class="p" cx="361.8" cy="48.4" r="3.5"/><circle class="p" cx="345.9" cy="97.6" r="3.5"/><circle class="p" cx="294.1" cy="97.6" r="3.5"/><circle class="p" cx="278.2" cy="48.4" r="3.5"/><text x="320" y="130" font-size="14" text-anchor="middle" class="t" font-weight="700">pentagone</text></g><text x="320" y="148" font-size="12.5" text-anchor="middle" class="mute">5 côtés</text><g class="k-violet"><polygon class="f k-violet" points="448.0,18.0 486.1,40.0 486.1,84.0 448.0,106.0 409.9,84.0 409.9,40.0"/><circle class="p" cx="448.0" cy="18.0" r="3.5"/><circle class="p" cx="486.1" cy="40.0" r="3.5"/><circle class="p" cx="486.1" cy="84.0" r="3.5"/><circle class="p" cx="448.0" cy="106.0" r="3.5"/><circle class="p" cx="409.9" cy="84.0" r="3.5"/><circle class="p" cx="409.9" cy="40.0" r="3.5"/><text x="448" y="130" font-size="14" text-anchor="middle" class="t" font-weight="700">hexagone</text></g><text x="448" y="148" font-size="12.5" text-anchor="middle" class="mute">6 côtés</text><g class="k-rouge"><polygon class="f k-rouge" points="576.0,18.0 607.1,30.9 620.0,62.0 607.1,93.1 576.0,106.0 544.9,93.1 532.0,62.0 544.9,30.9"/><circle class="p" cx="576.0" cy="18.0" r="3.5"/><circle class="p" cx="607.1" cy="30.9" r="3.5"/><circle class="p" cx="620.0" cy="62.0" r="3.5"/><circle class="p" cx="607.1" cy="93.1" r="3.5"/><circle class="p" cx="576.0" cy="106.0" r="3.5"/><circle class="p" cx="544.9" cy="93.1" r="3.5"/><circle class="p" cx="532.0" cy="62.0" r="3.5"/><circle class="p" cx="544.9" cy="30.9" r="3.5"/><text x="576" y="130" font-size="14" text-anchor="middle" class="t" font-weight="700">octogone</text></g><text x="576" y="148" font-size="12.5" text-anchor="middle" class="mute">8 côtés</text>
```

## Les triangles

| Triangle | Propriété | Codage |
|---|---|---|
| **Rectangle** | a **un angle droit** | ∟ |
| **Isocèle** | a **2 côtés de même longueur** | 2 petits traits pareils |
| **Équilatéral** | a **3 côtés de même longueur** (et 3 angles égaux) | 3 petits traits pareils |
| **Rectangle isocèle** | angle droit + 2 côtés égaux | |

```schema dessin
taille: 640x180
legende: Le **petit carré** code un angle droit. Les **petits traits rouges** codent des côtés de **même longueur**.
<polygon class="f k-bleu" points="25,140 140,140 25,60"/><polygon class="plein k-orange" points="25,140 38.0,140.0 38.0,127.0 25.0,127.0"/><text x="80" y="170" font-size="14" text-anchor="middle" class="t k-bleu" font-weight="700">rectangle</text><polygon class="f k-vert" points="240,28 290,140 190,140"/><line class="l k-rouge" stroke-width="2" x1="271.4" y1="81.1" x2="258.6" y2="86.9"/><line class="l k-rouge" stroke-width="2" x1="208.6" y1="81.1" x2="221.4" y2="86.9"/><text x="240" y="170" font-size="14" text-anchor="middle" class="t k-vert" font-weight="700">isocèle</text><polygon class="f k-orange" points="400.0,38.0 452.0,128.0 348.0,128.0"/><line class="l k-rouge" stroke-width="2" x1="432.0" y1="79.5" x2="419.9" y2="86.5"/><line class="l k-rouge" stroke-width="2" x1="400.0" y1="135.0" x2="400.0" y2="121.0"/><line class="l k-rouge" stroke-width="2" x1="368.0" y1="79.5" x2="380.1" y2="86.5"/><text x="400" y="170" font-size="14" text-anchor="middle" class="t k-orange" font-weight="700">équilatéral</text><polygon class="f k-violet" points="510,140 610,140 510,40"/><line class="l k-rouge" stroke-width="2" x1="560.0" y1="133.0" x2="560.0" y2="147.0"/><line class="l k-rouge" stroke-width="2" x1="503.0" y1="90.0" x2="517.0" y2="90.0"/><polygon class="plein k-orange" points="510,140 523.0,140.0 523.0,127.0 510.0,127.0"/><text x="560" y="170" font-size="14" text-anchor="middle" class="t k-violet" font-weight="700">rectangle isocèle</text>
```

## Les quadrilatères particuliers

| Figure | Côtés | Angles | Diagonales |
|---|---|---|---|
| **Rectangle** | côtés opposés égaux et parallèles | **4 angles droits** | même longueur, se coupent en leur milieu |
| **Losange** | **4 côtés égaux** | pas forcément droits | **perpendiculaires**, se coupent en leur milieu |
| **Carré** | **4 côtés égaux** | **4 angles droits** | même longueur + perpendiculaires |

```schema dessin
taille: 640x186
legende: Les **diagonales** sont en pointillés. Dans le losange et le carré, elles se coupent en faisant un **angle droit**.
<polygon class="f k-bleu" points="20,40 190,40 190,140 20,140"/><line class="l k-bleu" stroke-width="1.6" stroke-dasharray="6 5" x1="20" y1="40" x2="190" y2="140"/><line class="l k-bleu" stroke-width="1.6" stroke-dasharray="6 5" x1="190" y1="40" x2="20" y2="140"/><line class="l k-rouge" stroke-width="2" x1="105.0" y1="33.0" x2="105.0" y2="47.0"/><line class="l k-rouge" stroke-width="2" x1="197.0" y1="87.5" x2="183.0" y2="87.5"/><line class="l k-rouge" stroke-width="2" x1="197.0" y1="92.5" x2="183.0" y2="92.5"/><line class="l k-rouge" stroke-width="2" x1="105.0" y1="147.0" x2="105.0" y2="133.0"/><line class="l k-rouge" stroke-width="2" x1="13.0" y1="92.5" x2="27.0" y2="92.5"/><line class="l k-rouge" stroke-width="2" x1="13.0" y1="87.5" x2="27.0" y2="87.5"/><polygon class="plein k-orange" points="20,40 31.0,40.0 31.0,51.0 20.0,51.0"/><polygon class="plein k-orange" points="190,40 190.0,51.0 179.0,51.0 179.0,40.0"/><polygon class="plein k-orange" points="190,140 179.0,140.0 179.0,129.0 190.0,129.0"/><polygon class="plein k-orange" points="20,140 20.0,129.0 31.0,129.0 31.0,140.0"/><text x="105" y="176" font-size="14.5" text-anchor="middle" class="t k-bleu" font-weight="700">rectangle</text><polygon class="f k-vert" points="240,90 320,35 400,90 320,145"/><line class="l k-vert" stroke-width="1.6" stroke-dasharray="6 5" x1="240" y1="90" x2="400" y2="90"/><line class="l k-vert" stroke-width="1.6" stroke-dasharray="6 5" x1="320" y1="35" x2="320" y2="145"/><line class="l k-rouge" stroke-width="2" x1="276.0" y1="56.7" x2="284.0" y2="68.3"/><line class="l k-rouge" stroke-width="2" x1="364.0" y1="56.7" x2="356.0" y2="68.3"/><line class="l k-rouge" stroke-width="2" x1="364.0" y1="123.3" x2="356.0" y2="111.7"/><line class="l k-rouge" stroke-width="2" x1="276.0" y1="123.3" x2="284.0" y2="111.7"/><polygon class="plein k-rouge" points="320.0,90.0 320.0,81.0 329.0,81.0 329.0,90.0"/><text x="320" y="176" font-size="14.5" text-anchor="middle" class="t k-vert" font-weight="700">losange</text><polygon class="f k-orange" points="485,40 585,40 585,140 485,140"/><line class="l k-orange" stroke-width="1.6" stroke-dasharray="6 5" x1="485" y1="40" x2="585" y2="140"/><line class="l k-orange" stroke-width="1.6" stroke-dasharray="6 5" x1="585" y1="40" x2="485" y2="140"/><line class="l k-rouge" stroke-width="2" x1="535.0" y1="33.0" x2="535.0" y2="47.0"/><line class="l k-rouge" stroke-width="2" x1="592.0" y1="90.0" x2="578.0" y2="90.0"/><line class="l k-rouge" stroke-width="2" x1="535.0" y1="147.0" x2="535.0" y2="133.0"/><line class="l k-rouge" stroke-width="2" x1="478.0" y1="90.0" x2="492.0" y2="90.0"/><polygon class="plein k-orange" points="485,40 496.0,40.0 496.0,51.0 485.0,51.0"/><polygon class="plein k-orange" points="585,40 585.0,51.0 574.0,51.0 574.0,40.0"/><polygon class="plein k-orange" points="585,140 574.0,140.0 574.0,129.0 585.0,129.0"/><polygon class="plein k-orange" points="485,140 485.0,129.0 496.0,129.0 496.0,140.0"/><polygon class="plein k-rouge" points="535.0,90.0 541.4,83.6 547.7,90.0 541.4,96.4"/><text x="535" y="176" font-size="14.5" text-anchor="middle" class="t k-orange" font-weight="700">carré</text>
```

💡 Le **carré** est à la fois un rectangle **et** un losange !

```schema dessin
taille: 640x184
legende: Le **carré** est au milieu : il a les 4 angles droits des rectangles **et** les 4 côtés égaux des losanges.
<ellipse class="f k-bleu" cx="235" cy="96" rx="170" ry="78" opacity=".75"/><ellipse class="f k-vert" cx="405" cy="96" rx="170" ry="78" opacity=".75"/><text x="130" y="46" font-size="15" text-anchor="middle" class="t k-bleu" font-weight="700">Les rectangles</text><text x="510" y="46" font-size="15" text-anchor="middle" class="t k-vert" font-weight="700">Les losanges</text><text x="320" y="46" font-size="15" text-anchor="middle" class="t k-orange" font-weight="700">Les carrés</text><rect class="f k-bleu" x="100" y="80" width="70" height="40" stroke-width="2"/><polygon class="f k-vert" points="460,100 500,74 540,100 500,126" stroke-width="2"/><rect class="plein k-orange" x="296" y="74" width="48" height="48"/>
```

Une **diagonale** est un segment qui relie deux sommets **qui ne se touchent pas**.

## Le vocabulaire pour décrire une figure

*« ABCD est un rectangle. Ses côtés [AB] et [CD] sont parallèles et mesurent 6 cm. Les angles en A, B, C et D sont droits. »*

## Programme de construction : tracer un rectangle de 5 cm sur 3 cm

1. Trace un segment [AB] de 5 cm.
2. Trace la perpendiculaire à [AB] passant par A ; place D à 3 cm de A.
3. Trace la perpendiculaire à [AB] passant par B ; place C à 3 cm de B.
4. Relie C et D. Vérifie avec l'équerre et la règle.

```schema dessin
taille: 640x170
legende: Les **4 étapes** du programme de construction. Les traits verts en pointillés sont les **perpendiculaires** tracées à l'équerre.
<text x="80" y="22" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">Étape 1</text><line class="l k-bleu" x1="30" y1="140" x2="130" y2="140" stroke-width="2.5"/><path class="trait" d="M25 135 L35 145 M25 145 L35 135" stroke-width="2"/><text x="21" y="154" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M125 135 L135 145 M125 145 L135 135" stroke-width="2"/><text x="139" y="154" font-size="15" text-anchor="start" font-weight="700">B</text><text x="240" y="22" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">Étape 2</text><line class="l k-bleu" x1="190" y1="140" x2="290" y2="140" stroke-width="2.5"/><line class="l k-vert" stroke-width="2" stroke-dasharray="6 5" x1="190" y1="150" x2="190" y2="40"/><polygon class="plein k-orange" points="190,140 200.0,140.0 200.0,130.0 190.0,130.0"/><path class="trait" d="M185 75 L195 85 M185 85 L195 75" stroke-width="2"/><text x="181" y="85" font-size="15" text-anchor="end" font-weight="700">D</text><path class="trait" d="M185 135 L195 145 M185 145 L195 135" stroke-width="2"/><text x="181" y="154" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M285 135 L295 145 M285 145 L295 135" stroke-width="2"/><text x="299" y="154" font-size="15" text-anchor="start" font-weight="700">B</text><text x="400" y="22" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">Étape 3</text><line class="l k-bleu" x1="350" y1="140" x2="450" y2="140" stroke-width="2.5"/><line class="l k-vert" stroke-width="2" stroke-dasharray="6 5" x1="350" y1="150" x2="350" y2="40"/><polygon class="plein k-orange" points="350,140 360.0,140.0 360.0,130.0 350.0,130.0"/><path class="trait" d="M345 75 L355 85 M345 85 L355 75" stroke-width="2"/><text x="341" y="85" font-size="15" text-anchor="end" font-weight="700">D</text><line class="l k-vert" stroke-width="2" stroke-dasharray="6 5" x1="450" y1="150" x2="450" y2="40"/><polygon class="plein k-orange" points="450,140 440.0,140.0 440.0,130.0 450.0,130.0"/><path class="trait" d="M445 75 L455 85 M445 85 L455 75" stroke-width="2"/><text x="459" y="85" font-size="15" text-anchor="start" font-weight="700">C</text><path class="trait" d="M345 135 L355 145 M345 145 L355 135" stroke-width="2"/><text x="341" y="154" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M445 135 L455 145 M445 145 L455 135" stroke-width="2"/><text x="459" y="154" font-size="15" text-anchor="start" font-weight="700">B</text><text x="560" y="22" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">Étape 4</text><rect class="f k-bleu" x="510" y="80" width="100" height="60" stroke-width="2.5"/><path class="trait" d="M505 75 L515 85 M505 85 L515 75" stroke-width="2"/><text x="501" y="85" font-size="15" text-anchor="end" font-weight="700">D</text><path class="trait" d="M605 75 L615 85 M605 85 L615 75" stroke-width="2"/><text x="619" y="85" font-size="15" text-anchor="start" font-weight="700">C</text><text x="560" y="160" font-size="12.5" text-anchor="middle" class="t k-bleu" font-weight="700">5 cm</text><text x="604" y="114" font-size="12.5" text-anchor="end" class="t k-bleu" font-weight="700">3 cm</text><path class="trait" d="M505 135 L515 145 M505 145 L515 135" stroke-width="2"/><text x="501" y="154" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M605 135 L615 145 M605 145 L615 135" stroke-width="2"/><text x="619" y="154" font-size="15" text-anchor="start" font-weight="700">B</text><line class="grille" x1="160" x2="160" y1="10" y2="160"/><line class="grille" x1="320" x2="320" y1="10" y2="160"/><line class="grille" x1="480" x2="480" y1="10" y2="160"/>
```

## Exercices

1. Comment s'appelle un polygone à 6 côtés ?
2. Un triangle a des côtés de 4 cm, 4 cm et 4 cm. Quel est son nom ?
3. Vrai ou faux : a. un carré est un losange. b. un rectangle est toujours un carré. c. un losange a 4 angles droits.

## Corrigé

1. un hexagone · 2. équilatéral · 3. a. vrai · b. faux · c. faux (seulement si c'est un carré)
