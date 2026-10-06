'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { FlecheDroiteIcon } from '@/design-system/base/BaseIcons';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H2 } from '@/design-system/base/Textes';

const RETOUR_APRES_CONNEXION = '/tacctoscope/feuille-de-route';

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1ZM5 12v8h14v-8H5Zm6 2h2v4h-2v-4Zm6-4V9A5 5 0 0 0 7 9v1h10Z"
      fill="#3D3D3D"
    />
  </svg>
);

export const RoadmapLoginBlock = () => (
  <section className={styles.loginBlock}>
    <LockIcon />
    <H2
      color="#3D3D3D"
      style={{
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
        letterSpacing: 'normal',
        margin: 0
      }}
    >
      Connectez-vous pour continuer vers les autres catégories
    </H2>
    <Body size="md" color="#666666" style={{ lineHeight: '1.5rem', maxWidth: '26rem' }}>
      La suite du TACCToscope est accessible sur connexion.
    </Body>
    <BoutonPrimaireClassic
      size="md"
      text="Se connecter ou créer un compte"
      iconeFin={<FlecheDroiteIcon />}
      style={{ marginTop: '0.75rem' }}
      onClick={() => {
        const returnTo = encodeURIComponent(RETOUR_APRES_CONNEXION);
        window.location.href = `/api/proconnect/login?returnTo=${returnTo}`;
      }}
    />
  </section>
);
