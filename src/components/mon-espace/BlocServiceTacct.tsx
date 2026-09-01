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

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.622 6.415L13.501 9.667C13.6124 9.74116 13.6794 9.86614 13.6794 10C13.6794 10.1339 13.6124 10.2588 13.501 10.333L8.621 13.585C8.49841 13.6663 8.34111 13.6737 8.21141 13.6043C8.0817 13.535 8.00052 13.4001 8 13.253V6.747C8.00027 6.59959 8.0816 6.46428 8.21165 6.39486C8.34169 6.32545 8.49938 6.33319 8.622 6.415Z"
      fill="#038278"
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
          text="Regarder la démo (5min)"
          iconeFin={<PlayIcon />}
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
