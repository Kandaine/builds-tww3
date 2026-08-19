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
        # Chaque effet est un <div> : on garde le decoupage pour pouvoir tester
        # « ce regiment est-il nomme DANS la ligne du regiment favori ».
        $lignesEffets = @([regex]::Split([string]$l.effects, '</div>|<br\s*/?>') |
                          ForEach-Object { (Texte $_).Trim() } |
                          Where-Object { $_ })
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
                #
                # Le test porte sur LA LIGNE, pas sur le texte aplati. Un premier
                # jet balayait 160 caracteres apres « Regiment favori » sans
                # borne de ligne : comme les effets sont des <div> sans point
                # final, il ramassait les unites de la ligne SUIVANTE. Ungrim en
                # est ressorti avec deux faux signaux forts, alors que son vrai
                # regiment favori est bien dans son build.
                $fort = $false
                foreach ($ligne in $lignesEffets) {
                    if ($ligne -match '(?i)R[ée]giment favori' -and
                        $ligne -match ('(?i)(^|[^\p{L}])' + [regex]::Escape($m) + '([^\p{L}]|$)')) {
                        $fort = $true; break
                    }
                }
                if ($fort) { Write-Host "      [REGIMENT FAVORI] $m" -ForegroundColor Red }
                else       { Write-Host "      $m" }
            }
        }

        # --- Second controle : la QUANTITE du regiment favori ----------------
        # Ce qui precede signale un regiment favori ABSENT du build. Il ne dit
        # rien du cas ou il est present mais aligne UNE SEULE FOIS, alors que
        # « +1 capacite » en autorise deux. Le bonus de faction est alors a
        # moitie perdu, et rien ne le signale : les 20 slots sont justes, le
        # regiment est bien la.
        #
        # Ce defaut a existe : 6393537 l'a corrige a la main pour Valkia et
        # Teclis, apres lecture. Le controle ci-dessous verifie qu'il n'en reste
        # pas d'autre.
        #
        # ON NE TESTE QUE « +1 capacite ». Certains regiments favoris accordent
        # un bonus de statistiques et non une place supplementaire — Wolfram
        # Hertwig recoit « +20% de munitions et de degats de tir pour Hammer of
        # the Witches ». Y attendre deux exemplaires n'aurait aucun sens.
        #
        # LA BORNE EST LA LIGNE D'EFFET, pas un nombre de caracteres. Un premier
        # jet balayait 260 caracteres apres « Regiment favori » et debordait sur
        # le bloc « Effets du seigneur » suivant, d'ou trois faux positifs
        # skavens : il y ramassait des noms d'unites sans aucun rapport.
        # DEUX FORMULATIONS COEXISTENT dans les fiches, et n'exiger que la
        # premiere rendait le controle aveugle a la moitie des cas :
        #     « Regiment favori : +1 capacite pour X »
        #     « Regiment favori X : +1 capacite »
        # On ne cherche donc pas ce qui suit « pour » : on cherche le nom du
        # regiment N'IMPORTE OU dans la ligne de l'effet. La borne de ligne
        # suffit a eviter les debordements.
        foreach ($ligne in $lignesEffets) {
            if ($ligne -notmatch '(?i)R[ée]giments? favoris?') { continue }
            if ($ligne -notmatch '(?i)\+\s*1\s+capacit')       { continue }

            # ON NE GARDE QUE LE NOM LE PLUS LONG. La ligne d'effet nomme le
            # regiment sous sa forme complete, « Defenders of the Fleur-de-lis
            # (Knights Errant) » — qui CONTIENT le nom de l'unite de base.
            # Tester chaque unite du build indépendamment signalait donc les
            # bases (Knights Errant, Foot Squires, River Trolls...) alignees a
            # x1, alors que le regiment favori, lui, est bien a x2. Onze faux
            # positifs de cette seule cause.
            $candidats = @()
            foreach ($u in @($l.build.army)) {
                if (-not $u.name) { continue }
                if ($ligne -match ('(?i)(^|[^\p{L}])' + [regex]::Escape($u.name) + '([^\p{L}]|$)')) { $candidats += $u }
            }
            foreach ($u in $candidats) {
                $englobe = $false
                foreach ($autre in $candidats) {
                    if ($autre.name -ne $u.name -and $autre.name -like "*$($u.name)*") { $englobe = $true; break }
                }
                if ($englobe) { continue }
                if ([int]$u.qty -ge 2) { continue }
                $pistes++
                Write-Host ("  {0} — {1}" -f $l.name, $f.BaseName) -ForegroundColor Yellow
                Write-Host ("      [QUANTITE] {0} aligne x{1} — « +1 capacite » en autorise 2" -f $u.name, $u.qty) -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "$fiches fiche(s) examinee(s) — $pistes piste(s) : unite citee et absente, ou regiment favori sous-aligne."
Write-Host "INFORMATIF : une piste n'est pas une erreur. Un effet peut nommer une unite pour la deconseiller." -ForegroundColor DarkYellow

if ($Strict -and $pistes -gt 0) { exit 1 }
exit 0
