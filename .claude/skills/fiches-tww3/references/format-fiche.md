# Format et rédaction d'une fiche

## Sommaire

1. Où va quoi
2. Structure JSON
3. Bloc `effects` : deux sous-titres, jamais trois
4. Rédiger le build
5. Sceaux et images
6. Commits

---

## 1. Où va quoi

| Fichier | Contenu |
|---|---|
| `data/<faction>.json` | tableau des seigneurs de la faction (**tirets** : `ogre-kingdoms.json`) |
| `<faction>.html` | page de la faction (**underscores** : `ogre_kingdoms.html`) |
| `js/data.js` | objet `seals` (SVG en ligne) puis objet `unitImages` (chemins des PNG) |
| `assets/portraits/` | portraits de seigneurs, 60×130 |
| `assets/units/` | cartes d'unités et de héros, 60×130 |

`js/data.js` contient **deux** objets qui partagent parfois une même clé : `seals` pour le SVG du
sceau, `unitImages` pour le chemin du PNG. Un `grep` d'une clé peut donc renvoyer deux lignes sans
qu'il y ait de doublon.

---

## 2. Structure JSON

```json
{
  "id": "bulMalletHands",
  "numeral": "VII",
  "name": "Bul Mallet-hands",
  "epithet": "Le Maître de la Vallée des Toiles",
  "wikiUrl": "https://totalwarwarhammer.fandom.com/wiki/Ogre_Kingdoms",
  "faction": "Blood Guzzlers",
  "seal": "bulMalletHands",
  "portraitImage": "assets/portraits/bulMalletHands.png",
  "lore": "<p>…</p>\n      <p>…</p>",
  "effects": "…",
  "build": {
    "role": "…",
    "totalSlots": 20,
    "lord":   {"icon": "…", "name": "…", "qty": 1, "note": "…"},
    "heroes": [{"icon": "…", "name": "…", "qty": 2, "note": "…"}],
    "army":   [{"icon": "…", "name": "…", "qty": 3, "note": "…"}],
    "magic": "…",
    "note": "…"
  }
}
```

`id` en camelCase, `numeral` en chiffres romains suivant l'ordre d'apparition dans le fichier.
`epithet` est libre : un surnom court en français, tiré du lore.
`wikiUrl` pointe la page du personnage si elle existe, sinon celle de la race.

---

## 3. Bloc `effects` : deux sous-titres, jamais trois

Exactement deux `army-subhead` : **« Effets de faction »** puis **« Effets du seigneur »**. Le
premier porte `style="margin-top:0;"`.

Les capacités ne prennent **jamais** de section dédiée : elles sont repliées dans la ligne d'effet
qui les mentionne, avec leurs valeurs chiffrées.

```html
<div class="attr-item">Capacité <strong>"Spider Incubation"</strong> — active, Invocation,
<strong>2 utilisations</strong> : invoque une unité de <strong>Spider Hatchlings</strong>,
25m de portée, 1s, rechargement 60s, se recharge au corps-à-corps ; l'unité invoquée se
dégrade avec le temps</div>
```

Les malus reprennent la couleur du jeu : `style="color:#d17a6a;"` sur l'`attr-item`.

Le bloc se termine par une `stats-caveat` qui dit d'où viennent les données — captures du user,
infobulles, et tables du mod avec son numéro workshop et le nom du pack.

Traduire les effets en français mais **garder les noms propres en anglais** : noms de capacités,
d'unités, de factions. C'est ce que le user voit en jeu.

---

## 4. Rédiger le build

**Poser l'arithmétique AVANT d'écrire le JSON.** `1 seigneur + Σ qty des héros + Σ qty des unités
= 20`, exactement. Écrire la liste avec ses quantités, additionner, ajuster — *puis* rédiger.

Ce n'est pas une précaution théorique : sur un chantier de huit fiches, sept sont sorties à 21, 22,
23 ou 24 slots parce que j'avais composé d'abord et compté ensuite. `validate_fiche.ps1` les
rattrape toutes, donc rien ne part faux, mais les coupes de rattrapage sont mécaniques — on retire
une unité parce qu'il faut retirer quelque chose, pas parce que le build est meilleur sans elle.
Une liste posée juste du premier coup est mieux pensée qu'une liste corrigée après coup.

**La seule règle est le total de 20.** La répartition entre héros et unités est libre et doit
suivre ce que les effets du seigneur récompensent — il n'y a pas de quota. Un seigneur dont les
capacités s'accrochent aux héros en mérite beaucoup : Vazgrat en aligne **4**, Volrik **3** parce
que sa faction gagne des bonus sur les Vents de Magie élevés, et Sss'el'ari saturerait de héros
puisque son aura ne touche que les Seigneurs et Héros. À l'inverse, Throgg et Sayl n'en ont
qu'**un** : rien dans leurs effets ne récompense d'en aligner davantage, et le slot vaut mieux
ailleurs. Choisir le nombre en fonction du seigneur, pas d'une habitude.

