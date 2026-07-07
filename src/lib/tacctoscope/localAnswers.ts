import { AnswerMap, AnswerValue, CriterionSlug, FeedbackMap } from './types';

const ANSWERS_KEY = 'tacctoscope_local_answers';
const FEEDBACKS_KEY = 'tacctoscope_local_feedbacks';

const readJSON = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalAnswers = (): AnswerMap => readJSON(ANSWERS_KEY, {});

export const saveLocalAnswer = (
  questionKey: string,
  value: AnswerValue
): void => {
  writeJSON(ANSWERS_KEY, { ...getLocalAnswers(), [questionKey]: value });
};

export const deleteLocalAnswer = (questionKey: string): void => {
  const answers = { ...getLocalAnswers() };
  delete answers[questionKey];
  writeJSON(ANSWERS_KEY, answers);
};

export const clearLocalTacctoscope = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ANSWERS_KEY);
  window.localStorage.removeItem(FEEDBACKS_KEY);
};

export const getLocalFeedbacks = (): FeedbackMap => readJSON(FEEDBACKS_KEY, {});

export const saveLocalFeedback = (
  criterionKey: CriterionSlug,
  isUseful: boolean
): void => {
  writeJSON(FEEDBACKS_KEY, {
    ...getLocalFeedbacks(),
    [criterionKey]: isUseful
  });
};
