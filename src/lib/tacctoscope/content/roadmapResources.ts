import type { StaticImageData } from 'next/image';
import { buildQuestionKey } from '../keys';
import { AnswerMap, AnswerValue, CriterionSlug } from '../types';
import { CRITERIA } from './criteria';

/**
 * Recommandations de la feuille de route, par question et par niveau de réponse :
 * - `absentPartiel` : recommandation commune à « absent » et « partiel »
 * - `satisfaisant` : sa propre recommandation
 * - « très satisfaisant » : aucune recommandation
 * Un bloc `ressources` vide n'est pas affiché.
 */

export type RoadmapResourceTag =
  | 'donnees'
  | 'article'
  | 'reglementation'
  | 'exemple-diagnostic';

export interface RoadmapResource {
  tag: RoadmapResourceTag;
  title: string;
  /** Paragraphe « Qu’est-ce que c’est ? », aussi révélé au survol de la carte. */
  description?: string;
  /** Paragraphe « Pourquoi est-ce utile ? ». */
  utilite?: string;
  image?: StaticImageData;
  url: string;
}

export interface QuestionRecommendation {
  title: string;
  description: string;
  ressources: RoadmapResource[];
}

export interface QuestionRecommendations {
  absentPartiel: QuestionRecommendation;
  satisfaisant: QuestionRecommendation;
}

const LOREM_UTILITE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.';

