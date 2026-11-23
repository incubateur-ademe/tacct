'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import ZeroData from '@/assets/images/zero_data_found.png';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { emploisSylviculturePieChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Body } from '@/design-system/base/Textes';
import couleurs from '@/design-system/couleurs';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { PieTooltipProps } from '@nivo/pie';
import styles from '../charts.module.scss';
import NivoPieChart from '../NivoPieChart';

export type PartSecteur = {
  id: string;
  label: string;
  value: number;
  count: number;
};

const couleurSecteur = (secteur: string | number) =>
  emploisSylviculturePieChartLegend.find((legende) => legende.value === secteur)
    ?.color ?? couleurs.gris.medium;

export const PieChartEmploisSylviculture = ({
  graphData,
  donneesReferencees
}: {
  graphData: PartSecteur[];
  donneesReferencees: boolean;
}) => {
  const total = graphData.reduce((somme, secteur) => somme + secteur.count, 0);
  const tooltip = ({ datum }: PieTooltipProps<Omit<PartSecteur, 'count'>>) => {
    const postes = graphData.find((secteur) => secteur.id === datum.id)?.count ?? 0;
    return (
      <div className={styles.tooltipEvolutionWrapper}>
        <div className={styles.itemWrapper}>
          <div className={styles.titre}>
            <div
              className={styles.colorSquare}
              style={{ background: datum.color }}
            />
            <Body size="sm">
              {datum.label} : <b>{Round(postes, 0)} {postes > 1 ? 'postes' : 'poste'}</b>{' '}
              ({datum.value > 0 && datum.value < 0.1 ? '< 0,1' : Round(datum.value, 1)} %)
            </Body>
          </div>
        </div>
      </div>
    );
  };

  return total > 0 ? (
    <div>
      <NivoPieChart
        graphData={graphData}
        colors={({ id }) => couleurSecteur(id)}
        tooltip={tooltip}
        unit="postes"
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <LegendCompColor legends={emploisSylviculturePieChartLegend} />
      </div>
    </div>
  ) : (
    <div className="p-1 flex flex-row justify-center">
      <DataNotFoundForGraph image={donneesReferencees ? ZeroData : DataNotFound} />
    </div>
  );
};
