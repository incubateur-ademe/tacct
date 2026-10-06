import RessourceCritere1Q1Non from '@/assets/images/ressource-critere1-q1-non.webp';
import RessourceCritere1Q2Non from '@/assets/images/ressource-critere1-q2-non.webp';
import RessourceCritere1Q2Nonbis from '@/assets/images/ressource-critere1-q2-nonbis.webp';
import RessourceCritere1Q2Nonter from '@/assets/images/ressource-critere1-q2-nonter.webp';
import RessourceCritere1Q2Oui from '@/assets/images/ressource-critere1-q2-oui.webp';
import RessourceCritere1Q5Non from '@/assets/images/ressource-critere1-q5-non.webp';
import RessourceCritere2Q1Non from '@/assets/images/ressource-critere2-q1-non.webp';
import RessourceCritere2Q2Non from '@/assets/images/ressource-critere2-q2-non.webp';
import RessourceCritere3Q4Non from '@/assets/images/ressource-critere3-q4-non.webp';
import RessourceCritere3Q4Nonbis from '@/assets/images/ressource-critere3-q4-nonbis.webp';
import RessourceCritere3Q4Nonter from '@/assets/images/ressource-critere3-q4-nonter.webp';
import RessourceCritere3Q5Non from '@/assets/images/ressource-critere3-q5-non.webp';
import RessourceCritere4Q3Non from '@/assets/images/ressource-critere4-q3-non.webp';
import type { StaticImageData } from 'next/image';
import { yieldsRecommendation } from '../answers';
import { buildQuestionKey } from '../keys';
import { AnswerMap, AnswerValue, CriterionSlug } from '../types';
import { CRITERIA } from './criteria';

/**
 * Recommandations de la feuille de route, par question et par niveau de réponse :
 * - `absentPartiel` : recommandation commune aux réponses 1 et 2
 * - `satisfaisant` : recommandation de la réponse 3
 * - réponse 4 et « Je ne sais pas » : aucune recommandation
 * Un bloc `ressources` vide n'est pas affiché.
 */

export type RoadmapResourceTag =
  'donnees' | 'article' | 'reglementation' | 'exemple-diagnostic';

export interface RoadmapResource {
  tag: RoadmapResourceTag;
  title: string;
  /** Paragraphe « Qu’est-ce que c’est ? », aussi révélé au survol de la carte. */
  description?: string;
  /** Paragraphe « Pourquoi est-ce utile ? ». */
  utilite?: string;
  image?: StaticImageData;
  url: string;
}

export interface QuestionRecommendation {
  title: string;
  description: string;
  ressources: RoadmapResource[];
}

export interface QuestionRecommendations {
  absentPartiel: QuestionRecommendation;
  satisfaisant: QuestionRecommendation;
}

const PATCH_4C: RoadmapResource = {
  tag: 'donnees',
  title: 'Patch 4°C',
  description:
    'Il s’agit du patch 4°C, un nouveau jeu de données calculé par Météo France et basé sur la TRACC.',
  url: 'https://tacct.ademe.fr/recherche-territoire-patch4',
  utilite:
    'Le patch 4°C calcule le tendanciel d’aggravation des aléas majeurs de votre territoire (à noter : les territoires ultramarins ont des projections de référence spécifiques et moins élevées). En fonction de l’aggravation, vous trouverez une liste de thématiques à traiter et des conseils pour renforcer votre diagnostic de vulnérabilité.',
  image: RessourceCritere1Q2Oui
};

const DIAGNOSTIC_RENNES_METROPOLE: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title: 'Diagnostic de vulnérabilité de Rennes métropole',
  description:
    'Il s’agit du diagnostic de vulnérabilité au changement climatique de la métropole de Rennes (Bretagne), réalisé en 2025.',
  url: 'https://www.audiar.org/publication/environnement/climat/diagnostic-et-vulnerabilite-au-changement-climatique-a-rennes-metropole/',
  utilite:
    'Dans ce diagnostic de vulnérabilité, vous retrouverez l’usage des critères de notation de l’exposition actuelle et future.\n\nUn format de synthèse du diagnostic de vulnérabilité est également accessible.',
  image: RessourceCritere1Q5Non
};

const DIAGNOSTIC_COEUR_DU_PAYS_HAUT: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title:
    'Diagnostic de la Communauté de communes Cœur du Pays Haut (Grand Est)',
  description:
    'Il s’agit du diagnostic de vulnérabilité au changement climatique de la Communauté de communes Cœur du Pays Haut (région Grand Est), réalisé en 2023.',
  url: 'https://coeurdupayshaut.fr/gedExt/contenu/RESILIENCE-CLIMATIQUE/DiagnosticVulnerabiliteCPH_.pdf',
  utilite:
    'C’est un exemple de diagnostic de vulnérabilité accordant une place centrale aux analyses de sensibilité et de vulnérabilité (voir les chapitres dédiés). De plus, ce document s’appuie sur le système de notation de la méthode TACCT (exposition actuelle, exposition future et sensibilité), ce qui permet d’identifier la vulnérabilité du territoire et de prioriser les enjeux clés.',
  image: RessourceCritere2Q1Non
};

const DIAGNOSTIC_BARONNIES: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title:
    'Diagnostic de la Communauté de Communes des Baronnies en Drôme Provençale',
  description:
    'Il s’agit du diagnostic de vulnérabilité de la Communauté de Communes des Baronnies en Drôme Provençale.',
  url: 'https://www.cc-bdp.fr/wp-content/uploads/2024/12/202412_02b-Diagnostic-de-vulnerabilite_PCAET_CCBDP.pdf',
  utilite:
    'Le diagnostic de vulnérabilité mentionne explicitement la gouvernance associée.\n\nUne partie du diagnostic de vulnérabilité est consacrée aux difficultés rencontrées et solutions apportées laissant une trace utile du processus de réalisation du document pour la future révision.\n\nL’annexe bibliographique permet de consulter le support utilisé en séance lors de l’atelier sur la sensibilité du territoire au changement climatique (p.78).',
  image: RessourceCritere3Q5Non
};

