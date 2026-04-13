import { ScrollToSourceTag } from '@/components/interactions/scrollToSource';
import { Body } from '@/design-system/base/Textes';

export const fragiliteEconomiqueTooltipText = (
  <Body weight="bold" size="sm">
    La précarité énergétique liée au logement concerne :
    <br></br>
    <ul>
      <li>
        les ménages des 3 premiers déciles(*) c'est-à-dire les 30 % de la
        population ayant les revenus les plus modestes,
      </li>
      <li>
        parmi ces 30 %, les ménages qui consacrent plus de 8 % de leurs revenus
        aux dépenses énergétiques liées à leur logement (chauffage, eau chaude,
        et ventilation).
      </li>
    </ul>
    <i>
      (*)Les déciles divisent les revenus de la population en dix parties
      égales. Dans la modélisation effectuée pour l’ONPE, le 3ème décile
      correspond à des revenus inférieurs à 19 600 € par an.
    </i>
  </Body>
);

export const surfacesIrrigueesTooltipText = (
  <Body weight="bold" size="sm">
    Cet indicateur est calculé en divisant la superficie irriguée par la surface
    agricole utilisée (SAU). Il est disponible sur le site AGRESTE pour le
    recensement agricole de 2020. Plus d’un quart des observations sont sous
    secret statistique.
    <br></br>
    <br></br>
    La superficie irriguée est déterminée quel que soit le mode d'irrigation
    (aspersion, goutte-à-goutte…) et quelle que soit l'origine de l'eau. Les
    surfaces irriguées uniquement dans le cadre d'une protection contre le gel
    ou d'une lutte phytosanitaire (contre le phylloxera de la vigne par exemple)
    sont exclues de ce calcul.
  </Body>
);

export const espacesNAFTooltipText = (
  <Body weight="bold" size="sm">
    Cet indicateur est calculé à partir de la consommation d’espace naturel,
    agricole ou forestier (ENAF), signifiant sa conversion en surface
    artificialisée, le rendant indisponible pour des usages tels que
    l’agriculture, la foresterie ou les habitats naturels.
    <br></br>
    <br></br>
    Le suivi de cet indicateur est réalisé par le CEREMA dans le cadre de
    l’objectif « zéro artificialisation nette » de la loi « Climat et
    résilience ». La consommation d’espaces NAF est calculée à partir des
    fichiers fonciers entre 2009 et 2023, présentée ici toute destination
    confondue. Les données sont traitées pour donner des tendances de façon
    uniforme sur toute la France ; ponctuellement, il est possible que les
    documents de planification de certaines collectivités territoriales fassent
    référence à des données locales de consommation d'espaces différentes de
    celles fournies par le CEREMA.
  </Body>
);

export const agricultureBioTooltipText = (
  <Body weight="bold" size="sm">
    Les superficies totales en agriculture biologique comprennent :
    <ul>
      <li>
        <Body weight="bold" size="sm">
          les surfaces « certifiées bio » qui rassemblent les parcelles dont la
          période de conversion est terminée et dont la production peut être
          commercialisée avec la mention « agriculture biologique » ;
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          les superficies en conversion (la durée de conversion variant de 2 ans
          pour les cultures annuelles à 3 ans pour les cultures pérennes).
          Certaines données peuvent être incomplètes (non transmission des
          données en provenance d’un organisme certificateur).
        </Body>
      </li>
    </ul>
    Cet indicateur fait partie du kit des indicateurs de développement durable
    fourni dans le cadre de l’Agenda 2030 et des 17 Objectifs de Développement
    Durable (ODD).
  </Body>
);

export const AOT40TooltipText = (
  <Body weight="bold" size="sm">
    Un seuil critique de toxicité de l’ozone pour la végétation est défini par
    l’indicateur AOT40 (Accumulated Exposure Over Threshold 40). Celui-ci
    représente l’accumulation d’exposition à l’ozone au-delà du seuil de 40
    parties par milliard, soit 80 µg/m³. Son calcul repose sur la somme des
    écarts entre les concentrations horaires d’ozone dépassant 80 µg/m³ et ce
    seuil de 80 µg/m³. Les mesures sont effectuées chaque jour entre 8 h et
    20 h, sur la période de mai à juillet, afin de coïncider avec la phase
    active de photosynthèse.
    <br></br>
    <br></br>
    Une valeur cible(*) de 18 000 µg/m³ par heure, en moyenne calculée sur 5
    ans, est fixée dans la directive 2024/2881 du 23 octobre 2024 concernant la
    qualité de l’air ambiant et un air pur pour l’Europe.
    <br></br>
    <br></br>
    <i>
      (*) Valeur cible : niveau à atteindre, dans la mesure du possible, afin
      d'éviter, de prévenir ou de réduire les effets nocifs sur l'environnement.
    </i>
  </Body>
);

