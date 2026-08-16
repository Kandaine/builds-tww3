// ============================================================================
// units/vampire-coast.js — images d'unites de la faction « vampire-coast », et d'elle seule.
//
// Charge uniquement par vampire_coast.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/vampire-coast.json ; la valeur est le chemin de l'image reelle.
//
// Ces 42 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/vampire-coast.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  redAldrek: 'assets/portraits/redAldrek.png',
  harkon: 'assets/portraits/harkon.png',
  noctilus: 'assets/portraits/noctilus.png',
  aranessa: 'assets/portraits/aranessa.png',
  cylostra: 'assets/portraits/cylostra.png',
  zombieDeckhands: 'assets/units/zombieDeckhands.png',
  zombieDeckhandsPolearm: 'assets/units/zombieDeckhandsPolearm.png',
  zombieGunneryMob: 'assets/units/zombieGunneryMob.png',
  zombieGunneryModHandguns: 'assets/units/zombieGunneryModHandguns.png',
  deckDroppers: 'assets/units/deckDroppers.png',
  mortarsVampireCoast: 'assets/units/mortarsVampireCoast.png',
  carronades: 'assets/units/carronades.png',
  bloatedCorpse: 'assets/units/bloatedCorpse.png',
  necrofexColossus: 'assets/units/necrofexColossus.png',
  depthGuardDeckRavagers: 'assets/units/depthGuardDeckRavagers.png',
  depthGuardDeckWatchers: 'assets/units/depthGuardDeckWatchers.png',
  mournguls: 'assets/units/mournguls.png',
  rottingPrometheans: 'assets/units/rottingPrometheans.png',
  deathShriekTerrorgheist: 'assets/units/deathShriekTerrorgheist.png',
  sartosaFreeCompany: 'assets/units/sartosaFreeCompany.png',
  sartosaMilitia: 'assets/units/sartosaMilitia.png',
  scurvyDogs: 'assets/units/scurvyDogs.png',
  syreens: 'assets/units/syreens.png',
  rottingLeviathan: 'assets/units/rottingLeviathan.png',
  gunneryWight: 'assets/units/gunneryWight.png',
  drekla: 'assets/units/drekla.png',
  mournghulHaunter: 'assets/units/mournghulHaunter.png',
  damnedPaladin: 'assets/units/damnedPaladin.png',
  blackSpot: 'assets/units/blackSpot.png',
  bloodyReaverDeckGuard: 'assets/units/bloodyReaverDeckGuard.png',
  tideOfSkjold: 'assets/units/tideOfSkjold.png',
  lampreysRevenge: 'assets/units/lampreysRevenge.png',
  oggHalfheart: 'assets/units/oggHalfheart.png',
  blackJens: 'assets/units/blackJens.png',
  blackleggesTheGiant: 'assets/units/blackleggesTheGiant.png',
  ilPotenteGranchio: 'assets/units/ilPotenteGranchio.png',
  infantaLeanoraNavrre: 'assets/units/infantaLeanoraNavrre.png',
  leanoraNavrre: 'assets/portraits/leanoraNavrre.png',
  gallowsGiant: 'assets/units/gallowsGiant.png',
  nightTerrorsCst: 'assets/units/nightTerrorsCst.png',
  shadewraithGunners: 'assets/units/shadewraithGunners.png',
  saltLordScuttlers: 'assets/units/saltLordScuttlers.png'
};
