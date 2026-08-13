import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { Body, H2 } from '@/design-system/base/Textes';
import { QuestionRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { GlobalState } from '@/lib/tacctoscope/progress';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { CriterionEmptyState } from '../../../../components/tacctoscope/roadmap/CriterionEmptyState';
import { CriterionNoRecommendationState } from '../../../../components/tacctoscope/roadmap/CriterionNoRecommendationState';
import { CriterionStrengthState } from '../../../../components/tacctoscope/roadmap/CriterionStrengthState';
import { PartialRecommendationBanner } from '../../../../components/tacctoscope/roadmap/PartialRecommendationBanner';
import { RecommendationBlock } from '../../../../components/tacctoscope/roadmap/RecommendationBlock';
import { CRITERION_ICONS } from '../../../../components/tacctoscope/shared/criterionIcons';

export interface SectionRecommendation {
  questionId: string;
  recommendation: QuestionRecommendation;
}

interface Props {
  slug: CriterionSlug;
  title: string;
  state: GlobalState;
  missingCount: number;
  firstMissingId: string | null;
  recommendations: SectionRecommendation[];
}

export const RoadmapSection = ({
  slug,
  title,
  state,
  missingCount,
  firstMissingId,
  recommendations
}: Props) => (
  <section id={slug} className={styles.section}>
    <div className={styles.sectionTitle}>
      <Image
        src={CRITERION_ICONS[slug]}
        alt=""
        width={64}
        height={64}
        className={styles.sectionTitleIcon}
      />
      <div className={styles.sectionTitleContent}>
        <H2
          color="#038278"
          style={{
            fontSize: '1.5rem',
            lineHeight: '2rem',
            letterSpacing: 'normal',
            margin: 0
          }}
        >
          {title}
        </H2>
        <Body size="sm" weight="bold" style={{ color: '#038278' }}>
          {recommendations.length} piste
          {recommendations.length > 1 ? 's' : ''} d’amélioration
        </Body>
      </div>
    </div>

    {state === 'vide' ? (
      <CriterionEmptyState slug={slug} title={title} />
    ) : recommendations.length === 0 ? (
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
        {recommendations.map((item, index) => (
          <RecommendationBlock
            key={index}
            slug={slug}
            questionId={item.questionId}
            recommendation={item.recommendation}
            defaultOpen={index === 0}
          />
        ))}
      </>
    )}
  </section>
);
