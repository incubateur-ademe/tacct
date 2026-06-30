"use client";
import FranceIcon from "@/assets/icons/france_icon_black.png";
import GuadeloupeIcon from "@/assets/icons/guadeloupe_icon_black.svg";
import GuyaneIcon from "@/assets/icons/guyane_icon_black.png";
import ReunionIcon from "@/assets/icons/la_reunion_icon_black.png";
import MartiniqueIcon from "@/assets/icons/martinique_icon_black.svg";
import MayotteIcon from "@/assets/icons/mayotte_icon_black.png";
import MondeIcon from "@/assets/icons/monde_icon_black.png";
import NouvelleCaledonieIcon from "@/assets/icons/nouvelle_caledonie_icon_black.svg";
import SaintBarthelemyIcon from "@/assets/icons/saint_barthelemy_icon_black.svg";
import SaintMartinIcon from "@/assets/icons/saint_martin_icon_black.svg";
import TahitiIcon from "@/assets/icons/tahiti_icon_black.svg";
import { CustomAccordion } from "@/design-system/base/Accordion";
import { NewContainer } from "@/design-system/layout";
import useWindowDimensions from "@/hooks/windowDimensions";
import { Patch4 } from "@/lib/postgres/models";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

type DromTerritory = {
  name: string;
  icon: StaticImageData;
  t2030: string;
  t2050: string;
  t2100: string;
};

const DROM_TERRITORIES: Record<string, DromTerritory> = {
  "973": { name: "Guyane", icon: GuyaneIcon, t2030: "+1,7 °C", t2050: "+2,3 °C", t2100: "+3,5 °C" },
  "974": { name: "La Réunion", icon: ReunionIcon, t2030: "+1,5 °C", t2050: "+2 °C", t2100: "+3 °C" },
  "976": { name: "Mayotte", icon: MayotteIcon, t2030: "+1,5 °C", t2050: "+2 °C", t2100: "+3 °C" },
  "978": { name: "Saint-Martin", icon: SaintMartinIcon, t2030: "+1,4 °C", t2050: "+1,9 °C", t2100: "+2,7 °C" },
  "977": { name: "Saint-Barthélemy", icon: SaintBarthelemyIcon, t2030: "+1,4 °C", t2050: "+1,9 °C", t2100: "+2,7 °C" },
  "987": { name: "Polynésie française", icon: TahitiIcon, t2030: "+1,2 °C", t2050: "+1,6 °C", t2100: "+2,3 °C" },
  "988": { name: "Nouvelle-Calédonie", icon: NouvelleCaledonieIcon, t2030: "+1,5 °C", t2050: "+2 °C", t2100: "+3 °C" },
  "972": { name: "Martinique", icon: MartiniqueIcon, t2030: "+1,4 °C", t2050: "+1,9 °C", t2100: "+2,7 °C" },
  "971": { name: "Guadeloupe", icon: GuadeloupeIcon, t2030: "+1,4 °C", t2050: "+1,9 °C", t2100: "+2,7 °C" },
};

const GRID = "200px 0.8fr 0.5fr 1fr 12px";

