"use client";

import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { type ReactNode, useState } from "react";
import { useStyles } from "tss-react/dsfr";

interface CustomAccordionProps {
  label: ReactNode;
  children: NonNullable<ReactNode>;
  defaultExpanded?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const CustomAccordion = ({ label, children, defaultExpanded = false, isOpen, onToggle }: CustomAccordionProps) => {
  const { css } = useStyles();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isControlled = isOpen !== undefined;
  const currentExpanded = isControlled ? isOpen : expanded;

  return (
    <Accordion
      label={label}
      onExpandedChange={(value) => {
        if (isControlled) {
          onToggle?.();
        } else {
          setExpanded(!value);
        }
      }}
      expanded={currentExpanded}
      className={css({
        "&::before": {
          boxShadow: "0 1px 0 0 var(--border-default-grey)",
        },
        "& .fr-accordion__btn": {
          color: "#161616",
          fontWeight: 400,
          padding: "1.5rem 1rem"
        },
        "& .fr-accordion__btn::after": {
          maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z'/%3E%3C/svg%3E")`,
          maskSize: "24px 24px",
          width: "24px",
          height: "24px",
          backgroundColor: "#038278",
          transform: "rotate(0deg)",
          transition: "transform 0.2s ease",
          flexShrink: 0,
        },
        "& .fr-accordion__btn[aria-expanded='true']": {
          backgroundColor: "#FAFAFA",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#FAFAFA",
          },
        },
        "& .fr-accordion__btn[aria-expanded='true']::after": {
          transform: "rotate(-45deg)",
        },
        "& .fr-collapse": {
          margin: "0 1px",
        },
        "& .fr-collapse--expanded": {
          margin: "0 1px",
          backgroundColor: "#FAFAFA",
          padding: "1rem 1rem 1.5rem"

        },
      })}
    >
      {children}
    </Accordion>
  );
}
