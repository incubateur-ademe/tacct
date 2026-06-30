import { SearchParams } from '@/app/(main)/types';
import { GetCommunesContours, GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { DonneesForet } from './DonneesForet';

const ForetServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const contoursCommunes = await GetCommunesContours(code, libelle, type);

  return <DonneesForet
    coordonneesCommunes={coordonneesCommunes}
    contoursCommunes={contoursCommunes}
  />
};

export default ForetServerPage;
