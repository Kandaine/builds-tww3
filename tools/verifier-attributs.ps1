# =============================================================================
# verifier-attributs.ps1 — confronte les attributs qu'une NOTE prête à une unité
# à ceux que le jeu lui donne réellement. Cinquième contrôle, à côté de
# verifier-effets.ps1 : informatif, jamais bloquant.
#
# LE DÉFAUT QU'IL CHERCHE. Une note peut décrire une unité comme volante,
# régénérante ou incassable alors qu'elle ne l'est pas. Les slots restent
# justes, les icônes aussi : aucun des quatre autres validateurs ne le voit.
# Le lecteur, lui, bâtit son armée sur une propriété qui n'existe pas.
#
# Ce n'est pas théorique. Quatre cas trouvés à la main les 18 et 19/08/2026 :
#   Miao Ying   « ne jamais se fatiguer » prêté aux Great Longma Riders —
#               l'immunité venait du régiment favori, réservé aux Righteous
#               Lances.
#   Volkmar     « sa Régénération, rare chez les seigneurs de l'Empire » — il
#               n'en a aucune ; sa solidité vient d'`unbreakable` sur l'Autel.
#   Kroll       le Jabberslythe décrit comme volant — il a `ignore_trees`, pas
#               `flying`. La confusion est facile : les deux traversent la forêt.
#   Isabella    la Régénération du Direpack écrite comme intrinsèque — elle
#               vient de son effet de régiment favori, et disparaît ailleurs.
#
# CE QUI EST CONTRÔLÉ. Pour chaque ligne de build, le nom affiché est résolu
# vers tools\attributs-unites.txt, puis chaque revendication repérée dans la
# note est confrontée à l'attribut qu'elle exige. Seules les revendications
# AFFIRMÉES ET ABSENTES sont signalées.
#
# ── DEUX AFFINAGES SANS LESQUELS LE BRUIT NOIE LE SIGNAL ────────────────────
# 1. LE SENS DE LA PHRASE. « cause la Peur » exige causes_fear ; « insensible à
#    la Peur » affirme exactement l'inverse et ne doit rien exiger. Sans le
#    verbe de causation, quatre lignes de Wolfram Hertwig étaient signalées
#    alors qu'elles disaient le contraire de ce qu'on leur reprochait.
# 2. LA SOURCE DE L'ATTRIBUT. Une note l'attribue souvent à un effet plutôt
#    qu'à l'unité — « Immunisée à la Psychologie (seigneur) », « concernés par
#    "Feasting on Fear" ». L'unité n'a alors aucune raison de le porter en
#    propre. On découpe donc la note en fragments et on ignore ceux qui
#    nomment leur source : parenthèse (seigneur)/(faction), mot nu, ou capacité
#    entre guillemets.
#
# CE QUE CETTE SECONDE RÈGLE COÛTE, ET POURQUOI ON L'ACCEPTE. Elle peut taire
# une note qui attribuerait à tort un attribut à un effet inexistant. C'est un
# choix : ce défaut-là relève de verifier-effets.ps1, qui confronte le champ
# `effects` au build. Ici on cherche les attributs prêtés à l'UNITÉ.
#
# ── LIMITES ASSUMÉES, À LIRE AVANT DE LUI FAIRE CONFIANCE ───────────────────
# CE N'EST PAS UN VALIDATEUR, c'est une liste à relire. Il sort toujours 0.
# Sur les 53 lignes de la première passe, 51 étaient des faux positifs : la
# note parlait des Slayers d'Ungrim, des cavaliers de Ghorros, ou attribuait
# correctement l'effet au seigneur sans parenthèses. Deux étaient de vrais
# défauts. Ce rapport-là justifie l'outil ; il ne justifie pas d'en faire un
# bloquant.
#
# IL NE VOIT QUE LE JEU DE BASE. Environ 1450 lignes du site portent une unité
# ajoutée par un mod, dont les tables vivent dans un autre pack : plus du tiers
# du site, pages entières comprises (Araby, Albion). Elles sont comptées à part
# et le script ne dit RIEN d'elles — une absence de signalement n'est pas un
# certificat.
#
# IL NE VOIT QUE CE QU'IL SAIT NOMMER. La table des revendications ci-dessous
# est écrite à la main. Un attribut absent de cette table ne sera jamais
# contrôlé, même s'il est affirmé à tort.
#
# « Slayer » a été RETIRÉ de la table : sur cinq signalements, cinq faux
# positifs — « un tueur d'infanterie », « la horde de Slayers d'Ungrim ». Le
# mot est trop courant dans la prose pour discriminer quoi que ce soit.
#
# DEUX FAMILLES DE SOIN, à ne pas confondre. `regeneration` soigne en continu ;
# `the_hunger`, chez les Comtes Vampires, soigne en tuant. Les avoir mélangées
# faisait signaler quatre Varghulf à tort. Quand une note dit « régénérant »
# d'une unité qui a The Hunger, le rapport le précise au lieu de l'accuser :
# la note est imprécise, pas fausse.
#
# Usage :  powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-attributs.ps1
#          powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-attributs.ps1 -Faction empire
# Sortie :  toujours 0. Le rapport se lit, il ne se réussit pas.
# =============================================================================

