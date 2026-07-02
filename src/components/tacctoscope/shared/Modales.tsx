'use client';

import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modales.module.scss';

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
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
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
          <p className={styles.title}>{title}</p>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
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
  onConfirm,
  onClose
}: ConfirmModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    icon={icon}
    footer={
      <>
        <BoutonSecondaireClassic
          size="md"
          text={cancelLabel}
          onClick={onClose}
          disabled={pending}
        />
        <BoutonPrimaireClassic
          size="md"
          text={confirmLabel}
          onClick={onConfirm}
          disabled={pending}
        />
      </>
    }
  >
    {message}
  </Modal>
);
