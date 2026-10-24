# Cherche, dans les mods actifs, ce qui peut faire planter le jeu apres une mise a jour.
#
# Deux controles :
#   1. VERSIONS (toujours) : chaque table db\ d'un mod est comparee a la meme table du
#      db.pack du jeu. Une version differente, ou une table que le jeu n'a plus, est la
#      cause classique d'un plantage au lancement apres un DLC ou un correctif.
#   2. REFERENCES (-References) : chaque colonne que le schema declare comme reference
#      vers une autre table est confrontee aux cles de cette table, dans le jeu ET dans
#      tous les mods actifs (un mod peut dependre d'un autre). Lent : a reserver a un ou
#      deux mods suspects, via -Mods.
#
# Pourquoi pas RPFM : ses diagnostics s'appuient sur un cache des fichiers du jeu. Tant
# qu'il n'est pas regenere apres un DLC, il signale des cles parfaitement valides. Le
# 02/10/2026, sur Graybeard's Prospectors, 4 de ses 6 erreurs etaient de ce type :
# deux regions presentes dans db.pack, et deux noms dont l'identifiant est un entier
# dans names_tables alors que RPFM le cherche comme texte.
#
# Usage :
#   diagnostiquer-mods.ps1                      # tous les mods du dernier lancement
#   diagnostiquer-mods.ps1 -Mods a.pack,b.pack  # seulement ceux-la
#   diagnostiquer-mods.ps1 -Mods a.pack -References
param(
  [string[]]$Mods=@(),
  [switch]$References,
  [string]$Schema=''
)
$ErrorActionPreference='Stop'
$outils='C:\Users\Utilisateur\.claude\tools\tww'
. "$outils\pack_lib.ps1"
. "$outils\_unpack.ps1"
. "$outils\table_lib.ps1"

$jeu='C:\Program Files (x86)\Steam\steamapps\common\Total War WARHAMMER III\data'
$workshop='C:\Program Files (x86)\Steam\steamapps\workshop\content\1142710'
$journal="$env:APPDATA\The Creative Assembly\Warhammer3\logs\modified.log"

# Decompresse une entree lue sur disque et renvoie ses octets en clair.
# $Flux : FileStream ouvert sur le pack ; $Entree : objet rendu par Read-Pack.
# Une entree de taille nulle renvoie un tableau vide explicite : sans la virgule,
# PowerShell deroule un tableau vide en $null, et c'est ce qui avait produit trois
# fausses erreurs "Array ne peut pas etre null" lors du premier balayage.
function Read-EntreeEnClair {
  param($Flux,$Entree)
  if($Entree.Taille -eq 0){ return ,([byte[]]@()) }
  $Flux.Seek($Entree.Offset,'Begin') | Out-Null
  $brut=New-Object byte[] $Entree.Taille
  [void]$Flux.Read($brut,0,$Entree.Taille)
  [byte[]]$o=Expand-PackEntry -Raw $brut -Comp $Entree.Comp
  return ,$o
}

# Renvoie la version d'une table db\ d'apres son en-tete (0 si elle n'en declare pas).
# $Octets : la table en clair. Disposition : marqueur GUID optionnel FD FE FC FF + u16
# longueur en caracteres + GUID UTF-16, puis marqueur de version FC FD FE FF + u32.
function Get-VersionTable {
  param([byte[]]$Octets)
  $p=0
  if($Octets.Length -ge 6 -and $Octets[0]-eq 0xFD -and $Octets[1]-eq 0xFE -and $Octets[2]-eq 0xFC -and $Octets[3]-eq 0xFF){
    $p=6+2*[BitConverter]::ToUInt16($Octets,4) }
  if($Octets.Length -ge $p+8 -and $Octets[$p]-eq 0xFC -and $Octets[$p+1]-eq 0xFD -and $Octets[$p+2]-eq 0xFE -and $Octets[$p+3]-eq 0xFF){
    return [int][BitConverter]::ToUInt32($Octets,$p+4) }
  return 0
}

