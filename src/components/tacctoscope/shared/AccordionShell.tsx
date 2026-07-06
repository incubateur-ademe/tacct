'use client';

import { SectionKind } from '@/lib/tacctoscope/types';
import { ReactNode, useId, useState } from 'react';
import styles from './shared.module.scss';

export type HeaderVariant = 'default' | 'green' | 'gray';

const VARIANT_CLASS: Record<HeaderVariant, string> = {
  default: styles.accordionShellVariantDefault,
  green: styles.accordionShellVariantGreen,
  gray: styles.accordionShellVariantGray
};

interface Props {
  title: ReactNode;
  accent?: SectionKind;
  variant?: HeaderVariant;
  headerTag?: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`${styles.accordionShellChevron} ${
      open ? styles.accordionShellChevronOpen : ''
    }`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m7 10 5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AccordionShell = ({
  title,
  accent = 'analyse',
  variant = 'default',
  headerTag,
  defaultOpen = false,
  id,
  open,
  onToggle,
  children
}: Props) => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;
  const panelId = useId();

  const toggle = () => {
    if (isControlled) onToggle?.();
    else setInternalOpen((value) => !value);
  };

  return (
    <div
      id={id}
      className={`${styles.accordionShellItem} ${VARIANT_CLASS[variant]} ${
        accent === 'enquete' ? styles.accordionShellEnquete : ''
      }`}
    >
      <button
        type="button"
        className={styles.accordionShellHeader}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className={styles.accordionShellTitle}>{title}</span>
        {headerTag}
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div id={panelId} className={styles.accordionShellPanel}>
          {children}
        </div>
      )}
    </div>
  );
};
