'use client';
import {
  CatnatTypes,
  DataByCodeGeographique,
  GenericObject
} from '@/app/(main)/types';
import DataNotFound from '@/assets/images/zero_data_found.png';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { ArreteCatNat } from '@/lib/postgres/models';
import { CatNatText } from '@/lib/staticTexts';
import { catnatTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { CountOccByIndex } from '@/lib/utils/reusableFunctions/occurencesCount';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from 'next/navigation';
import { lazy, useEffect, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

const ArretesCatnatCharts = lazy(() => import('@/components/charts/gestionRisques/arretesCatnatCharts').then(m => ({ default: m.default })));

type ArreteCatNatEnriched = ArreteCatNat & {
  annee_arrete: number;
};

export const ArretesCatnat = (props: {
  gestionRisques: ArreteCatNat[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const { gestionRisques, coordonneesCommunes } = props;
  const [datavizTab, setDatavizTab] = useState<string>('Répartition');
  const [sliderValue, setSliderValue] = useState<number[]>([1982, 2025]);
  const [typeRisqueValue, setTypeRisqueValue] =
    useState<CatnatTypes>('Tous types');
  const [arretesCatnatPieChart, setArretesCatnatPieChart] = useState<
    ArreteCatNatEnriched[]
  >([]);
  const [arretesCatnatBarChart, setArretesCatnatBarChart] = useState<
    ArreteCatNatEnriched[]
  >([]);
  const typesRisques = gestionRisques
    ? [...new Set(gestionRisques.map((item) => item.lib_risque_jo))]
    : [''];

  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const dataByCodeGeographique = CountOccByIndex<GenericObject>(
    gestionRisques,
    'code_geographique',
    'lib_risque_jo'
  ).map((el) => {
    const sum = Sum(
      Object.values(el).filter((item) => typeof item === 'number') as number[]
    );
    return {
      ...(el as DataByCodeGeographique),
      sumCatnat: sum
    };
  });

  // Créer un Map pour récupérer libelle_geographique depuis gestionRisques
  const libelleByCode = new Map<string, string>();
  gestionRisques.forEach((item) => {
    if (!libelleByCode.has(item.code_geographique)) {
      libelleByCode.set(item.code_geographique, item.libelle_geographique);
    }
  });

  // Créer catnatData pour MapCatnat et LegendCatnat avec tuiles vectorielles
  const catnatData = dataByCodeGeographique.map((item) => ({
    code: item.indexName,
    name: libelleByCode.get(item.indexName) || '',
    catnat: item
  }));

  useEffect(() => {
    const catnatFilteredByType =
      typeRisqueValue === 'Tous types'
        ? gestionRisques
        : gestionRisques.filter(
          (item) => item.lib_risque_jo === typeRisqueValue
        );
    const gestionRisquesEnrichBarChart = catnatFilteredByType
      ?.map((item) => {
        return {
          ...item,
          annee_arrete: Number(item.dat_deb?.split('-')[0])
        };
      })
      .filter(
        (el) =>
          el.annee_arrete >= sliderValue[0] && el.annee_arrete <= sliderValue[1]
      );
    const gestionRisquesEnrichPieChart = gestionRisques
      ?.map((item) => {
        return {
          ...item,
          annee_arrete: Number(item.dat_deb?.split('-')[0])
        };
      })
      .filter(
        (el) =>
          el.annee_arrete >= sliderValue[0] && el.annee_arrete <= sliderValue[1]
      );
    setArretesCatnatPieChart(gestionRisquesEnrichPieChart);
    setArretesCatnatBarChart(gestionRisquesEnrichBarChart);
  }, [sliderValue, typeRisqueValue, datavizTab]);

  const exportData =
    IndicatorExportTransformations.gestionRisques.ArretesCatnat(gestionRisques);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroNumberCircle valeur={gestionRisques.length} arrondi={0} />
            <>
              {dataByCodeGeographique[0]?.sumCatnat === 0 ||
                gestionRisques.length === 0 ? (
                <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                  L’absence d’arrêté CatNat ne signifie pas que votre territoire
                  n’a jamais connu d’événements climatiques importants, ni subis
                  de dégâts significatifs.
                </Body>
              ) : (
                <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                  Depuis 1982, {gestionRisques.length} événement(s)
                  climatique(s) sont à l’origine d’une reconnaissance de l'état
                  de catastrophe naturelle sur votre territoire.
                </Body>
              )}
            </>
            <CustomTooltipNouveauParcours
              title={catnatTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
          <ReadMoreFade maxHeight={500}>
            <CatNatText />
          </ReadMoreFade>
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          {gestionRisques.length !== 0 ? (
            <ArretesCatnatCharts
              catnatData={catnatData}
              coordonneesCommunes={coordonneesCommunes}
              datavizTab={datavizTab}
              setDatavizTab={setDatavizTab}
              typeRisqueValue={typeRisqueValue}
              gestionRisquesBarChart={arretesCatnatBarChart}
              gestionRisquesPieChart={arretesCatnatPieChart}
              typesRisques={typesRisques}
              setTypeRisqueValue={setTypeRisqueValue}
              setSliderValue={setSliderValue}
              sliderValue={sliderValue}
            />
          ) : (
            <div className={styles.dataNotFoundForGraph}>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
          <SourceExport
            anchor="Arrêtés CatNat"
            source="Base nationale de Gestion ASsistée des Procédures
              Administratives relatives aux Risques (GASPAR). Dernière mise à jour :
              septembre 2025"
            condition={gestionRisques.length !== 0}
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="arretes_catnat"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Arrêtés CatNat"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
