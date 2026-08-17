// ============================================================================
// search.js — Script de la page d'accueil (index.html), la page de recherche
// globale qui liste les seigneurs légendaires de TOUTES les factions.
// Dépend de js/core.js (doit être chargé avant ce fichier) pour les fonctions
// `loadLords`, `filterLords`, `renderFactionTabs` et `svgDeSecours`.
// ============================================================================

// Liste complète de tous les seigneurs, toutes factions confondues.
// Remplie une seule fois au démarrage par init().
let lords = [];

// Onglet de faction actuellement sélectionné pour filtrer les résultats.
// 'all' = aucun filtre, affiche toutes les factions.
let activeGroup = 'all';

// Texte actuellement saisi dans le champ de recherche (nom, épithète, faction).
let searchQuery = '';

// Construit le HTML d'une seule carte "résultat de recherche" pour un
// seigneur donné. Paramètre `l` : objet seigneur (issu de loadLords(),
// enrichi des champs `group`, `groupLabel`, `groupPage`).
// Retourne une chaîne HTML (un lien <a> cliquable vers la fiche du seigneur).
function resultCardHtml(l, query){
  // Portrait affiché sur la carte : vraie image si disponible, sinon repli
  // svgDeSecours() (js/core.js) — qui renvoie aujourd'hui toujours du vide.
  // loading="lazy" + decoding="async" : la page de recherche affiche jusqu'à
  // 106 portraits ; on ne charge donc que ceux qui approchent du viewport, ce
  // qui accélère nettement l'affichage initial, surtout sur mobile/3G.
  const portrait = l.portraitImage
    ? `<img src="${l.portraitImage}" alt="${l.name}" loading="lazy" decoding="async">`
    : svgDeSecours(l.seal);
  // Le lien pointe vers la page HTML de la faction du seigneur (l.groupPage,
  // ex: "dwarfs.html"), avec l'id du seigneur en paramètre d'URL, afin que
  // cette page l'affiche directement au chargement (voir init() dans app.js).
  // Quand la carte remonte à cause d'une unité de son build et non de son
  // propre nom, on dit laquelle. Sans ça, chercher « chosen » affiche des
  // seigneurs dont aucun ne porte ce mot, et rien ne dit pourquoi.
  // Au-delà de trois unités la liste est tronquée : la carte doit rester une
  // carte, et le détail est sur la fiche, à un clic.
  const trouvees = unitesCorrespondantes(l, query);
  const ligneUnites = trouvees.length
    ? `<p class="result-unite">Dans son build : ${trouvees.slice(0, 3).join(', ')}${
        trouvees.length > 3 ? ` <span class="result-unite-reste">+${trouvees.length - 3}</span>` : ''}</p>`
    : '';

  return `
    <a class="result-card" data-group="${l.group}" href="${l.groupPage}?id=${l.id}">
      <div class="result-seal">${portrait}</div>
      <div class="result-info">
        <div class="result-name">${l.name}</div>
        <div class="result-epithet">${l.epithet}</div>
        ${ligneUnites}
        <div class="result-tags">
          <span class="faction-tag">${l.groupLabel}</span>
          <span class="faction-tag">${l.faction}</span>
        </div>
      </div>
    </a>
  `;
}

// ---------------------------------------------------------------------------
// L'ÉTAT DE LA RECHERCHE VIT DANS L'URL.
//
// Deux choses en découlaient, qui manquaient toutes les deux :
//   - une recherche devient un lien qu'on peut envoyer à quelqu'un ;
//   - en ouvrant la fiche d'un seigneur puis en revenant en arrière, on
//     retrouve sa recherche au lieu d'une page vierge. C'est le cas courant :
//     on cherche, on ouvre, on revient comparer.
//
// `replaceState` et NON `pushState` : la recherche se relance à chaque frappe,
// et empiler une entrée d'historique par caractère rendrait le bouton Retour
// inutilisable — il faudrait appuyer douze fois pour sortir de « greatsword ».
// On réécrit donc l'URL courante sans rien empiler, ce qui suffit : au moment
// où l'on quitte la page pour une fiche, l'URL porte déjà l'état.
// ---------------------------------------------------------------------------
function lireEtatDepuisURL(){
  const p = new URLSearchParams(location.search);
  const faction = p.get('faction') || 'all';
  // Un identifiant de faction inconnu est ignoré plutôt qu'appliqué : une URL
  // tapée à la main ou tronquée ne doit pas donner une page vide inexplicable.
  const connue = faction === 'all' || FACTION_GROUPS.some(g => g.id === faction);
  return { q: p.get('q') || '', faction: connue ? faction : 'all' };
}

