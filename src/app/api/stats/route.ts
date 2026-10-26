import { readFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { prisma as PrismaPostgres } from '../../../lib/queries/db';
export const dynamic = 'force-dynamic';

interface Stat {
  value: number;
  date: Date;
}

interface StatOutput {
  description: string;
  stats: Stat[];
}

const PERIODICITIES = ['day', 'week', 'month', 'year'] as const;
type Periodicity = (typeof PERIODICITIES)[number];

const isPeriodicity = (value: string): value is Periodicity =>
  (PERIODICITIES as readonly string[]).includes(value);

// La requête North Star prend ~30 s alors que son résultat ne change qu'au
// passage de l'ETL ou au changement de jour : on ne la rejoue que dans ces cas.
let cache: { key: string; stats: Promise<Stat[]> } | null = null;

const getCacheKey = async (): Promise<string> => {
  const [row] = await PrismaPostgres.$queryRaw<
    { max_ts: string | null; today: string }[]
  >`
    SELECT MAX(event_timestamp)::text AS max_ts,
           (now() AT TIME ZONE 'Europe/Paris')::date::text AS today
    FROM analytics.all_pageview_raw
  `;
  return `${row.max_ts}|${row.today}`;
};

const fetchDailyStats = async (): Promise<Stat[]> => {
  const sql = readFileSync(
    join(process.cwd(), 'src/app/api/stats/north_star.sql'),
    'utf8'
  );
  const results = (await PrismaPostgres.$queryRawUnsafe(sql)) as Array<{
    day: Date;
    north_star: bigint;
  }>;
  return results.map((row) => ({
    value: Number(row.north_star),
    date: new Date(
      Date.UTC(row.day.getFullYear(), row.day.getMonth(), row.day.getDate())
    )
  }));
};

const getDailyStats = async (): Promise<Stat[]> => {
  const key = await getCacheKey();
  if (cache?.key === key) {
    return cache.stats;
  }
  const stats = fetchDailyStats();
  cache = { key, stats };
  stats.catch(() => {
    if (cache?.stats === stats) {
      cache = null;
    }
  });
  return stats;
};

export const GET = async (request: NextRequest) => {
  const since = request.nextUrl.searchParams.get('since');
  const sinceNum = since === null ? null : Number(since);
  if (sinceNum !== null && !(Number.isInteger(sinceNum) && sinceNum > 0)) {
    return NextResponse.json(
      { error: '`since` doit être un entier strictement positif' },
      { status: 400 }
    );
  }
  const periodicity =
    request.nextUrl.searchParams.get('periodicity') ?? 'month';
  if (!isPeriodicity(periodicity)) {
    return NextResponse.json(
      { error: `\`periodicity\` doit valoir : ${PERIODICITIES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const rawData = await getDailyStats();

    // Agrégation des données selon la périodicité
    const aggregatedData: Stat[] = [];
    const aggregated = new Map<string, { date: Date; value: number }>();
    for (const stat of rawData) {
      let key: string;
      let periodDate: Date;
      const year = stat.date.getUTCFullYear();
      const month = stat.date.getUTCMonth();
      const day = stat.date.getUTCDate();
      const dayOfWeek = stat.date.getUTCDay();
      switch (periodicity) {
        case 'day':
          key = `${year}-${month}-${day}`;
          periodDate = new Date(Date.UTC(year, month, day));
          break;
        case 'week':
          const monday = new Date(stat.date);
          monday.setUTCDate(day - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
          monday.setUTCHours(0, 0, 0, 0);
          key = monday.getTime().toString();
          periodDate = monday;
          break;
        case 'month':
          key = `${year}-${month}`;
          periodDate = new Date(Date.UTC(year, month, 1));
          break;
        case 'year':
          key = `${year}`;
          periodDate = new Date(Date.UTC(year, 0, 1));
          break;
      }
      if (!aggregated.has(key)) {
        aggregated.set(key, { date: periodDate, value: 0 });
      }
      aggregated.get(key)!.value += stat.value;
    }
    const allAggregated = Array.from(aggregated.values()).toSorted(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    if (sinceNum === null) {
      aggregatedData.push(...allAggregated);
    } else {
      aggregatedData.push(...allAggregated.slice(-sinceNum));
    }

    const data: StatOutput = {
      description: `Territoires recherchés 3 fois minimum pour au moins 3 thématiques`,
      stats: aggregatedData
    };

    const response = NextResponse.json(data);

    // Cache control headers pour éviter la mise en cache
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
};
