import { LoaderText } from '@/components/ui/loader';
import { GetTablecommune } from '@/lib/queries/databases/tableCommune';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchParams } from '../../types';
import { DisclaimerPNR } from './DisclaimerPNR';
import AgricultureServerPage from './thematiques/agriculture/AgricultureServerPage';
import AmenagementServerPage from './thematiques/amenagement/AmenagementServerPage';
import BiodiversiteServerPage from './thematiques/biodiversite/BiodiversiteServerPage';
import ConfortThermiqueServerPage from './thematiques/confortThermique/ConfortThermiqueServerPage';
import EauServerPage from './thematiques/eau/EauServerPage';
import GestionRisquesServerPage from './thematiques/gestionRisques/GestionRisquesServerPage';
import SanteServerPage from './thematiques/sante/SanteServerPage';

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
        ((code || libelle) && type) &&
        <Suspense fallback={<LoaderText text='Nous chargeons vos données' />}>
          {
            type === "pnr" &&
            <DisclaimerPNR />
          }
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
          ) : thematique === "Santé" ? (
            <SanteServerPage searchParams={props.searchParams} />
          ) : ""}
        </Suspense>
      }
    </>
  );
};

export default ExplorerTerritoirePage;
