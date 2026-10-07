'use client';

import { FondEtape, FormesEtape, SurvolEtape } from '@/assets/svg/home/etapesFormes';
import { Body } from '@/design-system/base/Textes';
import useWindowDimensions from '@/hooks/windowDimensions';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useState } from 'react';

interface StepCardProps {
  formes: FormesEtape;
  image: StaticImageData;
  label: ReactNode;
  texte: ReactNode;
  numero: number;
  maxWidth?: number;
  offsetX?: number;
  offsetY?: number;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  style?: React.CSSProperties;
}

export const StepCard = ({
  formes,
  image,
  label,
  texte,
  numero,
  maxWidth,
  offsetX,
  offsetY,
  justifyContent,
  style
}: StepCardProps) => {
  const [hovered, setHovered] = useState(false);
  const { width } = useWindowDimensions();
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        maxWidth,
        marginLeft: offsetX,
        marginTop: (width && width <= 768) ? "2rem" : offsetY,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: justifyContent,
        cursor: 'pointer',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
      }}>
        <Body
          weight='bold'
          size='lg'
          style={{
            color: '#2B4B49',
            textAlign: 'center',
            width: 40,
            height: 40,
            minWidth: 40,
            minHeight: 40,
            borderRadius: '50px',
            backgroundColor: 'rgba(227, 250, 249, 1)',
            border: hovered ? "1px solid rgba(137, 202, 198, 1)" : "1px solid transparent",
            transition: 'border-color 0.6s ease',
            alignContent: 'center'
          }}
        >
          {numero}
        </Body>
        <Body
          weight='regular'
          size='lg'
          style={{
            color: '#2B4B49',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.6s ease'
          }}
        >
          {label}
        </Body>
        {/* Superposé au libellé normal : 52 px = pastille (40) + gap (12) */}
        <Body
          weight='bold'
          size='lg'
          style={{
            color: '#2B4B49',
            position: 'absolute',
            left: 52,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.6s ease',
            letterSpacing: "0.2px"
          }}
        >
          {label}
        </Body>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '235 / 234' }}>
        <FondEtape formes={formes} actif={hovered} />
        <Image
          src={image}
          alt=""
          fill
          style={{ objectFit: 'contain', opacity: hovered ? 0 : 1, transition: 'opacity 0.6s ease' }}
        />
        <SurvolEtape formes={formes} actif={hovered} />
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: (width && width > 900) ? '1rem 2rem' : '0.5rem 1rem',
          textAlign: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          {texte}
        </div>
      </div>
    </div>
  );
};
