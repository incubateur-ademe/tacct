'use client';

import { CriterionBanner } from '@/components/tacctoscope/criterion/CriterionBanner';
import { CriterionFeedback } from '@/components/tacctoscope/criterion/CriterionFeedback';
import {
  CRITERION_PROGRESS_BAR_ID,
  CriterionProgressBar
} from '@/components/tacctoscope/criterion/CriterionProgressBar';
import { CriterionSection, SectionQuestion } from '@/components/tacctoscope/criterion/CriterionSection';
import { SavePromptModal } from '@/components/tacctoscope/shared/Modales';
import { Toast } from '@/components/utils/Toast';
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
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './criteres.module.scss';

interface Props {
  criterion: Criterion;
  answers: AnswerMap;
  nextSlug: CriterionSlug | null;
  isAuthenticated: boolean;
  userEmail: string;
}

const BulbIcon = () => (
  <svg width="16" height="21" viewBox="0 0 16 21" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.97331 15.999H7.00031V10.999H9.00031V15.999H10.0273C10.1593 14.797 10.7723 13.805 11.7673 12.722C11.8803 12.6 12.5993 11.855 12.6843 11.749C14.6479 9.29586 14.3862 5.74328 12.0844 3.6043C9.78261 1.46532 6.2204 1.46456 3.91767 3.60255C1.61493 5.74055 1.35176 9.29302 3.31431 11.747C3.40031 11.854 4.12131 12.6 4.23231 12.721C5.22831 13.805 5.84131 14.797 5.97331 15.999ZM6.00031 17.999V18.999H10.0003V17.999H6.00031ZM1.75431 12.999C-0.864118 9.72751 -0.514455 4.98985 2.55589 2.13822C5.62623 -0.713411 10.3768 -0.71265 13.4462 2.13996C16.5156 4.99258 16.8638 9.73034 14.2443 13.001C13.6243 13.773 12.0003 14.999 12.0003 16.499V18.999C12.0003 20.1036 11.1049 20.999 10.0003 20.999H6.00031C4.89574 20.999 4.00031 20.1036 4.00031 18.999V16.499C4.00031 14.999 2.37531 13.773 1.75431 12.999Z"
      fill="#FAFAFA"
    />
  </svg>
);

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

const REVEAL_MARGIN = 16;

const revealQuestion = (element: HTMLElement) => {
  const bar = document.getElementById(CRITERION_PROGRESS_BAR_ID);
  const topLimit =
    (bar ? bar.getBoundingClientRect().height : 0) + REVEAL_MARGIN;
  const bottomLimit = window.innerHeight - REVEAL_MARGIN;
  const rect = element.getBoundingClientRect();

  let delta = 0;
  if (rect.height > bottomLimit - topLimit || rect.top < topLimit) {
    delta = rect.top - topLimit;
  } else if (rect.bottom > bottomLimit) {
    delta = Math.min(rect.bottom - bottomLimit, rect.top - topLimit);
  }
  if (delta !== 0) window.scrollBy({ top: delta });
};

const buildSectionQuestions = (
  criterion: Criterion,
  kind: SectionKind,
  answers: AnswerMap
): SectionQuestion[] =>
  criterion.questions
    .map((question, index) => ({ question, number: index + 1 }))
    .filter(({ question }) => question.section === kind)
    .map(({ question, number }) => ({
      question,
      number,
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
  const [completionPrompted, setCompletionPrompted] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(() =>
    isAuthenticated ? firstOpenKey(new Set(Object.keys(answers))) : null
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const scrollAnchor = useRef<{ element: HTMLElement; top: number } | null>(
    null
  );

  const showRecoToast = () => {
    setToastOpen(true);
    setToastKey((key) => key + 1);
  };

  useEffect(() => {
    if (!isAuthenticated && isPublicCriterion(criterion.slug)) {
      setSavePromptOpen(true);
    }
  }, [isAuthenticated, criterion]);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated || !isPublicCriterion(criterion.slug)) return;
    if (answeredKeys.size < criterion.questions.length) {
      setCompletionPrompted(false);
      return;
    }
    if (completionPrompted) return;
    setCompletionPrompted(true);
    setSavePromptOpen(true);
  }, [
    hydrated,
    completionPrompted,
    isAuthenticated,
    criterion,
    answeredKeys
  ]);

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

  /**
   * L'accordéon est exclusif : fermer un panneau situé au-dessus du scroll
   * retire sa hauteur du flux et fait remonter la question cliquée hors écran.
   * On mémorise sa position avant le rendu pour la restaurer juste après.
   */
  const handleToggle = (key: string) => {
    const question = criterion.questions.find(
      (item) => buildQuestionKey(criterion.slug, item.id) === key
    );
    const element = question
      ? document.getElementById(`question-${criterion.slug}-${question.id}`)
      : null;
    scrollAnchor.current = element
      ? { element, top: element.getBoundingClientRect().top }
      : null;
    setOpenKey((current) => (current === key ? null : key));
  };

  useLayoutEffect(() => {
    const anchor = scrollAnchor.current;
    if (!anchor) return;
    scrollAnchor.current = null;
    const delta = anchor.element.getBoundingClientRect().top - anchor.top;
    // 'instant' est indispensable : html a scroll-behavior: smooth !important,
    // qui animerait la correction au lieu de la rendre invisible.
    if (delta !== 0) window.scrollBy({ top: delta, behavior: 'instant' });
    if (openKey) revealQuestion(anchor.element);
  }, [openKey]);

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
        slug={criterion.slug}
        answered={answeredKeys.size}
        total={criterion.questions.length}
        nextSlug={isAuthenticated ? nextSlug : null}
      />

      <NewContainer size="xl" style={{ position: "relative", zIndex: 1 }}>
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
              onRecommendationAdded={showRecoToast}
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
              onRecommendationAdded={showRecoToast}
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
          const returnTo = encodeURIComponent(`/tacctoscope/${criterion.slug}`);
          window.location.href = `/api/proconnect/login?returnTo=${returnTo}`;
        }}
      />

      <Toast
        key={toastKey}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        icon={<BulbIcon />}
        text="Une piste d’amélioration ajoutée à vos recommandations !"
        link={`/tacctoscope/feuille-de-route#${criterion.slug}`}
        linkText="Voir la feuille de route"
      />
    </>
  );
};
