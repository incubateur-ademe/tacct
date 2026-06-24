import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './TacctoButton.module.scss';

type Variant = 'primaire' | 'secondaire' | 'magenta';

interface BaseProps {
  variant?: Variant;
  withArrow?: boolean;
  children: ReactNode;
}

type LinkProps = BaseProps & { href: string };

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

const ArrowIcon = () => (
  <svg
    className={styles.arrow}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 8h9M8.5 4 12.5 8 8.5 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const classFor = (variant: Variant): string =>
  `${styles.button} ${styles[variant]}`;

export const TacctoButton = (props: LinkProps | ButtonProps) => {
  const { variant = 'primaire', withArrow = false, children } = props;
  const content = (
    <>
      {children}
      {withArrow && <ArrowIcon />}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classFor(variant)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classFor(variant)}
    >
      {content}
    </button>
  );
};
