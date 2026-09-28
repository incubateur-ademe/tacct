---
name: redaction-indicateurs
description: Propose des textes pour les indicateurs TACCT (titre, chiffre dynamique, « D'où vient ce chiffre ? », texte d'analyse) à partir du contexte, des données et des sources fournis, en se calant sur l'ensemble des indicateurs existants. Sert aussi à transposer un texte existant vers une autre thématique. Rédaction uniquement, livrée dans la conversation, pour relecture par l'experte métier.
disable-model-invocation: true
---

# Propositions de textes pour les indicateurs TACCT

## La règle qui prime sur toutes les autres : un texte JUSTE

Ces textes sont relus par l'experte métier de TACCT, qui est **très pointilleuse**. Aujourd'hui, elle les écrit entièrement elle-même, et ce travail est long. Tes propositions servent à lui faire gagner du temps : elle les reprendra, comme elle le fait toujours. **Une seule erreur de fond, un chiffre non sourcé ou une formulation approximative lui fait perdre plus de temps qu'elle n'en gagne.**

Concrètement :

- **Justesse avant tout.** Chaque phrase doit pouvoir se rattacher à la donnée ou à une source fournie ou validée. Si une affirmation n'est pas étayée, elle n'entre pas dans le texte.
- **Rien d'inventé, rien d'extrapolé.** N'ajoute ni chiffre, ni lien de cause à effet, ni tendance, ni généralisation absents des sources. En cas de doute, écris moins : une phrase en moins vaut mieux qu'une phrase fragile.
- **Aucune originalité.** Pas de nouvelle structure, de nouveau procédé ou de nouveau ton. Tu imites le corpus existant, qui est validé par l'experte.
- **Neutralité.** On part d'une donnée socio-économique ou environnementale. On parle de cette donnée et de ce qu'elle révèle du territoire, sans juger le territoire. Les formules d'appréciation présentes dans le corpus (« Bonne nouvelle : … », « Poursuivez vos efforts ! ») sont admises si elles sont pertinentes, c'est-à-dire seulement si un seuil réglementaire ou sourcé le justifie, et avec parcimonie.
- **Des propositions, pas un texte final.** Présente-les comme telles.

## Périmètre

- **Tu fais** : lire le corpus, lire les sources, proposer des sources de contexte, puis rédiger.
- **Tu ne fais pas** :
  - modifier le code ou un fichier du repo ;
  - chercher la source des données TACCT elles-mêmes, qui est fournie ;
  - utiliser une source de contexte non validée ;
  - choisir la thématique.

Tu livres **dans la conversation**, sans rien écrire dans le repo.

## Deux modes

- **Création** : nouvel indicateur.
- **Transposition** : un texte existant doit servir dans une autre thématique. La donnée est la même, mais le contexte change. Aucune règle écrite ne dit ce qui doit changer. Appuie-toi sur le contexte fourni et sur les indicateurs déjà présents dans plusieurs thématiques (voir `references/reperes-corpus.md`).

## Étapes obligatoires, dans cet ordre

### Étape 1 — Vérifier les entrées, sinon s'arrêter

Tu ne commences **pas** tant qu'il te manque l'un de ces éléments. S'il en manque, pose toutes tes questions en une fois, puis attends.

