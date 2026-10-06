'use client';

import { Body } from '@/design-system/base/Textes';
import {
  SCALE_OPTIONS,
  UNKNOWN_OPTION
} from '@/lib/tacctoscope/content/options';
import { AnswerValue, Option } from '@/lib/tacctoscope/types';
import styles from './shared.module.scss';

const HIGHLIGHT: Record<AnswerValue, string> = {
  '1': '#FFE2E3',
  '2': '#FFE2E3',
  '3': '#E4FFE6',
  '4': '#9DD9A0',
  ne_sais_pas: '#E7E5E5'
};

interface Props {
  value: AnswerValue | null;
  onSelect: (value: AnswerValue) => void;
}

export const RadioScale = ({ value, onSelect }: Props) => {
  const answered = value !== null;
  const labelWeight = answered ? 'regular' : 'bold';
  const labelColor = '#3D3D3D';

  const renderOption = (option: Option) => {
    const selected = option.value === value;
    return (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={selected}
        className={`${styles.radioScaleOption} ${selected ? styles.radioScaleOptionSelected : ''
          }`}
        style={selected ? { background: HIGHLIGHT[option.value] } : undefined}
        onClick={() => onSelect(option.value)}
      >
        <Body
          htmlTag="span"
          size="md"
          weight={selected ? 'bold' : labelWeight}
          color={labelColor}
        >
          {option.label}
        </Body>
        <span className={styles.radioScaleBullet} aria-hidden="true" />
      </button>
    );
  };

  return (
    <div
      className={`${styles.radioScale} ${answered ? styles.radioScaleAnswered : ''}`}
      role="radiogroup"
      aria-label="Retrouvez-vous ceci dans votre diagnostic ? De 1 (pas du tout) à 4 (tout à fait)"
    >
      <div className={styles.radioScaleRange}>
        <span className={styles.radioScaleEndLabel}>
          <Body htmlTag="span" size="md" weight={labelWeight} color={labelColor}>
            Pas du tout
          </Body>
        </span>
        <div className={styles.radioScaleSteps}>
          {SCALE_OPTIONS.map(renderOption)}
        </div>
        <span className={styles.radioScaleEndLabel}>
          <Body htmlTag="span" size="md" weight={labelWeight} color={labelColor}>
            Tout à fait
          </Body>
        </span>
      </div>
      <span className={styles.radioScaleSeparator} aria-hidden="true" />
      {renderOption(UNKNOWN_OPTION)}
    </div>
  );
};
