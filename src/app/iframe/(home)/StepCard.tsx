'use client';

import { Body } from '@/design-system/base/Textes';
import useWindowDimensions from '@/hooks/windowDimensions';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useState } from 'react';

interface StepCardProps {
  contour: StaticImageData;
  background: StaticImageData;
  image: StaticImageData;
  foreground: StaticImageData;
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
  contour,
  background,
  image,
  foreground,
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
      }}>
        <div style={{
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          borderRadius: '50px',
          backgroundColor: 'rgba(227, 250, 249, 1)',
          border: hovered ? "1px solid rgba(137, 202, 198, 1)" : "1px solid transparent",
          transition: 'border-color 0.6s ease',
          alignContent: 'center'
        }}>
          <Body weight='bold' size='lg' style={{ color: '#2B4B49', textAlign: 'center' }}>
            {numero}
          </Body>
        </div>
        <div style={{ position: 'relative' }}>
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
          <Body
            weight='bold'
            size='lg'
            style={{
              color: '#2B4B49',
              position: 'absolute',
              inset: 0,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.6s ease',
              letterSpacing: "0.2px"
            }}
          >
            {label}
          </Body>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '235 / 234' }}>
        {/* Contour : visible sans hover, disparaît au hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={contour} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={background} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Image : visible sans hover, disparaît au hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={image} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Foreground : caché au repos, visible au hover avec scale */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <Image src={foreground} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Texte : invisible sans hover, apparaît au hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{
            padding: (width && width > 900) ? '1rem 2rem' : '0.5rem 1rem',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}>
            {texte}
          </div>
        </div>
      </div>
    </div>
  );
};
