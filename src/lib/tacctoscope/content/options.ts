import { AnswerValue, Option } from '../types';

export const SCALE_OPTIONS: Option[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' }
];

export const UNKNOWN_OPTION: Option = {
  value: 'ne_sais_pas',
  label: 'Je ne sais pas'
};

export const ANSWER_LABELS: Record<AnswerValue, string> = {
  '1': 'Pas du tout',
  '2': 'Plutôt pas',
  '3': 'Plutôt',
  '4': 'Tout à fait',
  ne_sais_pas: 'Je ne sais pas'
};
