# GEO3 — Le cercle
<!-- objectifs : maths-12-2 maths-12-4 maths-12-10 -->

## Le vocabulaire

```schema dessin
taille: 470x235
legende: Tous les points du cercle sont **à la même distance du centre** : c'est le **rayon**. Le diamètre passe par le centre : il vaut **2 rayons**.
<circle class="f k-bleu" cx="150" cy="125" r="95" stroke-width="3"/><g class="k-vert"><line class="l" x1="63.9" y1="84.9" x2="236.1" y2="165.1" stroke-width="3"/></g><g class="k-rouge"><line class="l" x1="150" y1="125" x2="236.1" y2="84.9" stroke-width="4"/></g><circle class="axe-p" cx="150" cy="125" r="4.5"/><text x="142" y="145" font-size="15" text-anchor="middle" font-weight="700">O</text><circle class="p k-rouge" cx="236.1" cy="84.9" r="4"/><text x="246.1" y="80.9" font-size="15" text-anchor="start" font-weight="700">A</text><circle class="p k-vert" cx="63.9" cy="84.9" r="4"/><circle class="p k-vert" cx="236.1" cy="165.1" r="4"/><text x="55.9" y="84.9" font-size="15" text-anchor="end" font-weight="700">B</text><text x="244.1" y="177.1" font-size="15" text-anchor="start" font-weight="700">C</text><rect class="f k-encre" x="290" y="28" width="18" height="18" rx="9"/><text x="318" y="42" font-size="14.5" text-anchor="start" font-weight="700">centre O</text><text x="318" y="59" font-size="12.5" text-anchor="start" class="mute">le point du milieu</text><rect class="f k-bleu" x="290" y="70" width="18" height="18" rx="9"/><text x="318" y="84" font-size="14.5" text-anchor="start" class="t k-bleu" font-weight="700">cercle</text><text x="318" y="101" font-size="12.5" text-anchor="start" class="mute">la ligne courbe</text><rect class="f k-rouge" x="290" y="112" width="18" height="18" rx="3"/><text x="318" y="126" font-size="14.5" text-anchor="start" class="t k-rouge" font-weight="700">rayon [OA]</text><text x="318" y="143" font-size="12.5" text-anchor="start" class="mute">du centre au cercle</text><rect class="f k-vert" x="290" y="154" width="18" height="18" rx="3"/><text x="318" y="168" font-size="14.5" text-anchor="start" class="t k-vert" font-weight="700">diamètre [BC]</text><text x="318" y="185" font-size="12.5" text-anchor="start" class="mute">= 2 × rayon</text><rect class="plein k-bleu" x="290" y="196" width="18" height="18" rx="3"/><text x="318" y="210" font-size="14.5" text-anchor="start" class="t k-bleu" font-weight="700">disque</text><text x="318" y="227" font-size="12.5" text-anchor="start" class="mute">la surface coloriée</text>
```

- Le **centre** (O) : le point au milieu.
- Le **cercle** : la ligne courbe. **Tous ses points sont à la même distance du centre.**
- Le **rayon** : un segment qui va du **centre** à un point du cercle. C'est aussi sa longueur.
- Le **diamètre** : un segment qui traverse le cercle **en passant par le centre**. **Diamètre = 2 × rayon.**
- Le **disque** : la surface à l'intérieur du cercle.

## Tracer un cercle au compas

1. J'écarte le compas de la **longueur du rayon** (je mesure sur la règle).
2. Je pique la **pointe sèche** sur le **centre**.
3. Je tourne en tenant le compas **par le haut**, sans appuyer, sans changer l'écartement.

```schema dessin
taille: 400x230
legende: La **pointe sèche** reste piquée sur le centre ; la **mine** trace le cercle. L'écartement du compas, c'est le **rayon**.
<path class="l k-bleu" stroke-width="2.5" fill="none" d="M230 175 A120 120 0 0 0 151.0 62.2"/><path class="l k-bleu" stroke-width="2" fill="none" stroke-dasharray="5 5" d="M151.0 62.2 A120 120 0 0 0 6.1 115.0"/><line class="axe" stroke-width="7" stroke-linecap="round" x1="170" y1="30" x2="112" y2="165"/><line class="axe" stroke-width="1.5" x1="112" y1="165" x2="110" y2="175"/><line class="axe" stroke-width="7" stroke-linecap="round" x1="170" y1="30" x2="228" y2="161"/><polygon class="p k-gris" points="224,159 232,163 230,175"/><rect class="f k-orange" x="163" y="4" width="14" height="22" rx="4"/><circle class="cadran" cx="170" cy="30" r="7" stroke-width="2"/><g class="k-rouge"><line class="l" x1="110" y1="197" x2="230" y2="197" stroke-width="2"/><polygon class="p" points="110,197 119,192 119,202"/><polygon class="p" points="230,197 221,192 221,202"/><text x="170.0" y="217" font-size="13.5" text-anchor="middle" class="t" font-weight="700">écartement = rayon</text></g><circle class="axe-p" cx="110" cy="175" r="3.5"/><text x="100" y="179" font-size="14" text-anchor="end" font-weight="700">O</text><text x="86" y="135" font-size="12.5" text-anchor="end" class="mute" font-weight="700">pointe sèche</text><text x="86" y="150" font-size="12.5" text-anchor="end" class="mute" font-weight="700">sur le centre</text><text x="246" y="153" font-size="12.5" text-anchor="start" class="mute" font-weight="700">mine</text><text x="186" y="20" font-size="12.5" text-anchor="start" class="mute" font-weight="700">je tiens par le haut</text>
```

⚠️ Si on me donne le **diamètre**, je le **divise par 2** pour avoir le rayon : *cercle de 8 cm de diamètre → rayon 4 cm*.

## Le compas sert aussi à reporter des longueurs

Je prends une longueur avec le compas, et je la reporte ailleurs sans la mesurer à la règle.

## Exercices

1. Un cercle a un rayon de 3 cm. Quel est son diamètre ?
2. Un cercle a un diamètre de 10 cm. Quel est son rayon ?
3. Trace un cercle de centre O et de rayon 4 cm. Trace un diamètre [AB]. Mesure-le.

## Corrigé

1. 6 cm · 2. 5 cm · 3. [AB] mesure 8 cm.
