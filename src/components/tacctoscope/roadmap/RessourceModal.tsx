'use client';

import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { RoadmapResource } from '@/lib/tacctoscope/content/roadmapResources';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RessourceTag } from './RessourceTag';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636z"
      fill="#038278"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
      fill="#ffffff"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="#ffffff"
    />
  </svg>
);

// Visuel provisoire : remplacé par `ressource.image` dès que les captures seront fournies.
const VisuelPlaceholder = () => (
  <svg
    viewBox="0 0 180 135"
    className={styles.ressourceModalVisualMedia}
    role="img"
    aria-label="Visuel à venir"
  >
    <rect width="180" height="135" fill="#f0f0f0" />
    <circle cx="126" cy="42" r="14" fill="#d9d9d9" />
    <path d="M18 105l42-48 30 34 21-22 51 58H18z" fill="#c4c4c4" />
  </svg>
);

interface Props {
  ressource: RoadmapResource;
  isOpen: boolean;
  onClose: () => void;
}

export const RessourceModal = ({ ressource, isOpen, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Compense la barre de défilement masquée, sinon le contenu centré se décale.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const externe = ressource.url.startsWith('https');

  return createPortal(
    <div className={styles.ressourceModalOverlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ressource.title}
        className={styles.ressourceModalCard}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.ressourceModalClose}
          onClick={onClose}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        <div className={styles.ressourceModalHeader}>
          <Body htmlTag="span" weight="bold" color="#038278">
            {ressource.title}
          </Body>
          <RessourceTag tag={ressource.tag} />
        </div>

        <div className={styles.ressourceModalBody}>
          <span className={styles.ressourceModalVisual}>
            {ressource.image ? (
              <Image
                src={ressource.image}
                alt=""
                className={styles.ressourceModalVisualMedia}
              />
            ) : (
              <VisuelPlaceholder />
            )}
          </span>

          <div className={styles.ressourceModalText}>
            {ressource.description && (
              <div className={styles.ressourceModalBlock}>
                <Body size="sm" weight="bold" color="#161616">
                  Qu’est-ce que c’est ?
                </Body>
                <Body size="sm" color="#3d3d3d" style={{ lineHeight: 1.6 }}>
                  {ressource.description}
                </Body>
              </div>
            )}

            {ressource.utilite && (
              <div className={styles.ressourceModalBlock}>
                <Body size="sm" weight="bold" color="#161616">
                  Pourquoi est-ce utile ?
                </Body>
                <Body size="sm" color="#3d3d3d" style={{ lineHeight: 1.6 }}>
                  {ressource.utilite}
                </Body>
              </div>
            )}
          </div>
        </div>

        {ressource.url && (
          <div className={styles.ressourceModalFooter}>
            <BoutonPrimaireClassic
              size="md"
              text={externe ? 'Accéder à la ressource' : 'Consulter la ressource'}
              link={ressource.url}
              rel={externe ? 'noopener noreferrer' : undefined}
              iconeFin={externe ? <ExternalLinkIcon /> : <ArrowRightIcon />}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
