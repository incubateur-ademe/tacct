import { SearchParams } from "@/app/(main)/types";
import { GetArretesCatnat, GetIncendiesForet, GetRga, GetSecheressesPassees } from "@/lib/queries/databases/gestionRisques";
import { GetCommunesCoordinates, GetErosionCotiere } from "@/lib/queries/postgis/cartographie";
import { DonneesGestionRisques } from "./DonneesGestionRisques";

const GestionRisquesServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const dbGestionRisques = await GetArretesCatnat(code, libelle, type);
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  const erosionCotiere = await GetErosionCotiere(code, libelle, type);
  const dbIncendiesForet = await GetIncendiesForet(code, libelle, type);
  const rga = await GetRga(code, libelle, type);
  const dbSecheressesPassees = await GetSecheressesPassees(code, libelle, type);

  return (
    <DonneesGestionRisques
      gestionRisques={dbGestionRisques}
      coordonneesCommunes={coordonneesCommunes}
      erosionCotiere={erosionCotiere}
      incendiesForet={dbIncendiesForet}
      rga={rga}
      secheressesPassees={dbSecheressesPassees}
    />
  );
};

export default GestionRisquesServerPage;
