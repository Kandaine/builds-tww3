# Éditer un .pack TWW3

Retirer d'un mod un seigneur qu'il impose à une faction, une unité, une ligne de table.
Écrit le 21/09/2026 en refaisant la manip LYH → DEER24.

## Pourquoi éditer le pack source, et pas autre chose

Quatre pistes ont été testées **en jeu** avant celle-ci, toutes fausses :

1. **L'ordre de chargement** — sans effet, dans les deux sens.
2. **`mixer_change_lord_name()`** ne fait que réétiqueter : nom et modèle affichés, jamais les
   effets, le lore ni l'armée de départ. Aucune des dix fonctions du framework MIXER ne réattribue
   le seigneur d'une faction.
3. **Les lignes de `db` fusionnent entre packs** : supprimer une ligne dans un pack tiers ne retire
   rien, les lignes d'origine subsistent.
4. **L'écrasement par chemin identique ne marche pas** sur `script\frontend\mod\*.lua` : le chargeur
   les prend depuis chaque pack. Un script vide au même chemin ne neutralise rien.

Il faut donc **éditer une copie du pack source**, et y retirer scripts, lignes de `db`, définitions
de maillage et lignes de loc. C'est ce que ces bibliothèques font.

## Les trois bibliothèques

| Fichier | Ce qu'il donne |
|---|---|
| `pack_lib.ps1` | `Read-Pack` / `Write-Pack` — lire un PFH4/PFH5 et le réécrire |
| `table_lib.ps1` | `Get-DefsTable`, `Remove-LignesTable` — retirer des lignes d'une table `db\` |
| `loc_lib.ps1` | `Remove-EntreesLoc` — retirer des entrées d'un `.loc` |

## Deux partis pris, et leurs raisons

**On ne ré-encode jamais ce qu'on garde.** Les entrées non modifiées sont recopiées sous leur forme
stockée, octet pour octet, sans passer par décompression/recompression. Ré-encoder 820 entrées pour
en changer deux multiplierait les occasions de produire un pack qui se charge mais se comporte mal.
Même logique à l'intérieur d'une table : on repère les **bornes** des lignes, on supprime les octets
visés, on décrémente le compteur. Tout le reste sort identique.

**Les entrées modifiées sont écrites en clair, drapeau 0.** Il n'y a pas de compresseur ici. Le
format l'autorise : `!!!lyh_hero.pack` contient déjà 3 entrées à drapeau 0 sur 824, le jeu lit donc
les deux formes dans un même pack.

## La marche à suivre

**1. Valider l'écrivain par un aller-retour à vide.** Lire le pack, le réécrire sans rien changer,
exiger un fichier identique au bit près. Sans ce test, aucune vérification ultérieure ne vaut.

```powershell
$pk = Read-Pack -Chemin $source -ChargerOctets
Write-Pack -Modele $pk -Entrees $pk.Entrees -Sortie $test
# (Get-FileHash $source).Hash -eq (Get-FileHash $test).Hash  -> doit être vrai
```

**2. Essayer les excisions à blanc**, et vérifier les comptes avant/après.

**3. Construire**, en filtrant les entrées à retirer et en remplaçant celles à modifier.

**4. Contrôler le résultat entrée par entrée** : toutes les non modifiées doivent être identiques à
la source. C'est ce contrôle qui attrape une erreur d'index.

**5. Installer**, puis relire le pack installé avec `dump_db_rows.ps1` pour voir les lignes
restantes.

## Pièges rencontrés

- **`$T` et `$t` sont la même variable.** PowerShell ne distingue pas la casse. Écraser `$T` (chemin
  des outils) par un `$t` de travail fait échouer les appels suivants avec un message trompeur
  (« le module ### db n'a pas pu être chargé »).
- **`list_pack.ps1` écrit à l'écran**, il ne renvoie pas dans le pipeline. `$r = & list_pack.ps1 …`
  laisse `$r` vide alors que les chemins s'affichent. Ne pas compter dessus pour un test.
- **Ne jamais conclure depuis un dump à plat.** `dump_db.ps1` extrait les chaînes sans structure :
  une regex y a lu `mixer_ime_cth_celestial_loyalists2` là où la clé réelle est
  `…loyalists` — le « 2 » venait de la chaîne suivante. Passer par `dump_db_rows.ps1`, qui suit le
  schéma.
- **Une longueur de chaîne dans un `.loc` compte des caractères, pas des octets.** Oublier de la
  doubler désynchronise dès la première entrée.
- **Le schéma vit chez le gestionnaire de mods**, dont le chemin porte son numéro de version.
  `dump_db_rows.ps1` prend désormais le dossier le plus récent tout seul ; le figer le casse à
  chaque mise à jour de wh3mm.
- **`[byte[]]` obligatoire** à la réception de `Expand-PackEntry` : sinon le tableau revient en
  `Object[]` d'octets boxés et chaque `BitConverter` reconvertit l'ensemble.
- **Un `.ps1` sans BOM est lu en ANSI** par PowerShell 5.1 : un tiret cadratin y devient un
  guillemet parasite qui casse la première chaîne venue.

## Le cas LYH, pour mémoire

Retiré de `!!!lyh_hero.pack` pour rendre trois factions cathayennes à DEER24 : les 3
`script\frontend\mod\{yangseng,wenzhengsheng,jingyibo}_frontend.lua`, les 3
`script\campaign\mod\faction_*_lord.lua`, 7 `variantmeshes\variantmeshdefinitions\cth_*`, 3 lignes de
`frontend_faction_leaders_tables` (colonne `key`, préfixe `mixer_ime_cth_`) et 3 de
`faction_starting_general_effects_tables` (colonne `agent_subtype`). Et du pack de traduction, les 3
entrées `mixer_ime_cth_*` de `text\db\!lyh_hero_faction.loc`.

`!!!lyh_hero_wh_variantmodels.pack` reste **activé** : maillages bruts, inertes sans leurs
définitions, et les autres seigneurs LYH en ont besoin.

Les copies sont figées : **à refaire à chaque mise à jour du mod.**
