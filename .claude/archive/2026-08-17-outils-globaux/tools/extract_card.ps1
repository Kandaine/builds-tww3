# Extrait une image d'un .pack TWW3 (PFH4/PFH5, zstd ou LZ4) et la redimensionne en 60x130.
# Usage : extract_card.ps1 -PackPath <pack> -Src <chemin interne> -Name <cle> [-DestSub "assets\units"]
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [Parameter(Mandatory=$true)][string]$Src,
  [Parameter(Mandatory=$true)][string]$Name,
  [string]$DestSub="assets\units",
  [string]$Root="C:\Users\Utilisateur\Projets\builds-tww3"
)
. "$PSScriptRoot\_unpack.ps1"
$tmp = Join-Path $env:TEMP "tww_extract"
if(-not (Test-Path $tmp)){ New-Item -ItemType Directory -Force $tmp | Out-Null }
$mag = "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"
if(-not (Test-Path $mag)){ Write-Host "ERREUR: ImageMagick introuvable ($mag)"; exit 1 }

$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$null=$br.ReadBytes(4); $null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $depSize=$br.ReadUInt32()
$fileCount=$br.ReadUInt32(); $indexSize=$br.ReadUInt32(); $null=$br.ReadUInt32()
$null=$br.ReadBytes([int]$depSize); $indexBytes=$br.ReadBytes([int]$indexSize)
$dataStart=28+$depSize+$indexSize; $pos=0; $offset=[int64]$dataStart; $entry=$null
for($i=0;$i -lt $fileCount;$i++){
  $size=[BitConverter]::ToUInt32($indexBytes,$pos); $pos+=4; $comp=$indexBytes[$pos]; $pos+=1
  $start=$pos; while($indexBytes[$pos] -ne 0){ $pos++ }
  $p=[System.Text.Encoding]::ASCII.GetString($indexBytes,$start,$pos-$start); $pos++
  if($p -eq $Src){ $entry=[PSCustomObject]@{Size=$size;Offset=$offset;Comp=$comp} }
  $offset+=$size
}
if(-not $entry){ Write-Host "MANQUANT $Src"; $br.Close(); $fs.Close(); exit 1 }
$fs.Seek($entry.Offset,[System.IO.SeekOrigin]::Begin)|Out-Null; $raw=$br.ReadBytes([int]$entry.Size)
$data=Expand-PackEntry $raw $entry.Comp
$br.Close(); $fs.Close()

$rr="$tmp\$Name.raw.png"; [System.IO.File]::WriteAllBytes($rr,$data)
$sz=(& $mag identify -format '%wx%h' $rr)
# Garde-fou : une icone UI (petite) n'est PAS une carte d'unite -> refuser
$w=[int]($sz -split 'x')[0]; $h=[int]($sz -split 'x')[1]
if($w -lt 40 -or $h -lt 80){
  Write-Host ("REFUSE {0,-26} src={1} : trop petit, c'est une icone UI, pas une carte d'unite" -f $Name,$sz)
  exit 1
}
& $mag $rr -resize 60x130^ -gravity center -extent 60x130 "$Root\$DestSub\$Name.png"
Write-Host ("OK {0,-26} src={1} -> {2}" -f $Name,$sz,(& $mag identify -format '%wx%h' "$Root\$DestSub\$Name.png"))
