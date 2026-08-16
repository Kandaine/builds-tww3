// ============================================================================
// units/grand-cathay.js — images d'unites de la faction « grand-cathay », et d'elle seule.
//
// Charge uniquement par grand_cathay.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/grand-cathay.json ; la valeur est le chemin de l'image reelle.
//
// Ces 84 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/grand-cathay.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  miaoying: 'assets/portraits/miaoying.png',
  zhaoming: 'assets/portraits/zhaoming.png',
  yuanbo: 'assets/portraits/yuanbo.png',
  bhashiva: 'assets/portraits/bhashiva.png',
  celestialDragonGuard: 'assets/units/celestialDragonGuard.png',
  theDuneDragons: 'assets/units/theDuneDragons.png',
  jadeWarriors: 'assets/units/jadeWarriors.png',
  jadeWarriorsHalberds: 'assets/units/jadeWarriorsHalberds.png',
  peasantLongSpearmen: 'assets/units/peasantLongSpearmen.png',
  peasantArchers: 'assets/units/peasantArchers.png',
  jadeWarriorCrossbows: 'assets/units/jadeWarriorCrossbows.png',
  greatLongmaRiders: 'assets/units/greatLongmaRiders.png',
  righteousLancesOfWeiJin: 'assets/units/righteousLancesOfWeiJin.png',
  skyJunk: 'assets/units/skyJunk.png',
  fireRainRocketBattery: 'assets/units/fireRainRocketBattery.png',
  jadeLion: 'assets/units/jadeLion.png',
  onyxCrowmen: 'assets/units/onyxCrowmen.png',
  theEmpressCrowmen: 'assets/units/theEmpressCrowmen.png',
  ironClawTigerWarriors: 'assets/units/ironClawTigerWarriors.png',
  tigerWarriors: 'assets/units/tigerWarriors.png',
  ironHailGunners: 'assets/units/ironHailGunners.png',
  craneGunners: 'assets/units/craneGunners.png',
  nanGauGrenadiers: 'assets/units/nanGauGrenadiers.png',
  celestialLion: 'assets/units/celestialLion.png',
  greatMoonBird: 'assets/units/greatMoonBird.png',
  astromancer: 'assets/units/astromancer.png',
  alchemist: 'assets/units/alchemist.png',
  clawspeaker: 'assets/units/clawspeaker.png',
  ogreBulls: 'assets/units/ogreBulls.png',
  ironguts: 'assets/units/ironguts.png',
  maneaters: 'assets/units/maneaters.png',
  cthBannaga: 'assets/units/cthBannaga.png',
  cthShiHong: 'assets/units/cthShiHong.png',
  lionWarriors: 'assets/units/lionWarriors.png',
  mountainElders: 'assets/units/mountainElders.png',
  zhuqueVermilionBird: 'assets/units/zhuqueVermilionBird.png',
  southernFlamekeepers: 'assets/units/southernFlamekeepers.png',
  dragonEmperorsImperialGuard: 'assets/units/dragonEmperorsImperialGuard.png',
  celestialProtectors: 'assets/units/celestialProtectors.png',
  goldenLionSquadron: 'assets/units/goldenLionSquadron.png',
  guardOfTheJadeCourt: 'assets/units/guardOfTheJadeCourt.png',
  ninthWallGunners: 'assets/units/ninthWallGunners.png',
  moonlightTemplars: 'assets/units/moonlightTemplars.png',
  jadeBloodedTaoists: 'assets/units/jadeBloodedTaoists.png',
  jadeCustodiansTroops: 'assets/units/jadeCustodiansTroops.png',
  tigerWarriorStalkers: 'assets/units/tigerWarriorStalkers.png',
  dragonGuardCrossbowmen: 'assets/units/dragonGuardCrossbowmen.png',
  peiYue: 'assets/portraits/peiYue.png',
  miaoYi: 'assets/portraits/miaoYi.png',
  xianFeng: 'assets/units/xianFeng.png',
  nanyeBunyo: 'assets/units/nanyeBunyo.png',
  jadeLancers: 'assets/units/jadeLancers.png',
  peasantHorsemen: 'assets/units/peasantHorsemen.png',
  jetLion: 'assets/units/jetLion.png',
  duanWei: 'assets/portraits/duanWei.png',
  yunXiang: 'assets/portraits/yunXiang.png',
  jinXiao: 'assets/portraits/jinXiao.png',
  kuRong: 'assets/portraits/kuRong.png',
  // Portraits et cartes d'unité extraits du mod DEER24Cathay.pack.
  zhaoQi: 'assets/portraits/zhaoQi.png',
  hanCheng: 'assets/portraits/hanCheng.png',
  yeSheng: 'assets/portraits/yeSheng.png',
  clanGuards: 'assets/units/clanGuards.png',
  nanYangEliteWarriors: 'assets/units/nanYangEliteWarriors.png',
  cathayanWarriors: 'assets/units/cathayanWarriors.png',
  banditsOfTheSilverRoad: 'assets/units/banditsOfTheSilverRoad.png',
  ladiesOfTheApricotGrove: 'assets/units/ladiesOfTheApricotGrove.png',
  yinYangProtectors: 'assets/units/yinYangProtectors.png',
  imperialAgents: 'assets/units/imperialAgents.png',
  guardiansOfJade: 'assets/units/guardiansOfJade.png',
  yiQing: 'assets/portraits/yiQing.png',
  greatBastionWardens: 'assets/units/greatBastionWardens.png',
  divineShockWardens: 'assets/units/divineShockWardens.png',
  tangJingyin: 'assets/portraits/tangJingyin.png',
  monkeyKing: 'assets/portraits/monkeyKing.png',
  tongLong: 'assets/portraits/tongLong.png',
  naNatian: 'assets/portraits/naNatian.png',
  liuYueru: 'assets/portraits/liuYueru.png',
  martialSaint: 'assets/portraits/martialSaint.png',
  yiYaohua: 'assets/portraits/yiYaohua.png',
  yingJin: 'assets/portraits/yingJin.png',
  kuXi: 'assets/portraits/kuXi.png',
  fangWenzi: 'assets/portraits/fangWenzi.png',
  yeJia: 'assets/portraits/yeJia.png',
  xenWu: 'assets/portraits/xenWu.png'
};
