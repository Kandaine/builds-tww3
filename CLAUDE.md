# builds-tww3

Site personnel non commercial : catalogue en français de builds à 20 slots pour les seigneurs
légendaires de Total War: WARHAMMER III en Immortal Empires. HTML/CSS/JS statique, sans étape
de build — les pages se servent directement depuis le dossier.

**Le site est publié**, sur GitHub Pages, à https://kandaine.github.io/builds-tww3/ — chaque
push sur `main` le redéploie. Ce n'est donc pas un dossier personnel : ce qui part en ligne est
lu par des visiteurs. Deux conséquences pratiques, à ne pas oublier faute de quoi on
sous-estime l'enjeu de chaque modification :

- une erreur visible — image cassée, fiche fausse, total de slots erroné — n'est pas une gêne
  privée, elle est publique jusqu'au correctif suivant ;
- le poids des pages compte pour de vrai. Un visiteur sur mobile télécharge ce qu'on lui
  envoie ; « ça ne se sent pas en local » n'est pas un argument recevable.

Ma méthode de travail générale est dans `~/.claude/CLAUDE.md`. Ce fichier-ci ne porte que ce
qui est propre au site. Le détail du métier — analyser un mod, rédiger une fiche, extraire une
carte d'unité — vit dans le skill `.claude/skills/fiches-tww3/`, chargé seulement au besoin.

## Critères d'acceptation

Ceux de `~/.claude/CLAUDE.md` s'appliquent aussi. S'y ajoutent, selon ce qui est touché :

Toujours :
- Aucun ` M` sous `assets/` — sauf si j'ai explicitement demandé un remplacement d'image.

Si la modification touche aux fiches (`data/*.json`, `js/units/*.js`) :
- Chaque fiche totalise exactement 20 slots : 1 seigneur + somme des quantités de héros + somme des quantités d'unités.
- Toute clé d'icône d'une fiche est déclarée dans le module de **sa** faction, et le fichier image existe.
- Les deux scripts passent, sur les 32 factions et pas seulement celles qu'on croit avoir touchées :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-icones.ps1
```

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem data\*.json | ForEach-Object { & .\tools\validate_fiche.ps1 -Faction $_.BaseName }"
```

`-ExecutionPolicy Bypass` n'est pas décoratif : la stratégie d'exécution de cette machine est
`Undefined` à tous les niveaux, donc `Restricted` par défaut — sans ce paramètre, Windows refuse de
lancer les deux scripts et renvoie `UnauthorizedAccess`. Le paramètre ne vaut que pour le processus
lancé, il ne change rien à la configuration de la machine.

**Ces deux scripts sont désormais lancés automatiquement**, par deux filets complémentaires — ne
plus compter sur ma discipline pour les exécuter :

- un **hook `pre-commit`** (`.githooks/pre-commit`) qui bloque le commit si la validation échoue,
  en ne testant que les factions présentes dans le commit (~3 s ; sortie immédiate si le commit ne
  touche aucune fiche) ;
- une **GitHub Action** (`.github/workflows/validation.yml`) qui rejoue tout à chaque push sur
  `main`, et qu'on ne peut pas contourner.

Activer le hook, **une seule fois par clone** :

```bash
git config core.hooksPath .githooks
```

Contourner ponctuellement : `git commit --no-verify`. Légitime pour sauvegarder un travail
volontairement incomplet ; jamais pour passer outre une vraie erreur.

Si la modification touche au front (HTML / CSS / JS) :
- La console du navigateur est vierge sur un onglet neuf.
- Aucune carte d'unité sans image, aucune image cassée (`naturalWidth === 0`).
- Une page de faction ne charge que `js/core.js`, son `js/units/<faction>.js` et `js/app.js`.
- Un fichier JS modifié parse : une virgule manquante vide la page sans erreur visible dans `git diff`.

## Le code livré est commenté — critère bloquant

Ce site n'a pas d'équipe. Ce qui n'est pas écrit dans le fichier est perdu : ni toi ni moi ne
nous souviendrons dans six mois pourquoi une variable existe ou pourquoi une valeur vaut `.8`
et pas `.45`. **Une fonctionnalité livrée sans commentaire n'est pas livrée.**

À vérifier avant de me dire qu'une tâche est finie :

- **Toute fonction a un commentaire au-dessus d'elle**, qui dit ce qu'elle fait ET ce que ses
  paramètres signifient. Aucune exception, y compris pour les fonctions de trois lignes.
- **Toute décision non évidente porte son POURQUOI**, pas seulement son quoi. « `replaceState`
  et non `pushState` » sans la raison ne sert à rien ; avec la raison, personne ne la
  réintroduira par erreur.
- **Tout chiffre écrit dans un commentaire a été mesuré**, et le commentaire dit comment. Un
  chiffre non mesuré est une valeur inventée, ce qui est interdit partout ailleurs sur ce
  projet et ne devient pas acceptable parce que c'est « juste un commentaire ».
- **Un piège rencontré est consigné à l'endroit où on retombera dedans**, pas dans le message
  de commit que personne ne relit.
- **Les nouveaux sélecteurs CSS** suivent la même règle que les fonctions.

Les trois premiers points sont vérifiés mécaniquement, sur tout le JavaScript écrit à la main
et sur les 32 modules d'icônes :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\verifier-commentaires.ps1
```

Il tourne dans le hook `pre-commit` dès qu'un `js/**.js` est touché — périmètre plus large que
celui des fiches, parce que modifier `js/app.js` ne peut pas casser un total de slots mais peut
très bien y laisser une fonction non documentée — et dans la GitHub Action, en premier.

**La présence d'un commentaire ne prouve rien — c'est sa justesse qui compte, et aucun script
ne sait la vérifier.** Le 17/08/2026, en insérant des fonctions dans `js/core.js`, j'ai laissé
le commentaire de `matchesSearch` au-dessus de `nomsDUnites` : il décrivait la mauvaise fonction
*et* l'ancien comportement. `verifier-commentaires.ps1` l'aurait déclaré conforme — la fonction
avait bien un commentaire au-dessus d'elle. Après tout déplacement ou insertion de fonction,
relire ce qui se trouve juste au-dessus de chacune reste un geste humain.

Si la modification touche aux images :
- Bannières : 1840 px de large au maximum, jamais d'agrandissement.
- Cartes et portraits : dimensions **inchangées** — ils sont déjà affichés agrandis.
- Après une passe sans perte, les empreintes de pixels doivent être identiques avant/après.

## Chiffres de référence

Relevés le 16/08/2026 à la clôture de la V1. Un écart n'est pas forcément une erreur, mais il
doit être expliqué, jamais ignoré :

| Mesure | Valeur |
|---|---|
| Factions | 32 |
| Seigneurs légendaires | 321 |
| Cartes d'unité affichées, toutes fiches confondues | 3905 |
| Cartes sans image / images cassées | 0 |
| Poids JS d'une page de faction | ~33 Ko |
