import qualiteBon from '@/assets/icons/qualite_baignade_bon.svg';
import qualiteExcellent from '@/assets/icons/qualite_baignade_excellent.svg';
import qualiteInsuffisant from '@/assets/icons/qualite_baignade_insuffisant.svg';
import qualiteManquePrelevement from '@/assets/icons/qualite_baignade_manque_prelevement.svg';
import qualiteNonClasse from '@/assets/icons/qualite_baignade_non_classe.svg';
import qualiteSuffisant from '@/assets/icons/qualite_baignade_suffisant.svg';
import couleurs from '@/design-system/couleurs';

export const qualiteEauxBaignadelegends = [
  {
    value: 'Excellent',
    icon: qualiteExcellent
  },
  {
    value: 'Bon',
    icon: qualiteBon
  },
  {
    value: 'Suffisant',
    icon: qualiteSuffisant
  },
  {
    value: 'Insuffisant',
    icon: qualiteInsuffisant
  },
  {
    value: 'Site non classé',
    icon: qualiteNonClasse
  },
  {
    value: 'Insuffisamment de prélèvement',
    icon: qualiteManquePrelevement
  }
];

export const etatCoursDeauLegends = [
  {
    value: 'Très bon',
    color: '#0095C8'
  },
  {
    value: 'Bon',
    color: '#00C190'
  },
  {
    value: 'Moyen',
    color: '#FFCF5E'
  },
  {
    value: 'Médiocre',
    color: '#F66E19'
  },
  {
    value: 'Mauvais',
    color: '#B5000E'
  },
  {
    value: 'Indéterminé/pas de données',
    color: '#9D9C9C'
  }
];

export const aot40Legends = [
  {
    value: '> 36 000 µg/m³',
    color: '#5524A0'
  },
  {
    value: '36 000 - 27 000 µg/m³',
    color: '#E8323B'
  },
  {
    value: '27 000 - 18 000 µg/m³',
    color: '#FFCF5E'
  },
  {
    value: '18 000 - 12 000 µg/m³',
    color: '#3E8F3E'
  },
  {
    value: '12 000 - 6 000 µg/m³',
    color: '#009ADC'
  },
  {
    value: '< 6 000 µg/m³',
    color: '#5EEDF3'
  }
];

export const travailExterieurPieChartLegend = [
  {
    value: 'Agriculture',
    color: couleurs.graphiques.jaune[4]
  },
  {
    value: 'Industries',
    color: couleurs.graphiques.orange[3]
  },
  {
    value: 'Construction',
    color: couleurs.graphiques.violet[2]
  },
  {
    value: 'Commerces et transports',
    color: couleurs.graphiques.vert[1]
  },
  {
    value: 'Administrations',
    color: couleurs.graphiques.bleu[5]
  }
];

export const feuxForetLegend = [
  {
    value: '< 500 m²',
    color: '#ECD8FE'
  },
  {
    value: '500 - 1 000 m²',
    color: '#C48EF6'
  },
  {
    value: '1 000 - 2 000 m²',
    color: '#8C58BB'
  },
  {
    value: '2 000 - 5 000 m²',
    color: '#6E3F99'
  },
  {
    value: '> 5 000 m²',
    color: '#42255C'
  }
];

export const chefsExploitationLegend = [
  {
    value: '< 30 ans',
    color: '#ECD8FE'
  },
  {
    value: '30 - 40 ans',
    color: '#C48EF6'
  },
  {
    value: '40 - 50 ans',
    color: '#8C58BB'
  },
  {
    value: '50 - 55 ans',
    color: '#6E3F99'
  },
  {
    value: '> 55 ans',
    color: '#42255C'
  },
  {
    value: 'Valeurs manquantes ou sous secret statistique',
    color: 'transparent'
  }
];

export const agricultureBioBarChartLegend = [
  {
    value: 'Surface certifiée',
    color: couleurs.graphiques.bleu[3]
  },
  {
    value: 'Surface en conversion',
    color: couleurs.graphiques.bleu[1]
  }
];

export const espacesNAFBarChartLegend = [
  {
    value: 'Activité',
    color: '#F66E19'
  },
  {
    value: 'Habitat',
    color: '#009ADC'
  },
  {
    value: 'Mixte',
    color: '#FFCF5E'
  },
  {
    value: 'Routes',
    color: '#7A49BE'
  },
  {
    value: 'Ferroviaire',
    color: '#BB43BD'
  },
  {
    value: 'Inconnu',
    color: '#00C2CC'
  }
];

