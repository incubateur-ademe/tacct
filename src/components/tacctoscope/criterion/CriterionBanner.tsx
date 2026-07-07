import { Body, H1 } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { CRITERION_ICONS } from '../shared/criterionIcons';
import styles from './criterion.module.scss';

interface Props {
  slug: CriterionSlug;
  title: string;
  chapeau: string;
}

export const CriterionBanner = ({ slug, title, chapeau }: Props) => (
  <div className={styles.criterionBannerWrapper}>
    <Image
      src={CRITERION_ICONS[slug]}
      alt=""
      width={80}
      height={80}
      className={styles.criterionBannerIcon}
    />
    <H1
      color="#038278"
      style={{ fontSize: '1.75rem', lineHeight: '2.25rem', letterSpacing: 0 }}
    >
      {title}
    </H1>
    <Body weight="medium" size="md" color="#3d3d3d">
      {chapeau}
    </Body>
  </div>
);
