---
name: patcher-un-mod
description: Diagnostiquer et patcher les mods TWW3 du user quand le jeu plante après un DLC ou un correctif — trouver quels mods ont des tables db\ au mauvais format, les convertir au format du jeu directement dans le pack du workshop, ou retirer d'un pack une entrée, des lignes de table ou des clés de traduction. À utiliser dès que le user dit que le jeu ne se lance plus, plante au démarrage, qu'un DLC ou une mise à jour a cassé ses mods, montre des erreurs RPFM, parle d'un patch correctif temporaire, ou demande de refaire la copie éditée de LYH (lyh_hero_no_cathay).
---

# Patcher un mod

Le jeu se met à jour, les mods ne suivent pas tout de suite, et le jeu plante au lancement. Ce
skill sert à trouver les mods fautifs et à leur poser un **patch temporaire, directement dans leur
pack du workshop**. Quand l'auteur publie sa mise à jour, Steam écrase le pack et le patch
disparaît de lui-même : c'est voulu, c'est ce que le user a demandé le 02/10/2026.

**Pas de sauvegarde.** Décision du user le 02/10/2026 : au pire, il se désabonne et se réabonne au
mod. Remplacer des packs du workshop est malgré tout une action que le système de permissions
bloque (« suppression irréversible ») : un lot de packs ne se pose qu'avec l'accord explicite du
user, donné dans la conversation, pour ce lot-là.

Deux parcours, qui se suivent le plus souvent : A dit quoi patcher, B patche.

Les scripts sont dans `scripts/` ; ils chargent les bibliothèques de `~/.claude/tools/tww/`
(`pack_lib`, `_unpack`, `table_lib`, `loc_lib`). Les pièges propres à ces bibliothèques sont dans
`~/.claude/tools/tww/EDITER-UN-PACK.md` — ne pas les recopier ici.

---

