# Builds Total War: WARHAMMER III

Catalogue en français de **builds d'armée à 20 emplacements** pour les seigneurs légendaires de
*Total War: WARHAMMER III* en campagne Immortal Empires — jeu de base et mods du Steam Workshop.

**Site en ligne : https://kandaine.github.io/builds-tww3/**

Projet personnel et non commercial. Les cartes d'unités et portraits sont extraits du jeu et de ses
mods à des fins d'illustration.

| | |
|---|---|
| Factions | 32 |
| Seigneurs légendaires | 322 |
| Cartes d'unité affichées | 4 020 |
| Poids d'une page de faction, premier affichage | 448 Ko |
| Poids d'une fiche entièrement déroulée | 586 Ko |

> Les cartes se comptent en **nombre de lignes** — `1 + heroes + army` par seigneur — et non en
> quantités : sommer les `qty` donne 6 440, qui n'est pas le nombre de cartes affichées.
>
> Poids remesurés le 23/08/2026 sur le site en ligne, après la refonte graphique, sur
> `dwarfs.html?id=thorgrim` — 10 requêtes au premier affichage, 18 une fois la fiche déroulée.
> Répartition du premier affichage :
>
> | | |
> |---|---|
> | Bannière de faction | **357,7 Ko — 80 %** |
> | JavaScript | 54 Ko |
> | JSON de la faction | 32,7 Ko |
> | CSS | 24,2 Ko |
> | Blason + portrait | 11,2 Ko |
>
> **Le chiffre suit donc surtout la bannière**, dont le poids va de 69 à 1 246 Ko selon l'image
> (médiane 282 Ko) : Dwarfs est un peu au-dessus de la médiane, ni le meilleur ni le pire cas.
> Les 138 Ko qui séparent les deux totaux sont les 8 cartes d'unité chargées en différé.
>
> **Les polices n'apparaissent pas dans ce relevé** : elles étaient déjà en cache navigateur, et
> `transferSize` vaut alors 0. Leur coût réel est de **179,7 Ko** pour les 4 familles — mesuré à
> part, voir la section Validation.

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
index.html              page de recherche : les 322 seigneurs, filtre par faction et par texte
<faction>.html      x32 une page par faction (dwarfs.html, skaven.html…)
data/<faction>.json x32 LE CONTENU : seigneurs, lore, effets, build de 20 slots
js/core.js              catalogue des factions, bannières, chargement des données, utilitaires
js/units/<faction>.js x32 chemins des images d'unités, d'UNE faction
js/app.js               rendu d'une page de faction
js/search.js            rendu de la page de recherche
css/socle.css           tokens, reset, base — chargé par les 33 pages
css/fiches.css          les 32 thèmes de faction + la mise en page d'une fiche
css/accueil.css         la page de recherche, et elle seule
404.html                page d'erreur, servie par GitHub Pages sur toute adresse inconnue
sitemap.xml             les 33 pages, pour les moteurs de recherche
robots.txt              indexation autorisée (voir la limite ci-dessous)
assets/                 images : units/ (1 709 cartes), portraits/ (363),
                        banners/, et crests/<faction>/<id>.webp (322 blasons)
tools/                  scripts de validation (PowerShell), et les deux tables de référence
                        qu'ils lisent : unites-connues.txt et attributs-unites.txt
```

**Deux pièges sur ces trois fichiers**, tous deux invisibles en local :

- **`404.html` écrit ses chemins en absolu** (`/builds-tww3/css/socle.css`). GitHub Pages sert ce
  fichier pour n'importe quelle adresse inconnue, `/builds-tww3/une/adresse/profonde` comprise ; or
  le navigateur résout le relatif d'après l'adresse *demandée*, pas d'après celle du fichier servi.
  Un chemin relatif donnerait une page d'erreur sans style — exactement le cas qu'elle rattrape.
- **`robots.txt` n'est pas celui que les robots lisent.** Sur un site de projet, ils consultent
  `https://kandaine.github.io/robots.txt`, à la racine du domaine, qui appartient au compte et non
  à ce dépôt. Le fichier documente l'intention et servira le jour d'un domaine propre ; en
  attendant, c'est le sitemap déclaré dans la Search Console qui compte.

