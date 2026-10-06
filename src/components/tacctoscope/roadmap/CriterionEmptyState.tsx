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
      weight="bold"
      size="xl"
      color="#666666">
      Ce critère est vide pour le moment
    </Body>
    <Body
      size="md"
      color="#666666"
      style={{ lineHeight: '1.5rem', paddingBottom: "1.5rem" }}
    >
      Répondez aux questions pour voir apparaître vos pistes d’amélioration ici
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${slug}`}
      text={`Commencer “${title}” →`}
      size="md"
      style={{ maxWidth: '100%', whiteSpace: 'normal', textAlign: 'center' }}
    />
  </div>
);
