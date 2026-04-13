import { SearchParams } from "@/app/(main)/types";
import { GetPatch4 } from "@/lib/queries/patch4";
import { GetCommunesCoordinates } from "@/lib/queries/postgis/cartographie";
import { Metadata } from "next";
import { BlocTitre } from './components/blocTitre';
import { Patch4Analyse } from './Patch4Analyse';

export const metadata: Metadata = {
  title: 'Patch4°C',
  description: 'Patch4°C'
};

const Patch4C = async (props: { searchParams: SearchParams }) => {
  const { code, type, libelle } = await props.searchParams;
  const patch4 = await GetPatch4(code, type, libelle);
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);

  return (
    <>
      <BlocTitre />
      <Patch4Analyse
        patch4={patch4}
        coordonneesCommunes={coordonneesCommunes}
      />
    </>
  );
}

export default Patch4C;
