import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import { QuestionAccordion } from './QuestionAccordion';
import styles from './CriterionSection.module.scss';

export interface SectionQuestion {
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
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
  <section className={styles.section}>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.description}>{description}</p>
    <div className={styles.list}>
      {questions.map((item) => (
        <QuestionAccordion
          key={item.question.id}
          slug={slug}
          question={item.question}
          number={item.number}
          initialValue={item.initialValue}
          onChanged={onChanged}
        />
      ))}
    </div>
  </section>
);
