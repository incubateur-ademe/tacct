'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const COLOR = '#038278';

interface Props {
  anneeDebut: number;
  anneeFin: number;
  anneeInitiale?: number;
  onChange?: (annee: number) => void;
}

export const SliderAnnees = ({ anneeDebut, anneeFin, anneeInitiale, onChange }: Props) => {
  const annees = Array.from({ length: anneeFin - anneeDebut + 1 }, (_, i) => anneeDebut + i);
  const [selectedIndex, setSelectedIndex] = useState(anneeInitiale ? annees.indexOf(anneeInitiale) : annees.length - 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const indexToPercent = (i: number) => (i / (annees.length - 1)) * 100;

  const percentToIndex = useCallback((clientX: number) => {
    if (!trackRef.current) return selectedIndex;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
    return Math.round(ratio * (annees.length - 1));
  }, [annees.length, selectedIndex]);

  const handleSelect = (i: number) => {
    setSelectedIndex(i);
    onChange?.(annees[i]);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleSelect(percentToIndex(e.clientX));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleSelect(percentToIndex(e.touches[0].clientX));
    };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [percentToIndex]);

  return (
    <div style={{ padding: '2rem 1rem 1rem', userSelect: 'none', minWidth: '600px' }}>
      {/* Track */}
      <div
        ref={trackRef}
        onClick={(e) => handleSelect(percentToIndex(e.clientX))}
        style={{
          position: 'relative',
          height: '3px',
          backgroundColor: COLOR,
          margin: '12px 0 28px',
          cursor: 'pointer'
        }}
      >
        {/* Dots + thumb */}
        {annees.map((annee, i) => {
          const isSelected = i === selectedIndex;
          const left = `${indexToPercent(i)}%`;
          return (
            <div
              key={annee}
              onMouseDown={(e) => { e.preventDefault(); isDragging.current = true; handleSelect(i); }}
              onTouchStart={(e) => { e.preventDefault(); isDragging.current = true; handleSelect(i); }}
              style={{
                position: 'absolute',
                top: '50%',
                left,
                transform: 'translate(-50%, -50%)',
                width: isSelected ? '24px' : '8px',
                height: isSelected ? '24px' : '8px',
                borderRadius: '50%',
                backgroundColor: isSelected ? '#ffffff' : COLOR,
                border: isSelected ? `3px solid ${COLOR}` : 'none',
                boxSizing: 'border-box',
                zIndex: isSelected ? 2 : 1,
                cursor: 'grab',
                transition: 'width 0.15s, height 0.15s'
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div style={{ position: 'relative', height: '1.5rem' }}>
        {annees.map((annee, i) => {
          const isSelected = i === selectedIndex;
          const showLabel = isSelected || i % 4 === 0;
          if (!showLabel) return null;
          return (
            <span
              key={annee}
              onClick={() => handleSelect(i)}
              style={{
                position: 'absolute',
                left: `${indexToPercent(i)}%`,
                transform: isSelected ? 'translate(-50%, -100%)' : 'translateX(-50%)',
                top: isSelected ? '-3rem' : '-1rem',
                fontSize: isSelected ? '1rem' : '0.75rem',
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? "#161616" : "#666666",
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {annee}
            </span>
          );
        })}
      </div>
    </div>
  );
};
