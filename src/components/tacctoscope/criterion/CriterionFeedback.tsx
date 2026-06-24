'use client';

import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { saveCriterionFeedback } from '@/lib/queries/tacctoscope';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { useState, useTransition } from 'react';
import styles from './criterion.module.scss';

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
    <div className={styles.criterionFeedbackWrapper}>
      <Body htmlTag="span" size="md" color="#161616">
        Ce contenu correspond-il à vos besoins ?
      </Body>
      <div className={styles.criterionFeedbackChoices}>
        {value === true ? (
          <BoutonPrimaireClassic
            size="sm"
            text="Oui"
            onClick={() => handleChoice(true)}
          />
        ) : (
          <BoutonSecondaireClassic
            size="sm"
            text="Oui"
            onClick={() => handleChoice(true)}
          />
        )}
        {value === false ? (
          <BoutonPrimaireClassic
            size="sm"
            text="Non"
            onClick={() => handleChoice(false)}
          />
        ) : (
          <BoutonSecondaireClassic
            size="sm"
            text="Non"
            onClick={() => handleChoice(false)}
          />
        )}
      </div>
    </div>
  );
};
