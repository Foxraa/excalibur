# GEO1 — Points, droites, droites perpendiculaires et parallèles
<!-- objectifs : maths-12-1 maths-12-2 maths-12-5 maths-12-6 -->

## Le vocabulaire

| Mot | Dessin | Notation |
|---|---|---|
| **Point** | une petite croix × | une **lettre majuscule** : A |
| **Droite** | un trait **sans fin** des deux côtés | (AB) ou (d) |
| **Segment** | un morceau de droite **entre deux points** | [AB] |
| **Demi-droite** | un point de départ, **sans fin** de l'autre côté | [AB) |

```schema dessin
taille: 640x208
legende: Les pointillés veulent dire « **ça continue sans fin** ». Le segment, lui, s'arrête aux deux points.
<text x="16" y="24" font-size="15" text-anchor="start" font-weight="700">Point A</text><text x="16" y="42" font-size="12.5" text-anchor="start" class="mute">une petite croix</text><g class="k-bleu"><g class="k-bleu"><path class="trait" d="M155 71 L165 81 M155 81 L165 71" stroke-width="2"/><text x="168" y="68" font-size="15" text-anchor="start" class="t" font-weight="700">A</text></g></g><text x="336" y="24" font-size="15" text-anchor="start" font-weight="700">Droite (AB)</text><text x="336" y="42" font-size="12.5" text-anchor="start" class="mute">sans fin des deux côtés</text><g class="k-bleu"><line class="l" stroke-width="2.5" x1="360" y1="76" x2="600" y2="76"/><line class="l k-bleu" stroke-width="2" stroke-dasharray="6 5" x1="334" y1="76" x2="360" y2="76"/><line class="l k-bleu" stroke-width="2" stroke-dasharray="6 5" x1="600" y1="76" x2="626" y2="76"/></g><path class="trait" d="M425 71 L435 81 M425 81 L435 71" stroke-width="2"/><text x="426" y="66" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M525 71 L535 81 M525 81 L535 71" stroke-width="2"/><text x="534" y="66" font-size="15" text-anchor="start" font-weight="700">B</text><text x="16" y="128" font-size="15" text-anchor="start" font-weight="700">Segment [AB]</text><text x="16" y="146" font-size="12.5" text-anchor="start" class="mute">entre deux points</text><g class="k-bleu"><line class="l" x1="110" y1="180" x2="210" y2="180" stroke-width="3"/></g><path class="trait" d="M105 175 L115 185 M105 185 L115 175" stroke-width="2"/><text x="106" y="170" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M205 175 L215 185 M205 185 L215 175" stroke-width="2"/><text x="214" y="170" font-size="15" text-anchor="start" font-weight="700">B</text><text x="336" y="128" font-size="15" text-anchor="start" font-weight="700">Demi-droite [AB)</text><text x="336" y="146" font-size="12.5" text-anchor="start" class="mute">un départ, sans fin de l'autre côté</text><g class="k-bleu"><line class="l" stroke-width="2.5" x1="430" y1="180" x2="600" y2="180"/><line class="l k-bleu" stroke-width="2" stroke-dasharray="6 5" x1="600" y1="180" x2="626" y2="180"/></g><path class="trait" d="M425 175 L435 185 M425 185 L435 175" stroke-width="2"/><text x="426" y="170" font-size="15" text-anchor="end" font-weight="700">A</text><path class="trait" d="M525 175 L535 185 M525 185 L535 175" stroke-width="2"/><text x="534" y="170" font-size="15" text-anchor="start" font-weight="700">B</text><line class="grille" x1="320" x2="320" y1="6" y2="202"/><line class="grille" x1="6" x2="634" y1="104" y2="104"/>
```

- Des points **alignés** sont sur une même droite.
- Le **milieu** d'un segment est le point qui le coupe en **deux segments de même longueur**.

## Les droites perpendiculaires

Deux droites sont **perpendiculaires** quand elles se coupent en formant un **angle droit**.

