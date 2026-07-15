import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Link from 'next/link';

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#903700" />
    <rect x="11" y="10" width="2" height="7" fill="#FFD1B4" />
    <rect x="11" y="6" width="2" height="2" fill="#FFD1B4" />
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
      <InfoIcon />
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
