'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import type { HauteurMoyenneCanopee } from '@/components/maps/mapCanopee';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { HauteurCanopeeText } from '@/lib/staticTexts';
import { HauteurCanopeeDynamicText } from '@/lib/textesIndicateurs/foretDynamicTexts';
import { HauteurCanopeeTooltipText } from '@/lib/tooltipTexts';
import { Skeleton } from 'antd';
import type * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useRef, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapCanopeeLazy = lazy(() => import('@/components/maps/mapCanopee').then(m => ({ default: m.MapCanopee })));

// Sources de la ligne source :
// « LSCE, 2024 » : FORMS-T, hauteur de canopée 2024 (Height_2024.tif), produite par le Laboratoire des sciences du climat et de l’environnement
//   - catalogue Theia : https://browser.stac.teledetection.fr/collections/forms-t — « Providers » : « Laboratoire des Sciences du Climat et de l'Environnement », rôle « producer » (JSON : https://api.stac.teledetection.fr/collections/forms-t)
//   - Zenodo : https://zenodo.org/records/15489231 — auteur « Schwartz, Martin », Laboratoire des Sciences du Climat et de l'Environnement
//   - article : Schwartz et al. 2025, https://doi.org/10.1016/j.rse.2025.114959 (HAL : https://hal.inrae.fr/hal-05528811), p. 1 — « LSCE/IPSL, CEA-CNRS-UVSQ, Université Paris Saclay »
// « IGN, 2021-2023 » : Masque Forêt v1, https://www.data.gouv.fr/datasets/masque-foret — « départements BD ORTHO® acquis entre 2021 et 2023 »
const SOURCE = 'Source : LSCE, 2024 ; IGN, 2021-2023 (consultée en novembre 2026)';

export const HauteurCanopee = ({
  coordonneesCommunes,
  contoursCommunes,
  contourTerritoire
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
  contourTerritoire: { geometry: string } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [hauteurMoyenne, setHauteurMoyenne] = useState<HauteurMoyenneCanopee | undefined>(undefined);

  const carteDisponible = Boolean(coordonneesCommunes && coordonneesCommunes.codes.length);
  const isOutreMer = coordonneesCommunes
    ? coordonneesCommunes.bbox.maxLat < 41 || coordonneesCommunes.bbox.maxLng < -6
    : false;
  const resultat: HauteurMoyenneCanopee | undefined =
    carteDisponible && contourTerritoire && !isOutreMer ? hauteurMoyenne : 'indisponible';
  const enCalcul = resultat === undefined;

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div
          className={styles.chiffreDynamiqueWrapper}
          style={{ alignItems: 'center' }}
        >
          {enCalcul ? (
            <div style={{ marginBottom: '0.875rem' }}>
              <Skeleton.Avatar active shape="circle" size={110} />
            </div>
          ) : typeof resultat === 'number' && (
            <MicroNumberCircle
              valeur={Math.round(resultat)}
              arrondi={0}
              unite="m"
              ariaLabel="Hauteur moyenne de la canopée dans les forêts de votre territoire"
            />
          )}
          <div className={styles.text} style={enCalcul ? { flex: 1 } : undefined}>
            {enCalcul ? (
              <div role="status" aria-label="Calcul de la hauteur moyenne de la canopée en cours" style={{ width: '100%' }}>
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </div>
            ) : (
              <HauteurCanopeeDynamicText
                hauteurMoyenne={resultat}
                isOutreMer={isOutreMer}
                type={type}
              />
            )}
            <CustomTooltipNouveauParcours
              title={HauteurCanopeeTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className='pr-5 pt-8'>
          <ReadMoreFade maxHeight={150}>
            <HauteurCanopeeText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && coordonneesCommunes.codes.length ? (
            <Suspense fallback={<Loader />}>
              <MapCanopeeLazy
                coordonneesCommunes={coordonneesCommunes}
                contoursCommunes={contoursCommunes}
                contourTerritoire={contourTerritoire}
                mapRef={mapRef}
                mapContainer={mapContainer}
                onHauteurMoyenne={setHauteurMoyenne}
              />
            </Suspense>
          ) : (
            <div className="p-10 flex flex-row justify-center">
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
          {SOURCE}
        </Body>
        <ExportPngMaplibreButton
          mapRef={mapRef}
          mapContainer={mapContainer}
          documentDiv=".canopeeLegendWrapper"
          fileName={`Hauteur_canopee_${type}_${libelle}`}
          anchor="Hauteur-de-la-canopée"
          type={type}
          libelle={libelle}
          code={code}
          thematique="hauteur_canopee"
        />
      </div>
    </>
  );
};
