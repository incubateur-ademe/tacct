export const listeArrondissements = [
  '13201', '13202', '13203', '13204', '13205', '13206',
  '13207', '13208', '13209', '13210', '13211', '13212', 
  '13213', '13214', '13215', '13216', '75101', '75102', 
  '75103', '75104', '75105', '75106', '75107', '75108', 
  '75109', '75110', '75111', '75112', '75113', '75114', 
  '75115', '75116', '75117', '75118', '75119', '75120',
  '69381', '69382', '69383', '69384', '69385', '69386', 
  '69387', '69388', '69389',
];

export const listeVillesAvecArrondissements = ['13055', '75056', '69123'];

const villeDeLArrondissement = (code: string) =>
  code.startsWith('75') ? '75056' : code.startsWith('69') ? '69123' : '13055';

export const sansDoublonArrondissements = <T>(
  elements: T[],
  codeDe: (element: T) => string,
  aUneValeur: (code: string) => boolean
): T[] => {
  const villesDetaillees = new Set<string>(
    listeArrondissements.filter(aUneValeur).map(villeDeLArrondissement)
  );
  return elements.filter((element) => {
    const code = codeDe(element);
    if (listeVillesAvecArrondissements.includes(code)) {
      return !villesDetaillees.has(code);
    }
    if (listeArrondissements.includes(code)) return aUneValeur(code);
    return true;
  });
};
