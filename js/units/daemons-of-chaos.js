// ============================================================================
// units/daemons-of-chaos.js — images d'unites de la faction « daemons-of-chaos », et d'elle seule.
//
// Charge uniquement par daemons_of_chaos.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/daemons-of-chaos.json ; la valeur est le chemin de l'image reelle.
//
// Ces 10 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/daemons-of-chaos.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  daemonprince: 'assets/portraits/daemonprince.png',
  bloodletters: 'assets/units/bloodletters.png',
  daemonettes: 'assets/units/daemonettes.png',
  plagueDrones: 'assets/units/plagueDrones.png',
  pinkHorrors: 'assets/units/pinkHorrors.png',
  seekersOfSlaanesh: 'assets/units/seekersOfSlaanesh.png',
  plaguebearers: 'assets/units/plaguebearers.png',
  heraldOfKhorne: 'assets/units/heraldOfKhorne.png',
  gerikBarkov: 'assets/units/gerikBarkov.png',
  theSourguts: 'assets/units/theSourguts.png'
};
