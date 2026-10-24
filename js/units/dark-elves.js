// ============================================================================
// units/dark-elves.js — images d'unites de la faction « dark-elves », et d'elle seule.
//
// Charge uniquement par dark_elves.html, juste avant js/app.js qui s'en sert dans
// unitCardHtml(). Chaque cle correspond au champ "icon" d'une unite dans
// data/dark-elves.json ; la valeur est le chemin de l'image reelle.
//
// Ses entrees vivaient auparavant dans un registre unique de 2063 images
// que CHAQUE page chargeait en entier, soit 117 Ko pour n'afficher que sa
// propre faction. Le decoupage est purement mecanique : meme objet global
// `unitImages`, memes cles, meme code de rendu dans app.js. Leur nombre n'est pas
// ecrit ici : il change avec les fiches, et le chiffre du decoupage s'etait perime.
//
// A connaitre avant d'editer : ajouter une unite dans
// data/dark-elves.json impose d'ajouter sa cle ICI aussi. Une cle absente
// affiche une carte sans image et sans message d'erreur ; le script
// tools/verifier-icones.ps1 detecte precisement ce cas.
// ============================================================================

const unitImages = {
  daemonettes: 'assets/units/daemonettes.png',
  malekith: 'assets/portraits/malekith.png',
  morathi: 'assets/portraits/morathi.png',
  cronehellebron: 'assets/portraits/cronehellebron.png',
  lokhir: 'assets/portraits/lokhir.png',
  malusdarkblade: 'assets/portraits/malusdarkblade.png',
  rakarth: 'assets/portraits/rakarth.png',
  tullaris: 'assets/portraits/tullaris.png',
  dreadspears: 'assets/units/dreadspears.png',
  darkshards: 'assets/units/darkshards.png',
  bleakswords: 'assets/units/bleakswords.png',
  blackGuard: 'assets/units/blackGuard.png',
  coldOneKnights: 'assets/units/coldOneKnights.png',
  coldOneChariots: 'assets/units/coldOneChariots.png',
  coldOneDreadKnights: 'assets/units/coldOneDreadKnights.png',
  witchElves: 'assets/units/witchElves.png',
  sistersOfSlaughter: 'assets/units/sistersOfSlaughter.png',
  harGanethExecutioners: 'assets/units/harGanethExecutioners.png',
  blackArkCorsairs: 'assets/units/blackArkCorsairs.png',
  blackArkCorsairsHandbows: 'assets/units/blackArkCorsairsHandbows.png',
  shades: 'assets/units/shades.png',
  shadesGreatWeapons: 'assets/units/shadesGreatWeapons.png',
  warHydra: 'assets/units/warHydra.png',
  harpiesDarkElves: 'assets/units/harpiesDarkElves.png',
  crowsOfKhaine: 'assets/units/crowsOfKhaine.png',
  darkRiders: 'assets/units/darkRiders.png',
  darkRidersCrossbows: 'assets/units/darkRidersCrossbows.png',
  reaperBoltThrower: 'assets/units/reaperBoltThrower.png',
  shadowblade: 'assets/units/shadowblade.png',
  korelei: 'assets/units/korelei.png',
  furionOfClarKarond: 'assets/units/furionOfClarKarond.png',
  bloodwrackMedusa: 'assets/units/bloodwrackMedusa.png',
  anarsis: 'assets/units/anarsis.png',
  theSirenOfRedRuin: 'assets/units/theSirenOfRedRuin.png',
  scourgerunnerChariots: 'assets/units/scourgerunnerChariots.png',
  feralManticoreDarkElves: 'assets/units/feralManticoreDarkElves.png',
  kharibdyss: 'assets/units/kharibdyss.png',
  deathHag: 'assets/units/deathHag.png',
  defUrial: 'assets/units/defUrial.png',
  khainiteAssassin: 'assets/units/khainiteAssassin.png',
  kouranDarkhand: 'assets/units/kouranDarkhand.png',
  sorceressDark: 'assets/units/sorceressDark.png',
  highBeastmaster: 'assets/units/highBeastmaster.png',
  araveena: 'assets/portraits/araveena.png',
  shakkaraRiel: 'assets/portraits/shakkaraRiel.png',
  lilaeth: 'assets/portraits/lilaeth.png',
  anethraHelbane: 'assets/portraits/anethraHelbane.png',
  hagQueenMalida: 'assets/portraits/hagQueenMalida.png',
  boltFiends: 'assets/units/boltFiends.png',
  bladesOfTheBloodQueen: 'assets/units/bladesOfTheBloodQueen.png',
  theHellebronai: 'assets/units/theHellebronai.png',
  knightsOfTheEbonClaw: 'assets/units/knightsOfTheEbonClaw.png',
  duriathHelbane: 'assets/portraits/duriathHelbane.png',
  hotek: 'assets/portraits/hotek.png',
  sistersOfTheSingingDoom: 'assets/units/sistersOfTheSingingDoom.png',
  ravenHeralds: 'assets/units/ravenHeralds.png',
  chillOfSontar: 'assets/units/chillOfSontar.png',
  ravagersOfRakarth: 'assets/units/ravagersOfRakarth.png',
  // Heros legendaires du mod LYH, que ses scripts lyh_def_<nom>.lua posent par
  // spawn_agent_at_military_force dans l'armee de depart de leur faction (Mezekar,
  // agent « meizeka » -> Naggarond ; Drusala -> Cult of Pleasure). Cartes
  // ui/units/icons du pack, laissees a leurs dimensions d'origine : 120x260 mesures
  // pour mezekar.png comme pour drusala.png (System.Drawing, apres extraction).
  mezekar: 'assets/units/mezekar.png',
  drusala: 'assets/units/drusala.png'
};
