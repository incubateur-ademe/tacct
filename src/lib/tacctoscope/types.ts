export const ANSWER_VALUES = [
  'absent',
  'partiel',
  'satisfaisant',
  'tres_satisfaisant'
] as const;

export type AnswerValue = (typeof ANSWER_VALUES)[number];

export const CRITERION_SLUGS = [
  'donnees-climatiques',
  'donnees-socio-economiques',
  'dialogue-et-partage',
  'priorisation-des-impacts',
  'problematisation-et-conclusion'
] as const;

export type CriterionSlug = (typeof CRITERION_SLUGS)[number];

export type SectionKind = 'analyse' | 'enquete';

export type CalloutKind = 'exemple' | 'contre-exemple';

export type ExampleKind = CalloutKind | 'both';

/** Une string = un paragraphe. Un tableau imbriqué = une liste à puces. */
export type RichContent = string | (string | string[])[];

export interface Option {
  value: AnswerValue;
  label: string;
}

interface QuestionBase {
  id: string;
  label: string;
  text: RichContent;
  section: SectionKind;
  minHint?: string;
  maxHint?: string;
}

export type Question = QuestionBase &
  (
    | {
        exampleKind: CalloutKind;
        example: RichContent;
        exampleAttachments?: string[];
        counterExample?: never;
        counterExampleAttachments?: never;
      }
    | {
        exampleKind: 'both';
        example: RichContent;
        exampleAttachments?: string[];
        counterExample: RichContent;
        counterExampleAttachments?: string[];
      }
  );

export interface Criterion {
  slug: CriterionSlug;
  title: string;
  chapeau: string;
  questions: Question[];
}

export type AnswerMap = Record<string, AnswerValue>;
export type FeedbackMap = Record<string, boolean>;
