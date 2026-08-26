'use client';

import { ConfirmModal } from '@/components/tacctoscope/shared/Modales';

interface Props {
  isOpen: boolean;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModaleQuitter = ({
  isOpen,
  pending,
  onClose,
  onConfirm
}: Props) => (
  <ConfirmModal
    isOpen={isOpen}
    title="Voulez-vous quitter le questionnaire et vous déconnecter ?"
    message="Votre compte ProConnect sera conservé et vous pourrez reprendre le questionnaire plus tard."
    cancelLabel="Non, rester sur le questionnaire"
    confirmLabel="Oui, quitter"
    pending={pending}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);
