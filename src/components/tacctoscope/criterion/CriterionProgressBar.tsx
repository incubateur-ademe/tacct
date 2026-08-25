import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { NewContainer } from '@/design-system/layout';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { ProgressDots } from '../shared/ProgressDots';
import styles from './criterion.module.scss';
import { FlecheDiagonaleIcon } from '@/design-system/base/BaseIcons';

export const CRITERION_PROGRESS_BAR_ID = 'criterion-progress-bar';

interface Props {
  slug: CriterionSlug;
  answered: number;
  total: number;
  nextSlug: CriterionSlug | null;
}

export const CriterionProgressBar = ({
  slug,
  answered,
  total,
  nextSlug
}: Props) => (
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
        <div className={styles.criterionProgressBarActions}>
          {nextSlug && (
            <BoutonSecondaireClassic
              size="md"
              link={`/tacctoscope/${nextSlug}`}
              text="Critère suivant  →"
            />
          )}
          <BoutonPrimaireClassic
            size="md"
            link={`/tacctoscope/feuille-de-route#${slug}`}
            text="Voir ma feuille de route"
            iconeFin={<FlecheDiagonaleIcon />}
          />
        </div>
      </div>
    </NewContainer>
  </div>
);