param([string]$Faction = '')

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

# Normalisation commune à tout le dépôt : apostrophes et tirets typographiques
# ramenés à l'ASCII, sans quoi « Zintler's » du JSON ne rejoint jamais
# « Zintler's » de la loc.
function Normaliser([string]$s) {
    if (-not $s) { return '' }
    $s.Replace([char]0x2019, "'").Replace([char]0x2018, "'").Replace([char]0x2013, '-').Replace([char]0x2014, '-').Trim().ToLower()
}

# Nom d'unité -> attributs, lus dans le fichier de référence du dépôt.
$reference = Join-Path $PSScriptRoot 'attributs-unites.txt'
if (-not (Test-Path $reference)) {
    Write-Output "ERREUR : tools\attributs-unites.txt est introuvable. Voir son en-tête pour le régénérer."
    exit 0
}
$attributs = @{}
foreach ($ligne in [System.IO.File]::ReadAllLines($reference, [System.Text.Encoding]::UTF8)) {
    if (-not $ligne -or $ligne.StartsWith('#')) { continue }
    $bouts = $ligne -split "`t", 2
    if ($bouts.Count -lt 2) { continue }
    $ensemble = @{}
    foreach ($a in ($bouts[1] -split ',')) { $ensemble[$a.Trim()] = $true }
    $attributs[(Normaliser $bouts[0])] = $ensemble
}

# CE QU'UNE NOTE PEUT AFFIRMER, et l'attribut que ça exige.
# `motif` est cherché dans la note ; `attrs` liste les attributs dont AU MOINS
# un doit être présent. Ajouter une entrée ici est la façon d'étendre le
# contrôle — les 59 attributs réels sont listés par attributs-unites.txt.
$revendications = @(
  @{ motif = 'r[ée]g[ée]n[ée]r'                                     ; attrs = @('regeneration')                  ; nom = 'Régénération' }
  @{ motif = 'incassable|unbreakable'                               ; attrs = @('unbreakable')                   ; nom = 'Incassable' }
  # Verbe de causation obligatoire : « cause la Peur », pas « insensible à la Peur ».
  @{ motif = 'caus[a-zé]+ la <?[a-z]*>?\s*Peur|provoque la .{0,14}Peur'       ; attrs = @('causes_fear', 'causes_terror') ; nom = 'cause la Peur' }
  @{ motif = 'caus[a-zé]+ la <?[a-z]*>?\s*Terreur|provoque la .{0,14}Terreur' ; attrs = @('causes_terror')         ; nom = 'cause la Terreur' }
  # « vole » est écarté : en français le verbe veut dire dérober autant que planer.
  # Great-King-Lord Bezer « vole l'XP des autres seigneurs » était signalé comme
  # une créature volante. On ne perd rien — le seul vrai défaut trouvé par ce
  # motif, le Jabberslythe de Kroll, disait « monstre volant » et « pointe volante ».
  @{ motif = 'volant|volante'                                       ; attrs = @('flying', 'always_flying')       ; nom = 'Vol' }
  @{ motif = 'immunit[ée] psychologique|immunis[ée]e? [àa] la psychologie' ; attrs = @('immune_to_psychology')    ; nom = 'Immunité psychologique' }
  @{ motif = 'sans (jamais )?se fatiguer|immunit[ée] [àa] la fatigue'; attrs = @('fatigue_immune')                ; nom = 'Immunité à la Fatigue' }
  # « quasi invulnérable » est de la prose, pas une revendication d'attribut.
  @{ motif = '(?<!quasi |presque )invuln[ée]rable'                  ; attrs = @('invulnerable')                   ; nom = 'Invulnérable' }
  @{ motif = 'rampage|furie incontr[ôo]l'                           ; attrs = @('rampage')                        ; nom = 'Rampage' }
  @{ motif = 'charge glorieuse'                                     ; attrs = @('glorious_charge')                ; nom = 'Charge Glorieuse' }
  @{ motif = 'bouclier antimissile|bloque les projectiles'          ; attrs = @('can_block_missiles_360')         ; nom = 'Blocage 360' }
  @{ motif = 'v[ée]hicule blind[ée]|armoured vehicle'               ; attrs = @('armoured_vehicle')               ; nom = 'Véhicule blindé' }
  @{ motif = 'strider|sans p[ée]nalit[ée] de terrain'               ; attrs = @('strider')                        ; nom = 'Strider' }
  @{ motif = 'guerrilla deploy|d[ée]ploiement d.embuscade'          ; attrs = @('guerrilla_deploy', 'stalk')      ; nom = 'Déploiement d''embuscade' }
  @{ motif = 'flanqueur d[ée]vastateur|devastating flanker'         ; attrs = @('devastating_flanker')            ; nom = 'Flanqueur dévastateur' }
  @{ motif = 'briseur de mur|wallbreaker'                           ; attrs = @('wallbreaker')                    ; nom = 'Wallbreaker' }
)

