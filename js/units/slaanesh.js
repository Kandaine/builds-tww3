// ============================================================================
// units/slaanesh.js — images d'unites de la faction « slaanesh », et d'elle seule.
//
// Charge uniquement par slaanesh.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/slaanesh.json ; la valeur est le chemin de l'image reelle.
//
// Ces 36 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/slaanesh.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  seekersOfSlaanesh: 'assets/units/seekersOfSlaanesh.png',
  mahaduvha: 'assets/portraits/mahaduvha.png',
  nastasyaRoskolnikov: 'assets/portraits/nastasyaRoskolnikov.png',
  ssselari: 'assets/portraits/ssselari.png',
  nkari: 'assets/portraits/nkari.png',
  dechala: 'assets/portraits/dechala.png',
  masque: 'assets/portraits/masque.png',
  slaaulaan: 'assets/portraits/slaaulaan.png',
  kossars: 'assets/units/kossars.png',
  ridersOfTheMightySerpent: 'assets/units/ridersOfTheMightySerpent.png',
  daemonettesOfSlaanesh: 'assets/units/daemonettesOfSlaanesh.png',
  exaltedDaemonettesOfSlaanesh: 'assets/units/exaltedDaemonettesOfSlaanesh.png',
  devotedRajputWarriors: 'assets/units/devotedRajputWarriors.png',
  devotedRajputWarriorsKatars: 'assets/units/devotedRajputWarriorsKatars.png',
  parvatadarRajputs: 'assets/units/parvatadarRajputs.png',
  parvatadarYakshas: 'assets/units/parvatadarYakshas.png',
  rakshasaTigermen: 'assets/units/rakshasaTigermen.png',
  marquisOfMasochism: 'assets/units/marquisOfMasochism.png',
  parvatadarDevatas: 'assets/units/parvatadarDevatas.png',
  devotedMaraudersOfSlaanesh: 'assets/units/devotedMaraudersOfSlaanesh.png',
  devotedMaraudersOfSlaaneshSpears: 'assets/units/devotedMaraudersOfSlaaneshSpears.png',
  devotedMaraudersOfSlaaneshHellscourges: 'assets/units/devotedMaraudersOfSlaaneshHellscourges.png',
  devoteesOfSlaaneshCrossbows: 'assets/units/devoteesOfSlaaneshCrossbows.png',
  hellstridersOfSlaanesh: 'assets/units/hellstridersOfSlaanesh.png',
  marauderHorsemenOfSlaanesh: 'assets/units/marauderHorsemenOfSlaanesh.png',
  princesOfPerfection: 'assets/units/princesOfPerfection.png',
  heartseekersOfSlaanesh: 'assets/units/heartseekersOfSlaanesh.png',
  fiendsOfSlaanesh: 'assets/units/fiendsOfSlaanesh.png',
  hellflayers: 'assets/units/hellflayers.png',
  seekerChariots: 'assets/units/seekerChariots.png',
  alluress: 'assets/units/alluress.png',
  druchiiAnointed: 'assets/units/druchiiAnointed.png',
  bringersOfBeguilement: 'assets/units/bringersOfBeguilement.png',
  pleasureGuard: 'assets/units/pleasureGuard.png',
  eternalEntourage: 'assets/units/eternalEntourage.png',
  heraldsOfExcess: 'assets/units/heraldsOfExcess.png'
};
