import { SecheressesPasseesModel } from "../postgres/models";

type TypeRestrictions = "alerte" | "alerte_renforcee" | "crise" | "vigilance" | null;

export const calculerMoyenneJoursMensuelleAvecRestriction = ({
  secheresses
}: {
  secheresses: SecheressesPasseesModel[];
}) => {
  const toutesLesRestrictions = secheresses.flatMap(s =>
    s.restrictions
      ? JSON.parse(s.restrictions.replace(/None/g, 'null').replace(/'/g, '"'))
      : []
  );

  if (toutesLesRestrictions.length === 0) return { moyenne: 0, annee: null };

  const joursParAnneeEtMois: Record<number, Record<number, Set<string>>> = {};

  toutesLesRestrictions.forEach((restriction: {
    AEP: string | null;
    SOU: string | null;
    SUP: string | null;
    end_date: string;
    start_date: string;
  }) => {
    const { AEP, SOU, SUP, start_date, end_date } = restriction;

    if (!AEP && !SOU && !SUP) return;

    const dateDebut = new Date(start_date);
    const dateFin = new Date(end_date);

    for (let d = new Date(dateDebut); d <= dateFin; d.setDate(d.getDate() + 1)) {
      const annee = d.getFullYear();
      const mois = d.getMonth() + 1;
      const cle = d.toISOString().slice(0, 10);

      if (annee < 2020) continue;

      if (!joursParAnneeEtMois[annee]) joursParAnneeEtMois[annee] = {};
      if (!joursParAnneeEtMois[annee][mois]) joursParAnneeEtMois[annee][mois] = new Set();

      joursParAnneeEtMois[annee][mois].add(cle);
    }
  });

  const totalParAnnee: Record<number, number> = {};
  for (const [annee, moisMap] of Object.entries(joursParAnneeEtMois)) {
    totalParAnnee[Number(annee)] = Object.values(moisMap).reduce((sum, jours) => sum + jours.size, 0);
  }

  const anneeMax = Number(Object.entries(totalParAnnee).sort((a, b) => b[1] - a[1])[0][0]);

  const moisDeLAnneeMax = joursParAnneeEtMois[anneeMax] ?? {};
  let somme = 0;
  for (let mois = 1; mois <= 12; mois++) {
    somme += moisDeLAnneeMax[mois]?.size ?? 0;
  }

  return { moyenne: Math.round(somme / 12), annee: anneeMax };
};

const ORDRE_GRAVITE: TypeRestrictions[] = ['vigilance', 'alerte', 'alerte_renforcee', 'crise'];

const graviteMax = (a: TypeRestrictions, b: TypeRestrictions): TypeRestrictions => {
  const indexA = a ? ORDRE_GRAVITE.indexOf(a) : -1;
  const indexB = b ? ORDRE_GRAVITE.indexOf(b) : -1;
  return indexA >= indexB ? a : b;
};

export const transformerRestrictionsParAnneeUnique = (restrictions: {
  AEP: TypeRestrictions;
  SOU: TypeRestrictions;
  SUP: TypeRestrictions;
  end_date: string;
  start_date: string;
}[]) => {
  const graviteParJour = new Map<string, TypeRestrictions>();

  restrictions.forEach(restriction => {
    const { AEP, SOU, SUP, start_date, end_date } = restriction;

    const graviteDuJour = [AEP, SOU, SUP].reduce<TypeRestrictions>(
      (max, type) => graviteMax(max, type),
      null
    );

    if (!graviteDuJour) return;

    const dateDebut = new Date(start_date);
    const dateFin = new Date(end_date);

    for (let d = new Date(dateDebut); d <= dateFin; d.setDate(d.getDate() + 1)) {
      const cle = d.toISOString().slice(0, 10);
      const graviteExistante = graviteParJour.get(cle) ?? null;
      graviteParJour.set(cle, graviteMax(graviteExistante, graviteDuJour));
    }
  });

  const compteurParAnnee: Record<string, {
    annee: string;
    vigilance: number;
    alerte: number;
    alerte_renforcee: number;
    crise: number;
  }> = {};

  graviteParJour.forEach((gravite, cle) => {
    const annee = cle.slice(0, 4);

    if (!compteurParAnnee[annee]) {
      compteurParAnnee[annee] = { annee, vigilance: 0, alerte: 0, alerte_renforcee: 0, crise: 0 };
    }

    if (gravite) compteurParAnnee[annee][gravite]++;
  });

  return Object.values(compteurParAnnee).sort((a, b) => a.annee.localeCompare(b.annee));
};

export const transformerRestrictionsSaisons = (restrictions: {
  AEP: TypeRestrictions;
  SOU: TypeRestrictions;
  SUP: TypeRestrictions;
  end_date: string;
  start_date: string;
}[]) => {
  const getSaison = (mois: number): string => {
    if (mois === 12 || mois === 1 || mois === 2) return 'Hiver';
    if (mois >= 3 && mois <= 5) return 'Printemps';
    if (mois >= 6 && mois <= 8) return 'Été';
    return 'Automne';
  };

  const joursParSaisonEtAnnee: Record<string, Record<string, Set<string>>> = {
    'Hiver': {},
    'Printemps': {},
    'Été': {},
    'Automne': {}
  };

  restrictions.forEach(restriction => {
    const { AEP, SOU, SUP, start_date, end_date } = restriction;

    if (!AEP && !SOU && !SUP) return;

    const dateDebut = new Date(start_date);
    const dateFin = new Date(end_date);

    for (let d = new Date(dateDebut); d <= dateFin; d.setDate(d.getDate() + 1)) {
      const annee = d.getFullYear();

      if (annee < 2020 || annee > 2025) continue;

      const anneeStr = annee.toString();
      const mois = d.getMonth() + 1;
      const saison = getSaison(mois);
      const cle = d.toISOString().slice(0, 10);

      if (!joursParSaisonEtAnnee[saison][anneeStr]) {
        joursParSaisonEtAnnee[saison][anneeStr] = new Set();
      }

      joursParSaisonEtAnnee[saison][anneeStr].add(cle);
    }
  });

  return ['Hiver', 'Printemps', 'Été', 'Automne'].map(saison => {
    const parAnnee: Record<string, number> = {};
    for (const [annee, jours] of Object.entries(joursParSaisonEtAnnee[saison])) {
      parAnnee[annee] = jours.size;
    }
    return { saison, ...parAnnee };
  });
};
