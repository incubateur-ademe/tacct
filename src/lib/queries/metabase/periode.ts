export type Granularite = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const GRANULARITES: { valeur: Granularite; libelle: string }[] = [
  { valeur: 'day', libelle: 'Jour' },
  { valeur: 'week', libelle: 'Semaine' },
  { valeur: 'month', libelle: 'Mois' },
  { valeur: 'quarter', libelle: 'Trimestre' },
  { valeur: 'year', libelle: 'Année' }
];

export type Periode =
  | { type: 'tout' }
  | { type: 'relative'; mois: number; inclureMoisEnCours: boolean }
  | { type: 'dates'; debut: string | null; fin: string | null };

const estDateValide = (texte: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(texte) && !Number.isNaN(Date.parse(texte));

export const lirePeriode = (texte: string | null): Periode | null => {
  if (texte === null || texte === '') return { type: 'tout' };
  const relative = /^past(\d{1,3})months(~)?$/.exec(texte);
  if (relative) {
    const mois = Number(relative[1]);
    const inclureMoisEnCours = relative[2] === '~';
    if (mois === 0 && !inclureMoisEnCours) return null;
    return { type: 'relative', mois, inclureMoisEnCours };
  }
  const [debut, fin, ...reste] = texte.split('~');
  if (fin === undefined || reste.length > 0 || (!debut && !fin)) return null;
  if ((debut && !estDateValide(debut)) || (fin && !estDateValide(fin))) return null;
  return { type: 'dates', debut: debut || null, fin: fin || null };
};

export const ecrirePeriode = (periode: Periode): string => {
  switch (periode.type) {
    case 'tout':
      return '';
    case 'relative':
      return `past${periode.mois}months${periode.inclureMoisEnCours ? '~' : ''}`;
    case 'dates':
      return `${periode.debut ?? ''}~${periode.fin ?? ''}`;
  }
};

const formaterJour = (texte: string) =>
  new Date(`${texte}T00:00:00Z`).toLocaleDateString('fr-FR', { timeZone: 'UTC' });

export const libellePeriode = (periode: Periode): string => {
  switch (periode.type) {
    case 'tout':
      return 'Toute la période';
    case 'relative':
      if (periode.mois === 0) return 'Mois en cours';
      return `${periode.mois} derniers mois${periode.inclureMoisEnCours ? ' + mois en cours' : ''}`;
    case 'dates':
      if (periode.debut && periode.fin) return `Du ${formaterJour(periode.debut)} au ${formaterJour(periode.fin)}`;
      if (periode.debut) return `Depuis le ${formaterJour(periode.debut)}`;
      return `Jusqu’au ${formaterJour(periode.fin ?? '')}`;
  }
};

export const lireGranularite = (texte: string | null): Granularite | null => {
  if (texte === null || texte === '') return 'month';
  return GRANULARITES.find((g) => g.valeur === texte)?.valeur ?? null;
};
