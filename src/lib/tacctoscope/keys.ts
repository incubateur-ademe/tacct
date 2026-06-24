import { CRITERIA } from './content/criteria';
import { Criterion, CRITERION_SLUGS, CriterionSlug } from './types';

export const buildQuestionKey = (
  slug: CriterionSlug,
  questionId: string
): string => `${slug}.${questionId}`;

export const isCriterionSlug = (value: string): value is CriterionSlug =>
  (CRITERION_SLUGS as readonly string[]).includes(value);

export const getCriterionBySlug = (slug: string): Criterion | undefined =>
  CRITERIA.find((criterion) => criterion.slug === slug);

const KNOWN_QUESTION_KEYS = new Set(
  CRITERIA.flatMap((criterion) =>
    criterion.questions.map((question) =>
      buildQuestionKey(criterion.slug, question.id)
    )
  )
);

export const isKnownQuestionKey = (key: string): boolean =>
  KNOWN_QUESTION_KEYS.has(key);

export const isKnownCriterionKey = (key: string): key is CriterionSlug =>
  isCriterionSlug(key);

export const getNextCriterionSlug = (
  slug: CriterionSlug
): CriterionSlug | null => {
  const index = CRITERIA.findIndex((criterion) => criterion.slug === slug);
  const next = CRITERIA[index + 1];
  return next ? next.slug : null;
};
