import { SearchParams } from '@/app/(main)/types';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import {
  GetEmploisSylviculture,
  GetForetsCommunales
} from '@/lib/queries/databases/sylviculture';
import { DonneesSylviculture } from './DonneesSylviculture';

const SylvicultureServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const [coordonneesCommunes, foretsCommunales, emploisSylviculture] = await Promise.all([
    GetCommunesCoordinates(code, libelle, type),
    GetForetsCommunales(code, libelle, type),
    GetEmploisSylviculture(code, libelle, type)
  ]);

  return (
    <DonneesSylviculture
      coordonneesCommunes={coordonneesCommunes}
      foretsCommunales={foretsCommunales}
      emploisSylviculture={emploisSylviculture}
    />
  );
};

export default SylvicultureServerPage;
