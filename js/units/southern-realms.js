// ============================================================================
// units/southern-realms.js — images d'unites de la faction « southern-realms », et d'elle seule.
//
// Charge uniquement par southern_realms.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/southern-realms.json ; la valeur est le chemin de l'image reelle.
//
// Ces 53 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/southern-realms.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  ranger: 'assets/units/ranger.png',
  valmirGausser: 'assets/portraits/valmirGausser.png',
  borgio: 'assets/portraits/borgio.png',
  lucrezzia: 'assets/portraits/lucrezzia.png',
  catrazza: 'assets/portraits/catrazza.png',
  marcoColombo: 'assets/portraits/marcoColombo.png',
  elCadavo: 'assets/portraits/elCadavo.png',
  lupioSunscryer: 'assets/portraits/lupioSunscryer.png',
  lorenzoLupo: 'assets/portraits/lorenzoLupo.png',
  gashnagBlackPrince: 'assets/portraits/gashnagBlackPrince.png',
  // --- Southern Realms (mod « The Southern Realms — TEB Subculture Overhaul ») ---
  tebMasterDuellist: 'assets/units/tebMasterDuellist.png',
  tebPriestessMyrmidia: 'assets/units/tebPriestessMyrmidia.png',
  tebAlcatani: 'assets/units/tebAlcatani.png',
  tebPikemen: 'assets/units/tebPikemen.png',
  tebBorderRangers: 'assets/units/tebBorderRangers.png',
  tebHandgunners: 'assets/units/tebHandgunners.png',
  tebPavisiers: 'assets/units/tebPavisiers.png',
  tebFreelanceKnights: 'assets/units/tebFreelanceKnights.png',
  tebMontanteSwordsmen: 'assets/units/tebMontanteSwordsmen.png',
  tebDuellists: 'assets/units/tebDuellists.png',
  tebIrrananHillmen: 'assets/units/tebIrrananHillmen.png',
  // Southern Realms : RoR et unités des 8 autres seigneurs
  tebVespero: 'assets/units/tebVespero.png',
  tebBraganzaBesiegers: 'assets/units/tebBraganzaBesiegers.png',
  tebMarksmenMiragliano: 'assets/units/tebMarksmenMiragliano.png',
  tebPirazzoLostLegion: 'assets/units/tebPirazzoLostLegion.png',
  tebLeopardCompany: 'assets/units/tebLeopardCompany.png',
  tebRepublicanGuard: 'assets/units/tebRepublicanGuard.png',
  tebBirdmenCatrazza: 'assets/units/tebBirdmenCatrazza.png',
  tebTortoiseTank: 'assets/units/tebTortoiseTank.png',
  tebBronzinoGalloperGuns: 'assets/units/tebBronzinoGalloperGuns.png',
  tebLightCannons: 'assets/units/tebLightCannons.png',
  tebCarabiniers: 'assets/units/tebCarabiniers.png',
  tebRoyalGuard: 'assets/units/tebRoyalGuard.png',
  tebAdventurers: 'assets/units/tebAdventurers.png',
  tebRiders: 'assets/units/tebRiders.png',
  tebLancers: 'assets/units/tebLancers.png',
  tebTichiHuichiRaiders: 'assets/units/tebTichiHuichiRaiders.png',
  tebSartosanPirates: 'assets/units/tebSartosanPirates.png',
  tebCursedCompany: 'assets/units/tebCursedCompany.png',
  tebAnakondaAmazons: 'assets/units/tebAnakondaAmazons.png',
  tebSistersOfFury: 'assets/units/tebSistersOfFury.png',
  tebCrossbowmen: 'assets/units/tebCrossbowmen.png',
  tebKnightsEncarmine: 'assets/units/tebKnightsEncarmine.png',
  tebBrokenLances: 'assets/units/tebBrokenLances.png',
  tebNobleRetinue: 'assets/units/tebNobleRetinue.png',
  tebSwashbucklers: 'assets/units/tebSwashbucklers.png',
  tebVolandsVenators: 'assets/units/tebVolandsVenators.png',
  tebRiccoRepublicanGuard: 'assets/units/tebRiccoRepublicanGuard.png',
  tebMengilManflayers: 'assets/units/tebMengilManflayers.png',
  tebAsarnilDragonlord: 'assets/units/tebAsarnilDragonlord.png',
  tebAlMuktarDesertDogs: 'assets/units/tebAlMuktarDesertDogs.png',
  tebBillmen: 'assets/units/tebBillmen.png',
  tebPrincesOwnBlackWatch: 'assets/units/tebPrincesOwnBlackWatch.png',
  tebSonsOfStrygos: 'assets/units/tebSonsOfStrygos.png',
  // Luccini — contenu du mod « Heroes of Legend » (Lorenzo Lupo retravaillé)
  lucRemanLegionary: 'assets/units/lucRemanLegionary.png',
  lucAssassin: 'assets/units/lucAssassin.png'
};
