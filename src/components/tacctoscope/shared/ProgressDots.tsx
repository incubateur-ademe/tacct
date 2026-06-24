import { Body } from '@/design-system/base/Textes';
import styles from './shared.module.scss';

interface Props {
  filled: number;
  total: number;
}

export const ProgressDots = ({ filled, total }: Props) => (
  <div className={styles.progressDotsWrapper}>
    <ul className={styles.progressDotsList} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className={
            index < filled ? styles.progressDotsDotFilled : styles.progressDotsDot
          }
        />
      ))}
    </ul>
    <Body
      htmlTag="span"
      size="sm"
      color="#666666"
      style={{ whiteSpace: 'nowrap' }}
    >
      {filled}/{total} réponses
    </Body>
  </div>
);
