"use client";

import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

export const SelectTypeTerritoire = ({
  value,
  isTypeChanging,
  isTerritoryChanging,
  setIsTypeChanging,
  setTypeTerritoire,
  setIsTerritoryChanging,
  setValue,
  setIsNewTypeChosen
}: {
  value: string;
  isTypeChanging: boolean;
  isTerritoryChanging: boolean;
  setIsTypeChanging: (a: boolean) => void;
  setTypeTerritoire: (a: "epci" | "commune" | "departement" | "petr" | "pnr") => void;
  setIsTerritoryChanging: (a: boolean) => void;
  setValue: (a: "EPCI/EPT" | "Commune" | "Département" | "PETR" | "PNR") => void;
  setIsNewTypeChosen: (a: boolean) => void;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const collectivites = ["EPCI/EPT", "Commune", "Département", "PETR", "PNR"];
  
  return (
    <Select
      labelId="Sélection du territoire"
      inputProps={{ 'aria-label': 'Type de territoire' }}
      value={value}
      open={isSelectOpen}
      onOpen={(event) => {
        setIsTypeChanging(true);
        if (event.type === 'keydown') {
          setIsSelectOpen(true);
        } else {
          setTimeout(() => setIsSelectOpen(true), 500);
        }
      }}
      onClose={() => {
        setIsSelectOpen(false);
        setIsTypeChanging(false);
        setIsTerritoryChanging(true);
      }}
      onChange={(event: SelectChangeEvent) => {
        setValue(event.target.value as "EPCI/EPT" | "Commune" | "Département" | "PETR" | "PNR");
        setTypeTerritoire(event.target.value === "EPCI/EPT" ? 'epci'
          : event.target.value === "Commune" ? 'commune'
            : event.target.value === "Département" ? 'departement'
              : event.target.value === "PETR" ? 'petr'
                : event.target.value === "PNR" ? 'pnr'
                  : 'epci');
        setIsNewTypeChosen(true);
      }}
      MenuProps={{
        sx: {
          '& .MuiPaper-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '1rem',
            transform: 'translateY(14px) !important',
            '& .Mui-selected': {
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
            },
          },
          '& .MuiList-root': {
            padding: '0.5rem',
          },
          '& .MuiButtonBase-root:not(:last-child)': {
            borderBottom: '1px solid var(--gris-medium)',
          },
          '& .MuiButtonBase-root': {
            fontSize: '14px',
            lineHeight: '19px',
            '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' },
            '&:focus': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: 'none' },
          },
        },
      }}
      sx={{
        '&': {
          backgroundColor: isTypeChanging ? 'white' : isTerritoryChanging ? 'var(--gris-light)' : 'white',
          boxShadow: isTypeChanging ? 'rgba(0, 0, 0, 0.1) 0px 3px 12px 0px, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px' : isTerritoryChanging ? 'none' : 'none',
          borderRadius: '30px',
          height: "48px", // inherit 50px - bordure en haut et en bas
          fontWeight: 400,
          transition: 'all 0.5s ease-in-out'
        },
        '& .MuiSelect-select': {
          color: '#000000',
          fontSize: '14px',
          fontFamily: 'Marianne',
          fontWeight: 400,
          border: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
      >
      {collectivites.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}
