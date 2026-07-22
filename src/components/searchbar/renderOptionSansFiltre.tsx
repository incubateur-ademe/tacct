"use client";

import { nuancesGris } from "@/design-system/couleurs";
import { Box } from "@mui/material";
import { getLibelleTypeTerritoire, ReplaceDisplayEpci } from "./fonctions";

export const RenderOptionSansFiltre = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: SearchInputOptionsSansFiltre;
}) => {
  const { ...optionProps } = props;
  return (
    <Box
      component="li"
      style={{ borderBottom: '1px solid var(--gris-medium)' }}
      sx={{
        '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' }
      }}
      {...optionProps}
      key={option.searchLibelle + option.searchCode}
    >
      <p style={{ margin: 0, fontSize: '14px' }}>
        {ReplaceDisplayEpci(option.searchLibelle)}
        {option.territoireType === 'commune' && option.searchCode?.length !== 0
          ? ` - ${option.searchCode}`
          : ''}
        {' '}
        <span style={{ color: nuancesGris.mediumDark }}>
          ({getLibelleTypeTerritoire(option)})
        </span>
      </p>
    </Box>
  );
};
