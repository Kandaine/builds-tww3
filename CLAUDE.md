# builds-tww3

Site personnel non commercial : catalogue en français de builds à 20 slots pour les seigneurs
légendaires de Total War: WARHAMMER III en Immortal Empires. HTML/CSS/JS statique, sans étape
de build — les pages se servent directement depuis le dossier.

**Le site est publié**, sur GitHub Pages, à https://kandaine.github.io/builds-tww3/ — chaque
push sur `main` le redéploie. Ce n'est donc pas un dossier personnel : ce qui part en ligne est
lu par des visiteurs. Deux conséquences pratiques, à ne pas oublier faute de quoi on
sous-estime l'enjeu de chaque modification :

- une erreur visible — image cassée, fiche fausse, total de slots erroné — n'est pas une gêne
  privée, elle est publique jusqu'au correctif suivant ;
- le poids des pages compte pour de vrai. Un visiteur sur mobile télécharge ce qu'on lui
  envoie ; « ça ne se sent pas en local » n'est pas un argument recevable.

Ma méthode de travail générale est dans `~/.claude/CLAUDE.md`. Ce fichier-ci ne porte que ce
qui est propre au site. Le détail du métier — analyser un mod, rédiger une fiche, extraire une
carte d'unité — vit dans le skill `.claude/skills/fiches-tww3/`, chargé seulement au besoin.
Les mods eux-mêmes — trouver ceux qu'une mise à jour du jeu a cassés et leur poser un patch
temporaire — ont le leur, `.claude/skills/patcher-un-mod/`.

## Critères d'acceptation

Ceux de `~/.claude/CLAUDE.md` s'appliquent aussi. S'y ajoutent, selon ce qui est touché :

Toujours :
- Aucun ` M` sous `assets/` — sauf si j'ai explicitement demandé un remplacement d'image.

Si la modification touche aux fiches (`data/*.json`, `js/units/*.js`) :
- Chaque fiche totalise exactement 20 slots : 1 seigneur + somme des quantités de héros + somme des quantités d'unités.
- Toute clé d'icône d'une fiche est déclarée dans le module de **sa** faction, et le fichier image existe.
- Les deux scripts passent, sur les 32 factions et pas seulement celles qu'on croit avoir touchées :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-icones.ps1
```

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem data\*.json | ForEach-Object { & .\tools\validate_fiche.ps1 -Faction $_.BaseName }"
```

`-ExecutionPolicy Bypass` n'est pas décoratif : la stratégie d'exécution de cette machine est
`Undefined` à tous les niveaux, donc `Restricted` par défaut — sans ce paramètre, Windows refuse de
lancer les deux scripts et renvoie `UnauthorizedAccess`. Le paramètre ne vaut que pour le processus
lancé, il ne change rien à la configuration de la machine.

**Ces deux scripts sont désormais lancés automatiquement**, par deux filets complémentaires — ne
plus compter sur ma discipline pour les exécuter :

- un **hook `pre-commit`** (`.githooks/pre-commit`) qui bloque le commit si la validation échoue,
  en ne testant que les factions présentes dans le commit (~3 s ; sortie immédiate si le commit ne
  touche aucune fiche) ;
- une **GitHub Action** (`.github/workflows/validation.yml`) qui rejoue tout à chaque push sur
  `main`, et qu'on ne peut pas contourner.

Activer le hook, **une seule fois par clone** :

```bash
git config core.hooksPath .githooks
```

Contourner ponctuellement : `git commit --no-verify`. Légitime pour sauvegarder un travail
volontairement incomplet ; jamais pour passer outre une vraie erreur.

Si la modification touche aux **effets** ou au **build** d'une fiche, lancer en plus le contrôle
informatif — il ne bloque rien, mais il est le seul à lire le champ `effects` :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-effets.ps1 -Faction <nom>
```

Il signale les unités nommées dans les effets et absentes du build. Une piste n'est pas une
erreur : un effet peut nommer une unité pour la **déconseiller**. Mais un « Régiment favori » qui
désigne un régiment absent mérite toujours un regard — c'est un bonus qui ne s'applique à rien.

Si la modification touche aux **notes** d'une fiche, lancer le second contrôle informatif — le seul
qui confronte ce qu'une note *affirme* d'une unité à ce que le jeu lui donne :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-attributs.ps1 -Faction <nom>
```

Il cherche les attributs prêtés à tort : un monstre décrit comme volant qui ne vole pas, une
Régénération que l'unité n'a pas. Quatre défauts trouvés ainsi les 18 et 19/08/2026 (Miao Ying,
Volkmar, Kroll, Isabella). **Attendez-vous à une majorité de faux positifs** — la note parle
souvent d'une autre unité de la fiche. Il lit `tools\attributs-unites.txt` (4 423 unités), qui vit
dans le dépôt parce que la CI n'a pas le jeu installé ; son en-tête dit comment le régénérer après
un DLC ou l'ajout d'un mod. Il couvre le jeu de base **et les 133 packs du workshop installés** :
265 lignes du site lui restent inconnues, et son silence sur celles-là n'est pas un certificat.

Enfin, si la modification touche à une note qui affirme une **exclusivité** — « la seule cavalerie
de la fiche », « le seul tir de ce seigneur » :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-exclusivites.ps1 -Faction <nom>
```

Il confronte ces affirmations à la contrepartie du **même** régiment : l'unité de base alignée sous
son Régiment de Renom, ou l'inverse. C'est le défaut le plus fréquent du site — 59 corrigés le
19/08/2026 — et il a une cause datable : la passe RoR a placé le régiment à côté de sa base sans
que la phrase soit relue. **Il ne tombera jamais à zéro** : une trentaine d'exclusivités sont
légitimes parce qu'elles portent sur un effet, un roster ou le site, pas sur un rôle. Les laisser
est le comportement correct ; son en-tête donne les quatre formes à reconnaître.

Si la modification touche au front (HTML / CSS / JS) :
- La console du navigateur est vierge sur un onglet neuf.
- Aucune carte d'unité sans image, aucune image cassée (`naturalWidth === 0`).
- Une page de faction ne charge que `js/core.js`, son `js/units/<faction>.js` et `js/app.js`.
- Un fichier JS modifié parse : une virgule manquante vide la page sans erreur visible dans `git diff`.

## Le code livré est commenté — critère bloquant

Ce site n'a pas d'équipe. Ce qui n'est pas écrit dans le fichier est perdu : ni toi ni moi ne
nous souviendrons dans six mois pourquoi une variable existe ou pourquoi une valeur vaut `.8`
et pas `.45`. **Une fonctionnalité livrée sans commentaire n'est pas livrée.**

À vérifier avant de me dire qu'une tâche est finie :

- **Toute fonction a un commentaire au-dessus d'elle**, qui dit ce qu'elle fait ET ce que ses
  paramètres signifient. Aucune exception, y compris pour les fonctions de trois lignes.
- **Toute décision non évidente porte son POURQUOI**, pas seulement son quoi. « `replaceState`
  et non `pushState` » sans la raison ne sert à rien ; avec la raison, personne ne la
  réintroduira par erreur.
- **Tout chiffre écrit dans un commentaire a été mesuré**, et le commentaire dit comment. Un
  chiffre non mesuré est une valeur inventée, ce qui est interdit partout ailleurs sur ce
  projet et ne devient pas acceptable parce que c'est « juste un commentaire ».
- **Un piège rencontré est consigné à l'endroit où on retombera dedans**, pas dans le message
  de commit que personne ne relit.
- **Les nouveaux sélecteurs CSS** suivent la même règle que les fonctions.

Les trois premiers points sont vérifiés mécaniquement, sur tout le JavaScript écrit à la main
et sur les 32 modules d'icônes :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-commentaires.ps1
```

