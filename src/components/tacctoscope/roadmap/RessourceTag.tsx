import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { RoadmapResourceTag } from '@/lib/tacctoscope/content/roadmapResources';
import { ReactNode } from 'react';

const DonneesIcon = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" aria-hidden="true">
    <path
      d="M0 5H3V9H0V5ZM7 2.5H10V9H7V2.5ZM3.5 0H6.5V9H3.5V0ZM1 6V8H2V6H1ZM4.5 1V8H5.5V1H4.5ZM8 3.5V8H9V3.5H8Z"
      fill="currentColor"
    />
  </svg>
);

const ArticleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 17 16" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.0055 2C14.3708 2 14.6668 2.29667 14.6668 2.662V13.338C14.6643 13.7023 14.3698 13.9971 14.0055 14H1.99483C1.62948 13.9996 1.3335 13.7034 1.3335 13.338V2.662C1.33603 2.2977 1.63054 2.00291 1.99483 2H14.0055ZM13.3335 3.33333H2.66683V12.6667H13.3335V3.33333ZM12.0002 10V11.3333H4.00016V10H12.0002ZM8.00016 4.66667V8.66667H4.00016V4.66667H8.00016ZM12.0002 7.33333V8.66667H9.3335V7.33333H12.0002ZM6.66683 6H5.3335V7.33333H6.66683V6ZM12.0002 4.66667V6H9.3335V4.66667H12.0002Z"
      fill="currentColor"
    />
  </svg>
);

const RetourExperienceIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4.667 12.667L2 14.667V3.333A.667.667 0 012.667 2.667h10.666a.667.667 0 01.667.666v8.667a.667.667 0 01-.667.667H4.667z"
      fill="currentColor"
    />
  </svg>
);

const OutilIcon = () => (
  <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 0L4 2.5V10H0V2.5L2 0ZM8.5 1C8.77614 1 9 1.22386 9 1.5V9.5C9 9.77614 8.77614 10 8.5 10H5.5C5.22386 10 5 9.77614 5 9.5V1.5C5 1.22386 5.22386 1 5.5 1H8.5ZM3 3H1V9H3V3ZM8 2H6V9H8V8H7V7H8V6H6.5V5H8V4H7V3H8V2Z"
      fill="currentColor"
    />
  </svg>
);

const TAG_META: Record<
  RoadmapResourceTag,
  { label: string; className: string; icon: ReactNode }
> = {
  donnees: {
    label: 'Données',
    className: styles.tagDonnees,
    icon: <DonneesIcon />
  },
  article: {
    label: 'Article',
    className: styles.tagArticle,
    icon: <ArticleIcon />
  },
  'retour-experience': {
    label: 'Retour d’expérience',
    className: styles.tagRetourExperience,
    icon: <RetourExperienceIcon />
  },
  outil: {
    label: 'Outil',
    className: styles.tagOutil,
    icon: <OutilIcon />
  }
};

interface Props {
  tag: RoadmapResourceTag;
}

export const RessourceTag = ({ tag }: Props) => {
  const meta = TAG_META[tag];
  return (
    <span className={`${styles.tag} ${meta.className}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
};
