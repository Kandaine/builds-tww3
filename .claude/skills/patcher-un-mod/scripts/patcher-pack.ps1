# Patche un .pack de mod en place : met ses tables db\ au format du jeu, et/ou en retire
# des entrees, des lignes de table ou des cles de traduction.
#
# C'est un patch TEMPORAIRE, pose directement dans le dossier workshop : quand l'auteur
# publie une mise a jour, Steam ecrase le pack et le patch disparait de lui-meme. Le user
# l'a voulu ainsi le 02/10/2026, sans sauvegarde : au pire, il se desabonne et se
# reabonne au mod.
#
# Usage :
#   patcher-pack.ps1 -Pack <chemin> -MettreANiveau            # produit <pack>.patch-tmp
#   patcher-pack.ps1 -Pack <chemin> -MettreANiveau -Poser     # et remplace le pack
#   patcher-pack.ps1 -Pack <chemin> -RetirerEntrees 'db\x_tables\y' -Poser
#   patcher-pack.ps1 -Pack <chemin> -RetirerLignes @(@{Entree='db\t_tables\f';Colonne='key';Valeurs=@('a','b')})
#   patcher-pack.ps1 -Pack <chemin> -RetirerLoc @(@{Entree='text\db\f.loc';Motifs=@('mixer_ime_cth_')})
#   patcher-pack.ps1 -Pack <chemin> -RemplacerEntrees @{'script\campaign\mod\x.lua'='C:\...\x.lua'} -Poser
#   patcher-pack.ps1 -Pack <chemin> -AjouterEntrees @{'db\t_tables\f'='C:\...\f.bin'} -Poser
#   -Sortie <chemin> : ecrire ailleurs qu'a cote du pack (sans -Poser).
#
# -RemplacerEntrees ne sait que REMPLACER une entree existante, jamais en ajouter : un
# chemin interne absent du pack est une faute de frappe, pas une intention. Le fichier
# fourni est ecrit tel quel, octet pour octet, en clair (drapeau 0).
# -AjouterEntrees est l'option explicite pour un chemin NOUVEAU (refuse s'il existe deja).
# Ajoutee le 24/10/2026 pour Dynasty of the Damned, a qui il manquait une table entiere
# (le rattachement de ses technologies aux onglets du nouvel arbre). L'entree est inseree a
# sa place dans l'index, trie par ordre ordinal dans les packs examines : le script refuse
# un pack dont l'index n'est pas trie, plutot que de deviner ou inserer.
param(
  [Parameter(Mandatory=$true)][string]$Pack,
  [switch]$MettreANiveau,
  [hashtable]$RemplacerEntrees=@{},
  [hashtable]$AjouterEntrees=@{},
  [string[]]$RetirerEntrees=@(),
  [hashtable[]]$RetirerLignes=@(),
  [hashtable[]]$RetirerLoc=@(),
  [switch]$Poser,
  [string]$Sortie=''
)
$ErrorActionPreference='Stop'
$outils='C:\Users\Utilisateur\.claude\tools\tww'
. "$outils\pack_lib.ps1"
. "$outils\_unpack.ps1"
. "$outils\table_lib.ps1"
. "$outils\loc_lib.ps1"
. "$PSScriptRoot\patch_lib.ps1"
$dbJeu='C:\Program Files (x86)\Steam\steamapps\common\Total War WARHAMMER III\data\db.pack'

# Lit une entree d'un pack ouvert et la rend en clair. $Flux : FileStream du pack ;
# $Entree : objet de Read-Pack. La virgule empeche PowerShell de derouler le tableau.
function Read-Clair {
  param($Flux,$Entree)
  if($Entree.Taille -eq 0){ return ,([byte[]]@()) }
  $Flux.Seek($Entree.Offset,'Begin')|Out-Null
  $b=New-Object byte[] $Entree.Taille; $n=0; while($n -lt $b.Length){ $n+=$Flux.Read($b,$n,$b.Length-$n) }
  [byte[]]$o=Expand-PackEntry -Raw $b -Comp $Entree.Comp
  return ,$o
}

# Adapte une definition RPFM au format qu'attend Remove-LignesTable (table_lib) :
# hashtable version -> liste d'objets {name;field_type}. $Table : nom db\.
function Get-DefsPourTableLib {
  param([string]$Table)
  $d=Get-DefsRpfm $Table; if(-not $d){ throw "table inconnue du schema RPFM : $Table" }
  $r=@{}; foreach($v in $d.Keys){ $r[$v]=@($d[$v] | ForEach-Object { [PSCustomObject]@{name=$_.Nom;field_type=$_.Type} }) }
  return $r
}