const DIAGNOSTIC_PNR_AUBRAC: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title: 'Diagnostic du PNR de l’Aubrac',
  description:
    'Il s’agit du rapport de vulnérabilité climatique du parc naturel régional de l’Aubrac.',
  url: 'https://www.parc-naturel-aubrac.fr/en-action/trajectoires-dadaptation-au-changement-climatique-des-territoires/',
  utilite:
    'Le diagnostic de vulnérabilité présente des données d’exposition sur les horizons de temps 2050 et 2100.\n\nA partir de la page 66, l’analyse de la sensibilité est menée et permet de visualiser les résultats obtenus avec la matrice de vulnérabilité.',
  image: RessourceCritere4Q3Non
};

const DONNEES_SENSIBILITE_TACCT: RoadmapResource = {
  tag: 'donnees',
  title: 'Les données de sensibilité sur le site TACCT',
  description:
    'La plateforme TACCT donne un accès direct à des données du territoire – socio-économiques, climatiques, environnementales.',
  url: 'https://tacct.ademe.fr/recherche-territoire',
  utilite:
    'Il s’agit d’une sélection d’indicateurs permettant d’engager rapidement le dialogue avec les acteurs locaux, sur une base commune, et d’identifier ensemble les vulnérabilités du territoire face au changement climatique.',
  image: RessourceCritere2Q2Non
};

const TEMOIGNAGE_RENNES_METROPOLE: RoadmapResource = {
  tag: 'article',
  title: 'Témoignage de Rennes Métropole',
  description:
    'Il s’agit de l’article “Réaliser votre diagnostic de vulnérabilité” qui reprend le témoignage de Clémence Noyau, chargée de mission adaptation au changement climatique à Rennes Métropole.',
  url: 'https://tacct.ademe.fr/ressources/demarrer-diagnostic-vulnerabilite/realiser-diagnostic-vulnerabilite',
  utilite:
    'Il permet de comprendre la démarche suivie par une chargée de mission avec la place accordée à la donnée et aux temps de mobilisation. Cet article met en avant les apprentissages liés à la réalisation du diagnostic de vulnérabilité de la métropole et l’intérêt de mobiliser pour légitimer le diagnostic de vulnérabilité. _“Pour moi, dans le diagnostic de vulnérabilité, le plus important, c’est le processus, c’est profiter de cette occasion pour aller rencontrer et mobiliser tout le monde sur ces questions”_ (Clémence Noyau).',
  image: RessourceCritere3Q4Non
};

const GUIDE_ENTRETIENS: RoadmapResource = {
  tag: 'article',
  title: 'Exemple de guide d’entretiens',
  description:
    'Il s’agit de l’article “Entretiens de terrain : l’autre pilier du diagnostic de vulnérabilité” disponible dans notre collection “Associer les parties prenantes”.',
  url: 'https://tacct.ademe.fr/ressources/associer-parties-prenantes/entretien-adaptation',
  utilite:
    'Les bases de données ne révèlent pas tout : elles ne rendent pas compte des réalités vécues ni des signaux faibles qui émergent sur le terrain. Retrouvez ici les bonnes pratiques et un exemple de format simple pour mener des entretiens efficaces. Votre diagnostic de vulnérabilité parlera véritablement de votre territoire.',
  image: RessourceCritere3Q4Nonbis
};

const RETOURS_ATELIERS_SENSIBILITE: RoadmapResource = {
  tag: 'article',
  title: 'Retours d’expérience sur les ateliers sensibilité',
  description:
    'Retrouvez nos deux retours d’expériences de territoires ayant animé des ateliers pour évaluer leur sensibilité, disponibles dans notre collection “Évaluer les impacts du changement climatique”.',
  url: 'https://tacct.ademe.fr/ressources/evaluer-impacts-changement-climatique',
  utilite:
    'Découvrez les apprentissages liés à la réalisation d’ateliers sensibilité. Ces deux retours d’expériences proposent des déroulés d’ateliers, à personnaliser à votre contexte, pour évaluer la sensibilité de votre territoire.',
  image: RessourceCritere3Q4Nonter
};

