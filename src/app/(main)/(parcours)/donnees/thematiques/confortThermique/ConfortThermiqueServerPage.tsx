import { SearchParams } from '@/app/(main)/types';
import { TableCommuneModel } from '@/lib/postgres/models';
import { GetConfortThermique } from '@/lib/queries/databases/inconfortThermique';
import {
  GetCommunesContours,
  GetCommunesCoordinates
} from '@/lib/queries/postgis/cartographie';
import DonneesConfortThermique from './DonneesConfortThermique';

const ConfortThermiqueServerPage = async (props: {
  searchParams: SearchParams;
  tableCommune: TableCommuneModel[];
}) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const contoursCommunes = await GetCommunesContours(code, libelle, type);
  const dbConfortThermique = await GetConfortThermique(code, libelle, type);

  return (
    <DonneesConfortThermique
      coordonneesCommunes={coordonneesCommunes}
      contoursCommunes={contoursCommunes}
      confortThermique={dbConfortThermique}
      tableCommune={props.tableCommune}
    />
  );
};

export default ConfortThermiqueServerPage;
