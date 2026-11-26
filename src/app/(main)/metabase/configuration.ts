import { couleursPrincipales, nuancesGris } from '@/design-system/couleurs';
import type { BlocCarte, TableauDeBord } from './types';

const EDIT_EXPORTS =
  "EDIT : le calcul du nombre des exports a changé. Nettoyage des bugs et des données en double. Désormais, un seul export est comptabilisé pour un utilisateur pour une session unique. Si je me connecte et que je télécharge 5 fois les données d'un même territoire pour un indicateur donné, on ne compte qu'un seul évènement.";

const pagePublique: TableauDeBord = {
  id: 4,
  nom: 'Page stats publique',
  blocs: [
    { type: 'titre', texte: 'Les territoires', position: { ligne: 0, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 51,
      titre: 'Nombre de territoires recherchés sur le site',
      visualisation: { type: 'chiffre' },
      position: { ligne: 1, colonne: 0, largeur: 12, hauteur: 5 }
    },
    {
      type: 'texte',
      texte:
        'TACCT propose 6 échelles de territoires différentes :\n- Communes\n- EPCI (Établissement public de coopération intercommunale)\n- PETR (Pôle d’équilibre territorial et rural)\n- PNR (Parc naturel régional)\n- EPT (Établissement public territorial)\n- Départements.',
      position: { ligne: 1, colonne: 12, largeur: 12, hauteur: 5 }
    },
    { type: 'titre', texte: 'Les utilisateurs', position: { ligne: 6, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 62,
      titre: 'Nombre de visiteurs par mois',
      visualisation: { type: 'courbe', x: 'mois', y: 'count', libelleX: 'Mois', libelleY: 'Nombre de visiteurs' },
      position: { ligne: 7, colonne: 0, largeur: 12, hauteur: 9 }
    },
    {
      type: 'carte',
      carte: 67,
      titre: 'Population couverte par les territoires dans notre communauté',
      description: 'Part de la population couverte par les territoires présents dans notre Communauté Adaptation',
      visualisation: {
        type: 'donut',
        categorie: 'label',
        valeur: 'value',
        libelles: { Couvert: 'Part couverte', 'Non couvert': 'Part non couverte' },
        couleurs: { Couvert: couleursPrincipales.vert, 'Non couvert': nuancesGris.medium }
      },
      position: { ligne: 7, colonne: 12, largeur: 12, hauteur: 9 }
    },
    { type: 'titre', texte: 'Les contenus', position: { ligne: 16, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 46,
      titre: 'Nombre de consultations par thématique',
      description:
        "Sur la page /thematique, chaque fois qu'un utilisateur clique sur le bouton \"J'explore cette thématique\", l'événement est enregistré avec la thématique recherchée.",
      visualisation: { type: 'barres', x: 'thematique', y: 'count', libelleY: 'Nombre de clics' },
      periode: 'past6months',
      position: { ligne: 17, colonne: 0, largeur: 12, hauteur: 14 }
    },
    {
      type: 'texte',
      texte:
        "Liste des indicateurs disponibles sur TACCT :\n\n- Âge du bâtiment\n- Appellations contrôlées\n- Arrêtés Catastrophes Naturelles\n- Atlas de la biodiversité\n- Débroussaillement\n- Emplois en extérieur\n- Érosion côtière\n- État écologique des cours d'eau\n- Feux de forêt\n- Grand âge de la population\n- Moustique tigre et arboviroses\n- Ozone et végétation\n- Part des chefs d'exploitation de plus de 55 ans\n- Patch 4°C\n- Pollution à l'ozone\n- Précarité énergétique\n- Prélèvements en eau\n- Qualité des sites de baignade\n- Retrait-gonflement des argiles\n- Sécheresses passées\n- Sols imperméabilisés\n- Spécialisation territoriale de la production agricole\n- Superficies irriguées\n- Surfaces en bio\n- Surfaces toujours en herbe\n- Types de culture\n- Types de sols\n- Zones climatiques locales (LCZ)",
      position: { ligne: 17, colonne: 12, largeur: 12, hauteur: 14 }
    },
    {
      type: 'titre',
      texte: "Notre mesure d'impact phare (North Star ⭐️)",
      position: { ligne: 31, colonne: 0, largeur: 24, hauteur: 1 }
    },
    {
      type: 'texte',
      texte:
        'On mesure le nombre de territoires recherchés au moins 3 fois et dont au moins 3 thématiques ont été consultées.',
      position: { ligne: 32, colonne: 0, largeur: 24, hauteur: 1 }
    },
    {
      type: 'carte',
      carte: 56,
      titre: 'Nombre de territoires concernés',
      visualisation: { type: 'chiffre' },
      periode: 'past6months~',
      position: { ligne: 33, colonne: 0, largeur: 12, hauteur: 6 }
    },
    {
      type: 'carte',
      carte: 75,
      titre: 'Évolution de la North Star par mois',
      visualisation: {
        type: 'courbe',
        x: 'date',
        y: 'north_star_cumule',
        libelleY: 'Nombre de territoires concernés'
      },
      granularite: 'month',
      position: { ligne: 33, colonne: 12, largeur: 12, hauteur: 6 }
    }
  ]
};

const pagePrivee: TableauDeBord = {
  id: 5,
  nom: 'Page stats privée',
  blocs: [
    { type: 'titre', texte: 'North Star', position: { ligne: 0, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'texte',
      texte: 'Nombre de territoires recherchés au moins 3 fois et dont au moins 3 thématiques ont été consultées',
      position: { ligne: 1, colonne: 0, largeur: 24, hauteur: 1 }
    },
    {
      type: 'carte',
      carte: 56,
      titre: 'North star',
      description: 'Nombre brut de la North star',
      visualisation: { type: 'chiffre' },
      periode: 'past6months',
      position: { ligne: 2, colonne: 0, largeur: 6, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 69,
      titre: 'North Star par date',
      visualisation: { type: 'courbe', x: 'date', y: 'north_star', libelleY: 'North star' },
      granularite: 'month',
      granulariteModifiable: true,
      position: { ligne: 2, colonne: 6, largeur: 12, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 58,
      titre: 'North star par jour',
      description:
        "Demande de l'incubateur : pour l'API de l'incubateur de l'ADEME, la métrique North Star doit être formatée par jour. On visualise ici le nombre de nouveaux territoires qui remplissent les conditions de la North Star, selon les dates.",
      visualisation: {
        type: 'tableau',
        colonnes: { day: { titre: 'Date' }, north_star: { titre: 'Nb de territoires' } }
      },
      position: { ligne: 2, colonne: 18, largeur: 6, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 55,
      titre: 'North star détails',
      description:
        'Le tableau de détail de la north star avec les territoires et thématiques recherchés. La documentation complète de cet indicateur complexe est ici : https://github.com/incubateur-ademe/facili-tacct/blob/dev/doc/explications/north_star_extraction.md',
      visualisation: { type: 'tableau' },
      position: { ligne: 10, colonne: 0, largeur: 24, hauteur: 8 }
    },
    { type: 'titre', texte: 'Territoires', position: { ligne: 18, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 54,
      titre: 'Nombre de recherches par territoire',
      description: "Cette table montre l'occurrence des recherches pour chaque territoire.",
      visualisation: {
        type: 'tableau',
        colonnes: {
          code_geographique: { titre: 'Code' },
          nombre_total: { titre: 'Nb recherche' },
          libelle_geographique: { titre: 'Territoire' }
        }
      },
      periode: 'past6months',
      position: { ligne: 19, colonne: 0, largeur: 12, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 72,
      titre: 'Nombre de visiteurs uniques par territoire',
      description:
        'Un même visiteur qui recherche plusieurs fois le même territoire ne compte qu’une seule fois pour ce territoire. Un même visiteur qui recherche plusieurs territoires différents compte 1 fois pour chacun',
      visualisation: {
        type: 'tableau',
        colonnes: {
          code_geographique: { titre: 'Code' },
          visiteurs_uniques: { titre: 'Nb de visiteurs uniques' },
          libelle_geographique: { titre: 'Territoire' }
        }
      },
      periode: 'past6months',
      position: { ligne: 19, colonne: 12, largeur: 12, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 52,
      titre: 'Nombre de territoires recherchés par type',
      description:
        'Dans la table on a le nombre de territoire recherchés selon le type de territoire et une colonne montrant le pourcentage de couverture pour ce type de territoire. Les chiffres utilisés sont :\n- 1 254 EPCI\n- 34 875 communes\n- 122 PETR\n- 59 PNR\n- 11 EPT\n- 101 départements',
      visualisation: {
        type: 'tableau',
        colonnes: {
          type: { titre: 'Type de territoire' },
          visités: { titre: 'Nb visités' },
          'Nombre total': { titre: 'Nb total' },
          'Part de territoires visités': { suffixe: ' %' }
        }
      },
      periode: 'past6months',
      position: { ligne: 27, colonne: 0, largeur: 12, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 53,
      titre: 'Territoires recherchés en moyenne par visiteur',
      description:
        "Cette métrique montre le nombre moyen de territoires recherchés par personne. On ne parle pas de session ici. Si une même personne quitte le site et revient, on considère qu'il s'agit du même utilisateur.",
      visualisation: { type: 'chiffre' },
      periode: 'past6months',
      position: { ligne: 27, colonne: 12, largeur: 12, hauteur: 8 }
    },
    { type: 'titre', texte: 'Visiteurs', position: { ligne: 35, colonne: 0, largeur: 12, hauteur: 1 } },
    { type: 'titre', texte: 'Communauté Adaptation', position: { ligne: 35, colonne: 12, largeur: 12, hauteur: 1 } },
    {
      type: 'carte',
      carte: 57,
      titre: 'Visiteurs uniques au total',
      description: 'Le nombre de personnes total depuis le lancement du site.',
      visualisation: { type: 'chiffre' },
      position: { ligne: 36, colonne: 0, largeur: 6, hauteur: 4 }
    },
    {
      type: 'carte',
      carte: 73,
      titre: 'Visiteurs revenus au moins 1 fois sur les 6 derniers mois',
      description:
        "Nombre de visiteurs uniques revenus au moins une fois sur le site sur les 6 derniers mois et ça inclut le mois en cours : si on est le 12 janvier 2026, ça prend depuis environ le 12 juillet 2025 jusqu'à maintenant.\nUne rétention est comptabilisée si la personne revient un autre jour. 2 consultations le même jour ne sont pas comptabilisées comme une rétention.",
      visualisation: { type: 'chiffre' },
      position: { ligne: 36, colonne: 6, largeur: 6, hauteur: 4 }
    },
    {
      type: 'texte',
      texte:
        "Le dashboard des métriques communauté se trouve sur Baserow.\n\nVous y trouverez :\n\n- le nombre de membres dans la communauté\n- le nombre de sessions d'accueil\n- le nombre de CdM Success\n- le taux de satisfaction aux CdM Success\n- le nombre de participations cumulées aux CdM Success",
      position: { ligne: 36, colonne: 12, largeur: 12, hauteur: 6 }
    },
    {
      type: 'carte',
      carte: 74,
      titre: 'Part des visiteurs uniques revenus sur les 6 derniers mois',
      description:
        "Le graph inclut le mois en cours : si on est le 12 janvier 2026, ça prend depuis environ le 12 juillet 2025 jusqu'à maintenant.",
      visualisation: {
        type: 'tableau',
        colonnes: {
          total_visitors: { titre: 'Visiteurs au total' },
          returning_visitors: { titre: 'Visiteurs revenus' },
          return_rate_percent: { titre: 'Part de visiteurs revenus' }
        }
      },
      position: { ligne: 40, colonne: 0, largeur: 12, hauteur: 4 }
    },
    { type: 'titre', texte: 'Export des données', position: { ligne: 44, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 59,
      titre: 'Nombre de clics sur le bouton Exporter selon les territoires et les indicateurs',
      description: `La plupart des indicateurs sur le site ont un bouton d'export pour que l'utilisateur puisse extraire la donnée de son territoire. À chaque clic, un évènement est enregistré avec le code du territoire, le libellé du territoire et le nom de l'indicateur.\n${EDIT_EXPORTS}`,
      visualisation: {
        type: 'tableau',
        ordre: ['total', 'indicateur', 'libelle_geographique', 'code_geographique'],
        colonnes: {
          indicateur: { titre: 'Indicateur' },
          libelle_geographique: { titre: 'Territoire' },
          code_geographique: { titre: 'Code' }
        }
      },
      position: { ligne: 45, colonne: 0, largeur: 12, hauteur: 10 }
    },
    {
      type: 'carte',
      carte: 63,
      titre: "Nombre d'exports par indicateur",
      description: `Visualisation des indicateurs les plus exportés\n${EDIT_EXPORTS}`,
      visualisation: { type: 'barres', x: 'indicateur', y: 'total', libelleY: 'total' },
      position: { ligne: 45, colonne: 12, largeur: 12, hauteur: 10 }
    },
    { type: 'titre', texte: 'Contenus', position: { ligne: 55, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 60,
      titre: 'Liste des ressources consultées',
      description:
        "Liste des 8 ressources les plus consultées et le nombre de fois où elles l'ont été. Une occurrence est comptabilisée à chaque nouvelle url contenant le slug de l'article.",
      visualisation: {
        type: 'barres',
        x: 'article_name',
        y: 'unique_sessions',
        libelleY: 'Nombre de consultations'
      },
      periode: 'past6months',
      position: { ligne: 56, colonne: 0, largeur: 12, hauteur: 11 }
    },
    {
      type: 'carte',
      carte: 70,
      titre: "Conversion à l'étape 2 (depuis le 9/12)",
      description:
        'Calcul du taux de conversion entre les deux étapes du parcours. La requête identifie les utilisateurs qui ont visité la page /donnees avec une thématique spécifique (étape 1) depuis le 9 décembre, puis vérifie combien ont ensuite cliqué sur un bouton de diagnostic pour la même thématique (étape 2).',
      visualisation: {
        type: 'tableau',
        colonnes: {
          thematique: { titre: 'Thématique' },
          users_etape1: { titre: 'Étape 1' },
          users_converties: { titre: 'Étape 2' },
          taux_conversion: { titre: 'Taux de conversion', suffixe: ' %' }
        }
      },
      periode: 'past6months',
      periodeEtape2: 'past6months~',
      position: { ligne: 56, colonne: 12, largeur: 12, hauteur: 11 }
    },
    { type: 'titre', texte: 'Domaine référents', position: { ligne: 67, colonne: 0, largeur: 24, hauteur: 1 } },
    {
      type: 'carte',
      carte: 61,
      titre: 'Domaines référents',
      description: 'Liste les principaux domaines référents qui amènent les utilisateurs sur le site.',
      visualisation: {
        type: 'barres',
        x: 'referring_domain',
        y: 'occurrences',
        libelleX: 'Domaine référent',
        libelleY: 'Occurrences',
        horizontal: true
      },
      periode: 'past6months',
      position: { ligne: 68, colonne: 0, largeur: 24, hauteur: 9 }
    }
  ]
};

const tableauUsages: Omit<BlocCarte, 'position'> = {
  type: 'carte',
  carte: 80,
  titre: 'Tableau complet des usages utilisateur',
  description:
    "Une ligne par compte utilisateur, avec son code territoire, son statut de validation, sa date de création, son nombre de réponses au TACCToscope, et le détail de ses connexions au site comme à l'outil de saisie (date de la dernière et total cumulé).\n= liste de toutes les personnes qui se sont connectées au moins 1 fois depuis le 10 août",
  visualisation: { type: 'tableau' }
};

const pageComptes: TableauDeBord = {
  id: 6,
  nom: 'Page comptes utilisateur',
  blocs: [
    {
      type: 'carte',
      carte: 103,
      titre: 'Répartition des comptes par profil',
      description:
        "Il s'agit des comptes connectés ayant répondu au questionnaire de connexion.\nLes adresses ademe.fr ne sont par défaut pas exclues. Pour avoir les valeurs sans ces adresses, demander à Antoine.",
      visualisation: {
        type: 'donut',
        categorie: 'profil',
        valeur: 'nombre_comptes',
        libelles: {
          'Chargé·e de mission en collectivité': 'Chargé·e de mission',
          'Élu·e d’une collectivité': 'Élu·e'
        }
      },
      position: { ligne: 0, colonne: 0, largeur: 15, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 81,
      titre: 'Nombre de comptes utilisateur',
      description: 'La fusion des outils = 10 août',
      visualisation: { type: 'tableau' },
      periode: 'past6months~',
      position: { ligne: 0, colonne: 15, largeur: 9, hauteur: 8 }
    },
    {
      type: 'carte',
      carte: 90,
      titre: 'Besoins utilisateurs : podium des besoins les plus cochés (toute position confondue)',
      description:
        'Lecture : X% des utilisateurs ayant rempli le questionnaire ont sélectionné cette proposition, quelle que soit sa position.',
      visualisation: { type: 'tableau' },
      periode: 'past6months',
      position: { ligne: 8, colonne: 0, largeur: 16, hauteur: 6 }
    },
    {
      type: 'carte',
      carte: 93,
      titre: 'Besoins utilisateurs : podium des besoins prioritaires',
      description:
        'Podium montrant la proposition qui a reçu le plus de suffrage dans sa catégorie (priorité 1, 2 ou 3\nX% des utilisateurs ayant rempli le questionnaire ont choisi cette proposition à cette position (1, 2 ou 3).',
      visualisation: { type: 'tableau' },
      periode: 'past6months~',
      position: { ligne: 14, colonne: 0, largeur: 16, hauteur: 6 }
    },
    {
      ...tableauUsages,
      periode: 'past6months~',
      position: { ligne: 20, colonne: 0, largeur: 24, hauteur: 11 }
    }
  ]
};

const pageTacctoscope: TableauDeBord = {
  id: 7,
  nom: 'Page TACCToscope',
  blocs: [
    {
      type: 'carte',
      carte: 99,
      titre: 'Nombre de comptes utilisateur',
      visualisation: { type: 'tableau' },
      periode: 'past6months~',
      position: { ligne: 0, colonne: 0, largeur: 12, hauteur: 7 }
    },
    {
      type: 'carte',
      carte: 101,
      titre: '(TACCToscope) Liste de toutes les questions/réponses avec le nombre d’occurrences',
      visualisation: { type: 'tableau' },
      periode: 'past6months',
      position: { ligne: 0, colonne: 12, largeur: 12, hauteur: 20 }
    },
    {
      type: 'carte',
      carte: 97,
      titre: 'Complétion des questionnaires',
      visualisation: { type: 'tableau' },
      periode: 'past6months~',
      position: { ligne: 7, colonne: 0, largeur: 12, hauteur: 6 }
    },
    {
      type: 'carte',
      carte: 98,
      titre: 'Non complétion par critère',
      description:
        "Lecture : [X]% des TACCToscope démarrés n'ont pas complété le questionnaire Données climatiques",
      visualisation: {
        type: 'barres',
        x: 'Critère',
        y: 'Non complétion (%)',
        libelleY: 'Non complétion (%)',
        horizontal: true,
        suffixe: ' %'
      },
      periode: 'past6months',
      position: { ligne: 13, colonne: 0, largeur: 12, hauteur: 7 }
    },
    {
      type: 'carte',
      carte: 94,
      titre: '(TACCToscope) Consultations de la feuille de route',
      description:
        'Additionner le pourcentage des résultats 50 et 100 = X% des utilisateurs du TACCToscope consultent la feuille de route au moins 1 fois sur 2',
      visualisation: {
        type: 'donut',
        categorie: 'Part des sessions avec feuille de route (%)',
        valeur: 'Sessions avec consultation de la feuille de route',
        suffixeCategorie: ' %'
      },
      periode: 'past6months~',
      position: { ligne: 20, colonne: 0, largeur: 24, hauteur: 9 }
    },
    {
      type: 'carte',
      carte: 95,
      titre: '(TACCToscope) Nombre de clics sur les ressources de la feuille de route',
      visualisation: { type: 'tableau' },
      periode: 'past6months~',
      position: { ligne: 29, colonne: 0, largeur: 24, hauteur: 7 }
    },
    {
      ...tableauUsages,
      position: { ligne: 36, colonne: 0, largeur: 24, hauteur: 10 }
    }
  ]
};

export const TABLEAUX_DE_BORD: TableauDeBord[] = [pagePublique, pagePrivee, pageComptes, pageTacctoscope];
