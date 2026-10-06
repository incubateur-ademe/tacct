'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { CustomAccordion } from '@/design-system/base/Accordion';
import { RoadmapResource } from '@/lib/tacctoscope/content/roadmapResources';
import { useState } from 'react';
import { RessourceCard } from './RessourceCard';

interface Props {
  ressources: RoadmapResource[];
  defaultOpen?: boolean;
}

export const RessourcesAccordion = ({
  ressources,
  defaultOpen = false
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  if (ressources.length === 0) return null;

  return (
    <div className={styles.accordion}>
      <CustomAccordion
        isOpen={open}
        onToggle={() => setOpen((value) => !value)}
        label={
          <span className={styles.accordionLabel}>
            {open ? 'Masquer' : 'Afficher'} les ressources associées
          </span>
        }
      >
        <div className={styles.accordionContent}>
          {ressources.length > 0 && (
            <div className={styles.ressourcesWrapper}>
              {ressources.map((ressource, index) => (
                <RessourceCard key={index} ressource={ressource} />
              ))}
            </div>
          )}
        </div>
      </CustomAccordion>
    </div>
  );
};
