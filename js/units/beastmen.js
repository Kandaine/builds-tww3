// ============================================================================
// units/beastmen.js — images d'unites de la faction « beastmen », et d'elle seule.
//
// Charge uniquement par beastmen.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/beastmen.json ; la valeur est le chemin de l'image reelle.
//
// Ces 43 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/beastmen.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  khazrak: 'assets/portraits/khazrak.png',
  malagor: 'assets/portraits/malagor.png',
  morghur: 'assets/portraits/morghur.png',
  taurox: 'assets/portraits/taurox.png',
  gorHerd: 'assets/units/gorHerd.png',
  ungorHerd: 'assets/units/ungorHerd.png',
  ungorRaiders: 'assets/units/ungorRaiders.png',
  bestigorHerd: 'assets/units/bestigorHerd.png',
  razorgorChariot: 'assets/units/razorgorChariot.png',
  centigors: 'assets/units/centigors.png',
  sonsOfGhorros: 'assets/units/sonsOfGhorros.png',
  harpies: 'assets/units/harpies.png',
  chaosSpawn: 'assets/units/chaosSpawn.png',
  giant: 'assets/units/giant.png',
  chaosWarhounds: 'assets/units/chaosWarhounds.png',
  ghorgon: 'assets/units/ghorgon.png',
  minotaurs: 'assets/units/minotaurs.png',
  minotaursShields: 'assets/units/minotaursShields.png',
  ungrolFourHorn: 'assets/units/ungrolFourHorn.png',
  minotaursGreatWeapons: 'assets/units/minotaursGreatWeapons.png',
  jabberslythe: 'assets/units/jabberslythe.png',
  wargor: 'assets/units/wargor.png',
  brayShaman: 'assets/units/brayShaman.png',
  littleMorella: 'assets/units/littleMorella.png',
  tzaangors: 'assets/units/tzaangors.png',
  khorngors: 'assets/units/khorngors.png',
  pestigors: 'assets/units/pestigors.png',
  theEyeOfMorrslieb: 'assets/units/theEyeOfMorrslieb.png',
  gronk: 'assets/portraits/gronk.png',
  slugtongue: 'assets/portraits/slugtongue.png',
  ghorros: 'assets/portraits/ghorros.png',
  ragushBloodyHorn: 'assets/portraits/ragushBloodyHorn.png',
  destroyersOfTheDrakwald: 'assets/units/destroyersOfTheDrakwald.png',
  blackHornsRavagers: 'assets/units/blackHornsRavagers.png',
  butchersOfKalkengard: 'assets/units/butchersOfKalkengard.png',
  theVorberglandBroodmother: 'assets/units/theVorberglandBroodmother.png',
  piercingEye: 'assets/units/piercingEye.png',
  kharakStoneheart: 'assets/units/kharakStoneheart.png',
  doomgore: 'assets/units/doomgore.png',
  khorokManripper: 'assets/units/khorokManripper.png',
  shearKhawnVanguard: 'assets/portraits/shearKhawnVanguard.png',
  khorroksManrippers: 'assets/units/khorroksManrippers.png',
  bloodbruteBehemoth: 'assets/units/bloodbruteBehemoth.png'
};
