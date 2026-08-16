// ============================================================================
// units/tomb-kings.js — images d'unites de la faction « tomb-kings », et d'elle seule.
//
// Charge uniquement par tomb_kings.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/tomb-kings.json ; la valeur est le chemin de l'image reelle.
//
// Ces 63 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/tomb-kings.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  settra: 'assets/portraits/settra.png',
  khalida: 'assets/portraits/khalida.png',
  khatep: 'assets/portraits/khatep.png',
  arkhan: 'assets/portraits/arkhan.png',
  tutankhanut: 'assets/portraits/tutankhanut.png',
  dreadKing: 'assets/portraits/dreadKing.png',
  nekhenaten: 'assets/portraits/nekhenaten.png',
  rakaph: 'assets/portraits/rakaph.png',
  tombGuard: 'assets/units/tombGuard.png',
  skeletonWarriors: 'assets/units/skeletonWarriors.png',
  skeletonSpearmen: 'assets/units/skeletonSpearmen.png',
  skeletonArchers: 'assets/units/skeletonArchers.png',
  skeletonChariots: 'assets/units/skeletonChariots.png',
  khemrianWarsphinx: 'assets/units/khemrianWarsphinx.png',
  screamingSkullCatapults: 'assets/units/screamingSkullCatapults.png',
  necropolisKnights: 'assets/units/necropolisKnights.png',
  sepulchralStalkers: 'assets/units/sepulchralStalkers.png',
  casketOfSouls: 'assets/units/casketOfSouls.png',
  nehekharanWarriors: 'assets/units/nehekharanWarriors.png',
  nehekharanHorsemen: 'assets/units/nehekharanHorsemen.png',
  skeletonHorsemen: 'assets/units/skeletonHorsemen.png',
  skeletonHorseArchers: 'assets/units/skeletonHorseArchers.png',
  stormRidersOfKhsar: 'assets/units/stormRidersOfKhsar.png',
  ramhotep: 'assets/units/ramhotep.png',
  larenscheld: 'assets/units/larenscheld.png',
  hetairos: 'assets/units/hetairos.png',
  corruptedPriest: 'assets/units/corruptedPriest.png',
  hellwraith: 'assets/units/hellwraith.png',
  royalGuards: 'assets/units/royalGuards.png',
  royalGuardsGW: 'assets/units/royalGuardsGW.png',
  royalGuardLancers: 'assets/units/royalGuardLancers.png',
  boneColossus: 'assets/units/boneColossus.png',
  screamingSkullBallista: 'assets/units/screamingSkullBallista.png',
  catacombGuardians: 'assets/units/catacombGuardians.png',
  eternalBondThessos: 'assets/units/eternalBondThessos.png',
  polybolos: 'assets/units/polybolos.png',
  blackGrailKnightsDk: 'assets/units/blackGrailKnightsDk.png',
  kleruchoiBhagar: 'assets/units/kleruchoiBhagar.png',
  ephalianRiders: 'assets/units/ephalianRiders.png',
  hierotitan: 'assets/units/hierotitan.png',
  ushabti: 'assets/units/ushabti.png',
  cryptGhouls: 'assets/units/cryptGhouls.png',
  hexwraiths: 'assets/units/hexwraiths.png',
  tombScorpion: 'assets/units/tombScorpion.png',
  lichePriest: 'assets/units/lichePriest.png',
  khepraGuard: 'assets/units/khepraGuard.png',
  tombPrince: 'assets/units/tombPrince.png',
  venomKnightsOfAsaph: 'assets/units/venomKnightsOfAsaph.png',
  usiriansLegion: 'assets/units/usiriansLegion.png',
  flockOfDjaf: 'assets/units/flockOfDjaf.png',
  princeApophas: 'assets/units/princeApophas.png',
  heraldNekaph: 'assets/units/heraldNekaph.png',
  giantKhepraSwarm: 'assets/units/giantKhepraSwarm.png',
  usiriansKhepraRiders: 'assets/units/usiriansKhepraRiders.png',
  carrion: 'assets/units/carrion.png',
  serkhet: 'assets/units/serkhet.png',
  nyletoth: 'assets/units/nyletoth.png',
  lordKaritamen: 'assets/portraits/lordKaritamen.png',
  blessedLegionOfPhakth: 'assets/units/blessedLegionOfPhakth.png',
  scorpionLegion: 'assets/units/scorpionLegion.png',
  sphinxOfUsekph: 'assets/units/sphinxOfUsekph.png',
  eyesOfTheDesert: 'assets/units/eyesOfTheDesert.png',
  wightsOfTheTwistedSpire: 'assets/units/wightsOfTheTwistedSpire.png'
};
