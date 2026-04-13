"use client";

import FiltreIcon from "@/assets/icons/filtre_icon_white.svg";
import { TuileVerticale } from "@/components/Tuile";
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { TagsIcone } from "@/design-system/base/Tags";
import { H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { FiltresOptions, toutesLesRessources } from "@/lib/ressources/toutesRessources";
import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { CollectionsData } from "../[collectionId]/collectionsData";
import { FiltresNonTrouves } from "../components/FiltresNonTrouves";
import styles from "../ressources.module.scss";
import { FiltresRessources, ModalFiltresRessources } from "./FiltresRessources";

export const BlocToutesRessources = () => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [ArticlesFiltres, setArticlesFiltres] = useState(toutesLesRessources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ArticlesSorted = ArticlesFiltres.toSorted((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.ordre - b.ordre;
  });
  const territoireOptions = FiltresOptions.find(f => f.titre === 'Territoire')?.options || [];

  const handleSelectOptions = (filterTitre: string) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedFilters(prev => ({
      ...prev,
      [filterTitre]: typeof value === "string" ? value.split(",") : value
    }));
    const updatedFilters = {
      ...selectedFilters,
      [filterTitre]: typeof value === "string" ? value.split(",") : value
    };
    
    const hasActiveFilters = Object.values(updatedFilters).some(values => values.length > 0);
    
    if (!hasActiveFilters) {
      setArticlesFiltres(toutesLesRessources);
    } else {
      setArticlesFiltres(
        toutesLesRessources.filter(article => {
          // Pour chaque type de filtre actif, vérifier que l'article satisfait au moins une des options (OR au sein du filtre)
          return Object.entries(updatedFilters).every(([, selectedValues]) => {
            if (selectedValues.length === 0) return true;
            // Au moins une des valeurs sélectionnées dans ce type de filtre doit être présente
            return selectedValues.some(value => article.filtres?.includes(value));
          });
        })
      );
    }
  };

  const handleReset = () => {
    setSelectedFilters({});
    setArticlesFiltres(toutesLesRessources);
  };

  const handleRemoveFilter = (filterTitre: string, value: string) => {
    setSelectedFilters(prev => {
      if (!prev[filterTitre]) {
        return prev;
      }
      const updatedValues = prev[filterTitre].filter(v => v !== value);
      let updatedFilters;
      if (updatedValues.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [filterTitre]: _, ...rest } = prev;
        updatedFilters = rest;
      } else {
        updatedFilters = {
          ...prev,
          [filterTitre]: updatedValues
        };
      }

      const hasActiveFilters = Object.values(updatedFilters).some(values => values.length > 0);
      
      if (!hasActiveFilters) {
        setArticlesFiltres(toutesLesRessources);
      } else {
        setArticlesFiltres(
          toutesLesRessources.filter(article => {
            // Pour chaque type de filtre actif, vérifier que l'article satisfait au moins une des options (OR au sein du filtre)
            return Object.entries(updatedFilters).every(([, selectedValues]) => {
              if (selectedValues.length === 0) return true;
              // Au moins une des valeurs sélectionnées dans ce type de filtre doit être présente
              return selectedValues.some(value => article.filtres?.includes(value));
            });
          })
        );
      }

      return updatedFilters;
    });
  };

  const handleSelectFormatRessource = (format: string) => {
    setSelectedFilters(prev => {
      const currentFormat = prev['Format de ressource']?.[0];
      let updatedFilters;
      
      if (currentFormat === format) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ['Format de ressource']: _, ...rest } = prev;
        updatedFilters = rest;
      } else {
        updatedFilters = {
          ...prev,
          'Format de ressource': [format]
        };
      }

      const hasActiveFilters = Object.values(updatedFilters).some(values => values.length > 0);
      
      if (!hasActiveFilters) {
        setArticlesFiltres(toutesLesRessources);
      } else {
        setArticlesFiltres(
          toutesLesRessources.filter(article => {
            return Object.entries(updatedFilters).every(([, selectedValues]) => {
              if (selectedValues.length === 0) return true;
              return selectedValues.some(value => article.filtres?.includes(value));
            });
          })
        );
      }

      return updatedFilters;
    });
  };

  return (
    <div className={styles.toutesRessourcesContainer}>
      <NewContainer size="xl" style={{ padding: "40px 0" }}>
        <H2 style={{ color: "#161616", fontSize: "22px" }}>
          Toutes les ressources
        </H2>
        <div className={styles.separator} />
        <FiltresRessources
          selectedFilters={selectedFilters}
          onSelectOptions={handleSelectOptions}
          onReset={handleReset}
          onRemoveFilter={handleRemoveFilter}
          onSelectFormatRessource={handleSelectFormatRessource}
        />
        <div className={styles.boutonFiltre}>
          <BoutonPrimaireClassic
            onClick={() => setIsModalOpen(true)}
            icone={FiltreIcon}
            size='lg'
            text={Object.values(selectedFilters).flat().length === 0 ? 'Filtrer' : `Filtrer (${Object.values(selectedFilters).flat().length})`}
            style={{ minWidth: "250px"}}
          />
        </div>
        <ModalFiltresRessources
          isOpen={isModalOpen}
          selectedFilters={selectedFilters}
          onSelectOptions={handleSelectOptions}
          onReset={handleReset}
          onClose={() => setIsModalOpen(false)}
          articles={ArticlesSorted}
          onRemoveFilter={handleRemoveFilter}
          onSelectFormatRessource={handleSelectFormatRessource}
        />
        <div className={styles.resultatsWrapper}>
          <p className={styles.resultats}>
            <b>{ArticlesSorted.length}</b> Résultat(s)
          </p>
          <div className={styles.listeDesArticlesWrapper}>
            {
              ArticlesSorted.length !== 0 ? ArticlesSorted.map((el, i) => {
                const collectionSlug = CollectionsData.find(c => c.titre === el.collections[0])?.slug;
                const isExternalLink = el.lien.startsWith('https://');
                const lien = isExternalLink
                  ? el.lien
                  : `/ressources/${collectionSlug}/${el.slug}`;
                return (
                  <TuileVerticale
                    key={i}
                    titre={el.titre!}
                    description={el.description}
                    tags={el.filtres?.filter(filtre => !territoireOptions.includes(filtre)).map((filtre, index) => (
                      <TagsIcone
                        key={index}
                        texte={filtre}
                        filtre={filtre as "Article" | "Retour d'expérience" | "M'inspirer" | "Me former" | "Agir"}
                        taille="small"
                      />
                    ))}
                    tempsLecture={el.tempsLecture}
                    lien={lien}
                    lienExterne={isExternalLink}
                    image={el.image!}
                  />
                );
              }) : <FiltresNonTrouves />
            }
          </div>
        </div>
      </NewContainer>
    </div>
  )
};
