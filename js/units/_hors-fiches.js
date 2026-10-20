// ============================================================================
// units/_hors-fiches.js — CE FICHIER N'EST CHARGE PAR AUCUNE PAGE.
//
// Les 103 images ci-dessous etaient enregistrees dans l'ancien registre unique
// mais ne sont referencees par aucune fiche de data/*.json : unites retirees
// d'un build, ou cartes extraites puis finalement non posees. Les PNG
// correspondants existent tous sur le disque (verifie).
//
// Les 8 dernieres y sont venues le 17/10/2026 : les cles nag*, cartes du mod Legions of
// Nagash, et masterNecromancer, que la fiche de Nagash n'utilise plus depuis sa refonte
// sur le roster officiel.
// Le mod rend toujours les unites nag* recrutables par le Nagash officiel.
//
// Le meme jour, nagSpiritHosts, nagFellSpectres et nagShadeHaunts y ont suivi : la fiche
// de Kalledria les alignait, mais la version actuelle du mod ne les contient plus.
//
// mourngul les a rejointes le meme jour : la fiche de Waldakir Rahtep aligne desormais la
// Spirit Host, que ses effets visent depuis le DLC, a la place de ses Mournguls.
//
// lamplighters a suivi le 18/10/2026 : Burnbarrels, regiment favori du Clan Verms selon le mod
// Factional Favoured Regiments, prend sa place sur la fiche de Blight Tenscratch.
//
// orgrimTheWanderer, berusOfVeigs et haftagg sont venus le 19/10/2026, quand les heros
// legendaires de Norsca ont ete realignes sur les scripts du mod SCM Tribes of the North.
// Orgrim et Berus restent obtenables, mais seulement par la chaine de missions d'Einarr,
// en alternative a Usta et a Kammler que sa fiche aligne : l'un ou l'autre, jamais les deux.
// Haftagg n'est donne que dans la campagne du Vieux Monde (scm_norsca_tow_init.lua, chez
// Yngve) : en Immortal Empires, aucun script ne le fait apparaitre — le user ne l'a pas vu
// chez Grydal, et les droits de recrutement ne suffisent pas pour un agent unique.
//
// ulrikaMagdova a suivi le 20/10/2026 : l'Ulrika Magdova Straghov de SCM Legendary Characters,
// que Rahtep et Vorag alignaient, est desactivee en Immortal Empires — son entree de
// scm_lc_spawn_hero est dans un bloc --[[ ]] et son reglage MCT aussi. L'Ulrika officielle du
// jeu de base existe, mais sa liste d'acces (Kislev, Empire, Malakai, Neferata) exclut les deux.
//
// dragonGuardCrossbowmen (Celestial Dragon Crossbows) a suivi le meme jour : Yun Xiang, seule fiche
// a les aligner, leur a prefere Na Natian, que DEER24 donne a sa faction des le premier tour —
// et leur note disait deja qu'aucun effet du seigneur ne les visait.
//
// swordOfSolkan a suivi le meme jour : Jaan, seule fiche a l'aligner, lui prefere Odvaal van den
// Huister, que SCM Marienburg (hkrul_mar.lua) donne a Marienbourg des le premier tour.
//
// Elles sont conservees ici plutot que supprimees : pour en reutiliser une,
// deplacer sa ligne dans le js/units/<faction>.js concerne.
// ============================================================================

