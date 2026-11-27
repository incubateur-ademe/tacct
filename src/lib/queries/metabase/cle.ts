import type { Granularite } from './periode';

export type ParametresCarte = {
  periode?: string;
  periodeEtape2?: string;
  granularite: Granularite;
};

export const parametresParDefaut = (bloc: Partial<ParametresCarte>): ParametresCarte => ({
  periode: bloc.periode,
  periodeEtape2: bloc.periodeEtape2,
  granularite: bloc.granularite ?? 'month'
});

export const cleCarte = (carte: number, { periode, periodeEtape2, granularite }: ParametresCarte): string => {
  const parametres = new URLSearchParams({ granularite });
  if (periode) parametres.set('periode', periode);
  if (periodeEtape2) parametres.set('periodeEtape2', periodeEtape2);
  return `${carte}?${parametres.toString()}`;
};
