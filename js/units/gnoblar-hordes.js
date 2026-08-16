// ============================================================================
// units/gnoblar-hordes.js — images d'unites de la faction « gnoblar-hordes », et d'elle seule.
//
// Charge uniquement par gnoblar_hordes.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/gnoblar-hordes.json ; la valeur est le chemin de l'image reelle.
//
// Ces 29 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/gnoblar-hordes.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  // --- Gnoblar Hordes (mod « The Unwashed Masses ») : roster de Bezer, Gnobbo et Bunsen ---
  // Héros
  gnobWoodbelly: 'assets/units/gnobWoodbelly.png',
  gnobBloodnose: 'assets/units/gnobBloodnose.png',
  gnobBonechewer: 'assets/units/gnobBonechewer.png',
  gnobScrapper: 'assets/units/gnobScrapper.png',
  gnobTorchGnoblar: 'assets/units/gnobTorchGnoblar.png',
  gnobTorchnose: 'assets/units/gnobTorchnose.png',
  // Infanterie
  gnobFlingers: 'assets/units/gnobFlingers.png',
  gnobManbiters: 'assets/units/gnobManbiters.png',
  gnobOgrebiters: 'assets/units/gnobOgrebiters.png',
  gnobPowderSniffers: 'assets/units/gnobPowderSniffers.png',
  gnobRustbuckets: 'assets/units/gnobRustbuckets.png',
  gnobRustbucketsGW: 'assets/units/gnobRustbucketsGW.png',
  // Cavalerie / monstres
  gnobPigbackTossers: 'assets/units/gnobPigbackTossers.png',
  gnobSabretuskRiders: 'assets/units/gnobSabretuskRiders.png',
  gnobRhinoxRiders: 'assets/units/gnobRhinoxRiders.png',
  gnobYhetees: 'assets/units/gnobYhetees.png',
  gnobLavaSpiders: 'assets/units/gnobLavaSpiders.png',
  gnobLavaArachnarok: 'assets/units/gnobLavaArachnarok.png',
  gnobGreatScarletIiwi: 'assets/units/gnobGreatScarletIiwi.png',
  // Régiments de Renom
  gnobBoomSquad: 'assets/units/gnobBoomSquad.png',
  gnobPhutGunShootaz: 'assets/units/gnobPhutGunShootaz.png',
  gnobGorespittles: 'assets/units/gnobGorespittles.png',
  gnobTreasureGuards: 'assets/units/gnobTreasureGuards.png',
  gnobKnightsPigbarter: 'assets/units/gnobKnightsPigbarter.png',
  bezer: 'assets/portraits/bezer.png',
  gnobbo: 'assets/portraits/gnobbo.png',
  bunsen: 'assets/portraits/bunsen.png',
  gnoblars: 'assets/units/gnoblars.png',
  gnoblarScraplauncher: 'assets/units/gnoblarScraplauncher.png'
};
