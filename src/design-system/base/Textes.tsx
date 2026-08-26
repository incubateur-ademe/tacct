import React from 'react';

export const H1 = ({
  children,
  color = "#23282B",
  style,
  id,
  ref,
  tabIndex
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  id?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  tabIndex?: number;
}) => {
  return (
    <h1
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      className="ds-h1"
      style={{
        color: color,
        fontWeight: 700,
        letterSpacing: "0.85px",
        fontFamily: "Marianne",
        ...style
      }}
    >
      {children}
    </h1>
  );
}

export const H2 = ({
  children,
  color = "#23282B",
  style,
  id,
  ref,
  tabIndex
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  id?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  tabIndex?: number;
}) => {
  return (
    <h2
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      className="ds-h2"
      style={{
        color: color,
        fontSize: "2rem",
        fontWeight: 700,
        lineHeight: "2.5rem",
        letterSpacing: "0.85px",
        fontFamily: "Marianne",
        ...style,
      }}
    >
      {children}
    </h2>
  );
};

export const H3 = ({
  children,
  color = "#23282B",
  style,
  id,
  ref,
  tabIndex
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  id?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  tabIndex?: number;
}) => {
  return (
    <h3
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      style={{
        color: color,
        fontSize: "1.75rem",
        fontWeight: 700,
        lineHeight: "2rem",
        letterSpacing: "0.85px",
        fontFamily: "Marianne",
        ...style,
      }}
    >
      {children}
    </h3>
  );
};

export const H4 = ({
  children,
  color = "#23282B",
  style,
  id,
  ref,
  tabIndex
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  id?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  tabIndex?: number;
}) => {
  return (
    <h4
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      style={{
        color: color,
        fontSize: "1.25rem",
        fontWeight: 700,
        lineHeight: "1.5rem",
        letterSpacing: "0.85px",
        fontFamily: "Marianne",
        ...style
      }}
    >
      {children}
    </h4>
  );
};

export const SousTitre1 = ({
  children,
  htmlTag = 'p',
  color = "#23282B",
  style
}: {
  children: React.ReactNode;
  htmlTag?: 'p' | 'h2' | 'h3' | 'h4' | 'h5';
  color?: string;
  style?: React.CSSProperties;
}) => {
  const styles = {
    color: color,
    fontSize: "1.25rem",
    fontWeight: 400,
    letterSpacing: "0.85px",
    fontFamily: "Marianne",
    textTransform: "uppercase",
    margin: "0",
    ...style,
  };

  return React.createElement(htmlTag, { style: styles }, children);
};

export const SousTitre2 = ({
  children,
  htmlTag = 'p',
  color = "#23282B",
  style
}: {
  children: React.ReactNode;
  htmlTag?: 'p' | 'h2' | 'h3' | 'h4' | 'h5';
  color?: string;
  style?: React.CSSProperties;
}) => {
  const styles = {
    color: color,
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.85px",
    fontFamily: "Marianne",
    textTransform: "uppercase",
    margin: "0",
    ...style,
  };
  return React.createElement(htmlTag, { style: styles }, children);
};

export const Body = ({
  children,
  weight = 'regular',
  size = 'md',
  color = "#23282B",
  htmlTag = 'p',
  style,
  margin = "0",
  id,
}: {
  children: React.ReactNode;
  weight?: 'regular' | 'medium' | 'bold';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  htmlTag?: 'p' | 'span' | 'div';
  style?: React.CSSProperties;
  margin?: string;
  id?: string;
}) => {
  const styles: React.CSSProperties = {
    color: color,
    fontSize: size === 'xs' ? '0.75rem' : size === 'sm' ? '0.875rem' : size === 'md' ? '1rem' : size === 'lg' ? '1.125rem' : '1.25rem',
    fontWeight: weight === 'bold' ? 700 : weight === 'medium' ? 500 : 400,
    letterSpacing: "0.4px",
    fontFamily: "Marianne",
    margin: margin,
    ...style,
  };
  return React.createElement(htmlTag, { id, style: styles }, children);
}
