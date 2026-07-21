"use client";
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

  if (isChecking) {
    return <div style={{ display: "flex", justifyContent: "center" }}><Loader /></div>;
  }

  return (
    <NewContainer size="md">
      <div style={{ margin: '5rem 0', padding: '0 1rem' }}>
        <H1
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: "2rem",
            lineHeight: '40px',
          }}>
          Commençons par localiser votre territoire pour personnaliser vos données
        </H1>
        <Body
          size="lg"
          style={{ textAlign: 'center', color: '#666666' }}
        >
          Recherchez parmi les communes, EPCI, EPT, PNR, PETR et départements
        </Body>
        <div style={{ marginTop: '2.5rem' }}>
          <BarreDeRechercheSansFiltre page="patch4c" />
        </div>
      </div>
    </NewContainer>
  );
}

export default RechercherSonTerritoire;
