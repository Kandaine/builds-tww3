---
name: fiches-tww3
description: Workflow complet pour le site builds-tww3 — créer une fiche de seigneur légendaire à partir d'un mod Steam Workshop de Total War WARHAMMER III, ou modifier une fiche existante (ajouter un héros ou une unité, corriger une erreur, rééquilibrer les 20 slots). À utiliser dès que le user parle d'un mod TWW3, envoie un chemin workshop\content\1142710\, colle des captures de l'écran Lord Details, demande d'ajouter un seigneur ou un héros au site, signale qu'une unité ou un effet est faux sur une fiche, ou évoque data/*.json, js/data.js, un régiment de renom, un plafond d'unité ou une carte d'unité à extraire — même s'il ne nomme pas explicitement le site.
---

# Fiches builds-tww3

Site personnel, local, non commercial : catalogue en français de builds à 20 slots pour les
seigneurs légendaires de TWW3 en Immortal Empires. Dépôt `C:\Users\Utilisateur\Projets\builds-tww3`
(GitHub `Kandaine/builds-tww3`). HTML/CSS/JS statique, sans build.

Deux parcours. Lire d'abord les invariants, ils valent pour les deux.

---

## Invariants

Ces règles viennent toutes d'erreurs réelles corrigées par le user. Elles coûtent peu à respecter
et cher à violer.

**Ne jamais inventer un nom d'unité ou de héros.** Si la loc du mod est muette, épuiser l'échelle
de repli (voir `references/analyse-pack.md`), consulter le **wiki officiel** — le user l'a
autorisé — puis **demander au user** le nom affiché en jeu. Un nom plausible par analogie n'est pas
un nom confirmé.

**Ne jamais substituer une image approchante.** Si la carte manque, l'extraire, ou utiliser le
portrait officiel du même personnage. Jamais la carte d'un homonyme : le « Master Engineer » n'est
pas l'« Engineer ».

**Chercher d'abord sur le site.** Le site couvre plus de mille clés et beaucoup d'unités sont
partagées entre races et entre mods. Avant toute extraction, chercher le nom **et** la clé dans
`js/data.js` et `data/*.json`. Deux fois de suite j'ai extrait un doublon en croyant à une absence.

**Ne jamais écraser un PNG existant.** Après extraction, `git status --short` doit montrer `??` et
jamais ` M` sur un fichier d'`assets/`. Si un ` M` apparaît : `git checkout -- <fichier>` et
signaler.

**La priorité absolue va à ce que le user voit en jeu.** Les tables du pack sont un indice, pas une
preuve. Quand le user dit qu'une unité ou un héros n'existe pas, ou porte un autre nom, il a raison
et la fiche change. On peut lui exposer ce que disent les tables — jamais pour lui opposer, toujours
pour l'aider à vérifier.

**Un seigneur légendaire n'est jamais placé en héros de build.**

**Exactement 20 slots** : 1 seigneur + Σ qty des héros + Σ qty du corps d'armée. Une unité invoquée
par une capacité ne consomme aucun slot — la mentionner dans la note, pas dans la liste.

**Respecter les plafonds** : capacités de héros annoncées dans les effets de faction, et plafonds
d'unité partagés entre variantes (voir `references/analyse-pack.md`).

**Les effets doivent correspondre exactement aux captures du user.** Traduire, ne pas réinterpréter,
ne pas arrondir, ne pas omettre les malus.

**Ne jamais commiter ni pousser sans feu vert explicite.** Le user dit « oui go » ou équivalent.

---

## Parcours A — nouvelle fiche depuis un mod

