export const consommationEspacesNafDoc = [
  {
    Variable: 'naf11art12',
    Description:
      'Flux entre NAF (Naturel, Agricole et Forestier) et artificialisé, sur la période 2011-2012'
  },
  {
    Variable: 'art11act12',
    Description:
      "Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné à l'activité sur la période 2011-2012"
  },
  {
    Variable: 'art11hab12',
    Description:
      "Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné à l'habitat sur la période 2011-2012"
  },
  {
    Variable: 'art11mix12',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné au mixte sur la période 2011-2012'
  },
  {
    Variable: 'art11rou12',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné aux infrastructures routières sur la période 2011-2012'
  },
  {
    Variable: 'art11fer12',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné aux infrastructures ferroviaires sur la période 2011-2012'
  },
  {
    Variable: 'art11inc12',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé dont la destination est inconnue sur la période 2011-2012'
  },
  {
    Variable: 'naf11art25',
    Description:
      'Total des flux entre NAF (Naturel, Agricole et Forestier) et artificialisé, sur la période 2011-2025'
  },
  {
    Variable: 'art11act25',
    Description:
      "Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné à l'activité sur la période 2011-2025"
  },
  {
    Variable: 'art11hab25',
    Description:
      "Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné à l'habitat sur la période 2011-2025"
  },
  {
    Variable: 'art11mix25',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné au mixte sur la période 2011-2025'
  },
  {
    Variable: 'art11rou25',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné aux infrastructures routières sur la période 2011-2025'
  },
  {
    Variable: 'art11fer25',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé destiné aux infrastructures ferroviaires sur la période 2011-2025'
  },
  {
    Variable: 'art11inc25',
    Description:
      'Flux NAF (Naturel, Agricole et Forestier) vers artificialisé dont la destination est inconnue sur la période 2011-2025'
  },
  {
    Variable: '',
    Description: ''
  },
  {
    Variable:
      'Nous avons donc naf11art12 = art11act12 + art11hab12 + art11mix12 + art11rou12 + art11fer12 + art11inc12',
    Description: ''
  },
  {
    Variable: '',
    Description: ''
  },
  {
    Variable: 'Source',
    Description: 'CEREMA, 2026 (consultée en septembre 2026)'
  },
  {
    Variable: 'Documentation complète',
    Description:
      'https://www.data.gouv.fr/datasets/consommation-despaces-naturels-agricoles-et-forestiers-du-1er-janvier-2011-au-1er-janvier-2025'
  }
];

export const sitesDeBaignadeDoc = [
  {
    Nomenclature: 'E',
    Description: 'Excellente qualité'
  },
  {
    Nomenclature: 'B',
    Description: 'Bonne qualité'
  },
  {
    Nomenclature: 'S',
    Description: 'Qualité suffisante'
  },
  {
    Nomenclature: 'P',
    Description: 'Insuffisamment de prélèvement'
  },
  {
    Nomenclature: 'I',
    Description: 'Qualité insuffisante'
  },
  {
    Nomenclature: '',
    Description: ''
  },
  {
    Nomenclature:
      "Le nombre situé avant la lettre correspond aux nombres de prélèvements effectués dans l'année.",
    Description: ''
  },
  {
    Nomenclature: '',
    Description: ''
  },
  {
    Nomenclature: 'Source',
    Description: 'Agences de l’eau'
  },
  {
    Nomenclature: 'Documentation complète',
    Description:
      'https://sextant.ifremer.fr/sextant_data/DCSMM_EVAL2024/SOURCES/MSANTE/618_msante_classement_eaux_baignades_2017_2020.pdf' // ou https://baignades.sante.gouv.fr/baignades/homeMap.do#a
  }
];

export const surfacesEnBioDoc = [
  {
    Nomenclature: 'part_agribio_surf',
    Description: 'Part des surfaces en agriculture biologique (AB)'
  },
  {
    Nomenclature: 'saue',
    Description: 'Surface agricole utilisée des exploitations'
  },
  {
    Nomenclature: 'agribio_surf',
    Description: 'Surface en agriculture biologique'
  },
  {
    Nomenclature: '',
    Description: ''
  },
  {
    Nomenclature: 'Source',
    Description:
      'Donnée produite par l’AGRESTE, 2020 et extraite du catalogue DiDo (consultée en juillet 2025)'
  },
  {
    Nomenclature: 'Documentation complète',
    Description:
      'https://www.statistiques.developpement-durable.gouv.fr/catalogue?page=dataset&datasetId=632956d8eae137714f60ae22'
  }
];

export const aot40Doc = [
  {
    '': 'Source',
    '': 'Geod’air (2024)'
  },
  {
    '': 'Documentation complète',
    '': 'https://www.geodair.fr/reglementation'
  }
];

export const secheressesPasseesDoc = [
  {
    Nomenclature: 'SOU',
    Description: 'Eaux souterraines'
  },
  {
    Nomenclature: 'AEP',
    Description: 'Eaux potables'
  },
  {
    Nomenclature: 'SUP',
    Description: 'Eaux superficielles'
  },
  {
    Nomenclature: '',
    Description: ''
  },
  {
    Nomenclature: 'Niveaux de restriction',
    Description:
      'Les restrictions ont 4 niveaux de sévérité croissante : 1) vigilance, 2) alerte, 3) alerte renforcée, 4) crise.'
  }
];
