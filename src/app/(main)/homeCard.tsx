import Image, { StaticImageData } from 'next/image';
import styles from './main.module.scss';

type HomeCardProps = {
  icone: StaticImageData;
  titre: string;
  description: string;
}

export const HomeCard = ({
  icone,
  titre,
  description
}: HomeCardProps) => {
  return (
    <div className={styles.homeCard}>
      <Image
        src={icone}
        alt=""
        className={styles.homeCardImage}
      />
      <h4>{titre}</h4>
      <p>{description}</p>
    </div>
  )
}
