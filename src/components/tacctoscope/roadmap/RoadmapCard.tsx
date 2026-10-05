'use client';

import productLaunch from '@/assets/images/product-launch.png';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './roadmap.module.scss';

export const RoadmapCard = () => {
  const router = useRouter();

  return (
    <div className={styles.roadmapCardWrapper}>
      <Image src={productLaunch} alt="" className={styles.roadmapCardIllustration} />
      <div className={styles.roadmapCardContent}>
        <H2
          color="#038278"
          style={{ fontSize: '1.25rem', lineHeight: '1.5rem', letterSpacing: 0, margin: 0 }}
        >
          Feuille de route personnalisée
        </H2>
        <Body size="sm" color="#3d3d3d" style={{ letterSpacing: 0, lineHeight: "22px" }}>
          Retrouvez vos pistes d’amélioration au fil de vos réponses
        </Body>
      </div>
      <button
        type="button"
        className={styles.consulterFdRButton}
        onClick={() => router.push('/tacctoscope/feuille-de-route')}
      >
        <Body htmlTag="span" size="sm" weight="medium" color="#038278">
          Consulter  →
        </Body>
      </button>
    </div>
  );
};
