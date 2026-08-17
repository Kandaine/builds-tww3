# Audit UI/UX — état des lieux avant refonte

**Date :** 17/08/2026 · **Périmètre :** diagnostic seul, aucune proposition de solution
**Site audité :** https://kandaine.github.io/builds-tww3/ (version en ligne, commit `763f880`)

---

## Comment lire ce document

**Gravité**

| Niveau | Signification |
|---|---|
| **Bloquant** | empêche un usage légitime du site, ou exclut une catégorie d'utilisateurs |
| **Gênant** | dégrade l'expérience sans l'empêcher |
| **Cosmétique** | visible d'un œil exercé, sans conséquence d'usage |

**Effort** — bandes indicatives : *faible* = une poignée de fichiers, changement mécanique ·
*moyen* = touche plusieurs couches, demande des choix · *élevé* = refonte d'un pan entier,
risque de régression.

**Méthode.** Tout ce qui suit est mesuré, pas estimé : navigateur aux dimensions réelles (375,
768, 1280 px), calcul des ratios de contraste sur les couleurs calculées, énumération des éléments
focalisables, `performance.getEntriesByType()` pour les poids, comparaison des fichiers deux à deux
pour la duplication. Les rares points non vérifiés sont signalés comme tels.

---

## 1. Ce qui est déjà solide

À prendre au sérieux dans la priorisation : ces points n'ont pas besoin d'être retouchés, et une
refonte mal cadrée pourrait les casser.

**Le contraste du corps de texte est excellent** — de 15,9 à 18,6 selon les thèmes, là où la norme
AA demande 4,5. La lecture d'une fiche, qui est l'usage principal, est confortable sur les 32
factions.

**Aucun débordement horizontal**, ni à 375 px ni à 768 px. C'est loin d'être acquis sur un site à
grille, et ça évite le pire défaut mobile.

**Les fondamentaux HTML sont posés** : `lang="fr"` sur les 33 pages, `<meta viewport>` correct,
`aria-label` sur la navigation, et **les quatre `<img>` du site ont un `alt` renseigné** — y compris
les cartes d'unités, dont l'alt reprend le nom réel de l'unité.

**Le chargement des images est déjà optimisé** : `loading="lazy"` et `decoding="async"` sur les
cartes et portraits, ce qui explique qu'une fiche de 20 unités ne coûte pas 20 images au chargement.

**Les couleurs sont centralisées** en 13 variables CSS, redéfinies par thème de faction. Changer une
teinte se fait en un point.

**La page de recherche est entièrement navigable au clavier** : 322 éléments atteignables, les
cartes de résultat étant de vrais liens `<a>`.

**Le chemin le plus court est déjà d'un clic.** Depuis l'accueil, une carte de résultat mène
directement à la fiche voulue (`faction.html?id=seigneur`), sans étape intermédiaire.

---

## 2. Structure et navigation

### 2.1 Aucun passage direct d'une faction à l'autre

**Constat.** Une page de faction ne contient qu'un lien : « ← Retour à la recherche ». Pour aller
des Nains aux Skavens, il faut repasser par l'accueil, y retrouver l'onglet ou le seigneur : **2
clics et un rechargement complet**, contre 1 clic si les 32 factions étaient accessibles depuis la
page. La barre latérale, elle, liste les seigneurs de la faction courante — jamais les autres
factions.

**Gravité : gênant.** L'usage « comparer deux races » est courant sur ce type de catalogue.

**Effort : faible.** Les données nécessaires (`FACTION_GROUPS`) sont déjà chargées par `core.js` sur
chaque page.

### 2.2 Le nombre de seigneurs par faction n'est visible nulle part avant d'entrer

**Constat.** L'accueil affiche 33 onglets sans indication de volume. Rien ne distingue Daemons of
Chaos (1 seigneur) de Skaven (24) ou Norsca (25). Le déséquilibre est pourtant d'un facteur 25.

**Gravité : cosmétique.**
**Effort : faible.**

### 2.3 Pas de partage possible d'un état de recherche

**Constat.** Le filtre de faction et le texte saisi ne sont pas reflétés dans l'URL. Un lien vers
« tous les seigneurs Skavens » n'existe pas ; seule la fiche individuelle est adressable
(`?id=`). Un rechargement de page perd le filtre en cours.

**Gravité : gênant.**
**Effort : faible.**

