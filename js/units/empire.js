// ============================================================================
// units/empire.js — images d'unites de la faction « empire », et d'elle seule.
//
// Charge uniquement par empire.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/empire.json ; la valeur est le chemin de l'image reelle.
//
// Ces 125 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/empire.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  brtBrunner: 'assets/units/brtBrunner.png',
  // Empire — Héros Légendaires du mod « Heroes of Legend »
  empOrsini: 'assets/units/empOrsini.png',
  empSabineFlamius: 'assets/units/empSabineFlamius.png',
  // Empire — Héros Légendaires du mod « SCM Legendary Characters »
  chronosGoodheart: 'assets/units/chronosGoodheart.png',
  bassianoDutra: 'assets/units/bassianoDutra.png',
  halagrundsor: 'assets/units/halagrundsor.png',
  aldredVonCarroburg: 'assets/units/aldredVonCarroburg.png',
  maneaters: 'assets/units/maneaters.png',
  karlFranz: 'assets/portraits/karlFranz.png',
  balthasarGelt: 'assets/portraits/balthasarGelt.png',
  markusWulfhart: 'assets/portraits/markusWulfhart.png',
  volkmar: 'assets/portraits/volkmar.png',
  elspeth: 'assets/portraits/elspeth.png',
  chaosWarriorsTzeentch: 'assets/units/chaosWarriorsTzeentch.png',
  halberdiers: 'assets/units/halberdiers.png',
  spearmenEmpire: 'assets/units/spearmenEmpire.png',
  handgunners: 'assets/units/handgunners.png',
  greatCannons: 'assets/units/greatCannons.png',
  greatswords: 'assets/units/greatswords.png',
  outriders: 'assets/units/outriders.png',
  mortars: 'assets/units/mortars.png',
  helstormRocketBattery: 'assets/units/helstormRocketBattery.png',
  archersEmpire: 'assets/units/archersEmpire.png',
  huntsmen: 'assets/units/huntsmen.png',
  flagellants: 'assets/units/flagellants.png',
  // Marienburg (mod SCM Marienburg) — unités et héros custom du roster
  lisetteLeerer: 'assets/units/lisetteLeerer.png',
  pieterDeGroot: 'assets/units/pieterDeGroot.png',
  swordOfSolkan: 'assets/units/swordOfSolkan.png',
  goldenPinions: 'assets/units/goldenPinions.png',
  kloveniers: 'assets/units/kloveniers.png',
  adelijkenGreatswords: 'assets/units/adelijkenGreatswords.png',
  goedendagers: 'assets/units/goedendagers.png',
  merchantGuildSentinels: 'assets/units/merchantGuildSentinels.png',
  rijdersCrossbows: 'assets/units/rijdersCrossbows.png',
  vanDeKuypersTreasurers: 'assets/units/vanDeKuypersTreasurers.png',
  manannsBlades: 'assets/units/manannsBlades.png',
  rashasawa: 'assets/units/rashasawa.png',
  vanKlumpfsBuccaneers: 'assets/units/vanKlumpfsBuccaneers.png',
  oggTheExpatriate: 'assets/units/oggTheExpatriate.png',
  palldee: 'assets/units/palldee.png',
  foogersHouseguard: 'assets/units/foogersHouseguard.png',
  migratedDwarfWarriors: 'assets/units/migratedDwarfWarriors.png',
  seaMagicker: 'assets/units/seaMagicker.png',
  highTempleGuard: 'assets/units/highTempleGuard.png',
  manannsFanatics: 'assets/units/manannsFanatics.png',
  // Cavalerie Empire vanilla (cartes officielles) — utilisée par les Comtes
  // Électeurs du mod Mixu's Legendary Lords (Knightly Charge de Marius, etc.)
  knightsBlazingSun: 'assets/units/knightsBlazingSun.png',
  reiksguard: 'assets/units/reiksguard.png',
  demigryphKnights: 'assets/units/demigryphKnights.png',
  royalAltdorfGryphites: 'assets/units/royalAltdorfGryphites.png',
  witchHunter: 'assets/units/witchHunter.png',
  hammerOfTheWitches: 'assets/units/hammerOfTheWitches.png',
  deathjacks: 'assets/units/deathjacks.png',
  stirlandsRevenge: 'assets/units/stirlandsRevenge.png',
  theSunmaker: 'assets/units/theSunmaker.png',
  // Culte de Taal & Rhya (Helmut Feuerbach) + roster pirate (Edvard van der
  // Kraal) — unités custom du mod Mixu (cartes ui/units/icons, 60×130).
  celebrants: 'assets/units/celebrants.png',
  hornedHunters: 'assets/units/hornedHunters.png',
  daughtersOfRhya: 'assets/units/daughtersOfRhya.png',
  warriorPriestOfTaal: 'assets/units/warriorPriestOfTaal.png',
  pirateDeckhandsSwords: 'assets/units/pirateDeckhandsSwords.png',
  pirateDeckhandsPolearms: 'assets/units/pirateDeckhandsPolearms.png',
  buccaneersGreatWeapons: 'assets/units/buccaneersGreatWeapons.png',
  buccaneersSwordBombs: 'assets/units/buccaneersSwordBombs.png',
  gunneryMobHandguns: 'assets/units/gunneryMobHandguns.png',
  gunneryMobBlunderbuss: 'assets/units/gunneryMobBlunderbuss.png',
  norscanReavers: 'assets/units/norscanReavers.png',
  longDrongsSlayerPirates: 'assets/units/longDrongsSlayerPirates.png',
  carronade: 'assets/units/carronade.png',
  prometheanRiders: 'assets/units/prometheanRiders.png',
  fleetCaptain: 'assets/units/fleetCaptain.png',
  witchDoctor: 'assets/units/witchDoctor.png',
  freeCompanyMilitia: 'assets/units/freeCompanyMilitia.png',
  warriorPriest: 'assets/units/warriorPriest.png',
  emilValgeir: 'assets/units/emilValgeir.png',
  priestOfUlric: 'assets/units/priestOfUlric.png',
  hansHelmgart: 'assets/units/hansHelmgart.png',
  empireCaptain: 'assets/units/empireCaptain.png',
  frankenwurtersCompany: 'assets/units/frankenwurtersCompany.png',
  mackensensMarauders: 'assets/units/mackensensMarauders.png',
  amethystWizard: 'assets/units/amethystWizard.png',
  amberWizard: 'assets/units/amberWizard.png',
  brightWizard: 'assets/units/brightWizard.png',
  goldWizard: 'assets/units/goldWizard.png',
  zintlersReiksguard: 'assets/units/zintlersReiksguard.png',
  theSilverBullets: 'assets/units/theSilverBullets.png',
  theWhiteWolves: 'assets/units/theWhiteWolves.png',
  sigmarsSons: 'assets/units/sigmarsSons.png',
  theTattersouls: 'assets/units/theTattersouls.png',
  grundelsDefenders: 'assets/units/grundelsDefenders.png',
  amethystIronsides: 'assets/units/amethystIronsides.png',
  amethystOutriders: 'assets/units/amethystOutriders.png',
  amethystHelstormRocketBattery: 'assets/units/amethystHelstormRocketBattery.png',
  amethystLandShip: 'assets/units/amethystLandShip.png',
  stirRiverPatrol: 'assets/units/stirRiverPatrol.png',
  theBordermen: 'assets/units/theBordermen.png',
  theStubbornBulls: 'assets/units/theStubbornBulls.png',
  theEmperorsWrath: 'assets/units/theEmperorsWrath.png',
  // Comtes Électeurs de l'Empire (mod Mixu's Legendary Lords) — portraits
  // extraits du .pack. Réutilisent le roster Empire vanilla déjà présent.
  mariusLeitdorf: 'assets/portraits/mariusLeitdorf.png',
  aldebrandLudenhof: 'assets/portraits/aldebrandLudenhof.png',
  theodericGausser: 'assets/portraits/theodericGausser.png',
  wolframHertwig: 'assets/portraits/wolframHertwig.png',
  valmirVonRaukov: 'assets/portraits/valmirVonRaukov.png',
  alberichHauptAnderssen: 'assets/portraits/alberichHauptAnderssen.png',
  helmutFeuerbach: 'assets/portraits/helmutFeuerbach.png',
  edvardVanDerKraal: 'assets/portraits/edvardVanDerKraal.png',
  boristodbringer: 'assets/portraits/boristodbringer.png',
  mackensen: 'assets/portraits/mackensen.png',
  // Marienburg (mod SCM Marienburg)
  jaanVanDeKuypers: 'assets/portraits/jaanVanDeKuypers.png',
  egmondDenEuwe: 'assets/portraits/egmondDenEuwe.png',
  arkatFooger: 'assets/portraits/arkatFooger.png',
  camilleDauphina: 'assets/portraits/camilleDauphina.png',
  // Héros légendaires Empire (mod Mixu) : Luthor Huss (armée de Volkmar),
  // Oleg von Raukov (armée de son père Valmir).
  luthorHuss: 'assets/portraits/luthorHuss.png',
  olegVonRaukov: 'assets/portraits/olegVonRaukov.png',
  kalaraOfWydrioth: 'assets/units/kalaraOfWydrioth.png',
  hertwigVanHal: 'assets/units/hertwigVanHal.png',
  jorekGrimm: 'assets/units/jorekGrimm.png',
  rodrikLAnguille: 'assets/units/rodrikLAnguille.png',
  swordsOfUlric: 'assets/units/swordsOfUlric.png',
  carroburgGreatswords: 'assets/units/carroburgGreatswords.png',
  sootsonsGuns: 'assets/units/sootsonsGuns.png',
  theBlackLions: 'assets/units/theBlackLions.png',
  knightsEverlastingLight: 'assets/units/knightsEverlastingLight.png',
  gundermansSurefires: 'assets/units/gundermansSurefires.png',
  nordlandMariners: 'assets/units/nordlandMariners.png',
  eldredsGuard: 'assets/units/eldredsGuard.png',
  knightsOfMorr: 'assets/units/knightsOfMorr.png'
};
