import { SearchParams } from '@/app/(main)/types';
import {
  GetCommunesContours,
  GetCommunesCoordinates
} from '@/lib/queries/postgis/cartographie';
import { DonneesAir } from './DonneesAir';

const AirServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const contoursCommunes = await GetCommunesContours(code, libelle, type);

  return <DonneesAir
    coordonneesCommunes={coordonneesCommunes}
    contoursCommunes={contoursCommunes}
  />;
};

export default AirServerPage;
