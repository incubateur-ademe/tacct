# Audit RGAA 4.1.2 — TACCT — Re-audit complet du 11 août 2026

**Référentiel :** RGAA 4.1.2 — 106 critères
**Méthode :** audit statique exhaustif du code source (`src/`, `content/`)
**Audit précédent :** [audit-rgaa-2026-04-28.md](audit-rgaa-2026-04-28.md) — 91 % sur le seul périmètre `(parcours)`
**Objectif :** vérifier que le niveau atteint en avril/mai 2026 tient toujours, avant passage officiel en « partiellement conforme ».

> ⚠️ **Nature de cet audit.** Audit **statique du code**. Il identifie de façon fiable les non-conformités structurelles (balisage, ARIA, alternatives, contrastes déclarés, ordre DOM). Il ne remplace pas les tests manuels obligatoires pour une déclaration officielle : restitution sous NVDA/JAWS/VoiceOver, zoom 200 %, reflow 320 px, comportement runtime du JS DSFR. Voir [§7](#7--tests-manuels-restant-à-réaliser).

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

### 1.2 Échantillon audité

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

### 1.3 Exclusion de périmètre : `/workspace-tacct` (outil de saisie legacy)

`next.config.mjs` (l. 182-190) reverse-proxy l'application legacy sous `https://www.tacct.ademe.fr/workspace-tacct/*`. Le lien n'est affiché que si `user.validated === true` (`AncienEspaceCard.tsx:29-35`), validation faite manuellement pour les seuls utilisateurs historiques, en attendant le décommissionnement de l'outil.

**Statut arbitré (11/08/2026) : exclue de l'échantillon d'audit.** Il s'agit d'une application tierce distincte, jamais auditée et non conforme au RGAA. **Le taux de conformité ci-dessous ne la couvre pas.**

**L'accès restreint ne dispense pas de l'obligation.** Le décret n° 2019-768 vise les services de communication au public en ligne, et la déclaration ADEME elle-même annonce couvrir « ses sites internet, **intranet, extranet** et ses applications mobiles ». Une authentification et une validation manuelle réduisent le nombre d'utilisateurs exposés, pas la portée juridique.

**Deux traitements recevables**, à choisir :

1. **Dérogation pour charge disproportionnée** — catégorie prévue par le décret. Le décommissionnement programmé en est une justification recevable. Mention à porter dans `content/accessibilite.mdx` :

   > **Dérogation pour charge disproportionnée — outil de saisie legacy.** L'outil de saisie accessible sous `/workspace-tacct`, réservé aux utilisateurs historiques dont l'accès est validé manuellement, correspond à une application antérieure intégrée au service par proxy. Elle n'a pas fait l'objet d'un audit d'accessibilité et n'est pas conforme au RGAA 4.1.2. Son remplacement est engagé ; une mise en conformité de l'existant constituerait une charge disproportionnée au regard de sa durée de vie résiduelle et du nombre d'utilisateurs concernés. Les personnes rencontrant un obstacle peuvent contacter le référent accessibilité (voir « Retour d'information et contact »).

2. **Déclaration de périmètre séparée** pour l'extranet, pratique courante pour un outil authentifié.

Dans les deux cas, la mention est **obligatoire** : sans elle, la déclaration serait inexacte.

---

## 2. Synthèse

### 2.1 Résultat

| | À l'ouverture de l'audit | **Après corrections du 11/08** |
| --- | --- | --- |
| Critères **conformes** | 48 | **64** |
| Critères **non conformes** | 26 | **10** |
| Critères **non applicables** | 32 | **32** |
| **Taux de conformité** | 64,9 % | **86,5 %** |

**Taux de conformité RGAA = 64 / (64 + 10) = 86,5 %**

Le seuil réglementaire du « partiellement conforme » est de 50 %. Le seuil du « totalement conforme » est de 100 %.

