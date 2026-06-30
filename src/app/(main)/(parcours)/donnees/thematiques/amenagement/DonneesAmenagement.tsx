'use client';

import ScrollToHash from '@/components/interactions/ScrollToHash';
import { LoaderText } from '@/components/ui/loader';
import { Body, H1, H2, H3 } from '@/design-system/base/Textes';
import { ConsommationNAF } from '@/lib/postgres/models';
import { GetConsommationNAF } from '@/lib/queries/databases/biodiversite';
import { GetCommunesCoordinates } from '@/lib/queries/postgis/cartographie';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { sommaireThematiques } from '../../../thematiques/constantes/textesThematiques';
import styles from '../../explorerDonnees.module.scss';
import { ConsommationEspacesNAFAmenagement } from '../../indicateurs/amenagement/1-ConsommationEspacesNAF';
import { LCZ } from '../../indicateurs/amenagement/2-LCZ';

interface Props {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  consommationNAF: ConsommationNAF[];
}

export const DonneesAmenagement = ({
  coordonneesCommunes,
  consommationNAF
}: Props) => {
  const searchParams = useSearchParams();
  const thematique = searchParams.get('thematique') as 'Aménagement';
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const code = searchParams.get('code')!;
  const ongletsMenu = sommaireThematiques[thematique];
  const [data, setData] = useState({
    coordonneesCommunes,
    consommationNAF
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
      const [newCoordonneesCommunes, newConsommationNAF] = await Promise.all([
        GetCommunesCoordinates(code, libelle, type),
        GetConsommationNAF(code, libelle, type)
      ]);
      setData({
        coordonneesCommunes: newCoordonneesCommunes,
        consommationNAF: newConsommationNAF
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
        Votre territoire a été aménagé pour un climat révolu. Découvrez cet
        héritage pour le réinventer, avant qu’il ne devienne un frein.
      </H1>
      {/* Introduction */}
      <section>
        <Body size="lg">
          Ces quelques indicateurs vous aideront à poser les bonnes questions,
          le terrain vous donnera les vraies réponses.
        </Body>
        <Body size="lg" style={{ fontStyle: 'italic', marginTop: '1rem' }}>
          À noter : Ces données représentent les informations les plus récentes
          disponibles à l'échelle nationale.
        </Body>
      </section>

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
          {ongletsMenu.thematiquesLiees[0].icone}{' '}
          {ongletsMenu.thematiquesLiees[0].thematique}
        </H2>
        {/* Sols imperméabilisés */}
        <div
          id="Sols-imperméabilisés"
          className={styles.indicateurWrapper}
          style={{ borderBottom: '1px solid var(--gris-medium)' }}
        >
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Destination des surfaces imperméabilisées
            </H3>
          </div>
          <ConsommationEspacesNAFAmenagement
            consommationNAF={data.consommationNAF}
          />
        </div>

        {/* État LCZ */}
        <div id="LCZ" className={styles.indicateurMapWrapper}>
          <div className={styles.h3Titles}>
            <H3
              style={{ color: 'var(--principales-vert)', fontSize: '1.25rem' }}
            >
              Cartographie des zones climatiques locales (LCZ)
            </H3>
          </div>
          <LCZ coordonneesCommunes={data.coordonneesCommunes} />
        </div>
      </section>
    </div>
  );
};
