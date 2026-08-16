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
| `js/units/<faction>.js` | objet `unitImages` (chemins des PNG) — **un module par faction, tirets** |
| `js/core.js` | `FACTION_GROUPS`, `factionBanners`, `loadLords`, utilitaires partagés |
| `assets/portraits/` | portraits de seigneurs, 60×130 |
| `assets/units/` | cartes d'unités et de héros, 60×130 |

**Une fiche et son module d'images vont par paire.** Ajouter une unité dans
`data/<faction>.json` impose d'ajouter sa clé dans `js/units/<faction>.js`, et nulle part ailleurs :
une page ne charge que le module de sa propre faction. Une clé déclarée dans le module d'une autre
faction ne sera pas vue. L'oubli ne produit **aucune erreur** — la carte s'affiche simplement sans
image. `validate_fiche.ps1` et `tools/verifier-icones.ps1` détectent tous deux ce cas.

Un `grep` d'une clé peut renvoyer plusieurs lignes sans qu'il y ait de doublon : environ 77 clés
sont légitimement déclarées dans deux modules, quand deux races partagent la même unité.

`js/data.js` n'existe plus : il regroupait les 32 factions en un registre unique de 343 Ko que
chaque page téléchargeait en entier. Une référence à ce fichier dans une note ou un script est
périmée.

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

