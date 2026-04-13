'use client';
import ScrollToHash from '@/components/interactions/ScrollToHash';
import { SourcesSection } from '@/components/interactions/scrollToSource';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import {
  ArreteCatNat,
  ErosionCotiere,
  IncendiesForet,
  RGAdb,
  SecheressesPasseesModel
} from '@/lib/postgres/models';
import {
  GetArretesCatnat,
  GetIncendiesForet,
  GetSecheressesPassees
} from '@/lib/queries/databases/gestionRisques';
import {
  GetCommunesCoordinates,
  GetErosionCotiere
} from '@/lib/queries/postgis/cartographie';
import Notice from '@codegouvfr/react-dsfr/Notice';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { ArretesCatnat } from '../../indicateurs/gestionDesRisques/1-ArretesCatnat';
import { FeuxDeForet } from '../../indicateurs/gestionDesRisques/2-FeuxDeForet';
import { ErosionCotiereComp } from '../../indicateurs/gestionDesRisques/3-ErosionCotiere';
import { RetraitGonflementDesArgiles } from '../../indicateurs/gestionDesRisques/4-RetraitGonflementDesArgiles';
import { Debroussaillement } from '../../indicateurs/gestionDesRisques/5-Debroussaillement';
import { SecheressesPassees } from '../../indicateurs/gestionDesRisques/6-Secheresses';

interface Props {
  gestionRisques: ArreteCatNat[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  erosionCotiere: [ErosionCotiere[], string] | [];
  incendiesForet: IncendiesForet[];
  rga: RGAdb[];
  secheressesPassees: SecheressesPasseesModel[];
}

export const DonneesGestionRisques = ({
  coordonneesCommunes,
  gestionRisques,
  erosionCotiere,
  incendiesForet,
  rga,
  secheressesPassees
}: Props) => {
  const { css } = useStyles();
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Gestion des risques';
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const [data, setData] = useState({
    coordonneesCommunes,
    gestionRisques,
    erosionCotiere,
    incendiesForet,
    secheressesPassees
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const ongletsMenu = sommaireThematiques[thematique];

  useLayoutEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setIsLoading(true);
    void (async () => {
      const [
        newCoordonneesCommunes,
        newGestionRisques,
        newErosionCotiere,
        newIncendiesForet,
        newSecheressesPassees
      ] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetArretesCatnat(code, libelle, type),
        GetErosionCotiere(code, libelle, type),
        GetIncendiesForet(code, libelle, type),
        GetSecheressesPassees(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        gestionRisques: newGestionRisques,
        erosionCotiere: newErosionCotiere,
        incendiesForet: newIncendiesForet,
        secheressesPassees: newSecheressesPassees
      });
      setIsLoading(false);
    })();
  }, [libelle]);

