import { SearchParams } from "@/app/(main)/types";
import { GetPatch4 } from "@/lib/queries/patch4";
import { GetCommunesCoordinates } from "@/lib/queries/postgis/cartographie";
import { Metadata } from "next";
import { BlocTitre } from './components/blocTitre';
import { DromAccordion } from "./components/DromAccordion";
import { Patch4Analyse } from './Patch4Analyse';

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { libelle } = await searchParams;
  return {
    title: { absolute: libelle ? `Patch 4° C - ${libelle}` : 'Patch 4° C' }
  };
}

const Patch4C = async (props: { searchParams: SearchParams }) => {
  const { code, type, libelle } = await props.searchParams;
  const patch4 = await GetPatch4(code, type, libelle);
  const coordonneesCommunes = await GetCommunesCoordinates(code, libelle, type);
  return (
    <>
      <BlocTitre />
      {
        patch4 && patch4.length > 0 && (
          patch4[0].code_geographique.substring(0, 2) === "97" ||
          patch4[0].code_geographique.substring(0, 2) === "98") && (
          <DromAccordion
            patch4={patch4}
          />
        )
      }

      <Patch4Analyse
        patch4={patch4}
        coordonneesCommunes={coordonneesCommunes}
      />
    </>
  );
}

export default Patch4C;
