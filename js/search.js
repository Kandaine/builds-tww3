// ============================================================================
// search.js — Script de la page d'accueil (index.html), la page de recherche
// globale qui liste les seigneurs légendaires de TOUTES les factions.
// Dépend de js/data.js (doit être chargé avant ce fichier) pour les fonctions
// `loadLords`, `filterLords`, `renderFactionTabs` ainsi que l'objet `seals`.
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
function resultCardHtml(l){
  // Portrait affiché sur la carte : vraie image si disponible, sinon SVG
  // de secours (objet `seals`, voir data.js).
  // loading="lazy" + decoding="async" : la page de recherche affiche jusqu'à
  // 106 portraits ; on ne charge donc que ceux qui approchent du viewport, ce
  // qui accélère nettement l'affichage initial, surtout sur mobile/3G.
  const portrait = l.portraitImage
    ? `<img src="${l.portraitImage}" alt="${l.name}" loading="lazy" decoding="async">`
    : (seals[l.seal] || '');
  // Le lien pointe vers la page HTML de la faction du seigneur (l.groupPage,
  // ex: "dwarfs.html"), avec l'id du seigneur en paramètre d'URL, afin que
  // cette page l'affiche directement au chargement (voir init() dans app.js).
  return `
    <a class="result-card" data-group="${l.group}" href="${l.groupPage}?id=${l.id}">
      <div class="result-seal">${portrait}</div>
      <div class="result-info">
        <div class="result-name">${l.name}</div>
        <div class="result-epithet">${l.epithet}</div>
        <div class="result-tags">
          <span class="faction-tag">${l.groupLabel}</span>
          <span class="faction-tag">${l.faction}</span>
        </div>
      </div>
    </a>
  `;
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
  });

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
    return;
  }

  // Génère une carte par seigneur filtré et les insère toutes d'un coup.
  grid.innerHTML = filtered.map(resultCardHtml).join('');
}

// Point d'entrée de la page de recherche. Fonction asynchrone car le
// chargement des seigneurs (loadLords, sans argument = toutes les factions)
// effectue des requêtes réseau (fetch) sur tous les fichiers data/*.json.
async function init(){
  lords = await loadLords();

  // Écoute la saisie dans le champ de recherche en temps réel (événement
  // "input", déclenché à chaque frappe) : met à jour la requête de recherche
  // et relance le rendu des résultats à chaque caractère tapé.
  document.getElementById('search-input').addEventListener('input', (e)=>{
    searchQuery = e.target.value;
    renderResults();
  });

  // Premier affichage des résultats (sans filtre actif au départ).
  renderResults();
}

// Lance immédiatement l'initialisation dès que le script est exécuté.
init();
