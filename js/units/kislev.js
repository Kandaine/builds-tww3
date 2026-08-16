// ============================================================================
// units/kislev.js — images d'unites de la faction « kislev », et d'elle seule.
//
// Charge uniquement par kislev.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/kislev.json ; la valeur est le chemin de l'image reelle.
//
// Ces 41 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/kislev.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  boris: 'assets/portraits/boris.png',
  katarin: 'assets/portraits/katarin.png',
  kostaltyn: 'assets/portraits/kostaltyn.png',
  ostankya: 'assets/portraits/ostankya.png',
  rastiltin: 'assets/portraits/rastiltin.png',
  armouredKossars: 'assets/units/armouredKossars.png',
  watchmenInTheNight: 'assets/units/watchmenInTheNight.png',
  iceGuardSwords: 'assets/units/iceGuardSwords.png',
  kossars: 'assets/units/kossars.png',
  wingedLancers: 'assets/units/wingedLancers.png',
  snowLeopard: 'assets/units/snowLeopard.png',
  frostMaidenIce: 'assets/units/frostMaidenIce.png',
  tzarGuard: 'assets/units/tzarGuard.png',
  warBearRiders: 'assets/units/warBearRiders.png',
  patriarch: 'assets/units/patriarch.png',
  streltsi: 'assets/units/streltsi.png',
  kossoviteDervishes: 'assets/units/kossoviteDervishes.png',
  horseArchers: 'assets/units/horseArchers.png',
  lightWarSleds: 'assets/units/lightWarSleds.png',
  kisleviteWarriors: 'assets/units/kisleviteWarriors.png',
  akshinaAmbushers: 'assets/units/akshinaAmbushers.png',
  theWolfhearts: 'assets/units/theWolfhearts.png',
  brotherhoodRangerTemplars: 'assets/units/brotherhoodRangerTemplars.png',
  feralBears: 'assets/units/feralBears.png',
  incarnateElementalOfBeasts: 'assets/units/incarnateElementalOfBeasts.png',
  theThingsInTheWoods: 'assets/units/theThingsInTheWoods.png',
  caveBats: 'assets/units/caveBats.png',
  giantSpiders: 'assets/units/giantSpiders.png',
  hagWitchBeasts: 'assets/units/hagWitchBeasts.png',
  dazhsHearthblades: 'assets/units/dazhsHearthblades.png',
  iljaOfMurova: 'assets/units/iljaOfMurova.png',
  vladimirStormbringer: 'assets/units/vladimirStormbringer.png',
  goldenKnight: 'assets/units/goldenKnight.png',
  mordheimBalewolves: 'assets/units/mordheimBalewolves.png',
  theThingsInTheWoods: 'assets/units/theThingsInTheWoods.png',
  elementalBear: 'assets/units/elementalBear.png',
  theFrozenHeartOfWinter: 'assets/units/theFrozenHeartOfWinter.png',
  gryphonLegion: 'assets/units/gryphonLegion.png',
  boyarMazur: 'assets/portraits/boyarMazur.png',
  jacobKislev: 'assets/portraits/jacobKislev.png',
  boydinovsBrawlers: 'assets/units/boydinovsBrawlers.png',
  oathBrothersOfTor: 'assets/units/oathBrothersOfTor.png'
};
