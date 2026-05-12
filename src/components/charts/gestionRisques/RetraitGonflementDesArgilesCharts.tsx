"use client";

import WarningIcon from "@/assets/icons/exclamation_point_icon_black.png";
import { RgaEvolutionTooltip, RgaRepartitionTooltip } from "@/components/charts/ChartTooltips";
import { NivoBarChart } from '@/components/charts/NivoBarChart';
import { RgaEvolutionLegend, RgaMapLegend, RgaRepartitionLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from "@/components/maps/legends/legendComp";
import { MapRGAExport } from "@/components/maps/mapRGAExport";
import { MapTiles } from "@/components/maps/mapTiles";
import SubTabs from '@/components/ui/SubTabs';
import { Body } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { RGAdb } from '@/lib/postgres/models';
import { Average } from '@/lib/utils/reusableFunctions/average';
import { BarDatum } from '@nivo/bar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { RefObject, useEffect, useLayoutEffect, useState } from "react";
import styles from './gestionRisquesCharts.module.scss';

type Props = {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  rga: RGAdb[];
  datavizTab: string;
  setDatavizTab: (value: string) => void;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  exportMapRef: RefObject<maplibregl.Map | null>;
  exportMapContainer: RefObject<HTMLDivElement | null>;
};

const isRGAdb = (obj: unknown): obj is RGAdb => {
  return !!obj && typeof obj === "object" && !Array.isArray(obj)
    && typeof (obj as RGAdb).part_alea_moyen_fort_commune === "number"
    && typeof (obj as RGAdb).part_alea_faible_commune === "number";
}
const isRGAdbArray = (obj: unknown): obj is RGAdb[] => {
  return Array.isArray(obj) && obj.every(
    el => !!el && typeof el === "object"
      && typeof (el as RGAdb).part_alea_moyen_fort_commune === "number"
      && typeof (el as RGAdb).part_alea_faible_commune === "number"
  );
}
const barChartRepartition = (rgaFilteredByTerritory: RGAdb[]) => {
  const avant1975 = {
    nb_logement_alea_faible:
      rgaFilteredByTerritory.reduce(
        (sum, item) =>
          sum +
          Number(item.nb_logement_alea_faible_avant_1920) +
          Number(item.nb_logement_alea_faible_1920_1945) +
          Number(item.nb_logement_alea_faible_1945_1975),
        0
      ),
    nb_logement_alea_moyen_fort:
      rgaFilteredByTerritory.reduce(
        (sum, item) =>
          sum +
          Number(item.nb_logement_alea_moyen_fort_avant_1920) +
          Number(item.nb_logement_alea_moyen_fort_1920_1945) +
          Number(item.nb_logement_alea_moyen_fort_1945_1975),
        0
      ),
    annee: "Avant 1975"
  };
  const apres1975 = {
    nb_logement_alea_faible: rgaFilteredByTerritory.reduce(
      (sum, item) => sum + Number(item.nb_logement_alea_faible_apres_1975),
      0
    ),
    nb_logement_alea_moyen_fort: rgaFilteredByTerritory.reduce(
      (sum, item) => sum + Number(item.nb_logement_alea_moyen_fort_apres_1975),
      0
    ),
    annee: "Après 1975"
  };
  return [avant1975, apres1975];
}

const barChartComparaison = (rga: RGAdb[], code: string, type: string) => {
  if (!rga || rga.length === 0) {
    return [
      { territoire: 0, territoireSup: 0, alea: "Zone a priori non argileuse" },
      { territoire: 0, territoireSup: 0, alea: "Exposition faible" },
      { territoire: 0, territoireSup: 0, alea: "Exposition moyenne / forte" }
    ];
  }

  const territoireAlea = type === "commune" ?
    rga.find(item => item.code_geographique === code) :
    type === "epci" ?
      rga.filter(item => item.epci === code) :
      undefined;

  const sansAlea = {
    territoire: type === "commune" && isRGAdb(territoireAlea) ?
      (100 -
        (territoireAlea?.part_alea_moyen_fort_commune) -
        (territoireAlea?.part_alea_faible_commune)
      ) : type === "epci" && isRGAdbArray(territoireAlea) ? (
        100 -
        Average(territoireAlea?.map(el => el.part_alea_moyen_fort_commune)) -
        Average(territoireAlea?.map(el => el.part_alea_faible_commune))
      ) : NaN,
    territoireSup: 100 -
      Average(rga.map(el => el.part_alea_moyen_fort_commune)) -
      Average(rga.map(el => el.part_alea_faible_commune)),
    alea: "Zone a priori non argileuse"
  };
  const aleaFaible = {
    territoire: type === "commune" && isRGAdb(territoireAlea) ?
      territoireAlea?.part_alea_faible_commune :
      type === "epci" && isRGAdbArray(territoireAlea) ? (
        Average(territoireAlea.map(el => el.part_alea_faible_commune))
      ) : NaN,
    territoireSup: Average(rga.map(el => el.part_alea_faible_commune)),
    alea: "Exposition faible",
  };
  const aleaMoyenFort = {
    territoire: type === "commune" && isRGAdb(territoireAlea) ?
      territoireAlea?.part_alea_moyen_fort_commune :
      type === "epci" && isRGAdbArray(territoireAlea) ? (
        Average(territoireAlea.map(el => el.part_alea_moyen_fort_commune))
      ) : NaN,
    territoireSup: Average(rga.map(el => el.part_alea_moyen_fort_commune)),
    alea: "Exposition moyenne / forte",
  };
  return [sansAlea, aleaFaible, aleaMoyenFort];
}

const RetraitGonflementDesArgilesCharts = (props: Props) => {
  const {
    coordonneesCommunes,
    rga,
    datavizTab,
    setDatavizTab,
    mapRef,
    mapContainer,
    exportMapRef,
    exportMapContainer
  } = props;
  const searchParams = useSearchParams();
  const type = searchParams.get('type')!;
  const code = searchParams.get('code')!;
  const window = useWindowDimensions();
  const [multipleDepartements, setMultipleDepartements] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // options de filtre pour les départements (plusieurs départements possibles pour un EPCI)
  const departement = type === "epci" ? rga[0]?.libelle_departement : "";
  const rgaTerritoireSup = type === "epci" ? rga.filter(item => item.libelle_departement === departement) : rga
  const rgaFilteredByTerritory = type === "commune" ?
    rga.filter(item => item.code_geographique === code) :
    type === "epci" ?
      rga.filter(item => item.epci === code) :
      rga;

  const evolutionRga = barChartRepartition(rgaFilteredByTerritory);
  const repartitionRga = barChartComparaison(rgaTerritoireSup, code, type);

  useEffect(() => {
    if (type === "epci" && code) {
      const departements = rga.map(item => item.departement);
      const uniqueDepartements = Array.from(new Set(departements));
      setMultipleDepartements(uniqueDepartements);
    }
  }, [type, code, rga]);

  useLayoutEffect(() => {
    if (datavizTab === 'Cartographie') return;
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [datavizTab]);

  return (
    <div className={styles.dataWrapper}>
      <style>{`
        .rga-charts-wrapper .nivo-bar-chart-container .bottom-tick {
          opacity: ${isTransitioning ? '0' : '1'};
        }
      `}</style>
      <div className={styles.graphTabsWrapper}>
        <SubTabs
          data={
            (type === "commune" || type === "epci") ?
              ['Comparaison', 'Répartition', 'Cartographie'] :
              ['Répartition', 'Cartographie']
          }
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {datavizTab === 'Comparaison' ? (
        <>
          <div className={`rga-charts-wrapper ${styles.barChartContainer}`}>
            <NivoBarChart
              colors={RgaRepartitionLegend.map(e => e.couleur)}
              graphData={repartitionRga as BarDatum[]}
              keys={RgaRepartitionLegend.map(e => e.variable)}
              indexBy="alea"
              showLegend={false}
              axisLeftLegend="Part du territoire (%)"
              groupMode="grouped"
              tooltip={(data) => RgaRepartitionTooltip({ data, type })}
              bottomTickValues={repartitionRga.map(el => el.alea)}
              tickRotation={window.width! < 600 ? -60 : undefined}
              graphMarginBottom={window.width! < 600 ? 170 : undefined}
              isMobile={window.width! < 600}
            />
            <div style={{ position: "relative", top: "-40px" }}>
              <LegendCompColor
                legends={RgaRepartitionLegend
                  .map((legend, index) => ({
                    id: index,
                    value: legend.variable === "territoire" && type === "commune" ?
                      "Commune" :
                      legend.variable === "territoire" && type === "epci" ?
                        "EPCI" :
                        legend.variable === "territoireSup" && type === "commune" ?
                          "EPCI" :
                          legend.variable === "territoireSup" && type === "epci" ?
                            "Département" : "",
                    color: legend.couleur,
                  }))} />
            </div>
          </div>
          {
            multipleDepartements.length > 1 &&
            <div className={styles.warningBox}>
              <div className='flex flex-row items-center justify-center'>
                <Image
                  src={WarningIcon}
                  alt="Attention"
                  width={24}
                  height={24}
                  style={{ marginRight: '0.5em', alignItems: 'center' }}
                />
                <Body style={{ fontSize: 12 }}>
                  L’EPCI sélectionné s’étend sur
                  plusieurs départements. La comparaison proposée est
                  effectuée avec : {departement}
                </Body>
              </div>
            </div>
          }
        </>
      ) : datavizTab === 'Répartition' ? (
        <>
          <div className={`rga-charts-wrapper ${styles.barChartContainer}`}>
            <NivoBarChart
              colors={RgaEvolutionLegend.map(e => e.couleur)}
              graphData={evolutionRga}
              keys={RgaEvolutionLegend.map(e => e.variable)}
              indexBy="annee"
              showLegend={false}
              axisLeftLegend="Nombre de logements"
              tooltip={RgaEvolutionTooltip}
              tickRotation={window.width! < 600 ? -60 : undefined}
              graphMarginBottom={window.width! < 600 ? 160 : undefined}
              isMobile={window.width! < 600}
            />
            <div style={{ position: "relative", top: "-70px" }}>
              <LegendCompColor
                legends={RgaEvolutionLegend
                  .map((legend, index) => ({
                    id: index,
                    value: legend.texteRaccourci,
                    color: legend.couleur,
                  }))} />
            </div>
          </div>
        </>
      ) : datavizTab === 'Cartographie' ? (
        <MapTiles
          ariaLabel="Cartographie des zones d'exposition au retrait-gonflement des argiles (aléa faible, moyen ou fort) par commune sur votre territoire"
          coordonneesCommunes={coordonneesCommunes}
          mapRef={mapRef}
          mapContainer={mapContainer}
          bucketUrl="rga"
          layer="rga"
          paint={{
            'fill-color': [
              'match',
              ['get', 'alea'],
              'Moyen', '#F66E19',
              'Faible', '#FFCF5E',
              'Fort', '#E8323B',
              'white'
            ],
            'fill-opacity': 0.45
          }}
          legend={<LegendCompColor legends={RgaMapLegend} />}
        />
      ) : (
        ''
      )}
      {/* Génère une map cachée pour l'export */}
      <MapRGAExport
        coordonneesCommunes={coordonneesCommunes}
        exportMapRef={exportMapRef}
        exportMapContainer={exportMapContainer}
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: '500px',
          height: '500px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default RetraitGonflementDesArgilesCharts;
