import styles from './ProConnectButton.module.scss';

export const ProConnectButton = () => (
  <div>
    <form action="/api/proconnect/login" method="get">
      <button type="submit" className={styles.proconnectButton}>
        <span className={styles.srOnly}>S&apos;identifier avec ProConnect</span>
      </button>
    </form>
    <p>
      <a
        href="https://www.proconnect.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
      >
        Qu’est-ce que ProConnect ?
      </a>
    </p>
  </div>
);
