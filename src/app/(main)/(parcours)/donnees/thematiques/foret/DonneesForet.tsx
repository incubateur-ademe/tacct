'use client';
import ScrollToHash from '@/components/interactions/ScrollToHash';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import { GetCommunesContours, GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { HauteurCanopee } from '../../indicateurs/foret/1-HauteurCanopee';
import { LineaireDeHaie } from '../../indicateurs/foret/2-LineaireDeHaie';

interface Props {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
}

export const DonneesForet = (
  {
    coordonneesCommunes,
    contoursCommunes
  }: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Forêts';
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const [data, setData] = useState({
    coordonneesCommunes,
    contoursCommunes
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
      const [newCoordonneesCommunes, newContoursCommunes] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetCommunesContours(code, libelle, type),
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        contoursCommunes: newContoursCommunes
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
        La forêt en France
      </H1>
      {/* Introduction */}
      <section>
        <Body size="lg">
          Ces données vous aideront à poser les bonnes questions,
          le terrain vous donnera les vraies réponses.
        </Body>
        <Body size="lg" style={{ fontStyle: "italic", marginTop: "1rem" }}>
          À noter : Ces données représentent les informations les plus récentes disponibles à l'échelle nationale.
        </Body>
      </section>

      {/* Section Forêt */}
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
        {/* Hauteur de la canopée */}
        <div
          id="Hauteur de la canopée"
          className={styles.indicateurMapWrapper}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Hauteur de la canopée
            </H3>
          </div>
          <HauteurCanopee
            coordonneesCommunes={data.coordonneesCommunes}
            contoursCommunes={data.contoursCommunes}
          />
        </div>

        {/* Linéaire de haie */}
        <div id="Linéaire de haie" className={styles.indicateurMapWrapper}>
          <div className={styles.h3Titles}>
            <H3 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
              Cartographie du linéaire de haie
            </H3>
          </div>
          <LineaireDeHaie
            coordonneesCommunes={data.coordonneesCommunes}
            contoursCommunes={data.contoursCommunes}
          />
        </div>
      </section>

    </div>
  );
};