const DONNEES_CLIMATIQUES: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Documenter le passé climatique du territoire',
      description:
        "Les éléments recueillis sur ce point sont encore trop parcellaires pour dresser un tableau clair de l’état du climat de votre territoire. Les données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) sont un bon point de départ pour établir ce constat et objectiver des tendances déjà à l'œuvre.\
        \n\nAttention, pour pouvoir parler de tendances d’évolution du climat, qu’il soit global ou local, il est impératif de se baser sur des évolutions de long terme (30 ans). En deçà, la variabilité interannuelle naturelle du climat peut fausser l’évaluation de ces tendances. \
        \n\nPar exemple, une succession de 3 ou 4 années de températures particulièrement basses n’indique pas une tendance au refroidissement.",
      ressources: [
        {
          tag: 'donnees',
          title: 'Base de données GASPAR',
          description:
            'La base de données GASPAR (Base nationale de Gestion ASsistée des Procédures Administratives relatives aux Risques) recense pour chaque commune les arrêtés de reconnaissance de l’état de catastrophe naturelle parus au Journal officiel depuis la création du dispositif en 1982. Ces données complètent les données climatiques passées, en apportant un éclairage sur les « aléas induits » (mouvements de terrain, submersion, inondations, coulées de boues…) dont la fréquence est susceptible d’évoluer avec le changement climatique. Retrouvez ces données sur TACCT.',
          url: '',
          utilite:
            'Ces données complètent les données climatiques passées, en apportant un éclairage sur les « aléas induits » (mouvements de terrain, submersion, inondations, coulées de boues…) dont la fréquence est susceptible d’évoluer avec le changement climatique. \n\n\
          Visualisez ces données sur TACCT, dans notre thématique ‘Gestion des risques’, onglet ‘Données de mon territoire’.'
        }
      ]
    },
    satisfaisant: {
      title: 'Explorer davantage le passé climatique du territoire',
      description:
        "C’est un bon début, mais ce volet mérite peut-être d'être un peu étoffé pour être tout à fait convaincant. L'exploitation de données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) est importante pour mettre en évidence les caractéristiques du climat de votre territoire et peut permettre d'objectiver des tendances déjà à l'œuvre.",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Utiliser les projections climatiques de la TRACC',
      description:
        "Depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC) doit être intégrée dans tous les documents de planification. \n\n\
        Si certains paramètres vous semblent manquants dans la TRACC, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent au +4°C pour la métropole, et de pousser l’analyse jusqu’en fin de siècle (RCP 8.5 par exemple).",
      ressources: [
        {
          tag: 'donnees',
          title: 'Climadiag Commune par Météo-France',
          description:
            'Climadiag Commune est un service de Météo France, en accès libre et gratuit, décrivant les évolutions potentielles du climat à l‘échelle des communes et des EPCI. Les indicateurs (températures moyennes, cumuls de précipitations,…) correspondent aux différents niveaux de réchauffement de la TRACC aux horizons 2030, 2050 et 2100. Ils sont organisés en cinq familles (climat, risques naturels, santé, agriculture, tourisme).',
          url: 'https://meteofrance.com/climadiag-commune',
          utilite:
            'ClimaDiag Commune est un outil directement utilisable, sans nécessiter de compétences en climatologie ou en traitement de données, contrairement à d’autres outils, tel que DRIAS.'
        },
        {
          tag: 'reglementation',
          title: 'Décret n° 2026-23 du 23 janvier 2026',
          description:
            "Il s’agit du décret relatif à la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique (TRACC) adoptée par la France.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399130',
          utilite:
            "Le décret du 23 janvier 2026 précise les modalités de définition de la TRACC. C'est ce texte qui légitime l'usage par les territoires de la TRACC comme référence officielle dans les diagnostics de vulnérabilité."
        },
        {
          tag: 'reglementation',
          title: 'Arrêté du 23 janvier 2026',
          description:
            "Il s’agit de l’arrêté du 23 janvier 2026 fixant les niveaux de réchauffement de la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399165',
          utilite:
            "L'arrêté du 23 janvier 2026 définit les niveaux de réchauffement (par rapport à l'ère préindustrielle) à différents horizons temporels pour la métropole et les territoires ultramarins."
        }
      ]
    },
    satisfaisant: {
      title:
        'Compléter avec des projections climatiques compatibles avec la TRACC',
      description:
        "Le cas échéant, quelques ajustements suffiront. \n\n\
        Complétez vos paramètres TRACC ; si certains vous semblent manquants, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent à +4° C pour la métropole (RCP 8.5 par exemple), et de pousser l’analyse jusqu’en fin de siècle. \n\n\
        Rappel : depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique n’est plus une option et doit être intégrée dans tous les documents de planification.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title: 'Réduire la partie sur les données climatiques mondiales',
      description:
        "Évitez l'écueil des généralités en reproduisant des constats déjà largement documentés à l'échelle globale. Les données mondiales, voire nationales, sont assez éloignées des réalités locales, même si, ponctuellement, les échelles intermédiaires (départementales, régionales) peuvent offrir un cadre de comparaison pertinent pour positionner votre territoire.\n\n\
        Si nécessaire, rapprochez-vous du groupe régional d'experts sur le climat de votre région. Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir. ",
      ressources: []
    },
    satisfaisant: {
      title: 'Alléger la partie sur les données climatiques mondiales',
      description:
        "Un petit effort de synthèse s’impose. Réorientez cette première partie de votre diagnostic pour être exploitable : elle doit aider les acteurs locaux à se projeter dans une réalité qui leur est directement lisible, plutôt que de reproduire des constats déjà largement documentés à l'échelle globale. \n\n\
        Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
      ressources: []
    }
  },
  q4: {
    absentPartiel: {
      title: 'Reliez les paramètres climatiques à leurs conséquences',
      description:
        "Un diagnostic ne doit pas être un inventaire, c'est plutôt le fruit d'une analyse. Si aucun des indicateurs climatiques mentionnés n'est relié à un effet observable sur votre territoire, c'est soit qu'il n'y en a pas, soit que le travail de mise en relation reste à faire : c'est ce lien qui donnera son sens au diagnostic.",
      ressources: []
    },
    satisfaisant: {
      title:
        'Restituer en priorité les paramètres climatiques reliés à des effets observables sur le territoire.',
      description:
        "Un diagnostic n’est pas un inventaire, c'est le fruit d'une analyse. La recherche d'indicateurs de projections climatiques peut faire apparaître des aléas sans effet réel sur votre territoire.\n\n\
        S’il est utile d’en conserver la trace dans vos documents de travail, mieux vaut ne restituer dans le diagnostic que les données climatiques reliées à des impacts locaux. Les lecteurs vous remercieront d’aller à l’essentiel !",
      ressources: []
    }
  },
  q5: {
    absentPartiel: {
      title:
        "Identifier les phénomènes climatiques qui ont le plus d'impacts sur le territoire, aujourd’hui, mais aussi demain",
      description:
        "Rassurez-vous, l’exercice n’est pas une évaluation scientifique nécessitant des connaissances poussées en climatologie. A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des aléas les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\n\
        Quelques questions peuvent aider à réfléchir collectivement à l’importance des aléas les uns par rapport aux autres (fréquence, étendue sur le territoire, préoccupation déjà exprimée localement…). N'oubliez pas non plus de couvrir les deux temporalités de l'exercice : l'exposition passée et l'exposition future, à évaluer à l'aide de la TRACC.",
      ressources: [
        {
          tag: 'exemple-diagnostic',
          title: 'Diagnostic de vulnérabilité de Rennes métropole',
          description:
            'Il s’agit du diagnostic de vulnérabilité au changement climatique de la métropole de Rennes (Bretagne), réalisé en 2025.',
          url: 'https://www.audiar.org/publication/environnement/climat/diagnostic-et-vulnerabilite-au-changement-climatique-a-rennes-metropole/',
          utilite:
            'Dans ce diagnostic de vulnérabilité, vous retrouverez l’usage des critères de notation de l’exposition actuelle et future.\
            \n\nUn format de synthèse du diagnostic de vulnérabilité est également accessible.'
        }
      ]
    },
    satisfaisant: {
      title: 'Compléter l’évaluation de l’exposition',
      description:
        "A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des aléas les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\n\
        La qualification de la gravité des aléas reste incomplète ? Identifiez ce qui bloque : \n\n\
          • une échelle trop binaire (aléa 'grave' / 'pas grave'), sans nuance intermédiaire, ni critères explicites (fréquence, étendue, préoccupation locale par exemple).\n\
          • une couverture incomplète des aléas sans justification des omissions.\n\
          • une seule temporalité traitée : la gravité a été évaluée sur la base des observations passées, sans anticipation de l'évolution future des aléas via la TRACC.\n\
          • un exercice individuel plutôt que collectif : la qualification a été réalisée par un seul agent ou service, sans partage ni validation collective, ce qui questionne l’échelonnement  des aléas retenus.\n\ ",
      ressources: []
    }
  }
};

