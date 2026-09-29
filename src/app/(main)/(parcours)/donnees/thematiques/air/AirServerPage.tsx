import { SearchParams } from '@/app/(main)/types';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { DonneesAir } from './DonneesAir';

const AirServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);

  return <DonneesAir
    coordonneesCommunes={coordonneesCommunes}
  />;
};

export default AirServerPage;
