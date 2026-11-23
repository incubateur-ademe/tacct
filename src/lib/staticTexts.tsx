import { ScrollToSourceTag } from '@/components/interactions/scrollToSource';
import { DefinitionTooltip } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import {
  AgricultureBiologique,
  arbovirose,
  debroussaillement,
  directiveCadreSurLeau,
  eutrophisation,
  irriguee,
  maladieVectorielle,
  OMS,
  ozone,
  regimeForestier,
  valeursGuidesO3
} from '@/lib/definitions';

{
  /* Confort thermique */
}

export const GrandAgeText = () => (
  <Body size="sm" style={{ paddingTop: '1rem' }}>
    Les personnes âgées représentent les deux tiers de la surmortalité en
    période de fortes chaleurs. Cette fragilité peut être exacerbée par d’autres
    facteurs : précarité énergétique, isolement social, logements inadaptés.
  </Body>
);

export const TravailExterieurText = () => (
  <Body size="sm" style={{ paddingTop: '1rem' }}>
    Les effets de la chaleur sur l’économie sont également sous-estimés. Selon
    un rapport du Joint Research Center, la productivité du travail à
    l’extérieur pourrait diminuer de 5 à 10 % en France d’ici la fin du siècle.
  </Body>
);

export const AgeBatiText = () => (
  <Body size="sm" style={{ paddingTop: '1rem' }}>
    La résistance des logements face aux températures élevées dépend de critères
    tels que l’inertie thermique, la présence de volets extérieurs ou la qualité
    des rénovations effectuées. En l’absence d’étude détaillée sur le sujet, la
    période de construction fournit une première approximation.<br></br>En
    France, deux tiers des logements construits avant 1948 affichent un DPE
    médiocre (D, E ou F), alors que deux tiers construits après 2013 sont
    classés B ou C.
  </Body>
);

export const VegetalisationText = () => (
  <div className="px-4">
    <p>
      La présence d’arbres permet d’apporter de l’ombre et rafraîchit l’air par
      évapotranspiration (lorsque plusieurs arbres sont à proximité). Leur
      efficacité dans le rafraîchissement en milieu urbain dépend de leur
      nombre, de la densité de leur feuillage, des essences, de la qualité du
      sol et de la disponibilité en eau.<br></br> <br></br>
      La présence d’arbres peut rafraîchir l’air de 2 à 3 °C au maximum,
      notamment dans les rues ou lorsqu’ils sont alignés en bordure de route
      (source :{' '}
      <a href="https://plusfraichemaville.fr/" target="_blank" rel="noreferrer">
        Plus fraiche ma ville
      </a>
      )
    </p>
  </div>
);

export const SurfacesIrrigueesText = () => (
  <>
    <Body size="sm">
      <b>Le paradoxe de l'irrigation</b> : encore symbole d’agriculture
      intensive, elle pourrait devenir un outil d’adaptation au changement
      climatique.
    </Body>
    <Body size="sm">
      <b>Deux visions s'opposent</b> : l’irrigation visant à maximiser les
      rendements (consommation importante en eau et en intrants) versus
      l’irrigation “de résilience” visant à stabiliser les récoltes. C’est aussi
      une question d’orientation stratégique :{' '}
      <ScrollToSourceTag sourceNumero={1}>un tiers</ScrollToSourceTag> de nos{' '}
      <DefinitionTooltip title={irriguee}>surfaces irriguées</DefinitionTooltip>{' '}
      nourrissent l'export, pas la France.
    </Body>
    <Body size="sm">
      <b>Un défi de sobriété à prioriser</b> : abandonner l'aspersion (
      <ScrollToSourceTag sourceNumero={2}>80% des irrigants</ScrollToSourceTag>)
      pour des techniques économes qui existent déjà (goutte-à-goutte, capteurs
      intelligents, pilotage précis). L'irrigation peut aider la diversification
      des cultures et servir l'agroécologie... mais seulement si la ressource
      reste disponible !
    </Body>
  </>
);

export const ConsommationEspacesNAFAmenagementText = () => (
  <>
    <Body size="sm">
      Depuis dix ans, 24 000 hectares d’espaces naturels, agricoles et
      forestiers disparaissent chaque année sous le béton, soit 10 fois la
      superficie de Marseille. Depuis les années 1980, les surfaces
      artificialisées ont augmenté de 70 %, un rythme bien supérieur à celui de
      la population française (+19 %). Pire, elles progressent, même là où la
      population diminue.
    </Body>
    <Body size="sm">
      En périphérie des villes, l’étalement urbain allonge les trajets
      domicile-travail, renforce la dépendance à la voiture et augmente les
      émissions de gaz à effet de serre. Chaque hectare artificialisé libère
      jusqu’à 190 tonnes de CO2, soit l’empreinte carbone annuelle de 20
      Français.
    </Body>
    <Body size="sm">
      ⇒ 43 % de la consommation d'espace a lieu dans des zones péri-urbaines peu
      denses
    </Body>
    <Body size="sm">
      ⇒ 66 % des ENAF consommés sont destinés à l’habitat dont plus de la moitié
      (51 %) est constitué de constructions de moins de 8 logements par hectare
    </Body>
    <Body size="sm">
      ⇒ 7 820 communes consomment de l’espace alors qu’elles perdent des ménages
      : une consommation d’ENAF déconnectée des besoins réels des territoires !
    </Body>
  </>
);

export const SolsImpermeabilisesText = () => (
  <>
    <Body size="sm">
      L’artificialisation des sols constitue l'une des premières causes
      d'effondrement de la biodiversité : elle fragmente voire détruit les
      habitats, isole les espèces et perturbe les processus naturels essentiels
      comme la pollinisation. Vis-à-vis du climat, les conséquences sont tout
      aussi critiques : les sols perdent leur rôle de puits de carbone, leurs
      capacités d'infiltration et de stockage de l'eau, avec pour corollaire une
      réduction de la recharge des nappes et une aggravation des risques
      d'inondation. En détruisant les micro-organismes des sols, elle réduit
      également les capacités épuratoires naturelles des milieux, compromettant
      ainsi leur résilience globale.
    </Body>
  </>
);

export const ConsommationEspacesNAFBiodiversiteText = () => (
  <>
    <Body size="sm">
      L'artificialisation des sols constitue l’une des premières causes de
      l’effondrement de la biodiversité. Elle porte atteinte aux processus
      naturels essentiels, comme la pollinisation, fragmente voire détruit les
      habitats et isole les espèces. Elle participe en outre à une
      homogénéisation de la biodiversité qui affecte la résilience des milieux.
    </Body>
    <div>
      <Body size="sm">
        La consommation d’ENAF a des conséquences dramatiques pour le climat :
      </Body>
      <ul className="text-[1rem] leading-[1.5rem]">
        <li>
          <Body size="sm">
            Les sols perdent leur rôle de puits de carbone et leur capacité
            d’infiltration ce qui perturbe le cycle naturel de l'eau, avec pour
            corollaire une réduction de la recharge des nappes, une réduction du
            stockage de l’eau dans les sols et une aggravation des risques
            d’inondations.
          </Body>
        </li>
        <li>
          <Body size="sm">
            En détruisant le milieu de vie des micro-organismes des sols,
            l’artificialisation réduit drastiquement les capacités épuratoires
            des milieux.
          </Body>
        </li>
      </ul>
    </div>
    <Body size="sm">
      ⇒ 24 000 hectares par an d’espaces naturels, agricoles et forestiers sont
      consommés depuis dix ans, soit l’équivalent de 10 fois la superficie de
      Marseille.
    </Body>
    <Body size="sm">
      ⇒ Avec 446 m² de terres artificialisées consommées par habitant, la France
      se place au 4e rang européen.
    </Body>
    <Body size="sm">
      ⇒ Un hectare de sol artificialisé libère jusqu’à 190 tonnes de CO2, soit
      l’empreinte carbone annuelle de 20 Français.
    </Body>
  </>
);

export const SurfacesEnBioText = () => (
  <div className="pr-5 pt-10">
    <Body size="sm" style={{ paddingBottom: '1rem' }}>
      L'effondrement de la biodiversité est une réalité :{' '}
      <ScrollToSourceTag sourceNumero={1}>
        73 % des espèces sauvages
      </ScrollToSourceTag>{' '}
      ont disparu en 50 ans, victimes notamment de la destruction de leurs
      habitats. Face à ce constat, l'agriculture dispose de leviers essentiels :
      adopter des pratiques moins intensives et favoriser la diversité des
      paysages.
    </Body>
    <Body size="sm">
      <DefinitionTooltip title={AgricultureBiologique}>
        L'agriculture biologique
      </DefinitionTooltip>{' '}
      ainsi que les pratiques à bas-intrants, la rotation des cultures, la lutte
      biologique, le recyclage des matières organiques, et l’abandon des
      produits chimiques de synthèse - représentent aujourd'hui les meilleures
      réponses. Leurs effets positifs sur la vie des sols sont démontrés, un
      atout majeur alors que{' '}
      <ScrollToSourceTag sourceNumero={2}>
        60 à 70 % des sols agricoles européens sont dégradés
      </ScrollToSourceTag>
      . Des écosystèmes renforcés sont des écosystèmes plus résilients aux
      impacts du changement climatique.
    </Body>
  </div>
);

export const SurfacesEnBioAgricultureText = () => (
  <div className="pt-10">
    <Body size="sm">
      <b>Sécheresses intensifiées, sols dégradés</b> : l'agriculture
      conventionnelle vacille. Le bio ne prétend pas détenir la solution
      miracle, mais ses sols résistent mieux avec une disponibilité en eau
      améliorée de +4 % à +45 % selon les études.
    </Body>
    <Body size="sm">
      <b>Les armes du bio</b> : diversifier les cultures, remplacer la
      fertilisation de synthèse par des apports organiques.
    </Body>
    <Body size="sm">
      <b>Le secret ?</b> Plus de matière organique = une structure plus stable,
      moins d'érosion, plus de carbone séquestré, une meilleure réserve en eau =
      des sols vivants plus résilients.
    </Body>
    <Body size="sm">
      <b>
        Aux côtés de l'agroforesterie et des agricultures limitant le travail
        des sols et favorisant les couverts
      </b>{' '}
      (agriculture de conservation, régénératrice...),{' '}
      <DefinitionTooltip title={AgricultureBiologique}>
        l'agriculture biologique
      </DefinitionTooltip>{' '}
      dessine les contours d'une agriculture qui ne subit plus le climat... mais
      compose avec lui.
    </Body>
  </div>
);

export const EtatsCoursEauBiodiversiteText = () => (
  <div className="px-4">
    <p>
      Seuls 43 % des cours et des plans d’eau français sont en bon état
      écologique. Si les principaux facteurs de dégradation de la qualité des
      eaux sont les pollutions (nitrates, pesticides) et les altérations
      physiques des rivières (seuils et barrages, endiguement….), le
      réchauffement climatique aggrave les déséquilibres en cours. La hausse des
      températures et les sécheresses prolongées entraînent la chute des débits,
      voire assecs, la prolifération d'espèces exotiques envahissantes, la
      concentration des polluants (massivement relâchés lors des crues) ; la
      hausse des températures de l’eau et l’ensoleillement sont des conditions
      favorables à{' '}
      <DefinitionTooltip title={eutrophisation}>
        l’eutrophisation
      </DefinitionTooltip>
      .
    </p>
    <p>
      Un mauvais état écologique a des impacts graves sur la biodiversité : il
      perturbe les conditions de vie des espèces aquatiques et dégrade leurs
      habitats. En 20 ans :
    </p>
    <ul className="text-[1rem] leading-[1.5rem]">
      <li>Les populations de truites de rivière ont diminué de 44 %.</li>
      <li>
        L’abondance de l’anguille européenne est tombée à 10 % de son niveau
        historique.
      </li>
    </ul>
    <p>
      - - - - <br></br>
      L’objectif de la Directive Cadre sur l’Eau (2000) était d’atteindre un bon
      état général des eaux d’ici 2027 : il semble hors d’atteinte désormais.
    </p>
  </div>
);

export const EtatsCoursEauBiodiversiteTextNouveauParcours = () => (
  <>
    <Body size="sm">
      La pollution (de l’air et de l’eau) par des substances dangereuses figure
      parmi les cinq principales pressions à l’origine de l’effondrement de la
      biodiversité. L’objectif d’atteindre un bon état général des eaux d’ici
      2027, fixé par la{' '}
      <DefinitionTooltip title={directiveCadreSurLeau}>
        directive cadre sur l’eau
      </DefinitionTooltip>{' '}
      de 2000, paraît désormais inatteignable.
    </Body>
  </>
);

