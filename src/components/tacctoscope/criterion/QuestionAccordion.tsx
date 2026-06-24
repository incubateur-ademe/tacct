'use client';

import { deleteAnswer, saveAnswer } from '@/lib/queries/tacctoscope';
import { ANSWER_OPTIONS } from '@/lib/tacctoscope/content/options';
import { buildQuestionKey } from '@/lib/tacctoscope/keys';
import { ANSWER_STATUS } from '@/lib/tacctoscope/status';
import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import { useState, useTransition } from 'react';
import { AccordionShell, HeaderVariant } from '../shared/AccordionShell';
import { RadioScale } from '../shared/RadioScale';
import { StatusTag } from '../shared/StatusTag';
import { ExampleCallout } from './ExampleCallout';
import styles from './QuestionAccordion.module.scss';

interface Props {
  slug: CriterionSlug;
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
  onChanged: (questionKey: string, answered: boolean) => void;
}

export const QuestionAccordion = ({
  slug,
  question,
  number,
  initialValue,
  onChanged
}: Props) => {
  const questionKey = buildQuestionKey(slug, question.id);
  const [value, setValue] = useState<AnswerValue | null>(initialValue);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  const handleSelect = (clicked: AnswerValue) => {
    const next = clicked === value ? null : clicked;
    const previous = value;
    setValue(next);
    setError(false);
    onChanged(questionKey, next !== null);

    startTransition(async () => {
      const result =
        next === null
          ? await deleteAnswer(questionKey)
          : await saveAnswer(questionKey, next);
      if (!result.ok) {
        setValue(previous);
        setError(true);
        onChanged(questionKey, previous !== null);
      }
    });
  };

  const headerVariant: HeaderVariant = value
    ? ANSWER_STATUS[value].variant
    : 'default';

  return (
    <AccordionShell
      title={
        <>
          <span className={styles.number}>Q{number}</span>
          <span>{question.label}</span>
        </>
      }
      accent={question.section}
      headerVariant={headerVariant}
      headerTag={value ? <StatusTag value={value} /> : null}
    >
      <div className={styles.body}>
        <p className={styles.text}>{question.text}</p>
        <ExampleCallout>{question.example}</ExampleCallout>
        <p className={styles.prompt}>Retrouvez-vous ceci dans votre diagnostic ?</p>
        <RadioScale
          options={ANSWER_OPTIONS}
          value={value}
          onSelect={handleSelect}
        />
        {error && (
          <p className={styles.error} role="alert">
            L’enregistrement a échoué, merci de réessayer.
          </p>
        )}
      </div>
    </AccordionShell>
  );
};
