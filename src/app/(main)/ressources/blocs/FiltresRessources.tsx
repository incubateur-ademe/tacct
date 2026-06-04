"use client";

import ReinitialiserIcon from "@/assets/icons/refresh_icon_green.png";
import { MultiSelect, MultiSelectResponsive, SingleSelect, SingleSelectResponsive } from "@/components/MultiSelect";
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from "@/design-system/base/Boutons";
import { TagsSimples } from "@/design-system/base/Tags";
import { Body, H2 } from "@/design-system/base/Textes";
import { FiltresOptions, ToutesRessources } from "@/lib/ressources/toutesRessources";
import { SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import styles from "../ressources.module.scss";

interface FiltresRessourcesProps {
  selectedFilters: Record<string, string[]>;
  onSelectOptions: (filterTitre: string) => (event: SelectChangeEvent<string[]>) => void;
  onReset: () => void;
  onRemoveFilter: (filterTitre: string, value: string) => void;
  onSelectFormatRessource: (format: string) => void;
}

export const FiltresRessources = ({
  selectedFilters,
  onSelectOptions,
  onReset,
  onRemoveFilter,
  onSelectFormatRessource
}: FiltresRessourcesProps) => {
  const showTerritoireFilter = selectedFilters['Format de ressource']?.includes("Retour d'expérience");

  useEffect(() => {
    if (!showTerritoireFilter && selectedFilters['Territoire']?.length > 0) {
      selectedFilters['Territoire'].forEach(value => {
        onRemoveFilter('Territoire', value);
      });
    }
  }, [showTerritoireFilter, selectedFilters, onRemoveFilter]);

  return (
    <div className={styles.filtresWrapper}>
      <div className={styles.filtresListe}>
        {FiltresOptions.map(filter => {
          if (filter.titre === 'Territoire' && !showTerritoireFilter) {
            return null;
          }
          if (filter.titre === 'Format de ressource') {
            return (
              <div key={filter.titre} className={styles.filtreItem}>
                <Body>{filter.titre}</Body>
                <SingleSelect
                  options={filter.options}
                  handleSelectOption={onSelectFormatRessource}
                  selectedValue={selectedFilters[filter.titre]?.[0] || ''}
                  label="Sélectionnez une option"
                />
              </div>
            );
          }
          return (
            <div key={filter.titre} className={styles.filtreItem}>
              <Body>{filter.titre}</Body>
              <MultiSelect
                options={filter.options}
                handleSelectObjectifOptions={onSelectOptions(filter.titre)}
                selectedValues={selectedFilters[filter.titre] || []}
              />
            </div>
          );
        })}
        <div
          className={styles.reinitialiser}
          onClick={onReset}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onReset();
            }
          }}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          <Image src={ReinitialiserIcon} alt="Icône réinitialiser" />
          <Body weight="medium" style={{ color: "var(--boutons-primaire-1)" }}>
            Réinitialiser les filtres
          </Body>
        </div>
      </div>
      <div className={styles.filtresSelectionnes}>
        {Object.entries(selectedFilters).map(([filterTitre, values]) =>
          values.map(value => (
            <div key={`${filterTitre}-${value}`} className={styles.filtreTag}>
              <TagsSimples
                texte={value}
                couleur="#E3FAF9"
                couleurTexte="var(--boutons-primaire-3)"
                taille="small"
                closeable
                handleClose={() => onRemoveFilter(filterTitre, value)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface ModalFiltresRessourcesProps {
  isOpen: boolean;
  selectedFilters: Record<string, string[]>;
  onSelectOptions: (filterTitre: string) => (event: SelectChangeEvent<string[]>) => void;
  onReset: () => void;
  onClose: () => void;
  articles: ToutesRessources[];
  onRemoveFilter: (filterTitre: string, value: string) => void;
  onSelectFormatRessource: (format: string) => void;
}

export const ModalFiltresRessources = ({
  isOpen,
  selectedFilters,
  onSelectOptions,
  onReset,
  onClose,
  articles,
  onRemoveFilter,
  onSelectFormatRessource
}: ModalFiltresRessourcesProps) => {
  const showTerritoireFilter = selectedFilters['Format de ressource']?.includes("Retour d'expérience");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!showTerritoireFilter && selectedFilters['Territoire']?.length > 0) {
      selectedFilters['Territoire'].forEach(value => {
        onRemoveFilter('Territoire', value);
      });
    }
  }, [showTerritoireFilter, selectedFilters, onRemoveFilter]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className={styles.titre}>
            <H2 style={{ color: "#161616", fontSize: "22px", margin: 0 }}>
              Filtrer
            </H2>
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.filtresListe}>
            {FiltresOptions.map(filtre => {
              if (filtre.titre === 'Territoire' && !showTerritoireFilter) {
                return null;
              }
              if (filtre.titre === 'Format de ressource') {
                return (
                  <div key={filtre.titre} className={styles.filtreItem}>
                    <SingleSelectResponsive
                      handleSelectOption={onSelectFormatRessource}
                      selectedValue={selectedFilters[filtre.titre]?.[0] || ''}
                      filtre={filtre}
                    />
                  </div>
                );
              }
              return (
                <div key={filtre.titre} className={styles.filtreItem}>
                  <MultiSelectResponsive
                    handleSelectObjectifOptions={onSelectOptions(filtre.titre)}
                    selectedValues={selectedFilters[filtre.titre] || []}
                    filtre={filtre}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <BoutonPrimaireClassic
            onClick={onClose}
            size='lg'
            text={`Voir ${articles.length} résultat(s)`}
            style={{ width: "100%", height: "52px" }}
          />
          <BoutonSecondaireClassic
            onClick={onReset}
            size="lg"
            text={`Réinitialiser les filtres`}
            style={{ width: "100%", height: "52px" }}
            icone={ReinitialiserIcon}
          />
        </div>
      </div>
    </div>
  );
};
