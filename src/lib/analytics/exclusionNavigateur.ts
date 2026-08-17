export const EXCLUSION_PARAM = 'exclure_navigateur';
export const EXCLUSION_COOKIE = 'tacct_exclure_navigateur';
export const EXCLUSION_MAX_AGE = 60 * 60 * 24 * 365;

const lireCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${EXCLUSION_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
};

const lireStorage = (): string | null => {
  try {
    return window.localStorage.getItem(EXCLUSION_COOKIE);
  } catch {
    return null;
  }
};

const ecrireStorage = (valeur: string | null): void => {
  try {
    if (valeur === null) {
      window.localStorage.removeItem(EXCLUSION_COOKIE);
    } else {
      window.localStorage.setItem(EXCLUSION_COOKIE, valeur);
    }
  } catch {
    // Safari en navigation privée peut refuser l'écriture
  }
};

/**
 * Le cookie posé par le middleware fait foi ; le localStorage sert de secours
 * quand le cookie a été purgé par le navigateur.
 */
export const resoudreExclusionNavigateur = (): boolean => {
  if (typeof window === 'undefined') return false;
  const cookie = lireCookie();
  if (cookie === '1') {
    ecrireStorage('1');
    return true;
  }
  if (cookie === '0') {
    ecrireStorage(null);
    return false;
  }
  return lireStorage() === '1';
};

export const estNavigateurExclu = (): boolean => {
  if (typeof window === 'undefined') return false;
  const cookie = lireCookie();
  if (cookie !== null) return cookie === '1';
  return lireStorage() === '1';
};
