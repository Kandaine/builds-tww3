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
  blazingBeardsOfBazherak: 'assets/units/blazingBeardsOfBazherak.png',
  // Kastabull (derpy_uzkul, mod « Derpy's Hashut Legendary Lords »). Son portrait est en
  // 85x115 et non en 60x130 : le mod ne lui livre ni portrait d'unite ni carte (unit_card vaut
  // `placeholder`), seulement ui\portraits\faction_leaders\derpy_uzkul.png. Pris tel quel, sans
  // redimensionnement : `object-fit: cover` le recadre a l'affichage, comme amon.png (170x230).
  kastabull: 'assets/portraits/kastabull.png',
  // Roster hobgobelin de la fiche de Kastabull. Cartes du jeu de base, ui.pack :
  // ui\units\icons\<carte>.png, nom de carte lu dans unit_variants_tables.unit_card (ici
  // identique a la cle de l'unite). Empreintes de pixels comparees le 17/10/2026 a tous les PNG
  // de assets/units et assets/portraits : aucune n'y etait deja sous une autre cle.
  hobgoblinCutthroats: 'assets/units/hobgoblinCutthroats.png',
  hobgoblinSneakyGits: 'assets/units/hobgoblinSneakyGits.png',
  hobgoblinArchers: 'assets/units/hobgoblinArchers.png',
  oglahKhansWolfboyz: 'assets/units/oglahKhansWolfboyz.png',
  hobgoblinBoltThrower: 'assets/units/hobgoblinBoltThrower.png'
};
