'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { foretsCommunalesLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { ForetsCommunalesModel } from '@/lib/postgres/models';
import { ForetsCommunalesText } from '@/lib/staticTexts';
import { ForetsCommunalesDynamicText } from '@/lib/textesIndicateurs/sylvicultureDynamicTexts';
import { foretsCommunalesTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapForetsCommunales = lazy(() =>
  import('@/components/maps/mapForetsCommunales').then((m) => ({
    default: m.MapForetsCommunales
  }))
);

const SOURCE = 'Source : DGFiP, 2025 (consultée en novembre 2026)';

export const ForetsCommunales = ({
  foretsCommunales,
  coordonneesCommunes
}: {
  foretsCommunales: ForetsCommunalesModel[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;

  const territoire =
    type === 'commune'
      ? foretsCommunales.filter((c) => c.code_geographique === code)
      : foretsCommunales;
  const renseignees = territoire.filter((c) => c.surface_foret_possedee_ha !== null);
  const surfaceExterieure = (c: ForetsCommunalesModel) =>
    c.surface_foret_possedee_ha === null || c.surface_foret_possedee_sur_territoire_ha === null
      ? null
      : Math.max(0, c.surface_foret_possedee_ha - c.surface_foret_possedee_sur_territoire_ha);
  const surface = renseignees.length
    ? renseignees.reduce((acc, c) => acc + (c.surface_foret_possedee_ha ?? 0), 0)
    : null;
  const surfaceExterieur = renseignees.reduce((acc, c) => acc + (surfaceExterieure(c) ?? 0), 0);

  const donneesCarte = foretsCommunales.map((c) => ({
    code: c.code_geographique,
    name: c.libelle_geographique,
    surface: c.surface_foret_possedee_ha,
    surfaceExterieur: surfaceExterieure(c)
  }));
  const exportData = IndicatorExportTransformations.sylviculture.ForetsCommunales(territoire);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {surface !== null && (
            <MicroNumberCircle
              valeur={surface < 0.01 ? 0 : surface < 1 ? 1 : surface}
              comparateur={surface >= 0.01 && surface < 1 ? '<' : ''}
              arrondi={0}
              unite="ha"
              ariaLabel={
                type === 'commune'
                  ? 'Surface de forêt possédée par votre commune'
                  : 'Surface de forêt possédée par les communes de votre territoire'
              }
            />
          )}
          <div className={styles.text}>
            <ForetsCommunalesDynamicText
              surface={surface}
              surfaceExterieur={surfaceExterieur}
              type={type}
            />
            <CustomTooltipNouveauParcours
              title={foretsCommunalesTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className="mt-4 pr-5">
          <ReadMoreFade maxHeight={100}>
            <ForetsCommunalesText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && foretsCommunales.length > 0 ? (
            <Suspense fallback={<Loader />}>
              <MapForetsCommunales
                communesCodes={coordonneesCommunes.codes}
                foretsCommunales={donneesCarte}
                boundingBox={[
                  [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
                  [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
                ]}
              />
              <div
                className={styles.legend}
                style={{ width: 'auto', justifyContent: 'center' }}
              >
                <LegendCompColor legends={foretsCommunalesLegend} />
              </div>
            </Suspense>
          ) : (
            <div className={styles.dataNotFoundForMap}>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      {exportData.length > 0 ? (
        <div className={styles.sourcesExportMapWrapper}>
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            {SOURCE}
          </Body>
          <ExportButton
            data={exportData}
            baseName="forets_communales"
            type={type}
            libelle={libelle}
            code={code}
            sheetName="Forêts communales"
            anchor="Forêts-communales"
          />
        </div>
      ) : (
        <div
          className={styles.sourcesExportWrapper}
          style={{
            marginLeft: '-2rem',
            borderTop: '1px solid var(--gris-medium)',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0
          }}
        >
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            {SOURCE}
          </Body>
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            Export indisponible : données non référencées ou nulles.
          </Body>
        </div>
      )}
    </>
  );
};
