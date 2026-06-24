import { Criterion } from '@/lib/tacctoscope/types';
import Link from 'next/link';
import { ProgressDots } from '../shared/ProgressDots';
import styles from './CriterionCard.module.scss';

interface Props {
  criterion: Criterion;
  answered: number;
  total: number;
}

export const CriterionCard = ({ criterion, answered, total }: Props) => (
  <Link href={`/tacctoscope/${criterion.slug}`} className={styles.card}>
    <div className={styles.content}>
      <h2 className={styles.title}>{criterion.title}</h2>
      <p className={styles.description}>{criterion.chapeau}</p>
    </div>
    <div className={styles.footer}>
      <ProgressDots filled={answered} total={total} />
    </div>
  </Link>
);
