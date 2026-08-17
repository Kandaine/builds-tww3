# =============================================================================
# generer-coquilles.ps1 — reconstruit les 32 pages de faction depuis un gabarit
# unique (point 7.2 de l'audit).
#
# LE PROBLÈME QU'IL RÈGLE. Les 32 <faction>.html étaient identiques au nom de
# faction près, et maintenus à la main. Toute modification de la coquille — un
# script à ajouter, une feuille à réordonner — demandait 32 éditions, et il
# suffisait qu'une passe soit faite par un chemin différent des autres pour
# qu'elles divergent en silence.
#
# Ce n'est pas théorique. Le 17/08/2026, le commentaire expliquant l'ordre
# obligatoire des feuilles de style n'existait que sur 2 coquilles sur 32 :
# norsca.html et vampire_counts.html, les deux seules éditées à la main pendant
# la V2. Les 30 autres étaient passées par script. Personne ne l'aurait vu.
#
# CE N'EST PAS UNE ÉTAPE DE BUILD. Le script est lancé à la demande, sa sortie
# est commitée, et le visiteur reçoit toujours du HTML statique. Il est de la
# même famille que verifier-icones.ps1 : un outil de maintenance, pas une
# dépendance du site.
#
# SOURCES DE VÉRITÉ, dans cet ordre :
#   - js/core.js         → FACTION_GROUPS : l'id, le libellé et le nom de page
#                          de chaque faction. Relu ici plutôt que redéclaré,
#                          pour qu'ajouter une faction au site ne demande rien
#                          de plus dans cet outil.
#   - tools/gabarit-faction.html → la coquille, avec ses {{MARQUEURS}}.
#   - tools/notes-factions.json  → la note d'origine des factions moddées.
#
# Usage :
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\generer-coquilles.ps1
#       réécrit les 32 fichiers et liste ceux qui ont changé.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\generer-coquilles.ps1 -Verifier
#       n'écrit RIEN, sort en 1 si une coquille ne correspond plus au gabarit.
#       C'est cette forme qui tourne dans le hook et dans la CI : elle empêche
#       la dérive de revenir par une édition manuelle.
# =============================================================================

param(
    # Ne rien écrire, se contenter de signaler les écarts.
    [switch]$Verifier
)

$ErrorActionPreference = 'Stop'
# Calculé dans le corps et non dans param() : $PSScriptRoot y serait vide.
$racine = Split-Path $PSScriptRoot -Parent

# --- Les factions, relues depuis js/core.js ----------------------------------
$core = [System.IO.File]::ReadAllText("$racine\js\core.js")
$bloc = [regex]::Match($core, '(?s)const FACTION_GROUPS = \[(.*?)\n\];').Groups[1].Value
$factions = [regex]::Matches(
    $bloc,
    "id:\s*'([^']+)',\s*label:\s*'([^']+)',\s*file:\s*'([^']+)',\s*page:\s*'([^']+)'"
)
if ($factions.Count -eq 0) { throw "FACTION_GROUPS introuvable ou illisible dans js/core.js" }

# --- Le gabarit et les notes -------------------------------------------------
$gabarit = [System.IO.File]::ReadAllText("$racine\tools\gabarit-faction.html")
$notes = @{}
foreach ($p in (Get-Content "$racine\tools\notes-factions.json" -Raw -Encoding UTF8 |
                ConvertFrom-Json).PSObject.Properties) {
    # La clé de documentation n'est pas une faction.
    if ($p.Name -ne '_lisez-moi') { $notes[$p.Name] = $p.Value }
}

$modifiees = @()
$inchangees = 0

foreach ($m in $factions) {
    $id    = $m.Groups[1].Value
    $label = $m.Groups[2].Value
    $page  = $m.Groups[4].Value

    $html = $gabarit.Replace('{{ID}}', $id).Replace('{{LABEL}}', $label)

    # La note occupe une ligne entière dans le gabarit. Sans note, on retire la
    # ligne complète plutôt que de laisser une ligne vide au milieu du
    # commentaire d'en-tête.
    if ($notes.ContainsKey($id)) {
        $html = $html.Replace('{{NOTE}}', "`n  $($notes[$id])")
    } else {
        $html = $html -replace '(\r?\n)\{\{NOTE\}\}', ''
    }

    # CRLF : c'est ce que git restitue sur cette machine (core.autocrlf=true).
    # Écrire en LF ferait apparaître les 32 fichiers comme modifiés à chaque
    # exécution, pour rien.
    $html = ($html -replace '\r?\n', "`r`n")

    $chemin = "$racine\$page"
    $actuel = if (Test-Path $chemin) { [System.IO.File]::ReadAllText($chemin) } else { $null }

    if ($actuel -ceq $html) {
        $inchangees++
        continue
    }

    $modifiees += $page
    if (-not $Verifier) {
        # UTF-8 SANS BOM, comme les 34 fichiers HTML existants : un BOM
        # s'afficherait comme des caractères parasites en tête de page.
        [System.IO.File]::WriteAllText($chemin, $html, [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Host ""
if ($modifiees.Count -eq 0) {
    Write-Host "$inchangees coquille(s) conformes au gabarit, aucune modification." -ForegroundColor Green
    exit 0
}

if ($Verifier) {
    Write-Host "$($modifiees.Count) coquille(s) ne correspondent plus au gabarit :" -ForegroundColor Red
    $modifiees | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Regenerer avec : powershell -NoProfile -ExecutionPolicy Bypass -File tools\generer-coquilles.ps1" -ForegroundColor DarkYellow
    exit 1
}

Write-Host "$($modifiees.Count) coquille(s) reecrite(s), $inchangees inchangee(s) :" -ForegroundColor Yellow
$modifiees | ForEach-Object { Write-Host "  $_" }
exit 0