Un `qty` de héros compte dans le total au même titre qu'une unité — deux Bouchers, c'est deux
slots. C'est l'erreur de calcul la plus fréquente.

**`role`** — trois à cinq phrases qui expliquent la logique de la liste. Partir de la mécanique
centrale du seigneur, pas d'une description du roster. La bonne question : qu'est-ce qui rend cette
faction différente des autres de sa race, et qu'est-ce que cela impose au build ?

**`note` de chaque unité** — dire *pourquoi elle est là*, en citant l'effet qui la justifie et en
précisant sa source entre parenthèses : `(seigneur)` ou `(faction)`. Une note qui ne fait que
décrire l'unité n'apporte rien.

**`magic`** — quels lanceurs de sorts, quel savoir, et pourquoi ce dosage. Si la fiche n'a pas de
soin, le dire et expliquer ce qui compense.

**`note` finale** — les réserves et les conditions. C'est l'endroit pour : les DLC requis, les
mécaniques plafonnées, les conditions de déclenchement, les unités écartées faute de nom, les
arbitrages assumés. Le user lit cette section : elle doit lui éviter une mauvaise surprise en jeu.

**Préciser la variante dès qu'une unité ou un héros en a plusieurs.** Le user le demande
systématiquement, et cela vaut pour les deux familles de variantes.

*Savoirs de magie* : Daemonsmith Sorcerer (Hashut / Fire / Metal / Death), Chaos Sorcerer of Nurgle
(Nurgle / Death), Chaos Sorcerer of Tzeentch (Tzeentch / Metal), Plagueridden (Nurgle / Death),
Butcher et Slaughtermaster (Great Maw / Beasts / et les variantes ajoutées par les mods).

*Armements* : Black Orcs (Great Weapons / Dual Weapons), Ogre Bulls (Ironfists / Dual Weapons),
Maneaters (Ironfists / Great Weapons / Ogre Pistols), Crushers et Mournfang Cavalry (Ironfists /
Great Weapons), Yhetees (Ironfists / Great Weapons), Savage Orcs (Spears / Bows) — la liste n'est
pas close, le réflexe l'est.

Format : `Nom (Variante)` dans le champ `name`, et le choix justifié par les effets du seigneur.
Un seigneur qui réduit le coût des sorts de Tzeentch n'a que faire d'une variante Métal ; un
seigneur dont le Waaagh! donne **+50% de dégâts perforants** veut des armes lourdes et pas des
armes doubles. La variante n'est jamais un détail cosmétique : elle est le plus souvent la raison
pour laquelle l'unité est dans la liste.

**Comment savoir quelle variante porte une clé du site.** Ne pas le déduire du nom de la clé :
`blackOrcs` désigne en réalité `wh_main_grn_inf_black_orcs`, dont le nom vanilla est *Black Orcs
(Great Weapons)*. Vérifier dans la loc du jeu de base, puis **vérifier aussi comment les fiches
existantes nomment cette même clé** — si elles divergent, aligner tout le site plutôt que d'ajouter
une divergence de plus.

Ton général : direct, concret, sans emphase creuse. Signaler les faiblesses d'un build aussi
clairement que ses forces. Quand deux fiches s'éclairent mutuellement — deux seigneurs miroirs de la
même race — le dire et renvoyer de l'une à l'autre.

---

## 5. Sceaux et images

Chaque seigneur a un `seal` : un SVG en ligne de 24×24 dans l'objet `seals`, trait
`var(--accent-secondary)`, `stroke-width` autour de 1.6, sans remplissage sauf pour de petits
points. Le motif reprend un élément du lore ou de la mécanique — une araignée, un chaudron, un
canon. Insérer les nouveaux sceaux au milieu de l'objet, jamais après la dernière entrée, pour
limiter les conflits.

Les images font toutes 60×130. `extract_card.ps1` refuse une source de moins de 40×80, ce qui
protège des icônes prises pour des cartes.

**Après toute édition de `unitImages`, vérifier que le fichier parse** — voir la section
Vérification du SKILL.md. Une virgule manquante vide tout le site en silence.

---

## 6. Commits

Message en français, sans accents (l'encodage du terminal les mange), écrit dans un fichier
temporaire et passé avec `git commit -F`. Structure qui fonctionne bien :

- une ligne de titre courte
- le mod concerné : numéro workshop et nom du pack
- la liste des seigneurs ou modifications, avec leur numéro romain
- pour chacun, la mécanique centrale en deux ou trois lignes
- les corrections signalées par le user, nommées comme telles
- le nombre d'images extraites et qui les a extraites
- la ligne de validation : slots, parsing, images cassées

Terminer par `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

Après le push, mettre à jour la mémoire : avancement du mod, et toute leçon de méthode nouvelle.
