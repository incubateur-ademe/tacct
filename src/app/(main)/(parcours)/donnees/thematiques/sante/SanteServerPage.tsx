import { SearchParams } from '@/app/(main)/types';
import { GetArboviroseBaseComplete } from '@/lib/queries/databases/sante';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { DonneesSante } from './DonneesSante';

const SanteServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const dbArbovirose = await GetArboviroseBaseComplete();

  return <DonneesSante
    coordonneesCommunes={coordonneesCommunes}
    arbovirose={dbArbovirose}
  />;
};

export default SanteServerPage;
