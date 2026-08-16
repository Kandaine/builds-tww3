// ============================================================================
// units/undead-legions.js — images d'unites de la faction « undead-legions », et d'elle seule.
//
// Charge uniquement par undead_legions.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/undead-legions.json ; la valeur est le chemin de l'image reelle.
//
// Ces 12 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/undead-legions.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  vampireHeroDeath: 'assets/units/vampireHeroDeath.png',
  masterNecromancer: 'assets/units/masterNecromancer.png',
  lichePriest: 'assets/units/lichePriest.png',
  // --- Undead Legions (mod Nagash) : portrait de Nagash + unités propres à
  // la faction (Legions of Nagashizzar). Portholes extraits du .pack zstd,
  // recadrés en 60×130. Les héros réutilisent les portraits vanilla déjà
  // présents (lichePriest, necromancer, vampireHeroDeath). ---
  nagash: 'assets/portraits/nagash.png',
  nagThroneGuard: 'assets/units/nagThroneGuard.png',
  nagBoneGolems: 'assets/units/nagBoneGolems.png',
  nagMorghasts: 'assets/units/nagMorghasts.png',
  nagNagashizzarGuardHalb: 'assets/units/nagNagashizzarGuardHalb.png',
  nagNagashizzarGuard: 'assets/units/nagNagashizzarGuard.png',
  nagBoneColossus: 'assets/units/nagBoneColossus.png',
  nagSpiritHosts: 'assets/units/nagSpiritHosts.png',
  nagBoneThrower: 'assets/units/nagBoneThrower.png'
};
