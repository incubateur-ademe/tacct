import { eptRegex } from '@/lib/utils/regex';

export const handleRedirection = ({
  searchCode,
  searchLibelle,
  typeTerritoire,
  page,
  thematique
}: {
  searchCode: string | undefined;
  searchLibelle: string;
  typeTerritoire:
    | 'epci'
    | 'commune'
    | 'petr'
    | 'pnr'
    | 'departement'
    | 'ept'
    | '';
  page: string;
  thematique?: string;
}) => {
  const thematiqueParam = thematique ? `&thematique=${encodeURIComponent(thematique)}` : '';
  const encodedLibelle = encodeURIComponent(searchLibelle);

  if (typeTerritoire === 'epci' && eptRegex.test(searchLibelle)) {
    return `/${page}?code=200054781&libelle=${encodedLibelle}&type=ept${thematiqueParam}`;
  } else if (searchCode && searchCode.length !== 0) {
    return `/${page}?code=${searchCode}&libelle=${encodedLibelle}&type=${typeTerritoire}${thematiqueParam}`;
  } else if (!searchCode && searchLibelle.length !== 0) {
    return `/${page}?libelle=${encodedLibelle}&type=${typeTerritoire}${thematiqueParam}`;
  } else return `/${page}`;
};

export const handleRedirectionThematique = ({
  code,
  libelle,
  type,
  page,
  thematique,
  anchor
}: {
  code: string | undefined;
  libelle: string;
  type: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  page: string;
  thematique: string;
  anchor: string;
}) => {
  const encodedLibelle = encodeURIComponent(libelle);
  const encodedThematique = encodeURIComponent(thematique);

  if (type === 'epci' && eptRegex.test(libelle)) {
    return `/${page}?code=200054781&libelle=${encodedLibelle}&type=ept&thematique=${encodedThematique}#${anchor}`;
  } else if (code && code.length !== 0) {
    return `/${page}?code=${code}&libelle=${encodedLibelle}&type=${type}&thematique=${encodedThematique}#${anchor}`;
  } else if (!code && libelle.length !== 0) {
    return `/${page}?libelle=${encodedLibelle}&type=${type}&thematique=${encodedThematique}#${anchor}`;
  } else return `/${page}`;
};