const DONNEES_CLIMATIQUES: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Documenter le climat passé du territoire',
      description:
        "D’après votre réponse, les éléments recueillis sur ce point sont encore trop peu nombreux pour dresser un tableau clair de l’état du climat de votre territoire.\n\nS’appuyer sur les **données d'observation est un bon point de départ**, elles permettent d'objectiver les tendances déjà à l'œuvre. Ainsi pour les fortes chaleurs : sont-elles plus nombreuses qu'il y a trente ans (**fréquence**) ? S'étirent-elles sur plus de jours d'affilée (**durée**) ? Les pics sont-ils plus élevés (**intensité**) ? Surviennent-elles plus tôt dans la saison (**précocité**) ?\n\nUn point de vigilance : pour parler d'une tendance d'évolution du climat — globale ou locale —, il faut **se baser sur le temps long**, au moins 30 ans. En deçà, le climat varie naturellement d'une année sur l'autre, et cette variabilité peut fausser l’analyse. Par exemple, s’il fait froid trois ou quatre années de suite, ce n’est pas nécessairement le signe d’une tendance de refroidissement.",
      ressources: [
        {
          tag: 'donnees',
          title: 'Base de données GASPAR',
          description:
            'La base de données GASPAR (Base nationale de Gestion ASsistée des Procédures Administratives relatives aux Risques) recense pour chaque commune les arrêtés de reconnaissance de l’état de catastrophe naturelle parus au Journal officiel depuis la création du dispositif en 1982.',
          url: 'https://ecologie.data.gouv.fr/datasets/536995eea3a729239d20486b',
          utilite:
            'Ces données complètent les données climatiques passées, en apportant un éclairage sur les « aléas induits » (mouvements de terrain, submersion, inondations, coulées de boues…) dont la fréquence est susceptible d’évoluer avec le changement climatique.\n\nVisualisez ces données sur TACCT, dans notre thématique ‘Gestion des risques’, onglet ‘Données de mon territoire’.',
          image: RessourceCritere1Q1Non
        }
      ]
    },
    satisfaisant: {
      title: 'Explorer davantage le climat passé du territoire',
      description:
        "Votre diagnostic contient déjà quelques observations sur le climat passé du territoire. C'est un bon début, mais ce point pourrait être étoffé en s'appuyant sur des données d'observation.\n\nPrenons l'exemple des fortes chaleurs : sont-elles plus nombreuses qu'il y a trente ans (**fréquence**) ? S'étirent-elles sur plus de jours d'affilée (**durée**) ? Les pics sont-ils plus élevés (**intensité**) ? Surviennent-elles plus tôt dans la saison (**précocité**) ?\n\nVous pourrez ainsi mettre en évidence les caractéristiques du climat de votre territoire et objectiver les tendances déjà à l'œuvre.",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Utiliser les projections climatiques de la TRACC',
      description:
        "Depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC) doit être intégrée dans tous les documents de planification.\n\nSi certains paramètres vous semblent manquants dans la TRACC, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent au +4°C (*) pour la métropole, et de pousser l’analyse jusqu’en fin de siècle (RCP 8.5 par exemple).\n\n(*) Pour l'Outremer, les projections doivent provenir d'un scénario respectant un niveau de réchauffement en fin de siècle équivalent à :\n\n• +2,7°C pour les Antilles\n• +3,5°C pour la Guyane\n• +2,9°C pour La Réunion\n• +3°C pour Mayotte et la Nouvelle-Calédonie\n• +2,3°C pour la Polynésie française",
      ressources: [
        {
          tag: 'donnees',
          title: 'Climadiag Commune par Météo-France',
          description:
            'Climadiag Commune est un service de Météo France, en accès libre et gratuit, décrivant les évolutions potentielles du climat à l‘échelle des communes et des EPCI. Les indicateurs (températures moyennes, cumuls de précipitations,…) correspondent aux différents niveaux de réchauffement de la TRACC aux horizons 2030, 2050 et 2100. Ils sont organisés en cinq familles (climat, risques naturels, santé, agriculture, tourisme).',
          url: 'https://meteofrance.com/climadiag-commune',
          utilite:
            'ClimaDiag Commune est un outil directement utilisable, sans nécessiter de compétences en climatologie ou en traitement de données, contrairement à d’autres outils, tel que DRIAS.',
          image: RessourceCritere1Q2Non
        },
        {
          tag: 'reglementation',
          title: 'Décret n° 2026-23 du 23 janvier 2026',
          description:
            "Il s’agit du décret relatif à la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique (TRACC) adoptée par la France.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399130',
          utilite:
            "Le décret du 23 janvier 2026 précise les modalités de définition de la TRACC. C'est ce texte qui légitime l'usage par les territoires de la TRACC comme référence officielle dans les diagnostics de vulnérabilité.",
          image: RessourceCritere1Q2Nonbis
        },
        {
          tag: 'reglementation',
          title: 'Arrêté du 23 janvier 2026',
          description:
            "Il s’agit de l’arrêté du 23 janvier 2026 fixant les niveaux de réchauffement de la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399165',
          utilite:
            "L'arrêté du 23 janvier 2026 définit les niveaux de réchauffement (par rapport à l'ère préindustrielle) à différents horizons temporels pour la métropole et les territoires ultramarins.",
          image: RessourceCritere1Q2Nonter
        }
      ]
    },
    satisfaisant: {
      title:
        'Compléter avec des projections climatiques compatibles avec la TRACC',
      description:
        "Le cas échéant, quelques ajustements suffiront.\n\nComplétez vos paramètres TRACC ; si certains vous semblent manquants, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent à +4°C (*) pour la métropole (RCP 8.5 par exemple), et de pousser l’analyse jusqu’en fin de siècle.\n\n(*) Pour l'Outremer, les projections doivent provenir d'un scénario respectant un niveau de réchauffement en fin de siècle équivalent à :\n\n• +2,7°C pour les Antilles\n• +3,5°C pour la Guyane\n• +2,9°C pour La Réunion\n• +3°C pour Mayotte et la Nouvelle-Calédonie\n• +2,3°C pour la Polynésie française\n\nRappel : depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique n’est plus une option et doit être intégrée dans tous les documents de planification.",
      ressources: [PATCH_4C]
    }
  },
  q3: {
    absentPartiel: {
      title: 'Réduire la partie sur les données climatiques mondiales',
      description:
        "Évitez l'écueil des généralités en reproduisant des constats déjà largement documentés à l'échelle globale. **Les données mondiales, voire nationales, sont assez éloignées des réalités locales**, même si, ponctuellement, les échelles intermédiaires (départementales, régionales) peuvent offrir un cadre de comparaison pertinent pour positionner votre territoire.\n\nSi nécessaire, **rapprochez-vous du groupe régional d'experts sur le climat de votre région**. Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
      ressources: []
    },
    satisfaisant: {
      title: 'Alléger la partie sur les données climatiques mondiales',
      description:
        "Un petit effort de synthèse s’impose. Réorientez cette première partie de votre diagnostic pour être exploitable : elle doit **aider les acteurs locaux à se projeter** dans une réalité qui leur est directement lisible, plutôt que de reproduire des constats déjà largement documentés à l'échelle globale.\n\nDosez intelligemment : **assez de contexte pour comprendre, assez de local pour agir**.",
      ressources: []
    }
  },
  q4: {
    absentPartiel: {
      title: 'Relier les paramètres climatiques à leurs conséquences',
      description:
        "Un diagnostic ne doit pas être un inventaire, c'est plutôt le fruit d'une analyse. Si aucun des indicateurs climatiques mentionnés n'est relié à un effet observable sur votre territoire, c'est soit qu'il n'y en a pas, soit que le travail de mise en relation reste à faire : c'est ce lien qui donnera son sens au diagnostic.",
      ressources: []
    },
    satisfaisant: {
      title:
        'Restituer en priorité les paramètres climatiques reliés à des effets observables sur le territoire.',
      description:
        "Un diagnostic n’est pas un inventaire, c'est le fruit d'une analyse. La recherche d'indicateurs de projections climatiques peut faire apparaître des aléas sans effet réel sur votre territoire.\n\nS’il est utile d’en conserver la trace dans vos documents de travail, **mieux vaut ne restituer dans le diagnostic que les données climatiques reliées à des impacts locaux**. Les lecteurs vous remercieront d’aller à l’essentiel !",
      ressources: []
    }
  },
  q5: {
    absentPartiel: {
      title:
        "Identifier les aléas climatiques qui ont le plus d'impact sur le territoire, aujourd'hui et demain",
      description:
        "D'après votre réponse, aucun classement des aléas climatiques n'a encore été réalisé.\n\nRassurez-vous : pas besoin d'être expert en climatologie pour cet exercice. Il s'agit simplement de qualifier la gravité des aléas les uns par rapport aux autres, avec un **référentiel commun** que tout le monde lit de la même façon, à l'image des codes couleur de la vigilance météo (jaune, orange, rouge). L'objectif : **se mettre d'accord collectivement**, plutôt que chacun juge à sa façon si un aléa est grave ou non.\n\nPour vous aider à hiérarchiser, **posez-vous quelques questions simples** : cet aléa revient-il souvent ? Touche-t-il une grande partie du territoire ? Est-ce une préoccupation déjà exprimée localement ? Pensez aussi à couvrir les deux périodes : le passé déjà observé, et le futur que vous pouvez estimer grâce à la TRACC (trajectoire de réchauffement de référence pour l'adaptation au changement climatique).",
      ressources: [DIAGNOSTIC_RENNES_METROPOLE, PATCH_4C]
    },
    satisfaisant: {
      title: 'Compléter l’analyse de l’exposition aux aléas climatiques',
      description:
        "L'idée est de classer les aléas climatiques du territoire, du plus au moins grave. Pour y arriver, mieux vaut un référentiel commun avec des critères de gravité partagés par tous. Un peu comme les codes couleurs de la vigilance météo (jaune, orange, rouge) : une échelle que tout le monde lit de la même façon.\n\nQuelques réflexes utiles pour vous aider à compléter cet exercice :\n\n• **Sortir du tout ou rien.** Plutôt qu'un simple « grave / pas grave », prévoir des critères de notation pour nuancer : l'aléa revient-il souvent ? touche-t-il une grande partie du territoire ? inquiète-t-il d'ores et déjà les acteurs du territoire ?\n• **Passer tous les aléas en revue**. Regarder l'ensemble des aléas auxquels le territoire est, ou sera, exposé. Si certains sont écartés, vérifier que cela est justifié.\n• **Regarder aussi vers l'avenir.** Juger la gravité non seulement de ce qu’on a déjà observé, mais aussi la façon dont ces aléas vont évoluer. C'est ce que permet d’analyser la TRACC (trajectoire de réchauffement de référence adoptée par la France).\n• **Partager ce classement à plusieurs.** S'assurer que la hiérarchie retenue soit discutée, pour qu'elle fasse consensus.",
      ressources: [PATCH_4C]
    }
  }
};

