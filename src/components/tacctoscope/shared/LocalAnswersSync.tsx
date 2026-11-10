'use client';

import { Body } from '@/design-system/base/Textes';
import { importLocalAnswers } from '@/lib/queries/tacctoscope';
import {
  clearLocalTacctoscope,
  getLocalAnswers
} from '@/lib/tacctoscope/localAnswers';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ConfirmModal } from './Modales';

interface Props {
  isAuthenticated: boolean;
}

interface Conflict {
  count: number;
  criteria: string[];
}

const conflictMessage = ({ count, criteria }: Conflict) => {
  const questions = count > 1 ? `${count} questions` : '1 question';
  const quoted = criteria.map((title) => `« ${title} »`).join(', ');
  const scope =
    criteria.length > 1 ? `des critères ${quoted}` : `de la catégorie ${quoted}`;
  return `Pour ${questions} ${scope}, ces réponses diffèrent de celles enregistrées dans votre compte.`;
};

export const LocalAnswersSync = ({ isAuthenticated }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const importing = useRef(false);

  // Relancé à chaque page : une popup fermée sans choix est reproposée.
  useEffect(() => {
    if (!isAuthenticated || importing.current) return;
    const localAnswers = getLocalAnswers();
    if (Object.keys(localAnswers).length === 0) return;

    importing.current = true;
    importLocalAnswers(localAnswers, false)
      .then((result) => {
        if (!result.ok) return;
        if (result.inserted > 0) router.refresh();
        if (result.conflicts === 0) clearLocalTacctoscope();
        else
          setConflict({
            count: result.conflicts,
            criteria: result.conflictingCriteria
          });
      })
      .catch(() => undefined)
      .finally(() => {
        importing.current = false;
      });
  }, [isAuthenticated, pathname, router]);

  const dismiss = () => {
    setConflict(null);
    setError(false);
  };

  const keepAccount = () => {
    clearLocalTacctoscope();
    dismiss();
  };

  const applyLocal = async () => {
    setPending(true);
    setError(false);
    const result = await importLocalAnswers(getLocalAnswers(), true).catch(
      () => null
    );
    setPending(false);
    if (!result?.ok) {
      setError(true);
      return;
    }
    clearLocalTacctoscope();
    dismiss();
    router.refresh();
  };

  return (
    <ConfirmModal
      isOpen={conflict !== null}
      title="Attention, certaines réponses entrent en conflit"
      message={
        conflict && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Body color="#3d3d3d">
              Lors d’une précédente visite, vous avez répondu au TACCToscope sur
              ce navigateur sans être connecté·e. {conflictMessage(conflict)}
            </Body>
            <Body color="#3d3d3d">
              Quelles réponses souhaitez-vous conserver dans votre compte ?
            </Body>
            {error && (
              <div role="alert">
                <Body size="sm" color="#ce0041">
                  L’enregistrement a échoué, merci de réessayer.
                </Body>
              </div>
            )}
          </div>
        )
      }
      cancelLabel="Utiliser les réponses de ce navigateur"
      confirmLabel="Conserver les réponses de mon compte"
      pending={pending}
      onCancel={applyLocal}
      onConfirm={keepAccount}
      onClose={() => !pending && dismiss()}
    />
  );
};
