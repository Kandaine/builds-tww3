// ============================================================================
// units/lizardmen.js — images d'unites de la faction « lizardmen », et d'elle seule.
//
// Charge uniquement par lizardmen.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/lizardmen.json ; la valeur est le chemin de l'image reelle.
//
// Ces 83 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/lizardmen.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  zlatgar: 'assets/portraits/zlatgar.png',
  mazdamundi: 'assets/portraits/mazdamundi.png',
  kroqgar: 'assets/portraits/kroqgar.png',
  tiktaqto: 'assets/portraits/tiktaqto.png',
  tehenhauin: 'assets/portraits/tehenhauin.png',
  gorrok: 'assets/portraits/gorrok.png',
  nakai: 'assets/portraits/nakai.png',
  oxyotl: 'assets/portraits/oxyotl.png',
  huinitenuchli: 'assets/portraits/huinitenuchli.png',
  tettoeko: 'assets/portraits/tettoeko.png',
  tlatl: 'assets/portraits/tlatl.png',
  adohiTehga: 'assets/portraits/adohiTehga.png',
  templeGuard: 'assets/units/templeGuard.png',
  saurusWarriorsShields: 'assets/units/saurusWarriorsShields.png',
  saurusSpearsShields: 'assets/units/saurusSpearsShields.png',
  blessedSaurusWarriorsShields: 'assets/units/blessedSaurusWarriorsShields.png',
  blessedColdOneSpearRiders: 'assets/units/blessedColdOneSpearRiders.png',
  theRedShields: 'assets/units/theRedShields.png',
  eyesOfTheCanopy: 'assets/units/eyesOfTheCanopy.png',
  wingOfSotek: 'assets/units/wingOfSotek.png',
  theFireLizards: 'assets/units/theFireLizards.png',
  livingBastion: 'assets/units/livingBastion.png',
  blessedTerradonRiders: 'assets/units/blessedTerradonRiders.png',
  blessedRipperdactylRiders: 'assets/units/blessedRipperdactylRiders.png',
  blessedChameleonSkinks: 'assets/units/blessedChameleonSkinks.png',
  blessedChameleonStalkers: 'assets/units/blessedChameleonStalkers.png',
  blessedKroxigor: 'assets/units/blessedKroxigor.png',
  blessedSacredKroxigor: 'assets/units/blessedSacredKroxigor.png',
  blessedSaurusHornedOneRiders: 'assets/units/blessedSaurusHornedOneRiders.png',
  blessedSaurusSpearsShields: 'assets/units/blessedSaurusSpearsShields.png',
  blessedSkinkCohortJavelins: 'assets/units/blessedSkinkCohortJavelins.png',
  blessedSkinkSkirmishers: 'assets/units/blessedSkinkSkirmishers.png',
  blessedTempleGuard: 'assets/units/blessedTempleGuard.png',
  skinkCohortJavelins: 'assets/units/skinkCohortJavelins.png',
  kroxigor: 'assets/units/kroxigor.png',
  bastiladonRevivification: 'assets/units/bastiladonRevivification.png',
  bastiladonSolarEngine: 'assets/units/bastiladonSolarEngine.png',
  coldOneSpearRiders: 'assets/units/coldOneSpearRiders.png',
  stegadon: 'assets/units/stegadon.png',
  skinkSkirmishers: 'assets/units/skinkSkirmishers.png',
  hornedOnes: 'assets/units/hornedOnes.png',
  terradonRiders: 'assets/units/terradonRiders.png',
  ripperdactylRiders: 'assets/units/ripperdactylRiders.png',
  redCrestedSkinks: 'assets/units/redCrestedSkinks.png',
  chameleonSkinks: 'assets/units/chameleonSkinks.png',
  bastiladonArkOfSotek: 'assets/units/bastiladonArkOfSotek.png',
  sacredKroxigor: 'assets/units/sacredKroxigor.png',
  chameleonStalkers: 'assets/units/chameleonStalkers.png',
  saurusSpearsOfTlazcotl: 'assets/units/saurusSpearsOfTlazcotl.png',
  templeGuardOfTlazcotl: 'assets/units/templeGuardOfTlazcotl.png',
  altarGuardiansOfTlazcotl: 'assets/units/altarGuardiansOfTlazcotl.png',
  skinkSkirmishersOfTlazcotl: 'assets/units/skinkSkirmishersOfTlazcotl.png',
  chameleonStalkersOfTlazcotl: 'assets/units/chameleonStalkersOfTlazcotl.png',
  kroxigorBrawlersOfTlazcotl: 'assets/units/kroxigorBrawlersOfTlazcotl.png',
  spawnLeadersOfTlazcotl: 'assets/units/spawnLeadersOfTlazcotl.png',
  coatlProtectorHeavens: 'assets/units/coatlProtectorHeavens.png',
  saurusScarVeteran: 'assets/units/saurusScarVeteran.png',
  skinkChief: 'assets/units/skinkChief.png',
  chakax: 'assets/units/chakax.png',
  skinkPriestHeavens: 'assets/units/skinkPriestHeavens.png',
  lordKroak: 'assets/units/lordKroak.png',
  starChamberGuardians: 'assets/units/starChamberGuardians.png',
  colossadonHunters: 'assets/units/colossadonHunters.png',
  cohortOfSotek: 'assets/units/cohortOfSotek.png',
  legionOfChaqua: 'assets/units/legionOfChaqua.png',
  cohortOfHuatl: 'assets/units/cohortOfHuatl.png',
  pahauxSentinels: 'assets/units/pahauxSentinels.png',
  chameleonSkinkProwler: 'assets/units/chameleonSkinkProwler.png',
  kroxigorElder: 'assets/units/kroxigorElder.png',
  coatl: 'assets/units/coatl.png',
  spiritOfTepok: 'assets/units/spiritOfTepok.png',
  savageSaurusBeastTamer: 'assets/units/savageSaurusBeastTamer.png',
  savageSaurusCrystalback: 'assets/units/savageSaurusCrystalback.png',
  savageSaurusCrystalblades: 'assets/units/savageSaurusCrystalblades.png',
  savageSaurusBrute: 'assets/units/savageSaurusBrute.png',
  huntersOfIxyatl: 'assets/units/huntersOfIxyatl.png',
  templeGuardsOfTepok: 'assets/units/templeGuardsOfTepok.png',
  salamanderPackCrystalback: 'assets/units/salamanderPackCrystalback.png',
  feralCharchanodon: 'assets/units/feralCharchanodon.png',
  hyaenodon: 'assets/units/hyaenodon.png',
  dreadSaurianCrystalback: 'assets/units/dreadSaurianCrystalback.png',
  pahauxSentinels: 'assets/units/pahauxSentinels.png',
  pokHopaksCohort: 'assets/units/pokHopaksCohort.png',
  torchesOfTheUmbralTide: 'assets/units/torchesOfTheUmbralTide.png'
};
