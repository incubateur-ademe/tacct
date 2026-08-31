'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import enveloppeIcon from '@/assets/icons/enveloppe_icon_white.svg';
import illustrationElu from '@/assets/images/illustration_elu_mon_espace.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';

const LIEN_CONTACT = 'https://tally.so/r/mJGELz';

export const BlocAutre = () => (
  <div className={styles.blocElu}>
    <H2
      color="#038278"
      style={{
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        letterSpacing: 0,
        margin: 0
      }}
    >
      Merci de votre intérêt pour TACCT !
    </H2>

    <Body color="#3d3d3d" style={{ maxWidth: '652px', marginBottom: '1rem' }}>
      Nous accompagnons principalement les{' '}
      <b>chargé·es de mission territoriaux</b> dans leurs démarches
      d’adaptation au changement climatique, mais chaque profil apporte sa
      richesse et contribue à améliorer notre service !
    </Body>

    <Body color="#3d3d3d" style={{ maxWidth: '652px' }}>
      Pour nous{' '}
      <b>aider à mieux comprendre votre démarche et vos attentes</b>{' '}
      vis-à-vis de TACCT, n’hésitez pas à nous écrire. Nous pourrons ainsi
      vous orienter vers les bonnes ressources et/ou explorer les possibilités
      de collaboration.
    </Body>

    <BoutonPrimaireClassic
      size="md"
      link={LIEN_CONTACT}
      rel="noopener noreferrer"
      text="Contacter l’équipe"
      icone={enveloppeIcon}
      style={{ marginTop: '0.5rem' }}
    />

    <Image src={illustrationElu} alt="" className={styles.blocEluIllustration} />
  </div>
);
