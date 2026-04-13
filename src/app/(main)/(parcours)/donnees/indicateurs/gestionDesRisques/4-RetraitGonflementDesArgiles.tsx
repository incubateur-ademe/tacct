"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import RetraitGonflementDesArgilesCharts from '@/components/charts/gestionRisques/RetraitGonflementDesArgilesCharts';
import { MicroCircleGrid } from '@/components/charts/MicroDataviz';
import { generateMapPngBlob } from '@/components/exports/ExportPng';
import { ZipExportButtonNouveauParcours } from '@/components/exports/ZipExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { CustomTooltipNouveauParcours } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { RGAdb } from "@/lib/postgres/models";
import { RGAText } from "@/lib/staticTexts";
import { rgaTooltipText } from "@/lib/tooltipTexts";
import { IndicatorExportTransformations } from "@/lib/utils/export/environmentalDataExport";
import { exportAsZip } from '@/lib/utils/export/exportZipGeneric';
import { numberWithSpacesRegex } from '@/lib/utils/regex';
import { Average } from '@/lib/utils/reusableFunctions/average';
import { Round } from "@/lib/utils/reusableFunctions/round";
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import styles from '../../explorerDonnees.module.scss';

export const RetraitGonflementDesArgiles = ({
  coordonneesCommunes,
  rga
}: {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  rga: RGAdb[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const exportMapRef = useRef<maplibregl.Map | null>(null);
  const exportMapContainer = useRef<HTMLDivElement>(null);
  const [datavizTab, setDatavizTab] = useState<string>((type === "commune" || type === "epci") ? 'Comparaison' : "Répartition");
  const rgaFilteredByTerritory = type === "commune" ?
    rga.filter(item => item.code_geographique === code) :
    type === "epci" ?
      rga.filter(item => item.epci === code) :
      rga;

  const partMoyenFort = rgaFilteredByTerritory.length > 0
    ? Average(rgaFilteredByTerritory.map((el) => el.part_alea_moyen_fort_commune))
    : 0;
  const nbLogementsMoyenFort = rgaFilteredByTerritory.length > 0
    ? Sum(rgaFilteredByTerritory.map((el) => el.nb_logement_alea_moyen_fort))
    : 0;
  const partMoyenFortApres1975 = rgaFilteredByTerritory.length > 0
    ? Round(
      100 * Sum(
        rgaFilteredByTerritory.map(
          (el) => el.nb_logement_alea_moyen_fort_apres_1975
        )
      ) / Sum(
        rgaFilteredByTerritory.map(
          (el) => el.nb_logement_alea_moyen_fort
        )
      ), 1)
    : 0;

  const exportData = IndicatorExportTransformations.gestionRisques.RGA(rgaFilteredByTerritory);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            {
              rgaFilteredByTerritory.length > 0 && (
                <MicroCircleGrid pourcentage={partMoyenFort} arrondi={1} ariaLabel="Part des logements avec une exposition moyenne ou forte" />
              )
            }
            {
              rgaFilteredByTerritory.length > 0 ? (
                <>
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    {Round(partMoyenFort, 1)} % de votre territoire est situé dans une zone où le niveau
                    d’exposition au retrait gonflement des argiles est moyen ou fort. Cela
                    concerne potentiellement {numberWithSpacesRegex(nbLogementsMoyenFort)} logement(s), parmi
                    lesquels <b>{nbLogementsMoyenFort === 0 ? 0 : partMoyenFortApres1975} %</b> sont considérés comme plus à
                    risque car construits après 1975.
                  </Body>
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    ⚠️ Ces chiffres reposent sur l'ancien zonage RGA. La cartographie actualisée du BRGM
                    (début 2026) reflète une aggravation généralisée du phénomène.
                  </Body>
                </>
              ) : ""
            }
            <CustomTooltipNouveauParcours title={rgaTooltipText} texte="D’où vient ce chiffre ?" />
          </div>
          {/* <ReadMoreFade maxHeight={470}> */}
          <RGAText />
          {/* </ReadMoreFade> */}
        </div>
        <div className={styles.datavizWrapper} style={{ borderRadius: "1rem 0 0 1rem", height: "fit-content" }}>
          {
            rga.length ?
              <RetraitGonflementDesArgilesCharts
                coordonneesCommunes={coordonneesCommunes}
                rga={rga}
                datavizTab={datavizTab}
                setDatavizTab={setDatavizTab}
                mapRef={mapRef}
                mapContainer={mapContainer}
                exportMapRef={exportMapRef}
                exportMapContainer={exportMapContainer}
              /> : (
                <div className={styles.dataNotFoundForGraph}>
                  <DataNotFoundForGraph image={DataNotFound} />
                </div>
              )
          }
          <div
            className={styles.sourcesExportWrapper}
            style={{
              borderTop: "1px solid var(--gris-medium)",
              borderRadius: "0 0 0 1rem"
            }}>
            <Body size='sm' style={{ color: "var(--gris-dark)" }}>
              Source des graphiques : BRGM, 2019 ; Fideli, 2017. Traitements : SDES, 2021. (consultée en juin 2025)<br></br>
              Source de la carte : BRGM, 2026 (consultée en mars 2026)
            </Body>
            <ZipExportButtonNouveauParcours
              anchor='Retrait-gonflement des argiles'
              handleExport={async () => {
                const pngBlob = await generateMapPngBlob({
                  mapRef: exportMapRef,
                  mapContainer: exportMapContainer,
                  documentDiv: ".exportPNGWrapper",
                });
                if (!pngBlob) {
                  alert("Erreur lors de la génération de l'image PNG.");
                  return;
                }
                await exportAsZip({
                  excelFiles: [{
                    data: exportData,
                    baseName: "rga",
                    sheetName: "Retrait-gonflement des argiles",
                    type,
                    libelle
                  }],
                  blobFiles: [{
                    blob: pngBlob,
                    filename: `Carte_RGA_${type}_${libelle}.png`
                  }],
                  zipFilename: `rga_export_${new Date().toISOString().split('T')[0]}.zip`
                })
              }}
              code={code}
              libelle={libelle}
              type={type}
              thematique="rga"
            >
              Exporter
            </ZipExportButtonNouveauParcours>
          </div>
        </div>
      </div>
    </>
  );
};
