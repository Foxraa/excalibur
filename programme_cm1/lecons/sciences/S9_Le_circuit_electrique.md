# S9 — Le circuit électrique
<!-- objectifs : sciences-3-1 sciences-1-4 -->

## Le circuit simple

Pour qu'une **ampoule** s'allume, il faut un **circuit fermé** : une boucle **sans interruption** entre la **pile** et l'ampoule.

```schema dessin
taille: 620x256
legende: À gauche, l'interrupteur est **ouvert** : la boucle est coupée. À droite, il est **fermé** : le courant fait le tour (flèches vertes) et l'ampoule s'allume.
<path class="trait" stroke-width="3" fill="none" d="M50 85 V40 H135 M185 40 H270 V170 H190 M130 170 H50 V125"/><rect class="f k-rouge" x="34" y="85" width="32" height="40" rx="3" stroke-width="2"/><text x="50" y="101" font-size="14" text-anchor="middle" class="t k-rouge" font-weight="700">+</text><text x="50" y="120" font-size="14" text-anchor="middle" class="t k-rouge" font-weight="700">−</text><text x="26" y="110" font-size="13" text-anchor="end" font-weight="700">pile</text><circle class="cadran" cx="160" cy="40" r="24" stroke-width="2.5"/><path class="trait" stroke-width="2" fill="none" d="M148 40 q6 -14 12 0 q6 14 12 0"/><text x="160" y="86" font-size="13" text-anchor="middle" font-weight="700">ampoule</text><circle class="axe-p" cx="130" cy="170" r="4"/><circle class="axe-p" cx="190" cy="170" r="4"/><line class="trait" stroke-width="3.5" x1="130" y1="170" x2="180" y2="140"/><text x="160" y="194" font-size="13" text-anchor="middle" font-weight="700">interrupteur</text><text x="160" y="228" font-size="15" text-anchor="middle" class="t k-rouge" font-weight="700">circuit OUVERT</text><text x="160" y="246" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">le courant ne passe pas : éteinte</text><path class="trait" stroke-width="3" fill="none" d="M360 85 V40 H445 M495 40 H580 V170 H500 M440 170 H360 V125"/><rect class="f k-rouge" x="344" y="85" width="32" height="40" rx="3" stroke-width="2"/><text x="360" y="101" font-size="14" text-anchor="middle" class="t k-rouge" font-weight="700">+</text><text x="360" y="120" font-size="14" text-anchor="middle" class="t k-rouge" font-weight="700">−</text><text x="336" y="110" font-size="13" text-anchor="end" font-weight="700">pile</text><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="500.0" y1="40.0" x2="512.0" y2="40.0"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="494.3" y1="57.6" x2="504.0" y2="64.7"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="479.3" y1="68.5" x2="483.0" y2="79.9"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="460.7" y1="68.5" x2="457.0" y2="79.9"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="445.7" y1="57.6" x2="436.0" y2="64.7"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="440.0" y1="40.0" x2="428.0" y2="40.0"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="445.7" y1="22.4" x2="436.0" y2="15.3"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="460.7" y1="11.5" x2="457.0" y2="0.1"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="479.3" y1="11.5" x2="483.0" y2="0.1"/><line class="l k-jaune" stroke-width="3" stroke-linecap="round" x1="494.3" y1="22.4" x2="504.0" y2="15.3"/><circle class="plein k-jaune" cx="470" cy="40" r="24" stroke-width="2.5"/><path class="trait" stroke-width="2" fill="none" d="M458 40 q6 -14 12 0 q6 14 12 0"/><text x="470" y="100" font-size="13" text-anchor="middle" font-weight="700">ampoule</text><circle class="axe-p" cx="440" cy="170" r="4"/><circle class="axe-p" cx="500" cy="170" r="4"/><line class="trait" stroke-width="3.5" x1="440" y1="170" x2="500" y2="170"/><text x="470" y="194" font-size="13" text-anchor="middle" font-weight="700">interrupteur</text><g class="k-vert"><line class="l" stroke-width="2" x1="580.0" y1="80.0" x2="580.0" y2="112.0"/><polygon class="p" points="580.0,120.0 574.0,112.0 586.0,112.0"/></g><g class="k-vert"><line class="l" stroke-width="2" x1="550.0" y1="170.0" x2="528.0" y2="170.0"/><polygon class="p" points="520.0,170.0 528.0,164.0 528.0,176.0"/></g><g class="k-vert"><line class="l" stroke-width="2" x1="360.0" y1="60.0" x2="360.0" y2="52.0"/><polygon class="p" points="360.0,44.0 366.0,52.0 354.0,52.0"/></g><text x="470" y="228" font-size="15" text-anchor="middle" class="t k-vert" font-weight="700">circuit FERMÉ</text><text x="470" y="246" font-size="12.5" text-anchor="middle" class="mute" font-weight="700">le courant passe : l'ampoule brille</text>
```

- le **générateur** : la **pile** (une borne **+** et une borne **−**) ;
- le **récepteur** : l'**ampoule** (ou un moteur, une sonnette, une DEL) ;
- les **fils** de connexion (en cuivre, entourés de plastique) ;
- l'**interrupteur** : il **ouvre** (éteint) ou **ferme** (allume) le circuit.

