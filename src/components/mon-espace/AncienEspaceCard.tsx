'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import captureTacct from '@/assets/images/tacct-image-screenshot.png';
import { BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

export const AncienEspaceCard = () => (
  <div className={styles.ancienEspace}>
    <div className={styles.ancienEspaceTexte}>
      <H3
        color="#038278"
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          letterSpacing: 0,
          margin: 0
        }}
      >
        Votre ancien espace TACCT
      </H3>
      <Body color="#3d3d3d">
        Retrouvez ici l’outil de saisie des données du territoire dans le cadre
        de votre démarche TACCT.
      </Body>
      <BoutonSecondaireClassic
        size="md"
        link="/workspace-tacct"
        text="Accéder à ma saisie  🡢"
      />
    </div>
    <div className={styles.ancienEspaceImage}>
      <Image src={captureTacct} alt="" width={244} height={137} />
    </div>
  </div>
);
