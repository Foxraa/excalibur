# MES4 — L'heure et les durées
<!-- objectifs : maths-11-1 maths-11-2 maths-11-3 maths-11-4 -->

## Lire l'heure *(vu en période 1)*

- La **petite aiguille** indique les **heures**.
- La **grande aiguille** indique les **minutes** (chaque chiffre = 5 minutes).

| Grande aiguille sur… | Minutes | On peut dire… |
|---|---|---|
| 12 | 00 | « pile » |
| 3 | 15 | « et quart » |
| 6 | 30 | « et demie » |
| 9 | 45 | « moins le quart » (de l'heure suivante) |

```schema horloge
3:00 : trois heures pile
3:15 : trois heures et quart
3:30 : trois heures et demie
3:45 : quatre heures moins le quart
```

Une journée = **24 heures** : *3 h de l'après-midi = **15 h***. *8 h du soir = **20 h***.

```schema droite
min: 0
max: 24
pas: 1
etiquettes: 3
15 : 15 h = 3 h de l'après-midi
20 : 20 h | violet
entre 0 et 12 : le matin (et la nuit)
entre 12 et 24 : l'après-midi et le soir
legende: Après midi (12 h), on continue de compter : **13 h, 14 h, 15 h**… jusqu'à 24 h (minuit).
```

## Les unités de durée

| | |
|---|---|
| 1 minute (min) | = **60 secondes** (s) |
| 1 heure (h) | = **60 minutes** |
| 1 jour | = **24 heures** |
| 1 semaine | = **7 jours** |
| 1 mois | = 28, 29, 30 ou 31 jours |
| 1 année | = **12 mois** = **365 jours** (**366** les années bissextiles) |
| 1 siècle | = **100 ans** |
| 1 millénaire | = **1 000 ans** |

```schema chaine
seconde
-> × 60
minute
-> × 60
heure
-> × 24
jour
-> × 7
semaine
couleur: bleu
legende: 60 secondes font 1 minute, 60 minutes font 1 heure, 24 heures font 1 jour, 7 jours font 1 semaine.
```

⚠️ On ne compte **pas** de 100 en 100 mais de **60 en 60** : *1 h 30 min ≠ 1,30 h*.
- *½ h = 30 min* · *¼ h = 15 min* · *¾ h = 45 min*

```schema dessin
taille: 560x175
legende: Le tour du cadran = **1 heure = 60 minutes**. Un quart de tour = **15 minutes**.
<circle class="vide k-gris" cx="70" cy="70" r="50"/><path class="plein k-vert" stroke-width="1.5" d="M70 70 L70.0 20.0 A50 50 0 0 1 120.0 70.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M70 70 L120.0 70.0 A50 50 0 0 1 70.0 120.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M70 70 L70.0 120.0 A50 50 0 0 1 20.0 70.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M70 70 L20.0 70.0 A50 50 0 0 1 70.0 20.0 Z"/><circle class="l" fill="none" cx="70" cy="70" r="50" stroke-width="2.5"/><circle class="axe-p" cx="70" cy="70" r="3"/><text x="70" y="145" font-size="16" text-anchor="middle" font-weight="700">¼ h</text><text x="70" y="165" font-size="14" text-anchor="middle" class="mute" font-weight="700">= 15 min</text><circle class="vide k-gris" cx="210" cy="70" r="50"/><path class="plein k-bleu" stroke-width="1.5" d="M210 70 L210.0 20.0 A50 50 0 0 1 260.0 70.0 Z"/><path class="plein k-bleu" stroke-width="1.5" d="M210 70 L260.0 70.0 A50 50 0 0 1 210.0 120.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M210 70 L210.0 120.0 A50 50 0 0 1 160.0 70.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M210 70 L160.0 70.0 A50 50 0 0 1 210.0 20.0 Z"/><circle class="l" fill="none" cx="210" cy="70" r="50" stroke-width="2.5"/><circle class="axe-p" cx="210" cy="70" r="3"/><text x="210" y="145" font-size="16" text-anchor="middle" font-weight="700">½ h</text><text x="210" y="165" font-size="14" text-anchor="middle" class="mute" font-weight="700">= 30 min</text><circle class="vide k-gris" cx="350" cy="70" r="50"/><path class="plein k-violet" stroke-width="1.5" d="M350 70 L350.0 20.0 A50 50 0 0 1 400.0 70.0 Z"/><path class="plein k-violet" stroke-width="1.5" d="M350 70 L400.0 70.0 A50 50 0 0 1 350.0 120.0 Z"/><path class="plein k-violet" stroke-width="1.5" d="M350 70 L350.0 120.0 A50 50 0 0 1 300.0 70.0 Z"/><path class="vide k-gris" stroke-width="1.5" d="M350 70 L300.0 70.0 A50 50 0 0 1 350.0 20.0 Z"/><circle class="l" fill="none" cx="350" cy="70" r="50" stroke-width="2.5"/><circle class="axe-p" cx="350" cy="70" r="3"/><text x="350" y="145" font-size="16" text-anchor="middle" font-weight="700">¾ h</text><text x="350" y="165" font-size="14" text-anchor="middle" class="mute" font-weight="700">= 45 min</text><circle class="vide k-gris" cx="490" cy="70" r="50"/><path class="plein k-orange" stroke-width="1.5" d="M490 70 L490.0 20.0 A50 50 0 0 1 540.0 70.0 Z"/><path class="plein k-orange" stroke-width="1.5" d="M490 70 L540.0 70.0 A50 50 0 0 1 490.0 120.0 Z"/><path class="plein k-orange" stroke-width="1.5" d="M490 70 L490.0 120.0 A50 50 0 0 1 440.0 70.0 Z"/><path class="plein k-orange" stroke-width="1.5" d="M490 70 L440.0 70.0 A50 50 0 0 1 490.0 20.0 Z"/><circle class="l" fill="none" cx="490" cy="70" r="50" stroke-width="2.5"/><circle class="axe-p" cx="490" cy="70" r="3"/><text x="490" y="145" font-size="16" text-anchor="middle" font-weight="700">1 h</text><text x="490" y="165" font-size="14" text-anchor="middle" class="mute" font-weight="700">= 60 min</text>
```

- *90 min = 1 h 30 min* · *2 h = 120 min*

## Calculer une durée

**Méthode des bonds** sur une ligne du temps :
*Le film commence à 14 h 35 et finit à 16 h 10. Combien de temps dure-t-il ?*

```schema bonds
depart: 14 h 35
+25 min > 15 h 00
+1 h > 16 h 00
+10 min > 16 h 10
total: 25 min + 1 h + 10 min = 1 h 35 min
legende: Je fais des **bonds** jusqu'aux **heures pile** : c'est plus facile.
```
→ *25 min + 1 h + 10 min = **1 h 35 min***

## Calculer une heure d'arrivée

*Je pars à 9 h 50. Le trajet dure 45 min. À quelle heure j'arrive ?*
→ *9 h 50 + 10 min = 10 h 00* ; il reste *35 min* → **10 h 35**.

```schema bonds
depart: 9 h 50
+10 min > 10 h 00
+35 min > 10 h 35
total: 10 min + 35 min = 45 min
couleur: bleu
legende: Je coupe les 45 minutes en deux bonds : **10 min** pour aller à l'heure pile, puis les **35 min** qui restent.
```

## Exercices

1. Écris l'heure de l'après-midi : 3 h et quart · 6 h moins le quart · 9 h et demie
2. Convertis : 2 h = … min · 180 min = … h · 1 h 15 min = … min · 3 min = … s
3. La récréation commence à 10 h 15 et dure 20 min. À quelle heure finit-elle ?
4. Un train part à 8 h 40 et arrive à 11 h 05. Combien de temps dure le trajet ?

## Corrigé

1. 15 h 15 · 17 h 45 · 21 h 30
2. 120 · 3 · 75 · 180
3. 10 h 35
4. 8 h 40 → 9 h 00 (20 min) → 11 h 00 (2 h) → 11 h 05 (5 min) = **2 h 25 min**
