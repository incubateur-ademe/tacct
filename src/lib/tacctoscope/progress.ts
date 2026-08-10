import { CRITERIA } from './content/criteria';
import { buildQuestionKey } from './keys';
import { AnswerMap, Criterion, CriterionSlug } from './types';

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
