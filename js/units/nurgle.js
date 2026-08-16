// ============================================================================
// units/nurgle.js — images d'unites de la faction « nurgle », et d'elle seule.
//
// Charge uniquement par nurgle.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/nurgle.json ; la valeur est le chemin de l'image reelle.
//
// Ces 24 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/nurgle.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  valnirTheReaper: 'assets/portraits/valnirTheReaper.png',
  nurglings: 'assets/units/nurglings.png',
  kugath: 'assets/portraits/kugath.png',
  epidemius: 'assets/portraits/epidemius.png',
  tamurkhan: 'assets/portraits/tamurkhan.png',
  chaosSorcererNurgle: 'assets/units/chaosSorcererNurgle.png',
  exaltedHeroNurgle: 'assets/units/exaltedHeroNurgle.png',
  theDaemonspew: 'assets/units/theDaemonspew.png',
  theDaemonspew: 'assets/units/theDaemonspew.png',
  plaguebearersOfNurgle: 'assets/units/plaguebearersOfNurgle.png',
  forsakenNurgle: 'assets/units/forsakenNurgle.png',
  plagueridden: 'assets/units/plagueridden.png',
  exaltedPlaguebearersOfNurgle: 'assets/units/exaltedPlaguebearersOfNurgle.png',
  plagueToadsOfNurgle: 'assets/units/plagueToadsOfNurgle.png',
  chaosFuriesNurgle: 'assets/units/chaosFuriesNurgle.png',
  plagueDronesOfNurgleDeathsHeads: 'assets/units/plagueDronesOfNurgleDeathsHeads.png',
  rotFlies: 'assets/units/rotFlies.png',
  plagueOgres: 'assets/units/plagueOgres.png',
  chaosWarriorsOfNurgleGreatWeapons: 'assets/units/chaosWarriorsOfNurgleGreatWeapons.png',
  pestigorsNurgle: 'assets/units/pestigorsNurgle.png',
  rotKnights: 'assets/units/rotKnights.png',
  frolickersBubonic: 'assets/units/frolickersBubonic.png',
  uncleFuruncle: 'assets/units/uncleFuruncle.png',
  festeringStooges: 'assets/units/festeringStooges.png',
  rottingRiders: 'assets/units/rottingRiders.png'
};