Il tourne dans le hook `pre-commit` dès qu'un `js/**.js` est touché — périmètre plus large que
celui des fiches, parce que modifier `js/app.js` ne peut pas casser un total de slots mais peut
très bien y laisser une fonction non documentée — et dans la GitHub Action, en premier.

**La présence d'un commentaire ne prouve rien — c'est sa justesse qui compte, et aucun script
ne sait la vérifier.** Le 17/08/2026, en insérant des fonctions dans `js/core.js`, j'ai laissé
le commentaire de `matchesSearch` au-dessus de `nomsDUnites` : il décrivait la mauvaise fonction
*et* l'ancien comportement. `verifier-commentaires.ps1` l'aurait déclaré conforme — la fonction
avait bien un commentaire au-dessus d'elle. Après tout déplacement ou insertion de fonction,
relire ce qui se trouve juste au-dessus de chacune reste un geste humain.

Si la modification touche aux images :
- Bannières : 1840 px de large au maximum, jamais d'agrandissement.
- Cartes et portraits : dimensions **inchangées** — ils sont déjà affichés agrandis.
- Après une passe sans perte, les empreintes de pixels doivent être identiques avant/après.

## Chiffres de référence

Relevés le 23/08/2026 après la refonte graphique « Old World », remesurés le 08/09 et le 17/10/2026. Un écart
n'est pas forcément une erreur, mais il doit être expliqué, jamais ignoré :

| Mesure | Valeur | Comment la mesurer |
|---|---|---|
| Factions | 32 | nombre de `data/*.json` |
| Seigneurs légendaires | 325 | somme des entrées de tous les `data/*.json` |
| Cartes d'unité affichées, toutes fiches confondues | 4100 | somme, par seigneur, de `1 + heroes + army` — en **nombre de lignes**, pas de quantités |
| Couples (faction, clé d'icône) cités par les fiches | 2149 | ce que `verifier-icones.ps1` contrôle réellement |
| Cartes sans image / images cassées | 0 | `verifier-icones.ps1`, puis `naturalWidth === 0` dans le navigateur |
| Blasons de faction | 325 fichiers, 1,96 Mo | `assets/crests/<faction>/<id>.webp`, un par seigneur, 32 dossiers |
| Poids JS d'une page de faction | 56,5 Ko en moyenne | `core.js` 26,6 + `app.js` 25,1 + `js/units/<faction>.js` 4,8 de moyenne (11,4 au maximum), non compressé |
| Poids JS de l'accueil | 38,3 Ko | `core.js` + `search.js`, non compressé |
| Poids CSS | socle 11,0 / fiches 64,9 / accueil 24,4 Ko | une page en charge **deux** : socle + l'une des deux autres |
| Polices, page de faction | 4 familles, 5 fichiers, 179,7 Ko | mesuré au navigateur ; voir la note ci-dessous |

Trois valeurs ont bougé depuis la clôture de la V1 le 16/08/2026, et les trois écarts sont
expliqués :

- **321 → 322 seigneurs.** The Black Dwarf, ajouté le 23/08/2026 à la page des Nains du Chaos
  (`black-dwarf`, numéro VII). Il vient du mod « Derpy's Hashut Legendary Lords », celui qui avait
  déjà donné Abnagg Hellbeard et Ghorth the Cruel. La V1 n'est donc plus close au sens strict : le
  contenu bouge quand le user apporte un nouveau seigneur.
- **3905 → 4015 → 4010 → 4020 cartes.** Les 10 dernières sont les 10 lignes de la fiche de The
  Black Dwarf (1 seigneur + 2 héros + 7 unités). Avant cela : la passe du 18/08/2026 a posé 125 Régiments de Renom. Le solde
  n'est pas de +125 parce que dans une partie des cas l'unité de base était à 1 exemplaire : sa
  ligne disparaît et le RoR la remplace, à somme nulle. Les **5 cartes** perdues ensuite viennent
  de la réparation du 19/08/2026 (`2899327`), qui a retiré les Régiments de Renom laissés sans
  unité de base — application de la règle « si l'unité de base n'est pas dans le build, on n'ajoute
  pas le RoR ». Le chiffre n'avait pas été mis à jour à ce moment-là.

  Attention en recomptant : la colonne compte des **lignes**, pas des quantités. Sommer les `qty`
  donne 6440 et n'a rien à voir avec le nombre de cartes affichées.

  Et attention au piège PowerShell : `foreach($s in @($json))` **aplatit** le tableau renvoyé par
  `ConvertFrom-Json` et ne compte alors qu'un seigneur par fichier — il faut passer par
  `$a = ,(… | ConvertFrom-Json)` puis boucler sur `$a[0]`. Le symptôme est un total de 32.
- **~33 → ~50 → 56,7 Ko de JS.** La V2 avait ajouté la recherche, le sélecteur de faction et la
  navigation entre seigneurs voisins. La refonte y ajoute le blason de faction et le bandeau
  d'échec de chargement — environ 6 Ko, répartis entre `core.js` et `app.js`.

- **2 → 4 familles de polices, 179,7 Ko sur une page de faction.** La refonte ajoute
  **IM Fell English SC** (55,6 Ko) pour les intitulés et **Pirata One** (8,7 Ko) pour le nom du
  seigneur, aux côtés de Cinzel (25,3) et d'EB Garamond (46,8 + 43,3 pour l'italique).

  **Le surcoût n'est pas de 64,3 Ko partout** : le navigateur ne télécharge que les fontes
  réellement utilisées par la page. La 404, par exemple, ne charge pas IM Fell English SC.

  Attention en mesurant : `performance.getEntriesByType('resource')` donne des chiffres faux dès
  qu'une iframe ou une navigation précédente a rempli le cache — deux pages différentes m'ont
  ainsi rendu le même total. **La source fiable est `document.fonts`**, dont le `status` dit
  `loaded` ou `unloaded` pour chaque fonte.

