"use client";
import Image, { ImageProps } from "next/image";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

interface ZoomOnClickProps extends Omit<ImageProps, "ref"> {
  wrapperStyle?: CSSProperties;
}

const ZoomOnClick: React.FC<ZoomOnClickProps> = ({ wrapperStyle, style, ...imgProps }) => {
  const [showModal, setShowModal] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const legende = typeof imgProps.alt === 'string' && imgProps.alt.length > 0
    ? imgProps.alt
    : "l'image";

  const fermer = () => {
    setShowModal(false);
    triggerRef.current?.focus();
  };

  // Échap ferme l'agrandissement et rend le focus au déclencheur (RGAA 7.3).
  useEffect(() => {
    if (!showModal) return;
    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setShowModal(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <div style={{ position: 'relative', ...wrapperStyle }}>
      <button
        type="button"
        ref={triggerRef}
        aria-label={`Agrandir ${legende}`}
        onClick={() => setShowModal(true)}
        style={{
          cursor: 'zoom-in',
          width: '100%',
          display: 'block',
          padding: 0,
          border: 'none',
          background: 'none',
          backgroundImage: 'none',
          font: 'inherit',
          textAlign: 'inherit',
          color: 'inherit'
        }}
      >
        <Image {...imgProps} unoptimized style={{ width: 'auto', height: 'auto', ...style }} />
      </button>
      {showModal && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Agrandissement de ${legende}`}
          tabIndex={-1}
          onClick={fermer}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            cursor: 'zoom-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <img
            src={imgProps.src as string}
            alt={imgProps.alt}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              minWidth: '60vw',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              boxShadow: '0 0 24px #000',
              background: '#fff',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ZoomOnClick;
