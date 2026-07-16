'use client';

import { GetAllTerritoires } from '@/lib/queries/searchBar';
import Autocomplete from '@mui/material/Autocomplete';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLibelleTerritoireAvecCode, handleChangementTerritoireRedirection, ReplaceSearchEpci } from '../fonctions';
import { RenderOptionSansFiltre } from '../renderOptionSansFiltre';
import { RenderInputHeader } from './renderInputHeader';

export const SearchInputHeader = ((props: SearchInputHeaderProps) => {
  const {
    className,
    id,
    typeTerritoire,
    setTypeTerritoire,
    setSearchCode,
    setSearchLibelle,
    searchCode,
    searchLibelle,
    isTerritoryChanging,
    setIsTerritoryChanging,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const thematique = params.get('thematique') || undefined;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchInputOptionsSansFiltre[]>([]);
  const [value, setValue] = useState<SearchInputOptionsSansFiltre | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isEnterPressedRef = useRef(false);

  const buildValueFromProps = (): SearchInputOptionsSansFiltre | null => {
    if (!searchLibelle) return null;
    return {
      searchLibelle,
      searchCode: searchCode || '',
      codeCommune: '',
      codeEpci: '',
      ept: '',
      libellePetr: '',
      libellePnr: '',
      codePnr: '',
      territoireType: typeTerritoire
    };
  };

  useEffect(() => {
    if (searchLibelle) {
      setValue(buildValueFromProps());
      setInputValue('');
    }
  }, [searchLibelle, searchCode, typeTerritoire]);
  const filteredCollectivite = options.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.searchLibelle === value.searchLibelle &&
          t.searchCode === value.searchCode
      )
  );
  const collectivites = filteredCollectivite.toSorted((a, b) =>
    a.searchLibelle.localeCompare(b.searchLibelle)
  );

  const fetchTerritoires = async (value: string) => {
    const result = await GetAllTerritoires(value);
    setOptions(
      result.map((el) => ({
        searchLibelle: el.search_libelle,
        searchCode: el.search_code ?? '',
        codeCommune: el.code_geographique ?? '',
        codeEpci: el.epci ?? '',
        ept: el.ept ?? '',
        libellePetr: el.libelle_petr ?? '',
        libellePnr: el.libelle_pnr ?? '',
        codePnr: el.code_pnr ?? '',
        territoireType: el.territoire_type
      }))
    );
  };

  const submitRedirection = (newValue: SearchInputOptionsSansFiltre) => {
    setIsTerritoryChanging(false);
    const input = document.getElementById(id);
    if (input) (input as HTMLInputElement).blur();
    handleChangementTerritoireRedirection({
      searchCode: newValue.searchCode ?? '',
      searchLibelle: newValue.searchLibelle ?? '',
      typeTerritoire: newValue.territoireType,
      router,
      page: pathname.split('/')[1] || '',
      thematique
    });
  };

  return (
    <Autocomplete
      id={id}
      autoHighlight
      filterOptions={(x) => x}
      options={collectivites}
      value={value}
      loadingText="Chargement..."
      noOptionsText="Aucun territoire trouvé"
      open={isOpen}
      onOpen={(event) => {
        if (event?.type !== 'mousedown' && isTerritoryChanging) return;
        setValue(null);
        setIsTerritoryChanging(true);
        const input = document.getElementById(id);
        if (input) (input as HTMLInputElement).focus();
        if (inputValue.length > 0) setIsOpen(true);
      }}
      onClose={() => setIsOpen(false)}
      onBlur={() => {
        if (value === null) {
          setValue(buildValueFromProps());
          setInputValue('');
          setOptions([]);
          setIsOpen(false);
          setIsTerritoryChanging(false);
        }
      }}
      onChange={(event, newValue: SearchInputOptionsSansFiltre | null) => {
        if (newValue === null) {
          setIsTerritoryChanging(true);
        }
        setValue(newValue);
        setOptions(newValue ? [newValue, ...options] : options);
        setSearchCode(newValue?.searchCode ?? '');
        setSearchLibelle(newValue?.searchLibelle ?? '');
        if (newValue) {
          setTypeTerritoire(newValue.territoireType);
        }

        if (isEnterPressedRef.current && newValue !== null) {
          isEnterPressedRef.current = false;
          submitRedirection(newValue);
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        const nextValue = ReplaceSearchEpci(newInputValue);
        setInputValue(nextValue);
        if (reason === 'input') {
          if (nextValue.length === 0) {
            setOptions([]);
            setIsOpen(false);
          } else {
            setIsOpen(true);
            void fetchTerritoires(nextValue);
          }
        } else {
          setIsOpen(false);
        }
      }}
      getOptionLabel={(option) => (option ? getLibelleTerritoireAvecCode(option) : '')}
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          e.preventDefault();
          if (value !== null) {
            submitRedirection(value);
          } else {
            isEnterPressedRef.current = true;
          }
        }
      }}
      renderOption={(props, option) => (
        <RenderOptionSansFiltre
          key={option.searchLibelle + option.searchCode}
          props={props}
          option={option}
        />
      )}
      renderInput={(params) =>
        <RenderInputHeader
          className={className}
          setInputValue={setInputValue}
          setSearchCode={setSearchCode}
          setSearchLibelle={setSearchLibelle}
          params={params}
        />
      }
      fullWidth
      clearOnEscape
      openOnFocus
      selectOnFocus
      slotProps={{
        popper: {
          sx: {
            '&[data-popper-placement*="bottom"] .MuiPaper-root': {
              transform: 'translateY(14px)',
            },
            '&[data-popper-placement*="top"] .MuiPaper-root': {
              transform: 'translateY(-14px)',
            },
            '& .MuiPaper-root': {
              borderRadius: '1rem',
              padding: '0.5rem 0.2rem 0.5rem 0.5rem',
              width: "448px !important",
              boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);'
            },
            '& .MuiAutocomplete-listbox': {
              backgroundColor: 'white',
              scrollbarWidth: 'thin',
              padding: '0'
            },
          },
        },
      }}
      sx={{
        width: 'inherit',
        height: '48px',
        alignContent: 'center',
        transition: 'all 0.5s ease-in-out',
        '& .MuiAutocomplete-clearIndicator': {
          display: 'none',
          overflow: 'hidden'
        },
      }}
    />
  );
});
