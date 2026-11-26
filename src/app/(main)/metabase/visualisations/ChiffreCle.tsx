import type { ResultatCarte } from '@/lib/queries/metabase/types';
import styles from '../metabase.module.scss';
import { formaterValeur } from '../formatage';

export const ChiffreCle = ({ resultat }: { resultat: ResultatCarte }) => {
  const colonne = resultat.colonnes[0];
  const valeur = resultat.lignes[0]?.[colonne] ?? null;
  return (
    <div className={styles.chiffreCle}>
      <span className={styles.chiffreCleValeur}>{formaterValeur(valeur)}</span>
    </div>
  );
};
