# Lit une table db\ d'un .pack TWW3 en suivant le SCHEMA, pas une heuristique.
#
# Pourquoi : dump_db.ps1 extrait les chaines a plat, ce qui oblige a deviner l'appariement
# des colonnes -- c'est ainsi qu'un mortier de l'Empire s'etait retrouve dans un pool de
# Slaanesh. Et une lecture "je ne cherche que des chaines" desynchronise des le premier
# champ numerique : mercenary_unit_groups_tables commence par un F32.
#
# Le schema vient du gestionnaire de mods (meme contenu que le RON de RPFM, en JSON) :
#   ...\wh3mm-win32-x64-*\resources\app\.webpack\schema\schema_wh3.json
#
# Encodage des champs :
#   StringU8          uint16 longueur + octets UTF-8
#   OptionalStringU8  1 octet de presence, puis idem si present. Une valeur ABSENTE est une
#                     information : dans faction_to_mercenary_set_junctions, une faction vide
#                     ouvre le pool a tout le monde.
#   I32 / F32         4 octets        Boolean  1 octet
#
# Usage : dump_db_rows.ps1 -PackPath <pack> -Table <nom_tables> [-Schema <json>] [-Out <csv>]
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [Parameter(Mandatory=$true)][string]$Table,
  [string]$Schema='C:\Users\Utilisateur\OneDrive\Desktop\wh3mm-win32-x64-2.15.0\resources\app\.webpack\schema\schema_wh3.json',
  [string]$Out=""
)
. "$PSScriptRoot\_unpack.ps1"

# --- definitions de la table, toutes versions confondues
$stxt=[System.IO.File]::ReadAllText($Schema)
$i=$stxt.IndexOf('"'+$Table+'": [')
if($i -lt 0){ Write-Error "table absente du schema : $Table"; exit 1 }
$j=$stxt.IndexOf('[',$i); $depth=0; $k=$j
while($k -lt $stxt.Length){ if($stxt[$k] -eq '['){$depth++} elseif($stxt[$k] -eq ']'){$depth--; if($depth -eq 0){break}}; $k++ }
$defs=$stxt.Substring($j,$k-$j+1) | ConvertFrom-Json
$parVersion=@{}; foreach($d in $defs){ $parVersion[[int]$d.version]=$d.fields }

$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
if($magic -ne "PFH5" -and $magic -ne "PFH4"){ $br.Close(); $fs.Close(); Write-Error "Format inconnu : $magic"; exit 1 }
$null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $d0=$br.ReadUInt32()
$fc=$br.ReadUInt32(); $isz=$br.ReadUInt32(); $null=$br.ReadUInt32()
$null=$br.ReadBytes([int]$d0); $ib=$br.ReadBytes([int]$isz)
$dataStart=28+$d0+$isz; $pos=0; $offset=[int64]$dataStart; $ent=@()
for($n=0;$n -lt $fc;$n++){
  $size=[BitConverter]::ToUInt32($ib,$pos); $pos+=4; $comp=$ib[$pos]; $pos+=1
  $st=$pos; while($ib[$pos] -ne 0){ $pos++ }
  $p=[System.Text.Encoding]::ASCII.GetString($ib,$st,$pos-$st); $pos++
  if($p -like "db\$Table\*"){ $ent+=[PSCustomObject]@{Path=$p;Size=$size;Offset=$offset;Comp=$comp} }
  $offset+=$size
}

