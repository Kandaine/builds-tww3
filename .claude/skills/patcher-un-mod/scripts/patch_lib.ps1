# Bibliotheque du skill patcher-un-mod : ecrire un pack en flux, et mettre une table db\
# au format que le jeu attend.
#
# S'appuie sur ~/.claude/tools/tww/pack_lib.ps1 (Read-Pack) et _unpack.ps1
# (Expand-PackEntry). Ces deux fichiers sont charges par l'appelant.
#
# POURQUOI EN FLUX. Write-Pack de pack_lib demande tous les octets en memoire. Les mods
# a patcher pesaient jusqu'a 5,4 Go le 02/10/2026 (Champions of Undeath), 22 Go a eux 39 :
# on recopie donc les entrees inchangees du pack source vers le pack produit, par blocs,
# sans jamais les charger entieres.
#
# POURQUOI LE SCHEMA DE RPFM et non celui du gestionnaire de mods : le 02/10/2026, le
# second (wh3mm 2.24.0, 25/09) ignorait initiative_sets_tables v9, version introduite par
# le correctif du jeu du 01/10 ; celui de RPFM, mis a jour le jour meme, la connaissait.
# Le schema est de toute facon CONFRONTE au jeu avant usage : voir Test-DefinitionJeu.

Add-Type -TypeDefinition @"
using System;
using System.IO;
public static class TwwTable {
    // Codes de type, dans l'ordre de Get-CodeType (PowerShell).
    // 0 StringU8, 1 OptionalStringU8, 2 StringU16, 3 OptionalStringU16, 4 I16, 5 I32,
    // 6 I64, 7 F32, 8 F64, 9 Boolean, 10 ColourRGB, 11 OptionalI16, 12 OptionalI32,
    // 13 OptionalI64.

    // Renvoie la position qui suit le champ de type t commencant en p.
    public static int Skip(byte[] d, int p, int t) {
        switch (t) {
            case 0: return p + 2 + BitConverter.ToUInt16(d, p);
            case 1: return d[p] == 0 ? p + 1 : p + 3 + BitConverter.ToUInt16(d, p + 1);
            case 2: return p + 2 + 2 * BitConverter.ToUInt16(d, p);
            case 3: return d[p] == 0 ? p + 1 : p + 3 + 2 * BitConverter.ToUInt16(d, p + 1);
            case 4: return p + 2;
            case 5: return p + 4;
            case 6: return p + 8;
            case 7: return p + 4;
            case 8: return p + 8;
            case 9: return p + 1;
            case 10: return p + 4;
            case 11: return d[p] == 0 ? p + 1 : p + 3;
            case 12: return d[p] == 0 ? p + 1 : p + 5;
            case 13: return d[p] == 0 ? p + 1 : p + 9;
        }
        throw new ArgumentException("type inconnu " + t);
    }

    // Parcourt rows lignes a partir de p et renvoie la position finale, ou -1 si les
    // octets ne suivent pas la definition (debordement).
    public static int FinLignes(byte[] d, int p, int rows, int[] types) {
        try {
            for (int r = 0; r < rows; r++)
                for (int f = 0; f < types.Length; f++) { p = Skip(d, p, types[f]); if (p > d.Length) return -1; }
            return p;
        } catch (ArgumentOutOfRangeException) { return -1; }
        catch (IndexOutOfRangeException) { return -1; }
    }

    // Reecrit rows lignes au nouveau format. map[j] = index du champ d'origine qui
    // fournit le champ j, ou -1 pour prendre defaults[j]. Les champs repris sont copies
    // octet pour octet : rien de ce que le mod avait ecrit n'est re-encode.
    public static byte[] Convert(byte[] d, int p, int rows, int[] oldTypes, int[] map, byte[][] defaults) {
        MemoryStream ms = new MemoryStream();
        int[] starts = new int[oldTypes.Length + 1];
        for (int r = 0; r < rows; r++) {
            for (int f = 0; f < oldTypes.Length; f++) { starts[f] = p; p = Skip(d, p, oldTypes[f]); }
            starts[oldTypes.Length] = p;
            for (int j = 0; j < map.Length; j++) {
                int k = map[j];
                if (k >= 0) ms.Write(d, starts[k], starts[k + 1] - starts[k]);
                else ms.Write(defaults[j], 0, defaults[j].Length);
            }
        }
        if (p != d.Length) throw new InvalidDataException("octets residuels : " + p + " / " + d.Length);
        return ms.ToArray();
    }