---

## 3. Cohérence visuelle

### 3.1 Aucune échelle typographique

**Constat.** 13 tailles de police distinctes cohabitent, dont **10,5 px, 12,5 px, 13,5 px, 14,5 px
et 15,5 px**. Les demi-pixels signalent des valeurs posées à l'œil, une par une, plutôt qu'une
échelle. Cinq tailles se logent entre 12 et 16 px — un écart trop faible pour créer une hiérarchie
lisible, mais suffisant pour se voir.

**Gravité : gênant.** L'effet est diffus : la hiérarchie de la fiche repose sur la couleur et la
graisse plus que sur la taille.

**Effort : moyen.** Mécanique à appliquer, mais il faut d'abord choisir l'échelle, puis revoir les
~40 déclarations concernées et vérifier le rendu sur les 32 thèmes.

### 3.2 Aucune échelle d'espacement

**Constat.** 26 valeurs distinctes de `margin`/`padding` en pixels : 3, 4, 6, 8, 10, 12, 14, 16, 20,
32, 36, 48… Aucune progression régulière, aucune variable. Les 13 variables CSS existantes sont
**exclusivement des couleurs** — rien pour les espacements, les rayons ou la typographie.

**Gravité : gênant.**
**Effort : moyen.**

### 3.3 Cinq familles de polices

**Constat.** Cinzel, Cormorant Upright, EB Garamond, Space Grotesk et Inter. Trois serif et deux
sans-serif, pour un site dont la mise en page tient en trois zones. Cinzel est utilisé dans 14
règles, Inter dans 6, les trois autres dans 1 à 2 chacune — deux familles servent donc à presque
rien tout en coûtant leur téléchargement.

