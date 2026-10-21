# GEO6 — Se repérer et programmer des déplacements
<!-- objectifs : maths-13-7 maths-13-8 maths-15-1 maths-15-2 -->

## Se repérer sur un quadrillage

On repère une case avec une **lettre** (colonne) et un **chiffre** (ligne), comme à la bataille navale.

```schema dessin
taille: 386x210
legende: L'étoile est au croisement de la **colonne B** et de la **ligne 2** (en jaune).
<rect class="f k-jaune" x="94" y="36" width="54" height="162" opacity=".55" stroke-width="0"/><rect class="f k-jaune" x="40" y="90" width="216" height="54" opacity=".55" stroke-width="0"/><line class="axe" x1="40" x2="40" y1="36" y2="198" stroke-width="1.5"/><line class="axe" x1="94" x2="94" y1="36" y2="198" stroke-width="1.5"/><line class="axe" x1="148" x2="148" y1="36" y2="198" stroke-width="1.5"/><line class="axe" x1="202" x2="202" y1="36" y2="198" stroke-width="1.5"/><line class="axe" x1="256" x2="256" y1="36" y2="198" stroke-width="1.5"/><line class="axe" x1="40" x2="256" y1="36" y2="36" stroke-width="1.5"/><line class="axe" x1="40" x2="256" y1="90" y2="90" stroke-width="1.5"/><line class="axe" x1="40" x2="256" y1="144" y2="144" stroke-width="1.5"/><line class="axe" x1="40" x2="256" y1="198" y2="198" stroke-width="1.5"/><text x="67.0" y="24" font-size="16" text-anchor="middle" class="t k-bleu" font-weight="700">A</text><text x="121.0" y="24" font-size="16" text-anchor="middle" class="t k-bleu" font-weight="700">B</text><text x="175.0" y="24" font-size="16" text-anchor="middle" class="t k-bleu" font-weight="700">C</text><text x="229.0" y="24" font-size="16" text-anchor="middle" class="t k-bleu" font-weight="700">D</text><text x="26" y="69.0" font-size="16" text-anchor="middle" class="t k-rouge" font-weight="700">1</text><text x="26" y="123.0" font-size="16" text-anchor="middle" class="t k-rouge" font-weight="700">2</text><text x="26" y="177.0" font-size="16" text-anchor="middle" class="t k-rouge" font-weight="700">3</text><polygon class="plein k-orange" points="121.0,99.0 125.8,110.4 138.1,111.4 128.7,119.5 131.6,131.6 121.0,125.1 110.4,131.6 113.3,119.5 103.9,111.4 116.2,110.4"/><circle class="p k-bleu" cx="229.0" cy="171.0" r="14"/><text x="274" y="122.0" font-size="14" text-anchor="start" font-weight="700">★ en (B ; 2)</text><text x="274" y="176.0" font-size="14" text-anchor="start" font-weight="700">● en (D ; 3)</text>
```
→ L'étoile est en **(B ; 2)**. Le rond est en **(D ; 3)**.
⚠️ On donne d'abord la **colonne**, puis la **ligne**.

Sur un quadrillage de **nœuds** (croisements de lignes), on repère le **point** de la même façon.

## Se repérer sur un plan

- Les **points cardinaux** : **N**ord (en haut), **S**ud (en bas), **E**st (à droite), **O**uest (à gauche).
  Astuce : « **N**e **S**ois **E**ncore **O**ublié » → N, puis S, puis E à droite, O à gauche.

```schema dessin
taille: 400x220
legende: La **rose des vents** : sur une carte, le nord est presque toujours **en haut**.
<circle class="cadran" cx="110" cy="110" r="62" stroke-width="2"/><polygon class="plein k-rouge" points="110.0,52.0 120.0,110.0 100.0,110.0"/><text x="110.0" y="37.0" font-size="20" text-anchor="middle" class="t k-rouge" font-weight="700">N</text><polygon class="plein k-bleu" points="110.0,168.0 100.0,110.0 120.0,110.0"/><text x="110.0" y="197.0" font-size="20" text-anchor="middle" class="t k-bleu" font-weight="700">S</text><polygon class="plein k-vert" points="168.0,110.0 110.0,120.0 110.0,100.0"/><text x="190.0" y="117.0" font-size="20" text-anchor="middle" class="t k-vert" font-weight="700">E</text><polygon class="plein k-orange" points="52.0,110.0 110.0,100.0 110.0,120.0"/><text x="30.0" y="117.0" font-size="20" text-anchor="middle" class="t k-orange" font-weight="700">O</text><text x="250" y="70" font-size="14" text-anchor="start" class="t k-rouge" font-weight="700">Nord : en haut</text><text x="250" y="96" font-size="14" text-anchor="start" class="t k-bleu" font-weight="700">Sud : en bas</text><text x="250" y="122" font-size="14" text-anchor="start" class="t k-vert" font-weight="700">Est : à droite</text><text x="250" y="148" font-size="14" text-anchor="start" class="t k-orange" font-weight="700">Ouest : à gauche</text>
```

