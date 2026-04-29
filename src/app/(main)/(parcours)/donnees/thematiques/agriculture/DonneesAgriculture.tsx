"use client";
import DiagnoticImage from '@/assets/images/diagnostiquer_impacts.png';
import ScrollToHash from "@/components/interactions/ScrollToHash";
import { SourcesSection } from "@/components/interactions/scrollToSource";
import { LoaderText } from "@/components/ui/loader";
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { Body, H1, H2, H3 } from "@/design-system/base/Textes";
import { handleRedirectionThematique } from "@/hooks/Redirections";
import { AgricultureBio, SurfacesAgricolesModel, TableCommuneModel } from "@/lib/postgres/models";
import { GetSurfacesAgricoles } from "@/lib/queries/databases/agriculture";
import { GetAgricultureBio } from "@/lib/queries/databases/biodiversite";
import { GetTablecommune } from "@/lib/queries/databases/tableCommune";
import { GetCommunesContours, GetCommunesCoordinates } from "@/lib/queries/postgis/cartographie";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { sommaireThematiques } from "../../../thematiques/constantes/textesThematiques";
import styles from '../../explorerDonnees.module.scss';
import { PartChefsExploitationSeniors } from "../../indicateurs/agriculture/1-ChefsExploitationSeniors";
import { TypesDeCulture } from '../../indicateurs/agriculture/2-TypesDeCultures';
import { SuperficiesIrriguees } from '../../indicateurs/agriculture/3-SuperficiesIrriguees';
import { SurfacesEnBio } from '../../indicateurs/agriculture/4-SurfacesEnBio';
import { AiresAppellationsControlees } from '../../indicateurs/agriculture/5-AiresApellationsControlees';

interface Props {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  contoursCommunes: { geometry: string } | null;
  surfacesAgricoles: SurfacesAgricolesModel[];
  agricultureBio: AgricultureBio[];
  tableCommune: TableCommuneModel[];
}

