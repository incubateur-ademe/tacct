# Audit RGAA — Parcours Facili-TACCT

**Date :** 2026-04-28
**Périmètre :** `src/app/(main)/(parcours)` et composants exploités
**Référentiel :** RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité)
**Méthode prévue :** ARA (Accessibility Reporting Assistant — DINUM)

---

## Sommaire

1. [Avancement des corrections](#avancement-des-corrections)
2. [Synthèse — Top 12 des points bloquants](#synthèse--top-12-des-points-bloquants)
3. [Détail par critère RGAA](#détail-par-critère-rgaa)
4. [Plan de correction priorisé](#plan-de-correction-priorisé)
5. [Outils pour réaliser l'audit](#outils-pour-réaliser-laudit)
6. [Tests manuels indispensables](#tests-manuels-indispensables)
7. [Documentation de référence](#documentation-de-référence)

---

## Avancement des corrections

Dernière mise à jour : 2026-04-28.

| #   | Statut         | Date       | Notes                                                                                                            |
| --- | -------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ Corrigé      | 2026-04-28 | `Body` accepte `htmlTag` (défaut `'p'`) + 11 cas d'imbrication patchés en `htmlTag="div"`                        |
| 2   | ✅ Corrigé      | 2026-04-28 | `<button type="button">` + `aria-expanded` + `aria-controls` (parcours + iframe)                                 |
| 3   | ✅ Corrigé      | 2026-04-28 | Items en `<button>` + `aria-pressed` + resets DSFR (parcours + iframe)                                           |
| 4   | ✅ Corrigé      | 2026-04-28 | Pattern ARIA Tabs complet (tablist/tab/tabpanel + flèches/Home/End + roving tabindex)                            |
| 5   | ✅ Corrigé      | 2026-04-28 | 4 composants Tooltips + cursorVisualization → triggers focusables, classe `.tooltipTrigger` créée                |
| 6   | ✅ Corrigé      | 2026-04-28 | `ariaLabel` dynamique sur MicroPieChart                                                                          |
| 7   | ✅ Corrigé      | 2026-04-28 | Alt descriptif sur formule mathématique                                                                          |
| 8   | ⏭️ Reporté     | —          | Placeholders temporaires (indicateurs forêt en cours de dev)                                                     |
| 9   | ✅ Corrigé      | 2026-04-28 | `:focus-visible` sur Boutons MUI + `matches(':focus-visible')` sur boutons natifs + outline visible sur input recherche |
| 10  | ⚠️ Substitué   | 2026-04-28 | Pas de Breadcrumb (hors design) → `aria-current` sur MenuLateral à la place (couvre l'esprit du critère 12)      |
| 11  | ✅ Corrigé      | 2026-04-28 | `<table>` sémantique : `<caption>` + `<thead>/<tbody>` + `<th scope>` (parcours + iframe)                         |
| 12  | ✅ Corrigé      | 2026-04-28 | Override global dans `global.css` + transitions D3 conditionnées via `matchMedia` dans `roue.tsx`                 |

### Corrections complémentaires (audit ARA — critère 1)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 1.1.1 | ✅ Corrigé | 2026-04-28 | `ariaLabel` ajouté sur 9 indicateurs `Micro*` + prop ajoutée à `MicroRemplissageTerritoire` |
| 1.1.2 | ✅ N/A | — | Aucune balise `<area>` |
| 1.1.3 | ✅ N/A | — | Aucun `<input type="image">` |
| 1.1.4 | ✅ N/A | — | Aucune image map serveur |
| 1.1.5 | ✅ Corrigé | 2026-04-28 | SVG décoratifs (`BaseIcons`, `home/*Line`) → `aria-hidden`. SVG informatif `roue.tsx` → `role="img"` + `aria-label` |
| 1.1.6 | ✅ N/A | — | Aucune balise `<object type="image/...">` |
| 1.1.7 | ✅ N/A | — | Aucune balise `<embed type="image/...">` |
| 1.1.8 | ✅ Corrigé | 2026-04-28 | Wrapper réutilisable `AccessibleMapWrapper` (`role="img"` + `aria-label`) appliqué aux 17 cartes MapLibre/Leaflet |

---

## Synthèse — Top 12 des points bloquants

| # | Critère | Localisation | Problème |
|---|---------|--------------|----------|
| 1 | **9.1** | `src/design-system/base/Textes.tsx` | `<Body>` rend systématiquement un `<div>` → HTML invalide dans `<li><Body>` partout dans le parcours |
| 2 | **7.1** | `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:74` | Accordéon `<div onClick>` non focusable, sans `aria-expanded` |
| 3 | **7.1** | `src/app/(main)/(parcours)/patch4c/circleVisualization.tsx:60` | Items cliquables `<div>` sans rôle, focus, ni clavier |
| 4 | **7.1** | `src/app/(main)/(parcours)/patch4c/components/blocAleas.tsx:113` | Tabs sans `role="tablist/tab/tabpanel"` ni navigation flèches |
| 5 | **7.1** | `src/components/utils/Tooltips.tsx:100`, `src/app/(main)/(parcours)/patch4c/cursorVisualization.tsx:24` | Tooltips MUI sur `<div>`/`<img>` non focusables → contenu inaccessible au clavier |
| 6 | **1.1** | `src/app/(main)/(parcours)/donnees/indicateurs/agriculture/2-TypesDeCultures.tsx:52` | `ariaLabel=""` sur MicroPieChart |
| 7 | **1.2** | `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:124` | Formule mathématique informative avec `alt=""` |
| 8 | **8.5** | `src/app/(main)/(parcours)/donnees/indicateurs/foret/1-HauteurCanopee.tsx:40-51`, `2-LineaireDeHaie.tsx:35` | Contenu placeholder `TEST`, `COUCOU` rendu en production |
| 9 | **10.7** | `src/design-system/base/Boutons.tsx:83,199`, `src/components/searchbar/BarreDeRecherche.tsx:129` | `outline:none` au focus sans alternative `:focus-visible` CSS |
| 10 | **12.7** | Toutes les pages parcours | Absence de fil d'Ariane (`Breadcrumb`) |
| 11 | **5.3** | `src/app/(main)/(parcours)/patch4c/components/blocConseils.tsx:27-101` | Tableau de données implémenté en `<div>` CSS Grid (pas de `<table>`) |
| 12 | **13.8** | Tous les `.module.scss` + transitions D3 | Aucune animation ne respecte `prefers-reduced-motion` |

---

## Détail par critère RGAA

### Critère 1 — Images

#### 1.1 Micro-visualisations sans `ariaLabel`

Composants `MicroNumberCircle`, `MicroCube`, `MicroPieChart`, `MicroRemplissageTerritoire`, `MicroCircleGridMois` utilisés sans prop `ariaLabel` :

- `src/app/(main)/(parcours)/donnees/indicateurs/amenagement/1-ConsommationEspacesNAF.tsx:43`
- `src/app/(main)/(parcours)/donnees/indicateurs/biodiversite/2-SolsImpermeabilises.tsx:54`
- `src/app/(main)/(parcours)/donnees/indicateurs/biodiversite/6-AOT40.tsx:76`
- `src/app/(main)/(parcours)/donnees/indicateurs/eau/2-PrelevementsEnEau.tsx:178`
- `src/app/(main)/(parcours)/donnees/indicateurs/gestionDesRisques/1-ArretesCatnat.tsx:127`
- `src/app/(main)/(parcours)/donnees/indicateurs/gestionDesRisques/2-FeuxDeForet.tsx:41`
- `src/app/(main)/(parcours)/donnees/indicateurs/gestionDesRisques/6-Secheresses.tsx:41`
- `src/app/(main)/(parcours)/donnees/indicateurs/confortThermique/2-PrecariteEnergetique.tsx:92`
- `src/app/(main)/(parcours)/donnees/indicateurs/agriculture/5-AiresApellationsControlees.tsx:99`
- `src/app/(main)/(parcours)/impacts/thematiques/ImpactsAgriculture.tsx:58,96`
- `src/app/(main)/(parcours)/impacts/thematiques/ImpactsConfortThermique.tsx:65`

Cas particulier — `ariaLabel=""` (chaîne vide, équivalent à pas de description) :
- `src/app/(main)/(parcours)/donnees/indicateurs/agriculture/2-TypesDeCultures.tsx:52`

#### 1.2 Images informatives avec `alt=""`

- `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:124` — formule de calcul `patch4Formula` marquée comme décorative
- `src/app/(main)/(parcours)/donnees/indicateurs/gestionDesRisques/2-FeuxDeForet.tsx:79-84` — `GraphNotFound` (image de remplacement principale)

#### 1.1 SVG sans `role="img"` ni `<title>`

- `src/app/(main)/(parcours)/thematiques/components/roue.tsx` — racine SVG D3
- `src/app/(main)/(parcours)/patch4c/circleVisualization.tsx`
- `src/app/(main)/(parcours)/patch4c/cursorVisualization.tsx`
- `src/design-system/base/BaseIcons.tsx` — `ChevronDownIcon` sans `aria-hidden`

#### 1.1 Cartes sans alternative textuelle

- `src/app/(main)/(parcours)/patch4c/components/Patch4Maps.tsx` — données choroplèthes MapLibre

---

### Critère 3 — Couleurs

- `src/app/(main)/(parcours)/patch4c/cursorVisualization.tsx` — barre dégradée blanc→jaune→orange→rouge sans alternative structurée
- `src/app/(main)/(parcours)/patch4c/components/analyseSensibilite.tsx:85-125` — cercles colorés sans `aria-label` ni `aria-hidden="true"`
- Variable CSS `--gris-dark` à vérifier (contraste possiblement < 4.5:1 sur `Body size="sm"`)

---

### Critère 5 — Tableaux

- `src/app/(main)/(parcours)/patch4c/components/blocConseils.tsx:27-101` — grille CSS faisant office de tableau de données comparatif (Aggravation forte vs très forte × exposition vs sensibilité) sans `<table>`/`<caption>`/`<th scope>`

---

### Critère 6 — Liens

#### 6.5 `target="_blank"` sans avertissement

- `src/app/(main)/(parcours)/patch4c/components/analyseSensibilite.tsx:208`
- `src/app/(main)/(parcours)/patch4c/indicesDetail.tsx:63`
- `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:127`
- `src/app/(main)/(parcours)/donnees/indicateurs/amenagement/2-LCZ.tsx:78`
- `src/app/(main)/(parcours)/donnees/indicateurs/confortThermique/6-LCZ.tsx:79`

#### 6.1 Lien implémenté en JS au lieu de `<a>`

- `src/app/(main)/(parcours)/impacts/components/ThematiquesLieesNavigation.tsx:181` — navigation via `onClick`+`window.location.href`

---

### Critère 7 — Scripts (LE PLUS CRITIQUE)

#### 7.1 / 7.3 Composants interactifs non accessibles au clavier

- `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:74-90` — accordéon `<div onClick>`
- `src/app/(main)/(parcours)/patch4c/circleVisualization.tsx:60-98` — items `<div>` cliquables
- `src/app/(main)/(parcours)/thematiques/components/panneauLateral.tsx:63` — bouton fermeture `×` sans `aria-label`

#### 7.1 / 7.2 Tabs sans pattern ARIA

- `src/app/(main)/(parcours)/patch4c/components/blocAleas.tsx:113-155` — manque `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, navigation flèches gauche/droite

#### 7.1 Tooltips non accessibles au clavier

- `src/components/utils/Tooltips.tsx:100-162` — `CustomTooltipNouveauParcours`, `HtmlTooltip`, `DefinitionTooltip` enveloppent des `<div>`/`<span>`/`<img>` non focusables
- `src/app/(main)/(parcours)/patch4c/cursorVisualization.tsx:24-33` — tooltip sur `<Image>` (non focusable)
- `src/app/(main)/(parcours)/thematiques/components/roue.tsx:553-573` — tooltip sur `<div>` vide

#### 7.1 / 7.2 MenuLateral

- `src/components/ui/MenuLateral.tsx:248-265,323-341` — accordéons sans `aria-expanded`/`aria-controls`
- `src/components/ui/MenuLateral.tsx:282-292,344-357` — pas d'`aria-current` sur l'item actif
- `src/components/ui/MenuLateral.tsx:207-222` — `title` HTML au lieu d'`aria-label` ; `alt="Toggle menu"` en anglais

#### 7.1 Roue D3

- `src/app/(main)/(parcours)/thematiques/components/roue.tsx` — instrumentation ARIA correcte (role/aria-label/aria-pressed/tabindex/keyDown), mais perte de focus à chaque re-render complet du SVG

---

### Critère 8 — Éléments obligatoires

- `src/app/layout.tsx:16` — `title=""` invalide sur `<html>`
- Pages sans `metadata.title` dédié :
  - `src/app/(main)/(parcours)/donnees/page.tsx`
  - `src/app/(main)/(parcours)/impacts/page.tsx`
  - `src/app/(main)/(parcours)/thematiques/page.tsx`
  - `src/app/(main)/(parcours)/recherche-territoire/page.tsx`
  - `src/app/(main)/(parcours)/recherche-territoire-patch4/page.tsx`
- Contenu placeholder en production :
  - `src/app/(main)/(parcours)/donnees/indicateurs/foret/1-HauteurCanopee.tsx:40-51` — `<p>TEST</p>`, `<div>COUCOU</div>`
  - `src/app/(main)/(parcours)/donnees/indicateurs/foret/2-LineaireDeHaie.tsx:35` — texte brut `Linéraire de haie texte`

---

### Critère 9 — Structure sémantique

- `src/design-system/base/Textes.tsx:177` — `<Body>` produit des `<div>` au lieu de `<p>` (HTML invalide dans `<li>`)
- `src/app/(main)/(parcours)/thematiques/components/roue.tsx:592` — `<H1>` dans overlay SVG sans H1 page
- Pas de hiérarchie de titres (h2/h3) dans `BlocAleas`, `AleaExplications`
- `src/components/ui/MenuLateral.tsx:275,297` — `<SousTitre2>` (`<p>`) utilisé visuellement comme h3

---

### Critère 10 — Présentation

- `src/design-system/base/Boutons.tsx:83,199,297,351` — `outline:none` au focus sans `:focus-visible` CSS natif
- `src/components/searchbar/BarreDeRecherche.tsx:129,153` — idem sur l'input de recherche
- Tailles texte en `px` non redimensionnables :
  - `src/design-system/base/Textes.tsx:181` — `12px` (xs), `14px` (sm)
  - `src/design-system/base/Boutons.tsx:42` — idem
  - `src/app/(main)/(parcours)/patch4c/components/blocConseils.tsx:13` — `fontSize:22`
  - `src/app/(main)/(parcours)/patch4c/components/analyseSensibilite.tsx:61` — `fontSize:22`
  - `src/app/(main)/(parcours)/impacts/components/associerLesActeurs.tsx:17` — `fontSize:22`
- `src/app/(main)/(parcours)/thematiques/page.tsx:18-27` — scrollbar globalement masquée

---

### Critère 11 — Formulaires

- `src/components/searchbar/renderInput.tsx:14` — input recherche sans `<label>` explicite
- `src/components/searchbar/BarreDeRecherche.tsx:64` — `RadioButtons` désactivés via tooltip CSS pseudo-element non lu par AT
- `src/app/(main)/(parcours)/patch4c/components/blocAleas.tsx:113` — onglets non ARIA-conformes

---

### Critère 12 — Navigation

- **Aucun fil d'Ariane** dans tout le parcours (`Breadcrumb` absent sur toutes les pages)
- `src/app/(main)/layout.tsx:30-35` — skip link `#contenu` pointe vers `<main>` qui contient d'abord le `<MenuLateral>` fixe (cible inefficace)
- `src/components/ui/MenuLateral.tsx:282,344` — pas d'`aria-current` sur l'item actif
- `src/app/(main)/(parcours)/thematiques/components/roue.tsx` — pas de fallback `<noscript>` ou liste de liens HTML

---

### Critère 13 — Consultation

#### 13.8 `prefers-reduced-motion` non respecté

- `src/app/(main)/(parcours)/thematiques/roue.module.scss:2-7,71`
- `src/app/(main)/(parcours)/patch4c/patch4c.module.scss:81,123,277,299-313`
- `src/app/(main)/(parcours)/thematiques/components/roue.tsx:386,397,426,437,587` — transitions D3
- `src/app/(main)/(parcours)/donnees/layout.tsx:14` — Tailwind `transition-all duration-500`

#### 13.6 Format/taille des exports non indiqués

- `src/components/exports/ExportButton.tsx:106` — bouton "Exporter" sans format (.xlsx)
- `src/app/(main)/(parcours)/patch4c/Patch4Analyse.tsx:64-71` — bouton ExportPng sans format

---

## Plan de correction priorisé

### Lot 1 — Quick wins (1-2 jours)

- [ ] ⏭️ Supprimer le contenu placeholder `TEST`/`COUCOU`/`Linéraire de haie texte` dans les indicateurs `foret/` *(reporté : indicateurs en cours de dev)*
- [ ] Ajouter `ariaLabel` sur tous les composants `Micro*` (~12 fichiers)
- [x] Corriger `ariaLabel=""` dans `2-TypesDeCultures.tsx:52`
- [ ] Ajouter `<span className="sr-only"> (nouvelle fenêtre)</span>` sur les 5 liens `target="_blank"`
- [ ] Ajouter `aria-label="Fermer le panneau"` sur le bouton `×` de `panneauLateral.tsx:63`
- [x] Renseigner `alt` correct sur `patch4Formula` (formule informative)
- [ ] Supprimer `title=""` invalide sur `<html>` dans `src/app/layout.tsx:16`
- [ ] Ajouter `metadata.title` dédié sur chaque page parcours

### Lot 2 — Refactor design system (3-5 jours)

- [x] Modifier `<Body>` (`src/design-system/base/Textes.tsx`) pour accepter `htmlTag` (par défaut `'p'`)
- [x] Remplacer `outline: none` JS par CSS `:focus-visible` natif dans `Boutons.tsx` et `BarreDeRecherche.tsx`
- [ ] Convertir les `12px`/`14px`/`fontSize:22` en `rem`
- [ ] Ajouter une feuille de style globale respectant `@media (prefers-reduced-motion: reduce)`
- [ ] Conditionner les transitions D3 (`roue.tsx`) via `window.matchMedia('(prefers-reduced-motion: reduce)')`

### Lot 3 — Composants interactifs critiques (5-7 jours)

- [x] Refactorer l'accordéon `aleaExplications.tsx` en `<button aria-expanded>`
- [x] Refactorer `circleVisualization.tsx` items en `<button>` avec `aria-pressed`
- [x] Refactorer `blocAleas.tsx` en pattern ARIA tabs complet (tablist/tab/tabpanel/flèches/Home/End)
- [x] Refactorer `Tooltips.tsx` pour ne wrapper que des éléments focusables (`<button>` par défaut)
- [x] Ajouter `aria-expanded`/`aria-controls` sur les accordéons `MenuLateral.tsx`
- [x] Ajouter `aria-current="page"` sur l'item actif du `MenuLateral.tsx`
- [ ] Gérer le retour de focus après re-render SVG dans `roue.tsx`
- [ ] Convertir `blocConseils.tsx` en `<table>` sémantique

### Lot 4 — Navigation et structure (2-3 jours)

- [ ] ⚠️ ~~Ajouter un `<Breadcrumb>` DSFR sur chaque page du parcours~~ *(hors design — substitué par `aria-current` sur MenuLateral, fait dans Lot 3)*
- [ ] Réorganiser le DOM pour que le contenu principal précède le `MenuLateral` fixe (ou ajouter un second skip link `#contenu-thematique`)
- [ ] Ajouter un `role="img"` + `<title>` sur le SVG racine de la roue D3
- [ ] Ajouter une alternative textuelle aux cartes `Patch4Maps`
- [ ] Indiquer le format dans les libellés des boutons d'export (`.xlsx`, `.png`)

### Lot 5 — Audit professionnel final (5-10 j·h externe)

- [ ] Faire valider par un cabinet certifié RGAA
- [ ] Publier la déclaration d'accessibilité officielle
- [ ] Mettre en place un suivi récurrent

---

## Tests manuels

Représentent ~50 % de l'audit RGAA — non couverts par les outils automatiques.

### Validateurs

- **W3C HTML Validator** — https://validator.w3.org/ (détecte structures invalides type `<li><div>`)

---

## Documentation de référence

- **RGAA 4.1 officiel** — https://accessibilite.numerique.gouv.fr/
- **WAI-ARIA Authoring Practices** — https://www.w3.org/WAI/ARIA/apg/ (patterns ARIA officiels : tabs, modales, menus, accordéons, etc.)
- **DSFR Accessibilité** — https://www.systeme-de-design.gouv.fr/ (composants déjà conformes — à privilégier)
- **WCAG 2.1** — https://www.w3.org/TR/WCAG21/ (référentiel international, base du RGAA)

---
