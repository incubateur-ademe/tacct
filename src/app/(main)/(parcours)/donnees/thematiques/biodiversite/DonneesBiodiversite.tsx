"use client";
import ScrollToHash from "@/components/interactions/ScrollToHash";
import { SourcesSection } from "@/components/interactions/scrollToSource";
import { LoaderText } from "@/components/ui/loader";
import { Body, H1, H2, H3 } from "@/design-system/base/Textes";
import { AgricultureBio, AOT40, ConfortThermique, ConsommationNAF, EtatCoursDeau, QualiteSitesBaignadeModel, SurfacesAgricolesModel, TableCommuneModel } from "@/lib/postgres/models";
import { GetSurfacesAgricoles } from "@/lib/queries/databases/agriculture";
import { GetAgricultureBio, GetAOT40, GetConsommationNAF } from "@/lib/queries/databases/biodiversite";
import { GetConfortThermique } from "@/lib/queries/databases/inconfortThermique";
import { GetQualiteEauxBaignade } from "@/lib/queries/databases/ressourcesEau";
import { GetTablecommune } from "@/lib/queries/databases/tableCommune";
import { GetEtatCoursDeau } from "@/lib/queries/postgis/etatCoursDeau";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { sommaireThematiques } from "../../../thematiques/constantes/textesThematiques";
import styles from '../../explorerDonnees.module.scss';
import { TypesDeSols } from "../../indicateurs/biodiversite/1-TypesDeSols";
import { SolsImpermeabilises } from "../../indicateurs/biodiversite/2-SolsImpermeabilises";
import { SurfacesToujoursEnHerbe } from "../../indicateurs/biodiversite/3-SurfacesToujoursEnHerbe";
import { SurfacesEnBio } from "../../indicateurs/biodiversite/4-SurfacesEnBio";
import { EtatEcoCoursDeau } from "../../indicateurs/biodiversite/5-EtatCoursDeau";
import { OzoneEtVegetation } from "../../indicateurs/biodiversite/6-AOT40";

interface Props {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  contoursCommunes: { geometry: string } | null;
  agricultureBio: AgricultureBio[];
  consommationNAF: ConsommationNAF[];
  aot40: AOT40[];
  etatCoursDeau: EtatCoursDeau[];
  qualiteEauxBaignade: QualiteSitesBaignadeModel[];
  confortThermique: Partial<ConfortThermique>[];
  surfacesAgricoles: SurfacesAgricolesModel[];
  tableCommune: TableCommuneModel[];
}

const h2SectionStyle = {
  color: "var(--principales-rouge)",
  textTransform: 'uppercase' as const,
  fontSize: '1.75rem',
  margin: "0 0 -1rem 0",
  padding: "2rem 2rem 0",
  fontWeight: 400
};

