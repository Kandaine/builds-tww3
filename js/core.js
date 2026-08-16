// ============================================================================
// core.js — socle commun a TOUTES les pages (index.html + les 32 pages de
// faction). Charge en premier, il expose dans l'espace global :
//
//   - dripSVG, icons                  : petits SVG decoratifs
//   - FACTION_GROUPS, factionBanners  : catalogue des factions
//   - loadLords, normalize, matchesSearch, filterLords, renderFactionTabs
//                                     : utilitaires partages
//   - svgDeSecours                    : repli d'image, voir plus bas
//
// Aucun module ES ici : tout vit dans l'espace global (window), d'ou l'absence
// d'import/export. L'ordre des balises <script> dans le HTML est donc
// significatif — core.js doit toujours venir en premier.
//
// --- Pourquoi ce fichier a ete decoupe -------------------------------------
// Il s'appelait js/data.js et pesait 343 Ko, charges integralement par chaque
// page. Trois tables volumineuses n'y avaient plus leur place :
//
//   * unitImages (117 Ko) : les images des 32 factions dans un registre unique,
//     alors qu'une page n'affiche qu'une seule faction. Eclate en 32 fichiers
//     js/units/<faction>.js, dont chaque page ne charge que le sien.
//
//   * seals (79 Ko) et unitIcons (127 Ko) : des SVG dessines a la main servant
//     de repli quand un seigneur ou une unite n'avait pas encore de vraie
//     image. Les 321 seigneurs ont aujourd'hui un portrait et les 1978 icones
//     referencees par les fiches ont toutes un PNG : ce repli n'etait donc
//     plus jamais atteint. Conserves dans js/fallback-svg.js, que plus aucune
//     page ne charge (voir svgDeSecours ci-dessous pour le reactiver).
//
// Une page de faction charge desormais environ 23 Ko de JS au lieu de 343 Ko.
// ============================================================================

// Petit filet décoratif en forme de "goutte" (SVG), utilisé comme séparateur
// visuel entre le bandeau d'en-tête et le corps de la fiche seigneur.
const dripSVG = `<svg class="drip-divider" viewBox="0 0 400 14" preserveAspectRatio="none">
  <line x1="0" y1="2" x2="400" y2="2" stroke="var(--border)" stroke-width="1"/>
  <path d="M 60 2 Q 60 10 58 13 Q 56 10 58 2" fill="var(--accent-primary)"/>
  <path d="M 200 2 Q 200 12 197 14 Q 194 12 197 2" fill="var(--accent-primary)"/>
  <path d="M 330 2 Q 330 8 328 11 Q 326 8 328 2" fill="var(--accent-primary)"/>
</svg>`;

// Icônes génériques utilisées devant les titres de section de la fiche
// seigneur (Lore, Effets, Stats, Build). Toujours les mêmes quel que soit
// le seigneur affiché — voir leur utilisation dans app.js (renderPage).
const icons = {
  lore: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.6"><path d="M4 4c4-2 8-2 8 0v16c0-2-4-2-8 0V4Z"/><path d="M20 4c-4-2-8-2-8 0v16c0-2 4-2 8 0V4Z"/></svg>`,
  effects: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.6"><path d="M12 2l7 3v6c0 5-3 8-7 11-4-3-7-6-7-11V5l7-3Z"/></svg>`,
  stats: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.6"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>`,
  build: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.6"><path d="M14.5 3.5 20.5 9.5 9 21H3v-6L14.5 3.5Z"/><path d="M17 6l1.5 1.5"/></svg>`
};