```schema dessin
taille: 650x215
legende: À gauche : (d1) et (d2) font un **angle droit** (le petit carré orange), même si elles sont penchées. À droite : l'**équerre** posée sur (d) permet de tracer la perpendiculaire qui passe par A.
<g class="k-bleu"><line class="l" x1="34.6" y1="149.9" x2="295.4" y2="80.1" stroke-width="2.5"/><text x="291.4" y="68.1" font-size="14" text-anchor="middle" class="t" font-weight="700">(d1)</text></g><g class="k-vert"><line class="l" x1="140.4" y1="23.2" x2="189.6" y2="206.8" stroke-width="2.5"/><text x="150.4" y="31.2" font-size="14" text-anchor="start" class="t" font-weight="700">(d2)</text></g><polygon class="plein k-orange" points="165,115 180.5,110.9 176.3,95.4 160.9,99.5"/><line class="l k-bleu" x1="360" y1="180" x2="640" y2="180" stroke-width="2.5"/><text x="632" y="172" font-size="14" text-anchor="end" class="t k-bleu" font-weight="700">(d)</text><polygon class="f k-gris" points="480,180 600,180 480,42" opacity=".85"/><polygon class="plein k-orange" points="480,180 494.0,180.0 494.0,166.0 480.0,166.0"/><line class="l k-vert" stroke-width="2.5" stroke-dasharray="6 5" x1="480" y1="20" x2="480" y2="180"/><path class="trait" d="M475 65 L485 75 M475 75 L485 65" stroke-width="2"/><text x="470" y="64" font-size="15" text-anchor="end" font-weight="700">A</text><text x="548" y="158" font-size="13" text-anchor="middle" class="mute" font-weight="700">équerre</text>
```
On note : **(d1) ⊥ (d2)**.

**Tracer une perpendiculaire avec l'équerre** :
1. Je pose un côté de l'angle droit de l'équerre **le long de la droite**.
2. Je fais glisser l'équerre jusqu'au point par lequel la nouvelle droite doit passer.
3. Je trace le long de l'**autre côté** de l'angle droit.
4. Je code l'angle droit par un petit carré.

## Les droites parallèles

Deux droites sont **parallèles** quand elles **ne se coupent jamais**, même si on les prolonge : l'**écart** entre elles est **toujours le même**.

```schema dessin
taille: 620x190
legende: L'**écart** entre (d1) et (d2) est **le même partout** (2 cm ici et là) : elles sont **parallèles**.
<g class="k-bleu"><line class="l" x1="50" y1="112" x2="545.1" y2="42.4" stroke-width="2.5"/><text x="553.1" y="47.4" font-size="14" text-anchor="start" class="t" font-weight="700">(d1)</text></g><g class="k-violet"><line class="l" x1="58.4" y1="171.4" x2="553.5" y2="101.8" stroke-width="2.5"/><text x="561.5" y="106.8" font-size="14" text-anchor="start" class="t" font-weight="700">(d2)</text></g><g class="k-vert"><line class="l" x1="158.9" y1="96.7" x2="167.3" y2="156.1" stroke-width="2"/><polygon class="p" points="158.9,96.7 155.8,103.2 163.7,102.1"/><polygon class="p" points="167.3,156.1 162.5,150.7 170.4,149.6"/><text x="173.1" y="131.4" font-size="13.5" text-anchor="start" class="t" font-weight="700">2 cm</text></g><g class="k-vert"><line class="l" x1="416.4" y1="60.5" x2="424.7" y2="119.9" stroke-width="2"/><polygon class="p" points="416.4,60.5 413.3,67.0 421.2,65.9"/><polygon class="p" points="424.7,119.9 420.0,114.5 427.9,113.4"/><text x="430.6" y="95.2" font-size="13.5" text-anchor="start" class="t" font-weight="700">2 cm</text></g>
```
On note : **(d1) // (d2)**. Exemples : les rails d'un train, les lignes du cahier.

**Vérifier ou tracer** : on mesure l'écart à deux endroits avec la règle (il doit être pareil), ou on trace deux perpendiculaires à une même droite : **deux droites perpendiculaires à une même droite sont parallèles entre elles**.

## Exercices

1. Écris avec les symboles : la droite (AB) est perpendiculaire à la droite (CD).
2. Cite 3 exemples de droites parallèles dans la maison.
3. Trace une droite (d), puis une droite perpendiculaire à (d) passant par un point A, puis une deuxième perpendiculaire à (d). Que peux-tu dire des deux perpendiculaires ?

## Corrigé

1. (AB) ⊥ (CD)
2. Les barreaux d'une échelle, les bords opposés d'une table, les lignes du carrelage…
3. Elles sont parallèles.
