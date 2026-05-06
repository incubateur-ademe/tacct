'use client';
import eclair_icon_black from '@/assets/icons/themes/eclair_icon_black.svg';
import energie_icon_black from '@/assets/icons/themes/energie_icon_black.svg';
import robinet_icon_black from '@/assets/icons/themes/robinet_icon_black.svg';
import tracteur_icon_black from '@/assets/icons/themes/tracteur_icon_black.svg';
import usine_icon_black from '@/assets/icons/themes/usine_icon_black.svg';
import vagues_icon_black from '@/assets/icons/themes/vagues_icon_black.svg';
import GraphNotFound from '@/assets/images/data_not_found_prelevement.png';
import DataNotFound from '@/components/graphDataNotFound';
import { ArrowHtmlTooltip } from '@/components/utils/Tooltips';
import { Body, H4 } from '@/design-system/base/Textes';
import couleurs from '@/design-system/couleurs';
import { PrelevementsEauParsed } from '@/lib/postgres/models';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { Progress } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './eau.module.scss';

const SumFiltered = (
  data: PrelevementsEauParsed[],
  code: string,
  libelle: string,
  type: string,
  champ: string
) => {
  const columnCode = type === 'epci'
    ? 'epci'
    : type === 'commune'
      ? 'code_geographique'
      : type === "departement"
        ? "departement"
        : type === "pnr"
          ? "code_pnr"
          : undefined

  const columnLibelle = type === "petr"
    ? "libelle_petr"
      : "ept"

  return Sum(
    data
      .filter((obj) => columnCode ? obj[columnCode] === code : obj[columnLibelle] === libelle
      )
      .filter((item) => item.sous_champ === champ)
      .map((e) => e.A2023)
      .filter((value): value is number => value !== null)
  );
};

const SumFilteredTousChamps = (
  data: PrelevementsEauParsed[],
  code: string,
  libelle: string,
  type: string
) => {
  const columnCode = type === 'epci'
    ? 'epci'
    : type === 'commune'
      ? 'code_geographique'
      : type === 'departement'
        ? 'departement'
        : type === "pnr"
          ? "code_pnr"
          : undefined

  const columnLibelle = type === 'petr'
    ? 'libelle_petr'
    : 'ept'

  return Sum(
    data
      .filter((obj) => columnCode ? obj[columnCode] === code : obj[columnLibelle] === libelle)
      .filter((item) => item.sous_champ !== 'exo' && item.sous_champ !== null)
      .map((e) => e.A2023)
      .filter((value): value is number => value !== null)
  );
};

const PrelevementEauProgressBarsPNR = ({
  ressourcesEau
}: {
  ressourcesEau: PrelevementsEauParsed[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;

  const data = [
    {
      titre: 'Irrigation',
      icon: <Image src={tracteur_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'irr'),
      color: couleurs.graphiques.vert[2]
    },
    {
      titre: 'Eau potable',
      icon: <Image src={robinet_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'aep'),
      color: couleurs.graphiques.bleu[2]
    },
    {
      titre: 'Industries et autres usages économiques (hors irrigation, hors énergie)',
      icon: <Image src={usine_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'ind'),
      color: couleurs.graphiques.violet[2]
    },
    {
      titre: 'Énergie',
      icon: <Image src={energie_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'ene'),
      color: couleurs.graphiques.rose[2]
    },
    {
      titre: 'Alimentation des canaux',
      icon: <Image src={vagues_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'can'),
      color: couleurs.graphiques.turquoise[2]
    },
    {
      titre: "Production d'électricité (barrages hydro-électriques)",
      icon: <Image src={eclair_icon_black} alt="" width={24} />,
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'bar'),
      color: couleurs.graphiques.orange[2]
    }
  ];

  const total =
    SumFilteredTousChamps(ressourcesEau, code, libelle, type) === 0
      ? 1
      : SumFilteredTousChamps(ressourcesEau, code, libelle, type);


  return (
    <div className={styles.ressourcesEauWrapper}>
      {code && libelle && data.find((e) => e.sumTerritoire !== 0) ? (
        <>
          {data
            .toSorted((a, b) => b.sumTerritoire - a.sumTerritoire)
            .map((item, index) => (
              <ArrowHtmlTooltip
                title={
                  <>
                    <div className='flex flex-row g-4 items-center mb-2'>
                      <div className={styles.colorSquare} style={{ backgroundColor: item.color }} />
                      <H4 style={{ fontSize: '1rem', marginBottom: "0" }}>{item.titre}</H4>
                    </div>
                    <Body size='sm'>
                      {libelle} :{' '}
                      <b>
                        {Round((100 * item.sumTerritoire) / total, 2)} %
                      </b>{' '}
                      ({Round(item.sumTerritoire / 1000000, 2)} Mm3)
                    </Body>
                  </>
                }
                key={index}
                placement="top"
              >
                <div key={index} className={styles.progressDataWrapper}>
                  <div className={styles.progressDesign}>
                    {item.icon}
                    <div className={styles.progressBar}>
                      <Body size='xs' style={{ textTransform: 'uppercase', lineHeight: "0.875rem" }}>{item.titre}</Body>
                      <div className={styles.barMarker}>
                        <Progress
                          percent={Number((100 * item.sumTerritoire) / total)}
                          showInfo={false}
                          strokeColor={item.color}
                          size={['100%', 12]}
                          style={{ width: '95%' }}
                          type="line"
                          trailColor="#F9F9FF"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.progressNumbers}>
                    <Body size='xs' weight='bold' style={{ lineHeight: "0.875rem" }}>
                      {Round((100 * item.sumTerritoire) / total, 2)} %
                    </Body>
                    <Body size='xs' style={{ lineHeight: "0.875rem" }}>
                      {Round(item.sumTerritoire / 1000000, 2)} Mm3
                    </Body>
                  </div>
                </div>
              </ArrowHtmlTooltip>
            ))}
        </>
      ) : (
        <div className='p-1 flex flex-row justify-center'>
          <DataNotFound image={GraphNotFound} />
        </div>
      )}
    </div>
  );
};

export default PrelevementEauProgressBarsPNR;
