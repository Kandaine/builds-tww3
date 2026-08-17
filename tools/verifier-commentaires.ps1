# =============================================================================
# verifier-commentaires.ps1 — contrôle que le JavaScript écrit à la main est
# documenté. Troisième filet, après verifier-icones.ps1 et validate_fiche.ps1.
#
# POURQUOI. Ce site n'a pas d'équipe : ce qui n'est pas écrit dans le fichier
# est perdu. Six mois plus tard, personne ne se souvient pourquoi une opacité
# vaut .8 et pas .45, ni pourquoi une variable CSS survit sous forme d'alias.
# La règle « le code livré est commenté » est un critère d'acceptation du
# projet (voir CLAUDE.md) ; ce script la rend vérifiable au lieu de la laisser
# reposer sur la discipline.
#
# CE QUI EST CONTRÔLÉ :
#   1. chaque js/*.js s'ouvre par un commentaire d'en-tête ;
#   2. chaque déclaration de fonction est précédée d'une ligne de commentaire ;
#   3. chaque déclaration de premier niveau (const / let / var) aussi — ce sont
#      les états partagés du module, ceux qui méritent le plus une explication ;
#   4. chaque js/units/<faction>.js s'ouvre par un commentaire d'en-tête.
#
# ── LIMITE ASSUMÉE, À LIRE AVANT DE LUI FAIRE CONFIANCE ─────────────────────
# Ce script vérifie qu'un commentaire EXISTE. Il ne peut pas vérifier qu'il est
# VRAI, et c'est pourtant là que se produisent les vraies pannes.
#
# Le 17/08/2026, en insérant deux fonctions dans js/core.js, le commentaire de
# `matchesSearch` s'est retrouvé au-dessus de `nomsDUnites` : il décrivait la
# mauvaise fonction ET l'ancien comportement. Ce script l'aurait déclaré
# conforme — la fonction avait bien un commentaire au-dessus d'elle.
#
# Il attrape donc l'oubli, jamais le mensonge. Après tout déplacement ou toute
# insertion de fonction, relire ce qui se trouve juste au-dessus de chacune
# reste un geste humain, que rien n'automatise ici.
#
# Le CSS n'est pas contrôlé non plus : exiger un commentaire sur chacune des
# ~250 règles produirait du bruit, pas de la documentation. La règle reste
# humaine pour lui.
#
# Usage :  powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-commentaires.ps1
# Sortie :  code 0 si tout est documenté, 1 s'il manque au moins un commentaire.
# =============================================================================

$ErrorActionPreference = 'Stop'
$racine = Split-Path $PSScriptRoot -Parent

# Une ligne « porte un commentaire » si elle commence par //, /* ou * (suite
# d'un bloc), ou se termine par */. On tolère l'indentation.
function Est-Commentaire($ligne) {
    return $ligne -match '^\s*(//|/\*|\*)'
}

# Déclarations recherchées, ancrées en colonne 0 : c'est ce qui les distingue
# des `const` internes à une fonction, qui n'ont pas à être commentés un par un.
$motifFonction = '^(async\s+)?function\s+([A-Za-z_$][\w$]*)'
$motifVariable = '^(const|let|var)\s+([A-Za-z_$][\w$]*)\s*='

$manquants = 0
$controlees = 0

# --- 1 à 3. Les fichiers JavaScript écrits à la main --------------------------
# js/units/*.js est exclu : ce sont des tables clé → chemin générées, traitées
# plus bas par le seul contrôle qui les concerne, celui de l'en-tête.
foreach ($fichier in Get-ChildItem "$racine\js\*.js" | Sort-Object Name) {
    $lignes = [System.IO.File]::ReadAllLines($fichier.FullName)
    $court = "js/$($fichier.Name)"

    # 1. En-tête du fichier.
    $premiere = $lignes | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1
    if (-not (Est-Commentaire $premiere)) {
        Write-Host "[SANS EN-TETE] $court ne commence pas par un commentaire" -ForegroundColor Red
        $manquants++
    }

    # 2 et 3. Déclarations.
    for ($i = 0; $i -lt $lignes.Count; $i++) {
        $ligne = $lignes[$i]

        if ($ligne -match $motifFonction)      { $nom = $Matches[2]; $genre = 'fonction' }
        elseif ($ligne -match $motifVariable)  { $nom = $Matches[2]; $genre = 'declaration' }
        else { continue }

        $controlees++

        # La ligne juste au-dessus doit être un commentaire. Une ligne vide ne
        # compte pas : un commentaire séparé de ce qu'il décrit finit par se
        # retrouver au-dessus d'autre chose, ce qui est précisément le défaut
        # qu'on cherche à ne plus reproduire.
        $dessus = if ($i -gt 0) { $lignes[$i - 1] } else { '' }
        if (-not (Est-Commentaire $dessus)) {
            Write-Host "[SANS COMMENTAIRE] ${court}:$($i + 1) — $genre « $nom »" -ForegroundColor Red
            $manquants++
        }
    }
}

# --- 4. Les 32 modules d'icônes : en-tête seulement ---------------------------
# Leur corps est une table de correspondance ; y exiger un commentaire par
# entrée n'aurait aucun sens. Mais leur en-tête dit à quelle faction ils
# appartiennent et quel piège les guette, ce qui doit rester présent.
foreach ($module in Get-ChildItem "$racine\js\units\*.js" | Sort-Object Name) {
    $premiere = [System.IO.File]::ReadAllLines($module.FullName) |
                Where-Object { $_.Trim() -ne '' } | Select-Object -First 1
    if (-not (Est-Commentaire $premiere)) {
        Write-Host "[SANS EN-TETE] js/units/$($module.Name)" -ForegroundColor Red
        $manquants++
    }
}

Write-Host ""
if ($manquants -gt 0) {
    Write-Host "$manquants commentaire(s) manquant(s) sur $controlees declaration(s) controlee(s)." -ForegroundColor Red
    Write-Host "Rappel : la presence d'un commentaire ne prouve pas sa justesse." -ForegroundColor DarkYellow
    exit 1
}

Write-Host "$controlees declaration(s) controlee(s) — toutes documentees." -ForegroundColor Green
Write-Host "Rappel : ce script verifie la presence, jamais la justesse." -ForegroundColor DarkYellow
exit 0
