# MES5 — Les angles
<!-- objectifs : maths-10-4 maths-10-5 maths-10-6 -->

## Qu'est-ce qu'un angle ?

Un **angle** est formé par **deux côtés** (deux demi-droites) qui partent d'un même point, le **sommet**.

```schema dessin
taille: 640x196
legende: Un angle, c'est l'**écartement** entre deux côtés qui partent du **sommet**. Des côtés plus longs ne font pas un angle plus grand.
<path class="plein k-orange" opacity=".75" stroke-width="2" d="M50 150 L100.0 150.0 A50 50 0 0 0 88.3 117.9 Z"/><line class="trait" stroke-width="3" x1="50" y1="150" x2="270.0" y2="150.0"/><line class="trait" stroke-width="3" x1="50" y1="150" x2="203.2" y2="21.4"/><circle class="axe-p" cx="50" cy="150" r="5"/><text x="50" y="174" font-size="13.5" text-anchor="middle" font-weight="700">sommet</text><text x="200" y="172" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">côté</text><text x="150" y="50" font-size="13.5" text-anchor="middle" class="mute" font-weight="700">côté</text><text x="108" y="136" font-size="13.5" text-anchor="start" class="t k-orange" font-weight="700">angle</text><path class="plein k-orange" opacity=".75" stroke-width="2" d="M330 150 L364.0 150.0 A34 34 0 0 0 356.0 128.1 Z"/><line class="trait" stroke-width="3" x1="330" y1="150" x2="420.0" y2="150.0"/><line class="trait" stroke-width="3" x1="330" y1="150" x2="391.3" y2="98.6"/><circle class="axe-p" cx="330" cy="150" r="4"/><path class="plein k-orange" opacity=".75" stroke-width="2" d="M460 150 L494.0 150.0 A34 34 0 0 0 486.0 128.1 Z"/><line class="trait" stroke-width="3" x1="460" y1="150" x2="630.0" y2="150.0"/><line class="trait" stroke-width="3" x1="460" y1="150" x2="590.2" y2="40.7"/><circle class="axe-p" cx="460" cy="150" r="4"/><text x="470" y="186" font-size="13" text-anchor="middle" class="t k-vert" font-weight="700">Ces deux angles sont égaux : même écartement !</text>
```

⚠️ La taille d'un angle ne dépend **pas** de la longueur des côtés, mais de leur **écartement**.

## Les sortes d'angles

| Angle | Description | Comment le reconnaître |
|---|---|---|
| **Droit** | comme le coin d'une feuille | l'**équerre** s'y colle parfaitement ; on le code par un petit carré ∟ |
| **Aigu** | plus **petit** qu'un angle droit | il rentre dans l'équerre |
| **Obtus** | plus **grand** qu'un angle droit | il dépasse de l'équerre |
| **Plat** | les deux côtés forment une ligne droite | c'est deux angles droits |

```schema dessin
taille: 640x180
legende: Les 4 sortes d'angles. L'angle droit se code par un **petit carré**.
<line class="trait" stroke-width="3" x1="40" y1="120" x2="140.0" y2="120.0"/><line class="trait" stroke-width="3" x1="40" y1="120" x2="40.0" y2="30.0"/><polygon class="plein k-orange" points="40,120 58.0,120.0 58.0,102.0 40.0,102.0"/><circle class="axe-p" cx="40" cy="120" r="4"/><text x="80" y="152" font-size="15" text-anchor="middle" class="t k-orange" font-weight="700">droit</text><text x="80" y="170" font-size="12" text-anchor="middle" class="mute">= coin de feuille</text><path class="plein k-vert" opacity=".75" stroke-width="2" d="M200 120 L234.0 120.0 A34 34 0 0 0 224.0 96.0 Z"/><line class="trait" stroke-width="3" x1="200" y1="120" x2="300.0" y2="120.0"/><line class="trait" stroke-width="3" x1="200" y1="120" x2="263.6" y2="56.4"/><circle class="axe-p" cx="200" cy="120" r="4"/><text x="240" y="152" font-size="15" text-anchor="middle" class="t k-vert" font-weight="700">aigu</text><text x="240" y="170" font-size="12" text-anchor="middle" class="mute">plus petit que droit</text><path class="plein k-violet" opacity=".75" stroke-width="2" d="M360 120 L394.0 120.0 A34 34 0 0 0 338.1 94.0 Z"/><line class="trait" stroke-width="3" x1="360" y1="120" x2="460.0" y2="120.0"/><line class="trait" stroke-width="3" x1="360" y1="120" x2="302.1" y2="51.1"/><circle class="axe-p" cx="360" cy="120" r="4"/><text x="400" y="152" font-size="15" text-anchor="middle" class="t k-violet" font-weight="700">obtus</text><text x="400" y="170" font-size="12" text-anchor="middle" class="mute">plus grand que droit</text><path class="plein k-bleu" opacity=".75" stroke-width="2" d="M560 120 L594.0 120.0 A34 34 0 0 0 526.0 120.0 Z"/><line class="trait" stroke-width="3" x1="560" y1="120" x2="630.0" y2="120.0"/><line class="trait" stroke-width="3" x1="560" y1="120" x2="490.0" y2="120.0"/><circle class="axe-p" cx="560" cy="120" r="4"/><text x="560" y="152" font-size="15" text-anchor="middle" class="t k-bleu" font-weight="700">plat</text><text x="560" y="170" font-size="12" text-anchor="middle" class="mute">une ligne droite</text>
```

