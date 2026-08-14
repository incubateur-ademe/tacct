import { Criterion, CRITERION_SLUGS, CriterionSlug, Question } from '../types';

/**
 * Contenu réel des critères et de leurs questions.
 * Les constantes LOREM_* sont des placeholders : remplace-les par le contenu
 * réel, question par question (label, text, example, minHint, maxHint...).
 */

const LOREM_LABEL = 'Lorem ipsum dolor sit amet consectetur';

const LOREM_QUESTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ?';

const LOREM_EXAMPLE =
  'Lorem ipsum : source exemple 2023 · source exemple 2017. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

const LOREM_CHAPEAU =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod ?';

interface CriterionContent {
  title: string;
  chapeau: string;
  questions: Question[];
}

const CRITERIA_CONTENT: Record<CriterionSlug, CriterionContent> = {
  'donnees-climatiques': {
    title: 'Données climatiques',
    chapeau:
      "Le diagnostic s'appuie-t-il sur des données climatiques pertinentes et territorialisées ?",
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: 'Le diagnostic comprend des observations climatiques passées.',
        text: "Il s'agit de données climatiques mesurées, ou de phénomènes observés, \
        sur votre territoire (températures, précipitations, événements extrêmes, etc.).",
        example:
          'Lors des épisodes caniculaires de 2003 et 2023, 10 des 14 stations \
        météorologiques du territoire ont enregistré les journées les plus chaudes depuis 1947.',
        minHint:
          'Pas ou peu de données sur les évolutions climatiques passées.',
        maxHint:
          'Le diagnostic mobilise les mesures et données climatiques passées.'
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label:
          'Les projections climatiques ont un horizon de réchauffement de +4° C à l’horizon 2100.',
        text: "Le niveau de réchauffement de 4° C (pour la métropole) et l’horizon temporel de fin de siècle sont les deux caractéristiques de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC), adoptée par la France pour fixer une cible commune d'adaptation.",
        example:
          "Un certain nombre de diagnostics sont basés sur des scénarios climatiques fondés sur des hypothèses de réchauffement inférieures au +4° C retenus dans la TRACC pour la métropole. L’horizon temporel se limite souvent à 2050, ne permettant pas d'anticiper les évolutions attendues au-delà de cette échéance, désormais de court terme.",
        minHint:
          'Les projections climatiques utilisées ne sont pas basées sur la TRACC.',
        maxHint:
          'Les projections climatiques utilisées sont basées sur la TRACC.'
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label: 'Décrire son territoire, plutôt que le climat global',
        text: "Les projections à l'échelle mondiale, voire nationale, ne permettent pas aux acteurs locaux de se reconnaître. Le diagnostic de vulnérabilité doit se recentrer sur votre territoire.",
        example: [
          'Les continents et les latitudes élevées se réchauffent beaucoup plus vite. Ainsi, la température en Arctique pourrait augmenter jusqu’à +11°C en 2100.',
          '⇒ Cette affirmation est vraie. Pour autant, quelle compréhension de votre territoire apporte-t-elle ?'
        ],
        minHint: 'Les données climatiques mondiales sont très détaillées.',
        maxHint:
          'Les évolutions climatiques mondiales sont brièvement rappelées.'
      },
      {
        id: 'q4',
        section: 'analyse',
        exampleKind: 'both',
        label:
          'Les paramètres de projections climatiques retenus dans le diagnostic ont une utilité pour expliquer certains impacts.',
        text: 'TEXTE A COMPLETER',
        example: [
          'Les conséquences des vagues de chaleur pour le territoire :',
          [
            'surcharge des services médicaux',
            'hausse de la consommation d’énergie due à la climatisation',
            'assèchement des nappes phréatiques'
          ]
        ],
        counterExample:
          "Pour un territoire au climat très doux, est-il nécessaire de mentionner la baisse du nombre de jours de gel par an, si ce phénomène n'entraîne pas de conséquences notables (sur les infrastructures, sur des activités maraîchères…) ?",
        minHint:
          'Les indicateurs climatiques retenus ne se traduisent pas par des effets observables.',
        maxHint:
          'Les indicateurs climatiques retenus se traduisent par des effets observables sur le territoire.'
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: 'Un exercice de qualification de l’exposition a été mené',
        text: "Cet exercice est destiné à identifier les aléas et les phénomènes climatiques qui ont le plus d'impacts sur votre territoire, en les priorisant entre eux.",
        example: 'METTRE UN EXEMPLE',
        minHint: 'Il n’y a aucune évaluation de l’exposition',
        maxHint:
          "Cet exercice est destiné à identifier les aléas et les phénomènes climatiques qui ont le plus d'impacts sur votre territoire, en les priorisant entre eux."
      }
    ]
  },
  'donnees-socio-economiques': {
    title: 'Données socio-économiques',
    chapeau: LOREM_CHAPEAU,
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q4',
        section: 'enquete',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      }
    ]
  },
  'dialogue-et-partage': {
    title: 'Dialogue et partage',
    chapeau: LOREM_CHAPEAU,
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q4',
        section: 'enquete',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      }
    ]
  },
  'priorisation-des-impacts': {
    title: 'Priorisation des impacts',
    chapeau: LOREM_CHAPEAU,
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q4',
        section: 'enquete',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      }
    ]
  },
  'problematisation-et-conclusion': {
    title: 'Problématisation et conclusion',
    chapeau: LOREM_CHAPEAU,
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q4',
        section: 'enquete',
        exampleKind: 'contre-exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: LOREM_LABEL,
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE
      }
    ]
  }
};

export const CRITERIA: Criterion[] = CRITERION_SLUGS.map((slug) => ({
  slug,
  ...CRITERIA_CONTENT[slug]
}));
