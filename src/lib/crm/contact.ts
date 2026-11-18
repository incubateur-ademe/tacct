import 'server-only';
import {
  CrmError,
  crmRequest,
  getOriginTags,
  getSource,
  isCrmConfigured,
  stripEmpty,
  toCrmDate,
  toCrmDateTime
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
    dateCreation: toCrmDateTime(now)
  };
}

function describeError(err: unknown): string {
  if (err instanceof CrmError) {
    const correlationId = /"correlationId"\s*:\s*"([^"]+)"/.exec(err.body)?.[1];
    return `HTTP ${err.status}${correlationId ? ` (correlationId ${correlationId})` : ''}`;
  }
  return err instanceof Error ? err.message : String(err);
}

/**
 * Contact absent → POST. Contact existant (autre service ADEME) → PUT sans nom
 * ni prénom : la source s'ajoute à la liste et les champs non envoyés sont conservés.
 * Ne lève jamais : un échec CRM ne doit pas bloquer l'appelant.
 */
export async function synchroniserContact(
  user: AuthenticatedUser,
  now: Date
): Promise<void> {
  if (!user.email || !isCrmConfigured()) return;

  let existe: boolean;
  try {
    await getContact(user.email);
    existe = true;
  } catch (err) {
    if (!(err instanceof CrmError && err.status === 404)) {
      console.error('[CRM] lecture du contact échouée :', describeError(err));
      return;
    }
    existe = false;
  }

  try {
    if (existe) {
      const res = await updateContact({
        email: user.email,
        acceptationRGPD: user.acceptationRGPD,
        dateModification: toCrmDateTime(now)
      });
      console.info(`[CRM] contact existant mis à jour en file (correlationId ${res.correlationId})`);
    } else {
      const res = await createContact(contactFromAuth(user, now));
      console.info(`[CRM] contact créé en file (correlationId ${res.correlationId})`);
    }
  } catch (err) {
    console.error(
      `[CRM] ${existe ? 'mise à jour' : 'création'} du contact échouée :`,
      describeError(err)
    );
  }
}

export function connectionUpdate(email: string, now: Date): CrmContactInput {
  return { email, dateConnexion: toCrmDate(now) };
}
