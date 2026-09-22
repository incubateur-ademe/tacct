import styles from './questionnaire.module.scss';

interface Props {
  pourcentage: number;
  texte: string;
}

export const BarreDeProgression = ({ pourcentage, texte }: Props) => (
  <div
    role="progressbar"
    aria-valuenow={pourcentage}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuetext={texte}
    className={styles.barreProgression}
  >
    <div
      className={styles.barreProgressionRemplissage}
      style={{ width: `${pourcentage}%` }}
    />
  </div>
);
