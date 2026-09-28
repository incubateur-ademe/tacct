# Repères factuels sur le corpus

Ce fichier contient uniquement des **constats mesurés** sur les textes en ligne en septembre 2026. Il ne donne ni règle de style, ni interprétation. Il sert à repérer rapidement les textes et à vérifier les ordres de grandeur. **Il ne remplace pas la lecture intégrale du corpus** (étape 2 du skill). Si le code a évolué, c'est le code qui fait foi.

## Où se trouve chaque bloc

| Bloc | Fichier | Forme dans le code |
|---|---|---|
| Titre (H3) | `src/app/(main)/(parcours)/donnees/thematiques/<theme>/Donnees<Theme>.tsx` | `<H3>` dans le `div` d'ancre de l'indicateur |
| Libellé court (menu) | `src/app/(main)/(parcours)/thematiques/constantes/textesThematiques.tsx` | `sousCategories` |
| Chiffre dynamique | `src/lib/textesIndicateurs/*.tsx` ou directement dans le composant d'indicateur | `<Body weight="bold">`, à côté de la micro-dataviz |
| « D'où vient ce chiffre ? » | `src/lib/tooltipTexts.tsx` | `<Body weight="bold" size="sm">` |
| Texte d'analyse | `src/lib/staticTexts.tsx` | un ou plusieurs `<Body size="sm">` |
| Définitions au survol | `src/lib/definitions.tsx` | appelées via `DefinitionTooltip` |
| Sources d'études numérotées | `src/lib/sources.ts` | appelées via `ScrollToSourceTag` |

## Correspondance entre indicateurs et textes

| Composant d'indicateur | Texte d'analyse | « D'où vient ce chiffre ? » | Chiffre dynamique |
|---|---|---|---|
| agriculture/1-ChefsExploitationSeniors | – | – | `PartExploitationSeniorsDynamicText` |
| agriculture/2-TypesDeCultures | `SurfacesAgricolesText` | `surfacesAgricolesTooltipText` | inline |
| agriculture/3-SuperficiesIrriguees | `SurfacesIrrigueesText` | `surfacesIrrigueesTooltipText` | inline |
| agriculture/4-SurfacesEnBio | `SurfacesEnBioAgricultureText` | `agricultureBioTooltipText` | inline |
| agriculture/5-AiresApellationsControlees | `AiresAppellationsControleesText` | `airesAppellationsControleesTooltipText` | inline |
| amenagement/1-ConsommationEspacesNAF | `ConsommationEspacesNAFAmenagementText` | `espacesNAFTooltipText` | inline |
| amenagement/2-LCZ et confortThermique/6-LCZ | `LCZCeremaText1`, `LCZText`, `LCZText2` | `LCZTooltipText` | – |
| biodiversite/1-TypesDeSols | – | – | inline |
| biodiversite/2-SolsImpermeabilises | `SolsImpermeabilisesText` | `espacesNAFTooltipText` | `SolsImpermeabilisesBiodiversiteDynamicText` |
| biodiversite/3-SurfacesToujoursEnHerbe | – | `SurfacesToujoursEnHerbeText` | `SurfacesEnHerbeDynamicText` |
| biodiversite/4-SurfacesEnBio | `SurfacesEnBioText` | `agricultureBioTooltipText` | inline |
| biodiversite/5-EtatCoursDeau | `EtatsCoursEauBiodiversiteTextNouveauParcours` | `etatCoursDeauTooltipTextBiodiv` | `EtatCoursDeauDynamicText` |
| biodiversite/6-AOT40 | `AOT40Text` | `AOT40TooltipText` | `AOT40DynamicText` |
| confortThermique/1-GrandAge75 | `GrandAgeText` | – | inline |
| confortThermique/2-PrecariteEnergetique | – | `fragiliteEconomiqueTooltipText` | inline |
| confortThermique/3-EmploisExterieurs | `TravailExterieurText` | `travailExterieurTooltipText` | inline |
| confortThermique/4-DateConstructionResidences | `AgeBatiText` | – | inline |
| eau/1-EtatCoursDeau | `EtatCoursEauRessourcesEauText` | – | inline |
| eau/2-PrelevementsEnEau | `PrelevementEauText` | `prelevementEauTooltipText` | inline |
| gestionDesRisques/1-ArretesCatnat | `CatNatText` | `catnatTooltipText` | inline |
| gestionDesRisques/2-FeuxDeForet | `FeuxForetText` | `feuxForetTooltipText` | inline |
| gestionDesRisques/3-ErosionCotiere | `ErosionCotiereText` | `erosionCotiereTooltipText` | inline |
| gestionDesRisques/4-RetraitGonflementDesArgiles | `RGAText` | `rgaTooltipText` | inline |
| gestionDesRisques/5-Debroussaillement | `DebroussaillementText` | `debroussaillementTooltipText` | inline |
| gestionDesRisques/6-Secheresses | `SecheressesText` | `secheressesPasseesTooltipText` | inline |
| sante/1-o3 | `O3Text` | `O3TooltipText` | `O3DynamicText` |
| sante/2-Arbovirose | `MoustiqueTigreText` | `moustiqueTigreTooltipText` | inline |
| foret/1-HauteurCanopee | provisoire | provisoire (`TOOLTIP`) | provisoire (`TEST`) |
| foret/2-LineaireDeHaie, amenagement/3-OCSGE | – | – | – |