## Utiliser l'équerre

1. Je pose le **coin de l'angle droit** de l'équerre sur le **sommet**.
2. Je place **un côté de l'équerre** le long d'un côté de l'angle.
3. Je regarde l'**autre côté** : il est **sur** l'équerre (droit), **dedans** (aigu) ou **dehors** (obtus).

```schema dessin
taille: 640x205
legende: L'**équerre** (en gris) est posée sur le sommet, un côté le long de l'angle. Je regarde où tombe l'autre côté.
<polygon class="f k-gris" opacity=".9" points="40,150 160,150 40,40"/><polygon class="plein k-gris" points="40,150 52.0,150.0 52.0,138.0 40.0,138.0"/><g class="k-orange"><line class="l" stroke-width="4" x1="40" y1="150" x2="190" y2="150"/><line class="l" stroke-width="4" x1="40" y1="150" x2="40.0" y2="20.0"/></g><text x="115" y="176" font-size="15" text-anchor="middle" class="t k-orange" font-weight="700">droit</text><text x="115" y="194" font-size="12" text-anchor="middle" class="mute">le côté est SUR l'équerre</text><polygon class="f k-gris" opacity=".9" points="250,150 370,150 250,40"/><polygon class="plein k-gris" points="250,150 262.0,150.0 262.0,138.0 250.0,138.0"/><g class="k-vert"><line class="l" stroke-width="4" x1="250" y1="150" x2="400" y2="150"/><line class="l" stroke-width="4" x1="250" y1="150" x2="324.6" y2="43.5"/></g><text x="325" y="176" font-size="15" text-anchor="middle" class="t k-vert" font-weight="700">aigu</text><text x="325" y="194" font-size="12" text-anchor="middle" class="mute">le côté est DEDANS</text><polygon class="f k-gris" opacity=".9" points="460,150 580,150 460,40"/><polygon class="plein k-gris" points="460,150 472.0,150.0 472.0,138.0 460.0,138.0"/><g class="k-violet"><line class="l" stroke-width="4" x1="460" y1="150" x2="610" y2="150"/><line class="l" stroke-width="4" x1="460" y1="150" x2="385.4" y2="43.5"/></g><text x="535" y="176" font-size="15" text-anchor="middle" class="t k-violet" font-weight="700">obtus</text><text x="535" y="194" font-size="12" text-anchor="middle" class="mute">le côté est DEHORS</text>
```

## Comparer des angles

On peut utiliser un **gabarit** (un angle découpé dans du papier) et le poser sur les autres angles.

## Exercices

1. Dans la classe, trouve 3 angles droits.
2. Les aiguilles d'une horloge forment-elles un angle droit, aigu ou obtus à : 3 h ? 1 h ? 5 h ? 6 h ?

## Corrigé

1. Coin d'une table, d'un livre, d'une fenêtre, d'un tableau…
2. 3 h : droit · 1 h : aigu · 5 h : obtus · 6 h : plat
