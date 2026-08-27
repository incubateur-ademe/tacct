'use client';

import { Body } from '@/design-system/base/Textes';
import { COULEURS } from '../couleurs';
import { Box } from '@mui/material';
import { OptionTerritoire, ReplaceDisplayEpci } from './fonctions';

export const RenderOptionTerritoire = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: OptionTerritoire;
}) => {
  const { ...optionProps } = props;
  return (
    <Box
      component="li"
      style={{ borderBottom: '1px solid var(--gris-medium)' }}
      sx={{
        '&:hover': {
          fontWeight: '700 !important',
          backgroundColor: 'transparent !important'
        }
      }}
      {...optionProps}
      key={option.searchLibelle + option.searchCode}
    >
      <Body size="sm" color={COULEURS.texteCorps}>
        {ReplaceDisplayEpci(option.searchLibelle)}
        {option.territoireType === 'commune' && option.searchCode?.length !== 0
          ? ` - ${option.searchCode}`
          : ''}
      </Body>
    </Box>
  );
};
