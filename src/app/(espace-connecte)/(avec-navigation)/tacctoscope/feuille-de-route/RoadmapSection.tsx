import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import {
  ANSWER_LEVEL_DISPLAY,
  ANSWER_LEVELS
} from '@/components/tacctoscope/roadmap/answerLevels';
import { CriterionEmptyState } from '@/components/tacctoscope/roadmap/CriterionEmptyState';
import { CriterionNoRecommendationState } from '@/components/tacctoscope/roadmap/CriterionNoRecommendationState';
import { CriterionStrengthState } from '@/components/tacctoscope/roadmap/CriterionStrengthState';
import { NoAnswerHelpLink } from '@/components/tacctoscope/roadmap/NoAnswerHelpLink';
import { PartialRecommendationBanner } from '@/components/tacctoscope/roadmap/PartialRecommendationBanner';
import { QuestionListBlock } from '@/components/tacctoscope/roadmap/QuestionListBlock';
import { RecommendationBlock } from '@/components/tacctoscope/roadmap/RecommendationBlock';
import { SectionQuestionRef } from '@/components/tacctoscope/roadmap/RoadmapBlockParts';
import { CRITERION_ICONS } from '@/components/tacctoscope/shared/criterionIcons';
import { Body, H2 } from '@/design-system/base/Textes';
import { QuestionRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { AnswerCounts, GlobalState } from '@/lib/tacctoscope/progress';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';

export interface SectionRecommendation extends SectionQuestionRef {
  recommendation: QuestionRecommendation;
}

interface Props {
  slug: CriterionSlug;
  title: string;
  state: GlobalState;
  counts: AnswerCounts;
  missingCount: number;
  firstMissingId: string | null;
  strengths: SectionQuestionRef[];
  recommendations: SectionRecommendation[];
  unknowns: SectionQuestionRef[];
  showNoAnswerHelp: boolean;
}

export const RoadmapSection = ({
  slug,
  title,
  state,
  counts,
  missingCount,
  firstMissingId,
  strengths,
  recommendations,
  unknowns,
  showNoAnswerHelp
}: Props) => (
  <section id={slug} className={styles.section}>
    <div className={styles.sectionTitle}>
      <div className={styles.sectionTitleHeading}>
        <Image
          src={CRITERION_ICONS[slug]}
          alt=""
          width={78}
          height={78}
          className={styles.sectionTitleIcon}
        />
        <H2
          color="#038278"
          style={{
            fontSize: '28px',
            lineHeight: '2rem',
            letterSpacing: 'normal',
            margin: 0
          }}
        >
          {title}
        </H2>
      </div>
      <ul className={styles.sectionCounters}>
        {ANSWER_LEVELS.map((level) => (
          <li key={level} className={styles.sectionCounter}>
            <Body htmlTag="span"
              size="lg"
              weight="medium"
              color="#038278"
              style={{ letterSpacing: 0 }}
            >
              {ANSWER_LEVEL_DISPLAY[level].counter}
            </Body>
            <span
              className={styles.sectionCounterBadge}
              style={{ background: ANSWER_LEVEL_DISPLAY[level].background }}
            >
              <Body
                htmlTag="span"
                weight="bold"
                color={ANSWER_LEVEL_DISPLAY[level].countColor}
                style={{ fontSize: '20px' }}
              >
                {counts[level]}
              </Body>
            </span>
          </li>
        ))}
      </ul>
    </div>

    {state === 'vide' ? (
      <CriterionEmptyState slug={slug} title={title} />
    ) : strengths.length === 0 &&
      recommendations.length === 0 &&
      unknowns.length === 0 ? (
      state === 'rempli' ? (
        <CriterionStrengthState slug={slug} />
      ) : (
        <CriterionNoRecommendationState slug={slug} />
      )
    ) : (
      <>
        {state === 'partiel' && (
          <PartialRecommendationBanner
            slug={slug}
            missingCount={missingCount}
            firstMissingId={firstMissingId}
          />
        )}
        {strengths.length > 0 && (
          <QuestionListBlock
            slug={slug}
            kind="pointsForts"
            questions={strengths}
            title={
              <>
                <span aria-hidden="true">💪 </span>
                Bravo, {strengths.length}{' '}
                {strengths.length > 1 ? 'points forts' : 'point fort'} pour
                votre diagnostic !
              </>
            }
          />
        )}
        {recommendations.map((item, index) => (
          <RecommendationBlock
            key={item.questionId}
            slug={slug}
            question={item}
            recommendation={item.recommendation}
            defaultOpen={index === 0}
          />
        ))}
        {unknowns.length > 0 && (
          <QuestionListBlock
            slug={slug}
            kind="aDeterminer"
            questions={unknowns}
            title={`${unknowns.length} ${unknowns.length > 1 ? 'réponses' : 'réponse'} à renseigner pour compléter vos recommandations`}
          >
            {showNoAnswerHelp && <NoAnswerHelpLink />}
          </QuestionListBlock>
        )}
      </>
    )}
  </section>
);
