'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { HautDePage } from '@/components/mon-espace/HautDePage';
import { NewContainer } from '@/design-system/layout';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { getRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { buildQuestionKey, isPublicCriterion } from '@/lib/tacctoscope/keys';
import { getLocalAnswers } from '@/lib/tacctoscope/localAnswers';
import { getCriterionProgress, GlobalState } from '@/lib/tacctoscope/progress';
import { AnswerMap } from '@/lib/tacctoscope/types';
import { useEffect, useState } from 'react';
import { RoadmapEmptyState } from '@/components/tacctoscope/roadmap/RoadmapEmptyState';
import { RoadmapMenu, RoadmapMenuItem } from '@/components/tacctoscope/roadmap/RoadmapMenu';
import { RoadmapSection, SectionRecommendation } from './RoadmapSection';

const QUALIFYING = new Set(['absent', 'partiel', 'satisfaisant']);

interface Props {
  answers: AnswerMap;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
}

export const FeuilleDeRouteView = ({
  answers,
  isAuthenticated,
  isLoggedIn
}: Props) => {
  const [hydrated, setHydrated] = useState(isAuthenticated);
  const [currentAnswers, setCurrentAnswers] = useState<AnswerMap>(answers);

  useEffect(() => {
    if (isAuthenticated) return;
    setCurrentAnswers(getLocalAnswers());
    setHydrated(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hydrated) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    let handle = 0;
    let frames = 0;
    let stableFrames = 0;
    let previousTop: number | null = null;
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(handle);
    };

    const align = () => {
      if (cancelled) return;
      const target = document.getElementById(hash);
      if (target) {
        const top = target.getBoundingClientRect().top;
        stableFrames =
          previousTop !== null && Math.abs(top - previousTop) < 1
            ? stableFrames + 1
            : 0;
        previousTop = top;
        target.scrollIntoView({ block: 'start' });
      }
      frames += 1;
      if (stableFrames < 10 && frames < 180) {
        handle = requestAnimationFrame(align);
      }
    };

    handle = requestAnimationFrame(align);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);

    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [hydrated]);

  const menuItems: RoadmapMenuItem[] = CRITERIA.map((criterion) => ({
    slug: criterion.slug,
    title: criterion.title,
    locked: !isAuthenticated && !isPublicCriterion(criterion.slug)
  }));

  const sections = CRITERIA.filter(
    (criterion) => isAuthenticated || isPublicCriterion(criterion.slug)
  ).map((criterion) => {
    const { answered, total } = getCriterionProgress(criterion, currentAnswers);
    const state: GlobalState =
      answered === 0 ? 'vide' : answered < total ? 'partiel' : 'rempli';
    const firstMissing = criterion.questions.find(
      (question) =>
        currentAnswers[buildQuestionKey(criterion.slug, question.id)] == null
    );
    return {
      slug: criterion.slug,
      title: criterion.title,
      state,
      missingCount: total - answered,
      firstMissingId: firstMissing ? firstMissing.id : null,
      recommendations: criterion.questions
        .filter((question) =>
          QUALIFYING.has(
            currentAnswers[buildQuestionKey(criterion.slug, question.id)] ?? ''
          )
        )
        .map((question) => {
          const questionKey = buildQuestionKey(criterion.slug, question.id);
          const answer = currentAnswers[questionKey];
          const recommendation = answer
            ? getRecommendation(questionKey, answer)
            : null;
          return recommendation
            ? { questionId: question.id, recommendation }
            : null;
        })
        .filter((item): item is SectionRecommendation => item !== null)
    };
  });

  const isEmpty = Object.keys(currentAnswers).length === 0;

  return (
    <NewContainer size="xl">
      <div className={styles.body}>
        <RoadmapMenu items={menuItems} isLoggedIn={isLoggedIn} />
        <div className={styles.content}>
          {!hydrated ? null : isEmpty ? (
            <RoadmapEmptyState />
          ) : (
            sections.map((section) => (
              <RoadmapSection
                key={section.slug}
                slug={section.slug}
                title={section.title}
                state={section.state}
                missingCount={section.missingCount}
                firstMissingId={section.firstMissingId}
                recommendations={section.recommendations}
              />
            ))
          )}
          {hydrated && <HautDePage />}
        </div>
      </div>
    </NewContainer>
  );
};
