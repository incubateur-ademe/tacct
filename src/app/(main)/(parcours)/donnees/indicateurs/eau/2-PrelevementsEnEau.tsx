'use client';

import WarningIcon from '@/assets/icons/exclamation_point_icon_black.png';
import { MicroCube } from '@/components/charts/MicroDataviz';
import EauCharts from '@/components/charts/ressourcesEau/EauCharts';
import { ExportButton } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { PrelevementsEauModel, PrelevementsEauParsed } from '@/lib/postgres/models';
import { PrelevementEauText } from '@/lib/staticTexts';
import { prelevementEauTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

const sousChampsNew = [
  { param: 'aep' as const, libelle: 'Eau potable' },
  { param: 'bar' as const, libelle: "Production d'électricité (barrages hydro-électriques)" },
  { param: 'can' as const, libelle: 'Alimentation des canaux' },
  { param: 'ene' as const, libelle: 'Énergie' },
  { param: 'ind' as const, libelle: 'Industries et autres usages économiques (hors irrigation, hors énergie)' },
  { param: 'irr' as const, libelle: 'Irrigation' },
];

export const PrelevementsEnEau = (props: {
  prelevementsEau: PrelevementsEauModel[];
}) => {
  const { prelevementsEau } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const departement =
    type === 'epci' ? prelevementsEau[0]?.libelle_departement : '';
  const [datavizTab, setDatavizTab] = useState<string>('Répartition');
  const [multipleDepartements, setMultipleDepartements] = useState<string[]>(
    []
  );
  const prelevementsParsed: PrelevementsEauParsed[] = prelevementsEau.flatMap((item) =>
    sousChampsNew.map(({ param, libelle }) => ({
      index: item.index,
      code_geographique: item.code_geographique,
      libelle_geographique: item.libelle_geographique,
      epci: item.epci,
      libelle_epci: item.libelle_epci,
      departement: item.departement,
      libelle_departement: item.libelle_departement,
      region: item.region,
      ept: item.ept,
      libelle_petr: item.libelle_petr,
      code_pnr: item.code_pnr,
      libelle_pnr: item.libelle_pnr,
      sous_champ: param,
      libelle_sous_champ: libelle,
      A2008: item[`annee_2008_${param}`],
      A2009: item[`annee_2009_${param}`],
      A2010: item[`annee_2010_${param}`],
      A2011: item[`annee_2011_${param}`],
      A2012: item[`annee_2012_${param}`],
      A2013: item[`annee_2013_${param}`],
      A2014: item[`annee_2014_${param}`],
      A2015: item[`annee_2015_${param}`],
      A2016: item[`annee_2016_${param}`],
      A2017: item[`annee_2017_${param}`],
      A2018: item[`annee_2018_${param}`],
      A2019: item[`annee_2019_${param}`],
      A2020: item[`annee_2020_${param}`],
      A2021: item[`annee_2021_${param}`],
      A2022: item[`annee_2022_${param}`],
      A2023: item[`annee_2023_${param}`]
    }))
  );

  const dataParMaille =
    type === 'epci'
      ? prelevementsParsed.filter((obj) => obj.epci === code)
      : type === 'commune'
        ? prelevementsParsed.filter((obj) => obj.code_geographique === code)
        : type === 'petr'
          ? prelevementsParsed.filter((obj) => obj.libelle_petr === libelle)
          : type === 'ept'
            ? prelevementsParsed.filter((obj) => obj.ept === libelle)
            : type === 'pnr'
              ? prelevementsParsed.filter((obj) => obj.code_pnr === code)
              : prelevementsParsed;

  useEffect(() => {
    if (type === 'epci' && code) {
      const departements = prelevementsEau.map((item) => item.departement);
      setMultipleDepartements([...new Set(departements)]);
    }
  }, [type, code, prelevementsEau]);

  const volumePreleveTerritoire =
    Sum(
      dataParMaille
        .filter((item) => item.sous_champ !== 'exo' && item.sous_champ !== null)
        .map((e) => e.A2023)
        .filter((value): value is number => value !== null)
    ) / 1000000;

  //sort ascending by code_geographique
  const exportData = IndicatorExportTransformations.ressourcesEau
    .PrelevementEau(dataParMaille)
    .toSorted((a, b) => a.code_geographique.localeCompare(b.code_geographique));

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            {volumePreleveTerritoire === null ||
              volumePreleveTerritoire === undefined ? null : (
              <MicroCube
                valeur={volumePreleveTerritoire}
                arrondi={2}
                unite="Mm³"
                ariaLabel="Volume d'eau prélevé sur votre territoire, en millions de mètres cubes"
              />
            )}
            {dataParMaille.length !== 0 ? (
              <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                Le volume total des prélèvements en eau de votre territoire en
                2023 est de <b>{Round(volumePreleveTerritoire, 2)} Mm3</b>, soit
                l’équivalent de{' '}
                <b>
                  {Round((1000000 * Number(volumePreleveTerritoire)) / 3750, 0)}
                </b>{' '}
                piscines olympiques.
              </Body>
            ) : (
              ''
            )}
            <CustomTooltipNouveauParcours
              title={prelevementEauTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
          <ReadMoreFade maxHeight={430}>
            <PrelevementEauText />
          </ReadMoreFade>
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          <EauCharts
            datavizTab={datavizTab}
            setDatavizTab={setDatavizTab}
            ressourcesEau={prelevementsParsed}
          />
          {multipleDepartements.length > 1 && datavizTab === 'Répartition' && (
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
                  L’EPCI sélectionné s’étend sur plusieurs départements. La
                  comparaison proposée est effectuée avec : {departement}
                </Body>
              </div>
            </div>
          )}
          <SourceExport
            anchor="Ressources-en-eau"
            source="BNPE, 2023 (consultée en mars 2026)"
            condition={
              Sum(
                exportData.map((o) =>
                  Sum(Object.values(o).slice(13, 26) as number[])
                )
              ) !== 0
            }
            exportComponent={
              <ExportButton
                data={exportData}
                baseName="prelevements_eau"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Prélèvements en eau"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
