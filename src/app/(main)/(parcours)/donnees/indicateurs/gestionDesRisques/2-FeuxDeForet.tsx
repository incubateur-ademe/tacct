'use client';
import GraphNotFound from '@/assets/images/zero_data_found.png';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { IncendiesForet } from '@/lib/postgres/models';
import { FeuxForetText } from '@/lib/staticTexts';
import { feuxForetTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Round } from '@/lib/utils/reusableFunctions/round';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { lazy, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

const FeuxForetCharts = lazy(() => import('@/components/charts/gestionRisques/feuxForetCharts').then(m => ({ default: m.default })));

export const FeuxDeForet = (props: { incendiesForet: IncendiesForet[] }) => {
  const { incendiesForet } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const [datavizTab, setDatavizTab] = useState<string>('Répartition');
  // surface en km²
  const surfaceTotale = incendiesForet
    .map((el) => el.surface_parcourue)
    .reduce((a, b) => a + b, 0);
  const departement = incendiesForet[0]?.departement;
  const exportData =
    IndicatorExportTransformations.gestionRisques.FeuxForet(incendiesForet);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroNumberCircle valeur={incendiesForet.length} arrondi={0} />
            {incendiesForet ? (
              <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                Depuis 2006, votre territoire a connu {incendiesForet.length}{' '}
                départ(s) de feux pour une surface totale parcourue de{' '}
                {Round(100 * surfaceTotale, 2)} ha.
              </Body>
            ) : null}
            {departement === '64' ? (
              <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                Dans votre département, les données 2010 ont été perdues suite à
                un incident technique et aucune donnée n’est disponible pour
                2011.
              </Body>
            ) : (
              ''
            )}
            <CustomTooltipNouveauParcours
              title={feuxForetTooltipText}
              texte="Définition"
            />
          </div>
          <ReadMoreFade maxHeight={500}>
            <FeuxForetText />
          </ReadMoreFade>
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          {incendiesForet.length !== 0 ? (
            <FeuxForetCharts
              datavizTab={datavizTab}
              setDatavizTab={setDatavizTab}
              incendiesForet={incendiesForet}
            />
          ) : (
            <div className={styles.dataNotFoundForMap}>
              <Image
                src={GraphNotFound}
                alt=""
                width={0}
                height={0}
                style={{ width: '90%', height: 'auto' }}
              />
            </div>
          )}
          <SourceExport
            anchor="Feux de forêt"
            source="Base de Données sur les Incendies de Forêts en France, 2024 (consultée en mars 2025)"
            condition={incendiesForet.length !== 0}
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="feux_foret"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Feux de forêt"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