$p=Read-Pack -Chemin $Pack
"pack : $Pack ($($p.Entrees.Count) entrees, $([math]::Round($p.Taille/1MB)) Mo)"
Test-AllerRetourVide $p
"  aller-retour a vide : tete identique au bit pres, entrees contigues"
Initialize-SchemaRpfm

# --- versions et octets du jeu, table par table, charges a la demande
$jeu=Read-Pack -Chemin $dbJeu
$jeuParTable=@{}; foreach($e in $jeu.Entrees){ if($e.Chemin -match '^db\\([^\\]+)\\'){ if(-not $jeuParTable[$Matches[1]]){ $jeuParTable[$Matches[1]]=New-Object Collections.ArrayList }; [void]$jeuParTable[$Matches[1]].Add($e) } }
$fJeu=[IO.File]::OpenRead($dbJeu)
$cacheJeu=@{}
# Renvoie @{Version;Valide} pour une table du jeu ; Valide dit si le schema RPFM la
# decode exactement (Test-DefinitionJeu). $Table : nom db\.
function Get-TableJeu([string]$Table){
  if(-not $cacheJeu.ContainsKey($Table)){
    $octets=@($jeuParTable[$Table] | ForEach-Object { ,(Read-Clair $fJeu $_) })
    $v=(Get-EnteteTable $octets[0]).Version
    $cacheJeu[$Table]=[PSCustomObject]@{Version=$v;Valide=(Test-DefinitionJeu -Table $Table -Version $v -OctetsJeu $octets)}
  }
  return $cacheJeu[$Table]
}

# --- controle des remplacements demandes, avant toute lecture
foreach($c in $RemplacerEntrees.Keys){
  if(-not ($p.Entrees | Where-Object Chemin -eq $c)){ throw "entree a remplacer introuvable dans le pack : $c" }
  if(-not (Test-Path -LiteralPath $RemplacerEntrees[$c])){ throw "fichier de remplacement introuvable : $($RemplacerEntrees[$c])" }
  if($RetirerEntrees -contains $c -or ($RetirerLignes + $RetirerLoc | Where-Object { $_.Entree -eq $c })){ throw "entree a la fois remplacee et editee : $c" }
}
$ajoutees=@{}
foreach($c in $AjouterEntrees.Keys){
  if($p.Entrees | Where-Object Chemin -eq $c){ throw "entree a ajouter deja presente (utiliser -RemplacerEntrees) : $c" }
  if(-not (Test-Path -LiteralPath $AjouterEntrees[$c])){ throw "fichier a ajouter introuvable : $($AjouterEntrees[$c])" }
  $ajoutees[$c]=[IO.File]::ReadAllBytes($AjouterEntrees[$c])
}
if($ajoutees.Count){
  for($i=1;$i -lt $p.Entrees.Count;$i++){ if([string]::CompareOrdinal($p.Entrees[$i-1].Chemin,$p.Entrees[$i].Chemin) -gt 0){ throw "index du pack non trie (ordinal) a $($p.Entrees[$i].Chemin) : ajout refuse" } }
}