// Repli d'image, appele quand aucune vraie image n'est disponible : par
// unitCardHtml() dans app.js (icone d'unite) et par resultCardHtml() dans
// search.js (portrait de seigneur).
//
// En pratique il renvoie toujours la chaine vide, puisque js/fallback-svg.js
// n'est charge par aucune page : les tables `iconLookup` et `seals` n'existent
// donc pas et les deux tests `typeof` echouent. C'est voulu — les SVG de repli
// etaient des dessins approximatifs, contraires a la regle du site qui veut
// qu'une carte affiche l'image reelle de l'unite ou rien.
//
// La fonction reste ecrite pour fonctionner si le fichier revient : ajouter
// <script src="js/fallback-svg.js"></script> avant app.js suffit a retablir
// l'ancien comportement, sans toucher a ce code.
function svgDeSecours(cle){
  if(typeof iconLookup !== 'undefined' && iconLookup[cle]) return iconLookup[cle];
  if(typeof seals !== 'undefined' && seals[cle]) return seals[cle];
  return '';
}

// ----------------------------------------------------------------------------
// `FACTION_GROUPS` : liste ordonnée de toutes les factions jouables du site.
// Chaque entrée décrit :
//   - id       : identifiant technique (correspond au nom du fichier
//                data/<id>.json et au champ "group" attribué à chaque
//                seigneur après chargement, voir loadLords())
//   - label    : nom affiché à l'utilisateur (ex. dans les onglets de
//                recherche et les étiquettes de faction)
//   - file     : chemin du fichier JSON contenant les seigneurs de la faction
//   - page     : page HTML de la faction, utilisée pour construire les liens
//                depuis la page de recherche (voir resultCardHtml() dans
//                search.js)
// Notez qu'il n'y a pas d'entrée "toutes les factions" ici : cet onglet
// spécial ('all') est ajouté dynamiquement par renderFactionTabs() plus bas.
// ----------------------------------------------------------------------------
const FACTION_GROUPS = [
  { id: 'vampire-counts', label: 'Vampire Counts', file: 'data/vampire-counts.json', page: 'vampire_counts.html' },
  { id: 'dwarfs', label: 'Dwarfs', file: 'data/dwarfs.json', page: 'dwarfs.html' },
  { id: 'high-elves', label: 'High Elves', file: 'data/high-elves.json', page: 'high_elves.html' },
  { id: 'beastmen', label: 'Beastmen', file: 'data/beastmen.json', page: 'beastmen.html' },
  { id: 'bretonnia', label: 'Bretonnia', file: 'data/bretonnia.json', page: 'bretonnia.html' },
  { id: 'chaos-dwarfs', label: 'Chaos Dwarfs', file: 'data/chaos-dwarfs.json', page: 'chaos_dwarfs.html' },
  { id: 'daemons-of-chaos', label: 'Daemons of Chaos', file: 'data/daemons-of-chaos.json', page: 'daemons_of_chaos.html' },
  { id: 'dark-elves', label: 'Dark Elves', file: 'data/dark-elves.json', page: 'dark_elves.html' },
  { id: 'grand-cathay', label: 'Grand Cathay', file: 'data/grand-cathay.json', page: 'grand_cathay.html' },
  { id: 'greenskins', label: 'Greenskins', file: 'data/greenskins.json', page: 'greenskins.html' },
  { id: 'khorne', label: 'Khorne', file: 'data/khorne.json', page: 'khorne.html' },
  { id: 'warriors-of-chaos', label: 'Warriors of Chaos', file: 'data/warriors-of-chaos.json', page: 'warriors_of_chaos.html' },
  { id: 'kislev', label: 'Kislev', file: 'data/kislev.json', page: 'kislev.html' },
  { id: 'lizardmen', label: 'Lizardmen', file: 'data/lizardmen.json', page: 'lizardmen.html' },
  { id: 'norsca', label: 'Norsca', file: 'data/norsca.json', page: 'norsca.html' },
  { id: 'nurgle', label: 'Nurgle', file: 'data/nurgle.json', page: 'nurgle.html' },
  { id: 'ogre-kingdoms', label: 'Ogre Kingdoms', file: 'data/ogre-kingdoms.json', page: 'ogre_kingdoms.html' },
  { id: 'skaven', label: 'Skaven', file: 'data/skaven.json', page: 'skaven.html' },
  { id: 'slaanesh', label: 'Slaanesh', file: 'data/slaanesh.json', page: 'slaanesh.html' },
  { id: 'empire', label: 'The Empire', file: 'data/empire.json', page: 'empire.html' },
  { id: 'tomb-kings', label: 'Tomb Kings', file: 'data/tomb-kings.json', page: 'tomb_kings.html' },
  { id: 'tzeentch', label: 'Tzeentch', file: 'data/tzeentch.json', page: 'tzeentch.html' },
  { id: 'vampire-coast', label: 'Vampire Coast', file: 'data/vampire-coast.json', page: 'vampire_coast.html' },
  { id: 'wood-elves', label: 'Wood Elves', file: 'data/wood-elves.json', page: 'wood_elves.html' },
  // Albion — faction ajoutée par un mod (OvN Lost Factions). 2 seigneurs
  // légendaires (Dural Durak, Mhorriníon).
  { id: 'albion', label: 'Albion', file: 'data/albion.json', page: 'albion.html' },
  // Araby — faction ajoutée par un mod (OvN Lost Factions).
  { id: 'araby', label: 'Araby', file: 'data/araby.json', page: 'araby.html' },
  // Fimir — faction ajoutée par un mod (OvN Lost Factions). 2 seigneurs
  // légendaires (Meargh Skattach, Kroll).
  { id: 'fimir', label: 'Fimir', file: 'data/fimir.json', page: 'fimir.html' },
  // Gnoblar Hordes — faction ajoutée par un mod (« The Unwashed Masses »).
  // 3 seigneurs légendaires (Great-King-Lord Bezer, Gnobbo the Masked, Bunsen the Burna).
  { id: 'gnoblar-hordes', label: 'Gnoblar Hordes', file: 'data/gnoblar-hordes.json', page: 'gnoblar_hordes.html' },
  // Jade-Blooded Vampires — faction ajoutée par un mod (vampires de Cathay).
  // 1 seigneur légendaire (Maiden of the Black Lotus).
  { id: 'jade-blooded-vampires', label: 'Jade-Blooded Vampires', file: 'data/jade-blooded-vampires.json', page: 'jade_blooded_vampires.html' },
  // Southern Realms — faction ajoutée par un mod (Tilée, Estalie, Border Princes).
  { id: 'southern-realms', label: 'Southern Realms', file: 'data/southern-realms.json', page: 'southern_realms.html' },
  // The Hung — faction ajoutée par un mod (Steppe Lords — The Hung). Nomades
  // cavaliers des Steppes de l'Est, adorateurs du Ciel Déchaîné (Chaos).
  // 2 seigneurs légendaires couverts (Ur-Khan, Zao Korr) ; un 3e existe (Mandakh).
  { id: 'hung', label: 'The Hung', file: 'data/hung.json', page: 'hung.html' },
  // Undead Legions — faction ajoutée par un mod (Nagash). Legions of
  // Nagashizzar, menées par Nagash le Grand Nécromancien. Le mod ajoute
  // aussi des LL/héros aux Vampire Counts (Neferata, Kalledria, Isabella…).
  { id: 'undead-legions', label: 'Undead Legions', file: 'data/undead-legions.json', page: 'undead_legions.html' }
];

