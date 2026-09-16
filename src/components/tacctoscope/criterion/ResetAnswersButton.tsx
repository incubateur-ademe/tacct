'use client';

import { resetAllAnswers } from '@/lib/queries/tacctoscope';
import { clearLocalTacctoscope } from '@/lib/tacctoscope/localAnswers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmModal } from '../shared/Modales';
import styles from './criterion.module.scss';

const ResetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5.463 4.433A9.961 9.961 0 0112 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 006.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0112 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0013.54 5.772l.997 1.795z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  isAuthenticated: boolean;
}

export const ResetAnswersButton = ({ isAuthenticated }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleReset = async () => {
    setPending(true);
    if (isAuthenticated) await resetAllAnswers();
    else clearLocalTacctoscope();
    router.refresh();
    setPending(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.resetButton}
        onClick={() => setIsOpen(true)}
      >
        <ResetIcon />
        Réinitialiser toutes les réponses
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Réinitialiser toutes les réponses ?"
        message="Toutes vos réponses seront effacées. Cette action est irréversible."
        icon={<ResetIcon />}
        confirmLabel="Réinitialiser"
        cancelLabel="Annuler"
        pending={pending}
        compactFooter
        onConfirm={handleReset}
        onClose={() => !pending && setIsOpen(false)}
      />
    </>
  );
};
