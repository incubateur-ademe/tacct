import AnalyseDiagnosticIcon from '@/assets/svg/custom/analyse-diagnostic.svg';
import EnqueteIcon from '@/assets/svg/custom/enquete.svg';
import { Body, H2 } from '@/design-system/base/Textes';
import {
  AnswerValue,
  CriterionSlug,
  Question,
  SectionKind
} from '@/lib/tacctoscope/types';
import Image, { StaticImageData } from 'next/image';
import styles from './criterion.module.scss';
import { QuestionAccordion } from './QuestionAccordion';

export interface SectionQuestion {
  question: Question;
  number: number;
  initialValue: AnswerValue | null;
}

const SECTION_ICON: Record<
  SectionKind,
  { icon: StaticImageData; background: string }
> = {
  analyse: { icon: AnalyseDiagnosticIcon, background: '#d3edeb' },
  enquete: { icon: EnqueteIcon, background: '#ffc9e4' }
};

interface Props {
  slug: CriterionSlug;
  kind: SectionKind;
  title: string;
  description: string;
  questions: SectionQuestion[];
  openKey: string | null;
  onToggle: (questionKey: string) => void;
  onChanged: (questionKey: string, answered: boolean) => void;
  isAuthenticated: boolean;
}

export const CriterionSection = ({
  slug,
  kind,
  title,
  description,
  questions,
  openKey,
  onToggle,
  onChanged,
  isAuthenticated
}: Props) => (
  <section className={styles.criterionSectionWrapper}>
    <div className={styles.criterionSectionHeader}>
    <div className={styles.criterionSectionTitle}>
      <span
        className={styles.criterionSectionIcon}
        style={{ background: SECTION_ICON[kind].background }}
      >
        <Image src={SECTION_ICON[kind].icon} alt="" width={24} height={24} />
      </span>
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
          openKey={openKey}
          onToggle={onToggle}
          onChanged={onChanged}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  </section>
);
