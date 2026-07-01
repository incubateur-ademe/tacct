import { CriterionSlug } from '@/lib/tacctoscope/types';
import Link from 'next/link';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2h12.172z"
      fill="#fafafa"
    />
  </svg>
);

interface Props {
  slug: CriterionSlug;
  title: string;
}

export const CriterionEmptyState = ({ slug, title }: Props) => (
  <div className={styles.emptyState}>
    <p className={styles.emptyStateTitle}>Ce critère est vide pour le moment</p>
    <p className={styles.emptyStateText}>
      Répondez aux questions pour voir apparaître vos pistes d’amélioration ici
    </p>
    <Link href={`/tacctoscope/${slug}`} className={styles.emptyStateButton}>
      Commencer “{title}”
      <ArrowRightIcon />
    </Link>
  </div>
);
