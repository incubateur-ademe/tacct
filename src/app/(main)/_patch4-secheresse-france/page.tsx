import regions from '@/lib/data/regions.json';
import { NewContainer } from '@/design-system/layout';
import { prisma } from '@/lib/queries/db';
import { Metadata } from 'next';
import { MapSecheresseFrance } from './MapSecheresseFrance';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Patch 4°C - Sécheresse des sols - France entière' },
  robots: { index: false, follow: false }
};

const BBOX_METROPOLE: [[number, number], [number, number]] = [[-5.2, 41.3], [9.6, 51.1]];

const getColorByAggravation = (value: number | null) => {
  if (value === null) return '#FFF';
  if (value === 0) return '#FFF';
  if (value < 0.33) return '#FFEBB6';
  if (value <= 0.66) return '#FFB181';
  return '#FF1C64';
};

const Patch4SecheresseFrance = async (props: { searchParams: Promise<{ region?: string }> }) => {
  const { region: regionParam } = await props.searchParams;
  const region = regions.find((r) => r.code === regionParam) ?? null;

  const rows = await prisma.databases_v2_patch4c.findMany({
    select: { code_geographique: true, secheresse_sols: true }
  });
  // La table contient aussi des lignes EPCI / EPT : on ne garde que les codes communes (5 caractères)
  const valueByCommune = new Map<string, number>();
  rows.forEach((row) => {
    if (row.code_geographique.length === 5) {
      valueByCommune.set(row.code_geographique, row.secheresse_sols);
    }
  });
  const codesByColorMap = new Map<string, string[]>();
  valueByCommune.forEach((value, code) => {
    const color = getColorByAggravation(value);
    const codes = codesByColorMap.get(color) ?? [];
    codes.push(code);
    codesByColorMap.set(color, codes);
  });
  const codesByColor = [...codesByColorMap].map(([color, codes]) => ({ color, codes }));

  let bounds = BBOX_METROPOLE;
  if (region) {
    const extent = await prisma.$queryRaw<Array<{ minlng: number; minlat: number; maxlng: number; maxlat: number }>>`
      SELECT
        ST_XMin(ST_Extent(geometry)) AS minlng,
        ST_YMin(ST_Extent(geometry)) AS minlat,
        ST_XMax(ST_Extent(geometry)) AS maxlng,
        ST_YMax(ST_Extent(geometry)) AS maxlat
      FROM postgis_v2."communes_drom"
      WHERE region = ${Number(region.code)}::int
    `;
    if (extent[0]?.minlng != null) {
      bounds = [[extent[0].minlng, extent[0].minlat], [extent[0].maxlng, extent[0].maxlat]];
    }
  }

  return (
    <NewContainer size="xl" style={{ padding: '40px 1rem' }}>
      <MapSecheresseFrance
        codesByColor={codesByColor}
        bounds={bounds}
        region={region}
      />
    </NewContainer>
  );
};

export default Patch4SecheresseFrance;
