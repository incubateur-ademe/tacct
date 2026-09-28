# Consultation de data.gouv et propositions de sources

## Ce que tu peux faire, et ce que tu ne fais pas

| Autorisé sans validation | Autorisé après validation, au cas par cas | Interdit |
|---|---|---|
| Lire les sources fournies | Utiliser dans le texte une source de contexte que tu as proposée | Chercher la source des données TACCT elles-mêmes, qui est fournie |
| Ouvrir la fiche data.gouv de la donnée et ses réutilisations, pour comprendre la donnée et voir comment elle est présentée ailleurs | Reprendre un chiffre trouvé dans une réutilisation | Utiliser une source non validée |
| Chercher des sources candidates en lien avec l'adaptation, pour les **lister** | | Recopier ou paraphraser de près le texte d'un autre site |

Si une page ne peut pas être récupérée, dis-le et continue sans chercher de contournement.

## data.gouv.fr

- **Jeux de données publiés par TACCT** : https://www.data.gouv.fr/organizations/tacct/datasets. API : `https://www.data.gouv.fr/api/1/organizations/tacct/datasets/?page_size=50`. On y trouve la structure des données (colonnes, codes géographiques, rattachements, notes sur le secret statistique).
- **Fiche d'un jeu de données** : `https://www.data.gouv.fr/api/1/datasets/<slug-ou-id>/`. Les champs utiles sont `description`, `organization`, `temporal_coverage`, `frequency`, `resources` (dont les notices méthodologiques) et `metrics.reuses`.
- **Réutilisations** : `https://www.data.gouv.fr/api/1/reuses/?dataset=<id>&page_size=50`, ou l'onglet « Réutilisations » de la fiche. Ignore la réutilisation TACCT elle-même.

Dans une réutilisation, observe seulement :

- comment la donnée est **nommée** et **définie** ;
- ce qu'on lui fait **dire** ;
- les **précautions de lecture** mentionnées.

Tu t'en sers pour comprendre la donnée, jamais comme source à citer sans validation.

## Sources de contexte candidates

Tu en cherches seulement si le texte d'analyse a besoin d'un élément de contexte que les sources fournies ne donnent pas. Chaque source candidate doit :

- être **en lien avec l'adaptation au changement climatique** ;
- permettre d'identifier qui la produit, avec quel titre et à quelle date ;
- être accessible par une URL.

Présente-les dans le tableau de l'étape 3 du skill, puis **attends la validation**. Pour chacune, précise l'élément exact que tu comptes en tirer (chiffre, phrase, mécanisme). Cela permet de la valider en connaissance de cause.

Les sources déjà citées sur le site sont listées dans `src/lib/sources.ts`. Signale quand une source candidate y figure déjà.
