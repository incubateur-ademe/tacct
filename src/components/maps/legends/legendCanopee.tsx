import { Body } from "@/design-system/base/Textes";

const HAUTEUR_MAX = 35;

// Mêmes couleurs et opacités que heightToRGBA dans mapCanopee.tsx
const DEGRADE = 'linear-gradient(to right, rgba(217, 255, 217, 0.78), rgb(26, 107, 24))';

export const HauteurCanopeeLegend = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0rem 1rem',
        alignItems: 'center',
      }}
    >
      <Body weight="bold">- Hauteur de la canopée -</Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Body style={{ whiteSpace: 'nowrap' }}>0 m</Body>
        <div style={{
          width: 'min(350px, 50vw)',
          height: '14px',
          borderRadius: '2px',
          background: DEGRADE,
          border: '0.5px solid #ccc'
        }} />
        <Body style={{ whiteSpace: 'nowrap' }}>≥ {HAUTEUR_MAX} m</Body>
      </div>
    </div>
  );
}
