'use client';

import { Body } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface StepCardMobileProps {
  contour: StaticImageData;
  background: StaticImageData;
  image: StaticImageData;
  foreground: StaticImageData;
  label: ReactNode;
  texte: ReactNode;
  numero: number;
  maxWidth?: number | string;
}

export const StepCardMobile = ({
  contour,
  background,
  image,
  foreground,
  label,
  texte,
  numero,
  maxWidth,
}: StepCardMobileProps) => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const viewportHeight = window.innerHeight;
      const isInCenter = cardCenter > viewportHeight * 0.05 && cardCenter < viewportHeight * 0.7;
      setActive(isInCenter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        // maxWidth,
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
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
          border: active ? "1px solid rgba(137, 202, 198, 1)" : "1px solid transparent",
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
              opacity: active ? 0 : 1,
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
              opacity: active ? 1 : 0,
              transition: 'opacity 0.6s ease',
              letterSpacing: "0.2px"
            }}
          >
            {label}
          </Body>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '235 / 234', maxWidth: maxWidth }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: active ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={contour} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={background} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: active ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}>
          <Image src={image} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: active ? 1 : 0,
          transform: active ? 'scale(1.05)' : 'scale(1)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <Image src={foreground} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{
            padding: '0.5rem 1.5rem',
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
