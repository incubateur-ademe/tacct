import { SearchParams } from '@/app/(main)/types';
import { GetInondationsDebordement } from '@/lib/queries/databases/batiment';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { DonneesBatiment } from './DonneesBatiment';

const BatimentServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const dbInondationsDebordement = await GetInondationsDebordement(code, libelle, type);

  return <DonneesBatiment
    coordonneesCommunes={coordonneesCommunes}
    inondationsDebordement={dbInondationsDebordement}
  />;
};

export default BatimentServerPage;
