// ============================================================================
// units/albion.js — images d'unites de la faction « albion », et d'elle seule.
//
// Charge uniquement par albion.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/albion.json ; la valeur est le chemin de l'image reelle.
//
// Ces 31 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/albion.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  // --- Albion (mod OvN Lost Factions) : unités partagées par les 2 seigneurs
  // légendaires (Dural Durak, Mhorriníon). Images extraites du .pack zstd
  // (infopics/portholes) au format portrait ~60×130. ---
  albOathsworn: 'assets/units/albOathsworn.png',
  albOathswornHalberds: 'assets/units/albOathswornHalberds.png',
  albHighlanders: 'assets/units/albHighlanders.png',
  albMaidenguard: 'assets/units/albMaidenguard.png',
  albChosenOfIshernos: 'assets/units/albChosenOfIshernos.png',
  albHuntresses: 'assets/units/albHuntresses.png',
  albFenbeasts: 'assets/units/albFenbeasts.png',
  albFenHulk: 'assets/units/albFenHulk.png',
  albDruidicInitiates: 'assets/units/albDruidicInitiates.png',
  albLlenogCatapult: 'assets/units/albLlenogCatapult.png',
  albBarrowWights: 'assets/units/albBarrowWights.png',
  albDruidicPriestess: 'assets/units/albDruidicPriestess.png',
  albCentaurOghamWarden: 'assets/units/albCentaurOghamWarden.png',
  albWoadRaiders: 'assets/units/albWoadRaiders.png',
  albBloodsworn: 'assets/units/albBloodsworn.png',
  albWarbandGreatWeapons: 'assets/units/albWarbandGreatWeapons.png',
  albHobelars: 'assets/units/albHobelars.png',
  albOathswornCavalry: 'assets/units/albOathswornCavalry.png',
  albCentaurs: 'assets/units/albCentaurs.png',
  albWarChariot: 'assets/units/albWarChariot.png',
  albGiantBlooded: 'assets/units/albGiantBlooded.png',
  albCrows: 'assets/units/albCrows.png',
  albRavens: 'assets/units/albRavens.png',
  albPettyChieftain: 'assets/units/albPettyChieftain.png',
  duralDurak: 'assets/portraits/duralDurak.png',
  morrigan: 'assets/portraits/morrigan.png',
  theFirstbornSons: 'assets/units/theFirstbornSons.png',
  bologs: 'assets/units/bologs.png',
  defendersOfCarnMallog: 'assets/units/defendersOfCarnMallog.png',
  wardensOfTheIsle: 'assets/units/wardensOfTheIsle.png',
  oraclesMaidenguard: 'assets/units/oraclesMaidenguard.png'
};
