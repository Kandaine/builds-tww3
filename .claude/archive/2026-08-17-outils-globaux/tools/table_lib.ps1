# Retire des lignes d'une table db\ sans re-encoder celles qu'on garde.
#
# POURQUOI PAR EXCISION. On pourrait relire toutes les lignes puis les re-serialiser
# depuis les valeurs decodees. On ne le fait pas : un champ mal re-ecrit (un flottant,
# une chaine vide qui n'est pas la meme chose qu'une chaine absente) produirait une
# table qui se charge et ment. Ici on se contente de reperer les BORNES de chaque
# ligne, de supprimer les octets des lignes visees et de decrementer le compteur.
# Tout le reste sort identique a l'octet pres.
#
# Le decodage de champs est celui de tools\tww\dump_db_rows.ps1 -- il ne sert qu'a
# avancer le curseur pour connaitre la fin d'une ligne, jamais a reconstruire.

# Renvoie les definitions de colonnes d'une table, par version de schema.
function Get-DefsTable {
  param([string]$Schema,[string]$Table)
  $stxt=[IO.File]::ReadAllText($Schema)
  $i=$stxt.IndexOf('"'+$Table+'": [')
  if($i -lt 0){ throw "table absente du schema : $Table" }
  $j=$stxt.IndexOf('[',$i); $prof=0; $k=$j
  while($k -lt $stxt.Length){ if($stxt[$k] -eq '['){$prof++} elseif($stxt[$k] -eq ']'){$prof--; if($prof -eq 0){break}}; $k++ }
  $defs=$stxt.Substring($j,$k-$j+1) | ConvertFrom-Json
  $parVersion=@{}; foreach($d in $defs){ $parVersion[[int]$d.version]=$d.fields }
  return $parVersion
}

# Avance $i d'un champ et renvoie sa valeur (chaines seulement ; le reste sert a
# positionner le curseur). Le tableau $etat porte l'index courant, par reference.
function Read-Champ {
  param([byte[]]$d,[ref]$i,$fl)
  $t=$fl.field_type
  switch($t){
    'StringU8'         { $l=[BitConverter]::ToUInt16($d,$i.Value); $i.Value+=2
                         $v=[Text.Encoding]::UTF8.GetString($d,$i.Value,$l); $i.Value+=$l; return $v }
    'OptionalStringU8' { $pr=$d[$i.Value]; $i.Value+=1
                         if($pr -eq 0){ return '' }
                         $l=[BitConverter]::ToUInt16($d,$i.Value); $i.Value+=2
                         $v=[Text.Encoding]::UTF8.GetString($d,$i.Value,$l); $i.Value+=$l; return $v }
    'StringU16'        { $l=[BitConverter]::ToUInt16($d,$i.Value); $i.Value+=2
                         $v=[Text.Encoding]::Unicode.GetString($d,$i.Value,$l*2); $i.Value+=$l*2; return $v }
    'I32'              { $i.Value+=4; return $null }
    'OptionalI32'      { $pr=$d[$i.Value]; $i.Value+=1; if($pr -ne 0){ $i.Value+=4 }; return $null }
    'I16'              { $i.Value+=2; return $null }
    'I64'              { $i.Value+=8; return $null }
    'F32'              { $i.Value+=4; return $null }
    'F64'              { $i.Value+=8; return $null }
    'ColourRGB'        { $i.Value+=4; return $null }
    'Boolean'          { $i.Value+=1; return $null }
    default            { throw "type de champ inconnu : $t" }
  }
}

# Supprime d'une table les lignes dont la colonne $Colonne vaut l'une des $Valeurs.
# Renvoie les octets EN CLAIR de la table amputee, plus le compte rendu.
function Remove-LignesTable {
  param([byte[]]$Donnees,$ParVersion,[string]$Colonne,[string[]]$Valeurs)
  $i=0; $ver=0
  if($Donnees.Length -gt 4 -and $Donnees[0] -eq 0xFD -and $Donnees[1] -eq 0xFE -and $Donnees[2] -eq 0xFC -and $Donnees[3] -eq 0xFF){
    $i=4; $gl=[BitConverter]::ToUInt16($Donnees,$i); $i+=2+$gl*2      # GUID en UTF-16
  }
  if($Donnees.Length -gt $i+4 -and $Donnees[$i] -eq 0xFC -and $Donnees[$i+1] -eq 0xFD -and $Donnees[$i+2] -eq 0xFE -and $Donnees[$i+3] -eq 0xFF){
    $i+=4; $ver=[BitConverter]::ToUInt32($Donnees,$i); $i+=4
  }
  $i+=1                                                              # octet de marque
  $posCompteur=$i
  $nb=[BitConverter]::ToUInt32($Donnees,$i); $i+=4
  $champs=$ParVersion[[int]$ver]
  if(-not $champs){ throw "version $ver absente du schema" }

  $debutLignes=$i
  $garder=New-Object System.Collections.ArrayList
  $retirees=New-Object System.Collections.ArrayList
  for($r=0;$r -lt $nb;$r++){
    $debut=$i; $valeur=$null
    foreach($fl in $champs){
      $v=Read-Champ -d $Donnees -i ([ref]$i) -fl $fl
      if($fl.name -eq $Colonne){ $valeur=$v }
    }
    if($Valeurs -contains $valeur){ [void]$retirees.Add($valeur) }
    else { [void]$garder.Add([PSCustomObject]@{Debut=$debut;Fin=$i}) }
  }
  if($i -ne $Donnees.Length){ throw "octets residuels apres la derniere ligne : $i / $($Donnees.Length)" }

  $ms=New-Object System.IO.MemoryStream
  $ms.Write($Donnees,0,$posCompteur)
  $ms.Write([BitConverter]::GetBytes([uint32]$garder.Count),0,4)
  foreach($g in $garder){ $ms.Write($Donnees,$g.Debut,$g.Fin-$g.Debut) }
  $sortie=$ms.ToArray(); $ms.Dispose()
  return [PSCustomObject]@{Octets=$sortie;Avant=$nb;Apres=$garder.Count;Retirees=$retirees}
}
