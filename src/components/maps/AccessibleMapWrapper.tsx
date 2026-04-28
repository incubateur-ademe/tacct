import { ReactNode } from 'react';

/**
 * Wrapper accessible pour les cartes (MapLibre, Leaflet, etc.).
 * Expose un rôle d'image avec une alternative textuelle pour les
 * lecteurs d'écran, conformément au RGAA 1.1.8.
 *
 * Le `<canvas>` injecté par la librairie cartographique sera
 * englobé par ce wrapper et annoncé comme une image décrite par
 * `ariaLabel`.
 */
export const AccessibleMapWrapper = ({
  ariaLabel,
  children,
  className,
  style,
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    role="img"
    aria-label={ariaLabel}
    className={className}
    style={style}
  >
    {children}
  </div>
);