export const etatCoursDeauTooltipTextBiodiv = (
  <Body weight="bold" size="sm">
    En application de la directive-cadre européenne sur l’eau, l’état écologique
    global de chaque rivière est évalué tous les 6 ans par les agences de l’eau,
    à partir de relevés sur 3 ans (N-1, N-2, N-3) issus des stations de mesure
    de la qualité de l’eau (par modélisation en leur absence). Plusieurs
    critères concourent à cette évaluation :
    <ul>
      <li>
        <Body weight="bold" size="sm">
          température et acidité de l’eau,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          bilan de l’oxygène,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          hydro-morphologie du cours d’eau,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          présence de poissons, de plantes aquatiques, de microalgues, de
          micropolluants, de nutriments (eutrophisation), etc.
        </Body>
      </li>
    </ul>
    Attention, le bon état écologique d’une rivière ne signifie pas une qualité
    sanitaire suffisante pour s’y baigner. Cette évaluation se fait en fonction
    de données microbiologiques. Le classement des eaux de qualité insuffisante,
    suffisante, bonne ou excellente pour se baigner est établi conformément aux
    critères de l’annexe II de la directive 2006/7/CE concernant la gestion de
    la{' '}
    <ScrollToSourceTag sourceNumero={3}>
      qualité des eaux de baignade.
    </ScrollToSourceTag>
  </Body>
);

export const etatCoursDeauTooltipTextEau = (
  <Body weight="bold" size="sm">
    En application de la directive-cadre européenne sur l’eau, l’état écologique
    global de chaque rivière est évalué tous les 6 ans par les agences de l’eau,
    à partir de relevés sur 3 ans (N-1, N-2, N-3) issus des stations de mesure
    de la qualité de l’eau (par modélisation en leur absence). Plusieurs
    critères concourent à cette évaluation :
    <ul>
      <li>
        <Body weight="bold" size="sm">
          température et acidité de l’eau,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          bilan de l’oxygène,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          hydro-morphologie du cours d’eau,
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          présence de poissons, de plantes aquatiques, de microalgues, de
          micropolluants, de nutriments (eutrophisation), etc.
        </Body>
      </li>
    </ul>
  </Body>
);

export const catnatTooltipText = (
  <Body weight="bold" size="sm">
    Il s’agit du nombre total d'arrêtés de catastrophes naturelles d’origine
    climatique publiés au Journal Officiel par commune depuis la création de la
    garantie Cat-Nat en 1982 (loi du 13 juillet 1982). Sont considérés comme
    risques naturels d’origine climatique : les avalanches, les phénomènes
    atmosphériques tels que les vents cycloniques, les tempêtes (exclues à
    partir de 1989), la grêle et la neige (exclues à partir de 2010), les
    inondations (coulée de boue, lave torrentielle, inondations par remontée de
    nappe, et inondations par choc mécanique des vagues), les mouvements de
    terrain (regroupant les chocs mécaniques liés à l’action des vagues,
    l’éboulement rocheux, la chute de blocs, l’effondrement de terrain,
    l’affaissement et le glissement de terrain), la sécheresse (notamment le
    retrait-gonflement des argiles).
    <br></br>
    <br></br>
    Les dommages dus aux vents cycloniques ne sont intégrés dans la garantie des
    catastrophes naturelles que depuis la fin de l'année 2000, lorsque la
    vitesse du vent dépasse 145 km/h pendant dix minutes, ou 215 km/h par
    rafale.
    <br></br>
    <br></br>
    Les catastrophes naturelles d’origine non climatiques (séismes, éruptions
    volcaniques, raz de marée) sont exclues du décompte.
  </Body>
);

export const erosionCotiereTooltipText = (
  <Body weight="bold" size="sm">
    Elaboré dans le cadre de la stratégie nationale de gestion intégrée du trait
    de côte, cet indicateur national donne un aperçu quantifié des phénomènes
    d’érosion, sur la base de la mobilité passée du trait de côte sur une
    période de 50 ans.
  </Body>
);

export const debroussaillementTooltipText = (
  <Body weight="bold" size="sm">
    Le Code forestier fixe une obligation légale de débroussaillement (OLD) dans
    les bois, forêts, landes maquis et garrigues exposés aux risques d'incendie
    ainsi que dans la zone périphérique de ces espaces (jusqu'à 200 mètres
    autour). 48 départements sont concernés en France. Les zonages sont mis à
    disposition par les préfectures. Consultez la {" "}
    <a
      href="https://geoservices.ign.fr/sites/default/files/2023-05/Info_zonage-OLD-Geoportail.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      notice d’utilisation du zonage informatif des OLD
    </a>
    .
  </Body>
);

