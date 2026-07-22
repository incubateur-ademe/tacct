"use client";
import { BarreDeRecherche } from "@/components/searchbar/BarreDeRecherche";
import { allRadioOptions } from "@/components/searchbar/radioButtons";
import { Body, H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { eptRegex } from "@/lib/utils/regex";
import { useRouter } from "next/navigation";
import { useState } from "react";

const handleRechercheRedirection = ({
  searchCode,
  searchLibelle,
  typeTerritoire,
  router,
  page
}: {
  searchCode: string;
  searchLibelle: string;
  typeTerritoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  router: ReturnType<typeof useRouter>;
  page: string;
}) => {
  if (typeTerritoire === 'epci' && eptRegex.test(searchLibelle)) {
    router.replace(`/iframe/${page}?code=200054781&libelle=${searchLibelle}&type=ept`);
  } else if (searchCode.length !== 0) {
    router.replace(
      `/iframe/${page}?code=${searchCode}&libelle=${searchLibelle}&type=${typeTerritoire}`
    );
  } else if (searchLibelle.length !== 0) {
    router.replace(`/iframe/${page}?libelle=${searchLibelle}&type=${typeTerritoire}`);
  }
};

const RechercherSonTerritoire = () => {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState<string>('');
  const [searchLibelle, setSearchLibelle] = useState<string>('');
  const [typeTerritoire, setTypeTerritoire] = useState<
    'epci' | 'commune' | 'petr' | 'pnr' | 'departement'
  >('epci');

  const handleRechercher = () => handleRechercheRedirection({
    searchCode,
    searchLibelle,
    typeTerritoire,
    router,
    page: "thematiques"
  });
  const handleRadioChange = (territoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement') => {
    setTypeTerritoire(territoire);
    setSearchLibelle('');
  };
  const arrayOptions = [allRadioOptions(typeTerritoire, handleRadioChange)];

  return (
    <NewContainer size="md">
      <div style={{ margin: '5rem 0' }}>
        <H1
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: "2rem",
            lineHeight: '40px',
          }}>
          Explorer les données de mon territoire
        </H1>
        <Body
          size="lg"
          style={{ textAlign: 'center', color: '#666666' }}
        >
          Saisir une commune, un EPCI/EPT, un PNR, un PETR ou un département
        </Body>
        <BarreDeRecherche
          setSearchCode={setSearchCode}
          setSearchLibelle={setSearchLibelle}
          RechercherRedirection={handleRechercher}
          typeTerritoire={typeTerritoire}
          searchCode={searchCode}
          searchLibelle={searchLibelle}
          radioOptions={arrayOptions}
        />
      </div>
    </NewContainer>
  );
}

export default RechercherSonTerritoire;