Le user envoie un chemin `C:\Program Files (x86)\Steam\steamapps\workshop\content\1142710\<id>\`
et, généralement, des captures de l'onglet Lord Details.

**1. Inventorier.** Lister le pack, repérer les seigneurs jouables, présenter au user un inventaire
bref : qui est jouable en Immortal Empires, qui est déjà sur le site, qui est laissé de côté.
Attention : `frontend_faction_leaders_tables` ne suffit pas à trancher Immortal Empires contre
Vieux Monde — j'ai classé trois factions à tort. L'écran de sélection du user fait foi.

**2. Demander les captures** si elles manquent. Sans elles, pas de bloc d'effets.

**3. Analyser le roster.** Voir `references/analyse-pack.md` : quelles tables lire, dans quel ordre,
et comment résoudre les noms. C'est l'étape la plus longue et la plus rentable — un build bâti sur
un roster mal lu est faux de bout en bout.

**4. Concevoir le build.** Partir des effets du seigneur, pas du roster : quelle unité bénéficie
réellement du bonus ? Un effet qui ne vise que l'infanterie de mêlée rend chaque cavalier aligné
plus coûteux qu'il n'en a l'air. Chercher la mécanique centrale et la faire porter la fiche.

**5. Extraire les images** via le sous-agent `tww-assets` (extraction et enregistrement seulement,
jamais de rédaction ni de commit). Toujours recouper son rapport : nombre de clés, existence des
fichiers, `git status`.

**6. Rédiger la fiche.** Format et conventions dans `references/format-fiche.md`.

**7. Valider et vérifier.** Voir « Vérification » ci-dessous.

**8. Demander le feu vert**, commiter avec un message `-F`, mettre à jour la mémoire.

---

## Parcours B — modifier une fiche existante

Ajouter un héros ou une unité venue d'un mod, corriger une erreur signalée, rééquilibrer.

**1. Chercher avant d'extraire.** L'unité est peut-être déjà sur le site sous une autre clé.

**2. Choisir la fiche.** Quand un héros est disponible pour beaucoup de factions, le placer **une
seule fois**, là où le lore et le build le justifient le mieux. Si le mod désigne lui-même une
faction — personnage de départ, faction prioritaire, bâtiment de déblocage thématique — suivre cette
indication plutôt qu'un choix arbitraire, et l'écrire dans la note.

**3. Libérer le slot sur une unité doublée**, jamais sur une pièce unique : passer un `qty: 2` à 1
plutôt que supprimer un régiment de renom. Le total doit rester à 20.

**4. Ajuster les textes qui deviennent faux.** Une modification de build invalide souvent le
paragraphe `magic` ou la note de fin. Les relire, pas seulement le tableau d'unités.

**5. Valider, vérifier, demander le feu vert.**

---

## Vérification

Trois contrôles, dans cet ordre. Aucun ne remplace les autres.

```bash
powershell -File "C:\Users\Utilisateur\.claude\tools\tww\validate_fiche.ps1" -Faction ogre-kingdoms
```

Recalcule les 20 slots et vérifie que chaque clé d'icône est enregistrée et que son PNG existe.
Il lit `js/data.js` comme du texte : **il ne détecte pas une erreur de syntaxe JavaScript.**

**Toujours sans `-Id`.** L'option existe pour un contrôle ponctuel, pas pour valider un lot : une
correction de quantité peut avoir dérapé sur d'autres seigneurs du même fichier (voir
`references/format-fiche.md`, « Corriger une quantité : jamais par `Replace()` global »). En fin de
lot, boucler sur tous les fichiers du site, pas seulement ceux qu'on croit avoir touchés :

```bash
powershell -Command "Get-ChildItem 'C:\Users\Utilisateur\Projets\builds-tww3\data\*.json' | ForEach-Object { & 'C:\Users\Utilisateur\.claude\tools\tww\validate_fiche.ps1' -Faction $_.BaseName }"
```

Ensuite le navigateur, via `preview_start` (nom `codex-static-server`, port 5173) puis
`ogre_kingdoms.html?id=<lordId>` — noter que les pages HTML utilisent des **underscores**
(`ogre_kingdoms.html`) alors que les JSON utilisent des **tirets** (`ogre-kingdoms.json`).

```js
(async()=>{
  const t = await (await fetch('/js/data.js')).text();
  let err = null; try { new Function(t) } catch(e) { err = e.message }
  [...document.images].forEach(i => i.loading = 'eager');
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r => setTimeout(r, 2200));
  const imgs = [...document.images];
  return JSON.stringify({
    dataJsError: err,
    total: imgs.length,
    broken: imgs.filter(i => i.naturalWidth === 0).map(i => i.src)
  });
})()
```

Le contrôle `dataJsError` n'est pas optionnel : une virgule manquante dans `unitImages` vide
**toutes** les pages du site, et ni le validateur ni `git diff` ne le montrent. Les images sont en
`loading="lazy"` — sans forcer `eager` et sans scroller, `naturalWidth === 0` donne des faux
positifs.

Enfin : supprimer les images extraites qui ne finissent dans aucune fiche, ainsi que leur clé.
Sinon le dépôt accumule des assets morts.

---

## Outils

`C:\Users\Utilisateur\.claude\tools\tww\` — six scripts PowerShell, tous paramétrés :

| Script | Usage |
|---|---|
| `list_pack.ps1 -PackPath [-Match <regex>]` | lister les chemins internes d'un pack |
| `dump_db.ps1 -PackPath -Like <motif> -Out <fichier>` | extraire les tables `db\` (toujours `-Out` puis grep) |
| `dump_loc.ps1 -PackPath [-LocLike] [-Cjk] -Out` | extraire les `.loc` ; `-Cjk` pour les mods chinois/coréens |
| `extract_card.ps1 -PackPath -Src -Name [-DestSub portraits]` | extraire une carte en 60×130 |
| `validate_fiche.ps1 -Faction <nom> [-Id <id>]` | recalculer slots et icônes |
| `scan_packs.ps1 -Match <regex>` | balayer les ~133 packs workshop en une minute, pour les cas de double provenance |

Le sous-agent **`tww-assets`** (Sonnet) fait l'extraction en lot et l'enregistrement dans
`js/data.js`. Lui donner les chemins internes exacts et les clés voulues. Il lui est interdit de
rédiger, de commiter, ou de substituer une image.

PowerShell 5.1 lit l'UTF-8 sans BOM comme de l'ANSI : pour écrire du JSON ou du JS, utiliser
`[System.IO.File]::ReadAllText` / `WriteAllText`.

Le chemin d'image **déclaré dans `js/data.js` fait foi** : ne jamais déduire
`assets/units/<clé>.png`. Des héros vivent dans `assets/portraits/`, et une clé peut pointer vers un
nom de fichier différent.

---

## Références

- `references/analyse-pack.md` — quelles tables du pack répondent à quelle question, l'échelle de
  résolution des noms, les pièges de classification. À lire avant toute analyse de mod.
- `references/format-fiche.md` — structure JSON d'une fiche, sceaux, conventions de rédaction.
  À lire avant de rédiger ou de modifier une fiche.
