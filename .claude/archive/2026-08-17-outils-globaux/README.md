# Archive — outillage TWW3 et sous-agent (instantané du 17/08/2026)

**Ce dossier est une sauvegarde, pas la version en service.**

Ces fichiers vivent normalement dans `~/.claude/`, c'est-à-dire **hors de tout dépôt** : rien ne
les sauvegarde, et une réinstallation de Windows ou de Claude Code les perdrait. Ils portent
pourtant du travail coûteux à refaire — le décodage LZ4, le parseur binaire des `.loc`, le balayage
des ~133 packs du Workshop. D'où cette copie.

| Ici | En service |
|---|---|
| `tools/*.ps1` | `~/.claude/tools/tww/` |
| `agents/tww-assets.md` | `~/.claude/agents/` |

## À lire avant de s'en servir

**C'est la copie de service qui fait foi, pas celle-ci.** Si l'un de ces fichiers est corrigé dans
`~/.claude/`, cette archive devient périmée sans que rien ne le signale. Elle date du **17/08/2026**
et n'est pas synchronisée automatiquement.

Pour restaurer après une réinstallation, recopier vers `~/.claude/tools/tww/` et
`~/.claude/agents/`, puis vérifier deux dépendances qui ne sont pas dans le dépôt :

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

## Pourquoi ils ne sont pas dans `tools/` du dépôt

Sept d'entre eux sont **génériques** : ils travaillent sur les fichiers du jeu, pas sur ce site, et
serviraient tels quels pour n'importe quel projet TWW3. Les garder globaux évite d'en avoir deux
exemplaires qui divergeraient.

`extract_card.ps1` est le seul cas mixte : son mécanisme est générique, mais ses valeurs par défaut
visent ce dépôt (`assets\units`, format 60×130). Il reste global, son `-Root` se surchargeant au
besoin.

Le seul script réellement propre au site, `validate_fiche.ps1`, a lui été **déplacé** dans
`tools/` du dépôt le 16/08/2026 : la GitHub Action ne peut exécuter que ce qui est versionné.
