# =============================================================================
# verifier-icones.ps1 — contrôle de cohérence entre les fiches et les images.
#
# Depuis que le registre d'images unique (l'ancien js/data.js) a été découpé en
# un module par faction, une unité ajoutée dans data/<faction>.json doit voir sa
# clé d'icône ajoutée AUSSI dans js/units/<faction>.js. Si on l'oublie, la carte
# s'affiche sans image et sans le moindre message d'erreur : le navigateur ne
# signale rien, `unitImages[cle]` vaut simplement undefined.
#
# Ce script rend cet oubli visible. Il vérifie quatre choses :
#   1. toute icône référencée par une fiche existe dans le module de sa faction ;
#   2. le fichier image pointé existe réellement sur le disque ;
#   3. (informatif) les entrées d'un module que plus aucune fiche n'utilise ;
#   4. (informatif) les fichiers d'assets/units/ que plus rien ne référence.
#
# Le point 4 a été ajouté le 18/08/2026, après coup. Les trois premiers contrôles
# ne regardent que dans UN SENS — ils partent des clés déclarées et vérifient que
# l'image suit. Un fichier présent que personne ne déclare leur est donc invisible.
# C'est ainsi que theGraniteGuard.png et theBlazingBeardsOfBazherak.png ont survécu
# depuis le commit b015ae9 : deux extractions en double, sous un nom avec article,
# alors que les modules déclaraient la forme sans article. Empreintes SHA-256
# identiques aux fichiers réellement utilisés, et jamais signalées.
# Au total, ce contrôle a trouvé 10 fichiers orphelins pesant 181 Ko.
#
# Usage :  powershell -File tools\verifier-icones.ps1
# Sortie :  code 0 si tout va bien, 1 si au moins un problème bloquant.
# =============================================================================

$ErrorActionPreference = 'Stop'
$racine = Split-Path $PSScriptRoot -Parent

# Les factions sont déclarées une seule fois, dans FACTION_GROUPS (js/core.js).
# On les relit ici plutôt que d'en tenir une seconde liste, qui finirait par
# diverger : ajouter une faction au site ne demande donc rien de plus ici.
$core = [System.IO.File]::ReadAllText("$racine\js\core.js")
$bloc = [regex]::Match($core, '(?s)const FACTION_GROUPS = \[(.*?)\n\];').Groups[1].Value
$factions = [regex]::Matches($bloc, "id:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
if (-not $factions) { throw "FACTION_GROUPS introuvable dans js/core.js" }

$bloquants = 0
$orphelines = 0

# Tous les chemins d'image déclarés, toutes factions confondues. On les accumule
# pendant la boucle pour les confronter ensuite au contenu réel du dossier.
$declarees = @{}

foreach ($id in $factions) {
    $fiches = "$racine\data\$id.json"
    $module = "$racine\js\units\$id.js"
    if (-not (Test-Path $fiches)) { Write-Host "[MANQUE] $fiches" -ForegroundColor Red; $bloquants++; continue }
    if (-not (Test-Path $module)) { Write-Host "[MANQUE] $module" -ForegroundColor Red; $bloquants++; continue }

    # Clés déclarées par le module de la faction, avec le chemin de leur image.
    $images = @{}
    foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($module), "(?m)^\s+(\w+):\s*'([^']+)'")) {
        $images[$m.Groups[1].Value] = $m.Groups[2].Value
        # On note le nom de fichier seul : c'est la clé de comparaison du point 4.
        $declarees[[System.IO.Path]::GetFileName($m.Groups[2].Value)] = $true
    }

    # Clés réellement utilisées par les fiches de la faction. Les quatre sections
    # correspondent à celles que parcourt renderPage() dans js/app.js.
    $utilisees = @{}
    foreach ($seigneur in ([System.IO.File]::ReadAllText($fiches) | ConvertFrom-Json)) {
        foreach ($section in 'lord', 'heroes', 'army', 'krellNote') {
            foreach ($unite in @($seigneur.build.$section)) {
                if ($unite.icon) { $utilisees[$unite.icon] = $seigneur.name }
            }
        }
    }

    foreach ($cle in $utilisees.Keys) {
        if (-not $images.ContainsKey($cle)) {
            Write-Host "[SANS IMAGE] $id : la clé « $cle » (fiche $($utilisees[$cle])) manque dans js/units/$id.js" -ForegroundColor Red
            $bloquants++
        }
        elseif (-not (Test-Path (Join-Path $racine $images[$cle]))) {
            Write-Host "[FICHIER ABSENT] $id : $($images[$cle]) — référencé par « $cle »" -ForegroundColor Red
            $bloquants++
        }
    }

    foreach ($cle in $images.Keys) {
        if (-not $utilisees.ContainsKey($cle)) {
            Write-Host "[inutilisée] $id : « $cle » n'est plus référencée par aucune fiche" -ForegroundColor DarkYellow
            $orphelines++
        }
    }
}

# --- 4. Le contrôle inverse : des fichiers que plus rien ne déclare --------------
# Informatif, jamais bloquant : un fichier orphelin ne casse aucune page, il pèse.
# On ne regarde QUE assets/units/, le seul dossier dont les modules soient
# propriétaires. Les portraits, sceaux et bannières sont référencés depuis
# data/*.json ou le HTML, que ce script ne lit pas — les inclure produirait des
# faux positifs à chaque fiche.
#
# On relit ici TOUS les js/units/*.js, pas seulement les 32 modules de faction
# parcourus plus haut. Il existe en effet js/units/_hors-fiches.js, une réserve
# volontaire de 84 cartes extraites mais qu'aucune fiche n'aligne. Sans cette
# passe supplémentaire, ce contrôle les dénonçait toutes comme orphelines —
# 84 faux positifs qui l'auraient rendu inutilisable.
foreach ($autre in (Get-ChildItem "$racine\js\units\*.js")) {
    foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($autre.FullName), "assets/units/([^']+\.png)")) {
        $declarees[[System.IO.Path]::GetFileName($m.Groups[1].Value)] = $true
    }
}

$dossierUnites = "$racine\assets\units"
$fichiersOrphelins = 0
if (Test-Path $dossierUnites) {
    foreach ($fichier in (Get-ChildItem "$dossierUnites\*.png" | Sort-Object Name)) {
        if (-not $declarees.ContainsKey($fichier.Name)) {
            Write-Host "[fichier orphelin] assets/units/$($fichier.Name) — aucun module ne le déclare ($('{0:N0}' -f $fichier.Length) o)" -ForegroundColor DarkYellow
            $fichiersOrphelins++
        }
    }
}

Write-Host ""
Write-Host "$($factions.Count) factions contrôlées — $bloquants problème(s) bloquant(s), $orphelines entrée(s) inutilisée(s), $fichiersOrphelins fichier(s) orphelin(s)."
if ($bloquants -gt 0) { exit 1 }
Write-Host "Toutes les icônes des fiches ont une image, et tous les fichiers existent." -ForegroundColor Green
exit 0