// ----------------------------------------------------------------------------
// `factionBanners` : image d'illustration officielle affichée tout en haut
// de la fiche seigneur (voir renderPage() dans app.js), une par faction et
// partagée par tous les seigneurs de cette faction. La clé correspond au
// champ "group" du seigneur (= l'id de sa faction dans FACTION_GROUPS).
// Toutes les factions du site possèdent une entrée ici : ce fallback n'est
// donc en pratique jamais manquant.
// ----------------------------------------------------------------------------
const factionBanners = {
  'vampire-counts': 'assets/banners/vampire-counts.jpg',
  'dwarfs': 'assets/banners/dwarfs.jpg',
  'high-elves': 'assets/banners/high-elves.jpg',
  'beastmen': 'assets/banners/beastmen.jpg',
  'bretonnia': 'assets/banners/bretonnia.jpg',
  'chaos-dwarfs': 'assets/banners/chaos-dwarfs.jpg',
  'daemons-of-chaos': 'assets/banners/daemons-of-chaos.jpg',
  'dark-elves': 'assets/banners/dark-elves.jpg',
  'grand-cathay': 'assets/banners/grand-cathay.jpg',
  'greenskins': 'assets/banners/greenskins.jpg',
  'khorne': 'assets/banners/khorne.jpg',
  'warriors-of-chaos': 'assets/banners/warriors-of-chaos.jpg',
  'kislev': 'assets/banners/kislev.webp',
  'lizardmen': 'assets/banners/lizardmen.jpg',
  'norsca': 'assets/banners/norsca.jpg',
  'nurgle': 'assets/banners/nurgle.jpg',
  'ogre-kingdoms': 'assets/banners/ogreKingdoms.jpg',
  'skaven': 'assets/banners/skaven.jpg',
  'slaanesh': 'assets/banners/slaanesh.jpg',
  'empire': 'assets/banners/empire.jpg',
  'tomb-kings': 'assets/banners/tombKings.jpg',
  'tzeentch': 'assets/banners/tzeentch.jpg',
  'vampire-coast': 'assets/banners/vampireCoast.jpg',
  'wood-elves': 'assets/banners/woodElves.jpg',
  'albion': 'assets/banners/albion.jpg',
  'araby': 'assets/banners/araby.jpg',
  'fimir': 'assets/banners/fimir.jpg',
  'gnoblar-hordes': 'assets/banners/gnoblar_hordes.jpg',
  'jade-blooded-vampires': 'assets/banners/jade_blooded_vampires.jpg',
  'southern-realms': 'assets/banners/southern_realms.jpg',
  'hung': 'assets/banners/hung.jpg',
  'undead-legions': 'assets/banners/undead-legions.jpg'
};