**Le CSS est en trois fichiers, et chaque page en charge deux.** `socle.css` ne contient **aucune
couleur** : les tokens de couleur sont apportés par le thème de la page — les blocs
`.theme-<faction>` de `fiches.css`, ou `body.search-theme` d'`accueil.css`. C'est ce qui permet au
même socle de servir deux mises en page très différentes.

La page d'accueil ne charge **pas** `fiches.css` : ni les 32 palettes de faction, ni la mise en page
en deux colonnes ne lui servent, soit 64 Ko qu'elle ne télécharge pas. À l'inverse, dupliquer les
tokens dans deux fichiers les aurait fait diverger sans qu'aucun signal ne le montre.

**Les 32 pages de faction sont GÉNÉRÉES — ne pas les éditer à la main.** Elles sortent toutes de
`tools/gabarit-faction.html`, reconstruites par :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\generer-coquilles.ps1
```

Le script relit les factions dans `FACTION_GROUPS` (`js/core.js`), donc ajouter une faction au site
ne demande rien de plus ici. La seule variation par faction est la note d'origine des factions
moddées, dans `tools/notes-factions.json`. Toute modification de coquille passe par le gabarit,
suivie d'une régénération ; le hook et la CI rejettent une coquille qui aurait dérivé.

Chacune charge les deux feuilles, déclare son identifiant, puis charge trois scripts — dans cet
ordre, qui compte : chaque fichier utilise le précédent, et `accueil.css` comme `fiches.css`
consomment les tokens de `socle.css`.

```html
<link rel="stylesheet" href="css/socle.css">
<link rel="stylesheet" href="css/fiches.css">

<script>const PAGE_FACTION = 'dwarfs';</script>
<script src="js/core.js"></script>
<script src="js/units/dwarfs.js"></script>
<script src="js/app.js"></script>
```

`index.html` suit le même schéma avec `css/accueil.css` et `js/search.js`, et sans module d'icônes —
la page de recherche n'affiche aucune carte d'unité.

`app.js` lit `PAGE_FACTION`, charge `data/dwarfs.json`, et rend la page. Toute la variabilité est
dans le JSON et le module d'icônes ; le code, lui, est commun.

**Pourquoi un module d'icônes par faction.** Ces 32 fichiers ne contiennent qu'une table
`clé → chemin d'image`. Ils étaient autrefois réunis en un registre unique de 343 Ko que *chaque*
page téléchargeait en entier, alors qu'une page n'affiche qu'une faction. Le découpage a ramené le
JavaScript d'une page de 353 Ko à 33 Ko ; il pèse **56,7 Ko** aujourd'hui — mesuré non compressé sur
`dwarfs.html` : `core.js` 26,6 Ko + `app.js` 25,1 Ko + `js/units/dwarfs.js` 5,1 Ko. La remontée vient
d'abord de la V2, qui a mis la recherche, le sélecteur de faction, la navigation entre seigneurs
voisins, la navigation au clavier et le panneau repliable dans les deux fichiers communs, puis de la
refonte graphique, qui y a ajouté le blason de faction et le bandeau d'échec de chargement. **Le
module d'icônes, lui, n'a jamais bougé** — c'est exactement ce que le découpage cherchait à obtenir.
Compressé, ce que transite réellement le réseau est de **54 Ko** (relevé sur le site en ligne).

---

## L'habillage « Old World »

Le site est habillé comme un **livre d'armée** : cuir tanné, gothique, petites capitales de presse,
et le blason que le jeu affiche pour chaque seigneur. Quatre choses valent d'être connues avant d'y
toucher.

**Le papier est commun aux 32 factions, seul le lavis change.** Le bloc `[class*="theme-"]` en fin
de `fiches.css` pose le cuir une seule fois ; l'identité de chaque faction passe par son
`--ornement`, qu'elle possède depuis la V2. Une faction n'a donc **rien** à déclarer pour être
habillée. Ce bloc gagne par sa **position** en fin de feuille, pas par son poids — le déplacer plus
haut casse tout.

