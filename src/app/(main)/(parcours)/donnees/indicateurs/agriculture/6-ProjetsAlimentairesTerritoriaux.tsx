'use client';

import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { TableCommuneModel } from '@/lib/postgres/models';
import { ProjetsAlimentairesTerritoriauxDynamicText } from '@/lib/textesIndicateurs/agricultureDynamicTexts';
import { projetsAlimentairesTerritoriauxTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { parsePostgresArray } from '@/lib/utils/reusableFunctions/parsePostgresArray';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';

export const ProjetsAlimentairesTerritoriaux = (props: {
  tableCommune: TableCommuneModel[];
}) => {
  const { tableCommune } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const territoireFiltered = type === "commune"
    ? tableCommune.filter(tc => tc.code_geographique === code)
    : type === "epci"
      ? tableCommune.filter(tc => tc.epci === code)
      : type === "pnr"
        ? tableCommune.filter(tc => tc.code_pnr?.includes(code))
        : type === "departement"
          ? tableCommune.filter(tc => tc.departement === code)
          : type === "ept"
            ? tableCommune.filter(tc => tc.ept === libelle)
            : type === "petr"
              ? tableCommune.filter(tc => tc.libelle_petr === libelle)
              : [];
  const patsParCommune = territoireFiltered.map(tc =>
    Array.isArray(tc.projets_alimentaires_territoriaux)
      ? tc.projets_alimentaires_territoriaux
      : parsePostgresArray(tc.projets_alimentaires_territoriaux)
  );
  const pats = [...new Set(patsParCommune.flat())].sort((a, b) => a.localeCompare(b));
  const exportData = IndicatorExportTransformations.agriculture.projetsAlimentairesTerritoriaux(territoireFiltered);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div
          className={styles.chiffreDynamiqueWrapper}
          style={{ alignItems: 'flex-start', paddingBottom: '2rem', gap: '3rem' }}
        >
          {territoireFiltered.length > 0 ? (
            <>
              <MicroNumberCircle
                valeur={pats.length}
                ariaLabel="Nombre de projets alimentaires territoriaux sur votre territoire"
              />
              <div className={styles.text}>
                <ProjetsAlimentairesTerritoriauxDynamicText
                  pats={pats}
                  toutesCommunesCouvertes={patsParCommune.every(p => p.length > 0)}
                  superposition={patsParCommune.some(p => p.length > 1)}
                  type={type}
                />
                <CustomTooltipNouveauParcours
                  title={projetsAlimentairesTerritoriauxTooltipText}
                  texte="Définition"
                />
              </div>
            </>
          ) : (
            <Body weight="bold" style={{ color: "var(--gris-dark)" }}>
              Il n’y a pas de données référencées sur le territoire que vous avez sélectionné
            </Body>
          )}
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size="sm" style={{ color: "var(--gris-dark)" }}>
          Source :
        </Body>
        <ExportButton
          data={exportData}
          baseName="projets_alimentaires_territoriaux"
          type={type}
          libelle={libelle}
          code={code}
          sheetName="Projets alimentaires"
          anchor="Projets-alimentaires-territoriaux"
        />
      </div>
    </>
  );
};