- La thématique, et la section où l'indicateur s'insère.
- Le contexte : pourquoi cet indicateur, pour quels utilisateurs.
- Les données exploitées : variables, unité, échelle(s), millésime ou période, calcul du chiffre affiché, cas particuliers (secret statistique, échelle supérieure, absence de donnée, outre-mer si c'est dans la donnée).
- Les graphes ou cartes, et ce qu'ils montrent.
- **Ce qu'on veut montrer** avec l'indicateur.
- Les sources de la donnée.
- Les blocs à rédiger : titre, chiffre dynamique, « D'où vient ce chiffre ? », texte d'analyse. S'ils ne sont pas précisés, demande.
- En transposition, en plus : le texte d'origine (nom du composant) et la thématique cible.

N'infère jamais une information manquante.

### Étape 2 — Lire l'intégralité du corpus, à chaque production

C'est une étape obligatoire, même si tu l'as déjà faite dans une autre session. Elle joue le rôle d'un calage fin sur le ton de l'experte. Lis **en entier** :

1. `src/lib/staticTexts.tsx` (textes d'analyse)
2. `src/lib/tooltipTexts.tsx` (« D'où vient ce chiffre ? »)
3. `src/lib/textesIndicateurs/*.tsx` (chiffres dynamiques)
4. Les chiffres dynamiques écrits dans les composants : `src/app/(main)/(parcours)/donnees/indicateurs/**/*.tsx`. Cherche `chiffreDynamiqueWrapper` et lis le texte qui suit.
5. `src/lib/definitions.tsx` (définitions au survol)
6. `src/app/(main)/(parcours)/donnees/thematiques/*/Donnees*.tsx` (introductions de thématique et titres H3)
7. `references/reperes-corpus.md` (repères mesurés et carte des fichiers)

Ensuite, identifie les **2 ou 3 indicateurs les plus proches** (même thématique, même type de donnée, même producteur, même type de dataviz). Ce sont tes modèles directs, et tu les cites dans le livrable.

### Étape 3 — Lire les sources et proposer des sources de contexte

1. Lis **toutes** les sources fournies.
2. Tu peux ouvrir de toi-même la **fiche data.gouv** de la donnée et ses **réutilisations**, pour voir comment d'autres acteurs présentent cette donnée (voir `references/recherche-sources.md`). Ne reprends jamais un chiffre d'une réutilisation sans validation.
3. Si le texte d'analyse a besoin d'un contexte en lien avec l'**adaptation au changement climatique**, tu peux chercher des sources candidates. Tu ne les utilises pas encore : tu les **listes**, puis tu **t'arrêtes** pour validation. Présente-les ainsi :

| # | Source (organisme, titre, date) | URL | Ce qu'elle apporterait | Lien avec l'adaptation |
|---|---|---|---|---|

Attends la validation, qui se fait au cas par cas. Seules les sources validées sont utilisées. Si tu n'as aucune source à proposer, dis-le et passe à l'étape 4.

### Étape 4 — Rédiger

- Pour chaque bloc demandé : **une proposition principale**, et si c'est utile **une ou deux variantes**. Une variante peut être plus courte ou mettre l'accent sur un autre aspect de ce qu'on veut montrer. Elle reste dans le style du corpus.
- Reprends la structure, les longueurs et les tournures des indicateurs modèles.
- Chiffre dynamique : couvre chaque échelle et chaque cas particulier indiqué dans les entrées. Écris les valeurs variables entre accolades : `{valeur}`, `{année}`.
- « D'où vient ce chiffre ? » : factuel et descriptif, tiré exclusivement des sources de la donnée.
- Texte d'analyse : il dit ce que la donnée révèle, en lien avec l'adaptation, et uniquement à partir des sources fournies ou validées.

### Étape 5 — Se relire phrase par phrase

Avant de livrer, reprends **chaque phrase** :

- [ ] Est-elle rattachée à une source fournie ou validée, ou à la donnée elle-même ? Si ce n'est pas le cas, supprime-la ou marque-la `[À VÉRIFIER]`.
- [ ] Le chiffre est-il repris exactement comme dans la source (valeur, unité, année, périmètre) ?
- [ ] Le texte reste-t-il neutre, sans jugement sur le territoire ?
- [ ] Est-il sans originalité, avec une structure et un ton qu'on retrouve dans le corpus ?
- [ ] La longueur est-elle comparable à celle des indicateurs modèles ?
- [ ] Chaque sigle et chaque terme technique est-il expliqué comme le fait le corpus ?
- [ ] La typographie suit-elle celle du corpus (espaces insécables, guillemets « », séparateur de milliers) ?

### Étape 6 — Livrer dans la conversation

Suis ce format, en texte clair et sans JSX :

```
## <Nom de l'indicateur> — <Thématique>

Indicateurs modèles : <2-3 noms>, et pourquoi

### Titre
Proposition : …
Variante : … (si utile)

### Chiffre dynamique
Cas général : …
<Échelle ou cas particulier> : …

### D'où vient ce chiffre ?
Proposition : …

### Texte d'analyse
Proposition : …
Variante : … (si utile)

### Traçabilité
| Phrase ou affirmation | Source (document, page ou passage) |

### Points à soumettre à l'experte
- incertitudes, choix de formulation, affirmations [À VÉRIFIER], éléments du contexte qui manquaient
```
