'use client';

import { Body } from '@/design-system/base/Textes';
import { deleteAnswer, saveAnswer } from '@/lib/queries/tacctoscope';
import { ANSWER_OPTIONS } from '@/lib/tacctoscope/content/options';
import { buildQuestionKey } from '@/lib/tacctoscope/keys';
import { deleteLocalAnswer, saveLocalAnswer } from '@/lib/tacctoscope/localAnswers';
import { ANSWER_STATUS } from '@/lib/tacctoscope/status';
import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import { useState, useTransition } from 'react';
import { AccordionShell, HeaderVariant } from '../shared/AccordionShell';
import { RadioScale } from '../shared/RadioScale';
import { StatusTag } from '../shared/StatusTag';
import styles from './criterion.module.scss';
import { ExampleCallout } from './ExampleCallout';

interface Props {
  slug: CriterionSlug;
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
  openKey: string | null;
  onToggle: (questionKey: string) => void;
  onChanged: (questionKey: string, answered: boolean) => void;
  onRecommendationAdded: () => void;
  isAuthenticated: boolean;
}

export const QuestionAccordion = ({
  slug,
  question,
  number,
  initialValue,
  openKey,
  onToggle,
  onChanged,
  onRecommendationAdded,
  isAuthenticated
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

    if (next !== null && next !== 'tres_satisfaisant') {
      onRecommendationAdded();
    }

    if (!isAuthenticated) {
      if (next === null) deleteLocalAnswer(questionKey);
      else saveLocalAnswer(questionKey, next);
      return;
    }

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
          <Body
            htmlTag="span"
            weight="bold"
            color="#161616"
            style={{ flexShrink: 0 }}
          >
            Q{number}
          </Body>
          <Body htmlTag="span" weight="bold" color="#161616">
            {question.label}
          </Body>
        </>
      }
      accent={question.section}
      variant={headerVariant}
      id={`question-${slug}-${question.id}`}
      open={openKey === questionKey}
      onToggle={() => onToggle(questionKey)}
      headerTag={value ? <StatusTag value={value} /> : null}
    >
      <div className={styles.criterionQuestionBody}>
        <Body size="md" color="#3d3d3d" style={{ lineHeight: 1.6 }}>
          {question.text}
        </Body>
        <ExampleCallout kind={question.exampleKind}>
          {question.example}
        </ExampleCallout>
        <Body size="sm" weight="medium" color="#161616">
          Retrouvez-vous ceci dans votre diagnostic ?
        </Body>
        <RadioScale
          options={ANSWER_OPTIONS}
          value={value}
          onSelect={handleSelect}
          minHint={question.minHint}
          maxHint={question.maxHint}
        />
        {error && (
          <div role="alert">
            <Body size="sm" color="#ce0041">
              L’enregistrement a échoué, merci de réessayer.
            </Body>
          </div>
        )}
      </div>
    </AccordionShell>
  );
};
