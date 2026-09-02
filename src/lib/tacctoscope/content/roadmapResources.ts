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

const A_COMPLETER = 'À COMPLÉTER';

const LOREM_UTILITE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.';

const DONNEES_CLIMATIQUES: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title:
        'Pas ou peu de données sur les évolutions climatiques passées : à approfondir.',
      description:
        "Les éléments recueillis sur ce point sont encore trop parcellaires pour dresser un tableau clair de l’état du climat de votre territoire. Les données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) sont un bon point de départ établir ce constat et objectiver des tendances déjà à l'œuvre. Attention, pour pouvoir parler de tendances d’évolution du climat, qu’il soit global ou local, il est impératif de se baser sur des évolutions de long terme (30 ans). En deçà, la variabilité interannuelle naturelle du climat peuvent fausser l’évaluation de ces tendances. Par exemple, une succession de 3 ou 4 années de températures particulièrement basses n’indique pas une tendance au refroidissement.",
      ressources: [
        {
          tag: 'donnees',
          title: 'Base de données GASPAR',
          description:
            'La base de données GASPAR (Base nationale de Gestion ASsistée des Procédures Administratives relatives aux Risques) recense pour chaque commune les arrêtés de reconnaissance de l’état de catastrophe naturelle parus au Journal officiel depuis la création du dispositif en 1982. Ces données complètent les données climatiques passées, en apportant un éclairage sur les « aléas induits » (mouvements de terrain, submersion, inondations, coulées de boues…) dont la fréquence est susceptible d’évoluer avec le changement climatique. Retrouvez ces données sur TACCT.',
          url: '',
          utilite: LOREM_UTILITE
        }
      ]
    },
    satisfaisant: {
      title:
        'Le diagnostic mobilise quelques données ou observations climatiques passées.',
      description:
        "C’est un bon début, mais ce volet mérite peut-être d'être un peu étoffé pour être tout à fait convaincant. L'exploitation de données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) est importante pour mettre en évidence les caractéristiques du climat de votre territoire et peut permettre d'objectiver des tendances déjà à l'œuvre.",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Utiliser les données de la TRACC n’est pas une option.',
      description:
        "Depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC) doit être intégrée dans tous les documents de planification. Si certains paramètres vous semblent manquants dans la TRACC, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent au +4°C pour la métropole, et de pousser l’analyse jusqu’en fin de siècle (RCP 8.5 par exemple)",
      ressources: [
        {
          tag: 'donnees',
          title: 'Climadiag Commune',
          description:
            'Climadiag Commune est un service de Météo France, en accès libre et gratuit, décrivant les évolutions potentielles du climat à l‘échelle des communes et des EPCI. Les indicateurs (températures moyennes, cumuls de précipitations,…) correspondent aux différents niveaux de réchauffement de la TRACC aux horizons 2030, 2050 et 2100. Ils sont organisés en cinq familles (climat, risques naturels, santé, agriculture, tourisme).',
          url: 'https://meteofrance.com/climadiag-commune',
          utilite: LOREM_UTILITE
        },
        {
          tag: 'donnees',
          title:
            "décret n° 2026-23 du 23 janvier 2026 relatif à la trajectoire de réchauffement de référence pour l'adaptation au changement climatique",
          description:
            'Le décret du 23 janvier 2026 précise les modalités de définition de la TRACC',
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399130',
          utilite: LOREM_UTILITE
        },
        {
          tag: 'donnees',
          title:
            "arrêté du 23 janvier 2026 fixant la trajectoire de réchauffement de référence pour l'adaptation au changement climatique",
          description:
            "L'arrêté du 23 janvier 2026 définit les niveaux de réchauffement (par rapport à l'ère préindustrielle) à différents horizons temporels pour la métropole et les territoires ultramarins.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399165',
          utilite: LOREM_UTILITE
        }
      ]
    },
    satisfaisant: {
      title:
        'Les projections climatiques utilisées sont partiellement basées sur la TRACC.',
      description:
        "Quelques ajustements suffiront pour compléter votre diagnostic. Voici quelques pistes pour aller au bout de la démarche. Complétez vos paramètres TRACC ; si certains vous semblent manquants, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent au +4°C pour la métropole, et de pousser l’analyse jusqu’en fin de siècle (RCP 8.5 par exemple). Rappel : depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique n’est plus une option et doit être intégrée dans tous les documents de planification.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title: "Évitez l'écueil des généralités",
      description:
        "Les données mondiales, voire nationales, sont assez éloignées des réalités locales, même si, ponctuellement, les échelles intermédiaires (départementales, régionales) peuvent offrir un cadre de comparaison pertinent pour positionner votre territoire. Si nécessaire, rapprochez-vous du groupe régional d'experts sur le climat de votre région. Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
      ressources: []
    },
    satisfaisant: {
      title: 'Les données climatiques mondiales sont trop détaillées.',
      description:
        "Un petit effort de synthèse s’impose. Réorientez cette première partie de votre diagnostic pour être exploitable : elle doit aider les acteurs locaux à se projeter dans une réalité qui leur est directement lisible, plutôt que de reproduire des constats déjà largement documentés à l'échelle globale. Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
      ressources: []
    }
  },
  q4: {
    absentPartiel: {
      title: 'Reliez les paramètres climatiques à leurs conséquences',
      description:
        "Un diagnostic n'est pas un inventaire, c'est le fruit d'une analyse. Si aucun des indicateurs climatiques mentionnés n'est relié à un effet observable sur votre territoire, c'est soit qu'il n'y en a pas, soit que le travail de mise en relation reste à faire : c'est ce lien qui donnera son sens au diagnostic.",
      ressources: []
    },
    satisfaisant: {
      title:
        'Les indicateurs climatiques retenus sont parfois reliés à des effets observables sur le territoire.',
      description:
        "Un diagnostic n’est pas un inventaire, c'est le fruit d'une analyse.  La recherche d'indicateurs de projections climatiques peut faire apparaître des aléas sans effet réel sur votre territoire. S’il est utile d’en conserver la trace dans vos documents de travail, mieux vaut ne restituer dans le diagnostic que les données climatiques reliées à des impacts locaux. Les lecteurs vous remercieront d’aller à l’essentiel !",
      ressources: []
    }
  },
  q5: {
    absentPartiel: {
      title:
        "La qualification de l'exposition de votre territoire aux aléas, présents et futurs, est absente ou très incomplète",
      description:
        "Il s’agit d’identifier les phénomènes climatiques qui ont le plus d'impacts sur le territoire, en les priorisant entre eux. Rassurez vous, il ne s’agit pas d’effectuer une évaluation scientifique qui nécessiterait des connaissances poussées en climatologie. Quelques questions peuvent aider à réfléchir collectivement à l’importance des aléas les uns par rapport aux autres (fréquence, étendue sur le territoire, préoccupation déjà exprimée localement…évolution à 2100). Associer les acteurs du territoire dès cette étape, c'est s'assurer une priorisation plus juste, ancrée dans les préoccupations réelles du territoire, et plus légitime puisqu'elle n'est pas décidée par la seule collectivité.",
      ressources: []
    },
    satisfaisant: {
      title: 'L’évaluation de l’exposition a été partiellement réalisée. ',
      description:
        "Une évaluation partielle peut avoir deux origines : soit elle s'est concentrée sur un nombre trop restreint d'aléas, soit elle n'a pas été confrontée au ressenti des acteurs du territoire. Si le périmètre est incomplet, le risque est de passer à côté d'un phénomène climatique qui pourrait peser lourd dans les années à venir. Rassurez-vous : il ne s'agit pas d'une évaluation scientifique nécessitant des connaissances poussées en climatologie, mais d'identifier les phénomènes climatiques qui ont le plus d'impacts sur le territoire, en les priorisant entre eux (par exemple sur une échelle de gravité nulle, faible, moyenne ou élevée). Quelques questions peuvent vous aider à comparer l'importance des aléas entre eux : leur fréquence, leur étendue sur le territoire, une préoccupation déjà exprimée localement... et leur évolution prévue à 2100 pour l’exposition future. Si le ressenti des acteurs manque, le risque est de passer à côté de signaux que seul le vécu permet de capter. Les associer dès le début de l'évaluation, c'est aussi s'assurer une priorisation plus juste, ancrée dans les préoccupations réelles du territoire, et plus légitime puisqu'elle n'est pas décidée par la seule collectivité.",
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

const PROBLEMATISATION_ET_CONCLUSION: Record<string, QuestionRecommendations> = {
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
        return answer != null && getRecommendation(questionKey, answer) !== null;
      }).length,
    0
  );
