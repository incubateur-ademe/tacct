"use client";
import { BarreDeRecherche } from "@/components/searchbar/BarreDeRecherche";
import { getLastTerritory, handleRechercheRedirection } from "@/components/searchbar/fonctions";
import { allRadioOptions } from "@/components/searchbar/radioButtons";
import { Loader } from "@/components/ui/loader";
import { H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RechercherSonTerritoire = () => {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState<string>('');
  const [searchLibelle, setSearchLibelle] = useState<string>('');
  const [typeTerritoire, setTypeTerritoire] = useState<
    'epci' | 'commune' | 'petr' | 'pnr' | 'departement'
  >('epci');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const lastTerritory = getLastTerritory();
    if (lastTerritory?.code && lastTerritory?.libelle && lastTerritory?.type) {
      if (lastTerritory.type === 'epci' || lastTerritory.type === 'ept' || lastTerritory.type === 'commune') {
        router.replace(
          `/patch4c?code=${lastTerritory.code}&libelle=${lastTerritory.libelle}&type=${lastTerritory.type}`
        );
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [router]);
  const handleRechercher = () => handleRechercheRedirection({
    searchCode,
    searchLibelle,
    typeTerritoire,
    router,
    page: "patch4c"
  });
  const handleRadioChange = (territoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement') => {
    setTypeTerritoire(territoire);
    setSearchLibelle('');
  };
  const radioButtonsOptions = [allRadioOptions(typeTerritoire, handleRadioChange)];

  if (isChecking) {
    return <div style={{ display: "flex", justifyContent: "center" }}><Loader /></div>;
  }

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
          Commençons par localiser votre territoire pour personnaliser vos données
        </H1>
        <BarreDeRecherche
          setSearchCode={setSearchCode}
          setSearchLibelle={setSearchLibelle}
          RechercherRedirection={handleRechercher}
          typeTerritoire={typeTerritoire}
          searchCode={searchCode}
          searchLibelle={searchLibelle}
          radioOptions={radioButtonsOptions}
        />
      </div>
    </NewContainer>
  );
}

export default RechercherSonTerritoire;
