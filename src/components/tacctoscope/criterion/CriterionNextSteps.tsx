import { FlecheDroiteIcon } from '@/design-system/base/BaseIcons';
import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { Criterion, CriterionSlug } from '@/lib/tacctoscope/types';
import styles from './criterion.module.scss';

interface Props {
  slug: CriterionSlug;
  nextCriterion?: Criterion;
}

export const CriterionNextSteps = ({ slug, nextCriterion }: Props) => (
  <div className={styles.criterionNextSteps}>
    {nextCriterion && (
      <BoutonSecondaireClassic
        size="md"
        link={`/tacctoscope/${nextCriterion.slug}`}
        text={`Continuer vers “${nextCriterion.title}”`}
        iconeFin={<FlecheDroiteIcon />}
      />
    )}
    <BoutonPrimaireClassic
      size="md"
      link={`/tacctoscope/feuille-de-route#${slug}`}
      text="Voir ma feuille de route"
      iconeFin={<FlecheDroiteIcon />}
    />
  </div>
);
