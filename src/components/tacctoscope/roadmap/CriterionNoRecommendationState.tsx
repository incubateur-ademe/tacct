import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';

interface Props {
  slug: CriterionSlug;
}

export const CriterionNoRecommendationState = ({ slug }: Props) => (
  <div className={styles.emptyState}>
    <Body weight="bold" size="xl" color="#666666">
      Aucune recommandation pour ce critère
    </Body>
    <Body size="md" color="#666666" style={{ paddingBottom: "1.5rem" }}>
      Complétez le questionnaire pour voir apparaître vos pistes d’amélioration
      ici
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${slug}`}
      text="Répondre aux questions  →"
      size="md"
    />
  </div>
);
