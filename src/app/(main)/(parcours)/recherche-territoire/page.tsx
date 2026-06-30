"use client";
import { ScrollToTop } from "@/components/interactions/ScrollToTop";
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
      const url = lastTerritory.thematique
        ? `/donnees?code=${lastTerritory.code}&libelle=${lastTerritory.libelle}&type=${lastTerritory.type}&thematique=${lastTerritory.thematique}`
        : `/thematiques?code=${lastTerritory.code}&libelle=${lastTerritory.libelle}&type=${lastTerritory.type}`;
      router.replace(url);
    } else {
      setIsChecking(false);
    }
  }, [router]);

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

  if (isChecking) {
    return <div style={{ display: "flex", justifyContent: "center" }}><Loader /></div>;
  }

  return (
    <>
      <ScrollToTop />
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
            radioOptions={arrayOptions}
          />
        </div>
      </NewContainer>
    </>
  );
}

export default RechercherSonTerritoire;
