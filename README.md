# Builds Total War: WARHAMMER III

Catalogue en français de **builds d'armée à 20 emplacements** pour les seigneurs légendaires de
*Total War: WARHAMMER III* en campagne Immortal Empires — jeu de base et mods du Steam Workshop.

**Site en ligne : https://kandaine.github.io/builds-tww3/**

Projet personnel et non commercial. Les cartes d'unités et portraits sont extraits du jeu et de ses
mods à des fins d'illustration.

| | |
|---|---|
| Factions | 32 |
| Seigneurs légendaires | 321 |
| Cartes d'unité affichées | 3 905 |
| Poids d'une page de faction | ~620 Ko |

---

## Faire tourner le site

Il n'y a **aucune étape de build** : ni npm, ni bundler, ni framework. Du HTML, du CSS et du
JavaScript servis tels quels. Il suffit d'un serveur statique, parce que les pages chargent leurs
données par `fetch()` — **ouvrir un fichier en `file://` ne fonctionnera pas**, le navigateur
bloquera les requêtes.

N'importe quel serveur statique convient :

```bash
python -m http.server 8000     # Python
npx serve                      # Node
php -S localhost:8000          # PHP
```

Puis http://localhost:8000/.

> Sous Windows, `python` peut répondre alors que Python n'est pas installé : c'est un raccourci
> vers le Microsoft Store, qui échoue avec un message d'invitation à l'installer. Dans ce cas,
> utiliser une des autres options.

---

## Comment c'est agencé

Le principe tient en une phrase : **les données sont dans du JSON, la présentation dans une poignée
de fichiers JS, et chaque page de faction n'est qu'une coquille.**

```
index.html              page de recherche : les 321 seigneurs, filtre par faction et par texte
<faction>.html      x32 une page par faction (dwarfs.html, skaven.html…)
data/<faction>.json x32 LE CONTENU : seigneurs, lore, effets, build de 20 slots
js/core.js              catalogue des factions, bannières, chargement des données, utilitaires
js/units/<faction>.js x32 chemins des images d'unités, d'UNE faction
js/app.js               rendu d'une page de faction
js/search.js            rendu de la page de recherche
css/style.css           mise en page + un thème de couleurs par faction
assets/                 images : units/ (cartes), portraits/, banners/
tools/                  scripts de validation (PowerShell)
```

**Les 32 pages de faction sont quasi identiques.** Chacune déclare son identifiant puis charge trois
scripts, dans cet ordre — l'ordre compte, chaque fichier utilisant le précédent :

```html
<script>const PAGE_FACTION = 'dwarfs';</script>
<script src="js/core.js"></script>
<script src="js/units/dwarfs.js"></script>
<script src="js/app.js"></script>
```

`app.js` lit `PAGE_FACTION`, charge `data/dwarfs.json`, et rend la page. Toute la variabilité est
dans le JSON et le module d'icônes ; le code, lui, est commun.

**Pourquoi un module d'icônes par faction.** Ces 32 fichiers ne contiennent qu'une table
`clé → chemin d'image`. Ils étaient autrefois réunis en un registre unique de 343 Ko que *chaque*
page téléchargeait en entier, alors qu'une page n'affiche qu'une faction. Le découpage a ramené le
JavaScript d'une page de 353 Ko à ~33 Ko.

---

## Trois choses à savoir avant de modifier

**1. Une fiche et son module d'icônes vont par paire.** Ajouter une unité dans
`data/<faction>.json` impose d'ajouter sa clé d'icône dans `js/units/<faction>.js`. C'est le piège
principal du projet : une clé manquante n'affiche **aucune erreur**, seulement une carte sans image.
Une clé déclarée dans le module d'une *autre* faction ne compte pas — une page ne charge que le
sien.

**2. Chaque build totalise exactement 20 emplacements** : 1 seigneur + la somme des quantités de
héros + la somme des quantités d'unités. C'est la contrainte du jeu, et le champ `totalSlots` doit
correspondre au calcul.

**3. Les tailles d'image ne se choisissent pas au hasard.** Les cartes et portraits font 60×130
(certaines cartes 120×260 pour les écrans haute densité) et **ne doivent pas être redimensionnées** :
ils sont déjà affichés agrandis. Les bannières, elles, sont plafonnées à **1840 px de large**, soit
le double de la largeur d'affichage maximale.

---

## Validation

Deux scripts vérifient ce que ni le navigateur ni `git diff` ne signalent — clé d'icône absente,
fichier image manquant, total d'emplacements faux :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-icones.ps1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem data\*.json | ForEach-Object { & .\tools\validate_fiche.ps1 -Faction $_.BaseName }"
```

Ils sont lancés automatiquement par deux filets :

- un **hook `pre-commit`** qui bloque le commit en cas d'échec. À activer une fois par clone :
  ```bash
  git config core.hooksPath .githooks
  ```
  Il ne teste que les factions présentes dans le commit, et sort immédiatement si aucune fiche
  n'est touchée. Contournement ponctuel : `git commit --no-verify`.
- une **GitHub Action** qui rejoue la validation à chaque push sur `main`.

---

## Structure d'une fiche

Chaque `data/<faction>.json` est un tableau de seigneurs. Les champs qui comptent :

```jsonc
{
  "id": "thorgrim",              // identifiant, sert aussi dans l'URL (?id=thorgrim)
  "numeral": "I",                // chiffre romain affiché dans la barre latérale
  "name": "Thorgrim Grudgebearer",
  "epithet": "Le Haut Roi",
  "faction": "Karaz-a-Karak",    // nom de la sous-faction affiché en étiquette
  "portraitImage": "assets/portraits/thorgrim.png",
  "lore": "…",                   // HTML autorisé
  "effects": "…",                // effets de faction et de seigneur, relevés en jeu
  "build": {
    "role": "…",
    "lord":   { "icon": "thorgrim", "name": "…", "qty": 1,  "note": "…" },
    "heroes": [ { "icon": "…", "name": "…", "qty": 2, "note": "…" } ],
    "army":   [ { "icon": "…", "name": "…", "qty": 4, "note": "…" } ],
    "magic": "…",
    "note": "…",
    "totalSlots": 20
  }
}
```

Le champ `icon` est la clé à déclarer dans `js/units/<faction>.js`.

**Champs optionnels**, présents seulement quand c'est utile : `banner` (bannière propre au
seigneur, prime sur celle de sa faction — 10 fiches), `attributes` (bloc de capacités passives
détaillées — 1 fiche), `build.krellNote` (unité invoquée en bataille plutôt que recrutée — 1 fiche,
le cas Kemmler & Krell).

**Deux champs à connaître pour ne pas s'y perdre :**

- `seal` désigne une icône SVG de secours. Le mécanisme a été retiré du chargement — les 321
  seigneurs ont tous un `portraitImage` — donc ce champ est **inerte**. Les SVG sont conservés dans
  `js/fallback-svg.js`, qu'aucune page ne charge.
- `wikiUrl` est renseigné sur **les 321 fiches** mais **n'est lu par aucun code**. C'est de la
  donnée de référence, pas un champ d'affichage : ne pas chercher où il apparaît, il n'apparaît
  nulle part.

---

## Licence et contenu

Warhammer, Total War et les marques associées appartiennent à Games Workshop et Creative Assembly.
Ce site n'est affilié ni à l'un ni à l'autre, ne génère aucun revenu, et se limite à documenter des
compositions d'armée pour les joueurs francophones.