Certains textes existent dans `staticTexts.tsx` ou `tooltipTexts.tsx` mais ne sont plus utilisés par aucun composant : `VegetalisationText`, `EtatsCoursEauBiodiversiteText` et `densiteBatiTooltipText`. Ils ont peut-être été remplacés. Ne les prends pas comme modèles prioritaires.

## Données présentes dans plusieurs thématiques

Ces paires sont utiles en transposition. Compare-les **toi-même** : aucune règle n'a été écrite à leur sujet.

| Donnée | Version 1 | Version 2 |
|---|---|---|
| Consommation d'espaces NAF | `ConsommationEspacesNAFAmenagementText` (Aménagement) | `ConsommationEspacesNAFBiodiversiteText` et `SolsImpermeabilisesText` (Biodiversité) |
| Agriculture biologique | `SurfacesEnBioAgricultureText` (Agriculture) | `SurfacesEnBioText` (Biodiversité) |
| État écologique des cours d'eau | `EtatCoursEauRessourcesEauText` (Ressources en eau) | `EtatsCoursEauBiodiversiteTextNouveauParcours` (Biodiversité) |
| État des cours d'eau (tooltip) | `etatCoursDeauTooltipTextEau` | `etatCoursDeauTooltipTextBiodiv` (même base, avec un paragraphe sur la baignade en plus) |
| LCZ | Aménagement | Inconfort thermique (mêmes textes) |

## Longueurs mesurées (en mots, balises retirées)

- **Textes d'analyse** (28 textes) : minimum 29, médiane 108, maximum 291. Exemples : `GrandAgeText` 29, `AOT40Text` 51, `CatNatText` 60, `SurfacesEnBioText` 116, `ErosionCotiereText` 198, `PrelevementEauText` 291.
- **« D'où vient ce chiffre ? »** (22 textes, sans compter le texte provisoire) : minimum 15, médiane 87, maximum 177. Exemples : `surfacesAgricolesTooltipText` 27, `erosionCotiereTooltipText` 42, `rgaTooltipText` 86, `catnatTooltipText` 177.
- **Chiffres dynamiques** : de 1 à 3 phrases dans le cas général. Ils sont plus longs quand ils enchaînent sur un dispositif local (`SolsImpermeabilisesBiodiversiteDynamicText` avec les Atlas de la biodiversité communale).

## Formulations existantes pour les cas particuliers (verbatim)

- Pas de donnée : « Il n’y a pas de données référencées sur le territoire que vous avez sélectionné »
- Pas de station proche : « Nous ne disposons pas de données pour les stations proches de votre territoire »
- Secret statistique : « Cette donnée est sous secret statistique. Cette règle s'applique aux statistiques agrégées si elles rendent possible la déduction d'informations individuelles. »
- Données partielles : « À noter : {n} donnée(s) communale(s), soumises au secret statistique, ne sont pas incluses dans ce calcul. »
- Donnée à une échelle supérieure : « Bien que cette donnée ne soit disponible qu'à l'échelle intercommunale, elle reste révélatrice : … »
- EPT : « Bien que cette donnée n’existe qu’à l’échelle de la Métropole du Grand Paris, dont dépend votre EPT, elle reste révélatrice : … »
- Absence d'exploitation : « D’après le recensement agricole de 2020, aucun chef d’exploitation n’a été identifié sur votre territoire. Cette absence peut refléter une limite du recensement ou une réalité locale spécifique. »
- EPCI qui débordent du périmètre : « À noter : Ces données ne sont disponibles qu’à l’échelle intercommunale. Ces {n} EPCI débordent de votre périmètre : … »

## Échelles gérées dans le code

`commune`, `epci`, `ept`, `petr`, `pnr` et `departement` (valeurs du paramètre `type`).

## Éléments de forme observés

- Ligne de source sous la dataviz : « Source : PRODUCTEUR, millésime (consultée en mois année) ». Exemple : « Source : INERIS, 2026 (consultée en mai 2026) ».
- Chiffres clés précédés de `⇒` dans plusieurs textes d'analyse : `ConsommationEspacesNAF…`, `PrelevementEauText`, `ErosionCotiereText`.
- Séparateur `- - - -` avant les références aux plans nationaux (Plan Eau, PNACC-3) dans `PrelevementEauText`, `ErosionCotiereText` et `EtatsCoursEauBiodiversiteText`.
- Intertitres en gras en début de paragraphe dans `SurfacesIrrigueesText` et `SurfacesEnBioAgricultureText`.
- Notes de bas de tooltip en italique, introduites par `(*)`, dans `AOT40TooltipText` et `fragiliteEconomiqueTooltipText`.
- Le corpus mélange l'apostrophe ’ et l'apostrophe '.
