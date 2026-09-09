import type { StaticImageData } from 'next/image';
import { buildQuestionKey } from '../keys';
import { AnswerMap, AnswerValue, CriterionSlug } from '../types';
import { CRITERIA } from './criteria';

/**
 * Recommandations de la feuille de route, par question et par niveau de réponse :
 * - `absentPartiel` : recommandation commune à « absent » et « partiel »
 * - `satisfaisant` : sa propre recommandation
 * - « très satisfaisant » : aucune recommandation
 * Un bloc `ressources` vide n'est pas affiché.
 */

export type RoadmapResourceTag =
  | 'donnees'
  | 'article'
  | 'reglementation'
  | 'exemple-diagnostic';

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

const DIAGNOSTIC_RENNES_METROPOLE: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title: 'Diagnostic de vulnérabilité de Rennes métropole',
  description:
    'Il s’agit du diagnostic de vulnérabilité au changement climatique de la métropole de Rennes (Bretagne), réalisé en 2025.',
  url: 'https://www.audiar.org/publication/environnement/climat/diagnostic-et-vulnerabilite-au-changement-climatique-a-rennes-metropole/',
  utilite:
    'Dans ce diagnostic de vulnérabilité, vous retrouverez l’usage des critères de notation de l’exposition actuelle et future.\n\nUn format de synthèse du diagnostic de vulnérabilité est également accessible.'
};

const DIAGNOSTIC_COEUR_DU_PAYS_HAUT: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title:
    'Diagnostic de la Communauté de communes Cœur du Pays Haut (Grand Est)',
  description:
    'Il s’agit du diagnostic de vulnérabilité au changement climatique de la Communauté de communes Cœur du Pays Haut (région Grand Est), réalisé en 2023.',
  url: 'https://coeurdupayshaut.fr/gedExt/contenu/RESILIENCE-CLIMATIQUE/DiagnosticVulnerabiliteCPH_.pdf',
  utilite:
    'C’est un exemple de diagnostic de vulnérabilité accordant une place centrale aux analyses de sensibilité et de vulnérabilité (voir les chapitres dédiés). De plus, ce document s’appuie sur le système de notation de la méthode TACCT (exposition actuelle, exposition future et sensibilité), ce qui permet d’identifier la vulnérabilité du territoire et de prioriser les enjeux clés.'
};

const DIAGNOSTIC_BARONNIES: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title:
    'Diagnostic de la Communauté de Communes des Baronnies en Drôme Provençale',
  description:
    'Il s’agit du diagnostic de vulnérabilité de la Communauté de Communes des Baronnies en Drôme Provençale.',
  url: 'https://www.cc-bdp.fr/wp-content/uploads/2024/12/202412_02b-Diagnostic-de-vulnerabilite_PCAET_CCBDP.pdf',
  utilite:
    'Le diagnostic de vulnérabilité mentionne explicitement la gouvernance associée.\n\nUne partie du diagnostic de vulnérabilité est consacrée aux difficultés rencontrées et solutions apportées laissant une trace utile du processus de réalisation du document pour la future révision.\n\nL’annexe bibliographique permet de consulter le support utilisé en séance lors de l’atelier sur la sensibilité du territoire au changement climatique (p.78).'
};

const DIAGNOSTIC_PNR_AUBRAC: RoadmapResource = {
  tag: 'exemple-diagnostic',
  title: 'Diagnostic du PNR de l’Aubrac',
  description:
    'Il s’agit du rapport de vulnérabilité climatique du parc naturel régional de l’Aubrac.',
  url: 'https://www.parc-naturel-aubrac.fr/en-action/trajectoires-dadaptation-au-changement-climatique-des-territoires/',
  utilite:
    'Le diagnostic de vulnérabilité présente des données d’exposition sur les horizons de temps 2050 et 2100.\n\nA partir de la page 66, l’analyse de la sensibilité est menée et permet de visualiser les résultats obtenus avec la matrice de vulnérabilité.'
};

