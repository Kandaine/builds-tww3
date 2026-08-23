// ============================================================================
// units/chaos-dwarfs.js — images d'unites de la faction « chaos-dwarfs », et d'elle seule.
//
// Charge uniquement par chaos_dwarfs.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/chaos-dwarfs.json ; la valeur est le chemin de l'image reelle.
//
// Ces 30 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/chaos-dwarfs.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  astragoth: 'assets/portraits/astragoth.png',
  drazhoath: 'assets/portraits/drazhoath.png',
  zhatan: 'assets/portraits/zhatan.png',
  abnagg: 'assets/portraits/abnagg.png',
  ghorth: 'assets/portraits/ghorth.png',
  rykarthUnbreakable: 'assets/portraits/rykarthUnbreakable.png',
  blackDwarf: 'assets/portraits/blackDwarf.png',
  chaosDwarfWarriors: 'assets/units/chaosDwarfWarriors.png',
  chaosDwarfWarriorsGW: 'assets/units/chaosDwarfWarriorsGW.png',
  blunderbusses: 'assets/units/blunderbusses.png',
  infernalGuardFireglaives: 'assets/units/infernalGuardFireglaives.png',
  bullCentaurRenders: 'assets/units/bullCentaurRenders.png',
  ironDaemon: 'assets/units/ironDaemon.png',
  dreadquakeMortar: 'assets/units/dreadquakeMortar.png',
  magmaCannon: 'assets/units/magmaCannon.png',
  skullcracker: 'assets/units/skullcracker.png',
  daemonsmith: 'assets/units/daemonsmith.png',
  gorduz: 'assets/units/gorduz.png',
  barukh: 'assets/units/barukh.png',
  hobgoblinWolfRaiders: 'assets/units/hobgoblinWolfRaiders.png',
  kdaaiFireborn: 'assets/units/kdaaiFireborn.png',
  deathshrieker: 'assets/units/deathshrieker.png',
  hellcannon: 'assets/units/hellcannon.png',
  bullCentaurTaurruk: 'assets/units/bullCentaurTaurruk.png',
  infernalIronsworn: 'assets/units/infernalIronsworn.png',
  theImmortalsIronsworn: 'assets/units/theImmortalsIronsworn.png',
  theSoulOfDamnation: 'assets/units/theSoulOfDamnation.png',
  hashutsDarkRavagers: 'assets/units/hashutsDarkRavagers.png',
  graniteGuard: 'assets/units/graniteGuard.png',
  blazingBeardsOfBazherak: 'assets/units/blazingBeardsOfBazherak.png'
};
