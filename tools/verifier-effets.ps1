# =============================================================================
# verifier-effets.ps1 — confronte le champ `effects` d'une fiche a son `build`.
#
# LE DEFAUT QU'IL CHERCHE. Une fiche peut nommer une unite dans ses effets et ne
# jamais l'aligner. L'information est alors presente et fausse en meme temps :
# le lecteur voit un bonus qui ne s'applique a rien.
#
# Ce n'est pas theorique. Malakai Makaisson annoncait « acces aux batiments du
# dirigeable Spirit of Grungni » depuis le PREMIER commit du site, le
# 09/07/2026, et le vaisseau n'a jamais figure dans son armee. Le meme jour ou
# on l'a trouve, Toruk Helhein s'est revele etre le seul seigneur nain sans
# aucun Regiment de Renom alors que tous ses bonus visaient l'infanterie.
#
# Les quatre autres validateurs lisent les slots, les icones, les images et les
# commentaires. AUCUN ne lit `effects`. C'est ce trou-la qu'on bouche.
#
# ── POURQUOI UN DICTIONNAIRE, ET PAS LE VOCABULAIRE DU SITE ────────────────
# Premiere version de ce script : chercher dans les effets les unites deja
# connues des fiches de la faction. Teste contre la fiche de Malakai d'origine,
# il a rendu ZERO piste — « The Spirit of Grungni » n'ayant jamais ete place
# nulle part, il n'etait dans aucun vocabulaire, donc introuvable. Un controle
# qui ne peut pas voir le defaut qui l'a motive ne sert a rien.
#
# D'ou tools\unites-connues.txt : les 1550 noms d'unites du jeu de base, tires
# de local_en.pack. Le script y cherche, et voit donc aussi ce que le site n'a
# jamais aligne.
#
# Ce fichier vit dans le depot et non sur la machine : la GitHub Action tourne
# sur un runner SANS installation du jeu. Le regenerer apres un DLC — la
# procedure est en tete du fichier.
#
# ── CE CONTROLE EST INFORMATIF, ET C'EST VOULU ─────────────────────────────
# Il produit des faux positifs par construction. Un effet peut nommer une unite
# pour la DECONSEILLER : Thyk Skolsson subit « +100% de cout pour les
# Longbeards », et c'est precisement pour cela qu'il n'en aligne pas. Un effet
# de faction peut aussi viser une unite que ce seigneur-la n'a aucune raison de
# prendre.
#
# Le faire bloquer un commit reviendrait a crier au loup, et on finirait par le
# contourner — ce qui est pire que de ne pas l'avoir. Il sort donc en 0 et se
# lit comme une liste de PISTES. `-Strict` sort en 1, pour un usage ponctuel.
#
# Usage :
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-effets.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-effets.ps1 -Faction dwarfs
# =============================================================================

param(
    [string]$Faction = "",
    [switch]$Strict
)

$ErrorActionPreference = 'Stop'
$racine = Split-Path $PSScriptRoot -Parent

function Texte($html) { return [regex]::Replace([string]$html, '<[^>]+>', ' ') }

# --- Le dictionnaire ---------------------------------------------------------
$dico = @(Get-Content "$racine\tools\unites-connues.txt" -Encoding UTF8 |
          Where-Object { $_ -and -not $_.StartsWith('#') })
if ($dico.Count -lt 100) { throw "tools\unites-connues.txt vide ou illisible" }

# Un nom court est trop ambigu pour etre cherche dans de la prose : « Mage »,
# « Ogres », « Spears » apparaissent partout. On garde ce qui discrimine.
$cherchables = @($dico | Where-Object { ($_ -replace ' \(.*$','').Trim().Length -ge 9 })

$fichiers = if ($Faction) { @(Get-Item "$racine\data\$Faction.json") }
            else { Get-ChildItem "$racine\data\*.json" | Sort-Object Name }

$pistes = 0; $fiches = 0

foreach ($f in $fichiers) {
    $lords = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8) | ConvertFrom-Json

    foreach ($l in $lords) {
        $fiches++
        $siennes = @(@($l.build.army) + @($l.build.heroes) | ForEach-Object { $_.name })
        if ($l.build.krellNote) { $siennes += $l.build.krellNote.name }
        $effets = Texte $l.effects
        $manquants = @()

        foreach ($nom in $cherchables) {
            $nu = ($nom -replace ' \(.*$', '').Trim()
            # Le nom du seigneur lui-meme n'est pas une unite a aligner.
            if ($l.name -like "*$nu*") { continue }
            # Deja dans le build, sous ce nom ou une variante ?
            $couvert = $false
            foreach ($s in $siennes) { if ($s -like "*$nu*") { $couvert = $true; break } }
            if ($couvert) { continue }

            # Le dictionnaire donne « The Spirit of Grungni », la fiche ecrit
            # « du dirigeable Spirit of Grungni ». On cherche donc aussi la
            # forme sans article — sans quoi le controle rate precisement le
            # defaut qui l'a motive, ce qu'un premier essai a demontre.
            $formes = @($nu)
            $sansArticle = ($nu -replace '^(The|Le|La|Les)\s+', '').Trim()
            if ($sansArticle -ne $nu -and $sansArticle.Length -ge 9) { $formes += $sansArticle }

            foreach ($forme in $formes) {
                if ($effets -match ('(?i)(^|[^\p{L}])' + [regex]::Escape($forme) + '([^\p{L}]|$)')) {
                    $manquants += $nu
                    break
                }
            }
        }

        if ($manquants.Count -gt 0) {
            $pistes++
            Write-Host ("  {0} — {1}" -f $l.name, $f.BaseName) -ForegroundColor Yellow
            foreach ($m in ($manquants | Sort-Object -Unique)) {
                # Un « Regiment favori » qui nomme un absent est le signal le
                # plus fort : ce bonus n'existe que pour recompenser sa presence.
                if ($effets -match ('(?i)R[ée]giment favori[^.]{0,160}' + [regex]::Escape($m))) {
                    Write-Host "      [REGIMENT FAVORI] $m" -ForegroundColor Red
                } else {
                    Write-Host "      $m"
                }
            }
        }
    }
}

Write-Host ""
Write-Host "$fiches fiche(s) examinee(s) — $pistes citant une unite absente de leur build."
Write-Host "INFORMATIF : une piste n'est pas une erreur. Un effet peut nommer une unite pour la deconseiller." -ForegroundColor DarkYellow

if ($Strict -and $pistes -gt 0) { exit 1 }
exit 0