export const catnatPieChartLegend = [
  {
    value: 'Inondations',
    color: couleurs.graphiques.bleu[2]
  },
  {
    value: 'Sécheresse',
    color: couleurs.graphiques.jaune[2]
  },
  {
    value: 'Mouvements de terrain',
    color: couleurs.graphiques.orange[2]
  },
  {
    value: 'Retrait-gonflement des argiles',
    color: couleurs.graphiques.violet[2]
  },
  {
    value: 'Cyclones / Tempêtes',
    color: couleurs.graphiques.turquoise[2]
  },
  {
    value: 'Grêle / neige',
    color: couleurs.graphiques.vert[2]
  },
  {
    value: 'Avalanche',
    color: couleurs.graphiques.rose[2]
  }
];

// export const DateConstructionResidencesBarChartData = (averages: {
//   [key: string]: number;
// }) => [
//   {
//     periode: 'Avant 1919',
//     'Votre collectivité': averages.averageAgeBatiPre19.toFixed(1),
//     'Votre collectiviteColor': couleurs.graphiques.bleu[1],
//     France: 20.5,
//     FranceColor: couleurs.graphiques.rouge[3]
//   },
//   {
//     periode: '1919-1945',
//     'Votre collectivité': averages.averageAgeBati1945.toFixed(1),
//     'Votre collectiviteColor': couleurs.graphiques.bleu[1],
//     France: 9.2,
//     FranceColor: couleurs.graphiques.rouge[3]
//   },
//   {
//     periode: '1946-1990',
//     'Votre collectivité': averages.averageAgeBati4690.toFixed(1),
//     'Votre collectiviteColor': couleurs.graphiques.bleu[1],
//     France: 43.4,
//     FranceColor: couleurs.graphiques.rouge[3]
//   },
//   {
//     periode: '1991-2005',
//     'Votre collectivité': averages.averageAgeBati9105.toFixed(1),
//     'Votre collectiviteColor': couleurs.graphiques.bleu[1],
//     France: 15.5,
//     FranceColor: couleurs.graphiques.rouge[3]
//   },
//   {
//     periode: 'Après 2006',
//     'Votre collectivité': averages.averageAgeBatiPost06.toFixed(1),
//     'Votre collectiviteColor': couleurs.graphiques.bleu[1],
//     France: 11.4,
//     FranceColor: couleurs.graphiques.rouge[3]
//   }
// ];

export const ageBatiBarChartLegend = [
  {
    value: 'France',
    color: couleurs.graphiques.bleu[1]
  },
  {
    value: 'Votre collectivité',
    color: couleurs.graphiques.rouge[3]
  }
];

export const ressourcesEauBarChartLegend = [
  {
    value: 'Agriculture',
    color: couleurs.graphiques.vert[2]
  },
  {
    value: 'Alimentation des canaux',
    color: couleurs.graphiques.turquoise[2]
  },
  {
    value: 'Eau potable',
    color: couleurs.graphiques.bleu[2]
  },
  {
    value: 'Industrie et autres usages économiques',
    color: couleurs.graphiques.violet[2]
  },
  {
    value: "Production d'électricité (barrages hydro-électriques)",
    color: couleurs.graphiques.orange[2]
  },
  {
    value: 'Refroidissement des centrales électriques',
    color: couleurs.graphiques.rose[2]
  }
];

export const espacesNAFDatavizLegend = [
  {
    value: '0-1',
    color: '#D8EFFA'
  },
  {
    value: '1-2',
    color: '#FFECEE'
  },
  {
    value: '2-5',
    color: '#FF9699'
  },
  {
    value: '5-10',
    color: '#E8323B'
  },
  {
    value: '10-20',
    color: '#B5000E'
  },
  {
    value: '> 20',
    color: '#680000'
  }
];

export const espacesNAFMenagesBarChartLegend = [
  {
    variable: 'Habitat',
    couleur: '#009ADC'
  },
  {
    variable: 'Activité',
    couleur: '#FFCF5E'
  },
  {
    variable: 'Mixte',
    couleur: '#FF6F61'
  },
  {
    variable: 'Inconnu',
    couleur: '#BB43BD'
  },
  {
    variable: 'Routes',
    couleur: '#00C2CC'
  },
  {
    variable: 'Ferroviaire',
    couleur: '#00949D'
  }
];

