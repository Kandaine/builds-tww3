// ============================================================================
// units/vampire-counts.js — images d'unites de la faction « vampire-counts », et d'elle seule.
//
// Charge uniquement par vampire_counts.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/vampire-counts.json ; la valeur est le chemin de l'image reelle.
//
// Ses entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js. Leur nombre n'est pas
// ecrit ici : il change avec les fiches, et le chiffre du decoupage s'etait perime.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/vampire-counts.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  vlad: 'assets/portraits/vlad.png',
  isabella: 'assets/portraits/isabella.png',
  mannfred: 'assets/portraits/mannfred.png',
  kemmler: 'assets/portraits/kemmler.png',
  ghorst: 'assets/portraits/ghorst.png',
  necromancer: 'assets/units/necromancer.png',
  vampireHeroDeath: 'assets/units/vampireHeroDeath.png',
  vampireHeroShadows: 'assets/units/vampireHeroShadows.png',
  // Vampire Counts — Héros Légendaires du mod « Heroes of Legend » :
  // les trois lieutenants que Mannfred a choisis pour son armée sylvanienne.
  vmpHelmutVonCarstein: 'assets/units/vmpHelmutVonCarstein.png',
  vmpGorgivichKrakvald: 'assets/units/vmpGorgivichKrakvald.png',
  vmpGuntherVonGrecht: 'assets/units/vmpGuntherVonGrecht.png',
  graveGuard: 'assets/units/graveGuard.png',
  blackKnight: 'assets/units/blackKnight.png',
  terrorgheist: 'assets/units/terrorgheist.png',
  vargheist: 'assets/units/vargheist.png',
  mortisEngine: 'assets/units/mortisEngine.png',
  direWolf: 'assets/units/direWolf.png',
  cairnWraith: 'assets/units/cairnWraith.png',
  blackCoach: 'assets/units/blackCoach.png',
  hexwraith: 'assets/units/hexwraith.png',
  theChillgheists: 'assets/units/theChillgheists.png',
  gothardUndyingKnight: 'assets/units/gothardUndyingKnight.png',
  obadiahGlothman: 'assets/units/obadiahGlothman.png',
  skeleton: 'assets/units/skeleton.png',
  konigsteinStalkers: 'assets/units/konigsteinStalkers.png',
  cryptGhoul: 'assets/units/cryptGhoul.png',
  varghulf: 'assets/units/varghulf.png',
  zombie: 'assets/units/zombie.png',
  theTithe: 'assets/units/theTithe.png',
  krell: 'assets/units/krell.png',
  warHydra: 'assets/units/warHydra.png',
  animatedHulks: 'assets/units/animatedHulks.png',
  kharibdyss: 'assets/units/kharibdyss.png',
  blackDragon: 'assets/units/blackDragon.png',
  waldakirRahtep: 'assets/portraits/waldakirRahtep.png',
  voragBloodytooth: 'assets/portraits/voragBloodytooth.png',
  blackKnightsLancesBarding: 'assets/units/blackKnightsLancesBarding.png',
  corpseCartLodestone: 'assets/units/corpseCartLodestone.png',
  kloveniers: 'assets/units/kloveniers.png',
  goedendagers: 'assets/units/goedendagers.png',
  aliciaVonUnterwald: 'assets/units/aliciaVonUnterwald.png',
  cryptGhouls: 'assets/units/cryptGhouls.png',
  zombies: 'assets/units/zombies.png',
  rottingPrometheans: 'assets/units/rottingPrometheans.png',
  rottingLeviathan: 'assets/units/rottingLeviathan.png',
  giantWolves: 'assets/units/giantWolves.png',
  sternsmen: 'assets/units/sternsmen.png',
  feastersInTheDusk: 'assets/units/feastersInTheDusk.png',
  theDirepack: 'assets/units/theDirepack.png',
  devilsOfSwartzhafen: 'assets/units/devilsOfSwartzhafen.png',
  aucassin: 'assets/units/aucassin.png',
  bougars: 'assets/units/bougars.png',
  eustache: 'assets/units/eustache.png',
  nicolete: 'assets/units/nicolete.png',
  mslDamsel: 'assets/units/mslDamsel.png',
  abhorash: 'assets/units/abhorash.png',
  mikaelHarkon: 'assets/units/mikaelHarkon.png',
  bloodDragonKastellan: 'assets/units/bloodDragonKastellan.png',
  disciplesOfThePathInnerCircle: 'assets/units/disciplesOfThePathInnerCircle.png',
  disciplesOfThePathKnights: 'assets/units/disciplesOfThePathKnights.png',
  disciplesOfThePathWarriors: 'assets/units/disciplesOfThePathWarriors.png',
  bloodDragonLancer: 'assets/units/bloodDragonLancer.png',
  bloodDragonVanguard: 'assets/units/bloodDragonVanguard.png',
  bloodDragonElder: 'assets/units/bloodDragonElder.png',
  bloodDragonSentinel: 'assets/units/bloodDragonSentinel.png',
  bloodDragonVarghulf: 'assets/units/bloodDragonVarghulf.png',
  bloodKnights: 'assets/units/bloodKnights.png',
  abyssalTerrorBD: 'assets/units/abyssalTerrorBD.png',
  theNightTerrors: 'assets/units/theNightTerrors.png',
  jiangWightKing: 'assets/units/jiangWightKing.png',
  jiangNecromancer: 'assets/units/jiangNecromancer.png',
  jiangZombieArcherPutrid: 'assets/units/jiangZombieArcherPutrid.png',
  jiangMortisEngine: 'assets/units/jiangMortisEngine.png',
  cthGraveGuard: 'assets/units/cthGraveGuard.png',
  cthGraveGuardGreat: 'assets/units/cthGraveGuardGreat.png',
  jiangGraveGuardHalberd: 'assets/units/jiangGraveGuardHalberd.png',
  cthZombies: 'assets/units/cthZombies.png',
  cthBlackKnightLance: 'assets/units/cthBlackKnightLance.png',
  damnedCannon: 'assets/units/damnedCannon.png',
  necroMortar: 'assets/units/necroMortar.png',
  theRoseLances: 'assets/units/theRoseLances.png',
  knightsOfBougar: 'assets/units/knightsOfBougar.png',
  ghostsOfGrismerie: 'assets/units/ghostsOfGrismerie.png',
  mslBlackKnightsLances: 'assets/units/mslBlackKnightsLances.png',
  blackGrailKnights: 'assets/units/blackGrailKnights.png',
  hellsteedKnights: 'assets/units/hellsteedKnights.png',
  dracoleech: 'assets/units/dracoleech.png',
  mslBrigands: 'assets/units/mslBrigands.png',
  mslMountedBrigands: 'assets/units/mslMountedBrigands.png',
  mslMenAtArmsPolearm: 'assets/units/mslMenAtArmsPolearm.png',
  mslBowmenPox: 'assets/units/mslBowmenPox.png',
  theGreyMen: 'assets/units/theGreyMen.png',
  mslGraveGuardGreat: 'assets/units/mslGraveGuardGreat.png',
  cursedTrebuchet: 'assets/units/cursedTrebuchet.png',
  // Nouveaux LL Vampire Counts ajoutés par le mod Nagash (Neferata, Kalledria).
  neferata: 'assets/portraits/neferata.png',
  kalledria: 'assets/portraits/kalledria.png',
  dieter: 'assets/portraits/dieter.png',
  mallobaude: 'assets/portraits/mallobaude.png',
  ladyBlackGrail: 'assets/portraits/ladyBlackGrail.png',
  walach: 'assets/portraits/walach.png',
  yuwei: 'assets/portraits/yuwei.png',
  // Syreens : carte vanilla de la Vampire Coast, deja declaree dans son module. Le mod
  // (The remains of) Legions of Nagash les ouvre au batiment des spectres des Comtes
  // Vampires, et la fiche de Kalledria les aligne depuis le 17/10/2026.
  syreens: 'assets/units/syreens.png',
  // Crypt Horrors : unité officielle vanilla (Vampire Counts), carte du jeu de base
  cryptHorrors: 'assets/units/cryptHorrors.png',
  // Banshee : héros officiel vanilla (Vampire Counts), portrait de campagne du jeu de base
  banshee: 'assets/units/banshee.png',
  mundvardTheCruel: 'assets/portraits/mundvardTheCruel.png',
  zachariasTheEverliving: 'assets/portraits/zachariasTheEverliving.png',
  theClawOfNagash: 'assets/units/theClawOfNagash.png',
  frederickVanHal: 'assets/units/frederickVanHal.png',
  whisperingNell: 'assets/units/whisperingNell.png',
  cannibalKnight: 'assets/units/cannibalKnight.png',
  estrothTheSilent: 'assets/units/estrothTheSilent.png',
  monsterOfWittgenstein: 'assets/units/monsterOfWittgenstein.png',
  theOldOneHero: 'assets/units/theOldOneHero.png',
  victorGuttman: 'assets/units/victorGuttman.png',
  baronsMen: 'assets/units/baronsMen.png',
  lahmianVampire: 'assets/portraits/lahmianVampire.png',
  lahmianHandmaidensDeath: 'assets/units/lahmianHandmaidensDeath.png',
  lahmianHandmaidensShadows: 'assets/units/lahmianHandmaidensShadows.png',
  covenThrone: 'assets/units/covenThrone.png',
  vereksReavers: 'assets/units/vereksReavers.png',
  tombGuard: 'assets/units/tombGuard.png',
  khepraGuard: 'assets/units/khepraGuard.png',
  ushabti: 'assets/units/ushabti.png',
  necrosphinx: 'assets/units/necrosphinx.png',
  // Cartes vanilla extraites de ui.pack (jeu de base), natives 60x130, copiees sans redimensionnement :
  // ui\units\icons\wh2_dlc11_vmp_crossbowmen.png (unit_variants_tables : wh2_dlc11_vmp_inf_crossbowmen).
  sylvanianCrossbowmen: 'assets/units/sylvanianCrossbowmen.png',
  // ui\units\icons\wh2_dlc11_vmp_handgunners.png (unit_variants_tables : wh2_dlc11_vmp_inf_handgunners).
  sylvanianHandgunners: 'assets/units/sylvanianHandgunners.png',
  // Spirit Host (DLC Lords of the End Times) : meme carte que dans js/units/undead-legions.js,
  // pour la fiche de Waldakir Rahtep, dont les effets la visent depuis le DLC.
  spiritHost: 'assets/units/spiritHost.png',
  // Heros legendaires du mod LYH (lyh_hero_no_cathay.pack), que ses scripts lyh_vmp_<nom>.lua posent par
  // spawn_agent_at_military_force dans l'armee de depart de leur faction : Obald the Bonefather (agent
  // `bonefather`) -> The Barrow Legion ; Rekthor Redaxe (agent `xuefu`) -> wh_main_vmp_vampire_counts, la
  // faction de Mannfred, vu en jeu par le user le 23/10/2026. Il s'affichait « Principal Write » avec une
  // copie de traduction perimee : la cle d'icone a change, le fichier image a garde l'ancien nom. Cartes ui/units/icons du pack, laissees a leurs dimensions d'origine,
  // mesurees avec ImageMagick identify : 60x130 pour chacune des deux.
  obaldTheBonefather: 'assets/units/obaldTheBonefather.png',
  rekthorRedaxe: 'assets/units/principalWrite.png'
};
