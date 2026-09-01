'use server';

import { randomUUID } from 'node:crypto';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { encryptField } from '@/lib/crypto/user-crypto';
import { prisma } from '@/lib/queries/db';
import {
  Besoin,
  derniereEtape,
  ETAT_INITIAL,
  EtapeQuestionnaire,
  EtatQuestionnaire,
  NOMBRE_BESOINS,
  Profil,
  TypeTerritoire,
  estBesoin,
  estProfil,
  estTypeTerritoire,
  rechercheDuType,
  reponsesObligatoiresCompletes,
  sequenceQuestions,
  typeTerritoireAutorise
} from '@/lib/questionnaire-de-connexion/types';

export interface ResultatQuestionnaire {
  ok: boolean;
  termine: boolean;
}

const ECHEC: ResultatQuestionnaire = { ok: false, termine: false };

const construireEtat = (ligne: {
  profil: string | null;
  profil_autre: string | null;
  territoire_type: string | null;
  territoire_code: string | null;
  territoire_libelle: string | null;
  territoire_autre: string | null;
  wants_beta_features: boolean;
  recontact_email: string | null;
  email: string;
  user_besoin: { besoin: string; rang: number; besoin_autre: string | null }[];
}): EtatQuestionnaire => {
  const besoinsTries = [...ligne.user_besoin].sort((a, b) => a.rang - b.rang);
  return {
    profil:
      ligne.profil && estProfil(ligne.profil) ? (ligne.profil as Profil) : null,
    profilAutre: ligne.profil_autre ?? '',
    typeTerritoire:
      ligne.territoire_type && estTypeTerritoire(ligne.territoire_type)
        ? (ligne.territoire_type as TypeTerritoire)
        : null,
    territoireCode: ligne.territoire_code ?? '',
    territoireLibelle: ligne.territoire_libelle ?? '',
    territoireAutre: ligne.territoire_autre ?? '',
    besoins: besoinsTries
      .map((entree) => entree.besoin)
      .filter(estBesoin) as Besoin[],
    besoinAutre:
      besoinsTries.find((entree) => entree.besoin_autre)?.besoin_autre ?? '',
    // La Q4 est la dernière question : on ne la reprend jamais avec une réponse,
    // donc elle repart toujours vierge, sans hériter d'un `wants_beta_features`
    // laissé par l'ancien espace.
    optInBeta: false,
    emailRecontact: ligne.email
  };
};

const chargerEtatBrut = async (userId: string) => {
  const ligne = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      profil: true,
      profil_autre: true,
      territoire_type: true,
      territoire_code: true,
      territoire_libelle: true,
      territoire_autre: true,
      wants_beta_features: true,
      recontact_email: true,
      email: true,
      user_besoin: {
        select: { besoin: true, rang: true, besoin_autre: true }
      }
    }
  });
  return ligne ? construireEtat(ligne) : null;
};

export const chargerQuestionnaire =
  async (): Promise<EtatQuestionnaire | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    try {
      return (await chargerEtatBrut(user.id)) ?? ETAT_INITIAL;
    } catch (error) {
      console.error('chargerQuestionnaire error', error);
      return null;
    }
  };

/**
 * Bascule `questionnaire_validated` dès que l'étape enregistrée est la dernière
 * de la séquence du profil et que les questions obligatoires sont remplies.
 */
const validerSiTermine = async (
  userId: string,
  etapeEnregistree: EtapeQuestionnaire
): Promise<boolean> => {
  const etat = await chargerEtatBrut(userId);
  if (!etat) return false;
  if (derniereEtape(etat.profil) !== etapeEnregistree) return false;
  if (!reponsesObligatoiresCompletes(etat)) return false;

  await prisma.user.update({
    where: { id: userId },
    data: { questionnaire_validated: true, updated_at: new Date() }
  });
  return true;
};

