'use client';

import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { couleursPrincipales, nuancesGris } from '@/design-system/couleurs';
import useWindowDimensions from '@/hooks/windowDimensions';
import { FocusOnElement } from '@/lib/utils/reusableFunctions/focus';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import styles from "../components.module.scss";
import { RechercheInput } from './rechercheInput';

export const BarreDeRecherche = ({
  RechercherRedirection,
  setSearchCode,
  setSearchLibelle,
  typeTerritoire,
  searchCode,
  searchLibelle,
  radioOptions
}: {
  RechercherRedirection: () => void;
  setSearchCode: (code: string) => void;
  setSearchLibelle: (libelle: string) => void;
  typeTerritoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  searchCode: string;
  searchLibelle: string;
  radioOptions: {
    label: string;
    nativeInputProps: {
      checked: boolean;
      onChange?: () => void;
    };
  }[][];
}) => {
  const { css } = useStyles();
  const window = useWindowDimensions();
  const [width, setWidth] = useState<number | undefined>(1000);
  const params = usePathname();

  // Met le focus sur le champ de recherche lorsque le composant est monté
  // et lorsque le typeTerritoire change
  useEffect(() => {
    const foundInputId = Array
      .from(document.querySelectorAll('[id]'))
      .map(el => el.id)
      .find(id => id.startsWith("search-fr-search-bar-") && !document.getElementById(id)?.closest('header'));
    if (foundInputId) {
      FocusOnElement(foundInputId);
    }
  }, [typeTerritoire]);

  useEffect(() => {
    setWidth(window.width);
  }, [window.width]);

  return (
    <div className={styles.searchCompWrapper}>
      <div className='flex flex-row gap-3 justify-center items-center'>
        {
          radioOptions.map((options, index) => (
            <RadioButtons
              key={index}
              name={`radio-${index}`}
              disabled={options[0].nativeInputProps.onChange ? false : true}
              options={options}
              orientation={width && width > 520 ? "horizontal" : "vertical"}
              className={css({
                '.fr-fieldset__content': {
                  '&:hover::after': {
                    content: params === "/recherche-territoire-patch4" && !options[0].nativeInputProps.onChange
                      ? '"Le patch 4°C n’est actuellement pas disponible pour ce type de territoire."'
                      : 'none',
                    position: 'absolute',
                    left: '50%',
                    top: '-150%',
                    transform: 'translateX(-28%)',
                    background: '#FFF',
                    color: "black",
                    padding: '1rem',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    boxShadow: "0px 2px 6px 0px rgba(0, 0, 18, 0.16)",
                    // border: "1px solid var(--gris-medium)"
                  },
                  justifyContent: 'center',
                  '.fr-label': {
                    paddingBottom: 0,
                    fontSize: "1rem",
                    position: 'relative',
                    backgroundImage: "radial-gradient(transparent 10px, var(--gris-dark) 11px, transparent 12px)",
                    color: options[0].nativeInputProps.onChange ? nuancesGris.dark : "#D3D0D0"
                  },
                  'input[type=radio]:checked + .fr-label': {
                    backgroundImage: "radial-gradient(transparent 10px, var(--principales-vert) 11px, transparent 12px), radial-gradient(var(--principales-vert) 5px, transparent 6px);"
                  },
                  '@media (max-width: 745px)': {
                    justifyContent: 'flex-start'
                  }
                },
              })}
            />
          ))
        }
      </div>
      <div
        className={styles.searchbarWrapper}
        style={{ flexDirection: width && width < 520 ? 'column' : 'row' }}
      >
        <SearchBar
          className={typeTerritoire.length ?
            css({
              '.fr-btn': {
                display: 'none',
              },
              border: `1px solid ${couleursPrincipales.vert}`,
              borderRadius: "60px",
              height: 'inherit',
              '.fr-input': {
                color: couleursPrincipales.vert,
                backgroundColor: 'white',
                boxShadow: 'none',
                '&:focus-visible': {
                  outline: `0px solid ${couleursPrincipales.vert}`,
                },
                '&::placeholder': {
                  color: '#7B7B7B'
                }
              },
              '.css-1uhhrmm-MuiAutocomplete-endAdornment': {
                right: '2px',
              },
              '.css-iuka1o': { // pour la preprod
                right: '2px',
              }
            })
            : css({
              '.fr-btn': {
                display: 'none',
              },
              border: '1px solid #EEEEEE',
              height: 'inherit',
              '.fr-input': {
                color: couleursPrincipales.vert,
                backgroundColor: '#EEEEEE',
                boxShadow: 'none',
                '&:focus-visible': {
                  outline: `2px solid ${couleursPrincipales.vert}`,
                  outlineOffset: '2px'
                },
                '&::placeholder': {
                  color: '#7B7B7B'
                }
              },
              '.css-1uhhrmm-MuiAutocomplete-endAdornment': {
                right: '2px',
              }
            })
          }
          style={{ minWidth: width && width > 520 ? 300 : 0, width: '100%', alignItems: 'center' }}
          renderInput={({ className, id, placeholder, type }) => (
            <RechercheInput
              className={className}
              id={id}
              placeholder={placeholder}
              type={type}
              typeTerritoire={typeTerritoire}
              setSearchCode={setSearchCode}
              setSearchLibelle={setSearchLibelle}
              searchCode={searchCode}
              searchLibelle={searchLibelle}
              RechercherRedirection={RechercherRedirection}
            />
          )}
        />
        <BoutonPrimaireClassic
          text="Rechercher"
          size="lg"
          disabled={searchLibelle.length === 0 ? true : false}
          onClick={RechercherRedirection}
        />
      </div>
    </div>
  );
};