# Renvoie, pour chaque ligne d'une table, les valeurs des colonnes demandees.
# $Octets : la table en clair ; $ParVersion : definitions rendues par Get-DefsTable ;
# $Colonnes : noms des colonnes voulues. Les entiers sont rendus en texte pour pouvoir
# etre compares a une cle ; Read-Champ de table_lib ne rend que les chaines.
# Leve une exception si la version est absente du schema ou si des octets restent.
function Get-ValeursColonnes {
  param([byte[]]$Octets,$ParVersion,[string[]]$Colonnes)
  $ver=Get-VersionTable $Octets
  $i=0
  if($Octets[0]-eq 0xFD){ $i=6+2*[BitConverter]::ToUInt16($Octets,4) }
  if($Octets.Length -gt $i+4 -and $Octets[$i]-eq 0xFC){ $i+=8 }
  $i+=1
  $nb=[BitConverter]::ToUInt32($Octets,$i); $i+=4
  $champs=$ParVersion[[int]$ver]
  if(-not $champs){ throw "version $ver absente du schema" }
  $lignes=New-Object System.Collections.ArrayList
  for($r=0;$r -lt $nb;$r++){
    $ligne=@{}
    foreach($fl in $champs){
      if($fl.field_type -eq 'I32'){ $v=[string][BitConverter]::ToInt32($Octets,$i); $i+=4 }
      elseif($fl.field_type -eq 'OptionalI32'){ $pr=$Octets[$i]; $i+=1; $v=''; if($pr){ $v=[string][BitConverter]::ToInt32($Octets,$i); $i+=4 } }
      else { $v=Read-Champ -d $Octets -i ([ref]$i) -fl $fl }
      if($Colonnes -contains $fl.name){ $ligne[$fl.name]=$v }
    }
    [void]$lignes.Add($ligne)
  }
  if($i -ne $Octets.Length){ throw "octets residuels : $i / $($Octets.Length)" }
  return ,$lignes
}

# --- les mods a examiner, retrouves sur disque
$actifs=@(Get-Content $journal | Where-Object { $_ -match '^Mod: (.+)$' } | ForEach-Object { $Matches[1].Trim() })
if(-not $Mods.Count){ $Mods=$actifs }
$index=@{}
foreach($f in @(Get-ChildItem $workshop -Recurse -Filter *.pack) + @(Get-ChildItem $jeu -Filter *.pack)){
  $k=$f.Name.ToLower(); if(-not $index.ContainsKey($k)){ $index[$k]=$f.FullName } }
"journal du dernier lancement : $($actifs.Count) mods actifs ; examines : $($Mods.Count)"

# --- versions du jeu, une par table
$versionsJeu=@{}
$vp=Read-Pack -Chemin "$jeu\db.pack"
$fs=[IO.File]::OpenRead("$jeu\db.pack")
foreach($e in $vp.Entrees){
  if($e.Chemin -notmatch '^db\\([^\\]+)\\'){ continue }
  $t=$Matches[1]; if($versionsJeu.ContainsKey($t)){ continue }
  $versionsJeu[$t]=Get-VersionTable (Read-EntreeEnClair $fs $e)
}
$fs.Close()

# --- controle 1 : versions
# Une table que db.pack ne contient pas n'est PAS un signal de plantage : le jeu en
# connait beaucoup qu'il livre vides (twad_key_deletes_tables, campaign_stances_factions_
# junctions_tables...). Au premier passage du 02/10/2026, les 16 tables "absentes" etaient
# toutes dans ce cas sauf un dossier db\ui\ mal range. Elles sont donc comptees a part,
# sans faire passer le mod en SUSPECT ; seul un ecart de version le fait.
$schemaTexte=''
$schemaAuto=@(Get-ChildItem 'C:\Users\Utilisateur\OneDrive\Desktop' -Directory -Filter 'wh3mm-win32-x64-*' |
  Sort-Object { [version]($_.Name -replace '^wh3mm-win32-x64-','') } |
  ForEach-Object { Join-Path $_.FullName 'resources\app\.webpack\schema\schema_wh3.json' } |
  Where-Object { Test-Path $_ })
if(-not $Schema -and $schemaAuto.Count){ $Schema=$schemaAuto[-1] }
if($Schema){ $schemaTexte=[IO.File]::ReadAllText($Schema) }
$suspects=0; $sansReference=0
foreach($m in $Mods){
  $chemin=$index[$m.ToLower()]
  if(-not $chemin){ "INTROUVABLE  $m"; continue }
  $p=Read-Pack -Chemin $chemin
  $fs=[IO.File]::OpenRead($chemin); $ecarts=@(); $absentes=@()
  foreach($e in $p.Entrees){
    if($e.Chemin -notmatch '^db\\([^\\]+)\\'){ continue }
    $t=$Matches[1]
    if(-not $versionsJeu.ContainsKey($t)){
      $connue= if($schemaTexte.Contains('"'+$t+'": [')){'connue du schema'}else{'INCONNUE du schema'}
      $absentes+="  (info) vide dans le jeu, $connue : $($e.Chemin)"; continue }
    $v=Get-VersionTable (Read-EntreeEnClair $fs $e)
    if($v -ne $versionsJeu[$t]){ $ecarts+="  $($e.Chemin)  mod v$v / jeu v$($versionsJeu[$t])" }
  }
  $fs.Close()
  if($ecarts.Count){ $suspects++; "SUSPECT  $m  ($($ecarts.Count) table(s) perimee(s))  $chemin"; $ecarts }
  if($absentes.Count){ $sansReference++; if(-not $ecarts.Count){ "info  $m" }; $absentes }
}
"--- versions : $suspects mod(s) suspect(s) sur $($Mods.Count) ; $sansReference avec des tables sans reference dans le jeu (non bloquant)"
if(-not $References){ return }

