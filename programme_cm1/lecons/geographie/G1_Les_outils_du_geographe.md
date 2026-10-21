# G1 — Les outils du géographe : carte, plan, paysage
<!-- objectifs : geographie-2-3 -->

## Qu'est-ce que la géographie ?

La **géographie** étudie **comment les humains vivent sur la Terre** et **aménagent** les lieux (villes, routes, champs, ports…).

## Les documents du géographe

| Document | Ce qu'il montre |
|---|---|
| **Photographie de paysage** | ce qu'on voit d'un endroit, à hauteur d'homme |
| **Photo aérienne** | un lieu vu **d'en haut** (avion, drone) |
| **Image satellite** | une très grande région vue de très haut |
| **Plan** | une petite surface (une ville, un quartier) vue de dessus, très détaillée |
| **Carte** | un espace plus grand (une région, un pays, le monde), simplifié |
| **Globe** | la Terre en boule, sans déformation |
| **Planisphère** | le monde entier à plat (forcément un peu déformé) |

```schema chaine
Photo de paysage / à hauteur d'homme | vert
-> je monte
Photo aérienne / vue d'en haut | bleu
-> je simplifie
Plan / un quartier | orange
-> je m'éloigne
Carte / une région, un pays | violet
->
Planisphère / le monde entier | rouge
legende: Du plus **proche** au plus **lointain** : on voit un espace de plus en plus **grand**, avec de moins en moins de détails.
```

## Lire une carte : TOLÉ

- **T**itre : de quoi parle la carte ?
- **O**rientation : la **rose des vents** (le Nord est en général en haut).
- **L**égende : ce que veulent dire les couleurs et les symboles.
- **É**chelle : combien de km dans la réalité pour 1 cm sur la carte.

**L'échelle** : *1 cm = 10 km* → deux villes à 4 cm sur la carte sont à **40 km** dans la réalité.

```schema dessin
taille: 640x320
legende: **T**itre, **O**rientation, **L**égende, **É**chelle : les 4 choses à regarder sur une carte. Ici, les villes A et B sont à 4 cm, donc à **40 km** l'une de l'autre.
<rect class="cadran" x="10" y="10" width="620" height="300" rx="6" stroke-width="2"/><rect class="plein k-bleu" x="11" y="230" width="618" height="79" opacity=".55"/><path class="f k-vert" stroke-width="0" d="M11 60 H629 V230 Q520 250 430 225 Q330 205 230 236 Q130 255 11 228 Z"/><path class="l k-bleu" stroke-width="3" fill="none" d="M150 60 Q170 120 140 160 Q120 200 160 240"/><g class="k-rouge"><circle class="p" cx="210" cy="190" r="7"/><circle class="p" cx="410" cy="190" r="7"/><text x="210" y="180" font-size="13" text-anchor="middle" class="t" font-weight="700">Ville A</text><text x="410" y="180" font-size="13" text-anchor="middle" class="t" font-weight="700">Ville B</text></g><line class="axe" stroke-width="1.5" stroke-dasharray="5 4" x1="217" x2="403" y1="190" y2="190"/><text x="310" y="208" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">4 cm sur la carte</text><rect class="f k-jaune" x="10" y="10" width="620" height="44" rx="6" stroke-width="2"/><text x="320" y="39" font-size="17" text-anchor="middle" font-weight="700">Ma région</text><circle class="cadran" cx="570" cy="112" r="30" stroke-width="1.5"/><polygon class="plein k-rouge" points="570.0,86.0 578.0,112.0 562.0,112.0"/><text x="570.0" y="72.0" font-size="17" text-anchor="middle" class="t k-rouge" font-weight="700">N</text><polygon class="plein k-vert" points="596.0,112.0 570.0,120.0 570.0,104.0"/><text x="616.0" y="118.0" font-size="17" text-anchor="middle" class="t k-vert" font-weight="700">E</text><polygon class="plein k-bleu" points="570.0,138.0 562.0,112.0 578.0,112.0"/><text x="570.0" y="164.0" font-size="17" text-anchor="middle" class="t k-bleu" font-weight="700">S</text><polygon class="plein k-orange" points="544.0,112.0 570.0,104.0 570.0,120.0"/><text x="524.0" y="118.0" font-size="17" text-anchor="middle" class="t k-orange" font-weight="700">O</text><rect class="cadran" x="22" y="244" width="150" height="56" rx="6" stroke-width="1.5"/><circle class="p k-rouge" cx="38" cy="262" r="5"/><text x="50" y="266" font-size="12.5" text-anchor="start">ville</text><line class="l k-bleu" stroke-width="3" x1="32" x2="46" y1="285" y2="285"/><text x="50" y="289" font-size="12.5" text-anchor="start">rivière</text><rect class="plein k-gris" x="430" y="276" width="46" height="10"/><rect class="vide k-gris" x="476" y="276" width="46" height="10"/><rect class="plein k-gris" x="522" y="276" width="46" height="10"/><rect class="vide k-gris" x="568" y="276" width="46" height="10"/><text x="430" y="270" font-size="11" text-anchor="middle" class="mute" font-weight="700">0</text><text x="624" y="270" font-size="11" text-anchor="end" class="mute" font-weight="700">40 km</text><text x="522" y="302" font-size="12" text-anchor="middle" class="mute" font-weight="700">1 cm = 10 km</text><circle class="plein k-orange" cx="60" cy="34" r="13"/><text x="60" y="40" font-size="16" text-anchor="middle" font-weight="700">T</text><circle class="plein k-rouge" cx="612" cy="66" r="13"/><text x="612" y="72" font-size="16" text-anchor="middle" font-weight="700">O</text><circle class="plein k-violet" cx="180" cy="254" r="13"/><text x="180" y="260" font-size="16" text-anchor="middle" font-weight="700">L</text><circle class="plein k-bleu" cx="420" cy="300" r="13"/><text x="420" y="306" font-size="16" text-anchor="middle" font-weight="700">É</text>
```