// ============================================================================
// Fonctions utilitaires partagées par app.js (pages de faction) et
// search.js (page de recherche globale).
// ============================================================================

// Charge les seigneurs depuis les fichiers JSON du dossier data/.
// Paramètre `groupId` (optionnel) :
//   - omis / undefined → charge TOUTES les factions (utilisé par la page
//     de recherche, search.js) ;
//   - fourni (ex: "dwarfs") → ne charge que le fichier JSON de cette
//     faction (utilisé par les pages de faction, via PAGE_FACTION dans app.js).
// Retourne une Promise résolue avec un tableau de seigneurs, chacun enrichi
// de trois champs supplémentaires non présents dans le JSON d'origine :
// `group` (id de la faction), `groupLabel` (nom affichable) et `groupPage`
// (page HTML de la faction) — pratique pour la page de recherche qui mélange
// des seigneurs de factions différentes dans une même liste.
async function loadLords(groupId){
  // Ne garde que la faction demandée, ou tout FACTION_GROUPS si aucun filtre.
  const groups = groupId ? FACTION_GROUPS.filter(g => g.id === groupId) : FACTION_GROUPS;

  // Lance toutes les requêtes fetch() en parallèle (Promise.all) plutôt que
  // séquentiellement, pour accélérer le chargement de la page de recherche
  // qui doit récupérer jusqu'à 24 fichiers JSON d'un coup.
  //
  // Chaque requête est protégée individuellement : un fichier manquant (404),
  // un serveur en erreur (500) ou un JSON malformé renvoie un tableau vide au
  // lieu de faire échouer Promise.all. Sans cette protection, UN seul fichier
  // en défaut suffisait à laisser toute la page blanche, sans message — la
  // page de recherche en charge 24, le risque n'était donc pas théorique.
  // L'erreur reste visible dans la console du navigateur pour le diagnostic.
  const perGroup = await Promise.all(
    groups.map(group =>
      fetch(group.file)
        .then(res => {
          // fetch() ne rejette PAS sur un code HTTP d'erreur : il faut tester
          // res.ok explicitement, sinon on tenterait de parser une page 404.
          if(!res.ok) throw new Error(`HTTP ${res.status} sur ${group.file}`);
          return res.json();
        })
        .catch(err => {
          console.error(`[loadLords] Faction "${group.id}" ignorée :`, err);
          return [];
        })
    )
  );

  // Aplatit le tableau de tableaux (un tableau de seigneurs par faction) en
  // une seule liste, tout en associant à chaque seigneur les métadonnées de
  // sa faction d'origine.
  return groups.flatMap((group, i) =>
    perGroup[i].map(l => Object.assign({}, l, { group: group.id, groupLabel: group.label, groupPage: group.page }))
  );
}

