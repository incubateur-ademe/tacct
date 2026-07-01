import { Criterion } from '@/lib/tacctoscope/types';
import { RoadmapCard } from '../roadmap/RoadmapCard';
import { CriterionCard } from './CriterionCard';
import styles from './criterion.module.scss';

export interface HubItem {
  criterion: Criterion;
  answered: number;
  total: number;
  locked: boolean;
}

interface Props {
  items: HubItem[];
}

export const HubGrid = ({ items }: Props) => (
  <div className={styles.hubGrid}>
    {items.map((item) => (
      <CriterionCard
        key={item.criterion.slug}
        criterion={item.criterion}
        answered={item.answered}
        total={item.total}
        locked={item.locked}
      />
    ))}
    <RoadmapCard />
  </div>
);
