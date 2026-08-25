import { QuestionRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Link from 'next/link';
import { RessourcesAccordion } from './RessourcesAccordion';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const ReturnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5.828 7l2.536 2.536-1.415 1.414L2 6l4.95-4.95 1.414 1.415L5.828 5H13a8 8 0 110 16H4v-2h9a6 6 0 000-12H5.828z"
      fill="#038278"
    />
  </svg>
);

interface Props {
  slug: CriterionSlug;
  questionId: string;
  recommendation: QuestionRecommendation;
  defaultOpen?: boolean;
}

export const RecommendationBlock = ({
  slug,
  questionId,
  recommendation,
  defaultOpen = false
}: Props) => (
  <article className={styles.recoCard}>
    <h3 className={styles.recoTitle}>{recommendation.title}</h3>
    <p className={styles.recoDescription}>{recommendation.description}</p>
    <div className={styles.recoQuestionLink}>
      <Link
        href={`/tacctoscope/${slug}#question-${slug}-${questionId}`}
        className={styles.questionLink}
      >
        <ReturnIcon />
        Revoir la question
      </Link>
    </div>
    <RessourcesAccordion
      ressources={recommendation.ressources}
      defaultOpen={defaultOpen}
    />
  </article>
);
