import { SearchParams } from '@/app/(main)/types';
import { GetStationsSki } from '@/lib/queries/databases/tourisme';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { DonneesTourisme } from './DonneesTourisme';

const TourismeServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const [coordonneesCommunes, stationsSki] = await Promise.all([
    GetCommunesCoordinates(code, libelle, type),
    GetStationsSki(code, libelle, type)
  ]);

  return (
    <DonneesTourisme
      coordonneesCommunes={coordonneesCommunes}
      stationsSki={stationsSki}
    />
  );
};

export default TourismeServerPage;