export const DonneesAgriculture = ({
  coordonneesCommunes,
  contoursCommunes,
  surfacesAgricoles,
  agricultureBio,
  tableCommune
}: Props) => {
  const searchParams = useSearchParams();
  const params = usePathname();
  const thematique = searchParams.get('thematique') as "Agriculture";
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const code = searchParams.get('code')!;
  const ongletsMenu = sommaireThematiques[thematique];
  const [data, setData] = useState({
    coordonneesCommunes,
    contoursCommunes,
    surfacesAgricoles,
    agricultureBio,
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
        newCoordonneesCommunes,
        newContoursCommunes,
        newSurfacesAgricoles,
        newAgricultureBio,
        newTableCommune
      ] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetCommunesContours(code, libelle, type),
        GetSurfacesAgricoles(code, libelle, type),
        GetAgricultureBio(libelle, type, code),
        GetTablecommune(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        contoursCommunes: newContoursCommunes,
        surfacesAgricoles: newSurfacesAgricoles,
        agricultureBio: newAgricultureBio,
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
          Entre force et fragilité, découvrez les facteurs qui font basculer l'agriculture face au changement climatique.
        </H1>
        {/* Introduction */}
        <section>
          <Body size='lg'>
            Ces quelques indicateurs vous aideront à poser les bonnes questions, le terrain (étape 2) vous donnera les vraies réponses.
          </Body>
          <Body size="lg" style={{ fontStyle: "italic", marginTop: "1rem" }}>
            À noter : Ces données représentent les informations les plus récentes disponibles à l'échelle nationale.
          </Body>
        </section>

        {/* Section Agriculture */}
        <section className={styles.sectionType}>
          <H2 style={{
            color: "var(--principales-rouge)",
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: "0 0 -1rem 0",
            padding: "2rem 2rem 0",
            fontWeight: 400
          }}>
            {ongletsMenu.thematiquesLiees[0].icone}{" "}{ongletsMenu.thematiquesLiees[0].thematique}
          </H2>
          {/* Part des chefs d’exploitation séniors */}
          <div
            id="Part-des-chefs-d’exploitation-séniors"
            className={styles.indicateurWrapper}
            style={{ borderBottom: '1px solid var(--gris-medium)' }}
          >
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Part des chefs d’exploitation (ou coexploitants) de plus de 55 ans
              </H3>
            </div>
            <PartChefsExploitationSeniors
              tableCommune={data.tableCommune}
            />
          </div>

          {/* Types de cultures */}
          <div id="Types-de-culture" className={styles.indicateurWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Surface agricole par type de culture
              </H3>
            </div>
            <TypesDeCulture
              surfacesAgricoles={data.surfacesAgricoles}
              tableCommune={data.tableCommune}
            />
          </div>
        </section>

        {/* Section Eau */}
        <section className={styles.sectionType}>
          <H2 style={{
            color: "var(--principales-rouge)",
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: "0 0 -1rem 0",
            padding: "2rem 2rem 0",
            fontWeight: 400
          }}>
            {ongletsMenu.thematiquesLiees[1].icone}{" "}{ongletsMenu.thematiquesLiees[1].thematique}
          </H2>
          {/* Superficies irriguées */}
          <div id="Superficies-irriguées" className={styles.indicateurMapWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Part de la surface agricole irriguée dans la SAU en 2020
              </H3>
            </div>
            <SuperficiesIrriguees
              tableCommune={data.tableCommune}
              coordonneesCommunes={data.coordonneesCommunes}
              contoursCommunes={data.contoursCommunes}
            />
          </div>
        </section>
        {/* Section Biodiversité */}
        <section className={styles.sectionType}>
          <H2 style={{
            color: "var(--principales-rouge)",
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: "0 0 -1rem 0",
            padding: "2rem 2rem 0",
            fontWeight: 400
          }}>
            {ongletsMenu.thematiquesLiees[2].icone}{" "}{ongletsMenu.thematiquesLiees[2].thematique}
          </H2>
          {/* Surfaces en bio */}
          <div id="Surfaces-en-bio" className={styles.indicateurWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Part de l’agriculture biologique
              </H3>
            </div>
            <SurfacesEnBio agricultureBio={data.agricultureBio} />
          </div>
        </section>
        {/* Section Tourisme */}
        <section className={styles.sectionType}>
          <H2 style={{
            color: "var(--principales-rouge)",
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: "0 0 -1rem 0",
            padding: "2rem 2rem 0",
            fontWeight: 400
          }}>
            {ongletsMenu.thematiquesLiees[3].icone}{" "}{ongletsMenu.thematiquesLiees[3].thematique}
          </H2>
          {/* Aires des appellations contrôlées */}
          <div id="Appellations-contrôlées" className={styles.indicateurWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Nombre d’appellations contrôlées
              </H3>
            </div>
            <AiresAppellationsControlees
              tableCommune={data.tableCommune}
            />
          </div>
        </section>
        {/* Sources */}
        <SourcesSection tag="h2" thematique="agriculture" />
        <div className={styles.redirectionEtape2Wrapper} >
          <Image
            src={DiagnoticImage}
            alt=""
            style={{ width: '100%', height: 'auto', maxWidth: "180px" }}
          />
          <div className={styles.textBloc} >
            <Body style={{ fontSize: "20px", color: "var(--gris-dark)", fontWeight: 700, maxWidth: "700px" }}>
              Ces pistes d'investigation en main, partez découvrir sur le terrain comment votre territoire
              intègre ces dimensions, entre pratiques locales et enjeux globaux.
            </Body>
            <BoutonPrimaireClassic
              size='lg'
              text='Diagnostiquer les impacts'
              link={handleRedirectionThematique({
                code: code,
                libelle: libelle,
                type: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
                page: params === "/iframe/donnees" ? "iframe/impacts" : 'impacts',
                thematique: "Agriculture",
                anchor: ""
              })}
              posthogEventName='clic_diagnostic_impact'
              thematique='Agriculture'
            />
          </div>
        </div>
      </div>
  );
};
