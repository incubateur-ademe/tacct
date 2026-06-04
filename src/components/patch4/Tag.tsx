'use client';

import { Tag } from '@codegouvfr/react-dsfr/Tag';
import { ReactNode } from 'react';
import styles from '../components.module.scss';

interface TagPatch4Props {
  children: ReactNode;
}

export const TagPatch4 = ({ children }: TagPatch4Props) => {
  const color =
    children === 'Aggravation très forte'
      ? '#FF1C64'
      : children === 'Aggravation forte'
        ? '#FFB181'
        : children === 'Aggravation modérée'
          ? '#FFEBB6'
          : '#FFF';
  const textColor = children === 'Aggravation très forte' ? 'white' : 'black';
  return (
    <Tag
      className={styles.tag}
      style={{
        backgroundColor: color,
        color: textColor,
        lineHeight: '12px',
        border: color === '#FFF' ? '1px solid #161616' : 'none'
      }}
    >
      {children}
    </Tag>
  );
};
