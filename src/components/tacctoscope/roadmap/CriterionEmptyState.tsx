import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';

interface Props {
  slug: CriterionSlug;
  title: string;
}

export const CriterionEmptyState = ({ slug, title }: Props) => (
  <div className={styles.emptyState}>
    <Body
      size="md"
      color="#666666"
      weight='medium'
      style={{
        lineHeight: '1.5rem',
        paddingBottom: "1.5rem",
        maxWidth: "30rem",
        fontSize: "18px"
      }}
    >
      Renseignez le questionnaire pour voir apparaître vos pistes d’amélioration ici
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${slug}`}
      text={`Répondre aux questions  →`}
      size="md"
      style={{ maxWidth: '100%', whiteSpace: 'normal', textAlign: 'center' }}
    />
  </div>
);