const LOREM_RECO_TITLE = 'Citer les sources climatiques';

const LOREM_RECO_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const LOREM_RESSOURCES: RoadmapResource[] = [
  {
    tag: 'donnees',
    title: 'Climadiag Commune - Météo France',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    url: 'https://www.georisques.gouv.fr/',
    utilite: LOREM_UTILITE
  },
  {
    tag: 'donnees',
    title: 'Bulletins Spéciaux - Association Infoclimat',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    url: 'https://www.infoclimat.fr/',
    utilite: LOREM_UTILITE
  }
];

const LOREM_RECOMMENDATION: QuestionRecommendation = {
  title: LOREM_RECO_TITLE,
  description: LOREM_RECO_DESCRIPTION,
  ressources: LOREM_RESSOURCES
};

const LOREM_RECOMMENDATIONS: QuestionRecommendations = {
  absentPartiel: LOREM_RECOMMENDATION,
  satisfaisant: LOREM_RECOMMENDATION
};

const PROBLEMATISATION_Q1_RESSOURCES: RoadmapResource[] = [
  {
    tag: 'donnees',
    title: 'Lorem ipsum - base de données territoriale',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    url: '',
    utilite: LOREM_UTILITE
  },
  {
    tag: 'article',
    title: 'Lorem ipsum - article de synthèse',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    url: '',
    utilite: LOREM_UTILITE
  },
  {
    tag: 'reglementation',
    title: 'Lorem ipsum - cadre réglementaire',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    url: '',
    utilite: LOREM_UTILITE
  },
  {
    tag: 'exemple-diagnostic',
    title: 'Lorem ipsum - exemple de diagnostic',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '',
    utilite: LOREM_UTILITE
  }
];

const PROBLEMATISATION_Q1: QuestionRecommendation = {
  title: LOREM_RECO_TITLE,
  description: LOREM_RECO_DESCRIPTION,
  ressources: PROBLEMATISATION_Q1_RESSOURCES
};

const PROBLEMATISATION_ET_CONCLUSION: Record<string, QuestionRecommendations> =
  {
    q1: {
      absentPartiel: PROBLEMATISATION_Q1,
      satisfaisant: PROBLEMATISATION_Q1
    }
  };

const RECOMMENDATIONS_PAR_CRITERE: Partial<
  Record<CriterionSlug, Record<string, QuestionRecommendations>>
> = {
  'donnees-climatiques': DONNEES_CLIMATIQUES,
  'problematisation-et-conclusion': PROBLEMATISATION_ET_CONCLUSION
};

export const ROADMAP_RECOMMENDATIONS: Record<string, QuestionRecommendations> =
  Object.fromEntries(
    CRITERIA.flatMap((criterion) =>
      criterion.questions.map((question) => [
        buildQuestionKey(criterion.slug, question.id),
        RECOMMENDATIONS_PAR_CRITERE[criterion.slug]?.[question.id] ??
          LOREM_RECOMMENDATIONS
      ])
    )
  );

export const getRecommendation = (
  questionKey: string,
  answer: AnswerValue
): QuestionRecommendation | null => {
  if (answer === 'tres_satisfaisant') return null;
  const recommendations = ROADMAP_RECOMMENDATIONS[questionKey];
  if (!recommendations) return null;
  return answer === 'satisfaisant'
    ? recommendations.satisfaisant
    : recommendations.absentPartiel;
};

export const getRecommendationCount = (answers: AnswerMap): number =>
  CRITERIA.reduce(
    (count, criterion) =>
      count +
      criterion.questions.filter((question) => {
        const questionKey = buildQuestionKey(criterion.slug, question.id);
        const answer = answers[questionKey];
        return (
          answer != null && getRecommendation(questionKey, answer) !== null
        );
      }).length,
    0
  );
