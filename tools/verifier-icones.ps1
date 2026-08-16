# =============================================================================
# verifier-icones.ps1 — contrôle de cohérence entre les fiches et les images.
#
# Depuis que le registre d'images unique (l'ancien js/data.js) a été découpé en
# un module par faction, une unité ajoutée dans data/<faction>.json doit voir sa
# clé d'icône ajoutée AUSSI dans js/units/<faction>.js. Si on l'oublie, la carte
# s'affiche sans image et sans le moindre message d'erreur : le navigateur ne
# signale rien, `unitImages[cle]` vaut simplement undefined.
#
# Ce script rend cet oubli visible. Il vérifie trois choses :
#   1. toute icône référencée par une fiche existe dans le module de sa faction ;
#   2. le fichier image pointé existe réellement sur le disque ;
#   3. (informatif) les entrées d'un module que plus aucune fiche n'utilise.
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

foreach ($id in $factions) {
    $fiches = "$racine\data\$id.json"
    $module = "$racine\js\units\$id.js"
    if (-not (Test-Path $fiches)) { Write-Host "[MANQUE] $fiches" -ForegroundColor Red; $bloquants++; continue }
    if (-not (Test-Path $module)) { Write-Host "[MANQUE] $module" -ForegroundColor Red; $bloquants++; continue }

    # Clés déclarées par le module de la faction, avec le chemin de leur image.
    $images = @{}
    foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($module), "(?m)^\s+(\w+):\s*'([^']+)'")) {
        $images[$m.Groups[1].Value] = $m.Groups[2].Value
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

Write-Host ""
Write-Host "$($factions.Count) factions contrôlées — $bloquants problème(s) bloquant(s), $orphelines entrée(s) inutilisée(s)."
if ($bloquants -gt 0) { exit 1 }
Write-Host "Toutes les icônes des fiches ont une image, et tous les fichiers existent." -ForegroundColor Green
exit 0
