import AnalyseDiagnosticIcon from '@/assets/svg/custom/analyse-diagnostic.svg';
import { Body, H2 } from '@/design-system/base/Textes';
import { AnswerValue, CriterionSlug, Question } from '@/lib/tacctoscope/types';
import Image from 'next/image';
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
  isAuthenticated: boolean;
}

export const CriterionSection = ({
  slug,
  title,
  description,
  questions,
  onChanged,
  isAuthenticated
}: Props) => (
  <section className={styles.criterionSectionWrapper}>
    <div className={styles.criterionSectionHeader}>
    <div className={styles.criterionSectionTitle}>
      <Image src={AnalyseDiagnosticIcon} alt="" width={24} height={24} />
      <H2
        color="#161616"
        style={{ fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: 0, margin: 0}}
      >
        {title}
      </H2>
    </div>
    <Body size="md" color="#666666">
      {description}
    </Body>
    </div>
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
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  </section>
);
