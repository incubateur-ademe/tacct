"use client";

import EnveloppeIcone from "@/assets/icons/enveloppe_icon_green.svg";
import DonneesIndisponiblesImage from "@/assets/images/donnees_indisponibles_outremer.png";
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from "@/design-system/base/Boutons";
import { Body, H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export const DonneesIndisponiblesOutreMer = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  return (
    <NewContainer size="xl" style={{ padding: "40px 1rem 40px", textAlign: "center" }}>
      <H1 color="#666666" style={{ fontSize: "20px", lineHeight: "32px", marginBottom: "0.5rem" }}>
        Données indisponibles
      </H1>
      <Body color="#666666" style={{ maxWidth: 900, margin: "0 auto" }}>
        Ces indicateurs ne sont pas disponibles pour votre territoire. Vous
        pouvez néanmoins accéder à notre rubrique “Patch 4° C” et consulter les
        tendanciels d’aggravation des aléas majeurs pour votre territoire.
      </Body>
      <div className="flex flex-row flex-wrap gap-4 mt-9 mb-16 justify-center">
        <BoutonSecondaireClassic
          size="lg"
          link="https://tally.so/r/mJGELz"
          text="Contacter l'équipe"
          rel="noopener noreferrer"
          icone={EnveloppeIcone}
        />
        <BoutonPrimaireClassic
          size="lg"
          link={`/patch4c?code=${code}&libelle=${libelle}&type=${type}`}
          text="Voir les données Patch 4° C  →"
        />
      </div>
      <Image
        src={DonneesIndisponiblesImage}
        alt=""
        style={{ maxWidth: 150, width: "100%", height: "auto" }}
      />
    </NewContainer>
  )
}
