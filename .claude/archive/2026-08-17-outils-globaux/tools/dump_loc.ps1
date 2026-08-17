# Extrait le texte des fichiers .loc d'un .pack TWW3 (PFH4/PFH5, zstd ou LZ4).
# Usage : dump_loc.ps1 -PackPath <pack> [-LocLike "*land_units*"] [-Cjk] [-Out <fichier>]
#
# -Cjk : élargit la capture aux caractères han / kana / pleine chasse.
#        À utiliser pour les mods chinois, coréens ou japonais, dont les valeurs
#        sont invisibles sans lui. Produit en contrepartie des lignes parasites
#        (les clés ASCII relues à un octet de décalage ressemblent à du CJK),
#        donc ne l'activer que si le dump normal ressort vide ou tronqué.
param(
  [Parameter(Mandatory=$true)][string]$PackPath,
  [string]$LocLike="*.loc",
  [switch]$Cjk,
  [string]$Out=""
)
. "$PSScriptRoot\_unpack.ps1"
$fs=[System.IO.File]::OpenRead($PackPath); $br=New-Object System.IO.BinaryReader($fs)
$magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
if($magic -ne "PFH5" -and $magic -ne "PFH4"){ Write-Output "Format inconnu : $magic"; $br.Close(); $fs.Close(); exit 1 }
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
# Latin de base + supplément latin ; avec -Cjk on ajoute han, kana et pleine chasse.
$pattern = if($Cjk){ "[ -~\u00A0-\u024F\u3000-\u9FFF\uFF00-\uFFEF]{2,}" } else { "[ -~\u00A0-\u024F]{2,}" }
$lines=@()
foreach($e in $locs){
  $fs.Seek($e.Offset,[System.IO.SeekOrigin]::Begin)|Out-Null; $raw=$br.ReadBytes([int]$e.Size)
  $data=Expand-PackEntry $raw $e.Comp
  $txt=[System.Text.Encoding]::Unicode.GetString($data)
  $lines+="### $($e.Path)"
  foreach($m in [regex]::Matches($txt,$pattern)){ $lines+=$m.Value }
}
$br.Close(); $fs.Close()
if($Out){ $lines | Set-Content -Encoding utf8 $Out; Write-Output ("{0} lignes -> {1}" -f $lines.Count,$Out) } else { $lines }
