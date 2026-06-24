import { AnswerValue } from './types';

export type StatusVariant = 'green' | 'gray';
export type StatusIcon = 'star' | 'thumb' | 'pencil';

export interface StatusMeta {
  variant: StatusVariant;
  label: string;
  icon: StatusIcon;
}

export const ANSWER_STATUS: Record<AnswerValue, StatusMeta> = {
  tres_satisfaisant: { variant: 'green', label: 'Point fort', icon: 'star' },
  satisfaisant: { variant: 'green', label: 'À conserver', icon: 'thumb' },
  partiel: { variant: 'gray', label: 'À améliorer', icon: 'pencil' },
  absent: { variant: 'gray', label: 'À améliorer', icon: 'pencil' }
};
