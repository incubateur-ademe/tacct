import { CriterionSlug } from '@/lib/tacctoscope/types';
import { ProgressDots } from '../shared/ProgressDots';
import { TacctoButton } from '../shared/TacctoButton';
import styles from './CriterionHeader.module.scss';

interface Props {
  title: string;
  chapeau: string;
  answered: number;
  total: number;
  nextSlug: CriterionSlug | null;
}

export const CriterionHeader = ({
  title,
  chapeau,
  answered,
  total,
  nextSlug
}: Props) => (
  <header className={styles.header}>
    <div className={styles.heading}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.chapeau}>{chapeau}</p>
      <ProgressDots filled={answered} total={total} />
    </div>
    <div className={styles.actions}>
      {nextSlug && (
        <TacctoButton
          href={`/tacctoscope/${nextSlug}`}
          variant="secondaire"
          withArrow
        >
          Critère suivant
        </TacctoButton>
      )}
      <TacctoButton
        href="/tacctoscope/feuille-de-route"
        variant="primaire"
        withArrow
      >
        Voir ma feuille de route
      </TacctoButton>
    </div>
  </header>
);
