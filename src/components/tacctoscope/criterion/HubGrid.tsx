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
  isAuthenticated: boolean;
}

export const HubGrid = ({ items, isAuthenticated }: Props) => (
  <div className={styles.hubGrid}>
    {items.map((item) => (
      <CriterionCard
        key={item.criterion.slug}
        criterion={item.criterion}
        answered={item.answered}
        total={item.total}
        locked={item.locked}
        isAuthenticated={isAuthenticated}
      />
    ))}
    <RoadmapCard />
  </div>
);
