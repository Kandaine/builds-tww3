// ============================================================================
// units/fimir.js — images d'unites de la faction « fimir », et d'elle seule.
//
// Charge uniquement par fimir.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/fimir.json ; la valeur est le chemin de l'image reelle.
//
// Ces 22 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/fimir.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  jabberslythe: 'assets/units/jabberslythe.png',
  // --- Fimir (mod OvN Lost Factions) : roster de Skattach et Kroll ---
  fimMistmor: 'assets/units/fimMistmor.png',
  fimBoglarShaman: 'assets/units/fimBoglarShaman.png',
  fimBalefiend: 'assets/units/fimBalefiend.png',
  fimShearl: 'assets/units/fimShearl.png',
  fimShearlMirestalkers: 'assets/units/fimShearlMirestalkers.png',
  fimFimmWarriors: 'assets/units/fimFimmWarriors.png',
  fimFimmWarriorsGW: 'assets/units/fimFimmWarriorsGW.png',
  fimFiannaFimm: 'assets/units/fimFiannaFimm.png',
  fimFiannaFimmGW: 'assets/units/fimFiannaFimmGW.png',
  fimDaemonomaniac: 'assets/units/fimDaemonomaniac.png',
  fimFogShrine: 'assets/units/fimFogShrine.png',
  fimFenbeast: 'assets/units/fimFenbeast.png',
  fimSwampDaemons: 'assets/units/fimSwampDaemons.png',
  fimBogOctopus: 'assets/units/fimBogOctopus.png',
  skattach: 'assets/portraits/skattach.png',
  kroll: 'assets/portraits/kroll.png',
  chaosFuries: 'assets/units/chaosFuries.png',
  eyeOfDoom: 'assets/units/eyeOfDoom.png',
  followersOfBalor: 'assets/units/followersOfBalor.png',
  chulannsMarshHornets: 'assets/units/chulannsMarshHornets.png',
  gharnusDaemonFriends: 'assets/units/gharnusDaemonFriends.png'
};
