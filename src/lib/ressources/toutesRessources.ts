import ImageTuileArticle from '@/assets/images/imageTuileArticle.png';
import ImageTuileAutre from '@/assets/images/imageTuileAutre.png';
import ImageTuileMethodo from '@/assets/images/imageTuileMethodo.png';
import ImageTuileQuiz from '@/assets/images/imageTuileQuiz.png';
import ImageTuileRex from '@/assets/images/imageTuileRex.png';
import { StaticImageData } from 'next/image';
import { JSX } from 'react';

export const FiltresOptions = [
  {
    titre: 'Je cherche à',
    options: ["M'inspirer", 'Me former', 'Agir']
  },
  {
    titre: 'Format de ressource',
    options: ['Article', "Retour d'expérience", 'Formation', 'Quiz', 'Support méthodo']
  },
  {
    titre: 'Territoire',
    options: [
      'Auvergne-Rhône-Alpes',
      'Bourgogne-Franche-Comté',
      'Bretagne',
      'Centre-Val de Loire',
      // 'Corse',
      'Grand Est',
      // 'Hauts-de-France',
      // 'Ile-de-France',
      // 'Normandie',
      'Nouvelle-Aquitaine',
      'Occitanie',
      // 'Pays de la Loire',
      // "Provence Alpes Côte d'Azur",
      // 'Guadeloupe',
      // 'Guyane',
      // 'Martinique',
      // 'Mayotte',
      // 'Réunion',
      'Outremer'
    ]
  }
];

export type ToutesRessources = {
  id: number;
  type: string;
  Component?: () => JSX.Element;
  titre: string;
  description: string;
  lien: string;
  filtres: string[];
  collections: string[];
  tempsLecture: number;
  image: StaticImageData;
  date: string;
  ordre: number;
  ordreCollection: number;
  slug?: string;
  metadata?: {
    title: string;
    description: string;
  };
};