**Ne jamais commenter le comportement du mod.** Une fiche décrit ce que fait une capacité, pas les
curiosités de son affichage. Quand le nom d'une capacité diffère entre la ligne d'effet et son
infobulle, ou comporte une coquille, ne pas le signaler : retenir le nom de l'**infobulle** — celui
qu'on lit en survolant pour voir les valeurs — et n'écrire que les valeurs. Le user a coupé deux fois
sur ce point : « Fenzy » / « Frenzy » chez Thyk Skolsson, et une note qui expliquait un verrouillage
de recrutement chez Gerik Barkov (« pas besoin de précision, c'est hors contexte »). Même règle pour
les noms d'unités : on écrit le nom affiché, sans mentionner celui de la clé interne ni les variantes
trouvées dans le pack.

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

**Une capacité de héros accordée par un effet n'est pas une consigne de remplissage.** Un
« +2 de capacité pour les Chaos Sorcerers of Slaanesh » est un plafond de **recrutement à l'échelle
de la faction** : il autorise à en avoir davantage en jeu, répartis entre plusieurs armées, pas à
les entasser dans celle du seigneur. Ne monter la quantité sur la fiche que si le build y gagne —
un héros dont les effets se cumulent, une aura à saturer, une école de magie qui porte la fiche.
Sinon, en aligner un ou deux et **expliquer la capacité dans la note** : le lecteur saura qu'il
peut en recruter d'autres pour ses armées secondaires. Le raccourci « +2, donc j'en mets 3 » donne
des fiches encombrées de héros interchangeables.

**Départager deux RoR qui visent la même unité de base

Quand plusieurs Régiments de Renom dérivent de la même unité et que la quantité de celle-ci ne
suffit pas à tous les accueillir, deux vérifications tranchent, dans cet ordre :

1. **La recrutabilité.** Si un seul est accessible au seigneur, la question ne se pose plus.
2. **Le lore.** Si les deux sont recrutables, chercher un lien entre le seigneur et l'un des
   régiments — province, ordre, emblème, héraldique. Le nom du régiment suffit souvent : « The
   Stubborn Bulls » désigne le **taureau d'Averland**, donc il revient à Marius Leitdorf, Comte
   Électeur d'Averland, plutôt que « Knights of Morr » ou « Knights of the Everlasting Light ».

Ne jamais départager au hasard ni « au meilleur profil » : la règle est la même que pour le choix
d'une fiche d'accueil pour un héros légendaire (§6 de `analyse-pack.md`), et elle produit une note
justifiable au lieu d'un arbitrage arbitraire.

Un RoR se place sur TOUTES les fiches qui peuvent le recruter**, pas une seule fois. C'est la
différence avec un héros légendaire : chaque fiche décrit une campagne distincte, donc le fait qu'un
régiment soit unique *en partie* n'empêche pas de le proposer à chaque seigneur qui y a accès. Le
critère est double et mécanique — la faction a accès au pool, et la fiche aligne déjà l'unité de
base. Ne pas arbitrer « chez qui il va le mieux » comme pour un héros : cette question ne se pose
que si l'accès est restreint.

**Priorité aux Régiments de Renom dans le corps d'armée.** À bénéfice comparable, préférer le RoR à
l'unité standard équivalente : c'est la version d'élite, elle porte souvent une capacité propre, et
comme elle est unique elle ne dispute pas les plafonds partagés entre variantes. Les chercher dans
`db\mercenary_*` en composant, sans oublier les RoR **vanilla** qu'un mod se contente de désigner
comme Régiment favori.

Deux limites, et la première n'est pas celle qu'on croit. `qty` vaut **1 par défaut**, mais un effet
de faction du type « Régiment favori <em>X</em> : +1 capacité » relève ce plafond — dans ce cas
`qty: 2` est correct, et c'est même le jeu voulu. Vérifier le bloc d'effets avant de trancher.

La seconde est plus contraignante : **il faut que la faction du seigneur ait accès au pool**. Cela
se lit dans `db\faction_to_mercenary_set_junctions_tables`, qui associe une clé de faction à un pool
de Régiments de Renom. Les factions **ajoutées par un mod n'y figurent souvent pas** : sur Kislev,
seules les quatre factions du jeu de base sont rattachées au pool, les trois factions moddées du
site en sont absentes. Ne jamais présumer qu'une race entière partage le même pool.

### Corriger une quantité : jamais par `Replace()` global

**Ne jamais corriger un `qty` par un `String.Replace()` sur le contenu entier du fichier.** Un
fichier de faction contient une vingtaine de seigneurs qui partagent le même roster : `{"icon":
"deepwoodScouts", "name": "Deepwood Scouts", "qty": 2,` apparaît à l'identique dans plusieurs
fiches. Un `Replace()` les modifie **toutes**, silencieusement.

C'est arrivé sur le lot LCCP : trois `Replace()` destinés à trois fiches en ont dégradé **neuf
autres**, passées à 19/20 sans que rien ne le signale sur le moment. Les fiches touchées étaient
Belannaer, Korhil, Rakaph, Orion, Wychwethyl, Daith, la Fée Enchanteresse, Mogen et Hagen — aucune
n'avait de rapport avec le mod en cours.

Deux conséquences pratiques :

1. **Cibler l'entrée.** Utiliser l'outil `Edit` avec une chaîne qui inclut le début de la `note`,
   qui est propre à chaque fiche. `"qty": 2, "note": "Archers furtifs (Stalk)` est unique là où
   `"qty": 2,` ne l'est pas. Si la note elle-même est dupliquée entre deux fiches, c'est un signal :
   soit les deux doivent changer, soit il faut d'abord différencier les notes.
2. **Valider toute la faction, pas la fiche.** `validate_fiche.ps1 -Faction <x>` sans `-Id` passe en
   revue tous les seigneurs du fichier. C'est ce qui a révélé les neuf régressions ; un contrôle
   limité à `-Id` les aurait laissées partir au commit. Après un lot, boucler sur **tous** les
   `data\*.json` du site, pas seulement ceux qu'on croit avoir touchés.

Et si le mal est fait : `git diff --unified=0` sur les fichiers concernés, filtré sur les lignes
`qty`, isole exactement les lignes modifiées. Chaque hunk `-`/`+` donne l'ancienne valeur à
restaurer.

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
Butcher et Slaughtermaster (Great Maw / Beasts / et les variantes ajoutées par les mods). Le réflexe
vaut aussi pour les lanceurs génériques qu'on écrit machinalement sans variante — **Mage** (Haute
Magie / Feu / Cieux / Vie / Lumière / Ombres / Mort / Bêtes), **Sorceress** (Magie Noire / Feu /
Ombres / Mort / Bêtes), **Liche Priest** (Nehekhara / Lumière / Mort), Damsel, Necromancer,
Shaman. Le user a dû redemander la précision sur ces trois-là en particulier.