## Parcours A — diagnostiquer

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude\skills\patcher-un-mod\scripts\diagnostiquer-mods.ps1
```

Sans argument, il lit la liste des mods du **dernier lancement** dans
`%APPDATA%\The Creative Assembly\Warhammer3\logs\modified.log` et confronte chaque table `db\` de
chaque mod au `db.pack` du jeu. `-Mods a.pack,b.pack` restreint ; `-References` ajoute le contrôle
des références (lent, à réserver à un ou deux mods suspects).

**Ce qu'il faut lire dans la sortie :**

- `SUSPECT` — une table au moins n'a pas la version du jeu. **C'est la cause classique du
  plantage**, et ce que le parcours B corrige. Ce n'est pas une preuve : seul le lancement du jeu
  dit qu'un mod plantait.
- `(info) vide dans le jeu` — la table n'a aucune ligne dans `db.pack`. **Non bloquant** : le jeu
  en connaît beaucoup qu'il livre vides (`twad_key_deletes_tables`,
  `campaign_stances_factions_junctions_tables`…). Le premier passage les comptait comme suspectes
  et gonflait la liste de 39 à 57 mods.
- `INTROUVABLE` — le journal cite un pack que ni le workshop ni `data\` ne contient (mod désabonné
  depuis le dernier lancement).

**Le journal date du dernier lancement.** Si le user a coché ou décoché des mods depuis, la liste
est à jour des fichiers mais pas de sa sélection : lui demander, ou passer `-Mods`.

**Ne pas se fier aux diagnostics de RPFM tant que son cache n'est pas régénéré** (menu *Game
Selected*). Le 02/10/2026, sur Graybeard's Prospectors, 4 de ses 6 erreurs étaient fausses :
deux régions présentes dans `db.pack`, et deux noms dont l'identifiant est un **entier** dans
`names_tables` alors que RPFM le cherche comme texte. Seules les deux références d'animation
étaient réelles.

**Le `.stack.txt` d'un plantage ne désigne aucun mod** : il ne contient que des noms de modules
(`Warhammer3`, `ntdll`), sans symbole. Inutile de le relire pour trouver un coupable.

---

## Parcours B — patcher

```powershell
# convertir les tables au format du jeu, sans poser : produit <pack>.patch-tmp
scripts\patcher-pack.ps1 -Pack <chemin> -MettreANiveau
# idem, et remplacer le pack
scripts\patcher-pack.ps1 -Pack <chemin> -MettreANiveau -Poser
# retirer une entree, des lignes, des cles de loc (combinables entre elles et avec -MettreANiveau)
scripts\patcher-pack.ps1 -Pack <chemin> -RetirerEntrees 'db\x_tables\y' -Poser
scripts\patcher-pack.ps1 -Pack <chemin> -RetirerLignes @(@{Entree='db\t_tables\f';Colonne='key';Valeurs=@('a')})
scripts\patcher-pack.ps1 -Pack <chemin> -RetirerLoc @(@{Entree='text\db\f.loc';Motifs=@('mixer_ime_cth_')})
```

**Ce qu'il fait, dans l'ordre — chaque étape arrête tout si elle échoue :**

1. **Aller-retour à vide.** La tête du pack (en-tête, dépendances, index) est reconstruite et doit
   être identique au bit près ; les entrées doivent être contiguës et remplir le fichier. C'est
   l'équivalent, sans recopier 5 Go, du test exigé par `EDITER-UN-PACK.md` : l'écrivain recopie
   les données par position, seule la tête est recalculée.
2. **Pour chaque table à convertir, vérifier le schéma contre le jeu** : la définition de la
   version cible doit décoder la table du `db.pack` exactement. Un schéma faux ou en retard est
   refusé là, avant d'avoir produit une table que le jeu lirait de travers.
3. **Convertir.** Les champs sont appariés par **nom**, comme le fait RPFM ; les champs conservés
   sont recopiés octet pour octet, les champs ajoutés reçoivent la **valeur par défaut du schéma**,
   les champs disparus sont abandonnés. Un champ qui change de type fait échouer la table plutôt
   que d'être réinterprété.
4. **Relire** chaque table convertie avec la nouvelle définition.
5. **Écrire en flux**, puis contrôler **chaque entrée** du pack produit : les inchangées identiques
   au source, les remplacées relues. C'est ce contrôle qui attrape une erreur d'index.
6. **Poser** (`-Poser`) : remplacer le pack. Sans `-Poser`, rien n'est touché.

**Le schéma est celui de RPFM**, `%APPDATA%\FrodoWazEre\rpfm\config\schemas\schema_wh3.ron`, pas
celui du gestionnaire de mods. Le 02/10/2026, celui du gestionnaire (wh3mm 2.24.0, du 25/09)
ignorait `initiative_sets_tables` v9, introduite par le correctif du 01/10 ; il en déduisait même
une table vidée de tous ses champs. RPFM, mis à jour le jour même, la connaissait. **Si le
diagnostic voit des versions que le patch refuse** (« le schéma RPFM ne décode pas la table du
jeu »), demander au user d'ouvrir RPFM pour qu'il mette son schéma à jour, puis relancer.

**Ce qu'il laisse volontairement :** une table dont la version d'origine est inconnue du schéma.
Le cas type est `@z_double_skill_points` : 5 tables `v0` d'un format antérieur que le schéma ne
décrit pas. Elles étaient déjà invalides avant le DLC et le jeu les tolérait. Le script les
signale `NON CONVERTIE` et pose le reste.

**Les défauts appliqués sont des valeurs du schéma, pas des valeurs inventées** — c'est ce que
fait RPFM. Mais elles changent le comportement du mod. Le cas le plus répandu au 02/10/2026 :
`culture = *` sur 71 tables `land_units_to_unit_abilites_junctions`. Le dire au user.

### Pour un lot

Boucler sur les packs `SUSPECT` du diagnostic, avec `-MettreANiveau -Poser`, en tâche de fond :
22 Go et 38 packs le 02/10/2026. Exclure du lot les **copies éditées** posées dans `data\` (LYH) :
elles se refont depuis la source à jour, voir ci-dessous. Puis relancer le parcours A : il ne doit
plus rester que les tables non convertibles signalées pendant le lot.

---

## Cas particulier — la copie éditée de LYH

`data\lyh_hero_no_cathay.pack` est une copie de `!!!lyh_hero.pack` dont on retire trois seigneurs
cathayens pour les rendre à DEER24 (historique et raisons dans la mémoire `lyh-deer-cathay-swap`).
Elle ne se **patche** pas : elle se **refait** depuis la source à jour, avec `-Sortie` vers un
fichier temporaire puis déplacement dans `data\`. Refaite ainsi le 02/10/2026, depuis LYH du 29/09.

Le périmètre, identique depuis août 2026 :

```powershell
-RetirerEntrees  les 3 script\frontend\mod\{yangseng,wenzhengsheng,jingyibo}_frontend.lua,
                 les 3 script\campaign\mod\faction_{yangseng,wenzhengsheng,jingyibo}_lord.lua,
                 les 7 variantmeshes\variantmeshdefinitions\cth_{jingyibo,wenzhengsheng_buxing,
                   wenzhengsheng_linglongma,wenzhengsheng_qixing,yangseng,yangseng_haotianshi,yangseng_shishi}.variantmeshdefinition