export const toutesLesRessources: ToutesRessources[] = [
  {
    id: 1,
    type: 'Article',
    slug: 'analyser-diagnostic-vulnerabilite',
    titre: 'Que lire en priorité dans votre diagnostic de vulnérabilité ?',
    description:
      'Relisez votre diagnostic de vulnérabilité en 10 minutes : identifiez les données utiles et les enjeux prioritaires pour enclencher une stratégie d’adaptation concertée.',
    lien: '/ressources/articles/analyser-diagnostic-vulnerabilite',
    filtres: ['Article', 'Agir'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 5,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 70,
    ordreCollection: 1,
    metadata: {
      title: 'Que lire en priorité dans votre diagnostic de vulnérabilité ?',
      description:
        'Relisez votre diagnostic de vulnérabilité aux effets du changement climatique en 10 minutes : repérez les données utiles et les enjeux clés.'
    }
  },
  {
    id: 2,
    type: 'Article',
    slug: 'pnacc-tracc-comment-suis-je-concerne',
    titre: 'PNACC, TRACC, Comment suis-je concerné ?',
    description:
      'Découvrez les documents stratégiques qui orientent l’adaptation en France et permettent d’anticiper et de mettre en œuvre des stratégies cohérentes.',
    lien: '/ressources/articles/pnacc-tracc-comment-suis-je-concerne',
    filtres: ['Article', 'Me former'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileArticle,
    date: '2025-07-25',
    ordre: 20,
    ordreCollection: 2,
    metadata: {
      title: 'PNACC, TRACC, Comment suis-je concerné ?',
      description:
        'PNACC, TRACC autant de documents stratégiques qui orientent l’adaptation au changement climatique en France. Comprendre leur contenu est nécessaire pour anticiper et mettre en oeuvre des stratégies cohérentes.'
    }
  },
  {
    id: 3,
    type: "Retour d'expérience",
    titre:
      'Adaptation au changement climatique : déploiement de la démarche TACCT',
    description:
      'Le Pays Pyrénées Méditerranée a mis en œuvre la démarche TACCT du diagnostic à la stratégie. Retrouvez toutes les étapes de la démarche !',
    lien: 'https://www.payspyreneesmediterranee.org/thematiques/transitions-energie-climat/adaptation-au-changement-climatique/',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 90,
    ordreCollection: 9
  },
  {
    id: 4,
    type: "Retour d'expérience",
    titre:
      "Diagnostic de vulnérabilité d'un territoire rural du Nord Est - Cœur du Pays Haut",
    description:
      'La démarche TACCT est une approche systémique de l’adaptation. Découvrez le contexte et les étapes clés pour la réalisation du diagnostic de vulnérabilité par la CC du Cœur du Pays Haut.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7910-diagnostic-de-vulnerabilite-au-rechauffement-climatique-d-un-territoire-rural-du-nord-est-de-la-france-coeur-du-pays-haut.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 30,
    ordreCollection: 8
  },
  {
    id: 5,
    type: "Retour d'expérience",
    titre:
      "Réalisation d'un diagnostic de vulnérabilité - Epernay Agglo Champagne",
    description:
      'Diagnostic de vulnérabilité réalisé dans le cadre d’un PCAET grâce à la démarche TACCT : découvrez les apprentissages d’Epernay Agglo Champagne !',
    lien: 'https://www.climaxion.fr/docutheque/realisation-dun-diagnostic-vulnerabilite-au-changement-climatique-epernay-agglo-champagne',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 3,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 110,
    ordreCollection: 6
  },
  {
    id: 6,
    type: "Retour d'expérience",
    titre:
      "Retour d'expériences de la mise en place de la démarche TACCT sur des territoires",
    description:
      'Intéressé par la démarche TACCT ? Cette fiche est un retour d’expérience des bonnes pratiques et points de vigilance pour 10 territoires ayant suivi la démarche en AURA - Occitanie.',
    lien: 'https://librairie.ademe.fr/7538-adaptation-au-changement-climatique.html',
    filtres: [
      "Retour d'expérience",
      "M'inspirer",
      'Auvergne-Rhône-Alpes',
      'Occitanie'
    ],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 11,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 80,
    ordreCollection: 11
  },
  {
    id: 7,
    type: "Retour d'expérience",
    titre:
      'Evaluer la sensibilité du territoire en atelier - Vallée de Kaysersberg (68)',
    description:
      'Suite à l’analyse de l’exposition du territoire, évaluer sa sensibilité permet de comprendre la manière dont il sera affecté. La Vallée de Kaysersberg a mené un atelier participatif.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7906-evaluer-la-sensibilite-au-changement-climatique-en-atelier-retour-d-experience-de-la-vallee-de-kaysersberg-68.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Évaluer les impacts du changement climatique'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 70,
    ordreCollection: 5
  },
  {
    id: 8,
    type: "Retour d'expérience",
    titre:
      'Atelier d’évaluation de la sensibilité du territoire - PNR Pyrénées Ariégeoises (09)',
    description:
      'Pour réaliser son diagnostic de vulnérabilité, il faut analyser l’exposition, puis la sensibilité. Pour réaliser cela en concertation, le PNR des Pyrénées Ariégeoises a mis en place un atelier dédié.',
    lien: 'https://librairie.ademe.fr/changement-climatique-et-energie/6223-evaluation-en-atelier-de-la-sensibilite-du-territoire-au-changement-climatique-au-pnr-pyrenees-ariegeoises-09.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Évaluer les impacts du changement climatique'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 120,
    ordreCollection: 4
  },
  {
    id: 9,
    type: 'Article',
    slug: 'resilience-agricole-indicateurs-territoire',
    titre:
      'Comment mesurer la résilience d’un territoire agricole face au changement climatique ?',
    description:
      '22 indicateurs pour aider les chargés de mission climat à évaluer la résilience agricole et repérer les vulnérabilités au changement climatique.',
    lien: '/ressources/articles/resilience-agricole-indicateurs-territoire',
    filtres: ['Article', 'Me former'],
    collections: ['Évaluer les impacts du changement climatique'],
    tempsLecture: 7,
    image: ImageTuileArticle,
    date: '2025-10-14',
    ordre: 10,
    ordreCollection: 2,
    metadata: {
      title:
        'Comment mesurer la résilience d’un territoire agricole face au changement climatique ?',
      description:
        '22 indicateurs pour aider les chargés de mission climat à évaluer la résilience agricole et repérer les vulnérabilités au changement climatique.'
    }
  },
  {
    id: 10,
    type: 'Article',
    slug: 'ilot-chaleur-urbain-erreurs-a-eviter',
    titre:
      'Îlot de chaleur urbain : 4 erreurs fréquentes à éviter pour mieux agir sur le terrain',
    description:
      'Vous vous interrogez sur la présence d’un îlot de chaleur urbain sur votre territoire ? Voici 4 erreurs fréquentes à éviter avant de lancer un diagnostic.',
    lien: '/ressources/articles/ilot-chaleur-urbain-erreurs-a-eviter',
    filtres: ['Article', 'Me former'],
    collections: ['Évaluer les impacts du changement climatique'],
    tempsLecture: 8,
    image: ImageTuileArticle,
    date: '2025-07-25',
    ordre: 30,
    ordreCollection: 3,
    metadata: {
      title:
        'Îlot de chaleur urbain : 4 erreurs fréquentes à éviter pour mieux agir sur le terrain',
      description:
        'Îlot de chaleur urbain : 4 erreurs fréquentes à éviter pour mieux comprendre le phénomène, cibler les bons diagnostics et adapter l’action aux enjeux locaux.'
    }
  },
  {
    id: 11,
    type: 'Article',
    slug: 'reussir-mobilisation-acteurs-adaptation',
    titre: 'Lever les freins d’une mobilisation difficile',
    description:
      'La mobilisation n’est jamais simple, nous avons identifié des freins et des pratiques concrètes à activer pour réaliser une mobilisation efficace.',
    lien: '/ressources/articles/reussir-mobilisation-acteurs-adaptation',
    filtres: ['Article', 'Agir'],
    collections: ['Associer les parties prenantes'],
    tempsLecture: 3,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 50,
    ordreCollection: 2,
    metadata: {
      title: 'Lever les freins d’une mobilisation difficile',
      description:
        'Conseils pour éviter de prêcher dans le désert et maximiser l’impact de vos actions d’adaptation.'
    }
  },
  {
    id: 12,
    type: 'Article',
    slug: 'ateliers-adacc-adaptation',
    titre:
      'Sensibiliser : les ateliers de l’adaptation au changement climatique (AdACC)',
    description:
      'La sensibilisation, un préalable à la mobilisation ? Retour d’expérience de Sarah Clamens avec la mise en œuvre des Ateliers de l’Adaptation au Changement Climatique à la CA de Saintes.',
    lien: '/ressources/articles/ateliers-adacc-adaptation',
    filtres: ['Article', "Retour d'expérience", 'Agir', 'Nouvelle-Aquitaine'],
    collections: ['Associer les parties prenantes'],
    tempsLecture: 4,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 40,
    ordreCollection: 3,
    metadata: {
      title:
        'Sensibiliser : les ateliers de l’adaptation au changement climatique (AdACC)',
      description:
        'Présentation des Ateliers de l’Adaptation au Changement Climatique (AdACC) pour sensibiliser les acteurs.'
    }
  },
  {
    id: 13,
    type: 'Article',
    slug: 'atelier-climastory-sensibilisation-adaptation',
    titre: 'ClimaSTORY, une cartographie pour sensibiliser',
    description:
      'Approcher l’adaptation au changement climatique via une carte du territoire, fictive ou non : une manière sensible d’aborder le sujet.',
    lien: '/ressources/articles/atelier-climastory-sensibilisation-adaptation',
    filtres: ['Article', 'Agir'],
    collections: ['Associer les parties prenantes'],
    tempsLecture: 4,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 30,
    ordreCollection: 4,
    metadata: {
      title: 'ClimaSTORY, une cartographie pour sensibiliser',
      description:
        'Découvrez ClimaSTORY, un outil cartographique pour sensibiliser à l’adaptation au changement climatique.'
    }
  },
  {
    id: 14,
    type: "Retour d'expérience",
    titre:
      'Sensibiliser au lancement de la démarche TACCT - CC Ardennes Thiérache (08)',
    description:
      'La sensibilisation est un fort levier d’engagement dans une démarche TACCT : découvrez l’atelier mémoire utilisé par la CC Ardennes Thiérache pour mobiliser les élus communautaires et services.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7905-sensibiliser-au-lancement-de-la-demarche-tacct-retour-d-experience-de-la-cc-de-ardennes-thierache-08.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Associer les parties prenantes'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 60,
    ordreCollection: 5
  },
  {
    id: 15,
    type: "Retour d'expérience",
    titre:
      'Atelier de co-construction des actions d’adaptation - Epernay Agglo Champagne (51)',
    description:
      'La co-construction est un important facteur de réussite d’une démarche TACCT. Epernay Agglo Champagne met en lumière dans cette fiche l’identification des enjeux et des actions liées.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7909-atelier-de-co-construction-des-actions-face-aux-impacts-du-changement-climatique-d-epernay-agglo-champagne-51.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 20,
    ordreCollection: 5
  },
  {
    id: 16,
    type: "Retour d'expérience",
    titre:
      "TACCT. Une stratégie issue d'une trajectoire d'adaptation au changement climatique",
    description:
      'À la suite du diagnostic de vulnérabilité et pour la mise en oeuvre de sa stratégie, le pays Pyrénées Méditerranée a organisé 2 ateliers afin de définir ses trajectoires d’adaptation.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7726-tacct-une-strategie-issue-d-une-trajectoire-d-adaptation-au-changement-climatique.html#',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2025-07-25',
    ordre: 40,
    ordreCollection: 3
  },
  {
    id: 17,
    type: "Retour d'expérience",
    titre:
      'Trajectoires d’adaptation pour prévenir les incertitudes - PETR Pays Barrois (55)',
    description:
      'Les trajectoires d’adaptations permettent d’anticiper l’évolution climatique. Le PETR du Pays Barrois s’est basé sur ces trajectoires pour la mise en œuvre de groupements d’actions.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7908-des-trajectoires-d-adaptation-pour-prevenir-les-incertitudes-du-changement-climatique-petr-du-pays-barrois-55.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 50,
    ordreCollection: 10
  },
  {
    id: 18,
    type: "Retour d'expérience",
    titre: 'Construire la feuille de route adaptation - Indre (36)',
    description:
      'En mobilisant de nombreuses parties prenantes, le département de l’Indre a mis en œuvre la démarche TACCT du diagnostic jusqu’à l’identification de la stratégie et du plan d’action.',
    lien: 'https://www.indre.gouv.fr/Actions-de-l-Etat/Environnement/Strategie-Climat-36-une-demarche-departementale-et-partenariale/3.-Construire-notre-feuille-de-route/La-methode',
    filtres: ["Retour d'expérience", "M'inspirer", 'Centre-Val de Loire'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 1,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 100,
    ordreCollection: 9
  },
  {
    id: 19,
    type: "Retour d'expérience",
    titre:
      'Confronter la robustesse de la charte d’un PNR face au changement climatique',
    description:
      'À la suite du diagnostic de vulnérabilité, le PNR des Pyrénées Ariégeoises a organisé un atelier pour mesurer la robustesse des actions d’adaptation dans sa charte jusqu’à 2040.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7727-tacct-confronter-la-robustesse-de-la-charte-d-un-parc-naturel-regional-au-changement-climatique.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2025-07-25',
    ordre: 50,
    ordreCollection: 7
  },
  {
    id: 20,
    type: "Retour d'expérience",
    titre:
      "Faire réagir par l'imaginaire en atelier TACCT - Clermont Auvergne Métropole (63)",
    description:
      'Utiliser la mise en récit lors d’un atelier de restitution de  votre diagnostic de vulnérabilité : Clermont Auvergne Métropole l’a fait avec une Une de journal fictive.',
    lien: 'https://librairie.ademe.fr/7215-questionner-l-imaginaire-pour-faire-reagir-en-atelier-tacct-retour-d-experience-de-clermont-auvergne-metropole-63.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 150,
    ordreCollection: 4
  },
  {
    id: 21,
    type: "Retour d'expérience",
    titre: 'Comment restituer son diagnostic ? - Haute Loire (43)',
    description:
      'Comment construire votre stratégie en embarquant les acteurs du territoire ? Un partage engageant du diagnostic est important : pour cela, la CA du Puy-en-Velay a articulé TACCT et l’atelier ClimaSTORY.',
    lien: 'https://librairie.ademe.fr/7180-comment-restituer-son-diagnostic-des-impacts-du-changement-climatique-en-haute-loire-43.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 140,
    ordreCollection: 7
  },
  {
    id: 22,
    type: "Retour d'expérience",
    titre: 'Comment restituer son diagnostic ? - Haute Savoie (74)',
    description:
      'Comment construire votre stratégie en embarquant les acteurs du territoire ? Un partage engageant du diagnostic est important : pour cela, la CCVCMB a articulé TACCT et l’atelier ClimaSTORY.',
    lien: 'https://librairie.ademe.fr/7129-comment-restituer-son-diagnostic-des-impacts-du-changement-climatique-en-haute-savoie-74-.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 130,
    ordreCollection: 8
  },
  {
    id: 23,
    type: "Retour d'expérience",
    titre:
      'Mettre en récit TACCT stratégie pour engager les élus - PNR du Pilat (42)',
    description:
      'Après avoir réalisé en autonomie son diagnostic de vulnérabilité, le PNR du Pilat a décidé de suivre TACCT Stratégie pour mobiliser et mettre en récit son territoire sur un enjeu déterminé.',
    lien: 'https://librairie.ademe.fr/7544-mettre-en-recit-tacct-strategie-pour-engager-les-elus-retour-d-experience-du-pnr-du-pilat-42.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 70,
    ordreCollection: 5
  },
  {
    id: 24,
    type: "Retour d'expérience",
    titre: "Présenter le diagnostic de l'exposition - PNR Vosges du Nord (67)",
    description:
      'Une facette du diagnostic de vulnérabilité, l’analyse de l’exposition. Découvrez l’usage des données climatiques actuelles et futures du PNR des Vosges du Nord.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7907-presenter-le-diagnostic-de-l-exposition-retour-d-experience-du-pnr-des-vosges-du-nord-67.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 10,
    ordreCollection: 6
  },
  {
    id: 25,
    type: "Retour d'expérience",
    titre:
      'Restituer le diagnostic de vulnérabilité - CC de la Vallée de Villé (67)',
    description:
      'Le diagnostic de vulnérabilité est le document idéal pour partager le constat territorial : la CC de la Vallée de Villé a organisé une restitution participative avec élus, agents et habitants.',
    lien: 'https://librairie.ademe.fr/changement-climatique/7911-restituer-le-diagnostic-de-vulnerabilite-retour-d-experience-de-la-cc-de-la-vallee-de-ville-67.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Grand Est'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 40,
    ordreCollection: 3
  },
  {
    id: 26,
    type: 'Article',
    slug: 'briser-silos-approche-systemique',
    titre: 'Brisez les silos : introduction à l’approche systémique',
    description:
      'Comprendre les interactions au sein de votre système est essentiel pour éviter les maladaptations. L’approche systémique vous accompagne de l’identification jusqu’à la mobilisation.',
    lien: '/ressources/articles/briser-silos-approche-systemique',
    filtres: [
      'Article',
      "Retour d'expérience",
      "M'inspirer",
      'Bourgogne-Franche-Comté'
    ],
    collections: ['Adopter la bonne posture'],
    tempsLecture: 5,
    image: ImageTuileArticle,
    date: '2025-07-25',
    ordre: 20,
    ordreCollection: 2,
    metadata: {
      title: 'Brisez les silos : introduction à l’approche systémique',
      description:
        'Comprendre les interactions au sein de votre système est essentiel pour éviter les maladaptations. L’approche systémique vous accompagne de l’identification jusqu’à la mobilisation.'
    }
  },
  {
    id: 27,
    type: 'Article',
    slug: 'facilitation-ateliers-mobilisation',
    titre: 'La facilitation d’ateliers : une démarche éprouvée d’engagement',
    description:
      'Pour réellement engager vos parties prenantes dans votre démarche d’adaptation, appuyez-vous sur une démarche éprouvée : la facilitation d’ateliers.',
    lien: '/ressources/articles/facilitation-ateliers-mobilisation',
    filtres: ['Article', 'Agir'],
    collections: ['Adopter la bonne posture'],
    tempsLecture: 3,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 20,
    ordreCollection: 1,
    metadata: {
      title: 'La facilitation d’ateliers : une démarche éprouvée d’engagement',
      description:
        'Découvrez comment la facilitation d’ateliers peut renforcer l’engagement des parties prenantes dans l’adaptation.'
    }
  },
  {
    id: 28,
    type: "Retour d'expérience",
    titre: 'Coorganiser des ateliers TACCT pour mobiliser - Les Baronnies (26)',
    description:
      "Pourquoi et comment coorganiser des ateliers sur les enjeux de votre territoire ? La CCBDP a identifié trois enjeux d'adaptation majeurs et a souhaité mobiliser ses partenaires.",
    lien: 'https://librairie.ademe.fr/7228-coorganiser-des-ateliers-tacct-pour-mobiliser-retour-d-experience-dans-les-baronnies-en-drome-provencale-26.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Adopter la bonne posture'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 160,
    ordreCollection: 3
  },
  {
    id: 29,
    type: 'Article',
    slug: 'facilitation-cahier-charges',
    titre: 'Le cahier des charges, levier pour intégrer la facilitation',
    description:
      'Engager vos participants, ça s’anticipe : intégrez la facilitation d’ateliers (ou l’intelligence collective) dès la conception de votre cahier des charges.',
    lien: '/ressources/articles/facilitation-cahier-charges',
    filtres: ['Article', 'Agir'],
    collections: ['Piloter la démarche d’adaptation'],
    tempsLecture: 2,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 60,
    ordreCollection: 1,
    metadata: {
      title:
        'Le cahier des charges, levier pour intégrer la facilitation d’ateliers',
      description:
        'Le rôle du cahier des charges dans l’intégration de la facilitation pour l’adaptation au changement climatique.'
    }
  },
  {
    id: 30,
    type: "Retour d'expérience",
    titre: 'Piloter sa démarche TACCT - Bocage Bourbonnais (03)',
    description:
      'Le travail en transversalité entre services, agents et élus sont des gages de réussite. Comment et pourquoi la CCBB a mis en place une « équipe cœur » afin de piloter sa démarche TACCT ?',
    lien: 'https://librairie.ademe.fr/7214-piloter-sa-demarche-tacct-retour-d-experience-dans-le-bocage-bourbonnais-03.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Auvergne-Rhône-Alpes'],
    collections: ['Piloter la démarche d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2024-09-25',
    ordre: 170,
    ordreCollection: 5
  },
  {
    id: 31,
    type: 'Article',
    slug: 'stagiaire-diagnostic-vulnerabilite-climat',
    titre:
      'Recruter un stagiaire sur le diagnostic de vulnérabilité : bonne ou mauvaise idée ?',
    description:
      'Vous envisagez de confier le diagnostic de vulnérabilité à votre stagiaire ? Découvrez les erreurs à éviter, les missions possibles, et les bonnes pratiques pour un appui vraiment utile.',
    lien: '/ressources/articles/stagiaire-diagnostic-vulnerabilite-climat',
    filtres: ['Article', 'Agir'],
    collections: ['Piloter la démarche d’adaptation'],
    tempsLecture: 5,
    image: ImageTuileArticle,
    date: '2025-07-25',
    ordre: 30,
    ordreCollection: 2,
    metadata: {
      title:
        'Recruter un stagiaire sur le diagnostic de vulnérabilité : bonne ou mauvaise idée ?',
      description:
        'Vous envisagez de confier le diagnostic de vulnérabilité à votre stagiaire ? Découvrez les erreurs à éviter, les missions possibles, et les bonnes pratiques pour un appui vraiment utile.'
    }
  },
  {
    id: 32,
    type: 'Article',
    slug: 'strategie-adaptation-gestion-risque-relocalisation',
    titre:
      'De la gestion du risque à l’adaptation : le cas de la relocalisation de Miquelon',
    description:
      'Témoignages d’une projection sur le temps long avec l’exemple de Miquelon.',
    lien: '/ressources/articles/strategie-adaptation-gestion-risque-relocalisation',
    filtres: ['Article', "Retour d'expérience", "M'inspirer", 'Outremer'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 7,
    image: ImageTuileArticle,
    date: '2025-11-25',
    ordre: 10,
    ordreCollection: 1,
    metadata: {
      title:
        'De la gestion du risque à l’adaptation : le cas de la relocalisation de Miquelon',
      description:
        'De la gestion du risque à l’adaptation ou quand reculer devient avancer : témoignages d’une projection sur le temps long avec l’exemple de Miquelon.'
    }
  },
  {
    id: 33,
    type: 'Article',
    slug: 'mobilisation-diagnostic-vulnerabilite',
    titre:
      'Comment mobiliser en interne et en externe autour du diagnostic de vulnérabilité ?',
    description:
      'Découvrez le retour d’expérience de Jolet Van Kipshagen (CC Vallée de Villé) et les clés d’une démarche concertée et ancrée dans le territoire.',
    lien: '/ressources/articles/mobilisation-diagnostic-vulnerabilite',
    filtres: ['Article', 'Agir'],
    collections: ['Associer les parties prenantes'],
    tempsLecture: 6,
    image: ImageTuileArticle,
    date: '2025-11-04',
    ordre: 10,
    ordreCollection: 1,
    metadata: {
      title:
        'Comment mobiliser en interne et en externe autour du diagnostic de vulnérabilité ?',
      description:
        'Comment mobiliser élus, services et partenaires autour d’un diagnostic de vulnérabilité ? Découvrez le retour d’expérience de Jolet Van Kipshagen (CC Vallée de Villé) et les clés d’une démarche concertée et ancrée dans le territoire.'
    }
  },
  {
    id: 34,
    type: 'Article',
    titre:
      'Pourquoi et comment mettre en récit son diagnostic de vulnérabilité ?',
    slug: 'mise-en-recit-territoire-adaptation-climat',
    description:
      'Mettre en récit un diagnostic de vulnérabilité : un outil stratégique pour mobiliser élus et techniciens autour de l’adaptation au changement climatique.',
    lien: '/ressources/articles/mise-en-recit-territoire-adaptation-climat',
    filtres: ['Article', 'Agir'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 8,
    image: ImageTuileArticle,
    date: '2024-09-20',
    ordre: 10,
    ordreCollection: 1,
    metadata: {
      title:
        'Pourquoi et comment mettre en récit son diagnostic de vulnérabilité ?',
      description:
        'Découvrez comment mettre en récit votre territoire pour engager les acteurs locaux dans l’adaptation au changement climatique.'
    }
  },
  {
    id: 35,
    type: 'Quiz',
    titre: 'Auto-évaluation sur l’adaptation au changement climatique',
    description:
      "Testez vos connaissances sur l'adaptation au changement climatique et la méthode TACCT en 16 questions !",
    lien: 'https://tally.so/r/w4l8pk',
    filtres: ['Quiz', 'Me former'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 10,
    image: ImageTuileQuiz,
    date: '2025-12-10',
    ordre: 10,
    ordreCollection: 3
  },
  {
    id: 36,
    type: 'Formation',
    titre:
      "Adapter son territoire – Se mettre en marche vers une stratégie d'adaptation",
    description:
      'Cette formation permet de comprendre comment organiser et mettre en place un diagnostic de vulnérabilité et une stratégie d’adaptation au changement climatique pour son territoire.',
    lien: 'https://formations.ademe.fr/formations_changement-climatique_adapter-son-territoire-au-changement-climatique-�ie-se-mettre-en-marche-vers-une-strategie-d-adaptation_s5317.html',
    filtres: ['Formation', 'Me former'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 60 * 14,
    image: ImageTuileAutre,
    date: '2025-12-10',
    ordre: 20,
    ordreCollection: 4
  },
  {
    id: 37,
    type: 'Formation',
    titre: "Adapter son territoire - Outils et méthodes pour l'adaptation",
    description:
      "Cette formation en e-learning explique les principaux enjeux de l'adaptation au dérèglement climatique et comment y répondre.",
    lien: 'https://formations.ademe.fr/formations_changement-climatique_adapter-son-territoire-au-changement-climatique---outils-et-methodes-pour-l-adaptation_s5343.html',
    filtres: ['Formation', 'Me former'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 180,
    image: ImageTuileAutre,
    date: '2025-12-10',
    ordre: 30,
    ordreCollection: 5
  },
  {
    id: 38,
    type: 'Article',
    titre: 'Réaliser votre diagnostic de vulnérabilité',
    slug: 'realiser-diagnostic-vulnerabilite',
    description:
      'Découvrez comment Rennes Ville & Métropole a réalisé son diagnostic de vulnérabilité à l’aide de la méthode TACCT.',
    lien: '/ressources/articles/realiser-diagnostic-vulnerabilite',
    filtres: ['Article', "Retour d'expérience", 'Me former', 'Bretagne'],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 6,
    image: ImageTuileArticle,
    date: '2026-02-04',
    ordre: 10,
    ordreCollection: 1,
    metadata: {
      title: 'Réaliser votre diagnostic de vulnérabilité',
      description:
        'Découvrez comment Rennes Ville & Métropole a réalisé son diagnostic de vulnérabilité à l’aide de la méthode TACCT.'
    }
  },
  {
    id: 39,
    type: 'Article',
    titre:
      'Construire une stratégie d’adaptation : ce que nous avons appris en chemin',
    slug: 'strategie-trajectoire-adaptation',
    description:
      'D’un diagnostic de vulnérabilité priorisé à la définition de votre stratégie d’adaptation : témoignage de Montpellier Méditerranée Métropole',
    lien: '/ressources/articles/strategie-trajectoire-adaptation',
    filtres: ['Article', "Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 6,
    image: ImageTuileArticle,
    date: '2026-02-25',
    ordre: 9,
    ordreCollection: 0.5,
    metadata: {
      title:
        'Construire une stratégie d’adaptation : ce que nous avons appris en chemin',
      description:
        'D’un diagnostic de vulnérabilité priorisé à la définition de votre stratégie d’adaptation : témoignage de Montpellier Méditerranée Métropole'
    }
  },
  {
    id: 40,
    type: "Retour d'expérience",
    titre:
      'Utiliser les récits et illustrations paysagères pour s’approprier le territoire',
    description:
      'Les supports “sensibles” permettent une meilleure appropriation des enjeux et impacts du changement climatique, découvrez des exemples de récits et illustrations paysagères.',
    lien: 'https://librairie.ademe.fr/changement-climatique/9084-recits-et-illustrations-paysageres-comme-outils-d-appropriation-des-enjeux-climatiques-territoriaux.html#',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Restituer le diagnostic de vulnérabilité'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2026-03-03',
    ordre: 170,
    ordreCollection: 2
  },
  {
    id: 41,
    type: "Retour d'expérience",
    titre: "Faire de l'adaptation climatique un enjeu partagé par tous",
    description:
      'CLS, PADD, PAS, DOO : découvrez comment le “réflexe adaptation” est infusé dans différents documents réglementaires grâce aux démarches TACCT portées collectivement.',
    lien: 'https://librairie.ademe.fr/changement-climatique/9082-faire-de-l-adaptation-climatique-un-enjeu-partage-par-tous-les-services-d-une-collectivite.html#',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Piloter la démarche d’adaptation'],
    tempsLecture: 4,
    image: ImageTuileRex,
    date: '2026-03-03',
    ordre: 170,
    ordreCollection: 3
  },
  {
    id: 42,
    type: "Retour d'expérience",
    titre: 'Une mobilisation collective pour mettre le territoire en mouvement',
    description:
      'Les trajectoires d’adaptation et les actions relèvent de compétences locales, découvrez comment des démarches TACCT à échelle infra ont associé leurs communes pour décupler le portage de l’adaptation.',
    lien: 'https://librairie.ademe.fr/changement-climatique/9083-mettre-le-territoire-en-mouvement-une-mobilisation-collective-pour-l-adaptation-au-changement-climatique.html',
    filtres: ["Retour d'expérience", "M'inspirer", 'Occitanie'],
    collections: ['Piloter la démarche d’adaptation'],
    tempsLecture: 5,
    image: ImageTuileRex,
    date: '2026-03-03',
    ordre: 170,
    ordreCollection: 4
  },
  {
    id: 43,
    type: "Support méthodo",
    titre: "Diagnostiquer l'impact du changement climatique sur un territoire",
    description:
      "Ce guide méthodologique vous présente la démarche TACCT et vous aidera à réaliser sa première marche : le diagnostic de vulnérabilité.",
    lien: 'https://librairie.ademe.fr/changement-climatique/920-diagnostiquer-l-impact-du-changement-climatique-sur-un-territoire-9791029712982.html',
    filtres: ["Support méthodo", "Me former"],
    collections: ['Démarrer le diagnostic de vulnérabilité'],
    tempsLecture: 120,
    image: ImageTuileMethodo,
    date: '2026-04-14',
    ordre: 170,
    ordreCollection: 7
  },
  {
    id: 44,
    type: "Support méthodo",
    titre: "Construire des trajectoires d'adaptation au changement climatique du territoire",
    description:
      "Ce guide présente le cheminement méthodologique pour intégrer les seuils d'impacts, les trajectoires d'adaptation et organiser une planification à long terme des actions d'adaptation.",
    lien: 'https://librairie.ademe.fr/changement-climatique/1165-construire-des-trajectoires-d-adaptation-au-changement-climatique-du-territoire-9791029713750.html',
    filtres: ["Support méthodo", "Me former"],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 90,
    image: ImageTuileMethodo,
    date: '2026-04-14',
    ordre: 110,
    ordreCollection: 6
  },
  {
    id: 45,
    type: "Support méthodo",
    titre: "Evaluer les politiques d'adaptation au changement climatique",
    description:
      "Ce guide est la dernière brique de la méthodologie TACCT. Il propose une approche du suivi-évaluation des politiques d'adaptation au changement climatique.",
    lien: 'https://librairie.ademe.fr/changement-climatique/756-evaluer-les-politiques-d-adaptation-au-changement-climatique-9791029713767.html',
    filtres: ["Support méthodo", "Me former"],
    collections: ['Bâtir la stratégie d’adaptation'],
    tempsLecture: 90,
    image: ImageTuileMethodo,
    date: '2026-04-14',
    ordre: 120,
    ordreCollection: 7
  },
  {
    id: 46,
    type: 'Article',
    titre:
      'Financer vos trajectoires d’adaptation : quels leviers et partenaires ?',
    slug: 'financement-adaptation',
    description:
      "Vous portez une stratégie d’adaptation ? Le financement est un levier majeur pour mettre en œuvre vos solutions d’adaptation.",
    lien: '/ressources/articles/financement-adaptation',
    filtres: ['Article', "M'inspirer"],
    collections: ["Bâtir la stratégie d’adaptation"],
    tempsLecture: 7,
    image: ImageTuileArticle,
    date: '2026-05-06',
    ordre: 4,
    ordreCollection: 4,
    metadata: {
      title:
        'Financer vos trajectoires d’adaptation : quels leviers et partenaires ?',
      description:
        'Vous portez une stratégie d’adaptation ? Le financement est un levier majeur pour mettre en œuvre vos solutions d’adaptation.'
    }
  },
  {
    id: 47,
    type: 'Article',
    titre:
      'Patch 4°C : comment intégrer la TRACC dans votre diagnostic ?',
    slug: 'patch4-integrer-tracc',
    description:
      "Grâce au patch 4°C, ajustez votre diagnostic de vulnérabilité en intégrant la trajectoire de réchauffement de référence pour l’adaptation.",
    lien: '/ressources/articles/patch4-integrer-tracc',
    filtres: ['Article', "Agir"],
    collections: ["Évaluer les impacts du changement climatique"],
    tempsLecture: 6,
    image: ImageTuileArticle,
    date: '2026-05-06',
    ordre: 1,
    ordreCollection: 1,
    metadata: {
      title:
        'Patch 4°C : comment intégrer la TRACC dans votre diagnostic ?',
      description:
        'Découvrez comment le patch 4°C peut vous aider à intégrer la trajectoire de référence pour l’adaptation au changement climatique (TRACC).'
    }
  },
];
