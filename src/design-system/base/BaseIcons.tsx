export const ChevronDownIcon = (style: React.CSSProperties) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={{
      ...style,
    }}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="var(--principales-vert)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlecheDiagonaleIcon = ({
  size = 13,
  color = 'currentColor',
  style
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={style}
  >
    <path
      d="M10.0208 3.41421L1.41421 12.0208L0 10.6066L8.60659 2H1.02082V0H12.0208V11H10.0208V3.41421Z"
      fill={color}
    />
  </svg>
);
