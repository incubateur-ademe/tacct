'use client';

import { BoutonPrimaireClassic, BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import posthog from 'posthog-js';
import {
  Survey,
  SurveyQuestion,
  SurveyQuestionBranchingType,
  SurveyQuestionType
} from 'posthog-js';
import { useEffect, useRef, useState } from 'react';
import styles from './criterion.module.scss';

interface Props {
  criterionKey: CriterionSlug;
}

const MAX_TEXTAREA_HEIGHT = 320;
const END = 'end';

type NextStep = number | typeof END;

const responseKey = (questionId: string) => `$survey_response_${questionId}`;

const MailCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13.5 20H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M3.6 4.8 12 11.8l8.4-7"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="m14.4 18.1 3 3 4.2-4.9"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="miter"
    />
  </svg>
);

/**
 * Réplique la résolution de branchement de posthog-js : pour un choix unique,
 * `responseValues` est indexé par le rang du choix, et vaut soit l'index de la
 * question cible, soit « end ».
 */
const resolveNextStep = (
  survey: Survey,
  index: number,
  response: string
): NextStep => {
  const question = survey.questions[index];
  const fallback: NextStep =
    index === survey.questions.length - 1 ? END : index + 1;
  const branching = question.branching;
  if (!branching?.type) return fallback;
  if (branching.type === SurveyQuestionBranchingType.End) return END;
  if (branching.type === SurveyQuestionBranchingType.SpecificQuestion) {
    return Number.isInteger(branching.index) ? branching.index : fallback;
  }
  if (
    branching.type === SurveyQuestionBranchingType.ResponseBased &&
    question.type === SurveyQuestionType.SingleChoice
  ) {
    const choiceIndex = question.choices.indexOf(response);
    if (choiceIndex === -1) return fallback;
    const target: unknown = branching.responseValues[choiceIndex];
    if (typeof target === 'number' && Number.isInteger(target)) return target;
    if (target === END) return END;
  }
  return fallback;
};

export const CriterionFeedback = ({ criterionKey }: Props) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  const submissionId = useRef<string>('');
  const shownFor = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const surveyId = process.env.NEXT_PUBLIC_POSTHOG_TACCTOSCOPE_SURVEY_ID;
    if (!surveyId || !posthog.__loaded) return;
    posthog.getSurveys((available) => {
      const match = available.find((item) => item.id === surveyId);
      if (match) setSurvey(match);
    });
  }, []);

  useEffect(() => {
    setQuestionIndex(0);
    setResponses({});
    setComment('');
    setDone(false);
    submissionId.current = crypto.randomUUID();
  }, [criterionKey]);

  useEffect(() => {
    if (!survey) return;
    const shownKey = `${survey.id}:${criterionKey}`;
    if (shownFor.current === shownKey) return;
    shownFor.current = shownKey;
    posthog.capture('survey shown', {
      $survey_id: survey.id,
      $survey_name: survey.name,
      $survey_iteration: survey.current_iteration,
      $survey_iteration_start_date: survey.current_iteration_start_date,
      critere: criterionKey
    });
  }, [survey, criterionKey]);

  const send = (
    current: Survey,
    nextResponses: Record<string, string>,
    completed: boolean
  ) => {
    posthog.capture('survey sent', {
      $survey_id: current.id,
      $survey_name: current.name,
      $survey_iteration: current.current_iteration,
      $survey_iteration_start_date: current.current_iteration_start_date,
      $survey_questions: current.questions.map((question) => ({
        id: question.id,
        question: question.question,
        response: question.id ? nextResponses[responseKey(question.id)] ?? null : null
      })),
      $survey_submission_id: submissionId.current,
      $survey_completed: completed,
      ...nextResponses,
      critere: criterionKey
    });
  };

  const answer = (question: SurveyQuestion, value: string) => {
    if (!survey || !question.id) return;
    const nextResponses = {
      ...responses,
      [responseKey(question.id)]: value
    };
    const nextStep = resolveNextStep(survey, questionIndex, value);
    const completed = nextStep === END;
    setResponses(nextResponses);
    send(survey, nextResponses, completed);
    if (completed) setDone(true);
    else setQuestionIndex(nextStep);
  };

  const handleCommentChange = (value: string) => {
    setComment(value);
    const element = textareaRef.current;
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  };

  if (!survey || questionIndex >= survey.questions.length) return null;

  if (done) {
    return (
      <div className={styles.feedback}>
        <div className={styles.feedbackThanks}>
          <MailCheckIcon />
          Merci, vos retours sont précieux !
        </div>
      </div>
    );
  }

  const question = survey.questions[questionIndex];

  if (question.type === SurveyQuestionType.SingleChoice) {
    return (
      <div className={styles.feedback}>
        <div className={styles.feedbackHeader}>
          <span className={styles.feedbackQuestion}>{question.question}</span>
          <div
            className={styles.feedbackChoices}
            role="group"
            aria-label={question.question}
          >
            {question.choices.map((choice) => (
              <BoutonSecondaireClassic
                key={choice}
                size="md"
                text={choice}
                onClick={() => answer(question, choice)}
                style={{ border: '1.6px solid #038278' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      <div className={styles.feedbackHeader}>
        <span className={styles.feedbackQuestion}>{question.question}</span>
      </div>
      <div className={styles.feedbackExpand}>
        <textarea
          ref={textareaRef}
          className={styles.feedbackTextarea}
          value={comment}
          onChange={(event) => handleCommentChange(event.target.value)}
          placeholder="Renseignez..."
          aria-label={question.question}
        />
        <div className={styles.feedbackSubmitRow}>
          <BoutonPrimaireClassic
            size="md"
            text={question.buttonText || 'Envoyer'}
            disabled={!comment.trim()}
            onClick={() => answer(question, comment.trim())}
          />
        </div>
      </div>
    </div>
  );
};
