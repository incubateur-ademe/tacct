'use client';

import { CriterionBanner } from '@/components/tacctoscope/criterion/CriterionBanner';
import { CriterionFeedback } from '@/components/tacctoscope/criterion/CriterionFeedback';
import { CriterionProgressBar } from '@/components/tacctoscope/criterion/CriterionProgressBar';
import { CriterionSection, SectionQuestion } from '@/components/tacctoscope/criterion/CriterionSection';
import { Body } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { buildQuestionKey } from '@/lib/tacctoscope/keys';
import {
  AnswerMap,
  Criterion,
  CriterionSlug,
  SectionKind
} from '@/lib/tacctoscope/types';
import Link from 'next/link';
import { useState } from 'react';
import styles from './criteres.module.scss';

interface Props {
  criterion: Criterion;
  answers: AnswerMap;
  feedback: boolean | null;
  nextSlug: CriterionSlug | null;
}

const SECTION_META: Record<SectionKind, { title: string; description: string }> =
  {
    analyse: {
      title: 'Analyse de votre diagnostic',
      description: 'Les réponses à ces questions sont à trouver dans le document existant.'
    },
    enquete: {
      title: 'Enquête à mener',
      description:
        'Les réponses à ces questions sont à chercher hors du document final.'
    }
  };

const buildSectionQuestions = (
  criterion: Criterion,
  kind: SectionKind,
  answers: AnswerMap,
  openFirst: boolean
): SectionQuestion[] =>
  criterion.questions
    .filter((question) => question.section === kind)
    .map((question, index) => ({
      question,
      number: index + 1,
      initialValue:
        answers[buildQuestionKey(criterion.slug, question.id)] ?? null,
      defaultOpen: openFirst && index === 0
    }));

export const CriteresView = ({
  criterion,
  answers,
  feedback,
  nextSlug
}: Props) => {
  const [answeredKeys, setAnsweredKeys] = useState<Set<string>>(
    () => new Set(Object.keys(answers))
  );

  const handleChanged = (questionKey: string, answered: boolean) =>
    setAnsweredKeys((current) => {
      if (answered === current.has(questionKey)) return current;
      const next = new Set(current);
      if (answered) next.add(questionKey);
      else next.delete(questionKey);
      return next;
    });

  const analyse = buildSectionQuestions(criterion, 'analyse', answers, true);
  const enquete = buildSectionQuestions(criterion, 'enquete', answers, false);

  return (
    <>
      <div className={styles.criterionBannerOuter}>
        <NewContainer size="xl" style={{ position: "relative", zIndex: 1 }}>
          <CriterionBanner
            slug={criterion.slug}
            title={criterion.title}
            chapeau={criterion.chapeau}
          />
        </NewContainer>
      </div>

      <CriterionProgressBar
        answered={answeredKeys.size}
        total={criterion.questions.length}
        nextSlug={nextSlug}
      />

      <NewContainer size="xl">
        <div className={styles.criterionViewBody}>
          {analyse.length > 0 && (
            <CriterionSection
              slug={criterion.slug}
              title={SECTION_META.analyse.title}
              description={SECTION_META.analyse.description}
              questions={analyse}
              onChanged={handleChanged}
            />
          )}

          {enquete.length > 0 && (
            <CriterionSection
              slug={criterion.slug}
              title={SECTION_META.enquete.title}
              description={SECTION_META.enquete.description}
              questions={enquete}
              onChanged={handleChanged}
            />
          )}

          <CriterionFeedback
            criterionKey={criterion.slug}
            initialValue={feedback}
          />

          <Link href="/tacctoscope" className={styles.criterionViewBackLink}>
            <Body htmlTag="span" weight="medium" color="#038278">
              Retour aux critères
            </Body>
          </Link>
        </div>
      </NewContainer>
    </>
  );
};
