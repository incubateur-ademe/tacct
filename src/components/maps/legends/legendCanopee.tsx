import { Body } from "@/design-system/base/Textes";

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
      <Body weight="bold">- Hauteur de canopée (m) -</Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div style={{
          width: '250px',
          height: '12px',
          borderRadius: '2px',
          background: 'linear-gradient(to right, #D9FFDA, #1A6B18)',
          border: '0.5px solid #ccc'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '290px', marginLeft: '1.5rem' }}>
        <Body>0 m</Body>
        <Body>&gt;=30 m</Body>
      </div>
    </div>
  );
}
