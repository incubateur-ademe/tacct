'use client';

import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import JSZip from 'jszip';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadAttachments = async (attachments: string[]) => {
  if (attachments.length === 1) {
    const attachment = attachments[0];
    triggerDownload(attachment, attachment.split('/').pop() ?? attachment);
    return;
  }

  const zip = new JSZip();
  for (const attachment of attachments) {
    const blob = await (await fetch(attachment)).blob();
    zip.file(attachment.split('/').pop() ?? attachment, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);
  triggerDownload(zipUrl, 'cas-reel.zip');
  URL.revokeObjectURL(zipUrl);
};

interface Props {
  attachments: string[];
  accentColor: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CasReelModal = ({
  attachments,
  accentColor,
  isOpen,
  onClose
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(0);
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

  if (!mounted || !isOpen || attachments.length === 0) return null;

  return createPortal(
    <div className={styles.casReelOverlay} onClick={onClose}>
      <div
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
            src={attachments[activeIndex]}
            alt=""
            fill
            sizes="90vw"
            className={styles.casReelImage}
          />
        </div>

        {attachments.length > 1 && (
          <div className={styles.casReelThumbs}>
            {attachments.map((attachment, index) => (
              <button
                key={attachment}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Afficher l'image ${index + 1}`}
                aria-current={index === activeIndex}
                className={`${styles.casReelThumb} ${index === activeIndex ? styles.casReelThumbActive : ''
                  }`}
                style={
                  index === activeIndex ? { borderColor: accentColor } : undefined
                }
              >
                <Image
                  src={attachment}
                  alt=""
                  fill
                  sizes="120px"
                  className={styles.casReelThumbImage}
                />
              </button>
            ))}
          </div>
        )}

        <div className={styles.casReelFooter}>
          <BoutonPrimaireClassic
            size="md"
            text="Télécharger"
            onClick={() => void downloadAttachments(attachments)}
            iconeFin={<TelechargerIcon />}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
