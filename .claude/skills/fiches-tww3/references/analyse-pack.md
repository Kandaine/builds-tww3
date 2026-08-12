# Analyser un pack de mod TWW3

Quelles tables lire, dans quel ordre, et où sont les pièges.

## Sommaire

1. Format des packs
2. Quelle table pour quelle question
3. Seigneur ou héros ?
4. Résoudre un nom d'affichage
5. Plafonds d'unité
6. Héros légendaires
7. Pièges recensés

---

## 1. Format des packs

PFH5/PFH4, en-tête de 28 octets, contenu compressé en zstd. Les scripts de
`~/.claude/tools/tww/` gèrent tout via la `libzstd.dll` fournie par Git — rien à télécharger.

Packs workshop : `C:\Program Files (x86)\Steam\steamapps\workshop\content\1142710\<id>\`
Packs du jeu de base : `...\common\Total War WARHAMMER III\data\` — les textes anglais sont dans
`local_en.pack`, les cartes d'unités dans `ui.pack` (`ui\units\icons\`).

Toujours rediriger un dump vers un fichier avec `-Out` puis chercher dedans. Une sortie tronquée
fait manquer des lignes et mène à de fausses conclusions — un `Select-Object -First 60` m'a déjà
fait croire qu'un héros n'était autorisé que pour deux factions.

Si `dump_loc.ps1` ressort sans aucune valeur alors que le pack contient bien des `.loc`, le mod est
en chinois, coréen ou japonais : relancer avec `-Cjk`.

---

## 2. Quelle table pour quelle question

| Question | Table |
|---|---|
| Quels seigneurs le mod ajoute-t-il ? | `db\frontend_faction_leaders_tables\*` — couples (clé frontend, subtype, faction) |
| Quelles unités pour ce seigneur ? | `db\main_units_tables\<lord>` |
| Qu'est-ce qui est recrutable en bâtiment ? | `db\building_units_allowed_tables\*` |
| **Cette unité est-elle accessible au joueur ?** | croiser `building_units_allowed_tables` **et** `mercenary_*` — voir §2 bis, **étape obligatoire** |
| Quels plafonds, quels groupes ? | `db\unit_set_to_unit_junctions_tables\<lord>` |
| Quels héros pour cette faction ? | `db\faction_agent_permitted_subtypes_tables\*` |
| Quels héros légendaires ? | `db\agent_subtypes_tables\*legendary_heroes*` |
| Comment se débloquent-ils ? | `script\campaign\mod\*legendary_characters*.lua` |
| Noms affichés | tous les `.loc` — voir §4 |

**`frontend_faction_leaders_tables` ne dit pas si une faction est jouable en Immortal Empires.**
J'ai déduit que trois factions étaient réservées au Vieux Monde faute d'entrée `mixer_ime_` ; le user
les avait toutes les trois dans son écran de sélection. Ne pas trancher cette question depuis les
tables : demander, ou attendre les captures.

Dans `main_units_tables`, la séquence lisible d'une ligne est en pratique :
`[caste] [clé A] wh_main_shp_transport [clé B] [poids] ...`. Quand A et B diffèrent, l'une est la
clé d'unité et l'autre la clé de `land_units` — c'est cette dernière qui porte le nom affiché.

---

## 2 bis. Vérifier qu'une unité ou un héros est RECRUTABLE — étape obligatoire

**Avant d'écrire une unité ou un héros dans un build, vérifier qu'un joueur peut réellement
l'obtenir.** Une icône dans `ui\units\icons\`, une entrée dans `land_units_tables` et un nom dans un
`.loc` ne prouvent **rien** : les mods embarquent régulièrement du contenu déclaré mais coupé.

### Pour un HÉROS — trois tables

Le test des unités ne s'applique pas aux agents ; ils ont leurs propres tables :

| Table | Ce qu'elle prouve |
|---|---|
| `db\faction_agent_permitted_subtypes_tables\*` | **quelles factions** ont droit à ce subtype — donne aussi la classe (voir §3) |
| `db\unique_agents_tables\*` | le personnage est déclaré comme **agent unique** (héros légendaire, un seul exemplaire) |
| `db\campaign_group_unique_agents_tables\*` | il est rattaché à un **groupe de campagne**, donc il apparaît réellement en jeu |

Les trois doivent répondre. Un personnage présent dans `agent_subtypes_tables` mais absent de
`faction_agent_permitted_subtypes` n'est recrutable par personne. Un personnage absent de
`campaign_group_unique_agents` est déclaré sans être distribué.

Chercher aussi un `script\campaign\mod\*legendary_characters*.lua` : c'est lui qui porte les
conditions de déblocage (bâtiment requis, faction de départ, rang minimum) — voir §6.

### Pour une UNITÉ — deux tables

**D'abord regarder le préfixe de la clé — le test ne s'applique qu'aux unités du mod.** Une clé
commençant par `wh_main_`, `wh_dlc*`, `wh2_`, `wh3_` désigne une unité du **jeu de base** : elle
n'apparaîtra jamais dans les tables du mod, et son absence ne prouve rien. Une clé au préfixe du mod
(`hkrul_`, `rhox_`, `scm_`, `wh_mod_`, `r1kko_`…) est une unité ajoutée : c'est elle qu'il faut
tester. J'ai failli retirer **The Cold-Voider** de la fiche de Drenok pour cette raison —
`wh_dlc08_nor_mon_frost_wyrm_ror_0` est un Régiment de Renom **vanilla** que le mod se contente de
désigner comme Régiment favori ; le user l'a bien dans sa liste en jeu.

Le test croise ensuite **deux** tables, parce qu'aucune des deux ne suffit :

```bash
powershell -File "C:\Users\Utilisateur\.claude\tools\tww\dump_db.ps1" -PackPath <pack> -Like "db\building_units_allowed_tables\*" -Out recrut.txt
powershell -File "C:\Users\Utilisateur\.claude\tools\tww\dump_db.ps1" -PackPath <pack> -Like "db\mercenary_*" -Out merc.txt
```

| Présente dans | Signification |
|---|---|
| `building_units_allowed_tables` | recrutable via un bâtiment — le cas normal |
| `mercenary_*` | **Régiment de Renom** : les RoR ne sont JAMAIS dans le recrutement par bâtiment, leur absence là-bas n'est pas un signal |
| aucune des deux | **non accessible au joueur — ne pas mettre dans le build** |

`units_to_exclusive_faction_permissions_tables` sert de confirmation : une unité qui y figure est
bien attribuée à une faction précise.

**Trois cas rencontrés sur SCM Tribes of the North**, tous après avoir déjà écrit la fiche :

- les **quatre unités Wolfguard** ont icônes, tables et noms ; le user a lancé une partie : une seule
  est recrutable. Trois retirées ;
- **Birna's Retinue (River Trolls)** est absente des deux tables — c'était la **garde de seigneur**
  de Birna, au même titre qu'une monture, pas une unité. Retirée ;
- **Surtha's Revenge** était absente du recrutement par bâtiment, ce qui m'a fait douter à tort :
  elle est bien dans le pool RoR. C'est exactement pourquoi il faut croiser les deux.

**Deux faux négatifs possibles**, à écarter avant de conclure qu'une unité est inaccessible :
préfixe de jeu de base (voir ci-dessus), et unité **accordée par script** plutôt que recrutée — les
créatures qui « se rallient » (Lézards Corrompus d'Adella, Esprits de Glace de Drenok, ours de Bran)
sortent d'un `.lua` ou d'un effet de faction, pas d'une table de recrutement. Dans ces cas, l'effet
de faction visible sur la capture du user est la meilleure preuve d'existence.

### Une jonction SANS CONDITION ne franchit pas la culture

`mercenary_pool_to_groups_junctions_tables` rattache un groupe à un vivier, avec au plus une
condition (`faction_requirement`, `subculture_requirement`, `tech_requirement`). Une jonction qui
n'en porte aucune **ne signifie pas « accessible à tous »**.

Le mod Mixu Mousillon place cinq régiments dans `wh_dlc04_vmp_units_of_renown_pool` sans condition.
Ce vivier compte 49 groupes : **43 portent une sous-culture** (comtes vampires, jade vampires,
jiangshi), les 6 restants viennent de mods dont l'auteur a omis la condition. Lues littéralement,
ces jonctions ouvraient « Cantankerous Bellends (Men-at-Arms) » à n'importe quel seigneur — dont
onze Bretonniens, puisque les Men-at-Arms existent aussi dans leur roster.

**Le user a tranché en jeu : Louen Leoncoeur n'a que 7 Régiments de Renom, et celui-ci n'en fait pas
partie.** Les onze placements ont été retirés.

**Règle.** La culture d'un vivier se déduit des sous-cultures exigées par ses jonctions
conditionnées. Une jonction sans condition n'est accessible qu'aux seigneurs relevant de l'une
d'elles. Si un vivier n'a que des jonctions sans condition, on ne peut rien déduire — laisser
passer, puis demander au user.

**Ce qui n'est PAS la porte d'entrée : `faction_to_mercenary_set_junctions_tables`.** Elle ne compte
que 194 lignes et ne liste que des factions spéciales. Middenland n'y figure pas, et Boris
Todbringer voit pourtant son vivier — exiger une entrée dans cette table casserait le modèle sur ce
cas de contrôle. Même remarque pour `province_to_mercenary_set` : aucun vivier de Renom n'y figure.

### Un Régiment de Renom déclaré n'est pas forcément vivant

Une entrée dans `mercenary_unit_groups_tables` ne prouve pas qu'un RoR existe en jeu. Les clés
**héritées** survivent dans les tables à côté de celles qui les remplacent, avec leur ancien nom
affiché — et rien ne les distingue au premier regard.

**Le signal est le jumeau** : deux clés de RoR pour la **même unité de base**, dans le **même pool**,
dont l'une porte un préfixe ancien — chez les Hauts Elfes, `wh2_main_hbe_*` face à
`wh2_dlc10_hef_*` / `wh3_dlc27_hef_*`.

```
wh2_main_hbe_inf_ship_company_ror_0     = "Brinedragon Swords"         <- reel (verifie en jeu)
wh3_dlc27_hef_inf_ships_company_ror     = "Company of the Kalendirian" <- reel
wh2_main_hbe_inf_the_silverpelts_ror_0  = "Silverpelts"                <- reel malgre l'ancien prefixe
wh2_dlc10_hef_inf_the_silverpelts_ror_0 = "The Puremane Company"       <- reel aussi
```

**Un jumeau est un signal de vérification, pas une preuve.** Les trois cas ci-dessus ont exactement
la même forme et **aucun** ne s'est révélé être du contenu coupé : Silverpelts et The Puremane
Company sont deux régiments distincts qui coexistent, et Brinedragon Swords — que cette fiche
donnait pour inexistant — a été montré en jeu par le user, statistiques complètes à l'appui
(8400 PV, 120 hommes, aquatique). Sa carte a été extraite et il est posé.

**La leçon tient en une phrase : un ancien préfixe ne prouve rien.** J'ai supprimé Silverpelts en
généralisant trop vite, puis déclaré Brinedragon Swords inexistant sur le même raisonnement. Le user
a dû corriger les deux fois. Quand un jumeau apparaît, **lui demander** : lui seul voit sa liste de
recrutement.

Deux réflexes, donc, avant de placer un RoR : **chercher un jumeau** sur la même unité de base, et
**vérifier que le régiment n'est pas déjà sur la fiche visée** sous un autre libellé — c'est ce
doublon-là qui aurait dû m'alerter sur Aislinn, où Company of the Kalendirian était déjà en place.
Quand un jumeau apparaît, **demander au user** : lui seul voit sa liste de recrutement, et la forme
des clés ne permet pas de trancher.

**Et si la carte manque, chercher ailleurs avant de conclure.** Deux réflexes sauvent ici. D'abord,
le jeu a **plusieurs packs d'interface** — `ui.pack`, `ui2.pack`, `ui3.pack`, `commontextures.pack` —
et ne chercher que dans le premier donne un faux négatif. Ensuite, un **mod peut fournir la carte
d'une unité au nom vanilla** : c'est `@red_hef_lords_public.pack` qui livre
`hbe_inf_the_silverpelts_ror_0.png` et `hbe_inf_the_eataine_guard_ror_0.png`, absentes de tous les
packs du jeu de base. Balayer les packs activés avant de déclarer une carte introuvable — et se
méfier des cartes « voisines » : demander au user à quoi ressemble la sienne coûte moins cher qu'une
substitution.

**Troisième réflexe : varier le MOTIF de recherche, pas seulement les packs.** Un nom de fichier
livré par CA peut contenir une faute de frappe. La carte des Blessed Saurus Spears s'appelle
`wh2_main_lzd_inf_saurus_spearmen_shields_blesssed.png` — trois `s` à « blessed » — et une recherche
sur `blessed` la manque, dans `ui.pack` comme ailleurs. J'avais conclu à son absence après avoir
balayé les trois packs d'interface ; c'est en cherchant sur `saurus_spear` qu'elle est sortie.

Chercher donc sur **la racine de la clé d'unité** autant que sur le qualificatif, et croiser avec
`ui\units\minspec_portholes\` : le porthole d'une unité existe presque toujours, même quand la carte
se dérobe, et sa présence prouve que l'unité est réelle avant qu'on aille chercher plus loin.

**Et quand rien ne sort, cesser de chercher par motif : LISTER tout l'inventaire d'icônes du pack.**
Un mod ne nomme pas forcément ses cartes d'après ses clés d'unité. `Champions_of_undeath` appelle
`abby_ror_1`, `abby_ror_2` et `abby_ror_3` les trois « Disciples Of The Path » — *abby* pour
Abhorash — et de même `bg_ror` pour Black Grail, `dg_ror` pour Depth Guard. Aucune recherche fondée
sur `chosen_disciples_of_the_path` ne pouvait aboutir, et j'ai conclu à tort à l'absence des cartes
après six tentatives ciblées. Les 107 entrées du pack, listées d'un bloc, ont donné la réponse en un
coup d'œil.

Un pack de mod contient rarement plus de deux cents icônes : les afficher toutes coûte une commande
et supprime la question. Le faire **avant** de déclarer une carte introuvable, pas après.

Corollaire sur les noms suffixés : `..._ror` = Régiment de Renom (chercher dans `mercenary_*`),
et un nom du type « <em>Garde de X</em> » / « <em>Retinue of X</em> » doit faire soupçonner une garde
de seigneur plutôt qu'une unité recrutable.

### Rattacher un RoR à son unité de base : la parenthèse ment parfois

Le jeu écrit lui-même l'unité de base entre parenthèses dans le nom du régiment —
`land_units_onscreen_name_wh2_dlc11_cst_inf_depth_guard_ror_0` vaut
« The Bloody Reaver Deck Guard **(Depth Guard)** ». C'est la source la plus fiable pour savoir de
quelle unité un RoR dérive, et elle vient des données, pas d'une convention du site.

**Mais un nom affiché n'identifie pas une unité.** Deux mods peuvent baptiser identiquement deux
unités sans rapport, et la parenthèse rattache alors le RoR à la mauvaise :

```
Aspiring Champions                            wh_dlc06_chs_inf_aspiring_champions_0    <- Chaos
The Wolves of Naglfari (Aspiring Champions)   wolftribe_nor_inf_wolf_champions_ror_0   <- tribu norscane
```

Le régiment est norscan ; la parenthèse le faisait atterrir sur une fiche Tzeentch, chez un
seigneur qui ne peut pas le recruter. Le user l'a vu sur la page avant moi.

**Le garde-fou est la culture, lue dans la clé.** Extraire le segment de culture (`chs`, `nor`,
`ksl`, `ogr`, `cst`, `hef`…) de la clé du RoR et de celle de l'unité de base retenue, et refuser le
rattachement quand ils diffèrent. Sur une passe de 529 placements, ce seul test a isolé les 5 faux
— invisibles autrement, puisque le nom, lui, correspondait parfaitement.

**Et la parenthèse ne nomme pas toujours une unité.** Elle peut désigner l'**arme** du régiment :
« Fooger's Houseguard (Greatswords) », clé `hkrul_fooger_ror`, n'a aucun lien avec l'unité
Greatswords — c'est un régiment qui porte des épées à deux mains. La dérivation par la clé le disait
(elle renvoyait « Arkat Fooger »), j'ai tranché pour la parenthèse, et le régiment est parti sur huit
fiches de l'Empire. Même piège pour « The Great Mawherd of Bloodfjord (Feral Mammoths) », dont la clé
`wh_dlc08_nor_mon_war_mammoth_ror_1` désigne le **War** Mammoth alors que les fiches visées alignent
des Feral Mammoths.

**Quand les deux méthodes se contredisent, la clé gagne, sans exception.** Un désaccord n'est jamais
un détail de formulation : c'est le signe que la parenthèse parle d'autre chose que de l'unité de
base. Les traiter un par un — ils sont peu nombreux, huit sur 453 lors de cette passe.

Deux corollaires. La **dérivation par la clé** (retirer le segment `_ror`) est plus sûre que la
parenthèse quand les deux répondent : elle ne peut pas confondre deux unités homonymes. Et une
ambiguïté de préfixe n'est pas une erreur : `bur_wh3_main_ksl_inf_streltsi_0` et
`wh3_main_ksl_inf_streltsi_0` sont la même unité redéclarée par un mod — même culture, donc
inoffensif. C'est le croisement de **cultures** qui signale la faute, pas la simple pluralité de clés.

**Trois contrôles, pas un.** Comparer la culture du RoR à celle de l'unité de base ne suffit pas :
il faut aussi la comparer à la **race de la fiche**. Un seigneur moddé peut parfaitement recruter
une unité d'une autre culture sans avoir accès au pool de mercenaires correspondant — **recruter
l'unité de base et recruter son Régiment de Renom sont deux droits distincts**. Dieter (Comtes
Vampires) aligne une War Hydra elfe noire par son Monster Pens, et le user a confirmé en jeu qu'il
n'a pas pour autant les versions RoR des monstres qu'il recrute.

Sur la même passe, ce troisième test a écarté 31 placements de plus, dont sept d'un coup : le RoR
impérial « Deathjacks (**Archers**) » partait sur sept fiches Haut Elfes, parce que les deux races
ont une unité nommée « Archers ». Son symétrique, « The Scions of Mathlann (**Spearmen**) », partait
chez l'Empire. Par défaut, on écarte quand la culture ne correspond pas à la race de la fiche — sauf
tronc commun assumé, les factions du Chaos partageant `chs` avec `kho` / `tze` / `nur` / `sla`.

**Et dédoublonner sur une clé normalisée, pas sur le libellé.** Le site et le jeu n'écrivent pas
toujours pareil : article de tête (`The Baron's Men` contre `Baron's Men`), parenthèse différente,
ponctuation (`Fleur-de-lis` contre `Fleur de Lis`). Comparer les libellés bruts laisse passer des
doublons — 12 sur une seule passe. La clé doit retirer la parenthèse finale, l'article de tête, la
ponctuation et la casse.

### Un nom générique peut masquer plusieurs unités distinctes

Les suffixes `_0`, `_1`, `_2` d'une même famille ne sont pas des variantes cosmétiques : ce sont des
**unités séparées**, avec leur propre carte, leur propre bâtiment de recrutement et souvent un
armement différent. Le nom affiché ne le dit pas toujours, et un mod de renommage peut brouiller la
piste dans les deux sens.

```
wh2_dlc11_cst_inf_depth_guard_0     = "Depth Guard"            -> renomme "Depth Guard Deck Ravagers"
wh2_dlc11_cst_inf_depth_guard_1     = "Depth Guard (Polearms)" -> renomme "Depth Guard Deck Watchers"
wh2_dlc11_cst_inf_depth_guard_ror_0 = "The Bloody Reaver Deck Guard"
```

Ici le jeu de base nommait le `_1` « Depth Guard (Polearms) », mais `Champions_of_undeath` renomme
les deux, et le user ne voit en jeu **que** les noms du mod. Le site n'avait retenu qu'une entrée
générique « Depth Guard » — donc une unité entière manquait, et la fiche de Red Aldrek, entièrement
bâtie sur cette famille, était incomplète.

**Deux vérifications, à faire ensemble :**

1. **Lister toute la famille** avant de placer une unité — chercher la racine de la clé, pas le nom
   affiché, et sortir les suffixes. Puis vérifier chacun dans `building_units_allowed_tables` :
   les variantes n'ont pas le même palier (`_0` dès la Caserne 3, `_1` seulement à la Caserne 4).
2. **Croiser avec `unit_set_to_unit_junctions_tables`.** C'est la table qui dit quelles clés un
   effet de seigneur ou de faction vise réellement. Chez Red Aldrek, `wh2_dlc11_cst_depth_guard`
   contient les **trois** clés : ses bonus d'entretien, son +25% de Force des armes au rang 7 et
   l'aura « Guardian » couvrent donc aussi la variante hallebardes. Sans cette table, on suppose —
   avec elle, on sait.

Corollaire sur les variantes de mod : une variante peut exister sans être accessible. Champions of
Undeath ajoute `depth_guard_crab_cav`, `depth_guard_serpeant_cav` et `depth_guard_elder_reaver`,
mais leurs bâtiments sont `DG_*_horde_*` et `wh_mod_DG_adv_*` — les factions du mod lui-même. Aucun
seigneur Vampire Coast n'y a accès. **Toujours repasser par le §2 bis** avant de placer une variante
trouvée dans un mod.

### Deux façons de conclure à tort qu'une carte n'existe pas

Conclure « aucune carte nulle part » est une affirmation forte. Elle a été prononcée à tort pour
Brinedragon Swords, que le user avait pourtant sous les yeux en jeu. Deux causes se cumulaient.

**1. `scan_packs.ps1` filtre en regex, pas en littéral.** Sa ligne de test est `if($p -match $Match)`.
Un chemin Windows passé tel quel y est donc réinterprété : le motif `icons\ship_company_ror` se lit
`icons` + `\s` (classe blanche) + `hip_company_ror`, et ne peut jamais correspondre. Le balayage
répond « aucun chemin ne correspond » sans avoir cherché ce qu'on croyait.

```
MAUVAIS   -Match 'icons\ship_company_ror'      -> cherche "icons<blanc>hip_company_ror"
BON       -Match 'ship_company_ror_0\.png'     -> pas d'antislash, le point est echappe
BON       -Match 'icons.wh2_main_hbe_inf_ship' -> le point matche l'antislash
```

**2. Le nom d'une carte de RoR peut omettre le marqueur `_ror`.** Dans `@red_hef_lords_public.pack`,
trois régiments suivent la convention (`hbe_inf_the_eataine_guard_ror_0`, `hbe_inf_the_silverpelts_ror_0`,
`hbe_inf_wavewatchers_ror_0`) et le quatrième non : l'unité `wh2_main_hbe_inf_ship_company_ror_0` a
pour carte `hbe_inf_ship_company_0.png` — sans `wh2_main_`, **et sans `_ror`**. Chercher le motif du
régiment ne suffit donc pas, et l'absence du `_ror` ne prouve pas qu'il s'agit de l'unité de base.

**Règle.** Avant de déclarer une carte introuvable : lister l'**inventaire complet** des icônes du
pack et le rapprocher de sa liste d'unités. Un pack qui déclare N unités et livre N icônes ne peut
pas avoir de carte manquante, quelles que soient leurs graphies. Et si `main_units_tables` donne un
`land_unit` dont aucune icône ne porte le nom, c'est un indice de renommage, pas d'absence.

**Enfin, l'observation en jeu prime.** Le user affirmait voir la carte ; l'analyse des packs disait
le contraire. C'est l'analyse qui avait tort — deux fois, pour deux raisons différentes.

---

## 3. Seigneur ou héros ?

Dans `faction_agent_permitted_subtypes`, chaque ligne est un triplet (classe d'agent, faction,
subtype). **Si `general` apparaît sur au moins une ligne d'une clé, c'est un SEIGNEUR.**

`colonel` et `minister` ne sont pas des classes de héros. Les classes de héros sont : `champion`,
`wizard`, `dignitary`, `spy`, `engineer`, `runesmith`.

Cette règle vaut **aussi pour les personnages du jeu de base**. Le Herald of Nurgle est un seigneur,
et il s'était glissé en héros dans trois fiches à la fois.

Corollaire inverse : ne pas se fier au fait qu'un personnage soit une entité unique. L'Exalted
Flamer of Tzeentch est une unité de tir du corps d'armée, pas un héros. En cas de doute, vérifier
qu'il figure bien dans `faction_agent_permitted_subtypes` ; sinon ce n'est pas un agent.

La classe **`spy` n'est pas une classe « hors armée »** : en vanilla c'est celle du Chasseur de
sorcières, du Waystalker, de l'Assassin skaven, de la Banshee et du Chasseur ogre. Un héros `spy`
s'intègre normalement dans un build.

**Revérifier la liste des factions autorisées au moment d'ajouter le héros à un build**, pas
seulement à la découverte. J'ai déjà placé un héros chez un seigneur non autorisé parce que la
vérification datait de plusieurs étapes plus tôt.

---

## 4. Résoudre un nom d'affichage

Échelle de repli, dans l'ordre. S'arrêter dès qu'un nom est trouvé.

1. `land_units_onscreen_name_<clé>` — la source normale
2. `loading_screen_quotes_title_<clé>` — souvent renseignée quand la précédente manque
3. `rituals_display_name_*` — les rituels de déblocage nomment l'unité qu'ils débloquent
   (« Train Gnoblar Spider Chariot »)
4. `effects_description_*` — les effets citent les familles d'unités
   (« Leadership: +n for Stone Trolls units »)
5. `ui_text_replacements_localised_text_*` — noms de héros variables selon la faction
6. `unit_description_short_texts_text_*` — ne donne pas le nom mais permet de distinguer deux
   variantes voisines (`_01` base, `_03` Ironfists, etc.)
7. **Le wiki officiel** — `https://totalwarwarhammer.fandom.com/wiki/<Nom_De_L_Unite>`. Le user a
   explicitement autorisé cette source (03/08/2026). Y aller via `mcp__Claude_Browser__navigate`
   puis `get_page_text` : `WebFetch` renvoie un 402 sur ce domaine. Le wiki donne la clé interne
   exacte, la race, la catégorie, les statistiques complètes et les attributs — donc bien plus
   qu'un nom : de quoi **justifier** un choix de variante au lieu de le poser arbitrairement.
