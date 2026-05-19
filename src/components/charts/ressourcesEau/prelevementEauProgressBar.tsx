'use client';

import eclair_icon_black from '@/assets/icons/themes/eclair_icon_black.svg';
import energie_icon_black from '@/assets/icons/themes/energie_icon_black.svg';
import robinet_icon_black from '@/assets/icons/themes/robinet_icon_black.svg';
import tracteur_icon_black from '@/assets/icons/themes/tracteur_icon_black.svg';
import usine_icon_black from '@/assets/icons/themes/usine_icon_black.svg';
import vagues_icon_black from '@/assets/icons/themes/vagues_icon_black.svg';
import PasDeDonneesImage from "@/assets/images/donnees_zero.png";
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
import { useState } from 'react';
import styles from './eau.module.scss';

const SumFiltered = (
  data: PrelevementsEauParsed[],
  code: string,
  libelle: string,
  type: string,
  sousChamp: string
) => {
  const columnCode = type === 'epci'
    ? 'epci'
    : type === 'commune'
      ? 'code_geographique'
      : type === "departement"
        ? "departement"
        : undefined

  const columnLibelle = type === "petr"
    ? "libelle_petr"
    : type === "pnr"
      ? "libelle_pnr"
      : "ept"

  return Sum(
    data
      .filter((obj) => columnCode ? obj[columnCode] === code : obj[columnLibelle] === libelle
      )
      .filter((item) => item.sous_champ === sousChamp)
      .map((e) => e.A2023)
      .filter((value): value is number => value !== null)
  );
};


const TotalSum = (
  data: PrelevementsEauParsed[],
  sousChamp: string,
  departement: string
) => {
  return Sum(
    data
      .filter((item) => item.departement === departement)
      .filter((item) => item.sous_champ === sousChamp)
      .map((e) => e.A2023)
      .filter((value): value is number => value !== null)
  );
}


