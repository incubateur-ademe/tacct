import { Prisma } from '@/generated/client/client';
import type { Granularite, Periode } from './periode';

export const COLONNES_DATE = {
  pageviews: Prisma.raw('"analytics"."all_pageview_raw"."event_timestamp"'),
  thematique: Prisma.raw('"analytics"."thematique"."event_timestamp"'),
  boutonsEtape2: Prisma.raw('"analytics"."boutons_etape2"."event_timestamp"'),
  derniereConnexion: Prisma.raw('"tacct"."user"."last_login_at"'),
  reponsesTacctoscope: Prisma.raw('"tacct"."tacctoscope_answer"."created_at"')
};

const DEBUT_MOIS_EN_COURS = Prisma.sql`date_trunc('month', now() AT TIME ZONE 'Europe/Paris')`;

export const filtreDate = (colonne: Prisma.Sql, periode: Periode): Prisma.Sql => {
  switch (periode.type) {
    case 'tout':
      return Prisma.empty;
    case 'relative': {
      const fin = periode.inclureMoisEnCours
        ? Prisma.sql`${DEBUT_MOIS_EN_COURS} + interval '1 month'`
        : DEBUT_MOIS_EN_COURS;
      return Prisma.sql`AND ${colonne} >= ((${DEBUT_MOIS_EN_COURS} - make_interval(months => ${periode.mois}::int)) AT TIME ZONE 'Europe/Paris') AND ${colonne} < ((${fin}) AT TIME ZONE 'Europe/Paris')`;
    }
    case 'dates': {
      const conditions: Prisma.Sql[] = [];
      if (periode.debut) {
        conditions.push(Prisma.sql`AND ${colonne} >= (${periode.debut}::date::timestamp AT TIME ZONE 'Europe/Paris')`);
      }
      if (periode.fin) {
        conditions.push(Prisma.sql`AND ${colonne} < ((${periode.fin}::date + 1)::timestamp AT TIME ZONE 'Europe/Paris')`);
      }
      return conditions.length ? Prisma.join(conditions, ' ') : Prisma.empty;
    }
  }
};

const UNITES: Record<Granularite, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
};

export const tronquerDate = (granularite: Granularite, colonne: 'final_daily.day'): Prisma.Sql =>
  Prisma.raw(`DATE_TRUNC('${UNITES[granularite]}', ${colonne})`);