8. **Demander au user.** C'est une issue normale, pas un échec.

**Le dump de loc n'est pas exhaustif.** L'extraction ASCII rate des entrées : une absence dans le
dump ne prouve pas l'absence dans le jeu. Cas vécu — j'ai conclu que les Marauder Champions (Great
Weapons) n'avaient aucun nom et relevaient de contenu coupé, alors que l'unité existe bel et bien
(`wh_dlc08_nor_inf_marauder_champions_1`, DLC Norsca). **Indice qui aurait dû alerter** : une carte
existait dans `ui\units\icons\` alors que le nom semblait absent. Une carte sans nom est suspecte —
vérifier au wiki avant de conclure à du contenu coupé.

Attention au format du dump : la valeur est tantôt sur la ligne suivante, tantôt collée à la clé
sur la même ligne. Chercher les deux.

### Pourquoi le dump est lacunaire, et comment obtenir la liste complète

Ce n'est pas une imprécision de l'extraction, c'est une propriété du format. Un `.loc` est de
l'**UTF-16LE**, et chaque entrée se termine par **un octet booléen** (le drapeau « infobulle »).
Cet octet impair décale l'alignement de l'entrée suivante : une recherche qui décode le fichier
depuis l'octet 0 ne voit donc qu'**une chaîne sur deux**. Les autres tombent sur les octets
impairs et deviennent invisibles.

Conséquence directe : **une absence dans un dump ASCII ne prouve rien**, et le taux de perte
avoisine la moitié. Sur les trois packs DEER24, la recherche naïve rendait quelques centaines
d'entrées trouées là où le parsing correct en a donné **4818**.

Deux remèdes, du plus rapide au plus fiable :

1. **Chercher sur les deux alignements** — décoder le blob en UTF-16 depuis l'octet 0 *puis*
   depuis l'octet 1. Suffisant pour retrouver une chaîne qu'on sait présente.
2. **Parser le format**, qui est simple et vaut le quart d'heure dès qu'on a besoin de la carte
   complète des noms :

```
en-tete, 14 octets : FF FE | "LOC" | version | compte
puis, pour chaque entree :
  uint16  longueur de la cle   (en caracteres, pas en octets)
  cle     UTF-16LE
  uint16  longueur de la valeur
  valeur  UTF-16LE
  1 octet drapeau