- La **légende** explique les symboles ; l'**échelle** permet de calculer les distances réelles.

## Décrire un déplacement

- *Avancer de 3 cases, tourner à droite, avancer de 2 cases.*
- ⚠️ **Gauche** et **droite** dépendent du **sens dans lequel regarde** le personnage, pas de la feuille !

## Programmer

Un **programme** est une **suite d'instructions** que suit un robot ou un ordinateur, **dans l'ordre**.

| Instruction | Effet |
|---|---|
| ↑ avancer | avance d'une case dans la direction où il regarde |
| ↻ tourner à droite | tourne d'un quart de tour, **sans avancer** |
| ↺ tourner à gauche | idem vers la gauche |
| répéter 4 fois [ … ] | fait 4 fois les instructions entre crochets |

**Exemple** : tracer un carré de 3 cases
> répéter 4 fois [ avancer 3 · tourner à droite ]

```schema dessin
taille: 476x260
legende: Le robot part du point rouge vers le haut. Chaque **couleur** est un passage dans la boucle « répéter ».
<line class="grille" x1="20" x2="20" y1="20" y2="240"/><line class="grille" x1="64" x2="64" y1="20" y2="240"/><line class="grille" x1="108" x2="108" y1="20" y2="240"/><line class="grille" x1="152" x2="152" y1="20" y2="240"/><line class="grille" x1="196" x2="196" y1="20" y2="240"/><line class="grille" x1="240" x2="240" y1="20" y2="240"/><line class="grille" x1="20" x2="240" y1="20" y2="20"/><line class="grille" x1="20" x2="240" y1="64" y2="64"/><line class="grille" x1="20" x2="240" y1="108" y2="108"/><line class="grille" x1="20" x2="240" y1="152" y2="152"/><line class="grille" x1="20" x2="240" y1="196" y2="196"/><line class="grille" x1="20" x2="240" y1="240" y2="240"/><g class="k-bleu"><line class="l" stroke-width="4" x1="64" y1="196" x2="64.0" y2="72.0"/><polygon class="p k-bleu" points="64,64 70.0,72.0 58.0,72.0"/></g><g class="k-vert"><line class="l" stroke-width="4" x1="64" y1="64" x2="188.0" y2="64.0"/><polygon class="p k-vert" points="196,64 188.0,70.0 188.0,58.0"/></g><g class="k-orange"><line class="l" stroke-width="4" x1="196" y1="64" x2="196.0" y2="188.0"/><polygon class="p k-orange" points="196,196 190.0,188.0 202.0,188.0"/></g><g class="k-violet"><line class="l" stroke-width="4" x1="196" y1="196" x2="72.0" y2="196.0"/><polygon class="p k-violet" points="64,196 72.0,190.0 72.0,202.0"/></g><circle class="p k-rouge" cx="64" cy="196" r="9"/><text x="64" y="224" font-size="12.5" text-anchor="middle" class="t k-rouge" font-weight="700">départ</text><text x="266" y="50" font-size="15" text-anchor="start" font-weight="700">répéter 4 fois [</text><rect class="plein k-bleu" x="266" y="188" width="14" height="14" rx="3"/><rect class="plein k-vert" x="286" y="188" width="14" height="14" rx="3"/><rect class="plein k-orange" x="306" y="188" width="14" height="14" rx="3"/><rect class="plein k-violet" x="326" y="188" width="14" height="14" rx="3"/><text x="296" y="74" font-size="14" text-anchor="start">avancer 3</text><text x="296" y="96" font-size="14" text-anchor="start">tourner à droite</text><text x="266" y="172" font-size="15" text-anchor="start" font-weight="700">]</text><text x="350" y="200" font-size="12.5" text-anchor="start" class="mute">= 4 tours de boucle</text>
```

En classe, on utilise souvent **Scratch** ou un robot (Bee-Bot, Thymio…). Scratch est gratuit sur [scratch.mit.edu](https://scratch.mit.edu).

**Un bug**, c'est une erreur dans le programme. On le corrige en relisant les instructions une par une (« **déboguer** »).

## Exercices

1. Sur un quadrillage de A à E et de 1 à 5, le robot est en (A ; 1), il regarde vers la droite. Programme : avancer 2, tourner à gauche, avancer 3. Où arrive-t-il ? (Les lignes augmentent vers le haut.)
2. Écris un programme avec « répéter » pour tracer un rectangle de 4 cases sur 2.

## Corrigé

1. Il va en (C ; 1), puis tourne vers le haut, puis monte de 3 → **(C ; 4)**.
2. répéter 2 fois [ avancer 4 · tourner à droite · avancer 2 · tourner à droite ]
