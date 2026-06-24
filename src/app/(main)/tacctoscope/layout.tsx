import { PropsWithChildren } from 'react';
import styles from './layout.module.scss';

const TacctoscopeLayout = ({ children }: PropsWithChildren) => (
  <div className={styles.container}>{children}</div>
);

export default TacctoscopeLayout;
