'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import presentation from '@/assets/images/service_etat_presentation.png';
import video from '@/assets/images/service_etat_video.png';
import { BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

const LIEN_VIDEO =
  'https://www.canva.com/design/DAHK933zhTA/ZqJYu-iOTxkAq8MGY4W_Cg/watch?utm_content=DAHK933zhTA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6c09ff22fb';
const LIEN_PRESENTATION = '';

const FlecheDroiteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="currentColor"
    />
  </svg>
);

const TelechargerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 10h5l-6 6-6-6h5V3h2v7zM4 19h16v2H4v-2z" fill="currentColor" />
  </svg>
);

export const BlocServiceTacct = () => (
  <div className={styles.blocServiceTacct}>
    <H3
      color="#038278"
      style={{
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        letterSpacing: 0,
        margin: 0
      }}
    >
      Présentez le service TACCT autour de vous
    </H3>

    <Body color="#3d3d3d">
      Ces deux ressources résument de manière simple et visuelle{' '}
      <b>comment notre service accompagne les territoires</b> face aux enjeux de
      l’adaptation au changement climatique
    </Body>

    <div className={styles.serviceTacctRessources}>
      <div className={styles.serviceTacctRessource}>
        <Image src={video} alt="" />
        <BoutonSecondaireClassic
          size="md"
          link={LIEN_VIDEO}
          rel="noopener noreferrer"
          text="Regarder la vidéo"
          iconeFin={<FlecheDroiteIcon />}
          couleurFond="#ECFFFD"
          couleurBordure="#038278"
          style={{ border: "2px solid #038278" }}
        />
      </div>
      <div className={styles.serviceTacctRessource}>
        <Image src={presentation} alt="" />
        <BoutonSecondaireClassic
          size="md"
          link={LIEN_PRESENTATION}
          rel="noopener noreferrer"
          text="Télécharger la présentation (.pdf)"
          iconeFin={<TelechargerIcon />}
          couleurFond="#ECFFFD"
          couleurBordure="#038278"
          style={{ border: "2px solid #038278" }}
        />
      </div>
    </div>
  </div>
);