export const surfacesIrrigueesLegend = [
  {
    value: '0 %',
    color: '#D8EFFA'
  },
  {
    value: '0 - 20 %',
    color: '#3DB6EA'
  },
  {
    value: '20 - 40 %',
    color: '#0072B5'
  },
  {
    value: '40 - 60 %',
    color: '#03508B'
  },
  {
    value: '60 - 100 %',
    color: '#093454'
  },
  {
    value: 'Valeurs manquantes ou sous secret statistique',
    color: 'white'
  }
];

export const densiteBatiLegend = [
  {
    value: '> 0,2',
    color: '#FF5E54'
  },
  {
    value: '0,1 - 0,2',
    color: '#FFBD00'
  },
  {
    value: '0,05 - 0,1',
    color: '#FFFA6A'
  },
  {
    value: '0 - 0,05',
    color: '#D5F4A3'
  },
  {
    value: '0',
    color: '#5CFF54'
  }
];

export const fragiliteEcoLegend = [
  {
    value: '> 30 %',
    color: couleurs.graphiques.bleu[5]
  },
  {
    value: '20 % - 30 %',
    color: couleurs.graphiques.bleu[1]
  },
  {
    value: '10 % - 20 %',
    color: couleurs.graphiques.bleu[2]
  },
  {
    value: '0 - 10 %',
    color: couleurs.graphiques.bleu[3]
  },
  {
    value: '0 %',
    color: couleurs.graphiques.bleu[4]
  }
];

export const emploisEnExterieurLegend = [
  {
    value: 'Agriculture',
    color: couleurs.graphiques.jaune[4]
  },
  {
    value: 'Industries',
    color: couleurs.graphiques.orange[3]
  },
  {
    value: 'Construction',
    color: couleurs.graphiques.violet[2]
  },
  {
    value: 'Commerces et transports',
    color: couleurs.graphiques.vert[1]
  },
  {
    value: 'Administrations',
    color: couleurs.graphiques.bleu[5]
  }
];

export const DateConstructionResidencesLegend = [
  {
    value: 'France',
    color: couleurs.graphiques.bleu[1]
  },
  {
    value: 'Votre territoire',
    color: couleurs.graphiques.rouge[3]
  }
];

export const prelevementEauBarChartLegend = [
  {
    value: 'Agriculture',
    color: couleurs.graphiques.vert[2]
  },
  {
    value: 'Alimentation des canaux',
    color: couleurs.graphiques.turquoise[2]
  },
  {
    value: 'Eau potable',
    color: couleurs.graphiques.bleu[2]
  },
  {
    value: 'Industrie et autres usages économiques',
    color: couleurs.graphiques.violet[2]
  },
  {
    value: "Production d'électricité (barrages hydro-électriques)",
    color: couleurs.graphiques.orange[2]
  },
  {
    value: 'Refroidissement des centrales électriques',
    color: couleurs.graphiques.rose[2]
  }
];

export const vegetalisationLegend = [
  {
    value: 'Territoires artificialisés',
    color: '#ffff99'
  },
  {
    value: 'Territoires agricoles',
    color: '#fdc086'
  },
  {
    value: 'Zones végétalisées et milieux semi-naturels',
    color: '#7fc97f'
  },
  {
    value: 'Zones humides',
    color: '#beaed4'
  },
  {
    value: 'Surfaces en eau',
    color: '#386cb0'
  }
];