export const DonneesBiodiversite = ({
  coordonneesCommunes,
  contoursCommunes,
  agricultureBio,
  consommationNAF,
  aot40,
  etatCoursDeau,
  qualiteEauxBaignade,
  confortThermique,
  surfacesAgricoles,
  tableCommune
}: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as "Biodiversité";
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const code = searchParams.get('code')!;
  const ongletsMenu = sommaireThematiques[thematique];
  const [data, setData] = useState({
    agricultureBio,
    consommationNAF,
    aot40,
    etatCoursDeau,
    qualiteEauxBaignade,
    confortThermique,
    surfacesAgricoles,
    tableCommune
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useLayoutEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setIsLoading(true);
    void (async () => {
      const [
        newAgricultureBio,
        newConsommationNAF,
        newAOT40,
        newEtatCoursDeau,
        newQualiteEauxBaignade,
        newConfortThermique,
        newSurfacesAgricoles,
        newTableCommune
      ] = await Promise.all([
        GetAgricultureBio(libelle, type, code),
        GetConsommationNAF(code, libelle, type),
        GetAOT40(),
        GetEtatCoursDeau(code, libelle, type),
        GetQualiteEauxBaignade(code, libelle, type),
        GetConfortThermique(code, libelle, type),
        GetSurfacesAgricoles(code, libelle, type),
        GetTablecommune(code, libelle, type)
      ]);
      setData({
        agricultureBio: newAgricultureBio,
        consommationNAF: newConsommationNAF,
        aot40: newAOT40,
        etatCoursDeau: newEtatCoursDeau,
        qualiteEauxBaignade: newQualiteEauxBaignade,
        confortThermique: newConfortThermique,
        surfacesAgricoles: newSurfacesAgricoles,
        tableCommune: newTableCommune
      });
      setIsLoading(false);
    })();
  }, [libelle]);

  return (
    isLoading ? <LoaderText text='Mise à jour des données' /> :
      <div className={styles.explorerMesDonneesContainer}>
        <ScrollToHash />
        <H1 style={{ color: "var(--principales-vert)", fontSize: '2rem' }}>
          Les pressions sur la biodiversité agissent en silence, mais leurs conséquences sont durables.
          À vous d’en évaluer l’impact pour préserver la résilience de vos écosystèmes.
        </H1>
        {/* Introduction */}
        <section>
          <Body size='lg'>
            Ces quelques indicateurs vous aideront à poser les bonnes questions, le terrain vous donnera les vraies réponses.
          </Body>
        </section>

        {/* Section Biodiversité */}
        <section className={styles.sectionType}>
          <H2 style={h2SectionStyle}>
            {ongletsMenu.thematiquesLiees[0].icone}{" "}{ongletsMenu.thematiquesLiees[0].thematique}
          </H2>
          {/* Types de sols */}
          <div id="Types de sols" className={styles.indicateurMapWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Cartographie des différents types de sols
              </H3>
            </div>
            <TypesDeSols
              confortThermique={data.confortThermique}
              coordonneesCommunes={coordonneesCommunes}
              contoursCommunes={contoursCommunes}
            />
          </div>
        </section>

        {/* Section Aménagement */}
        <section className={styles.sectionType}>
          <H2 style={h2SectionStyle}>
            {ongletsMenu.thematiquesLiees[1].icone}{" "}{ongletsMenu.thematiquesLiees[1].thematique}
          </H2>
          {/* Sols imperméabilisés */}
          <div id="Sols imperméabilisés" className={styles.indicateurMapWrapper} >
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Sols imperméabilisés entre 2009 et 2023
              </H3>
            </div>
            <SolsImpermeabilises
              consommationNAF={data.consommationNAF}
              coordonneesCommunes={coordonneesCommunes}
              tableCommune={data.tableCommune}
            />
          </div>
        </section>

        {/* Section Agriculture */}
        <section className={styles.sectionType}>
          <H2 style={h2SectionStyle}>
            {ongletsMenu.thematiquesLiees[2].icone}{" "}{ongletsMenu.thematiquesLiees[2].thematique}
          </H2>
          {/* Surfaces toujours en herbe */}
          <div id="Surfaces toujours en herbe" className={styles.indicateurMapWrapper} style={{ borderBottom: '1px solid var(--gris-medium)' }}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Surfaces toujours en herbe
              </H3>
            </div>
            <SurfacesToujoursEnHerbe surfacesAgricoles={data.surfacesAgricoles} />
          </div>
          {/* Surfaces en bio */}
          <div id="Surfaces en bio" className={styles.indicateurWrapper} >
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Part de l’agriculture biologique
              </H3>
            </div>
            <SurfacesEnBio agricultureBio={data.agricultureBio} />
          </div>
        </section>

        {/* Section Eau */}
        <section className={styles.sectionType}>
          <H2 style={h2SectionStyle}>
            {ongletsMenu.thematiquesLiees[3].icone}{" "}{ongletsMenu.thematiquesLiees[3].thematique}
          </H2>
          {/* État écologique des cours d'eau */}
          <div id="État des cours d'eau" className={styles.indicateurMapWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                État écologique des cours d’eau et des plans d’eau
              </H3>
            </div>
            <EtatEcoCoursDeau
              etatCoursDeau={data.etatCoursDeau}
              communesCodes={coordonneesCommunes?.codes ?? []}
              boundingBox={
                coordonneesCommunes ? [
                  [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
                  [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
                ] : undefined
              }
              qualiteEauxBaignade={data.qualiteEauxBaignade}
            />
          </div>
        </section>

        {/* Section Air */}
        <section className={styles.sectionType}>
          <H2 style={h2SectionStyle}>
            {ongletsMenu.thematiquesLiees[4].icone}{" "}{ongletsMenu.thematiquesLiees[4].thematique}
          </H2>
          {/* Ozone et végétation */}
          <div id="Ozone et végétation" className={styles.indicateurMapWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Concentration d’ozone pendant la période de végétation (moyenne 2020-2024)
              </H3>
            </div>
            <OzoneEtVegetation
              aot40={data.aot40}
              contoursCommunes={contoursCommunes}
              communesCodes={coordonneesCommunes?.codes ?? []}
            />
          </div>
        </section>
        {/* Sources */}
        <SourcesSection tag="h2" thematique="biodiversite" />
      </div>
  );
};
