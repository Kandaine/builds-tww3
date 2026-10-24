// ============================================================================
// units/khorne.js — images d'unites de la faction « khorne », et d'elle seule.
//
// Charge uniquement par khorne.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/khorne.json ; la valeur est le chemin de l'image reelle.
//
// Ses entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js. Leur nombre n'est pas
// ecrit ici : il change avec les fiches, et le chiffre du decoupage s'etait perime.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/khorne.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  chaosWarhoundsKhorne: 'assets/units/chaosWarhoundsKhorne.png',
  skarrBloodwrath: 'assets/portraits/skarrBloodwrath.png',
  abraxTheBloody: 'assets/portraits/abraxTheBloody.png',
  kaarnTheVanquisher: 'assets/portraits/kaarnTheVanquisher.png',
  khabandha: 'assets/portraits/khabandha.png',
  skarbrand: 'assets/portraits/skarbrand.png',
  skulltaker: 'assets/portraits/skulltaker.png',
  arbaal: 'assets/portraits/arbaal.png',
  chaosWarriorsKhorne: 'assets/units/chaosWarriorsKhorne.png',
  chaosWarriorsKhorneHalberds: 'assets/units/chaosWarriorsKhorneHalberds.png',
  skullcrushersKhorne: 'assets/units/skullcrushersKhorne.png',
  fleshHoundsKhorne: 'assets/units/fleshHoundsKhorne.png',
  houndsOfTheBloodHunt: 'assets/units/houndsOfTheBloodHunt.png',
  khoSimaergul: 'assets/units/khoSimaergul.png',
  bloodlettersKhorne: 'assets/units/bloodlettersKhorne.png',
  herumarHoundmaster: 'assets/units/herumarHoundmaster.png',
  khorosTheBaying: 'assets/units/khorosTheBaying.png',
  scylaAnfingrimm: 'assets/units/scylaAnfingrimm.png',
  houndsOfHerumar: 'assets/units/houndsOfHerumar.png',
  houndsOfKhoros: 'assets/units/houndsOfKhoros.png',
  bloodwakeBerserkers: 'assets/units/bloodwakeBerserkers.png',
  wrathmongers: 'assets/units/wrathmongers.png',
  skullreapers: 'assets/units/skullreapers.png',
  exaltedBloodlettersKhorne: 'assets/units/exaltedBloodlettersKhorne.png',
  theHellforgedHost: 'assets/units/theHellforgedHost.png',
  bloodcrushersKhorne: 'assets/units/bloodcrushersKhorne.png',
  bloodbeastsKhorne: 'assets/units/bloodbeastsKhorne.png',
  bloodreaper: 'assets/units/bloodreaper.png',
  exaltedHeroOfKhorne: 'assets/units/exaltedHeroOfKhorne.png',
  bloodthirsterKhorne: 'assets/units/bloodthirsterKhorne.png',
  theSkaradrim: 'assets/units/theSkaradrim.png',
  soulGrinderKhorne: 'assets/units/soulGrinderKhorne.png',
  gurniIronarm: 'assets/units/gurniIronarm.png',
  vasloKruld: 'assets/units/vasloKruld.png',
  theMardagg: 'assets/units/theMardagg.png',
  brutesOfTheHound: 'assets/units/brutesOfTheHound.png',
  khornesBloodyFist: 'assets/units/khornesBloodyFist.png',
  lordSlaurith: 'assets/portraits/lordSlaurith.png',
  knightsOfTheBrazenThrone: 'assets/units/knightsOfTheBrazenThrone.png',
  heraldsOfKhornesFury: 'assets/units/heraldsOfKhornesFury.png',
  skullharvestRavagers: 'assets/units/skullharvestRavagers.png',
  // Karanak, héros légendaire du jeu de base (wh3_pro12_kho_cha_karanak), mission au rang 16
  // ouverte à Skarbrand, Arbaal et Skulltaker entre autres. Portrait ui/portraits/units/no_culture/dae_karanak_0.png
  // (ui.pack : aucune carte ui/units/icons n'existe pour ce héros), 60×130.
  karanak: 'assets/units/karanak.png'
};