export const DromAccordion = ({
  patch4,
}: {
  patch4: Patch4[];
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const windowDimensions = useWindowDimensions();
  const isMobile = !!windowDimensions.width && windowDimensions.width < 600;
  const dromTerritory =
    patch4[0]
      ? (DROM_TERRITORIES[patch4[0].code_geographique.substring(0, 3)] ?? null)
      : null;

  return (
    <NewContainer size="xl" style={{ padding: "40px 1rem 0" }}>
      <div style={{ borderBottom: "1px solid #DDDDDD" }} />
      <CustomAccordion
        label={
          `+4° C dans l’hexagone à l’horizon 2100, ${dromTerritory ? dromTerritory.t2100 : "+4 °C"
          } sur votre territoire : pourquoi cette différence ?`
        }
        key="DROM"
        isOpen={openId === "DROM"}
        onToggle={() => setOpenId(openId === "DROM" ? null : "DROM")}
      >
        <div>
          <p style={{ marginBottom: "8px" }}>
            Contrairement à la métropole (+4° C d’ici 2100), les territoires ultramarins ont des projections de référence spécifiques et moins élevées.
          </p>
          <p>
            Voici la trajectoire établie par Météo France.
          </p>
          <div
            style={{
              padding: windowDimensions.width && windowDimensions.width < 768 ? "0 1.5rem" : "0 6rem",
            }}
          >
            <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
            <div style={{ minWidth: isMobile ? "600px" : "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                alignItems: "center",
                margin: "1.5rem 0 1rem",
                padding: "0.5rem 1rem",
              }}
            >
              <div style={{ height: "3px", backgroundColor: "#E7E5E5" }} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, height: "3px", backgroundColor: "#E7E5E5" }} />
                <span style={{ padding: "0 1rem", fontWeight: 600, fontSize: "0.95rem" }}>2030</span>
                <div style={{ flex: 1, height: "3px", backgroundColor: "#E7E5E5" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, height: "3px", backgroundColor: "#E7E5E5" }} />
                <span style={{ padding: "0 1rem", fontWeight: 600, fontSize: "0.95rem" }}>2050</span>
                <div style={{ flex: 1, height: "3px", backgroundColor: "#E7E5E5" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, height: "3px", backgroundColor: "#E7E5E5" }} />
                <span style={{ padding: "0 1rem", fontWeight: 600, fontSize: "0.95rem" }}>2100</span>
                <div style={{ flex: 0.2, height: "3px", backgroundColor: "#E7E5E5", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: "-1.65rem", height: "3px", backgroundColor: "#E7E5E5" }} />
                </div>
              </div>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  borderTop: "3px solid #E7E5E5",
                  borderRight: "3px solid #E7E5E5",
                  transform: "rotate(45deg)",
                  flexShrink: 0,
                  borderRadius: "2px",
                  marginLeft: "0.75rem",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                alignItems: "center",
                padding: "0.5rem 1rem",
                margin: "0 0 0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image src={MondeIcon} alt="Monde" width={32} height={32} />
                <span style={{ fontWeight: 600 }}>Monde</span>
              </div>
              <div style={{ textAlign: "center", fontWeight: 600 }}>+1,5 °C</div>
              <div style={{ textAlign: "center", fontWeight: 600 }}>+2 °C</div>
              <div style={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
                <div style={{ flex: 0.9 }} />
                <span>+3 °C</span>
                <div style={{ flex: 0.2 }} />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                alignItems: "center",
                padding: "0.5rem 1rem",
                margin: "0 0 0.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "max-content" }}>
                <Image src={FranceIcon} alt="France métropolitaine" width={32} height={32} />
                <span style={{ fontWeight: 600, width: "max-content" }}>France métropolitaine</span>
              </div>
              <div style={{ textAlign: "center", fontWeight: 600 }}>+2 °C</div>
              <div style={{ textAlign: "center", fontWeight: 600 }}>+2,7 °C</div>
              <div style={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
                <div style={{ flex: 0.9 }} />
                <span>+4 °C</span>
                <div style={{ flex: 0.2 }} />
              </div>
            </div>

            {dromTerritory && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  backgroundColor: "#D3EDEB",
                  marginTop: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Image src={dromTerritory.icon} alt={dromTerritory.name} width={32} height={32} style={{border: "#9D9D9D"}} />
                  <span style={{ fontWeight: 600, color: "#2B4B49" }}>{dromTerritory.name}</span>
                </div>
                <div style={{ textAlign: "center", fontWeight: 600, color: "#2B4B49" }}>{dromTerritory.t2030}</div>
                <div style={{ textAlign: "center", fontWeight: 600, color: "#2B4B49" }}>{dromTerritory.t2050}</div>
                <div style={{ display: "flex", alignItems: "center", fontWeight: 600, color: "#2B4B49" }}>
                  <div style={{ flex: 0.9 }} />
                  <span>{dromTerritory.t2100}</span>
                  <div style={{ flex: 0.2 }} />
                </div>
              </div>
            )}
            </div>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.5rem",
                color: "#666666",
                padding: "2rem 0 1rem",
              }}
            >
              Source : Météo France - Les températures indiquées aux différents horizons
              temporels ont été calculées par rapport à la période pré-industrielle
              (Monde et Outre-mer : 1850-1900, France : 1900-1930)
            </p>
          </div>
        </div>
      </CustomAccordion>
    </NewContainer>
  );
};
