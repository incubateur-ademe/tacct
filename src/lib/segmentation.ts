// Point d'entrée unique des règles « profil × membre_communaute → affichage ».
// Les données brutes viennent de getCurrentUser() / /api/proconnect/me ; ce
// module ne fait que décider quoi en faire, page par page ou bloc par bloc.

import { estProfil, Profil } from '@/lib/questionnaire-de-connexion/types';

const PROFILS_DEVERROUILLES: readonly Profil[] = ['cdm', 'elu', 'responsable'];

export const estProfilDeverrouille = (
  profil: string | null | undefined
): boolean => !!profil && estProfil(profil) && PROFILS_DEVERROUILLES.includes(profil);
