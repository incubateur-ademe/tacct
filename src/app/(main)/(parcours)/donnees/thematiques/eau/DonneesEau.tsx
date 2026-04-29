"use client";
import ScrollToHash from "@/components/interactions/ScrollToHash";
import { LoaderText } from "@/components/ui/loader";
import { Body, H1, H2, H3 } from "@/design-system/base/Textes";
import { EtatCoursDeau, PrelevementsEau, PrelevementsEauModel } from "@/lib/postgres/models";
import { GetPrelevementsEau, GetPrelevementsEauNew } from "@/lib/queries/databases/ressourcesEau";
import { GetEtatCoursDeau } from "@/lib/queries/postgis/etatCoursDeau";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { sommaireThematiques } from "../../../thematiques/constantes/textesThematiques";
import styles from '../../explorerDonnees.module.scss';
import { EtatEcoCoursDeau } from '../../indicateurs/eau/1-EtatCoursDeau';
import { PrelevementsEnEau } from '../../indicateurs/eau/2-PrelevementsEnEau';

interface Props {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  etatCoursDeau: EtatCoursDeau[];
  prelevementsEau: PrelevementsEau[];
  prelevementsEauNew: PrelevementsEauModel[];
}

export const DonneesEau = ({
  coordonneesCommunes,
  etatCoursDeau,
  prelevementsEau,
  prelevementsEauNew
}: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as "Eau";
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const code = searchParams.get('code')!;
  const ongletsMenu = sommaireThematiques[thematique];
  const [data, setData] = useState({
    etatCoursDeau,
    prelevementsEau,
    prelevementsEauNew
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
      const [newEtatCoursDeau, newPrelevementsEau, newPrelevementsEauNew] = await Promise.all([
        GetEtatCoursDeau(code, libelle, type),
        GetPrelevementsEau(code, libelle, type),
        GetPrelevementsEauNew(code, libelle, type)
      ]);
      setData({
        etatCoursDeau: newEtatCoursDeau,
        prelevementsEau: newPrelevementsEau,
        prelevementsEauNew: newPrelevementsEauNew
      });
      setIsLoading(false);
    })();
  }, [libelle]);

  return (
    isLoading ? <LoaderText text='Mise à jour des données' /> :
      <div className={styles.explorerMesDonneesContainer}>
        <ScrollToHash />
        <H1 style={{ color: "var(--principales-vert)", fontSize: '2rem' }}>
          Trop ou pas assez d’eau ? Explorer des facteurs déterminants pour l’avenir de la ressource en eau à l’ère du changement climatique
        </H1>
        {/* Introduction */}
        <section>
          <Body size='lg'>
            Ces quelques indicateurs vous aideront à poser les bonnes questions, le terrain vous donnera les vraies réponses.
          </Body>
          <Body size="lg" style={{ fontStyle: "italic", marginTop: "1rem" }}>
            À noter : Ces données représentent les informations les plus récentes disponibles à l'échelle nationale.
          </Body>
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
          }}>            {ongletsMenu.thematiquesLiees[0].icone}{" "}{ongletsMenu.thematiquesLiees[0].thematique}
          </H2>
          {/* Ressources en eau */}
          <div id="Ressources-en-eau" className={styles.indicateurWrapper} style={{ borderBottom: '1px solid var(--gris-medium)' }}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                Répartition des prélèvements d’eau par usage
              </H3>
            </div>
            <PrelevementsEnEau prelevementsEau={data.prelevementsEau} prelevementsEauNew={data.prelevementsEauNew} />
          </div>

          {/* État écologique des cours d'eau */}
          <div id="État-des-cours-d'eau" className={styles.indicateurMapWrapper}>
            <div className={styles.h3Titles}>
              <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
                État écologique des cours d’eau
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
            />
          </div>
        </section>
      </div>
  );
};