# --- controle 2 : references
if(-not $Schema){ throw 'schema_wh3.json introuvable : passer -Schema' }
"schema : $Schema"
$defs=@{}
# Renvoie (en cache) les definitions d'une table, ou $null si le schema l'ignore.
# $Table : nom du dossier db\, suffixe _tables compris.
function Get-Defs([string]$Table){
  if(-not $defs.ContainsKey($Table)){ try{ $defs[$Table]=Get-DefsTable -Schema $Schema -Table $Table }catch{ $defs[$Table]=$null } }
  return $defs[$Table]
}

# a) les valeurs que les mods examines citent comme references
$citees=New-Object System.Collections.ArrayList
foreach($m in $Mods){
  $chemin=$index[$m.ToLower()]; if(-not $chemin){ continue }
  $p=Read-Pack -Chemin $chemin; $fs=[IO.File]::OpenRead($chemin)
  foreach($e in $p.Entrees){
    if($e.Chemin -notmatch '^db\\([^\\]+)\\'){ continue }
    $t=$Matches[1]; $pv=Get-Defs $t; if(-not $pv){ continue }
    $o=Read-EntreeEnClair $fs $e
    $champs=$pv[[int](Get-VersionTable $o)]; if(-not $champs){ continue }
    $refs=@($champs | Where-Object { $_.is_reference -and $_.is_reference.Count -eq 2 })
    if(-not $refs.Count){ continue }
    try{ $lignes=Get-ValeursColonnes $o $pv ($refs | ForEach-Object name) }catch{ "  illisible : $m $($e.Chemin) -- $($_.Exception.Message)"; continue }
    foreach($l in $lignes){ foreach($r in $refs){
      $v=$l[$r.name]; if([string]::IsNullOrEmpty($v)){ continue }
      [void]$citees.Add([PSCustomObject]@{Mod=$m;Entree=$e.Chemin;Colonne=$r.name;Table="$($r.is_reference[0])_tables";Cle=$r.is_reference[1];Valeur=$v}) } }
  }
  $fs.Close()
}

# b) les cles existantes de chaque table visee : jeu + TOUS les mods actifs + les mods examines.
# Les mods examines s'ajoutent parce qu'un mod desactive (celui qu'on veut justement reactiver) n'est
# pas dans le journal : sans lui, ses propres cles manquaient et le 24/10/2026 Dynasty of the Damned
# remontait 5 927 references "introuvables", presque toutes definies dans son propre pack.
$visees=@($citees | Select-Object Table,Cle -Unique)
$cles=@{}; foreach($vt in $visees){ $cles["$($vt.Table)|$($vt.Cle)"]=New-Object 'System.Collections.Generic.HashSet[string]' }
$sources=@("$jeu\db.pack") + @(@($actifs + $Mods) | ForEach-Object { $index[$_.ToLower()] } | Where-Object { $_ } | Sort-Object -Unique)
foreach($src in $sources){
  $p=Read-Pack -Chemin $src; $fs=[IO.File]::OpenRead($src)
  foreach($e in $p.Entrees){
    if($e.Chemin -notmatch '^db\\([^\\]+)\\'){ continue }
    $t=$Matches[1]
    $colonnes=@($visees | Where-Object { $_.Table -eq $t } | ForEach-Object Cle)
    if(-not $colonnes.Count){ continue }
    try{ $lignes=Get-ValeursColonnes (Read-EntreeEnClair $fs $e) (Get-Defs $t) $colonnes }catch{ continue }
    foreach($l in $lignes){ foreach($c in $colonnes){ if($null -ne $l[$c]){ [void]$cles["$t|$c"].Add($l[$c]) } } }
  }
  $fs.Close()
}

# c) le verdict
$manquantes=@($citees | Where-Object { $cles["$($_.Table)|$($_.Cle)"].Count -and -not $cles["$($_.Table)|$($_.Cle)"].Contains($_.Valeur) })
$nonVerifiables=@($citees | Where-Object { -not $cles["$($_.Table)|$($_.Cle)"].Count } | Select-Object Table -Unique)
foreach($x in $manquantes){ "REFERENCE INTROUVABLE  $($x.Mod)  $($x.Entree)  [$($x.Colonne)] = $($x.Valeur)  -> $($x.Table).$($x.Cle)" }
if($nonVerifiables.Count){ "tables de reference vides ou illisibles partout, non verifiables : $(($nonVerifiables | ForEach-Object Table) -join ', ')" }
"--- references : $($manquantes.Count) introuvable(s) sur $($citees.Count) citee(s)"
