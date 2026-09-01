'use client';

import { Body } from '@/design-system/base/Textes';
import { COULEURS } from '../couleurs';
import { TypeTerritoireRecherchable } from '@/lib/questionnaire-de-connexion/types';
import { GetCollectivite } from '@/lib/queries/questionnaire-de-connexion/searchBar';
import Autocomplete from '@mui/material/Autocomplete';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useMemo, useRef, useState } from 'react';
import {
  getLibelleTerritoireAvecCode,
  LIBELLE_TERRITOIRE_ABSENT,
  OptionTerritoire,
  preparerOptionsTerritoires,
  ReplaceSearchEpci
} from './fonctions';
import { RenderOptionTerritoire } from './RenderOptionTerritoire';
import styles from './recherche.module.scss';

interface Props {
  typeRecherche: TypeTerritoireRecherchable;
  libelleInitial: string;
  codeInitial: string;
  enErreur: boolean;
  onSelection: (territoire: { code: string; libelle: string }) => void;
  onReinitialisation: () => void;
  onTerritoireAbsent: () => void;
}

export const BarreDeRechercheTerritoire = ({
  typeRecherche,
  libelleInitial,
  codeInitial,
  enErreur,
  onSelection,
  onReinitialisation,
  onTerritoireAbsent
}: Props) => {
  // Le territoire déjà enregistré doit être reconstitué comme une vraie option :
  // avec un `value` à null, l'Autocomplete vide l'input dès le montage.
  const [optionInitiale] = useState<OptionTerritoire | null>(() =>
    libelleInitial
      ? {
          searchLibelle: libelleInitial,
          searchCode: codeInitial,
          codeCommune: '',
          codeEpci: '',
          ept: '',
          libellePetr: '',
          libellePnr: '',
          codePnr: '',
          territoireType: typeRecherche
        }
      : null
  );
  const [inputValue, setInputValue] = useState(
    optionInitiale ? getLibelleTerritoireAvecCode(optionInitiale) : ''
  );
  const [options, setOptions] = useState<OptionTerritoire[]>(
    optionInitiale ? [optionInitiale] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerritoire, setSelectedTerritoire] =
    useState<OptionTerritoire | null>(optionInitiale);
  const [isOpen, setIsOpen] = useState(false);

  // L'option sentinelle « territoire absent » sert de `value` à l'Autocomplete
  // pour qu'il garde le libellé dans le champ, mais ne s'affiche pas dans la liste.
  const optionAbsente: OptionTerritoire = {
    searchLibelle: LIBELLE_TERRITOIRE_ABSENT,
    searchCode: '',
    codeCommune: '',
    codeEpci: '',
    ept: '',
    libellePetr: '',
    libellePnr: '',
    codePnr: '',
    territoireType: typeRecherche
  };

  const territoires = preparerOptionsTerritoires(
    options.filter(
      (option) => option.searchLibelle !== LIBELLE_TERRITOIRE_ABSENT
    ),
    inputValue
  );

  const absentRef = useRef(onTerritoireAbsent);
  absentRef.current = onTerritoireAbsent;

  const fetchTerritoires = async (value: string) => {
    setIsLoading(true);
    const result = await GetCollectivite(typeRecherche, value);
    setOptions(
      result
        .filter((el) => el.search_libelle)
        .map((el) => ({
          searchLibelle: el.search_libelle,
          searchCode: el.search_code ?? '',
          codeCommune: el.code_geographique ?? '',
          codeEpci: el.epci ?? '',
          ept: el.ept ?? '',
          libellePetr: el.libelle_petr ?? '',
          libellePnr: el.libelle_pnr ?? '',
          codePnr: el.code_pnr ?? '',
          territoireType: typeRecherche
        }))
    );
    setIsLoading(false);
  };

  const handleEffacer = () => {
    setInputValue('');
    setOptions([]);
    setSelectedTerritoire(null);
    setIsOpen(false);
    onReinitialisation();
  };

  const aucunResultat = !isLoading && territoires.length === 0;

  // Le lien « Mon territoire n'apparaît pas » vit sous la liste, donc hors du
  // `role="listbox"` : ce n'est pas une option de la recherche.
  const PaperAvecAbsent = useMemo(() => {
    const Composant = ({ children, ...props }: PaperProps) => (
      <Paper {...props}>
        {children}
        {aucunResultat && (
          <button
            type="button"
            className={styles.optionAbsent}
            onMouseDown={(event) => {
              event.preventDefault();
              setSelectedTerritoire(optionAbsente);
              setOptions([optionAbsente]);
              setInputValue(LIBELLE_TERRITOIRE_ABSENT);
              setIsOpen(false);
              absentRef.current();
            }}
          >
            <span aria-hidden="true">+</span>
            <Body
              htmlTag="span"
              size="sm"
              weight="medium"
              color={COULEURS.texteVert}
            >
              {LIBELLE_TERRITOIRE_ABSENT}
            </Body>
          </button>
        )}
      </Paper>
    );
    Composant.displayName = 'PaperAvecAbsent';
    return Composant;
  }, [aucunResultat]);

  return (
    <div className={styles.wrapper}>
      <Autocomplete
        id="questionnaire-recherche-territoire"
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
        PaperComponent={PaperAvecAbsent}
        onOpen={() => {
          if (inputValue.length > 0) setIsOpen(true);
        }}
        onClose={() => setIsOpen(false)}
        onChange={(event, newValue: OptionTerritoire | null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setSelectedTerritoire(newValue);
          setIsOpen(false);
          if (newValue) {
            onSelection({
              code: newValue.searchCode,
              libelle: newValue.searchLibelle
            });
          }
        }}
        onInputChange={(event, newInputValue, reason) => {
          const value = ReplaceSearchEpci(newInputValue);
          setInputValue(value);
          if (reason === 'input') {
            onReinitialisation();
            setSelectedTerritoire(null);
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
        getOptionLabel={(option) =>
          option ? getLibelleTerritoireAvecCode(option) : ''
        }
        renderOption={(props, option) => (
          <RenderOptionTerritoire
            key={option.searchLibelle + option.searchCode}
            props={props}
            option={option}
          />
        )}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} className={styles.champWrapper}>
            <input
              {...params.inputProps}
              aria-label="Rechercher votre territoire"
              aria-invalid={enErreur}
              placeholder="Saisir un territoire"
              style={{
                width: '100%',
                height: '3rem',
                boxSizing: 'border-box',
                borderRadius: '60px',
                padding: '0 3rem 0 1rem',
                border: `1px solid ${enErreur ? COULEURS.rougeErreur : COULEURS.vert}`,
                color: COULEURS.vert,
                backgroundColor: 'white',
                outline: 'none',
                fontFamily: 'Marianne',
                fontSize: '1rem',
                fontWeight: 400
              }}
            />
            {(inputValue.length > 0 || selectedTerritoire !== null) && (
              <button
                type="button"
                aria-label="Effacer le territoire"
                className={styles.effacer}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEffacer();
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
                transform: 'translateY(14px)'
              },
              '&[data-popper-placement*="top"] .MuiPaper-root': {
                transform: 'translateY(-14px)'
              },
              '& .MuiPaper-root': {
                borderRadius: '1rem',
                padding: '0.5rem 0.2rem 0.5rem 0.5rem',
                boxShadow:
                  '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);'
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
    </div>
  );
};
