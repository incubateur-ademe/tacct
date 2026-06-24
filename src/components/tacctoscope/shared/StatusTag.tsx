import { ANSWER_STATUS, StatusIcon } from '@/lib/tacctoscope/status';
import { AnswerValue } from '@/lib/tacctoscope/types';
import { ComponentType } from 'react';
import styles from './StatusTag.module.scss';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1.5 9.9 5.4l4.3.6-3.1 3 .7 4.3L8 11.3 4.2 13.3l.7-4.3-3.1-3 4.3-.6z" />
  </svg>
);

const ThumbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4.5 7v6H2.5V7h2Zm0 0 3-5c.7 0 1.3.6 1.3 1.3V6h3.4c.7 0 1.2.6 1.1 1.3l-.9 4.4c-.1.6-.6 1-1.2 1H4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M11 2.5 13.5 5 6 12.5l-3 .5.5-3L11 2.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS: Record<StatusIcon, ComponentType> = {
  star: StarIcon,
  thumb: ThumbIcon,
  pencil: PencilIcon
};

interface Props {
  value: AnswerValue;
}

export const StatusTag = ({ value }: Props) => {
  const status = ANSWER_STATUS[value];
  const Icon = ICONS[status.icon];
  return (
    <span className={`${styles.tag} ${styles[status.variant]}`}>
      <Icon />
      {status.label.toUpperCase()}
    </span>
  );
};