**Circuit ouvert** → le courant ne passe pas → l'ampoule est éteinte.
**Circuit fermé** → le courant passe → l'ampoule s'allume.

## Conducteurs et isolants

On teste en plaçant l'objet dans le circuit, à la place d'un morceau de fil :
- l'ampoule s'allume → **conducteur** : les **métaux** (fer, cuivre, aluminium), la mine de crayon (graphite) ;
- l'ampoule reste éteinte → **isolant** : **plastique**, **bois**, **verre**, caoutchouc, papier, tissu.

```schema dessin
taille: 562x108
legende: Le test : je mets l'objet dans le circuit. L'ampoule s'allume ? C'est un **conducteur**.
<rect class="f k-vert" x="6" y="6" width="270" height="96" rx="12" stroke-width="2"/><text x="141.0" y="30" font-size="14.5" text-anchor="middle" class="t k-vert" font-weight="700">Conducteurs</text><text x="141.0" y="50" font-size="12.5" text-anchor="middle">laissent passer le courant : métaux</text><text x="141.0" y="66" font-size="12.5" text-anchor="middle">(fer, cuivre, aluminium), mine de</text><text x="141.0" y="82" font-size="12.5" text-anchor="middle">crayon</text><rect class="f k-rouge" x="286" y="6" width="270" height="96" rx="12" stroke-width="2"/><text x="421.0" y="30" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">Isolants</text><text x="421.0" y="50" font-size="12.5" text-anchor="middle">ne laissent pas passer le courant :</text><text x="421.0" y="66" font-size="12.5" text-anchor="middle">plastique, bois, verre, caoutchouc,</text><text x="421.0" y="82" font-size="12.5" text-anchor="middle">papier</text>
```

C'est pour ça que les fils sont en **cuivre** (conducteur) entourés de **plastique** (isolant, pour se protéger).

## Le court-circuit

Si on relie directement les deux bornes de la pile avec un fil, **sans ampoule**, c'est un **court-circuit** : la pile **chauffe** et s'**use** très vite. C'est **dangereux**.

## ⚠️ Les règles de sécurité

L'électricité de la maison (les **prises**, **230 volts**) est **très dangereuse** : elle peut **tuer**. Une pile de 4,5 V ne l'est pas.
- Ne **jamais** mettre les doigts ou un objet dans une prise.
- Ne **jamais** toucher un appareil électrique avec les **mains mouillées** ou dans le bain.
- Ne **jamais** s'approcher d'un fil électrique tombé par terre, ni jouer près des lignes électriques et des transformateurs.
- Débrancher en tirant sur la **prise**, pas sur le fil.

```schema dessin
taille: 642x138
legende: Les **règles de sécurité** avec l'électricité.
<rect class="f k-rouge" x="6" y="6" width="150" height="126" rx="12" stroke-width="2"/><text x="81.0" y="30" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">prise</text><text x="81.0" y="64" font-size="20" text-anchor="middle" class="t k-rouge" font-weight="700">230 V</text><text x="81.0" y="82" font-size="12.5" text-anchor="middle">très dangereux :</text><text x="81.0" y="98" font-size="12.5" text-anchor="middle">jamais les doigts ni</text><text x="81.0" y="114" font-size="12.5" text-anchor="middle">un objet</text><rect class="f k-rouge" x="166" y="6" width="150" height="126" rx="12" stroke-width="2"/><text x="241.0" y="30" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">mains mouillées</text><text x="241.0" y="64" font-size="20" text-anchor="middle" class="t k-rouge" font-weight="700">jamais</text><text x="241.0" y="82" font-size="12.5" text-anchor="middle">ne pas toucher un</text><text x="241.0" y="98" font-size="12.5" text-anchor="middle">appareil électrique</text><rect class="f k-rouge" x="326" y="6" width="150" height="126" rx="12" stroke-width="2"/><text x="401.0" y="30" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">fil tombé</text><text x="401.0" y="64" font-size="20" text-anchor="middle" class="t k-rouge" font-weight="700">loin !</text><text x="401.0" y="82" font-size="12.5" text-anchor="middle">ne jamais s'en</text><text x="401.0" y="98" font-size="12.5" text-anchor="middle">approcher</text><rect class="f k-vert" x="486" y="6" width="150" height="126" rx="12" stroke-width="2"/><text x="561.0" y="30" font-size="14.5" text-anchor="middle" class="t k-vert" font-weight="700">pile 4,5 V</text><text x="561.0" y="64" font-size="20" text-anchor="middle" class="t k-vert" font-weight="700">sans danger</text><text x="561.0" y="82" font-size="12.5" text-anchor="middle">pour les expériences</text>
```

## Exercices

1. Pourquoi l'ampoule ne s'allume-t-elle pas si le circuit est ouvert ?
2. Classe en conducteurs / isolants : clé en fer, gomme, règle en plastique, pièce de monnaie, crayon (côté bois).
3. Pourquoi ne faut-il pas toucher un sèche-cheveux avec les mains mouillées ?

## Corrigé

1. Parce que le courant ne peut pas faire le tour du circuit.
2. Conducteurs : clé en fer, pièce de monnaie. Isolants : gomme, règle en plastique, bois.
3. Parce que l'eau conduit l'électricité : on risque l'électrocution.
