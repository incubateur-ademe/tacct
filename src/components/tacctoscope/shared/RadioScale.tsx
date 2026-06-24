'use client';

import { AnswerValue, Option } from '@/lib/tacctoscope/types';
import styles from './RadioScale.module.scss';

interface Props {
  options: Option[];
  value: AnswerValue | null;
  onSelect: (value: AnswerValue) => void;
}

export const RadioScale = ({ options, value, onSelect }: Props) => (
  <div className={styles.scale} role="radiogroup">
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          className={`${styles.option} ${selected ? styles.selected : ''}`}
          onClick={() => onSelect(option.value)}
        >
          <span className={styles.bullet} aria-hidden="true" />
          <span className={styles.label}>{option.label}</span>
        </button>
      );
    })}
  </div>
);
