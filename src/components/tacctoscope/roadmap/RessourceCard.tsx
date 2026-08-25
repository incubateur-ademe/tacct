'use client';

import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { RoadmapResource } from '@/lib/tacctoscope/content/roadmapResources';
import { useState } from 'react';
import { RessourceModal } from './RessourceModal';
import { RessourceTag } from './RessourceTag';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  ressource: RoadmapResource;
}

export const RessourceCard = ({ ressource }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.ressourceCard}
        onClick={() => setModalOpen(true)}
      >
        <span className={styles.ressourceCardText}>
          <span className={styles.ressourceCardTag}>
            <RessourceTag tag={ressource.tag} />
          </span>
          <span className={styles.ressourceCardTitle}>{ressource.title}</span>
          <span className={styles.ressourceCardDescription}>
            <span className={styles.ressourceCardDescriptionClamp}>
              {ressource.description}
            </span>
          </span>
        </span>
        <span className={styles.ressourceCardAction}>
          Voir plus
          <ArrowRightIcon />
        </span>
      </button>

      <RessourceModal
        ressource={ressource}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
