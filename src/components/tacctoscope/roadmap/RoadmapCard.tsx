'use client';

import productLaunch from '@/assets/images/product-launch.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';
import styles from './roadmap.module.scss';

export const RoadmapCard = () => (
  <div className={styles.roadmapCardWrapper}>
    <Image src={productLaunch} alt="" className={styles.roadmapCardIllustration} />
    <div className={styles.roadmapCardContent}>
      <H2
        color="#038278"
        style={{ fontSize: '1.125rem', lineHeight: '1.5rem', letterSpacing: 0 }}
      >
        Votre feuille de route personnalisée
      </H2>
      <Body size="sm" color="#3d3d3d">
        Retrouvez sur cette page vos pistes d’amélioration au fil de vos réponses.
      </Body>
    </div>
    <BoutonPrimaireClassic
      size="md"
      link="/tacctoscope/feuille-de-route"
      text="Voir"
    />
  </div>
);
