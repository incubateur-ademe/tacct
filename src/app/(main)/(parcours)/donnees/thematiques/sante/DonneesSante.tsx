'use client';
import ScrollToHash from '@/components/interactions/ScrollToHash';
import { SourcesSection } from '@/components/interactions/scrollToSource';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import { ArboviroseModel } from '@/lib/postgres/models';
import { GetArbovirose } from '@/lib/queries/databases/sante';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { SeuilsReglementairesO3 } from '../../indicateurs/sante/1-o3';
import { Arbovirose } from '../../indicateurs/sante/2-Arbovirose';

interface Props {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  arbovirose: ArboviroseModel[];
}

export const DonneesSante = ({ coordonneesCommunes, arbovirose }: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Gestion des risques';
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const [data, setData] = useState({
    coordonneesCommunes,
    arbovirose
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
      const [newCoordonneesCommunes, newArbovirose] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetArbovirose(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        arbovirose: newArbovirose
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
        En accentuant des fragilités existantes, le changement climatique exerce une
        pression croissante sur la santé des populations. Quels facteurs se combinent aujourd’hui
        sur votre territoire ?
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

      {/* Section Air */}
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

        {/* Pollution à l’ozone */}
        <div
          id="Pollution à l’ozone"
          className={styles.indicateurMapWrapper}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Pollution à l’ozone
            </H3>
          </div>
          <SeuilsReglementairesO3
            coordonneesCommunes={data.coordonneesCommunes}
          />
        </div>
      </section>

      {/* Section Biodiversité */}
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

        {/* Moustique tigre et arboviroses */}
        <div
          id="Moustique tigre et arboviroses"
          className={styles.indicateurMultipleMapsWrapper}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem', padding: "0 2rem" }}
            >
              Moustique tigre et arboviroses
            </H3>
          </div>
          <Arbovirose arbovirose={arbovirose} />
        </div>
      </section>

      {/* Sources */}
      <SourcesSection tag="h2" thematique="sante" />
    </div>
  );
};