  return isLoading ? (
    <LoaderText text="Mise à jour des données" />
  ) : (
    <div className={styles.explorerMesDonneesContainer}>
      <ScrollToHash />
      <H1 style={{ color: 'var(--principales-vert)', fontSize: '2rem' }}>
        Comme le montre la multiplication des catastrophes naturelles, chaque
        territoire fait face à des impacts climatiques spécifiques. Visualisez
        quelques indicateurs qui dessinent votre profil de risque.
      </H1>
      {/* Introduction */}
      <section>
        <Body size="lg">
          Ces quelques indicateurs vous aideront à poser les bonnes questions,
          le terrain vous donnera les vraies réponses.
        </Body>
      </section>

      {/* Section Gestion des risques */}
      <section className={styles.sectionType}>
        <H2
          style={{
            color: 'var(--principales-rouge)',
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: '0 0 -1rem 0',
            padding: '2rem 2rem 0',
            fontWeight: 400
          }}
        >
          {ongletsMenu.thematiquesLiees[0].icone}{' '}
          {ongletsMenu.thematiquesLiees[0].thematique}
        </H2>

        {/* Arrêtés CatNat */}
        <div
          id="Arrêtés CatNat"
          className={styles.indicateurWrapper}
          style={{ borderBottom: '1px solid var(--gris-medium)' }}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Arrêtés de catastrophes naturelles
            </H3>
          </div>
          <Notice
            className={css({
              backgroundColor: 'var(--gris-medium)',
              borderRadius: '1rem',
              color: '#201F1E',
              marginRight: 32,
              marginBottom: '2rem',
              '& .fr-container': {
                maxWidth: 'none'
              }
            })}
            isClosable={true}
            title={'Différence avec le nombre d’arrêtés GASPAR :'}
            description={
              <>
                l’équipe TACCT a identifié plusieurs doublons dans la
                base de données GASPAR, initialement supprimés. Suite à
                plusieurs retours concernant cet écart, les doublons ont été
                réintégrés : notre base de données est désormais identique à
                celle de GASPAR. Veuillez noter également que TACCT
                affiche à présent la date de début de l’évènement et non celle
                de publication de l’arrêté.
              </>
            }
          />
          <ArretesCatnat
            gestionRisques={data.gestionRisques}
            coordonneesCommunes={data.coordonneesCommunes}
          />
        </div>

        {/* Feux de forêt */}
        <div
          id="Feux de forêt"
          className={styles.indicateurWrapper}
          style={{ borderBottom: '1px solid var(--gris-medium)' }}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Départs de feux et surfaces brûlées depuis 2006
            </H3>
          </div>
          <FeuxDeForet incendiesForet={data.incendiesForet} />
        </div>

        {/* Débroussaillement */}
        <div
          id="Débroussaillement"
          className={styles.indicateurMapWrapper}
          style={{ borderBottom: '1px solid var(--gris-medium)' }}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Obligations de débroussaillement
            </H3>
          </div>
          <Debroussaillement coordonneesCommunes={coordonneesCommunes} />
        </div>

        {/* Sécheresses passées */}
        <div id="Sécheresses passées" className={styles.indicateurWrapper}>
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Sécheresses passées
            </H3>
          </div>
          <SecheressesPassees secheresses={data.secheressesPassees} />
        </div>
      </section>

      {/* Section Bâtiment */}
      <section className={styles.sectionType}>
        <H2
          style={{
            color: 'var(--principales-rouge)',
            textTransform: 'uppercase',
            fontSize: '1.75rem',
            margin: '0 0 -1rem 0',
            padding: '2rem 2rem 0',
            fontWeight: 400
          }}
        >
          {ongletsMenu.thematiquesLiees[1].icone}{' '}
          {ongletsMenu.thematiquesLiees[1].thematique}
        </H2>

        {/* Retrait-gonflement des argiles */}
        <div
          id="Retrait-gonflement des argiles"
          className={styles.indicateurWrapper}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Retrait-gonflement des argiles
            </H3>
          </div>
          <RetraitGonflementDesArgiles
            coordonneesCommunes={data.coordonneesCommunes}
            rga={rga}
          />
        </div>
      </section>
      {data.erosionCotiere.length > 0 && (
        <>
          {/* Section Aménagement */}
          <section className={styles.sectionType}>
            <H2
              style={{
                color: 'var(--principales-rouge)',
                textTransform: 'uppercase',
                fontSize: '1.75rem',
                margin: '0 0 -1rem 0',
                padding: '2rem 2rem 0',
                fontWeight: 400
              }}
            >
              🏗️ Aménagement
            </H2>

            {/* Érosion côtière */}
            <div id="Érosion côtière" className={styles.indicateurMapWrapper}>
              <div className={styles.h3Titles}>
                <H3
                  style={{
                    color: 'var(--principales-vert)',
                    fontSize: '1.25rem'
                  }}
                >
                  Érosion côtière
                </H3>
              </div>
              <ErosionCotiereComp
                erosionCotiere={
                  data.erosionCotiere as [ErosionCotiere[], string]
                }
                coordonneesCommunes={data.coordonneesCommunes}
              />
            </div>
          </section>
        </>
      )}
      {/* Sources */}
      <SourcesSection tag="h2" thematique="gestionDesRisques" />
    </div>
  );
};