## Les points cardinaux

```schema dessin
taille: 520x250
legende: La **rose des vents** avec les 8 directions. Marseille est au **sud-est** (SE) de la France.
<circle class="cadran" cx="125" cy="125" r="84" stroke-width="1.5"/><polygon class="plein k-rouge" points="125.0,45.0 133.0,125.0 117.0,125.0"/><text x="125.0" y="31.0" font-size="17" text-anchor="middle" class="t k-rouge" font-weight="700">N</text><polygon class="plein k-vert" points="205.0,125.0 125.0,133.0 125.0,117.0"/><text x="225.0" y="131.0" font-size="17" text-anchor="middle" class="t k-vert" font-weight="700">E</text><polygon class="plein k-bleu" points="125.0,205.0 117.0,125.0 133.0,125.0"/><text x="125.0" y="231.0" font-size="17" text-anchor="middle" class="t k-bleu" font-weight="700">S</text><polygon class="plein k-orange" points="45.0,125.0 125.0,117.0 125.0,133.0"/><text x="25.0" y="131.0" font-size="17" text-anchor="middle" class="t k-orange" font-weight="700">O</text><polygon class="plein k-gris" points="168.8,81.2 130.7,130.7 119.3,119.3"/><text x="195.7" y="60.3" font-size="13.5" text-anchor="middle" class="t k-gris" font-weight="700">NE</text><polygon class="plein k-violet" points="168.8,168.8 119.3,130.7 130.7,119.3"/><text x="195.7" y="201.7" font-size="13.5" text-anchor="middle" class="t k-violet" font-weight="700">SE</text><polygon class="plein k-gris" points="81.2,168.8 119.3,119.3 130.7,130.7"/><text x="54.3" y="201.7" font-size="13.5" text-anchor="middle" class="t k-gris" font-weight="700">SO</text><polygon class="plein k-gris" points="81.2,81.2 130.7,119.3 119.3,130.7"/><text x="54.3" y="60.3" font-size="13.5" text-anchor="middle" class="t k-gris" font-weight="700">NO</text><g transform="translate(262,8) scale(0.78)"><polygon class="f k-vert" stroke-width="2" points="165,15 215,40 260,60 290,80 285,120 265,165 285,195 290,235 272,255 240,262 205,268 180,262 160,290 120,285 55,272 45,258 60,200 55,160 20,125 15,105 75,100 95,75 125,60 150,40"/><ellipse class="f k-vert" stroke-width="2" cx="302" cy="282" rx="8" ry="16"/></g><circle class="p k-rouge" cx="443" cy="212" r="6"/><text x="440" y="236" font-size="13" text-anchor="middle" class="t k-rouge" font-weight="700">Marseille</text>
```

