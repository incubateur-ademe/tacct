'use client';

import { CustomAccordion } from '@/design-system/base/Accordion';
import { RoadmapResource } from '@/lib/tacctoscope/content/roadmapResources';
import { RessourceCard } from './RessourceCard';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

interface Props {
  ressources: RoadmapResource[];
  pourApprofondir: RoadmapResource[];
  defaultOpen?: boolean;
}

export const RessourcesAccordion = ({
  ressources,
  pourApprofondir,
  defaultOpen = false
}: Props) => (
  <div className={styles.accordion}>
    <CustomAccordion
      defaultExpanded={defaultOpen}
      label={<span className={styles.accordionLabel}>Ressources associées</span>}
    >
      <div className={styles.accordionContent}>
        <div className={styles.ressourcesWrapper}>
          {ressources.map((ressource, index) => (
            <RessourceCard key={index} ressource={ressource} />
          ))}
        </div>

        {pourApprofondir.length > 0 && (
          <>
            <p className={styles.pourApprofondir}>Pour approfondir</p>
            <div className={styles.ressourcesWrapper}>
              {pourApprofondir.map((ressource, index) => (
                <RessourceCard key={index} ressource={ressource} />
              ))}
            </div>
          </>
        )}
      </div>
    </CustomAccordion>
  </div>
);
