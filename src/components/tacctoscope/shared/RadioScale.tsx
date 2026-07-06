'use client';

import { Body } from '@/design-system/base/Textes';
import { AnswerValue, Option } from '@/lib/tacctoscope/types';
import styles from './shared.module.scss';

interface Props {
  options: Option[];
  value: AnswerValue | null;
  onSelect: (value: AnswerValue) => void;
  minHint?: string;
  maxHint?: string;
}

export const RadioScale = ({
  options,
  value,
  onSelect,
  minHint,
  maxHint
}: Props) => (
  <div className={styles.radioScaleContainer}>
    <div className={styles.radioScaleWrapper} role="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`${styles.radioScaleOption} ${selected ? styles.radioScaleOptionSelected : ''
              }`}
            onClick={() => onSelect(option.value)}
          >
            <span className={styles.radioScaleBullet} aria-hidden="true" />
            <Body
              htmlTag="span"
              size="md"
              weight="bold"
            // color={selected ? '#038278' : '#3d3d3d'}
            >
              {option.label}
            </Body>
          </button>
        );
      })}
    </div>
    {(minHint || maxHint) && (
      <div className={styles.radioScaleHints}>
        <span className={styles.radioScaleHint}>{minHint}</span>
        <span className={`${styles.radioScaleHint} ${styles.radioScaleHintEnd}`}>
          {maxHint}
        </span>
      </div>
    )}
  </div>
);