```

Le symptôme qui doit y faire penser : des unités dont la carte existe dans `ui\units\icons\` mais
dont le nom semble absent, **en nombre**. Une seule manquante est une vraie absence ; la moitié du
roster manquante est un problème d'alignement.

Un mod peut ne pas localiser une unité qu'il ajoute pourtant : c'est fréquent pour les régiments de
renom. Extraire quand même la carte, et demander le nom.

---

## 5. Plafonds d'unité

Dans `unit_set_to_unit_junctions_tables\<lord>`, les lignes `mp_cap_unit_*` disent à quel plafond
chaque unité est rattachée. C'est une information de build, pas un détail : elle change le nombre
de slots réellement disponibles.

Deux variantes rattachées au **même** `mp_cap_unit_*` se disputent le même plafond — prendre l'une
se fait au détriment de l'autre. Deux unités rattachées à des plafonds **différents** se cumulent
réellement, même si elles se ressemblent.

Vérifier systématiquement avant de mettre deux variantes d'une même unité dans un build.

### Le plafond d'un Régiment de Renom se calcule, il ne se suppose pas

`mercenary_unit_groups_tables.max_count` vaut **1** pour la quasi-totalité des RoR : un régiment est
unique par définition. Mais un effet de faction ou de seigneur peut le relever, et le total est alors
`max_count` + la somme des bonus.

Le cas type est le **« Régiment favori : +1 capacité »**, qui porte le maximum à **2** — pas
davantage. Sur la fiche d'Aislinn, le Company of the Kalendirian avait été posé en ×3 : le bonus
était bien identifié, mais appliqué comme s'il levait le plafond au lieu de l'incrémenter. La note
disait « permet d'en aligner plusieurs », formule assez vague pour masquer l'erreur pendant
plusieurs passes. **Le user l'a repérée sur la page.**

**Règle.** Toute quantité de RoR supérieure à 1 doit nommer dans sa note l'effet qui l'autorise
**et** le plafond obtenu — « le +1 de capacité porte le maximum à 2 », jamais « permet d'en aligner
plusieurs ». Une note qui ne sait pas compter est une note qui cache une erreur.

#### Auditer les plafonds : trois pièges, mesurés sur l'ensemble du site

Un balayage a signalé **91** régiments au-dessus de leur plafond. Après instruction il en restait
**2**. Les 89 écarts venaient de trois causes, toutes à connaître avant de « corriger » quoi que ce
soit — corriger un faux positif abîme une fiche juste.

**1. Le plafond se lit sur la CLÉ, jamais sur le nom affiché.** « Black Grail Knights » désigne
**six clés distinctes** réparties sur trois mods ; une seule (`ovn_dk_cav_black_grail_knights_ror`)
est un Régiment de Renom. La fiche de la Dame du Graal Noir emploie celle de Mousillon, cavalerie
ordinaire sans plafond. C'est l'invariant « un nom générique peut masquer plusieurs unités
distinctes » appliqué aux plafonds — **le user a signalé ce faux positif.**

**2. Un effet de faction peut retirer à un RoR sa nature même.** Le Clan Septik déclare « Peut
recruter les Plaguevermin **comme unités régulières** » : le régiment cesse d'être un RoR pour cette
faction, et aucun plafond ne s'applique. La fiche de Grrzk Roteye le disait déjà dans sa note ;
c'est le contrôle automatique, qui ne lisait que les tables, qui avait tort.

**3. Les libellés d'effet ne suivent aucune forme unique.** Cinq tournures coexistent, et presque
toutes emploient une forme **courte** de l'unité de base — un test sur le nom complet du régiment
échoue donc dans la majorité des cas :

```
Régiment favori : +1 capacité pour les Blades of Hoeth (Swordmasters)   <- "Swordmasters of Hoeth"
Régiment favori Hounds of the Blood Hunt (Flesh Hounds) : +1 capacité   <- ordre inverse
Régiment favori : capacité +1 et ... pour The Flock of Djaf (Carrion)   <- "capacite +1"
Régiment favori : +1 pour Stalkers of the Kalti Delta (Sarl Hunters)    <- sans le mot "capacite"
Capacité d'unité : +3 pour The Severed Claw (Aspiring Champions)        <- autre libelle entier
```

**Et un « Régiment favori » n'accorde pas toujours de la capacité.** Chez Belannaer il améliore une
aura, chez Tretch il octroie l'aptitude « Verminous Valour ». Vérifier que l'effet trouvé parle bien
de capacité **et** vise bien le régiment concerné : c'est ainsi que les deux seules vraies erreurs
du site ont été isolées.

---

## 6. Héros légendaires

Deux sources complémentaires.

`db\agent_subtypes_tables\*legendary_heroes*` donne la liste exhaustive et, souvent, le savoir de
magie.

`script\campaign\mod\*legendary_characters*.lua` est le vrai gisement. Pour chaque héros :

- `subtype` — la clé
- `allowed_cultures` — souvent toute la culture, donc pas d'exclusivité de faction
- `required_buildings` — le bâtiment qui le débloque
- `starting_owner_faction` — la faction qui le reçoit d'office au départ
- `priority_faction` / `priority_ai_faction` — celle où il apparaît en premier
- `unlock_rank` — parfois un rang de seigneur plutôt qu'un bâtiment
- les clés de mission associées

Ces champs permettent une répartition **justifiée** : placer le héros là où le mod le désigne, et
écrire la raison dans la note. À défaut, choisir selon le bâtiment de déblocage — un héros débloqué
par les camps à monstres va à une faction de monstres.

Dans d'autres mods, les héros légendaires passent par des missions scriptées : chercher
`script\campaign\**\*spawn_heroes*.lua`, chaque entrée étant un `mission_manager:new(faction, ...)`
avec `add_new_objective` et `add_condition`. **Toujours écrire la condition de déblocage dans la
note du héros.** Cas particulier : une entrée avec `kill_generic_type` n'a pas de mission mais
**remplace** un héros générique — elle occupe donc l'un de ses emplacements.

### Choisir la BONNE fiche — vérification obligatoire

`faction_agent_permitted_subtypes` dit seulement *qui a le droit* de le recruter. Quand un héros est
ouvert à plusieurs factions d'une même race — le cas courant — cette table ne suffit pas à décider
sur quelle fiche le mettre. **Avant de trancher, lire son arbre de compétences et ses objets** :

```bash
powershell -File "...\dump_loc.ps1" -PackPath <pack> | findstr /I "<cle_du_heros>"
```

`character_skills_localised_name_<héros>_*` et `ancillaries_onscreen_name_<héros>_*` nomment très
souvent le seigneur, le navire, la tribu ou la région d'origine. C'est la source la plus fiable pour
l'affectation, et elle fournit en prime la justification à écrire dans la note.

**Cas qui a motivé cette règle.** J'ai placé **Ogg Halfheart** chez Luthor Harkon parce que sa
description mentionnait le *Swordfysh* et que les quatre factions Vampire Coast le permettaient
toutes. Le user a corrigé : le *Swordfysh* est le navire d'**Aranessa Saltspite**. L'arbre du
personnage le disait explicitement — compétence innée **« First Mate of the Pirate Queen »**, objet
**« Symbol of the First Mate »**, compétences « Ogre Pirates » et « Unflinching Loyalty ». Trente
secondes de `dump_loc` auraient évité l'erreur.

**Vérifier aussi qu'il n'est pas déjà seigneur sur le site.** Un mod peut proposer en héros un
personnage qu'un autre mod a déjà donné comme seigneur légendaire — c'est le cas de **Gitilla Da
Hunter**, héros *spy* dans un pack et Peaux-Verts XVII sur le site. Un seigneur légendaire n'est
jamais placé en héros de build : chercher le nom dans `data\*.json` avant de l'ajouter.

---

## 7. Pièges recensés

**Clés `mixer_*`.** Une faction écrite `mixer_ogr_red_maw` dans
`faction_agent_permitted_subtypes` est une clé d'écran de sélection, pas une faction de campagne.
Les héros ainsi déclarés n'apparaissent nulle part en jeu. Si le reste du mod utilise des clés
`wh3_main_*`, l'asymétrie est le signal. Le user vérifie de son côté dans le **Unit & Spell
Browser** de l'écran de campagne — c'est la source à lui demander en cas de doute.

**Illustration dupliquée.** Une carte identique à une unité déjà sur le site est un signal, pas une
preuve. Deux lectures possibles : soit j'ai mal classé l'entrée, soit le mod réutilise l'art d'une
unité existante pour un héros distinct. Les deux se sont produites. Demander au user.

**Homonymes entre mods et jeu de base.** Un mod peut ajouter un personnage dont le jeu de base a une
version officielle — et c'est parfois celle du jeu de base qui est utilisable, la mission du mod
étant buguée. Quand un héros de mod semble inatteignable, chercher s'il existe en vanilla.

**Renommage de faction.** Un mod peut renommer une faction sans changer sa clé interne : la clé dit
« Skulltaker Tribe », l'écran affiche « Red Fist Tribe ». Le nom affiché fait foi dans la fiche.

**Héros sans carte d'unité.** Certains héros du jeu de base n'ont aucun fichier sous
`ui\units\icons\` — seulement un portrait sous `ui\portraits\units\no_culture\`. Utiliser le
portrait, jamais la carte d'un homonyme.

**Une icône n'est pas une unité recrutable.** La présence d'un fichier dans `ui\units\icons\` ne
prouve rien : il peut s'agir de contenu coupé. Croiser avec `land_units` ou un effet de faction.

**Ne pas identifier une variante d'unité à l'œil.** La lecture visuelle vaut pour confirmer une
famille évidente — des scarabées sont des scarabées — mais pas pour distinguer deux variantes
d'armement de la même unité. J'ai choisi une carte « Dual Weapons » d'après la posture du
personnage et je me suis trompé de fichier. Pour départager `_01` / `_02` / `_03`, s'appuyer sur
`unit_description_short_texts_text_*`, qui décrit l'équipement, ou demander au user.
