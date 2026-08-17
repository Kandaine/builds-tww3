# Liste les chemins internes d'un .pack TWW3, filtres par regex.
# Usage : list_pack.ps1 -PackPath <pack> [-Match "^ui\\units\\icons\\"]
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [string]$Match=".*"
)
$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
if($magic -ne "PFH5" -and $magic -ne "PFH4"){ Write-Host "Format inconnu : $magic"; $br.Close(); $fs.Close(); exit 1 }
$null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $depSize=$br.ReadUInt32()
$fileCount=$br.ReadUInt32(); $indexSize=$br.ReadUInt32(); $null=$br.ReadUInt32()
$null=$br.ReadBytes([int]$depSize); $ib=$br.ReadBytes([int]$indexSize); $pos=0
for($i=0;$i -lt $fileCount;$i++){
  $pos+=5; $st=$pos; while($ib[$pos] -ne 0){ $pos++ }
  $p=[System.Text.Encoding]::ASCII.GetString($ib,$st,$pos-$st); $pos++
  if($p -match $Match){ Write-Host $p }
}
$br.Close(); $fs.Close()
