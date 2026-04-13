'use client';
import SurfacesEnBioCharts from '@/components/charts/biodiversite/surfacesEnBioCharts';
import { MicroCircleGrid } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { AgricultureBio } from '@/lib/postgres/models';
import { SurfacesEnBioText } from '@/lib/staticTexts';
import { multipleEpciBydepartementLibelle } from '@/lib/territoireData/multipleEpciBydepartement';
import { multipleEpciByPnrLibelle } from '@/lib/territoireData/multipleEpciByPnr';
import { agricultureBioTooltipText } from '@/lib/tooltipTexts';
import { surfacesEnBioDoc } from '@/lib/utils/export/documentations';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { numberWithSpacesRegex } from '@/lib/utils/regex';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from '../../explorerDonnees.module.scss';

export const SurfacesEnBio = (props: { agricultureBio: AgricultureBio[] }) => {
  const { agricultureBio } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const [datavizTab, setDatavizTab] = useState<string>('Répartition');
  const territoiresPartiellementCouverts =
    type === 'departement'
      ? multipleEpciBydepartementLibelle.find(
        (dept) => dept.departement === code
      )?.liste_epci_multi_dept
      : type === 'pnr'
        ? multipleEpciByPnrLibelle.find((pnr) => pnr.libelle_pnr === libelle)
          ?.liste_epci_multi_pnr
        : undefined;

  const nombreExploitations = agricultureBio.reduce((acc, obj) => {
    if (obj.VARIABLE === 'saue') {
      return acc + obj.nombre_2023!;
    }
    return acc;
  }, 0);
  const surfaceAgriBio = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface totale') {
      return acc + obj.surface_2023!;
    }
    return acc;
  }, 0);
  const surfaceCertifiee = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface certifiée') {
      return acc + obj.surface_2023!;
    }
    return acc;
  }, 0);
  const surfaceEnConversion = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface en conversion') {
      return acc + obj.surface_2023!;
    }
    return acc;
  }, 0);
  const surfaceTotale = agricultureBio.reduce((acc, obj) => {
    if (obj.VARIABLE === 'saue') {
      return acc + obj.surface_2023!;
    }
    return acc;
  }, 0);
  const pourcentageTotal =
    ((surfaceCertifiee + surfaceEnConversion) / surfaceTotale) * 100;
  const exportData =
    IndicatorExportTransformations.biodiversite.agricultureBio(agricultureBio);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroCircleGrid
              pourcentage={pourcentageTotal}
              arrondi={1}
              ariaLabel="Surface certifiée bio ou en conversion"
            />
            {agricultureBio.length && pourcentageTotal ? (
              <>
                {type === 'commune' ? (
                  <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                    Cette donnée, disponible uniquement à l’échelle de votre
                    EPCI, indique que{' '}
                    {numberWithSpacesRegex(nombreExploitations)} exploitations y
                    sont en agriculture biologique ou en conversion,
                    représentant {Round(pourcentageTotal, 1)} % de la surface
                    agricole totale ({Round(surfaceAgriBio, 0)} hectares).
                  </Body>
                ) : (
                  <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                    Sur votre territoire,{' '}
                    {numberWithSpacesRegex(nombreExploitations)} exploitations
                    sont en agriculture biologique ou en conversion,
                    représentant {Round(pourcentageTotal, 1)} % de la surface
                    agricole totale, soit {Round(surfaceAgriBio, 0)} hectares.
                  </Body>
                )}
                {territoiresPartiellementCouverts &&
                  (type === 'departement' || type === 'pnr') && (
                    <>
                      <Body style={{ color: 'var(--gris-dark)' }}>
                        <br></br>Attention,{' '}
                        {territoiresPartiellementCouverts?.length} EPCI{' '}
                        {territoiresPartiellementCouverts?.length === 1
                          ? 'ne fait'
                          : 'ne font'}{' '}
                        que partiellement partie de votre territoire :
                      </Body>
                      <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                        {territoiresPartiellementCouverts?.map(
                          (epci, index) => (
                            <li key={index}>
                              <Body style={{ color: 'var(--gris-dark)' }}>
                                {epci}
                              </Body>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
              </>
            ) : (
              ''
            )}
            <CustomTooltipNouveauParcours
              title={agricultureBioTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
          <ReadMoreFade
            maxHeight={
              territoiresPartiellementCouverts?.length
                ? 400 / territoiresPartiellementCouverts?.length
                : 350
            }
          >
            <SurfacesEnBioText />
          </ReadMoreFade>
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          <SurfacesEnBioCharts
            agricultureBio={agricultureBio}
            datavizTab={datavizTab}
            setDatavizTab={setDatavizTab}
          />
          <div
            className={styles.sourcesExportWrapper}
            style={{
              borderTop: '1px solid var(--gris-medium)',
              borderRadius: '0 0 0 1rem'
            }}
          >
            <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
              Source : Donnée produite par l’AGRESTE, 2020 et extraite du catalogue DiDo (consultée en juillet 2025)
            </Body>
            {agricultureBio.length !== 0 && (
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="agriculture_biologique"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Agriculture bio"
                documentation={surfacesEnBioDoc}
                anchor="Surfaces en bio"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
