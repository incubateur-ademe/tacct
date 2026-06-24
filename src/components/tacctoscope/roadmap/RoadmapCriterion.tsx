import { RoadmapItem } from '@/lib/tacctoscope/roadmap';
import Link from 'next/link';
import styles from './RoadmapCriterion.module.scss';

const STATE_LABEL: Record<RoadmapItem['state'], string> = {
  vide: 'Non commencé',
  partiel: 'Partiellement complété',
  rempli: 'Complété'
};

interface Props {
  item: RoadmapItem;
}

export const RoadmapCriterion = ({ item }: Props) => (
  <section className={`${styles.card} ${styles[item.state]}`}>
    <div className={styles.head}>
      <h2 className={styles.title}>{item.title}</h2>
      <span className={styles.badge}>{STATE_LABEL[item.state]}</span>
    </div>

    {item.state === 'vide' ? (
      <p className={styles.empty}>
        Répondez aux questions de ce critère pour voir apparaître vos pistes
        d’amélioration.{' '}
        <Link href={`/tacctoscope/${item.slug}`} className={styles.link}>
          Compléter ce critère
        </Link>
      </p>
    ) : item.suggestions.length > 0 ? (
      <ul className={styles.suggestions}>
        {item.suggestions.map((suggestion, index) => (
          <li key={index} className={styles.suggestion}>
            {suggestion}
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.empty}>
        Aucune piste d’amélioration : ce critère est satisfaisant.
      </p>
    )}
  </section>
);
