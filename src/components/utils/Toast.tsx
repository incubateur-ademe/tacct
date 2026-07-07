'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.scss';

const ArrowRightUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.004 9.414l-8.607 8.607-1.414-1.414L14.589 8H7.004V6h11v11h-2V9.414z"
      fill="#fafafa"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636z"
      fill="#fafafa"
    />
  </svg>
);

interface ToastProps {
  open: boolean;
  onClose: () => void;
  text: string;
  icon?: ReactNode;
  link?: string;
  linkText?: string;
  duration?: number;
}

export const Toast = ({
  open,
  onClose,
  text,
  icon,
  link,
  linkText,
  duration = 6000
}: ToastProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.toast}>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <p className={styles.text}>{text}</p>
          </div>
          {link && linkText && (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {linkText}
              <ArrowRightUpIcon />
            </Link>
          )}
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>
      </div>
    </div>,
    document.body
  );
};
