import { Body, H2 } from '@/design-system/base/Textes';
import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import styles from './criterion.module.scss';
import { QuestionAccordion } from './QuestionAccordion';

export interface SectionQuestion {
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
  defaultOpen?: boolean;
}

interface Props {
  slug: CriterionSlug;
  title: string;
  description: string;
  questions: SectionQuestion[];
  onChanged: (questionKey: string, answered: boolean) => void;
}

export const CriterionSection = ({
  slug,
  title,
  description,
  questions,
  onChanged
}: Props) => (
  <section className={styles.criterionSectionWrapper}>
    <H2
      color="#161616"
      style={{ fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: 0 }}
    >
      {title}
    </H2>
    <Body size="md" color="#666666">
      {description}
    </Body>
    <div className={styles.criterionSectionList}>
      {questions.map((item) => (
        <QuestionAccordion
          key={item.question.id}
          slug={slug}
          question={item.question}
          number={item.number}
          initialValue={item.initialValue}
          defaultOpen={item.defaultOpen}
          onChanged={onChanged}
        />
      ))}
    </div>
  </section>
);