export const feuxForetTooltipText = (
  <Body weight="bold" size="sm">
    Un incendie de forêt est un incendie qui démarre en forêt ou qui se propage
    en forêt ou au sein de terres boisées au cours de son évolution (y compris
    dans les maquis ou garrigues dans l’aire méditerranéenne).
    <br></br>
    <br></br>
    La surface parcourue est la surface totale parcourue par le feu au cours de
    son évolution et quelle que soit la végétation touchée. Ces surfaces sont
    soit :
    <ul>
      <li>
        <Body weight="bold" size="sm">
          estimées (renseignées dans la BDIFF sans être issues de mesures),
        </Body>
      </li>
      <li>
        <Body weight="bold" size="sm">
          mesurées (issues de mesures sur le terrain ou d’un Système
          d’Information Géographique).
        </Body>
      </li>
    </ul>
  </Body>
);

export const densiteBatiTooltipText = (
  <Body weight="bold" size="sm">
    (surface au sol de la construction x hauteur du bâtiment) / surface totale
    de la commune
  </Body>
);

export const travailExterieurTooltipText = (
  <Body weight="bold" size="sm">
    La base de données EMP3 de l’INSEE recense les emplois au lieu de travail
    par sexe, secteur d'activité économique et catégorie socioprofessionnelle.
    <br></br>
    <br></br>
    Les emplois cumulés des secteurs de l’agriculture et de la construction
    fournissent une image approximative de la part des emplois en extérieur sur
    le territoire. Une partie des transports, du tourisme, voire la collecte des
    déchets sont aussi concernés. Bien sûr, tout emploi amenant à évoluer dans
    des environnements marqués par des températures élevées, en extérieur comme
    en intérieur, est potentiellement à risque.
  </Body>
);

export const prelevementEauTooltipText = (
  <Body weight="bold" size="sm">
    L'indicateur représente le volume annuel d'eau prélevée, par grands usages,{' '}
    <u>
      pour les prélèvements soumis à redevance, sur la base de déclarations
      auprès des agences et offices de l’eau.
    </u>{' '}
    Cette redevance est due par les personnes qui prélèvent un volume annuel
    d'eau supérieur à 10 000 m3 d'eau. Ce volume est ramené à 7 000 m3 dans les
    zones dites de répartition des eaux (zones pour lesquelles a été identifiée
    une insuffisance chronique des ressources par rapport aux besoins).
    <br></br>
    <br></br>
    Certains usages sont exonérés de redevance : aquaculture, géothermie, lutte
    antigel de cultures pérennes, réalimentation de milieux naturels, etc. En
    Outre-mer, la lutte contre les incendies et la production d’énergie
    renouvelable sont également exonérées.
  </Body>
);

export const rgaTooltipText = (
  <Body weight="bold" size="sm">
    Les informations fournies sont le résultat du croisement géomatique réalisé
    par le CGDD/SDES en 2021 de la carte d’exposition au phénomène de RGA (BRGM,
    2019) et des logements figurant dans le fichier démographique sur les
    logements et les individus (Base Fidéli -Insee, 2021).
    <br></br>
    <br></br>
    L’indicateur permet d’identifier le niveau d’exposition des communes au
    phénomène mais il n’est pas adapté pour travailler à une échelle plus fine
    (parcellaire). Ainsi, la visualisation cartographique proposée ne peut en
    aucun cas prétendre refléter en tout point l’exacte nature des sols.
  </Body>
);

export const surfacesAgricolesTooltipText = (
  <Body weight="bold" size="sm">
    Ces chiffres proviennent du recensement agricole de 2020 disponible sur{' '}
    <a
      href="https://agreste.agriculture.gouv.fr/agreste-web/disaron/RA2020_1013_EPCI/detail/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Agreste
    </a>
    . À noter : le calcul du type de surface prédominant n’inclut pas les
    données sous secret statistique.
  </Body>
);

export const LCZTooltipText = (
  <Body weight="bold" size="sm">
    La typologie LCZ{' '}
    <a
      href="https://journals.ametsoc.org/view/journals/bams/93/12/bams-d-11-00019.1.xml"
      target="_blank"
      rel="noopener noreferrer"
    >
      (issue de Stewart et Oke, 2012)
    </a>{' '}
    est un référentiel international des zones urbaines. La méthode s'appuie sur
    la corrélation observée entre les conditions climatiques d'une zone
    spécifique et ses caractéristiques géographiques (morphologie, utilisation
    des sols).
    <br></br>
    <br></br>
    Les 17 postes LCZ représentent les espaces bâtis d’une part (de 1 à 10), les
    espaces non bâtis d’autre part (de A à G).
  </Body>
);

