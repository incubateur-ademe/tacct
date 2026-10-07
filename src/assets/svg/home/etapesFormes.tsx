import { ReactNode } from 'react';

const traitArrondi = { strokeMiterlimit: 10, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const Forme = ({ viewBox, children }: { viewBox: string; children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox={viewBox}
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={{ display: 'block' }}
  >
    {children}
  </svg>
);

const Background = ({ viewBox, d }: { viewBox: string; d: string }) => (
  <Forme viewBox={viewBox}>
    <path opacity="0.4" d={d} fill="#D3EDEB" stroke="#89CAC6" strokeWidth="1.6" {...traitArrondi} />
  </Forme>
);

const Contour = ({ viewBox, d }: { viewBox: string; d: string }) => (
  <Forme viewBox={viewBox}>
    <path d={d} fill="white" stroke="#1CB5A9" strokeWidth="1.6" strokeDasharray="4 4" {...traitArrondi} />
  </Forme>
);

const Foreground = ({ viewBox, d, strokeWidth = '1.76' }: { viewBox: string; d: string; strokeWidth?: string }) => (
  <Forme viewBox={viewBox}>
    <path d={d} fill="#E3FAF9" stroke="#89CAC6" strokeWidth={strokeWidth} {...traitArrondi} />
  </Forme>
);

export const Etape1Background = () => (
  <Background
    viewBox="0 0 214 213"
    d="M141.581 0.80002C191.433 0.80002 212.8 56.7589 212.8 111.715C212.8 166.669 172.387 211.218 122.535 211.218C72.6814 211.218 0.799945 123.763 0.799945 68.8098C0.799945 13.8549 91.7279 0.80002 141.581 0.80002Z"
  />
);

export const Etape1Contour = () => (
  <Contour
    viewBox="0 0 214 227"
    d="M212.798 85.5899C212.457 26.2384 156.421 0.799988 101.057 0.799988C45.6924 0.799988 1.63303 48.9207 0.810939 108.266C0.015033 165.898 42.8648 169.654 123.567 219.763C177.849 253.469 213.136 144.67 212.798 85.5899Z"
  />
);

export const Etape1Foreground = () => (
  <Foreground
    viewBox="0 0 235 234"
    d="M155.739 0.87999C210.576 0.87999 234.08 62.4348 234.08 122.887C234.08 183.336 189.625 232.34 134.788 232.34C79.9496 232.34 0.879955 136.14 0.879955 75.6908C0.879955 15.2403 100.901 0.87999 155.739 0.87999Z"
  />
);

export const Etape2Background = () => (
  <Background
    viewBox="0 0 243 272"
    d="M0.79999 180.341C0.79999 243.918 64.7557 271.167 127.566 271.167C190.372 271.167 241.287 219.627 241.287 156.05C241.287 92.4717 141.335 0.799984 78.5287 0.799984C15.7205 0.799984 0.79999 116.762 0.79999 180.341Z"
  />
);

export const Etape2Contour = () => (
  <Contour
    viewBox="0 0 256 261"
    d="M96.539 260.108C29.5234 259.692 0.800049 191.15 0.800049 123.431C0.800049 55.7107 55.1346 1.81886 122.144 0.813308C187.218 -0.160217 191.458 52.2522 248.039 150.965C286.096 217.361 163.248 260.522 96.539 260.108Z"
  />
);

export const Etape2Foreground = () => (
  <Foreground
    viewBox="0 0 267 300"
    d="M0.879761 198.375C0.879761 268.309 71.231 298.284 140.322 298.284C209.409 298.284 265.416 241.59 265.416 171.655C265.416 101.719 155.468 0.879974 86.3813 0.879974C17.2923 0.879974 0.879761 128.438 0.879761 198.375Z"
  />
);

export const Etape3Background = () => (
  <Background
    viewBox="0 0 256 261"
    d="M96.539 0.802943C29.5234 1.21925 0.800049 69.761 0.800049 137.481C0.800049 205.2 55.1346 259.092 122.144 260.098C187.218 261.071 191.458 208.659 248.039 109.947C286.096 43.5505 163.248 0.388768 96.539 0.802943Z"
  />
);

export const Etape3Contour = () => (
  <Contour
    viewBox="0 0 243 272"
    d="M0.800113 91.6264C0.800113 28.0495 64.7558 0.799988 127.566 0.799988C190.372 0.799988 241.288 52.3398 241.288 115.917C241.288 179.495 141.335 271.167 78.5288 271.167C15.7206 271.167 0.800113 155.205 0.800113 91.6264Z"
  />
);

export const Etape3Foreground = () => (
  <Foreground
    viewBox="0 0 282 287"
    d="M106.193 0.883244C32.4756 1.34118 0.879883 76.7371 0.879883 151.229C0.879883 225.721 60.6479 285.002 134.358 286.108C205.939 287.179 210.604 229.525 272.842 120.941C314.706 47.9056 179.573 0.427651 106.193 0.883244Z"
  />
);

export const Etape4Background = () => (
  <Background
    viewBox="0 0 214 212"
    d="M212.798 131.837C212.457 187.185 156.421 210.907 101.057 210.907C45.6924 210.907 1.63303 166.033 0.810939 110.69C0.0150329 56.9461 42.8648 53.444 123.567 6.71462C177.849 -24.7169 213.136 76.7424 212.798 131.837Z"
  />
);

export const Etape4Contour = () => (
  <Contour
    viewBox="0 0 205 227"
    d="M203.665 150.417C203.665 203.398 149.714 226.106 96.7307 226.106C43.7499 226.106 0.800049 183.156 0.800049 130.175C0.800049 77.193 85.1154 0.799981 138.096 0.799981C191.078 0.799981 203.665 97.435 203.665 150.417Z"
  />
);

export const Etape4Foreground = () => (
  <Foreground
    viewBox="0 0 235 233"
    strokeWidth="1.1"
    d="M233.747 144.691C233.373 205.573 171.733 231.668 110.832 231.668C49.9316 231.668 1.46632 182.306 0.562028 121.429C-0.313469 62.3107 46.8213 58.4584 135.594 7.05604C195.304 -27.5187 234.12 84.0867 233.747 144.691Z"
  />
);
