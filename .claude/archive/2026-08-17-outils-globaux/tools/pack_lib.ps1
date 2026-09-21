# Lecture ET ECRITURE d'un .pack TWW3 (PFH5/PFH4).
#
# Pourquoi ce fichier existe : tous les outils du dossier tww\ savent LIRE un pack,
# aucun ne sait en ecrire un. Retirer un seigneur qu'un mod impose a une faction
# demande d'editer une copie du pack source -- il n'y a pas d'autre voie (teste en
# aout 2026 : ni l'ordre de chargement, ni un pack tiers, ni un script ne le font).
#
# PARTI PRIS : ce qui n'est pas modifie est recopie OCTET POUR OCTET, sous sa forme
# stockee, sans jamais passer par decompression/recompression. Je n'ai pas de
# compresseur ; et meme si j'en avais un, re-encoder 820 entrees pour en changer deux
# multiplierait les occasions de produire un pack qui se charge mais se comporte mal.
#
# Les entrees MODIFIEES, elles, sont ecrites en clair avec le drapeau 0. Le format le
# permet : le pack source de LYH contient deja 3 entrees a drapeau 0 sur 824, donc le
# jeu lit bien les deux formes dans un meme pack.
#
# Disposition d'un PFH5, verifiee sur !!!lyh_hero.pack le 21/09/2026 :
#   0..3    magie "PFH5"
#   4..7    bitmask (vaut 3 ici)
#   8..11   version
#   12..15  taille du bloc de dependances (0 ici)
#   16..19  nombre de fichiers
#   20..23  taille de l'index
#   24..27  horodatage
#   puis    bloc de dependances, index, donnees
# Index, une entree : taille (u32) + drapeau de compression (u8) + chemin ASCII
# termine par un zero. PAS d'horodatage par entree ici -- verifie en constatant que
# l'index se consomme exactement (48439/48439 octets). Un pack qui en aurait laisserait
# des octets en trop : le controle est dans Read-Pack, ne pas le retirer.

# Lit un pack et renvoie son en-tete, son bloc de dependances et la liste de ses
# entrees. $ChargerOctets a $true charge aussi les octets stockes de chaque entree
# (forme brute, compressee si elle l'etait) -- necessaire pour reecrire.
function Read-Pack {
  param([Parameter(Mandatory=$true)][string]$Chemin, [switch]$ChargerOctets)
  $fs=[IO.File]::OpenRead($Chemin); $br=New-Object IO.BinaryReader($fs)
  try{
    $entete=$br.ReadBytes(28)
    $magie=[Text.Encoding]::ASCII.GetString($entete[0..3])
    if($magie -ne 'PFH5' -and $magie -ne 'PFH4'){ throw "format inconnu : $magie" }
    $tailleDep=[BitConverter]::ToUInt32($entete,12)
    $nbFichiers=[BitConverter]::ToUInt32($entete,16)
    $tailleIdx=[BitConverter]::ToUInt32($entete,20)
    $dep=$br.ReadBytes([int]$tailleDep)
    $ib=$br.ReadBytes([int]$tailleIdx)
    $debutDonnees=[int64](28+$tailleDep+$tailleIdx)
    $p=0; $off=$debutDonnees; $entrees=New-Object System.Collections.ArrayList
    for($i=0;$i -lt $nbFichiers;$i++){
      $taille=[BitConverter]::ToUInt32($ib,$p); $p+=4
      $comp=$ib[$p]; $p+=1
      $st=$p; while($ib[$p] -ne 0){ $p++ }
      $chemin=[Text.Encoding]::ASCII.GetString($ib,$st,$p-$st); $p++
      [void]$entrees.Add([PSCustomObject]@{Chemin=$chemin;Taille=$taille;Comp=$comp;Offset=$off;Octets=$null})
      $off+=$taille
    }
    # Si l'index ne se consomme pas exactement, la disposition n'est pas celle qu'on
    # suppose (horodatage par entree, par exemple) et tout le reste serait faux.
    if($p -ne $tailleIdx){ throw "index non consomme : $p / $tailleIdx octets -- disposition inattendue" }
    if($ChargerOctets){
      foreach($e in $entrees){
        $fs.Seek($e.Offset,'Begin')|Out-Null
        $e.Octets=$br.ReadBytes([int]$e.Taille)
      }
    }
    return [PSCustomObject]@{Entete=$entete;Dep=$dep;Entrees=$entrees;Chemin=$Chemin;Taille=$fs.Length}
  } finally { $br.Close(); $fs.Close() }
}

# Ecrit un pack a partir d'une liste d'entrees {Chemin, Comp, Octets}.
# L'en-tete est recopie tel quel du pack d'origine, seuls le nombre de fichiers et la
# taille de l'index sont recalcules : tout le reste (bitmask, version, horodatage) est
# une information du mod qu'on n'a aucune raison de toucher.
function Write-Pack {
  param([Parameter(Mandatory=$true)]$Modele,
        [Parameter(Mandatory=$true)]$Entrees,
        [Parameter(Mandatory=$true)][string]$Sortie)
  $idx=New-Object System.IO.MemoryStream
  foreach($e in $Entrees){
    $idx.Write([BitConverter]::GetBytes([uint32]$e.Octets.Length),0,4)
    $idx.WriteByte([byte]$e.Comp)
    $chemin=[Text.Encoding]::ASCII.GetBytes($e.Chemin)
    $idx.Write($chemin,0,$chemin.Length)
    $idx.WriteByte(0)
  }
  $octetsIdx=$idx.ToArray(); $idx.Dispose()
  $entete=[byte[]]$Modele.Entete.Clone()
  [Array]::Copy([BitConverter]::GetBytes([uint32]@($Entrees).Count),0,$entete,16,4)
  [Array]::Copy([BitConverter]::GetBytes([uint32]$octetsIdx.Length),0,$entete,20,4)
  $fs=[IO.File]::Create($Sortie)
  try{
    $fs.Write($entete,0,28)
    if($Modele.Dep.Length){ $fs.Write($Modele.Dep,0,$Modele.Dep.Length) }
    $fs.Write($octetsIdx,0,$octetsIdx.Length)
    foreach($e in $Entrees){ $fs.Write($e.Octets,0,$e.Octets.Length) }
  } finally { $fs.Close() }
}
