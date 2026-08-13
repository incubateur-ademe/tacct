import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';

export const RoadmapEmptyState = () => (
  <div className={styles.emptyState} style={{ minHeight: "535px" }}>
    <Body weight="bold" size="xl" color="#666666" style={{ lineHeight: '2rem', letterSpacing: 'normal' }}>
      Votre feuille de route est vide pour le moment
    </Body>
    <Body
      size="md"
      color="#666666"
      style={{
        lineHeight: '1.5rem',
        paddingBottom: "1.5rem"
      }}>
      Répondez aux questions des critères pour voir apparaître vos pistes
      d’amélioration ici
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${CRITERIA[0].slug}`}
      text="Commencer l’analyse →"
      size="md"
    />
  </div>
);
