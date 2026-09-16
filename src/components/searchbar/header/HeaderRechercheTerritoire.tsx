import { getTextWidth } from '@/hooks/TextWidth';
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { useEffect, useState } from "react";
import { useStyles } from "tss-react/dsfr";
import styles from '../../components.module.scss';
import { getLibelleTerritoireAvecCode } from '../fonctions';
import { BoutonRechercherHeader } from './BoutonRechercher';
import { SearchInputHeader } from './SearchInputHeader';

const HeaderRechercheTerritoire = (props:
  {
    libelle: string;
    type: "epci" | "commune" | "departement" | "ept" | "petr" | "pnr";
    code?: string
  }) => {
  const { libelle, code, type } = props;
  const { css } = useStyles();
  const [isTerritoryChanging, setIsTerritoryChanging] = useState(false);
  const [searchCode, setSearchCode] = useState<string>(code ?? '');
  const [searchLibelle, setSearchLibelle] = useState<string>(libelle ?? '');
  const [typeTerritoire, setTypeTerritoire] = useState<TerritoireType>(
    type === 'ept' ? 'epci' : type
  );
  const territoireTexte = getLibelleTerritoireAvecCode({
    territoireType: typeTerritoire,
    searchLibelle,
    searchCode
  });
  const textWidth = getTextWidth(territoireTexte);

  useEffect(() => {
    setSearchCode(code ?? '');
    setSearchLibelle(libelle ?? '');
    setTypeTerritoire(type === 'ept' ? 'epci' : type);
  }, [code, libelle, type]);

  return (
    libelle ? (
      <div
        className={styles.headerSearchBarContainer}
        style={{
          width: isTerritoryChanging ? "540px" : Math.min(textWidth + 60, 539),
          minWidth: 0,
          backgroundColor: isTerritoryChanging ? 'var(--gris-light)' : 'white',
        }}
      >
        <div
          className={styles.searchTerritoireContainer}
          style={{
            margin: isTerritoryChanging ? "0 8px 0 0" : "0"
          }}
        >
          <SearchBar
            className={
              css({
                '.fr-btn': {
                  display: 'none',
                },
                borderRadius: "30px",
                height: '48px',
                alignItems: 'center',
                backgroundColor: 'white',
                boxShadow: isTerritoryChanging ? 'rgba(0, 0, 0, 0.1) 0px 3px 12px 0px, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px' : 'none',
                width: ['-webkit-fill-available', '-moz-available'],
                minWidth: 0,
                flexShrink: 1,
                cursor: "pointer",
                transition: 'all 0.5s ease-in-out',
                '.fr-input': {
                  backgroundColor: 'white',
                  boxShadow: isTerritoryChanging ? 'rgba(0, 0, 0, 0.1) 0px 3px 12px 0px, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px' : 'none',
                  height: "48px",
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.5s ease-in-out',
                  '&:focus': {
                    outline: 'none',
                  },
                  // Le focus reste invisible à la souris (rendu inchangé) mais
                  // devient visible au clavier — RGAA 10.7.
                  '&:focus-visible': {
                    outline: '2px solid var(--principales-vert)',
                    outlineOffset: '2px',
                  },
                  '&::placeholder': {
                    color: 'var(--gris-medium-dark)',
                  }
                },
                '.css-1uhhrmm-MuiAutocomplete-endAdornment': {
                  right: '8px',
                },
                '.css-iuka1o': { // pour la preprod
                  right: '8px',
                },
                '.MuiAutocomplete-popupIndicator': {
                  display: isTerritoryChanging ? 'none' : 'inline-flex',
                }
              })
            }
            renderInput={({ className, id, placeholder, type }) => (
              <SearchInputHeader
                className={className}
                id={id}
                placeholder={placeholder}
                type={type}
                typeTerritoire={typeTerritoire}
                setTypeTerritoire={setTypeTerritoire}
                setSearchCode={setSearchCode}
                setSearchLibelle={setSearchLibelle}
                searchCode={searchCode}
                searchLibelle={searchLibelle}
                isTerritoryChanging={isTerritoryChanging}
                setIsTerritoryChanging={setIsTerritoryChanging}
              />
            )}
          />
          {
            isTerritoryChanging ? (
              <BoutonRechercherHeader
                searchLibelle={searchLibelle}
                setIsTerritoryChanging={setIsTerritoryChanging}
                searchCode={searchCode}
                typeTerritoire={typeTerritoire}
              />
            ) : null
          }
        </div>
      </div>
    ) : (
      null
    )
  );
};

export default HeaderRechercheTerritoire;
