'use client';

import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { couleursPrincipales, nuancesGris } from '@/design-system/couleurs';
import { GetAllTerritoires } from '@/lib/queries/searchBar';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../components.module.scss';
import { getLibelleTerritoireAvecCode, handleRechercheRedirection, preparerOptionsTerritoires, ReplaceSearchEpci } from './fonctions';
import { RenderOptionSansFiltre } from './renderOptionSansFiltre';

export const BarreDeRechercheSansFiltre = ({
  page = 'thematiques'
}: {
  page?: string;
} = {}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchInputOptionsSansFiltre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerritoire, setSelectedTerritoire] = useState<SearchInputOptionsSansFiltre | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const territoires = preparerOptionsTerritoires(options, inputValue);

  const fetchTerritoires = async (value: string) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleEffacer = () => {
    setInputValue('');
    setOptions([]);
    setSelectedTerritoire(null);
    setIsOpen(false);
  };

  const handleRechercher = () => {
    if (!selectedTerritoire) return;
    handleRechercheRedirection({
      searchCode: selectedTerritoire.searchCode,
      searchLibelle: selectedTerritoire.searchLibelle,
      typeTerritoire: selectedTerritoire.territoireType,
      router,
      page
    });
  };

  return (
    <div className={styles.searchCompWrapper}>
      <div className={styles.searchbarWrapperSansFiltre}>
        <Autocomplete
          id="recherche-territoire-sans-filtre"
          autoHighlight
          fullWidth
          loading={isLoading}
          filterOptions={(x) => x}
          options={territoires}
          value={selectedTerritoire}
          inputValue={inputValue}
          loadingText="Chargement..."
          noOptionsText="Aucun territoire trouvé"
          open={isOpen}
          onOpen={() => {
            if (inputValue.length > 0) setIsOpen(true);
          }}
          onClose={() => setIsOpen(false)}
          onChange={(event, newValue: SearchInputOptionsSansFiltre | null) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setSelectedTerritoire(newValue);
            setIsOpen(false);
          }}
          onInputChange={(event, newInputValue, reason) => {
            const value = ReplaceSearchEpci(newInputValue);
            setInputValue(value);
            if (reason === 'input') {
              setIsOpen(value.length > 0);
              if (value.length === 0) {
                setOptions([]);
              } else {
                void fetchTerritoires(value);
              }
            } else {
              setIsOpen(false);
            }
          }}
          getOptionLabel={(option) => (option ? getLibelleTerritoireAvecCode(option) : '')}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              handleRechercher();
            }
          }}
          renderOption={(props, option) => (
            <RenderOptionSansFiltre
              key={option.searchLibelle + option.searchCode}
              props={props}
              option={option}
            />
          )}
          renderInput={(params) => (
            <div
              ref={params.InputProps.ref}
              style={{ width: '100%', position: 'relative' }}
            >
              <input
                {...params.inputProps}
                aria-label="Rechercher un territoire"
                placeholder="Saisir un territoire"
                style={{
                  width: '100%',
                  height: '3rem',
                  boxSizing: 'border-box',
                  borderRadius: '60px',
                  padding: '0 3rem 0 1rem',
                  border: `1px solid ${couleursPrincipales.vert}`,
                  color: couleursPrincipales.vert,
                  backgroundColor: 'white',
                  outline: 'none',
                  // fontStyle: "italic",
                  fontWeight: 400
                }}
              />
              {(inputValue.length > 0 || selectedTerritoire !== null) && (
                <button
                  type="button"
                  aria-label="Effacer le territoire"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEffacer();
                  }}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '47%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    fontSize: '1.25rem',
                    lineHeight: 1,
                    color: nuancesGris.dark,
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          )}
          sx={{ alignItems: 'center' }}
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
                  boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);'
                },
                '& .MuiAutocomplete-listbox': {
                  backgroundColor: 'white',
                  scrollbarWidth: 'thin',
                  padding: '0'
                }
              }
            }
          }}
        />
        <BoutonPrimaireClassic
          text="Rechercher"
          size="lg"
          disabled={!selectedTerritoire}
          onClick={handleRechercher}
        />
      </div>
    </div>
  );
};