**Les blasons sont dérivés, pas stockés.** `assets/crests/<faction>/<id>.webp`, calculé dans
`app.js` et `search.js` : aucun champ n'a été ajouté aux 322 fiches. **La faction fait partie du
chemin parce que l'identifiant seul n'est pas unique** — `amon` désigne deux seigneurs, l'un chez
les Hauts Elfes, l'autre chez Tzeentch.

**Le gothique ne va jamais sur un nombre.** Pirata One porte les noms ; ses chiffres sont
illisibles. La règle a été apprise trois fois : chiffres romains d'un ordre de bataille, quantités
d'unité (« ×1 » / « ×5 »), et le code de la page 404, qui se lisait « 484 ».

**Jamais d'accent grave dans un commentaire HTML de `app.js` ou `search.js`.** Ces commentaires
vivent à l'intérieur d'un *template literal* : un accent grave y referme la chaîne, et la suite du
texte devient du code. Citer un nom de classe entre accents graves a vidé une page deux fois.

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

Quatre scripts **bloquants** vérifient ce que ni le navigateur ni `git diff` ne signalent — clé
d'icône absente, fichier image manquant, total d'emplacements faux, fonction livrée sans
commentaire, coquille de faction qui a dérivé du gabarit :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-icones.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-commentaires.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools\generer-coquilles.ps1 -Verifier
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem data\*.json | ForEach-Object { & .\tools\validate_fiche.ps1 -Faction $_.BaseName }"
```

> `verifier-commentaires.ps1` contrôle qu'un commentaire **existe** au-dessus de chaque fonction et
> de chaque déclaration de premier niveau. Il ne peut pas contrôler qu'il est **vrai** — un
> commentaire laissé au-dessus de la mauvaise fonction lui paraît conforme. Il attrape l'oubli,
> jamais le mensonge.

Ces quatre-là sont lancés automatiquement par deux filets :

- un **hook `pre-commit`** qui bloque le commit en cas d'échec. À activer une fois par clone :
  ```bash
  git config core.hooksPath .githooks
  ```
  Il ne teste que les factions présentes dans le commit, et sort immédiatement si aucune fiche
  n'est touchée. Contournement ponctuel : `git commit --no-verify`.
- une **GitHub Action** qui rejoue la validation à chaque push sur `main`.

Trois autres sont **informatifs** : ils ne bloquent rien, ne tournent ni dans le hook ni dans la CI,
et se lancent à la main selon ce qu'on a touché. Chacun accepte `-Faction <nom>` pour se limiter à
un seul fichier de données.

**Si on touche aux effets ou au build d'une fiche :**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-effets.ps1
```

> Il confronte le champ `effects` au `build` et signale les unités **nommées dans les effets mais
> absentes de l'armée** — un bonus qui ne s'applique à rien. C'est le seul contrôle qui lit
> `effects`, et il a été écrit après avoir découvert que Malakai Makaisson annonçait « accès aux
> bâtiments du dirigeable Spirit of Grungni » depuis le premier commit du site sans jamais aligner
> le vaisseau.
>
> Il cherche dans `tools/unites-connues.txt`, **6 133 noms d'unités** relevés dans `local_en.pack`
> et `local_fr.pack` — les fiches mélangent les deux langues — ainsi que dans les 133 packs du
> workshop installés, dont 71 en apportent. **Ce fichier est dans le dépôt parce que la CI tourne
> sans installation du jeu** ; le régénérer après un DLC, la procédure est en tête du fichier.
>
> Il lit aussi le nombre annoncé par un régiment favori : le bonus n'est pas toujours de +1, huit
> seigneurs du site accordent « +2 capacité ».
>
> **Il ne bloque pas, et c'est voulu** : un effet peut nommer une unité pour la *déconseiller* —
> Thyk Skolsson subit « +100 % de coût pour les Longbeards », et c'est précisément pour cela qu'il
> n'en aligne pas. Une piste demande un regard, pas une correction. `-Strict` le fait sortir en 1
> pour un usage ponctuel ; c'est le seul des trois à l'avoir.

