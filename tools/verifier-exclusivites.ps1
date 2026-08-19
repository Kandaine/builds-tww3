# =============================================================================
# verifier-exclusivites.ps1 — confronte les affirmations d'EXCLUSIVITÉ des notes
# à la composition réelle du build. Sixième contrôle, informatif, jamais bloquant.
#
# LE DÉFAUT QU'IL CHERCHE. Une note affirme « la seule cavalerie de la fiche »,
# « le seul tir de Skrolk », « la seule menace verticale » — alors que le build
# aligne autre chose qui tient le même rôle. Les slots restent justes, les noms
# corrects, les attributs exacts : aucun des cinq autres contrôles ne le voit.
#
# LA CAUSE EST DATABLE, et c'est ce qui rend le contrôle rentable. Dans la
# grande majorité des cas, la contrepartie qui dément la note est le Régiment de
# Renom de l'unité — ou l'unité de base que ce régiment accompagne. La phrase
# était vraie avant la passe RoR du 18/08/2026, qui a placé le régiment à côté
# de sa base sans que personne ne la relise.
#
# Deux fiches sont allées jusqu'à se contredire elles-mêmes : Gitilla Da Hunter
# portait deux notes se disant chacune « le seul élément à pied » alors qu'il en
# aligne trois, et Kroq-Gar fait du Bastiladon « la seule portée de la fiche »
# deux lignes avant de parler d'« une fiche sans artillerie ».
#
# ── POURQUOI CE CONTRÔLE-CI ET PAS UNE COMPARAISON PAR FAMILLE ──────────────
# Une première version classait chaque unité par famille devinée à son nom
# (mêlée / tir / cavalerie / artillerie / magie) et signalait toute exclusivité
# dès qu'une autre unité de la même famille était alignée. Elle sortait 315
# lignes pour 35 défauts — et sa grossièreté m'a fait écarter à tort trois vrais
# cas (Azhag, Barbozza, Grimm), rangés en « limite ».
#
# Ici la relation est CERTAINE : c'est la même unité, sous sa forme de base et
# sous sa forme de Renom. Aucune interprétation n'est requise. 53 signalements,
# 24 défauts — et les 29 autres sont des faux positifs identifiables en une
# lecture.
#
# ── LIMITES ASSUMÉES, À LIRE AVANT DE LUI FAIRE CONFIANCE ───────────────────
# CE N'EST PAS UN VALIDATEUR, c'est une liste à relire. Il sort toujours 0, et
# il ne tombera jamais à zéro signalement : environ trente exclusivités du site
# sont légitimes et le resteront. Elles portent sur autre chose qu'un rôle :
#   — sur un EFFET      « le seul effet de Zhatan visant une unité »
#   — sur un ROSTER     « la seule infanterie que ce clan puisse obtenir »
#   — sur le SITE       « la seule fiche du site à aligner les deux »
#   — sur l'ENNEMI      « les seules menaces réelles pour un Oracle immobile »
# Aucune n'est démentie par la contrepartie. Les laisser est le comportement
# correct.
#
# IL NE VOIT QUE LE COUPLE BASE / RÉGIMENT DE RENOM. Une exclusivité démentie
# par une unité SANS lien de parenté lui échappe — « la seule portée » chez un
# seigneur qui aligne aussi des arbalétriers d'une autre famille. Ces cas-là
# demandent la lecture.
#
# Usage :  powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-exclusivites.ps1
#          powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-exclusivites.ps1 -Faction skaven
# Sortie :  toujours 0. Le rapport se lit, il ne se réussit pas.
# =============================================================================

param([string]$Faction = '')

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

# Normalisation commune au dépôt : apostrophes et tirets typographiques ramenés
# à l'ASCII, sans quoi « Snagla's » du JSON ne rejoint jamais « Snagla's » d'une
# autre ligne saisie différemment.
function Normaliser([string]$s) {
    if (-not $s) { return '' }
    $s.Replace([char]0x2019, "'").Replace([char]0x2018, "'").Replace([char]0x2013, '-').Replace([char]0x2014, '-').Trim().ToLower()
}

$fichiers = if ($Faction) { @(Join-Path $Root "data\$Faction.json") }
            else { Get-ChildItem (Join-Path $Root 'data\*.json') | Sort-Object Name | ForEach-Object { $_.FullName } }

$total = 0

foreach ($fichier in $fichiers) {
    if (-not (Test-Path $fichier)) { Write-Output "ERREUR : $fichier introuvable"; continue }
    $page = [System.IO.Path]::GetFileNameWithoutExtension($fichier)
    # ConvertFrom-Json rend un tableau JSON comme UN SEUL objet de pipeline : on
    # passe par une variable avant d'itérer, sinon la boucle tourne une fois sur
    # le tableau entier.
    $fiches = [System.IO.File]::ReadAllText($fichier, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    $enTete = $false

    foreach ($seigneur in @($fiches)) {
        $noms = @()
        foreach ($u in @($seigneur.build.army)) { if ($u.name) { $noms += (Normaliser $u.name) } }

        foreach ($u in @($seigneur.build.army)) {
            if (-not $u.name -or -not $u.note) { continue }
            $texte = ($u.note -replace '<[^>]+>', '') -replace '\s+', ' '

            # --- la contrepartie : RoR -> base, ou base -> RoR -------------------
            $contrepartie = $null
            if ((Normaliser $u.name) -match '^(.+?)\s*\((.+)\)$') {
                $base = Normaliser $Matches[2]
                foreach ($n in $noms) {
                    if ($n -eq $base -or $n.StartsWith($base + ' (')) { $contrepartie = $Matches[2]; break }
                }
            }
            if (-not $contrepartie) {
                # PowerShell exige des parenthèses propres autour d'un appel de
                # fonction passé en argument d'une méthode : Escape(Normaliser $x)
                # est une erreur d'analyse, Escape((Normaliser $x)) est correct.
                $cible = [regex]::Escape((Normaliser $u.name))
                foreach ($v in @($seigneur.build.army)) {
                    if ($v.name -eq $u.name) { continue }
                    if ((Normaliser $v.name) -match ('^.+\(\s*' + $cible + '\s*\)$')) { $contrepartie = $v.name; break }
                }
            }
            if (-not $contrepartie) { continue }

            # --- une exclusivité dans la proposition qui la porte ----------------
            foreach ($frag in ([regex]::Split($texte, '[;.]|—'))) {
                if ($frag -notmatch "(?i)\b(la seule|le seul|l'unique|les seuls|les seules)\b") { continue }
                # Un démenti explicite (« il ne vole pas ») affirme l'inverse ; la
                # tournure « en remplacement de l'unique exemplaire » est propre
                # aux RoR et ne dit rien du build.
                if ($frag -match "(?i)\bne\s+\w+\s+pas\b|\bpas pour\b|en remplacement") { continue }
                # La note qui nomme déjà sa contrepartie est correcte.
                if ($frag -match '(?i)\bavec (l|le|la|les|son|ses)\b|aux c[ôo]t[ée]s de') { continue }

                if (-not $enTete) { Write-Output ''; Write-Output "== $page"; $enTete = $true }
                Write-Output ("  {0,-24} {1}" -f $seigneur.name, $u.name)
                Write-Output ("     « {0} »" -f $frag.Trim())
                Write-Output ("     contrepartie alignée : {0}" -f $contrepartie)
                $total++
                break
            }
        }
    }
}

Write-Output ''
Write-Output "$total exclusivité(s) démentie(s) par la contrepartie du même régiment."
Write-Output "INFORMATIF : une trentaine sont légitimes et le resteront — voir l'en-tête."
exit 0
