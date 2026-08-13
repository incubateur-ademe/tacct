import { Body } from '@/design-system/base/Textes';
import { CompletedTag } from './CompletedTag';
import styles from './shared.module.scss';

interface Props {
  filled: number;
  total: number;
}

export const ProgressDots = ({ filled, total }: Props) => {
  if (total > 0 && filled >= total) {
    return <CompletedTag />;
  }

  return (
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
        color="#3D3D3D"
        style={{ whiteSpace: 'nowrap', fontWeight: 500 }}
      >
        {filled}/{total} réponses
      </Body>
    </div>
  );
};
