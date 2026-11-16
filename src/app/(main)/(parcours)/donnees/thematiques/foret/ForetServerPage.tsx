import { SearchParams } from '@/app/(main)/types';
import { TableCommuneModel } from '@/lib/postgres/models';
import { GetCommunesContours, GetCommunesCoordinates, GetContoursEpciDeLaCommune } from '@/lib/queries/postgis/cartographie';
import { DonneesForet } from './DonneesForet';

const ForetServerPage = async (props: {
  searchParams: SearchParams;
  tableCommune: TableCommuneModel[];
}) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const contourTerritoire = await GetCommunesContours(code, libelle, type);
  const contoursCommunes = type === 'commune'
    ? await GetContoursEpciDeLaCommune(code)
    : contourTerritoire;

  return <DonneesForet
    coordonneesCommunes={coordonneesCommunes}
    contoursCommunes={contoursCommunes}
    contourTerritoire={contourTerritoire}
    tableCommune={props.tableCommune}
  />
};

export default ForetServerPage;
