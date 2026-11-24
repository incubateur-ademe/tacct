
export const ColumnLibelleCheck = (type: string): string => {
  return type === 'pnr'
    ? 'libelle_pnr'
    : type === 'petr'
      ? 'libelle_petr'
      : type === 'ept'
        ? 'ept'
        : type === 'epci'
          ? 'libelle_epci'
          : type === 'departement'
            ? 'libelle_departement'
            : 'libelle_geographique';
};

export const ColumnCodeCheck = (type: string): string => {
  return type === 'pnr'
        ? 'code_pnr'
        : type === 'petr'
          ? 'libelle_petr'
          : type === 'ept'
            ? 'ept'
            : type === 'epci' 
              ? 'epci'
              : type === 'departement'
                ? 'departement'
                : 'code_geographique'
}

export const FiltreTerritoire = (type: string, code: string, libelle: string) =>
  type === 'polem'
    ? { code_polem: { has: code } }
    : { [ColumnCodeCheck(type)]: type === 'petr' || type === 'ept' ? libelle : code };