# --- calcul des remplacements
$remplacees=@{}; $converties=0; $echecs=@()
$fMod=[IO.File]::OpenRead($Pack)
try{
  foreach($e in $p.Entrees){
    if($RetirerEntrees -contains $e.Chemin){ continue }
    if($RemplacerEntrees.ContainsKey($e.Chemin)){
      $remplacees[$e.Chemin]=[IO.File]::ReadAllBytes($RemplacerEntrees[$e.Chemin])
      "  remplacee : $($e.Chemin)  ($($e.Taille) -> $($remplacees[$e.Chemin].Length) octets)"
      continue
    }
    $lignes=@($RetirerLignes | Where-Object { $_.Entree -eq $e.Chemin })
    $locs=@($RetirerLoc | Where-Object { $_.Entree -eq $e.Chemin })
    $estDb=$e.Chemin -match '^db\\([^\\]+)\\'; $table= if($estDb){$Matches[1]}else{''}
    if(-not $lignes.Count -and -not $locs.Count -and -not ($MettreANiveau -and $estDb -and $jeuParTable.ContainsKey($table))){ continue }
    $o=Read-Clair $fMod $e; $change=$false
    foreach($l in $lignes){
      $r=Remove-LignesTable -Donnees $o -ParVersion (Get-DefsPourTableLib $table) -Colonne $l.Colonne -Valeurs $l.Valeurs
      "  lignes retirees de $($e.Chemin) : $($r.Avant) -> $($r.Apres)  [$($r.Retirees -join ', ')]"
      $o=$r.Octets; $change=$true
    }
    foreach($l in $locs){
      $r=Remove-EntreesLoc -Donnees $o -Motifs $l.Motifs
      "  cles retirees de $($e.Chemin) : $($r.Avant) -> $($r.Apres)  [$($r.Retirees -join ', ')]"
      $o=$r.Octets; $change=$true
    }
    if($MettreANiveau -and $estDb -and $jeuParTable.ContainsKey($table)){
      $tj=Get-TableJeu $table; $vm=(Get-EnteteTable $o).Version
      if($vm -ne $tj.Version){
        if(-not $tj.Valide){ $echecs+="  NON CONVERTIE $($e.Chemin) v$vm -> v$($tj.Version) : le schema RPFM ne decode pas la table du jeu" }
        else {
          $c=Convert-TableVersion -Octets $o -Table $table -VersionCible $tj.Version
          if($c.Erreur){ $echecs+="  NON CONVERTIE $($e.Chemin) v$vm -> v$($tj.Version) : $($c.Erreur)" }
          else {
            $converties++; $o=$c.Octets; $change=$true
            "  v$vm -> v$($tj.Version)  $($e.Chemin)  ($($c.Lignes) lignes)" + $(if($c.Ajouts){"  ajout: $($c.Ajouts -join ' ')"}) + $(if($c.Retraits){"  retrait: $($c.Retraits -join ' ')"})
          }
        }
      }
    }
    if($change){ $remplacees[$e.Chemin]=$o }
  }
} finally { $fMod.Close(); $fJeu.Close() }
$echecs
foreach($c in $RetirerEntrees){ if(-not ($p.Entrees | Where-Object Chemin -eq $c)){ throw "entree a retirer introuvable : $c" } }
foreach($c in $ajoutees.Keys){ "  ajoutee : $c  ($($ajoutees[$c].Length) octets)" }
"  bilan : $converties table(s) convertie(s), $($echecs.Count) non convertie(s), $($remplacees.Count) entree(s) remplacee(s), $($RetirerEntrees.Count) retiree(s), $($ajoutees.Count) ajoutee(s)"
if(-not $remplacees.Count -and -not $RetirerEntrees.Count -and -not $ajoutees.Count){ "  rien a changer : pack laisse intact"; return }

# --- ecriture, puis controle entree par entree
$entrees=foreach($e in $p.Entrees){
  if($RetirerEntrees -contains $e.Chemin){ continue }
  if($remplacees.ContainsKey($e.Chemin)){ [PSCustomObject]@{Chemin=$e.Chemin;Comp=0;Taille=$remplacees[$e.Chemin].Length;Offset=0;Octets=$remplacees[$e.Chemin]} }
  else { [PSCustomObject]@{Chemin=$e.Chemin;Comp=$e.Comp;Taille=$e.Taille;Offset=$e.Offset;Octets=$null} }
}
if($ajoutees.Count){
  # Tri ordinal de toute la liste : l'index source l'etant deja (controle plus haut), seules les
  # entrees ajoutees changent de place, les autres gardent leur ordre relatif.
  $entrees=@($entrees) + @($ajoutees.Keys | ForEach-Object { [PSCustomObject]@{Chemin=$_;Comp=0;Taille=$ajoutees[$_].Length;Offset=0;Octets=$ajoutees[$_]} })
  # Piege (24/10/2026) : ecrit en une ligne, [Array]::Sort([string[]]@(...),$tab,[StringComparer]::Ordinal)
  # ne trie RIEN sous PowerShell 5.1 (une copie est triee) : l'entree ajoutee finissait en fin d'index.
  # Les cles dans une variable et le cast [IComparer] explicite font trier $tab en place. Sort-Object,
  # lui, compare selon la culture et non en ordinal.
  $tab=[object[]]$entrees; $cles=[string[]]@($tab | ForEach-Object Chemin)
  [Array]::Sort($cles,$tab,[System.Collections.IComparer][StringComparer]::Ordinal); $entrees=$tab
}
if(-not $Sortie){ $Sortie="$Pack.patch-tmp" }
Write-PackFlux -Modele $p -Entrees @($entrees) -Sortie $Sortie
$q=Read-Pack -Chemin $Sortie
Test-PackProduit -Source $p -Produit $q -Remplacees $remplacees -Retirees $RetirerEntrees -Ajoutees $ajoutees
"  controle : $($q.Entrees.Count) entrees, toutes les inchangees identiques au source, les remplacees relues"
if($Poser){
  Move-Item -LiteralPath $Sortie -Destination $Pack -Force
  "  POSE : $Pack ($([math]::Round((Get-Item -LiteralPath $Pack).Length/1MB)) Mo)"
} else { "  produit (non pose) : $Sortie" }
