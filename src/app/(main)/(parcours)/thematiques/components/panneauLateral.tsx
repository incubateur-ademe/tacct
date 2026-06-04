"use client";
import { saveThematique } from "@/components/searchbar/fonctions";
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { H2 } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { useRouter, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { thematiquesInfo } from "../constantes/textesThematiques";
import styles from "../roue.module.scss";

const PanneauLateral = ({
  setSelectedItem,
  selectedItem
}: {
  setSelectedItem: (item: string | null) => void;
  selectedItem: string | null;
}) => {
  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const libelle = searchParams.get('libelle');
  const typeTerritoire = searchParams.get('type');
  const thematique = thematiquesInfo[selectedItem || ''];
  const windowDimensions = useWindowDimensions();

  return (
    <>
      {
        windowDimensions.height && windowDimensions.width ?
          <div
            className={styles.panneauLateralWrapper}
            style={{
              // Mobile styles (< 1050px): position statique, pas d'animation
              ...(windowDimensions.width < 1050 ? {
                position: 'static',
                right: 'auto',
                top: 'auto',
                transform: 'none',
                width: '100%',
                maxWidth: '100%',
                margin: "0 2rem",
                opacity: selectedItem ? 1 : 0,
                border: selectedItem ? '1px solid var(--gris-medium)' : 'none',
                height: selectedItem ? "fit-content" : '0',
                display: selectedItem ? 'block' : 'none',
              } : {
                // Desktop styles (>= 1050px): animation avec sliding
                position: selectedItem ? 'absolute' : 'fixed',
                right: selectedItem ? 'max(0rem, calc((100vw - 1200px) / 2))' : '-400px',
                top: '515px',
                transform: 'translateY(-50%)',
                width: selectedItem ? '385px' : 'fit-content',
                opacity: selectedItem ? 1 : 0,
                border: selectedItem ? '1px solid var(--gris-medium)' : 'none',
                height: selectedItem ? "fit-content" : '0',
              })
            }}
          >
            {selectedItem && (
              <div style={{ height: "fit-content"}}>
                {/* En-tête du panneau */}
                <div className="relative">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className={styles.closeBtn}
                  >
                    ×
                  </button>
                  <H2
                    style={{
                      fontSize: '1.25rem',
                      lineHeight: '24px',
                      paddingBottom: '0.5rem',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid var(--gris-medium)',
                      width: '100%',
                    }}>
                    {thematique.title}
                  </H2>
                </div>
                {/* Liste des items liés */}
                {thematique ? (
                  <div className="space-y-2">
                    {thematique.description}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Aucune connexion directe identifiée pour cette thématique.
                  </p>
                )}
                <BoutonPrimaireClassic
                  text="J'explore cette thématique"
                  size="lg"
                  onClick={() => {
                    posthog.capture('clic_explore_thematique', {
                      thematique: selectedItem
                    })
                    saveThematique(thematique.link);
                    if (code) router.push(`/donnees?code=${code}&libelle=${libelle}&type=${typeTerritoire}&thematique=${thematique.link}`);
                    else router.push(`/donnees?libelle=${libelle}&type=${typeTerritoire}&thematique=${thematique.link}`);
                  }}
                />
              </div>
            )}
          </div>
          : null
      }
    </>
  )
}

export default PanneauLateral;
