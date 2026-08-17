// ============================================================================
// app.js — Rendu d'une page de faction : la liste des seigneurs dans la barre
// latérale, et la fiche détaillée du seigneur sélectionné.
//
// Chargé par les 32 pages de faction, APRÈS js/core.js et le module d'icônes
// de la faction, dont il consomme `loadLords`, `factionBanners`, `icons`,
// `dripSVG`, `svgDeSecours` et `unitImages`.
//
// ── Ce que la V2 a changé, et pourquoi ─────────────────────────────────────
// Ce fichier est issu de la refonte V2 (commit 46ed217). Trois corrections
// méritent d'être connues avant d'y toucher, parce qu'elles répondent chacune
// à un défaut mesuré et non à une préférence :
//
//   1. La liste des seigneurs est une vraie liste de vrais liens.
//      C'étaient des <div> porteuses d'un addEventListener('click') : ni
//      focalisables, ni activables au clavier. Un seul élément de toute la
//      page était atteignable au clavier, pour 26 éléments interactifs.
//
//   2. La hiérarchie de titres h1 > h2 > h3 existe. La seule balise de titre
//      de la page était auparavant un <h4> perdu dans la carte « Magie » : un
//      lecteur d'écran n'avait aucun plan de page.
//
//   3. `aria-current` signale l'entrée active autrement que par la couleur.
//
// ── Deux pièges à ne pas réintroduire ──────────────────────────────────────
// LE body.className. L'ancienne version écrivait
// `document.body.className = 'theme-' + l.group`, ce qui EFFACE toute autre
// classe posée sur <body> — n'importe quelle classe ajoutée dans le HTML
// disparaissait au premier rendu. Voir appliquerTheme(), qui ne retire que
// les classes `theme-*`.
//
// LE FOCUS APRÈS RENDU. Chaque sélection reconstruit la liste, ce qui détruit
// l'élément focalisé. Sans restauration explicite, un utilisateur au clavier
// est renvoyé en haut de page à chaque changement de seigneur — les liens ont
// beau être corrects, la navigation devient impraticable.
// ============================================================================

// Liste complète des seigneurs de la faction courante, remplie par init().
let lords = [];

// Identifiant du seigneur affiché, correspondant au champ "id" du JSON.
let activeId = null;

// Mémorise si la dernière sélection vient d'une interaction utilisateur, afin
// de savoir s'il faut redonner le focus après le rendu (voir renderList).
let rendreLeFocus = false;

// ---------------------------------------------------------------------------
// LE PANNEAU REPLIABLE DE LA BARRE LATÉRALE.
//
// LE PROBLÈME. Sous 780 px, la barre latérale passe au-dessus du contenu.
// Comme elle liste tous les seigneurs, sa hauteur suit leur nombre : l'audit a
// mesuré 1 077 px de défilement avant la fiche sur cette page, et jusqu'à
// 1 590 px sur Norsca. Un visiteur qui ouvre un lien direct vers une fiche doit
// donc franchir deux écrans avant d'atteindre ce qu'il venait lire.
//
// LA RÉPONSE. Sur mobile, la liste est repliée derrière un bouton qui affiche
// le seigneur courant. Le contenu commence immédiatement ; la liste reste à un
// appui, et la barre est collante pour rester atteignable pendant la lecture.
// Sur grand écran, rien ne change : le bouton est masqué en CSS et la liste
// est toujours dépliée.
//
// Le bouton est injecté ici plutôt qu'écrit dans le HTML : les 31 autres pages
// n'auront ainsi rien à modifier lors de la généralisation.
// ---------------------------------------------------------------------------
function construireBouton(){
  let bouton = document.getElementById('lord-toggle');
  if(bouton) return bouton;

  const liste = document.getElementById('lord-list');
  bouton = document.createElement('button');
  bouton.id = 'lord-toggle';
  bouton.type = 'button';
  bouton.className = 'lord-toggle';
  // aria-expanded décrit l'état à un lecteur d'écran ; aria-controls dit quel
  // élément ce bouton commande.
  bouton.setAttribute('aria-expanded', 'false');
  bouton.setAttribute('aria-controls', 'lord-list');
  liste.parentNode.insertBefore(bouton, liste);

  bouton.addEventListener('click', () => {
    const ouvert = bouton.getAttribute('aria-expanded') === 'true';
    basculerPanneau(!ouvert);
    // À l'ouverture, on emmène le focus sur l'entrée active : l'utilisateur au
    // clavier se retrouve directement dans la liste, pas au début de celle-ci.
    if(!ouvert){
      const actif = liste.querySelector('.lord-item.active');
      if(actif) actif.focus();
    }
  });
  return bouton;
}

