// ============================================================================
// units/dwarfs.js — images d'unites de la faction « dwarfs », et d'elle seule.
//
// Charge uniquement par dwarfs.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/dwarfs.json ; la valeur est le chemin de l'image reelle.
//
// Ces 73 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/dwarfs.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  thorgrim: 'assets/portraits/thorgrim.png',
  ungrim: 'assets/portraits/ungrim.png',
  belegar: 'assets/portraits/belegar.png',
  thorek: 'assets/portraits/thorek.png',
  grombrindal: 'assets/portraits/grombrindal.png',
  malakai: 'assets/portraits/malakai.png',
  kazador: 'assets/portraits/kazador.png',
  grimm: 'assets/portraits/grimm.png',
  thorgardCromson: 'assets/portraits/thorgardCromson.png',
  byrrnothGrundadrakk: 'assets/portraits/byrrnothGrundadrakk.png',
  alrikRanulfsson: 'assets/portraits/alrikRanulfsson.png',
  brokkIronpick: 'assets/portraits/brokkIronpick.png',
  rorekGranitehand: 'assets/portraits/rorekGranitehand.png',
  svenHasselfriesian: 'assets/portraits/svenHasselfriesian.png',
  dwarfWarrior: 'assets/units/dwarfWarrior.png',
  hammerer: 'assets/units/hammerer.png',
  longbeard: 'assets/units/longbeard.png',
  ironbreaker: 'assets/units/ironbreaker.png',
  miner: 'assets/units/miner.png',
  minersBlastingCharges: 'assets/units/minersBlastingCharges.png',
  quarreller: 'assets/units/quarreller.png',
  thunderer: 'assets/units/thunderer.png',
  irondrake: 'assets/units/irondrake.png',
  slayer: 'assets/units/slayer.png',
  ranger: 'assets/units/ranger.png',
  cannon: 'assets/units/cannon.png',
  gyrocopter: 'assets/units/gyrocopter.png',
  gyrocopterBrimstone: 'assets/units/gyrocopterBrimstone.png',
  gyrobomber: 'assets/units/gyrobomber.png',
  theSkyhammer: 'assets/units/theSkyhammer.png',
  ekrundMiners: 'assets/units/ekrundMiners.png',
  grudgeThrower: 'assets/units/grudgeThrower.png',
  thane: 'assets/units/thane.png',
  juggoJoriksonn: 'assets/units/juggoJoriksonn.png',
  torstonTreehaka: 'assets/units/torstonTreehaka.png',
  princeHamnir: 'assets/units/princeHamnir.png',
  gromboldKruddsson: 'assets/units/gromboldKruddsson.png',
  thykSkolsson: 'assets/portraits/thykSkolsson.png',
  unradGrimbeard: 'assets/portraits/unradGrimbeard.png',
  prospectorDwf: 'assets/portraits/prospectorDwf.png',
  sappersDwf: 'assets/units/sappersDwf.png',
  minersSteamDrills: 'assets/units/minersSteamDrills.png',
  earthBorer: 'assets/units/earthBorer.png',
  kazrikTheMad: 'assets/units/kazrikTheMad.png',
  flameCannon: 'assets/units/flameCannon.png',
  organGun: 'assets/units/organGun.png',
  runesmith: 'assets/units/runesmith.png',
  masterEngineer: 'assets/units/masterEngineer.png',
  // Nains Norses (Kraka Drak) — mod « Kraka Drak »
  huskarls: 'assets/units/huskarls.png',
  drakeGuard: 'assets/units/drakeGuard.png',
  wardbearers: 'assets/units/wardbearers.png',
  stoneGuard: 'assets/units/stoneGuard.png',
  stormbeards: 'assets/units/stormbeards.png',
  pathgrinders: 'assets/units/pathgrinders.png',
  theThunderbows: 'assets/units/theThunderbows.png',
  trollsearers: 'assets/units/trollsearers.png',
  frostdrakes: 'assets/units/frostdrakes.png',
  // Nains — Héros Légendaires du mod « Heroes of Legend »
  dwfBalkrag: 'assets/units/dwfBalkrag.png',
  legendaryDuo: 'assets/units/gotrek.png',
  irondrakesTrollhammer: 'assets/units/irondrakesTrollhammer.png',
  theGrimdelvers: 'assets/units/theGrimdelvers.png',
  theCrimsonBane: 'assets/units/theCrimsonBane.png',
  peakGateGuard: 'assets/units/peakGateGuard.png',
  dragonbackSlayers: 'assets/units/dragonbackSlayers.png',
  norgrimlingsIronbreakers: 'assets/units/norgrimlingsIronbreakers.png',
  grumblingGuard: 'assets/units/grumblingGuard.png',
  skolderGuard: 'assets/units/skolderGuard.png',
  // SCM Legendary Characters Campaign Pack — dernier lot, huit races.
  burlokDamminsson: 'assets/portraits/burlokDamminsson.png',
  gargulTheGunner: 'assets/units/gargulTheGunner.png',
  rhobbGrimly: 'assets/units/rhobbGrimly.png',
  shazEnsun: 'assets/units/shazEnsun.png',
  // Portraits de seigneurs légendaires extraits du mod !!!lyh_hero.pack.
  torukHelhein: 'assets/portraits/torukHelhein.png',
  warriorsDragonfirePass: 'assets/units/warriorsDragonfirePass.png',
  brotherhoodOfGrimnir: 'assets/units/brotherhoodOfGrimnir.png',
  longDrongsSlayerPirates: 'assets/units/longDrongsSlayerPirates.png',
  spiritOfGrungni: 'assets/units/spiritOfGrungni.png'
};
