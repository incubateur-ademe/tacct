import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';
import backArrow from '@/assets/icons/arrow-go-back-white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';

const StarOutlineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z"
      fill="#346C37"
    />
  </svg>
);

interface Props {
  slug: CriterionSlug;
}

export const CriterionStrengthState = ({ slug }: Props) => (
  <div className={styles.strengthState}>
    <StarOutlineIcon />
    <Body
      weight="bold"
      size="sm"
      color="#346c37"
      style={{ lineHeight: '1.5rem', textTransform: 'uppercase' }}
    >
      Point fort de votre diagnostic !
    </Body>
    <Body
      size="md"
      color="#346c37"
      style={{ lineHeight: '1.5rem', letterSpacing: 'normal' }}
    >
      D’après vos réponses, votre diagnostic est solide sur ce critère.
    </Body>
    <BoutonPrimaireClassic
      link={`/tacctoscope/${slug}`}
      text="Revoir les questions"
      icone={backArrow}
      size="md"
      style={{ marginTop: '0.75rem' }}
    />
  </div>
);
