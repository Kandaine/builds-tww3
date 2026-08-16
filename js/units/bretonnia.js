// ============================================================================
// units/bretonnia.js — images d'unites de la faction « bretonnia », et d'elle seule.
//
// Charge uniquement par bretonnia.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/bretonnia.json ; la valeur est le chemin de l'image reelle.
//
// Ces 93 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/bretonnia.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  louen: 'assets/portraits/louen.png',
  repanse: 'assets/portraits/repanse.png',
  fayEnchantress: 'assets/portraits/fayEnchantress.png',
  alberic: 'assets/portraits/alberic.png',
  peasantBowmen: 'assets/units/peasantBowmen.png',
  menAtArms: 'assets/units/menAtArms.png',
  spearmenAtArms: 'assets/units/spearmenAtArms.png',
  knightsErrant: 'assets/units/knightsErrant.png',
  knightsRealm: 'assets/units/knightsRealm.png',
  grailKnights: 'assets/units/grailKnights.png',
  knightsOfOrigo: 'assets/units/knightsOfOrigo.png',
  knightsOrigoCav: 'assets/units/knightsOrigoCav.png',
  squiresOfOrigo: 'assets/units/squiresOfOrigo.png',
  origoSeneschal: 'assets/units/origoSeneschal.png',
  knightsFlameCav: 'assets/units/knightsFlameCav.png',
  knightsFlameFoot: 'assets/units/knightsFlameFoot.png',
  squiresOfTheFlame: 'assets/units/squiresOfTheFlame.png',
  riviereDuAbis: 'assets/units/riviereDuAbis.png',
  flameCaptain: 'assets/units/flameCaptain.png',
  balianIbelin: 'assets/units/balianIbelin.png',
  hermitKnight: 'assets/units/hermitKnight.png',
  knightsOutremerCav: 'assets/units/knightsOutremerCav.png',
  knightsOutremerFoot: 'assets/units/knightsOutremerFoot.png',
  knightsOfIbelin: 'assets/units/knightsOfIbelin.png',
  poulainKnightsCav: 'assets/units/poulainKnightsCav.png',
  serjeantSpearmen: 'assets/units/serjeantSpearmen.png',
  retinueBowmen: 'assets/units/retinueBowmen.png',
  mangonel: 'assets/units/mangonel.png',
  ballistaBrt: 'assets/units/ballistaBrt.png',
  grailReliquae: 'assets/units/grailReliquae.png',
  calard: 'assets/units/calard.png',
  fastric: 'assets/units/fastric.png',
  jerrod: 'assets/units/jerrod.png',
  iselda: 'assets/units/iselda.png',
  holyWardensMaisontaal: 'assets/units/holyWardensMaisontaal.png',
  companionsOfQuenelles: 'assets/units/companionsOfQuenelles.png',
  beastslayersOfBastonne: 'assets/units/beastslayersOfBastonne.png',
  knightsRealmRoR: 'assets/units/knightsRealmRoR.png',
  knightsErrantRoR: 'assets/units/knightsErrantRoR.png',
  pathmaker: 'assets/units/pathmaker.png',
  brtScholar: 'assets/units/brtScholar.png',
  wardenLeofric: 'assets/units/wardenLeofric.png',
  warPilgrimsMace: 'assets/units/warPilgrimsMace.png',
  warPilgrimsMaceShield: 'assets/units/warPilgrimsMaceShield.png',
  battlePilgrimsSps: 'assets/units/battlePilgrimsSps.png',
  mangonelLeofric: 'assets/units/mangonelLeofric.png',
  scorpionLeofric: 'assets/units/scorpionLeofric.png',
  ashigaruYari: 'assets/units/ashigaruYari.png',
  ashigaruBow: 'assets/units/ashigaruBow.png',
  mushaInfantry: 'assets/units/mushaInfantry.png',
  wildwoodRangerLeo: 'assets/units/wildwoodRangerLeo.png',
  wardensOfMontfort: 'assets/units/wardensOfMontfort.png',
  royalPegasusKnights: 'assets/units/royalPegasusKnights.png',
  royalHippogryphKnights: 'assets/units/royalHippogryphKnights.png',
  pegasusKnights: 'assets/units/pegasusKnights.png',
  trebuchet: 'assets/units/trebuchet.png',
  questingKnights: 'assets/units/questingKnights.png',
  battlePilgrims: 'assets/units/battlePilgrims.png',
  grailGuardians: 'assets/units/grailGuardians.png',
  damsel: 'assets/units/damsel.png',
  paladin: 'assets/units/paladin.png',
  footSquires: 'assets/units/footSquires.png',
  henri: 'assets/portraits/henri.png',
  // Bretonnia — Héros Légendaires du mod « Heroes of Legend »
  brtHermitKnight: 'assets/units/brtHermitKnight.png',
  brtViscount: 'assets/units/brtViscount.png',
  brtAgravain: 'assets/units/brtAgravain.png',
  brtBrunner: 'assets/units/brtBrunner.png',
  chaosWarriorsSlaanesh: 'assets/units/chaosWarriorsSlaanesh.png',
  chosenSlaanesh: 'assets/units/chosenSlaanesh.png',
  chaosSorcererSlaanesh: 'assets/units/chaosSorcererSlaanesh.png',
  knightsOfTheLionhearted: 'assets/units/knightsOfTheLionhearted.png',
  defendersOfTheFleurDeLis: 'assets/units/defendersOfTheFleurDeLis.png',
  holyWardensOfLaMaisontaal: 'assets/units/holyWardensOfLaMaisontaal.png',
  beastslayersOfBastonne: 'assets/units/beastslayersOfBastonne.png',
  // Seigneurs Bretonnia (mod Mixu's Legendary Lords).
  johnTyreweld: 'assets/portraits/johnTyreweld.png',
  bohemond: 'assets/portraits/bohemond.png',
  chilfroy: 'assets/portraits/chilfroy.png',
  adalhard: 'assets/portraits/adalhard.png',
  cassyon: 'assets/portraits/cassyon.png',
  mogen: 'assets/portraits/mogen.png',
  balduin: 'assets/portraits/balduin.png',
  leofric: 'assets/portraits/leofric.png',
  hagen: 'assets/portraits/hagen.png',
  folcard: 'assets/portraits/folcard.png',
  tancred: 'assets/portraits/tancred.png',
  taubert: 'assets/portraits/taubert.png',
  theodoric: 'assets/portraits/theodoric.png',
  armand: 'assets/portraits/armand.png',
  // Héros légendaires Bretonnia (mod Mixu) : Donna Don Domingio (champion des
  // Knights of Origo de Sir John), Amalric de Gaudaron (Fléau des Morts-Vivants).
  donnaDonDomingio: 'assets/portraits/donnaDonDomingio.png',
  amalricDeGaudaron: 'assets/portraits/amalricDeGaudaron.png',
  alphonseDolmance: 'assets/portraits/alphonseDolmance.png',
  chaosMaraudersSlaanesh: 'assets/units/chaosMaraudersSlaanesh.png',
  malok: 'assets/portraits/malok.png',
  lafayetteOfTaurus: 'assets/units/lafayetteOfTaurus.png'
};
