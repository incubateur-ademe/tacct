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
    chapeau: LOREM_CHAPEAU,
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label: 'Question test avec des indications sous les radio buttons',
        text: LOREM_QUESTION,
        example: LOREM_EXAMPLE,
        minHint:
          'Les sources climatiques ne sont pas citées ou restent très vagues',
        maxHint:
          'Toutes nos sources climatiques sont citées avec références complètes'
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
