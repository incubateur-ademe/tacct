import { Any } from '@/lib/utils/types';
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { ReactElement, ReactNode, useState } from 'react';

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
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
    fontWeight: 500
  }
}));

export const HtmlTooltipDefinition = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    fontSize: '1rem',
    color: 'black',
    maxWidth: 600,
    boxShadow: "0px 2px 6px 0px rgba(0, 0, 18, 0.16)",
    padding: '1rem',
    fontFamily: 'Marianne',
    fontWeight: 400,
    border: '1px solid #0063CB',
    borderRadius: '6px'
  }
}));

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

export const DefinitionTooltip = ({
  children,
  title
}: {
  children: string;
  title: ReactNode;
}) => {
  return (
    <HtmlTooltipDefinition title={title} placement="top" sx={{ maxWidth: 400 }}>
      <span style={{ borderBottom: '1px dashed #0063CB', cursor: 'help' }}>
        {children}
      </span>
    </HtmlTooltipDefinition>
  );
};