**Si on touche aux notes d'une fiche :**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-attributs.ps1
```

> Le seul contrôle qui confronte ce qu'une note **affirme** d'une unité à ce que le jeu lui donne :
> un monstre décrit comme volant qui ne vole pas, une Régénération que l'unité n'a pas. Il lit
> `tools/attributs-unites.txt` (4 423 unités), dans le dépôt pour la même raison que le précédent.
>
> **Attendez-vous à une majorité de faux positifs** — une note parle souvent d'une autre unité de la
> fiche. Et sa couverture s'arrête au jeu de base et aux packs installés : 265 lignes du site lui
> restent inconnues, son silence sur celles-là ne prouve rien.

**Si une note affirme une exclusivité** — « la seule cavalerie de la fiche », « le seul tir » :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-exclusivites.ps1
```

> Il confronte l'affirmation à la contrepartie du **même** régiment : l'unité de base alignée sous
> son Régiment de Renom, ou l'inverse. C'est le défaut le plus fréquent du site, et il a une cause
> datable — la passe sur les Régiments de Renom a placé le régiment à côté de sa base sans que la
> phrase soit relue.
>
> **Il ne tombera jamais à zéro** : une trentaine d'exclusivités sont légitimes parce qu'elles
> portent sur un effet, un roster ou le site entier, pas sur un rôle. Les laisser est le
> comportement correct ; son en-tête donne les quatre formes à reconnaître.

### Mesurer le poids des polices

Aucun script ne le fait : la mesure se prend au navigateur, et **`performance` ment**. Dès qu'une
iframe ou une navigation précédente a rempli le cache, `transferSize` tombe à zéro et deux pages
différentes rendent le même total — c'est arrivé, et ça m'a fait annoncer une régression qui
n'existait pas. La source fiable est `document.fonts`, qui donne `loaded` ou `unloaded` par fonte :

```js
const st = {};
document.fonts.forEach(f => { if (f.status === 'loaded') st[f.family] = 1; });
Object.keys(st);
```

Relevé le 23/08/2026 sur une page de faction : **4 familles, 5 fichiers, 179,7 Ko** — Cinzel 25,3,
EB Garamond 46,8 + 43,3 (italique), IM Fell English SC 55,6, Pirata One 8,7. Le navigateur ne
télécharge **que les fontes réellement affichées** : la page 404, qui n'utilise pas les petites
capitales, ne charge pas IM Fell English SC.

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
seigneur, prime sur celle de sa faction — 10 fiches), `build.krellNote` (unité invoquée en bataille
plutôt que recrutée — 1 fiche, le cas Kemmler & Krell).

Il a existé un champ `attributes`, un bloc de capacités passives détaillées, sur la seule fiche de
Vlad von Carstein. Il a été **supprimé à la V2** : aucune autre fiche n'en avait, et il rompait le
formatage commun. Ne pas le réintroduire.

**Deux champs à connaître pour ne pas s'y perdre :**

- `seal` désigne une icône SVG de secours. Le mécanisme a été retiré du chargement — les 322
  seigneurs ont tous un `portraitImage` — donc ce champ est **inerte**. Les SVG sont conservés dans
  `js/fallback-svg.js`, qu'aucune page ne charge.
- `wikiUrl` **n'est lu par aucun code**. C'est de la donnée de référence, pas un champ d'affichage :
  ne pas chercher où il apparaît, il n'apparaît nulle part. Le champ est présent sur les 322 fiches,
  mais **vide sur 49 d'entre elles** — renseigné sur 273. Il reste vide sur les seigneurs venus d'un
  mod, qui n'ont pas de page de wiki.

---

## Licence et contenu

Warhammer, Total War et les marques associées appartiennent à Games Workshop et Creative Assembly.
Ce site n'est affilié ni à l'un ni à l'autre, ne génère aucun revenu, et se limite à documenter des
compositions d'armée pour les joueurs francophones.
