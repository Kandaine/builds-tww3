// ============================================================================
// units/hung.js — images d'unites de la faction « hung », et d'elle seule.
//
// Charge uniquement par hung.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/hung.json ; la valeur est le chemin de l'image reelle.
//
// Ces 26 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/hung.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  // --- The Hung (mod Steppe Lords — The Hung) : portraits des seigneurs
  // légendaires (Ur-Khan, Zao Korr) + héros et unités partagés. Images
  // extraites du .pack zstd (portraits/infopics, ratio portrait 60×130). ---
  hungUrKhan: 'assets/portraits/hungUrKhan.png',
  hungZaoKorr: 'assets/portraits/hungZaoKorr.png',
  hngShamanRagingSky: 'assets/units/hngShamanRagingSky.png',
  hngDarga: 'assets/units/hngDarga.png',
  hngHeavyArchersMounted: 'assets/units/hngHeavyArchersMounted.png',
  hngHorseArchers: 'assets/units/hngHorseArchers.png',
  hngHorsemasters: 'assets/units/hngHorsemasters.png',
  hngHeavyLancers: 'assets/units/hngHeavyLancers.png',
  hngLightLancers: 'assets/units/hngLightLancers.png',
  hngKhansGuard: 'assets/units/hngKhansGuard.png',
  hngRidersRagingSky: 'assets/units/hngRidersRagingSky.png',
  hngDarkWind: 'assets/units/hngDarkWind.png',
  hngPillagersGW: 'assets/units/hngPillagersGW.png',
  hngPillagersDual: 'assets/units/hngPillagersDual.png',
  hngRaiders: 'assets/units/hngRaiders.png',
  hngHeavyArchers: 'assets/units/hngHeavyArchers.png',
  hngLootedCannon: 'assets/units/hngLootedCannon.png',
  hngThunderspitter: 'assets/units/hngThunderspitter.png',
  hngSteelSpitters: 'assets/units/hngSteelSpitters.png',
  hngWallripper: 'assets/units/hngWallripper.png',
  hngReaperBoltThrower: 'assets/units/hngReaperBoltThrower.png',
  theDayGuard: 'assets/units/theDayGuard.png',
  theGreatHerald: 'assets/units/theGreatHerald.png',
  theKhagansShield: 'assets/units/theKhagansShield.png',
  onogalsHunters: 'assets/units/onogalsHunters.png',
  bloodrageRiders: 'assets/units/bloodrageRiders.png'
};
