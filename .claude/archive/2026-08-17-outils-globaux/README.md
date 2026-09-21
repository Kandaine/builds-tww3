# Archive — outillage TWW3 et sous-agent

**Instantané du 17/08/2026, rafraîchi le 21/09/2026.** Le nom du dossier garde la date d'origine
pour ne pas casser les chemins ; c'est cette ligne qui fait foi sur la fraîcheur.

**Ce dossier est une sauvegarde, pas la version en service.**

Ces fichiers vivent normalement dans `~/.claude/`, c'est-à-dire **hors de tout dépôt** : rien ne
les sauvegarde, et une réinstallation de Windows ou de Claude Code les perdrait. Ils portent
pourtant du travail coûteux à refaire — le décodage LZ4, le parseur binaire des `.loc`, le balayage
des ~133 packs du Workshop. D'où cette copie.

| Ici | En service |
|---|---|
| `tools/*.ps1` | `~/.claude/tools/tww/` |

**Le sous-agent `tww-assets` n'est plus ici.** Il a été déplacé le 21/09/2026 dans
`.claude/agents/tww-assets.md`, c'est-à-dire **dans le dépôt, en version de service** — il n'a donc
plus besoin d'être sauvegardé, il l'est par le versionnement lui-même.

Ce déplacement était interdit jusque-là : un test du 17/08/2026 avait conclu qu'un agent placé dans
`<projet>/.claude/agents/` n'apparaissait pas dans la liste des agents disponibles. **Ce n'est plus
vrai** — revérifié le 21/09/2026 en basculant le répertoire de travail sur un autre projet, dont
l'agent local a bien été annoncé. Les agents de projet sont découverts, à condition que la session
soit ouverte sur le dossier du projet et non sur son parent.

## À lire avant de s'en servir

**C'est la copie de service qui fait foi, pas celle-ci.** Si l'un de ces fichiers est corrigé dans
`~/.claude/`, cette archive devient périmée sans que rien ne le signale : elle n'est pas
synchronisée automatiquement.

**Et c'est arrivé.** Au contrôle du 21/09/2026, un mois après l'instantané, `dump_db_rows.ps1`
était périmé et **quatre fichiers manquaient entièrement** — tout l'outillage d'édition de pack,
c'est-à-dire précisément ce qui coûte le plus cher à refaire. Le contrôle tient en une commande,
à relancer après toute modification de `~/.claude/tools/tww/` :

```powershell
Get-ChildItem C:\Users\Utilisateur\.claude\tools\tww -File | ForEach-Object {
  $a=(Get-FileHash $_.FullName -Algorithm MD5).Hash
  $b="<archive>\tools\$($_.Name)"
  if(-not (Test-Path $b)){ "MANQUE $($_.Name)" }
  elseif((Get-FileHash $b -Algorithm MD5).Hash -ne $a){ "PERIME $($_.Name)" } }
```

Pour restaurer après une réinstallation, recopier vers `~/.claude/tools/tww/`, puis vérifier deux
dépendances qui ne sont pas dans le dépôt :

- **ImageMagick**, dont `extract_card.ps1` code le chemin en dur
  (`C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe`) ;
- **la `libzstd.dll` fournie par Git**, utilisée par `_unpack.ps1` pour la décompression zstd.

## Ce que fait chaque script

| Script | Rôle |
|---|---|
| `_unpack.ps1` | module partagé : décompresse une entrée de pack, reconnaît **zstd ou LZ4** au nombre magique en tête de flux (`04 22 4D 18` = LZ4) |
| `list_pack.ps1` | liste les chemins internes d'un `.pack` |
| `dump_db.ps1` | extrait les chaînes des tables `db\` |
| `dump_db_rows.ps1` | extrait les tables `db\` ligne par ligne |
| `dump_loc.ps1` | extrait le texte des `.loc` (noms d'unités, descriptions) |
| `dump_loc_kv.ps1` | idem, en paires clé/valeur, via le parseur binaire |
| `extract_card.ps1` | extrait une image d'un pack et l'écrit en 60×130 dans `assets/` |
| `scan_packs.ps1` | balaie tous les packs du Workshop pour retrouver une clé |

Quatre fichiers de plus depuis le 21/09/2026, pour **éditer** un pack et non plus seulement le lire.
Ils servent à retirer d'un mod un seigneur qu'il impose à une faction — il n'existe pas d'autre
moyen : ni l'ordre de chargement, ni un pack tiers, ni un script ne le font, les quatre pistes ont
été testées en jeu.

| Fichier | Rôle |
|---|---|
| `pack_lib.ps1` | `Read-Pack` / `Write-Pack` — lire un PFH4/PFH5 et le réécrire |
| `table_lib.ps1` | retirer des lignes d'une table `db\`, par excision d'octets |
| `loc_lib.ps1` | idem pour un `.loc` |
| `EDITER-UN-PACK.md` | la marche à suivre, les deux partis pris, les sept pièges |

**Le geste de sécurité à ne jamais sauter**, décrit dans ce mémo : valider l'écrivain par un
aller-retour à vide — relire un pack, le réécrire sans rien changer, exiger un fichier identique au
bit près — **avant** toute édition. Sans lui, aucune vérification ultérieure ne vaut.

## Pourquoi ils ne sont pas dans `tools/` du dépôt

Sept d'entre eux sont **génériques** : ils travaillent sur les fichiers du jeu, pas sur ce site, et
serviraient tels quels pour n'importe quel projet TWW3. Les garder globaux évite d'en avoir deux
exemplaires qui divergeraient.

`extract_card.ps1` est le seul cas mixte : son mécanisme est générique, mais ses valeurs par défaut
visent ce dépôt (`assets\units`, format 60×130). Il reste global, son `-Root` se surchargeant au
besoin.

Le seul script réellement propre au site, `validate_fiche.ps1`, a lui été **déplacé** dans
`tools/` du dépôt le 16/08/2026 : la GitHub Action ne peut exécuter que ce qui est versionné.