export const EtatCoursEauRessourcesEauText = () => (
  <div className="pt-5">
    <Body size="sm">
      Même pour des cours d’eau en bon état, les événements extrêmes dus au
      changement climatique aggravent les pollutions : en période de sécheresse,
      les polluants se concentrent ; lors des crues, ils sont massivement
      charriés vers les captages, augmentant la contamination.
    </Body>
    <Body size="sm">
      Certaines activités sont directement affectées par la qualité chimique des
      cours d’eau (pisciculture en eau douce, pêche professionnelle ou de
      loisir, sports d’eau vive…). Par ailleurs, 48 % de l’eau prélevée pour les
      usages domestiques, agricoles et industriels provient des eaux de surface.
      Une eau brute plus polluée nécessite des traitements plus complexes, ce
      qui augmente les coûts du service de l’eau.
    </Body>
    <Body size="sm">
      Concernant spécifiquement l’eau potable, si deux tiers des prélèvements
      sont faits sur des ressources souterraines, les prélèvements en eaux de
      surface sont majoritaires en région parisienne, en Bretagne, dans les Pays
      de la Loire, sur la Côte d’Azur et dans l’ancienne région Midi-Pyrénées.
    </Body>
  </div>
);

// Sources du texte :
// « cinq principales pressions » : IPBES, communiqué du rapport mondial, 5 mai 2019, https://www.ipbes.net/news/Media-Release-Global-Assessment-Fr — « (1) les changements d'usage des terres et de la mer ; (2) l'exploitation directe de certains organismes ; (3) le changement climatique ; (4) la pollution et (5) les espèces exotiques envahissantes »
// « Très oxydant » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 7 du PDF, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « un impact néfaste sur la santé et sur l'environnement, du fait de son caractère oxydant »
// « aussi bien les cultures que la végétation naturelle » : Airparif, p. 11, § 2.2 — « L'ozone touche à la fois la végétation naturelle (en particulier, les forêts et les zones d'intérêt écologique), mais également des cultures (notamment les céréales) »
// « en altérant les tissus des feuilles […] rendements agricoles » : Airparif, p. 11, § 2.2 — « l'ozone conduit à la formation de nécroses sur les feuilles, ce qui limite la photosynthèse […] et provoque, à terme, des baisses de rendement pour les cultures »
// « capacité des végétaux à absorber le CO₂ » : Airparif, p. 12, § 2.3 — « en réduisant l'activité photosynthétique des plantes, des cultures, des forêts, celles-ci seront ainsi moins capables de consommer le CO2 atmosphérique »
// « polluant secondaire […] sous l'effet du soleil et de la chaleur, par réaction chimique entre d'autres polluants » : Airparif, p. 7, § 1 — « Il s'agit d'un polluant secondaire. Il est principalement formé chimiquement dans l'atmosphère, par oxydation des Composés Organiques Volatils (COV) en présence d'oxydes d'azote (NOx), sous l'effet du rayonnement solaire et de fortes températures »
// « comme ceux émis par les transports » : Conseil national de l'air, L'ozone et ses impacts, octobre 2025, p. 2 du PDF, https://www.ecologie.gouv.fr/sites/default/files/documents/25084_Ozone-et-ses-impacts_vf.pdf — « les oxydes d'azote (NOx) issus du transport »
// « Ses concentrations culminent donc en été » : Airparif, p. 8 — « les plus fortes concentrations d'ozone sont mesurées durant l'été, lorsque que les températures et l'ensoleillement sont les plus forts »
// « en pleine période de végétation » : Airparif, p. 14, § 3.1 — « des valeurs cibles calés sur les périodes de pleine végétation et de cultures situées au printemps et en été »
// « Portée par le vent […] en subissent les effets » : texte TACCT précédent, conservé ; Airparif, p. 10 — « L'ozone est un polluant qui voyage. […] La pollution issue de l'agglomération impacte les zones rurales alentours »
export const AOT40Text = () => (
  <>
    <Body size="sm">
      La pollution figure parmi les cinq principales pressions à l'origine de
      l'effondrement de la biodiversité. Très oxydant, l'ozone touche aussi
      bien les cultures que la végétation naturelle : en altérant les tissus
      des feuilles, il limite la photosynthèse, ce qui réduit les rendements
      agricoles et la capacité des végétaux à absorber le CO₂.
    </Body>
    <Body size="sm"><br></br>
      L'ozone n'est pas rejeté directement dans l'air : c’est un polluant
      secondaire qui se forme sous l'effet du soleil et de la chaleur, par
      réaction chimique entre d'autres polluants comme ceux émis par les
      transports. Ses concentrations culminent donc en été, en pleine période
      de végétation. Portée par le vent, la pollution à l'ozone ne s'arrête pas
      aux frontières des agglomérations : même les territoires éloignés des
      sources de pollution en subissent les effets.
    </Body>
  </>
);

//https://librairie.ademe.fr/air/327-cout-economique-pour-l-agriculture-des-impacts-de-la-pollution-de-l-air-par-l-ozone.html
// Sources du texte :
// « L’ozone pénètre dans les feuilles des cultures par leurs pores, les stomates » : CLRTAP/UBA, Manual on Methodologies and Criteria for Modelling and Mapping Critical Loads and Levels, chapitre 3 (ICP Vegetation), mise à jour 2024, Texte 123/2024, p. 74, § 3.3.1.1, https://www.umweltbundesamt.de/system/files/medien/11850/publikationen/123_2024_texte_manual_on_methodologies_and_criteria.pdf — « O3 enters leaves via the stomatal pores on the leaf surface » ; Chambres d’agriculture, fiche APollO « Coût économique pour l’agriculture des impacts de l’ozone en France », p. 2 du PDF — « Il pénètre dans les feuilles et provoque un stress oxydatif délétère »
// « Il y endommage les cellules » : SDES, Bilan de la qualité de l’air extérieur en France en 2024, octobre 2025, p. 11 du PDF, https://www.statistiques.developpement-durable.gouv.fr/media/8742/download?inline — « L’absorption de ce polluant endommage les cellules végétales »
// « réduit la photosynthèse et fait vieillir les feuilles plus tôt » : CLRTAP/UBA, manuel 2024, p. 74, § 3.3.1.1 — « negative impacts on plant metabolism, including photosynthesis » ; « Visible leaf damage and premature aging of leaves »
// « les rendements baissent, en quantité comme en qualité » : SDES, Bilan 2024, p. 11 du PDF — « une baisse des rendements agricoles (quantitatifs et qualitatifs) »
// « Le blé, le soja, les pois, les haricots, l’oignon et la laitue font partie des cultures les plus sensibles » : ICP Vegetation (Mills & Harmens, éd.), Ozone Pollution: A hidden threat to food security, septembre 2011, tableau 1, p. 6 du PDF, https://nora.nerc.ac.uk/id/eprint/15071/1/N015071CR.pdf — catégorie « Sensitive » : « Peas and beans (including peanut) (30) […] Onion (23) […] Lettuce (19) Wheat (18) Soybean (18) » (perte de rendement en % à 60 ppb par rapport à 30 ppb) ; Chambres d’agriculture, fiche APollO, p. 1 du PDF — « Exemple d’espèces cultivées sensibles à l’ozone […] blé, soja, catonnier, melon, légumes à gousses (haricots, pois, fèves...) navet, oignon, laitue, tomate »
// « En France, l’ozone aurait ainsi réduit en 2010 le rendement du blé tendre de 15 %, et celui des prairies et des pommes de terre de 11 %, selon l’étude APollO » : ADEME/Ineris/Chambres d’agriculture, Coût économique pour l’agriculture des impacts de la pollution de l’air par l’ozone (APollO), synthèse, mai 2019 (mise en ligne le 13/01/2021), p. 15 du PDF, https://librairie.ademe.fr/air/327-cout-economique-pour-l-agriculture-des-impacts-de-la-pollution-de-l-air-par-l-ozone.html — « Malgré la tendance à la baisse, les pertes en pourcentage agrégées sur la France restent importantes, avec en 2010, 15 % pour le blé tendre, 11 % pour les prairies et les pommes de terre » ; le lien [3] porte sur « l’étude APollO » et renvoie à la source n° 3 de la thématique agriculture dans src/lib/sources.ts
// « L’ozone culmine en été » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 8 du PDF, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « même si ce polluant est présent toute l’année, les plus fortes concentrations d’ozone sont mesurées durant l’été, lorsque que les températures et l’ensoleillement sont les plus forts »
// « au moment où les cultures sont en pleine croissance » : Airparif, p. 14 du PDF, § 3.1 — « la réglementation intègre des objectifs de qualité et des valeurs cibles calés sur les périodes de pleine végétation et de cultures situées au printemps et en été »
// « La quantité qu’elles absorbent dépend de l’ouverture de leurs stomates » : ICP Vegetation 2011, p. 5 du PDF — « The more open the stomata are, the more ozone will enter the plant. »
// « qui varie notamment avec la température, la lumière, l’humidité de l’air et l’eau disponible dans le sol » : CLRTAP/UBA, manuel 2024, p. 75 — « Stomata are physiologically controlled and respond to environmental conditions such as temperature, light, air humidity, and soil moisture, as well as plant growth stage. »
// « en période de sécheresse, la plante ferme ses stomates et absorbe moins d’ozone » : CLRTAP/UBA, manuel 2024, p. 75 — « For example, under hot and dry conditions, plants close their stomata to reduce water loss and as a consequence O3 uptake is reduced. »
// « une culture irriguée les garde ouverts et en absorbe davantage » : ICP Vegetation 2011, p. 7 du PDF — « However, significant effects of ozone are likely where the crops are irrigated inducing stomatal opening, increasing ozone uptake and increasing impact. »
// « L’irrigation, envisagée pour faire face aux sécheresses » : texte TACCT « Superficies irriguées » (SurfacesIrrigueesText, même fichier) — « elle pourrait devenir un outil d’adaptation au changement climatique » ; « l’irrigation “de résilience” visant à stabiliser les récoltes »
// « peut ainsi accroître l’absorption d’ozone » : APollO, rapport complet, p. 41 du PDF — « de telles approches ont tendance à déplacer les plantations vers des périodes impliquant un besoin d’irrigation qui lui-même rend les cultures plus sensibles à l’ozone » ; ICP Vegetation 2011, p. 7 du PDF (voir ci-dessus)
// « l’étude APollO souligne que les mesures prises pour faire face au changement climatique ne réduisent pas toujours les effets de l’ozone » : APollO, synthèse, p. 19 du PDF — « de tels travaux pourraient aussi s’inspirer des études sur les stratégies d’adaptation au changement climatique, même si les mesures conçues pour atténuer les impacts du changement climatique ne seront pas toujours synonymes d’atténuation en ce qui concerne les niveaux et effets de l’ozone » ; même phrase dans le rapport complet, p. 106 du PDF
// « la sélection de variétés plus résistantes constitue une piste d’adaptation, mais elle demande du temps et des investissements » : Chambres d’agriculture, fiche APollO, p. 4 du PDF — « Au niveau de la plante : La sélection variétale qui intègre une meilleure résistance à l’ozone, qui demande du temps et des investissements » ; ICP Vegetation 2011, p. 5 du PDF — « Sensitivity to ozone varies between cultivars, which means that there is scope for exploiting ozone resistance within breeding programmes »
// Points de vigilance :
// Chiffre 2010 : estimation APollO par la méthode du flux d’ozone absorbé par les stomates (POD), pas par l’AOT40. APollO, synthèse, p. 17 du PDF — « les incertitudes dans les résultats économiques doivent être considérées comme étant élevées, avec une tendance majorante » ; la pénalité climatique n’y est pas prise en compte (synthèse, p. 15). D’où le conditionnel « aurait réduit ».
// Chiffre alternatif plus récent, non retenu car il ne couvre pas les prairies : Ineris pour l’AEE, ETC HE Report 2024/9, Wheat and potato yield loss in 2022 in Europe due to ozone exposure, novembre 2024, p. 48, https://www.eionet.europa.eu/etcs/etc-he/products/etc-he-products/etc-he-reports/etc-he-report-2024-9-wheat-and-potato-yield-loss-in-2022-in-europe-due-to-ozone-exposure — « losses in France in 2022 are estimated at 7 % for both wheat and potatoes » ; les pertes varient fortement selon les années (4,8 % pour le blé en France en 2019, ETC/ATNI Report 2021/17).
// Sensibilité des cultures : les sources divergent pour l’orge et le colza (« moderately sensitive » pour ICP Vegetation 2011, « peu sensibles » pour l’ADEME, étude BEMEVO), et pour la tomate (« moderately sensitive » pour ICP Vegetation, « sensible » pour la fiche APollO) ; elles ne sont donc pas citées.
// Ouverture des stomates : l’eau n’est qu’un des facteurs ; la liste du texte, introduite par « notamment », reprend ceux du manuel CLRTAP (p. 75), sauf le stade de croissance. Les dégâts dépendent aussi de la concentration et de la durée d’exposition, et de la capacité de la plante à neutraliser l’ozone : ICP Vegetation 2011, p. 5 du PDF — « The results of these damaging effects depend on both the concentration and duration of ozone exposure. Plants are able to detoxify low concentrations of ozone but only to a certain threshold level. »
// Irrigation : le blé est rarement irrigué ; le point concerne surtout les cultures irriguées. APollO, rapport complet, p. 105 du PDF — « Une irrigation non pertinente dans la plupart des régions pour le blé ». ICP Vegetation 2011 (p. 9 du PDF) évoque aussi de suspendre l’irrigation pendant les pics d’ozone (« withholding irrigation during episodes of peak ozone concentrations »), piste non reprise par une source française.
// Retiré du texte lors de la reprise du second paragraphe :
// « ses concentrations sont généralement plus élevées dans les zones rurales et périurbaines qu’en ville » (SDES, Bilan 2024, p. 35 du PDF ; Airparif, p. 9 du PDF) : information sans lien avec la lecture du chiffre par un lecteur agricole.
// « cet impact est peu connu du monde agricole » : APollO, rapport complet, p. 8 du PDF — « Paradoxalement, cet impact de l’ozone sur les productions agricoles est peu connu du secteur agricole » ; repose sur un questionnaire de novembre 2018 aux conseillers des chambres d’agriculture, avec un taux de réponse de 8 % (rapport complet).
// « les exploitations disposent de peu de leviers : la réduction des émissions des polluants à l’origine de l’ozone est jugée plus appropriée que l’adaptation des pratiques » : APollO, synthèse, p. 18 du PDF — « les stratégies de mitigation des émissions de polluants précurseurs de l’ozone sont certainement plus appropriées que les stratégies d’adaptation du secteur agricole et sylvicole » ; conclusion principale d’APollO, retirée pour centrer le texte sur l’adaptation.
// Volontairement écarté du texte : l’agriculture comme émettrice de précurseurs de l’ozone (Citepa, Secten 2026, p. 443 : 25 % des NOx, 39 % des COVNM, 71 % du CH4 en 2024), car les sources divergent sur le poids d’une action agricole locale sur l’ozone ; les limites de l’AOT40 (exposition et non dose absorbée), traitées dans le « D’où vient ce chiffre ? ».
export const AOT40AgricultureText = () => (
  <>
    <Body size="sm">
      L’ozone pénètre dans les feuilles des cultures par leurs pores, les
      stomates. Il y endommage les cellules, réduit la photosynthèse et fait
      vieillir les feuilles plus tôt : les rendements baissent, en quantité
      comme en qualité. Le blé, le soja, les pois, les haricots, l’oignon et la
      laitue font partie des cultures les plus sensibles. En France, l’ozone
      aurait ainsi réduit en 2010 le rendement du blé tendre de 15 %, et
      celui des prairies et des pommes de terre de 11 %, selon{' '}
      <ScrollToSourceTag sourceNumero={3}>l’étude APollO</ScrollToSourceTag>.
    </Body>
    <Body size="sm"><br></br>
      L’ozone culmine en été, au moment où les cultures sont en pleine
      croissance. La quantité qu’elles absorbent dépend de l’ouverture de
      leurs stomates, qui varie notamment avec la température, la lumière,
      l’humidité de l’air et l’eau disponible dans le sol : en période de
      sécheresse, la plante ferme ses stomates et absorbe moins d’ozone ; une
      culture irriguée les garde ouverts et en absorbe davantage.
      L’irrigation, envisagée pour faire face aux sécheresses, peut ainsi
      accroître l’absorption d’ozone. Tant que les émissions de précurseurs de
      l’ozone ne diminuent pas suffisamment, la sélection de variétés plus
      résistantes constitue une piste d’adaptation, mais elle demande du temps
      et des investissements.
    </Body>
  </>
);

