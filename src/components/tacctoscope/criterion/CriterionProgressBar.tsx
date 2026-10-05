import { NewContainer } from '@/design-system/layout';
import { ProgressDots } from '../shared/ProgressDots';
import styles from './criterion.module.scss';

export const CRITERION_PROGRESS_BAR_ID = 'criterion-progress-bar';

interface Props {
  answered: number;
  total: number;
}

export const CriterionProgressBar = ({ answered, total }: Props) => (
  <div
    id={CRITERION_PROGRESS_BAR_ID}
    className={styles.criterionProgressBarOuter}
  >
    <NewContainer
      size="xl"
      style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
    >
      <div className={styles.criterionProgressBarInner}>
        <ProgressDots filled={answered} total={total} />
      </div>
    </NewContainer>
  </div>
);
