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

### Corrections complémentaires (audit ARA — critère 8)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 8.1.1 → 8.1.3 — DOCTYPE | ✅ Conforme | 2026-04-29 | Géré automatiquement par Next.js |
| 8.2.1 — Code source valide | ✅ Corrigé | 2026-04-29 | `<div>` → `<span>` dans `BoutonPrimaireClassic` / `BoutonSecondaireClassic` / `MenuLateral` ; IDs avec espaces slugifiés (13 fichiers) ; `subAccordionGraph` : IDs dynamiques + `<p>` → `<span>` ; `encodeURIComponent` sur params URL dans `Redirections.ts` ; `role="img"` sur `MicroDataviz` wrapper. NC résiduelle : `<style>` injecté dans `<body>` par MUI/Emotion (tiers, non corrigeable) |
| 8.3.1 — Langue par défaut | ✅ Conforme | 2026-04-29 | `<html lang="fr">` présent |
| 8.4.1 — Code de langue pertinent | ✅ Conforme | 2026-04-29 | Code "fr" valide |
| 8.5.1 — Titre présent | ✅ Conforme | 2026-04-29 | `sharedMetadata.default` = "Facili-TACCT" sur toutes les pages |
| 8.6.1 — Titre pertinent | ✅ Corrigé | 2026-04-29 | `metadata.title` ajouté sur 5 pages : "Explorer les données", "Diagnostiquer les impacts", "Vue systémique", "Rechercher mon territoire" (×2) |
| 8.7.1 — Changements de langue | ✅ Corrigé | 2026-04-29 | `alt="Toggle menu"` remplacé par texte français dans `MenuLateral.tsx` |
| 8.8.1 | ✅ N/A | — | Aucun autre changement de langue |
| 8.9.1 — Balises présentatives | ✅ Conforme | 2026-04-29 | `<b>` = emphase sémantique sur statistiques ; `<br>` dans corps de texte = acceptable |
| 8.10.1 → 8.10.2 — Sens de lecture | ✅ N/A | — | Aucun contenu RTL |

> **NC résiduelle non corrigeable :** `<style data-emotion>` injecté dans `<body>` par MUI/Emotion — comportement du moteur CSS-in-JS tiers.