// Reflète l'état courant (`searchQuery`, `activeGroup`) dans la barre
// d'adresse. Appelée à chaque rendu — voir le bloc ci-dessus pour le choix de
// `replaceState`, qui est le point à comprendre avant de toucher à ceci.
function ecrireEtatDansURL(){
  const p = new URLSearchParams();
  if(searchQuery) p.set('q', searchQuery);
  if(activeGroup !== 'all') p.set('faction', activeGroup);
  // Sans paramètre, on revient à l'URL nue plutôt qu'à un « ? » orphelin.
  const qs = p.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

// Compte les seigneurs par faction SOUS la recherche texte en cours, mais sans
// tenir compte de l'onglet actif : c'est ce qui permet de voir, en cherchant
// « chosen », dans quelles autres factions se trouvent des réponses.
function compterParFaction(){
  const n = { all: 0 };
  for(const l of lords){
    if(!matchesSearch(l, searchQuery)) continue;
    n.all++;
    n[l.group] = (n[l.group] || 0) + 1;
  }
  return n;
}

// Ré-affiche l'ensemble de la page de résultats : les onglets de faction en
// haut, et la grille de cartes de seigneurs filtrée en dessous.
// Ne prend aucun paramètre : utilise les variables globales `lords`,
// `activeGroup` et `searchQuery`.
function renderResults(){
  // Redessine les onglets de faction. Le callback passé en 3e argument est
  // appelé quand l'utilisateur clique sur un onglet : on met à jour le filtre
  // actif puis on relance un rendu complet des résultats.
  renderFactionTabs(document.getElementById('faction-tabs'), activeGroup, (group)=>{
    activeGroup = group;
    renderResults();
  }, compterParFaction());

  // L'URL suit l'état à chaque rendu, qu'il vienne d'une frappe ou d'un onglet.
  ecrireEtatDansURL();

  const grid = document.getElementById('results-grid');

  // Applique le filtre de faction ET le filtre texte (recherche), puis trie
  // les résultats par ordre alphabétique du nom de faction (groupLabel) afin
  // que les cartes s'affichent groupées de façon prévisible (Beastmen,
  // Bretonnia, Chaos Dwarfs...).
  const filtered = filterLords(lords, activeGroup, searchQuery)
    .sort((a, b) => a.groupLabel.localeCompare(b.groupLabel));

  // Cas limite : aucun résultat. Le message affiché diffère selon qu'une
  // recherche texte est en cours ou non, pour être plus explicite.
  if(!filtered.length){
    const message = searchQuery
      ? 'Aucun seigneur ne correspond à ta recherche.'
      : 'Aucun seigneur dans cette faction pour l\'instant.';
    grid.innerHTML = `<div class="results-empty">${message}</div>`;
    // L'annonce doit AUSSI passer ici. Placée uniquement en fin de fonction,
    // elle était sautée par ce `return` — donc jamais mise à jour dans le seul
    // cas où elle est vraiment nécessaire : celui où la recherche ne trouve
    // rien. Un utilisateur de lecteur d'écran continuait d'entendre l'ancien
    // décompte, et croyait ses résultats toujours affichés.
    annoncerResultats(0);
    return;
  }

  // Génère une carte par seigneur filtré et les insère toutes d'un coup.
  // La requête est passée à chaque carte pour qu'elle sache dire, le cas
  // échéant, quelle unité de son build a fait remonter le seigneur.
  grid.innerHTML = filtered.map(l => resultCardHtml(l, searchQuery)).join('');

  annoncerResultats(filtered.length);
}

// ---------------------------------------------------------------------------
// Annonce le nombre de résultats aux lecteurs d'écran.
//
// POURQUOI. La recherche filtre en direct, sans rechargement : visuellement la
// grille change sous les yeux, mais rien ne le signale à qui ne la voit pas.
// Un utilisateur de lecteur d'écran tapait sa recherche sans jamais savoir
// combien de seigneurs elle avait trouvés, ni même si elle en avait trouvé.
//
// `aria-live="polite"` fait annoncer le contenu de la région quand il change,
// sans interrompre ce qui est en cours de lecture. La région est visuellement
// masquée : elle ne s'adresse qu'aux technologies d'assistance.
// ---------------------------------------------------------------------------
function annoncerResultats(nombre){
  let region = document.getElementById('annonce-resultats');
  if(!region){
    region = document.createElement('p');
    region.id = 'annonce-resultats';
    region.className = 'annonce-visuellement-masquee';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('role', 'status');
    document.querySelector('.search-page').appendChild(region);
  }
  region.textContent = nombre === 0
    ? 'Aucun seigneur ne correspond.'
    : `${nombre} seigneur${nombre > 1 ? 's' : ''} affiché${nombre > 1 ? 's' : ''}.`;
}

// Point d'entrée de la page de recherche. Fonction asynchrone car le
// chargement des seigneurs (loadLords, sans argument = toutes les factions)
// effectue des requêtes réseau (fetch) sur tous les fichiers data/*.json.
async function init(){
  lords = await loadLords();

  // L'URL fait foi au démarrage : ouvrir un lien partagé, ou revenir en
  // arrière depuis la fiche d'un seigneur, doit rejouer la recherche telle
  // qu'elle était. Le champ est renseigné avant le premier rendu pour que ce
  // qui est affiché corresponde à ce qui est écrit dedans.
  const etat = lireEtatDepuisURL();
  searchQuery = etat.q;
  activeGroup = etat.faction;

  const champ = document.getElementById('search-input');
  champ.value = searchQuery;

  // Écoute la saisie dans le champ de recherche en temps réel (événement
  // "input", déclenché à chaque frappe) : met à jour la requête de recherche
  // et relance le rendu des résultats à chaque caractère tapé.
  champ.addEventListener('input', (e)=>{
    searchQuery = e.target.value;
    renderResults();
  });

  // Premier affichage des résultats (sans filtre actif au départ).
  renderResults();
}

// Lance immédiatement l'initialisation dès que le script est exécuté.
init();
