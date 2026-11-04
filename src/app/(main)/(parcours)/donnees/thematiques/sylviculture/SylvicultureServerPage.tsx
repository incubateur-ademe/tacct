import { SearchParams } from '@/app/(main)/types';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { GetForetsCommunales } from '@/lib/queries/databases/sylviculture';
import { DonneesSylviculture } from './DonneesSylviculture';

const SylvicultureServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const [coordonneesCommunes, foretsCommunales] = await Promise.all([
    GetCommunesCoordinates(code, libelle, type),
    GetForetsCommunales(code, libelle, type)
  ]);

  return (
    <DonneesSylviculture
      coordonneesCommunes={coordonneesCommunes}
      foretsCommunales={foretsCommunales}
    />
  );
};

export default SylvicultureServerPage;
