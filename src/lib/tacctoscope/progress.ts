import { CRITERIA } from './content/criteria';
import { buildQuestionKey } from './keys';
import { AnswerMap, AnswerValue, Criterion, CriterionSlug } from './types';

export interface CriterionProgress {
  slug: CriterionSlug;
  answered: number;
  total: number;
}

export const getCriterionProgress = (
  criterion: Criterion,
  answers: AnswerMap
): CriterionProgress => {
  const total = criterion.questions.length;
  const answered = criterion.questions.filter(
    (question) =>
      answers[buildQuestionKey(criterion.slug, question.id)] != null
  ).length;
  return { slug: criterion.slug, answered, total };
};

export interface AnswerCounts {
  pointsForts: number;
  aConsolider: number;
  pointsAttention: number;
}

export type AnswerLevel = keyof AnswerCounts;

export const getAnswerLevel = (answer: AnswerValue): AnswerLevel | null => {
  if (answer === '4') return 'pointsForts';
  if (answer === '3') return 'aConsolider';
  if (answer === '1' || answer === '2') return 'pointsAttention';
  return null;
};

export const getCriterionAnswerCounts = (
  criterion: Criterion,
  answers: AnswerMap
): AnswerCounts =>
  criterion.questions.reduce<AnswerCounts>(
    (counts, question) => {
      const answer = answers[buildQuestionKey(criterion.slug, question.id)];
      const level = answer ? getAnswerLevel(answer) : null;
      return level ? { ...counts, [level]: counts[level] + 1 } : counts;
    },
    { pointsForts: 0, aConsolider: 0, pointsAttention: 0 }
  );

export const getAllProgress = (answers: AnswerMap): CriterionProgress[] =>
  CRITERIA.map((criterion) => getCriterionProgress(criterion, answers));

export type GlobalState = 'vide' | 'partiel' | 'rempli';

export const getGlobalState = (answers: AnswerMap): GlobalState => {
  const progress = getAllProgress(answers);
  const answered = progress.reduce((sum, item) => sum + item.answered, 0);
  const total = progress.reduce((sum, item) => sum + item.total, 0);
  if (answered === 0) return 'vide';
  if (answered < total) return 'partiel';
  return 'rempli';
};