export const vegetalisationColors = {
  'Continuous urban fabric': '#ffff99',
  'Discontinuous urban fabric': '#ffff99',
  'Industrial or commercial units': '#ffff99',
  'Road and rail networks and associated land': '#ffff99', //cc0000
  'Port areas': '#ffff99',
  Airports: '#ffff99',
  'Mineral extraction sites': '#ffff99',
  'Dump sites': '#ffff99',
  'Construction sites': '#ffff99',
  'Green urban areas': '#7fc97f', //ffa6ff
  'Sport and leisure facilities': '#ffff99',
  'Non-irrigated arable land': '#fdc086',
  'Permanently irrigated land': '#fdc086',
  'Rice fields': '#fdc086',
  Vineyards: '#fdc086', //e68000
  'Fruit trees and berry plantations': '#fdc086',
  'Olive groves': '#fdc086', //e6a600
  Pastures: '#fdc086',
  'Annual crops associated with permanent crops': '#fdc086',
  'Complex cultivation patterns': '#fdc086',
  'Land principally occupied by agriculture, with significant areas of natural vegetation':
    '#fdc086',
  'Agro-forestry areas': '#fdc086', //f2cca6
  'Broad-leaved forest': '#7fc97f', //80ff00
  'Coniferous forest': '#7fc97f', //00a600
  'Mixed forest': '#7fc97f', //4dff00
  'Natural grasslands': '#7fc97f', //ccf24d
  'Moors and heathland': '#7fc97f',
  'Sclerophyllous vegetation': '#7fc97f',
  'Transitional woodland-shrub': '#7fc97f',
  'Beaches, dunes, sands': '#7fc97f',
  'Bare rocks': '#7fc97f',
  'Sparsely vegetated areas': '#7fc97f',
  'Burnt areas': '#7fc97f',
  'Glaciers and perpetual snow': '#7fc97f',
  'Inland marshes': '#beaed4',
  'Peat bogs': '#beaed4',
  'Salt marshes': '#beaed4',
  Salines: '#beaed4',
  'Intertidal flats': '#beaed4',
  'Water courses': '#386cb0',
  'Water bodies': '#386cb0',
  'Coastal lagoons': '#386cb0',
  Estuaries: '#386cb0',
  'Sea and ocean': '#386cb0'
};

export const LczLegend = [
  {
    value: 'LCZ 1 : Ensemble compact de tours',
    color: '#8C0000'
  },
  {
    value: "LCZ 2 : Ensemble compact d'immeubles",
    color: '#D10000'
  },
  {
    value: 'LCZ 3 : Ensemble compact de maisons',
    color: '#FF0000'
  },
  {
    value: 'LCZ 4 : Ensemble de tours espacées',
    color: '#BF4D00'
  },
  {
    value: "LCZ 5 : Ensemble d'immeubles espacés",
    color: '#FA6600'
  },
  {
    value: 'LCZ 6 : Ensemble de maisons espacées',
    color: '#FF9955'
  },
  {
    value: 'LCZ 7 : Ensemble dense de constructions légères',
    color: '#FAEE05'
  },
  {
    value: 'LCZ 8 : Bâtiments de grande emprise',
    color: '#BCBCBC'
  },
  {
    value: 'LCZ 9 : Implantation diffuse de maisons',
    color: '#FFCCAA'
  },
  {
    value: 'LCZ A : Espace densément arboré',
    color: '#006A00'
  },
  {
    value: 'LCZ B : Espace arboré clairsemé',
    color: '#00AA00'
  },
  {
    value: 'LCZ C : Espace végétalisé hétérogène',
    color: '#648525'
  },
  {
    value: 'LCZ D : Végétation basse',
    color: '#B9DB79'
  },
  {
    value: 'LCZ E : Sol imperméable naturel ou artificiel',
    color: '#000000'
  },
  {
    value: 'LCZ F : Sol nu perméable',
    color: '#FBF7AE'
  },
  {
    value: 'LCZ G : Surface en eau',
    color: '#6A6AFF'
  }
];

export const LczLegendOpacity70 = [
  {
    value: 'LCZ 1 : Ensemble compact de tours',
    color: '#AF4D4D'
  },
  {
    value: "LCZ 2 : Ensemble compact d'immeubles",
    color: '#D74545'
  },
  {
    value: 'LCZ 3 : Ensemble compact de maisons',
    color: '#FF4D4D'
  },
  {
    value: 'LCZ 4 : Ensemble de tours espacées',
    color: '#CD7D47'
  },
  {
    value: "LCZ 5 : Ensemble d'immeubles espacés",
    color: '#FC944D'
  },
  {
    value: 'LCZ 6 : Ensemble de maisons espacées',
    color: '#FFB888'
  },
  {
    value: 'LCZ 7 : Ensemble dense de constructions légères',
    color: '#9F9811'
  },
  {
    value: 'LCZ 8 : Bâtiments de grande emprise',
    color: '#C6C6C6'
  },
  {
    value: 'LCZ 9 : Implantation diffuse de maisons',
    color: '#FFDCC4'
  },
  {
    value: 'LCZ A : Espace densément arboré',
    color: '#438D43'
  },
  {
    value: 'LCZ B : Espace arboré clairsemé',
    color: '#43BA43'
  },
  {
    value: 'LCZ C : Espace végétalisé hétérogène',
    color: '#89A05D'
  },
  {
    value: 'LCZ D : Végétation basse',
    color: '#798D54'
  },
  {
    value: 'LCZ E : Sol imperméable naturel ou artificiel',
    color: '#4D4D4D'
  },
  {
    value: 'LCZ F : Sol nu perméable',
    color: '#FAF7C4'
  },
  {
    value: 'LCZ G : Surface en eau',
    color: '#8888F0'
  }
];