const DONNEES_SENSIBILITE_TACCT: RoadmapResource = {
  tag: 'donnees',
  title: 'Les données de sensibilité sur le site TACCT',
  description:
    'La plateforme TACCT donne un accès direct à des données du territoire – socio-économiques, climatiques, environnementales.',
  url: 'https://tacct.ademe.fr/recherche-territoire',
  utilite:
    'Il s’agit d’une sélection d’indicateurs permettant d’engager rapidement le dialogue avec les acteurs locaux, sur une base commune, et d’identifier ensemble les vulnérabilités du territoire face au changement climatique.'
};

const TEMOIGNAGE_RENNES_METROPOLE: RoadmapResource = {
  tag: 'article',
  title: 'Témoignage de Rennes Métropole',
  description:
    'Il s’agit de l’article “Réaliser votre diagnostic de vulnérabilité” qui reprend le témoignage de Clémence Noyau, chargée de mission adaptation au changement climatique à Rennes Métropole.',
  url: 'https://tacct.ademe.fr/ressources/demarrer-diagnostic-vulnerabilite/realiser-diagnostic-vulnerabilite',
  utilite:
    'Il permet de comprendre la démarche suivie par une chargée de mission avec la place accordée à la donnée et aux temps de mobilisation. Cet article met en avant les apprentissages liés à la réalisation du diagnostic de vulnérabilité de la métropole et l’intérêt de mobiliser pour légitimer le diagnostic de vulnérabilité. “Pour moi, dans le diagnostic de vulnérabilité, le plus important, c’est le processus, c’est profiter de cette occasion pour aller rencontrer et mobiliser tout le monde sur ces questions” (Clémence Noyau).'
};

const GUIDE_ENTRETIENS: RoadmapResource = {
  tag: 'article',
  title: 'Exemple de guide d’entretiens',
  description:
    'Il s’agit de l’article “Entretiens de terrain : l’autre pilier du diagnostic de vulnérabilité” disponible dans notre collection “Associer les parties prenantes”.',
  url: 'https://tacct.ademe.fr/ressources/associer-parties-prenantes/entretien-adaptation',
  utilite:
    'Les bases de données ne révèlent pas tout : elles ne rendent pas compte des réalités vécues ni des signaux faibles qui émergent sur le terrain. Retrouvez ici les bonnes pratiques et un exemple de format simple pour mener des entretiens efficaces. Votre diagnostic de vulnérabilité parlera véritablement de votre territoire.'
};

const RETOURS_ATELIERS_SENSIBILITE: RoadmapResource = {
  tag: 'article',
  title: 'Retours d’expérience sur les ateliers sensibilité',
  description:
    'Retrouvez nos deux retours d’expériences de territoires ayant animé des ateliers pour évaluer leur sensibilité. Disponibles dans notre collection “Évaluer les impacts du changement climatique”.',
  url: 'https://tacct.ademe.fr/ressources/evaluer-impacts-changement-climatique',
  utilite:
    'Découvrez les apprentissages liés à la réalisation d’ateliers sensibilité. Ces deux retours d’expériences proposent des déroulés d’ateliers, à personnaliser à votre contexte, pour évaluer la sensibilité de votre territoire.'
};

