# ORTH5 — L'orthographe des mots (orthographe lexicale)
<!-- objectifs : francais-4-6 francais-4-7 francais-1-3 -->

💡 **Conseil** : ces règles et la liste de mots invariables sont à revoir souvent, un peu chaque jour.

## 1. Les lettres muettes à la fin des mots

Pour trouver la lettre muette, je cherche un **mot de la même famille** ou je mets au **féminin** :
- *un chat* → *une chatte* → **t**
- *le bord* → *border* → **d**
- *un camp* → *camper* → **p**
- *le galop* → *galoper* → **p**
- *gris* → *grise* → **s**
- *le sang* → *sanguin* → **g**

```schema dessin
taille: 640x130
legende: La **lettre muette** (en rouge) s'entend dans un **mot de la même famille** ou au **féminin**.
<text x="14" y="34" font-size="20" font-weight="700">cha<tspan class="t k-rouge">t</tspan></text><g class="k-gris"><text class="t" x="70.0" y="32" font-size="15">←</text></g><text x="90.0" y="32" font-size="15" text-anchor="start" class="mute" font-weight="700">une chatte</text><text x="224" y="34" font-size="20" font-weight="700">bor<tspan class="t k-rouge">d</tspan></text><g class="k-gris"><text class="t" x="280.0" y="32" font-size="15">←</text></g><text x="300.0" y="32" font-size="15" text-anchor="start" class="mute" font-weight="700">border</text><text x="434" y="34" font-size="20" font-weight="700">cam<tspan class="t k-rouge">p</tspan></text><g class="k-gris"><text class="t" x="490.0" y="32" font-size="15">←</text></g><text x="510.0" y="32" font-size="15" text-anchor="start" class="mute" font-weight="700">camper</text><text x="14" y="90" font-size="20" font-weight="700">galo<tspan class="t k-rouge">p</tspan></text><g class="k-gris"><text class="t" x="82.0" y="88" font-size="15">←</text></g><text x="102.0" y="88" font-size="15" text-anchor="start" class="mute" font-weight="700">galoper</text><text x="224" y="90" font-size="20" font-weight="700">gri<tspan class="t k-rouge">s</tspan></text><g class="k-gris"><text class="t" x="280.0" y="88" font-size="15">←</text></g><text x="300.0" y="88" font-size="15" text-anchor="start" class="mute" font-weight="700">grise</text><text x="434" y="90" font-size="20" font-weight="700">san<tspan class="t k-rouge">g</tspan></text><g class="k-gris"><text class="t" x="490.0" y="88" font-size="15">←</text></g><text x="510.0" y="88" font-size="15" text-anchor="start" class="mute" font-weight="700">sanguin</text>
```

## 2. La valeur des lettres

| Règle | Exemples |
|---|---|
| **c** devant e, i, y = [s] ; devant a, o, u, il faut **ç** | ceci, cinéma · ça, garçon, reçu |
| **g** devant e, i, y = [j] ; devant a, o, u, il faut **ge** | girafe, page · il mangea, pigeon |
| **gu** pour faire [g] devant e, i | guerre, guide |
| **s** entre deux voyelles = [z] ; pour [s] il faut **ss** | poison [z] / poisson [s] |
| **m** devant **m, b, p** (au lieu de n) | ombre, jambe, tempête, emmener — *sauf* bonbon, bonbonnière, embonpoint |

