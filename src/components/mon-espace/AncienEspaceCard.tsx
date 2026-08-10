'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import sessionAccueil from '@/assets/images/session-accueil.png';
import captureTacct from '@/assets/images/tacct-image-screenshot.png';
import { BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

export const AncienEspaceCard = ({ validated }: { validated: boolean }) => (
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
        {validated ? 'Votre ancien espace TACCT' : 'Le service TACCT'}
      </H3>
      <Body color="#3d3d3d">
        {validated
          ? 'Retrouvez ici l’outil de saisie des données du territoire dans le cadre de votre démarche TACCT.'
          : 'Commencez votre démarche d’adaptation à votre rythme'}
      </Body>
      {validated ? (
        <BoutonSecondaireClassic
          size="md"
          link="/workspace-tacct"
          rel="noopener noreferrer"
          text="Accéder à mon espace  →"
        />
      ) : (
        <BoutonSecondaireClassic
          size="md"
          link="https://tally.so/r/n0LrEZ"
          rel="noopener noreferrer"
          text="M’inscrire à une session d’accueil  →"
        />
      )}
    </div>
    {
      validated ?
        <div className={styles.ancienEspaceImage}>
          <Image src={captureTacct} alt="" width={244} height={137} />
        </div>
        :
        <div>
          <Image src={sessionAccueil} alt="" width={244} height={137} />
        </div>
    }
  </div>
);
