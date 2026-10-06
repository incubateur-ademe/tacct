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
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.504 0C9.778 0 10 0.2225 10 0.4965V8.5035C9.9981 8.77672 9.77722 8.99782 9.504 9H0.496C0.221986 8.99972 0 8.77751 0 8.5035V0.4965C0.00190391 0.223278 0.22278 0.00217919 0.496 0H9.504ZM9 1H1V8H9V1ZM8 6V7H2V6H8ZM5 2V5H2V2H5ZM8 4V5H6V4H8ZM4 3H3V4H4V3ZM8 2V3H6V2H8Z"
      fill="currentColor"
    />
  </svg>
);

const ReglementationIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 9V10H0V9H10ZM2 5V8.5H1V5H2ZM4.5 5V8.5H3.5V5H4.5ZM6.5 5V8.5H5.5V5H6.5ZM9 5V8.5H8V5H9ZM5 0L10 2.5V4.5H0V2.5L5 0ZM5 1.118L1 3.118V3.5H9V3.118L5 1.118ZM5 2C5.27614 2 5.5 2.22386 5.5 2.5C5.5 2.77614 5.27614 3 5 3C4.72386 3 4.5 2.77614 4.5 2.5C4.5 2.22386 4.72386 2 5 2Z"
      fill="currentColor"
    />
  </svg>
);

const ExempleDiagnosticIcon = () => (
  <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 0V1H6V0H7V1H8.5C8.77614 1 9 1.22386 9 1.5V10.5C9 10.7761 8.77614 11 8.5 11H0.5C0.223858 11 0 10.7761 0 10.5V1.5C0 1.22386 0.223858 1 0.5 1H2V0H3ZM2 2H1V10H8V2H7V3H6V2H3V3H2V2ZM7 6V7H2V6H7ZM7 4V5H2V4H7Z"
      fill="currentColor"
    />
  </svg>
);

const TAG_META: Record<
  RoadmapResourceTag,
  { label: string; className: string; icon: ReactNode }
> = {
  donnees: {
    label: 'Base de données',
    className: styles.tagDonnees,
    icon: <DonneesIcon />
  },
  article: {
    label: 'Article',
    className: styles.tagArticle,
    icon: <ArticleIcon />
  },
  reglementation: {
    label: 'Règlementation',
    className: styles.tagReglementation,
    icon: <ReglementationIcon />
  },
  'exemple-diagnostic': {
    label: 'Exemple de diagnostic',
    className: styles.tagExempleDiagnostic,
    icon: <ExempleDiagnosticIcon />
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