- **1,92 Mo de blasons ajoutés au dépôt.** 322 fichiers WebP de 160 px, un par seigneur, rangés
  par faction. Le chemin est **dérivé** dans `app.js` et `search.js` — aucun champ n'a été ajouté
  aux 322 fiches, la refonte est restée graphique.

  La faction fait partie du chemin parce que **l'identifiant seul n'est pas unique** : `amon`
  désigne deux seigneurs, l'un chez les Hauts Elfes, l'autre chez Tzeentch. Indexer par `id` seul
  fait que l'un écrase le blason de l'autre — c'est arrivé pendant l'extraction.

Trois valeurs de plus ont bougé au relevé du **08/09/2026**, et aucune n'est un défaut :

- **2067 → 2068 couples (faction, clé d'icône).** Victor Guttman, seul ajout de la journée.

  Le recomptage donne 2069 si l'on inclut `krellNote`, le champ propre à la fiche de Kemmler.
  `verifier-icones.ps1` ne le compte pas : c'est ce qui explique l'unité d'écart entre une
  vérification maison et le chiffre de ce tableau. Compter sans lui, sinon les deux sources
  divergeront d'un cran sans raison apparente.

  **Depuis le 17/10/2026, `krellNote` n'existe plus** : Krell est devenu un héros légendaire
  officiel et figure dans les héros de Kemmler. Les deux recomptages coïncident désormais.
- **CSS : socle 10,7 → 11,0 et fiches 64,4 → 64,9 Ko.** Le socle a pris le bandeau d'échec de
  chargement, `fiches.css` la section 12 et la carte « Magie » passée en pleine largeur. Le total
  d'une page de faction monte de 24,2 à 24,6 Ko, ce qui ne déplace pas les poids de page du README :
  remesurés le 08/09 sur `dwarfs.html?id=thorgrim` en ligne, ils donnent 447,6 et 585,6 Ko, soit
  les 448 et 586 déjà documentés.
- **Module `js/units/<faction>.js` : 5,1 → 4,7 Ko.** Ce n'est pas un allègement, c'est une
  correction de méthode : la valeur citée était **un** module, pas la moyenne des 32. La moyenne
  réelle est de 4,7 Ko et le plus lourd pèse 11,4 Ko, ce qui fait varier le total d'une page de
  faction entre 53 et 63 Ko selon la faction. Un chiffre unique ne rend pas compte de cet écart.

Quatre valeurs ont bougé au relevé du **17/10/2026**, toutes par ajout de contenu du DLC *Lords of
the End Times* :

- **322 → 324 seigneurs.** Thanquol (Skavens, XXV, Clan Scruten) et The Glottkin (Guerriers du
  Chaos, XIII, Host of the Triplets), les deux seigneurs du DLC qui manquaient au site.
- **4020 → 4057 cartes.** 19 lignes pour Thanquol (1 + 3 héros + 15 unités) et 18 pour le
  Glottkin (1 + 4 héros + 13 unités). La refonte de Dieter Helsnicht le même jour est à somme
  nulle : Animated Hulks remplace Feral Manticore, ligne pour ligne.
- **2068 → 2092 couples (faction, clé d'icône).** Exactement les 24 clés ajoutées : 6 au module
  Skavens, 18 à celui des Guerriers du Chaos (dont 5 reprises d'autres modules, sans image
  nouvelle). Chez Dieter, `animatedHulks` entre et `feralManticoreDarkElves` sort du module des
  Comtes Vampires — l'image reste, la fiche de Dark Elves s'en sert.
- **Le même jour, refonte de Boris, Neferata et Nagash** sur leurs données officielles : 4057 → **4059
  cartes** (Boris 20 → 15 lignes, Neferata 15 → 16, Nagash 12 → 18) et 2092 → **2115 couples** —
  +8 au module de l'Empire (le Culte d'Ulric), +9 aux Comtes Vampires (Lahmiennes, Coven Throne, unités
  de Lahmia), +6 nets aux Undead Legions (17 entrées, 11 sorties : les cartes du mod Nagash, rangées
  dans `js/units/_hors-fiches.js` quand aucun autre module ne les déclare).
- **322 → 324 blasons, 1,92 → 1,95 Mo.** Le dernier centième vient des écus officiels de Neferata
  et de Nagash, qui remplacent ceux de leur ancien mod le même jour. Les deux écus, tirés de `ui\flags\<faction>\mon_256.png`
  et encodés comme les autres (WebP 160 px, qualité 92). La moyenne des modules d'icônes reste à
  4,7 Ko et le maximum à 11,4 Ko, mesurés le même jour.
- **Toujours le même jour, Kalledria** réalignée sur la version actuelle de son mod, (The remains of)
  Legions of Nagash, qui a retiré Spirit Hosts, Fell Spectres et Shade Haunts : 4059 → **4057 cartes**
  (sa fiche passe de 14 à 12 lignes) et 2115 → **2113 couples** (`syreens` entre au module des Comtes
  Vampires, les trois clés `nag*` en sortent pour `js/units/_hors-fiches.js`).
- **Toujours le 17/10/2026, Kastabull** (Nains du Chaos, VIII, Uzkul Mingol Company), venu d'une mise à
  jour de « Derpy's Hashut Legendary Lords » : 324 → **325 seigneurs** et **325 blasons, 1,96 Mo** ;
  4057 → **4069 cartes** (1 + 2 héros + 9 unités) et 2113 → **2119 couples** (son portrait et cinq
  cartes hobgobelines). Le module des Nains du Chaos passe de 2,6 à 3,7 Ko, ce qui porte la moyenne
  des 32 modules de 4,74 à 4,77 Ko, arrondie à **4,8** : le total d'une page de faction passe à
  **56,5 Ko**. Son portrait fait **85×115** et non 60×130 — le mod ne fournit que l'image de
  l'écran de sélection — et `object-fit: cover` le recadre comme celui d'Amon.
- **Puis 4069 → 4071 cartes** : Oglah Khan's Wolfboyz, le Régiment de Renom des Wolf Raiders extrait pour
  Kastabull, rejoint aussi Zhatan et Abnagg, dont les factions ont accès au vivier. Une ligne de plus
  sur chaque fiche, la place prise sur leurs Wolf Raiders ; aucun couple de plus, la clé étant déjà
  déclarée au module des Nains du Chaos.
- **Puis 4071 → 4072 cartes et 2119 → 2120 couples : Kemmler.** Krell, héros légendaire officiel depuis
  le DLC, passe du cadre « invoqué » (`krellNote`, que le compteur ignorait) aux héros de la fiche :
  une ligne de plus, et la clé `krell` entre dans le décompte.
- **Puis 2120 → 2121 couples : lot Skavens.** Deathvermin remplace les Stormvermin (Halberds) de base chez
  Thanquol et Viciss Baukis, Virulent Batteries la Plagueclaw Catapult de Rathan : nombre de lignes
  inchangé, une clé nouvelle (`deathvermin`).
- **Puis 4072 → 4075 cartes et 2121 → 2123 couples : lot Comtes Vampires.** Effets de huit fiches réalignés
  sur leurs captures post-DLC. Vlad gagne 2 lignes (Sylvanian Handgunners et Crossbowmen), Isabella
  une (Lahmian Vampire) ; chez Rahtep, la Spirit Host remplace les Mournguls, ligne pour ligne.
  Couples : +2 cartes sylvaniennes, +1 `spiritHost`, −1 `mourngul` (rangée dans `_hors-fiches.js`).
- **Puis 4075 → 4077 cartes et 2123 → 2125 couples : lot Rois des Tombes.** Effets d'Arkhan, Khatep,
  Khalida, du Dread King et de Rakaph réalignés sur leurs captures post-DLC. Rakaph gagne le Khemric
  Titan et son Régiment de Renom Icon of Usirian, que ses effets visent désormais : deux lignes et
  deux clés de plus au module des Rois des Tombes.
- **Puis 4077 → 4079 cartes et 2125 → 2127 couples : lot Guerriers du Chaos et Nurgle.** Effets d'Archaon
  (résistance physique au lieu du Ward Save), de Sigvald (Mirror Guard +2, « Guardian » disparu), de
  Tamurkhan et d'Epidemius réalignés sur leurs captures post-DLC. Tamurkhan gagne les Putrid
  Blightkings (Dual Axes) et The Repugnauts of Brass Keep, que ses effets non démoniaques visent :
  deux lignes, et deux clés reprises du module des Guerriers du Chaos.
- **Puis 4079 → 4081 cartes et 2127 → 2129 couples : lot Norsca.** Sur 25 captures, seul Throgg avait changé :
  son régiment favori donne désormais accès à Da Swamp Fings (River Trolls), qui entre dans sa fiche à
  côté d'un seul Mist Stalkers. Wulfrik gagne les Flayerkin du DLC, que le jeu range parmi les
  Marauders visés par son -15% d'entretien. Deux lignes ; `flayerkin` (carte extraite) et `daSwampFings`
  (reprise du module des Peaux-Vertes) entrent au module de Norsca.
- **Puis 4081 → 4086 cartes et 2129 → 2131 couples : régiments favoris (18/10/2026).** Alignés sur le mod
  Factional Favoured Regiments, qui les définit tous. Le régiment favori entre dans 11 builds (Tretch,
  Skarrik, Trikstab, Blight, Rikzik, Sitch, Grrzk, Misericorde, Vazgrat, Targog, John Tyreweld) : +5
  lignes nettes. Couples : +3 (`slaveringMaws` et `vilebites` extraites, `rustblades` qui reprend la
  carte de `slimeblades`, identique dans le jeu), −1 (`lamplighters`, rangée dans `_hors-fiches.js`).
- **Puis 4086 → 4088 cartes et 2131 → 2134 couples : héros de Norsca (19/10/2026).** Les héros légendaires
  de SCM Tribes of the North réalignés sur les scripts du mod, qui les donnent chacun à un seigneur —
  Soren chez Adella et Oda chez Ulfric vérifiés en jeu. Lignes : +1 chez Ulfric, Geimdall et Hakka (un
  héros donné plus tard s'ajoute), +2 chez Einarr (Usta, Kammler et Asta à la place de la ligne des
  deux Shamans), −1 chez Drenok, Surtha Ek et Grydal (leur héros n'était pas le leur). Couples : +6
  cartes extraites (Oerl, Haraldur, Kolsveinn, Tuula, Alfkael, Asta), −3 rangées dans `_hors-fiches.js`
  (Orgrim, Berus, Haftagg). Le module de Norsca passe de 8,7 à 8,8 Ko : la moyenne des 32 bouge de
  6 octets, le total d'une page de faction reste à 56,5 Ko.
- **Puis 4088 → 4090 cartes : Snagla Grobspit (19/10/2026).** Héros légendaire du jeu de base, qu'un
  script du jeu (`wh3_main_legendary_characters.lua`) offre par mission à toute faction Peau-Verte jouée.
  Ses compétences renforcent les araignées : il entre chez Wurrzag, Azhag et Skarsnik, qui en alignent,
  et sort de chez Sporctacus, dont la note le disait à tort exclusif. +3 −1 lignes ; aucun couple de
  plus, la clé `snaglaGrobspit` étant déjà déclarée.
- **Puis 4090 → 4089 cartes : héros de Bretonnie (19/10/2026).** Réalignés sur les scripts des mods.
  Calard, Fastric et Jerrod sont les compagnons de Tancred, qu'il est seul à obtenir (`ubr_tancred_bros.lua`,
  Bretonnian Dukes) : +2 lignes chez lui, −1 chez Hagen, Folcard et Taubert. Iselda passe de Theodoric à
  Armand et Amalric d'Adalhard à Fay, tous deux vérifiés en jeu : +1 chez Fay, −1 chez Adalhard. Agravain
  remplace le Paladin de Bohemond, dont l'effet vise les héros intégrés à l'armée. Aucun couple de plus.
- **Puis 4089 → 4088 cartes : héros des Hauts Elfes (19/10/2026).** Kitharl Woodwalker passe de Korhil à
  Alarielle (LYH le donne à Avelorn, qui prend Tor Achare) : +1 chez elle, −1 chez Korhil. Caradryan quitte
  Amon, dont la faction n'est pas dans la liste du jeu de base (−1), et remplace le Noble d'Imrik, dont
  l'Invocation of Eldrazor vise les héros. Aucun couple de plus.
- **Puis 4088 → 4086 cartes et 2134 → 2133 couples : héros des Comtes Vampires (20/10/2026).** Nicolete de
  Oisement passe de la Dame du Graal Noir à Mallobaude, dont la bande compte quatre membres dans le script
  de Mixu's Mousillon (+1 chez lui, −1 chez elle, une troisième Damsel prenant sa place). L'Ulrika de SCM
  Legendary, désactivée en Immortal Empires, sort des fiches de Rahtep et de Vorag (−1 chacun) ; sa clé
  `ulrikaMagdova` part dans `_hors-fiches.js`.
- **Puis 4086 → 4087 cartes et 2133 → 2135 couples : héros du Grand Cathay (20/10/2026).** DEER24 donne au
  départ Pei Yue à Zhao Ming, Fang Wenzi à Miao Ying, The Martial Saint à Yuan Bo et Na Natian à Yun
  Xiang — le site les plaçait chez Duan Wei, Zhao Qi et Jin Xiao. LYH pose dans l'armée de départ
  Vivleth (Zhao Ming), Qin Yu (Duan Wei) et Liu Jianguo (Yuan Bo), absents du site : trois cartes
  extraites. Pei Yue, Vivleth et Qin Yu **vus en jeu par le user**. Lignes : +2 Zhao Ming, +2 Yuan Bo,
  +1 Miao Ying, −2 Duan Wei, −1 Zhao Qi, −1 Jin Xiao, 0 Yun Xiang (Na Natian contre les Celestial Dragon
  Crossbows, dont la clé `dragonGuardCrossbowmen` part dans `_hors-fiches.js`).
- **Puis 4087 → 4089 cartes et 2135 → 2138 couples : héros de l'Empire (20/10/2026).** Aucun héros chez le
  mauvais seigneur ; quatre manquaient. Alberich von Korden (Mixu, Stirland) remplace le Witch Hunter
  d'Alberich, Odvaal van den Huister (SCM Marienburg) le Sword of Solkan de Jaan — ligne pour ligne.
  Theodore Bruckner (jeu de base, prioritaire pour Wissenland) s'ajoute chez Elspeth, Guzunda Wallrattler
  (maison Fooger, script **Immortal Empires Expanded**, **vu en jeu par le user** au premier tour) chez
  Arkat : +2 lignes. Couples : +4 cartes
  extraites — trois sont les portraits officiels des personnages, faute de carte d'unité dans les packs —
  et −1, `swordOfSolkan` rangée dans `_hors-fiches.js`.
- **Puis 4089 → 4090 cartes et 2138 → 2139 couples : héros des Hommes-Bêtes (21/10/2026).** Aucun héros chez le
  mauvais seigneur. LYH (`lyh_bst_shijiuqishi.lua`) pose dans l'armée de départ de Morghur un Gryphon Rider
  absent du site, **vu en jeu par le user** : +1 ligne chez Morghur (Ungor Herd 4 → 3), +1 carte extraite
  (`bstGryphonRider`, 122×262, laissée à ses dimensions d'origine).
- **Puis 2139 → 2140 couples : héros des Nains (22/10/2026).** Juggo Joriksonn, que SCM Legendary réserve par
  `faction_subset` à Sven's Expedition, sort de la fiche de Byrrnoth (Ironbreakers 1 → 2) ; Garagrim Ironfist, héros
  légendaire du jeu de base que `wh3_main_legendary_characters.lua` offre en priorité à Karak Kadrin, entre chez
  Ungrim (Slayers 10 → 9). Cartes inchangées en nombre (−1 +1) ; une clé de plus, `garagrimIronfist` — son portrait
  officiel `ui/portraits/units`, 60×130, le jeu ne lui donnant aucune carte `ui/units/icons`.
- **Puis 4090 → 4093 cartes et 2140 → 2141 couples : héros de Khorne (22/10/2026).** Karanak, héros légendaire du
  jeu de base (mission au rang 16, ouverte à Skarbrand, Arbaal, Skulltaker, Valkia, Kholek, Archaon, Be'lakor et au
  Daemon Prince), donne +6 de Commandement et -10% de recrutement aux Chaos Warhounds et Flesh Hounds de son armée :
  il entre chez Arbaal, Skarbrand et Skulltaker, qui en alignent (+3 lignes ; Chaos Warriors, Bloodletters et Bloodbeasts
  perdent un exemplaire chacun). Une clé nouvelle au module de Khorne, `karanak` (portrait officiel `ui/portraits/units`, 60×130, faute de carte). Tzeentch et les Démons :
  rien à corriger.
- **Puis 4093 → 4094 cartes et 2141 → 2142 couples : héros des Hommes-Lézards (22/10/2026).** LYH
  (`lyh_lzd_poqenichi.lua`) pose Poqenichi dans l'armée de départ du Culte de Sotek, **vu en jeu par le user** : il
  entre chez Tehenhauin (Skink Skirmishers 2 → 1), clé `poqenichi` (carte `ui/units/icons` du pack, 120×260).
- **Puis 4094 → 4095 cartes et 2142 → 2144 couples : héros des Skavens (22/10/2026).** Lurklox, que SCM réserve par
  `faction_subset` aux clans Eshin, Treecherik et Kreepus, quitte la fiche de Throt : Ghoritch, héros du jeu de base réservé
  au Clan Moulder (quête *Whip of Domination*), prend sa ligne. LYH (`lyh_skv_reekit.lua`) pose Reekit dans l'armée de
  départ du Clan Pestilens, **vu en jeu par le user** : il entre chez Skrolk (Poison Wind Globadiers 2 → 1). Deux clés
  nouvelles, `ghoritch` et `reekit` (portrait officiel `ui/portraits/units` de Ghoritch, 60×130, faute de carte ; carte `ui/units/icons` de Reekit, 120×260).
- **Puis 4095 → 4100 cartes et 2144 → 2149 couples : héros des Guerriers du Chaos, lot 1 (22/10/2026).** LYH pose
  quatre héros dans l'armée de départ de leur seigneur : Albodi the Scarred et Tal'gatha the Fallen chez Vilitch, Vargrash
  (agent `kruld`) chez Valkia, Rakranos the Ancient chez Kholek. Karanak rejoint aussi Valkia, qui aligne trois meutes de
  Warhounds. +5 lignes (Marauders, Forsaken et un Exalted Hero cèdent leur place) ; quatre cartes extraites (cartes `ui/units/icons` du pack, 120×260),
  et `karanak` déclarée aussi au module des Guerriers du Chaos, chaque page ne chargeant que le sien. Elfes Sylvains :
  rien à corriger.

---

## Les héros de mod : le script fait foi, pas le lore

Un mod peut assigner un héros à **une faction et une seule**, en dur, par script de campagne. **Il
existe au moins deux fonctions pour ça**, et c'est le piège :

```lua
-- 1. l'agent est donné à la faction
cm:spawn_unique_agent(... cm:model():world():faction_by_key("<faction>") ..., "<agent>", true);

-- 2. l'agent est posé DANS l'armée du chef de la faction
cm:spawn_agent_at_military_force(faction, force, "<classe>", "<agent>");
```

Les deux sont appelées depuis un `cm:add_first_tick_callback`, souvent sous un `cm:is_new_game()`.
Un agent posé ainsi **appartient** à cette faction. Aucun autre seigneur ne peut le recruter, et
`faction_agent_permitted_subtypes` — la table qu'on interroge d'habitude — ne le dit pas.

**Cette règle a coûté cher.** Le 08/09/2026, l'audit du mod « 3 Legendary Guys » a trouvé
**17 héros placés chez un seigneur qui n'y a pas accès**, sur 30. Ils avaient été placés d'après
leur lore et leur clé interne. Quatre étaient des **inversions par paires** — Khazrak ↔ Malagor,
Taurox ↔ Morghur — signature caractéristique du raisonnement par affinité. Le cas le plus net :
Estroth the Silent porte la clé `merovech`, le duc maudit de Mousillon, et je l'avais donc mis chez
Mallobaude ; sa compétence innée s'appelle **« Standard Bearer of Vlad von Carstein »**.

**Le bon réflexe** : avant de placer un héros de mod, chercher **`spawn_unique_agent`** — ce qui
couvre aussi `spawn_unique_agent_at_character`, la variante qui pose le héros à côté d'un personnage —
**ET `spawn_agent_at_military_force`** dans `script\campaign\**\*.lua` du pack. Si l'un de ces appels
existe, la faction qu'il nomme est la seule réponse.
Chercher aussi une compétence innée ou un objet qui nomme un seigneur — c'est ce qui a tranché pour
Estroth, pour Ogg Halfheart (« First Mate of the Pirate Queen ») et pour Victor Guttman, décrit par
la loc comme un prêtre de Sigmar de **Drakenhof**, le siège de Mannfred.

**Où en est le balayage, et pourquoi il est incomplet.** Les 133 packs du workshop ont été passés au
crible le 08/09/2026 : **60 appels `spawn_unique_agent`, dans 7 mods**.

> ⚠️ **Ce relevé ne cherchait que `spawn_unique_agent`.** La seconde fonction,
> `spawn_agent_at_military_force`, n'a été découverte que le 21/09/2026 — en constatant qu'elle
> rattache **Alathenar** à Tiranoc dans une mise à jour de LYH. Le tableau ci-dessous est donc un
> **plancher, pas un inventaire** : il dit ce qui a été trouvé, jamais ce qui existe.
>
> Il est doublement périmé : plusieurs de ces mods ont été mis à jour après le 08/09, et le script
> d'Alathenar n'existait pas encore quand le balayage a tourné. **À relancer avec les deux
> fonctions** avant de s'en servir pour conclure quoi que ce soit.

| Mod | Appels | État |
|---|---|---|
| `!!!3_legendary_guys.pack` | 29, plus 1 `cm:create_agent` | **traité** le 08/09/2026, revérifié race par race du 19 au 22/10/2026 (Tchzen et Bahr → Kairos, Gerik Barkov → Daemon Prince, justes), sauf Infanta Leanora Navrre, que son script pose par `create_agent` dans l'armée de **Count Noctilus** : elle était chez Cylostra, corrigé le 22/10/2026 (vue en jeu par le user) |
| `!scm_marienburg.pack` | 15, plus des scripts `cr_combi_expanded` | **traité** le 20/10/2026 : Alicia → Mundvard (`spawn_agent_at_position`) ; Rashasawa → Egmond ; Odvaal → Jaan, au départ ; Pieter de Groot, Lisette, Crispijn, Maicross, Guzunda en récompense des **convois** de Marienburg, ouverts à sept factions de l'Empire. En **Expanded** : Guzunda → maison Fooger au départ, Ogg et Palldee par ses caravanes (`rhox_fooger_caravan.lua`) |
| `um's_Mortkin.pack` | 5 | non vérifié |
| `scm_skaven_clans.pack` | 3, plus des `cm:create_agent` pour le joueur | **traité** le 22/10/2026 : ses héros de départ (Ferrik Forgebinder, Wildspeaker, Skullpriest, Swarmcaller, Master Globadier) vont chacun au seigneur qui les a sur le site ; Fellpaw et Gnawlitch par les rituels du Clan Kreepus (Misericorde), ou par mission pour Eshin, Treecherik, Skryre et Gritus |
| `_ork_pirates_V2.pack` | 8 (4 cas joueur/IA × 2 héros) | **traité** le 19/10/2026 : Orklid et Ramn'bow → Barbozza (`cluster_eye_tribe`), corrects |
| `froeb_dark_land_orcs.pack` | 3 | **traité** le 19/10/2026 : Gurthok → Gormok, par mission pour un joueur (vaincre 6 armées de Nains du Chaos) |
| `!scm_totn.pack` (Tribes of the North) | 24, dont 13 `_at_character` | **traité** le 19/10/2026 — absent du relevé du 08/09 |
| `Blackskullz_Horde_Faction.pack` | 1 `_at_character` | **traité** le 19/10/2026 : Borlok → Skarfang, correct |
| `!uber_brt_dukes.pack` (Bretonnian Dukes) | 9 | **traité** le 19/10/2026 : Calard, Fastric, Jerrod → Tancred seul (missions) ; Iselda → Armand (vérifié en jeu) |
| `ab_mixu_legendary_lords.pack` | 1 appel générique, piloté par la table `unique_agents` (`mixu_spawn_characters_ie.lua`) | **Table lue en entier** le 20/10/2026 : Amalric → Fay (vérifié en jeu), Donna → Tyreweld, Luthor Huss → Volkmar, Oleg → Valmir, Alberich von Korden → Stirland, Hrefna et Fraygerd → Egil ; Drekla → `wh2_dlc11_cst_vampire_coast` (Harkon), juste, vérifié le 22/10/2026 ; Little Morella (Ripper Horn, que Mixu renomme « Warherd of the Beastfather » : Ghorros, juste, vérifié le 21/10/2026), Ramhotep (Numas : Tutankhanut) et Kouran (Naggarond : Malekith), justes, vérifiés le 22/10/2026  ; Chakax → Xlanhuapec (Huinitenuchli), juste, vérifié le 22/10/2026 — **toute la table est désormais vérifiée** |
| `!!gra_knights_origo`, `!!gra_knights_flame`, `!!gra_outremer` | 2 chacun (IE + Vieux Monde) | **traités** le 19/10/2026 : Donna, Riviere, Balian → leur seigneur, corrects |
| `inq_lol_hero.pack` (Heroes of Legend) | 3, mais les héros viennent surtout de bâtiments | **Comtes Vampires traités** le 20/10/2026 : Helmut, Gorgivich, Gunther → Mannfred seul (`factionKeys`). **Grand Cathay** le même jour : Shi-Hong et Bannaga ouverts à tout Cathay. **Nains** le 22/10/2026 : Balkrag rejoint par dilemme la première faction naine qui prend Karak Azgal (`scehr_hol_journeys_balkrag.lua`). **Bretonnie traitée** le 19/10/2026 : Viscount, Agravain, Brunner, Hermit Knight ouverts au premier qui bâtit leur bâtiment (`scehr_hol_characters_buildings_entries.lua`) |
| `DEER24Cathay.pack` (DEER24) | 8, plus des missions définies en table | **traité** le 20/10/2026 : Pei Yue → Zhao Ming (vu en jeu), Fang Wenzi → Miao Ying, Martial Saint → Yuan Bo, Liu Yueru → Zhao Qi, Miao Yi et Na Natian → Yun Xiang, au départ (`wwd_wuchi.lua`). Les six autres (Yi Yaohua, Ku Xi, Ying Jin, Tang Jingyin, Monkey King, Tong Long) viennent de missions **sans script** : `cdir_events_mission_option_junctions` les ouvre à toute la culture (`CND_CULTURE`, `CND_UNIQUE`) |
| `lyh_hero_no_cathay.pack` (LYH) | 37, toutes races | **Grand Cathay traité** le 20/10/2026 : Vivleth (Zhao Ming) et Qin Yu (Duan Wei) vus en jeu, Liu Jianguo (Yuan Bo), au départ ; Ku Rong, Xen Wu et Ye Jia ouverts à tout Cathay. **Bretonnie et Hauts Elfes traités** le 19/10/2026 : Lafayette → Louen au départ ; Malok au premier Bretonnien qui prend Nuja ; Kitharl → Avelorn, qui prend Tor Achare. **Guerriers du Chaos** le 22/10/2026 : Albodi et Tal'gatha → Vilitch, Kruld (« Vargrash ») → Valkia, Rakranos → Kholek, au départ (`spawn_agent_at_military_force`). **Skavens** le 22/10/2026 : Reekit (`reekit`) → Clan Pestilens (Skrolk) au départ, vu en jeu. **Hommes-Lézards** le 22/10/2026 : Poqenichi (`poqenichi`) → Culte de Sotek (Tehenhauin) au départ, vu en jeu ; Hua-Hua est un seigneur. **Hommes-Bêtes** le 21/10/2026 : Gryphon Rider (`shijiuqishi`) → Morghur au départ (vu en jeu) ; She'ar Khawn's Vanguard (`huxianfeng`) ouvert à tout homme-bête qui atteint Qiang (mission en table). **Royaumes Ogres** le 20/10/2026 : Ymirdrak (`yimier`, clé d’icône `imildrak`, son ancien nom sur le site) à la première tribu ogre qui prend Eagle Eyries, IA comprise, Shrewd Fulg démarrant dans la même province (`mission_ogr_yimier.lua`) |
| `@red_hef_lords_public.pack` (High Elves Lords) | 7, dont un bloc entier mis en commentaire | **traité** le 19/10/2026 : Lirazel → Avelorn (mission) ; Khaltar → Nagarythe, par une compétence de son seigneur Alatar ; Selafyn au premier joueur qui recherche `wh2_main_tech_hef_1_09` ; Imrallion → Teclis (mission), non placé |
| `ovn_citadel_of_dusk.pack` | 0 — passe par `cm:create_agent` | **traité** le 19/10/2026 : Caladris → Citadel of Dusk, correct |
| `ab_mixu_mousillon.pack` (Mixu's Mousillon) | 2, plus des missions de recrutement | **traité** le 20/10/2026 : Bougars, Eustache, Aucassin **et Nicolete** → Mallobaude (`mallobaude_gang`), les quatre missions de recrutement **vues en jeu par le user** au premier tour. La liste des héros de l'écran de sélection ne les montre pas : elle ne prouve rien pour un héros de mission. « The Old One » (`msl_the_old_one`) : l'agent existe, mais ni mission en table ni script ne le donne en Immortal Empires — non placé |
| `!!scm_motm.pack` (Masters of the Maw) | 0 — table `motm_character_unlocking.character_data` (`!motm_legendary_characters.lua`) | **traité** le 20/10/2026 : ses dix héros ogres sont ouverts à toute tribu jouée (mission ou bâtiments). `starting_owner_faction` ne donne le héros au départ que si l'on **joue** cette faction (Haurg → Hrothgul, Gragtar → Morg, Sandbad → Gulgulet) ; `priority_ai_faction` n'est que le repli de l'IA ; `priority_faction` (Old Funder → Blogg) ne joue que si cette faction est humaine |
| `!xou_age_TKExtended.pack` (Tomb Kings Extended, et son patch temporaire) | 0 — `cm:create_agent` et une mission | **traité** le 22/10/2026 : Herald Nekaph → Khemri au départ (`loki_nekaph_add.lua`, scripts `wh3_main_combi` et `cr_combi_expanded`) ; Prince Apophas par une mission que reçoit, au tour 2, le premier joueur Roi des Tombes (`apophas_quest_launcher.lua`) |
| `ovn_dread_king.pack` (The Dread King) | 0 — `cm:create_agent` | **traité** le 22/10/2026 : Gunther Larenscheld → `ovn_tmb_dread_king` au départ, juste. Ce n'est pas le Gunther von Grecht de Heroes of Legend |
| `Araveena_updated2.pack` (Araveena) | 1, script dédié (`anarsis_script.lua`) | **traité** le 22/10/2026 : Anarsis → Deadwood Sentinels au départ, juste |
| `!scm_legendary.pack` (SCM Legendary Characters) | table `scm_lc_spawn_hero` | **Skavens** le 22/10/2026 : Lurklox (`faction_subset` Eshin, Treecherik, Kreepus) était chez Throt, corrigé ; Ska Bloodtail → Clan Mors au départ ; Natty Buboe (Clan Mors, mission) non placé ; Fylch, Hackflay, Veskit ouverts. **Khorne** le 22/10/2026 : Mardagg, Vaslo, Ironarm, Scyla, Herumar et Khoros sans `faction_subset`, ouverts. **Tzeentch** le 22/10/2026 : Zor'ead, Xuq'ls et les Blue Scribes sans `faction_subset`, ouverts. **Elfes Noirs** le 22/10/2026 : Shadowblade (`str_shadowblade`, `faction_subset` Har Ganeth, **sans mission**) est créé au premier tour pour Hellebron, à la place de sa Death Hag de départ — il était chez Shakkara, corrigé et **vu en jeu par le user** ; Korelei et Furion ouverts au premier joueur elfe noir ; Fellheart est un seigneur. **Rois des Tombes** le 22/10/2026 : Nyletoth et Serkhet sans `faction_subset`, ouverts. **Nains du Chaos** le 22/10/2026 : Barukh sans `faction_subset`, ouvert. **Nains** le 22/10/2026 : Kazrik, Grombold, Hamnir, Torston et Juggo réservés par `faction_subset` à leur faction — Juggo à Sven's Expedition (`wh2_main_dwf_spine_of_sotek_dwarfs`), pas à Barak Varr. **Hommes-Bêtes** le 21/10/2026 : Ungrol Four-Horn (`str_ungrol`) au premier joueur homme-bête qui possède 12 unités d'Ungors. **Royaumes Ogres traités** le 20/10/2026 : Brudd sans `faction_subset`, donc au premier joueur ogre ; ses doublons de MotM (Braugh, Frostmaw, Katerina, Kineater) sont coupés par MotM quand son réglage `motm_lc_overlap_no_mct2` est actif. **Hauts Elfes, Bretonnie, Comtes Vampires et Grand Cathay traités** (19-20/10/2026) — Nanye Bunyo et Xian Feng réservés par `faction_subset` à Miao Ying et à Zhao Ming ; Gothard et Obadiah confirmés en jeu chez le premier joueur vampire (Mallobaude) ; Ulrika (`str_ulrika`) y est désactivée en Immortal Empires. **Piège** : la `faction_key` de la table n'est que le repli de l'IA ; la mission va au **premier joueur de la même culture**, sauf `faction_subset` explicite |

Hors workshop, le jeu de base attribue lui aussi des héros légendaires par mission :
`script\campaign\wh3_main_legendary_characters.lua`, dans `data_script.pack`, les ouvre à une
**culture** (`allowed_cultures`) et non à une faction. Snagla Grobspit (Peaux-Vertes) traité le
19/10/2026, Karanak (Khorne, `override_allowed_factions`, huit factions) et Lord Kroak (`starting_owner_faction` Itza), Ghoritch (`override_allowed_factions` Clan Moulder), Ariel et Coeddil (Elfes Sylvains) le 22/10/2026, Garagrim Ironfist (Nains, `priority_faction` Karak Kadrin) et Gotrek & Felix (`starting_owner_faction`
Malakai) le 22/10/2026 ; les autres (Beorg Bearstruck, Caradryan, Theodore Bruckner…) restent à voir race par race.

**SCM Tribes of the North, traité le 19/10/2026.** Il manquait au relevé du 08/09 parce qu'il passe
surtout par une **troisième fonction**, `spawn_unique_agent_at_character(<faction>, "<agent>",
<personnage>, true)`, qui pose le héros à côté du chef de faction. Le relevé, lui, ne cherchait que
`spawn_unique_agent(`. Lu dans `wh3_main_combi\mod\rhox_fc_norsca_init.lua`, `mod\scm_norsca_lh.lua` et
`mod\rhox_baersonling_mission_chain.lua`, il avait **13 fiches Norsca sur 25 à corriger** : 11 héros
étaient chez le mauvais seigneur, 1 n'existe pas en Immortal Empires, et 6 autres, que le mod donne,
manquaient au site. Soren Hoarder chez
Adella et Jarl Oda Winterclaw chez Ulfric ont été **vérifiés en jeu par le user**. Deux leçons, chacune
venue d'un cas réel :

- **Les droits de recrutement ne prouvent pas qu'un héros unique s'obtient.**
  `faction_agent_permitted_subtypes` ouvre Orgrim à 16 factions norses, mais seule la chaîne de missions
  d'Einarr le fait apparaître : le user ne le voit pas dans le recrutement d'Ulfric.
- **Un script du Vieux Monde ne vaut pas pour Immortal Empires.** Haftagg n'est donné que par
  `cr_oldworld\mod\scm_norsca_tow_init.lua`. Le user ne le voit pas chez Grydal. Avant de conclure,
  regarder **sous quel dossier de campagne** se trouve l'appel : `wh3_main_combi` pour Immortal
  Empires, `cr_oldworld` pour le Vieux Monde, `mod` pour les deux. **Le user joue Immortal Empires
  Expanded** (dit le 20/10/2026) : il faut y ajouter `cr_combi_expanded`, où vivent par exemple Ogg,
  Palldee et Guzunda — ce dernier vu en jeu chez Arkat. Les scripts `wh3_main_combi` tournent bien
  dans sa partie : toutes ses vérifications en jeu portaient sur eux.

**27 des 31 appels restants passent la faction par une variable**, pas par une chaîne littérale :
aucune regex ne les résout, il faut lire les scripts. Depuis le 19/10/2026, des défauts sont prouvés
hors de « 3 Legendary Guys » : SCM Tribes of the North, Bretonnian Dukes et Mixu en avaient tous. Les
mods encore marqués « non vérifié » ne sont donc pas présumés justes. Le gros morceau reste
Marienburg et ses 15 appels. La méthode est le parcours D du skill `fiches-tww3`.

Deux pièges de méthode relevés en chemin, tous deux ont produit de faux résultats :

- **Ne pas rapprocher par sous-chaîne.** Chercher `ulrik` ramène « Ulrika Magdova Straghov », qui
  n'a rien à voir ; `black` ramène Blacktoof, Black Orc Big Boss et The Black Mask ; `red` ramène
  « F**red**erick ». Exiger **tous** les jetons de la clé, en mot entier.
- **Une homonymie se prouve en montrant deux packs.** Une note affirmait qu'Infanta Leanora Navrre
  existait en deux personnages distincts issus de deux mods : `scan_packs.ps1 -Match 'leanora'` ne
  remonte qu'un seul pack. C'était faux.

**Trois exceptions assumées à l'invariant « un seigneur légendaire n'est jamais héros »**, toutes
arbitrées par le user — ne plus les signaler :

- **Vlad et Isabella**, héros l'un chez l'autre : le +50 % de plafond de soin de Vlad exige
  qu'Isabella serve dans la même armée.
- **Infanta Leanora Navrre**, seigneur sur la page Côte Vampire et héroïne chez Count Noctilus.
  Sans justification mécanique, celle-là : simplement acceptée le 08/09/2026. Elle était alors placée
  chez Cylostra Direfin ; déplacée le 22/10/2026, car 3 Legendary Guys la pose dans l'armée de Noctilus
  par `cm:create_agent`, fonction que le relevé du 08/09 ne cherchait pas — **vue en jeu par le user**.

- **Dieter Helsnicht et Walach Harkon**, héros chez **Nagash** (Host of Nagash) alors qu'ils ont chacun
  leur fiche de seigneur, venue d'un mod (Mixu's Legendary Lords, Champions of Undeath). Ce sont les
  héros légendaires **officiels** de Nagash depuis le DLC Lords of the End Times : décidé le 17/10/2026.
  L'exception vaut chez Nagash seulement.

**Gitilla Da Hunter** relève du même conflit et a été tranché dans l'autre sens : il reste seigneur
seul, on ne l'ajoute pas en héros chez Azhag.
