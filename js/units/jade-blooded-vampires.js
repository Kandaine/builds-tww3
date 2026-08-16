// ============================================================================
// units/jade-blooded-vampires.js — images d'unites de la faction « jade-blooded-vampires », et d'elle seule.
//
// Charge uniquement par jade_blooded_vampires.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/jade-blooded-vampires.json ; la valeur est le chemin de l'image reelle.
//
// Ces 28 entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/jade-blooded-vampires.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  // --- Jade-Blooded Vampires (mod) : roster de la Maiden of the Black Lotus ---
  // Héros
  jbvChanneler: 'assets/units/jbvChanneler.png',
  jbvJiangjun: 'assets/units/jbvJiangjun.png',
  jbvNugui: 'assets/units/jbvNugui.png',
  // Chanters (cœur buffé par la Maiden) + fantômes (Yin) + Yang physique
  jbvChanters: 'assets/units/jbvChanters.png',
  jbvChantersLanterns: 'assets/units/jbvChantersLanterns.png',
  jbvAncientFaithfuls: 'assets/units/jbvAncientFaithfuls.png',
  jbvShadowsNongchang: 'assets/units/jbvShadowsNongchang.png',
  jbvWildGhosts: 'assets/units/jbvWildGhosts.png',
  jbvRavenousGhosts: 'assets/units/jbvRavenousGhosts.png',
  jbvYouxiaGlaives: 'assets/units/jbvYouxiaGlaives.png',
  jbvRevenantsHalberds: 'assets/units/jbvRevenantsHalberds.png',
  jbvSinfulMonks: 'assets/units/jbvSinfulMonks.png',
  // Monstres des enfers de Cathay
  jbvYaoguai: 'assets/units/jbvYaoguai.png',
  jbvBloodLions: 'assets/units/jbvBloodLions.png',
  jbvDevilDarkOmen: 'assets/units/jbvDevilDarkOmen.png',
  jbvGateGuardian: 'assets/units/jbvGateGuardian.png',
  // Xu Yaoji (Islanders of the Moon) : roster du Sanatorium Danoi Sariour hanté
  jbvPlagueWraiths: 'assets/units/jbvPlagueWraiths.png',
  jbvCharredNurses: 'assets/units/jbvCharredNurses.png',
  jbvHollowNurses: 'assets/units/jbvHollowNurses.png',
  jbvHangedDoctor: 'assets/units/jbvHangedDoctor.png',
  jbvCursedIslanders: 'assets/units/jbvCursedIslanders.png',
  jbvShadowPeopleWard6: 'assets/units/jbvShadowPeopleWard6.png',
  jbvWomanWhoJumped: 'assets/units/jbvWomanWhoJumped.png',
  jbvContortedMan: 'assets/units/jbvContortedMan.png',
  jbvLadyYayi: 'assets/units/jbvLadyYayi.png',
  maidenBlackLotus: 'assets/portraits/maidenBlackLotus.png',
  xuYaoji: 'assets/portraits/xuYaoji.png',
  vanquishersOfVillainy: 'assets/units/vanquishersOfVillainy.png'
};
