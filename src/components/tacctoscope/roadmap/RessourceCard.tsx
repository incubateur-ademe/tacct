import { RoadmapResource, RoadmapResourceTag } from '@/lib/tacctoscope/content/roadmapResources';
import styles from '@/app/(main)/tacctoscope/feuille-de-route/roadmap.module.scss';

const TAG_META: Record<
  RoadmapResourceTag,
  { label: string; className: string; icon: React.ReactNode }
> = {
  donnees: {
    label: 'Données',
    className: styles.tagDonnees,
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2 13.333V2h1.333v11.333H14v1.334H2zm3-1.333V6.667h2V12H5zm3.333 0V4.667h2V12h-2zm3.334 0V8.667h2V12h-2z"
          fill="currentColor"
        />
      </svg>
    )
  },
  'retour-experience': {
    label: 'Retour d’expérience',
    className: styles.tagRetourExperience,
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4.667 12.667L2 14.667V3.333A.667.667 0 012.667 2.667h10.666a.667.667 0 01.667.666v8.667a.667.667 0 01-.667.667H4.667z"
          fill="currentColor"
        />
      </svg>
    )
  }
};

const ExternalLinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
      fill="#038278"
    />
  </svg>
);

interface Props {
  ressource: RoadmapResource;
}

export const RessourceCard = ({ ressource }: Props) => {
  const meta = TAG_META[ressource.tag];
  return (
    <a
      href={ressource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.ressourceCard}
    >
      <span className={`${styles.tag} ${meta.className}`}>
        {meta.icon}
        {meta.label}
      </span>
      <span className={styles.ressourceCardText}>
        <span className={styles.ressourceCardTitle}>{ressource.title}</span>
        {ressource.description && (
          <span className={styles.ressourceCardDescription}>
            {ressource.description}
          </span>
        )}
      </span>
      <span className={styles.ressourceCardAction}>
        <ExternalLinkIcon />
      </span>
    </a>
  );
};
