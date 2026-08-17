'use client';

import {
  EXCLUSION_PARAM,
  estNavigateurExclu
} from '@/lib/analytics/exclusionNavigateur';
import { useEffect, useState } from 'react';
import styles from './indicateurExclusion.module.scss';

export const IndicateurExclusion = () => {
  const [exclu, setExclu] = useState(false);

  useEffect(() => {
    setExclu(estNavigateurExclu());
  }, []);

  if (!exclu) return null;

  return (
    <div className={styles.indicateur} role="status">
      <span className={styles.pastille} aria-hidden="true" />
      <p className={styles.texte}>
        Ce navigateur est exclu des statistiques : aucune donnée n’est envoyée à
        PostHog depuis cet appareil.{' '}
        <a className={styles.lien} href={`?${EXCLUSION_PARAM}=0`}>
          Réactiver le suivi sur ce navigateur
        </a>
      </p>
    </div>
  );
};