const IMPACTS_ANCRES_DESCRIPTION =
  "Privilégiez les impacts pour lesquels un acteur local peut être consulté, plutôt que ceux uniquement documentés par la littérature scientifique.\n\nUn impact générique est vrai mais non discriminant : il s'applique partout, quel que soit le territoire. C'est souvent le cas des impacts qui se limitent à relater un phénomène physique, comme « recrudescence des dépérissements forestiers », sans préciser l'effet socio-économique qui en découle — ici, la fragilisation de la filière bois locale ou la perte de potentiel touristique.\n\nDans l’idéal, **un impact bien décrit, c’est l'expression d’une évolution + un effet sur le territoire en lien avec un aléa**. Par exemple “Baisse de fréquentation des commerces de centre-ville lors des épisodes de canicule”.\n\nCertains impacts ne sont pas quantifiables (pratiques fragilisées, dépendances locales, comportements…) ; seul le dialogue avec les acteurs permet de les faire émerger.";

const IMPACTS_ANCRES: QuestionRecommendation = {
  title: 'Décrire des impacts précis et ancrés dans le territoire',
  description: IMPACTS_ANCRES_DESCRIPTION,
  ressources: []
};

const DONNEES_SOCIO_ECONOMIQUES: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Concentrer les efforts sur l’analyse des impacts',
      description:
        "Une analyse purement climatique, centrée sur l'évolution des températures, précipitations ou autres paramètres, ne dit rien en soi de la vulnérabilité du territoire. Deux territoires soumis au même aléa peuvent connaître des conséquences très différentes selon leurs infrastructures, leurs activités économiques ou la sensibilité de leurs populations.\n\nSans ce passage par les impacts, le diagnostic risque de rester une donnée scientifique abstraite, déconnectée des enjeux concrets du territoire — et donc difficile à traduire par la suite en stratégie et en actions.",
      ressources: [DIAGNOSTIC_COEUR_DU_PAYS_HAUT]
    },
    satisfaisant: {
      title:
        'Si nécessaire, mettre en lumière les effets dominos des impacts entre les différentes thématiques',
      description:
        "La sensibilité s’analyse sur l’ensemble des thématiques — ressources en eau, agriculture, santé, infrastructures, biodiversité, activités économiques… D’autant que ces thématiques sont étroitement liées entre elles :\n\n• un même aléa peut toucher plusieurs thématiques à la fois, et\n• un impact peut entraîner de nouveaux impacts en cascade sur d'autres thématiques.\n\nLe cas échéant, **ces interactions gagneraient à être repérées et explicitées dans votre diagnostic**.",
      ressources: [DIAGNOSTIC_COEUR_DU_PAYS_HAUT]
    }
  },
  q2: {
    absentPartiel: {
      title: 'Découvrir ce qui rend le territoire fragile',
      description:
        'Explorez les facteurs de sensibilité propres à votre territoire pour mieux comprendre ce qui accentue son exposition aux risques climatiques.',
      ressources: [DONNEES_SENSIBILITE_TACCT]
    },
    satisfaisant: {
      title: 'Compléter les facteurs de sensibilité si besoin',
      description:
        "Le diagnostic recense déjà des facteurs de sensibilité, mais ce travail peut sans doute être complété.\n\nPuisqu'un facteur de sensibilité est ce qui fait qu'un même aléa produit des conséquences plus ou moins fortes selon les territoires, il doit être mesuré à l'aide de données assez fines.\n\nCertaines données manquent-elles de précision territoriale ? Par exemple, connaît-on la répartition des essences en forêt à l'échelle de votre territoire, ou seulement de la région ? Au-delà de la précision des données disponibles, certains secteurs clés sont-ils, eux, absents ou sous-représentés dans le diagnostic ?",
      ressources: [DONNEES_SENSIBILITE_TACCT]
    }
  },
  q3: {
    absentPartiel: IMPACTS_ANCRES,
    satisfaisant: IMPACTS_ANCRES
  },
  q4: {
    absentPartiel: {
      title: 'Ajouter la source des données lorsqu’elle est manquante',
      description:
        "Une donnée sans source est une donnée perdue ! Sans mention des sources, le lecteur ne peut ni vérifier la fiabilité des données, ni évaluer si elles sont adaptées à l'échelle ou au contexte de votre territoire.\n\nUn diagnostic non sourcé perd en crédibilité et peut être remis en question, notamment lors d'échanges avec les élus ou les partenaires du territoire.\n\nC'est aussi une perte pour la suite : sans traçabilité, il devient difficile de mettre à jour le diagnostic ou de retrouver la donnée d'origine quelques années plus tard.",
      ressources: []
    },
    satisfaisant: {
      title: 'Ajouter la source des données lorsqu’elle est manquante',
      description:
        "Soyez exhaustif pour permettre au lecteur de vérifier la fiabilité de chaque élément, quelle que soit sa provenance. C'est aussi ce qui garantit la crédibilité de l'ensemble : un diagnostic partiellement sourcé peut jeter le doute sur des données qui, elles, le sont.",
      ressources: []
    }
  },
  q5: {
    absentPartiel: {
      title:
        'Classer les impacts affectant le territoire en fonction de leur gravité',
      description:
        "Aucun classement des impacts n'a encore été réalisé. Sans cette étape, votre territoire risque de se disperser ou de passer à côté de l'enjeu qui compte vraiment pour lui, sans pouvoir formuler d'objectifs stratégiques ciblés.\n\nRassurez-vous : pas besoin de connaissances scientifiques pour cet exercice. L'idée est de **classer les impacts sur le territoire, du plus au moins grave**. Pour y arriver, mieux vaut un **référentiel commun** — des critères de gravité partagés par tous — plutôt qu'un classement laissé au ressenti de chacun. Un peu comme les codes couleurs de la vigilance météo (jaune, orange, rouge) : une échelle que tout le monde lit de la même façon.\n\nPour vous aider à hiérarchiser les impacts, **posez-vous quelques questions** : combien de personnes sont touchées ? Dans quelle proportion les activités sont-elles concernées ? Quelle est son étendue géographique ? Va-t-il devenir critique et dans combien de temps ? Est-il réversible ? **Cette liste n'est pas exhaustive : à vous de la personnaliser avec vos propres critères**, du moment qu'ils sont partagés par tous.",
      ressources: []
    },
    satisfaisant: {
      title:
        "Identifier ce qui pourrait être affiné dans l'évaluation de la gravité des impacts",
      description:
        "Un classement des impacts a bien été établi mais le résultat vous semble incomplet.\n\nL'idée est de **classer collectivement les impacts sur le territoire, du plus au moins grave**. Pour y arriver, mieux vaut un **référentiel commun** — des critères de gravité partagés par tous — plutôt qu'un classement laissé au ressenti de chacun. Un peu comme les codes couleurs de la vigilance météo (jaune, orange, rouge) : une échelle que tout le monde lit de la même façon.\n\nQuelques réflexes utiles pour vous aider à compléter cet exercice :\n\n• **Affiner l'échelle de gravité.** Une échelle trop binaire (« grave » / « pas grave ») manque de nuance. Expliciter les critères d'évaluation des impacts : combien de personnes sont touchées ? Dans quelle proportion les activités sont-elles concernées ? Quelle est son étendue géographique ? Va-t-il devenir critique et dans combien de temps ? Est-il réversible ? Cette liste n'est pas exhaustive : à vous de la personnaliser avec d'autres critères, du moment qu'ils sont partagés.\n• **Réexaminer la liste des thématiques importantes.** Le climat comme le contexte socio-économique évoluent. Il est possible que certaines thématiques, peu touchées lors du dernier diagnostic de vulnérabilité, soient devenues essentielles depuis. C'est l'occasion de vérifier que la liste retenue correspond toujours à la réalité de votre territoire aujourd'hui.\n• **Croiser les avis sur le classement.** Si ce classement a été réalisé par une seule personne ou un seul service, c'est l'occasion d'en tenir compte pour le prochain exercice, en l'ouvrant à d'autres acteurs concernés du territoire. Un classement construit à plusieurs voix reflètera une vision partagée du territoire.",
      ressources: []
    }
  }
};