export const enregistrerProfil = async (
  profil: string,
  profilAutre: string
): Promise<ResultatQuestionnaire> => {
  const user = await getCurrentUser();
  if (!user) return ECHEC;
  if (!estProfil(profil)) return ECHEC;
  if (profil === 'autre' && !profilAutre.trim()) return ECHEC;

  const sequence = sequenceQuestions(profil);

  const ligne = await prisma.user.findUnique({
    where: { id: user.id },
    select: { territoire_type: true }
  });
  const typeCourant = ligne?.territoire_type;

  // Les réponses qui sortent de la séquence du nouveau profil sont effacées.
  const territoireConserve =
    sequence.includes('territoire') &&
    (!typeCourant ||
      (estTypeTerritoire(typeCourant) &&
        typeTerritoireAutorise(profil, typeCourant)));
  const remiseAZeroTerritoire = territoireConserve
    ? {}
    : {
        territoire_type: null,
        territoire_code: null,
        territoire_libelle: null,
        territoire_autre: null
      };
  const remiseAZeroBeta = sequence.includes('beta')
    ? {}
    : { wants_beta_features: false, recontact_email: null };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        profil,
        profil_autre: profil === 'autre' ? profilAutre.trim() : null,
        updated_at: new Date(),
        ...remiseAZeroTerritoire,
        ...remiseAZeroBeta
      }
    });
    return { ok: true, termine: await validerSiTermine(user.id, 'profil') };
  } catch (error) {
    console.error('enregistrerProfil error', error);
    return ECHEC;
  }
};

export const enregistrerTerritoire = async (payload: {
  typeTerritoire: string;
  territoireCode: string;
  territoireLibelle: string;
  territoireAutre: string;
}): Promise<ResultatQuestionnaire> => {
  const user = await getCurrentUser();
  if (!user) return ECHEC;
  if (!estTypeTerritoire(payload.typeTerritoire)) return ECHEC;

  const profil = user.profil && estProfil(user.profil) ? user.profil : null;
  if (!typeTerritoireAutorise(profil, payload.typeTerritoire)) return ECHEC;

  const recherchable = rechercheDuType(payload.typeTerritoire);
  const libelle = payload.territoireLibelle.trim();
  const autre = payload.territoireAutre.trim();
  if (recherchable ? !libelle && !autre : !autre) return ECHEC;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        territoire_type: payload.typeTerritoire,
        territoire_code: libelle ? payload.territoireCode.trim() || null : null,
        territoire_libelle: libelle || null,
        territoire_autre: autre || null,
        updated_at: new Date()
      }
    });
    return { ok: true, termine: await validerSiTermine(user.id, 'territoire') };
  } catch (error) {
    console.error('enregistrerTerritoire error', error);
    return ECHEC;
  }
};

export const enregistrerBesoins = async (
  besoins: string[],
  besoinAutre: string
): Promise<ResultatQuestionnaire> => {
  const user = await getCurrentUser();
  if (!user) return ECHEC;
  if (besoins.length !== NOMBRE_BESOINS) return ECHEC;
  if (!besoins.every(estBesoin)) return ECHEC;
  if (new Set(besoins).size !== besoins.length) return ECHEC;
  if (besoins.includes('autre') && !besoinAutre.trim()) return ECHEC;

  try {
    // Suppression puis réinsertion : la contrainte UNIQUE (user_id, rang)
    // interdit tout réordonnancement en place.
    await prisma.$transaction([
      prisma.user_besoin.deleteMany({ where: { user_id: user.id } }),
      prisma.user_besoin.createMany({
        data: besoins.map((besoin, index) => ({
          id: randomUUID(),
          user_id: user.id,
          besoin,
          rang: index + 1,
          besoin_autre: besoin === 'autre' ? besoinAutre.trim() : null
        }))
      })
    ]);
    return { ok: true, termine: await validerSiTermine(user.id, 'besoins') };
  } catch (error) {
    console.error('enregistrerBesoins error', error);
    return ECHEC;
  }
};

export const enregistrerBeta = async (
  optIn: boolean,
  email: string
): Promise<ResultatQuestionnaire> => {
  const user = await getCurrentUser();
  if (!user) return ECHEC;
  const adresse = email.trim();
  if (optIn && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) return ECHEC;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wants_beta_features: optIn,
        recontact_email: optIn ? encryptField(adresse) : null,
        updated_at: new Date()
      }
    });
    return { ok: true, termine: await validerSiTermine(user.id, 'beta') };
  } catch (error) {
    console.error('enregistrerBeta error', error);
    return ECHEC;
  }
};
