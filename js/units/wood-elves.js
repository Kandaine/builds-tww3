// ============================================================================
// units/wood-elves.js — images d'unites de la faction « wood-elves », et d'elle seule.
//
// Charge uniquement par wood_elves.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/wood-elves.json ; la valeur est le chemin de l'image reelle.
//
// Ces 46 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/wood-elves.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  treeKin: 'assets/units/treeKin.png',
  greatEagle: 'assets/units/greatEagle.png',
  princeOreon: 'assets/portraits/princeOreon.png',
  queenMarrisith: 'assets/portraits/queenMarrisith.png',
  caveBats: 'assets/units/caveBats.png',
  giantSpiders: 'assets/units/giantSpiders.png',
  eternalGuard: 'assets/units/eternalGuard.png',
  orion: 'assets/portraits/orion.png',
  durthu: 'assets/portraits/durthu.png',
  sistersOfTwilight: 'assets/portraits/sistersOfTwilight.png',
  drycha: 'assets/portraits/drycha.png',
  wildRiders: 'assets/units/wildRiders.png',
  wildRidersShield: 'assets/units/wildRidersShield.png',
  gladeRiders: 'assets/units/gladeRiders.png',
  eternalGuardShield: 'assets/units/eternalGuardShield.png',
  waywatchers: 'assets/units/waywatchers.png',
  skawTheFalconer: 'assets/units/skawTheFalconer.png',
  deepwoodScouts: 'assets/units/deepwoodScouts.png',
  treeman: 'assets/units/treeman.png',
  waystalker: 'assets/units/waystalker.png',
  dryads: 'assets/units/dryads.png',
  branchwraith: 'assets/units/branchwraith.png',
  gladeGuard: 'assets/units/gladeGuard.png',
  wildwoodRangers: 'assets/units/wildwoodRangers.png',
  hawkRiders: 'assets/units/hawkRiders.png',
  malevolentDryads: 'assets/units/malevolentDryads.png',
  malevolentTreeKin: 'assets/units/malevolentTreeKin.png',
  malevolentTreeman: 'assets/units/malevolentTreeman.png',
  malevolentBranchwraith: 'assets/units/malevolentBranchwraith.png',
  giantWolves: 'assets/units/giantWolves.png',
  wildHuntersOfKurnous: 'assets/units/wildHuntersOfKurnous.png',
  ariel: 'assets/units/ariel.png',
  firebarkElders: 'assets/units/firebarkElders.png',
  spellsingerLife: 'assets/units/spellsingerLife.png',
  loecsTricksters: 'assets/units/loecsTricksters.png',
  // Wardancers/Bladesingers (cartes vanilla) pour Wychwethyl (mod Mixu).
  wardancers: 'assets/units/wardancers.png',
  bladesingers: 'assets/units/bladesingers.png',
  eyesOfDrakira: 'assets/units/eyesOfDrakira.png',
  winterheartGuard: 'assets/units/winterheartGuard.png',
  wraithsOfTheFrozenHeart: 'assets/units/wraithsOfTheFrozenHeart.png',
  // Seigneurs Wood Elves (mod Mixu).
  wychwethyl: 'assets/portraits/wychwethyl.png',
  naieth: 'assets/portraits/naieth.png',
  daith: 'assets/portraits/daith.png',
  sceolan: 'assets/portraits/sceolan.png',
  coeddil: 'assets/units/coeddil.png',
  wardensOfCythral: 'assets/units/wardensOfCythral.png'
};
