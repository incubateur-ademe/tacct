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

export type ExampleKind = 'exemple' | 'contre-exemple';

export interface Option {
  value: AnswerValue;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  text: string;
  example: string;
  exampleKind: ExampleKind;
  section: SectionKind;
}

export interface Criterion {
  slug: CriterionSlug;
  title: string;
  chapeau: string;
  questions: Question[];
}

export type AnswerMap = Record<string, AnswerValue>;
export type FeedbackMap = Record<string, boolean>;
