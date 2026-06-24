import styles from './ProgressDots.module.scss';

interface Props {
  filled: number;
  total: number;
}

export const ProgressDots = ({ filled, total }: Props) => (
  <div className={styles.progress}>
    <ul className={styles.dots} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className={index < filled ? styles.dotFilled : styles.dot}
        />
      ))}
    </ul>
    <span className={styles.label}>
      {filled}/{total} réponses
    </span>
  </div>
);
