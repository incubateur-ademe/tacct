import { Criterion } from '@/lib/tacctoscope/types';
import { CriterionCard } from './CriterionCard';
import { RoadmapCard } from './RoadmapCard';
import styles from './HubGrid.module.scss';

export interface HubItem {
  criterion: Criterion;
  answered: number;
  total: number;
}

interface Props {
  items: HubItem[];
}

export const HubGrid = ({ items }: Props) => (
  <div className={styles.grid}>
    {items.map((item) => (
      <CriterionCard
        key={item.criterion.slug}
        criterion={item.criterion}
        answered={item.answered}
        total={item.total}
      />
    ))}
    <RoadmapCard />
  </div>
);
