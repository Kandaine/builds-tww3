// ============================================================================
// units/nurgle.js — images d'unites de la faction « nurgle », et d'elle seule.
//
// Charge uniquement par nurgle.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/nurgle.json ; la valeur est le chemin de l'image reelle.
//
// Ses entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js. Leur nombre n'est pas
// ecrit ici : il change avec les fiches, et le chiffre du decoupage s'etait perime.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/nurgle.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  valnirTheReaper: 'assets/portraits/valnirTheReaper.png',
  nurglings: 'assets/units/nurglings.png',
  kugath: 'assets/portraits/kugath.png',
  epidemius: 'assets/portraits/epidemius.png',
  tamurkhan: 'assets/portraits/tamurkhan.png',
  chaosSorcererNurgle: 'assets/units/chaosSorcererNurgle.png',
  exaltedHeroNurgle: 'assets/units/exaltedHeroNurgle.png',
  theDaemonspew: 'assets/units/theDaemonspew.png',
  plaguebearersOfNurgle: 'assets/units/plaguebearersOfNurgle.png',
  forsakenNurgle: 'assets/units/forsakenNurgle.png',
  plagueridden: 'assets/units/plagueridden.png',
  exaltedPlaguebearersOfNurgle: 'assets/units/exaltedPlaguebearersOfNurgle.png',
  plagueToadsOfNurgle: 'assets/units/plagueToadsOfNurgle.png',
  chaosFuriesNurgle: 'assets/units/chaosFuriesNurgle.png',
  plagueDronesOfNurgleDeathsHeads: 'assets/units/plagueDronesOfNurgleDeathsHeads.png',
  rotFlies: 'assets/units/rotFlies.png',
  plagueOgres: 'assets/units/plagueOgres.png',
  chaosWarriorsOfNurgleGreatWeapons: 'assets/units/chaosWarriorsOfNurgleGreatWeapons.png',
  pestigorsNurgle: 'assets/units/pestigorsNurgle.png',
  rotKnights: 'assets/units/rotKnights.png',
  frolickersBubonic: 'assets/units/frolickersBubonic.png',
  uncleFuruncle: 'assets/units/uncleFuruncle.png',
  festeringStooges: 'assets/units/festeringStooges.png',
  rottingRiders: 'assets/units/rottingRiders.png',
  // Putrid Blightkings (Dual Axes) et leur RoR The Repugnauts of Brass Keep (DLC Lords of the End
  // Times) : memes cartes que dans js/units/warriors-of-chaos.js, pour la fiche de Tamurkhan,
  // dont les effets visent toutes les unites non demoniaques.
  putridBlightkingsDualAxes: 'assets/units/putridBlightkingsDualAxes.png',
  repugnautsOfBrassKeep: 'assets/units/repugnautsOfBrassKeep.png',
  // Festak Krann, héros légendaire du mod LYH (agent festak), que lyh_nur_festak.lua pose dans
  // l'armée de départ de Tamurkhan. ui\units\icons\lyh_nur_festak.png (lyh_hero_no_cathay.pack), 120×260.
  // Il s'affichait « The Feast of Krann » avec une copie de traduction périmée (refaite le 23/10/2026) :
  // la clé d'icône a changé, le fichier image a gardé l'ancien nom.
  festakKrann: 'assets/units/feastOfKrann.png',
  // Morbidex Twiceborn, héros légendaire du jeu de base : même image que dans js/units/warriors-of-chaos.js,
  // déclarée ici parce que la page de Nurgle ne charge que ce module.
  morbidexTwiceborn: 'assets/portraits/morbidexTwiceborn.png'
};