const DONNEES_CLIMATIQUES: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Documenter le passé climatique du territoire',
      description:
        "Les éléments recueillis sur ce point sont encore trop parcellaires pour dresser un tableau clair de l’état du climat de votre territoire. Les données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) sont un bon point de départ pour établir ce constat et objectiver des tendances déjà à l'œuvre.\n\nAttention, pour pouvoir parler de tendances d’évolution du climat, qu’il soit global ou local, il est impératif de se baser sur des évolutions de long terme (30 ans). En deçà, la variabilité interannuelle naturelle du climat peut fausser l’évaluation de ces tendances.\n\nPar exemple, une succession de 3 ou 4 années de températures particulièrement basses n’indique pas une tendance au refroidissement.",
      ressources: [
        {
          tag: 'donnees',
          title: 'Base de données GASPAR',
          description:
            'La base de données GASPAR (Base nationale de Gestion ASsistée des Procédures Administratives relatives aux Risques) recense pour chaque commune les arrêtés de reconnaissance de l’état de catastrophe naturelle parus au Journal officiel depuis la création du dispositif en 1982.',
          url: '',
          utilite:
            'Ces données complètent les données climatiques passées, en apportant un éclairage sur les « aléas induits » (mouvements de terrain, submersion, inondations, coulées de boues…) dont la fréquence est susceptible d’évoluer avec le changement climatique.\n\nVisualisez ces données sur TACCT, dans notre thématique ‘Gestion des risques’, onglet ‘Données de mon territoire’.'
        }
      ]
    },
    satisfaisant: {
      title: 'Explorer davantage le passé climatique du territoire',
      description:
        "C’est un bon début, mais ce volet mérite peut-être d'être un peu étoffé pour être tout à fait convaincant. L'exploitation de données d'observation (évolution de la fréquence, de la durée, de l'intensité ou de la précocité de certains phénomènes) est importante pour mettre en évidence les caractéristiques du climat de votre territoire et peut permettre d'objectiver des tendances déjà à l'œuvre.",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Utiliser les projections climatiques de la TRACC',
      description:
        "Depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC) doit être intégrée dans tous les documents de planification.\n\nSi certains paramètres vous semblent manquants dans la TRACC, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent au +4°C pour la métropole, et de pousser l’analyse jusqu’en fin de siècle (RCP 8.5 par exemple).",
      ressources: [
        {
          tag: 'donnees',
          title: 'Climadiag Commune par Météo-France',
          description:
            'Climadiag Commune est un service de Météo France, en accès libre et gratuit, décrivant les évolutions potentielles du climat à l‘échelle des communes et des EPCI. Les indicateurs (températures moyennes, cumuls de précipitations,…) correspondent aux différents niveaux de réchauffement de la TRACC aux horizons 2030, 2050 et 2100. Ils sont organisés en cinq familles (climat, risques naturels, santé, agriculture, tourisme).',
          url: 'https://meteofrance.com/climadiag-commune',
          utilite:
            'ClimaDiag Commune est un outil directement utilisable, sans nécessiter de compétences en climatologie ou en traitement de données, contrairement à d’autres outils, tel que DRIAS.'
        },
        {
          tag: 'reglementation',
          title: 'Décret n° 2026-23 du 23 janvier 2026',
          description:
            "Il s’agit du décret relatif à la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique (TRACC) adoptée par la France.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399130',
          utilite:
            "Le décret du 23 janvier 2026 précise les modalités de définition de la TRACC. C'est ce texte qui légitime l'usage par les territoires de la TRACC comme référence officielle dans les diagnostics de vulnérabilité."
        },
        {
          tag: 'reglementation',
          title: 'Arrêté du 23 janvier 2026',
          description:
            "Il s’agit de l’arrêté du 23 janvier 2026 fixant les niveaux de réchauffement de la Trajectoire de Réchauffement de Référence pour l'Adaptation au Changement Climatique.",
          url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399165',
          utilite:
            "L'arrêté du 23 janvier 2026 définit les niveaux de réchauffement (par rapport à l'ère préindustrielle) à différents horizons temporels pour la métropole et les territoires ultramarins."
        }
      ]
    },
    satisfaisant: {
      title:
        'Compléter avec des projections climatiques compatibles avec la TRACC',
      description:
        "Le cas échéant, quelques ajustements suffiront.\n\nComplétez vos paramètres TRACC ; si certains vous semblent manquants, veillez à utiliser des projections provenant d’un scénario respectant un niveau de réchauffement équivalent à +4°C pour la métropole (RCP 8.5 par exemple), et de pousser l’analyse jusqu’en fin de siècle.\n\nRappel : depuis 2026, la prise en compte de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique n’est plus une option et doit être intégrée dans tous les documents de planification.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title: 'Réduire la partie sur les données climatiques mondiales',
      description:
        "Évitez l'écueil des généralités en reproduisant des constats déjà largement documentés à l'échelle globale. Les données mondiales, voire nationales, sont assez éloignées des réalités locales, même si, ponctuellement, les échelles intermédiaires (départementales, régionales) peuvent offrir un cadre de comparaison pertinent pour positionner votre territoire.\n\nSi nécessaire, rapprochez-vous du groupe régional d'experts sur le climat de votre région. Dosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
      ressources: []
    },
    satisfaisant: {
      title: 'Alléger la partie sur les données climatiques mondiales',
      description:
        "Un petit effort de synthèse s’impose. Réorientez cette première partie de votre diagnostic pour être exploitable : elle doit aider les acteurs locaux à se projeter dans une réalité qui leur est directement lisible, plutôt que de reproduire des constats déjà largement documentés à l'échelle globale.\n\nDosez intelligemment : assez de contexte pour comprendre, assez de local pour agir.",
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
        "Un diagnostic n’est pas un inventaire, c'est le fruit d'une analyse. La recherche d'indicateurs de projections climatiques peut faire apparaître des aléas sans effet réel sur votre territoire.\n\nS’il est utile d’en conserver la trace dans vos documents de travail, mieux vaut ne restituer dans le diagnostic que les données climatiques reliées à des impacts locaux. Les lecteurs vous remercieront d’aller à l’essentiel !",
      ressources: []
    }
  },
  q5: {
    absentPartiel: {
      title:
        "Identifier les phénomènes climatiques qui ont le plus d'impacts sur le territoire, aujourd’hui, mais aussi demain",
      description:
        "Rassurez-vous, l’exercice n’est pas une évaluation scientifique nécessitant des connaissances poussées en climatologie. A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des aléas les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\nQuelques questions peuvent aider à réfléchir collectivement à l’importance des aléas les uns par rapport aux autres (fréquence, étendue sur le territoire, préoccupation déjà exprimée localement…). N'oubliez pas non plus de couvrir les deux temporalités de l'exercice : l'exposition passée et l'exposition future, à évaluer à l'aide de la TRACC.",
      ressources: [DIAGNOSTIC_RENNES_METROPOLE]
    },
    satisfaisant: {
      title: 'Compléter l’évaluation de l’exposition',
      description:
        "A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des aléas les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\nLa qualification de la gravité des aléas reste incomplète ? Identifiez ce qui bloque :\n\n• une échelle trop binaire (aléa « grave » / « pas grave »), sans nuance intermédiaire, ni critères explicites (fréquence, étendue, préoccupation locale par exemple).\n• une couverture incomplète des aléas sans justification des omissions.\n• une seule temporalité traitée : la gravité a été évaluée sur la base des observations passées, sans anticipation de l'évolution future des aléas via la TRACC.\n• un exercice individuel plutôt que collectif : la qualification a été réalisée par un seul agent ou service, sans partage ni validation collective, ce qui questionne l’échelonnement des aléas retenus.",
      ressources: []
    }
  }
};

