"use client";
import { ScrollToTop } from "@/components/interactions/ScrollToTop";
import { BarreDeRechercheSansFiltre } from "@/components/searchbar/BarreDeRechercheSansFiltre";
import { getLastTerritory } from "@/components/searchbar/fonctions";
import { Loader } from "@/components/ui/loader";
import { Body, H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RechercherSonTerritoire = () => {
  const router = useRouter();
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

  if (isChecking) {
    return <div style={{ display: "flex", justifyContent: "center" }}><Loader /></div>;
  }

  return (
    <>
      <ScrollToTop />
      <NewContainer size="md">
        <div style={{ margin: '5rem 0', padding: '0 1rem' }}>
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
            Saisir une communes, un EPCI/EPT, un PNR, un PETR ou un département
          </Body>
          <div style={{ marginTop: '2.5rem' }}>
            <BarreDeRechercheSansFiltre />
          </div>
        </div>
      </NewContainer>
    </>
  );
}

export default RechercherSonTerritoire;
