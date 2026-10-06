import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { Body, H3 } from '@/design-system/base/Textes';
import { ANSWER_LABELS } from '@/lib/tacctoscope/content/options';
import { AnswerValue, CriterionSlug } from '@/lib/tacctoscope/types';
import Link from 'next/link';
import { ReactNode } from 'react';
import { BLOCK_TAGS, BlockKind } from './answerLevels';

export interface SectionQuestionRef {
  questionId: string;
  number: number;
  label: string;
  answer: AnswerValue;
}

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.414 16 16.556 5.858l-1.414-1.414L5 14.586V16h1.414Zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18ZM3 20h18v2H3v-2Z"
      fill="currentColor"
    />
  </svg>
);

export const LevelAccent = ({ level }: { level: BlockKind }) => (
  <span
    className={styles.recoCardAccent}
    style={{ background: BLOCK_TAGS[level].background }}
    aria-hidden="true"
  />
);

export const LevelTag = ({ level }: { level: BlockKind }) => {
  const { tag, background, tagColor, tagWeight = 'regular' } = BLOCK_TAGS[level];
  return (
    <span className={styles.levelTag} style={{ background }}>
      <Body htmlTag="span" size="md" weight={tagWeight} color={tagColor}>
        {tag}
      </Body>
    </span>
  );
};

export const BlockTitle = ({ children }: { children: ReactNode }) => (
  <H3
    color="#161616"
    style={{
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      letterSpacing: 'normal',
      margin: 0
    }}
  >
    {children}
  </H3>
);

interface QuestionQuoteProps {
  slug: CriterionSlug;
  question: SectionQuestionRef;
}

export const QuestionQuote = ({ slug, question }: QuestionQuoteProps) => {
  const answerText =
    question.answer === 'ne_sais_pas'
      ? ANSWER_LABELS.ne_sais_pas
      : `${question.answer} - ${ANSWER_LABELS[question.answer]}`;

  return (
    <Link
      href={`/tacctoscope/${slug}#question-${slug}-${question.questionId}`}
      className={styles.questionQuote}
    >
      <blockquote className={styles.questionQuoteText}>
        <Body size="md" weight="bold" color="#666666" style={{ fontStyle: 'italic' }}>
          Q{question.number} - {question.label}
        </Body>
        <Body size="md" color="#666666" style={{ fontStyle: 'italic' }}>
          “{answerText}”
        </Body>
      </blockquote>
      <span className={styles.questionQuoteAction}>
        <EditIcon />
        <span className={styles.questionQuoteActionLabel}>
          <Body htmlTag="span" size="sm" color="#038278">
            Modifier
          </Body>
        </span>
      </span>
    </Link>
  );
};
