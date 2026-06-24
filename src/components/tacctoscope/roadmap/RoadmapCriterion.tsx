import { Body, H2 } from '@/design-system/base/Textes';
import { RoadmapItem } from '@/lib/tacctoscope/roadmap';
import Link from 'next/link';
import styles from './roadmap.module.scss';

const STATE_LABEL: Record<RoadmapItem['state'], string> = {
  vide: 'Non commencé',
  partiel: 'Partiellement complété',
  rempli: 'Complété'
};

const STATE_CLASS: Record<RoadmapItem['state'], string> = {
  vide: styles.roadmapCriterionStateVide,
  partiel: styles.roadmapCriterionStatePartiel,
  rempli: styles.roadmapCriterionStateRempli
};

interface Props {
  item: RoadmapItem;
}

export const RoadmapCriterion = ({ item }: Props) => (
  <section
    className={`${styles.roadmapCriterionCard} ${STATE_CLASS[item.state]}`}
  >
    <div className={styles.roadmapCriterionHead}>
      <H2
        color="#161616"
        style={{ fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: 0 }}
      >
        {item.title}
      </H2>
      <Body
        htmlTag="span"
        weight="medium"
        color="#666666"
        style={{ fontSize: '0.8125rem' }}
      >
        {STATE_LABEL[item.state]}
      </Body>
    </div>

    {item.state === 'vide' ? (
      <Body size="md" color="#666666">
        Répondez aux questions de ce critère pour voir apparaître vos pistes
        d’amélioration.{' '}
        <Link href={`/tacctoscope/${item.slug}`}>
          <Body htmlTag="span" weight="medium" color="#038278">
            Compléter ce critère
          </Body>
        </Link>
      </Body>
    ) : item.suggestions.length > 0 ? (
      <ul className={styles.roadmapCriterionSuggestions}>
        {item.suggestions.map((suggestion, index) => (
          <li key={index} className={styles.roadmapCriterionSuggestion}>
            <Body size="md" color="#3d3d3d" style={{ lineHeight: 1.5 }}>
              {suggestion}
            </Body>
          </li>
        ))}
      </ul>
    ) : (
      <Body size="md" color="#666666">
        Aucune piste d’amélioration : ce critère est satisfaisant.
      </Body>
    )}
  </section>
);