    // Compare len octets de deux fichiers ouverts, a deux positions. Vrai si identiques.
    public static bool SameBytes(FileStream a, long pa, FileStream b, long pb, long len) {
        byte[] x = new byte[1 << 20], y = new byte[1 << 20];
        a.Seek(pa, SeekOrigin.Begin); b.Seek(pb, SeekOrigin.Begin);
        while (len > 0) {
            int n = (int)Math.Min(len, x.Length);
            int ra = 0; while (ra < n) ra += a.Read(x, ra, n - ra);
            int rb = 0; while (rb < n) rb += b.Read(y, rb, n - rb);
            for (int i = 0; i < n; i++) if (x[i] != y[i]) return false;
            len -= n;
        }
        return true;
    }

    // Recopie len octets de src (a partir de pos) vers dst, par blocs de 4 Mo.
    public static void CopyRange(FileStream src, long pos, FileStream dst, long len) {
        byte[] buf = new byte[1 << 22];
        src.Seek(pos, SeekOrigin.Begin);
        while (len > 0) {
            int n = src.Read(buf, 0, (int)Math.Min(len, buf.Length));
            if (n <= 0) throw new EndOfStreamException();
            dst.Write(buf, 0, n); len -= n;
        }
    }
}
"@

# Traduit un nom de type du schema en code TwwTable. $Type : field_type du schema.
# Leve une exception sur un type non gere plutot que de deviner sa largeur.
function Get-CodeType {
  param([string]$Type)
  $codes=@{StringU8=0;OptionalStringU8=1;StringU16=2;OptionalStringU16=3;I16=4;I32=5;I64=6;F32=7;F64=8;Boolean=9;ColourRGB=10;OptionalI16=11;OptionalI32=12;OptionalI64=13}
  if(-not $codes.ContainsKey($Type)){ throw "type de champ non gere : $Type" }
  return $codes[$Type]
}

# Charge le schema RON de RPFM une fois pour toutes. $Chemin : schema_wh3.ron ; vide =
# emplacement standard de RPFM.
function Initialize-SchemaRpfm {
  param([string]$Chemin='')
  if(-not $Chemin){ $Chemin="$env:APPDATA\FrodoWazEre\rpfm\config\schemas\schema_wh3.ron" }
  if(-not (Test-Path $Chemin)){ throw "schema RPFM introuvable : $Chemin" }
  $script:SchemaRonTexte=[IO.File]::ReadAllText($Chemin)
  $script:SchemaRonChemin=$Chemin
  $script:SchemaRonCache=@{}
}

