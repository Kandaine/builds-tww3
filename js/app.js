// ============================================================================
// app.js — Script principal des pages "faction" (ex: dwarfs.html, khorne.html…).
// Ce fichier gère l'affichage de la liste des seigneurs dans la barre latérale
// et le rendu de la fiche détaillée du seigneur sélectionné.
// Il dépend entièrement de js/data.js, qui doit être chargé AVANT ce fichier
// (voir les balises <script> dans chaque page HTML) : les variables/fonctions
// comme `loadLords`, `seals`, `iconLookup`, `unitImages`, `factionBanners`,
// `icons` et `dripSVG` proviennent toutes de data.js.
// ============================================================================

// Liste complète des seigneurs légendaires chargés pour la faction courante.
// Remplie de façon asynchrone au démarrage par init() via loadLords().
let lords = [];

// Identifiant (id) du seigneur actuellement affiché dans la page.
// Correspond au champ "id" d'un objet seigneur dans les fichiers data/*.json.
let activeId = null;

// Construit et affiche la liste des seigneurs dans la barre latérale gauche.
// Ne prend aucun paramètre : elle lit directement les variables globales
// `lords` et `activeId`.
function renderList(){
  const list = document.getElementById('lord-list');

  // Cas limite : si aucun seigneur n'a pu être chargé (fichier JSON vide,
  // erreur réseau, etc.), on affiche un message plutôt qu'une liste vide.
  if(!lords.length){
    list.innerHTML = `<div class="lord-list-empty">Aucun seigneur pour l'instant.</div>`;
    return;
  }

  // Génère une carte cliquable par seigneur (numéro romain, nom, épithète).
  // La classe "active" est ajoutée sur l'élément correspondant au seigneur
  // actuellement sélectionné, pour le mettre en surbrillance visuellement.
  list.innerHTML = lords.map(l => `
    <div class="lord-item ${l.id===activeId?'active':''}" data-id="${l.id}">
      <span class="lord-numeral">${l.numeral}</span>
      <span class="lord-names">
        <span class="lord-name">${l.name}</span>
        <span class="lord-epithet">${l.epithet}</span>
      </span>
    </div>
  `).join('');

  // Attache un gestionnaire de clic à chaque carte de la liste : cliquer sur
  // un seigneur met à jour l'id actif, modifie l'URL (sans recharger la page,
  // via history.replaceState) pour permettre le partage/rafraîchissement du
  // lien, puis relance un rendu complet (liste + page de détail).
  list.querySelectorAll('.lord-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      activeId = el.dataset.id;
      history.replaceState(null, '', `?id=${activeId}`);
      render();
    });
  });
}

