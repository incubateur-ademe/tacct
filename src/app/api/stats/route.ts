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

interface Periodicity {
  periodicity: 'day' | 'week' | 'month' | 'year';
}

export const GET = async (request: NextRequest) => {
  try {
    const sql = readFileSync(
      join(process.cwd(), 'src/app/api/stats/north_star.sql'),
      'utf8'
    );
    const results = (await PrismaPostgres.$queryRawUnsafe(sql)) as Array<{
      day: Date;
      north_star: bigint;
    }>;
    const rawData: Stat[] = results.map((row) => ({
      value: Number(row.north_star),
      date: new Date(
        Date.UTC(row.day.getFullYear(), row.day.getMonth(), row.day.getDate())
      )
    }));

    const since = request.nextUrl.searchParams.get('since');
    const sinceNum = since ? Number(since) : null;
    const periodicityParam = request.nextUrl.searchParams.get('periodicity');
    const periodicity: Periodicity = periodicityParam
      ? { periodicity: periodicityParam as 'day' | 'week' | 'month' | 'year' }
      : { periodicity: 'month' };

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
      switch (periodicity.periodicity) {
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
        default:
          key = `${year}-${month}-${day}`;
          periodDate = new Date(Date.UTC(year, month, day));
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
};