// ---------------------------------------------------------------------------
// PASSER D'UNE FACTION À L'AUTRE SANS REPASSER PAR L'ACCUEIL (point 2.1 de
// l'audit).
//
// LE PROBLÈME. Depuis une fiche, le seul chemin vers une autre faction était le
// lien « Retour à la recherche ». Comparer le build d'un Nain à celui d'un
// Skaven imposait donc un aller-retour par l'accueil, qui recharge au passage
// les 32 fichiers JSON de tous les seigneurs du site.
//
// POURQUOI UN <select> ET NON LA BARRE D'ONGLETS DE L'ACCUEIL. Les 33 onglets
// occupaient 525 px de hauteur sur téléphone avant d'être transformés en rail
// défilant ; les reposer ici rouvrirait le défaut que la V2 a corrigé. Un
// menu déroulant natif tient sur une ligne, s'utilise au clavier sans qu'on
// ait rien à écrire, et déclenche le sélecteur système sur mobile — c'est-à-dire
// une meilleure ergonomie que tout ce qu'on reconstruirait à la main.
//
// CE N'EST PAS UNE NAVIGATION INTERNE. Changer de faction change de page HTML :
// chacune charge son propre module d'icônes (js/units/<faction>.js). D'où un
// vrai `location.href` et non un rendu en place.
//
// Injecté depuis le JavaScript, comme le bouton de dépliage : les 32 coquilles
// HTML n'ont ainsi rien à modifier.
// ---------------------------------------------------------------------------
function construireSelecteurFaction(){
  let bloc = document.getElementById('nav-faction');
  if(bloc) return bloc;

  const liste = document.getElementById('lord-list');
  const courante = typeof PAGE_FACTION !== 'undefined' ? PAGE_FACTION : null;

  // Tri alphabétique sur le libellé, comme la barre d'onglets de l'accueil :
  // deux listes des mêmes factions dans deux ordres différents seraient une
  // gêne inutile.
  const groupes = [...FACTION_GROUPS].sort((a, b) => a.label.localeCompare(b.label));

  bloc = document.createElement('div');
  bloc.id = 'nav-faction';
  bloc.className = 'nav-faction';
  bloc.innerHTML = `
    <label class="nav-faction-label" for="nav-faction-select">Changer de faction</label>
    <select class="nav-faction-select" id="nav-faction-select">
      ${groupes.map(g => `
        <option value="${g.page}" ${g.id === courante ? 'selected' : ''}>${g.label}</option>
      `).join('')}
    </select>
  `;
  liste.parentNode.insertBefore(bloc, liste);

  // `change` et non `input` : sur mobile, `input` se déclenche pendant le
  // défilement du sélecteur système, ce qui ferait quitter la page avant même
  // que l'utilisateur ait validé son choix.
  bloc.querySelector('select').addEventListener('change', (e) => {
    if(e.target.value) location.href = e.target.value;
  });

  return bloc;
}

// Ouvre ou ferme le panneau de la liste des seigneurs sur mobile.
// Paramètre `ouvrir` : true pour déplier la liste, false pour la replier.
//
// Les deux effets vont toujours ensemble et c'est la raison d'être de cette
// fonction : `aria-expanded` sur le bouton dit l'état aux lecteurs d'écran, la
// classe `panneau-ouvert` sur la barre latérale le montre à l'écran. Les
// dissocier laisserait un panneau visuellement ouvert annoncé comme fermé.
//
// Sortie silencieuse si le bouton n'est pas encore dans le document : il est
// posé par renderList(), donc un appel antérieur au premier rendu n'a rien à
// basculer. Attention, ce n'est PAS un test de largeur d'écran — le bouton est
// construit sur tous les écrans, et seulement masqué en CSS à partir de 781 px.
function basculerPanneau(ouvrir){
  const bouton = document.getElementById('lord-toggle');
  if(!bouton) return;
  bouton.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
  document.querySelector('.sidebar').classList.toggle('panneau-ouvert', ouvrir);
}

// ---------------------------------------------------------------------------
// Applique le thème de la faction sans écraser les autres classes du <body>.
// ---------------------------------------------------------------------------
function appliquerTheme(groupe){
  const autres = [...document.body.classList].filter(c => !c.startsWith('theme-'));
  document.body.className = [...autres, `theme-${groupe}`].join(' ');
}

