'use client';

import { Body } from '@/design-system/base/Textes';
import { deleteAnswer, saveAnswer } from '@/lib/queries/tacctoscope';
import { yieldsRecommendation } from '@/lib/tacctoscope/answers';
import { buildQuestionKey } from '@/lib/tacctoscope/keys';
import { deleteLocalAnswer, saveLocalAnswer } from '@/lib/tacctoscope/localAnswers';
import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import { useState, useTransition } from 'react';
import { AccordionShell } from '../shared/AccordionShell';
import { RadioScale } from '../shared/RadioScale';
import { RichText } from '../shared/RichText';
import styles from './criterion.module.scss';
import { ExampleCallout } from './ExampleCallout';

interface Props {
  slug: CriterionSlug;
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
  openKeys: Set<string>;
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
  openKeys,
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

    if (next !== null && yieldsRecommendation(next)) {
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

  const answered = value !== null;
  const titleWeight = answered ? 'regular' : 'bold';

  return (
    <AccordionShell
      title={
        <>
          <Body
            htmlTag="span"
            weight={titleWeight}
            color="#161616"
            style={{ flexShrink: 0 }}
          >
            Q{number}
          </Body>
          <Body htmlTag="span" weight={titleWeight} color="#161616">
            {question.label}
          </Body>
        </>
      }
      accent={question.section}
      highlighted={!answered}
      id={`question-${slug}-${question.id}`}
      open={openKeys.has(questionKey)}
      onToggle={() => onToggle(questionKey)}
    >
      <div className={styles.criterionQuestionBody}>
        <RadioScale value={value} onSelect={handleSelect} />
        {error && (
          <div role="alert">
            <Body size="sm" color="#ce0041">
              L’enregistrement a échoué, merci de réessayer.
            </Body>
          </div>
        )}
        <RichText
          content={question.text}
          size="md"
          color="#3d3d3d"
          style={{ lineHeight: 1.6 }}
        />
        {question.exampleKind === 'both' ? (
          <>
            <ExampleCallout
              kind="exemple"
              attachments={question.exampleAttachments}
              answered={answered}
            >
              {question.example}
            </ExampleCallout>
            <ExampleCallout
              kind="contre-exemple"
              attachments={question.counterExampleAttachments}
              answered={answered}
            >
              {question.counterExample}
            </ExampleCallout>
          </>
        ) : question.exampleKind ? (
          <ExampleCallout
            kind={question.exampleKind}
            attachments={question.exampleAttachments}
            answered={answered}
          >
            {question.example}
          </ExampleCallout>
        ) : null}
      </div>
    </AccordionShell>
  );
};