# Renvoie les definitions d'une table dans le schema RPFM : hashtable version -> liste de
# @{Nom;Type;Code;Defaut;AUnDefaut}. $null si la table est inconnue.
# Le decoupage s'appuie sur l'indentation du RON (8 espaces avant un nom de table) et
# s'arrete a "localised_fields" : ces champs-la ne sont pas dans les octets de la table.
function Get-DefsRpfm {
  param([string]$Table)
  if($script:SchemaRonCache.ContainsKey($Table)){ return $script:SchemaRonCache[$Table] }
  $t=$script:SchemaRonTexte
  $i=$t.IndexOf("`n        `"$Table`": [")
  if($i -lt 0){ $script:SchemaRonCache[$Table]=$null; return $null }
  $m=[regex]::new('\n        "[^"]+": \[').Match($t,$i+10)
  $bloc= if($m.Success){ $t.Substring($i,$m.Index-$i) } else { $t.Substring($i) }
  $parVersion=@{}
  $morceaux=[regex]::Split($bloc,'\n            \(\s*\n\s*version: ')
  foreach($mo in $morceaux | Select-Object -Skip 1){
    $ver=[int]($mo.Substring(0,$mo.IndexOf(',')))
    $fin=$mo.IndexOf('localised_fields:'); if($fin -gt 0){ $mo=$mo.Substring(0,$fin) }
    $champs=foreach($c in [regex]::Matches($mo,'name: "([^"]*)",\s*field_type: (\w+),\s*is_key: \w+,\s*default_value: (None|Some\("((?:[^"\\]|\\.)*)"\))')){
      [PSCustomObject]@{Nom=$c.Groups[1].Value;Type=$c.Groups[2].Value;Code=(Get-CodeType $c.Groups[2].Value);
        Defaut=$c.Groups[4].Value;AUnDefaut=($c.Groups[3].Value -ne 'None')}
    }
    $parVersion[$ver]=@($champs)
  }
  $script:SchemaRonCache[$Table]=$parVersion
  return $parVersion
}

# Encode la valeur par defaut d'un champ, comme RPFM le fait pour une colonne ajoutee.
# $Champ : definition rendue par Get-DefsRpfm. Sans defaut declare : chaine vide, zero,
# faux. Un Optional* vide s'ecrit avec son seul drapeau a 0.
function Get-OctetsDefaut {
  param($Champ)
  $v=$Champ.Defaut
  $ms=New-Object IO.MemoryStream
  switch($Champ.Type){
    'StringU8'         { $b=[Text.Encoding]::UTF8.GetBytes($v); $ms.Write([BitConverter]::GetBytes([uint16]$b.Length),0,2); $ms.Write($b,0,$b.Length) }
    'OptionalStringU8' { if($v -eq ''){ $ms.WriteByte(0) } else { $b=[Text.Encoding]::UTF8.GetBytes($v); $ms.WriteByte(1); $ms.Write([BitConverter]::GetBytes([uint16]$b.Length),0,2); $ms.Write($b,0,$b.Length) } }
    'StringU16'        { $b=[Text.Encoding]::Unicode.GetBytes($v); $ms.Write([BitConverter]::GetBytes([uint16]$v.Length),0,2); $ms.Write($b,0,$b.Length) }
    'OptionalStringU16'{ if($v -eq ''){ $ms.WriteByte(0) } else { $b=[Text.Encoding]::Unicode.GetBytes($v); $ms.WriteByte(1); $ms.Write([BitConverter]::GetBytes([uint16]$v.Length),0,2); $ms.Write($b,0,$b.Length) } }
    'I16'              { $ms.Write([BitConverter]::GetBytes([int16]$(if($v){$v}else{0})),0,2) }
    'I32'              { $ms.Write([BitConverter]::GetBytes([int32]$(if($v){$v}else{0})),0,4) }
    'I64'              { $ms.Write([BitConverter]::GetBytes([int64]$(if($v){$v}else{0})),0,8) }
    'F32'              { $ms.Write([BitConverter]::GetBytes([single]$(if($v){[double]::Parse($v,[Globalization.CultureInfo]::InvariantCulture)}else{0})),0,4) }
    'F64'              { $ms.Write([BitConverter]::GetBytes([double]$(if($v){[double]::Parse($v,[Globalization.CultureInfo]::InvariantCulture)}else{0})),0,8) }
    'Boolean'          { $ms.WriteByte([byte]$(if($v -eq 'true' -or $v -eq '1'){1}else{0})) }
    'ColourRGB'        { $ms.Write([BitConverter]::GetBytes([uint32]$(if($v){[Convert]::ToUInt32($v,16)}else{0})),0,4) }
    default            { if($Champ.Type -like 'Optional*'){ $ms.WriteByte(0) } else { throw "defaut non gere pour $($Champ.Type)" } }
  }
  $o=$ms.ToArray(); $ms.Dispose(); return ,$o
}

# Lit l'en-tete d'une table db\. $Octets : la table en clair. Renvoie la partie GUID
# (recopiee telle quelle), la version (0 sans marqueur), l'octet de marque, le nombre de
# lignes et la position de la premiere ligne.
function Get-EnteteTable {
  param([byte[]]$Octets)
  $i=0
  if($Octets[0]-eq 0xFD -and $Octets[1]-eq 0xFE -and $Octets[2]-eq 0xFC -and $Octets[3]-eq 0xFF){ $i=6+2*[BitConverter]::ToUInt16($Octets,4) }
  $guid=New-Object byte[] $i; [Array]::Copy($Octets,0,$guid,0,$i)
  $ver=0
  if($Octets[$i]-eq 0xFC -and $Octets[$i+1]-eq 0xFD -and $Octets[$i+2]-eq 0xFE -and $Octets[$i+3]-eq 0xFF){ $ver=[int][BitConverter]::ToUInt32($Octets,$i+4); $i+=8 }
  $marque=$Octets[$i]; $i+=1
  $nb=[int][BitConverter]::ToUInt32($Octets,$i); $i+=4
  return [PSCustomObject]@{Guid=$guid;Version=$ver;Marque=$marque;Lignes=$nb;Debut=$i}
}

# Verifie qu'une definition du schema decrit bien la table du JEU a cette version :
# decoder toutes ses lignes doit consommer ses octets exactement. $Table : nom db\ ;
# $Version : version du jeu ; $OctetsJeu : les tables du jeu en clair (plusieurs
# fichiers possibles). Renvoie $true / $false. C'est le garde-fou contre un schema faux
# ou en retard : une table convertie sur une definition non verifiee serait refusee par
# le jeu, ou pire, lue de travers.
function Test-DefinitionJeu {
  param([string]$Table,[int]$Version,$OctetsJeu)
  $defs=Get-DefsRpfm $Table
  if(-not $defs -or -not $defs.ContainsKey($Version)){ return $false }
  $types=[int[]]@($defs[$Version] | ForEach-Object Code)
  foreach($o in $OctetsJeu){
    $h=Get-EnteteTable $o
    if($h.Version -ne $Version){ return $false }
    $fin=[int][TwwTable]::FinLignes([byte[]]$o,[int]$h.Debut,[int]$h.Lignes,[int[]]$types)
    if($fin -ne $o.Length){ return $false }
  }
  return $true
}

# Convertit une table d'un mod a la version du jeu. $Octets : table en clair ; $Table :
# nom db\ ; $VersionCible : version du jeu. Renvoie @{Octets;Ajouts;Retraits;Erreur}.
# Correspondance des champs par NOM, comme RPFM : un champ conserve qui change de type
# fait echouer la conversion (Erreur renseignee) au lieu d'etre reinterprete.
function Convert-TableVersion {
  param([byte[]]$Octets,[string]$Table,[int]$VersionCible)
  $defs=Get-DefsRpfm $Table
  $h=Get-EnteteTable $Octets
  if(-not $defs){ return [PSCustomObject]@{Erreur="table inconnue du schema"} }
  if(-not $defs.ContainsKey($h.Version)){ return [PSCustomObject]@{Erreur="version d'origine v$($h.Version) inconnue du schema"} }
  if(-not $defs.ContainsKey($VersionCible)){ return [PSCustomObject]@{Erreur="version cible v$VersionCible inconnue du schema"} }
  $ancien=$defs[$h.Version]; $neuf=$defs[$VersionCible]
  $typesAnciens=[int[]]@($ancien | ForEach-Object Code)
  # La methode s'appelle FinLignes et non End : "end" est un mot-cle de PowerShell, et
  # [TwwTable]::End(...) leve sous 5.1 "le type de resultat System.Int32 ... n'est pas
  # compatible", quels que soient les types passes. Constate le 02/10/2026.
  $fin=[int][TwwTable]::FinLignes([byte[]]$Octets,[int]$h.Debut,[int]$h.Lignes,[int[]]$typesAnciens)
  if($fin -ne $Octets.Length){ return [PSCustomObject]@{Erreur="la table ne suit pas la definition v$($h.Version)"} }
  $map=New-Object int[] $neuf.Count; $defauts=New-Object 'byte[][]' $neuf.Count; $ajouts=@()
  for($j=0;$j -lt $neuf.Count;$j++){
    $k=-1; for($x=0;$x -lt $ancien.Count;$x++){ if($ancien[$x].Nom -eq $neuf[$j].Nom){ $k=$x; break } }
    if($k -ge 0 -and $ancien[$k].Type -ne $neuf[$j].Type){ return [PSCustomObject]@{Erreur="champ $($neuf[$j].Nom) change de type ($($ancien[$k].Type) -> $($neuf[$j].Type))"} }
    $map[$j]=$k
    if($k -lt 0){ $defauts[$j]=Get-OctetsDefaut $neuf[$j]; $ajouts+="$($neuf[$j].Nom)=$($neuf[$j].Defaut)" } else { $defauts[$j]=[byte[]]@() }
  }
  $retraits=@($ancien | Where-Object { $n=$_.Nom; -not ($neuf | Where-Object Nom -eq $n) } | ForEach-Object Nom)
  [byte[]]$lignes=[TwwTable]::Convert([byte[]]$Octets,[int]$h.Debut,[int]$h.Lignes,[int[]]$typesAnciens,[int[]]$map,[byte[][]]$defauts)
  $ms=New-Object IO.MemoryStream
  $ms.Write($h.Guid,0,$h.Guid.Length)
  $ms.Write([byte[]](0xFC,0xFD,0xFE,0xFF),0,4); $ms.Write([BitConverter]::GetBytes([uint32]$VersionCible),0,4)
  $ms.WriteByte($h.Marque); $ms.Write([BitConverter]::GetBytes([uint32]$h.Lignes),0,4)
  $ms.Write($lignes,0,$lignes.Length)
  $o=$ms.ToArray(); $ms.Dispose()
  # relecture : la table produite doit se decoder exactement avec la definition cible
  $h2=Get-EnteteTable $o
  $fin2=[int][TwwTable]::FinLignes([byte[]]$o,[int]$h2.Debut,[int]$h2.Lignes,[int[]]@($neuf | ForEach-Object Code))
  if($h2.Version -ne $VersionCible -or $h2.Lignes -ne $h.Lignes -or $fin2 -ne $o.Length){
    return [PSCustomObject]@{Erreur="relecture de la table convertie en echec"} }
  return [PSCustomObject]@{Octets=$o;Ajouts=$ajouts;Retraits=$retraits;Lignes=$h.Lignes;Erreur=$null}
}

# Construit l'en-tete et l'index d'un pack pour une liste d'entrees {Chemin;Comp;Taille}.
# $Modele : pack lu par Read-Pack, dont on recopie l'en-tete (seuls le nombre de fichiers
# et la taille de l'index changent) et le bloc de dependances. Renvoie les octets.
function Get-OctetsTetePack {
  param($Modele,$Entrees)
  $idx=New-Object IO.MemoryStream
  foreach($e in $Entrees){
    $idx.Write([BitConverter]::GetBytes([uint32]$e.Taille),0,4); $idx.WriteByte([byte]$e.Comp)
    $c=[Text.Encoding]::UTF8.GetBytes($e.Chemin); $idx.Write($c,0,$c.Length); $idx.WriteByte(0)
  }
  $oi=$idx.ToArray(); $idx.Dispose()
  $ent=[byte[]]$Modele.Entete.Clone()
  [Array]::Copy([BitConverter]::GetBytes([uint32]@($Entrees).Count),0,$ent,16,4)
  [Array]::Copy([BitConverter]::GetBytes([uint32]$oi.Length),0,$ent,20,4)
  $ms=New-Object IO.MemoryStream
  $ms.Write($ent,0,28); if($Modele.Dep.Length){ $ms.Write($Modele.Dep,0,$Modele.Dep.Length) }; $ms.Write($oi,0,$oi.Length)
  $o=$ms.ToArray(); $ms.Dispose(); return ,$o
}

# Aller-retour a vide, sans recopier le pack. Equivalent au test "reecrire a l'identique
# et comparer les empreintes" de EDITER-UN-PACK.md, a un cout negligeable sur 5 Go :
# l'ecrivain en flux recopie les donnees par position, donc seule la tete (en-tete +
# dependances + index) est reconstruite. On exige qu'elle soit identique au bit pres,
# et que les entrees soient contigues et remplissent le fichier jusqu'au dernier octet.
# $Pack : pack lu par Read-Pack (sans les octets). Leve une exception sinon.
function Test-AllerRetourVide {
  param($Pack)
  $tete=Get-OctetsTetePack -Modele $Pack -Entrees $Pack.Entrees
  $fs=[IO.File]::OpenRead($Pack.Chemin)
  try{ $orig=New-Object byte[] $tete.Length; [void]$fs.Read($orig,0,$orig.Length) } finally { $fs.Close() }
  if(-not [Linq.Enumerable]::SequenceEqual($tete,$orig)){ throw "aller-retour a vide : tete reconstruite differente de l'originale" }
  $pos=[int64]$tete.Length
  foreach($e in $Pack.Entrees){ if($e.Offset -ne $pos){ throw "entrees non contigues a $($e.Chemin)" }; $pos+=$e.Taille }
  if($pos -ne $Pack.Taille){ throw "le pack a $($Pack.Taille - $pos) octet(s) apres la derniere entree" }
}

# Ecrit un pack en flux. $Modele : pack source lu par Read-Pack ; $Entrees : liste
# d'objets {Chemin;Comp;Taille;Offset;Octets} -- Octets renseigne pour une entree
# remplacee (ecrite telle quelle, Comp 0 attendu), $null pour une entree recopiee du
# source a son Offset. $Sortie : fichier produit.
function Write-PackFlux {
  param($Modele,$Entrees,[string]$Sortie)
  $tete=Get-OctetsTetePack -Modele $Modele -Entrees $Entrees
  $src=[IO.File]::OpenRead($Modele.Chemin); $dst=[IO.File]::Create($Sortie)
  try{
    $dst.Write($tete,0,$tete.Length)
    foreach($e in $Entrees){
      if($null -ne $e.Octets){ $dst.Write($e.Octets,0,$e.Octets.Length) }
      else { [TwwTable]::CopyRange($src,[int64]$e.Offset,$dst,[int64]$e.Taille) }
    }
  } finally { $dst.Close(); $src.Close() }
}

# Controle le pack produit entree par entree. $Source et $Produit : packs lus par
# Read-Pack ; $Remplacees : hashtable chemin -> octets attendus. Toute entree non
# remplacee doit etre identique, octets compris, a celle du source. Leve une exception
# sinon. C'est ce controle qui attrape une erreur d'index.
function Test-PackProduit {
  param($Source,$Produit,$Remplacees,[string[]]$Retirees=@())
  $attendues=@($Source.Entrees | Where-Object { $Retirees -notcontains $_.Chemin })
  if($Produit.Entrees.Count -ne $attendues.Count){ throw "nombre d'entrees : $($Produit.Entrees.Count) au lieu de $($attendues.Count)" }
  $fa=[IO.File]::OpenRead($Source.Chemin); $fb=[IO.File]::OpenRead($Produit.Chemin)
  try{
    for($i=0;$i -lt $attendues.Count;$i++){
      $a=$attendues[$i]; $b=$Produit.Entrees[$i]
      if($a.Chemin -ne $b.Chemin){ throw "ordre rompu a l'entree $i : $($a.Chemin) / $($b.Chemin)" }
      if($Remplacees.ContainsKey($a.Chemin)){
        $o=$Remplacees[$a.Chemin]; $lu=New-Object byte[] $b.Taille; $fb.Seek($b.Offset,'Begin')|Out-Null; [void]$fb.Read($lu,0,$lu.Length)
        if($b.Comp -ne 0 -or -not [Linq.Enumerable]::SequenceEqual([byte[]]$o,$lu)){ throw "entree remplacee mal ecrite : $($a.Chemin)" }
      } else {
        $pareil=[bool][TwwTable]::SameBytes($fa,[int64]$a.Offset,$fb,[int64]$b.Offset,[int64]$a.Taille)
        if($a.Comp -ne $b.Comp -or $a.Taille -ne $b.Taille -or -not $pareil){ throw "entree alteree : $($a.Chemin)" }
      }
    }
  } finally { $fa.Close(); $fb.Close() }
}
