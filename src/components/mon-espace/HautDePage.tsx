'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import hautDePageIcon from '@/assets/icons/haut_de_page_icon_green.svg';
import { Body } from '@/design-system/base/Textes';
import Image from 'next/image';

export const HautDePage = () => (
  <div className={styles.hautDePage}>
    <button
      type="button"
      className={styles.hautDePageBouton}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Body htmlTag="span" size="sm" weight="medium" color="#038278">
        Haut de page
      </Body>
      <Image src={hautDePageIcon} alt="" width={16} height={16} />
    </button>
  </div>
);
