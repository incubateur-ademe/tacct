import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import avatar from '@/assets/svg/custom/avatar-profil.svg';
import { Body, H1 } from '@/design-system/base/Textes';
import Image from 'next/image';

interface Props {
  firstname: string;
  lastname: string;
  email: string;
}

export const ProfilCard = ({ firstname, lastname, email }: Props) => {
  const initiale = lastname.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.profil}>
      <span className={styles.profilCircle} aria-hidden="true" />
      <span className={styles.profilCircle} aria-hidden="true" />
      <Image
        src={avatar}
        alt=""
        width={88}
        height={88}
        className={styles.profilAvatar}
      />
      <div className={styles.profilTexte}>
        <H1
          color="#038278"
          style={{
            fontSize: '1.75rem',
            lineHeight: '2.25rem',
            letterSpacing: 0,
            margin: 0,
            wordBreak: 'break-word'
          }}
        >
          {firstname}
          {initiale ? ` ${initiale}.` : ''}
        </H1>
        <Body color="#666666" style={{ wordBreak: 'break-word' }}>
          {email}
        </Body>
      </div>
    </div>
  );
};
