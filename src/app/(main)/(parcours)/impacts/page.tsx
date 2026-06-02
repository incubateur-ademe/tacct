import { ClientOnly } from '@/components/utils/ClientOnly';
import { H1 } from '@/design-system/base/Textes';
import type { Metadata } from 'next';
import { SearchParams } from '../../types';

export const metadata: Metadata = { title: 'Diagnostiquer les impacts' };
import styles from '../donnees/explorerDonnees.module.scss';
import { DiagnostiquerImpactsAgriculture } from './thematiques/ImpactsAgriculture';
import { DiagnostiquerImpactsConfortThermique } from './thematiques/ImpactsConfortThermique';

const ImpactsTerritoirePage = async (props: { searchParams: SearchParams }) => {
  const { code, libelle, type, thematique } = await props.searchParams;
  return (
    <div className='min-h-screen'>
      <div className={styles.explorerMesDonneesContainer}>
        {
          ((code || libelle) && type) &&
          <ClientOnly>
            <H1 style={{ color: "var(--principales-vert)", fontSize: '2rem' }}>
              Les données vous montrent des pistes, le terrain lui, vous montre la réalité !
            </H1>
            {
              thematique === 'Confort thermique' ? (
                <DiagnostiquerImpactsConfortThermique />
              ) : thematique === 'Agriculture' ? (
                <DiagnostiquerImpactsAgriculture />
              ) : ""
            }
          </ClientOnly>
        }
      </div>
    </div>
  );
};

export default ImpactsTerritoirePage;
