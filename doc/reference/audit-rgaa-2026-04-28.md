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

| #   | Statut       | Date       | Notes                                                                                                                   |
| --- | ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ Corrigé   | 2026-04-28 | `Body` accepte `htmlTag` (défaut `'p'`) + 11 cas d'imbrication patchés en `htmlTag="div"`                               |
| 2   | ✅ Corrigé   | 2026-04-28 | `<button type="button">` + `aria-expanded` + `aria-controls` (parcours + iframe)                                        |
| 3   | ✅ Corrigé   | 2026-04-28 | Items en `<button>` + `aria-pressed` + resets DSFR (parcours + iframe)                                                  |
| 4   | ✅ Corrigé   | 2026-04-28 | Pattern ARIA Tabs complet (tablist/tab/tabpanel + flèches/Home/End + roving tabindex)                                   |
| 5   | ✅ Corrigé   | 2026-04-28 | 4 composants Tooltips + cursorVisualization → triggers focusables, classe `.tooltipTrigger` créée                       |
| 6   | ✅ Corrigé   | 2026-04-28 | `ariaLabel` dynamique sur MicroPieChart                                                                                 |
| 7   | ✅ Corrigé   | 2026-04-28 | Alt descriptif sur formule mathématique                                                                                 |
| 8   | ⏭️ Reporté   | —          | Placeholders temporaires (indicateurs forêt en cours de dev)                                                            |
| 9   | ✅ Corrigé   | 2026-04-28 | `:focus-visible` sur Boutons MUI + `matches(':focus-visible')` sur boutons natifs + outline visible sur input recherche |
| 10  | ⚠️ Substitué | 2026-04-28 | Pas de Breadcrumb (hors design) → `aria-current` sur MenuLateral à la place (couvre l'esprit du critère 12)             |
| 11  | ✅ Corrigé   | 2026-04-28 | `<table>` sémantique : `<caption>` + `<thead>/<tbody>` + `<th scope>` (parcours + iframe)                               |
| 12  | ✅ Corrigé   | 2026-04-28 | Override global dans `global.css` + transitions D3 conditionnées via `matchMedia` dans `roue.tsx`                       |

### Corrections complémentaires (audit ARA — critère 1)

| Test ARA      | Statut          | Date       | Notes                                                                                                                                             |
| ------------- | --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1         | ✅ Corrigé      | 2026-04-28 | `ariaLabel` ajouté sur 9 indicateurs `Micro*` + prop ajoutée à `MicroRemplissageTerritoire`                                                       |
| 1.1.2         | ✅ N/A          | —          | Aucune balise `<area>`                                                                                                                            |
| 1.1.3         | ✅ N/A          | —          | Aucun `<input type="image">`                                                                                                                      |
| 1.1.4         | ✅ N/A          | —          | Aucune image map serveur                                                                                                                          |
| 1.1.5         | ✅ Corrigé      | 2026-04-28 | SVG décoratifs (`BaseIcons`, `home/*Line`) → `aria-hidden`. SVG informatif `roue.tsx` → `role="img"` + `aria-label`                               |
| 1.1.6         | ✅ N/A          | —          | Aucune balise `<object type="image/...">`                                                                                                         |
| 1.1.7         | ✅ N/A          | —          | Aucune balise `<embed type="image/...">`                                                                                                          |
| 1.1.8         | ✅ Corrigé      | 2026-04-28 | Wrapper réutilisable `AccessibleMapWrapper` (`role="img"` + `aria-label`) appliqué aux 17 cartes MapLibre/Leaflet                                 |
| 1.2.1         | ✅ Conforme     | 2026-04-28 | Aucune image `alt=""` n'a d'`aria-label`/`title`/`aria-labelledby` parasite                                                                       |
| 1.2.2         | ✅ N/A          | —          | Aucune `<area>`                                                                                                                                   |
| 1.2.3         | ✅ N/A          | —          | Aucun `<object type="image">`                                                                                                                     |
| 1.2.4         | ✅ Conforme     | 2026-04-28 | Tous les SVG décoratifs ont `aria-hidden="true"` sans `<title>`/`<desc>` parasite                                                                 |
| 1.2.5         | ✅ N/A          | —          | Aucun `<canvas>` JSX décoratif (canvas MapLibre traités en 1.1.8, html2canvas off-screen)                                                         |
| 1.2.6         | ✅ N/A          | —          | Aucune `<embed>`                                                                                                                                  |
| 1.3.1         | ✅ Conforme     | 2026-04-28 | Toutes les alternatives textuelles des `<img>`/`role="img"` informatives sont pertinentes                                                         |
| 1.3.2 → 1.3.5 | ✅ N/A          | —          | Aucune `<area>`, `<input type="image">`, `<object>`, `<embed>`                                                                                    |
| 1.3.6         | ✅ Conforme     | 2026-04-28 | `aria-label` de la roue D3 pertinent et concis                                                                                                    |
| 1.3.7 → 1.3.8 | ✅ N/A          | —          | Aucun `<canvas>` JSX                                                                                                                              |
| 1.3.9         | ✅ Conforme     | 2026-04-28 | Alternatives concises (cartes : libellés un peu longs mais informatifs nécessaires)                                                               |
| 1.6.1         | ❌ Non conforme | 2026-04-28 | Une partie des cartes ne dispose pas de description détaillée accessible (voir détail ci-dessous)                                                 |
| 1.7.1         | 🟡 Partiel      | 2026-04-28 | Pour les cartes ayant une description détaillée (export XLSX), celle-ci est pertinente ; les autres cas relèvent du 1.6                           |
| 1.7.2 → 1.7.4 | ✅ N/A          | —          | Aucun `<input type="image">`, `<object>`, `<embed>`                                                                                               |
| 1.7.5         | 🟡 Partiel      | 2026-04-28 | Roue SVG : description partielle via panneau latéral, pertinente pour ce qu'elle décrit                                                           |
| 1.7.6         | ✅ N/A          | —          | Aucun `<canvas>` JSX                                                                                                                              |
| 1.8.1 → 1.8.6 | ✅ Conforme     | 2026-04-28 | Aucune image-texte informative (formule mathématique = cas particulier exclu, logos = cas particulier exclu, texte SVG = texte réel non concerné) |
| 1.9.1         | ✅ Corrigé      | 2026-04-28 | `<figure>` dans `transformationContenuArticles.tsx` : ajout `role="figure"` + `aria-label={caption}`                                              |
| 1.9.2 → 1.9.5 | ✅ N/A          | —          | Pas de `<object>`, `<embed>`, `<svg>`, `<canvas>` avec légende                                                                                    |
| 2.1           | ✅ Conforme     | 2026-04-28 | Les 3 `<iframe>` (statistiques Metabase) ont toutes un attribut `title="Tableau de bord stats"`. Aucune `<frame>` obsolète                        |
| 1.6.2 → 1.6.4 | ✅ N/A          | —          | Aucun `<object>`, `<embed>`, `<input type="image">`                                                                                               |
| 1.6.5         | 🟡 Partiel      | 2026-04-28 | Roue SVG : l'interaction (panneau latéral) fournit des éléments descriptifs mais pas une description détaillée structurée                         |
| 1.6.6         | 🟡 Test manuel  | —          | À valider avec NVDA/VoiceOver lors de la phase de tests AT                                                                                        |
| 1.6.7 → 1.6.8 | ✅ N/A          | —          | Aucun `<canvas>` JSX                                                                                                                              |
| 1.6.9         | ✅ N/A          | —          | Aucun usage d'`aria-describedby` sur images                                                                                                       |
| 1.6.10        | ❌ Non conforme | 2026-04-28 | Mêmes limitations que 1.6.1 sur les cartes wrappées avec `role="img"`                                                                             |

#### Note 1.6 — Non-conformité avec impact utilisateur **majeur**

Le critère 1.6 exige qu'une description détaillée soit disponible pour chaque image porteuse d'information riche (cartes choroplèthes, dataviz complexes). Sur Facili-TACCT, la situation est hétérogène :

**Trois cas de figure pour les cartes** :

1. **Cartes avec export XLSX des données sous-jacentes** (majorité — ~11 cartes) → ✅ Conforme.
   Le bouton `ExportButton` adjacent permet de télécharger un tableau de données par commune. Cela constitue le « bouton adjacent permettant d'accéder à la description détaillée » (test 1.6.1, condition 3).

2. **Cartes sans aucun export** (données privées, non redistribuables, ou agrégats non détaillables) → ❌ **Non conforme**.
   Aucune description détaillée n'est disponible. L'utilisateur de technologies d'assistance n'a pas accès aux données.

3. **Cartes alimentées par flux de tuiles vectorielles via API externes** (ex. WMS/WFS IGN, OCS GE, LCZ Cerema, BD HAIE) — 6 indicateurs concernés → ❌ **Non conforme**.
   Aucune donnée brute exportable côté application : seul un export **PNG** de la carte est proposé, qui n'est **pas accessible aux lecteurs d'écran** (image bitmap sans alternative textuelle exploitable).

    Indicateurs concernés :
    - `donnees/indicateurs/amenagement/2-LCZ.tsx`
    - `donnees/indicateurs/confortThermique/6-LCZ.tsx`
    - `donnees/indicateurs/foret/2-LineaireDeHaie.tsx`
    - `donnees/indicateurs/gestionDesRisques/3-ErosionCotiere.tsx`
    - `donnees/indicateurs/gestionDesRisques/5-Debroussaillement.tsx`
    - `donnees/indicateurs/sante/1-o3.tsx`

**Impact utilisateur : majeur.** Les utilisateurs aveugles, malvoyants ou utilisant des technologies d'assistance n'ont pas accès à l'information détaillée portée par ces cartes — qui est pourtant le cœur de la valeur informative de l'application.

**Pistes d'amélioration** (à intégrer au Lot 4 — Phase B) :

- **Cas 2 (sans export)** : ajouter un texte descriptif synthétique adjacent à la carte, qui restitue les données clés (ex : « X communes de votre territoire sont en zone d'aléa fort, principalement Y et Z ») ;
- **Cas 3 (flux API)** : étudier la possibilité de récupérer les données via les API WFS/GeoJSON pour produire un export tabulaire, ou à défaut fournir un texte descriptif synthétique.

### Corrections complémentaires (audit ARA — critère 3)

| Test ARA      | Statut          | Date       | Notes                                                                                                                                                                                                                                                                                                                                              |
| ------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1.1 → 3.1.3 | ✅ Conforme     | 2026-04-29 | Aucune information véhiculée uniquement par couleur de texte ou d'image — alternative texte adjacente présente (légendes graphiques, libellés dans `analyseSensibilite`, `blocConseils`, `cursorVisualization`)                                                                                                                                    |
| 3.1.4         | ❌ Non conforme | 2026-04-29 | `circleVisualization.tsx` (roue Patch4) : niveau d'aggravation des indices véhiculé uniquement via `backgroundColor` du cercle. Mitigation : `aria-label` enrichi sur le `<button>` → info accessible aux lecteurs d'écran. L'info reste non perçue par les utilisateurs voyants déficients en couleurs (pas de texte visible — contrainte design) |
| 3.1.5 → 3.1.6 | ✅ N/A          | —          | Aucun média temporel ou non temporel concerné                                                                                                                                                                                                                                                                                                      |
| 3.2.1 → 3.2.5 | ✅ Conforme     | 2026-04-29 | Couleurs de texte ≥ 4.5:1 sur fond blanc : `--principales-vert` #038278 (4.92:1), `--gris-dark` #666666 (5.74:1), texte par défaut #161616 (19.4:1). Cas limite isolé (`--gris-medium-dark` #7B7B7B → 4.34:1) dans `ThematiquesLieesNavigation.tsx:210` = safeguard jamais rendu → N/A                                                             |
| 3.3.1         | ✅ Conforme     | 2026-04-29 | Composants d'interface principalement DSFR/MUI                                                                                                                                                                                                                                                                                                     |
| 3.3.2         | ❌ Non conforme | 2026-04-29 | Cercles colorés de la roue Patch4 sur fond blanc — `#FFB181` (Aggravation forte) → 1.84:1 ; `#FFEBB6` (Aggravation modérée) → 1.13:1 ; `#FFFFFF` + bordure `--gris-medium` (Pas d'évolution) → 1.31:1. Seuil RGAA AA = 3:1. Conséquence : "Modérée" et "Pas d'évolution" indistinguables visuellement                                              |
| 3.3.3 → 3.3.4 | ✅ Conforme     | 2026-04-29 | Pas de couleurs contiguës contradictoires sur les éléments graphiques                                                                                                                                                                                                                                                                              |

### Corrections complémentaires (audit ARA — critère 5)

| Test ARA      | Statut      | Date       | Notes                                                                                        |
| ------------- | ----------- | ---------- | -------------------------------------------------------------------------------------------- |
| 5.1.1         | ✅ N/A      | 2026-04-29 | Tableau simple (3×2) — pas de complexité requérant un résumé                                 |
| 5.2.1         | ✅ N/A      | 2026-04-29 | Pas de tableau complexe                                                                      |
| 5.3.1         | ✅ N/A      | 2026-04-29 | Aucun tableau de mise en forme                                                               |
| 5.4.1         | ✅ Conforme | 2026-04-29 | `<caption className="fr-sr-only">` présent sur `blocConseils.tsx` (parcours + iframe)        |
| 5.5.1         | ✅ Conforme | 2026-04-29 | Caption "Actions à mener selon le niveau d'aggravation…" — pertinent et concis               |
| 5.6.1         | ✅ Conforme | 2026-04-29 | 3 `<th scope="col">` dans `<thead>`                                                          |
| 5.6.2         | ✅ Conforme | 2026-04-29 | 2 `<th scope="row">` dans `<tbody>`                                                          |
| 5.6.3 → 5.6.4 | ✅ N/A      | 2026-04-29 | Tous les en-têtes couvrent la totalité de leur ligne/colonne ; cellules de données en `<td>` |
| 5.7.1 → 5.7.2 | ✅ Conforme | 2026-04-29 | Tous les `<th>` ont `scope` avec valeur correcte (`col`/`row`)                               |
| 5.7.3 → 5.7.4 | ✅ N/A      | 2026-04-29 | Pas d'en-têtes partiels ; association via `scope` (pas via `id`/`headers`)                   |
| 5.8.1         | ✅ N/A      | 2026-04-29 | Aucun tableau de mise en forme                                                               |

> **Test manuel à prévoir :** `.tableauRow { display: grid }` appliqué aux `<tr>` (`patch4c.module.scss`) — vérifier que NVDA+Firefox restitue bien la structure de tableau.

### Corrections complémentaires (audit ARA — critère 6)

| Test ARA      | Statut      | Date       | Notes                                                                                        |
| ------------- | ----------- | ---------- | -------------------------------------------------------------------------------------------- |
| 6.1.1 → 6.1.5 | ✅ Conforme | 2026-04-29 | Tous les liens ont un intitulé explicite ; aucun `aria-label` contradictoire                 |
| 6.1.2 / 6.1.4 | ✅ N/A      | —          | Aucun lien image pur ni lien SVG pur                                                         |
| 6.2.1         | ✅ Corrigé  | 2026-04-29 | `ThematiquesLieesNavigation.tsx:181` — navigation JS remplacée par prop `link` → rendu `<a>` |

### Corrections complémentaires (audit ARA — critère 7)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 7.1 / 7.3 — Accordéons, tabs, tooltips, roue D3 | ✅ Corrigé | 2026-04-28 | Traités dans le Top 12 (critères 2, 3, 4, 5) |
| 7.1 / 7.3 — `CarteCollection.tsx` | ✅ Corrigé | 2026-04-29 | `role="link"` ajouté sur le `<div>` focusable |
| 7.1 / 7.3 — `SliderAnnees.tsx` | ✅ Corrigé | 2026-04-29 | `role="slider"` + `aria-valuemin/max/now` + `aria-label` ajoutés sur le thumb actif |
| 7.2 | ✅ N/A | — | Aucune alternative JS dans l'app |
| 7.4 | ✅ N/A | — | Redirection automatique vers dernier territoire — choix UX intentionnel |
| 7.5 — `Loader` / `LoaderText` | ✅ Corrigé | 2026-04-29 | `role="status"` + `aria-label` ajoutés sur les deux composants |

---

## Synthèse — Top 12 des points bloquants

| #   | Critère  | Localisation                                                                                                | Problème                                                                                             |
| --- | -------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | **9.1**  | `src/design-system/base/Textes.tsx`                                                                         | `<Body>` rend systématiquement un `<div>` → HTML invalide dans `<li><Body>` partout dans le parcours |
| 2   | **7.1**  | `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:74`                                      | Accordéon `<div onClick>` non focusable, sans `aria-expanded`                                        |
| 3   | **7.1**  | `src/app/(main)/(parcours)/patch4c/circleVisualization.tsx:60`                                              | Items cliquables `<div>` sans rôle, focus, ni clavier                                                |
| 4   | **7.1**  | `src/app/(main)/(parcours)/patch4c/components/blocAleas.tsx:113`                                            | Tabs sans `role="tablist/tab/tabpanel"` ni navigation flèches                                        |
| 5   | **7.1**  | `src/components/utils/Tooltips.tsx:100`, `src/app/(main)/(parcours)/patch4c/cursorVisualization.tsx:24`     | Tooltips MUI sur `<div>`/`<img>` non focusables → contenu inaccessible au clavier                    |
| 6   | **1.1**  | `src/app/(main)/(parcours)/donnees/indicateurs/agriculture/2-TypesDeCultures.tsx:52`                        | `ariaLabel=""` sur MicroPieChart                                                                     |
| 7   | **1.2**  | `src/app/(main)/(parcours)/patch4c/components/aleaExplications.tsx:124`                                     | Formule mathématique informative avec `alt=""`                                                       |
| 8   | **8.5**  | `src/app/(main)/(parcours)/donnees/indicateurs/foret/1-HauteurCanopee.tsx:40-51`, `2-LineaireDeHaie.tsx:35` | Contenu placeholder `TEST`, `COUCOU` rendu en production                                             |
| 9   | **10.7** | `src/design-system/base/Boutons.tsx:83,199`, `src/components/searchbar/BarreDeRecherche.tsx:129`            | `outline:none` au focus sans alternative `:focus-visible` CSS                                        |
| 10  | **12.7** | Toutes les pages parcours                                                                                   | Absence de fil d'Ariane (`Breadcrumb`)                                                               |
| 11  | **5.3**  | `src/app/(main)/(parcours)/patch4c/components/blocConseils.tsx:27-101`                                      | Tableau de données implémenté en `<div>` CSS Grid (pas de `<table>`)                                 |
| 12  | **13.8** | Tous les `.module.scss` + transitions D3                                                                    | Aucune animation ne respecte `prefers-reduced-motion`                                                |

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

## Tests manuels

Non couverts par les outils automatiques.

### Validateurs

- **W3C HTML Validator** — https://validator.w3.org/ (détecte structures invalides type `<li><div>`)

---

## Documentation de référence

- **RGAA 4.1 officiel** — https://accessibilite.numerique.gouv.fr/
- **WAI-ARIA Authoring Practices** — https://www.w3.org/WAI/ARIA/apg/ (patterns ARIA officiels : tabs, modales, menus, accordéons, etc.)
- **DSFR Accessibilité** — https://www.systeme-de-design.gouv.fr/ (composants déjà conformes — à privilégier)
- **WCAG 2.1** — https://www.w3.org/TR/WCAG21/ (référentiel international, base du RGAA)

---
