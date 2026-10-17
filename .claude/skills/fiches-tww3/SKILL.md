---
name: fiches-tww3
description: Workflow complet pour le site builds-tww3 — créer une fiche de seigneur légendaire à partir d'un mod Steam Workshop de Total War WARHAMMER III, ou modifier une fiche existante (ajouter un héros ou une unité, corriger une erreur, rééquilibrer les 20 slots). À utiliser dès que le user parle d'un mod TWW3, envoie un chemin workshop\content\1142710\, colle des captures de l'écran Lord Details, demande d'ajouter un seigneur ou un héros au site, signale qu'une unité ou un effet est faux sur une fiche, ou évoque data/*.json, js/units/*.js, js/core.js, un régiment de renom, un plafond d'unité ou une carte d'unité à extraire — même s'il ne nomme pas explicitement le site.
---

# Fiches builds-tww3

Site personnel non commercial : catalogue en français de builds à 20 slots pour les seigneurs
légendaires de TWW3 en Immortal Empires. Dépôt `C:\Users\Utilisateur\Projets\builds-tww3`
(GitHub `Kandaine/builds-tww3`, **public**). HTML/CSS/JS statique, sans build.

**Publié sur GitHub Pages** à https://kandaine.github.io/builds-tww3/, redéployé à chaque push
sur `main`. Une fiche fausse ou une carte sans image est donc visible par des visiteurs, pas
seulement par le user — c'est ce qui justifie la sévérité des invariants ci-dessous.

Deux parcours. Lire d'abord les invariants, ils valent pour les deux.

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
héroïne chez Cylostra Direfin. C'est **le même personnage** — un seul pack la fournit,
`!!!3_legendary_guys.pack` ; une ancienne version de ce skill affirmait à tort une homonymie entre
deux mods. Ne plus la signaler. *Gitilla Da Hunter* relève du même conflit et a été tranché dans
l'autre sens : il reste seigneur seul.

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

**2. Choisir la fiche.** Quand un héros est disponible pour beaucoup de factions, le placer **une
seule fois**, là où le lore et le build le justifient le mieux. Si le mod désigne lui-même une
faction — personnage de départ, faction prioritaire, bâtiment de déblocage thématique — suivre cette
indication plutôt qu'un choix arbitraire, et l'écrire dans la note.

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

**4. Ajuster les textes qui deviennent faux.** Une modification de build invalide souvent le
paragraphe `magic` ou la note de fin. Les relire, pas seulement le tableau d'unités.

**5. Valider, vérifier, demander le feu vert.**

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

`C:\Users\Utilisateur\.claude\tools\tww\` — six scripts PowerShell, tous paramétrés :

| Script | Usage |
|---|---|
| `list_pack.ps1 -PackPath [-Match <regex>]` | lister les chemins internes d'un pack |
| `dump_db.ps1 -PackPath -Like <motif> -Out <fichier>` | extraire les tables `db\` (toujours `-Out` puis grep) |
| `dump_loc.ps1 -PackPath [-LocLike] [-Cjk] -Out` | extraire les `.loc` ; `-Cjk` pour les mods chinois/coréens |
| `extract_card.ps1 -PackPath -Src -Name [-DestSub portraits]` | extraire une carte en 60×130 |
| `validate_fiche.ps1 -Faction <nom> [-Id <id>]` | recalculer slots et icônes |
| `scan_packs.ps1 -Match <regex>` | balayer les ~133 packs workshop en une minute, pour les cas de double provenance |

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
