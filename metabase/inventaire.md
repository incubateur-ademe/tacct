# Inventaire Metabase

43 questions, toutes en SQL natif. 6 dashboards, dont 4 embarqués dans l'app.

Colonnes **Décision** (garder / fusionner / abandonner) et **Visibilité** (public / privé) à remplir.

## Dashboard 4 — Page stats publique (embarqué)

| Ordre | Id  | Titre                                                                                                 | Graphe      | Base    | Tables                          | Filtre            | Aussi dans | Décision | Visibilité |
| ----- | --- | ----------------------------------------------------------------------------------------------------- | ----------- | ------- | ------------------------------- | ----------------- | ---------- | -------- | ---------- |
| 1     | —   | _Texte : Les territoires_                                                                             |             |         |                                 |                   |            |          |            |
| 2     | 51  | Nombre de territoires uniques recherchés                                                              | Chiffre clé | preprod | analytics.all_pageview_raw      |                   | 3          |          |            |
| 3     | —   | _Texte : TACCT propose 6 échelles de territoires différentes : - Communes - EPCI (Établissement pu…_  |             |         |                                 |                   |            |          |            |
| 4     | —   | _Texte : Les utilisateurs_                                                                            |             |         |                                 |                   |            |          |            |
| 5     | 62  | Nombre de visiteurs par mois                                                                          | Aire        | preprod | analytics.all_pageview_raw      |                   |            |          |            |
| 6     | 67  | Population couverte par les territoires dans notre communauté                                         | Donut       | preprod | analytics.couverture_population |                   | 3          |          |            |
| 7     | —   | _Texte : Les contenus_                                                                                |             |         |                                 |                   |            |          |            |
| 8     | 46  | Nombre de clics par thématique                                                                        | Barres      | preprod | analytics.thematique            | Filtre thématique | 3          |          |            |
| 9     | —   | _Texte : Liste des indicateurs disponibles sur Facili-TACCT : - Âge du bâtiment - Appellations con…_  |             |         |                                 |                   |            |          |            |
| 10    | —   | _Texte : Notre mesure d'impact phare (North Star ⭐️)_                                                 |             |         |                                 |                   |            |          |            |
| 11    | —   | _Texte : On mesure le nombre de territoires recherchés au moins 3 fois et dont au moins 3 thématiqu…_ |             |         |                                 |                   |            |          |            |
| 12    | 56  | North star                                                                                            | Chiffre clé | preprod | analytics.all_pageview_raw      | Période NSM       | 3, 5       |          |            |
| 13    | 75  | North Star par date - chiffres cumulés                                                                | Courbe      | preprod | analytics.all_pageview_raw      |                   | 3          |          |            |

## Dashboard 5 — Page stats privée (embarqué)

| Ordre | Id  | Titre                                                                                                       | Graphe              | Base    | Tables                                               | Filtre                  | Aussi dans | Décision | Visibilité |
| ----- | --- | ----------------------------------------------------------------------------------------------------------- | ------------------- | ------- | ---------------------------------------------------- | ----------------------- | ---------- | -------- | ---------- |
| 1     | —   | _Texte : North Star_                                                                                        |                     |         |                                                      |                         |            |          |            |
| 2     | —   | _Texte : Nombre de territoires recherchés au moins 3 fois et dont au moins 3 thématiques ont été co…_       |                     |         |                                                      |                         |            |          |            |
| 3     | 56  | North star                                                                                                  | Chiffre clé         | preprod | analytics.all_pageview_raw                           | Période NSM             | 3, 4       |          |            |
| 4     | 69  | North Star par date                                                                                         | Barres              | preprod | analytics.all_pageview_raw                           | Granularité             | 3          |          |            |
| 5     | 58  | North star par jour                                                                                         | Tableau             | preprod | analytics.all_pageview_raw                           |                         | 3          |          |            |
| 6     | 55  | North star détails                                                                                          | Tableau             | preprod | analytics.all_pageview_raw                           |                         | 3          |          |            |
| 7     | —   | _Texte : Territoires_                                                                                       |                     |         |                                                      |                         |            |          |            |
| 8     | 54  | Liste des territoires les plus recherchés                                                                   | Tableau             | preprod | analytics.all_pageview_raw                           | Filtre territoire       | 3          |          |            |
| 9     | 72  | Nombre de visiteurs uniques par territoire                                                                  | Tableau             | preprod | analytics.all_pageview_raw                           | Filtre V/T              |            |          |            |
| 10    | 52  | Nombre de territoires recherchés par type                                                                   | Tableau             | preprod | analytics.all_pageview_raw                           | Filtre territoires/type | 3          |          |            |
| 11    | 53  | Nombre moyen de territoires recherchés par visiteur                                                         | Chiffre clé         | preprod | analytics.all_pageview_raw                           | Filtre T/V moyenne      | 3          |          |            |
| 12    | —   | _Texte : Visiteurs_                                                                                         |                     |         |                                                      |                         |            |          |            |
| 13    | —   | _Texte : Communauté Adaptation_                                                                             |                     |         |                                                      |                         |            |          |            |
| 14    | 57  | Nombre total de visiteurs uniques                                                                           | Chiffre clé         | preprod | analytics.all_pageview_raw                           |                         | 3          |          |            |
| 15    | 73  | Rétention sur les 6 derniers mois                                                                           | Chiffre clé         | preprod | analytics.all_pageview_raw                           |                         | 3          |          |            |
| 16    | —   | _Texte : (vide)_                                                                                            |                     |         |                                                      |                         |            |          |            |
| 17    | —   | _Texte : Le dashboard des métriques communauté se trouve sur Baserow. Vous y trouverez : - le nom…_         |                     |         |                                                      |                         |            |          |            |
| 18    | 74  | Part des visiteurs uniques revenus par rapport au nombre de visiteurs uniques total sur les 6 derniers mois | Tableau             | preprod | analytics.all_pageview_raw                           |                         | 3          |          |            |
| 19    | —   | _Texte : Export des données_                                                                                |                     |         |                                                      |                         |            |          |            |
| 20    | 59  | Nombre de clics sur le bouton Exporter selon les territoires et les indicateurs                             | Tableau             | preprod | analytics.boutons_export_raw                         |                         | 3          |          |            |
| 21    | 63  | Nombre d'exports par indicateur                                                                             | Barres              | preprod | analytics.boutons_export_raw                         |                         | 3          |          |            |
| 22    | —   | _Texte : Contenus_                                                                                          |                     |         |                                                      |                         |            |          |            |
| 23    | 60  | Liste des ressources consultées                                                                             | Barres              | preprod | analytics.all_pageview_raw                           | Filtre ressources       | 3          |          |            |
| 24    | 70  | Conversion à l'étape 2 (depuis le 9/12)                                                                     | Tableau             | preprod | analytics.all_pageview_raw, analytics.boutons_etape2 | Filtre étape 2          |            |          |            |
| 25    | —   | _Texte : Domaine référents_                                                                                 |                     |         |                                                      |                         |            |          |            |
| 26    | 61  | Domaines référents                                                                                          | Barres horizontales | preprod | analytics.all_pageview_raw                           | Filtre domaines         | 3          |          |            |

## Dashboard 6 — Page comptes utilisateur (embarqué)

| Ordre | Id  | Titre                                                                                | Graphe  | Base | Tables                                                   | Filtre                        | Aussi dans | Décision | Visibilité |
| ----- | --- | ------------------------------------------------------------------------------------ | ------- | ---- | -------------------------------------------------------- | ----------------------------- | ---------- | -------- | ---------- |
| 1     | 103 | Répartition des comptes par profil                                                   | Donut   | prod | tacct.user                                               |                               |            |          |            |
| 2     | 81  | Nombre de comptes utilisateur                                                        | Tableau | prod | tacct.user, tacct.tacctoscope_answer                     | Filtre détails comptes        |            |          |            |
| 3     | 90  | Besoins utilisateurs : podium des besoins les plus cochés (toute position confondue) | Tableau | prod | tacct.user, tacct.user_besoin                            | Filtre podium les plus cochés |            |          |            |
| 4     | 93  | Besoins utilisateurs : podium des besoins prioritaires                               | Tableau | prod | tacct.user, tacct.user_besoin                            | Filtre podium prio            |            |          |            |
| 5     | 80  | Tableau complet des usages utilisateur                                               | Tableau | prod | tacct.user, tacct.study_office, tacct.tacctoscope_answer | Filtre usages                 | 7          |          |            |

## Dashboard 7 — Page TACCToscope (embarqué)

| Ordre | Id  | Titre                                                                             | Graphe              | Base    | Tables                                                       | Filtre                 | Aussi dans | Décision | Visibilité |
| ----- | --- | --------------------------------------------------------------------------------- | ------------------- | ------- | ------------------------------------------------------------ | ---------------------- | ---------- | -------- | ---------- |
| 1     | 99  | Nombre de comptes utilisateur                                                     | Tableau             | prod    | tacct.user, tacct.tacctoscope_answer                         | Filtre détails comptes |            |          |            |
| 2     | 101 | (TACCToscope) Liste de toutes les questions/réponses avec le nombre d’occurrences | Tableau             | prod    | tacct.user, tacct.tacctoscope_answer                         | Filtre Q/R             |            |          |            |
| 3     | 97  | Complétion des questionnaires                                                     | Tableau             | prod    | tacct.user, tacct.tacctoscope_answer                         | Filtre complétion      |            |          |            |
| 4     | 98  | Non complétion par critère                                                        | Barres horizontales | prod    | tacct.user, tacct.tacctoscope_answer                         | Filtre non complétion  |            |          |            |
| 5     | 94  | (TACCToscope) Consultations de la feuille de route                                | Donut               | preprod | analytics.all_pageview_raw                                   | Filtre FdR             |            |          |            |
| 6     | 95  | (TACCToscope) Nombre de clics sur les ressources de la feuille de route           | Tableau             | preprod | analytics.tacctoscope_ressources, analytics.all_pageview_raw | Filtre clics           |            |          |            |
| 7     | 80  | Tableau complet des usages utilisateur                                            | Tableau             | prod    | tacct.user, tacct.study_office, tacct.tacctoscope_answer     |                        | 6          |          |            |

## Dashboard 3 — Dashboard (non embarqué)

| Ordre | Id  | Titre                                                                                                       | Graphe              | Base    | Tables                          | Filtre            | Aussi dans | Décision | Visibilité |
| ----- | --- | ----------------------------------------------------------------------------------------------------------- | ------------------- | ------- | ------------------------------- | ----------------- | ---------- | -------- | ---------- |
| 1     | 56  | North star                                                                                                  | Chiffre clé         | preprod | analytics.all_pageview_raw      | Filtre NSM        | 5, 4       |          |            |
| 2     | 57  | Nombre total de visiteurs uniques                                                                           | Chiffre clé         | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 3     | 47  | Clics sur les boutons de la page d'accueil / page mon-compte                                                | Barres              | preprod | analytics.boutons_homepage      |                   |            |          |            |
| 4     | 46  | Nombre de clics par thématique                                                                              | Barres              | preprod | analytics.thematique            |                   | 4          |          |            |
| 5     | 50  | Nombre de nouveaux territoires uniques recherchés par jour                                                  | Tableau             | preprod | analytics.all_pageview_raw      |                   |            |          |            |
| 6     | 52  | Nombre de territoires recherchés par type                                                                   | Tableau             | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 7     | 54  | Liste des territoires les plus recherchés                                                                   | Tableau             | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 8     | 55  | North star détails                                                                                          | Tableau             | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 9     | 58  | North star par jour                                                                                         | Tableau             | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 10    | 67  | Population couverte par les territoires dans notre communauté                                               | Donut               | preprod | analytics.couverture_population |                   | 4          |          |            |
| 11    | 66  | Nombre de consultations de la page patch4°C                                                                 | Courbe              | preprod | analytics.all_pageview_raw      |                   |            |          |            |
| 12    | 53  | Nombre moyen de territoires recherchés par visiteur                                                         | Chiffre clé         | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 13    | 51  | Nombre de territoires uniques recherchés                                                                    | Chiffre clé         | preprod | analytics.all_pageview_raw      |                   | 4          |          |            |
| 14    | 59  | Nombre de clics sur le bouton Exporter selon les territoires et les indicateurs                             | Tableau             | preprod | analytics.boutons_export_raw    |                   | 5          |          |            |
| 15    | 60  | Liste des ressources consultées                                                                             | Barres              | preprod | analytics.all_pageview_raw      | Filtre ressources | 5          |          |            |
| 16    | 61  | Domaines référents                                                                                          | Barres horizontales | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 17    | 63  | Nombre d'exports par indicateur                                                                             | Barres              | preprod | analytics.boutons_export_raw    |                   | 5          |          |            |
| 18    | 64  | Nombre de redirections vers les liens du CRACC                                                              | Barres horizontales | preprod | analytics.all_autocapture_raw   |                   |            |          |            |
| 19    | 69  | North Star par date                                                                                         | Barres              | preprod | analytics.all_pageview_raw      | Granularité       | 5          |          |            |
| 20    | 73  | Rétention sur les 6 derniers mois                                                                           | Chiffre clé         | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 21    | 74  | Part des visiteurs uniques revenus par rapport au nombre de visiteurs uniques total sur les 6 derniers mois | Tableau             | preprod | analytics.all_pageview_raw      |                   | 5          |          |            |
| 22    | 78  | Nombre de clics par mois du bouton "M'inscrire à une session d'accueil"                                     | Barres              | preprod | analytics.boutons_homepage      |                   |            |          |            |
| 23    | 75  | North Star par date - chiffres cumulés                                                                      | Courbe              | preprod | analytics.all_pageview_raw      |                   | 4          |          |            |

## Dashboard 2 — Facili-TACCT (non embarqué)

| Ordre | Id  | Titre                                                                                                | Graphe | Base | Tables | Filtre | Aussi dans | Décision | Visibilité |
| ----- | --- | ---------------------------------------------------------------------------------------------------- | ------ | ---- | ------ | ------ | ---------- | -------- | ---------- |
| 1     | —   | _Texte : Facili-TACCT intègre désormais 6 types de territoires différents : les Communes, les EPCI…_ |        |      |        |        |            |          |            |

## Questions dans aucun dashboard

| Id  | Titre                                                                   | Graphe      | Base    | Tables                               | Décision | Visibilité |
| --- | ----------------------------------------------------------------------- | ----------- | ------- | ------------------------------------ | -------- | ---------- |
| 65  | Consultation de la page patch4°C par territoire                         | Tableau     | preprod | analytics.all_pageview_raw           |          |            |
| 76  | Nombre de clics sur le bouton "Ressources"                              | Barres      | preprod | analytics.boutons_homepage           |          |            |
| 77  | Nombre de clics par mois du bouton "M'inscrire à une session d'accueil" | Barres      | preprod | analytics.boutons_homepage           |          |            |
| 85  | (TACCToscope) Complétion des questionnaires                             | Tableau     | prod    | tacct.user, tacct.tacctoscope_answer |          |            |
| 86  | (TACCToscope) Non complétion par critère                                | Tableau     | prod    | tacct.user, tacct.tacctoscope_answer |          |            |
| 100 | Nombre de comptes utilisateur                                           | Chiffre clé | prod    | tacct.user                           |          |            |
