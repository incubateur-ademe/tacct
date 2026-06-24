import styles from './ExampleCallout.module.scss';

interface Props {
  children: string;
}

export const ExampleCallout = ({ children }: Props) => (
  <div className={styles.callout}>
    <span className={styles.title}>Exemple</span>
    <p className={styles.text}>{children}</p>
  </div>
);
