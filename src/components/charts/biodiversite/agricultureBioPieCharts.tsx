import surfaceCertifeeIcon from '@/assets/icons/agriculture_bio_surface_certifiee_icon.svg';
import surfaceEnConversionIcon from '@/assets/icons/agriculture_bio_surface_conversion_icon.svg';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { ArrowHtmlTooltip } from '@/components/utils/Tooltips';
import { Body, H4 } from '@/design-system/base/Textes';
import couleurs from '@/design-system/couleurs';
import { AgricultureBio } from '@/lib/postgres/models';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Progress } from 'antd';
import Image from 'next/image';
import styles from './biodiversiteCharts.module.scss';

type ProgressTypes = {
  strokeLinecap: 'butt';
  type: 'circle';
  size: number;
  strokeWidth: number;
  showInfo: boolean;
};

const ProgressProps: ProgressTypes = {
  strokeLinecap: 'butt',
  type: 'circle',
  size: 100,
  strokeWidth: 12,
  showInfo: false
};

export const AgricultureBioPieCharts = ({
  agricultureBio
}: {
  agricultureBio: AgricultureBio[];
}) => {
  const surfaceCertifiee = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface certifiée') {
      return acc + obj.surface_2024!;
    }
    return acc;
  }, 0);
  const surfaceCertifiee2008 = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface certifiée') {
      return acc + obj.surface_2008!;
    }
    return acc;
  }, 0);
  const surfaceEnConversion = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface en conversion') {
      return acc + obj.surface_2024!;
    }
    return acc;
  }, 0);
  const surfaceEnConversion2008 = agricultureBio.reduce((acc, obj) => {
    if (obj.LIBELLE_SOUS_CHAMP === 'Surface en conversion') {
      return acc + obj.surface_2008!;
    }
    return acc;
  }, 0);
  const surfaceTotale = agricultureBio.reduce((acc, obj) => {
    if (obj.VARIABLE === 'saue') {
      return acc + obj.surface_2024!;
    }
    return acc;
  }, 0);
  const nombreExploitations = agricultureBio.reduce((acc, obj) => {
    if (obj.VARIABLE === 'saue') {
      return acc + obj.nombre_2024!;
    }
    return acc;
  }, 0);

  const partCertifiee = (surfaceCertifiee / surfaceTotale) * 100;
  const partEnConversion = (surfaceEnConversion / surfaceTotale) * 100;
  const evolutionCertifiee =
    surfaceCertifiee2008 === 0
      ? 0
      : ((surfaceCertifiee - surfaceCertifiee2008) / surfaceCertifiee2008) *
      100;
  const evolutionConversion =
    surfaceEnConversion2008 === 0
      ? 0
      : ((surfaceEnConversion - surfaceEnConversion2008) /
        surfaceEnConversion2008) *
      100;
  const partCertifieeRounded =
    100 - partEnConversion < partCertifiee
      ? 100 - partEnConversion
      : partCertifiee;

  return (
    <>
      {partCertifiee && partEnConversion ? (
        <div className="flex flex-row justify-center gap-20 p-12 bg-white">
          <div className={styles.dataWrapper}>
            <Image src={surfaceCertifeeIcon} alt="" />
            <Body size="sm" style={{ marginBottom: '24px' }}>
              Surface <b>déjà certifiée</b>
            </Body>
            <ArrowHtmlTooltip
              title={
                <>
                  <H4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    Surface déjà certifiée (2024)
                  </H4>
                  <Body size="sm">
                    <b>{Round(surfaceCertifiee, 0)}</b> ha
                  </Body>
                  {evolutionCertifiee >= 0 ? (
                    <Body size="sm">
                      <b>+{Round(evolutionCertifiee, 1)} %</b> depuis 2008
                    </Body>
                  ) : (
                    <Body size="sm">
                      <b>{Round(evolutionCertifiee, 1)} %</b> depuis 2008
                    </Body>
                  )}
                  <Body size="sm">
                    <b>{nombreExploitations}</b> exploitation(s)
                  </Body>
                </>
              }
              placement="top"
            >
              <div className={styles.progressWrapper}>
                <Progress
                  {...ProgressProps}
                  aria-label="Circle progress bar"
                  percent={partCertifieeRounded}
                  strokeColor={couleurs.graphiques.bleu[3]}
                  trailColor="#00949D10"
                />
                <div className={styles.progressText}>
                  <Body style={{ color: couleurs.graphiques.bleu[3] }}>
                    <span>{Round(partCertifieeRounded, 1)}</span> %
                  </Body>
                </div>
              </div>
            </ArrowHtmlTooltip>
          </div>
          <div className={styles.dataWrapper}>
            <Image src={surfaceEnConversionIcon} alt="" />
            <Body size="sm" style={{ marginBottom: '24px' }}>
              Surface <b>en conversion</b>
            </Body>
            <ArrowHtmlTooltip
              title={
                <>
                  <H4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    Surface en conversion (2024)
                  </H4>
                  <Body size="sm">
                    <b>{Round(surfaceEnConversion, 0)}</b> ha
                  </Body>
                  {evolutionConversion >= 0 ? (
                    <Body size="sm">
                      <b>+{Round(evolutionConversion, 1)} %</b> depuis 2008
                    </Body>
                  ) : (
                    <Body size="sm">
                      <b>{Round(evolutionConversion, 1)} %</b> depuis 2008
                    </Body>
                  )}
                  <Body size="sm">
                    <b>{nombreExploitations}</b> exploitation(s)
                  </Body>
                </>
              }
              placement="top"
            >
              <div className={styles.progressWrapper}>
                <Progress
                  {...ProgressProps}
                  style={{
                    transform: `rotate(${partCertifieeRounded * 3.6}deg)`
                  }}
                  aria-label="Circle progress bar"
                  percent={partEnConversion}
                  strokeColor={couleurs.graphiques.bleu[1]}
                  trailColor="#00C2CC10"
                />
                <div className={styles.progressText}>
                  <Body style={{ color: couleurs.graphiques.bleu[1] }}>
                    <span>{Round(partEnConversion, 1)}</span> %
                  </Body>
                </div>
              </div>
            </ArrowHtmlTooltip>
          </div>
        </div>
      ) : (
        <div className={styles.dataWrapper} style={{ padding: '1rem' }}>
          <DataNotFoundForGraph image={DataNotFound} />
        </div>
      )}
    </>
  );
};