**Gravité : gênant** (l'impact est surtout en performance, voir 5.1).
**Effort : moyen.**

### 3.4 Redéfinitions de règles en cascade

**Constat.** Six sélecteurs (`.army-total`, `.unit-card`, `.unit-icon`, `.unit-name`, `.unit-note`,
`.unit-qty`) sont déclarés **deux fois** dans la feuille, la seconde l'emportant. Le fichier
documente honnêtement le piège en commentaire, ce qui limite le risque — mais la valeur affichée
n'est pas celle qu'on lit en premier.

**Gravité : cosmétique** aujourd'hui, **piège de maintenance** demain.
**Effort : faible.**

---

## 4. Responsive

### 4.1 La barre latérale pousse le contenu hors de l'écran — le point le plus grave de cet audit

**Constat.** Sous 780 px, la mise en page passe en colonne : la barre latérale devient un bandeau
horizontal **au-dessus** du contenu. Comme elle liste tous les seigneurs, sa hauteur suit leur
nombre :

| Page | Seigneurs | Hauteur du bandeau | Défilement avant la fiche |
|---|---|---|---|
| `empire.html` (mobile 375 px) | 19 | 1 248 px | ~1,5 écran |
| `norsca.html` (mobile 375 px) | 25 | 1 590 px | **2,0 écrans** |
| `norsca.html` (tablette 753 px) | 25 | 1 740 px | **1,7 écran** |

Un visiteur mobile qui ouvre un lien direct vers une fiche voit d'abord une liste de 25 noms, et
doit franchir deux écrans avant d'atteindre le contenu qu'il venait lire. La tablette est **pire**
que le mobile : le bandeau reste sur une colonne alors que la largeur disponible a doublé.

**Gravité : bloquant.** C'est le parcours d'arrivée le plus probable depuis un partage de lien.

**Effort : moyen.** Aucun correctif ne se limite au CSS : replier la liste, la déplacer, ou la
transformer en sélecteur demande de toucher au rendu de `app.js`.

### 4.2 Trois points de rupture, presque vides

**Constat.** Les media queries font 3, 6 et 11 lignes, pour un total de 20 lignes sur 1 320 —
**1,5 % de la feuille**. La grille d'unités passe bien à 2 colonnes à 768 px, mais l'essentiel de
l'adaptation se résume à réduire des `padding`.

**Gravité : gênant.**
**Effort : moyen.**

### 4.3 Une cible tactile sous le seuil recommandé

**Constat.** Sur la page mesurée, un élément interactif fait moins de 44 px de haut, seuil usuel
pour un doigt. Les entrées de la liste, elles, sont conformes après le correctif de la requête
480 px.

**Gravité : cosmétique.**
**Effort : faible.**

---

## 5. Performance

Rappel : la session d'optimisation du 16/08 a ramené une page de faction de ~1,42 Mo à ~708 Ko.
Ce qui suit concerne ce qui n'a pas encore été traité.

### 5.1 Les polices sont désormais le premier poste

**Constat.** Les 5 familles représentent **263 Ko à la première visite** (8 fichiers uniques,
sous-ensemble latin — les polices sont variables, un fichier couvre toutes les graisses). C'est plus
que tout le JavaScript et le CSS réunis (24 Ko).

Aggravant : elles sont appelées par un **`@import` en tête de `style.css`**, ce qui sérialise les
requêtes — le navigateur doit charger `style.css`, y découvrir l'import, demander la feuille Google,
puis seulement demander les fichiers de police. Trois allers-retours avant le premier caractère
correctement rendu.

**Gravité : gênant.**
**Effort : faible** pour supprimer la sérialisation (déplacer l'appel dans le HTML) ;
**moyen** pour réduire le nombre de familles, qui est une décision de design.

### 5.2 L'accueil télécharge 98 % de données qu'il n'affiche pas

**Constat.** La page de recherche charge **les 32 fichiers JSON**, soit 659 Ko transférés (2 483 Ko
avant compression). Elle n'en utilise que six champs par seigneur : `id`, `numeral`, `name`,
`epithet`, `faction`, `portraitImage`.

Tout le reste — `lore`, `effects`, et l'intégralité du bloc `build` avec ses 20 emplacements, notes
comprises — est téléchargé puis ignoré. **54 Ko suffiraient**, soit 2 % du volume actuel.

**Gravité : gênant.** Invisible sur connexion rapide, sensible en mobilité.

**Effort : moyen.** Demande un index séparé, donc une étape de génération et un risque de
désynchronisation avec les fiches — exactement le type de piège que le projet a déjà rencontré avec
la règle des deux fichiers.

### 5.3 Points non mesurés

Je n'ai pas évalué le rendu sur connexion lente simulée, ni les Core Web Vitals (LCP, CLS). Les
temps relevés (353 ms à 532 ms) l'ont été avec un cache chaud et ne représentent pas une première
visite.

---

## 6. Accessibilité

### 6.1 Les pages de faction sont inutilisables au clavier

**Constat.** Sur `norsca.html`, **un seul élément est atteignable au clavier** : le lien de retour.
Les 25 entrées de la liste des seigneurs sont des `<div>` porteuses d'un `addEventListener('click')`
— sans `href`, sans `tabindex`, sans `role`. Elles ne peuvent être ni focalisées, ni activées par
Entrée.

Conséquence : au clavier seul, **aucune fiche autre que celle chargée par défaut n'est accessible**.
Même constat pour les 33 onglets de faction de l'accueil, dont **0 sur 33** sont atteignables.

**Gravité : bloquant.** Exclut les utilisateurs au clavier, les lecteurs d'écran, et toute
navigation sans souris.

**Effort : faible.** Le patron est déjà appliqué avec succès sur la page de recherche, dont les
cartes sont de vrais liens `<a href>`.

### 6.2 Un seul élément échoue au contraste, mais sur 12 thèmes sur 32

> **Correction du 17/08/2026.** Une première version de cette section annonçait des ratios
> catastrophiques (1,04) sur les épithètes et les notes. **C'était une erreur de mesure de ma part** :
> mon calcul lisait le `background-color` du premier parent non transparent sans tenir compte de son
> canal alpha. Or `.lord-item.active` et `.note` ont des fonds semi-transparents
> (`rgba(..., 0.18)` et `0.08`) posés sur un panneau sombre. Je calculais donc le contraste contre
> une couleur pleine qui n'apparaît jamais à l'écran. Les valeurs ci-dessous composent réellement
> les couches, y compris l'alpha du texte.

**Constat.** Seuil AA = 4,5 pour du texte courant. Mesures sur les couleurs réellement composées :

| Élément | Norsca | Skaven | Nurgle | Dwarfs | Bretonnia |
|---|---|---|---|---|---|
| `.section-body` (corps) | — | 16,9 ✅ | 17,5 ✅ | 15,9 ✅ | 18,6 ✅ |
| `.lord-name` (liste) | — | 14,1 ✅ | 14,9 ✅ | 14,0 ✅ | 16,8 ✅ |
| `.lord-epithet` (liste) | — | 5,6 ✅ | 6,5 ✅ | 6,2 ✅ | 6,2 ✅ |
| `.note` (note de build) | — | 6,3 ✅ | 7,2 ✅ | 6,7 ✅ | 6,6 ✅ |
| `.unit-note` | — | 6,0 ✅ | 6,9 ✅ | 6,0 ✅ | 5,7 ✅ |
| **`.unit-qty` (×4, ×2…)** | **2,14** ❌ | **3,32** ❌ | **4,44** ❌ | 6,6 ✅ | 8,0 ✅ |

**La typographie du site est donc globalement conforme.** Un seul élément pose problème, et il pose
problème parce qu'il est le seul texte courant peint avec `--accent-secondary`, une variable pensée
pour de l'ornement et non pour de la lecture.

Balayage des 32 thèmes sur ce seul élément : **20 conformes, 12 en échec**, du pire au moins pire —
Norsca 2,14 · Greenskins 2,27 · Kislev 2,50 · Araby 2,72 · Vampire Coast 2,90 · Slaanesh 3,00 ·
Jade-Blooded 3,12 · Skaven 3,32 · Khorne 3,38 · Chaos Dwarfs 4,13 · Tomb Kings 4,17 · Nurgle 4,44.

Le paradoxe demeure, et c'est ce qui rend le défaut gênant malgré son périmètre étroit : la
**quantité d'une unité** est l'information la plus décisive d'un build, et c'est le seul texte du
site à échouer.

**Gravité : gênant.** Ni bloquant — le texte reste perceptible entre 2,1 et 4,4 — ni cosmétique,
vu ce que porte l'information.

**Effort : faible.** Une seule règle CSS à repeindre sur une variable de texte plutôt que d'accent.

### 6.3 Aucune structure de titres sur les pages de faction

**Constat.** Un seul `<h1>` existe sur tout le site, dans `index.html`. Les 32 pages de faction n'en
ont aucun : le nom du seigneur est un `<div class="lord-title">`, les intitulés de section des
`<div class="section-title">`. Le seul titre produit par le JS est un `<h4>`, pour le bloc « Magie ».

Un lecteur d'écran ne dispose donc d'aucun plan de page, et la navigation par titres — le mode
principal de parcours pour ces outils — est inopérante.

**Gravité : bloquant.**
**Effort : faible.** Changement de balises, sans effet visuel si les styles suivent.

### 6.4 Aucune indication d'état pour l'assistance technique

**Constat.** `aria-current` : 0 occurrence, alors que la liste et les onglets ont un état « actif »
signalé uniquement par la couleur. `aria-live` : 0, alors que la recherche met à jour les résultats
sans rechargement — un lecteur d'écran n'annonce donc jamais que le nombre de résultats a changé.
`role` : 0 occurrence sur tout le site.

**Gravité : gênant.**
**Effort : faible.**

### 6.5 Style de focus

**Constat.** Deux règles `:focus` existent dans la feuille. Elles ne servent aujourd'hui qu'au champ
de recherche et au lien de retour, seuls éléments focalisables. Toute correction du point 6.1 rendra
la question du focus visible immédiatement dimensionnante.

**Gravité : gênant** (conditionné à 6.1).
**Effort : faible.**

---

## 7. Duplication technique

### 7.1 Le chiffre exact

**Précision factuelle :** le site compte **33 pages HTML** — 32 factions plus `index.html` — et non
35.

**Constat.** Une page de faction fait 43 lignes. Comparées deux à deux, deux pages diffèrent de
**10 lignes sur 43, soit 88 % de contenu commun**. Après neutralisation du nom de faction, l'écart
moyen tombe à 7 lignes.

En réalité, **seules 4 valeurs varient** :

```
<title>Dwarfs — Total War: WARHAMMER III</title>     ← 1. le titre
<div class="sidebar-title">Dwarfs</div>              ← 2. le nom affiché
<script>const PAGE_FACTION = 'dwarfs';</script>      ← 3. l'identifiant
<script src="js/units/dwarfs.js"></script>           ← 4. le module d'icônes
```

Le reste — en-tête, métadonnées, structure, ordre de chargement, commentaires — est identique aux
32 exemplaires.

### 7.2 Ce que ça coûte réellement

**Constat.** Le coût n'est pas le volume (43 lignes × 32 = 1 376 lignes, négligeable) mais la
**modification transverse** : ajouter une balise `<meta description>`, un lien de navigation, un
script d'analyse ou corriger une faute dans un commentaire demande 32 éditions identiques. Un oubli
sur une seule page ne produit aucune erreur — le symptôme est une page qui se comporte différemment
des 31 autres, sans signal.

C'est le même profil de risque que la règle des deux fichiers déjà documentée dans le README : une
divergence silencieuse.

À l'inverse, la duplication actuelle a une vertu : **aucune étape de build**, ce qui est un principe
assumé du projet et une des raisons de sa robustesse.

**Gravité : gênant** — aucun impact utilisateur, coût de maintenance réel.

**Effort : élevé.** Toute mutualisation implique soit un générateur (donc une étape de build, à
rebours d'un choix structurant), soit un rendu côté client de la coquille (donc une page blanche
sans JavaScript et un coût pour le référencement d'un site public).

### 7.3 Métadonnées absentes, à traiter en même temps

**Constat.** Aucune page ne porte de `<meta name="description">`, ni de balises Open Graph. Pour un
site **publié et partageable**, un lien collé dans une conversation n'affiche ni description ni
vignette. Corriger cela suppose 33 éditions — d'où le lien direct avec le point précédent.

**Gravité : gênant.**
**Effort : faible** si traité avec 7.2, **fastidieux** sinon.

---

## 8. Synthèse

### Par gravité

**Bloquant — 3 constats**

| # | Constat | Effort |
|---|---|---|
| 6.1 | Pages de faction inutilisables au clavier (1 seul élément focalisable sur 26) | faible |
| 6.3 | Aucune structure de titres hors `index.html` | faible |
| 4.1 | Jusqu'à 2 écrans de défilement avant le contenu, sur mobile et tablette | moyen |

**Gênant — 10 constats** · 2.1 navigation inter-factions · 2.3 état de recherche non partageable ·
3.1 échelle typographique · 3.2 échelle d'espacement · 3.3 cinq familles de polices ·
4.2 points de rupture squelettiques · 5.1 polices sérialisées, 263 Ko · 5.2 accueil à 98 % de données
inutiles · **6.2 `.unit-qty` sous le seuil sur 12 thèmes** · 6.4 absence d'`aria-current` /
`aria-live` · 7.2 duplication des 32 coquilles · 7.3 métadonnées absentes

**Cosmétique — 3 constats** · 2.2 volume par faction invisible · 3.4 règles CSS redéfinies ·
4.3 une cible tactile sous 44 px

### Lecture d'ensemble

**Le site est en meilleur état que la première version de cet audit ne le laissait croire.** Après
correction de mon erreur de mesure, la lisibilité est conforme partout sauf sur un élément — la
quantité d'unité — et sur 12 thèmes seulement.

Deux des trois points bloquants sont des **corrections locales à faible effort** : rendre les
éléments focalisables et changer des balises de titre. Ils ne demandent aucune refonte, et leur
rapport valeur/coût est le plus élevé de cet audit.

Le troisième, la barre latérale sur mobile, est le seul qui touche à la structure — et c'est aussi
celui qui pèse sur le parcours d'arrivée le plus probable. **C'est le seul motif sérieux de refonte
dans ce document.**

À l'inverse, les sujets les plus visibles dans une discussion de refonte — la duplication des 32
pages, les échelles typographiques — sont ceux dont l'impact utilisateur est le plus faible. La
duplication ne gêne aujourd'hui que toi.

### Leçon de méthode, à garder pour la V2

L'erreur corrigée en 6.2 mérite d'être retenue : **un contraste ne se calcule pas contre une couleur
déclarée, mais contre la couleur composée à l'écran.** Dès qu'un fond porte un alpha — et le site en
utilise pour les états actifs et les encarts —, lire `background-color` ne suffit pas. Toute
vérification automatisée de la V2 devra composer les couches, sous peine de produire des alertes
fausses… ou de rassurer à tort.

**Ce que cet audit ne couvre pas :** aucun test avec un lecteur d'écran réel, aucune mesure sur
connexion lente, aucun test utilisateur. Les conclusions d'accessibilité reposent sur des critères
automatisables, qui attrapent l'essentiel mais pas tout.