export const surfaceEnBioBarChartLegend = [
  {
    value: 'Surface certifiée agriculture biologique',
    color: couleurs.graphiques.bleu[3]
  },
  {
    value: 'Surface en conversion agriculture biologique',
    color: couleurs.graphiques.bleu[1]
  }
];

export const feuxForetBarChartLegend = [
  {
    variable: 'Feux de forêt',
    couleur: couleurs.principales.vert
  }
];

export const RgaRepartitionLegend = [
  {
    variable: 'territoire',
    texteRaccourci: 'Territoire',
    couleur: couleurs.principales.vert
  },
  {
    variable: 'territoireSup',
    texteRaccourci: 'Territoire supérieur',
    couleur: couleurs.graphiques.violet[2]
  }
];

export const RgaEvolutionLegend = [
  {
    variable: 'nb_logement_alea_faible',
    texteRaccourci: 'Exposition faible',
    couleur: '#FFCF5E'
  },
  {
    variable: 'nb_logement_alea_moyen_fort',
    texteRaccourci: 'Exposition moyenne / forte',
    couleur: '#E8323B'
  }
];

export const RgaMapLegend = [
  {
    value: 'Zone a priori non argileuse',
    color: '#FFFFFF'
  },
  {
    value: 'Exposition faible',
    color: '#FFCF5E'
  },
  {
    value: 'Exposition moyenne',
    color: '#F66E19'
  },
  {
    value: 'Exposition forte',
    color: '#E8323B'
  }
];

export const o3Legend = [
  { color: '#A4F5EE', value: '0-4' },
  { color: '#C4E8A3', value: '5-9' },
  { color: '#F5E290', value: '10-14' },
  { color: '#FFAB66', value: '15-19' },
  { color: '#FC9999', value: '20-24' },
  { color: '#F37D7D', value: '25-29' },
  { color: '#E06060', value: '30-34' },
  { color: '#C97189', value: '35-39' },
  { color: '#B982B2', value: '≥ 40' }
];

export const debroussaillementLegend = [
  {
    color: '#F83DD9',
    value: 'Zonage informatif des obligations légales de débroussaillement'
  }
];

export const secheressesBarChartLegend = [
  {
    value: 'Vigilance',
    color: "#FFFF00"
  },
  {
    value: 'Alerte',
    color: "#FF9900"
  },
  {
    value: 'Alerte renforcée',
    color: "#EA4335"
  },
  {
    value: 'Crise',
    color: "#980000"
  },
];

export const secheressesSaisonsChartLegend = [
  {
    value: '2020',
    color: "#FFC9E4"
  },
  {
    value: '2021',
    color: "#FFA3D2"
  },
  {
    value: '2022',
    color: "#FD57AB"
  },
  {
    value: '2023',
    color: "#CA307E"
  },
  {
    value: '2024',
    color: "#971356"
  },
  {
    value: '2025',
    color: "#640234"
  },
];

export const arboviroseBarChartLegend = [
  {
    value: 'Cas importés',
    color: couleurs.graphiques.bleu[3]
  },
  {
    value: 'Cas autochtones',
    color: couleurs.graphiques.bleu[1]
  },
];

export const arboviroseMapMoustiqueTigreLegend = [
  {
    value: "Absence",
    color: '#ffffff'
  },
  {
    value: "Présence",
    color: '#FF8094'
  },
];

export const arboviroseMapAutochtonesLegend = [
  {
    value: "0",
    color: '#ffffff'
  },
  {
    value: "1",
    color: '#FFCD72'
  },
  {
    value: "2 à 9",
    color: '#F8B334'
  },
  {
    value: "10 à 19",
    color: '#CF911E'
  },
  {
    value: "20 à 39",
    color: '#A6710E'
  },
  {
    value: "40 ou plus",
    color: '#7E5202'
  }
];