// ---------------------------------------------------------------------------
// Barre latérale : la liste des seigneurs.
//
// Structure produite : <ul> de <li> contenant chacun un <a href="?id=...">.
//   - le <ul> permet à un lecteur d'écran d'annoncer « liste de 16 éléments » ;
//   - le <a href> rend l'entrée focalisable au clavier et activable par Entrée,
//     sans qu'on ait à réimplémenter ces comportements ;
//   - l'attribut href réel autorise aussi le clic du milieu et « ouvrir dans un
//     nouvel onglet », qui étaient impossibles avec une <div>.
// Le clic normal est intercepté pour garder le rendu instantané, sans
// rechargement — le comportement visible est donc identique à avant.
// ---------------------------------------------------------------------------
function renderList(){
  const list = document.getElementById('lord-list');

  // Cas limite : aucun seigneur chargé (JSON vide ou introuvable).
  if(!lords.length){
    list.innerHTML = `<div class="lord-list-empty">Aucun seigneur pour l'instant.</div>`;
    return;
  }

  list.innerHTML = `
    <ul class="lord-list">
      ${lords.map(l => `
        <li>
          <a class="lord-item ${l.id===activeId?'active':''}"
             href="?id=${encodeURIComponent(l.id)}"
             data-id="${l.id}"
             ${l.id===activeId ? 'aria-current="true"' : ''}>
            <span class="lord-numeral" aria-hidden="true">${l.numeral}</span>
            <span class="lord-names">
              <span class="lord-name">${l.name}</span>
              <span class="lord-epithet">${l.epithet}</span>
            </span>
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  list.querySelectorAll('.lord-item').forEach(el=>{
    el.addEventListener('click', (e)=>{
      // On laisse le navigateur faire son travail si l'utilisateur demande
      // explicitement une nouvelle fenêtre ou un nouvel onglet.
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      activeId = el.dataset.id;
      history.replaceState(null, '', `?id=${encodeURIComponent(activeId)}`);
      rendreLeFocus = true;
      // Sur mobile, on referme le panneau : sans cela, la liste resterait
      // ouverte par-dessus la fiche qu'on vient justement de demander.
      // Sur grand écran la classe est sans effet, le CSS gardant la liste
      // toujours dépliée.
      const etaitOuvert = document.querySelector('.sidebar').classList.contains('panneau-ouvert');
      if(etaitOuvert) basculerPanneau(false);
      render();
      // Le panneau refermé, l'élément qui avait le focus n'est plus visible :
      // on le rend au bouton, qui devient le point de repère.
      if(etaitOuvert){
        const b = document.getElementById('lord-toggle');
        if(b) b.focus();
        rendreLeFocus = false;
      }
    });
  });

  // Libellé du bouton : le seigneur affiché, pour que l'utilisateur sache où
  // il se trouve sans déplier la liste.
  const bouton = construireBouton();

  // Après le bouton, donc entre lui et la liste : chaque appel insère son
  // élément juste avant #lord-list, l'ordre des deux appels fixe donc l'ordre
  // à l'écran — bouton, puis sélecteur, puis liste.
  construireSelecteurFaction();
  const courant = lords.find(l => l.id === activeId);
  if(courant){
    bouton.innerHTML = `
      <span class="lord-toggle-numeral" aria-hidden="true">${courant.numeral}</span>
      <span class="lord-toggle-nom">${courant.name}</span>
      <span class="lord-toggle-chevron" aria-hidden="true"></span>
    `;
    bouton.setAttribute('aria-label', `Seigneur affiché : ${courant.name}. Changer de seigneur`);
  }

  // Le rendu remplace tout le contenu de la liste, ce qui détruit l'élément
  // qui avait le focus. Sans cette restauration, un utilisateur au clavier
  // serait renvoyé au début de la page à chaque sélection — la navigation
  // deviendrait impraticable alors même que les liens sont corrects.
  if(rendreLeFocus){
    const actif = list.querySelector('.lord-item.active');
    if(actif) actif.focus();
    rendreLeFocus = false;
  }
}

