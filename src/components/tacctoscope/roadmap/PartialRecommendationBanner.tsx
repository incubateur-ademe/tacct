import { CriterionSlug } from '@/lib/tacctoscope/types';
import Link from 'next/link';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2l10 18H2L12 2zm0 4.126L5.44 18h13.12L12 6.126zM11 15h2v2h-2v-2zm0-6h2v5h-2V9z"
      fill="#903700"
    />
  </svg>
);

const ArrowRightSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2h12.172z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  slug: CriterionSlug;
  missingCount: number;
}

export const PartialRecommendationBanner = ({ slug, missingCount }: Props) => (
  <div className={styles.partialBanner}>
    <div className={styles.partialBannerLeft}>
      <WarningIcon />
      <span className={styles.partialBannerTitle}>Recommandation partielle</span>
    </div>
    <Link href={`/tacctoscope/${slug}`} className={styles.partialBannerLink}>
      {missingCount === 1
        ? 'Renseigner la question manquante'
        : `Renseigner les ${missingCount} questions manquantes`}
      <ArrowRightSmall />
    </Link>
  </div>
);
