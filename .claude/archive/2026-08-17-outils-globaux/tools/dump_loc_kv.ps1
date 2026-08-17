# Extrait les paires cle/valeur des .loc d'un .pack TWW3, par lecture BINAIRE du format.
#
# Pourquoi ce script en plus de dump_loc.ps1 : dump_loc.ps1 balaie le flux avec une
# regex de caracteres imprimables. Or chaque entree .loc se termine par UN octet
# booleen, qui decale l'alignement UTF-16 d'un octet sur deux. Un balayage ne voit
# donc qu'une entree sur deux environ. Ce script suit la structure declaree :
#
#   entete 14 octets : FF FE, "LOC", version (uint16), nombre d'entrees (uint32)
#   par entree       : uint16 longueur cle (en CARACTERES), cle UTF-16LE,
#                      uint16 longueur valeur, valeur UTF-16LE, 1 octet booleen
#
# Usage : dump_loc_kv.ps1 -PackPath <pack> [-KeyLike "land_units_onscreen_name*"] [-Out <csv>]
# Sortie : CSV (Key, Value) si -Out, sinon des lignes "cle<TAB>valeur".
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [string]$LocLike="*.loc",
  [string]$KeyLike="*",
  [string]$Out=""
)
. "$PSScriptRoot\_unpack.ps1"

$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
if($magic -ne "PFH5" -and $magic -ne "PFH4"){ $br.Close(); $fs.Close(); Write-Error "Format inconnu : $magic"; exit 1 }
$null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $d=$br.ReadUInt32()
$fc=$br.ReadUInt32(); $isz=$br.ReadUInt32(); $null=$br.ReadUInt32()
$null=$br.ReadBytes([int]$d); $ib=$br.ReadBytes([int]$isz)
$dataStart=28+$d+$isz; $pos=0; $offset=[int64]$dataStart; $locs=@()
for($i=0;$i -lt $fc;$i++){
  $size=[BitConverter]::ToUInt32($ib,$pos); $pos+=4; $comp=$ib[$pos]; $pos+=1
  $st=$pos; while($ib[$pos] -ne 0){ $pos++ }
  $p=[System.Text.Encoding]::ASCII.GetString($ib,$st,$pos-$st); $pos++
  if($p -like $LocLike){ $locs+=[PSCustomObject]@{Path=$p;Size=$size;Offset=$offset;Comp=$comp} }
  $offset+=$size
}

$rows=New-Object System.Collections.ArrayList
foreach($e in $locs){
  $fs.Seek($e.Offset,[System.IO.SeekOrigin]::Begin)|Out-Null
  # [byte[]] n'est pas decoratif : Expand-PackEntry fait `return $dst`, donc PowerShell
  # DEROULE le tableau dans le pipeline et l'appelant recoit un Object[] d'octets boxes.
  # Sans ce typage, chaque [BitConverter]::ToUInt16($data,$i) reconvertit tout le tableau
  # (~700 Ko) a chaque appel : ~12 ms par entree au lieu de quelques microsecondes.
  [byte[]]$data=Expand-PackEntry ($br.ReadBytes([int]$e.Size)) $e.Comp
  if($data.Length -lt 14){ continue }
  # Verifie l'entete plutot que de la supposer : certains .loc sortent non conformes.
  if(-not($data[0] -eq 0xFF -and $data[1] -eq 0xFE)){ continue }
  $count=[BitConverter]::ToUInt32($data,10)
  $i=14
  for($n=0; $n -lt $count; $n++){
    if($i+2 -gt $data.Length){ break }
    $kl=[BitConverter]::ToUInt16($data,$i); $i+=2
    if($i+$kl*2 -gt $data.Length){ break }
    $key=[System.Text.Encoding]::Unicode.GetString($data,$i,$kl*2); $i+=$kl*2
    if($i+2 -gt $data.Length){ break }
    $vl=[BitConverter]::ToUInt16($data,$i); $i+=2
    if($i+$vl*2 -gt $data.Length){ break }
    $val=[System.Text.Encoding]::Unicode.GetString($data,$i,$vl*2); $i+=$vl*2
    $i+=1   # l'octet booleen
    if($key -like $KeyLike){ [void]$rows.Add([PSCustomObject]@{Key=$key;Value=$val}) }
  }
}
$br.Close(); $fs.Close()

if($Out){
  $rows | Export-Csv -Path $Out -NoTypeInformation -Encoding UTF8
  Write-Output ("{0} entrees -> {1}" -f $rows.Count,$Out)
} else {
  $rows | ForEach-Object { "{0}`t{1}" -f $_.Key,$_.Value }
}