export const PrelevementEauText = () => (
  <div className="pt-10">
    <Body size="sm">
      Les sécheresses 2022 et 2023 sonnent l'alerte : optimiser la ressource en
      eau disponible devient vital. Face à l'intensification des sécheresses due
      au changement climatique, chaque territoire doit anticiper. Un prélèvement
      n'est possible que si la ressource existe !
    </Body>
    <Body size="sm">
      Attention aux chiffres bruts : les prélèvements ne reflètent pas les
      consommations réelles. L'industrie rejette une partie de l'eau prélevée,
      tandis que l'agriculture consomme la quasi-totalité de ses prélèvements,
      concentrés sur trois mois d'été. Dans les zones géographiques en tension,
      l'agriculture peut représenter jusqu'à 80 % de l'eau consommée. Cette
      situation fragilise la ressource locale. Le prix de l'eau est susceptible
      d'augmenter pour deux raisons : la rareté de la ressource et le besoin de
      traitements plus sophistiqués (dénitrification, élimination des
      micropolluants, etc.).
    </Body>
    <Body size="sm">
      ⇒ Lors de la sécheresse 2022, 2 000 communes ont été en tension sur l’eau
      potable.
    </Body>
    <Body size="sm">
      ⇒ 30 milliards de m3 d’eau ont été prélevés en France en 2021 (hors
      production hydroélectrique), soit l’équivalent de plus d’un tiers du
      volume du Lac Léman. 82 % des prélèvements proviennent d'eaux de surface,
      18 % d'eaux souterraines
    </Body>
    <Body size="sm">
      ⇒ 20 % des prélèvements d’eau potable sont perdus à cause des fuites, soit
      l’équivalent de la consommation de 18,5 millions d’habitants.
    </Body>
    <Body size="sm" htmlTag="div">
      - - - - <br></br>
      Le Plan Eau agit pour atteindre -10% d’eau prélevée d’ici 2030 :
      <li>
        la mesure 11 prévoit la fin progressive des autorisations de prélèvement
        non soutenables dans les bassins en déséquilibre (au fur et à mesure du
        renouvellement des autorisations) ;
      </li>
      <li>
        la mesure 12 prévoit l’installation obligatoire de compteurs connectés
        pour les prélèvements importants (généralisation prévue d'ici 2027) ;
      </li>
      <li>
        la mesure 13 prévoit le renforcement de l'encadrement des petits
        prélèvements domestiques.
      </li>
    </Body>
    <Body size="sm">
      Plan National d’Adaptation au Changement Climatique (PNACC-3) :<br></br>La
      mesure 21 prévoit une étude spécifique sur les vulnérabilités de
      l'approvisionnement en eau potable dans les départements et régions
      d'Outre-mer.
    </Body>
  </div>
);

export const CatNatText = () => (
  <div className="pt-10">
    <Body size="sm">
      Les phénomènes extrêmes s'intensifient. Leur fréquence augmente à chaque
      hausse de 0,5°C de la température mondiale. La France est particulièrement
      exposée : depuis 1900, elle a subi 14 % des catastrophes naturelles
      majeures en Europe. Inondations, cyclones et tempêtes y sont les plus
      dévastateurs. La France et l'Italie sont les pays européens les plus
      touchés, loin devant les autres.
    </Body>
    {/* <Body size="sm">
      ⇒ 257 500, c’est le nombre d'arrêtés liés aux événements
      climatiques depuis la création du régime CatNat en 1982. Les
      inondations représentent plus de 56 % du total.
    </Body>
    <Body size="sm">
      ⇒ 8 : c'est le nombre moyen d’arrêtés CatNat par commune entre
      1982 et septembre 2024. Mais une commune détient le triste
      record de 135 arrêtés sur cette période !
    </Body>
    <Body size="sm">
      ⇒ 10,6 milliards d’euros : c’est le coût d’indemnisations des
      dommages liés à des aléas climatiques en France en 2022.
    </Body>
    <Body size="sm">
      ⇒ 4,8 milliards d’euros : montant moyen annuel des pertes
      économiques directes attribuées aux événements naturels en
      France entre 2015 et 2019, soit : <br></br>- deux fois le budget
      annuel des Agences de l’eau, ou <br></br>- 20 fois les besoins
      annuels pour adapter les biens exposés au risque d’érosion en
      France au cours des 25 prochaines années (estimation de
      l’Inspection générale de l'environnement et du développement
      durable).
    </Body> */}
  </div>
);

export const ErosionCotiereText = () => (
  <div className="pt-10">
    <Body size="sm">
      L'érosion grignote nos côtes : près de 20 % du littoral français recule
      face à la mer. Ce phénomène naturel s'accélère avec le changement
      climatique, la hausse du niveau des mers et la multiplication des tempêtes
      notamment. Les chiffres sont préoccupants. 37 % des côtes sableuses
      s'érodent, soit 700 kilomètres - la distance Paris-Marseille - qui
      disparaissent peu à peu. En 50 ans, la mer a englouti l'équivalent de la
      ville de La Rochelle : 30 km² de terres perdues.
    </Body>
    <Body size="sm" htmlTag="div">
      Impacts locaux sur les milieux :
      <ul style={{ marginLeft: '1rem' }}>
        <li>Augmentation des intrusions salines des aquifères côtiers,</li>
        <li>Modification des paysages (nouvelles lagunes…),</li>
        <li>Appauvrissement des sols dû à la salinisation.</li>
      </ul>
    </Body>
    <Body size="sm" htmlTag="div">
      Impacts locaux sur les activités humaines :
      <ul style={{ marginLeft: '1rem' }}>
        <li>
          Diminution de la disponibilité des eaux douces souterraines pour les
          différents usages,
        </li>
        <li>
          Modification des marais salins avec conséquences sur les activités,
        </li>
        <li>
          Salinisation et réduction des terres par submersion temporaire ou
          permanente.
        </li>
      </ul>
    </Body>
    <Body size="sm">
      ⇒ 523 communes touchées par le recul du littoral, dont 59 perdent plus
      d'1,5 mètre de littoral chaque année.
    </Body>
    <Body size="sm">
      ⇒ D'ici 2050 : 5200 logements et 1400 locaux d'activité seront menacés,
      pour un coût estimé à 1,2 milliard d'euros.
    </Body>
    <Body size="sm">
      - - - - <br></br>
      Plan National d'Adaptation au Changement Climatique (PNACC-3) : La mesure
      35 prévoit d’accompagner l’adaptation du tourisme culturel, de montagne,
      littoral et nautique.
    </Body>
  </div>
);

export const FeuxForetText = () => (
  <div className="pt-10">
    <Body size="sm">
      Si la France a réussi à diviser par cinq les surfaces brûlées depuis les
      années 1980 grâce à d'importants investissements en prévention, cette
      victoire est désormais menacée. Le climat plus chaud et sec multiplie les
      départs de feux, les vents violents accélèrent leur propagation, et la
      saison s'étire du printemps à l'automne, touchant des territoires
      jusque-là épargnés.
    </Body>
    <Body size="sm">
      Au-delà des flammes, les incendies déclenchent une cascade de
      catastrophes : destruction de biodiversité, pollution atmosphérique et
      aquatique, aggravation d'autres aléas (érosion, glissements, inondations)
      et émissions massives de CO₂ qui alimentent le cercle vicieux du
      dérèglement climatique.
    </Body>
  </div>
);

export const RGAText = () => (
  <div className="pt-10">
    <Body size="sm">
      Phénomène lié à l’alternance de sécheresses extrêmes et de fortes pluies,
      le retrait gonflement des argiles (RGA) touche surtout les maisons
      individuelles anciennes. Mais les routes, les écoles, les canalisations
      ou les équipements municipaux peuvent aussi être affectés, mettant en
      jeu la sécurité et l’attractivité du territoire.
    </Body>
    <Body size="sm">
      Si le phénomène est incontestablement amplifié par le changement climatique,
      la qualité des constructions est aussi en cause. La fréquence des sinistres
      RGA des maisons construites après 1975 est 5 fois supérieure à celle des
      maisons construites avant 1975, alors même que ces dernières ont subi
      davantage de cycles de RGA. Multifactoriel, le RGA est donc un sujet
      complexe qui nécessite une approche combinée sols, bâtiment, urbanisme…
    </Body>
  </div>
);

export const SurfacesAgricolesText = () => (
  <div className="pt-10">
    <Body size="sm">
      Paradoxe agricole : cultures permanentes (vergers, vignes…) et certaines
      cultures légumières occupent peu d'espace mais concentrent l'essentiel des
      pertes climatiques. Gel, mildiou, sécheresse, excès d'eau... Un système
      spécialisé est fragile face aux chocs répétés.
    </Body>
  </div>
);

// Sources du texte :
// « 93 zones géographiques : 88 aires urbaines de l’Hexagone, la Guadeloupe, la Martinique, La Réunion, Mayotte et le littoral nord-ouest de la Guyane » : Cerema, actualité du 15 septembre 2026, https://www.cerema.fr/fr/actualites/cartographie-lcz-outil-villes-plus-fraiches-cerema-presente — « Une cartographie en ligne des LCZ sur 93 zones géographiques […] En France Hexagonale, 88 aires urbaines de plus de 50 000 habitants sont couvertes. En Outre-Mer, cette couverture concerne les îles de Guadeloupe, Martinique, La Réunion et Mayotte, et le littoral nord-ouest de Guyane. »
// « 12 110 communes couvertes » : Cerema, même page — « La cartographie est disponible en ligne pour 12 110 communes (sur 34 955) »
// « plus de 5 millions d’habitants vivent dans des quartiers à forte sensibilité aux fortes chaleurs » : Cerema, même page, rubrique « Enseignements » — « Plus de 5 millions d’habitants vivent dans des quartiers à forte sensibilité aux fortes chaleurs »
// « cahier du Cerema « Cartographie des LCZ : un outil pour des villes plus fraîches » » : Cerema, collection « Les cahiers », 2026, https://doc.cerema.fr/Default/doc/SYRACUSE/616032/cartographie-des-lcz-un-outil-pour-des-villes-plus-fraiches — titre du document
export const LCZCeremaText1 = () => (
  <>
    <Body weight="bold">Comment lire cette carte ?</Body>
    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Les zones climatiques locales (LCZ en anglais) montrent comment un
      territoire réagit aux vagues de chaleur estivales.
    </Body>
    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Les 17 types de zones aident à identifier les zones qui peuvent
      potentiellement devenir très chaudes. Bien que basée sur l’occupation du
      sol et la forme des villes,
      <b>
        {' '}
        cette cartographie n’est pas une modélisation de l’îlot de chaleur
        urbain.
      </b>{' '}
      Ces données, fournies par le CEREMA, couvrent 93 zones géographiques :
      88 aires urbaines de l’Hexagone, la Guadeloupe, la Martinique,
      La Réunion, Mayotte et le littoral nord-ouest de la Guyane. Sur les
      12 110 communes couvertes, plus de 5 millions d’habitants vivent dans
      des quartiers à forte sensibilité aux fortes chaleurs.
    </Body>

    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Pour prendre en main cette cartographie, consultez le cahier du{' '}
      <a
        href="https://doc.cerema.fr/Default/doc/SYRACUSE/616032/cartographie-des-lcz-un-outil-pour-des-villes-plus-fraiches"
        target="_blank"
        rel="noreferrer"
      >
        Cerema
      </a>{' '}
      « Cartographie des LCZ : un outil pour des villes plus fraîches ».
    </Body>
  </>
);

export const LCZText2 = () => (
  <>
    <Body weight="bold">Comment lire cette carte ?</Body>
    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Cette carte, issue de multiples jeux de données d'observation de la Terre,
      vous permet d'explorer votre territoire à 100 m de résolution spatiale.
      Les zones climatiques locales (LCZ en anglais) montrent comment un
      territoire réagit aux vagues de chaleur estivales. Les 17 types de zones
      aident à identifier les zones qui peuvent potentiellement devenir très
      chaudes.
      <br></br>
      Bien que basée sur l’occupation du sol et la forme des villes,{' '}
      <b>
        cette cartographie n’est pas une modélisation de l’îlot de chaleur
        urbain.
      </b>
    </Body>
    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Pour en savoir plus sur la méthodologie scientifique utilisée pour
      élaborer la carte, consultez l’article{' '}
      <a
        href="https://essd.copernicus.org/articles/14/3835/2022/"
        target="_blank"
        rel="noreferrer"
      >
        A global map of local climate zones to support earth system modelling
        and urban-scale environmental science
      </a>
      .
    </Body>
  </>
);

export const LCZText = () => (
  <>
    <Body size="sm" style={{ marginTop: '2rem' }}>
      Les LCZ, basées sur un référentiel scientifique, permettent de classer les
      quartiers selon leurs formes urbaines et leur propension à surchauffer.{' '}
      <b>Elles ne permettent pas de quantifier l'îlot de chaleur urbain</b>,
      contrairement aux mesures de température de l'air. Les LCZ aident à
      identifier les zones potentiellement sujettes à la surchauffe afin d’y
      installer des capteurs, ou pour identifier des zones prioritaires pour
      agir en faveur du rafraîchissement. La cartographie est un outil gratuit
      de pré-diagnostic, qui doit être analysée au regard de la connaissance
      locale du territoire, et ne peut se substituer à des données climatiques
      ou à une analyse fine des usages et de la vulnérabilité face à la chaleur.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Pour orienter efficacement une stratégie d’adaptation, consultez{' '}
      <a href="https://plusfraichemaville.fr/" target="_blank" rel="noreferrer">
        Plus fraiche ma ville
      </a>
      .
    </Body>
  </>
);

export const AiresAppellationsControleesText = () => (
  <>
    <Body size="sm" style={{ marginTop: '2rem' }}>
      Le changement climatique vient progressivement remettre en cause les liens
      historiquement construits entre produits, terroirs et savoir-faire locaux reconnus.
      Parallèlement, les attentes des consommateurs évoluent : au-delà de l’origine et
      de la qualité, ils exigent désormais une exemplarité environnementale accrue. Cette
      double pression interroge la capacité des appellations contrôlées à évoluer sans affaiblir
      leur identité, alors même qu’elles jouent un rôle structurant dans l’économie des territoires
      et participent fortement à leur attractivité touristique et à leur image de marque.
    </Body>
  </>
);

export const DebroussaillementText = ({
  isDebroussaillement
}: {
  isDebroussaillement: boolean;
}) => (
  <>
    {
      isDebroussaillement ? (
        <Body size="sm">
          Votre territoire est concerné par une obligation légale de{' '}
          <DefinitionTooltip title={debroussaillement}>
            débroussaillement
          </DefinitionTooltip>{' '}
          qui représente la mesure de prévention la plus efficace pour réduire le nombre
          et l'impact des incendies de forêts, selon{' '}
          <ScrollToSourceTag sourceNumero={1}>
            l’Office national des forêts
          </ScrollToSourceTag>
          .
        </Body>) : (
        <Body size="sm">
          Votre territoire n’est pas concerné par une obligation légale de{' '}
          <DefinitionTooltip title={debroussaillement}>
            débroussaillement
          </DefinitionTooltip>{' '}
          qui représente pourtant la mesure de prévention la plus efficace pour réduire le nombre
          et l'impact des incendies de forêts, selon{' '}
          <ScrollToSourceTag sourceNumero={1}>
            l’Office national des forêts
          </ScrollToSourceTag>
          .
        </Body>
      )
    }

    <Body size="sm" style={{ marginTop: '1rem' }}>
      Faute d’entretien en effet,{' '}
      <ScrollToSourceTag sourceNumero={2}>
        4 feux de forêt sur 5
      </ScrollToSourceTag>{' '}
      démarrent à moins de 50 mètres des habitations et{' '}
      <ScrollToSourceTag sourceNumero={3}>
        90 % des maisons détruites
      </ScrollToSourceTag>{' '}
      se situent sur des terrains pas ou mal débroussaillés.
    </Body>
  </>
);

export const O3Text = () => (
  <>
    <Body size="sm">
      <DefinitionTooltip title={ozone}>L’ozone</DefinitionTooltip>{' '}
      (O3) fait partie des 4 polluants atmosphériques pour lesquels il existe
      une réglementation et des seuils conduisant aux déclenchement de procédures
      préfectorales. Si les pics de pollution aiguë provoquent des symptômes
      respiratoires immédiats, l’exposition chronique constitue un enjeu sanitaire
      plus préoccupant : elle est associée à des effets à long terme, même à des
      concentrations ne déclenchant pas nécessairement d’alerte. C’est notamment pourquoi
      l’<DefinitionTooltip title={OMS}>OMS</DefinitionTooltip> {" "}
      recommande <DefinitionTooltip title={valeursGuidesO3}>des valeurs guides </DefinitionTooltip>
      plus strictes que le seuil européen actuel. À titre d’exemple, en 2022, <b>seules 12 % des
        agglomérations françaises le dépassaient alors que 95 % d’entre elles auraient été
        en dépassement si les <ScrollToSourceTag sourceNumero={1}>valeurs guides de l’OMS avaient été
          appliquées </ScrollToSourceTag>.</b>
    </Body>
    <Body weight="bold" size="sm" style={{ marginTop: '1rem' }}>
      Pas de stations sur votre territoire ?
    </Body>
    <Body size="sm" style={{ marginTop: '0.5rem' }}>
      Les concentrations d’ozone les plus importantes ne sont pas toujours
      mesurées au cœur des zones émettrices (centres villes, zones
      industrielles) mais parfois à 50, 100 ou 150 km de là, sous le vent des
      émetteurs. Là où, en milieu urbain, l’ozone produit la journée disparaît
      en grande partie pendant la nuit ou sous l’effet d’autres polluants, dans
      les zones rurales en revanche, la moindre présence de polluants
      destructeurs peut favoriser son accumulation et générer des
      concentrations plus élevées qu’en ville.
    </Body>
  </>
);

// Sources du texte :
// « gaz irritant : inhalé, il peut provoquer des troubles respiratoires, déclencher des crises d’asthme et réduire la fonction pulmonaire » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 11 du PDF, § 2.1, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « L’ozone est un gaz irritant qui pénètre facilement jusqu’aux voies respiratoires les plus fines […] il peut provoquer des problèmes respiratoires, déclencher des crises d’asthme, diminuer la fonction pulmonaire »
// « Contrairement au dioxyde d’azote et aux particules (PM10), ses dépassements de la valeur cible pour la santé concernent surtout les zones rurales et les agglomérations de petite et moyenne taille » : SDES, Bilan de la qualité de l’air extérieur en France en 2024, p. 39 du PDF, https://www.statistiques.developpement-durable.gouv.fr/media/8742/download?inline — « Contrairement au NO2 et aux PM10, les agglomérations les plus touchées sont celles de moyenne et de petite taille (moins de 50 000 habitants), de même que les zones rurales »
// « les oxydes d’azote émis notamment par le trafic routier contribuent à former l’ozone, mais ils participent aussi à sa destruction » : Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 10 du PDF, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « Si les oxydes d’azote contribuent à la formation de l’ozone lors de la journée, ils participent également à sa destruction. En effet, l’ozone réagit avec le monoxyde d’azote (NO) » ; Conseil national de l’air, L’ozone et ses impacts, octobre 2025, p. 2 du PDF, https://www.ecologie.gouv.fr/sites/default/files/documents/25084_Ozone-et-ses-impacts_vf.pdf — « les oxydes d’azote (NOx) issus du transport »
// « là où ils sont le plus concentrés, au cœur des grandes agglomérations » : Airparif, p. 16 du PDF — « l’effet « puits d’ozone » caractéristique des grandes métropoles au centre desquelles se concentrent les sources d’oxydes d’azote (NOx), telles que le trafic routier et le chauffage résidentiel qui, par réaction avec l’ozone, consomment celui-ci »
// « Porté par le vent » : Airparif, p. 10 du PDF — « L’ozone est un polluant qui voyage. […] La pollution issue de l’agglomération impacte les zones rurales alentours »
// « atteint donc généralement ses niveaux les plus élevés hors des villes, dans les zones périurbaines et rurales » : SDES, Bilan de la qualité de l’air extérieur en France en 2024, p. 35 du PDF, https://www.statistiques.developpement-durable.gouv.fr/media/8742/download?inline — « Les concentrations maximales en O3 sont généralement observées en milieux rural et périurbain, compte tenu des mécanismes de formation de ce polluant »
// « Les pics d’ozone surviennent par temps chaud et ensoleillé » : Atmo France, Canicule et ozone : bien s’informer pour mieux se protéger, 19 juin 2026, https://www.atmo-france.org/actualite/canicule-et-ozone-bien-sinformer-pour-mieux-se-proteger — « les concentrations d’ozone augmentent généralement lors des périodes estivales, particulièrement lorsque les conditions sont chaudes, ensoleillées et peu ventées »
// « la chaleur en aggrave les effets sur la santé » : PNACC-3, mesure 18, action 2, p. 140, https://www.ecologie.gouv.fr/sites/default/files/documents/PNACC3.pdf — « La chaleur aggravant les effets sanitaires de certains polluants » ; Santé publique France, Pollution atmosphérique : quels sont les risques ?, https://invs.santepubliquefrance.fr/air/pollution-atmospherique-quels-sont-les-risques — « le risque de décès associé à l’ozone et aux particules fines était plus important les jours chauds »
// « La mesure 18 […] prévoit ainsi une expérimentation dans un département : dès la vigilance chaleur orange ou rouge, le préfet pourra y déclencher des mesures habituellement prises lors des épisodes de pollution » : PNACC-3, mesure 18, actions nouvelles, p. 139 — « Réaliser une expérimentation pendant une durée maximale de deux ans dans un département pour que le préfet examine le déclenchement de mesures, appliquées habituellement lors d’épisodes de pollution, en cas de vigilance chaleur orange ou rouge »
// « comme la réduction de vitesse des transports ou la limitation du trafic » : PNACC-3, mesure 18, action 2, p. 140 — « des limitations, reports de trafic ou réduction de vitesse pour le secteur des transports »
export const O3AirText = () => (
  <>
    <Body size="sm">
      L’ozone est un gaz irritant : inhalé, il peut provoquer des troubles
      respiratoires, déclencher des crises d’asthme et réduire la fonction
      pulmonaire. De façon contre-intuitive, et contrairement au dioxyde
      d’azote et aux particules (PM10), ses dépassements de la valeur cible
      pour la santé{' '}
      <ScrollToSourceTag sourceNumero={1}>
        concernent surtout les zones rurales et les agglomérations de petite et
        moyenne taille
      </ScrollToSourceTag>
      . En effet, les oxydes d’azote émis notamment par le trafic routier
      contribuent à former l’ozone, mais ils{' '}
      <ScrollToSourceTag sourceNumero={2}>
        participent aussi à sa destruction
      </ScrollToSourceTag>{' '}
      là où ils sont le plus concentrés, au cœur des grandes agglomérations.
      Porté par le vent, l’ozone atteint donc généralement ses niveaux les plus
      élevés hors des villes, dans les zones périurbaines et rurales.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Les pics d’ozone surviennent par temps chaud et ensoleillé, alors même
      que la chaleur en aggrave les effets sur la santé. La mesure 18 du Plan
      National d’Adaptation au Changement Climatique (PNACC-3) prévoit ainsi
      une expérimentation dans un département : dès la vigilance chaleur
      orange ou rouge, le préfet pourra y déclencher des mesures
      habituellement prises lors des épisodes de pollution, comme la réduction
      de vitesse des transports ou la limitation du trafic.
    </Body>
  </>
);

export const SecheressesText = () => (
  <>
    <Body size="sm" style={{ marginTop: '2rem' }}>
      La sécheresse est un déficit hydrique prolongé - dû à un manque de précipitations ou
      à une utilisation excessive de la ressource - suffisant pour affecter les sols, la
      végétation et les milieux aquatiques. Cyclique ou exceptionnelle, elle entraîne des
      conséquences en cascade : assèchement des cours d'eau, tensions sur l'approvisionnement
      en eau potable, risques accrus d'incendies…
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Le nombre de jours cumulés par niveau de restriction renseigne sur la fréquence
      et la sévérité des épisodes de sécheresse. La présence récurrente de niveaux élevés
      (alerte renforcée ou crise) révèle une vulnérabilité structurelle : la ressource
      disponible est régulièrement insuffisante pour satisfaire l'ensemble des usages,
      traduisant un déséquilibre chronique entre offre et demande en eau, indépendamment
      de toute aggravation future.
    </Body>
  </>
);

export const MoustiqueTigreText = () => (
  <>
    <Body size="sm">
      Le moustique tigre transmet des maladies infectieuses graves comme la dengue,
      le chikungunya et le zika (<DefinitionTooltip title={arbovirose}>arboviroses</DefinitionTooltip>) dont
      les cas doivent obligatoirement être déclarés aux agences régionales de santé. S’il est difficile de prévenir
      les cas importés, la multiplication de cas autochtones est notamment liée à
      une sous-déclaration ou à une déclaration tardive des cas. La précision du
      diagnostic et la rapidité de la déclaration sont donc essentielles pour
      limiter la transmission de ces maladies.
    </Body>
    <Body size="sm">
      L’élévation des températures favorise la propagation du moustique tigre : il
      reste actif plus longtemps dans l’année, se reproduit plus vite et étend
      son implantation toujours plus au nord. Cette progression augmente
      le risque de transmission de ces <DefinitionTooltip title={maladieVectorielle}>maladies vectorielles</DefinitionTooltip>.
    </Body>
  </>
);

// Sources du texte :
// « plante envahissante » : instruction interministérielle n° DGS/EA1/DGCL/DGALN/DGITM/DGAL/2018/201 du 20 août 2018, BO Santé 2018/9, résumé, p. 1 du PDF, https://sante.gouv.fr/fichiers/bo/2018/18-09/ste_20180009_0000_0078.pdf — « ces végétaux envahissants à pollen très allergisant »
// « originaire d’Amérique du Nord » : instruction du 20 août 2018, § I, p. 2 du PDF — « Certaines espèces d’ambroisie originaires d’Amérique du Nord, introduites involontairement en France à la fin du XIXe siècle »
// « émis de la fin juillet à octobre » : instruction du 20 août 2018, annexe 10, p. 33 du PDF — « Le pollen est émis durant la floraison, globalement entre fin juillet et octobre. »
// « transporté par le vent sur plusieurs kilomètres » : ARS Auvergne-Rhône-Alpes, communiqué du 30 juin 2026, https://www.auvergne-rhone-alpes.ars.sante.fr/ambroisie-en-auvergne-rhone-alpes-161-des-habitants-allergiques-dans-la-region-la-plus-touchee-de — « Son pollen, transporté par le vent sur plusieurs kilomètres »
// « quelques grains par mètre cube d’air suffisent » : instruction du 20 août 2018, annexe 10, p. 33 du PDF — « il suffit de quelques grains de pollen par m3 d’air pour que les symptômes apparaissent »
// « une rhinite ou une conjonctivite chez les personnes sensibles […] provoquer ou aggraver l’asthme » : instruction du 20 août 2018, annexe 9, p. 29 du PDF — « chez les personnes sensibles, des symptômes d’allergie tels que la rhinite, la conjonctivite, la trachéite, l’eczéma et l’urticaire. L’exposition au pollen d’ambroisie peut également entraîner l’apparition ou l’aggravation de l’asthme »
// « région la plus touchée, 16,1 % des habitants sont allergiques, et 19,3 % dans les zones les plus exposées » : ARS Auvergne-Rhône-Alpes, communiqué du 30 juin 2026 (enquête ORS-ARS menée en 2025 auprès de 2 590 ménages représentant 6 107 habitants) — « région la plus touchée de France » ; « 16,1 % des personnes interrogées présentent une allergie à l’ambroisie » ; « Elle atteint 19,3 % dans les zones les plus exposées contre 11,4 % dans les zones les moins exposées » ; le lien [2] renvoie à la source n° 2 de la thématique santé dans src/lib/sources.ts
// « Dans les cultures d’été, l’ambroisie concurrence les plantes cultivées » : instruction du 20 août 2018, § 3.2, p. 6 du PDF — « plantes adventices concurrentielles se développant préférentiellement dans certaines cultures (tournesol, soja, chaumes de céréales d’hiver, etc.) » ; Observatoire des ambroisies, Ambroisie et agriculture, https://ambroisie-risque.info/ambroisie-et-agriculture/ — « Pour les cultures estivales, la difficulté est que le développement est situé à l’optimum du cycle de l’ambroisie »
// « jusqu’aux deux tiers pour le tournesol et au tiers pour le soja » : Anses, Impacts sanitaires et coûts associés à l’ambroisie à feuilles d’armoise en France, rapport d’expertise collective, octobre 2020, p. 201 du PDF, https://www.anses.fr/fr/system/files/AIR2018SA0088Ra.pdf — « Selon l’analyse économique des espèces exotiques envahissantes en France menée par le Commissariat Général au Développement Durable, jusqu’à deux tiers de perte de rendement peuvent être observées sur le tournesol et jusqu’à un tiers sur le soja, le sorgho, et le pois (Wittmann et Flores-Ferrer 2015) » ; le lien [3] renvoie à la source n° 3 de la thématique santé
// « terrains nus ou retournés, dont ceux que gèrent les collectivités, comme les bords de route et les chantiers » : instruction du 20 août 2018, § 3.2, p. 6 du PDF — « terrains nus ou peu couverts ou retournés (parcelles cultivées, bords de route, zones de travaux, chantiers, friches, berges de rivière, parcs, jardins, etc.) » ; « en tant que propriétaire, locataire, gestionnaire de terrains bâtis et non bâtis, maître d’ouvrage, maître d’œuvre, les collectivités territoriales sont tenues de mettre en œuvre les mesures de lutte fixées par l’arrêté préfectoral »
// « surtout dispersées par le transport de terre et les engins » : Anses, avis du 20 octobre 2020 (saisine 2018-SA-0088), p. 4/29, même PDF — la dispersion naturelle « est considérée d’importance faible » ; vecteurs d’origine anthropique (« semences agricoles, alimentation animale, semences pour oiseaux, machines agricoles, sols contaminés, etc. ») : « Leur importance est majeure » ; instruction du 20 août 2018, annexe 10, p. 33 du PDF — « le déplacement de terres infestées, les roues de véhicules (engins agricoles, de travaux public, etc.) »
// « restent viables de nombreuses années dans le sol » : Observatoire des ambroisies, Ambroisie et agriculture — « Elles vivent de nombreuses années dans le sol ce qui implique une gestion pluriannuelle pour faire baisser le stock de graines »
// « plus la plante s’étend, plus sa gestion devient difficile et coûteuse » : instruction du 20 août 2018, § I, p. 3 du PDF — « plus les ambroisies se répandent dans les milieux et plus la situation devient difficile à gérer (notamment compte tenu des stocks de semences qui s’accumulent dans les sols) et coûteuse en termes de lutte »
// « Selon l’Anses, sa propagation vers le nord de l’Europe, notamment du fait du changement climatique, est une prévision robuste » : Anses, avis du 20 octobre 2020, p. 18/29, même PDF — « Cependant, la prédiction de propagation de la plante vers le Nord de l’Europe, notamment du fait du changement climatique, par rapport aux implantations actuelles apparaît robuste » ; le lien [3] renvoie à la source n° 3 de la thématique santé
// « Le Plan National d’Adaptation au Changement Climatique (PNACC-3) prévoit, dans sa mesure 16 […] » : PNACC-3, mesure 16, action 4, p. 131, https://www.ecologie.gouv.fr/sites/default/files/documents/PNACC3.pdf — « Prévenir et lutter contre les espèces porteuses de risques pour la santé (moustiques, punaises de lit, ambroisie, chenilles processionnaires, etc.) par des méthodes compatibles avec la préservation de la santé, de l’environnement et de la biodiversité »
// Points de vigilance :
// Rendements : maximums tirés d’une analyse du CGDD de 2015, cités par l’Anses ; l’étude du CGDD n’a pas été consultée, l’année et le pays des observations d’origine ne sont pas connus. L’Anses écrit juste avant qu’il manque des données françaises robustes par culture (rapport, p. 201 du PDF) — « la transposition de données étrangères au cas français n’apparait pas pertinente ».
// 16,1 % : enquête déclarative (cas certains, probables et suspectés), valable pour la seule région Auvergne-Rhône-Alpes.
// Période d’émission du pollen : les sources divergent ; l’instruction écrit aussi « principalement d’août à octobre avec un pic en septembre » (annexe 1, p. 12 du PDF). Retenu : annexe 10.
export const AmbroisieText = () => (
  <>
    <Body size="sm">
      L’ambroisie à feuilles d’armoise est une plante envahissante originaire
      d’Amérique du Nord. Son pollen, émis de la fin juillet à octobre et
      transporté par le vent sur plusieurs kilomètres, est très allergisant :
      quelques grains par mètre cube d’air suffisent à déclencher une rhinite
      ou une conjonctivite chez les personnes sensibles, et l’exposition peut
      provoquer ou aggraver l’asthme. En Auvergne-Rhône-Alpes, région la plus
      touchée,{' '}
      <ScrollToSourceTag sourceNumero={2}>
        16,1 % des habitants sont allergiques, et 19,3 % dans les zones
        les plus exposées
      </ScrollToSourceTag>
      .
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Dans les cultures d’été, l’ambroisie concurrence les plantes cultivées et
      fait baisser les rendements,{' '}
      <ScrollToSourceTag sourceNumero={3}>
        jusqu’aux deux tiers pour le tournesol et jusqu'à un tiers pour le soja
      </ScrollToSourceTag>
      . Elle colonise aussi les terrains nus ou retournés, dont ceux que gèrent
      les collectivités, comme les bords de route et les chantiers. Ses graines,
      surtout dispersées par le transport de terre et les engins, restent
      viables de nombreuses années dans le sol : plus la plante s’étend,
      plus sa gestion devient difficile et coûteuse. Selon l’Anses, sa
      propagation vers le nord de l’Europe, notamment du fait du changement
      climatique, est une{' '}
      <ScrollToSourceTag sourceNumero={3}>prévision robuste</ScrollToSourceTag>
      . Le Plan National d’Adaptation au Changement Climatique (PNACC-3)
      prévoit, dans sa mesure 16, de lutter contre les espèces porteuses de
      risques pour la santé, dont l’ambroisie, par des méthodes compatibles
      avec la préservation de la biodiversité.
    </Body>
  </>
);

export const InondationDebordementText = () => (
  <div className="pt-10">
    <Body size="sm">
      L’inondation est le{' '}
      <ScrollToSourceTag sourceNumero={1}>
        premier risque naturel en France
      </ScrollToSourceTag>
      , par le nombre de personnes exposées et l’importance des dommages
      qu’elle provoque. La surface, la population et les logements situés dans
      l’emprise potentielle des inondations extrêmes par débordement de cours
      d’eau donnent la mesure de l’impact qu’une telle inondation pourrait
      avoir sur un territoire. En France métropolitaine, cette emprise{' '}
      <ScrollToSourceTag sourceNumero={2}>
        couvre 15,2 % du territoire, mais concentre 26,5 % de la population et
        28,1 % des logements
      </ScrollToSourceTag>
      . Parmi ces logements, les maisons de plain-pied posent un problème
      particulier : elles ne permettent pas de mettre leurs occupants hors
      d’eau en attendant leur évacuation par les secours.
    </Body>
    <Body size="sm">
      Les collectivités disposent de leviers sur les constructions futures
      comme sur les logements existants. Elles peuvent adapter leurs documents
      d’urbanisme et instruire les demandes de construction en tenant compte
      des risques identifiés. En contractualisant avec l’État un programme
      d’actions de prévention des inondations (PAPI), elles permettent aussi
      aux propriétaires des logements exposés de bénéficier de{' '}
      <ScrollToSourceTag sourceNumero={3}>financements de l’État</ScrollToSourceTag>{' '}
      pour diagnostiquer leur vulnérabilité et réaliser des travaux, comme
      l’aménagement d’un espace refuge.
    </Body>
  </div>
);

{
  /* Forêts */
}

// Sources du texte :
// « La forêt rend de nombreux services au territoire » : Feuille de route pour l’adaptation des forêts au changement climatique, décembre 2020, p. 3, https://agriculture.gouv.fr/telecharger/123421 — « La forêt est essentielle pour la société par les multiples services qu’elle rend »
// « elle contribue à réguler le climat local, protège les sols » : IGN, Observatoire des forêts françaises, critère 5 « Fonctions de protection des forêts », introduction, https://observatoire.foret.gouv.fr/indicateurs-gestion-durable/fonctions-de-protection-des-forets — « Elles contribuent à la régulation du climat local, à la protection des sols contre l’érosion »
// « joue un rôle clef dans le cycle de l’eau, abrite une biodiversité riche et stocke du carbone » : PNACC-3, mesure 38, « Contexte », p. 288, https://www.ecologie.gouv.fr/sites/default/files/documents/PNACC3.pdf — « elle constitue un stock important de carbone à renouveler […] elle préserve la biodiversité et les sols, et joue un rôle clef dans le cycle de l’eau »
// « une biodiversité riche » : IGN, Indicateurs de gestion durable des forêts françaises, millésime 2025, livret, juillet 2026, p. 6 du PDF, https://www.ign.fr/files/default/2026-07/260701_IGN_Livret_Forets_VDEF.pdf — « Les forêts françaises sont des écosystèmes complexes, riches en biodiversité. »
// « Elle participe à l’épuration de l’eau autour des captages » : Feuille de route pour l’adaptation des forêts, p. 6 — « la régression du couvert forestier dans des bassins versants ou autour des zones de captage pourrait diminuer la fonction épuratrice de la forêt »
// « en montagne, protège contre […] les glissements de terrain ou les avalanches » : IGN, Observatoire des forêts françaises, indicateur 5.1 « Forêts de protection », https://observatoire.foret.gouv.fr/indicateurs-gestion-durable/5-1-forets-de-protection — « à protéger les biens et les personnes contre les risques naturels (avalanches, érosion, chutes de blocs, glissements de terrain, etc.) »
// « les crues torrentielles » : IGN, critère 5 « Fonctions de protection des forêts » — « diminuer la violence des crues dans les torrents de montagne »
// « Lieu de promenade et de loisirs » : IGN, Observatoire des forêts françaises, indicateur 6.10 « Accès du public aux forêts », https://observatoire.foret.gouv.fr/indicateurs-gestion-durable/6-10-acces-du-public-aux-forets — « Le milieu forestier est en effet un support privilégié pour la pratique d’activités de loisirs dans un cadre naturel : promenade, randonnée pédestre ou équestre »
// « elle contribue aussi à l’attractivité touristique du territoire » : Académie d’agriculture de France, Encyclopédie, fiche 4.07 « Les activités récréatives en forêt : quelle place leur donnent les Français ? », p. 3, https://academie-agriculture.fr/sites/default/files/publications/encyclopedie/4.07.loisirs.v3.amg_.pdf — « les retombées indirectes ou directes de la présence de ces espaces sur l’attractivité du territoire » ; « la visite en forêt peut s’intégrer dans un séjour touristique qui procure des retombées économiques plus directes sur le territoire »
// « Fortes chaleurs, sécheresses, feux et attaques d’insectes comme les scolytes rendent toutefois les forêts plus vulnérables » : PNACC-3, mesure 38, p. 288 — « épisodes de chaleur et de sécheresse très intenses, feux de forêt, dépérissements liés aux agents pathogènes tels que les scolytes sur les épicéas, sont autant de phénomènes qui rendent nos forêts plus vulnérables » ; « insectes » plutôt qu’« agents pathogènes », comme dans ForetsCommunalesText ; le lien [1] renvoie à la source n° 1 de la thématique forêts dans src/lib/sources.ts
// « Le taux de boisement indique la place qu’occupe la forêt sur le territoire, mais pas la façon dont elle s’y répartit » : surface_foret_ha / surface_commune_ha (databases_v2.table_commune) ; IGN, Observatoire des forêts françaises, indicateur 4.7 « Fragmentation des massifs forestiers », https://observatoire.foret.gouv.fr/indicateurs-gestion-durable/4-7--fragmentation-des-massifs-forestiers — « distinguer les régions où sont situées des unités boisées plus fragmentées »
// « la fragmentation des milieux naturels, due notamment aux infrastructures de transport et à l’urbanisation, limite les déplacements des espèces » : SDES, Fragmentation des milieux naturels terrestres : quels constats pour les territoires français ?, 3 juillet 2026, introduction, https://www.statistiques.developpement-durable.gouv.fr/fragmentation-des-milieux-naturels-terrestres-quels-constats-pour-les-territoires-francais — « Le développement des infrastructures de transport et l’urbanisation des territoires créent des séparations entre les différents milieux naturels terrestres : ils entravent la continuité entre les habitats naturels et limitent les déplacements des espèces. Ce phénomène est appelé fragmentation. »
// « et isole leurs populations » : SDES, La fragmentation des milieux naturels terrestres en France – Définitions, cadre conceptuel, méthodologie et résultats détaillés, section « Synthèse », https://www.statistiques.developpement-durable.gouv.fr/la-fragmentation-des-milieux-naturels-terrestres-en-france-definitions-cadre-conceptuel — « En entravant les continuités écologiques, elle limite les déplacements des espèces, perturbe leurs cycles de vie (alimentation, reproduction, dispersion), isole les populations et réduit leur diversité génétique. »
// « alors même que pouvoir se déplacer réduit leur vulnérabilité au changement climatique » : PNACC-3, mesure 43, « Actions déjà engagées », p. 323 — « la fragmentation des habitats qui limite la circulation des espèces dans un contexte de changement climatique. La mesure 20 de la SNB prévoit donc des actions en faveur des trames écologiques, essentielles pour favoriser le déplacement des espèces et réduire leur vulnérabilité au changement climatique »
// « Beaucoup de plantes propres au cœur des forêts se dispersent mal » : GIP Ecofor, Lisières, connectivité, colonisation : la biodiversité dans l’espace et le temps forestiers, synthèse BGF n° 1/3, 2014, p. 3, https://ofme.org/documents/Accueil/2014_GIP-Ecofor_biodiv-espace-temps.pdf — « les espèces de cœur de massif, le plus souvent typiques de forêts anciennes et à faible capacité de dispersion »
// « pour qu’elles colonisent de nouveaux boisements, mieux vaut étendre une forêt existante que créer des boisements séparés » : GIP Ecofor 2014, p. 5 — « Pour favoriser la colonisation des boisements récents par les espèces forestières, à l’échelle paysagère, la recommandation principale reste bien de préférer l’accrétion forestière aux corridors en “pas japonais”, formés de fragments forestiers disjoints » ; le lien [2] renvoie à la source n° 2 de la thématique forêts
// Points de vigilance :
// « fragmentation » et non « morcellement » : en forêt, le morcellement désigne la propriété foncière (IGN, IGD 2025, indicateur 6.1), la fragmentation les massifs (indicateur 4.7).
// Le texte ne dit pas qu’une forêt fragmentée est moins riche en biodiversité : les lisières sont « généralement plus riches en diversité végétale et animale que l’intérieur forestier » (GIP Ecofor 2014, p. 2). Pour les oiseaux forestiers, c’est surtout la surface de forêt alentour qui compte, pas la fragmentation (GIP Ecofor 2014, p. 4 — « il y a d’autant plus d’espèces d’oiseaux forestiers que la surface totale de forêt à proximité est grande »).
// Écarté : la dégradation de l’eau et la hausse des risques en montagne en cas de recul ou de dépérissement de la forêt (Feuille de route, p. 6), retirées pour alléger le texte ; les chiffres nationaux (445 000 ha de forêt dans les périmètres de captage, IGD 5.1 ; carbone stocké, IGD 1.4 ; 55 % de la forêt en massifs de plus de 100 000 ha, IGD 4.7).
export const SurfaceForetText = () => (
  <>
    <Body size="sm">
      La forêt rend de nombreux services au territoire : elle contribue à
      réguler le climat local, protège les sols, joue un rôle clef dans le
      cycle de l’eau, abrite une biodiversité riche et stocke du carbone. Elle
      participe à l’épuration de l’eau autour des captages et, en montagne,
      protège contre les crues torrentielles, les glissements de terrain ou les
      avalanches. Lieu de promenade et de loisirs, elle contribue aussi à
      l’attractivité touristique du territoire. Fortes chaleurs, sécheresses,
      feux et attaques d’insectes comme les scolytes{' '}
      <ScrollToSourceTag sourceNumero={1}>
        rendent toutefois les forêts plus vulnérables
      </ScrollToSourceTag>
      .
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Le taux de boisement indique la place qu’occupe la forêt sur le
      territoire, mais pas la façon dont elle s’y répartit : une même surface
      peut former un massif d’un seul tenant ou des boisements dispersés. Cette
      répartition compte : la fragmentation des milieux naturels, due notamment
      aux infrastructures de transport et à l’urbanisation, limite les
      déplacements des espèces et isole leurs populations, alors même que
      pouvoir se déplacer réduit leur vulnérabilité au changement climatique.
      Beaucoup de plantes propres au cœur des forêts se dispersent mal : pour
      qu’elles colonisent de nouveaux boisements,{' '}
      <ScrollToSourceTag sourceNumero={2}>
        mieux vaut étendre une forêt existante que créer des boisements séparés
      </ScrollToSourceTag>
      .
    </Body>
  </>
);

// Sources du texte :
// « Lors des fortes chaleurs, l’air reste plus frais sous un couvert forestier haut et dense qu’à découvert » : Zellweger et al. 2019, résumé, https://hal.science/hal-02357312 ; Gril et al. 2023, § 3.2, https://hal.science/hal-04556088/document
// « qui atténue les extrêmes de température » : Zellweger et al. 2019, résumé ; Gril et al. 2023, résumé
// « et fait de la forêt un lieu de fraîcheur pour les habitants pendant les canicules » : Gril et al. 2023, résumé
// « un peuplement bas et clairsemé, comme une coupe rase ou une jeune régénération, protège peu et peut même les accentuer » : Gril et al. 2023, discussion et résumé ; le lien [3] renvoie à la source n° 3 de la thématique forêts
// « Ce qui fait la valeur d’une forêt haute la rend aussi plus vulnérable » : transition, sans source propre
// « face aux tempêtes, un peuplement devient d’autant plus instable que ses arbres sont hauts » : Académie d’agriculture de France, fiche 5.02, point v, https://www.academie-agriculture.fr/system/files_force/publications/notes-synthese/fiche502tempetesfinal.pdf?download=1 ; Bonnesoeur et al. 2013, résumé, https://hal.archives-ouvertes.fr/hal-01001037
// « et lors des sécheresses, la mortalité des grands arbres augmente souvent davantage que celle des petits » : Bennett et al. 2015, résumé, https://pubs.usgs.gov/publication/70160726 ; Stovall et al. 2019, résumé, https://pmc.ncbi.nlm.nih.gov/articles/PMC6763443/
// « Une canopée basse peut, elle, signaler une forêt jeune » : Schwartz et al. 2025, § 4.3, https://hal.inrae.fr/hal-05528811/document
// « ou la trace d’une coupe, d’une tempête, d’attaques de ravageurs ou d’un incendie » : Schwartz et al. 2025, § 2.3
// « c’est-à-dire une forêt qui ne protège pas encore, ou plus, de la chaleur » : Gril et al. 2023, résumé, https://hal.science/hal-04556088/document — « 2.7 % was amplified, especially in road verges, clear-cut and regeneration areas » ; § 3.2 (cartographie) — « Areas with low or sparse canopies (2.7 %) even showed the reverse trend, an amplification of temperature »
export const HauteurCanopeeText = () => (
  <>
    <Body size="sm">
      Lors des fortes chaleurs, l’air reste plus frais sous un couvert
      forestier haut et dense qu’à découvert. Son feuillage abondant et étagé
      agit comme un isolant multicouche épais, qui atténue les extrêmes de
      température et fait de la forêt un lieu de fraîcheur pour les habitants
      pendant les canicules. À l’inverse, un peuplement bas et clairsemé, comme
      une coupe rase ou une jeune régénération,{' '}
      <ScrollToSourceTag sourceNumero={3}>
        protège peu et peut même les accentuer
      </ScrollToSourceTag>
      .
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Ce qui fait la valeur d’une forêt haute la rend aussi plus vulnérable :
      face aux tempêtes, un peuplement devient d’autant plus instable que ses
      arbres sont hauts, et lors des sécheresses, la mortalité des grands arbres
      augmente souvent davantage que celle des petits. Une canopée basse peut,
      elle, signaler une forêt jeune ou la trace d’une coupe, d’une tempête,
      d’attaques de ravageurs ou d’un incendie, c’est-à-dire une forêt qui ne
      protège pas encore, ou plus, de la chaleur. La hauteur de la canopée
      éclaire ainsi à la fois ce que la forêt apporte au territoire et ce que
      celui-ci risque de perdre avec elle.
    </Body>
  </>
);

// Sources du texte :
// « La forêt rend de nombreux services au territoire » : SurfaceForetText (même thématique) ; PNACC-3, mesure 38, p. 288, https://www.ecologie.gouv.fr/sites/default/files/documents/PNACC3.pdf — « elle préserve la biodiversité et les sols, et joue un rôle clef dans le cycle de l’eau »
// « le feu y trouve d’autant plus de quoi prendre et se propager qu’elle s’étend et accumule du bois, vivant ou mort » : CGAAER-IGEDD-IGA, Politique de prévention et de lutte contre l’incendie de forêt…, tome 1, février 2023, p. 12, https://agriculture.gouv.fr/telecharger/140348 — « L’extension des surfaces forestières, l’augmentation du volume de bois sur pied, du dépérissement et du bois mort entraînent une augmentation de la masse ligneuse pouvant s’enflammer et propager le feu. »
// « certaines essences, comme le chêne-liège, résistent mieux que d’autres aux incendies » : INRAE, Pour passer à travers les flammes, les arbres ont leur stratégie, 30/07/2013, https://www.inrae.fr/actualites/passer-travers-flammes-arbres-ont-leur-strategie — « le chêne-liège avec son écorce très épaisse […] pour protéger de la chaleur les tissus vivants du tronc » ; CNPF (projet eforOwn), Mesures sylvicoles préventives contre le risque des feux de forêt, 2019, p. 2, https://www.cnpf.fr/sites/socle/files/2024-05/30_Mesures_sylvicoles_preventives_contre_feux_forets.pdf — « Le chêne-liège a recours à une stratégie de résistance. »
// « là où les arbres n’ont pas survécu, il faut parfois plusieurs décennies pour que la forêt se reconstitue » : CGAAER-CGEDD, Changement climatique et extension des zones sensibles aux feux de forêts, juillet 2010, p. 18, https://agriculture.gouv.fr/sites/minagri/files/documents//rapport1796_changements_climatiques_et_feux_de_foret.pdf — « Actuellement 34 ans après, peuplement presque monospécifique de bouleau » ; « progressivement recolonisé après plusieurs décennies par des semis de sapin et épicéa »
// « Le danger vient surtout de feux trop rapprochés » : CRPF PACA, SRGS, fiche 315001, p. 1, https://www.ofme.org/documents/ForetPrivee/srgs/315001.pdf — « C’est donc la fréquence des feux, qui met en danger la pérennité des peuplements forestiers. » ; Sénat, rapport n° 856 (2021-2022), p. 52, https://www.senat.fr/rap/r21-856/r21-8561.pdf — « la nouveauté et la menace résident dans l’accélération de la fréquence des événements »
// « s’ils reviennent aux mêmes endroits avant qu’elle ait pu se régénérer » : INRAE 2013 — « trop fréquents aux mêmes endroits, les feux empêchent les pins de parvenir à maturité sexuelle » ; Sénat n° 856, p. 53 — « une fréquence de feu trop élevée pour permettre aux arbres d’atteindre la maturité sexuelle et se régénérer après un feu »
// « laisser durablement place à une garrigue ou à un maquis » : INRAE 2013 — « Les arbres disparaissent et laissent place durablement à une garrigue ou un maquis. » ; Sénat n° 856, p. 53 — « le stade forestier peut basculer durablement vers des formations ligneuses basses » ; le lien [4] renvoie à la source n° 4 de la thématique forêts dans src/lib/sources.ts
// « et le territoire perd alors pour longtemps les services qu’elle lui rendait » : Feuille de route pour l’adaptation des forêts au changement climatique, décembre 2020, p. 6, https://agriculture.gouv.fr/telecharger/123421 — « Dans les cas extrêmes de perturbations plus intenses ou plus fréquentes (ex. incendies), c’est l’écosystème forestier dans son ensemble qui disparaîtrait brutalement dans certains territoires » ; « la régression du couvert forestier […] pourrait diminuer la fonction épuratrice de la forêt »
// « Ce risque reste concentré en région méditerranéenne, qui totalise 75 % des surfaces incendiées entre 2000 et 2024 » : IGN, Les indicateurs de gestion durable des forêts françaises, millésime 2025, livret, juillet 2026, p. 4 du PDF, https://www.ign.fr/files/default/2026-07/260701_IGN_Livret_Forets_VDEF.pdf — « 15 000 ha incendiés par an » (2000-2024) ; « Dont 75 % en région méditerranéenne » ; le lien [5] renvoie à la source n° 5 de la thématique forêts
// « mais il s’étend vers l’Ouest et le Nord, à des massifs jusqu’ici peu confrontés au feu » : PNACC-3, mesure 7, p. 80 et p. 84 — « extension vers l’Ouest et le Nord » ; « préparer les acteurs des territoires historiquement peu confrontés aux feux de forêts »
// « L’anticiper fait donc partie de l’adaptation de la forêt » : Feuille de route pour l’adaptation des forêts, p. 13, priorité 6 — « Conforter le dispositif DFCI dans les régions actuellement exposées et le développer dans celles qui pourraient le devenir »
// « la gestion forestière peut limiter l’intensité des feux en réduisant la végétation combustible » : CNPF (eforOwn), p. 4 — « seul le combustible peut être modifié afin de réduire le risque de grands incendies de forêt » ; CRFB Nouvelle-Aquitaine, 21/11/2023, p. 5, https://draaf.nouvelle-aquitaine.agriculture.gouv.fr/IMG/pdf/3-itineraires_sylvicoles_cnpf-onf.pdf — « La réduction de la masse de combustible a un effet sur l’intensité du feu (PNUE 2022) »
// « même si elle a peu d’effet face aux incendies les plus extrêmes » : CGAAER-IGEDD-IGA, tome 1, p. 76 — « pour les feux d’intensité faible à moyenne, mais auront peu d’effets pour les feux exceptionnels en condition extrême de chaleur et de sécheresse »
// « reconstituer une forêt plus diversifiée et plus résiliente » : PNACC-3, mesure 38, p. 289-290 — « reconstituer les forêts touchées par des sinistres tels que […] les incendies » ; « un renouvellement forestier diversifié et résilient » ; loi n° 2023-580 du 10 juillet 2023, titre VIII — « Financer la reconstitution de forêts plus résilientes après un incendie » ; le lien [1] renvoie à la source n° 1 de la thématique forêts
// « le nombre de départs de feux et les surfaces parcourues depuis 2006 » : databases_v2.feux_foret (une ligne par départ de feu, surface_parcourue, annee)
// Points de vigilance :
// CRFB 2023 : attribution CNPF-ONF déduite du seul nom de fichier ; la fiche CNPF suffit à justifier la phrase.
// IGN : l’infographie ne précise pas son périmètre (hexagone et Corse ou outre-mer compris) ; le texte ne dit donc pas « en France ».
// Écarté : régénération par graines ou par rejets, cônes des pins, scolytes, hêtre et chênes atlantiques (relèvent d’un futur indicateur sur les essences) ; érosion des sols (déjà dans FeuxForetText, effet sur la fertilité « controversé » selon le SRGS PACA, p. 4) ; forêt puits/source de carbone (« ne doit donc pas être surestimé », Sénat p. 55) ; lien dépérissement-inflammabilité (« pas aussi évident », CGAAER-IGEDD-IGA tome 1, p. 74).
export const FeuxForetForetText = () => (
  <>
    <Body size="sm">
      La forêt rend de nombreux services au territoire, mais elle peut aussi
      brûler, et le feu y trouve d’autant plus de quoi prendre et se propager
      qu’elle s’étend et accumule du bois, vivant ou mort. Les dégâts varient
      d’une forêt à l’autre : certaines essences, comme le chêne-liège,
      résistent mieux que d’autres aux incendies, mais là où les arbres n’ont
      pas survécu, il faut parfois plusieurs décennies pour que la forêt se
      reconstitue. Le danger vient surtout de feux trop rapprochés : s’ils
      reviennent aux mêmes endroits avant qu’elle ait pu se régénérer, elle
      peut{' '}
      <ScrollToSourceTag sourceNumero={4}>
        laisser durablement place à une garrigue ou à un maquis
      </ScrollToSourceTag>
      , et le territoire perd alors pour longtemps les services qu’elle lui
      rendait.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Ce risque reste concentré en région méditerranéenne, qui totalise{' '}
      <ScrollToSourceTag sourceNumero={5}>
        75&nbsp;% des surfaces incendiées entre 2000 et 2024
      </ScrollToSourceTag>
      , mais il s’étend vers l’Ouest et le Nord, à des massifs jusqu’ici peu
      confrontés au feu. L’anticiper fait donc partie de l’adaptation de la
      forêt, avant comme après un incendie. En amont, la gestion forestière
      peut limiter l’intensité des feux en réduisant la végétation
      combustible, même si elle a peu d’effet face aux incendies les plus
      extrêmes ; une fois le feu passé, il s’agit de{' '}
      <ScrollToSourceTag sourceNumero={1}>
        reconstituer une forêt plus diversifiée et plus résiliente
      </ScrollToSourceTag>
      . Pour situer le territoire, le nombre de départs de feux et les
      surfaces parcourues depuis 2006 indiquent à quelle fréquence et sur
      quelle étendue le feu l’a déjà touché.
    </Body>
  </>
);

{
  /* Sylviculture */
}

// Sources du texte :
// « est maître de la gestion de ce patrimoine et en assume les responsabilités » : ONF, Préserver votre forêt avec le régime forestier, https://www.onf.fr/aux-cotes-des-territoires/lonf-et-les-communes-forestieres/+/42::preserver-votre-foret-avec-regime-forestier.html — « La collectivité reste maître de la gestion de son patrimoine et continue à assumer ses responsabilités de propriétaire »
// « même lorsque l’Office national des forêts (ONF) en est le gestionnaire au titre du régime forestier » : FNCOFOR et ONF, Convention FNCOFOR-ONF 2022-2025, décembre 2022, p. 9, https://www.ofme.org/documents/actualite/202212/convention-fncofor-onf-web.pdf — « En application du Régime forestier, le gestionnaire ONF doit au propriétaire la présentation chaque année d’un programme de coupes et travaux »
// « Les recettes de la forêt lui reviennent » : ONF, L’ONF, un partenaire engagé pour la gestion des forêts communales, https://www.onf.fr/aux-cotes-des-territoires/lonf-et-les-communes-forestieres/+/2a::onf-un-partenaire-engage-pour-la-gestion-des-forets-communales.html — « gèrent la commercialisation du bois, dont le produit revient à la commune »
// « pour une grande majorité des forêts des collectivités, la vente des bois en assure l’essentiel » ; « Ces recettes financent les investissements en forêt et procurent un revenu » : Convention FNCOFOR-ONF, p. 12 — « à ce jour, la vente des bois assure, pour une grande majorité de forêts des collectivités, l’essentiel des recettes permettant les investissements en forêt et un revenu pour la collectivité » ; le lien [1] renvoie à la source n° 1 de la thématique sylviculture dans src/lib/sources.ts
// « une part importante des recettes de fonctionnement de nombreuses communes, d’autant plus que celles-ci sont peu peuplées » : CGAAER et IGA, Impact des scolytes sur le budget des communes forestières de l’Est de la France et adaptation au changement climatique, rapport n° 21023, juin 2021, https://agriculture.gouv.fr/impact-des-scolytes-sur-le-budget-des-communes-forestieres-de-lest-de-la-france-et-adaptation-au — « Pour de nombreuses communes, les recettes de ventes de coupes de bois sont régulières et représentent une part importante de leurs recettes de fonctionnement » ; « La dépendance aux recettes forestières est en général d’autant plus grande que les communes ont un faible nombre d’habitants » ; le lien [2] renvoie à la source n° 2 de la thématique sylviculture
// « Les sécheresses répétées, auxquelles s’ajoutent désormais des attaques régulières d’insectes comme les scolytes sur les résineux, provoquent des dépérissements massifs » : Cour des comptes, L’Office national des forêts et le défi de la transition écologique, septembre 2024, p. 9 du PDF, https://www.ccomptes.fr/sites/default/files/2024-09/20240919-ONF-au%20defi-de-la-transition-ecologique.pdf — « d’autant plus qu’ils s’accompagnent désormais d’épisodes réguliers de prolifération d’insectes qui s’attaquent aux arbres (cas des scolytes sur les résineux), conduisant à des phénomènes de dépérissements massifs »
// « 25 000 hectares de forêts des collectivités ont ainsi été détruits entre 2018 et 2021 » : Cour des comptes, p. 9 du PDF — « 25 000 hectares de forêt domaniale et autant de forêt des collectivités ont ainsi été détruits entre 2018 et 2021 » ; le lien [3] renvoie à la source n° 3 de la thématique sylviculture
// « Avec les incendies et les tempêtes, ces crises imposent de reconstituer des peuplements ou d’en anticiper le renouvellement » : Convention FNCOFOR-ONF, p. 10 — « Les crises sanitaires, les aléas naturels (incendies, tempêtes...) et les facteurs abiotiques induits par les effets du changement climatique nécessitent la reconstitution ou un renouvellement anticipé des peuplements forestiers »
// « Le renouvellement des forêts des collectivités est habituellement payé par les communes » : Cour des comptes, p. 89 du PDF — « S’agissant des forêts des collectivités, l’ONF renouvelle habituellement 5 000 ha par an, payés par les communes »
// « La surface de forêt que possède une commune indique ainsi sur quelle étendue elle est directement concernée » : demande de l’équipe, rubrique « Pourquoi cette donnée »
// Définition au survol « régime forestier » (regimeForestier, src/lib/definitions.tsx) : ONF, Préserver votre forêt avec le régime forestier
// Points de vigilance :
// CGAAER : la source écrit « en général d’autant plus grande » ; le texte ne reprend pas « en général ».
// 25 000 ha : toutes collectivités confondues, et non les seules communes.
export const ForetsCommunalesText = () => (
  <>
    <Body size="sm">
      Une commune propriétaire d’une forêt est maître de la gestion de ce
      patrimoine et en assume les responsabilités, même lorsque l’Office
      national des forêts (ONF) en est le gestionnaire au titre du{' '}
      <DefinitionTooltip title={regimeForestier}>
        régime forestier
      </DefinitionTooltip>
      . Les recettes de la forêt lui reviennent : pour une grande majorité des
      forêts des collectivités,{' '}
      <ScrollToSourceTag sourceNumero={1}>
        la vente des bois en assure l’essentiel
      </ScrollToSourceTag>
      . Ces recettes financent les investissements en forêt et procurent un
      revenu qui représente{' '}
      <ScrollToSourceTag sourceNumero={2}>
        une part importante des recettes de fonctionnement de nombreuses
        communes
      </ScrollToSourceTag>
      , d’autant plus que celles-ci sont peu peuplées.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Les sécheresses répétées, auxquelles s’ajoutent désormais des attaques
      régulières d’insectes comme les scolytes sur les résineux, provoquent des
      dépérissements massifs :{' '}
      <ScrollToSourceTag sourceNumero={3}>
        25&nbsp;000 hectares de forêts des collectivités ont ainsi été détruits
        entre 2018 et 2021
      </ScrollToSourceTag>
      . Avec les incendies et les tempêtes, ces crises imposent de reconstituer
      des peuplements ou d’en anticiper le renouvellement. Le renouvellement des
      forêts des collectivités est habituellement payé par les communes. La
      surface de forêt que possède une commune indique ainsi sur quelle étendue
      elle est directement concernée, par ses recettes de bois comme par le
      renouvellement de sa forêt.
    </Body>
  </>
);

// Sources du texte :
// « dépendent directement de la ressource forestière » ; « Une perte de forêt les prive d’une partie de leur matière première » : Feuille de route pour l’adaptation des forêts au changement climatique, décembre 2020, p. 6, https://agriculture.gouv.fr/telecharger/123421 — « cette mortalité d’essences forestières engendre une perte sèche de matière première sur le moyen terme pour la filière bois »
// « et compromet leur approvisionnement » : Feuille de route 2020, p. 6 — « l’afflux de bois, conséquence de ces dépérissements brutaux, désorganise les marchés sur le court terme et hypothèque les approvisionnements des entreprises à plus long terme »
// « avec des conséquences sur l’industrie du bois et sur les emplois qui y sont liés » : PNACC-3, mesure 38 « Assurer la résilience des forêts, des services associés et de l’économie de la filière bois », contexte, https://www.ecologie.gouv.fr/sites/default/files/documents/Fiches_Axe_3_PNACC-3.pdf — « en prévenir les conséquences pour l’aval de la filière et l’industrie du bois »
// « souvent de petite taille » : Insee Première n° 2035, janvier 2025, p. 2, https://www.insee.fr/fr/statistiques/8341258 — sylviculture : « six salariés en moyenne » ; travail du bois : « Seulement 4 500 d’entre eux emploient les 54 400 salariés en ETP du segment »
// « nombreuses à être implantées à proximité des forêts exploitées » : Insee Première n° 2035, p. 2 et 3 — « concentrés dans les départements les plus boisés et où la forêt est exploitée » ; « de nombreux établissements sont localisés à proximité des forêts productives »
// « l’activité liée à une forêt se répartit ainsi entre plusieurs communes voisines » : demande de l’équipe experte — « l’économie se déverse (est dispatchée) sur les communes alentours »
// « cette activité représente donc souvent une part faible » : Insee, Flores 2024 (DS_FLORES_A88_2024), divisions 02 + 16 — part inférieure à 0,38 % pour la moitié des 1 253 EPCI
// « qui ne rend pas forcément compte de son importance » : demande de l’équipe experte — « Des petits chiffres ne sont pas forcément négligeables »
// « les entreprises d’exploitation forestière […] sont des maillons indispensables de la filière » : CGAAER et IGEDD, Valorisation des bois de crise et résilience de la filière forêt-bois : vers une culture du risque, rapport n° 24073, février 2025, p. 42-43, § 4.1.2, https://agriculture.gouv.fr/telecharger/151063 — « Les entreprises d’exploitation forestière sont le maillon primordial pour préserver une capacité de la filière forêt-bois durant les crises » ; « le tissu des ETF, pourtant indispensable à la filière forêt-bois »
// « comme les scieries […], entre la forêt et l’industrie qui transforme son bois » : ministère de l’Agriculture, Entreprises de travaux forestiers : quels profils à l’avenir ?, décembre 2021, p. 25, encart n° 3, https://agriculture.gouv.fr/telecharger/129139 — « Les scieries, un autre maillon indispensable, à l’intersection de l’amont et de l’aval »
// Point de vigilance : la Feuille de route et le PNACC-3 ne parlent pas d’emplois, mais d’« approvisionnements des entreprises » et d’« économie de la filière bois ».
export const EmploisSylvicultureText = () => (
  <>
    <Body size="sm">
      Les entreprises qui exploitent la forêt et transforment son bois
      dépendent directement de la ressource forestière. Une perte de forêt les
      prive d’une partie de leur matière première et compromet leur
      approvisionnement, avec des conséquences sur l’industrie du bois et sur
      les emplois qui y sont liés.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Ces entreprises, souvent de petite taille, sont nombreuses à être
      implantées à proximité des forêts exploitées, sans être nécessairement
      situées dans la commune où se trouve la forêt : l’activité liée à une
      forêt se répartit ainsi entre plusieurs communes voisines. Rapportée à
      l’emploi salarié d’un seul territoire, cette activité représente donc
      souvent une part faible, qui ne rend pas forcément compte de son
      importance : les entreprises d’exploitation forestière comme les scieries
      sont des maillons indispensables de la filière, entre la forêt et
      l’industrie qui transforme son bois.
    </Body>
  </>
);

{
  /* Tourisme */
}

// Sources du texte :
// « Une station de ski vit de la neige, et avec elle une partie de l’économie de son territoire » : Cour des comptes, Les stations de montagne face au changement climatique, février 2024, p. 8, https://www.ccomptes.fr/sites/default/files/2024-02/20240206-Stations-de-montagne-face-au-changement-climatique.pdf — « fragiliser l’équilibre financier des remontées mécaniques et l’économie locale qui en découle pour partie »
// « le réchauffement réduit l’enneigement » : Cour des comptes, p. 8 — « des conséquences plus marquées sur l’enneigement […] Ce constat s’applique tant aux précipitations neigeuses qu’à la neige produite » ; PNACC-3, mesure 35, p. 1, https://www.ecologie.gouv.fr/sites/default/files/documents/Mesure35%20-%20%C3%A9conomie%20-%20tourisme.pdf — « diminution de l’enneigement »
// « rend la production de neige moins efficace à mesure que les températures montent : la neige de culture offre un répit, sans lever cette dépendance » : Cour des comptes, p. 9 — « La production de neige permet de fiabiliser l’enneigement à court terme. Mais, elle ne constitue qu’une protection relative et transitoire […] son efficacité tend à se réduire avec la hausse des températures »
// « Toutes les stations en ressentiront les effets d’ici 2050, mais pas au même degré […] remontées mécaniques » : Cour des comptes, p. 8 — « Inégalement vulnérables en fonction de leur exposition au risque climatique, du poids de l’activité économique et de la surface financière de l’autorité organisatrice, toutes les stations seront plus ou moins touchées à horizon de 2050 » ; p. 16, note 9 — « L’autorité organisatrice est la collectivité territoriale compétente pour organiser le service public »
// « La taille de la station, établie d’après la capacité de ses remontées mécaniques et étroitement liée à l’offre d’hébergement touristique » : Cour des comptes, p. 20 — « sur la base de la capacité de leurs remontées mécaniques, calculée par l’intensité du moment de puissance » ; p. 31, note 35 — « Le coefficient de corrélation entre l’offre d’hébergement et le moment puissance pour les 217 stations testées est de 0,83 »
// « Un parc récent traduit une station qui renouvelle ses appareils, voire étend son domaine ; un parc ancien annonce des remplacements prochains, à moins que la station n’ait cessé de renouveler son parc » : INRAE (LESSEM), courriel du 06/11/2026 — « Age jeune (0-20) : récente ou en constante évolution, ou en agrandissement » ; « Age ancien (30-40) : peu ou plus de renouvellement, ni d’ajout »
// « chaque remplacement engage la collectivité sur une quinzaine d’années, le temps de l’amortir : décidé sans tenir compte de l’enneigement attendu sur cette période, il risque de lui laisser la charge d’un équipement non amorti » : Cour des comptes, p. 52 — « la plupart des équipements de remontées mécaniques doivent être amortis sur des durées évaluées à 15 ans en moyenne par la Cour […] Il est donc essentiel que les collectivités n’engagent aujourd’hui que les investissements compatibles avec les perspectives du changement climatique. […] À défaut, les investissements non amortis constitueront une charge future pour la collectivité » ; le lien [1] renvoie à la source n° 1 de la thématique tourisme dans src/lib/sources.ts
export const StationsSkiText = () => (
  <>
    <Body size="sm">
      Une station de ski vit de la neige, et avec elle une partie de
      l’économie de son territoire. Or le réchauffement réduit l’enneigement
      et rend la production de neige moins efficace à mesure que les
      températures montent : la neige de culture offre un répit, sans lever
      cette dépendance. Toutes les stations en ressentiront les effets d’ici
      2050, mais pas au même degré : cela dépendra de leur exposition, du
      poids du ski dans l’économie locale et des moyens de la collectivité qui
      organise l’exploitation des remontées mécaniques.
    </Body>
    <Body size="sm" style={{ marginTop: '1rem' }}>
      Pour un territoire, tout l’enjeu est donc de savoir jusqu’où son
      économie dépend du ski, et à quelle échéance il devra décider de
      réinvestir, ou non, dans ses remontées. La taille de la station, établie
      d’après la capacité de ses remontées mécaniques et étroitement liée à
      l’offre d’hébergement touristique, donne la mesure de cette dépendance ;
      l’âge de son parc en situe l’échéance. Un parc récent traduit une
      station qui renouvelle ses appareils, voire étend son domaine ; un parc
      ancien annonce des remplacements prochains, à moins que la station n’ait
      cessé de renouveler son parc. Or chaque remplacement engage la
      collectivité sur une quinzaine d’années, le temps de l’amortir :{' '}
      <ScrollToSourceTag sourceNumero={1}>
        décidé sans tenir compte de l’enneigement attendu sur cette période, il
        risque de lui laisser la charge d’un équipement non amorti
      </ScrollToSourceTag>
      .
    </Body>
  </>
);
