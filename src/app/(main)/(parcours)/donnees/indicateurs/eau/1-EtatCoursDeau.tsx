"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { etatCoursDeauLegends } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { MapEtatCoursDeau } from '@/components/maps/mapEtatCoursDeau';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { Body } from "@/design-system/base/Textes";
import { EtatCoursDeauMapper } from '@/lib/mapper/etatCoursDeau';
import { EtatCoursDeau, ExportCoursDeau } from "@/lib/postgres/models";
import { EtatCoursEauRessourcesEauText } from '@/lib/staticTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from '../../explorerDonnees.module.scss';

type DataToExport = {
  code_geographique: string;
  libelle_geographique: string;
  code_epci: string;
  libelle_epci: string;
  ept: string | null;
  code_pnr: string | null;
  libelle_pnr: string | null;
  libelle_petr: string | null;
  code_departement: string;
  libelle_departement: string;
  region: number;
  nom_cours_d_eau: string;
  etat_cours_d_eau: string;
  longueur_m: number;
};

export const EtatEcoCoursDeau = (props: {
  etatCoursDeau: EtatCoursDeau[];
  communesCodes: string[];
  boundingBox?: [[number, number], [number, number]];
}) => {
  const { etatCoursDeau, communesCodes, boundingBox } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const etatCoursDeauMap = etatCoursDeau.map(EtatCoursDeauMapper);
  const [exportData, setExportData] = useState<DataToExport[]>([]);

  useEffect(() => {
    const fetchExportData = async () => {
      try {
        const response = await fetch(`/api/export/cours_d_eau?code=${code}&libelle=${libelle}&type=${type}`);
        if (response.ok) {
          const { coursDeau }: { coursDeau: ExportCoursDeau[] } = await response.json();
          if (coursDeau && coursDeau.length > 0) {
            const transformedData = IndicatorExportTransformations.ressourcesEau.EtatCoursEau(coursDeau)
            setExportData(transformedData);
          }
        }
      } catch (error) {
        console.error('Error fetching export data:', error);
      }
    };
    fetchExportData();
  }, [code, libelle, type]);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className='pr-5'>
          <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
            La carte ci-contre reflète l’état écologique des cours d’eau
            présents sur votre territoire. Le bon fonctionnement des milieux
            aquatiques est évalué à partir d’éléments physico-chimiques
            (composition de l’eau, polluants…) mais aussi de la présence de
            la faune et de la flore (poissons, invertébrés, plantes
            aquatiques), ainsi que des propriétés hydromorphologiques (état
            des berges, continuité de la rivière, etc.).
          </Body>
          <ReadMoreFade maxHeight={100}>
            <EtatCoursEauRessourcesEauText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {etatCoursDeau.length ? (
            <>
              <MapEtatCoursDeau
                etatCoursDeau={etatCoursDeauMap}
                communesCodes={communesCodes}
                boundingBox={boundingBox}
              />
              <div className={styles.legendCoursDeauWrapper}>
                <LegendCompColor legends={etatCoursDeauLegends} />
              </div>
            </>
          ) : <div className='p-10 flex flex-row justify-center'>
            <DataNotFoundForGraph image={DataNotFound} />
          </div>
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : Agences de l’eau, 2024 (consultée en février 2025)
        </Body>
        <ExportButtonNouveauParcours
          data={exportData}
          baseName="etat_cours_deau"
          type={type}
          libelle={libelle}
          code={code}
          sheetName="État des cours d'eau"
          disabled={exportData.length === 0}
          anchor="État des cours d'eau"
        >
          Exporter
        </ExportButtonNouveauParcours>
      </div>
    </>
  );
};
