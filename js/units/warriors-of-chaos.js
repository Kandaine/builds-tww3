// ============================================================================
// units/warriors-of-chaos.js — images d'unites de la faction « warriors-of-chaos », et d'elle seule.
//
// Charge uniquement par warriors_of_chaos.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/warriors-of-chaos.json ; la valeur est le chemin de l'image reelle.
//
// Ces 83 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/warriors-of-chaos.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  daemonettes: 'assets/units/daemonettes.png',
  pinkHorrors: 'assets/units/pinkHorrors.png',
  chaosWarhoundsKhorne: 'assets/units/chaosWarhoundsKhorne.png',
  plaguebearers: 'assets/units/plaguebearers.png',
  darkshards: 'assets/units/darkshards.png',
  witchElves: 'assets/units/witchElves.png',
  shades: 'assets/units/shades.png',
  warHydra: 'assets/units/warHydra.png',
  kharibdyss: 'assets/units/kharibdyss.png',
  blackDragon: 'assets/units/blackDragon.png',
  // --- Chaos Ogres / « The Devourers » (seigneur de mod Ghurzhaal) ---
  // Images extraites du .pack du mod (infopics 120×260 pour la troupe,
  // portraits 60×130 agrandis pour les héros).
  chaosOgreBruiser: 'assets/units/chaosOgreBruiser.png',
  exaltedChaosOgreTzeentch: 'assets/units/exaltedChaosOgreTzeentch.png',
  forsakenGnoblars: 'assets/units/forsakenGnoblars.png',
  chaosOgreFightersIronfists: 'assets/units/chaosOgreFightersIronfists.png',
  chaosOgreFightersGreatWeapons: 'assets/units/chaosOgreFightersGreatWeapons.png',
  chaosOgreWarmongersGreatWeapons: 'assets/units/chaosOgreWarmongersGreatWeapons.png',
  chaosOgreWarmongersPistol: 'assets/units/chaosOgreWarmongersPistol.png',
  chaosOgresKhorne: 'assets/units/chaosOgresKhorne.png',
  chaosOgresNurgle: 'assets/units/chaosOgresNurgle.png',
  chaosWastesBehemoth: 'assets/units/chaosWastesBehemoth.png',
  chaosOgreBrawlersDual: 'assets/units/chaosOgreBrawlersDual.png',
  chaosWarriorsKhorne: 'assets/units/chaosWarriorsKhorne.png',
  skullcrushersKhorne: 'assets/units/skullcrushersKhorne.png',
  bloodlettersKhorne: 'assets/units/bloodlettersKhorne.png',
  archaon: 'assets/portraits/archaon.png',
  kholek: 'assets/portraits/kholek.png',
  sigvald: 'assets/portraits/sigvald.png',
  belakor: 'assets/portraits/belakor.png',
  drukim: 'assets/portraits/drukim.png',
  ghurzhaal: 'assets/portraits/ghurzhaal.png',
  azazel: 'assets/portraits/azazel.png',
  festus: 'assets/portraits/festus.png',
  vilitch: 'assets/portraits/vilitch.png',
  valkia: 'assets/portraits/valkia.png',
  chaosWarriorsUndivided: 'assets/units/chaosWarriorsUndivided.png',
  chaosWarriorsUndividedHalberds: 'assets/units/chaosWarriorsUndividedHalberds.png',
  chosenGreatWeapons: 'assets/units/chosenGreatWeapons.png',
  maraudersWoC: 'assets/units/maraudersWoC.png',
  maraudersHorsemen: 'assets/units/maraudersHorsemen.png',
  ridersOfTheMightySerpent: 'assets/units/ridersOfTheMightySerpent.png',
  chaosWarhoundsWoC: 'assets/units/chaosWarhoundsWoC.png',
  dragonOgres: 'assets/units/dragonOgres.png',
  summonersOfRage: 'assets/units/summonersOfRage.png',
  chaosTrolls: 'assets/units/chaosTrolls.png',
  chaosGiant: 'assets/units/chaosGiant.png',
  theSibilantSlaughtercade: 'assets/units/theSibilantSlaughtercade.png',
  chaosKnightsLances: 'assets/units/chaosKnightsLances.png',
  chaosWarriorsSlaanesh: 'assets/units/chaosWarriorsSlaanesh.png',
  chosenSlaanesh: 'assets/units/chosenSlaanesh.png',
  maraudersSlaanesh: 'assets/units/maraudersSlaanesh.png',
  hellstridersSlaanesh: 'assets/units/hellstridersSlaanesh.png',
  feralManticoreChaos: 'assets/units/feralManticoreChaos.png',
  spawnOfSlaanesh: 'assets/units/spawnOfSlaanesh.png',
  chaosWarriorsTzeentch: 'assets/units/chaosWarriorsTzeentch.png',
  maraudersTzeentch: 'assets/units/maraudersTzeentch.png',
  doomKnightsTzeentch: 'assets/units/doomKnightsTzeentch.png',
  spawnOfTzeentch: 'assets/units/spawnOfTzeentch.png',
  forsakenTzeentch: 'assets/units/forsakenTzeentch.png',
  chaosKnightsTzeentch: 'assets/units/chaosKnightsTzeentch.png',
  chaosWarriorsNurgle: 'assets/units/chaosWarriorsNurgle.png',
  spawnOfNurgle: 'assets/units/spawnOfNurgle.png',
  chaosSorcererFire: 'assets/units/chaosSorcererFire.png',
  chaosSorcererSlaanesh: 'assets/units/chaosSorcererSlaanesh.png',
  chaosSorcererNurgle: 'assets/units/chaosSorcererNurgle.png',
  chaosSorcererTzeentch: 'assets/units/chaosSorcererTzeentch.png',
  exaltedHeroWoC: 'assets/units/exaltedHeroWoC.png',
  exaltedHeroSlaanesh: 'assets/units/exaltedHeroSlaanesh.png',
  exaltedHeroNurgle: 'assets/units/exaltedHeroNurgle.png',
  exaltedHeroTzeentch: 'assets/units/exaltedHeroTzeentch.png',
  slambo: 'assets/units/slambo.png',
  maraudersOfKhorne: 'assets/units/maraudersOfKhorne.png',
  swordsOfChaos: 'assets/units/swordsOfChaos.png',
  theDaemonspew: 'assets/units/theDaemonspew.png',
  theDaemonspew: 'assets/units/theDaemonspew.png',
  marauderBerserkers: 'assets/units/marauderBerserkers.png',
  brutesOfTheHound: 'assets/units/brutesOfTheHound.png',
  wyrdSpawn: 'assets/units/wyrdSpawn.png',
  theSoulOfDamnation: 'assets/units/theSoulOfDamnation.png',
  khornesBloodyFist: 'assets/units/khornesBloodyFist.png',
  // SCM Legendary Characters Campaign Pack — Guerriers du Chaos et Khorne.
  engraDeathsword: 'assets/portraits/engraDeathsword.png',
  aelfricCyenwulf: 'assets/portraits/aelfricCyenwulf.png',
  knightsOfTheBrazenThrone: 'assets/units/knightsOfTheBrazenThrone.png',
  theSourguts: 'assets/units/theSourguts.png',
  mirrorGuard: 'assets/units/mirrorGuard.png',
  biliousThunderguff: 'assets/units/biliousThunderguff.png',
  knightsOfImmolation: 'assets/units/knightsOfImmolation.png'
};
