import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import illustrationElu from '@/assets/images/illustration_elu_mon_espace.png';
import { Body, H2 } from '@/design-system/base/Textes';
import { estProfilElu } from '@/lib/segmentation';
import Image from 'next/image';
import Link from 'next/link';

export const BlocElu = ({ profil }: { profil: string | null }) => {
  const elu = estProfilElu(profil);

  return (
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
        {elu
          ? 'Élu·es : soyez un catalyseur pour l’adaptation ! 🚀'
          : 'Soyez un catalyseur pour l’adaptation ! 🚀'}
      </H2>

      <Body color="#3d3d3d" style={{ maxWidth: '652px', marginBottom: '1rem' }}>
        {elu ? (
          <>
            Notre <b>service</b> accompagne principalement les{' '}
            <b>chargé·es de mission et/ou responsables techniques territoriaux</b>,
            mais l’adaptation est un défi collectif et chacun peut jouer un rôle !
            En tant qu’élu·e, vous pouvez :
          </>
        ) : (
          <>
            TACCT accompagne principalement les{' '}
            <b>chargé·es de mission et/ou responsables techniques territoriaux</b>,
            mais l’adaptation est un défi collectif et chacun peut jouer un rôle !
            Ainsi, vous pouvez :
          </>
        )}
      </Body>

      <ul className={styles.blocEluListe}>
        <li>
          <Body htmlTag="span" color="#3d3d3d">
            {elu
              ? 'Recommander notre service à vos responsables opérationnels'
              : 'Recommander notre service autour de vous'}
          </Body>
        </li>
        <li>
          <Body htmlTag="span" color="#3d3d3d">
            {elu
              ? 'Partager votre expertise avec la communauté Adaptation.'
              : 'Partager votre expertise sur l’adaptation au changement climatique avec la communauté Adaptation.'}{' '}
            <Link
              href="https://tally.so/r/mJGELz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.blocEluLien}
            >
              Contactez-nous pour en discuter
            </Link>
          </Body>
        </li>
      </ul>

      <Image
        src={illustrationElu}
        alt=""
        className={styles.blocEluIllustration}
      />
    </div>
  );
};
