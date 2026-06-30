import { SearchParams } from '@/app/(main)/types';
import { TableCommuneModel } from '@/lib/postgres/models';
import { GetSurfacesAgricoles } from '@/lib/queries/databases/agriculture';
import {
  GetAgricultureBio,
  GetAOT40,
  GetConsommationNAF
} from '@/lib/queries/databases/biodiversite';
import { GetConfortThermiqueBiodiversite } from '@/lib/queries/databases/inconfortThermique';
import { GetQualiteEauxBaignade } from '@/lib/queries/databases/ressourcesEau';
import {
  GetCommunesContours,
  GetCommunesCoordinates
} from '@/lib/queries/postgis/cartographie';
import { GetEtatCoursDeau } from '@/lib/queries/postgis/etatCoursDeau';
import { DonneesBiodiversite } from './DonneesBiodiversite';

const BiodiversiteServerPage = async (props: {
  searchParams: SearchParams;
  tableCommune: TableCommuneModel[];
}) => {
  const { code, libelle, type } = await props.searchParams;
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const contoursCommunes = await GetCommunesContours(code, libelle, type);
  const dbAgricultureBio = await GetAgricultureBio(libelle, type, code);
  const dbConsommationNAF = await GetConsommationNAF(code, libelle, type);
  const dbAOT40 = await GetAOT40();
  const dbEtatCoursDeau = await GetEtatCoursDeau(code, libelle, type);
  const qualiteEauxBaignadeParDpmt = await GetQualiteEauxBaignade(
    code,
    libelle,
    type
  );
  const dbConfortThermique = await GetConfortThermiqueBiodiversite(
    code,
    libelle,
    type
  );
  const dbSurfacesAgricoles = await GetSurfacesAgricoles(code, libelle, type);

  return (
    <DonneesBiodiversite
      coordonneesCommunes={coordonneesCommunes}
      contoursCommunes={contoursCommunes}
      agricultureBio={dbAgricultureBio}
      consommationNAF={dbConsommationNAF}
      aot40={dbAOT40}
      etatCoursDeau={dbEtatCoursDeau}
      qualiteEauxBaignade={qualiteEauxBaignadeParDpmt}
      confortThermique={dbConfortThermique}
      surfacesAgricoles={dbSurfacesAgricoles}
      tableCommune={props.tableCommune}
    />
  );
};

export default BiodiversiteServerPage;
