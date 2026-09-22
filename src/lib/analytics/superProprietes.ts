import type { PostHog } from 'posthog-js';

/**
 * Les super-properties sont ajoutées à tous les événements suivants, sans
 * créer de profil Person : aucun `identify()` n'est appelé. Elles sont posées
 * après le premier `$pageview` de la page (le temps de l'appel réseau), d'où
 * l'agrégation par session côté requête Metabase.
 */
export const appliquerSuperProprietesUtilisateur = (
  posthog: PostHog,
  utilisateurId: string | null
): void => {
  if (utilisateurId) {
    posthog.register({ est_connecte: true, user_id: utilisateurId });
    return;
  }
  posthog.unregister('est_connecte');
  posthog.unregister('user_id');
};
