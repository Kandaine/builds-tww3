---
name: fiches-tww3
description: Workflow complet pour le site builds-tww3 — créer une fiche de seigneur légendaire à partir d'un mod Steam Workshop de Total War WARHAMMER III, modifier une fiche existante (ajouter un héros ou une unité, corriger une erreur, rééquilibrer les 20 slots), revoir toute une page après un DLC, un patch du jeu ou la mise à jour d'un mod, ou réaligner les héros légendaires d'une race sur les scripts des mods qui les attribuent, ou auditer d'un coup tous les héros de tous les mods actifs. À utiliser dès que le user parle d'un mod TWW3, envoie un chemin workshop\content\1142710\, colle des captures de l'écran Lord Details, demande d'ajouter un seigneur ou un héros au site, signale qu'une unité ou un effet est faux sur une fiche, annonce un DLC ou une mise à jour, ou évoque data/*.json, js/units/*.js, js/core.js, un régiment de renom, un plafond d'unité ou une carte d'unité à extraire — même s'il ne nomme pas explicitement le site.
---

# Fiches builds-tww3

Site personnel non commercial : catalogue en français de builds à 20 slots pour les seigneurs
légendaires de TWW3 en Immortal Empires. Dépôt `C:\Users\Utilisateur\Projets\builds-tww3`
(GitHub `Kandaine/builds-tww3`, **public**). HTML/CSS/JS statique, sans build.

**Publié sur GitHub Pages** à https://kandaine.github.io/builds-tww3/, redéployé à chaque push
sur `main`. Une fiche fausse ou une carte sans image est donc visible par des visiteurs, pas
seulement par le user — c'est ce qui justifie la sévérité des invariants ci-dessous.

Cinq parcours. Lire d'abord les invariants, ils valent pour les cinq.

---

## Invariants

Ces règles viennent toutes d'erreurs réelles corrigées par le user. Elles coûtent peu à respecter
et cher à violer.

**Ne jamais inventer un nom d'unité ou de héros.** Si la loc du mod est muette, épuiser l'échelle
de repli (voir `references/analyse-pack.md`), consulter le **wiki officiel** — le user l'a
autorisé — puis **demander au user** le nom affiché en jeu. Un nom plausible par analogie n'est pas
un nom confirmé.

**Ne jamais substituer une image approchante.** Si la carte manque, l'extraire, ou utiliser le
portrait officiel du même personnage. Jamais la carte d'un homonyme : le « Master Engineer » n'est
pas l'« Engineer ».

**Chercher d'abord sur le site.** Le site couvre plus de mille clés et beaucoup d'unités sont
partagées entre races et entre mods. Avant toute extraction, chercher le nom **et** la clé dans
`js/units/*.js` et `data/*.json` — sur **tout** le dossier `js/units/`, pas seulement le module de
la faction visée, sinon on rate justement les unités partagées. Deux fois de suite j'ai extrait un
doublon en croyant à une absence.

**Ne jamais écraser un PNG existant.** Après extraction, `git status --short` doit montrer `??` et
jamais ` M` sur un fichier d'`assets/`. Si un ` M` apparaît : `git checkout -- <fichier>` et
signaler.

**Sauf quand le user demande explicitement le remplacement.** C'est le seul cas où un ` M` sous
`assets/` est légitime — par exemple « son image est de mauvaise qualité, remplace-la par celle du
mod ». Le faire alors **soi-même**, jamais via le sous-agent : sa règle anti-écrasement est
inconditionnelle, il ne peut pas distinguer un écrasement accidentel d'un remplacement voulu, et il
annulera le travail par un `git checkout`. Le cas s'est produit sur `gronk.png`, réextrait deux fois.
Si le remplacement doit malgré tout passer par le sous-agent, le lui autoriser **nommément dans le
prompt**, fichier par fichier.

**La priorité absolue va à ce que le user voit en jeu.** Les tables du pack sont un indice, pas une
preuve. Quand le user dit qu'une unité ou un héros n'existe pas, ou porte un autre nom, il a raison
et la fiche change. On peut lui exposer ce que disent les tables — jamais pour lui opposer, toujours
pour l'aider à vérifier.

**Un seigneur légendaire n'est jamais placé en héros de build.** Une seule exception, validée par le
user le 19/08/2026 : **Vlad et Isabella von Carstein**, chacun héros dans le build de l'autre. Le jeu
prévoit ce couple — le +50% de plafond de soin de Vlad ne s'active que si Isabella sert dans la même
armée. Ne pas le corriger. Une seconde exception, sans justification mécanique mais **acceptée par
le user le 08/09/2026** : *Infanta Leanora Navrre*, seigneur sur la page Vampire Coast **et**
héroïne chez Count Noctilus, dans l'armée duquel son script la pose (placée à tort chez Cylostra
Direfin jusqu'au 22/10/2026). C'est **le même personnage** — un seul pack la fournit,
`!!!3_legendary_guys.pack` ; une ancienne version de ce skill affirmait à tort une homonymie entre
deux mods. Ne plus la signaler. Une troisième, **décidée le 17/10/2026** : *Dieter Helsnicht* et
*Walach Harkon*, héros chez **Nagash** alors qu'ils ont chacun leur fiche de seigneur venue d'un mod —
ce sont les héros légendaires officiels de Nagash depuis le DLC. Elle ne vaut que chez Nagash.
*Gitilla Da Hunter* relève du même conflit et a été tranché dans l'autre sens : il reste seigneur seul.

**Exactement 20 slots** : 1 seigneur + Σ qty des héros + Σ qty du corps d'armée. Une unité invoquée
par une capacité ne consomme aucun slot — la mentionner dans la note, pas dans la liste.

**Respecter les plafonds** : capacités de héros annoncées dans les effets de faction, et plafonds
d'unité partagés entre variantes (voir `references/analyse-pack.md`).

**Mais un bonus de capacité n'est pas une obligation de remplissage.** Quand un effet donne
« +2 de capacité pour les Chaos Sorcerers of Slaanesh », il autorise à en **recruter** davantage —
à l'échelle de la **faction**, donc répartis sur plusieurs armées. Il ne dit pas qu'il faut les
empiler dans l'armée du seigneur. Ne monter la quantité sur la fiche que si le build y gagne
vraiment ; sinon, mentionner la capacité dans la note et laisser le nombre au niveau que le build
justifie. Le réflexe inverse — « +2, donc j'en mets 3 » — produit des fiches saturées de héros
identiques qui ne servent pas le seigneur.

**Ne jamais placer une unité ou un héros sans avoir vérifié qu'un joueur peut l'obtenir.** Une
icône, une entrée de table et un nom dans un `.loc` ne prouvent rien : les mods embarquent du
contenu déclaré mais coupé. Le test diffère selon la nature — **unité** : croiser
`building_units_allowed_tables` et `mercenary_*` ; **héros** : croiser
`faction_agent_permitted_subtypes`, `unique_agents` et `campaign_group_unique_agents`. Procédure
complète en §2 bis de `references/analyse-pack.md`. Sur un seul mod, cette vérification a écarté
quatre unités que j'avais déjà écrites dans les fiches.

**Un nom générique peut masquer plusieurs unités distinctes.** Les suffixes `_0` / `_1` d'une même
famille sont des unités séparées, avec leur propre carte, leur propre palier de bâtiment et souvent
un armement différent — et un mod de renommage peut effacer la distinction visible. Avant de placer
une unité, lister **toute la famille** par la racine de sa clé, puis croiser
`unit_set_to_unit_junctions_tables` pour savoir lesquelles les effets du seigneur visent réellement.
C'est ce qui a révélé que les Depth Guard Deck Watchers manquaient à la fiche de Red Aldrek alors
que tous ses bonus les couvrent. Détail en §2 bis de `references/analyse-pack.md`.

**Les effets doivent correspondre exactement aux captures du user.** Traduire, ne pas réinterpréter,
ne pas arrondir, ne pas omettre les malus.

**Ne jamais commiter ni pousser sans feu vert explicite.** Le user dit « oui go » ou équivalent.

---

## Parcours A — nouvelle fiche depuis un mod

Le user envoie un chemin `C:\Program Files (x86)\Steam\steamapps\workshop\content\1142710\<id>\`
et, généralement, des captures de l'onglet Lord Details.

**1. Inventorier.** Lister le pack, repérer les seigneurs jouables, présenter au user un inventaire
bref : qui est jouable en Immortal Empires, qui est déjà sur le site, qui est laissé de côté.
Attention : `frontend_faction_leaders_tables` ne suffit pas à trancher Immortal Empires contre
Vieux Monde — j'ai classé trois factions à tort. L'écran de sélection du user fait foi.

**2. Demander les captures** si elles manquent. Sans elles, pas de bloc d'effets.

**3. Analyser le roster.** Voir `references/analyse-pack.md` : quelles tables lire, dans quel ordre,
et comment résoudre les noms. C'est l'étape la plus longue et la plus rentable — un build bâti sur
un roster mal lu est faux de bout en bout.

Deux réflexes à ne pas sauter ici. **Lister `text\db\*.loc` puis dumper fichier par fichier** : un
dump global unique perd des valeurs à cause de l'encodage, et c'est comme ça que j'ai écrit seize
fiches avec des noms génériques alors que le mod renommait les unités par tribu. Et **passer chaque
unité retenue au test de recrutabilité** (§2 bis) avant de l'écrire.

**4. Concevoir le build.** Partir des effets du seigneur, pas du roster : quelle unité bénéficie
réellement du bonus ? Un effet qui ne vise que l'infanterie de mêlée rend chaque cavalier aligné
plus coûteux qu'il n'en a l'air. Chercher la mécanique centrale et la faire porter la fiche.

**La synergie avec les effets n'est pas un objectif, c'est une contrainte.** Chaque ligne du build
doit se rattacher à un effet de faction ou de seigneur, ou à un manque que ces effets créent. Une
unité qu'aucun effet ne touche et qui ne comble aucune faiblesse identifiée n'a rien à faire dans
la liste — la relire une fois la fiche écrite et se demander, ligne par ligne : *quel effet la
justifie ?* Si la réponse est « aucun », soit elle bouche un trou qu'il faut nommer dans sa note,
soit elle sort.

**La clause du manque nommé n'est pas une facilité, elle est indispensable — et voici pourquoi.**
On a tenté de la supprimer, pour n'accepter qu'un effet comme justification. Le premier cas testé a
suffi à faire marche arrière : **Greasus Goldtooth n'a qu'un seul effet visant une unité**, son
régiment favori. Tout le reste est économique et diplomatique — revenus de taxes, de pillage,
relations. La règle stricte aurait supprimé sept de ses huit lignes.

Certains seigneurs n'ont presque aucun effet sur les unités : leur puissance est économique,
diplomatique ou personnelle. Chez eux, « quel effet justifie cette ligne ? » ne mesure plus la
qualité du build mais la nature du seigneur.

La clause reste donc, mais elle **se mérite** : le manque doit être objectif — une lacune du roster,
une contrainte de faction, un rôle qu'aucune autre ligne ne tient — et non une justification
rédigée après coup. Les Stegadon de Nakai passent, il est une horde sans artillerie possible. Les
Swordsmen de Markus Wulfhart tombent : leur note disait « infanterie de ligne polyvalente », ce qui
ne nomme rien, et rien ne l'empêchait d'aligner des Archers que son -50% d'entretien subventionne.

Deux précisions pour ne pas sur-appliquer. Un effet **de faction** compte autant qu'un effet de
seigneur. Et une variante d'élite hérite des effets de son unité de base : le §2 bis
d'`analyse-pack.md` montre comment le prouver par `unit_set_to_unit_junctions_tables` plutôt que
de le supposer.

**Priorité aux Régiments de Renom dans le corps d'armée.** À bénéfice comparable, un RoR passe
avant l'unité standard équivalente : c'est la version d'élite, elle porte souvent une capacité
propre, et elle est unique donc elle ne concurrence pas les plafonds partagés. Les chercher
systématiquement dans `db\mercenary_*` au moment de composer, y compris les RoR **vanilla** que le
mod se contente de désigner comme Régiment favori. Deux limites : un RoR ne se prend qu'en **un
seul exemplaire**, et il faut vérifier que le seigneur y a bien accès.

**5. Extraire les images** via le sous-agent `tww-assets` (extraction et enregistrement seulement,
jamais de rédaction ni de commit). Toujours recouper son rapport : nombre de clés, existence des
fichiers, `git status`.

**6. Rédiger la fiche.** Format et conventions dans `references/format-fiche.md`.

**7. Valider et vérifier.** Voir « Vérification » ci-dessous.

**8. Demander le feu vert**, commiter avec un message `-F`, mettre à jour la mémoire.

---

## Parcours B — modifier une fiche existante

Ajouter un héros ou une unité venue d'un mod, corriger une erreur signalée, rééquilibrer.

**1. Chercher avant d'extraire.** L'unité est peut-être déjà sur le site sous une autre clé.

**2. Choisir les fiches.** Un héros — légendaire compris — recrutable par plusieurs seigneurs va
dans le build de **chacun de ceux pour qui sa présence est recommandée** : règle du user du
17/10/2026, qui remplace l'ancienne règle « une seule fois ». Chaque fiche décrit une campagne
distincte ; qu'il soit unique en partie ne compte pas d'une fiche à l'autre. Le critère reste le
build — un effet du seigneur qui le vise, ou un manque nommé — et non la simple possibilité de le
recruter. Si le mod désigne lui-même une faction — personnage de départ, faction prioritaire,
bâtiment de déblocage thématique — c'est d'abord là qu'il va, et la note le dit.

**Ne jamais trancher sur la seule table des factions autorisées.** Elle dit qui *a le droit* de le
recruter, pas à qui il appartient. Avant de choisir, **lire son arbre de compétences et ses objets**
dans la loc : ils nomment très souvent le seigneur, le navire ou la tribu, et fournissent la
justification à écrire. Procédure et cas d'école — Ogg Halfheart placé chez le mauvais capitaine —
en §6 de `references/analyse-pack.md`.

**Et vérifier qu'il n'est pas déjà seigneur sur le site** : `grep` son nom dans `data\*.json`. Un mod
peut proposer en héros un personnage qu'un autre a déjà donné comme seigneur légendaire, et un
seigneur légendaire n'est jamais placé en héros de build — sauf les deux exceptions arbitrées par le
user (voir les invariants). Un même nom ne prouve pas un même personnage, **ni deux personnages
différents** : une homonymie entre mods se prouve en montrant **deux packs** qui fournissent chacun
le sien (`scan_packs.ps1` sur son nom de fichier ou de portrait). L'affirmer sans cette preuve a déjà
produit une fausse exception, celle de Leanora.

**3. Libérer le slot sur une unité doublée**, jamais sur une pièce unique : passer un `qty: 2` à 1
plutôt que supprimer un régiment de renom. Le total doit rester à 20.

**Une exception, du user le 17/10/2026 : une unité alignée à un seul exemplaire peut céder sa
place à son propre Régiment de Renom**, si le seigneur peut le recruter. Le RoR reste alors sans
son unité de base, et c'est voulu. Avant de le faire, vérifier que les effets du seigneur visent
le RoR autant que l'unité de base : un RoR ajouté par un DLC n'est pas forcément dans les ensembles
d'unités des bonus plus anciens. Deathvermin, par exemple, n'est dans aucun des ensembles
« Stormvermin » que visent Queek et Tretch : le substituer à leurs Stormvermin leur coûterait leurs
bonus.

**4. Ajuster les textes qui deviennent faux.** Une modification de build invalide souvent le
paragraphe `magic` ou la note de fin. Les relire, pas seulement le tableau d'unités.

**5. Valider, vérifier, demander le feu vert.**

---

## Parcours C — revue d'une page après une mise à jour

Un DLC, un patch du jeu ou la mise à jour d'un mod source. Établi sur la passe post-DLC *Lords of
the End Times* des 17-18/10/2026 : une dizaine de lots, une race à la fois, toutes en ligne.

**La leçon qui fonde ce parcours : une mise à jour change les effets des seigneurs EXISTANTS, pas
seulement le contenu nouveau.** Kemmler a perdu l'invocation de Krell, Vlad et Isabella leur Blood
Kiss, Archaon son Ward Save, Tretch son régiment favori. Et un seigneur de **mod** peut changer sans
que son mod bouge : Rakaph réutilise un effet vanilla, le DLC a élargi l'ensemble d'unités de cet
effet, et Rakaph a hérité des Khemric Titans. Chercher d'abord où placer le contenu nouveau, c'est
rater l'essentiel.

**Un lot = une page (une race).** Jamais tout le site d'un coup : chaque lot se valide, se commite et
se pousse séparément.

**1. Demander les captures Lord Details de toute la page**, seigneurs de mods compris. Une liste
grisée en bas de l'onglet signale qu'il faut défiler : une ligne absente de la capture n'est pas
forcément disparue (cas Morghur, dont la résistance aux sorts était sous le pli). En cas de doute,
les tables tranchent (`character_skill_level_to_effects_junctions` pour les compétences innées).

**2. Comparer chaque capture à sa fiche, ligne à ligne.** Lister les écarts : valeur, unité visée,
ligne apparue, ligne disparue. Une fiche dont le texte est une traduction fidèle n'est pas un écart.

**3. Croiser le contenu nouveau avec les effets de la page.** Pour chaque unité, héros ou RoR
nouveau, un seul critère : un effet d'un seigneur de la page le vise-t-il ? Le vérifier dans
`unit_set_to_unit_junctions` × `effect_bonus_value_ids_unit_sets`, en remontant la chaîne bundle
de trait du seigneur (`effect_bundles_to_effects_junctions`, clés `*lord_trait*`) → effets →
ensembles d'unités → unités. Le script écrit pour ça vivait dans le scratchpad de la session et n'a
pas été conservé : la chaîne se réécrit en une vingtaine de lignes. Pas d'effet, pas de placement — même pour un héros légendaire recrutable partout. Le noter
dans le compte rendu, ne pas le forcer.

Deux conséquences fréquentes, à vérifier systématiquement :

- **un RoR ajouté n'est pas forcément dans les ensembles d'unités des bonus anciens** (Deathvermin
  hors des « Stormvermin » de Queek et Tretch) : le substituer à son unité de base peut coûter des
  bonus ;
- **un effet élargi crée un placement sans que rien ne soit « nouveau » dans la fiche** (Rakaph et le
  Titan, Rahtep et la Spirit Host).

**4. Soumettre un tableau par page** : effets à réaligner, puis builds (ajout, slot pris sur, carte
existante ou à extraire). Attendre le feu vert.

**5. Écrire, puis relire les textes qui citent un effet disparu.** C'est l'étape la plus coûteuse en
oublis : un effet retiré survit dans le rôle, la note de seigneur, la note de fin et les notes
d'unités. Chercher le nom de l'effet dans **toute** la fiche (Archaon : six notes citaient encore le
Ward Save). Ajouter à la `stats-caveat` « relevée après le <DLC> ».

**6. Contrôles, puis `CLAUDE.md`.** Les deux scripts bloquants sur les 32 factions, les contrôles
informatifs sur la page, une page vérifiée au navigateur. Mettre à jour cartes et couples dans le
tableau des chiffres de référence, avec une ligne d'explication. Après le commit et **avant** de
pousser, vérifier les fins de ligne (voir `references/format-fiche.md`).

**Pour les régiments favoris**, une source plus complète que les captures existe : le mod *Factional
Favoured Regiments*, qui les définit tous. Sa comparaison avec le site et ses pièges sont dans la
mémoire `regiments-favoris-ffr`.

**Un conflit de mods se signale, il ne se répare pas dans la fiche.** Deux mods qui revendiquent la
même faction (Rykarth / Kharkadon, 18/10/2026) : exposer les options au user (retirer la fiche,
éditer une copie du pack, attendre), lui laisser l'arbitrage, et le consigner en mémoire.

---

## Parcours D — réaligner les héros légendaires d'une page

Vérifier, pour une race, que chaque héros légendaire est dans le build des seigneurs qui l'obtiennent
réellement, et seulement là où sa présence se justifie. Établi sur la passe des 18-19/10/2026 :
Norsca (13 fiches corrigées), Peaux-Vertes (4 builds et une note), Bretonnie (9 fiches), une page
par lot, toutes en ligne.

**La leçon qui fonde ce parcours : un héros placé d'après son lore, sa clé ou la table des droits
est faux dès qu'un script l'attribue.** Norsca avait 11 héros de SCM Tribes of the North chez le
mauvais seigneur ; la Bretonnie, 5 héros placés à 6 endroits faux. Les deux erreurs les plus fréquentes : un héros réservé à un seigneur placé
chez un autre (Fastric, compagnon de Tancred, chez Hagen), et un héros ouvert à tous déclaré
exclusif (Snagla « exclusif à Da Cage Breakaz »).

**1. Inventorier les héros légendaires de la page et retrouver leur pack.** Les noms des fiches
contiennent « Légendaire ». Chercher chaque nom dans la loc des packs (`dump_loc_kv.ps1`), clés
`land_units_onscreen_name_*` et `agent_subtypes_onscreen_name_override_*` : elles donnent la clé
d'agent et le mod. Un nom trouvé dans **deux** packs désigne deux personnages (Hermit Knight of
Malmont : `hermit_knight_1` de Heroes of Legend, `str_hermit` de SCM) — la note et l'icône de la
fiche disent lequel le site aligne. Un héros du jeu de base se cherche dans `local_en.pack`.

**2. Lire comment il s'obtient.** `spawn_calls.ps1 -Pack <pack>` liste les appels d'attribution ;
`extract_lua.ps1` extrait les scripts quand la faction passe par une variable ou une table. Cinq
mécanismes rencontrés, qui ne se traitent pas pareil :

| Mécanisme | Exemples | Conséquence |
|---|---|---|
| donné à une faction au départ (`spawn_unique_agent`, `_at_character`, `spawn_agent_at_military_force`, `create_agent`, `spawn_agent_at_position`) | 3 Legendary Guys, SCM TotN, Iselda, Amalric (table `unique_agents` de Mixu), Lafayette, Caladris, Alicia | réservé à ce seigneur |
| chaîne de missions d'une faction | compagnons de Tancred, chaîne d'Einarr, Gurthok, Hildr | réservé, mais pas au premier tour |
| bâtiment ou région d'une faction | Hafskael's Yard, Monolith of Valmir Aesling | réservé, pas au premier tour |
| premier arrivé d'une culture | Heroes of Legend (`scehr_hol_characters_buildings_entries.lua`, `subcultureKeys`), LYH Malok (prendre Nuja), jeu de base (`wh3_main_legendary_characters.lua` dans `data_script.pack`, `allowed_cultures`) | ouvert à tous les seigneurs de la culture |
| aucun script en Immortal Empires | Haftagg (appel sous `cr_oldworld` seulement) | absent : le retirer |

Sept pièges de lecture, tous rencontrés :

- **le dossier de campagne compte** : le user joue **Immortal Empires Expanded** (dit le 20/10/2026).
  Lire `wh3_main_combi` (ses scripts tournent dans sa partie, toutes ses vérifications en jeu le
  montrent), **`cr_combi_expanded`** et `mod` ; seul `cr_oldworld` est à écarter. Ogg, Palldee et
  Guzunda (maison Fooger) n'existent que par un script `cr_combi_expanded` : les chercher dans le
  seul dossier `wh3_main_combi` les aurait déclarés introuvables ;
- **un appel dans un bloc `--[[ … ]]` est neutralisé** (Asta, dans `scm_norsca_lh.lua`, n'est
  donnée que par la chaîne d'Einarr ; tout `hbe_spawn_lords.lua` de High Elves Lords) ;
- **une faction écrite dans une table n'est pas forcément le destinataire** : chez SCM Legendary
  (`scm_lc_spawn_hero`), la `faction_key` n'est que le repli de l'IA, et la mission va au **premier
  joueur de la même culture**, sauf `faction_subset`. Lire la boucle qui consomme la table avant de
  conclure — j'ai cru Talarian réservé à Tyrion et le Hermit Knight SCM à Louen, et j'ai publié ce
  second contresens avant de le corriger ;
- **`spawn_calls.ps1` ne voit ni `cm:create_agent` (Caladris) ni `cm:spawn_agent_at_position` (Alicia, SCM Marienburg)** : sans résultat,
  relancer avec `-Match '<clé du héros>' -Context 4` ;
- **une clé de faction se traduit par la loc, pas par le nom affiché du jeu de base** : un mod
  renomme (`wh3_dlc26_grn_cluster_eye_tribe` = Da Bloodsail Fleet, la faction de Barbozza). Le bloc du
  script qui nomme le sous-type du seigneur tranche aussi ;
- **une mission peut n'exister qu'en table, sans aucun script** : les héros de mission de DEER24
  (Yi Yaohua, Ku Xi…) sont définis dans `cdir_events_mission_option_junctions_tables`, avec des options
  `CND_CULTURE` (la culture visée), `CND_UNIQUE` et `CND_FIRST_ROUND`. Un pack sans appel ne veut donc
  pas dire un héros sans attribution : chercher la clé de mission dans les `db\` du pack ;
- **ne jamais tronquer une recherche de nom** : un `head -3` sur la loc a caché le Xian Feng de SCM
  Legendary derrière celui de 3 Legendary Guys, et j'ai failli « corriger » une note juste. Deux packs
  pour un même nom, c'est la règle, pas l'exception.

**`faction_agent_permitted_subtypes` ne prouve pas qu'un héros unique s'obtient** : elle ouvre Orgrim
à 16 tribus, mais seule la chaîne d'Einarr le fait apparaître. L'inverse n'a pas été vérifié en jeu :
une faction absente de la table n'a sans doute pas le droit au héros (Gnarly et Snagla), mais le
dire comme une hypothèse.

**3. Faire vérifier en jeu un ou deux cas par mod.** « Tel héros est-il dans l'armée de tel seigneur
au départ ? » : la question se règle au premier tour. Cinq confirmations sur cinq (Soren, Oda, Iselda,
Amalric, Nicolete). Une lecture confirmée vaut pour les autres attributions du même mod — inutile de
tout faire vérifier.

Pour un héros obtenu **par mission**, demander le **titre de la mission** (lu dans la loc,
`missions_localised_title_<clé>`) et faire regarder le panneau des missions : la liste des héros de
l'écran de sélection ne montre pas les héros de mission, et ne prouve donc rien (cas Nicolete,
20/10/2026).

**4. Classer, puis soumettre un tableau par page.**

- **Réservé à un seigneur** : il va chez lui, et seulement chez lui. Le retirer partout ailleurs.
  **Même si aucun effet ne le vise** (décision du user, 23/10/2026) : l'argument « aucun effet » ne
  vaut que pour les héros ouverts. Imrallion, Natty Buboe et trois Aventuriers de Burlok avaient été
  écartés ainsi, à tort.
- **Ouvert à une culture** : règle du 17/10/2026, il entre dans **chaque** build où un effet du
  seigneur le vise — sa classe, son nom, son type, ou « héros intégrés à l'armée » (Bohemond) — ou
  comble un manque nommé. Mesurer ce que le héros renforce : ses compétences
  (`character_skill_level_to_effects_junctions`) → effets → ensembles d'unités
  (`effect_bonus_value_ids_unit_sets`, `…_unit_attribute_junctions`, `…_unit_ability_junctions`).
  Snagla renforce les araignées : il entre chez les trois seigneurs qui en alignent. Un champion sans
  synergie propre n'entre nulle part — le « recrutable suffit » a été écarté.
- **Chaîne à choix exclusifs** : choisir d'après les effets du seigneur, et dire l'alternative dans
  la section magie ou la note (Einarr : Usta et Kammler, ou Orgrim et Berus).

Pour les slots : remplacer **un pour un** quand le rôle est le même (les compagnons de Tancred à la
place de Paladins) ; garder un héros générique que les effets du seigneur visent (le Paladin de
Tancred) ; donner un lanceur générique à une fiche qui perdrait son seul lanceur (Theodoric) ;
sinon proposer, fiche par fiche, l'unité retirée ou ajoutée et l'effet qui la justifie. Attendre le
feu vert.

**Vérifier le plafond de héros avant de monter une quantité.** Demandé par le user le 20/10/2026 : un
héros générique passé à 2 ou 3 doit pouvoir être recruté en autant d'exemplaires par cette faction.
Le plafond se lit **par type d'agent** (`spy`, `wizard`, `champion`, `dignitary`…), et il est partagé
par tous les héros de ce type :

1. `effect_bonus_value_agent_junction_tables`, ligne `bonus_value_id = cap` : l'effet qui monte le
   plafond d'un type (`wh_main_effect_agent_cap_increase_spy_banshee` → `spy`) ;
2. `building_effects_junction_tables` : les bâtiments qui portent cet effet, et de combien
   (`wh2_main_vmp_wraiths_2` : +2) ; un mod a souvent les siens (`mixu_msl_agent_cap_damsel`) ;
3. les effets de la fiche du type « Capacité de héros : +N pour les … » s'y ajoutent.

Si une seule source raisonnable de campagne ne suffit pas à atteindre la quantité, ne pas la monter.
La vérification d'accès (le script, la table des droits) ne dit rien du plafond, et inversement.

**5. Écrire.** La note dit **comment** le héros s'obtient — au départ, par mission, par bâtiment, au
premier arrivé — jamais « à vérifier » (voir les invariants). Relire `role`, `magic`, `note` et les
notes d'unités : un héros déplacé y survit souvent (Hagen citait Fastric dans son rôle et sa note).
Corriger au passage les notes qui affirmaient une exclusivité d'après les tables.

Les cartes nouvelles passent par `tww-assets` (`ui\units\icons\<clé>.png`, déjà en 60×130). Une clé
qui ne sert plus à aucune fiche part dans `js/units/_hors-fiches.js`, avec sa raison en commentaire.

Éditer le JSON **ligne à ligne sur le texte brut** — une ligne par objet `{"icon": …}` —, jamais par
un `JSON.stringify` du fichier entier, qui reformate tout : le diff devient illisible et les fins de
ligne changent (voir `references/format-fiche.md`).

**6. Contrôles, `CLAUDE.md`, commit par page.** Comme au parcours C. En plus : ajouter le mod traité
au tableau « Les héros de mod : le script fait foi » de `CLAUDE.md`, et consigner l'avancement dans
la mémoire `passe-heros-retroactive`.

---

## Parcours E — audit mécanique des héros, tous mods confondus

Le parcours D lit une page à la main ; celui-ci balaie **tous les mods actifs d'un coup** et sort la
liste des écarts. À lancer après une mise à jour de mods, un DLC, l'ajout d'un mod, ou quand le user
demande « tous les héros sont-ils chez le bon seigneur ? ». Établi le 23/10/2026 : il a trouvé onze
héros LYH absents du site (que la passe D avait manqués), un seigneur placé en héros (Vardek Crom)
et six héros réservés écartés à tort.

**Ce qu'il vérifie, et ce qu'il ne vérifie pas.** Il est mécanique pour les héros **réservés** à une
faction (oui ou non : sont-ils chez son seigneur ?). Pour les héros **ouverts** à une culture, il ne
fait que les lister : leur place dépend des effets, c'est le parcours D. Le dire au user avant de
lancer, avec les critères d'acceptation : chaque attribution réservée a un statut, chaque héros nommé
du site a une source, `git status` ne bouge pas (tout se fait dans le scratchpad).

**1. Lancer la chaîne.** Les scripts vivent dans `~/.claude/tools/tww/audit-heros/`, numérotés dans
l'ordre ; `audit.ps1 -Out <scratchpad>\audit` les enchaîne tous. Il lit **`used_mods.txt`**, à la
racine du jeu : le lanceur y écrit la liste des packs **actifs** à chaque partie, ce qui évite les faux
écarts des mods abonnés mais désactivés.

**2. Lire les trois sorties, dans cet ordre.**

| Fichier | Ce qu'on y cherche |
|---|---|
| `rapproche_seigneurs.tsv` | colonne 4 **non vide** : un sous-type versé au vivier de **seigneurs** figure en héros sur le site |
| `rapproche_heros.tsv` | colonne 4 **vide** : un personnage créé par script est absent du site — lire son script |
| `rapproche_rares.tsv` | héros que la table des droits ouvre à une ou deux factions seulement (la plupart sont génériques) |

Le rapprochement est large exprès : il produit des faux absents (nom du jeu différent du nom de la
fiche : « Martial Fanatic » contre « Martial Zealot ») et des faux présents (la queue `crom` ressort
dans `necromancer`). Chaque ligne suspecte se tranche en lisant la fiche et le script.

**3. Lire le script de chaque suspect** (`appels.tsv` donne le fichier et la ligne) et le classer avec
le tableau des mécanismes du parcours D. Les tables se décodent à part : `table_scm.cjs` pour SCM
Legendary ; les départs de Heroes of Legend sont dans `hol_lib_data.lua` (champ `agents`, `is_unique`,
`human_only`) ; le jeu de base dans `wh3_main_legendary_characters.lua`. La table `hbe_characters` de
High Elves Lords (`hbe_mission_setup.lua`, champ `type`) n'est décodée par aucun script : ses
seigneurs (`type = "general"`) n'apparaissent pas dans `cles_seigneurs.txt`, la lire à la main.

Pièges propres à l'audit, tous rencontrés le 23/10/2026 :

- **`type = "general"` dans `scm_lc_spawn_hero` veut dire SEIGNEUR**, versé au vivier par
  `spawn_character_to_pool`. Crom, Vandred, Feytor, Haargroth, Kessel, Erkstein, Lietpold, Gnawdwell,
  Sneek… sont des seigneurs. Vardek Crom avait été placé en héros chez Archaon : retiré.
- **une classification ancienne de la mémoire peut être fausse** : « les ~35 personnages des scripts
  `lyh_<race>_<nom>.lua`, seigneurs de départ » — ce sont des **héros**
  (`spawn_agent_at_military_force`). Onze manquaient au site. Vérifier la fonction appelée, pas l'étiquette.
- **un héros posé dans l'armée du chef de faction au premier tick peut disparaître** si un autre mod
  remplace ce chef : LYH pose Walter van Hoik chez le chef de Marienburg, puis SCM Marienburg
  (`hkrul_mar.lua`) crée Jaan et tue l'ancien chef — le user ne voit pas Walter (retiré le 24/10/2026).
  Quand un mod de seigneur cible la même faction, chercher un `kill_character` du chef d'origine ;
- **un héros peut n'exister que pour l'IA** (Aber Walblatt, `if faction:is_human() == false`) ou
  n'arriver que sur condition (Kitharl à la prise de Tor Achare, Swyrd quand un chef norse perd une
  bataille) : ce ne sont pas des écarts.
- **deux packs, deux personnages** : Aessa Goldmane (héroïne LYH, seigneur High Elves Lords), Anurion
  (héros Heroes of Legend, seigneur High Elves Lords). Le nom seul ne prouve rien.
- **la copie de traduction LYH du user peut être périmée** : elle affichait « Principal Write » pour
  Rekthor Redaxe et n'avait pas Alathenar, jusqu'à sa réfection le 23/10/2026 (skill `patcher-un-mod`).
  Un nom vu en jeu qui diffère de la loc du workshop doit faire vérifier la date de la traduction ;
  faire confirmer le nom par le user dans tous les cas.

**4. Soumettre un tableau** : erreurs certaines d'abord, puis réservés absents, puis conformes et
ouverts. Le user tranche ; corriger ensuite comme au parcours D (étapes 5 et 6), effets lus avec
`effets_heros.ps1 -Pack <pack> -Match <clé>` pour écrire les notes.

---

## Croiser les mods entre eux

Les mods installés ne sont pas des silos. Une unité ou un héros ajouté par un mod est souvent
recrutable par des seigneurs qui n'en font pas partie — c'est le cas de tout ce qui est ouvert à
une **culture** entière plutôt qu'à une faction. Quand un mod vient d'être intégré, se demander
systématiquement **ce qu'il apporte aux fiches déjà en ligne de la même race**, et pas seulement à
ses propres seigneurs.

Les meilleurs candidats sont les héros ouverts à toute une culture, les unités recrutables par une
chaîne de bâtiments générique plutôt que par un site unique, et les Régiments de Renom versés au
pool commun.

**La vérification préalable est obligatoire et elle est plus stricte que le test habituel** :
il ne suffit pas que l'unité soit recrutable *en général*, il faut qu'elle le soit **par la faction
de ce seigneur-là**.

| Nature | Ce qu'il faut vérifier |
|---|---|
| Héros | la **clé de faction du seigneur** figure explicitement dans `faction_agent_permitted_subtypes` pour ce subtype |
| Unité | la culture du seigneur est autorisée dans `units_to_groupings_military_permissions_tables`, **et** aucune restriction dans `units_to_exclusive_faction_permissions_tables` ne l'en exclut, **et** la faction peut construire le bâtiment qui la débloque |
| Régiment de Renom | présent dans `db\mercenary_*` et accessible au pool de la faction |

Un bâtiment de **site unique** est le piège principal : l'unité existe pour la culture, mais seule
la faction qui tient la province concernée peut la recruter. Ne pas la placer chez un seigneur dont
rien n'indique qu'il prendra ce site.

En cas de doute, la source à demander est le **Unit & Spell Browser** de l'écran de campagne : c'est
la seule vue qui montre ce qu'un seigneur donné peut réellement aligner.

---

## Retirer un mod

Le miroir de la section précédente. Quand le user désactive un mod — parce qu'un DLC l'a rendu
redondant, qu'il a cassé à une mise à jour, ou qu'il n'en veut plus — se demander **quels autres
builds perdent une pièce**, et pas seulement la fiche du seigneur que le mod apportait.

**Pourquoi ce contrôle est indispensable : rien ne casse visiblement.** L'image de la carte reste
dans `assets/`, la clé reste déclarée dans `js/units/<faction>.js`, la fiche s'affiche normalement et
les validateurs passent. Le site continue simplement de recommander une unité qui n'existe plus
dans le jeu du visiteur. Aucun script ne le détecte.

**La procédure, deux minutes :**

1. Lister ce que le mod déclare, **par le schéma** et jamais par un dump à plat :
   `dump_db_rows.ps1 -Table main_units_tables` (unités et héros, avec leur `caste`) et
   `-Table agent_subtypes_tables` (les héros). Le schéma est trouvé tout seul.
2. Chercher chaque élément sur les fiches **par son nom complet**, puis sa clé dans
   `js/units/*.js`. **Jamais par sous-chaîne** — voir le piège ci-dessous.
3. **Séparer la fiche du seigneur apporté par le mod des autres.** La question n'est pas « le mod
   est-il utilisé ? », c'est « quel *autre* build perd une pièce ? ». La fiche de son propre seigneur
   sera de toute façon à refaire.
4. Pour chaque autre fiche touchée, noter la ligne : son build devra remplacer l'élément, et ses
   notes qui s'y réfèrent devront être relues.

**Un même nom ne prouve pas une même unité — trois filtres, dans cet ordre.** Chacun a été ajouté
après un faux positif réel :

1. **Le nom doit figurer dans la liste du mod** (étape 1). Chercher « Ulric » pour le prêtre du mod
   Boris Todbringer remontait *Swords of Ulric*, présent sur six fiches — un Régiment de Renom
   vanilla, absent des unités du mod.
2. **Le nom ne doit pas exister en vanilla.** Comparer aux `land_units_onscreen_name_*` de
   `local_en.pack` : un nom partagé avec le jeu de base désigne, sur le site, l'unité vanilla, qui
   survit à la désactivation. Attention après un DLC — il officialise des noms : en septembre 2026,
   *Walach Harkon* est devenu un nom vanilla.

   **Pour un seigneur ou un héros nommé, comparer le personnage, pas la chaîne.** Les mods titrent
   souvent leurs personnages — « Neferata, Queen of the Lahmians » — là où le jeu officiel écrit
   « Neferata ». La comparaison à l'identique l'a déclarée non officielle, et c'est le user qui a
   corrigé : elle l'était depuis le DLC, sous `wh3_dlc29_vmp_cha_neferata`. Avant de conclure, retirer
   le titre après la virgule, **et** chercher le nom propre dans les clés vanilla
   `wh3_dlc*_…_cha_<nom>`. Un seigneur devenu officiel ne disparaît pas : sa fiche est à refaire sur
   les données officielles, pas à supprimer.
3. **Le nom ne doit pas être porté aussi par un autre mod actif — et c'est le filtre qui ne se voit
   pas.** *Black Grail Knights* passait les deux premiers : il figurait bien dans Champions of
   Undeath et n'existait pas en vanilla. Mais **trois mods** déclarent chacun leur unité sous ce nom
   (`ovn_dk_cav_black_grail_knights_ror`, `mixu_msl_cav_black_grail_knights`,
   `black_grail_knight_0/1/2`), et les deux lignes du site venaient des deux autres.

   Pour trancher le troisième filtre, trois indices, du plus fort au plus faible : la **clé d'icône**
   de la ligne (`blackGrailKnightsDk` trahissait le mod du Dread King) ; le **mod d'origine du
   seigneur** de la fiche, souvent cité dans ses notes ; et la **note** elle-même (« régiment de
   renom, cap 1 » collait au `_ror` d'un seul des trois). En cas de doute persistant, le Unit & Spell
   Browser du user tranche.

   `scan_packs.ps1` ne sert **pas** ici : il cherche dans les **chemins** des packs, pas dans le
   contenu des tables. Chercher une clé d'unité ne renvoie rien même quand elle existe. Il faut
   dumper la loc des mods candidats avec `dump_loc_kv.ps1 -KeyLike 'land_units_onscreen_name*'`.

**Variantes sans nom.** Un pack « fusionné » embarque souvent des compatibilités pour d'autres mods :
des unités sans nom dans sa propre loc, dont la clé trahit l'origine
(`bm_wf_obsidian_lzd_cha_lord_adohi_tehga`). Leur nom vient de l'autre mod, qui les fournit aussi —
les ignorer, sauf si la fiche concernée cite le pack qu'on retire.

**Cas de référence — `boris_todbringerl.pack`, désactivé le 26/09/2026** au profit du Boris
officiel du DLC *Lords of the End Times*. Le mod déclare 9 unités : les 3 variantes de Boris, plus
un Priest of Ulric (héros), Emil Valgeir (caste seigneur) et un loup blanc du Middenland. Seuls les
deux premiers sont sur le site, et **uniquement sur la fiche de Boris**. Aucun autre build touché.

**Second cas — Champions of Undeath (workshop 3022054734), analysé le 27/09/2026.** Un pack
fusionné de 5,67 Go : 213 unités, dont 4 redéfinitions vanilla et 209 propres. Le croisement par nom
remontait 14 lignes du site ; après les trois filtres, **12 restaient, toutes sur la fiche de Walach
Harkon**, le seigneur que le mod apporte (16 slots sur 20). Les deux autres — *Black Grail Knights*
chez The Dread King et chez Lady of the Black Grail — étaient des homonymes venus d'autres mods.

**Troisième cas — Legions of Nagash (workshop 3293001739), analysé le 27/09/2026.** Le mod pose
**trois** chefs de faction : Nagash, Neferata, Kalledria. Les deux premiers sont devenus officiels
avec le DLC — Neferata n'a été reconnue telle qu'après correction par le user, voir le filtre 2.
Seule **Kalledria** disparaîtrait. Et **un autre build est réellement touché** : les *Glowing
Ghouls* d'Arkhan the Black, que seul ce pack fournit sur les 132 installés — vérifié par un balayage
complet de la loc, pas par déduction. *Bone Colossus* chez The Dread King était un homonyme
d'`ovn_dread_king`.

**Quand un seul personnage du mod manque au jeu**, désactiver n'est pas la seule issue : on peut
éditer une copie du pack qui ne garde que lui, comme la manip LYH → DEER24. C'est le plan retenu
pour Kalledria, noté dans la mémoire du DLC ; l'outillage est dans `~/.claude/tools/tww/`.

**Ce qui va revenir** : le DLC rend redondants les mods qui apportaient Nagash, Walach Harkon ou
Thanquol. Chacun devra passer par ce contrôle avant sa désactivation.

---

## Vérification

Trois contrôles, dans cet ordre. Aucun ne remplace les autres.

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File tools\validate_fiche.ps1 -Faction ogre-kingdoms
```

Recalcule les 20 slots et vérifie que chaque clé d'icône est enregistrée et que son PNG existe.
Il lit `js/units/<faction>.js` comme du texte : **il ne détecte pas une erreur de syntaxe
JavaScript.** Il ne voit que le module de la faction demandée, ce qui est exactement le bon
périmètre — c'est le seul que la page charge.

Son pendant côté site, qui balaie les 32 factions d'un coup :

```bash
powershell -File "C:\Users\Utilisateur\Projets\builds-tww3\tools\verifier-icones.ps1"
```

**Toujours sans `-Id`.** L'option existe pour un contrôle ponctuel, pas pour valider un lot : une
correction de quantité peut avoir dérapé sur d'autres seigneurs du même fichier (voir
`references/format-fiche.md`, « Corriger une quantité : jamais par `Replace()` global »). En fin de
lot, boucler sur tous les fichiers du site, pas seulement ceux qu'on croit avoir touchés :

```bash
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem data\*.json | ForEach-Object { & .\tools\validate_fiche.ps1 -Faction $_.BaseName }"
```

Ensuite le navigateur, via `preview_start` (nom `site-node`, port 8766 — configuration de
`.claude/launch.json` ; la configuration `site`, en Python, ne démarre plus depuis que Python a
quitté la machine, constaté le 17/10/2026) puis
`ogre_kingdoms.html?id=<lordId>` — noter que les pages HTML utilisent des **underscores**
(`ogre_kingdoms.html`) alors que les JSON utilisent des **tirets** (`ogre-kingdoms.json`).

```js
(async()=>{
  // les deux scripts que charge une page de faction, dans l'ordre
  const srcs = [...document.querySelectorAll('script[src^="js/"]')].map(s => s.getAttribute('src'));
  const jsErr = {};
  for (const s of srcs) {
    const t = await (await fetch(s)).text();
    try { new Function(t) } catch(e) { jsErr[s] = e.message }
  }
  [...document.images].forEach(i => i.loading = 'eager');
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r => setTimeout(r, 2200));
  const imgs = [...document.images];
  const cartes = [...document.querySelectorAll('.unit-card')];
  return JSON.stringify({
    jsErr,
    scripts: srcs,
    nbIcones: eval('Object.keys(unitImages).length'),
    cartesSansImage: cartes.filter(c => !c.querySelector('.unit-icon img'))
                           .map(c => c.querySelector('.unit-name').textContent),
    total: imgs.length,
    broken: imgs.filter(i => i.naturalWidth === 0).map(i => i.src)
  });
})()
```

Le contrôle `jsErr` n'est pas optionnel : une virgule manquante dans `unitImages` vide la page de
la faction, et ni le validateur ni `git diff` ne le montrent. Les images sont en `loading="lazy"` —
sans forcer `eager` et sans scroller, `naturalWidth === 0` donne des faux positifs.

`cartesSansImage` est le contrôle propre au découpage : il attrape la clé oubliée dans
`js/units/<faction>.js`, qui n'émet aucune erreur et laisse juste un cadre vide.

**Ne pas tester `window.unitImages` :** un `const` de premier niveau crée une liaison lexicale
globale, pas une propriété de `window`. La sonde renvoie `undefined` alors que tout va bien. Depuis
un iframe, passer par `frame.contentWindow.eval('typeof unitImages')`.

Enfin : supprimer les images extraites qui ne finissent dans aucune fiche, ainsi que leur clé.
Sinon le dépôt accumule des assets morts.

---

## Outils

`C:\Users\Utilisateur\.claude\tools\tww\` — scripts PowerShell, tous paramétrés. Les principaux :

| Script | Usage |
|---|---|
| `list_pack.ps1 -PackPath [-Match <regex>]` | lister les chemins internes d'un pack |
| `dump_db.ps1 -PackPath -Like <motif> -Out <fichier>` | extraire les tables `db\` (toujours `-Out` puis grep) |
| `dump_loc.ps1 -PackPath [-LocLike] [-Cjk] -Out` | extraire les `.loc` ; `-Cjk` pour les mods chinois/coréens |
| `extract_card.ps1 -PackPath -Src -Name [-DestSub portraits]` | extraire une carte en 60×130 |
| `validate_fiche.ps1 -Faction <nom> [-Id <id>]` | recalculer slots et icônes |
| `scan_packs.ps1 -Match <regex>` | balayer les ~133 packs workshop en une minute, pour les cas de double provenance |
| `spawn_calls.ps1 -Pack [-Match] [-Context]` | lister les appels qui attribuent un héros à une faction dans les `.lua` d'un pack (parcours D) |
| `extract_lua.ps1 -Pack -Out [-Like]` | extraire des scripts `.lua` pour les lire (parcours D) |
| `audit-heros\audit.ps1 -Out` | audit de tous les héros des mods actifs (parcours E) ; ses étapes sont dans le même dossier |
| `audit-heros\effets_heros.ps1 -Pack -Match` | effets d'armée des compétences d'un héros de mod, pour écrire sa note |
| `audit-heros\table_scm.cjs <lua>` | décoder la table `scm_lc_spawn_hero` de SCM Legendary (héros ou seigneur, réservé ou ouvert) |

Le sous-agent **`tww-assets`** (Sonnet) fait l'extraction en lot et l'enregistrement dans
`js/units/<faction>.js`. Lui donner les chemins internes exacts, les clés voulues **et la faction**,
puisque le module cible en dépend. Il lui est interdit de rédiger, de commiter, ou de substituer une
image.

Deux précautions à prendre en le lançant. **Ne jamais lui confier un remplacement d'image voulu par
le user** : il restaurera le fichier par `git checkout` en croyant corriger un écrasement accidentel,
y compris un fichier qu'il n'a pas touché lui-même. Et **vérifier la casse des clés** dans son
rapport : `-match` en PowerShell est insensible à la casse, donc un contrôle d'existence peut valider
`skinwolves` alors que la clé réelle est `skinWolves` — utiliser `-cmatch`. Le validateur du site,
lui, est sensible à la casse et rattrapera l'erreur, mais seulement après coup.

PowerShell 5.1 lit l'UTF-8 sans BOM comme de l'ANSI : pour écrire du JSON ou du JS, utiliser
`[System.IO.File]::ReadAllText` / `WriteAllText`.

**Et un `byte[]` renvoyé par une fonction n'en est plus un.** `return $tableau` déroule le tableau
dans le pipeline : l'appelant reçoit un `Object[]` d'octets boxés. Chaque appel ultérieur du type
`[BitConverter]::ToUInt16($data,$i)` reconvertit alors le tableau **entier** pour satisfaire la
signature — sur 700 Ko, environ 12 ms par appel. Un parseur de `.loc` est ainsi passé de 0,8 s à
plus de 20 minutes, sans erreur ni message, uniquement un CPU à 100 %. Le symptôme est
caractéristique : un script qui n'avance pas alors que les mêmes opérations, faites une seule fois
dans un diagnostic, sont instantanées. Le remède tient en un typage explicite à la réception :

```powershell
[byte[]]$data = Expand-PackEntry $raw $comp
```

Vaut pour toute lecture binaire — packs, `.loc`, images.

Le chemin d'image **déclaré dans `js/units/<faction>.js` fait foi** : ne jamais déduire
`assets/units/<clé>.png`. Des héros vivent dans `assets/portraits/`, et une clé peut pointer vers un
nom de fichier différent.

**Une concaténation dans un tableau PowerShell multi-ligne se casse en plusieurs éléments.** Dans
`@(...)`, l'expression `'texte ' + [char]0x2014 + ' suite'` ne produit pas une chaîne mais **trois**
éléments distincts : le retour à la ligne du tableau sépare l'expression. Écrite sur une seule ligne
hors tableau, la même concaténation fonctionne — d'où un test isolé qui rassure à tort. Après
le `-join` d'écriture, le caractère se retrouve **seul sur sa ligne**, ce qui a injecté un tiret nu
dans 36 fichiers JS générés et cassé leur syntaxe. Le symptôme côté navigateur est un laconique
`SyntaxError: Invalid or unexpected token`, sans numéro de ligne exploitable.

Le remède : passer par l'interpolation, qui ne peut pas être scindée.

```powershell
$td = [string][char]0x2014
$lignes = @(
  'ligne A',
  "ligne B $td suite B"   # une seule chaîne, comme voulu
)
```

Vaut pour tout caractère construit par `[char]` — tirets cadratins, guillemets typographiques,
apostrophe U+2019. Et le contrôle qui l'aurait attrapé tout de suite : après génération, chercher
les lignes dont le contenu se réduit au caractère seul.

---

## Références

- `references/analyse-pack.md` — quelles tables du pack répondent à quelle question, l'échelle de
  résolution des noms, les pièges de classification. À lire avant toute analyse de mod.
- `references/format-fiche.md` — structure JSON d'une fiche, sceaux, conventions de rédaction.
  À lire avant de rédiger ou de modifier une fiche.