Entre les deux : **Nord-Est**, **Nord-Ouest**, **Sud-Est**, **Sud-Ouest**. Marseille est dans le **sud-est** de la France.

## Lire un paysage

Un **paysage** est ce qu'on voit d'un endroit. On le décrit en **plans** :
- le **premier plan** (le plus proche, en bas de la photo),
- le **second plan** (au milieu),
- l'**arrière-plan** (le plus loin, en haut).

```schema dessin
taille: 640x240
legende: Un paysage se lit en **trois plans**, du bas (le plus proche) vers le haut (le plus loin).
<rect class="f k-bleu" x="10" y="10" width="420" height="70" stroke-width="0" opacity=".6"/><polygon class="f k-gris" stroke-width="1.5" points="10,80 90,30 160,70 240,25 330,72 430,40 430,80"/><rect class="f k-vert" x="10" y="80" width="420" height="70" stroke-width="0"/><circle class="plein k-vert" cx="30" cy="110" r="12"/><circle class="plein k-vert" cx="76" cy="116" r="12"/><circle class="plein k-vert" cx="122" cy="122" r="12"/><circle class="plein k-vert" cx="168" cy="110" r="12"/><circle class="plein k-vert" cx="214" cy="116" r="12"/><circle class="plein k-vert" cx="260" cy="122" r="12"/><circle class="plein k-vert" cx="306" cy="110" r="12"/><circle class="plein k-vert" cx="352" cy="116" r="12"/><circle class="plein k-vert" cx="398" cy="122" r="12"/><rect class="f k-jaune" x="10" y="150" width="420" height="80" stroke-width="0"/><path class="axe-p" d="M150 230 L200 150 H230 L280 230 Z" opacity=".35"/><rect class="f k-orange" x="40" y="175" width="40" height="34" stroke-width="1.5"/><polygon class="plein k-rouge" points="36,175 60,158 84,175"/><rect class="f k-orange" x="320" y="175" width="40" height="34" stroke-width="1.5"/><polygon class="plein k-rouge" points="316,175 340,158 364,175"/><rect class="f k-orange" x="370" y="175" width="40" height="34" stroke-width="1.5"/><polygon class="plein k-rouge" points="366,175 390,158 414,175"/><line class="axe" x1="10" x2="430" y1="80" y2="80" stroke-dasharray="4 4"/><line class="axe" x1="10" x2="430" y1="150" y2="150" stroke-dasharray="4 4"/><text x="446" y="50" font-size="15" text-anchor="start" font-weight="700">arrière-plan</text><text x="446" y="68" font-size="12.5" text-anchor="start" class="mute">le plus loin, en haut</text><text x="446" y="118" font-size="15" text-anchor="start" font-weight="700">second plan</text><text x="446" y="136" font-size="12.5" text-anchor="start" class="mute">au milieu</text><text x="446" y="192" font-size="15" text-anchor="start" font-weight="700">premier plan</text><text x="446" y="210" font-size="12.5" text-anchor="start" class="mute">le plus proche, en bas</text>
```

On distingue :
- les **éléments naturels** : relief (montagne, colline, plaine), eau (mer, rivière), végétation (forêt), climat ;
- les **éléments humains** (construits par l'homme) : maisons, routes, champs, ports, usines.

Un paysage peut être **urbain** (ville), **rural** (campagne), **littoral** (bord de mer), **montagnard**.

## Exercices

1. Que signifient les 4 lettres de TOLÉ ?
2. Sur une carte, 1 cm = 5 km. Deux villes sont à 6 cm. Quelle distance dans la réalité ?
3. Dans quelle direction est Lille depuis Marseille ? (Lille est tout en haut de la France.)

## Corrigé

1. Titre, Orientation, Légende, Échelle.
2. 6 × 5 = 30 km.
3. Vers le nord.
