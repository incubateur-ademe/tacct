'use client';

import { saveCriterionFeedback } from '@/lib/queries/tacctoscope';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { useState, useTransition } from 'react';
import styles from './CriterionFeedback.module.scss';

interface Props {
  criterionKey: CriterionSlug;
  initialValue: boolean | null;
}

export const CriterionFeedback = ({ criterionKey, initialValue }: Props) => {
  const [value, setValue] = useState<boolean | null>(initialValue);
  const [, startTransition] = useTransition();

  const handleChoice = (next: boolean) => {
    if (next === value) return;
    const previous = value;
    setValue(next);

    startTransition(async () => {
      const result = await saveCriterionFeedback(criterionKey, next);
      if (!result.ok) setValue(previous);
    });
  };

  return (
    <div className={styles.feedback}>
      <span className={styles.label}>Ce contenu correspond-il à vos besoins ?</span>
      <div className={styles.choices}>
        <button
          type="button"
          className={`${styles.choice} ${value === true ? styles.active : ''}`}
          aria-pressed={value === true}
          onClick={() => handleChoice(true)}
        >
          Oui
        </button>
        <button
          type="button"
          className={`${styles.choice} ${value === false ? styles.active : ''}`}
          aria-pressed={value === false}
          onClick={() => handleChoice(false)}
        >
          Non
        </button>
      </div>
    </div>
  );
};