const IMPACTS_ANCRES_DESCRIPTION =
  "Privilégiez les impacts pour lesquels un acteur local peut être consulté, plutôt que ceux uniquement documentés par la littérature scientifique. Un impact générique est vrai mais non discriminant : il s'applique partout, quel que soit le territoire. C'est souvent le cas des impacts qui se limitent à relater un phénomène physique, comme « recrudescence des dépérissements forestiers », sans préciser l'effet socio-économique qui en découle — ici, la fragilisation de la filière bois locale ou la perte de potentiel touristique.\n\nDans l’idéal, un impact bien décrit, c’est l'expression d’une évolution + un effet sur le territoire en lien avec un aléa. Par exemple “Baisse de fréquentation des commerces de centre-ville lors des épisodes de canicule”.\n\nCertains impacts ne sont pas quantifiables (pratiques fragilisées, dépendances locales, comportements…) ; seul le dialogue avec les acteurs permet de les faire émerger.";

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
        'Si nécessaire, mettre en lumière les effets dominos entre impacts, au delà des silos sectoriels',
      description:
        "L'analyse de la sensibilité couvre un large éventail de thématiques — ressources en eau, agriculture, santé, infrastructures, biodiversité, activités économiques… — car la vulnérabilité d'un territoire ne se limite jamais à un seul secteur.\n\nCes thématiques sont en outre étroitement liées entre elles : un aléa peut affecter plusieurs dimensions à la fois, et les impacts sur l'une peuvent en entraîner d'autres en cascade. C'est cette richesse d'interactions à explorer qui explique la place importante que prend naturellement cette partie dans le diagnostic.",
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
        'Vous ne semblez pas pleinement satisfait : certaines données manquent de précision territoriale (par exemple : la répartition des essences en forêt à l’échelle de la région) ? Certains secteurs clés sont-ils sous représentés, voire non documentés ?',
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
      title: 'Évaluer la gravité des impacts affectant le territoire',
      description:
        "Rassurez-vous, l’exercice n’est pas une évaluation scientifique nécessitant des connaissances poussées. A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des impacts les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\nQuelques questions peuvent aider à réfléchir collectivement à l’importance des impacts les uns par rapport aux autres (nombre de personnes / activités concernées, étendue géographique de l’impact, délai avant que l’impact ne devienne critique, irréversibilité de l’impact…).",
      ressources: []
    },
    satisfaisant: {
      title:
        'Identifier ce qui manque dans l’évaluation de la gravité des impacts',
      description:
        "A l’image des codes couleurs (jaune, orange, rouge) de vigilance météorologique, il s'agit de qualifier la gravité des impacts les uns par rapport aux autres, en se dotant d'une convention partagée — pour ne pas dire « c'est grave » ou « ce n'est pas grave » chacun dans son coin.\n\nLa qualification de la gravité des impacts reste incomplète ? Identifiez ce qui bloque :\n\n• une échelle trop binaire (impact « grave » / « pas grave »), sans nuance intermédiaire, ni critères explicites (nombre de personnes / activités concernées, étendue géographique de l’impact, délai avant que l’impact ne devienne critique, irréversibilité de l’impact…).\n• une couverture sectorielle incomplète.\n• un exercice individuel plutôt que collectif : la qualification a été réalisée par un seul agent ou service, sans partage ni validation collective, ce qui questionne l’échelonnement des impacts retenus.",
      ressources: []
    }
  }
};

