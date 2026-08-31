import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import illustrationElu from '@/assets/images/illustration_elu_mon_espace.png';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';
import Link from 'next/link';

const LIEN_ADEME_REGION =
  'https://www.ademe.fr/les-territoires-en-transition/lademe-en-region/';

export const BlocEntreprise = () => (
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
      Entreprises : votre démarche nous réjouit !
    </H2>

    <Body
      color="#3d3d3d"
      style={{ maxWidth: '652px', marginBottom: '1rem' }}
    >
      Notre <b>service</b> accompagne spécifiquement les{' '}
      <b>acteurs territoriaux publics</b> dans leur démarche d’adaptation au
      changement climatique, mais c’est un défi collectif qui repose aussi sur
      l’action des entreprises !
    </Body>

    <Body color="#3d3d3d" style={{ maxWidth: '652px' }}>
      L’ADEME propose plusieurs ressources pour répondre à vos enjeux
      particuliers, et les{' '}
      <Link
        href={LIEN_ADEME_REGION}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.blocEluLien}
      >
        Directions régionales de l’ADEME
      </Link>{' '}
      sont également à votre disposition pour vous accompagner.
    </Body>

    <Image src={illustrationElu} alt="" className={styles.blocEluIllustration} />
  </div>
);
