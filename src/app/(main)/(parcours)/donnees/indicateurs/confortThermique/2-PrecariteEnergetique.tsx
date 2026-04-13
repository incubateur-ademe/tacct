"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroRemplissageTerritoire } from '@/components/charts/MicroDataviz';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { CopyLinkClipboard } from '@/components/interactions/CopyLinkClipboard';
import { fragiliteEcoLegend } from "@/components/maps/legends/datavizLegends";
import { LegendCompColor } from "@/components/maps/legends/legendComp";
import { MapConfortThermique } from '@/components/maps/mapConfortThermique';
import { CustomTooltipNouveauParcours } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { ConfortThermique } from "@/lib/postgres/models";
import { fragiliteEconomiqueTooltipText } from '@/lib/tooltipTexts';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { useSearchParams } from "next/navigation";
import styles from '../../explorerDonnees.module.scss';

export const PrecariteEnergetique = ({
  confortThermique,
  contoursCommunes,
  coordonneesCommunes
}: {
  confortThermique: ConfortThermique[];
  contoursCommunes: { geometry: string } | null;
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const confortThermiqueFiltered = confortThermique.filter((e) => e.precarite_logement !== null && !isNaN(e.precarite_logement));
  const confortThermiqueParMaille = type === 'epci'
    ? confortThermiqueFiltered.filter((obj) => obj.epci === code)
    : type === 'commune'
      ? confortThermiqueFiltered.filter((obj) => obj.code_geographique === code)
      : type === 'petr'
        ? confortThermiqueFiltered.filter((obj) => obj.libelle_petr === libelle)
        : type === 'ept'
          ? confortThermiqueFiltered.filter((obj) => obj.ept === libelle)
          : type === "pnr"
            ? confortThermiqueFiltered.filter((obj) => obj.libelle_pnr === libelle)
            : confortThermiqueFiltered;

  const precariteLogTerritoire =
    type === 'commune'
      ? Number(
        confortThermiqueParMaille.find(
          (obj) => obj['code_geographique'] === code
        )?.['precarite_logement']
      )
      : Number(
        confortThermiqueParMaille.reduce(function (a, b) {
          return a + (b.precarite_logement ?? 0);
        }, 0) / confortThermiqueParMaille.length
      );

  const precariteLogTerritoireSup = Number(
    confortThermiqueFiltered.reduce(function (a, b) {
      return a + (b.precarite_logement ?? 0);
    }, 0) / confortThermiqueFiltered.length
  );

  const territoireContours = contoursCommunes ? [{
    type: 'Feature' as const,
    properties: {
      epci: '',
      libelle_epci: '',
      libelle_geographique: libelle,
      code_geographique: code,
      coordinates: ''
    },
    geometry: JSON.parse(contoursCommunes.geometry)
  }] : [];

  // Préparer les données de précarité pour la map
  const precariteData = confortThermique
    .filter(c => c.precarite_logement !== null)
    .map(c => ({
      code: c.code_geographique,
      value: c.precarite_logement as number,
      name: c.libelle_geographique
    }));

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {
            !precariteLogTerritoire || territoireContours.length === 0 ? "" :
              <MicroRemplissageTerritoire
                pourcentage={100 * precariteLogTerritoire}
                territoireContours={territoireContours}
                arrondi={1}
              />
          }
          <div className={styles.text}>
            {
              precariteLogTerritoire ? (
                <>
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    La précarité énergétique va au-delà du seul critère du revenu, elle inclut
                    les mauvaises conditions d’habitation ainsi que les évolutions du prix des énergies.
                    La part des ménages en situation de précarité énergétique
                    liée au logement sur votre territoire est de{' '}
                    <b>{Round((100 * precariteLogTerritoire), 1)} %. </b>
                  </Body>
                  {
                    type === "commune" && (
                      <Body weight='bold' style={{ color: "var(--gris-dark)", padding: '0.5rem 0' }}>
                        Ce taux est de {Round((100 * precariteLogTerritoireSup), 1)} % dans votre EPCI.
                      </Body>
                    )
                  }
                  <CustomTooltipNouveauParcours
                    title={fragiliteEconomiqueTooltipText}
                    texte="D'où vient ce chiffre ?"
                  />
                </>
              ) : ""
            }
          </div>
        </div>
        <div className={styles.mapWrapper}>
          {
            confortThermique.length > 0 && precariteLogTerritoire ? (
              <>
                <MapConfortThermique precariteData={precariteData} coordonneesCommunes={coordonneesCommunes} />
                <div
                  className={styles.legend}
                  style={{ width: 'auto', justifyContent: 'center' }}
                >
                  <LegendCompColor legends={fragiliteEcoLegend} />
                </div>
              </>
            ) : (
              <div className='p-10 flex flex-row justify-center'>
                <DataNotFoundForGraph image={DataNotFound} />
              </div>
            )
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : <a href="https://geodip.onpe.org/" target='_blank' rel='noopener noreferrer'>Observatoire de la précarité énergétique (ONPE)</a>,  GEODIP, 2022 (consultée en décembre 2024)
          <br></br>Export indisponible : cette donnée est diffusée sur demande aux territoires par Geodip
        </Body>
        {(confortThermique.length > 0 && precariteLogTerritoire) ? <CopyLinkClipboard anchor={"Précarité énergétique"} /> : null}
      </div>
    </>
  );
};
