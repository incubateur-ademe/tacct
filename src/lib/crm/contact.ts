import 'server-only';
import {
  crmRequest,
  getOriginTags,
  getSource,
  stripEmpty,
  toCrmDate
} from './client';
import type {
  CrmContact,
  CrmContactInput,
  CrmGetResponse,
  CrmQueueResponse
} from './types';

const CONTACTS_PATH = '/personnes';

function buildPayload(input: CrmContactInput): Partial<CrmContact> {
  const originTags = getOriginTags();
  const rubriques = [...(input.rubriques ?? []), ...originTags];

  return stripEmpty<CrmContact>({
    ...input,
    source: getSource(),
    rubriques: Array.from(new Set(rubriques))
  });
}

export async function createContact(
  input: CrmContactInput
): Promise<CrmQueueResponse> {
  return crmRequest<CrmQueueResponse>(CONTACTS_PATH, {
    method: 'POST',
    body: buildPayload(input)
  });
}

export async function updateContact(
  input: CrmContactInput
): Promise<CrmQueueResponse> {
  return crmRequest<CrmQueueResponse>(
    `${CONTACTS_PATH}/mail/${encodeURIComponent(input.email)}`,
    { method: 'PUT', body: buildPayload(input) }
  );
}

/** À n'utiliser qu'après authentification de l'utilisateur concerné. */
export async function getContact(email: string): Promise<CrmGetResponse> {
  return crmRequest<CrmGetResponse>(
    `${CONTACTS_PATH}/mail/${encodeURIComponent(email)}`,
    { method: 'GET' }
  );
}

interface AuthenticatedUser {
  email: string;
  givenName?: string;
  familyName?: string;
  siret?: string;
  acceptationRGPD?: boolean;
}

export function contactFromAuth(
  user: AuthenticatedUser,
  now: Date
): CrmContactInput {
  return {
    email: user.email,
    prenom: user.givenName,
    nom: user.familyName,
    siret: user.siret,
    acceptationRGPD: user.acceptationRGPD,
    dateCreation: toCrmDate(now)
  };
}

export function connectionUpdate(email: string, now: Date): CrmContactInput {
  return { email, dateConnexion: toCrmDate(now) };
}