```schema dessin
taille: 642x286
legende: Les lettres changent de son selon la lettre qui suit.
<rect class="f k-bleu" x="6" y="6" width="150" height="132" rx="12" stroke-width="2"/><text x="81.0" y="30" font-size="14.5" text-anchor="middle" class="t k-bleu" font-weight="700">c + e, i, y</text><text x="81.0" y="68" font-size="24" text-anchor="middle" class="t k-bleu" font-weight="700">[s]</text><text x="81.0" y="86" font-size="12.5" text-anchor="middle">ceci, cinéma</text><rect class="f k-vert" x="166" y="6" width="150" height="132" rx="12" stroke-width="2"/><text x="241.0" y="30" font-size="14.5" text-anchor="middle" class="t k-vert" font-weight="700">ç + a, o, u</text><text x="241.0" y="68" font-size="24" text-anchor="middle" class="t k-vert" font-weight="700">[s]</text><text x="241.0" y="86" font-size="12.5" text-anchor="middle">ça, garçon, reçu</text><rect class="f k-orange" x="326" y="6" width="150" height="132" rx="12" stroke-width="2"/><text x="401.0" y="30" font-size="14.5" text-anchor="middle" class="t k-orange" font-weight="700">g + e, i, y</text><text x="401.0" y="68" font-size="24" text-anchor="middle" class="t k-orange" font-weight="700">[j]</text><text x="401.0" y="86" font-size="12.5" text-anchor="middle">girafe, page</text><rect class="f k-violet" x="486" y="6" width="150" height="132" rx="12" stroke-width="2"/><text x="561.0" y="30" font-size="14.5" text-anchor="middle" class="t k-violet" font-weight="700">ge + a, o, u</text><text x="561.0" y="68" font-size="24" text-anchor="middle" class="t k-violet" font-weight="700">[j]</text><text x="561.0" y="86" font-size="12.5" text-anchor="middle">il mangea, pigeon</text><rect class="f k-rouge" x="6" y="148" width="150" height="132" rx="12" stroke-width="2"/><text x="81.0" y="172" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">s entre 2</text><text x="81.0" y="190" font-size="14.5" text-anchor="middle" class="t k-rouge" font-weight="700">voyelles</text><text x="81.0" y="228" font-size="24" text-anchor="middle" class="t k-rouge" font-weight="700">[z]</text><text x="81.0" y="246" font-size="12.5" text-anchor="middle">poison</text><rect class="f k-gris" x="166" y="148" width="150" height="132" rx="12" stroke-width="2"/><text x="241.0" y="172" font-size="14.5" text-anchor="middle" class="t k-gris" font-weight="700">ss</text><text x="241.0" y="210" font-size="24" text-anchor="middle" class="t k-gris" font-weight="700">[s]</text><text x="241.0" y="228" font-size="12.5" text-anchor="middle">poisson</text><rect class="f k-jaune" x="326" y="148" width="150" height="132" rx="12" stroke-width="2"/><text x="401.0" y="172" font-size="14.5" text-anchor="middle" class="t k-jaune" font-weight="700">m devant m, b, p</text><text x="401.0" y="210" font-size="24" text-anchor="middle" class="t k-jaune" font-weight="700">m</text><text x="401.0" y="228" font-size="12.5" text-anchor="middle">ombre, jambe,</text><text x="401.0" y="244" font-size="12.5" text-anchor="middle">tempête</text><rect class="f k-bleu" x="486" y="148" width="150" height="132" rx="12" stroke-width="2"/><text x="561.0" y="172" font-size="14.5" text-anchor="middle" class="t k-bleu" font-weight="700">gu + e, i</text><text x="561.0" y="210" font-size="24" text-anchor="middle" class="t k-bleu" font-weight="700">[g]</text><text x="561.0" y="228" font-size="12.5" text-anchor="middle">guerre, guide</text>
```

## 3. Les accents

- **é** (aigu) : *été, école*
- **è** (grave) : *mère, très, où, à*
- **ê** (circonflexe) : *fête, forêt* — souvent un ancien *s* : *forêt → forestier*, *fête → festival*
- Pas d'accent sur **e** devant deux consonnes ou une consonne finale : *terre, mer, nez*

## 4. Les consonnes doubles

Souvent après **a, o** en début de mot : *apporter, accrocher, attendre, offrir, occuper*.
Mais attention : *atelier, acheter, otage*. → Vérifier dans le dictionnaire en cas de doute.

## 5. Mots invariables à connaître par cœur (CM1)

> alors · après · assez · au-dessus · aujourd'hui · aussi · autant · autour · avant · avec · beaucoup · bien · bientôt · car · cependant · chez · comme · d'abord · dans · dedans · dehors · déjà · depuis · derrière · dès · devant · donc · encore · enfin · ensemble · ensuite · entre · environ · hier · ici · jamais · jusque · là · loin · longtemps · lorsque · maintenant · mais · malgré · mieux · moins · parce que · parfois · parmi · pendant · peu · peut-être · plus · plusieurs · pourtant · pourquoi · près · presque · puis · quand · quelquefois · sans · sauf · selon · soudain · sous · souvent · surtout · tant · tard · tôt · toujours · toutefois · très · trop · vers · vite · voici · voilà

**Méthode d'apprentissage** : 5 mots par jour → je lis, je cache, j'écris, je vérifie (et je recommence ceux que j'ai ratés).

```schema chaine
boucle: oui
Je lis / le mot
->
Je le cache
->
Je l'écris
->
Je vérifie
-> raté ? je recommence
legende: La **boucle** pour apprendre les mots : 5 mots par jour, et je recommence ceux que j'ai ratés.
```

## Exercices

1. Trouve la lettre muette : un ran… (rang) · un tapi… · gran… · un éclat…
2. Complète par c ou ç : un gar…on · une le…on · …a · re…evoir
3. Complète par m ou n : une la…pe · un ca…ion · e…porter · un bo…bon

## Corrigé

1. rang (ranger) · tapis (tapisser) · grand (grande) · éclat (éclater)
2. garçon · leçon · ça · recevoir
3. lampe · camion · emporter · bonbon
