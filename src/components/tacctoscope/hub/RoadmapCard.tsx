import { TacctoButton } from '../shared/TacctoButton';
import styles from './RoadmapCard.module.scss';

export const RoadmapCard = () => (
  <div className={styles.card}>
    <div className={styles.content}>
      <h2 className={styles.title}>Votre feuille de route personnalisée</h2>
      <p className={styles.description}>
        Retrouvez sur cette page vos pistes d’amélioration au fil de vos réponses.
      </p>
    </div>
    <TacctoButton href="/tacctoscope/feuille-de-route" variant="primaire" withArrow>
      Voir
    </TacctoButton>
  </div>
);
