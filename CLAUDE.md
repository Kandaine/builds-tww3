# builds-tww3

Site personnel, local, non commercial : catalogue en français de builds à 20 slots pour les
seigneurs légendaires de Total War: WARHAMMER III en Immortal Empires. HTML/CSS/JS statique,
sans étape de build — les pages se servent directement depuis le dossier.

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
powershell -File tools\verifier-icones.ps1
Get-ChildItem data\*.json | ForEach-Object { & "C:\Users\Utilisateur\.claude\tools\tww\validate_fiche.ps1" -Faction $_.BaseName }
```

Si la modification touche au front (HTML / CSS / JS) :
- La console du navigateur est vierge sur un onglet neuf.
- Aucune carte d'unité sans image, aucune image cassée (`naturalWidth === 0`).
- Une page de faction ne charge que `js/core.js`, son `js/units/<faction>.js` et `js/app.js`.
- Un fichier JS modifié parse : une virgule manquante vide la page sans erreur visible dans `git diff`.

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
