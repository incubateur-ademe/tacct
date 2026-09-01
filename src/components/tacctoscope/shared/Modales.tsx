'use client';

import enveloppeIcon from '@/assets/icons/enveloppe_icon_white.svg';
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
            className={`${styles.footer} ${compactFooter ? styles.footerCompact : ''} ${
              tightFooterGap ? styles.footerGapTight : ''
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

const InfoIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 0H2C0.895431 0 0 0.895431 0 2V17C0 18.1046 0.895431 19 2 19H17C18.1046 19 19 18.1046 19 17V2C19 0.895431 18.1046 0 17 0ZM10.5 4.5H8.5V6.5H10.5V4.5ZM10.5 8.5H8.5V14.5H10.5V8.5Z"
      fill="#038278"
    />
  </svg>
);

const InfoBlock = ({ children }: { children: ReactNode }) => (
  <div className={styles.infoBlock}>
    <span className={styles.infoBlockIcon}>
      <InfoIcon />
    </span>
    <span>{children}</span>
  </div>
);

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const UnlockModal = ({ isOpen, onClose, onConfirm }: UnlockModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    title="Voulez-vous accéder à tous les critères ?"
    message={
      <>
        Inscrivez-vous ou connectez-vous pour poursuivre et sauvegarder votre
        travail pour la prochaine fois.
        <InfoBlock>
          Les critères suivants sont réservés à certains profils d’utilisateurs.
        </InfoBlock>
      </>
    }
    icon={<LockIcon />}
    cancelLabel={'Non, pas pour\nl’instant'}
    confirmLabel="Oui, se connecter ou créer un compte"
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

interface AccesReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LIEN_CONTACT = 'https://tally.so/r/mJGELz';

export const AccesReserveModal = ({ isOpen, onClose }: AccesReserveModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Accès réservé à certains profils d’utilisateurs"
    icon={<LockIcon />}
    compactFooter
    footer={
      <>
        <BoutonSecondaireClassic size="md" text="Annuler" onClick={onClose} />
        <BoutonPrimaireClassic
          size="md"
          link={LIEN_CONTACT}
          rel="noopener noreferrer"
          text="Contacter l’équipe"
          icone={enveloppeIcon}
        />
      </>
    }
  >
    Si vous souhaitez en savoir plus, nous vous invitons à nous contacter, en
    précisant votre rôle et le contexte de votre demande.
  </Modal>
);

const SaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 19v-6h10v6h2V7.828L16.172 5H5v14h2zM4 3h13l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm5 12v4h6v-4H9z"
      fill="#161616"
    />
  </svg>
);

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SavePromptModal = ({
  isOpen,
  onClose,
  onConfirm
}: SavePromptModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    title="Voulez-vous sauvegarder votre travail ?"
    message={
      <>
        Si vous souhaitez enregistrer vos réponses, créez un compte ou
        connectez-vous.
        <InfoBlock>
          Les critères suivants sont réservés à certains profils d'utilisateurs.
        </InfoBlock>
      </>
    }
    icon={<SaveIcon />}
    cancelLabel={'Non, pas pour\nl’instant'}
    confirmLabel="Oui, se connecter ou créer un compte"
    onClose={onClose}
    onConfirm={onConfirm}
  />
);
