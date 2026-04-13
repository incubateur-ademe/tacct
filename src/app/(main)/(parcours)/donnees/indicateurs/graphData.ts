import couleurs from '@/design-system/couleurs';
import { GrandAgeDto } from '@/lib/dto';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { sumProperty } from './fonctions';

export const GrandAge75LineChartYData = (
  grandAgeTerritoire: GrandAgeDto[]
) => {
  const calculatePercent = (numerator: number, denominator: number) => {
    const result = (100 * numerator) / denominator;
    return isFinite(result) ? result.toFixed(2) : '0';
  };

  return {
    over_75_1968_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_1968'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_1968') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_1968')
    ),
    over_75_1975_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_1975'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_1975') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_1975')
    ),
    over_75_1982_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_1982'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_1982') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_1982')
    ),
    over_75_1990_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_1990'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_1990') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_1990')
    ),
    over_75_1999_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_1999'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_1999') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_1999')
    ),
    over_75_2006_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_2006'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_2006') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_2006')
    ),
    over_75_2011_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_2011'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_2011') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_2011')
    ),
    over_75_2016_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_2016'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_2016') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_2016')
    ),
    over_75_2022_percent: calculatePercent(
      sumProperty(grandAgeTerritoire, 'over_75_sum_2022'),
      sumProperty(grandAgeTerritoire, 'to_75_sum_2022') +
        sumProperty(grandAgeTerritoire, 'under_4_sum_2022')
    )
  };
};

export const EmploisEnExterieurPieChartData = (sums: {
  [key: string]: number;
}) => [
  {
    id: 'Agriculture, sylviculture et pêche',
    label: 'Agriculture',
    count: sums.sumAgriculture,
    value: Number(
      ((100 * sums.sumAgriculture) / Sum(Object.values(sums))).toFixed(1)
    )
  },
  {
    id: 'Industrie manufacturière, industries extractives et autres',
    label: 'Industries',
    count: sums.sumIndustries,
    value: Number(
      ((100 * sums.sumIndustries) / Sum(Object.values(sums))).toFixed(1)
    )
  },
  {
    id: 'Construction',
    label: 'Construction',
    count: sums.sumConstruction,
    value: Number(
      ((100 * sums.sumConstruction) / Sum(Object.values(sums))).toFixed(1)
    )
  },
  {
    id: 'Commerce, transports et services divers',
    label: 'Commerces et transports',
    count: sums.sumCommerce,
    value: Number(
      ((100 * sums.sumCommerce) / Sum(Object.values(sums))).toFixed(1)
    )
  },
  {
    id: 'Administration publique, enseignement, santé humaine et action sociale',
    label: 'Administrations',
    count: sums.sumAdministration,
    value: Number(
      ((100 * sums.sumAdministration) / Sum(Object.values(sums))).toFixed(1)
    )
  }
];

export const DateConstructionResidencesBarChartData = (averages: {
  [key: string]: number;
}) => [
  {
    periode: 'Avant 1919',
    'Votre territoire': averages.averageAgeBatiPre19.toFixed(1),
    'Votre territoireColor': couleurs.graphiques.bleu[1],
    France: 20.5,
    FranceColor: couleurs.graphiques.rouge[3]
  },
  {
    periode: '1919-1945',
    'Votre territoire': averages.averageAgeBati1945.toFixed(1),
    'Votre territoireColor': couleurs.graphiques.bleu[1],
    France: 9.2,
    FranceColor: couleurs.graphiques.rouge[3]
  },
  {
    periode: '1946-1990',
    'Votre territoire': averages.averageAgeBati4690.toFixed(1),
    'Votre territoireColor': couleurs.graphiques.bleu[1],
    France: 43.4,
    FranceColor: couleurs.graphiques.rouge[3]
  },
  {
    periode: '1991-2005',
    'Votre territoire': averages.averageAgeBati9105.toFixed(1),
    'Votre territoireColor': couleurs.graphiques.bleu[1],
    France: 15.5,
    FranceColor: couleurs.graphiques.rouge[3]
  },
  {
    periode: 'Après 2006',
    'Votre territoire': averages.averageAgeBatiPost06.toFixed(1),
    'Votre territoireColor': couleurs.graphiques.bleu[1],
    France: 11.4,
    FranceColor: couleurs.graphiques.rouge[3]
  }
];
