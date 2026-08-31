// Point d'entrée unique des règles « profil × membre_communaute → affichage ».
// Les données brutes viennent de getCurrentUser() / /api/proconnect/me ; ce
// module ne fait que décider quoi en faire, page par page ou bloc par bloc.

import { estProfil, Profil } from '@/lib/questionnaire-de-connexion/types';

const PROFILS_DEVERROUILLES: readonly Profil[] = ['cdm', 'elu', 'responsable'];

export const estProfilDeverrouille = (
  profil: string | null | undefined
): boolean => !!profil && estProfil(profil) && PROFILS_DEVERROUILLES.includes(profil);

export const estProfilElu = (profil: string | null | undefined): boolean =>
  profil === 'elu';

export const estProfilBe = (profil: string | null | undefined): boolean =>
  profil === 'be';

export const estProfilAdminEtat = (profil: string | null | undefined): boolean =>
  profil === 'admin' || profil === 'etat';

export const estProfilEntreprise = (profil: string | null | undefined): boolean =>
  profil === 'entreprise';

export const estProfilAutre = (profil: string | null | undefined): boolean =>
  profil === 'autre';

export type SectionEspace =
  | 'outils'
  | 'communaute'
  | 'liens-utiles'
  | 'suggestions';

export const sectionsEspace = (
  profil: string | null | undefined
): SectionEspace[] => {
  if (profil === 'elu') {
    return ['communaute', 'outils', 'liens-utiles', 'suggestions'];
  }
  if (profil === 'cdm' || profil === 'responsable') {
    return ['outils', 'communaute', 'suggestions'];
  }
  if (profil === 'be') {
    return ['outils', 'liens-utiles', 'suggestions'];
  }
  if (profil === 'admin' || profil === 'etat') {
    return ['liens-utiles', 'suggestions'];
  }
  if (profil === 'entreprise') {
    return ['liens-utiles', 'suggestions'];
  }
  if (profil === 'autre') {
    return ['liens-utiles', 'suggestions'];
  }
  return ['outils', 'suggestions'];
};
