'use client';

import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modales.module.scss';
import { useModalFocus } from './useModalFocus';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636z"
      fill="#038278"
    />
  </svg>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  compactFooter?: boolean;
  tightFooterGap?: boolean;
  largeTitle?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  compactFooter = false,
  tightFooterGap = false,
  largeTitle = false
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useModalFocus(mounted && isOpen);

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

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.card}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        <div className={styles.header}>
          {icon && <span className={styles.headerIcon}>{icon}</span>}
          <p
            className={`${styles.title} ${largeTitle ? styles.titleLarge : ''}`}
          >
            {title}
          </p>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && (
          <div
            className={`${styles.footer} ${compactFooter ? styles.footerCompact : ''} ${tightFooterGap ? styles.footerGapTight : ''
              }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  compactFooter?: boolean;
  tightFooterGap?: boolean;
  largeTitle?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  icon,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  pending = false,
  compactFooter = false,
  tightFooterGap = false,
  largeTitle = false,
  onConfirm,
  onClose
}: ConfirmModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    icon={icon}
    compactFooter={compactFooter}
    tightFooterGap={tightFooterGap}
    largeTitle={largeTitle}
    footer={
      <>
        <BoutonSecondaireClassic
          size="md"
          text={cancelLabel}
          onClick={onClose}
          disabled={pending}
          style={{ whiteSpace: 'pre-line' }}
        />
        <BoutonPrimaireClassic
          size="md"
          text={confirmLabel}
          onClick={onConfirm}
          disabled={pending}
          style={{ whiteSpace: 'pre-line', textAlign: 'center' }}
        />
      </>
    }
  >
    {message}
  </Modal>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2"
      stroke="#161616"
      strokeWidth="1.6"
    />
    <path d="M8 10V7a4 4 0 018 0v3" stroke="#161616" strokeWidth="1.6" />
    <circle cx="12" cy="15" r="1.5" fill="#161616" />
  </svg>
);

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const UnlockModal = ({ isOpen, onClose, onConfirm }: UnlockModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    title="Connectez-vous pour continuer"
    message={
      <>
        Accédez à l’ensemble du questionnaire et enregistrez vos réponses et votre feuille de route.
      </>
    }
    icon={<LockIcon />}
    cancelLabel={'Non, pas pour\nl’instant'}
    confirmLabel={'Oui, se connecter\nou créer un compte'}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);
