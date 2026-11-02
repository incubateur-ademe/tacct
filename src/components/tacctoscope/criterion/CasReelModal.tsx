'use client';

import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocus } from '../shared/useModalFocus';
import styles from './criterion.module.scss';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636z"
      fill="#038278"
    />
  </svg>
);

const TelechargerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 10h5l-6 6-6-6h5V3h2v7zM4 19h16v2H4v-2z" fill="currentColor" />
  </svg>
);

const triggerDownload = (src: string) => {
  const link = document.createElement('a');
  link.href = src;
  link.download = src.split('/').pop() ?? src;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface Props {
  src: string | null;
  onClose: () => void;
}

export const CasReelModal = ({ src, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);
  const isOpen = src !== null;
  const dialogRef = useModalFocus(mounted && isOpen);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

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

  if (!mounted || src === null) return null;

  return createPortal(
    <div className={styles.casReelOverlay} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cas réel"
        className={styles.casReelCard}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.casReelClose}
          onClick={onClose}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        <div className={styles.casReelVisual}>
          <Image
            src={src}
            alt=""
            fill
            sizes="90vw"
            className={styles.casReelImage}
          />
        </div>

        <div className={styles.casReelFooter}>
          <BoutonPrimaireClassic
            size="md"
            text="Télécharger"
            onClick={() => triggerDownload(src)}
            iconeFin={<TelechargerIcon />}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
