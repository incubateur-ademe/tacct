'use client';

import { SectionKind } from '@/lib/tacctoscope/types';
import { ReactNode, useId, useState } from 'react';
import styles from './AccordionShell.module.scss';

export type HeaderVariant = 'default' | 'green' | 'gray';

interface Props {
  title: ReactNode;
  accent?: SectionKind;
  headerVariant?: HeaderVariant;
  headerTag?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
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
  headerVariant = 'default',
  headerTag,
  defaultOpen = false,
  children
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className={`${styles.item} ${accent === 'enquete' ? styles.enquete : ''}`}
    >
      <button
        type="button"
        className={`${styles.header} ${styles[headerVariant]}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.title}>{title}</span>
        {headerTag}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div id={panelId} className={styles.panel}>
          {children}
        </div>
      )}
    </div>
  );
};
