// @ts-nocheck
'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import ZeroData from '@/assets/images/zero_data_found.png';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { travailExterieurPieChartLegend } from '@/components/maps/legends/datavizLegends';
import { travailExtDto } from '@/lib/dto';
import { simplePieChartCountTooltip } from '../ChartTooltips';
import NivoPieChart from '../NivoPieChart';

type Props = {
  graphData: Array<{
    id: string;
    label: string;
    value: number;
    count: number;
  }>;
  travailExterieurTerritoire: travailExtDto[];
};

export const PieChartTravailExt = ({ graphData, travailExterieurTerritoire }: Props) => {
  const sumAllCount = graphData.reduce((sum, item) => sum + (item.count || 0), 0);
  return (
    <div >
      {sumAllCount > 0 ?
        <NivoPieChart
          graphData={graphData}
          colors={(graphData) => travailExterieurPieChartLegend.find(legend => legend.value === graphData.label)?.color!}
          tooltip={({ datum }) => simplePieChartCountTooltip({ datum, arrondi: 0 })}
        />
        : (
          <div className='p-1 flex flex-row justify-center'>
            <DataNotFoundForGraph image={travailExterieurTerritoire.length === 0 ? DataNotFound : ZeroData} />
          </div>
        )
      }
    </div>
  );
};
