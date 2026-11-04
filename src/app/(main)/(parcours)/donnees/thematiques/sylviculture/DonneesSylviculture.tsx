'use client';
import ScrollToHash from '@/components/interactions/ScrollToHash';
import { SourcesSection } from '@/components/interactions/scrollToSource';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import { ForetsCommunalesModel } from '@/lib/postgres/models';
import { GetForetsCommunales } from '@/lib/queries/databases/sylviculture';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { ForetsCommunales } from '../../indicateurs/sylviculture/1-ForetsCommunales';

interface Props {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  foretsCommunales: ForetsCommunalesModel[];
}

export const DonneesSylviculture = ({ coordonneesCommunes, foretsCommunales }: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Sylviculture';
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const [data, setData] = useState({ coordonneesCommunes, foretsCommunales });
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
      const [newCoordonneesCommunes, newForetsCommunales] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetForetsCommunales(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        foretsCommunales: newForetsCommunales
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
        TITRE
      </H1>
      {/* Introduction */}
      <section>
        <Body size="lg">
          Ces données vous aideront à poser les bonnes questions,
          le terrain vous donnera les vraies réponses.
        </Body>
        <Body size="lg" style={{ fontStyle: "italic", marginTop: "1rem" }}>
          À noter : Ces données représentent les informations les plus récentes disponibles à l'échelle nationale.
        </Body>
      </section>

      {/* Section Sylviculture */}
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

        {/* Forêts communales */}
        <div id="Forêts-communales" className={styles.indicateurWrapper}>
          <div className={styles.h3Titles}>
            <H3 style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}>
              Forêts communales
            </H3>
          </div>
          <ForetsCommunales
            foretsCommunales={data.foretsCommunales}
            coordonneesCommunes={data.coordonneesCommunes}
          />
        </div>
      </section>

      {/* Sources */}
      <SourcesSection tag="h2" thematique="sylviculture" />
    </div>
  );
};