const DIALOGUE_ET_PARTAGE: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Décrire l’approche méthodologique',
      description:
        "Décrire la méthodologie utilisée permet de rendre le diagnostic plus transparent et plus facile à interpréter pour ceux qui le liront sans avoir participé à son élaboration.\n\nExpliciter les choix méthodologiques (**concepts retenus, sources mobilisées, critères de choix**) permet de mieux justifier les priorités du diagnostic en montrant qu'elles reposent sur une démarche rigoureuse plutôt que sur des choix arbitraires.",
      ressources: []
    },
    satisfaisant: {
      title: 'Compléter les descriptions méthodologiques, là où elles manquent',
      description:
        "L'approche méthodologique utilisée est déjà décrite dans le diagnostic, mais elle ne vous satisfait pas pleinement ?\n\nDécrire son approche méthodologique est loin d'être systématique. Pourtant, cet exercice facilite grandement la compréhension du diagnostic par des tiers : il permet de comprendre comment celui-ci a été réalisé. **Quels éléments manquent pour que cette description vous satisfasse ?** Lorsque vous ferez l'exercice, n'hésitez pas à faire relire ce passage par un collègue pour identifier ensemble les questions qui se posent encore.",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Enrichir le diagnostic avec des verbatims',
      description:
        "Un diagnostic reste valide sans verbatims : ils n'apportent rien à sa solidité méthodologique. En revanche, ils lui donnent un ancrage dans le vécu du territoire qui renforce sa force de conviction. Pensez à recueillir quelques verbatims auprès des acteurs du territoire : cela rendra le diagnostic plus mobilisateur.",
      ressources: []
    },
    satisfaisant: {
      title: "Conserver la bonne pratique d'utiliser des verbatims",
      description:
        "Votre diagnostic contient déjà quelques verbatims, et c'est précieux : ils ancrent le diagnostic dans le vécu réel du territoire, ce qui le rend plus parlant et plus mobilisateur. Continuez sur cette lancée.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title: 'Rechercher les actions déjà engagées sur le territoire',
      description:
        "Contribuer au diagnostic peut avoir un effet anxiogène, en donnant l'impression d'un territoire démuni face au changement climatique. Évoquer les actions déjà menées permet de rééquilibrer ce récit en montrant que le territoire n'est pas passif, mais déjà engagé dans une dynamique d'adaptation.\n\nCela permet aussi de pondérer les ressentis : **un territoire peut être sensible à un aléa tout en ayant déjà renforcé sa capacité de réponse**. Il est intéressant de mener cette réflexion lors de l’exercice de qualification de la sensibilité. Le diagnostic gagne ainsi en richesse, sans minimiser les enjeux, mais sans céder au fatalisme non plus.\n\nSi aucune action n'apparaît dans le document, cela ne signifie pas nécessairement que le sujet n’a pas été abordé. Il a pu l’être en atelier sans être repris dans le document final. Il est possible que certaines réponses soient à chercher dans les archives du diagnostic (des comptes-rendus par exemple).",
      ressources: []
    },
    satisfaisant: {
      title: 'Citer les actions déjà menées',
      description:
        "Avoir identifié quelques actions engagées sur le territoire est une bonne dynamique à poursuivre. Ce travail permet de rééquilibrer le récit du diagnostic, souvent focalisé sur les vulnérabilités, en montrant que le territoire n'est pas passif mais déjà en mouvement face au changement climatique.\n\nIl permet surtout de pondérer les ressentis : **un territoire peut rester sensible à un aléa tout en ayant déjà renforcé sa capacité de réponse**. C’est un élément important qui influencera directement les résultats de la qualification de la sensibilité.",
      ressources: []
    }
  },
  q4: {
    absentPartiel: {
      title: 'Ne pas décider seul de ce qui compte pour le territoire',
      description:
        "La co-construction avec les acteurs du territoire est essentielle à deux titres.\n\nD'abord, pour l'identification des impacts eux-mêmes : c'est souvent au contact du terrain que se révèlent les impacts réels, non génériques, difficiles à percevoir dans les seules données.\n\nEnsuite, pour évaluer tant l’exposition que la sensibilité : si le ressenti des acteurs manque, le risque est de passer à côté de signaux que seul le vécu permet de capter.\n\nLes associer dès le début des évaluations assure aussi une priorisation plus juste, ancrée dans les préoccupations réelles du territoire. Elle en est aussi plus légitime, puisqu'elle n'est pas décidée par la seule collectivité.",
      ressources: [
        TEMOIGNAGE_RENNES_METROPOLE,
        GUIDE_ENTRETIENS,
        RETOURS_ATELIERS_SENSIBILITE
      ]
    },
    satisfaisant: {
      title:
        "Assumer le choix d'une consultation partielle : vous ne pourrez pas interroger tout le monde",
      description:
        "Plus les temps d'échange sont nombreux, plus le diagnostic est ancré dans le réel, mais plus la mobilisation demande de temps à la collectivité. **C'est donc un arbitrage à assumer.**\n\nGardez seulement en tête que certaines thématiques risquent d'être moins documentées, faute d'avoir pu associer les acteurs concernés.\n\nL'essentiel : plutôt que de chercher à être exhaustif, **un diagnostic utile doit permettre de poser les bases d'un débat stratégique.**",
      ressources: [TEMOIGNAGE_RENNES_METROPOLE]
    }
  },
  q5: {
    absentPartiel: {
      title: 'Garder une trace, pour capitaliser sur la durée',
      description:
        "Conserver une trace des réunions, ateliers et entretiens menés facilite la mise à jour du diagnostic en cas de changement d'équipe, en évitant que la connaissance du territoire ne repose uniquement sur la mémoire du chargé de mission qui a dirigé l’exercice.\n\nCes éléments peuvent également éclairer d'éventuels choix méthodologiques ou politiques, invisibles dans le document final de diagnostic. Enfin, la liste des personnes sollicitées permet de vérifier la présence d'experts sur toutes les thématiques importantes du territoire. Elle fait aussi gagner du temps lors des échanges, en identifiant rapidement ce qui a changé depuis le dernier diagnostic, sans repartir de zéro.",
      ressources: [DIAGNOSTIC_BARONNIES]
    },
    satisfaisant: {
      title: "Poursuivre l'effort de traçabilité déjà engagé",
      description:
        "Le territoire a conservé quelques comptes-rendus de réunions, d’ateliers et d’entretiens, c'est une bonne habitude à poursuivre. Liste des personnes sollicitées, éléments de contexte sur certains choix méthodologiques ou politiques, etc. faciliteront la mise à jour du diagnostic.\n\nCela évitera aussi de devoir reconstituer certains échanges de mémoire, ou de repartir de zéro sur des thématiques déjà explorées avec les acteurs du territoire.",
      ressources: [DIAGNOSTIC_BARONNIES]
    }
  }
};