$rows=New-Object System.Collections.ArrayList
foreach($e in $ent){
  $fs.Seek($e.Offset,[System.IO.SeekOrigin]::Begin)|Out-Null
  # [byte[]] obligatoire : sinon le tableau est deroule en Object[] d'octets boxes et
  # chaque BitConverter reconvertit tout (voir SKILL.md, section Outils).
  [byte[]]$data=Expand-PackEntry ($br.ReadBytes([int]$e.Size)) $e.Comp
  $i=0; $ver=0
  if($data.Length -gt 4 -and $data[0] -eq 0xFD -and $data[1] -eq 0xFE -and $data[2] -eq 0xFC -and $data[3] -eq 0xFF){
    $i=4; $gl=[BitConverter]::ToUInt16($data,$i); $i+=2+$gl*2      # GUID, chaine UTF-16
  }
  if($data.Length -gt $i+4 -and $data[$i] -eq 0xFC -and $data[$i+1] -eq 0xFD -and $data[$i+2] -eq 0xFE -and $data[$i+3] -eq 0xFF){
    $i+=4; $ver=[BitConverter]::ToUInt32($data,$i); $i+=4
  }
  $i+=1                                                            # octet de marque
  if($i+4 -gt $data.Length){ continue }
  $nb=[BitConverter]::ToUInt32($data,$i); $i+=4
  $champs=$parVersion[[int]$ver]
  if(-not $champs){ Write-Output ("  {0} : version {1} absente du schema" -f (Split-Path $e.Path -Leaf),$ver); continue }

  $lus=0
  for($r=0; $r -lt $nb; $r++){
    $o=[ordered]@{}
    $ok=$true
    foreach($fl in $champs){
      switch($fl.field_type){
        'StringU8'         { if($i+2 -gt $data.Length){$ok=$false;break}
                             $l=[BitConverter]::ToUInt16($data,$i); $i+=2
                             if($i+$l -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[System.Text.Encoding]::UTF8.GetString($data,$i,$l); $i+=$l }
        'OptionalStringU8' { if($i+1 -gt $data.Length){$ok=$false;break}
                             $present=$data[$i]; $i+=1
                             if($present -eq 0){ $o[$fl.name]='' }
                             else { if($i+2 -gt $data.Length){$ok=$false;break}
                                    $l=[BitConverter]::ToUInt16($data,$i); $i+=2
                                    if($i+$l -gt $data.Length){$ok=$false;break}
                                    $o[$fl.name]=[System.Text.Encoding]::UTF8.GetString($data,$i,$l); $i+=$l } }
        'StringU16'        { if($i+2 -gt $data.Length){$ok=$false;break}
                             $l=[BitConverter]::ToUInt16($data,$i); $i+=2
                             if($i+$l*2 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[System.Text.Encoding]::Unicode.GetString($data,$i,$l*2); $i+=$l*2 }
        'I32'              { if($i+4 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToInt32($data,$i); $i+=4 }
        'OptionalI32'      { if($i+1 -gt $data.Length){$ok=$false;break}
                             $pr=$data[$i]; $i+=1
                             if($pr -eq 0){ $o[$fl.name]='' }
                             else { if($i+4 -gt $data.Length){$ok=$false;break}
                                    $o[$fl.name]=[BitConverter]::ToInt32($data,$i); $i+=4 } }
        'I16'              { if($i+2 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToInt16($data,$i); $i+=2 }
        'I64'              { if($i+8 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToInt64($data,$i); $i+=8 }
        'F32'              { if($i+4 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToSingle($data,$i); $i+=4 }
        'F64'              { if($i+8 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToDouble($data,$i); $i+=8 }
        'ColourRGB'        { if($i+4 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[BitConverter]::ToUInt32($data,$i); $i+=4 }
        'Boolean'          { if($i+1 -gt $data.Length){$ok=$false;break}
                             $o[$fl.name]=[bool]$data[$i]; $i+=1 }
        default            { $ok=$false }
      }
      if(-not $ok){ break }
    }
    if(-not $ok){ break }
    [void]$rows.Add([PSCustomObject]$o); $lus++
  }
  $etat = if($lus -eq $nb){'OK'}else{'INCOMPLET'}
  Write-Output ("  {0} : v{1}, {2} lignes declarees, {3} lues  [{4}]" -f (Split-Path $e.Path -Leaf),$ver,$nb,$lus,$etat)
}
$br.Close(); $fs.Close()
if($Out){ $rows | Export-Csv $Out -NoTypeInformation -Encoding UTF8; Write-Output ("{0} lignes -> {1}" -f $rows.Count,$Out) }
else { $rows }
