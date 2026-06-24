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
  children
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className={`${styles.accordionShellItem} ${VARIANT_CLASS[variant]} ${
        accent === 'enquete' ? styles.accordionShellEnquete : ''
      }`}
    >
      <button
        type="button"
        className={styles.accordionShellHeader}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.accordionShellTitle}>{title}</span>
        {headerTag}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div id={panelId} className={styles.accordionShellPanel}>
          {children}
        </div>
      )}
    </div>
  );
};