const PrelevementEauProgressBars = ({
  ressourcesEau
}: {
  ressourcesEau: PrelevementsEauParsed[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const departement = ressourcesEau[0]?.departement;
  const libelleDepartement = ressourcesEau[0]?.libelle_departement;

  const [filterEnergie, setFilterEnergie] = useState(false);

  const data = [
    {
      titre: 'Irrigation',
      icon: <Image src={tracteur_icon_black} alt="" width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'irr', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'irr'),
      color: couleurs.graphiques.vert[2],
      isEnergie: false
    },
    {
      titre: 'Eau potable',
      icon: <Image src={robinet_icon_black} alt="" width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'aep', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'aep'),
      color: couleurs.graphiques.bleu[2],
      isEnergie: false
    },
    {
      titre: 'Industries et autres usages économiques (hors irrigation, hors énergie)',
      icon: <Image src={usine_icon_black} alt="" width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'ind', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'ind'),
      color: couleurs.graphiques.violet[2],
      isEnergie: false
    },
    {
      titre: 'Énergie',
      icon: <Image src={energie_icon_black} alt="" height={30} width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'ene', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'ene'),
      color: couleurs.graphiques.rose[2],
      isEnergie: true
    },
    {
      titre: 'Alimentation des canaux',
      icon: <Image src={vagues_icon_black} alt="" width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'can', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'can'),
      color: couleurs.graphiques.turquoise[2],
      isEnergie: false
    },
    {
      titre: "Production hydro-électriques",
      icon: <Image src={eclair_icon_black} alt="" width={24} />,
      sumDptmt: TotalSum(ressourcesEau, 'bar', departement),
      sumTerritoire: SumFiltered(ressourcesEau, code, libelle, type, 'bar'),
      color: couleurs.graphiques.orange[2],
      isEnergie: true
    }
  ];

  const filteredData = data.map((item) => ({
    ...item,
    sumTerritoire: filterEnergie && item.isEnergie ? 0 : item.sumTerritoire,
    sumDptmt: filterEnergie && item.isEnergie ? 0 : item.sumDptmt,
    filtered: filterEnergie && item.isEnergie
  }));

  const totalDptmt =
    filteredData.reduce((acc, item) => acc + item.sumDptmt, 0) === 0
      ? 1
      : filteredData.reduce((acc, item) => acc + item.sumDptmt, 0);
  const total =
    filteredData.reduce((acc, item) => acc + item.sumTerritoire, 0) === 0
      ? 1
      : filteredData.reduce((acc, item) => acc + item.sumTerritoire, 0);

  return (
    libelle && data.find((e) => e.sumTerritoire !== 0) ? (
      <div className={styles.ressourcesEauWrapper}>
        {filteredData
          .toSorted((a, b) => {
            const origA = data.find((d) => d.titre === a.titre)?.sumTerritoire ?? 0;
            const origB = data.find((d) => d.titre === b.titre)?.sumTerritoire ?? 0;
            return origB - origA;
          })
          .map((item, index) => (
            <ArrowHtmlTooltip
              title={
                <>
                  <div className='flex flex-row g-4 items-center mb-2'>
                    <div className={styles.colorSquare} style={{ backgroundColor: item.filtered ? '#aaa' : item.color }} />
                    <H4 style={{ fontSize: '1rem', marginBottom: "0" }}>{item.titre}</H4>
                  </div>
                  <Body size='sm'>
                    {libelle} :{' '}
                    <b>
                      {Round((100 * item.sumTerritoire) / total, 2)} %
                    </b>{' '}
                    ({Round(item.sumTerritoire / 1000000, 2)} Mm3)
                  </Body>
                  {
                    type !== 'departement' && (
                      <Body size='sm'>
                        Département ({libelleDepartement}) :{' '}
                        <b>{Round((100 * item.sumDptmt) / totalDptmt, 2)} %</b>{' '}
                        ({Round(item.sumDptmt / 1000000, 2)} Mm3)
                      </Body>
                    )
                  }
                </>
              }
              key={index}
              placement="top"
            >
              <div key={index} className={styles.progressDataWrapper} style={{ opacity: item.filtered ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
                <div className={styles.progressDesign}>
                  {item.icon}
                  <div className={styles.progressBar}>
                    <Body size='xs' style={{ textTransform: 'uppercase', lineHeight: "0.875rem" }}>{item.titre}</Body>
                    <div className={styles.barMarker}>
                      <Progress
                        percent={Number((100 * item.sumTerritoire) / total)}
                        showInfo={false}
                        strokeColor={item.filtered ? '#aaa' : item.color}
                        size={['100%', 12]}
                        style={{ width: '95%' }}
                        type="line"
                        trailColor="#F9F9FF"
                      />
                      {!item.filtered && (
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            transform: `translate(${(95 * item.sumDptmt) / totalDptmt}%, -1.25rem)`
                          }}
                        >
                          <div className={styles.marker}></div>
                        </div>
                      )}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem' }}>
          <input
            type="checkbox"
            id="filter-energie"
            checked={filterEnergie}
            onChange={(e) => setFilterEnergie(e.target.checked)}
            style={{ cursor: 'pointer', width: '1rem', height: '1rem', accentColor: 'var(--principales-vert)' }}
          />
          <label htmlFor="filter-energie" style={{ cursor: 'pointer' }}>
            <Body size='sm' style={{ color: "var(--gris-medium-dark)" }}>Filtrer les prélèvements en eau pour l&apos;énergie</Body>
          </label>
        </div>
      </div>
    ) : (
      <>
        <div
          className='flex flex-row justify-center'
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "2rem 4rem",
          }}
        >
          <DataNotFound image={PasDeDonneesImage} />
        </div>
        <p className="text-center mt-4" style={{
          color: '#3A3A3A',
          fontWeight: 700,
          fontSize: '1rem',
          padding: "0rem 4rem",
        }}>
          Aucun prélèvement en eau trouvé en 2023 pour le territoire sélectionné
        </p>
      </>
    )
  );
};

export default PrelevementEauProgressBars;
