# Extrait les chaînes lisibles des tables db\ d'un .pack TWW3 (PFH4/PFH5, zstd ou LZ4).
# Usage : dump_db.ps1 -PackPath <pack> -Like "db\faction_agent_permitted_subtypes_tables\*" [-Out <fichier>]
#
# Sert surtout a trancher seigneur/heros : dans faction_agent_permitted_subtypes,
# chaque ligne est (agent, faction, subtype). Si "general" apparait sur au moins
# une ligne d'une cle, c'est un SEIGNEUR ; "colonel" et "minister" ne sont pas des
# classes de heros. Ne sont des heros que les cles dont aucune ligne n'est general.
#
# TOUJOURS rediriger vers un fichier avec -Out et grep dessus : une sortie tronquee
# fait manquer des lignes et conduit a de fausses conclusions.
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [Parameter(Mandatory=$true)][string]$Like,
  [string]$Out=""
)
. "$PSScriptRoot\_unpack.ps1"
$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
if($magic -ne "PFH5" -and $magic -ne "PFH4"){ Write-Output "Format inconnu : $magic"; $br.Close(); $fs.Close(); exit 1 }
$null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $d=$br.ReadUInt32()
$fc=$br.ReadUInt32(); $isz=$br.ReadUInt32(); $null=$br.ReadUInt32()
$null=$br.ReadBytes([int]$d); $ib=$br.ReadBytes([int]$isz)
$dataStart=28+$d+$isz; $pos=0; $offset=[int64]$dataStart; $sel=@()
for($i=0;$i -lt $fc;$i++){
  $size=[BitConverter]::ToUInt32($ib,$pos); $pos+=4; $comp=$ib[$pos]; $pos+=1
  $st=$pos; while($ib[$pos] -ne 0){ $pos++ }
  $p=[System.Text.Encoding]::ASCII.GetString($ib,$st,$pos-$st); $pos++
  if($p -like $Like){ $sel+=[PSCustomObject]@{Path=$p;Size=$size;Offset=$offset;Comp=$comp} }
  $offset+=$size
}
$lines=@()
foreach($e in $sel){
  $fs.Seek($e.Offset,[System.IO.SeekOrigin]::Begin)|Out-Null; $raw=$br.ReadBytes([int]$e.Size)
  $data=Expand-PackEntry $raw $e.Comp
  $lines+="### $($e.Path)"
  $txt=[System.Text.Encoding]::ASCII.GetString($data)
  foreach($m in [regex]::Matches($txt,"[ -~]{3,}")){ $lines+=$m.Value }
}
$br.Close(); $fs.Close()
if($Out){ $lines | Set-Content -Encoding utf8 $Out; Write-Output ("{0} lignes -> {1}" -f $lines.Count,$Out) } else { $lines }
