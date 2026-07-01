'use client';

import { NewContainer } from '@/design-system/layout';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import {
  getRecommendation,
  QuestionRecommendation
} from '@/lib/tacctoscope/content/roadmapResources';
import { buildQuestionKey, isPublicCriterion } from '@/lib/tacctoscope/keys';
import { getCriterionProgress, GlobalState } from '@/lib/tacctoscope/progress';
import { getLocalAnswers } from '@/lib/tacctoscope/localAnswers';
import { AnswerMap } from '@/lib/tacctoscope/types';
import { useEffect, useState } from 'react';
import { RoadmapMenu, RoadmapMenuItem } from './RoadmapMenu';
import { RoadmapSection } from './RoadmapSection';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const QUALIFYING = new Set(['absent', 'partiel', 'satisfaisant']);

interface Props {
  answers: AnswerMap;
  isAuthenticated: boolean;
}

export const FeuilleDeRouteView = ({ answers, isAuthenticated }: Props) => {
  const [hydrated, setHydrated] = useState(isAuthenticated);
  const [currentAnswers, setCurrentAnswers] = useState<AnswerMap>(answers);

  useEffect(() => {
    if (isAuthenticated) return;
    setCurrentAnswers(getLocalAnswers());
    setHydrated(true);
  }, [isAuthenticated]);

  if (!hydrated) return null;

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
    return {
      slug: criterion.slug,
      title: criterion.title,
      state,
      missingCount: total - answered,
      recommendations: criterion.questions
        .filter((question) =>
          QUALIFYING.has(
            currentAnswers[buildQuestionKey(criterion.slug, question.id)] ?? ''
          )
        )
        .map((question) =>
          getRecommendation(buildQuestionKey(criterion.slug, question.id))
        )
        .filter((reco): reco is QuestionRecommendation => reco !== null)
    };
  });

  return (
    <NewContainer size="xl">
      <div className={styles.body}>
        <RoadmapMenu items={menuItems} />
        <div className={styles.content}>
          {sections.map((section) => (
            <RoadmapSection
              key={section.slug}
              slug={section.slug}
              title={section.title}
              state={section.state}
              missingCount={section.missingCount}
              recommendations={section.recommendations}
            />
          ))}
        </div>
      </div>
    </NewContainer>
  );
};
