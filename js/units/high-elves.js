// ============================================================================
// units/high-elves.js — images d'unites de la faction « high-elves », et d'elle seule.
//
// Charge uniquement par high_elves.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/high-elves.json ; la valeur est le chemin de l'image reelle.
//
// Ces 81 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/high-elves.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  tyrion: 'assets/portraits/tyrion.png',
  teclis: 'assets/portraits/teclis.png',
  eltharion: 'assets/portraits/eltharion.png',
  imrik: 'assets/portraits/imrik.png',
  althranStormrider: 'assets/portraits/althranStormrider.png',
  amon: 'assets/portraits/amon.png',
  alithanar: 'assets/portraits/alithanar.png',
  alarielle: 'assets/portraits/alarielle.png',
  aislinn: 'assets/portraits/aislinn.png',
  shipsCompany: 'assets/units/shipsCompany.png',
  oceanids: 'assets/units/oceanids.png',
  seaElemental: 'assets/units/seaElemental.png',
  merwyrm: 'assets/units/merwyrm.png',
  skycutter: 'assets/units/skycutter.png',
  hefSpearman: 'assets/units/hefSpearman.png',
  hefArcher: 'assets/units/hefArcher.png',
  silverHelm: 'assets/units/silverHelm.png',
  lothernSeaGuard: 'assets/units/lothernSeaGuard.png',
  swordmaster: 'assets/units/swordmaster.png',
  dragonPrince: 'assets/units/dragonPrince.png',
  sistersOfAvelorn: 'assets/units/sistersOfAvelorn.png',
  shoreRiders: 'assets/units/shoreRiders.png',
  caladris: 'assets/units/caladris.png',
  fireCompany: 'assets/units/fireCompany.png',
  brightFalconCompany: 'assets/units/brightFalconCompany.png',
  // Amon (Tor Elasor — mod Islanders of the Moon) : unités coloniales uniques
  hefColonialMilitiamen: 'assets/units/hefColonialMilitiamen.png',
  hefTowerGuardTorElasor: 'assets/units/hefTowerGuardTorElasor.png',
  // Hauts Elfes — Héros Légendaires (jeu de base)
  hefCaradryan: 'assets/units/hefCaradryan.png',
  hefHandShadowCrown: 'assets/units/hefHandShadowCrown.png',
  // Hauts Elfes — Héros Légendaires du mod « Heroes of Legend »
  hefElasir: 'assets/units/hefElasir.png',
  hefAnurion: 'assets/units/hefAnurion.png',
  shadowWalker: 'assets/units/shadowWalker.png',
  theGrey: 'assets/units/theGrey.png',
  dryad: 'assets/units/dryad.png',
  treeKin: 'assets/units/treeKin.png',
  phoenix: 'assets/units/phoenix.png',
  arcanePhoenix: 'assets/units/arcanePhoenix.png',
  // Unités High Elves vanilla (cartes officielles) pour les seigneurs Mixu
  // Belannaer (Swordmasters/magie) et Korhil (White Lions de Chrace).
  whiteLions: 'assets/units/whiteLions.png',
  puremaneCompany: 'assets/units/puremaneCompany.png',
  warLions: 'assets/units/warLions.png',
  lionChariot: 'assets/units/lionChariot.png',
  phoenixGuard: 'assets/units/phoenixGuard.png',
  loremaster: 'assets/units/loremaster.png',
  aurelion: 'assets/units/aurelion.png',
  loremasterTalarian: 'assets/units/loremasterTalarian.png',
  omenOfAsuryan: 'assets/units/omenOfAsuryan.png',
  dragon: 'assets/units/dragon.png',
  greatEagle: 'assets/units/greatEagle.png',
  boltThrower: 'assets/units/boltThrower.png',
  mage: 'assets/units/mage.png',
  noble: 'assets/units/noble.png',
  shadowWalkers: 'assets/units/shadowWalkers.png',
  stormRiders: 'assets/units/stormRiders.png',
  bladesOfHoeth: 'assets/units/bladesOfHoeth.png',
  scionsOfMathlann: 'assets/units/scionsOfMathlann.png',
  talonsOfTorCaleda: 'assets/units/talonsOfTorCaleda.png',
  fireborn: 'assets/units/fireborn.png',
  companyOfTheKalendirian: 'assets/units/companyOfTheKalendirian.png',
  // Seigneurs High Elves (mod Mixu) : Belannaer (Saphery), Korhil (Chrace).
  belannaer: 'assets/portraits/belannaer.png',
  korhil: 'assets/portraits/korhil.png',
  highMageTorinubar: 'assets/portraits/highMageTorinubar.png',
  princessEldyra: 'assets/portraits/princessEldyra.png',
  liandraAthinol: 'assets/portraits/liandraAthinol.png',
  arandirSwiftwing: 'assets/portraits/arandirSwiftwing.png',
  tiranocChariot: 'assets/units/tiranocChariot.png',
  ellyrianReavers: 'assets/units/ellyrianReavers.png',
  ellyrianReaverArchers: 'assets/units/ellyrianReaverArchers.png',
  sunDragon: 'assets/units/sunDragon.png',
  moonDragon: 'assets/units/moonDragon.png',
  chiefHandmaidenLirazel: 'assets/units/chiefHandmaidenLirazel.png',
  khaltarTheWind: 'assets/units/khaltarTheWind.png',
  selafynOfTheAnnulii: 'assets/units/selafynOfTheAnnulii.png',
  eoloranGrayhawk: 'assets/portraits/eoloranGrayhawk.png',
  qisaer: 'assets/portraits/qisaer.png',
  everqueensCourtGuards: 'assets/units/everqueensCourtGuards.png',
  silverpelts: 'assets/units/silverpelts.png',
  eataineGuard: 'assets/units/eataineGuard.png',
  keepersOfTheFlame: 'assets/units/keepersOfTheFlame.png',
  rahagrasPride: 'assets/units/rahagrasPride.png',
  heraldsOfTheWind: 'assets/units/heraldsOfTheWind.png',
  silakOneEye: 'assets/units/silakOneEye.png',
  brinedragonSwords: 'assets/units/brinedragonSwords.png'
};
