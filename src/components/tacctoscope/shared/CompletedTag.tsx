import styles from './shared.module.scss';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 15.172l9.192-9.193 1.415 1.415L10 18l-6.364-6.364 1.414-1.414z"
      fill="#095d55"
    />
  </svg>
);

export const CompletedTag = () => (
  <span className={styles.completedTag}>
    <CheckIcon />
    Complété
  </span>
);
