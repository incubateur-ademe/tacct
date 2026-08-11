# Audit RGAA 4.1.2 — TACCT — Re-audit complet du 11 août 2026

**Référentiel :** RGAA 4.1.2 — 106 critères
**Méthode :** audit statique exhaustif du code source (`src/`, `content/`) à l'état du commit `d7c4677d`
**Audit précédent :** [audit-rgaa-2026-04-28.md](audit-rgaa-2026-04-28.md) — 91 % sur le périmètre `(parcours)`
**Objectif :** déterminer si le niveau atteint en avril/mai 2026 est toujours tenu, avant passage officiel en « partiellement conforme ».

> ⚠️ **Nature de cet audit.** Il s'agit d'un audit **statique du code**. Il identifie de façon fiable les non-conformités structurelles (balisage, ARIA, alternatives, contrastes déclarés, ordre DOM). Il ne remplace pas les tests manuels obligatoires pour une déclaration officielle : restitution réelle sous NVDA/JAWS/VoiceOver, zoom 200 %, reflow 320 px, comportement runtime du JS DSFR. La liste de ces tests figure en [§7](#7--tests-manuels-restant-à-réaliser).

---

## 1. Périmètre

### 1.1 Ce qui a changé depuis l'audit précédent

L'audit d'avril/mai portait sur **`src/app/(main)/(parcours)`** uniquement (11 pages). Depuis :

- **50 commits**, **342 fichiers** modifiés sous `src/`
- Ajout de **l'espace connecté** : `/mon-compte`, `/mon-espace`, authentification ProConnect / MonCompteAdeme, menu compte dans le header, toast de connexion
- Ajout de la **navigation mobile** (`MenuMobileDrawer`) et refonte responsive de l'ensemble des composants
- Nouveaux indicateurs : `eau/2-PrelevementsEnEau`, `sante/2-Arbovirose`, `agriculture/5-AiresApellationsControlees`, `biodiversite/6-AOT40`
- Suppression de la thématique `foret` (résout le point n° 8 du Top 12 : placeholders `TEST` / `COUCOU`)
- Suppression de `SelectTypeTerritoire` (résout la NC résiduelle 11.1.1 / 11.1.3)
- Nouveau `BarreDeRechercheSansFiltre`
- Proxy de l'application legacy sous **`/workspace-tacct`**

### 1.2 Périmètre retenu pour ce re-audit

**Site public `www.tacct.ademe.fr`** — l'échantillon couvre l'intégralité des gabarits :

| # | Page | Gabarit |
| --- | --- | --- |
| 1 | `/` | Accueil |
| 2 | `/recherche-territoire` | Recherche |
| 3 | `/thematiques` | Roue D3 |
| 4 | `/donnees` | Parcours + menu latéral + dataviz + cartes |
| 5 | `/impacts` | Parcours étape 2 |
| 6 | `/recherche-territoire-patch4` | Recherche |
| 7 | `/patch4c` | Patch 4 °C (onglets, accordéons, tableau) |
| 8 | `/ressources` | Boîte à outils (filtres, carrousels) |
| 9 | `/ressources/[collection]` | Collection |
| 10 | `/ressources/[collection]/[article]` | Article Notion (sommaire, tableaux, images zoomables) |
| 11 | `/ressources/faq` | FAQ (accordéons) |
| 12 | `/mon-compte` | **Connexion — nouveau** |
| 13 | `/mon-espace` | **Espace connecté — nouveau** |
| 14 | `/plan-du-site` | Plan du site |
| 15 | `/accessibilite` | Déclaration |
| 16 | `/mentions-legales`, `/politique-de-confidentialite`, `/politique-des-cookies` | Pages légales |
| 17 | `/statistiques` | Iframe Metabase |
| 18 | `/budget` | MDX |

### 1.3 ⚠️ Point de périmètre bloquant : `/workspace-tacct`

`next.config.mjs` (l. 182-190) **reverse-proxy l'application legacy** (outil de saisie) sous `https://www.tacct.ademe.fr/workspace-tacct/*`, et `AncienEspaceCard.tsx:32` y envoie l'utilisateur connecté.

**Conséquence juridique :** ces pages sont servies sous le domaine couvert par la déclaration d'accessibilité. Elles font donc partie du périmètre déclaré, sauf mention explicite contraire. Elles **n'ont jamais été auditées**.

Trois options, à arbitrer **avant** publication de la déclaration :

1. Auditer `/workspace-tacct` (charge importante — application Symfony distincte) ;
2. L'exclure explicitement dans la section « Contenus non soumis à l'obligation d'accessibilité » / « Non-conformités » de la déclaration, en le nommant ;
3. Le déclarer comme périmètre séparé avec sa propre déclaration.

Ne rien faire expose à une déclaration inexacte. **Le taux ci-dessous ne couvre pas `/workspace-tacct`.**

---

## 2. Synthèse

| | Nombre |
| --- | --- |
| Critères **conformes** | **48** |
| Critères **non conformes** | **26** |
| Critères **non applicables** | **32** |
| **Total** | **106** |

**Taux de conformité RGAA = 48 / (48 + 26) = 64,9 %**

> **Pourquoi la chute par rapport aux 91 % d'avril ?**
> Les 91 % portaient sur les seules pages `(parcours)`. L'élargissement du périmètre à l'ensemble du site (accueil, boîte à outils, articles Notion, pages légales, espace connecté) fait entrer dans le calcul des zones jamais auditées. **Sur le seul périmètre `(parcours)`, la quasi-totalité des corrections de mai tient toujours** — voir §4.

### 2.1 Répartition par thème

| Thème | C | NC | N/A |
| --- | --- | --- | --- |
| 1 — Images | 2 | 5 | 2 |
| 2 — Cadres | 2 | 0 | 0 |
| 3 — Couleurs | 1 | 2 | 0 |
| 4 — Multimédia | 0 | 0 | 13 |
| 5 — Tableaux | 1 | 3 | 4 |
| 6 — Liens | 2 | 0 | 0 |
| 7 — Scripts | 1 | 3 | 1 |
| 8 — Éléments obligatoires | 6 | 2 | 2 |
| 9 — Structuration | 2 | 1 | 1 |
| 10 — Présentation | 8 | 5 | 1 |
| 11 — Formulaires | 7 | 1 | 5 |
| 12 — Navigation | 5 | 4 | 2 |
| 13 — Consultation | 11 | 0 | 1 |
| **Total** | **48** | **26** | **32** |

---

## 3. Non-conformités — détail

Classées par impact utilisateur.

### 3.1 Impact **majeur**

#### NC-01 — Menu de navigation principal inaccessible sous 768 px (critères 12.1, 12.2)

`src/components/ui/Header.tsx:265` masque inconditionnellement le bouton burger DSFR :

```js
'.fr-header__navbar': { display: 'none' }
```

`src/components/ui/Header.module.scss:1` ne rend `.fr-modal` (qui contient `<nav class="fr-nav">`) visible qu'à partir de `min-width: 768px`. En dessous de 768 px, le menu principal n'est **ni affiché, ni ouvrable** — la navigation principale disparaît complètement sur mobile.

- **12.1** — il ne reste alors qu'un seul système de navigation (le plan du site via le footer), au lieu des deux exigés.
- **12.2** — le menu n'est pas « à la même place » sur toutes les pages/résolutions.

`MenuMobileDrawer` ne compense pas : il n'existe que sur `/donnees` et `/impacts`, et c'est un sommaire de page, pas le menu principal.

#### NC-02 — Menu compte : pattern ARIA `menu` non implémenté (critères 7.1, 7.3)

`src/components/ui/HeaderMonCompteMenu.tsx:59` — `role="menu"` + `role="menuitem"` sans aucun des comportements requis par le pattern ARIA correspondant :

- pas de navigation aux flèches ↑/↓, Home/End ;
- pas de fermeture par Échap ;
- pas de déplacement du focus dans le menu à l'ouverture, ni de restauration à la fermeture ;
- pas d'`aria-controls` reliant le bouton au menu ;
- conteneur `role="menu"` sans `aria-label`.

Annoncer `role="menu"` sans le clavier associé est plus pénalisant que de ne rien annoncer.

#### NC-03 — Descriptions détaillées des cartes (critères 1.6, 1.7)

Inchangé depuis avril. 5 indicateurs alimentés par flux de tuiles/API externes ne proposent **aucune donnée exportable** — seul un export PNG, inexploitable par lecteur d'écran :

- `donnees/indicateurs/amenagement/2-LCZ.tsx`
- `donnees/indicateurs/confortThermique/6-LCZ.tsx`
- `donnees/indicateurs/gestionDesRisques/3-ErosionCotiere.tsx`
- `donnees/indicateurs/gestionDesRisques/5-Debroussaillement.tsx`
- `donnees/indicateurs/sante/1-o3.tsx`

(`foret/2-LineaireDeHaie`, 6ᵉ cas de l'audit précédent, a été supprimé.)

La roue systémique D3 (`thematiques/components/roue.tsx`) reste en description partielle.

#### NC-04 — Contenu visible / compréhensible sans CSS (critères 10.2, 10.3)

Inchangé. NC acceptée en avril, justification toujours valable (SPA React fortement CSS-dépendante). À reporter telle quelle dans la déclaration.

### 3.2 Impact **moyen**

#### NC-05 — Contraste de texte insuffisant (critère 3.2)

`--gris-medium-dark: #7b7b7b` = **4,34:1** sur fond blanc, sous le seuil de 4,5:1. En avril ce token n'était présent que dans un garde-fou jamais rendu ; il est désormais utilisé dans du texte visible :

| Fichier | Ligne | Usage |
| --- | --- | --- |
| `components/searchbar/renderOptionSansFiltre.tsx` | 31 | libellé des suggestions de territoire |
| `components/searchbar/header/HeaderRechercheTerritoire.tsx` | 82 | couleur du `placeholder` |
| `components/searchbar/BarreDeRecherche.tsx` | 134, 159 | couleur du `placeholder` |
| `components/charts/ressourcesEau/prelevementEauBarChart.tsx` | 163 | libellé de la case à cocher |
| `components/charts/ressourcesEau/prelevementEauProgressBar.tsx` | 165 | idem |
| `components/charts/ressourcesEau/prelevementEauProgressBarPNR.tsx` | 172 | idem |
| `app/(main)/(parcours)/impacts/impacts.module.scss` | 221 | texte |
| `app/(main)/(parcours)/impacts/components/ThematiquesLieesNavigation.tsx` | 260 | texte |
| `app/iframe/impacts/components/ThematiquesLieesNavigation.tsx` | 199 | texte |

#### NC-06 — Tableaux des articles Notion sans en-têtes (critères 5.4, 5.6, 5.7)

`src/lib/ressources/transformationContenuArticles.tsx:193-222` — les blocs `table` de Notion sont rendus avec **toutes les cellules en `<td>`**, aucun `<th>`, aucun `scope`, aucun `<caption>`. La première ligne est distinguée uniquement par `fontWeight: 'bold'` et un fond gris.

Les propriétés Notion `has_column_header` / `has_row_header` sont disponibles sur le bloc mais ignorées.

> Le tableau de `blocConseils.tsx` (parcours + iframe) reste correct : `<caption class="fr-sr-only">`, `<thead>`/`<tbody>`, `<th scope>`.

#### NC-07 — Focus non visible sur deux champs de recherche (critère 10.7)

| Fichier | Ligne | Détail |
| --- | --- | --- |
| `components/searchbar/header/HeaderRechercheTerritoire.tsx` | 79 | `'&:focus': { outline: 'none' }` — NC déjà identifiée en avril, non corrigée |
| `components/searchbar/BarreDeRechercheSansFiltre.tsx` | 133 | `outline: 'none'` sur l'`<input>`, **sans aucune alternative** — nouvelle NC |

Les boutons du design system (`Boutons.tsx:308, 362`) sont conformes : `outline: none` y est compensé par `border` + `box-shadow` sur `:focus-visible`.

#### NC-08 — Tiroir de navigation mobile toujours dans le DOM (critères 10.8, 12.8)

`components/ui/MenuMobileDrawer.tsx:148` — le `<div role="dialog" aria-modal="true">` est **rendu en permanence**, masqué uniquement par `transform: translateY(100%)` (`components.module.scss:511-532`).

Conséquences sur `/donnees` et `/impacts` en dessous de 900 px :
- **10.8** : le contenu masqué reste dans l'arbre d'accessibilité ;
- **12.8** : tous les boutons du tiroir restent atteignables au clavier alors qu'ils sont hors écran ;
- un `role="dialog" aria-modal="true"` est exposé en permanence, y compris fermé.

De plus, à l'ouverture : pas de déplacement du focus, pas de piège de focus, pas de fermeture par Échap — alors que `aria-modal="true"` le promet.

#### NC-09 — Composants riches non restitués aux technologies d'assistance (critère 7.1)

| Composant | Fichier | Problème |
| --- | --- | --- |
| Sous-onglets de graphiques | `components/ui/SubTabs.tsx:129-147` | L'onglet sélectionné n'est distingué que par le style du bouton (primaire/secondaire). Aucun `aria-pressed`, `aria-current` ni `role="tab"`. Utilisé sur ~10 indicateurs. |
| Modale de filtres | `app/(main)/ressources/blocs/FiltresRessources.tsx:155` (+ jumeau iframe) | `<div>` sans `role="dialog"`, sans `aria-modal`, sans `aria-label`, sans piège de focus, sans fermeture par Échap, sans restauration du focus. |
| Zoom d'image d'article | `components/utils/ZoomOnClick.tsx:13, 17` | `<div onClick>` non focusable et sans rôle : la fonction de zoom est **inaccessible au clavier** ; l'overlay ouvert n'a ni rôle ni fermeture clavier. Utilisé par `transformationContenuArticles.tsx:105` sur toutes les images d'articles. |
| Effacement du champ de recherche | `components/searchbar/renderInputHeader.tsx:31`, `components/searchbar/renderInput.tsx:22` | `<div onClick>` non focusable : la croix d'effacement n'est pas activable au clavier. |

#### NC-10 — Contrôle au clavier (critère 7.3)

Corollaire de NC-09 : zoom d'image, croix d'effacement et fermeture des modales ne sont pas opérables au clavier.

#### NC-11 — Lien dans une infobulle non atteignable au clavier (critère 12.11)

Le pattern « lien `fr-sr-only` adjacent » mis en place en mai couvre 5 infobulles (`2-TypesDeCultures`, `5-AiresApellationsControlees`, `amenagement/2-LCZ`, `confortThermique/6-LCZ`, `sante/1-o3`).

**Il en manque une** : `lib/tooltipTexts.tsx:231` (`debroussaillementTooltipText`, lien « notice d'utilisation du zonage informatif des OLD »), utilisée par `donnees/indicateurs/gestionDesRisques/5-Debroussaillement.tsx:42` sans lien sr-only correspondant.

#### NC-12 — Alternatives d'images non pertinentes (critères 1.2, 1.3)

Images décoratives portant une alternative textuelle parasite :

| Fichier | Ligne | `alt` |
| --- | --- | --- |
| `app/(main)/homeCard.tsx` | 19 | `"image-cartographie"` (idem `(home)/homeCard.tsx`, `iframe/(home)/homeCard.tsx`) |
| `components/charts/MicroDataviz.tsx` | 311 | `"Cube représentant une valeur"` |
| `components/charts/ressourcesEau/prelevementEauProgressBar*.tsx` | — | `"Goutte d'eau"` |
| `app/(main)/ressources/blocs/FiltresRessources.tsx` | 83 | `"Icône réinitialiser"` (redondant avec le texte adjacent, + jumeau iframe) |
| `app/(main)/(parcours)/patch4c/components/analyseSensibilite.tsx` | — | `"illustration chat chercheur"` (+ jumeau iframe) |

`"image-cartographie"` est en outre non pertinente au sens de 1.3 (chaîne technique, non descriptive).

#### NC-13 — `role="img"` sans nom accessible (critère 1.1)

`components/charts/MicroDataviz.tsx:407` — `MicroRemplissageTerritoire` expose `role='img'` et met `aria-label` à `undefined` quand la prop `ariaLabel` n'est pas fournie. Le pourcentage affiché à l'intérieur n'est alors plus exposé (les enfants d'un `role="img"` sont ignorés) : **aucun nom accessible**.

Deux appels concernés :
- `donnees/indicateurs/agriculture/3-SuperficiesIrriguees.tsx:75`
- `donnees/indicateurs/biodiversite/1-TypesDeSols.tsx:107`

(`donnees/indicateurs/biodiversite/6-AOT40.tsx:97` appelle `MicroNumberCircle` sans `ariaLabel` — moins grave, la valeur reste en texte visible, mais l'`aria-label` posé sur un `<div>` sans rôle est ignoré.)

#### NC-14 — Titres de page (critère 8.6)

| Page | Titre actuel | Problème |
| --- | --- | --- |
| `/mon-compte` | `TACCT - Réussir la démarche d'adaptation de votre territoire` | Aucun `metadata` sur `mon-compte/page.tsx` → hérite du titre par défaut, identique à celui de l'accueil |
| `/ressources` | `Ressources` | Ne correspond pas à l'intitulé de la page ni du lien de navigation (« Boîte à outils ») |

#### NC-15 — Hiérarchie des titres (critère 9.1)

| Page | Problème |
| --- | --- |
| `/mon-compte` | **Aucun `<h1>`**. La page démarre sur deux `<H2>` (`MonCompteClient.tsx:85, 109`). |
| `/mon-espace` | Le `<h1>` est le **prénom de l'utilisateur** (`ProfilCard.tsx:27`, ex. « Antoine C. »). Ne décrit pas le contenu principal de la page. |

#### NC-16 — Validité du code (critère 8.2)

| Fichier | Problème |
| --- | --- |
| `content/accessibilite.mdx` (bloc `<address>`) | `<p>` imbriqué dans un `<span>` — imbrication invalide |
| MUI / Emotion | `<style data-emotion>` injecté dans `<body>` — NC résiduelle tierce, déjà actée en avril |
| `components/charts/ressourcesEau/prelevementEauBarChart.tsx:155`, `prelevementEauProgressBar.tsx:152`, `prelevementEauProgressBarPNR.tsx:159` | Trois `<input id="filter-energie">` identiques : risque d'`id` dupliqué si deux de ces graphiques sont rendus simultanément (à confirmer selon la combinaison d'onglets) |

#### NC-17 — Intitulé de bouton (critère 11.9)

`components/ui/HeaderMonCompteMenu.tsx:95-124` — le bouton de connexion affiche « Se connecter » mais porte `aria-label="Mon compte"`. Le nom accessible ne contient pas le texte visible : la commande vocale « cliquer sur Se connecter » échoue (WCAG 2.5.3 *Label in Name*).

#### NC-18 — Messages de statut (critère 7.5)

`components/utils/Toast.tsx:55-58` — le composant retourne `null` quand il est fermé, puis monte d'un coup `<div role="status" aria-live="polite">` **avec son contenu déjà présent**. Une région live insérée dans le DOM en même temps que son contenu n'est généralement pas annoncée par les lecteurs d'écran : le message « Vous êtes connecté·e » (`Header.tsx:445-450`) risque de ne jamais être restitué.

Le toast disparaît par ailleurs automatiquement au bout de 6 s sans possibilité de le prolonger.

#### NC-19 — Information donnée par la couleur seule (critère 3.1)

`patch4c/circleVisualization.tsx` — le niveau d'aggravation reste porté visuellement par la seule `backgroundColor` du cercle. L'`aria-label` enrichi et l'affichage au focus clavier (correctifs de mai) couvrent les utilisateurs de lecteurs d'écran et de clavier, **mais pas les utilisateurs à la souris déficients en perception des couleurs**. Statut inchangé : partiel = non conforme au sens ARA.

#### NC-20 — Reflow / 320 px (critère 10.11)

Le sprint mobile a apporté de vraies améliorations (surcharges `min-width: unset` sous 600 px sur `eau.module.scss:140`, `gestionRisquesCharts.module.scss:15, 25`, `charts.module.scss`, tiroir mobile, etc.). **Le critère n'est cependant pas validable statiquement** : il nécessite une mesure réelle à 320 px de large et 256 px de haut sur chaque gabarit.

Conservé en NC par prudence — **à retester en priorité**, c'est le critère le plus susceptible de passer en conforme et de faire remonter le taux (→ 66,2 %).

---

## 4. Ce qui tient depuis l'audit précédent ✅

Vérifié : **toutes les corrections du « Top 12 » et des compléments ARA sont toujours en place**.

| Correction de mai | État aujourd'hui |
| --- | --- |
| `Body` avec `htmlTag` (imbrications HTML) | ✅ maintenu |
| Accordéons `<button>` + `aria-expanded` (`aleaExplications`) | ✅ maintenu |
| `circleVisualization` en `<button>` + `aria-pressed` | ✅ maintenu |
| Pattern ARIA Tabs complet (`blocAleas`) | ✅ maintenu |
| Déclencheurs d'infobulles focusables (`.tooltipTrigger`) | ✅ maintenu |
| `AccessibleMapWrapper` (`role="img"` + `aria-label`) | ✅ appliqué à 14 composants cartes |
| Tableau `blocConseils` sémantique (`caption`/`thead`/`th scope`) | ✅ maintenu |
| `prefers-reduced-motion` global + `matchMedia` dans `roue.tsx` | ✅ maintenu |
| `<h1 class="fr-sr-only">Roue des thématiques</h1>` | ✅ maintenu |
| Listes `<ul>/<li>` dans `MenuLateral` et `ThematiquesLieesNavigation` | ✅ maintenu |
| `SkipLinks` + `tabIndex={-1}` sur `<main>` et `<footer>` | ✅ maintenu |
| Landmarks (`banner`, `navigation`, `main`, `contentinfo`) | ✅ maintenus |
| Page `/plan-du-site` + lien footer | ✅ maintenue, **mise à jour avec l'espace connecté** |
| Pattern « lien sr-only adjacent » pour les infobulles | ✅ 5/6 — voir NC-11 |
| Tous les SVG inline (`aria-hidden` ou `role="img"`) | ✅ 12/12 conformes |
| Toutes les `<img>`/`<Image>` ont un attribut `alt` | ✅ 165/165 |

### Non-conformités précédentes **résolues**

| Ancienne NC | Résolution |
| --- | --- |
| **11.1.1 / 11.1.3** — `SelectTypeTerritoire` sans nom accessible | ✅ **Composant supprimé** |
| **8.5** — placeholders `TEST` / `COUCOU` en production (`foret`) | ✅ **Thématique `foret` supprimée** |
| **12.7** — absence de fil d'Ariane | ✅ `Breadcrumb` DSFR présent sur `/mon-compte` et les articles |
| **1.6** — `foret/2-LineaireDeHaie` sans description détaillée | ✅ indicateur supprimé (5 cas restants au lieu de 6) |

---

## 5. Points de vigilance (non comptés en NC)

| Sujet | Détail |
| --- | --- |
| **Iframe Metabase** (`/statistiques`) | L'`<iframe>` a bien un `title` (2.1/2.2 conformes), mais **le contenu du tableau de bord Metabase n'est pas audité**. Il fait partie de la page au sens RGAA. À déclarer en « contenu tiers » ou à auditer. |
| **Durée de session 12 h** | `lib/auth/proconnect.ts:5` — `USERS_SESSION_MAX_AGE = 12h`, sans avertissement ni prolongation. Sous le seuil de 20 h de WCAG 2.2.1. Classé conforme au titre de l'exception « essentiel » (sécurité de l'authentification, aucune saisie perdue), mais à arbitrer explicitement. |
| **`aria-expanded={false}` figé** | `components/ui/Header.tsx:399` — la valeur est écrite en dur côté React ; c'est le JS DSFR qui la bascule au runtime. À vérifier manuellement que React ne la réinitialise pas après hydratation. |
| **`scroll-behavior`** | `global.css:124` `html { scroll-behavior: smooth !important }` a une spécificité supérieure à la règle `*` du bloc `prefers-reduced-motion` (l. 152-160) : la préférence n'est **pas** respectée pour le défilement. Non bloquant (13.8 vise le clignotement), mais à corriger. |
| **Émojis non masqués** | Bonne pratique déjà notée en mai : envelopper les émojis de thématiques dans `<span aria-hidden="true">` pour éviter la double lecture. |
| **`DefinitionTooltip`** | `components/utils/Tooltips.tsx:177` — `<span tabIndex={0}>` sans rôle. Fonctionne (MUI ouvre au focus), mais l'élément focusable n'a pas de rôle explicite. |
| **Code mort** | Non modifié, hors périmètre d'audit, mais à signaler : `components/maps/mapO3.tsx`, `components/maps/mapTilesFrance.tsx`, `app/(main)/ressources/tabs.tsx` (`TabComp`), `app/(main)/ressources/CustomCard.tsx`, `app/iframe/thematiques/card.tsx`, `components/interactions/RetourHautDePage.tsx` ne sont importés nulle part. Plusieurs contiennent des défauts d'accessibilité qui ressurgiraient s'ils étaient remis en service. |

---

## 6. Plan de correction proposé

Aucune modification n'a été appliquée au code. Ordre suggéré, du meilleur rapport effort/impact au moins bon.

### Lot 1 — Rapide, fort impact (≈ 1 j)

| # | Critère | Action |
| --- | --- | --- |
| 1 | 12.1 / 12.2 | Rétablir le burger DSFR sous 768 px (retirer `display: none` sur `.fr-header__navbar` ou le conditionner au breakpoint) |
| 2 | 3.2 | Remplacer `--gris-medium-dark` par une valeur ≥ 4,5:1 (ex. `#6E6E6E` = 4,74:1, ou réutiliser `#666666` = 5,74:1) |
| 3 | 10.7 | Ajouter un indicateur de focus sur `BarreDeRechercheSansFiltre` et `HeaderRechercheTerritoire` |
| 4 | 1.1 | Passer un `ariaLabel` aux 3 `Micro*` qui n'en ont pas |
| 5 | 1.2 / 1.3 | `alt=""` sur les images décoratives listées en NC-12 |
| 6 | 8.6 | `metadata.title` sur `/mon-compte` ; aligner `/ressources` sur « Boîte à outils » |
| 7 | 9.1 | Ajouter un `<h1>` sur `/mon-compte` ; sur `/mon-espace`, faire du `<h1>` un titre de page (« Mon espace ») et rétrograder le prénom |
| 8 | 12.11 | Ajouter le lien `fr-sr-only` manquant sur `5-Debroussaillement` |
| 9 | 11.9 | Retirer `aria-label="Mon compte"` du bouton « Se connecter » |
| 10 | 8.2 | Corriger l'imbrication `<span><p>` dans `content/accessibilite.mdx` |

### Lot 2 — Composants (≈ 2-3 j)

| # | Critère | Action |
| --- | --- | --- |
| 11 | 10.8 / 12.8 | Rendre `MenuMobileDrawer` conditionnellement (`{isOpen && …}`) ou ajouter `inert`/`aria-hidden` + `visibility: hidden` à l'état fermé |
| 12 | 7.1 / 7.3 | Gestion clavier complète des modales (`role="dialog"`, `aria-modal`, `aria-label`, piège de focus, Échap, restauration du focus) : `ModalFiltresRessources` et `ZoomOnClick` |
| 13 | 7.1 | Rendre `ZoomOnClick` focusable (`<button>`) |
| 14 | 7.1 / 7.3 | Pattern ARIA menu complet, ou abandon de `role="menu"` au profit d'une simple liste de liens, dans `HeaderMonCompteMenu` |
| 15 | 7.1 | `aria-pressed` (ou `role="tab"`) sur `SubTabs` |
| 16 | 7.1 | Croix d'effacement des champs de recherche en `<button>` |
| 17 | 7.5 | Monter la région `aria-live` en permanence dans le DOM, n'y injecter que le texte |
| 18 | 5.4 / 5.6 / 5.7 | Exploiter `has_column_header` / `has_row_header` de Notion pour générer `<thead>`/`<th scope>` ; ajouter un `<caption>` |

### Lot 3 — Structurel (à arbitrer)

| # | Critère | Action |
| --- | --- | --- |
| 19 | 1.6 / 1.7 | Description textuelle synthétique adjacente aux 5 cartes sans export, ou export tabulaire via WFS/GeoJSON |
| 20 | 3.1 | Alternative visuelle au code couleur d'aggravation (motif, libellé) sur `circleVisualization` |
| 21 | 10.2 / 10.3 | NC assumée — à déclarer |
| 22 | — | Arbitrer le périmètre `/workspace-tacct` (§1.3) |

---

## 7. Tests manuels restant à réaliser

Obligatoires avant publication de la déclaration ; non réalisables par analyse statique.

- [ ] **10.11** — reflow à 320 px de large / 256 px de haut sur les 18 gabarits
- [ ] **10.4** — zoom 200 % (retest après refonte mobile)
- [ ] **3.2 / 3.3** — mesure des contrastes sur rendu réel (texte sur images, dataviz Nivo, cartes MapLibre, légendes)
- [ ] **7.1 / 7.3 / 12.8 / 12.9** — parcours clavier complet de chaque gabarit, dont le menu DSFR après hydratation React
- [ ] **1.x / 7.5 / 9.1** — restitution NVDA + Firefox et VoiceOver + Safari
- [ ] **8.2** — validation W3C des pages rendues (recherche d'`id` dupliqués, dont `filter-energie`)
- [ ] **2.x** — évaluation du tableau de bord Metabase intégré
- [ ] **Périmètre `/workspace-tacct`** — décision, puis audit ou exclusion déclarée

---

## 8. Conséquences pour la déclaration d'accessibilité

`content/accessibilite.mdx` indique aujourd'hui : *« En l'absence d'audit et dans l'attente de celui-ci, le site n'est pas en conformité »*.

Pour passer en **partiellement conforme**, il faut, dans l'ordre :

1. **Trancher le périmètre `/workspace-tacct`** (§1.3) ;
2. **Réaliser les tests manuels** du §7 — sans eux, le taux annoncé n'est pas défendable ;
3. Idéalement, **traiter le Lot 1** : il est peu coûteux et ferait passer le taux de **64,9 % à ≈ 78 %** (10 critères regagnés) ;
4. Puis mettre à jour la déclaration avec :
   - l'état « **partiellement conforme** » (le seuil réglementaire est de 50 % de critères applicables respectés) ;
   - le **taux de conformité** mesuré ;
   - la **liste des non-conformités** (§3) dans « Contenus non accessibles » ;
   - les **dérogations** éventuelles (10.2 / 10.3 — architecture SPA) ;
   - les **contenus non soumis** (contenu tiers Metabase, `/workspace-tacct` si exclu) ;
   - la **date d'établissement**, les **technologies**, les **outils** et les **pages testées** — actuellement tous à « Néant ».

> **En l'état, le site est déjà au-dessus du seuil de 50 %** : la déclaration « partiellement conforme » est justifiable dès maintenant. Le Lot 1 sert à afficher un taux plus représentatif du travail réellement accompli.

---

## Documentation de référence

- **RGAA 4.1.2** — https://accessibilite.numerique.gouv.fr/
- **Critères et tests** — https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/
- **ARA** — https://ara.numerique.gouv.fr/ (rapport précédent : https://ara.numerique.gouv.fr/rapport/6ZZBkg91BcH9nw0tj8Sgw/)
- **WAI-ARIA Authoring Practices** — https://www.w3.org/WAI/ARIA/apg/
- **DSFR Accessibilité** — https://www.systeme-de-design.gouv.fr/
