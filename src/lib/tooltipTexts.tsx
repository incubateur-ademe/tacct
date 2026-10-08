import { ScrollToSourceTag } from '@/components/interactions/scrollToSource';
import { Body } from '@/design-system/base/Textes';

export const fragiliteEconomiqueTooltipText = (
  <Body weight="bold" size="sm" htmlTag="div">
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
    fichiers fonciers entre 2011 et 2025, présentée ici toute destination
    confondue. Les données sont traitées pour donner des tendances de façon
    uniforme sur toute la France ; ponctuellement, il est possible que les
    documents de planification de certaines collectivités territoriales fassent
    référence à des données locales de consommation d'espaces différentes de
    celles fournies par le CEREMA.
  </Body>
);

export const agricultureBioTooltipText = (
  <Body weight="bold" size="sm" htmlTag="div">
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

// Sources du texte :
// « L'exposition de la végétation à l'ozone est évaluée par l'indicateur AOT40 » : INERIS, Quelques enseignements sur l'évolution de la qualité de l'air de 2000 à 2019, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/20-ans-evolution-qualite-air-0 — « Les indicateurs d'exposition des écosystèmes (AOT40) »
// « Accumulated Exposure Over Threshold 40 » : texte TACCT précédent, conservé ; SDES, Normes réglementaires relatives à l'ozone, p. 1, https://www.statistiques.developpement-durable.gouv.fr/media/4861/download?inline — « AOT40 : Accumulated Exposure Over Threshold 40 »
// « au-delà du seuil de 40 parties par milliard, soit 80 µg/m³ […] somme des écarts […] entre 8 h et 20 h » : directive (UE) 2024/2881, annexe I, section 2 A — « la somme des différences entre les concentrations horaires supérieures à 80 μg/m3 (= 40 parties par milliard) et le seuil de 80 μg/m3 durant une période donnée, en utilisant uniquement les valeurs sur 1 heure mesurées quotidiennement entre 8 h 00 et 20 h 00 (heure de l'Europe centrale) »
// « de mai à juillet » : directive (UE) 2024/2881, annexe I, section 2 B — « Protection de la végétation — De mai à juillet »
// « période de pleine végétation » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 14 du PDF, § 3.1, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « des valeurs cibles calés sur les périodes de pleine végétation et de cultures situées au printemps et en été »
// « valeur cible de 18 000 µg/m³ × h, en moyenne calculée sur 5 ans » : directive (UE) 2024/2881, annexe I, section 2 B — « 18 000 μg/m3 × h, moyenne calculée sur cinq ans »
// « directive 2024/2881 du 23 octobre 2024 concernant la qualité de l'air ambiant et un air pur pour l'Europe » : Légifrance, https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050712855 — titre du texte
// « objectif à long terme de 6 000 µg/m³ × h […] au plus tard le 1er janvier 2050 » : directive (UE) 2024/2881, annexe I, section 2 C — « Objectifs à long terme pour l'ozone (O3) devant être atteints au plus tard le 1er janvier 2050 […] Protection de la végétation […] 6 000 μg/m3 × h »
// « calculé sur une seule année » : Airparif, p. 14 du PDF, § 3.1 — « Objectif à long terme : 6 000 µg/m3.h-1 en moyenne sur une année »
// « moyenne 2020-2024 » : SDES, La pollution de l'air par l'ozone (O₃), mise à jour du 30 juin 2026, https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « Pour la protection de la végétation, la réglementation fixe une norme en moyenne sur cinq ans. Sur la période 2020-2024 […] » ; titre de la carte INERIS — « AOT 40 (moyenne sur 5 ans) de O3 pour l'année 2024 »
// « en combinant un modèle numérique de qualité de l'air et les mesures des stations de fond » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « combinaison de données modélisées et de données d'observation » ; « n'incluent que les stations urbaines, périurbaines, rurales de fond »
// « grille d'environ 2 km » : INERIS, méthodologie, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/20-ans-evolution-qualite-air — « raffinée à 2km pour les années après 2018 »
// « France métropolitaine » : INERIS, cartothèque — « sur l'ensemble du territoire métropolitain et la Corse »
// « pollution dite « de fond » […] trafic dense et des sites industriels » : INERIS, cartothèque — « Ces cartes ne sont donc pas représentatives de situations de proximité de sources spécifiques (zones de trafic dense ou activités industrielles notamment) »
// « (*) Valeur cible » : texte TACCT précédent, conservé ; SDES, Normes réglementaires relatives à l'ozone, p. 2 — « un niveau de concentration de substances polluantes fixé dans le but d'éviter, de prévenir ou de réduire les effets nocifs sur la santé humaine et/ou l'environnement dans son ensemble, à atteindre dans la mesure du possible sur une période donnée »
export const AOT40TooltipText = (
  <Body weight="bold" size="sm">
    L’exposition de la végétation à l’ozone est évaluée par l’indicateur AOT40
    (Accumulated Exposure Over Threshold 40). Celui-ci représente
    l’accumulation d’exposition à l’ozone au-delà du seuil de 40 parties par
    milliard, soit 80 µg/m³. Son calcul repose sur la somme des écarts entre
    les concentrations horaires d’ozone dépassant 80 µg/m³ et ce seuil de
    80 µg/m³. Seules les concentrations horaires entre 8 h et 20 h sont
    prises en compte, de mai à juillet, période de pleine végétation.
    <br></br>
    <br></br>
    Une valeur cible(*) de 18 000 µg/m³.h, en moyenne calculée sur 5
    ans, est fixée dans la directive 2024/2881 du 23 octobre 2024 concernant la
    qualité de l’air ambiant et un air pur pour l’Europe. Cette directive fixe
    également un objectif à long terme de 6 000 µg/m³.h, calculé sur
    une seule année et à atteindre au plus tard le 1er janvier 2050.
    <br></br>
    <br></br>
    Les données proposées sont calculées par l’Institut
    national de l’environnement industriel et des risques (Ineris).
    Elles représentent la pollution dite « de fond » : les abords
    du trafic dense et des sites industriels ne sont pas représentés. La carte
    est visible sur leur{' '}
    <a
      href="https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine"
      target="_blank"
      rel="noopener noreferrer"
    >
      site
    </a>
    .
    <br></br>
    <br></br>
    <i>
      (*) Valeur cible : niveau à atteindre, dans la mesure du possible, afin
      d'éviter, de prévenir ou de réduire les effets nocifs sur l'environnement.
    </i>
  </Body>
);

// Sources du texte :
// « exposition des cultures à l’ozone à l’aide de l’indicateur AOT40 » : AEE, indicateur Exposure of Europe’s ecosystems to ozone, publié le 11/06/2026, section Methodology, https://www.eea.europa.eu/en/analysis/indicators/exposure-of-europes-ecosystems-to-ozone — « The period is from May to July for the protection of vegetation and crops. »
// « additionne, heure par heure, la part des concentrations d’ozone qui dépasse 80 µg/m³ (soit 40 parties par milliard), entre 8 h et 20 h (heure d’Europe centrale) » : directive (UE) 2024/2881, annexe I, section 2 A — « la somme des différences entre les concentrations horaires supérieures à 80 μg/m3 (= 40 parties par milliard) et le seuil de 80 μg/m3 durant une période donnée, en utilisant uniquement les valeurs sur 1 heure mesurées quotidiennement entre 8 h 00 et 20 h 00 (heure de l'Europe centrale) »
// « de mai à juillet » : directive (UE) 2024/2881, annexe I, section 2 B — « Protection de la végétation — De mai à juillet »
// « en pleine période de végétation » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 14 du PDF, § 3.1, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « des valeurs cibles calés sur les périodes de pleine végétation et de cultures situées au printemps et en été »
// « moyenne sur la période 2020-2024 » : titre de la carte INERIS — « AOT 40 (moyenne sur 5 ans) de O3 pour l'année 2024 » ; SDES, La pollution de l'air par l'ozone (O₃), mise à jour du 30 juin 2026, https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « Pour la protection de la végétation, la réglementation fixe une norme en moyenne sur cinq ans. Sur la période 2020-2024 […] »
// « valeur cible de 18 000 µg/m³.h en moyenne sur 5 ans » : directive (UE) 2024/2881, annexe I, section 2 B — « 18 000 μg/m3 × h, moyenne calculée sur cinq ans »
// « directive (UE) 2024/2881 du 23 octobre 2024 concernant la qualité de l’air ambiant et un air pur pour l’Europe » : Légifrance, https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050712855 — titre du texte
// « objectif à long terme de 6 000 µg/m³.h […] au plus tard le 1er janvier 2050 » : directive (UE) 2024/2881, annexe I, section 2 C — « Objectifs à long terme pour l'ozone (O3) devant être atteints au plus tard le 1er janvier 2050 […] Protection de la végétation […] 6 000 μg/m3 × h »
// « sur une seule année » : Airparif, p. 14 du PDF, § 3.1 — « Objectif à long terme : 6 000 µg/m3.h-1 en moyenne sur une année »
// « aligné sur le niveau critique défini par la CEE-ONU pour protéger les cultures » : AEE, indicateur Exposure of Europe’s ecosystems to ozone — « The long-term objective is in line with the critical level of ozone for the protection of crops defined by the United Nations Economic Commission for Europe (UNECE) Convention on Long-range Transboundary Air Pollution »
// « combine un modèle de qualité de l’air et les mesures des stations de fond » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « Ces cartographies résultent de la combinaison de données modélisées et de données d'observation réparties sur le territoire » ; « Les observations utilisées n'incluent que les stations urbaines, périurbaines, rurales de fond »
// « résolution allant jusqu’à 2 km » : INERIS, cartothèque — « allant jusqu'à 2 km » (résolution spatiale du modèle CHIMERE)
// « France métropolitaine et la Corse » : INERIS, cartothèque — « sur l'ensemble du territoire métropolitain et la Corse »
// « pollution dite « de fond » […] trafic dense et des sites industriels » : INERIS, cartothèque — « Ces cartes ne sont donc pas représentatives de situations de proximité de sources spécifiques (zones de trafic dense ou activités industrielles notamment) »
// « l’AOT40 mesure l’ozone présent dans l’air, et non la quantité réellement absorbée par les plantes » : CLRTAP/UBA, Manual on Methodologies and Criteria for Modelling and Mapping Critical Loads and Levels, chapitre 3 (ICP Vegetation), mise à jour 2024, Texte 123/2024, p. 76, https://www.umweltbundesamt.de/system/files/medien/11850/publikationen/123_2024_texte_manual_on_methodologies_and_criteria.pdf — « AOT40 accounts for the atmospheric O3 concentration above the leaf surface and is therefore biologically less relevant for O3 impact assessment than PODY as it does not take into account how O3 uptake is affected by climate, soil, and plant factors » ; p. 130 — « AOT40-based critical levels only consider the O3 concentration at the top of the canopy »
// « dépend de l’ouverture de leurs stomates, qui varie notamment avec la température, l’humidité de l’air et l’eau disponible dans le sol : en période de sécheresse, la plante ferme ses stomates et absorbe moins d’ozone » : CLRTAP/UBA, manuel 2024, p. 75 — « Stomata are physiologically controlled and respond to environmental conditions such as temperature, light, air humidity, and soil moisture, as well as plant growth stage. For example, under hot and dry conditions, plants close their stomata to reduce water loss and as a consequence O3 uptake is reduced. » ; APollO, synthèse, mai 2019, p. 4 du PDF, https://librairie.ademe.fr/air/327-cout-economique-pour-l-agriculture-des-impacts-de-la-pollution-de-l-air-par-l-ozone.html — « cet indicateur ne prend pas en compte les mécanismes d'exposition dont l'état de stress hydrique de la plante (souvent concomitant des pics de pollutions à l'ozone) qui conduit cette dernière à réduire ses flux stomatiques et donc son exposition à l'ozone »
// « Une valeur élevée signale donc un risque pour les cultures, et non une perte de rendement » : ICP Vegetation, Scientific Background Document A, octobre 2018, p. 48, https://icpvegetation.ceh.ac.uk/sites/default/files/ScientificBackgroundDocumentAOct2018.pdf — « It is not recommended that exceedance of the concentration-based critical level for agricultural crops is converted into economic loss; it should only be used as an indication of ecological risk »
// « dans le nord et l’ouest de la France, les conditions climatiques favorisent l’absorption : l’ozone peut y avoir des effets même lorsque l’AOT40 reste modéré » : ICP Vegetation (Mills & Harmens, éd.), Ozone Pollution: A hidden threat to food security, septembre 2011, p. 17 du PDF, https://nora.nerc.ac.uk/id/eprint/15071/1/N015071CR.pdf — « In areas such as northern France, Belgium, the Netherlands, southern UK and parts of Scandinavia, climatic conditions are highly conducive to ozone uptake (flux) and even modest ozone concentrations can be expected to have an impact » ; Ineris pour l’AEE, ETC HE Report 2024/9, novembre 2024, p. 16, https://www.eionet.europa.eu/etcs/etc-he/products/etc-he-products/etc-he-reports/etc-he-report-2024-9-wheat-and-potato-yield-loss-in-2022-in-europe-due-to-ozone-exposure — « medium-high levels of POD6SPEC in the west and north of France, the north of Belgium, the Netherlands, Germany and Denmark that are not shown in the AOT 40 map »
// « (*) Valeur cible » : SDES, Normes réglementaires relatives à l'ozone, p. 2, https://www.statistiques.developpement-durable.gouv.fr/media/4861/download?inline — « un niveau de concentration de substances polluantes fixé dans le but d'éviter, de prévenir ou de réduire les effets nocifs sur la santé humaine et/ou l'environnement dans son ensemble, à atteindre dans la mesure du possible sur une période donnée »
// Écarté :
// Perte de 5 % du rendement du blé au niveau critique : CLRTAP/UBA, manuel 2024, tableau 3.17, p. 123 — « Crops — Agricultural — Grain yield (5%; based on wheat) — 3 [ppm h] — 3 months ». Retiré car le niveau critique CEE-ONU n'est pas calculé comme l'AOT40 de la directive (heures de jour et 3 mois centrés sur la floraison du blé, contre 8 h-20 h de mai à juillet) : le lecteur pourrait conclure à tort à 5 % de perte dès 6 000 µg/m³.h.
// Surestimation en zone méditerranéenne, sous-estimation en Europe du Nord : APollO, rapport complet, p. 8 du PDF — « il évite une surestimation des dommages imputés à l'ozone dans les régions méditerranéennes et une sous-estimation dans les zones de l'Europe du Nord, souvent induites par l'AOT40 (Simpson et al., 2007) ». Remplacé par les deux sources qui citent explicitement la France.
export const AOT40AgricultureTooltipText = (
  <Body weight="bold" size="sm">
    Cette donnée mesure l’exposition des cultures à l’ozone à l’aide de
    l’indicateur AOT40. Celui-ci additionne, heure par heure, la part des
    concentrations d’ozone qui dépasse 80 µg/m³ (soit 40 parties par
    milliard), entre 8 h et 20 h et de mai à
    juillet, en pleine période de végétation. Il s’exprime en µg/m³.h. La
    valeur présentée est une moyenne sur la période 2020-2024.
    <br></br>
    <br></br>
    La directive (UE) 2024/2881 du 23 octobre 2024 concernant la qualité de
    l’air ambiant et un air pur pour l’Europe fixe une valeur cible(*) de
    18 000 µg/m³.h en moyenne sur 5 ans, ainsi qu’un objectif à long terme
    de 6 000 µg/m³.h sur une seule année, à atteindre au plus tard le 1er
    janvier 2050.
    <br></br>
    <br></br>
    Ces données sont produites par l’Institut national de l’environnement
    industriel et des risques (Ineris), qui combine un modèle de qualité de
    l’air et les mesures des stations de fond, avec une résolution allant
    jusqu’à 2 km. Elles représentent la pollution dite « de fond » : les abords du trafic dense
    et des sites industriels ne sont pas représentés. La carte est
    disponible sur le{' '}
    <a
      href="https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine"
      target="_blank"
      rel="noopener noreferrer"
    >
      site de l’Ineris
    </a>
    .
    <br></br>
    <br></br>
    <i>
      (*) Valeur cible : niveau à atteindre dans la mesure du possible, fixé
      pour éviter, prévenir ou réduire les effets nocifs sur l’environnement.
    </i>
  </Body>
);

export const etatCoursDeauTooltipTextBiodiv = (
  <Body weight="bold" size="sm" htmlTag="div">
    En application de la directive-cadre européenne sur l’eau, l’état écologique
    global de chaque rivière est évalué tous les 6 ans par les agences de l’eau,
    à partir de relevés sur 3 ans (N-1, N-2, N-3) issus des stations de mesure
    de la qualité de l’eau (par modélisation en leur absence). Plusieurs
    critères concourent à cette évaluation :
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
  <Body weight="bold" size="sm" htmlTag="div">
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
  <Body weight="bold" size="sm" htmlTag="div">
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

// Sources du texte :
// « vise à structurer l’économie agricole et à mettre en œuvre un système alimentaire à l’échelle d’un territoire » : Code rural et de la pêche maritime, article L111-2-2, premier alinéa, https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043978779 — « répondent à l'objectif de structuration de l'économie agricole et de mise en œuvre d'un système alimentaire territorial »
// « recensés par l’Observatoire national des PAT (France PAT), à partir de fiches renseignées par leurs animateurs et relues par les DRAAF » : France PAT, Vademecum de l'Observatoire, juin 2025, https://france-pat.fr/app/uploads/2025/06/France-PAT_Vademecum_Observatoire.pdf — fiches « produites par les animateurs PAT » et « relues par les DRAAF »
// « Ce recensement porte sur les PAT reconnus par le ministère de l’Agriculture » : France PAT, Vademecum de l'Observatoire — « Cet Observatoire, depuis 2024 et le passage à France PAT, recense uniquement les PAT reconnus par le Ministère »
// « au niveau 1 (PAT émergents) ou au niveau 2 (PAT opérationnels) » : DGAL, Reconnaissance officielle des PAT, p. 3, https://agriculture.gouv.fr/telecharger/125564 — « Niveau 1 : PAT émergent » ; « Niveau 2 : PAT opérationnel »
// « ainsi que sur quelques projets en attente de reconnaissance » : France PAT, fichier pats-20250710, colonne niveaux_de_labelisation, https://www.data.gouv.fr/datasets/pat-projets-alimentaires-territoriaux-description — 12 PAT sur 460 en « Labellisation en attente »
// « Une commune peut appartenir à plusieurs PAT, par exemple un PAT intercommunal et un PAT départemental » : colonne projets_alimentaires_territoriaux de databases_v2.table_commune ; DGAL, document préparatoire à la reconnaissance de niveau 2, p. 10, https://draaf.bretagne.agriculture.gouv.fr/IMG/pdf/notice_de_reconnaissance_n2.pdf — « Dans le cas spécifique des PAT départementaux, organisation de l'articulation […] avec et entre les PAT infra »
export const projetsAlimentairesTerritoriauxTooltipText = (
  <Body weight="bold" size="sm">
    Un projet alimentaire territorial (PAT) vise à structurer
    l'économie agricole et à mettre en œuvre un système alimentaire
    à l'échelle d'un territoire.
    <br></br>
    <br></br>
    Les PAT sont recensés par l’Observatoire national des PAT (France PAT), à
    partir de fiches renseignées par leurs animateurs et relues par les
    directions régionales de l’alimentation, de l’agriculture et de la forêt
    (DRAAF). Ce recensement porte sur les PAT reconnus par le ministère de
    l’Agriculture, au niveau 1 (PAT émergents) ou au niveau 2 (PAT
    opérationnels), ainsi que sur quelques projets en attente de
    reconnaissance. Une commune peut appartenir à plusieurs PAT, par exemple un
    PAT intercommunal et un PAT départemental.
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
    Ces chiffres sont calculés par l’Institut national de l'environnement industriel
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

// Sources du texte :
// « Pour chaque jour, on calcule la concentration moyenne d’ozone sur 8 heures consécutives, heure par heure, et on retient la plus élevée » : directive (UE) 2024/2881, annexe I, note (3), https://eur-lex.europa.eu/eli/dir/2024/2881/oj — « Le maximum journalier de la concentration moyenne sur 8 heures est sélectionné après examen des moyennes glissantes sur 8 heures, calculées à partir des données horaires et actualisées toutes les heures »
// « le nombre de jours où cette valeur dépasse 120 µg/m³ » : INERIS, méthodologie, tableau « Synthèse des indicateurs statistiques cartographiés », https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/20-ans-evolution-qualite-air — « Nombre de jours pour lesquels la moyenne glissante sur 8h dépasse 120 µg.m-3 (en moyenne sur 3 ans) »
// « en moyenne annuelle sur 2022-2024 » : SDES, La pollution de l’air par l’ozone (O₃), mise à jour du 30 juin 2026, section « Les concentrations d’O₃ au regard de la réglementation pour la protection de la santé, en cartes », https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « En moyenne sur 2022-2024 » ; fichier INERIS Reanalysed_FRA_2024_O3_t120_3y, attribut Times_bnds — « 20220101 ; 20241231 »
// « la directive 2024/2881 du 23 octobre 2024 concernant la qualité de l’air ambiant et un air pur pour l’Europe » : Légifrance, https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050712855 — titre du texte
// « ne doivent pas être dépassés plus de 25 jours par an, en moyenne calculée sur 3 ans » : directive (UE) 2024/2881, annexe I, note (5) — « Jusqu’au 1er janvier 2030, 120 μg/m3 à ne pas dépasser plus de 25 jours par année civile, moyenne calculée sur trois ans »
// « puis plus de 18 jours à partir du 1er janvier 2030 » : directive (UE) 2024/2881, annexe I, section 2 B — « 120 μg/m3 à ne pas dépasser plus de 18 jours par année civile, moyenne calculée sur trois ans »
// « objectif à long terme : ne pas dépasser 100 µg/m³ plus de 3 jours par an, au plus tard le 1er janvier 2050 » : directive (UE) 2024/2881, annexe I, section 2 C — « Objectifs à long terme pour l’ozone (O3) devant être atteints au plus tard le 1er janvier 2050 […] 100 μg/m3 à ne pas dépasser plus de 3 jours par année civile (99e percentile) »
// « seuil d’information et de recommandation (180 µg/m³ en moyenne horaire) […] seuil d’alerte (240 µg/m³ en moyenne horaire) » : Code de l’environnement, article R221-1, 5° e) et f), https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000022964539 — « Seuil de recommandation et d’information : 180 µg/m³ en moyenne horaire » ; « Seuil d’alerte pour une protection sanitaire pour toute la population : 240 µg/m³ en moyenne horaire »
// « dont le dépassement caractérise un épisode de pollution » : SDES, La pollution de l’air par l’ozone (O₃), section « Les épisodes de pollution en O₃ en France » — « Un épisode de pollution est caractérisé par le dépassement de certaines normes réglementaires de qualité de l’air pour la protection de la santé humaine à court terme (seuil d’information et de recommandation et seuil d’alerte) »
// « Les données sont calculées par l’Institut national de l’environnement industriel et des risques (Ineris) » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « Données issues de la Cartothèque de Qualité de l’Air de l’Ineris »
// « (*) Valeur cible » : directive (UE) 2024/2881, article 4, point 32 — « un niveau fixé sur la base des meilleures connaissances scientifiques, dans le but d’éviter, de prévenir ou de réduire les effets nocifs sur la santé humaine ou l’environnement, à atteindre dans la mesure du possible sur une période donnée »
export const O3AirTooltipText = (
  <Body weight="bold" size="sm">
    Pour chaque jour, on calcule la concentration moyenne d’ozone sur
    8&nbsp;heures consécutives, heure par heure, et on retient la plus élevée.
    Le chiffre correspond au nombre de jours où cette valeur dépasse
    120&nbsp;µg/m³, en moyenne annuelle sur 2022-2024.
    <br></br>
    <br></br>
    Pour protéger la santé humaine, la directive 2024/2881 du 23 octobre 2024
    concernant la qualité de l’air ambiant et un air pur pour l’Europe fixe une
    valeur cible(*) : ces 120&nbsp;µg/m³ ne doivent pas être dépassés plus de
    25&nbsp;jours par an, en moyenne calculée sur 3&nbsp;ans, puis plus de
    18&nbsp;jours à partir du 1er janvier 2030. Elle fixe également un objectif
    à long terme : ne pas dépasser 100&nbsp;µg/m³ plus de 3&nbsp;jours par an,
    au plus tard le 1er janvier 2050.
    <br></br>
    <br></br>
    Cette valeur cible ne doit pas être confondue avec le seuil d’information
    et de recommandation (180&nbsp;µg/m³ en moyenne horaire) ni avec le seuil
    d’alerte (240&nbsp;µg/m³ en moyenne horaire), dont le dépassement
    caractérise un épisode de pollution.
    <br></br>
    <br></br>
    Les données sont calculées par l’Institut national de l’environnement
    industriel et des risques (Ineris). La carte est visible sur leur{' '}
    <a
      href="https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine"
      target="_blank"
      rel="noopener noreferrer"
    >
      site
    </a>
    .
    <br></br>
    <br></br>
    <i>
      (*) Valeur cible : niveau à atteindre, dans la mesure du possible, afin
      d’éviter, de prévenir ou de réduire les effets nocifs sur la santé
      humaine.
    </i>
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
