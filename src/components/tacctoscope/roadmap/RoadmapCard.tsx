'use client';

import productLaunch from '@/assets/images/product-launch.png';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';
import Link from 'next/link';
import styles from './roadmap.module.scss';

export const RoadmapCard = () => (
  <Link href="/tacctoscope/feuille-de-route" className={styles.roadmapCardWrapper}>
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
    <Body htmlTag="span" size="sm" weight="medium" color="#038278">
      Consulter  →
    </Body>
  </Link>
);