-RetirerLignes   db\frontend_faction_leaders_tables\lyh_faction_data__, colonne key :
                   mixer_ime_cth_burning_wind_nomads, mixer_ime_cth_celestial_loyalists, mixer_ime_cth_the_jade_custodians
                 db\faction_starting_general_effects_tables\lyh_faction_data__, colonne agent_subtype :
                   yangseng, wenzhengsheng, jingyibo
```

**Avant de refaire, comparer la nouvelle source à l'ancienne copie** : les entrées nouvelles doivent
être exactement les 13 qu'on retire, et les scripts qui nomment les trois factions
(`!!!lyh_hero.lua`, `lyh_cth_qinyu.lua`, `faction_meirei/unguth/yagebu_lord.lua`) doivent être
inchangés. Ils l'étaient le 02/10 ; s'ils changent, le périmètre est à revoir avant d'éditer.

La traduction `data\Deli_lyh_no_cathay.pack` ne se refait que si
`!!!!!Deli_lyh_hero_EnglishTranslation.pack` a changé : `-RetirerLoc` sur
`text\db\!lyh_hero_faction.loc`, motif `mixer_ime_cth_`.

---

## Pièges rencontrés

- **Les chemins internes d'un pack sont en UTF-8, pas en ASCII.** `ab_mixu_legendary_lords.pack`
  contient un tiret long (`e2 80 93`) ; lu en ASCII il devenait `???`, et le pack réécrit aurait
  référencé un fichier inexistant. L'aller-retour à vide l'a arrêté avant toute écriture.
  `pack_lib` lit et écrit en UTF-8 depuis le 02/10/2026.
- **`Read-Pack` renvoyait un `.Chemin` faux** jusqu'au 02/10/2026 — celui de sa dernière entrée,
  parce que la variable de boucle `$chemin` écrasait le paramètre `$Chemin` (PowerShell ignore la
  casse). Corrigé dans `pack_lib`. Même famille que le piège `$T`/`$t` d'`EDITER-UN-PACK.md` :
  dans ces scripts, ne jamais nommer une variable comme un paramètre à la casse près.
- **Une méthode C# nommée `End` est inappelable** sous PowerShell 5.1 (`end` est un mot-clé) : le
  liaisonneur lève « le type de résultat System.Int32 … n'est pas compatible ». Elle s'appelle
  `FinLignes` dans `patch_lib.ps1`.
- **Un tableau vide renvoyé par une fonction devient `$null`** : PowerShell le déroule. Renvoyer
  `,$tableau`. C'est ce qui avait fait croire à trois fichiers illisibles lors d'un balayage : ce
  n'étaient que des entrées de taille nulle.
- **`Write-Pack` (pack_lib) charge tout en mémoire.** Inutilisable sur les gros mods — Champions of
  Undeath pesait 5,4 Go. `Write-PackFlux` recopie par blocs.
- **Écraser par un pack tiers ne marche pas** pour retirer un contenu : les lignes `db` fusionnent
  entre packs, et les scripts frontend se chargent depuis chaque pack. C'est pour cela qu'on édite
  le pack source (détail dans `EDITER-UN-PACK.md`).
