// ============================================================================
// units/araby.js — images d'unites de la faction « araby », et d'elle seule.
//
// Charge uniquement par araby.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/araby.json ; la valeur est le chemin de l'image reelle.
//
// Ces 40 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/araby.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  // --- Araby (mod OvN Lost Factions) : roster de Sultan Jaffar. Images
  // extraites du .pack zstd (icônes/portraits, ratio portrait 6:13). ---
  arbWazar: 'assets/units/arbWazar.png',
  arbMagicianFire: 'assets/units/arbMagicianFire.png',
  arbBlackScimitarGuard: 'assets/units/arbBlackScimitarGuard.png',
  arbPalaceGuards: 'assets/units/arbPalaceGuards.png',
  arbSpearmen: 'assets/units/arbSpearmen.png',
  arbBowmen: 'assets/units/arbBowmen.png',
  arbJezzails: 'assets/units/arbJezzails.png',
  arbCamelArchers: 'assets/units/arbCamelArchers.png',
  arbArabyanKnights: 'assets/units/arbArabyanKnights.png',
  // Héros et unités des 3 autres seigneurs d'Araby (Golden Magus, Fatandira, Wizard Caliph)
  arbEmir: 'assets/units/arbEmir.png',
  arbHashishin: 'assets/units/arbHashishin.png',
  arbMagicianLife: 'assets/units/arbMagicianLife.png',
  arbMagicianDesert: 'assets/units/arbMagicianDesert.png',
  arbMagicianHeavens: 'assets/units/arbMagicianHeavens.png',
  arbCorsairs: 'assets/units/arbCorsairs.png',
  arbSeaMonarch: 'assets/units/arbSeaMonarch.png',
  arbSeaNymph: 'assets/units/arbSeaNymph.png',
  arbPitFighters: 'assets/units/arbPitFighters.png',
  arbDesertDogs: 'assets/units/arbDesertDogs.png',
  arbDesertRiders: 'assets/units/arbDesertRiders.png',
  arbCamelLancers: 'assets/units/arbCamelLancers.png',
  arbCamelJezzails: 'assets/units/arbCamelJezzails.png',
  arbNomadTrackers: 'assets/units/arbNomadTrackers.png',
  arbSouthlandsWarriors: 'assets/units/arbSouthlandsWarriors.png',
  arbDervishers: 'assets/units/arbDervishers.png',
  arbGenie: 'assets/units/arbGenie.png',
  jaffar: 'assets/portraits/jaffar.png',
  goldenMagus: 'assets/portraits/goldenMagus.png',
  fatandira: 'assets/portraits/fatandira.png',
  wizardCaliph: 'assets/portraits/wizardCaliph.png',
  malalukRaiders: 'assets/units/malalukRaiders.png',
  sultanOfFlames: 'assets/units/sultanOfFlames.png',
  howlingBasiliskBombard: 'assets/units/howlingBasiliskBombard.png',
  theFireBaptised: 'assets/units/theFireBaptised.png',
  theRagingTempest: 'assets/units/theRagingTempest.png',
  naffatunOfSaghash: 'assets/units/naffatunOfSaghash.png',
  dreadDaughtersOfTariq: 'assets/units/dreadDaughtersOfTariq.png',
  gajnalJuggernaut: 'assets/units/gajnalJuggernaut.png',
  ravagerOfElKalabad: 'assets/units/ravagerOfElKalabad.png',
  kharMel: 'assets/units/kharMel.png'
};
