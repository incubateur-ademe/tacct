import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { ReactNode } from 'react';
import { BlockKind } from './answerLevels';
import {
  BlockTitle,
  LevelAccent,
  LevelTag,
  QuestionQuote,
  SectionQuestionRef
} from './RoadmapBlockParts';

interface Props {
  slug: CriterionSlug;
  kind: BlockKind;
  title: ReactNode;
  questions: SectionQuestionRef[];
  children?: ReactNode;
}

/* Bloc regroupant plusieurs questions : points forts et réponses « Je ne sais pas » */
export const QuestionListBlock = ({
  slug,
  kind,
  title,
  questions,
  children
}: Props) => (
  <article className={styles.recoCard}>
    <LevelAccent level={kind} />
    <div className={styles.recoBody}>
      <LevelTag level={kind} />
      <BlockTitle>{title}</BlockTitle>
      <div className={styles.recoQuotes}>
        {questions.map((question) => (
          <QuestionQuote
            key={question.questionId}
            slug={slug}
            question={question}
          />
        ))}
      </div>
      {children}
    </div>
  </article>
);
