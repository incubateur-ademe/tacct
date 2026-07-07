import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';

interface Props {
  slug: CriterionSlug;
  title: string;
}

export const CriterionEmptyState = ({ slug, title }: Props) => (
  <div className={styles.emptyState}>
    <Body weight="bold" size="xl" color="#666666" style={{ lineHeight: '2rem', letterSpacing: 'normal' }}>
      Ce critère est vide pour le moment
    </Body>
    <Body size="md" color="#666666" style={{ lineHeight: '1.5rem', letterSpacing: 'normal', maxWidth: 420 }}>
      Répondez aux questions pour voir apparaître vos pistes d’amélioration ici
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${slug}`}
      text={`Commencer “${title}” →`}
      size="md"
    />
  </div>
);
