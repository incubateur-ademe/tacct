import { ANSWER_VALUES, AnswerMap, AnswerValue } from './types';

/* Valeurs enregistrées avant l'échelle 1 à 4 : toujours acceptées en lecture,
   les nouvelles réponses sont enregistrées au nouveau format. */
const LEGACY_ANSWER_VALUES: Record<string, AnswerValue> = {
  absent: '1',
  partiel: '2',
  satisfaisant: '3',
  tres_satisfaisant: '4'
};

export const isAnswerValue = (value: string): value is AnswerValue =>
  (ANSWER_VALUES as readonly string[]).includes(value);

export const normalizeAnswers = (raw: Record<string, string>): AnswerMap =>
  Object.fromEntries(
    Object.entries(raw).flatMap(([questionKey, value]): [string, AnswerValue][] => {
      const answer = isAnswerValue(value) ? value : LEGACY_ANSWER_VALUES[value];
      return answer ? [[questionKey, answer]] : [];
    })
  );

export const yieldsRecommendation = (answer: AnswerValue): boolean =>
  answer !== '4' && answer !== 'ne_sais_pas';