// ---------------------------------------------------------------------------
// Zone principale : la fiche du seigneur sélectionné.
// ---------------------------------------------------------------------------
function renderPage(){
  const l = lords.find(x=>x.id===activeId);
  const page = document.getElementById('page-content');

  // Garde-fou : sans ce test, la lecture de `l.group` ci-dessous lèverait une
  // TypeError et la page resterait blanche, sans rien indiquer au visiteur.
  if(!l){
    page.innerHTML = `<div class="lord-list-empty">Aucune fiche à afficher pour cette faction.</div>`;
    return;
  }

  appliquerTheme(l.group);

  // Il n'y a plus de bloc « Attributs & capacités passives ».
  //
  // Il n'existait que sur UNE fiche sur 321 (Vlad von Carstein) et rompait
  // l'uniformité du site. Supprimé le 17/08/2026 sur décision du user, dans le
  // rendu ET dans data/vampire-counts.json — c'est la seule modification de
  // données de toute la V2, et elle a été explicitement autorisée.
  //
  // ATTENTION avant de faire le ménage dans la feuille de style : les classes
  // `attr-list`, `attr-item` et `stats-caveat` restent NÉCESSAIRES. Le champ
  // `effects` des 321 fiches les utilise pour son propre balisage HTML.

  // Bannière : celle du seigneur si elle existe, sinon celle de sa faction.
  const banner = l.banner || factionBanners[l.group];

  // Les <div class="section"> deviennent des <section> reliées à leur titre par
  // aria-labelledby : un lecteur d'écran annonce alors « région Lore » plutôt
  // qu'un groupe anonyme.
  page.innerHTML = `
    <div class="portrait-frame">
      <img src="${banner}" alt="Artwork officiel ${l.groupLabel}">
    </div>
    <div class="banner">
      <div class="seal">${l.portraitImage ? `<img src="${l.portraitImage}" alt="${l.name}">` : svgDeSecours(l.seal)}</div>
      <div>
        <h1 class="lord-title">${l.name}</h1>
        <p class="lord-epithet-big">${l.epithet}</p>
      </div>
    </div>
    <span class="faction-tag">${l.faction}</span>
    ${dripSVG}

    <section class="section" aria-labelledby="titre-lore">
      <div class="section-head">${icons.lore}<h2 class="section-title" id="titre-lore">Lore</h2></div>
      <div class="section-body">${l.lore}</div>
    </section>

    <section class="section" aria-labelledby="titre-effets">
      <div class="section-head">${icons.effects}<h2 class="section-title" id="titre-effets">Effets de faction / seigneur</h2></div>
      <div class="section-body">${l.effects}</div>
    </section>

    <section class="section" aria-labelledby="titre-build">
      <div class="section-head">${icons.build}<h2 class="section-title" id="titre-build">Build recommandé</h2></div>
      <div class="section-body"><p><strong>${l.build.role}</strong></p></div>

      <h3 class="army-subhead">Seigneur</h3>
      <div class="unit-grid">
        ${unitCardHtml(l.build.lord)}
      </div>

      ${l.build.heroes && l.build.heroes.length ? `
        <h3 class="army-subhead">Héros</h3>
        <div class="unit-grid">
          ${l.build.heroes.map(unitCardHtml).join('')}
        </div>
      ` : ''}

      <h3 class="army-subhead">Corps d'armée</h3>
      <div class="unit-grid">
        ${l.build.army.map(unitCardHtml).join('')}
      </div>

      <!-- Cas particulier de Kemmler & Krell : Krell est invoqué en bataille
           plutôt que recruté, il est donc présenté à part. -->
      ${l.build.krellNote ? `
        <h3 class="army-subhead">Invocation en bataille</h3>
        <div class="unit-grid">
          ${unitCardHtml(l.build.krellNote)}
        </div>
      ` : ''}

      ${l.build.totalSlots ? `<p class="army-total">${l.build.totalSlots} slots d'armée au total (seigneur inclus)</p>` : ''}

      <div class="build-grid" style="margin-top:20px;">
        <div class="build-card">
          <h4>Magie</h4>
          <p>${l.build.magic}</p>
        </div>
      </div>
      <p class="note">${l.build.note}</p>
    </section>

    ${navVoisinsHtml()}
  `;

  brancherNavVoisins();
}

// ---------------------------------------------------------------------------
// NAVIGATION VERS LE SEIGNEUR PRÉCÉDENT ET SUIVANT, en bas de fiche.
//
// POURQUOI EN BAS. C'est l'endroit où l'on se trouve quand on a fini de lire :
// le moment naturel pour passer au suivant. En haut, elle ferait doublon avec
// la liste latérale, qui est déjà là et permet d'aller n'importe où.
//
// POURQUOI SANS BOUCLAGE. Le dernier seigneur n'enchaîne pas sur le premier.
// Un parcours qui reboucle sans le dire donne l'impression d'avoir manqué une
// fiche ; s'arrêter à la fin dit clairement qu'on a tout vu. Les deux
// emplacements existent quand même dans la grille, sinon « Suivant » sauterait
// à gauche sur la première fiche.
// ---------------------------------------------------------------------------
function navVoisinsHtml(){
  const i = lords.findIndex(l => l.id === activeId);
  if(i === -1 || lords.length < 2) return '';

  const lien = (voisin, sens, libelle, fleche) => {
    if(!voisin) return '<span></span>';
    // Un vrai <a href> : il fonctionne au clavier, s'ouvre dans un nouvel
    // onglet avec Ctrl+clic, et reste utilisable si le JavaScript échoue.
    // `rel` dit au navigateur et aux lecteurs d'écran de quel sens il s'agit.
    return `
      <a class="fiche-nav-lien fiche-nav-${sens}" rel="${sens}"
         href="?id=${encodeURIComponent(voisin.id)}" data-id="${voisin.id}"
         aria-label="${libelle} : ${voisin.name}">
        <span class="fiche-nav-sens" aria-hidden="true">${fleche} ${libelle}</span>
        <span class="fiche-nav-nom">${voisin.name}</span>
      </a>`;
  };

  return `
    <nav class="fiche-nav" aria-label="Seigneur précédent ou suivant">
      ${lien(lords[i - 1], 'prev', 'Précédent', '←')}
      ${lien(lords[i + 1], 'next', 'Suivant', '→')}
    </nav>
  `;
}

// Rend les deux liens actifs sans recharger la page, comme le fait la liste
// latérale. Appelée après chaque rendu, puisque innerHTML détruit les liens
// précédents et avec eux leurs écouteurs.
function brancherNavVoisins(){
  document.querySelectorAll('.fiche-nav-lien').forEach(el => {
    el.addEventListener('click', (e) => {
      // On laisse le navigateur faire si un nouvel onglet est demandé.
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      activeId = el.dataset.id;
      history.replaceState(null, '', `?id=${encodeURIComponent(activeId)}`);
      render();

      // Sans cette remontée, on resterait à la hauteur où l'on avait cliqué —
      // c'est-à-dire tout en bas d'une fiche dont on n'a encore rien lu.
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Le focus part sur le titre de la nouvelle fiche : un lecteur d'écran
      // annonce alors le seigneur qu'on vient de demander. Sans cela, le focus
      // retomberait au début du document et l'utilisateur ne saurait pas que
      // le contenu a changé. `tabindex="-1"` rend le h1 focalisable par script
      // sans l'ajouter à l'ordre de tabulation.
      const titre = document.querySelector('.lord-title');
      if(titre){
        titre.setAttribute('tabindex', '-1');
        titre.focus({ preventScroll: true });
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Carte d'une unité (seigneur, héros, unité d'armée, invocation).
// Paramètre `u` : { icon, name, qty, note }
// ---------------------------------------------------------------------------
function unitCardHtml(u){
  // Priorité à l'image réelle ; svgDeSecours() (js/core.js) renvoie
  // aujourd'hui toujours une chaîne vide, le repli SVG ayant été retiré.
  // loading="lazy" : les cartes situées plus bas ne sont chargées qu'à
  // l'approche du viewport.
  const icon = unitImages[u.icon]
    ? `<img src="${unitImages[u.icon]}" alt="${u.name}" loading="lazy" decoding="async">`
    : svgDeSecours(u.icon);
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

// Rendu global : liste latérale + fiche.
function render(){ renderList(); renderPage(); }

// ---------------------------------------------------------------------------
// Point d'entrée.
// ---------------------------------------------------------------------------
async function init(){
  // `PAGE_FACTION` est défini dans la page HTML, juste avant ce script.
  lords = await loadLords(typeof PAGE_FACTION !== 'undefined' ? PAGE_FACTION : undefined);

  // Un paramètre ?id=... valide l'emporte, ce qui permet de partager un lien
  // direct vers une fiche ; sinon on affiche le premier seigneur.
  const requestedId = new URLSearchParams(location.search).get('id');
  activeId = (requestedId && lords.some(l => l.id === requestedId))
    ? requestedId
    : (lords.length ? lords[0].id : null);

  render();
}

init();
