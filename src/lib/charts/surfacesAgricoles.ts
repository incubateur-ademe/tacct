import couleurs from '@/design-system/couleurs';
import { SurfacesAgricolesModel } from '../postgres/models';
import {
  SumWithNullHandling,
  addWithNullHandling
} from '../utils/reusableFunctions/sum';

export const PieChartDataSurfacesAgricoles = (
  surfacesAgricoles: SurfacesAgricolesModel[]
) => {
  const countCulturesPermanentes = SumWithNullHandling(
    surfacesAgricoles.map((el) => {
      const isSecretStatistique =
        el.superficie_sau_cultures_permanentes === null;
      if (!isSecretStatistique) {
        return el.superficie_sau_cultures_permanentes;
      } else {
        return addWithNullHandling(
          el.superficie_sau_cultures_permanentes_vigne,
          el.superficie_sau_cultures_permanentes_fruits,
          el.superficie_sau_cultures_permanentes_autres
        );
      }
    })
  );

  const countSurfacesHerbe = SumWithNullHandling(
    surfacesAgricoles.map((el) => {
      const isSecretStatistique = el.superficie_sau_herbe === null;
      if (!isSecretStatistique) {
        return el.superficie_sau_herbe;
      } else {
        return addWithNullHandling(
          el.superficie_sau_herbe_prairies_productives,
          el.superficie_sau_herbe_prairies_peu_productives,
          el.superficie_sau_herbe_subventions,
          el.superficie_sau_herbe_bois_patures
        );
      }
    })
  );

  const countTerresArables = SumWithNullHandling(
    surfacesAgricoles.map((el) => {
      const isSecretStatistique = el.superficie_sau_terres_arables === null;
      if (!isSecretStatistique) {
        return el.superficie_sau_terres_arables;
      }
      return addWithNullHandling(
        el.superficie_sau_terres_arables_cereales,
        el.superficie_sau_terres_arables_oleagineux,
        el.superficie_sau_terres_arables_fourrageres,
        el.superficie_sau_terres_arables_tubercules,
        el.superficie_sau_terres_arables_legumes_melons_fraises,
        el.superficie_sau_terres_arables_fleurs,
        el.superficie_sau_terres_arables_autres
      );
    })
  );

  const countJardin = SumWithNullHandling(
    surfacesAgricoles.map((el) => el.superficie_sau_jardins)
  );

  const sommeToutesSuperficies = addWithNullHandling(
    countCulturesPermanentes,
    countSurfacesHerbe,
    countTerresArables,
    countJardin
  );

  return [
    {
      id: 'Cultures permanentes',
      count: countCulturesPermanentes,
      color: '#00C190',
      value:
        countCulturesPermanentes !== null && sommeToutesSuperficies !== null
          ? (100 * countCulturesPermanentes) / sommeToutesSuperficies
          : null
    },
    {
      id: 'Surfaces toujours en herbe',
      count: countSurfacesHerbe,
      color: '#009ADC',
      value:
        countSurfacesHerbe !== null && sommeToutesSuperficies !== null
          ? (100 * countSurfacesHerbe) / sommeToutesSuperficies
          : null
    },
    {
      id: 'Terres arables',
      count: countTerresArables,
      color: '#7A49BE',
      value:
        countTerresArables !== null && sommeToutesSuperficies !== null
          ? (100 * countTerresArables) / sommeToutesSuperficies
          : null
    },
    {
      id: 'Jardin',
      count: countJardin,
      color: '#BB43BD',
      value:
        countJardin !== null && sommeToutesSuperficies !== null
          ? (100 * countJardin) / sommeToutesSuperficies
          : null
    }
  ];
};

export const ProgressBarDataSurfacesAgricoles = (
  surfacesAgricoles: SurfacesAgricolesModel[]
) => {
  return [
    {
      'Terres arables': [
        {
          id: 'Céréales',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_terres_arables_cereales
            )
          ),
          color: couleurs.graphiques.vert[3]
        },
        {
          id: 'Oléagineux, protéagineux, plantes à fibres et cultures industrielles protéagineux',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_terres_arables_oleagineux
            )
          ),
          color: couleurs.graphiques.vert[3]
        },
        {
          id: 'Légumes, Fleurs et plantes ornementales',
          value: SumWithNullHandling(
            surfacesAgricoles.map((el) =>
              addWithNullHandling(
                el.superficie_sau_terres_arables_fleurs,
                el.superficie_sau_terres_arables_legumes_melons_fraises,
                el.superficie_sau_terres_arables_autres,
                el.superficie_sau_terres_arables_tubercules
              )
            )
          ),
          color: couleurs.graphiques.vert[3]
        },
        {
          id: 'Cultures fourragères',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_terres_arables_fourrageres
            )
          ),
          color: couleurs.graphiques.vert[3]
        }
      ]
    },
    {
      'Cultures permanentes': [
        {
          id: 'Vignes',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_cultures_permanentes_vigne
            )
          ),
          color: couleurs.graphiques.vert[5]
        },
        {
          id: 'Fruits',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_cultures_permanentes_fruits
            )
          ),
          color: couleurs.graphiques.vert[5]
        },
        {
          id: 'Autres',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_cultures_permanentes_autres
            )
          ),
          color: couleurs.graphiques.vert[5]
        }
      ]
    },
    {
      'Surfaces toujours en herbe': [
        {
          id: 'Pâturages et prés',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_herbe_prairies_productives
            )
          ),
          color: couleurs.graphiques.vert[1]
        },
        {
          id: 'Prairies permanentes peu productives',
          value: SumWithNullHandling(
            surfacesAgricoles.map(
              (el) => el.superficie_sau_herbe_prairies_peu_productives
            )
          ),
          color: couleurs.graphiques.vert[1]
        },
        {
          id: 'Surfaces toujours en herbe non productives et bois pâturés',
          value: SumWithNullHandling(
            surfacesAgricoles.map((el) =>
              addWithNullHandling(
                el.superficie_sau_herbe_subventions,
                el.superficie_sau_herbe_bois_patures
              )
            )
          ),
          color: couleurs.graphiques.vert[1]
        }
      ]
    },
    {
      Jardin: [
        {
          id: 'Jardin',
          value: SumWithNullHandling(
            surfacesAgricoles.map((el) => el.superficie_sau_jardins)
          ),
          color: couleurs.graphiques.vert[2]
        }
      ]
    }
  ];
};
