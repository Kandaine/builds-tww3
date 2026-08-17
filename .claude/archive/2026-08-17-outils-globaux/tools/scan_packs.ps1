# Cherche un motif dans les CHEMINS INTERNES de tous les .pack d'un dossier (workshop ou data).
# Usage : scan_packs.ps1 -Match "xlotc" [-Root "C:\...\workshop\content\1142710"]
#
# Ne lit que l'en-tete + l'index de chaque pack : rapide meme sur 60 Go.
# Sert a retrouver de quel mod vient une unite / un seigneur quand la capture du user
# ne correspond pas au pack designe (cas de double provenance : Tlat'l, Lord Xlotc).
# Le parsing de l'index doit rester identique a celui de list_pack.ps1 :
# on saute depSize octets, PUIS on lit indexSize octets d'un bloc, et on parcourt
# ce bloc (5 octets d'en-tete + chemin ASCII termine par 0 pour chaque entree).
param(
  [Parameter(Mandatory=$true)][string]$Match,
  [string]$Root="C:\Program Files (x86)\Steam\steamapps\workshop\content\1142710"
)
$packs = Get-ChildItem $Root -Recurse -Filter "*.pack" -ErrorAction SilentlyContinue
$found = 0
foreach($pk in $packs){
  $fs=$null; $br=$null
  try{
    $fs=[System.IO.File]::OpenRead($pk.FullName); $br=New-Object System.IO.BinaryReader($fs)
    $magic=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
    if($magic -ne "PFH5" -and $magic -ne "PFH4"){ continue }
    $null=$br.ReadUInt32(); $null=$br.ReadUInt32(); $depSize=$br.ReadUInt32()
    $fileCount=$br.ReadUInt32(); $indexSize=$br.ReadUInt32(); $null=$br.ReadUInt32()
    $null=$br.ReadBytes([int]$depSize); $ib=$br.ReadBytes([int]$indexSize); $pos=0
    for($i=0;$i -lt $fileCount;$i++){
      $pos+=5; $st=$pos; while($ib[$pos] -ne 0){ $pos++ }
      $p=[System.Text.Encoding]::ASCII.GetString($ib,$st,$pos-$st); $pos++
      if($p -match $Match){ Write-Output ($pk.Name + "  ->  " + $p); $found++ }
    }
  } catch { }
  finally { if($br){ $br.Close() }; if($fs){ $fs.Close() } }
}
if($found -eq 0){ Write-Output "Aucun chemin interne ne correspond a '$Match'." }
exit 0
