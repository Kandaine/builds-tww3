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

## 2 bis. Vérifier qu'une unité est RECRUTABLE — étape obligatoire

**Avant d'écrire une unité ou un héros dans un build, vérifier qu'un joueur peut réellement
l'obtenir.** Une icône dans `ui\units\icons\`, une entrée dans `land_units_tables` et un nom dans un
`.loc` ne prouvent **rien** : les mods embarquent régulièrement du contenu déclaré mais coupé.

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

Corollaire sur les noms suffixés : `..._ror` = Régiment de Renom (chercher dans `mercenary_*`),
et un nom du type « <em>Garde de X</em> » / « <em>Retinue of X</em> » doit faire soupçonner une garde
de seigneur plutôt qu'une unité recrutable.

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
