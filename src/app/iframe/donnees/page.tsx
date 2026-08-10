import AgricultureServerPage from '@/app/(main)/(parcours)/donnees/thematiques/agriculture/AgricultureServerPage';
import AmenagementServerPage from '@/app/(main)/(parcours)/donnees/thematiques/amenagement/AmenagementServerPage';
import BiodiversiteServerPage from '@/app/(main)/(parcours)/donnees/thematiques/biodiversite/BiodiversiteServerPage';
import ConfortThermiqueServerPage from '@/app/(main)/(parcours)/donnees/thematiques/confortThermique/ConfortThermiqueServerPage';
import EauServerPage from '@/app/(main)/(parcours)/donnees/thematiques/eau/EauServerPage';
import GestionRisquesServerPage from '@/app/(main)/(parcours)/donnees/thematiques/gestionRisques/GestionRisquesServerPage';
import { SearchParams } from '@/app/(main)/types';
import { ErrorDisplay } from '@/app/ErrorDisplay';
import { GetTablecommune } from '@/lib/queries/databases/tableCommune';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { libelle, thematique } = await searchParams;
  const title = thematique && libelle
    ? `${thematique} - données ${libelle}`
    : thematique ?? 'Explorer les données';
  return { title: { absolute: title } };
}

const ExplorerTerritoirePage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type, thematique } = await props.searchParams;
  const dbTableCommune = await GetTablecommune(code, libelle, type);
  return (
    <>
      {
        ((code || libelle) && type) ?
          <div>
            {thematique === 'Confort thermique' ? (
              <ConfortThermiqueServerPage searchParams={props.searchParams} tableCommune={dbTableCommune} />
            ) : thematique === "Biodiversité" ? (
              <BiodiversiteServerPage searchParams={props.searchParams} tableCommune={dbTableCommune} />
            ) : thematique === "Agriculture" ? (
              <AgricultureServerPage searchParams={props.searchParams} tableCommune={dbTableCommune} />
            ) : thematique === "Aménagement" ? (
              <AmenagementServerPage searchParams={props.searchParams} />
            ) : thematique === "Eau" ? (
              <EauServerPage searchParams={props.searchParams} />
            ) : thematique === "Gestion des risques" ? (
              <GestionRisquesServerPage searchParams={props.searchParams} />
            ) : ""}
          </div>
          : <ErrorDisplay code="404" />
      }
    </>
  );
};

export default ExplorerTerritoirePage;
