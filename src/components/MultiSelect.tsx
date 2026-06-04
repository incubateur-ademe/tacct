"use client";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useState } from 'react';

export const MultiSelect = ({
  options,
  handleSelectObjectifOptions,
  selectedValues = []
}: {
  options: string[];
  handleSelectObjectifOptions: (event: SelectChangeEvent<string[]>) => void;
  selectedValues?: string[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormControl fullWidth>
      <Select
        multiple
        value={selectedValues}
        onChange={handleSelectObjectifOptions}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        IconComponent={ExpandMoreOutlinedIcon}
        renderValue={(selected) =>
          selected.length === 0
            ? "Sélectionnez une option"
            : `${selected.length} sélectionné(s)`
        }
        MenuProps={{
          disableAutoFocusItem: true,
          disableAutoFocus: true,
          sx: {
            '& .MuiPaper-root': {
              maxHeight: '500px',
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              transform: 'translateY(14px) !important',
              boxShadow: '0px 2px 6px 0px #00001229',
              '& .Mui-selected': {
                fontWeight: 700,
                backgroundColor: '#FFFFFF',
              },
            },
            '& .MuiTypography-root': {
              fontFamily: 'Marianne !important',
            },
            '& .MuiList-root': {
              padding: '1.5rem',
            },
            '& .MuiMenuItem-root:not(:last-child)': {
              // borderBottom: '1px solid var(--gris-medium)',
            },
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              lineHeight: '19px',
              padding: 0,

              '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' },
              '&:focus': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:focus-visible': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
            },
            '& .MuiCheckbox-root': {
              padding: '6px',
            },
          },
        }}
        sx={{
          '&': {
            backgroundColor: 'white',
            borderRadius: '30px',
            height: "48px",
            fontWeight: 400,
            // transition: 'all 0.5s ease-in-out',
            border: open ? '1px solid var(--boutons-primaire-1)' : '1px solid var(--gris-medium)',
          },
          '&:focus-within, &.Mui-focused': {
            outline: '2px solid var(--boutons-primaire-1)',
            outlineOffset: '2px',
          },
          '& .MuiSelect-select': {
            color: 'var(--gris-dark)',
            fontSize: '1rem',
            fontFamily: 'Marianne',
            fontWeight: selectedValues.length === 0 ? 'normal' : 'bold',
            border: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox
              checked={selectedValues.includes(option)}
              sx={{
                color: '#038278',
                '&.Mui-checked': {
                  color: '#038278',
                },
                '& .MuiSvgIcon-root': {
                  borderRadius: '4px',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: '2px solid var(--boutons-primaire-1)',
                  outlineOffset: '2px',
                },
              }}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const SingleSelect = ({
  options,
  handleSelectOption,
  selectedValue = '',
  label = 'Sélectionnez une option'
}: {
  options: string[];
  handleSelectOption: (value: string) => void;
  selectedValue?: string;
  label?: string;
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleItemClick = (option: string) => {
    handleSelectOption(option);
  };

  return (
    <FormControl fullWidth>
      <Select
        ref={selectRef}
        value={selectedValue}
        onChange={() => {}}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        IconComponent={ExpandMoreOutlinedIcon}
        renderValue={(selected) =>
          selected === ''
            ? label
            : selected
        }
        MenuProps={{
          disableAutoFocusItem: true,
          disableAutoFocus: true,
          onClose: (event, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
              setOpen(false);
              if (selectRef.current) {
                setTimeout(() => {
                  (document.activeElement as HTMLElement)?.blur();
                }, 0);
              }
            }
          },
          sx: {
            '& .MuiPaper-root': {
              maxHeight: '500px',
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              transform: 'translateY(14px) !important',
              boxShadow: '0px 2px 6px 0px #00001229',
              '& .Mui-selected': {
                fontWeight: 700,
                backgroundColor: '#FFFFFF',
              },
            },
            '& .MuiTypography-root': {
              fontFamily: 'Marianne !important',
            },
            '& .MuiList-root': {
              padding: '1.5rem',
            },
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              lineHeight: '19px',
              padding: 0,

              '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' },
              '&:focus': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:focus-visible': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:active': { outline: 'none' },
            },
            '& .MuiRadio-root': {
              padding: '5px',
            },
          },
        }}
        sx={{
          '&': {
            backgroundColor: 'white',
            borderRadius: '30px',
            height: "48px",
            fontWeight: 400,
            border: open ? '1px solid var(--boutons-primaire-1)' : '1px solid var(--gris-medium)',
          },
          '&:focus-within, &.Mui-focused': {
            outline: '2px solid var(--boutons-primaire-1)',
            outlineOffset: '2px',
          },
          '& .MuiSelect-select': {
            color: 'var(--gris-dark)',
            fontSize: '1rem',
            fontFamily: 'Marianne',
            fontWeight: selectedValue === '' ? 'normal' : 'bold',
            border: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option} 
            value={option}
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleItemClick(option);
              (e.currentTarget as HTMLElement).blur();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleItemClick(option);
              }
            }}
          >
            <Radio
              checked={selectedValue === option}
              sx={{
                color: '#038278',
                '&.Mui-checked': {
                  color: '#038278',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: '2px solid var(--boutons-primaire-1)',
                  outlineOffset: '2px',
                },
              }}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const SingleSelectResponsive = ({
  handleSelectOption,
  selectedValue = '',
  filtre
}: {
  handleSelectOption: (value: string) => void;
  selectedValue?: string;
  filtre: { titre: string; options: string[]; };
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleItemClick = (option: string) => {
    handleSelectOption(option);
  };

  return (
    <FormControl fullWidth>
      <Select
        ref={selectRef}
        value={selectedValue}
        onChange={() => {}}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        IconComponent={ExpandMoreOutlinedIcon}
        renderValue={(selected) => selected !== '' ? `${filtre.titre} (1)` : filtre.titre}
        MenuProps={{
          disableAutoFocusItem: true,
          disableAutoFocus: true,
          onClose: (event, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
              setOpen(false);
              if (selectRef.current) {
                setTimeout(() => {
                  (document.activeElement as HTMLElement)?.blur();
                }, 0);
              }
            }
          },
          sx: {
            '& .MuiPaper-root': {
              maxHeight: '500px',
              backgroundColor: '#FAFAFA',
              borderRadius: '0px',
              boxShadow: 'none',
              '& .Mui-selected': {
                fontWeight: 700,
                backgroundColor: '#FFFFFF',
              },
            },
            '& .MuiTypography-root': {
              fontFamily: 'Marianne !important',
            },
            '& .MuiList-root': {
              padding: '1rem 0.5rem',
            },
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              lineHeight: '19px',
              padding: 0,

              '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' },
              '&:focus': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:focus-visible': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:active': { outline: 'none' },
            },
            '& .MuiRadio-root': {
              padding: '6px',
            },
          },
        }}
        sx={{
          '&': {
            backgroundColor: 'white',
            borderRadius: '0px',
            height: "48px",
            fontWeight: 400,
            borderBottom: '1px solid var(--gris-medium)',
          },
          '&:focus-within, &.Mui-focused': {
            outline: '2px solid var(--boutons-primaire-1)',
            outlineOffset: '2px',
          },
          '& .MuiSelect-select': {
            color: '#161616',
            fontSize: '18px',
            fontFamily: 'Marianne',
            fontWeight: selectedValue === '' ? 'normal' : 'bold',
            border: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-icon': {
            fill: '#161616',
          },
        }}
      >
        {filtre.options.map((option) => (
          <MenuItem 
            key={option} 
            value={option}
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleItemClick(option);
              (e.currentTarget as HTMLElement).blur();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleItemClick(option);
              }
            }}
          >
            <Radio
              checked={selectedValue === option}
              sx={{
                color: '#038278',
                '&.Mui-checked': {
                  color: '#038278',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: '2px solid var(--boutons-primaire-1)',
                  outlineOffset: '2px',
                },
              }}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const MultiSelectResponsive = ({
  handleSelectObjectifOptions,
  selectedValues = [],
  filtre
}: {
  handleSelectObjectifOptions: (event: SelectChangeEvent<string[]>) => void;
  selectedValues?: string[];
  filtre: { titre: string; options: string[]; };
}) => {
  const [open, setOpen] = useState(false);
  return (
    <FormControl fullWidth>
      <Select
        multiple
        value={selectedValues}
        onChange={handleSelectObjectifOptions}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        IconComponent={ExpandMoreOutlinedIcon}
        renderValue={() => selectedValues.length !== 0 ? `${filtre.titre} (${selectedValues.length})` : filtre.titre}
        MenuProps={{
          disableAutoFocusItem: true,
          disableAutoFocus: true,
          sx: {
            '& .MuiPaper-root': {
              maxHeight: '500px',
              backgroundColor: '#FAFAFA',
              borderRadius: '0px',
              boxShadow: 'none',
              '& .Mui-selected': {
                fontWeight: 700,
                backgroundColor: '#FFFFFF',
              },
            },
            '& .MuiTypography-root': {
              fontFamily: 'Marianne !important',
            },
            '& .MuiList-root': {
              padding: '1rem 0.5rem',
            },
            '& .MuiMenuItem-root:not(:last-child)': {
              // borderBottom: '1px solid var(--gris-medium)',
            },
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              lineHeight: '19px',
              padding: 0,

              '&:hover': { fontWeight: '700 !important', backgroundColor: 'transparent !important' },
              '&:focus': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
              '&:focus-visible': { fontWeight: '700 !important', backgroundColor: 'transparent !important', outline: '2px solid var(--boutons-primaire-1)', outlineOffset: '2px' },
            },
            '& .MuiCheckbox-root': {
              padding: '6px',
            },
          },
        }}
        sx={{
          '&': {
            backgroundColor: 'white',
            borderRadius: '0px',
            height: "48px",
            fontWeight: 400,
            borderBottom: '1px solid var(--gris-medium)',
          },
          '&:focus-within, &.Mui-focused': {
            outline: '2px solid var(--boutons-primaire-1)',
            outlineOffset: '2px',
          },
          '& .MuiSelect-select': {
            color: '#161616',
            fontSize: '18px',
            fontFamily: 'Marianne',
            fontWeight: selectedValues.length === 0 ? 'normal' : 'bold',
            border: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-icon': {
            fill: '#161616',
          },
        }}
      >
        {filtre.options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox
              checked={selectedValues.includes(option)}
              sx={{
                color: '#038278',
                '&.Mui-checked': {
                  color: '#038278',
                },
                '& .MuiSvgIcon-root': {
                  borderRadius: '4px',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: '2px solid var(--boutons-primaire-1)',
                  outlineOffset: '2px',
                },
              }}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