const DIALOGUE_ET_PARTAGE: Record<string, QuestionRecommendations> = {
  q1: {
    absentPartiel: {
      title: 'Décrire l’approche méthodologique',
      description:
        "Décrire la méthodologie utilisée permet de rendre le diagnostic plus transparent et plus facile à interpréter pour ceux qui le liront sans avoir participé à son élaboration.\n\nExpliciter les choix méthodologiques (concepts retenus, sources mobilisées, critères de choix) permet de mieux justifier les priorités du diagnostic en montrant qu'elles reposent sur une démarche rigoureuse plutôt que sur des choix arbitraires.",
      ressources: []
    },
    satisfaisant: {
      title: 'Compléter les descriptions méthodologiques, là où elles manquent',
      description:
        "Vous avez pris soin de décrire l’approche méthodologique suivie, ce qui est loin d'être systématique et facilite grandement la lecture du diagnostic par des tiers. Cela permet de comprendre comment l'étude a été réalisée.\n\nSi vous n'avez répondu que « satisfaisant », c'est peut-être le signe que cette description pourrait encore gagner en précision. À la relecture, quels éléments vous auraient permis de répondre franchement « très satisfaisant » ?",
      ressources: []
    }
  },
  q2: {
    absentPartiel: {
      title: 'Enrichir le diagnostic avec des verbatims',
      description:
        "Un bon diagnostic reste solide sans verbatims, mais probablement un peu plus abstrait, avec un pouvoir de conviction moindre.\n\nLes verbatims apportent ce supplément d'ancrage dans le vécu réel qui rend le diagnostic plus mobilisateur, sans pour autant être indispensables à sa validité.",
      ressources: []
    },
    satisfaisant: {
      title:
        'Conserver la bonne pratique d’illustrer le diagnostic avec des verbatims',
      description:
        "Votre diagnostic présente quelques verbatims, et c’est précieux : ce sont eux qui apportent ce supplément d'ancrage dans le vécu réel et rendent le diagnostic plus mobilisateur, car moins abstrait.\n\nConservez cette bonne pratique, votre pouvoir de conviction n’en sera que renforcé.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title: 'Rechercher les actions déjà engagées sur le territoire',
      description:
        "Contribuer au diagnostic peut avoir un effet anxiogène, en donnant l'impression d'un territoire démuni face au changement climatique. Évoquer les actions déjà menées permet de rééquilibrer ce récit en montrant que le territoire n'est pas passif, mais déjà engagé dans une dynamique d'adaptation.\n\nCela permet aussi de pondérer les ressentis : un territoire peut être sensible à un aléa tout en ayant déjà renforcé sa capacité de réponse. Il est intéressant de mener cette réflexion lors de l’exercice de qualification de la sensibilité. Le diagnostic gagne ainsi en richesse, sans minimiser les enjeux, mais sans céder au fatalisme non plus.\n\nSi aucune action n'apparaît dans le document, cela ne signifie pas nécessairement que le sujet n’a pas été abordé. Il a pu l’être en atelier sans être repris dans le document final. Considérez alors cette question comme une « enquête à mener » en allant vérifier, dans les comptes-rendus par exemple.",
      ressources: []
    },
    satisfaisant: {
      title: 'Citer les actions déjà menées',
      description:
        "Avoir identifié quelques actions engagées sur le territoire est une bonne dynamique à poursuivre. Ce travail permet de rééquilibrer le récit du diagnostic, souvent focalisé sur les vulnérabilités, en montrant que le territoire n'est pas passif mais déjà en mouvement face au changement climatique.\n\nIl permet surtout de pondérer les ressentis : un territoire peut rester sensible à un aléa tout en ayant déjà renforcé sa capacité de réponse. C’est un élément important qui influencera directement les résultats de la qualification de la sensibilité.",
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
        'Assumer le choix d’une consultation partielle : vous ne pourrez pas interroger tout le monde !',
      description:
        "La co-construction avec les acteurs du territoire suppose un arbitrage : plus les temps d’échange sont nombreux, plus l'ancrage dans le réel se renforce, mais au prix d'un temps de mobilisation plus important pour la collectivité.\n\nUne consultation partielle n'invalide pas le diagnostic, mais elle en limite la portée : certaines thématiques resteront peut-être orphelines, faute d'avoir pu associer les acteurs concernés.\n\nUn diagnostic utile n’est cependant pas celui qui vise l’exhaustivité, mais celui qui crée déjà les conditions d’un débat stratégique.",
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
        "Vous n'avez répondu que « satisfaisant » à cette question, plutôt que franchement « très satisfaisant ». Est-ce le contenu de la section qui vous semble perfectible, ou plutôt la place que cette analyse occupe dans le diagnostic ?\n\nLa suite de la feuille de route devrait vous aider à préciser ce qui manque dans le traitement de la vulnérabilité.",
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
        "Le diagnostic fait état d'une liste limitée d'enjeux prioritaires, mais votre réponse n'a pas été « très satisfaisant ».\n\nEst-ce la méthode de priorisation qui manque de clarté, les critères de choix qui restent implicites, ou la façon dont ces enjeux ont été arbitrés — par exemple sans réelle concertation avec les acteurs du territoire ? La suite de la feuille de route devrait vous aider à préciser ce qui manque.",
      ressources: []
    }
  },
  q3: {
    absentPartiel: {
      title:
        'Évaluer l’exposition et la sensibilité pour réaliser la matrice de vulnérabilité',
      description:
        "La matrice de vulnérabilité formalise, pour chaque impact identifié, le croisement entre exposition, sensibilité et capacité d'adaptation — les trois composantes qui déterminent le niveau de vulnérabilité du territoire face à cet impact.\n\nCe croisement transforme une liste d'impacts en une hiérarchie objectivée, qui ne repose pas sur un jugement isolé ou arbitraire. En rendant visible et comparable le niveau de vulnérabilité associé à chaque impact, la matrice permet aux enjeux prioritaires d'émerger directement de l'analyse, plutôt que d'être désignés a priori.\n\nIl est possible que l’exercice ait été fait sans figurer dans le document final. Considérez alors cette question comme une « enquête à mener » en allant vérifier dans les archives du diagnostic (comptes-rendus par exemple).",
      ressources: [DIAGNOSTIC_PNR_AUBRAC]
    },
    satisfaisant: {
      title: 'Identifier ce qui peut limiter la portée de la matrice existante',
      description:
        "Vous avez réalisé la matrice de vulnérabilité, ce qui constitue déjà une base solide pour la priorisation des impacts et la détermination des enjeux, et pourtant vous n'avez pas répondu « très satisfaisant ». La matrice semble-t-elle incomplète, certains acteurs ayant manqué lors des échanges collectifs ? Le résultat de la matrice a-t-il fait émerger une hiérarchie qui ne correspondait pas totalement aux priorités politiques établies ?\n\nEst-il possible que la matrice n'ait pas été partagée ou débattue collectivement, ce qui limite son appropriation et sa légitimité ?\n\nIl est possible que certaines réponses soient à chercher dans les archives du diagnostic. Considérez alors cette question comme une « enquête à mener ».",
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
          "Le diagnostic n'est pas une fin en soi, mais une étape ; sa conclusion doit donc porter le lecteur vers la suite de la démarche plutôt que de considérer le sujet comme clos.",
        ressources: []
      },
      satisfaisant: {
        title: "Préparer vos lecteurs à l'étape suivante",
        description:
          "Votre conclusion ouvre déjà sur la suite de la démarche — bravo. Elle donne au lecteur une direction claire plutôt qu'un simple bilan.\n\nCette formulation facilite la suite de la démarche : elle prépare déjà les esprits, notamment ceux des élus et des services techniques, à l'étape de la stratégie.",
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
          "La validation de votre (vos) problématique(s) marque un point d'étape important dans la démarche d'adaptation.\n\nElle signe le passage du constat (le diagnostic) à une posture agissante. Parce que ce passage fait basculer le registre du technique vers le politique — et qu'une problématique bien formulée engage et responsabilise là où un simple constat d'impacts peut paralyser ou décourager — il est recommandé de la faire valider par vos élus, afin d'obtenir un mandat clair pour l’élaboration de votre trajectoire d’adaptation.",
        ressources: []
      }
    },
    q3: {
      absentPartiel: {
        title: "Restituer les résultats pour préparer l'action",
        description:
          "Un diagnostic qui reste au stade du document produit risque de rester lettre morte. La restitution fait du diagnostic un objet vivant, partagé — elle redonne une vision d'ensemble à ceux qui l'ont construit, et le fait découvrir à ceux qui n'y étaient pas.\n\nC'est aussi l'occasion de donner à chacun un rôle clair dans la suite de la démarche, qu'il s'agisse pour les élus de valider une problématique ou pour les services techniques et les partenaires de s'engager dans l'élaboration de la trajectoire d'adaptation.\n\nSans ce temps de restitution, le passage du diagnostic à la stratégie risque de manquer d'élan et de portage partagé.",
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
  if (answer === 'tres_satisfaisant') return null;
  const recommendations = ROADMAP_RECOMMENDATIONS[questionKey];
  if (!recommendations) return null;
  return answer === 'satisfaisant'
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
