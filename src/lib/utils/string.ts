/**
 * Tests a value against "yes", 1, "1", "true" ignoring case.
 */
export const isTruthy = (v?: string): boolean => !!v && ["yes", "true", "1"].includes(v.toLowerCase());

/**
 * Tests a value against "no", 0, "0", "false" ignoring case.
 */
export const isFalsy = (v?: string): boolean => !v || ["no", "false", "0"].includes(v.toLowerCase());

/**
 * Escape characters with special meaning either inside or outside character sets.
 *
 * Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
 */
export const escapeStringRegexp = (string: string) =>
  string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

export const ReplaceDisplayEpci = (libelleEpci: string) => {
  return libelleEpci
    .replace("Communauté d'agglomération", 'CA')
    .replace('Communauté de communes', 'CC')
    .replace('Communauté urbaine', 'CU');
};

export const ReplaceSearchEpci = (libelleEpci: string) => {
  return libelleEpci
    .replace('CA ', "Communauté d'agglomération ")
    .replace('CC ', 'Communauté de communes ')
    .replace('CU ', 'Communauté urbaine ');
};

export const slugify = (string: string) =>
  string
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Découpe un texte en lignes d'au plus `maxChars` caractères, sans couper les mots.
 * Utilisé pour les labels d'axe rendus en <tspan> (notamment sur iOS, où
 * foreignObject s'affiche mal).
 */
export const wrapWords = (text: string, maxChars = 14): string[] => {
  const words = String(text).split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};
