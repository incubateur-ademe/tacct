import { CRITERIA } from './content/criteria';
import { buildQuestionKey } from './keys';
import { getCriterionProgress, GlobalState } from './progress';
import { AnswerMap, CriterionSlug } from './types';

const LOREM_SUGGESTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Piste d’amélioration à retravailler.';

export interface RoadmapItem {
  slug: CriterionSlug;
  title: string;
  state: GlobalState;
  suggestions: string[];
}

export const buildRoadmap = (answers: AnswerMap): RoadmapItem[] =>
  CRITERIA.map((criterion) => {
    const { answered, total } = getCriterionProgress(criterion, answers);
    const state: GlobalState =
      answered === 0 ? 'vide' : answered < total ? 'partiel' : 'rempli';

    const suggestions = criterion.questions
      .filter((question) => {
        const value = answers[buildQuestionKey(criterion.slug, question.id)];
        return value === 'absent' || value === 'partiel';
      })
      .map(() => LOREM_SUGGESTION);

    return { slug: criterion.slug, title: criterion.title, state, suggestions };
  });
