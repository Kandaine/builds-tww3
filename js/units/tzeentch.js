// ============================================================================
// units/tzeentch.js — images d'unites de la faction « tzeentch », et d'elle seule.
//
// Charge uniquement par tzeentch.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/tzeentch.json ; la valeur est le chemin de l'image reelle.
//
// Ces 38 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/tzeentch.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  tzaangors: 'assets/units/tzaangors.png',
  theSeveredClaw: 'assets/units/theSeveredClaw.png',
  aspiringChampions: 'assets/units/aspiringChampions.png',
  cultistsOfTzeentch: 'assets/units/cultistsOfTzeentch.png',
  acolytesOfTzeentch: 'assets/units/acolytesOfTzeentch.png',
  sorcerousTrolls: 'assets/units/sorcerousTrolls.png',
  amonChakai: 'assets/portraits/amonChakai.png',
  blueHorrors: 'assets/units/blueHorrors.png',
  pinkHorrors: 'assets/units/pinkHorrors.png',
  lordOfChange: 'assets/units/lordOfChange.png',
  goldenGriffinOfTheurgy: 'assets/units/goldenGriffinOfTheurgy.png',
  zoreadWarpscorched: 'assets/units/zoreadWarpscorched.png',
  xuqls: 'assets/units/xuqls.png',
  blueScribes: 'assets/units/blueScribes.png',
  aekoldHelbrass: 'assets/portraits/aekoldHelbrass.png',
  sarthorael: 'assets/portraits/sarthorael.png',
  chaosWarriorsTzeentch: 'assets/units/chaosWarriorsTzeentch.png',
  forsakenTzeentch: 'assets/units/forsakenTzeentch.png',
  chaosKnightsTzeentch: 'assets/units/chaosKnightsTzeentch.png',
  chaosSorcererTzeentch: 'assets/units/chaosSorcererTzeentch.png',
  kairos: 'assets/portraits/kairos.png',
  changeling: 'assets/portraits/changeling.png',
  egrimm: 'assets/portraits/egrimm.png',
  chaosFuriesTzeentch: 'assets/units/chaosFuriesTzeentch.png',
  screamers: 'assets/units/screamers.png',
  shriekingSkyrays: 'assets/units/shriekingSkyrays.png',
  exaltedFlamer: 'assets/units/exaltedFlamer.png',
  soulGrinder: 'assets/units/soulGrinder.png',
  cockatrice: 'assets/units/cockatrice.png',
  changebringers: 'assets/units/changebringers.png',
  flamers: 'assets/units/flamers.png',
  burningChariot: 'assets/units/burningChariot.png',
  cultistOfTzeentch: 'assets/units/cultistOfTzeentch.png',
  blazingSquealers: 'assets/units/blazingSquealers.png',
  chromaticAbominations: 'assets/units/chromaticAbominations.png',
  bahr: 'assets/units/bahr.png',
  tchzen: 'assets/units/tchzen.png',
  theSourguts: 'assets/units/theSourguts.png'
};
