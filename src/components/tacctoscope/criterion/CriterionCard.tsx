import { Body, H2 } from '@/design-system/base/Textes';
import { Criterion } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import Link from 'next/link';
import { CRITERION_ICONS } from '../shared/criterionIcons';
import { ProgressDots } from '../shared/ProgressDots';
import styles from './criterion.module.scss';

interface Props {
  criterion: Criterion;
  answered: number;
  total: number;
}

export const CriterionCard = ({ criterion, answered, total }: Props) => (
  <Link
    href={`/tacctoscope/${criterion.slug}`}
    className={styles.criterionCardLink}
  >
    <div className={styles.criterionCardContent}>
      <Image
        src={CRITERION_ICONS[criterion.slug]}
        alt=""
        width={64}
        height={64}
        className={styles.criterionCardIcon}
      />
      <H2
        color="#038278"
        style={{ fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: 0 }}
      >
        {criterion.title}
      </H2>
      <Body size="sm" color="#3d3d3d">
        {criterion.chapeau}
      </Body>
    </div>
    <div className={styles.criterionCardFooter}>
      <ProgressDots filled={answered} total={total} />
    </div>
  </Link>
);
