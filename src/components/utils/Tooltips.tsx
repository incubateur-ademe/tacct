"use client";
import CalculatorIcon from '@/assets/icons/calculator_icon_blue.svg';
import CalculatorIconGreen from '@/assets/icons/calculator_icon_green.svg';
import { Body } from '@/design-system/base/Textes';
import couleurs from '@/design-system/couleurs';
import { Any } from '@/lib/utils/types';
import { ClickAwayListener, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Image from 'next/image';
import { ReactElement, ReactNode, useState } from 'react';
import styles from './Tooltips.module.scss';

interface Props {
  title: React.ReactNode;
  texte?: string;
}

interface HtmlTooltipProps extends TooltipProps {
  fontWeight?: number | string;
}

export const HtmlTooltip = styled(
  ({ className, fontWeight = 500, ...props }: HtmlTooltipProps) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      enterTouchDelay={0}
      leaveTouchDelay={3000}
    />
  )
)<HtmlTooltipProps>(({ fontWeight = 500 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    color: 'black',
    maxWidth: 600,
    boxShadow: "0px 2px 6px 0px rgba(0, 0, 18, 0.16)",
    padding: '1rem',
    fontFamily: 'Marianne',
    fontSize: '0.875rem',
    borderRadius: '6px',
    lineHeight: '1.25rem',
    fontWeight: fontWeight
  }
}));

export const ArrowHtmlTooltip = styled(
  ({ className, fontWeight = 500, ...props }: HtmlTooltipProps) => (
    <Tooltip 
      {...props} 
      classes={{ popper: className }}
      TransitionProps={{ timeout: 0 }}
      enterDelay={0}
      enterNextDelay={0}
      enterTouchDelay={0}
      leaveDelay={0}
      disableInteractive={false}
      title={
        <div>
          {props.title}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #ffffff',
            }}
          />
        </div>
      }
    />
  )
)<HtmlTooltipProps>(({ fontWeight = 500 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    color: 'black',
    maxWidth: 600,
    boxShadow: "0px 2px 6px 0px rgba(0, 0, 18, 0.16)",
    padding: '1rem',
    fontFamily: 'Marianne',
    fontSize: '0.875rem',
    borderRadius: '6px',
    lineHeight: '1.25rem',
    fontWeight: fontWeight,
    position: 'relative',
    marginBottom: '6px',
  }
}));

export const CustomTooltip = ({
  title,
  texte = 'Méthode de calcul'
}: Props) => {
  return (
    <HtmlTooltip title={title}>
      <button
        type="button"
        className={styles.tooltipTrigger}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
          width: 'fit-content',
          margin: '1em 0 0'
        }}
      >
        <Image src={CalculatorIcon} alt="" />
        <span style={{ color: '#0063CB', margin: '0', fontWeight: 'bold' }}>
          {texte}
        </span>
      </button>
    </HtmlTooltip>
  );
};


export const CustomTooltipNouveauParcours = ({
  title,
  texte = 'Méthode de calcul'
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <HtmlTooltip
        title={title}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableTouchListener
      >
        <button
          type="button"
          className={styles.tooltipTrigger}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            width: 'fit-content',
            margin: '0.5em 0 0'
          }}
          onClick={() => setOpen(true)}
        >
          <Image src={CalculatorIconGreen} alt="" />
          <Body htmlTag="span" weight='bold' style={{ color: couleurs.principales.vert }}>
            {texte}
          </Body>
        </button>
      </HtmlTooltip>
    </ClickAwayListener>
  );
};

export const DefinitionTooltip = ({
  children,
  title
}: {
  children: string;
  title: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <HtmlTooltip
        title={title}
        placement="top"
        fontWeight={400}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableTouchListener
      >
        <span
          tabIndex={0}
          style={{ borderBottom: '1px dashed #0063CB', cursor: 'help' }}
          onClick={() => setOpen(true)}
        >
          {children}
        </span>
      </HtmlTooltip>
    </ClickAwayListener>
  );
};

export const HtmlTooltipMousePosition = ({
  children,
  title
}: {
  children: ReactElement<Any>;
  title: ReactNode;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <HtmlTooltip
      title={title}
      onMouseMove={(e) => setPosition({ x: e.clientX, y: e.clientY })}
      PopperProps={{
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: () => ({
            x: position.x,
            y: position.y,
            top: position.y - 100,
            left: position.x,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            toJSON: () => null
          })
        }
      }}
    >
      {children}
    </HtmlTooltip>
  );
};
