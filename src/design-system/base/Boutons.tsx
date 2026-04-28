import ConnexionIcon from '@/assets/icons/connexion_compte_icon_black.svg';
import { Button } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import { usePostHog } from 'posthog-js/react';
import { couleursBoutons, nuancesGris } from "../couleurs";
import { Body } from "./Textes";

export const BoutonPrimaireClassic = ({
  link,
  text,
  rel,
  size,
  disabled = false,
  onClick,
  icone,
  style,
  posthogEventName,
  thematique
}: {
  link?: string;
  text: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icone?: StaticImageData;
  style?: React.CSSProperties;
  posthogEventName?: string;
  thematique?: string;
}) => {
  const posthog = usePostHog();
  const buttonStyle: React.CSSProperties = {
    textTransform: 'none',
    color: disabled ? nuancesGris.dark : "white",
    backgroundColor: disabled ? nuancesGris.light : couleursBoutons.primaire[1],
    borderRadius: '60px',
    minHeight: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px',
    border: disabled ? `1px solid ${nuancesGris.light}` : `1px solid ${couleursBoutons.primaire[1]}`,
    padding: size === 'xs' ? '1px 10px' : '4px 12px',
    fontWeight: 500,
    fontFamily: 'Marianne',
    fontSize: size === 'xs' ? '12px' : size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
    width: 'max-content',
    alignItems: 'center',
    backgroundImage: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (posthogEventName) {
      posthog.capture(
        posthogEventName,
        {
          date: new Date(),
          thematique: thematique
        }
      );
    }
    if (link && !onClick) {
      window.open(link, rel?.includes('noopener') ? '_blank' : '_self');
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[3];
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[1];
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled && e.currentTarget.matches(':focus-visible')) {
      e.currentTarget.style.outline = 'none';
      e.currentTarget.style.border = `1px solid ${couleursBoutons.primaire[1]}`;
      e.currentTarget.style.boxShadow = `0 0 0 2px white, 0 0 0 4px ${couleursBoutons.primaire[1]}`;
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[3];
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.border = `1px solid ${couleursBoutons.primaire[1]}`;
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[1];
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="flex items-center justify-center">
        {
          icone && (
            <Image
            src={icone}
            alt=""
            style={{ marginRight: '8px' }}
            width={size === 'xs' ? 14 : size === 'lg' ? 24 : 16}
            height={size === 'xs' ? 14 : size === 'lg' ? 24 : 16}
            />
          )
        }
        {text}
      </div>
    </button>
  );
}

export const BoutonSecondaireClassic = ({
  link,
  text,
  rel,
  size,
  disabled = false,
  onClick,
  icone,
  style,
  posthogEventName
}: {
  link?: string;
  text: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icone?: StaticImageData;
  style?: React.CSSProperties;
  posthogEventName?: string;
}) => {
  const posthog = usePostHog();
  const buttonStyle: React.CSSProperties = {
    textTransform: 'none',
    color: disabled ? `${nuancesGris.dark} !important` : couleursBoutons.primaire[3],
    backgroundColor: disabled ? nuancesGris.light : "white",
    borderRadius: '60px',
    // minHeight: 'fit-content',
    minHeight: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px',
    border: disabled ? `1px solid ${nuancesGris.light} !important` : `1px solid ${couleursBoutons.primaire[2]}`,
    padding: size === 'xs' ? '1px 10px' : '4px 12px',
    fontWeight: 500,
    fontFamily: 'Marianne',
    fontSize: size === 'xs' ? '12px' : size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
    width: 'fit-content',
    alignItems: 'center',
    backgroundImage: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (posthogEventName) {
      posthog.capture(
        posthogEventName,
        {
          date: new Date()
        }
      );
    }
    if (link && !onClick) {
      window.open(link, rel?.includes('noopener') ? '_blank' : '_self');
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[2];
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = "white";
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled && e.currentTarget.matches(':focus-visible')) {
      e.currentTarget.style.outline = 'none';
      e.currentTarget.style.border = `1px solid ${couleursBoutons.primaire[2]}`;
      e.currentTarget.style.boxShadow = `0 0 0 2px ${couleursBoutons.primaire[1]}, 0 0 0 4px ${couleursBoutons.primaire[2]}`;
      e.currentTarget.style.backgroundColor = "white";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.border = `1px solid ${couleursBoutons.primaire[2]}`;
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.backgroundColor = couleursBoutons.primaire[2];
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="flex items-center justify-center">
        {
          icone && (
            <Image
            src={icone}
            alt=""
            style={{ marginRight: '8px' }}
            width={size === 'xs' ? 14 : size === 'lg' ? 24 : 16}
            height={size === 'xs' ? 14 : size === 'lg' ? 24 : 16}
            />
          )
        }
        {text}
      </div>
    </button>
  );
}

export const ConnexionBouton = () => {
  return (
    <button
      className='flex flex-row gap-2'
      style={{ borderLeft: '1px solid var(--gris-medium)', paddingLeft: '0.75rem', alignItems: 'center' }}
      onClick={() => window.open('https://tacct.ademe.fr/create-account', '_blank')}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Image src={ConnexionIcon} alt="" height={24} width={24} />
      <Body size='sm'>Connectez-vous</Body>
    </button>
  );
};

export const BoutonSecondaire = ({
  link,
  text,
  target,
  rel,
  size,
  disabled = false
}: {
  link: string;
  text: string;
  size: 'sm' | 'md' | 'lg';
  target?: string;
  rel?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      key="0"
      variant="outlined"
      href={link}
      target={target}
      rel={rel}
      disabled={disabled}
      sx={{
        textTransform: 'none',
        color: disabled ? `${nuancesGris.dark} !important` : couleursBoutons.primaire[3],
        backgroundColor: disabled ? nuancesGris.light : "white",
        borderRadius: '60px',
        border: disabled ? `1px solid ${nuancesGris.light} !important` : `1px solid ${couleursBoutons.primaire[2]}`,
        padding: '4px 20px',
        fontWeight: 500,
        fontFamily: 'Marianne',
        fontSize: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
        width: 'fit-content',
        backgroundImage: 'none',
        '&:hover': {
          backgroundColor: `${couleursBoutons.primaire[2]} !important`,
        },
        '&:focus-visible': {
          outline: 'none',
          border: `1px solid ${couleursBoutons.primaire[2]}`,
          boxShadow: `
            0 0 0 2px white,
            0 0 0 4px ${couleursBoutons.primaire[2]}
          `,
          backgroundColor: `${couleursBoutons.primaire[2]} !important`
        }
      }}
    >
      {text}
    </Button>
  );
}

export const BoutonTertiaire = ({
  link,
  text,
  target,
  rel,
  size,
  disabled = false
}: {
  link: string;
  text: string;
  size: 'sm' | 'md' | 'lg';
  target?: string;
  rel?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      key="0"
      variant="outlined"
      href={link}
      target={target}
      rel={rel}
      disabled={disabled}
      sx={{
        textTransform: 'none',
        color: disabled ? `${nuancesGris.dark} !important` : couleursBoutons.primaire[3],
        backgroundColor: disabled ? nuancesGris.light : "white",
        borderRadius: '60px',
        border: disabled ? `1px solid ${nuancesGris.light} !important` : `1px solid ${couleursBoutons.primaire[1]}`,
        padding: '4px 20px',
        fontWeight: 500,
        fontFamily: 'Marianne',
        fontSize: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
        width: 'fit-content',
        backgroundImage: 'none',
        '&:hover': {
          backgroundColor: `${couleursBoutons.primaire[2]} !important`,
        },
        '&:focus-visible': {
          outline: 'none',
          border: `1px solid ${couleursBoutons.primaire[3]}`,
          boxShadow: `
            0 0 0 2px white,
            0 0 0 4px ${couleursBoutons.primaire[3]}
          `,
          backgroundColor: `white !important`
        }
      }}
    >
      {text}
    </Button>
  );
}
