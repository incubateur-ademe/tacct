import { QuestionRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { GlobalState } from '@/lib/tacctoscope/progress';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { CRITERION_ICONS } from '../shared/criterionIcons';
import { CriterionEmptyState } from './CriterionEmptyState';
import { PartialRecommendationBanner } from './PartialRecommendationBanner';
import { RecommendationBlock } from './RecommendationBlock';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

interface Props {
  slug: CriterionSlug;
  title: string;
  state: GlobalState;
  missingCount: number;
  recommendations: QuestionRecommendation[];
}

export const RoadmapSection = ({
  slug,
  title,
  state,
  missingCount,
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
      <h2 className={styles.sectionTitleText}>{title}</h2>
    </div>

    {state === 'vide' ? (
      <CriterionEmptyState slug={slug} title={title} />
    ) : (
      <>
        {state === 'partiel' && (
          <PartialRecommendationBanner slug={slug} missingCount={missingCount} />
        )}
        {recommendations.map((recommendation, index) => (
          <RecommendationBlock
            key={index}
            slug={slug}
            recommendation={recommendation}
            defaultOpen={index === 0}
          />
        ))}
      </>
    )}
  </section>
);
