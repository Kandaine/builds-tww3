# Retire des entrees d'un fichier .loc, par excision d'octets comme pour les tables db.
#
# Disposition relevee sur !lyh_hero_faction.loc le 21/09/2026 :
#   0..1    BOM ff fe
#   2..4    "LOC"
#   5       un octet de bourrage
#   6..9    version (u32, vaut 1)
#   10..13  nombre d'entrees (u32)
#   puis, par entree : cle   = longueur u16 EN CARACTERES + UTF-16
#                      valeur= longueur u16 EN CARACTERES + UTF-16
#                      1 octet d'infobulle
# La longueur est un nombre de CARACTERES, pas d'octets : il faut la doubler pour
# avancer. Une lecture qui l'oublie se desynchronise des la premiere entree.

# Supprime les entrees dont la cle contient l'un des motifs. Renvoie les octets
# amputes et le compte rendu.
function Remove-EntreesLoc {
  param([byte[]]$Donnees,[string[]]$Motifs)
  if($Donnees[0] -ne 0xFF -or $Donnees[1] -ne 0xFE){ throw "BOM absent" }
  if([Text.Encoding]::ASCII.GetString($Donnees[2..4]) -ne 'LOC'){ throw "marque LOC absente" }
  $posCompteur=10
  $nb=[BitConverter]::ToUInt32($Donnees,$posCompteur)
  $i=14
  $garder=New-Object System.Collections.ArrayList
  $retirees=New-Object System.Collections.ArrayList
  for($n=0;$n -lt $nb;$n++){
    $debut=$i
    $lc=[BitConverter]::ToUInt16($Donnees,$i); $i+=2
    $cle=[Text.Encoding]::Unicode.GetString($Donnees,$i,$lc*2); $i+=$lc*2
    $lv=[BitConverter]::ToUInt16($Donnees,$i); $i+=2
    $i+=$lv*2
    $i+=1                                               # octet d'infobulle
    $vise=$false
    foreach($m in $Motifs){ if($cle -like "*$m*"){ $vise=$true; break } }
    if($vise){ [void]$retirees.Add($cle) } else { [void]$garder.Add([PSCustomObject]@{Debut=$debut;Fin=$i}) }
  }
  if($i -ne $Donnees.Length){ throw "octets residuels apres la derniere entree : $i / $($Donnees.Length)" }
  $ms=New-Object System.IO.MemoryStream
  $ms.Write($Donnees,0,$posCompteur)
  $ms.Write([BitConverter]::GetBytes([uint32]$garder.Count),0,4)
  foreach($g in $garder){ $ms.Write($Donnees,$g.Debut,$g.Fin-$g.Debut) }
  $sortie=$ms.ToArray(); $ms.Dispose()
  return [PSCustomObject]@{Octets=$sortie;Avant=$nb;Apres=$garder.Count;Retirees=$retirees}
}
