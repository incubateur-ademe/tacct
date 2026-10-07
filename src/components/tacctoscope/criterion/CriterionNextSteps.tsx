'use client';

import { FlecheDroiteIcon } from '@/design-system/base/BaseIcons';
import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { Criterion, CriterionSlug } from '@/lib/tacctoscope/types';
import { useState } from 'react';
import { UnlockModal } from '../shared/Modales';
import styles from './criterion.module.scss';

interface Props {
  slug: CriterionSlug;
  nextCriterion?: Criterion;
  nextLocked: boolean;
}

export const CriterionNextSteps = ({ slug, nextCriterion, nextLocked }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={styles.criterionNextSteps}>
        {nextCriterion && (
          <BoutonSecondaireClassic
            size="md"
            link={nextLocked ? undefined : `/tacctoscope/${nextCriterion.slug}`}
            onClick={nextLocked ? () => setModalOpen(true) : undefined}
            text={`Continuer vers “${nextCriterion.title}”`}
            iconeFin={<FlecheDroiteIcon />}
          />
        )}
        <BoutonPrimaireClassic
          size="md"
          link={`/tacctoscope/feuille-de-route#${slug}`}
          text="Voir ma feuille de route"
          iconeFin={<FlecheDroiteIcon />}
        />
      </div>
      <UnlockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          const returnTo = encodeURIComponent(window.location.pathname);
          window.location.href = `/api/proconnect/login?returnTo=${returnTo}`;
        }}
      />
    </>
  );
};
