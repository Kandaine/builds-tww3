// ============================================================================
// units/ogre-kingdoms.js — images d'unites de la faction « ogre-kingdoms », et d'elle seule.
//
// Charge uniquement par ogre_kingdoms.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/ogre-kingdoms.json ; la valeur est le chemin de l'image reelle.
//
// Ces 157 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/ogre-kingdoms.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  ghorgon: 'assets/units/ghorgon.png',
  jabberslythe: 'assets/units/jabberslythe.png',
  chaosOgresKhorne: 'assets/units/chaosOgresKhorne.png',
  chaosOgresNurgle: 'assets/units/chaosOgresNurgle.png',
  ogreBulls: 'assets/units/ogreBulls.png',
  haurgFrostmaw: 'assets/units/haurgFrostmaw.png',
  drulgKineater: 'assets/units/drulgKineater.png',
  katerinaDeHansebourg: 'assets/units/katerinaDeHansebourg.png',
  bruddTheBlackened: 'assets/units/bruddTheBlackened.png',
  ironguts: 'assets/units/ironguts.png',
  maneaters: 'assets/units/maneaters.png',
  vazgratTheLucky: 'assets/portraits/vazgratTheLucky.png',
  targogWhalebeater: 'assets/portraits/targogWhalebeater.png',
  stoneTrolls: 'assets/units/stoneTrolls.png',
  greasus: 'assets/portraits/greasus.png',
  skrag: 'assets/portraits/skrag.png',
  golgfag: 'assets/portraits/golgfag.png',
  gharkIronskin: 'assets/portraits/gharkIronskin.png',
  feralBears: 'assets/units/feralBears.png',
  giantSpiders: 'assets/units/giantSpiders.png',
  ogreBullsDualWeapons: 'assets/units/ogreBullsDualWeapons.png',
  gnoblars: 'assets/units/gnoblars.png',
  gnoblarTrappers: 'assets/units/gnoblarTrappers.png',
  gorgers: 'assets/units/gorgers.png',
  sabretuskPack: 'assets/units/sabretuskPack.png',
  golgfagsManeaters: 'assets/units/golgfagsManeaters.png',
  maneatersIronfists: 'assets/units/maneatersIronfists.png',
  pigbackRiders: 'assets/units/pigbackRiders.png',
  leadbelchers: 'assets/units/leadbelchers.png',
  ironblaster: 'assets/units/ironblaster.png',
  braggTheGutsman: 'assets/units/braggTheGutsman.png',
  ironskinMournfang: 'assets/units/ironskinMournfang.png',
  ironskinCrushersGW: 'assets/units/ironskinCrushersGW.png',
  ironskinCrushersIronfist: 'assets/units/ironskinCrushersIronfist.png',
  ironskinOgreBullsDual: 'assets/units/ironskinOgreBullsDual.png',
  blackPlatesGuards: 'assets/units/blackPlatesGuards.png',
  ironskinIronguts: 'assets/units/ironskinIronguts.png',
  gnoblarScraplauncher: 'assets/units/gnoblarScraplauncher.png',
  butcherGreatMaw: 'assets/units/butcherGreatMaw.png',
  snowhornOfMourn: 'assets/units/snowhornOfMourn.png',
  amblepeakGreybacks: 'assets/units/amblepeakGreybacks.png',
  powderGuts: 'assets/units/powderGuts.png',
  packmaster: 'assets/units/packmaster.png',
  carrion: 'assets/units/carrion.png',
  boglarsOfTheMadMarshes: 'assets/units/boglarsOfTheMadMarshes.png',
  giantWolves: 'assets/units/giantWolves.png',
  // Seigneurs Ogre Kingdoms (mod SCM Masters of the Mountain) : Bul Mallet-hands
  // (Blood Guzzlers), Blaut Feastmaster (Feastmaster Tribe), Shrewd Fulg
  // (Tribe of Shrewd Fulg), Snarky Gutbuster (Loose Tooth).
  bulMalletHands: 'assets/portraits/bulMalletHands.png',
  blautFeastmaster: 'assets/portraits/blautFeastmaster.png',
  shrewdFulg: 'assets/portraits/shrewdFulg.png',
  snarkyGutbuster: 'assets/portraits/snarkyGutbuster.png',
  // Bul Mallet-hands (Blood Guzzlers).
  ogreArachnarokSpider: 'assets/units/ogreArachnarokSpider.png',
  ogreArachnarokSpiderFlinger: 'assets/units/ogreArachnarokSpiderFlinger.png',
  gnoblarSpiderRiders: 'assets/units/gnoblarSpiderRiders.png',
  gnoblarSpiderRidersArchers: 'assets/units/gnoblarSpiderRidersArchers.png',
  flameNoses: 'assets/units/flameNoses.png',
  gnoblarSpiderChariot: 'assets/units/gnoblarSpiderChariot.png',
  hunterSpiderChariot: 'assets/units/hunterSpiderChariot.png',
  malletsHunters: 'assets/units/malletsHunters.png',
  ogreGiantSpider: 'assets/units/ogreGiantSpider.png',
  // Blaut Feastmaster (Feastmaster Tribe).
  blautsManeaters: 'assets/units/blautsManeaters.png',
  feastguard: 'assets/units/feastguard.png',
  blautfangWarbeasts: 'assets/units/blautfangWarbeasts.png',
  gnoblarGrillers: 'assets/units/gnoblarGrillers.png',
  halflingCook: 'assets/units/halflingCook.png',
  // Shrewd Fulg (Tribe of Shrewd Fulg).
  fulgsIronguts: 'assets/units/fulgsIronguts.png',
  hellionsFulgsIronguts: 'assets/units/hellionsFulgsIronguts.png',
  modifiedIronguts: 'assets/units/modifiedIronguts.png',
  modifiedSabretuskPack: 'assets/units/modifiedSabretuskPack.png',
  modifiedRhinox: 'assets/units/modifiedRhinox.png',
  modifiedStonehorn: 'assets/units/modifiedStonehorn.png',
  // Snarky Gutbuster (Loose Tooth).
  leadbelchersGatling: 'assets/units/leadbelchersGatling.png',
  leadbelchersSnipe: 'assets/units/leadbelchersSnipe.png',
  leadbelchersFlame: 'assets/units/leadbelchersFlame.png',
  specialManeatersOgrePistol: 'assets/units/specialManeatersOgrePistol.png',
  specialIronblaster: 'assets/units/specialIronblaster.png',
  specialGnoblarScraplauncher: 'assets/units/specialGnoblarScraplauncher.png',
  // Seigneurs Ogre Kingdoms (mod SCM Masters of the Mountain), second lot :
  // Blogg Crusherguts (Rock Skulls), Jhared The Red (Sabreskin Tribe),
  // Hrothgul Icefang (Sons of the Mountain), Marn the Mangler (Thunderguts Tribe).
  bloggCrusherguts: 'assets/portraits/bloggCrusherguts.png',
  jharedTheRed: 'assets/portraits/jharedTheRed.png',
  hrothgulIcefang: 'assets/portraits/hrothgulIcefang.png',
  marnTheMangler: 'assets/portraits/marnTheMangler.png',
  // Blogg Crusherguts (Rock Skulls).
  ogreBruiser: 'assets/units/ogreBruiser.png',
  // Jhared The Red (Sabreskin Tribe).
  beastcladReavers: 'assets/units/beastcladReavers.png',
  feralMournfang: 'assets/units/feralMournfang.png',
  feralStonehorn: 'assets/units/feralStonehorn.png',
  feralThundertusk: 'assets/units/feralThundertusk.png',
  feralBoars: 'assets/units/feralBoars.png',
  feralGorebeasts: 'assets/units/feralGorebeasts.png',
  // Hrothgul Icefang (Sons of the Mountain).
  yheteesIronfists: 'assets/units/yheteesIronfists.png',
  yheteesGreatWeapons: 'assets/units/yheteesGreatWeapons.png',
  hrothgulsGorgers: 'assets/units/hrothgulsGorgers.png',
  hrothgulThundertuskShrine: 'assets/units/hrothgulThundertuskShrine.png',
  feralIceMammoth: 'assets/units/feralIceMammoth.png',
  // Marn the Mangler (Thunderguts Tribe).
  ogrePitFighters: 'assets/units/ogrePitFighters.png',
  mournfangCavalry: 'assets/units/mournfangCavalry.png',
  mournfangCavalryPitFighters: 'assets/units/mournfangCavalryPitFighters.png',
  ogrePitFighterChampions: 'assets/units/ogrePitFighterChampions.png',
  ogrePitChampionsMounted: 'assets/units/ogrePitChampionsMounted.png',
  // Héros Empire "Engineer" (Thrones of Decay) — pas de carte dédiée sous
  // ui\units\icons\, portrait réutilisé depuis ui\portraits\units\.
  empireEngineer: 'assets/units/empireEngineer.png',
  // Régiments de renom du mod dont la loc ne fournit pas de nom d'affichage.
  lavaArachnarokRoR: 'assets/units/lavaArachnarokRoR.png',
  gnoblarGrillersRoR: 'assets/units/gnoblarGrillersRoR.png',
  leadbelchersRoRLooseTooth: 'assets/units/leadbelchersRoRLooseTooth.png',
  // Mod SCM "Masters of the Maw" — lot 3/3.
  // Gulgulet Sandgrinder (The Famished), Morg Magmaborn (Flamegullets),
  // Fernadrang (Red Maw), Karaka Breakmountain (Red Fist Tribe),
  // Ghuth Spawnchomper (roster "Tainted").
  gulguletSandgrinder: 'assets/portraits/gulguletSandgrinder.png',
  morgMagmaborn: 'assets/portraits/morgMagmaborn.png',
  fernadrang: 'assets/portraits/fernadrang.png',
  karakaBreakmountain: 'assets/portraits/karakaBreakmountain.png',
  ghuthSpawnchomper: 'assets/portraits/ghuthSpawnchomper.png',
  arabyOgreBullsDual: 'assets/units/arabyOgreBullsDual.png',
  arabyOgreBullsIronfists: 'assets/units/arabyOgreBullsIronfists.png',
  arabyBoarCavalryIronfists: 'assets/units/arabyBoarCavalryIronfists.png',
  sandguts: 'assets/units/sandguts.png',
  arabyCrushersIronfists: 'assets/units/arabyCrushersIronfists.png',
  ogreshabti: 'assets/units/ogreshabti.png',
  solidoo: 'assets/units/solidoo.png',
  sandScorpion: 'assets/units/sandScorpion.png',
  duneVultures: 'assets/units/duneVultures.png',
  // Pas de carte d'unite dediee sous ui\units\icons\ pour ce heros, portrait
  // reutilise depuis ui\portraits\units\ (meme solution que empireEngineer).
  gnoblarDunePriest: 'assets/units/gnoblarDunePriest.png',
  // Morg Magmaborn (Flamegullets).
  flameguts: 'assets/units/flameguts.png',
  morgsIronguts: 'assets/units/morgsIronguts.png',
  flameEatersGreatWeapons: 'assets/units/flameEatersGreatWeapons.png',
  flameEatersOgrePistol: 'assets/units/flameEatersOgrePistol.png',
  flamefangCavalry: 'assets/units/flamefangCavalry.png',
  flameSpirits: 'assets/units/flameSpirits.png',
  flameThrower: 'assets/units/flameThrower.png',
  firebelly: 'assets/units/firebelly.png',
  // Fernadrang (Red Maw).
  khornateOgreBulls: 'assets/units/khornateOgreBulls.png',
  khornateOgreBullsIronfists: 'assets/units/khornateOgreBullsIronfists.png',
  bruiserOfKhorne: 'assets/units/bruiserOfKhorne.png',
  // Karaka Breakmountain (Red Fist Tribe).
  plagueguts: 'assets/units/plagueguts.png',
  corruptThrowers: 'assets/units/corruptThrowers.png',
  vortexBeastOfNurgle: 'assets/units/vortexBeastOfNurgle.png',
  ghurekGlott: 'assets/units/ghurekGlott.png',
  chaosGiantOfNurgle: 'assets/units/chaosGiantOfNurgle.png',
  // Pas de carte d'unite dediee sous ui\units\icons\ pour ces heros, portrait
  // reutilise depuis ui\portraits\units\ (meme solution que empireEngineer).
  plaguebelly: 'assets/units/plaguebelly.png',
  plagueBruiser: 'assets/units/plagueBruiser.png',
  // Roster "Tainted", partagé par Fernadrang / Karaka / Ghuth.
  taintedOgreBullsDual: 'assets/units/taintedOgreBullsDual.png',
  taintedManeatersIronfists: 'assets/units/taintedManeatersIronfists.png',
  taintedLeadbelchers: 'assets/units/taintedLeadbelchers.png',
  taintedGnoblars: 'assets/units/taintedGnoblars.png',
  ghuthsIronguts: 'assets/units/ghuthsIronguts.png',
  taintedCrushersGreatWeapons: 'assets/units/taintedCrushersGreatWeapons.png',
  taintedMournfangIronfists: 'assets/units/taintedMournfangIronfists.png',
  taintedGiant: 'assets/units/taintedGiant.png',
  taintedSabretuskPack: 'assets/units/taintedSabretuskPack.png',
  taintedStonehorn: 'assets/units/taintedStonehorn.png',
  taintedThundertusk: 'assets/units/taintedThundertusk.png',
  ogreSpawnOfKhorne: 'assets/units/ogreSpawnOfKhorne.png',
  ogreSpawnOfSlaanesh: 'assets/units/ogreSpawnOfSlaanesh.png',
  braughSlavelord: 'assets/units/braughSlavelord.png',
  sandbadTheSailor: 'assets/units/sandbadTheSailor.png',
  rothnogTheShrinekeeper: 'assets/units/rothnogTheShrinekeeper.png',
  oldFunder: 'assets/units/oldFunder.png',
  gragtarFlameheart: 'assets/units/gragtarFlameheart.png',
  golthog: 'assets/units/golthog.png',
  nossoDaSchnozzla: 'assets/units/nossoDaSchnozzla.png',
  hrothyogg: 'assets/portraits/hrothyogg.png',
  imildrak: 'assets/portraits/imildrak.png',
  piggybackKnights: 'assets/units/piggybackKnights.png'
};