const PRIORISATION_DES_IMPACTS: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Ouvrir une section dédiée à la vulnérabilité',
      description:
        "Consacrer une section explicite à la vulnérabilité clarifie le diagnostic pour ses lecteurs en identifiant clairement où trouver le croisement entre exposition et sensibilité, plutôt que de le laisser diffus dans d'autres parties. Cela oblige également à formaliser la priorisation des impacts, un exercice rarement explicité.",
      ressources: []
    },
    satisfaisant: {
      title:
        'Identifier ce qui manque à votre section consacrée à la vulnérabilité',
      description:
        "Une section est déjà consacrée à la vulnérabilité, mais il manque quelque chose... Est-ce une question de fond ou de forme ?\n\n• Le contenu de cette section gagnerait-il à être approfondi ?\n• Est-ce plutôt sa place dans le diagnostic qui pose problème — trop discrète, noyée dans d'autres sections, pas assez mise en avant ?",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Prioriser les enjeux pour préparer la stratégie',
      description:
        'Prioriser est un acte stratégique et politique. Un diagnostic de vulnérabilité n’est pas une fin en soi : il doit être conçu comme un outil d’aide à la décision. Lorsque les moyens humains, techniques et financiers sont limités, ils doivent être concentrés là où la vulnérabilité est la plus forte.\n\nLa priorisation est l’exercice qui transforme le diagnostic en un outil d’aide à la décision, en donnant aux élus une base claire pour arbitrer. Choisir ses enjeux, c’est déjà faire stratégie.',
      ressources: []
    },
    satisfaisant: {
      title:
        'Fonder la priorisation des enjeux sur une analyse, pas en la décrétant',
      description:
        "Le diagnostic fait déjà état d'une liste d'enjeux prioritaires, sans pour autant vous satisfaire pleinement.\n\nPourquoi cette réserve ? La méthode de priorisation est-elle décrite de façon suffisamment claire ? Les critères de choix sont-ils explicites ? Les enjeux retenus vous semblent-ils issus d'une concertation suffisante avec les acteurs du territoire ?",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title:
        'Évaluer l’exposition et la sensibilité pour réaliser la matrice de vulnérabilité',
      description:
        "La matrice de vulnérabilité formalise, pour chaque impact identifié, **le croisement entre exposition, sensibilité et capacité d'adaptation** — les trois composantes qui déterminent le niveau de vulnérabilité du territoire face à cet impact. **Ce croisement transforme une liste d'impacts en une hiérarchie objectivée**, qui ne repose pas sur un jugement isolé ou arbitraire. En rendant visible et comparable le niveau de vulnérabilité associé à chaque impact, **la matrice permet aux enjeux prioritaires d'émerger directement de l'analyse**, plutôt que d'être désignés a priori.\n\nIl est possible que l’exercice ait été fait sans figurer dans le document final : certaines réponses sont à chercher dans les archives du diagnostic (comptes-rendus par exemple).",
      ressources: [DIAGNOSTIC_PNR_AUBRAC]
    },
    satisfaisant: {
      title: 'Identifier ce qui peut limiter la portée de la matrice existante',
      description:
        "La matrice de vulnérabilité figure dans le diagnostic — une base solide pour prioriser les impacts et déterminer les enjeux — sans pour autant que cela vous satisfasse pleinement.\n\n• La matrice semble-t-elle incomplète, certains acteurs ayant manqué lors des échanges collectifs ?\n• Le résultat de la matrice a-t-il fait émerger une hiérarchie qui ne correspondait pas totalement aux priorités politiques établies ?\n• Est-il possible que la matrice n'ait pas été partagée ou débattue collectivement, ce qui limite son appropriation et sa légitimité ?\n\nIl est possible que certaines réponses soient à chercher dans les archives du diagnostic.",
      ressources: [DIAGNOSTIC_PNR_AUBRAC]
    }
  }
};