**Un savoir n'a pas de carte dédiée.** Vérifié dans les packs du jeu : `ui\units\icons\` ne contient
**aucune** entrée pour `mage`, `sorceress`, `liche`, ni pour les héros elfes sylvains. Les héros
n'ont pas de carte d'unité du tout — leur vignette vient de `ui\portraits\units\`, et cette image
est **unique quel que soit le savoir**. Donc : ne pas partir en extraction pour trouver une carte
« Mage (Feu) », elle n'existe pas. L'image générique du site est la bonne, seul le `name` porte la
variante. Corollaire : deux entrées de savoirs différents partagent légitimement la même clé
d'icône, et ce n'est pas une image approximative au sens de la règle d'invariants.

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

**Ne plus dessiner de sceau.** Le champ `seal` d'une fiche est un vestige : l'objet `seals` qui le
résolvait vit désormais dans `js/fallback-svg.js`, qu'aucune page ne charge. Les 321 seigneurs ont
tous un `portraitImage`, et c'est lui seul qui s'affiche. Un sceau ajouté aujourd'hui ne serait
jamais rendu — un seigneur sans `portraitImage` afficherait un cadre vide, ce qui est le
comportement voulu : la règle du site veut l'image réelle ou rien, jamais une approximation.

Ce qu'il faut faire à la place : extraire le vrai portrait dans `assets/portraits/` et renseigner
`portraitImage`. Le champ `seal` peut rester tel quel sur les fiches existantes, il est inerte.

Les cartes et portraits font 60×130 (certaines cartes sont en 120×260, la variante nette pour les
écrans haute densité). `extract_card.ps1` refuse une source de moins de 40×80, ce qui protège des
icônes prises pour des cartes.

### Tailles : ne jamais réduire une carte, toujours réduire une bannière

Ces deux règles vont en sens inverse, et c'est la mesure qui les impose — vérifiée le 16/08/2026.

**Cartes et portraits : ne jamais les redimensionner.** Un portrait de 60×130 est affiché à 68×152
par `.seal`, donc déjà *agrandi* ; les réduire dégraderait un rendu qui manque déjà de résolution.
Les 455 cartes en 120×260 sont exactement au bon format pour un écran 2× et doivent le rester.

**Bannières : 1840 px de large au maximum.** `.page` plafonne à 920 px, donc 1840 px est le double
de la largeur d'affichage — net même en haute densité, et tout pixel au-delà est téléchargé pour
rien. Des bannières allaient jusqu'à 5378 px. À l'enregistrement d'une nouvelle faction :

```powershell
magick <source> -resize "1840x>" -quality 85 -strip assets\banners\<faction>.jpg
```

Le `>` est important : il interdit l'agrandissement d'une source déjà plus petite.

### L'extension d'un fichier ne dit pas son format

**684 fichiers d'`assets/` portent l'extension `.png` ou `.jpg` alors qu'ils contiennent du WebP.**
Le site fonctionne — un navigateur identifie une image par son contenu, pas par son nom — mais
`Get-Item` et un simple coup d'œil au nom induisent en erreur. Avant de ré-encoder ou d'analyser un
lot, lire les octets de signature : `0x89 0x50` pour du PNG, `RIFF…WEBP` pour du WebP, `0xFF 0xD8`
pour du JPEG. Ré-encoder un WebP en JPEG parce que le fichier s'appelle `.jpg` l'alourdit.

### Métadonnées

Les PNG issus de certains outils traînent un chunk `zTXt` sans rapport avec le rendu — jusqu'à
1,24 Mo de texte pour 19 Ko de pixels. Retirer les chunks `zTXt`, `tEXt`, `iTXt`, `eXIf` et `tIME`
est **sans perte** : les données de pixels ne sont pas ré-encodées. Après une passe d'extraction,
vérifier qu'aucun fichier neuf ne dépasse largement les ~25 Ko attendus pour une carte.

**Après toute édition de `unitImages`, vérifier que le module parse** — voir la section
Vérification du SKILL.md. Une virgule manquante vide la page de la faction en silence ; le
découpage limite les dégâts à cette page, alors qu'auparavant elle vidait tout le site.

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
