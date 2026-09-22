import 'server-only';
import type { CrmErrorResponse } from './types';

/**
 * Mode de transmission des identifiants Mulesoft. La doc d'interopérabilité ne
 * le précise pas : `headers` correspond à la policy « Client ID Enforcement »
 * par défaut d'Anypoint, `basic` à l'en-tête Authorization standard.
 */
export type CrmAuthMode = 'headers' | 'basic';

export function getBaseUrl(): string {
  const url = process.env.MULESOFT_ENV;
  if (!url) throw new Error('MULESOFT_ENV non configuré');
  return url.replace(/\/+$/, '');
}

function getClientId(): string {
  const id = process.env.MULESOFT_CLIENT_ID;
  if (!id) throw new Error('MULESOFT_CLIENT_ID non configuré');
  return id;
}

function getClientSecret(): string {
  const secret = process.env.MULESOFT_CLIENT_SECRET;
  if (!secret) throw new Error('MULESOFT_CLIENT_SECRET non configuré');
  return secret;
}

export function getAuthMode(): CrmAuthMode {
  return process.env.MULESOFT_AUTH_MODE === 'basic' ? 'basic' : 'headers';
}

export function getSource(): string {
  const source = process.env.MULESOFT_SOURCE;
  if (!source) throw new Error('MULESOFT_SOURCE non configuré');
  return source;
}

/** Tag d'origine (champ `rubriques`), tant que l'équipe CRM ne l'a pas validé. */
export function getOriginTags(): string[] {
  const raw = process.env.MULESOFT_ORIGIN_TAG;
  if (!raw) return [];
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function authHeaders(): Record<string, string> {
  const id = getClientId();
  const secret = getClientSecret();
  if (getAuthMode() === 'basic') {
    const encoded = Buffer.from(`${id}:${secret}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }
  return { client_id: id, client_secret: secret };
}

function extractErrorMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as Partial<CrmErrorResponse> & {
      error?: string;
    };
    return parsed.errorDetails?.message ?? parsed.error ?? body.slice(0, 200);
  } catch {
    return body.slice(0, 200);
  }
}

export class CrmError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string
  ) {
    super(message);
    this.name = 'CrmError';
  }
}

/** Format imposé par le CRM : `yyyy-MM-ddT00:00:00`. */
export function toCrmDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
}

/** La doc interdit d'envoyer des balises vides. */
export function stripEmpty<T extends object>(payload: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    cleaned[key as keyof T] = value as T[keyof T];
  }
  return cleaned;
}

export async function crmRequest<T>(
  path: string,
  init: { method: 'GET' | 'POST' | 'PUT'; body?: unknown }
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: init.method,
    headers: {
      ...authHeaders(),
      ...(init.body === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: 'no-store'
  });

  const text = await res.text();

  if (!res.ok) {
    throw new CrmError(
      `[CRM] ${init.method} ${path} → HTTP ${res.status} : ${extractErrorMessage(text)}`,
      res.status,
      text
    );
  }

  return JSON.parse(text) as T;
}
