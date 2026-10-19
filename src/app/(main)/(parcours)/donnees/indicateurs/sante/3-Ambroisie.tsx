'use client';

import { ExportButton } from '@/components/exports/ExportButton';
import { ambroisieMapLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { MapJson } from '@/components/maps/mapFrance';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import departementsNoms from '@/lib/data/departements.json';
import presenceAmbroisie from '@/lib/data/presence_ambroisie.json';
import { AmbroisieText } from '@/lib/staticTexts';
import { AmbroisieDynamicText } from '@/lib/textesIndicateurs/santeDynamicTexts';
import { ambroisieTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

// La donnée garde les 4 classes de la source, la carte les ramène à 3.
const classesCarte: Record<string, { couleur: string; libelle: string }> = {
  '1-10': { couleur: ambroisieMapLegend[0].color, libelle: '1 à 10 communes' },
  '11-50': { couleur: ambroisieMapLegend[1].color, libelle: '11 à 50 communes' },
  '51-100': { couleur: ambroisieMapLegend[2].color, libelle: '51 communes ou plus' },
  '100+': { couleur: ambroisieMapLegend[2].color, libelle: '51 communes ou plus' }
};

const classesParDepartement = Object.fromEntries(
  Object.entries(presenceAmbroisie as Record<string, string>).map(([code, classe]) => [code, classesCarte[classe]])
);

export const Ambroisie = ({
  coordonneesCommunes
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const exportData = IndicatorExportTransformations.sante.Ambroisie(presenceAmbroisie);
  const codesCommunes = coordonneesCommunes?.codes ?? [];
  const estOutreMer = (codeCommune: string) => codeCommune.startsWith('97') || codeCommune.startsWith('98');
  const isOutreMer = codesCommunes.length > 0 && codesCommunes.every(estOutreMer);
  const departements = [...new Set(codesCommunes.filter((c) => !estOutreMer(c)).map((c) => c.slice(0, 2)))]
    .filter((dep) => dep in presenceAmbroisie)
    .map((dep) => ({
      code: dep,
      nom: (departementsNoms as Record<string, string>)[dep],
      classe: (presenceAmbroisie as Record<string, string>)[dep]
    }));

  return (
    <>
      <div className={styles.datavizDoubleMapContainer}>
        <div className={styles.chiffresWrapper} style={{ borderTop: 'none' }}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <AmbroisieDynamicText departements={departements} isOutreMer={isOutreMer} type={type} />
          </div>
          <CustomTooltipNouveauParcours
            title={ambroisieTooltipText}
            texte="D'où vient ce chiffre ?"
          />
          <a
            className="fr-sr-only"
            href="https://ambroisie-risque.info/ou-se-trouve-lambroisie-en-france/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter la carte de l’Observatoire des ambroisies (nouvelle fenêtre)
          </a>
          <ReadMoreFade maxHeight={100}>
            <AmbroisieText />
          </ReadMoreFade>
        </div>
        <div className={styles.graphiquesWrapper}>
          <div className={styles.carteUnique}>
            <Body size='sm' style={{ textAlign: "center" }}>
              Nombre de communes où l’ambroisie à feuilles d’armoise a été signalée, par département (2005-2025)
            </Body>
            <MapJson
              ariaLabel="Carte de France représentant le nombre de communes où l’ambroisie à feuilles d’armoise a été signalée, par département"
              mapRef={mapRef}
              mapContainer={mapContainer}
              classesParDepartement={classesParDepartement}
            />
            <div
              className={styles.legend}
              style={{ width: 'auto', justifyContent: 'center' }}
            >
              <LegendCompColor legends={ambroisieMapLegend} style={{ gap: "0.5rem 1rem" }} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.datavizWrapper} style={{ borderRadius: "1rem 0 0 1rem", height: "fit-content" }}>
        <div
          className={styles.sourcesExportWrapper}
          style={{
            borderTop: "1px solid var(--gris-medium)",
            borderRadius: "0 0 0 1rem"
          }}
        >
          <Body size='sm' style={{ color: "var(--gris-dark)" }}>
            Source : Observatoire des ambroisies – FREDON France, 2026 (consultée en octobre 2026)
          </Body>
          <ExportButton
            data={exportData}
            baseName="ambroisie"
            type={type}
            libelle={libelle}
            code={code}
            sheetName="Ambroisie"
            anchor="Ambroisie-à-feuilles-d’armoise"
          />
        </div>
      </div>
    </>
  );
};