const unitImagesHorsFiches = {
  tebRiccoRepublicanGuard: 'assets/units/tebRiccoRepublicanGuard.png',
  poulainKnightsFoot: 'assets/units/poulainKnightsFoot.png',
  scorpionBrt: 'assets/units/scorpionBrt.png',
  ronin: 'assets/units/ronin.png',
  mushaCavNaginata: 'assets/units/mushaCavNaginata.png',
  greatStagKnights: 'assets/units/greatStagKnights.png',
  ironDaemonRoR: 'assets/units/ironDaemonRoR.png',
  infernalCastellan: 'assets/units/infernalCastellan.png',
  sorcererProphet: 'assets/units/sorcererProphet.png',
  albGiant: 'assets/units/albGiant.png',
  arbWarElephant: 'assets/units/arbWarElephant.png',
  arbFireEfreet: 'assets/units/arbFireEfreet.png',
  arbGrandBombard: 'assets/units/arbGrandBombard.png',
  arbFlyingCarpets: 'assets/units/arbFlyingCarpets.png',
  arbTempestDjinn: 'assets/units/arbTempestDjinn.png',
  arbDesertSpirit: 'assets/units/arbDesertSpirit.png',
  fimFiannaFimmShields: 'assets/units/fimFiannaFimmShields.png',
  fimBogBeastRaiders: 'assets/units/fimBogBeastRaiders.png',
  kaptainBoss: 'assets/units/kaptainBoss.png',
  freebootaBigUns: 'assets/units/freebootaBigUns.png',
  freebootaBoyzSwords: 'assets/units/freebootaBoyzSwords.png',
  freebootaHeavyWeap: 'assets/units/freebootaHeavyWeap.png',
  orcBattleTankAA: 'assets/units/orcBattleTankAA.png',
  orcBattleship: 'assets/units/orcBattleship.png',
  freebootaStikbooma: 'assets/units/freebootaStikbooma.png',
  riverTrollsArmored: 'assets/units/riverTrollsArmored.png',
  giantGreenskins: 'assets/units/giantGreenskins.png',
  forestGoblinArchers: 'assets/units/forestGoblinArchers.png',
  featheredScuttlas: 'assets/units/featheredScuttlas.png',
  colossalSquig: 'assets/units/colossalSquig.png',
  hellcannonWoC: 'assets/units/hellcannonWoC.png',
  salamanderHuntingPack: 'assets/units/salamanderHuntingPack.png',
  hellPitAbomination: 'assets/units/hellPitAbomination.png',
  crossbowmen: 'assets/units/crossbowmen.png',
  warWagons: 'assets/units/warWagons.png',
  empireKnights: 'assets/units/empireKnights.png',
  skeletonHoplites: 'assets/units/skeletonHoplites.png',
  necrosphinx: 'assets/units/necrosphinx.png',
  deckGunners: 'assets/units/deckGunners.png',
  vampireFleetCaptain: 'assets/units/vampireFleetCaptain.png',
  theOldOne: 'assets/units/theOldOne.png',
  darkProphetess: 'assets/units/darkProphetess.png',
  kahled: 'assets/units/kahled.png',
  bloodKnightChampion: 'assets/units/bloodKnightChampion.png',
  bloodkinThrall: 'assets/units/bloodkinThrall.png',
  thrallKnights: 'assets/units/thrallKnights.png',
  doomWolfKnights: 'assets/units/doomWolfKnights.png',
  bloodDragonRoR: 'assets/units/bloodDragonRoR.png',
  astrolicheTheak: 'assets/units/astrolicheTheak.png',
  jadeShugengan: 'assets/units/jadeShugengan.png',
  jiangMasterNecro: 'assets/units/jiangMasterNecro.png',
  jiangBanshee: 'assets/units/jiangBanshee.png',
  jiangGraveGuardCrossbow: 'assets/units/jiangGraveGuardCrossbow.png',
  jiangZombieArcher: 'assets/units/jiangZombieArcher.png',
  jiangZombieSpear: 'assets/units/jiangZombieSpear.png',
  undeadLongma: 'assets/units/undeadLongma.png',
  dracolith: 'assets/units/dracolith.png',
  shuimu: 'assets/units/shuimu.png',
  warCompass: 'assets/units/warCompass.png',
  shadowLantern: 'assets/units/shadowLantern.png',
  cathayMonk: 'assets/units/cathayMonk.png',
  syreen: 'assets/units/syreen.png',
  copsewight: 'assets/units/copsewight.png',
  bretonnianWight: 'assets/units/bretonnianWight.png',
  cantankerousBellends: 'assets/units/cantankerousBellends.png',
  giantSnail: 'assets/units/giantSnail.png',
  hngTorguud: 'assets/units/hngTorguud.png',
  hngChaosVultures: 'assets/units/hngChaosVultures.png',
  // Gulgulet Sandgrinder (The Famished).
  arabyOgreBulls: 'assets/units/arabyOgreBulls.png',
  norscanGiant: 'assets/units/norscanGiant.png',
  skeggiChampions: 'assets/units/skeggiChampions.png',
  norscanWhalers: 'assets/units/norscanWhalers.png',
  bjornlingSpearmen: 'assets/units/bjornlingSpearmen.png',
  sarlMarauders: 'assets/units/sarlMarauders.png',
  sarlBerserkers: 'assets/units/sarlBerserkers.png',
  yusakMarauders: 'assets/units/yusakMarauders.png',
  yusakHuntersThrowingAxes: 'assets/units/yusakHuntersThrowingAxes.png',
  yusakHorsemen: 'assets/units/yusakHorsemen.png',
  kurganMarauderGreatWeapons: 'assets/units/kurganMarauderGreatWeapons.png',
  kurganMarauderChampions: 'assets/units/kurganMarauderChampions.png',
  kurganHuntersJavelins: 'assets/units/kurganHuntersJavelins.png',
  savageSkavenslaveSlingers: 'assets/units/savageSkavenslaveSlingers.png',
  warPigs: 'assets/units/warPigs.png',
  garbagsSkavenWolfChariots: 'assets/units/garbagsSkavenWolfChariots.png',
  nagThroneGuard: 'assets/units/nagThroneGuard.png',
  nagBoneGolems: 'assets/units/nagBoneGolems.png',
  nagMorghasts: 'assets/units/nagMorghasts.png',
  nagNagashizzarGuardHalb: 'assets/units/nagNagashizzarGuardHalb.png',
  nagNagashizzarGuard: 'assets/units/nagNagashizzarGuard.png',
  nagBoneColossus: 'assets/units/nagBoneColossus.png',
  nagBoneThrower: 'assets/units/nagBoneThrower.png',
  masterNecromancer: 'assets/units/masterNecromancer.png',
  nagSpiritHosts: 'assets/units/nagSpiritHosts.png',
  nagFellSpectres: 'assets/units/nagFellSpectres.png',
  nagShadeHaunts: 'assets/units/nagShadeHaunts.png',
  mourngul: 'assets/units/mourngul.png',
  lamplighters: 'assets/units/lamplighters.png',
  orgrimTheWanderer: 'assets/units/orgrimTheWanderer.png',
  berusOfVeigs: 'assets/units/berusOfVeigs.png',
  haftagg: 'assets/units/haftagg.png',
  ulrikaMagdova: 'assets/units/ulrikaMagdova.png',
  dragonGuardCrossbowmen: 'assets/units/dragonGuardCrossbowmen.png',
  swordOfSolkan: 'assets/units/swordOfSolkan.png'
};
