# Valide une fiche de builds-tww3 : total des slots, icones enregistrees dans
# js/units/<faction>.js, fichiers images presents, et signale les assets orphelins.
#
# Depuis le decoupage du registre unique (l'ancien js/data.js), chaque faction a son
# propre module d'images : c'est celui-la qu'on lit, et lui seul. Une cle declaree
# dans le module d'une AUTRE faction ne compte pas, puisque la page ne le charge pas.
#
# Usage : powershell -File tools\validate_fiche.ps1 -Faction tomb-kings [-Id dread-king]
#
# Ce script vivait hors du depot, dans ~\.claude\tools\tww\. Il a ete deplace ici le
# 16/08/2026 pour trois raisons : il est propre a ce site, il devient sauvegarde avec
# le depot, et surtout le hook pre-commit comme la GitHub Action executent desormais
# EXACTEMENT ce fichier — une CI qui lancerait une copie divergente ne prouverait rien.
param(
  [Parameter(Mandatory=$true)][string]$Faction,
  [string]$Id="",
  [string]$Root=""
)
# Racine du depot, deduite de l'emplacement du script (tools\ -> racine) plutot que
# codee en dur : le chemin differe entre la machine du user et le runner GitHub.
# A calculer ICI et non dans le param() : $PSScriptRoot est encore vide quand
# PowerShell evalue les valeurs par defaut des parametres.
if(-not $Root){ $Root = Split-Path (Split-Path $PSCommandPath -Parent) -Parent }
$path = "$Root\data\$Faction.json"
if(-not (Test-Path $path)){ Write-Output "ERREUR: $path introuvable"; exit 1 }
# UTF-8 sans BOM : ReadAllText obligatoire, Get-Content casse les accents en PS 5.1
$json = [System.IO.File]::ReadAllText($path) | ConvertFrom-Json
$mod  = "$Root\js\units\$Faction.js"
if(-not (Test-Path $mod)){ Write-Output "ERREUR: $mod introuvable"; exit 1 }
$js   = [System.IO.File]::ReadAllText($mod)
$lords = if($Id){ $json | Where-Object { $_.id -eq $Id } } else { $json }
if(-not $lords){ Write-Output "ERREUR: id '$Id' absent de $Faction.json"; exit 1 }

$ko = 0
foreach($l in $lords){
  $qty = {
    param($x)
    if($x -is [string]){ [int]([regex]::Match($x,'\d+').Value) } else { [int]$x }
  }
  $tot = 1
  foreach($h in $l.build.heroes){ $tot += (& $qty $h.qty) }
  foreach($a in $l.build.army){   $tot += (& $qty $a.qty) }

  $flag = if($tot -eq $l.build.totalSlots){ "OK " } else { "KO " }
  if($tot -ne $l.build.totalSlots){ $ko++ }
  Write-Output("{0}{1,-24} slots={2}/{3}  heros={4} unites={5}" -f $flag,$l.id,$tot,$l.build.totalSlots,$l.build.heroes.Count,$l.build.army.Count)

  $icons = @($l.build.lord.icon) + ($l.build.heroes.icon) + ($l.build.army.icon)
  foreach($i in $icons){
    if(-not $i){ continue }
    # Le chemin declare dans le module fait foi : ne JAMAIS deduire le dossier
    # de la cle. Des heros sont servis depuis assets/portraits, et une cle peut
    # pointer vers un fichier au nom different (ex. legendaryDuo -> gotrek.png).
    $decl = [regex]::Matches($js,"(?m)^\s*$i\s*:\s*'([^']+)'")
    if($decl.Count -eq 0){
      $ko++
      Write-Output("   KO icone '{0}' : non enregistree dans js/units/{1}.js" -f $i,$Faction)
      continue
    }
    foreach($d in $decl){
      $rel = $d.Groups[1].Value
      if(-not (Test-Path (Join-Path $Root $rel))){
        $ko++
        Write-Output("   KO icone '{0}' : enregistree vers '{1}' mais fichier absent" -f $i,$rel)
      }
    }
  }
}
if($ko -eq 0){ Write-Output "--- Validation OK ---"; exit 0 } else { Write-Output "--- $ko probleme(s) ---"; exit 1 }