### Corrections complémentaires (audit ARA — critère 9)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 9.1.1 — Hiérarchie pertinente | ✅ Corrigé | 2026-04-29 | `roue.tsx` : `<H1>` décoratif (opacity:0 à l'interaction) remplacé par `<p>` ; `<h1 className="fr-sr-only">Roue des thématiques</h1>` ajouté hors conteneur SVG — H1 stable, pertinent, toujours dans le DOM |
| 9.1.2 — Contenu des titres pertinent | ✅ Conforme | 2026-04-29 | Tous les titres `<hx>` ont un contenu explicite et descriptif |
| 9.1.3 — Passages de texte = titres structurés en hx | ✅ Arbitré | 2026-04-29 | `aleaExplications.tsx` et `blocAleas.tsx` : textes en `<Body>` à fort style visuel — arbitrés comme **labels contextuels** (nom du territoire, label de section secondaire), pas comme titres de section au sens RGAA. Pas d'action requise. |
| 9.2.1 — Structure header/nav/main/footer | ✅ Conforme | 2026-04-29 | `<header>` (DSFR), `<main id="contenu">`, `<footer id="footer" role="contentinfo">`, `<nav aria-label="Navigation dans la page">` présents. `role="navigation"` redondant supprimé de `MenuLateral.tsx` |
| 9.3.1 — Listes non ordonnées | ✅ Corrigé | 2026-04-29 | `MenuLateral.tsx` : menus `sousCategories` (étape 1) et items impacts (étape 2) convertis en `<ul>/<li>` avec `list-style: none` — visuel inchangé |
| 9.3.1 — Listes non ordonnées (bonne pratique) | ✅ Corrigé | 2026-04-29 | `ThematiquesLieesNavigation.tsx` : layout radial converti en `<ul>/<li>` — non obligatoire au titre du 9.3 (pas une liste visuelle), appliqué comme bonne pratique AT (annonce "liste de N éléments" aux lecteurs d'écran) |
| 9.3.2 — Listes ordonnées | ✅ N/A | — | Aucune liste ordonnée dans le périmètre |
| 9.3.3 — Listes de description | ✅ N/A | — | Aucune liste de description dans le périmètre |
| 9.4.1 — Citations courtes | ✅ N/A | — | Aucune citation de tiers dans le périmètre |
| 9.4.2 — Blocs de citation | ✅ N/A | — | Aucun bloc de citation dans le périmètre |

> **Arbitrage 9.1.1 — `SousTitre2` dans `MenuLateral`** : les `<SousTitre2>` (rendus en `<p>`) structurent des catégories de navigation dans un `<nav>`. Ils ne constituent pas des titres de page au sens RGAA : ils sont dans une zone de navigation secondaire, non dans le contenu principal. Pas d'action requise.

### Corrections complémentaires (audit ARA — critère 10)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 10.1.1 — Balises présentationnelles | ✅ Conforme | 2026-04-30 | Aucune balise `<font>`, `<center>`, `<marquee>`, `<strike>` etc. dans le périmètre |
| 10.1.2 — Attributs présentationnels | ✅ Conforme | 2026-04-30 | Aucun attribut `bgcolor`, `align`, `border` sur tableaux, etc. |
| 10.1.3 — Espaces de présentation | ✅ Conforme | 2026-04-30 | Aucun `&nbsp;` répétés, pas d'espaces simulant tableaux ou colonnes |
| 10.2.1 — Information présente sans CSS | ❌ Non conforme | 2026-04-30 | Menu latéral masqué sans CSS (positionné en absolu, contenu non restitué). NC inhérente à l'architecture React/CSS de l'application — non corrigeable sans refonte structurelle |
| 10.3.1 — Information compréhensible sans CSS | ❌ Non conforme | 2026-04-30 | Pages `/thematiques`, `/donnees`, `/impacts` : ordre de lecture et structure incohérents sans styles. Même cause que 10.2 — application fortement CSS-dépendante (D3, positionnements absolus, SVG) |
| 10.4.1 → 10.4.2 — Zoom 200% sans perte | ✅ Conforme | 2026-04-30 | Testé au zoom graphique navigateur (200%) : aucune perte d'information, aucun texte tronqué ou chevauché. Condition RGAA satisfaite (zoom graphique = condition suffisante). Labels SVG des graphiques Nivo : scalés proportionnellement avec le conteneur SVG |
| 10.4 — Tailles en `px` → `rem` (bonne pratique) | ✅ Corrigé | 2026-04-30 | `Textes.tsx` et `Boutons.tsx` : toutes les tailles `px` converties en `rem` (`12px`→`0.75rem`, `14px`→`0.875rem`, `16px`→`1rem`, `18px`→`1.125rem`, `20px`→`1.25rem`) — améliore la compatibilité avec le zoom texte seul (Firefox) |
| 10.5.1 → 10.5.3 — Déclarations CSS couleurs | ✅ Conforme | 2026-04-30 | Déclarations `color`/`background-color` toujours couplées dans les styles inline ; composants DSFR et MUI gèrent leur propre association couleur texte/fond — aucun cas isolé détecté dans le périmètre |
| 10.6.1 — Liens distinguibles | ✅ Conforme | 2026-04-30 | Aucun lien texte distingué uniquement par couleur : liens DSFR soulignés par défaut, éléments de navigation implémentés en `<button>` (hors critère 10.6) |
| 10.7.1 — Prise de focus visible | 🟡 Partiel | 2026-04-30 | Boutons MUI (`BoutonPrimaireClassic`, `BoutonSecondaireClassic`) et boutons natifs : ✅ `:focus-visible` appliqué. **Header — barre de recherche** : ❌ NC — composant compound (DSFR `SearchBar` + MUI `Select` + MUI `Autocomplete`) empilant trois systèmes de styles ; la suppression du `box-shadow` DSFR injecté sur `:focus` provoque une régression visuelle au survol. Navigation clavier de `SelectTypeTerritoire` corrigée (délai `onOpen` supprimé pour les événements clavier) |
| 10.8.1 — Contenus cachés | ✅ Corrigé | 2026-04-30 | `roue.tsx` : `aria-hidden={!!selectedThematique}` ajouté sur le texte central masqué par `opacity:0` — retiré de l'arbre AT quand invisible. `MenuLateral.tsx` : contenu collapsé géré par rendu conditionnel (`{isContentVisible && ...}`) — déjà hors du DOM, aucune action requise |
| 10.9.1 → 10.9.4 — Information non donnée par forme/taille/position | ✅ Conforme | 2026-04-30 | Tous les éléments interactifs significatifs disposent d'un `aria-label` ou d'un texte adjacent : `circleVisualization` (aria-label par item), `cursorVisualization` (aria-label), roue D3 (aria-label sur SVG + boutons), icônes MenuLateral (alt dynamique sur image interne) |
| 10.10.1 → 10.10.4 — Implémentation pertinente | ✅ Conforme | 2026-04-30 | Même périmètre que 10.9 — alternatives textuelles pertinentes et non redondantes |
| 10.11.1 → 10.11.2 — Pas de scroll horizontal à 320px / vertical à 256px | ❌ Non conforme | 2026-04-30 | Application SPA orientée desktop. `HeaderRechercheTerritoire` : largeur calculée jusqu'à 640px. `MenuLateral` : 322px par défaut. Visualisations D3/cartes : **exemptées** (médias nécessitant deux dimensions). Refonte mobile prévue — voir plan ci-dessous |
| 10.12.1 — Espacement texte redéfinissable | ✅ Corrigé | 2026-04-30 | `components.module.scss` : `height` → `min-height` sur `.headerSearchBarContainer` ; `.unselected`/`.selected` (`height: 90px`) et `.searchbarWrapper` conformes en l'état (hauteur largement suffisante pour une ligne de texte, input non clippé) ; `line-height` px → relatifs sur `.localisation` (1.5), `.selectedTabButton`/`.tabButton` (1.25), `.indiceLeft p` (1.2). `roue.tsx` SVG : `overflow: visible` ajouté — labels D3 non clippés si espacement forcé |
| 10.13.1 → 10.13.3 — Contenus additionnels contrôlables | ✅ Conforme | 2026-04-30 | MUI Tooltip v5 interactif par défaut (`disableInteractive: false`) — le pointeur peut entrer dans le tooltip sans qu'il disparaisse (10.13.2). Tooltip reste visible tant que le pointeur/focus est sur le déclencheur ou le tooltip (10.13.3). 10.13.1 non applicable : les tooltips n'occultent pas de contenu porteur d'information |
| 10.14.1 → 10.14.2 — Contenus CSS-only visibles au clavier | ✅ N/A | 2026-04-30 | Aucun contenu additionnel déclenché via CSS seul dans le périmètre — tous les affichages conditionnels sont pilotés par l'état React (JS). Les effets visuels `:hover { transform: scale() }` ne constituent pas des « contenus additionnels » au sens du critère |

> **NC résiduelle 10.2 / 10.3 :** Non-conformités acceptées. L'application est une Single Page Application React dont la structure repose entièrement sur CSS pour le positionnement, la visibilité et l'ordre du contenu. Une mise en conformité complète nécessiterait une refonte de l'architecture de mise en page, hors périmètre du projet.

> **NC résiduelle 10.7 — Header barre de recherche :** Voir justification ARA ci-dessous.

> **NC résiduelle 10.11 — Plan de refonte mobile :** À traiter lors du sprint mobile prévu. Éléments à adapter : (1) `HeaderRechercheTerritoire` — réduire la largeur calculée à 100% sous 640px, empiler verticalement Select + input ou masquer le composant sur mobile ; (2) `MenuLateral` — collapse automatique par défaut sous 400px ou conversion en menu drawer overlay ; (3) tous les conteneurs non-exemptés avec `width` fixe > 320px dans `(parcours)`. Les visualisations D3, cartes MapLibre et tableaux de données restent exemptés par RGAA (médias nécessitant deux dimensions).

### Corrections complémentaires (audit ARA — critère 11)

| Test ARA | Statut | Date | Notes |
| -------- | ------ | ---- | ----- |
| 11.1 → 11.4 — SearchBar, RadioButtons, SliderAnnees | ✅ Conforme | 2026-04-30 | DSFR SearchBar : `<label htmlFor>` chaîné au `<input>` MUI via l'`id` passé au `renderInput`. RadioButtons DSFR : labels et accolement gérés nativement. `SliderAnnees` : `aria-label="Année sélectionnée"`. Étiquettes pertinentes et cohérentes entre les deux pages de recherche |
| 11.1.1 / 11.1.3 — `SelectTypeTerritoire` | ❌ Non conforme | 2026-04-30 | `inputProps['aria-label']` cible l'`<input>` caché, pas le `role="combobox"` visible — pas de nom accessible fiable sur l'élément interactif. NC résiduelle : correction via `<FormControl>` + `<InputLabel className="fr-sr-only">` testée, provoque une régression visuelle (largeur tronquée). Hors périmètre sans refonte du header |
| 11.5.1 | ✅ Conforme | 2026-04-30 | `<fieldset>` rendu par DSFR RadioButtons |
| 11.6.1 | ✅ Corrigé | 2026-04-30 | `legend="Type de territoire"` + `classes={{ legend: "fr-sr-only" }}` ajoutés sur `<RadioButtons>` dans `BarreDeRecherche.tsx` |
| 11.7.1 | ✅ Conforme | 2026-04-30 | Légende "Type de territoire" pertinente |
| 11.8.1 → 11.8.3 | ✅ N/A | 2026-04-30 | Aucun `<select>` natif ; MUI Select non-natif avec 5 options homogènes, pas de sous-groupement nécessaire |
| 11.9.1 | ✅ Corrigé | 2026-04-30 | `BoutonRechercherHeader` : `<Image onClick>` remplacé par `<button aria-label="Rechercher ce territoire">` avec image décorative (`aria-hidden="true"`) dans `header/BoutonRechercher.tsx` |
| 11.10.1 → 11.10.7 | ✅ N/A | 2026-04-30 | Formulaire à un seul champ de saisie libre — cas particulier applicable |
| 11.11.1 → 11.11.2 | ✅ N/A | 2026-04-30 | Aucune validation de saisie avec messages d'erreur |
| 11.12.1 → 11.12.2 | ✅ N/A | 2026-04-30 | Formulaire de recherche sans modification/suppression de données |
| 11.13.1 | ✅ N/A | 2026-04-30 | Aucun champ collectant des données personnelles |

> **NC résiduelle 11.1.1 / 11.1.3 — `SelectTypeTerritoire`** (`src/components/searchbar/header/SelectTypeTerritoire.tsx`) : La correction canonique (`<FormControl>` + `<InputLabel className="fr-sr-only">`) a été testée et produit une régression visuelle — le Select perd son sizing automatique basé sur le contenu, entraînant une troncature du texte. Correction sans régression impossible sans refonte du composant header. Mitigation en place : `inputProps['aria-label']` sur l'input caché, partiellement lu par certains AT. Impact utilisateur : modéré — le Select reste utilisable mais son rôle n'est pas annoncé explicitement.

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
