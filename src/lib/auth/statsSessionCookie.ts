export function statsSessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.stats-session-token'
    : 'authjs.stats-session-token';
}