const PROBLEMATISATION_ET_CONCLUSION: Record<string, QuestionRecommendations> =
  {
    q1: {
      absentPartiel: {
        title: 'Orienter la conclusion vers la suite de la démarche',
        description:
          "La conclusion du diagnostic ne mentionne pas encore de suite à donner, il se peut même qu'il n'y en ait pas.\n\nLe diagnostic n'est pas une fin en soi, mais une étape : sa conclusion doit orienter le lecteur vers ce qui vient ensuite, **l'élaboration de la stratégie**.\n\nConcrètement, elle peut ouvrir sur trois chantiers :\n\n• **Faire valider ce diagnostic** (et sa ou ses problématiques) **aux élus**, pour obtenir leur accord avant d'aller plus loin.\n• **Restituer les résultats aux acteurs mobilisés**, pour reconnaître leur contribution et les associer à la suite.\n• **Engager la phase de stratégie**, pour construire un plan d'action et des trajectoires d'adaptation à plus long terme.",
        ressources: []
      },
      satisfaisant: {
        title: 'Préparer vos lecteurs à la suite de la démarche',
        description:
          "Votre conclusion ouvre sur la suite de la démarche — c'est une bonne base : elle donne au lecteur une direction claire plutôt qu'un simple bilan.\n\nCette ouverture prépare déjà les esprits, notamment ceux des élus et des services techniques, à l'étape suivante : celle de l'**élaboration de la stratégie**.",
        ressources: []
      }
    },
    q2: {
      absentPartiel: {
        title:
          "Formaliser la problématique pour amorcer la trajectoire d'adaptation",
        description:
          "Sans problématique formalisée, le diagnostic reste un ensemble de constats juxtaposés — utiles, mais qui ne désignent pas encore ce que le territoire doit collectivement résoudre.\n\nFormaliser cette problématique, c'est faire basculer le diagnostic du registre du constat à celui de l'action : elle transforme une accumulation d'impacts subis en un défi à assumer, porté par une intention politique claire.\n\nC'est aussi une étape nécessaire pour engager la suite de la démarche TACCT : sans problématique explicite, il est difficile de cadrer l'élaboration de la trajectoire d'adaptation, faute de savoir précisément à quoi elle doit répondre.\n\nPrendre le temps de la formaliser, et de la faire valider par les élus, permet ainsi de démarrer la trajectoire sur des bases claires et partagées.",
        ressources: []
      },
      satisfaisant: {
        title:
          'Faire valider la problématique par vos élus pour un mandat clair',
        description:
          "Une ou plusieurs problématiques sont déjà identifiées — c'est une étape importante dans la démarche d'adaptation.\n\nUne problématique marque le passage du constat, porté par le diagnostic, à l'action. On quitte le registre technique pour entrer dans le registre politique. Là où un simple constat d'impacts peut décourager voire paralyser, **une problématique bien formulée engage et donne au contraire envie d'agir**.\n\nIl est très fortement recommandé de **faire valider la ou les problématiques par vos élus**. Vous obtiendrez ainsi un mandat clair pour construire votre trajectoire d'adaptation.",
        ressources: []
      }
    },
    q3: {
      absentPartiel: {
        title: "Restituer les résultats pour préparer l'action",
        description:
          "Si aucune restitution du diagnostic n'a lieu, le risque est qu'il finisse sur une étagère. La restitution fait du diagnostic un objet vivant et partagé : elle redonne une **vision d'ensemble** à ceux qui y ont contribué, et le fait découvrir à ceux qui n'y étaient pas.\n\nC'est aussi l'occasion de **donner à chacun un rôle clair dans la suite de la démarche** : aux élus de valider la problématique, aux services techniques et aux partenaires de s'engager dans l'élaboration de la trajectoire d'adaptation.\n\nSans ce temps de restitution, le passage du diagnostic à la stratégie risque de manquer d'élan et de portage partagé.",
        ressources: []
      },
      satisfaisant: {
        title: "Assortir la restitution d'un appel à l'action clair",
        description:
          'Vérifier que ces restitutions ont comporté des appels à l’action clair pour les participants. Par exemple :\n\n• Pour un élu, valider une problématique.\n• Pour un collègue des services techniques ou un partenaire, participer à la phase de stratégie pour l’élaboration de la trajectoire.',
        ressources: []
      }
    }
  };