// Normalise une chaîne de caractères pour une comparaison de recherche
// insensible à la casse ET aux accents (ex: "Décharge" et "decharge" doivent
// être considérés comme équivalents). Technique : décomposition Unicode
// (NFD) qui sépare les lettres de leurs accents (ex: "é" → "e" + "´"), puis
// suppression de tous les diacritiques (accents) via une regex sur la plage
// Unicode des "combining marks", puis passage en minuscules.
function normalize(str){
  // ̀-ͯ est la plage Unicode des "combining diacritical marks",
  // c'est-à-dire les accents détachés par la décomposition NFD juste avant.
  // Notée en séquences d'échappement plutôt qu'avec les caractères eux-mêmes :
  // ceux-ci sont invisibles dans un éditeur et survivent mal à un changement
  // d'encodage du fichier.
  return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Vérifie si un seigneur `l` correspond à une requête de recherche texte
// libre `query`. Si la requête est vide, tout le monde correspond (pas de
// filtre). Sinon, on concatène les champs pertinents du seigneur (nom,
// épithète, faction précise, nom de faction générique) en une seule chaîne
// normalisée, et on vérifie si la requête normalisée y apparaît.
function matchesSearch(l, query){
  if(!query) return true;
  const haystack = normalize([l.name, l.epithet, l.faction, l.groupLabel].join(' '));
  return haystack.includes(normalize(query));
}

// Filtre une liste de seigneurs selon DEUX critères combinés (ET logique) :
// l'onglet de faction actif (`activeGroup`, 'all' = pas de filtre) et la
// requête de recherche texte (`searchQuery`, déléguée à matchesSearch).
// Utilisée uniquement par la page de recherche (search.js).
function filterLords(lords, activeGroup, searchQuery){
  return lords.filter(l =>
    (activeGroup === 'all' || l.group === activeGroup) && matchesSearch(l, searchQuery)
  );
}

// Construit et affiche la rangée d'onglets de faction ("ALL", "Beastmen",
// "Bretonnia"...) dans le conteneur `containerEl`, avec l'onglet
// correspondant à `activeGroup` mis en surbrillance.
// Paramètre `onChange` : fonction de callback appelée avec le nouvel id de
// groupe quand l'utilisateur clique sur un onglet — c'est à l'appelant
// (search.js) de mettre à jour son propre état et de relancer le rendu des
// résultats ; cette fonction ne s'en charge pas elle-même.
function renderFactionTabs(containerEl, activeGroup, onChange){
  // Trie les factions par ordre alphabétique de leur libellé, puis ajoute
  // l'onglet spécial "ALL" (toutes factions) tout au début, quelle que soit
  // sa position alphabétique.
  const sortedGroups = [...FACTION_GROUPS].sort((a, b) => a.label.localeCompare(b.label));
  const allTabs = [{ id: 'all', label: 'ALL' }, ...sortedGroups];
  containerEl.innerHTML = allTabs.map(t => `
    <div class="faction-tab ${activeGroup===t.id?'active':''}" data-group="${t.id}">${t.label}</div>
  `).join('');
  containerEl.querySelectorAll('.faction-tab').forEach(el=>{
    el.addEventListener('click', ()=> onChange(el.dataset.group));
  });
}
