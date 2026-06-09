import { SearchParams } from "@/app/(main)/types";
import { GetPrelevementsEauNew } from "@/lib/queries/databases/ressourcesEau";
import { GetCommunesCoordinates } from "@/lib/queries/postgis/cartographie";
import { GetEtatCoursDeau } from "@/lib/queries/postgis/etatCoursDeau";
import { DonneesEau } from "./DonneesEau";

const EauServerPage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type } = await props.searchParams;
  const dbEtatCoursDeau = await GetEtatCoursDeau(code, libelle, type);
  const dbPrelevementsEauNew = await GetPrelevementsEauNew(code, libelle, type);
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);

  return (
    <DonneesEau
      coordonneesCommunes={coordonneesCommunes}
      etatCoursDeau={dbEtatCoursDeau}
      prelevementsEau={dbPrelevementsEauNew}
    />
  );
};

export default EauServerPage;
