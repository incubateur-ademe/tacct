'use client';

import { CriterionBanner } from '@/components/tacctoscope/criterion/CriterionBanner';
import { CriterionFeedback } from '@/components/tacctoscope/criterion/CriterionFeedback';
import { CriterionProgressBar } from '@/components/tacctoscope/criterion/CriterionProgressBar';
import { CriterionSection, SectionQuestion } from '@/components/tacctoscope/criterion/CriterionSection';
import { SavePromptModal } from '@/components/tacctoscope/shared/Modales';
import { Body } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { buildQuestionKey, isPublicCriterion } from '@/lib/tacctoscope/keys';
import { getLocalAnswers } from '@/lib/tacctoscope/localAnswers';
import {
  AnswerMap,
  Criterion,
  CriterionSlug,
  SectionKind
} from '@/lib/tacctoscope/types';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './criteres.module.scss';

interface Props {
  criterion: Criterion;
  answers: AnswerMap;
  nextSlug: CriterionSlug | null;
  isAuthenticated: boolean;
  userEmail: string;
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
  answers: AnswerMap
): SectionQuestion[] =>
  criterion.questions
    .filter((question) => question.section === kind)
    .map((question, index) => ({
      question,
      number: index + 1,
      initialValue:
        answers[buildQuestionKey(criterion.slug, question.id)] ?? null
    }));

export const CriteresView = ({
  criterion,
  answers,
  nextSlug,
  isAuthenticated,
  userEmail
}: Props) => {
  const orderedKeys = criterion.questions.map((question) =>
    buildQuestionKey(criterion.slug, question.id)
  );
  const firstOpenKey = (answered: Set<string>) =>
    orderedKeys.find((key) => !answered.has(key)) ?? orderedKeys[0] ?? null;

  const [hydrated, setHydrated] = useState(isAuthenticated);
  const [currentAnswers, setCurrentAnswers] = useState<AnswerMap>(answers);
  const [answeredKeys, setAnsweredKeys] = useState<Set<string>>(
    () => new Set(Object.keys(answers))
  );
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(() =>
    isAuthenticated ? firstOpenKey(new Set(Object.keys(answers))) : null
  );

  useEffect(() => {
    if (!isAuthenticated && isPublicCriterion(criterion.slug)) {
      setSavePromptOpen(true);
    }
  }, [isAuthenticated, criterion]);

  useEffect(() => {
    if (isAuthenticated) return;

    const storedAnswers = getLocalAnswers();
    const scopedAnswers: AnswerMap = {};
    for (const question of criterion.questions) {
      const key = buildQuestionKey(criterion.slug, question.id);
      if (storedAnswers[key] != null) scopedAnswers[key] = storedAnswers[key];
    }

    const answeredSet = new Set(Object.keys(scopedAnswers));
    setCurrentAnswers(scopedAnswers);
    setAnsweredKeys(answeredSet);
    setOpenKey(firstOpenKey(answeredSet));
    setHydrated(true);
  }, [isAuthenticated, criterion]);

  useEffect(() => {
    if (!hydrated) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = criterion.questions.find(
      (question) => `question-${criterion.slug}-${question.id}` === hash
    );
    if (!target) return;
    setOpenKey(buildQuestionKey(criterion.slug, target.id));
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    });
  }, [hydrated, criterion]);

  const handleToggle = (key: string) =>
    setOpenKey((current) => (current === key ? null : key));

  const handleChanged = (questionKey: string, answered: boolean) =>
    setAnsweredKeys((current) => {
      if (answered === current.has(questionKey)) return current;
      const next = new Set(current);
      if (answered) next.add(questionKey);
      else next.delete(questionKey);
      return next;
    });

  if (!hydrated) return null;

  const analyse = buildSectionQuestions(criterion, 'analyse', currentAnswers);
  const enquete = buildSectionQuestions(criterion, 'enquete', currentAnswers);

  return (
    <>
      <NewContainer size="xl" style={{ padding: 0, zIndex: 1, position: "relative" }}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            currentPageLabel={criterion.title}
            homeLinkProps={{ href: '/' }}
            segments={[
              { label: 'Boîte à outils', linkProps: { href: '/ressources' } },
              { label: 'TACCToscope', linkProps: { href: '/tacctoscope' } }
            ]}
          />
        </div>
      </NewContainer>
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
        nextSlug={isAuthenticated ? nextSlug : null}
      />

      <NewContainer size="xl">
        <div className={styles.criterionViewBody}>
          {analyse.length > 0 && (
            <CriterionSection
              slug={criterion.slug}
              kind="analyse"
              title={SECTION_META.analyse.title}
              description={SECTION_META.analyse.description}
              questions={analyse}
              openKey={openKey}
              onToggle={handleToggle}
              onChanged={handleChanged}
              isAuthenticated={isAuthenticated}
            />
          )}

          {enquete.length > 0 && (
            <CriterionSection
              slug={criterion.slug}
              kind="enquete"
              title={SECTION_META.enquete.title}
              description={SECTION_META.enquete.description}
              questions={enquete}
              openKey={openKey}
              onToggle={handleToggle}
              onChanged={handleChanged}
              isAuthenticated={isAuthenticated}
            />
          )}

          {isAuthenticated && (
            <CriterionFeedback
              criterionKey={criterion.slug}
              userEmail={userEmail}
            />
          )}

          <Link
            href="/tacctoscope"
            className={styles.criterionViewBackLink}
          >
            <Body htmlTag="span" weight="medium" color="#038278" aria-hidden="true">
              ←
            </Body>
            <Body weight="medium" color="#038278">
              Retour aux critères
            </Body>
          </Link>
        </div>
      </NewContainer>

      <SavePromptModal
        isOpen={savePromptOpen}
        onClose={() => setSavePromptOpen(false)}
        onConfirm={() => {
          window.location.href = '/api/proconnect/login';
        }}
      />
    </>
  );
};