$fichiers = if ($Faction) { @(Join-Path $Root "data\$Faction.json") } else { Get-ChildItem (Join-Path $Root 'data\*.json') | Sort-Object Name | ForEach-Object { $_.FullName } }

$aRelire = 0
$horsJeuDeBase = 0

foreach ($fichier in $fichiers) {
    if (-not (Test-Path $fichier)) { Write-Output "ERREUR : $fichier introuvable"; continue }
    $page = [System.IO.Path]::GetFileNameWithoutExtension($fichier)
    # ConvertFrom-Json rend un tableau JSON comme UN SEUL objet de pipeline :
    # on passe par une variable avant d'itérer, sinon la boucle tourne une fois
    # sur le tableau entier.
    $fiches = [System.IO.File]::ReadAllText($fichier, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    $enTeteEcrit = $false

    foreach ($seigneur in @($fiches)) {
        foreach ($u in (@($seigneur.build.lord) + @($seigneur.build.heroes) + @($seigneur.build.army))) {
            if (-not $u.name -or -not $u.note) { continue }
            # Le suffixe « (Héros Légendaire) » est une convention du site, pas
            # une partie du nom de l'unité dans le jeu.
            $nom = Normaliser ($u.name -replace '\s*\((H[ée]ro[ïs][^)]*)\)', '')
            if (-not $attributs.ContainsKey($nom)) { $horsJeuDeBase++; continue }
            $possede = $attributs[$nom]

            # Découpage en fragments : une revendication ne vaut que pour la
            # proposition qui la porte, pas pour la note entière.
            $fragments = [regex]::Split($u.note, '[;.]|&mdash;|—')

            foreach ($rev in $revendications) {
                if ($u.note -notmatch $rev.motif) { continue }
                $porteurs = @($fragments | Where-Object { $_ -match $rev.motif })
                # Attribué à une SOURCE plutôt qu'à l'unité : l'unité n'a alors
                # aucune raison de porter l'attribut elle-même. Trois formes,
                # toutes rencontrées dans les fiches :
                #   « ... (seigneur) », « ... (faction) »          → parenthèse
                #   « le -20% du seigneur ne couvre que ... »      → mot nu
                #   « concernés par "Feasting on Fear" »           → capacité nommée
                # La troisième compte : l'effet de faction de Sss'el'ari accorde
                # bien une Régénération passive à ses démons, et ses notes le
                # disent correctement en nommant la capacité.
                $viaSource = $false
                foreach ($f in $porteurs) {
                    if ($f -match '(?i)\b(seigneur|faction)\b') { $viaSource = $true }
                    if ($f -match '"[^"]+"|«[^»]+»') { $viaSource = $true }
                }
                if ($viaSource) { continue }

                # DÉMENTI EXPLICITE. Le site a un idiome récurrent pour prévenir
                # qu'un bonus ne s'applique PAS : « Attention : ... ne vaut que
                # pour les Righteous Lances, pas pour ces montures-ci », « Il ne
                # vole pas ». Sans cette garde, le contrôle signale les notes
                # qu'on vient précisément de corriger pour lever l'ambiguïté —
                # c'est arrivé sur Miao Ying et sur Kroll le 19/08/2026.
                $dementi = $false
                foreach ($f in $porteurs) {
                    if ($f -match "(?i)\bne\s+\w+\s+pas\b|\bne\s+(vaut|couvre|vise|concerne|touche)\b|\bpas pour\b|\bn'en (a|ont) (pas|aucune?)\b|\bsans (jamais )?(r[ée]g[ée]n|voler)") { $dementi = $true }
                }
                if ($dementi) { continue }

                $ok = $false
                foreach ($a in $rev.attrs) { if ($possede.ContainsKey($a)) { $ok = $true } }
                if ($ok) { continue }

                # Nuance plutôt qu'accusation : un Varghulf décrit comme
                # « régénérant » n'est pas faux, il est imprécis. Il se soigne
                # en tuant (The Hunger), pas en continu. Le dire vaut mieux que
                # de le compter comme un défaut.
                $precision = ''
                if ($rev.nom -eq 'Régénération' -and $possede.ContainsKey('the_hunger')) {
                    $precision = "  [a The Hunger — soin en tuant, pas en continu]"
                }

                if (-not $enTeteEcrit) { Write-Output ""; Write-Output "== $page"; $enTeteEcrit = $true }
                Write-Output ("   {0,-24} {1,-40} affirme « {2} »{3}" -f $seigneur.name, $u.name, $rev.nom, $precision)
                foreach ($f in $porteurs) {
                    Write-Output ("        ..." + ((($f -replace '<[^>]+>', '') -replace '\s+', ' ').Trim()))
                }
                $aRelire++
            }
        }
    }
}

Write-Output ""
Write-Output ("{0} ligne(s) à relire — attendez-vous à une majorité de faux positifs, voir l'en-tête." -f $aRelire)
Write-Output ("{0} ligne(s) portent une unité absente du jeu de base : le contrôle ne dit rien d'elles." -f $horsJeuDeBase)
exit 0
