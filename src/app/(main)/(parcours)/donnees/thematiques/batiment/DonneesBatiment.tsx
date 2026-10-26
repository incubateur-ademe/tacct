'use client';
import ScrollToHash from '@/components/interactions/ScrollToHash';
import { SourcesSection } from '@/components/interactions/scrollToSource';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import { InondationsDebordementTerritoire } from '@/lib/postgres/models';
import { GetInondationsDebordement } from '@/lib/queries/databases/batiment';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { InondationDebordement } from '../../indicateurs/batiment/1-InondationDebordement';

interface Props {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  inondationsDebordement: InondationsDebordementTerritoire | null;
}

export const DonneesBatiment = ({ coordonneesCommunes, inondationsDebordement }: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Bâtiment';
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const [data, setData] = useState({
    coordonneesCommunes,
    inondationsDebordement
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
      const [newCoordonneesCommunes, newInondationsDebordement] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetInondationsDebordement(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        inondationsDebordement: newInondationsDebordement
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
        BATIMENT TITRE
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

        {/* Inondation par débordement des cours d'eau */}
        <div
          id="Inondation-par-débordement-des-cours-d’eau"
          className={styles.indicateurWrapper}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Inondation par débordement des cours d’eau
            </H3>
          </div>
          <InondationDebordement inondationsDebordement={data.inondationsDebordement} />
        </div>
      </section>



      {/* Sources */}
      <SourcesSection tag="h2" thematique="batiment" />
    </div>
  );
};