// Construit et affiche la fiche détaillée (lore, effets, build recommandé...)
// du seigneur actuellement sélectionné (`activeId`) dans la zone centrale
// #page-content.
function renderPage(){
  // Récupère l'objet seigneur correspondant à l'id actif.
  const l = lords.find(x=>x.id===activeId);
  const page = document.getElementById('page-content');

  // Change la classe du <body> pour appliquer le thème de couleurs propre
  // à la faction du seigneur (ex: "theme-dwarfs"). Les règles CSS associées
  // sont définies dans css/style.css.
  document.body.className = `theme-${l.group}`;

  // Bloc optionnel "Attributs & capacités passives" : certains seigneurs
  // (ceux avec des données confirmées via captures d'écran en jeu) ont un
  // champ `attributes` détaillé en plus des effets généraux. On ne construit
  // ce bloc HTML que si la donnée existe, sinon la variable reste une
  // chaîne vide et rien ne s'affiche.
  let attributesHtml = '';
  if(l.attributes){
    attributesHtml = `
      <div class="section">
        <div class="section-head">${icons.effects}<span class="section-title">Attributs & capacités passives</span></div>
        <div class="attr-list">
          ${l.attributes.items.map(a => `<div class="attr-item"><strong>${a.label}</strong> — ${a.value}</div>`).join('')}
        </div>
        <div class="stats-caveat">${l.attributes.source}</div>
      </div>
    `;
  }

  // Bannière illustrée en haut de page : chaque faction a sa propre image
  // d'artwork officiel, enregistrée dans `factionBanners` (js/data.js).
  const banner = factionBanners[l.group];

  // Construction de tout le HTML de la fiche seigneur en une seule fois.
  // Utilise des templates literals (chaînes multi-lignes) avec interpolation.
  page.innerHTML = `
    <div class="portrait-frame">
      <img src="${banner}" alt="Artwork officiel ${l.groupLabel}">
    </div>
    <div class="banner">
      <!-- Le sceau/portrait du seigneur : priorité à une vraie image
           (l.portraitImage) si elle existe, sinon on retombe sur un SVG
           de secours généré (objet seals, indexé par l.seal). -->
      <div class="seal">${l.portraitImage ? `<img src="${l.portraitImage}" alt="${l.name}">` : seals[l.seal]}</div>
      <div>
        <div class="lord-title">${l.name}</div>
        <div class="lord-epithet-big">${l.epithet}</div>
      </div>
    </div>
    <span class="faction-tag">${l.faction}</span>
    ${dripSVG}

    <div class="section">
      <div class="section-head">${icons.lore}<span class="section-title">Lore</span></div>
      <div class="section-body">${l.lore}</div>
    </div>

    <div class="section">
      <div class="section-head">${icons.effects}<span class="section-title">Effets de faction / seigneur</span></div>
      <div class="section-body">${l.effects}</div>
    </div>

    ${attributesHtml}

    <div class="section">
      <div class="section-head">${icons.build}<span class="section-title">Build recommandé</span></div>
      <div class="section-body"><p><strong>${l.build.role}</strong></p></div>

      <!-- Carte du seigneur lui-même (toujours présente, qty fixe à 1). -->
      <div class="army-subhead">Seigneur</div>
      <div class="unit-grid">
        ${unitCardHtml(l.build.lord)}
      </div>

      <!-- Section héros : optionnelle, seulement si le build en définit. -->
      ${l.build.heroes && l.build.heroes.length ? `
        <div class="army-subhead">Héros</div>
        <div class="unit-grid">
          ${l.build.heroes.map(unitCardHtml).join('')}
        </div>
      ` : ''}

      <!-- Corps d'armée principal : toujours présent. -->
      <div class="army-subhead">Corps d'armée</div>
      <div class="unit-grid">
        ${l.build.army.map(unitCardHtml).join('')}
      </div>

      <!-- Cas très particulier (Heinrich Kemmler & Krell) : Krell est invoqué
           en bataille plutôt que recruté normalement, on l'affiche donc dans
           une section à part si le build le prévoit. -->
      ${l.build.krellNote ? `
        <div class="army-subhead">Invocation en bataille</div>
        <div class="unit-grid">
          ${unitCardHtml(l.build.krellNote)}
        </div>
      ` : ''}

      <!-- Rappel du nombre total d'emplacements d'armée utilisés (toujours 20
           dans Total War: Warhammer III, seigneur inclus). -->
      ${l.build.totalSlots ? `<div class="army-total">${l.build.totalSlots} slots d'armée au total (seigneur inclus)</div>` : ''}

      <div class="build-grid" style="margin-top:20px;">
        <div class="build-card">
          <h4>Magie</h4>
          <p>${l.build.magic}</p>
        </div>
      </div>
      <div class="note">${l.build.note}</div>
    </div>
  `;
}

// Génère le HTML d'une seule "carte d'unité" (utilisée pour le seigneur,
// les héros, les unités d'armée, et l'éventuelle invocation en bataille).
// Paramètre `u` : un objet unité avec au minimum les champs
//   { icon, name, qty, note }
// Retourne une chaîne HTML prête à être insérée dans le DOM.
function unitCardHtml(u){
  // Priorité d'affichage de l'icône :
  // 1) une vraie image d'unité si elle est enregistrée dans `unitImages`
  //    (indexée par la clé u.icon) ;
  // 2) sinon, un SVG de secours dessiné à la main, cherché dans `iconLookup`
  //    (fusion des objets `seals` et `unitIcons`, voir data.js) ;
  // 3) sinon, une chaîne vide (icône manquante, ne devrait normalement pas
  //    arriver si les données sont correctement renseignées).
  // loading="lazy" + decoding="async" : les images d'unités situées plus bas
  // dans la fiche ne sont chargées qu'à l'approche du viewport.
  const icon = unitImages[u.icon]
    ? `<img src="${unitImages[u.icon]}" alt="${u.name}" loading="lazy" decoding="async">`
    : (iconLookup[u.icon] || '');
  return `
    <div class="unit-card">
      <div class="unit-icon">${icon}</div>
      <div class="unit-info">
        <div class="unit-name-row">
          <span class="unit-name">${u.name}</span>
          <span class="unit-qty">x${u.qty}</span>
        </div>
        <div class="unit-note">${u.note}</div>
      </div>
    </div>
  `;
}

// Fonction de rendu globale : ré-affiche à la fois la liste latérale et la
// fiche de détail. Appelée à chaque changement de seigneur sélectionné.
function render(){ renderList(); renderPage(); }

// Point d'entrée de la page. Fonction asynchrone car le chargement des
// données des seigneurs (loadLords) effectue une requête réseau (fetch) sur
// le fichier JSON de la faction.
async function init(){
  // `PAGE_FACTION` est une variable globale définie directement dans chaque
  // page HTML (ex: `const PAGE_FACTION = 'dwarfs';`) juste avant l'inclusion
  // de ce script. Elle indique à loadLords() quel fichier data/*.json charger.
  // Si elle n'existe pas (cas non utilisé actuellement), loadLords() gère
  // un fallback vers `undefined`.
  lords = await loadLords(typeof PAGE_FACTION !== 'undefined' ? PAGE_FACTION : undefined);

  // Détermine quel seigneur afficher au chargement de la page :
  // - si l'URL contient un paramètre ?id=... qui correspond à un seigneur
  //   valide de cette faction, on l'utilise (permet de partager un lien direct
  //   vers une fiche précise) ;
  // - sinon, on affiche le premier seigneur de la liste par défaut.
  const requestedId = new URLSearchParams(location.search).get('id');
  activeId = (requestedId && lords.some(l => l.id === requestedId))
    ? requestedId
    : (lords.length ? lords[0].id : null);

  render();
}

// Lance immédiatement l'initialisation dès que le script est exécuté.
init();