export const SurfacesToujoursEnHerbeText = (
  <Body weight="bold" size="sm">
    La surface toujours en herbe ou STH désigne, à l’échelle de l’Europe, toute
    surface en milieux herbacés ouverts semée depuis au moins 5 ans ou
    naturelle. Sont également comptabilisés les parcours, alpages, estives et
    landes. Elles sont composées de plantes fourragères herbacées vivaces telles
    que les graminées (comme le ray-grass et la fétuque) et les légumineuses
    (comme le lotier ou le trèfle).
    <br></br>
    <br></br>
    Les STH sont des milieux peu perturbés, accueillant une flore et une faune
    diversifiées. C’est pourquoi elles jouent un rôle essentiel dans la
    préservation de la biodiversité.
  </Body>
);

export const airesAppellationsControleesTooltipText = (
  <>
    <Body weight="bold" size="sm">
      Les «
      <a href="https://agriculture.gouv.fr/bien-connaitre-les-produits-de-lorigine-et-de-la-qualite" target="_blank" rel="noopener noreferrer">
        signes d’identification de qualité et d’origine
      </a> » (SIQO) garantissent la qualité et l’origine des produits alimentaires (fromages, vins, viandes…). Reconnus au
      niveau européen depuis 1992, AOP [AOC] et IGP certifient un savoir-faire traditionnel et des contrôles réguliers ; ils
      ne sont pas cumulables.
    </Body>
    <Body weight="bold" size="sm" style={{ marginTop: '1rem' }}>
      Indication Géographique Protégée (IGP) : Au moins une étape de production est réalisée dans une
      zone géographique donnée, conférant au produit une spécificité locale.
    </Body>
    <Body weight="bold" size="sm" style={{ marginTop: '1rem' }}>
      L’AOC (Appellation d’Origine Contrôlée) est l’équivalent national de l’AOP européen (Appellation d’Origine Protégée) pour
      les produits agroalimentaires et viticoles : toutes les étapes de fabrication doivent être réalisées
      selon un savoir-faire reconnu et dans une même zone géographique. Mais l’AOC peut aussi concerner des
      produits non couverts par l’Union Européenne (comme ceux de la forêt).
    </Body>
  </>
);

export const O3TooltipText = (
  <Body weight="bold" size="sm">
    Les données de la carte sont calculées par l’Institut national de l'environnement industriel
    et des risques (Ineris) d'après des concentrations analysées, combinant modèle et observations.
    La carte est visible sur leur{' '}
    <a
      href="https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine"
      target="_blank"
      rel="noopener noreferrer"
    >
      site
    </a>
    .
  </Body>
);

export const secheressesPasseesTooltipText = (
  <>
    <Body weight="bold" size="sm">
      Il s’agit du nombre de jours où des mesures exceptionnelles de limitation ou de suspension
      des usages de l’eau non prioritaires sont prises par les préfets (arrêtés “sécheresse”).
    </Body>
    <Body weight="bold" size="sm" style={{ marginTop: '1rem' }}>
      Pour chaque jour de l'année la plus touchée (entre 2020 et 2025), un jour est comptabilisé si au moins
      une des communes est en restriction sécheresse, quelque soit son niveau de gravité. Le total annuel
      est ensuite divisé par 12 pour obtenir une moyenne mensuelle.
    </Body>
    <Body weight="bold" size="sm" style={{ marginTop: '1rem' }}>
      La distinction entre eaux souterraines, eaux superficielles et eau potable n’est pas présentée ici.
    </Body>
  </>
);

export const moustiqueTigreTooltipText = (
  <Body weight="bold" size="sm">
    Les cartes de présence du moustique tigre sont fournies chaque année par le{" "}
    <a
      href="https://sante.gouv.fr/sante-et-environnement/risques-microbiologiques-physiques-et-chimiques/especes-nuisibles-et-parasites/article/cartes-de-presence-du-moustique-tigre-aedes-albopictus-en-france-metropolitaine"
      target="_blank"
      rel="noopener noreferrer">ministère de la Santé
    </a>. Les données débutent en 2004 et sont mises à jour annuellement.
    Les indicateurs de la surveillance de la dengue, du chikungunya et du zika (cas 
    importés et autochtones) sont construits à partir des informations de la déclaration 
    obligatoire, transmises aux agences régionales de santé, puis centralisées par Santé 
    publique France. Ils sont fournis depuis 2012 et mis à jour annuellement.
  </Body>
);

export const HauteurCanopeeTooltipText = (
  <>
    <Body weight="bold" size="sm">
      TOOLTIP
    </Body>
  </>
);