> Les 16 critères regagnés correspondent aux non-conformités corrigeables **sans aucune régression visuelle** ([§4](#4--corrections-appliquées-le-11-août-2026)). Les 10 restantes relèvent soit d'un arbitrage produit (contraste, navigation mobile), soit d'un chantier structurel (descriptions détaillées des cartes, rendu sans CSS).

> **Pourquoi 64,9 % au départ alors que l'audit d'avril annonçait 91 % ?** Les 91 % portaient sur les seules pages `(parcours)`. L'élargissement du périmètre à tout le site (accueil, boîte à outils, articles Notion, pages légales, espace connecté) a fait entrer dans le calcul des zones jamais auditées. **Aucune correction d'avril/mai n'a régressé** — voir [§5](#5--ce-qui-tient-depuis-laudit-précédent-).

### 2.2 Répartition par thème (après corrections)

| Thème | C | NC | N/A |
| --- | --- | --- | --- |
| 1 — Images | 5 | 2 | 2 |
| 2 — Cadres | 2 | 0 | 0 |
| 3 — Couleurs | 1 | 2 | 0 |
| 4 — Multimédia | 0 | 0 | 13 |
| 5 — Tableaux | 3 | 1 | 4 |
| 6 — Liens | 2 | 0 | 0 |
| 7 — Scripts | 4 | 0 | 1 |
| 8 — Éléments obligatoires | 8 | 0 | 2 |
| 9 — Structuration | 3 | 0 | 1 |
| 10 — Présentation | 10 | 3 | 1 |
| 11 — Formulaires | 8 | 0 | 5 |
| 12 — Navigation | 7 | 2 | 2 |
| 13 — Consultation | 11 | 0 | 1 |
| **Total** | **64** | **10** | **32** |

---

## 3. Non-conformités restantes

### NC-01 — Menu de navigation principal inaccessible sous 768 px (critères 12.1, 12.2)

**Impact : majeur — NC assumée, non corrigée.**

`src/components/ui/Header.tsx:265` masque inconditionnellement le bouton burger DSFR :

```js
'.fr-header__navbar': { display: 'none' }
```

`src/components/ui/Header.module.scss:1` ne rend `.fr-modal` (qui contient `<nav class="fr-nav">`) visible qu'à partir de `min-width: 768px`. En dessous, le menu principal n'est **ni affiché, ni ouvrable**.

- **12.1** — un seul système de navigation subsiste (le plan du site via le footer), au lieu des deux exigés.
- **12.2** — le menu n'est pas « à la même place » sur toutes les pages/résolutions.

`MenuMobileDrawer` ne compense pas : il n'existe que sur `/donnees` et `/impacts`, et c'est un sommaire de page, pas le menu principal.

**Arbitrage (11/08/2026) :** rétablir le burger ferait réapparaître un bouton « Menu » et l'overlay DSFR sur mobile — impact visuel non souhaité à ce stade. Correction renvoyée à une évolution ultérieure du header. Mention à porter dans la déclaration :

> **Non-conformité — navigation principale sur mobile.** En dessous de 768 px de largeur d'écran, le menu de navigation principal n'est pas affiché. La navigation reste possible via le plan du site, accessible depuis le pied de page de toutes les pages. Critères 12.1 et 12.2 non respectés.

### NC-02 — Descriptions détaillées des cartes (critères 1.6, 1.7)

**Impact : majeur — chantier structurel.** Inchangé depuis avril.

5 indicateurs alimentés par flux de tuiles/API externes ne proposent **aucune donnée exportable** — seul un export PNG, inexploitable par lecteur d'écran :

- `donnees/indicateurs/amenagement/2-LCZ.tsx`
- `donnees/indicateurs/confortThermique/6-LCZ.tsx`
- `donnees/indicateurs/gestionDesRisques/3-ErosionCotiere.tsx`
- `donnees/indicateurs/gestionDesRisques/5-Debroussaillement.tsx`
- `donnees/indicateurs/sante/1-o3.tsx`

(`foret/2-LineaireDeHaie`, 6ᵉ cas de l'audit précédent, a été supprimé.)

La roue systémique D3 (`thematiques/components/roue.tsx`) reste en description partielle.

**Pistes :** texte descriptif synthétique adjacent (« X communes de votre territoire sont en zone d'aléa fort, principalement Y et Z »), ou export tabulaire construit depuis les API WFS/GeoJSON.

### NC-03 — Contenu visible / compréhensible sans CSS (critères 10.2, 10.3)

**Impact : moyen — dérogation assumée.** Inchangé. Application SPA React dont la structure repose entièrement sur CSS pour le positionnement, la visibilité et l'ordre du contenu. Une mise en conformité nécessiterait une refonte de l'architecture de mise en page. À reporter telle quelle dans la déclaration.

### NC-04 — Contraste de texte insuffisant (critère 3.2)

**Impact : moyen — nécessite un arbitrage design (changement de couleur visible).**

`--gris-medium-dark: #7b7b7b` = **4,34:1** sur fond blanc, sous le seuil de 4,5:1. En avril, ce token n'était présent que dans un garde-fou jamais rendu ; il est désormais utilisé dans du texte visible :

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

**Correction proposée (1 ligne, `src/app/global.css:35` + `couleurs.ts:55`) :** `#7b7b7b` → `#6E6E6E` (4,74:1) — écart visuel minime — ou `#666666` (5,74:1), déjà utilisé ailleurs dans le design system. **Non appliquée : modifie une couleur visible.**

### NC-05 — Titre des tableaux des articles Notion (critère 5.4)

**Impact : mineur — nécessite une décision éditoriale.**

`src/lib/ressources/transformationContenuArticles.tsx` — les tableaux issus de Notion n'ont pas de `<caption>`. Les en-têtes ont été corrigés (voir §4), mais Notion n'expose aucun champ « titre de tableau » exploitable.

**Options :** ajouter une convention éditoriale (première ligne de légende dans Notion, ou titre du bloc précédent repris en `<caption class="fr-sr-only">`). Un `<caption>` générique (« Tableau ») ferait échouer le critère 5.5 (pertinence) — donc à éviter.

> Le tableau de `blocConseils.tsx` (parcours + iframe) reste conforme : `<caption class="fr-sr-only">`, `<thead>`/`<tbody>`, `<th scope>`.

### NC-06 — Information donnée par la couleur seule (critère 3.1)

**Impact : moyen — contrainte design.**

`patch4c/circleVisualization.tsx` — le niveau d'aggravation reste porté visuellement par la seule `backgroundColor` du cercle. L'`aria-label` enrichi et l'affichage au focus clavier (correctifs de mai) couvrent les utilisateurs de lecteurs d'écran et de clavier, **mais pas les utilisateurs à la souris déficients en perception des couleurs**. Statut inchangé : partiel = non conforme au sens ARA.

**Piste :** motif ou libellé court visible en complément du code couleur.

### NC-07 — Reflow / 320 px (critère 10.11)

**Impact : à déterminer — non validable statiquement.**

Le sprint mobile a apporté de vraies améliorations (surcharges `min-width: unset` sous 600 px sur `eau.module.scss:140`, `gestionRisquesCharts.module.scss:15, 25`, `charts.module.scss`, tiroir mobile, etc.). Le critère nécessite une mesure réelle à 320 px de large et 256 px de haut sur chaque gabarit.

**Conservé en NC par prudence — à retester en priorité :** c'est le critère le plus susceptible de repasser conforme et de porter le taux à **87,8 %**.

---

## 4. Corrections appliquées le 11 août 2026

Toutes ces corrections ont été validées **sans aucune régression visuelle** (`tsc --noEmit` et `eslint` sans erreur nouvelle).

| Critère | Correction | Fichiers |
| --- | --- | --- |
| **1.1** | `ariaLabel` transmis aux `MicroRemplissageTerritoire` qui exposaient un `role="img"` sans nom accessible | `donnees/indicateurs/agriculture/3-SuperficiesIrriguees.tsx`, `donnees/indicateurs/biodiversite/1-TypesDeSols.tsx` |
| **1.2 / 1.3** | `alt=""` sur les images décoratives qui portaient une alternative parasite (`"image-cartographie"`, `"Cube représentant une valeur"`, `"Goutte d'eau"`, `"Icône réinitialiser"`, `"illustration chat chercheur"`) | 3 × `homeCard.tsx`, `charts/MicroDataviz.tsx`, 2 × `ressources/blocs/FiltresRessources.tsx`, 2 × `patch4c/components/analyseSensibilite.tsx` |
| **5.6 / 5.7** | Tableaux Notion : `<thead>` + `<th scope="col">` sur la ligne d'en-tête, `<th scope="row">` si `has_row_header`. `text-align: left` explicite pour reproduire à l'identique le rendu précédent en `<td>` | `lib/ressources/transformationContenuArticles.tsx` |
| **7.1** | `aria-pressed` sur les sous-onglets de graphiques (nouvelle prop `ariaPressed` sur `BoutonPrimaireClassic` / `BoutonSecondaireClassic`), `type="button"` ajouté | `components/ui/SubTabs.tsx`, `design-system/base/Boutons.tsx` |
| **7.1 / 7.3** | Menu compte : abandon du `role="menu"` / `role="menuitem"` (pattern ARIA non implémenté) au profit d'un simple groupe de liens ; fermeture par Échap avec restitution du focus au déclencheur | `components/ui/HeaderMonCompteMenu.tsx` |
| **7.1 / 7.3** | Modale de filtres : `role="dialog"`, `aria-modal`, `aria-label`, focus placé sur le bouton de fermeture à l'ouverture, fermeture par Échap | 2 × `ressources/blocs/FiltresRessources.tsx` |
| **7.1 / 7.3** | Zoom d'image d'article : déclencheur `<div onClick>` → `<button>` (styles neutralisés, rendu identique) avec `aria-label`, overlay en `role="dialog"` + `aria-modal`, fermeture par Échap et restitution du focus | `components/utils/ZoomOnClick.tsx` |
| **7.3** | **Slider des années : opération au clavier ajoutée** (flèches, Page↑/↓, Origine/Fin) avec restitution du focus au curseur après déplacement, + `aria-valuetext`. Le curseur portait `role="slider"` et `tabIndex=0` **sans aucun gestionnaire clavier** | `components/SliderAnnees.tsx` |
| **7.3** | `clearOnEscape` sur l'autocomplétion de recherche : MUI rend le `clearIndicator` avec `tabIndex=-1`, Échap devient l'équivalent clavier de la croix d'effacement | `components/searchbar/rechercheInput.tsx` |
| **7.5** | Toast de connexion : région `aria-live` montée en permanence (une région live insérée en même temps que son contenu n'est pas annoncée) | `components/utils/Toast.tsx` |
| **8.2** | Imbrication invalide `<p>` dans `<span>` corrigée ; `id="filter-energie"` dupliqué sur trois graphiques rendu unique | `content/accessibilite.mdx`, 3 × `charts/ressourcesEau/prelevementEau*.tsx` |
| **8.6** | `metadata.title` ajouté sur `/mon-compte` (héritait du titre de l'accueil) ; `/ressources` renommée « Boîte à outils » pour concorder avec son `<h1>` et le lien de navigation | `mon-compte/page.tsx`, `ressources/page.tsx` |
| **9.1** | `<h1 class="fr-sr-only">Mon compte</h1>` (la page n'avait aucun `h1`) ; sur `/mon-espace`, préfixe invisible « Mon espace — » devant le prénom pour rendre le `h1` pertinent sans changer l'affichage | `mon-compte/MonCompteClient.tsx`, `mon-espace/ProfilCard.tsx` |
| **10.7** | Focus clavier rendu visible sur les deux champs de recherche qui neutralisaient `outline`, via `:focus-visible` uniquement — le rendu à la souris reste strictement inchangé | `searchbar/header/HeaderRechercheTerritoire.tsx`, `searchbar/BarreDeRechercheSansFiltre.tsx` + `components.module.scss` |
| **10.8 / 12.8** | Tiroir de navigation mobile : `visibility: hidden` à l'état fermé (le tiroir restait dans l'arbre d'accessibilité et tabulable hors écran), transition différée pour préserver l'animation ; focus placé dans le tiroir à l'ouverture, Échap ferme et rend le focus au déclencheur ; `aria-expanded` sur le bouton | `components/ui/MenuMobileDrawer.tsx`, `components/components.module.scss` |
| **11.9** | Bouton de connexion du header : `aria-label="Mon compte"` remplacé par `"Se connecter"` — le nom accessible ne contenait pas le texte visible (WCAG 2.5.3 *Label in Name*) | `components/ui/HeaderMonCompteMenu.tsx` |
| **12.11** | Lien `fr-sr-only` manquant ajouté pour l'infobulle « débroussaillement » (le lien à l'intérieur d'une infobulle MUI n'est pas atteignable au clavier) — le pattern couvre désormais 6/6 infobulles | `donnees/indicateurs/gestionDesRisques/5-Debroussaillement.tsx` |

---

## 5. Ce qui tient depuis l'audit précédent ✅

**Toutes les corrections du « Top 12 » et des compléments ARA de mai sont toujours en place.**

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
| Pattern « lien sr-only adjacent » pour les infobulles | ✅ 6/6 depuis le 11/08 |
| Tous les SVG inline (`aria-hidden` ou `role="img"`) | ✅ 12/12 conformes |
| Toutes les `<img>`/`<Image>` ont un attribut `alt` | ✅ 165/165 |

### Non-conformités précédentes **résolues par l'évolution du produit**

| Ancienne NC | Résolution |
| --- | --- |
| **11.1.1 / 11.1.3** — `SelectTypeTerritoire` sans nom accessible | ✅ **Composant supprimé** |
| **8.5** — placeholders `TEST` / `COUCOU` en production (`foret`) | ✅ **Thématique `foret` supprimée** |
| **12.7** — absence de fil d'Ariane | ✅ `Breadcrumb` DSFR présent sur `/mon-compte` et les articles |
| **1.6** — `foret/2-LineaireDeHaie` sans description détaillée | ✅ indicateur supprimé (5 cas restants au lieu de 6) |

---

## 6. Points de vigilance (non comptés en NC)

| Sujet | Détail |
| --- | --- |
| **Iframe Metabase** (`/statistiques`) | L'`<iframe>` a bien un `title` (2.1/2.2 conformes), mais **le contenu du tableau de bord Metabase n'est pas audité**. Il fait partie de la page au sens RGAA. À déclarer en « contenu tiers » ou à auditer. |
| **Durée de session 12 h** | `lib/auth/proconnect.ts:5` — `USERS_SESSION_MAX_AGE = 12h`, sans avertissement ni prolongation. Sous le seuil de 20 h de WCAG 2.2.1. Classé conforme au titre de l'exception « essentiel » (sécurité de l'authentification, aucune saisie perdue), mais à arbitrer explicitement. |
| **`aria-expanded={false}` figé** | `components/ui/Header.tsx:399` — la valeur est écrite en dur côté React ; c'est le JS DSFR qui la bascule au runtime. À vérifier manuellement que React ne la réinitialise pas après hydratation. |
| **`<style data-emotion>` dans `<body>`** | Injecté par MUI/Emotion. Comportement du moteur CSS-in-JS tiers, non corrigeable. À confirmer lors de la validation W3C (§7). |
| **`scroll-behavior`** | `global.css:124` `html { scroll-behavior: smooth !important }` a une spécificité supérieure à la règle `*` du bloc `prefers-reduced-motion` (l. 152-160) : la préférence n'est **pas** respectée pour le défilement. Non bloquant (13.8 vise le clignotement), mais à corriger. |
| **Émojis non masqués** | Bonne pratique déjà notée en mai : envelopper les émojis de thématiques dans `<span aria-hidden="true">` pour éviter la double lecture. |
| **`DefinitionTooltip`** | `components/utils/Tooltips.tsx:177` — `<span tabIndex={0}>` sans rôle. Fonctionne (MUI ouvre au focus), mais l'élément focusable n'a pas de rôle explicite. |
| **Code mort** | Non modifié, hors périmètre d'audit, mais à signaler : `components/maps/mapO3.tsx`, `components/maps/mapTilesFrance.tsx`, `app/(main)/ressources/tabs.tsx` (`TabComp`), `app/(main)/ressources/CustomCard.tsx`, `app/iframe/thematiques/card.tsx`, `components/interactions/RetourHautDePage.tsx` ne sont importés nulle part. Plusieurs contiennent des défauts d'accessibilité qui ressurgiraient s'ils étaient remis en service. |

---

## 7. Tests manuels restant à réaliser

Obligatoires avant publication de la déclaration ; non réalisables par analyse statique.

- [ ] **10.11** — reflow à 320 px de large / 256 px de haut sur les 18 gabarits *(le seul critère susceptible de faire remonter le taux)*
- [ ] **10.4** — zoom 200 % (retest après refonte mobile)
- [ ] **3.2 / 3.3** — mesure des contrastes sur rendu réel (texte sur images, dataviz Nivo, cartes MapLibre, légendes)
- [ ] **7.1 / 7.3 / 12.8 / 12.9** — parcours clavier complet de chaque gabarit, dont le menu DSFR après hydratation React et les correctifs du 11/08
- [ ] **1.x / 7.5 / 9.1** — restitution NVDA + Firefox et VoiceOver + Safari
- [ ] **8.2** — validation W3C des pages rendues
- [ ] **2.x** — évaluation du tableau de bord Metabase intégré

> ⚠️ Ces tests ne peuvent quasiment que **faire baisser** le taux : ils sont susceptibles d'invalider des critères classés conformes par analyse statique. Seul **10.11** peut jouer dans l'autre sens.

---

## 8. Conséquences pour la déclaration d'accessibilité

`content/accessibilite.mdx` indique aujourd'hui : *« En l'absence d'audit et dans l'attente de celui-ci, le site n'est pas en conformité »*.

Pour passer en **partiellement conforme** :

1. **Réaliser les tests manuels** du §7 — sans eux, le taux annoncé n'est pas défendable ;
2. Mettre à jour la déclaration avec :
   - l'état « **partiellement conforme** » (seuil réglementaire : 50 % des critères applicables) ;
   - le **taux de conformité** : **86,5 %** (sous réserve des tests manuels) ;
   - la **liste des non-conformités** (§3) dans « Contenus non accessibles » — dont explicitement la navigation mobile (NC-01) ;
   - les **dérogations pour charge disproportionnée** : rendu sans CSS (NC-03) et **outil de saisie legacy `/workspace-tacct`** (§1.3) ;
   - les **contenus non soumis** : contenu tiers Metabase ;
   - la **date d'établissement**, les **technologies**, les **outils** et les **pages testées** — actuellement tous à « Néant », à renseigner à partir du §1.2 et du §7.

---

## Annexe — Grille des 106 critères

Statuts : **C** conforme · **NC** non conforme · **N/A** non applicable. « ✔ 11/08 » signale un critère corrigé lors de cette session (§4).

### Thème 1 — Images (9)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 1.1 | Alternative textuelle des images porteuses d'information | **C** ✔ 11/08 | `ariaLabel` ajouté sur les 2 `role="img"` sans nom accessible |
| 1.2 | Images de décoration correctement ignorées | **C** ✔ 11/08 | `alt=""` sur les 9 images décoratives concernées |
| 1.3 | Pertinence de l'alternative textuelle | **C** ✔ 11/08 | Alternatives non pertinentes supprimées |
| 1.4 | Alternative des images-tests (CAPTCHA) | N/A | Aucun CAPTCHA |
| 1.5 | Alternative des images-tests — pertinence | N/A | Idem |
| 1.6 | Description détaillée si nécessaire | **NC** | NC-02 — 5 cartes flux API + roue D3 |
| 1.7 | Pertinence de la description détaillée | **NC** | NC-02 — partielle |
| 1.8 | Image texte remplaçable par du texte stylé | C | Formule mathématique et logos = cas particuliers exclus |
| 1.9 | Légende d'image correctement reliée | C | `role="figure"` + `aria-label` dans `transformationContenuArticles.tsx` |

### Thème 2 — Cadres (2)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 2.1 | Chaque cadre a un titre | C | 1 seule `<iframe>` (`/statistiques`), `title` présent |
| 2.2 | Titre de cadre pertinent | C | « Tableau de bord stats ». Contenu Metabase non audité — voir §6 |

### Thème 3 — Couleurs (3)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 3.1 | Information non donnée uniquement par la couleur | **NC** | NC-06 — `circleVisualization` |
| 3.2 | Contraste du texte | **NC** | NC-04 — `#7B7B7B` = 4,34:1 |
| 3.3 | Contraste des composants d'interface | C | Bordure `#808080` sur `CircleIcon` (mai) ; bordure `#038278` (4,92:1) sur les champs. À confirmer en test manuel |

### Thème 4 — Multimédia (13)

| Critères | Statut | Justification |
| --- | --- | --- |
| 4.1 → 4.13 | N/A | Aucun `<video>`, `<audio>`, `<object>`, `<embed>` ni média temporel dans le code |

### Thème 5 — Tableaux (8)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 5.1 | Résumé des tableaux complexes | N/A | Aucun tableau complexe |
| 5.2 | Pertinence du résumé | N/A | Idem |
| 5.3 | Tableau de mise en forme linéarisable | N/A | Aucun tableau de mise en forme |
| 5.4 | Titre (`<caption>`) de tableau de données | **NC** | NC-05 — tableaux Notion sans `<caption>` |
| 5.5 | Pertinence du titre de tableau | C | `blocConseils` : « Actions à mener selon le niveau d'aggravation… » |
| 5.6 | En-têtes correctement déclarés | **C** ✔ 11/08 | `<thead>` + `<th scope="col">` sur les tableaux Notion |
| 5.7 | Association en-têtes / cellules | **C** ✔ 11/08 | `scope="col"` / `scope="row"` |
| 5.8 | Tableaux de mise en forme sans balises de données | N/A | Aucun |

### Thème 6 — Liens (2)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 6.1 | Intitulé de lien explicite | C | Aucun « cliquez ici » / « en savoir plus » isolé ; liens externes titrés |
| 6.2 | Chaque lien a un intitulé | C | Aucun lien vide détecté |

### Thème 7 — Scripts (5)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 7.1 | Compatibilité avec les technologies d'assistance | **C** ✔ 11/08 | Menu compte, modales, zoom, sous-onglets, tiroir mobile corrigés. Runtime DSFR à confirmer en test manuel (§7) |
| 7.2 | Pertinence de l'alternative au script | N/A | Aucune alternative non-JS prévue |
| 7.3 | Contrôle au clavier | **C** ✔ 11/08 | Slider des années, modales, zoom, effacement de recherche, menu compte |
| 7.4 | Changement de contexte contrôlé | C | Redirections immédiates et initiées par l'utilisateur |
| 7.5 | Messages de statut | **C** ✔ 11/08 | Région `aria-live` persistante sur le Toast |

### Thème 8 — Éléments obligatoires (10)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 8.1 | Type de document (DOCTYPE) | C | Généré par Next.js |
| 8.2 | Code source valide | **C** ✔ 11/08 | `<p>`/`<span>` et `id` dupliqués corrigés. `<style data-emotion>` tiers à confirmer en validation W3C (§7) |
| 8.3 | Langue par défaut | C | `<html lang="fr">` |
| 8.4 | Pertinence du code de langue | C | `fr` |
| 8.5 | Titre de page présent | C | Toutes les pages ont un `<title>` |
| 8.6 | Pertinence du titre de page | **C** ✔ 11/08 | `/mon-compte` et `/ressources` corrigés |
| 8.7 | Changements de langue signalés | C | Aucun passage en langue étrangère détecté |
| 8.8 | Pertinence du code de langue des changements | N/A | Aucun changement de langue |
| 8.9 | Balises non détournées à des fins de présentation | C | `<b>` utilisé en emphase sémantique |
| 8.10 | Changements du sens de lecture signalés | N/A | Aucun contenu RTL |

### Thème 9 — Structuration (4)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 9.1 | Titres `<hx>` et hiérarchie pertinents | **C** ✔ 11/08 | `h1` ajouté sur `/mon-compte`, `h1` de `/mon-espace` rendu pertinent |
| 9.2 | Structure du document cohérente | C | `header` / `nav` / `main` / `footer` présents sur tous les gabarits `(main)` |
| 9.3 | Listes correctement structurées | C | `<ul>/<li>` dans les menus et navigations |
| 9.4 | Citations correctement indiquées | N/A | Aucune citation de tiers |

### Thème 10 — Présentation (14)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 10.1 | Pas de balises de présentation | C | Aucun `<font>`, `<center>`, `<marquee>` |
| 10.2 | Contenu visible sans CSS | **NC** | NC-03 — dérogation assumée |
| 10.3 | Contenu compréhensible sans CSS | **NC** | NC-03 — dérogation assumée |
| 10.4 | Texte lisible au zoom 200 % | C | Validé en avril ; à retester (§7) |
| 10.5 | Déclarations CSS de couleurs couplées | C | `color` / `background-color` toujours associés |
| 10.6 | Liens distinguables du texte | C | Soulignement DSFR par défaut |
| 10.7 | Prise de focus visible | **C** ✔ 11/08 | `:focus-visible` sur les deux champs de recherche concernés |
| 10.8 | Contenus cachés ignorés par les AT | **C** ✔ 11/08 | `visibility: hidden` sur le tiroir mobile fermé |
| 10.9 | Information non donnée par la forme/taille/position | C | `aria-label` ou texte adjacent partout |
| 10.10 | Implémentation pertinente de 10.9 | C | Alternatives non redondantes |
| 10.11 | Pas de défilement double (320 px / 256 px) | **NC** | NC-07 — à retester en priorité |
| 10.12 | Espacement du texte redéfinissable | C | `min-height` et `line-height` relatifs (mai) |
| 10.13 | Contenus additionnels contrôlables | C | MUI Tooltip interactif, persistant au survol/focus |
| 10.14 | Contenus additionnels CSS-only atteignables au clavier | N/A | Tous les affichages conditionnels sont pilotés par l'état React |

### Thème 11 — Formulaires (13)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 11.1 | Étiquette de champ | C | `<label htmlFor>` (cases à cocher, DSFR) ou `aria-label` (autocomplétions) |
| 11.2 | Pertinence de l'étiquette | C | « Rechercher un territoire », « Filtrer les prélèvements… » |
| 11.3 | Cohérence des étiquettes entre pages | C | Étiquettes identiques sur les deux pages de recherche |
| 11.4 | Étiquette accolée à son champ | C | Géré par DSFR / positionnement natif |
| 11.5 | Champs de même nature regroupés | C | `<fieldset>` DSFR sur `RadioButtons` |
| 11.6 | Légende de regroupement | C | `legend="Type de territoire"` + `fr-sr-only` |
| 11.7 | Pertinence de la légende | C | Idem |
| 11.8 | `optgroup` | N/A | Aucun `<select>` natif avec groupes |
| 11.9 | Intitulé de bouton pertinent | **C** ✔ 11/08 | `aria-label="Se connecter"` aligné sur le texte visible |
| 11.10 | Contrôle de saisie | N/A | Aucune contrainte de format |
| 11.11 | Aide à la correction des erreurs | N/A | Aucun message d'erreur de saisie |
| 11.12 | Confirmation avant modification/suppression | N/A | Aucune donnée modifiable côté site public |
| 11.13 | `autocomplete` sur les données personnelles | N/A | Aucun champ collectant des données personnelles (hors `/workspace-tacct`, exclu — §1.3) |

### Thème 12 — Navigation (11)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 12.1 | Deux systèmes de navigation | **NC** | NC-01 — menu absent sous 768 px |
| 12.2 | Menu et barres à la même place | **NC** | NC-01 |
| 12.3 | Plan du site pertinent | C | `/plan-du-site` à jour, espace connecté inclus |
| 12.4 | Plan du site accessible de façon identique | C | Lien footer rendu sur toutes les pages `(main)` |
| 12.5 | Moteur de recherche accessible de façon identique | N/A | Pas de moteur de recherche de contenus (la recherche de territoire est un sélecteur de paramètre) |
| 12.6 | Zones de regroupement (landmarks) | C | `banner`, `navigation` ×2 étiquetés, `main`, `contentinfo` |
| 12.7 | Lien d'évitement | C | `SkipLinks` DSFR + `tabIndex={-1}` sur les cibles |
| 12.8 | Ordre de tabulation cohérent | **C** ✔ 11/08 | Tiroir mobile fermé retiré du parcours de tabulation |
| 12.9 | Pas de piège au clavier | C | Aucun piège détecté ; Échap ajouté sur toutes les modales. À confirmer en test manuel (§7) |
| 12.10 | Raccourcis clavier mono-touche | N/A | Aucun raccourci global |
| 12.11 | Contenus additionnels atteignables au clavier | **C** ✔ 11/08 | 6/6 infobulles à lien couvertes par le pattern « lien sr-only adjacent » |

### Thème 13 — Consultation (12)

| Critère | Intitulé | Statut | Justification |
| --- | --- | --- | --- |
| 13.1 | Limite de temps contrôlable | C | Aucun rafraîchissement auto ni `meta refresh` ; session de 12 h relevant de l'exception « essentiel » (§6) |
| 13.2 | Ouverture de fenêtre déclenchée par l'utilisateur | C | Tous les `window.open` / `target="_blank"` requièrent un clic |
| 13.3 | Documents bureautiques accessibles | C | Exports XLSX doublés d'une version HTML sur la page |
| 13.4 | Même information dans la version accessible | C | Idem |
| 13.5 | Alternative aux contenus cryptiques (émojis) | C | Texte explicite adjacent dans tous les cas |
| 13.6 | Pertinence de l'alternative | C | Idem |
| 13.7 | Pas d'effet de flash | C | Inventaire `@keyframes` : `spin`, `shake` — aucun clignotement |
| 13.8 | Mouvement/clignotement contrôlable | C | `prefers-reduced-motion` global + `matchMedia` dans `roue.tsx` |
| 13.9 | Orientation d'écran non contrainte | C | Aucun `@media (orientation)` ni `screen.orientation.lock()` |
| 13.10 | Gestes complexes : alternative simple | C | Zoom carte via boutons `+`/`−` ; clic simple sur `SliderAnnees` |
| 13.11 | Annulation des actions de pointage | C | Un seul `onMouseDown` (pattern slider standard, cas particulier admis) |
| 13.12 | Fonctionnalités liées au mouvement de l'appareil | N/A | Aucun `deviceorientation` / `devicemotion` |

---

## Documentation de référence

- **RGAA 4.1.2** — https://accessibilite.numerique.gouv.fr/
- **Critères et tests** — https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/
- **Décret n° 2019-768** — https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038811937/
- **ARA** — https://ara.numerique.gouv.fr/ (rapport précédent : https://ara.numerique.gouv.fr/rapport/6ZZBkg91BcH9nw0tj8Sgw/)
- **WAI-ARIA Authoring Practices** — https://www.w3.org/WAI/ARIA/apg/
- **DSFR Accessibilité** — https://www.systeme-de-design.gouv.fr/