const RECOMMENDATIONS_PAR_CRITERE: Record<
  CriterionSlug,
  Record<string, QuestionRecommendations>
> = {
  'donnees-climatiques': DONNEES_CLIMATIQUES,
  'donnees-socio-economiques': DONNEES_SOCIO_ECONOMIQUES,
  'dialogue-et-partage': DIALOGUE_ET_PARTAGE,
  'priorisation-des-impacts': PRIORISATION_DES_IMPACTS,
  'problematisation-et-conclusion': PROBLEMATISATION_ET_CONCLUSION
};

export const ROADMAP_RECOMMENDATIONS: Record<string, QuestionRecommendations> =
  Object.fromEntries(
    CRITERIA.flatMap((criterion) =>
      criterion.questions.flatMap((question) => {
        const recommendations =
          RECOMMENDATIONS_PAR_CRITERE[criterion.slug][question.id];
        return recommendations
          ? [[buildQuestionKey(criterion.slug, question.id), recommendations]]
          : [];
      })
    )
  );

export const getRecommendation = (
  questionKey: string,
  answer: AnswerValue
): QuestionRecommendation | null => {
  if (!yieldsRecommendation(answer)) return null;
  const recommendations = ROADMAP_RECOMMENDATIONS[questionKey];
  if (!recommendations) return null;
  return answer === '3'
    ? recommendations.satisfaisant
    : recommendations.absentPartiel;
};

export const getRecommendationCount = (answers: AnswerMap): number =>
  CRITERIA.reduce(
    (count, criterion) =>
      count +
      criterion.questions.filter((question) => {
        const questionKey = buildQuestionKey(criterion.slug, question.id);
        const answer = answers[questionKey];
        return (
          answer != null && getRecommendation(questionKey, answer) !== null
        );
      }).length,
    0
  );
