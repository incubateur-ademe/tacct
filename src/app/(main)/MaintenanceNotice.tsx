'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';

const MAINTENANCE_KEY = 'notice-maintenance-juin-2026-fermee';
const PHASE_1_END = new Date('2026-06-07T23:59:59');
const PHASE_2_END = new Date('2026-06-08T12:00:00');

const getMaintenancePhase = (): 1 | 2 | null => {
  const now = Date.now();
  if (now <= PHASE_1_END.getTime()) return 1;
  if (now <= PHASE_2_END.getTime()) return 2;
  return null;
};

export const MaintenanceNotice = () => {
  const { css } = useStyles();
  const [closed, setClosed] = useState(true);
  const phase = getMaintenancePhase();

  useEffect(() => {
    setClosed(localStorage.getItem(MAINTENANCE_KEY) === 'true');
  }, []);

  if (phase === null || closed) return null;

  return (
    <Notice
      className={css({
        backgroundColor: 'var(--gris-medium)',
        color: "#201F1E"
      })}
      isClosable
      onClose={() => {
        localStorage.setItem(MAINTENANCE_KEY, 'true');
        setClosed(true);
      }}
      title="Interruption de service :"
      description={
        phase === 1 ? (
          <>
            Nous vous informons qu'une maintenance est prévue le{' '}
            <strong>lundi 8 juin, de 9h00 à 11h00</strong>. Durant cette période,{' '}
            <strong>
              vous pourrez accéder à l'ensemble de notre site, à l'exception du compte TACCT qui
              sera temporairement indisponible
            </strong>
            . Veuillez nous excuser pour la gêne occasionnée.
          </>
        ) : (
          <>
            Nous vous informons qu'une maintenance est prévue{' '}
            <strong>aujourd'hui, de 9h00 à 11h00</strong>. Durant cette période,{' '}
            <strong>
              vous pouvez accéder à l'ensemble de notre site, à l'exception du compte TACCT qui est
              temporairement indisponible
            </strong>
            . Veuillez nous excuser pour la gêne occasionnée.
          </>
        )
      }
    />
  );
};
