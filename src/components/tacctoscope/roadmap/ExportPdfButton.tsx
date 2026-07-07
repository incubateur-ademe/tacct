'use client';

import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
  <path fillRule="evenodd" clipRule="evenodd" d="M0 17H18V19H0V17ZM10 11.172L16.071 5.1L17.485 6.514L9 15L0.515 6.515L1.929 5.1L8 11.17V0H10V11.172Z" fill="#038278"/>
</svg>
);

export const ExportPdfButton = () => (
  <button
    type="button"
    className={styles.exportButton}
    onClick={() => window.print()}
  >
    <PdfIcon />
    Exporter en PDF
  </button>
);
