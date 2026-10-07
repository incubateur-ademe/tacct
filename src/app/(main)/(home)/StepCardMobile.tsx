'use client';

import { FondEtape, FormesEtape, SurvolEtape } from '@/assets/svg/home/etapesFormes';
import { Body } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface StepCardMobileProps {
  formes: FormesEtape;
  image: StaticImageData;
  label: ReactNode;
  texte: ReactNode;
  numero: number;
  maxWidth?: number | string;
}

export const StepCardMobile = ({
  formes,
  image,
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
            border: active ? "1px solid rgba(137, 202, 198, 1)" : "1px solid transparent",
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
            opacity: active ? 0 : 1,
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
            opacity: active ? 1 : 0,
            transition: 'opacity 0.6s ease',
            letterSpacing: "0.2px"
          }}
        >
          {label}
        </Body>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '235 / 234', maxWidth: maxWidth }}>
        <FondEtape formes={formes} actif={active} />
        <Image
          src={image}
          alt=""
          fill
          style={{ objectFit: 'contain', opacity: active ? 0 : 1, transition: 'opacity 0.6s ease' }}
        />
        <SurvolEtape formes={formes} actif={active} />
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 1.5rem',
          textAlign: 'center',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          {texte}
        </div>
      </div>
    </div>
  );
};
