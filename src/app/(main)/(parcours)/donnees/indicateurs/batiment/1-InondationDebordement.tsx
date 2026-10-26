'use client';

import WarningIcon from '@/assets/icons/exclamation_point_icon_black.png';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import {
  InondationDebordementBarChart,
  PartsExposees
} from '@/components/charts/batiment/inondationDebordementBarChart';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { InondationsDebordementTerritoire } from '@/lib/postgres/models';
import { InondationDebordementText } from '@/lib/staticTexts';
import { inondationDebordementTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

// Parts publiées dans la fiche indicateur ONRN du SDES (décembre 2024)
const references: Record<string, PartsExposees> = {
  metropole: { libelle: 'France métropolitaine', surface: 15.2, population: 26.5, logements: 28.1 },
  '971': { libelle: 'Guadeloupe', surface: 16.0, population: 14.2, logements: 15.7 },
  '972': { libelle: 'Martinique', surface: 9.7, population: 6.3, logements: 7.4 },
  '973': { libelle: 'Guyane', surface: 5.8, population: 16.6, logements: 15.6 },
  '974': { libelle: 'La Réunion', surface: 18.1, population: 25.9, logements: 25.6 },
  '976': { libelle: 'Mayotte', surface: 17.4, population: 32.7, logements: 36.2 }
};

export const InondationDebordement = ({
  inondationsDebordement
}: {
  inondationsDebordement: InondationsDebordementTerritoire | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const donneesEpciAffiche =
    inondationsDebordement?.donnees.filter(
      (el) => el.epci === inondationsDebordement.epciAffiche
    ) ?? [];
  const valeur = (indicateur: string) =>
    donneesEpciAffiche.find((el) => el.indicateur_exposition === indicateur)
      ?.valeur_exposition ?? null;
  const partSurface = valeur('Part_surface_exposee');
  const partPopulation = valeur('Part_pop_exposee');
  const partLogements = valeur('Part_logements_exposes');
  const libelleEpciAffiche = donneesEpciAffiche[0]?.libelle_epci;
  const reference =
    references[inondationsDebordement?.departementEpciAffiche ?? ''] ??
    references.metropole;
  const exportData = IndicatorExportTransformations.batiment.InondationDebordement(
    inondationsDebordement?.donnees ?? []
  );

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
              TEXTE DYNAMIQUE
            </Body>
            <CustomTooltipNouveauParcours
              title={inondationDebordementTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
          <InondationDebordementText />
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          {partSurface !== null && partPopulation !== null && partLogements !== null ? (
            <InondationDebordementBarChart
              territoire={{
                libelle: 'EPCI',
                surface: partSurface,
                population: partPopulation,
                logements: partLogements
              }}
              reference={reference}
            />
          ) : (
            <div className={styles.dataNotFoundForGraph}>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
          {type !== 'epci' && libelleEpciAffiche && (
            <div className={styles.warningBox}>
              <div className="flex flex-row items-center justify-center">
                <Image
                  src={WarningIcon}
                  alt="Attention"
                  width={24}
                  height={24}
                  style={{ marginRight: '0.5em', alignItems: 'center' }}
                />
                <Body style={{ fontSize: 12 }}>
                  {inondationsDebordement && inondationsDebordement.nombreEpci > 1
                    ? 'Votre territoire s’étend sur plusieurs EPCI.'
                    : 'Cette donnée n’est disponible qu’à l’échelle de l’EPCI.'}{' '}
                  Les données présentées sont celles de : {libelleEpciAffiche}
                </Body>
              </div>
            </div>
          )}
          <SourceExport
            anchor="Inondation-par-débordement-des-cours-d’eau"
            source="EAIP, 2011 ; Fideli, 2021. Traitements : SDES, 2024 (consultée en octobre 2026)"
            condition={exportData.length > 0}
            exportComponent={
              <ExportButton
                data={exportData}
                baseName="inondation_debordement"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Inondation par débordement"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
