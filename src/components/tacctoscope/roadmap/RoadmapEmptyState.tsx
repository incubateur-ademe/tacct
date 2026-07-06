import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import Link from 'next/link';

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2h12.172z"
      fill="#fafafa"
    />
  </svg>
);

export const RoadmapEmptyState = () => (
  <div className={styles.emptyState}>
    <p className={styles.emptyStateTitle}>
      Votre feuille de route est vide pour le moment
    </p>
    <p className={styles.emptyStateText}>
      Répondez aux questions des critères pour voir apparaître vos pistes
      d’amélioration ici
    </p>
    <Link
      href={`/tacctoscope/${CRITERIA[0].slug}`}
      className={styles.emptyStateButton}
    >
      Commencer l’analyse
      <ArrowRightIcon />
    </Link>
  </div>
);
