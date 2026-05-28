'use client';

import WarningIcon from '@/assets/icons/exclamation_point_icon_black.png';
import { MicroCube } from '@/components/charts/MicroDataviz';
import EauCharts from '@/components/charts/ressourcesEau/EauCharts';
import { ExportButton } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { PrelevementsEau, PrelevementsEauParsed } from '@/lib/postgres/models';
import { PrelevementEauText } from '@/lib/staticTexts';
import { prelevementEauTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { Any } from '@/lib/utils/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

const parsePostgresArray = (str: string | null): string[] => {
  if (!str) return [];
  // Retirer les accolades et parser en gérant les guillemets
  const content = str.replace(/^\{|\}$/g, '');
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) result.push(current);

  return result;
};

const colonnesATranformer = [
  'A2020',
  'A2019',
  'A2018',
  'A2017',
  'A2016',
  'A2015',
  'A2014',
  'A2013',
  'A2012',
  'A2011',
  'A2010',
  'A2009',
  'A2008',
  'libelle_sous_champ',
  'sous_champ'
];

const SumFiltered = (
  data: PrelevementsEauParsed[],
  code: string,
  libelle: string,
  type: string,
  champ: string
) => {
  const columnCode =
    type === 'epci'
      ? 'epci'
      : type === 'commune'
        ? 'code_geographique'
        : type === 'departement'
          ? 'departement'
          : undefined;

  const columnLibelle =
    type === 'petr' ? 'libelle_petr' : type === 'pnr' ? 'libelle_pnr' : 'ept';
  return Sum(
    data
      .filter((obj) =>
        columnCode ? obj[columnCode] === code : obj[columnLibelle] === libelle
      )
      .filter((item) => item.libelle_sous_champ?.includes(champ))
      .map((e) => e.A2020)
      .filter((value): value is number => value !== null)
  );
};

export const PrelevementsEnEau = (props: {
  prelevementsEau: PrelevementsEau[];
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
  const prelevementsParsed = prelevementsEau.flatMap((item) => {
    const sousChampArray = parsePostgresArray(item.sous_champ);
    const libelleArray = parsePostgresArray(item.libelle_sous_champ);
    // Récupérer toutes les colonnes d'années
    const anneeArrays = colonnesATranformer
      .filter((col) => col.startsWith('A'))
      .reduce(
        (acc, col) => {
          acc[col] = parsePostgresArray((item as Any)[col]);
          return acc;
        },
        {} as Record<string, string[]>
      );

    return sousChampArray.map((sousChamp, index) => ({
      ...item,
      sous_champ: sousChamp,
      libelle_sous_champ: libelleArray[index] || null,
      ...Object.entries(anneeArrays).reduce(
        (acc, [col, values]) => {
          acc[col] = values[index] ? parseFloat(values[index]) : null;
          return acc;
        },
        {} as Record<string, number | null>
      )
    }));
  }) as unknown as PrelevementsEauParsed[];

  const volumePreleveTerritoire =
    SumFiltered(
      prelevementsParsed as unknown as PrelevementsEauParsed[],
      code,
      libelle,
      type,
      'total'
    ) / 1000000;

  useEffect(() => {
    if (type === 'epci' && code) {
      const departements = prelevementsEau.map((item) => item.departement);
      const uniqueDepartements = Array.from(new Set(departements));
      setMultipleDepartements(uniqueDepartements);
    }
  }, [type, code, prelevementsEau]);

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
              ? prelevementsParsed.filter((obj) => obj.libelle_pnr === libelle)
              : prelevementsParsed;

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
                2020 est de <b>{Round(volumePreleveTerritoire, 2)} Mm3</b>, soit
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
            <div
              style={{
                minWidth: '450px',
                backgroundColor: 'white',
                padding: '1em'
              }}
            >
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
            anchor="Ressources en eau"
            source="BNPE, Catalogue DiDo (Indicateurs territoriaux de développement durable - ITDD), 2020"
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
