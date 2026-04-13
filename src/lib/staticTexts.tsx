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

export const FragiliteEconomiqueText = () => (
  <div className="px-4">
    <p>
      Les ménages en précarité énergétique doivent faire des choix difficiles :
      limiter le chauffage, réduire l’utilisation de l’eau chaude pour éviter
      des factures trop élevées. Un logement mal isolé l’hiver sera aussi
      coûteux à rafraîchir l’été.
    </p>
    <p>
      Leurs conditions de vie et leur santé se dégradent. Le changement
      climatique amplifie ces inégalités, avec des vagues de chaleur de plus en
      plus fréquentes et intenses. Dans un logement mal isolé, se protéger de la
      chaleur est un défi impossible pour les ménages les plus précaires. La
      précarité énergétique n'est pas qu’une question de confort : elle est un
      enjeu de santé publique et de justice sociale.
    </p>
    <p>
      ⇒ En 2024, <b>55 %</b> des Français déclarent avoir souffert d’un excès de
      chaleur en été.
    </p>
    <p>
      ⇒ <b>79 %</b> des Français ont dû restreindre leur chauffage.
    </p>
    <p>
      ⇒ En 2023, plus d’un million de ménages ont subi une intervention de leur
      fournisseur d’énergie pour cause d'impayés, aggravant leur précarité.
    </p>
    <p>
      - - - - <br></br>
      Plan national d'adaptation au changement climatique (PNACC 3) :
    </p>
    <ul>
      <p>
        <li>Adapter les logements au risque de forte chaleur (mesure 9)</li>
        <li>
          Protéger les populations précaires des fortes chaleurs (mesure 14)
        </li>
      </p>
    </ul>
  </div>
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

export const AOT40Text = () => (
  <>
    <Body size="sm">
      La pollution figure parmi les cinq principales pressions à l’origine de
      l’effondrement de la biodiversité. Portée par le vent, la pollution à
      l’ozone ne s'arrête pas aux frontières des agglomérations. La dispersion
      peut s’étendre sur plusieurs centaines de kilomètres. Même les territoires
      éloignés des sources de pollution en subissent les effets.
    </Body>
  </>
);

export const PrelevementEauText = () => (
  <div className="pt-10">
    <Body size="sm">
      Les sécheresses 2022 et 2023 sonnent l'alerte : optimiser la ressource en
      eau disponible devient vital. Face à l'intensification des sécheresses due
      au changement climatique, chaque territoire doit anticiper. Un prélèvement
      n'est possible que si la ressource existe !
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
    <Body size="sm">
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
      Plan National d’Adaptation au Changement Climatique (PNACC 3) :<br></br>La
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
    <Body size="sm">
      Impacts locaux sur les milieux :
      <ul style={{ marginLeft: '1rem' }}>
        <li>Augmentation des intrusions salines des aquifères côtiers,</li>
        <li>Modification des paysages (nouvelles lagunes…),</li>
        <li>Appauvrissement des sols dû à la salinisation.</li>
      </ul>
    </Body>
    <Body size="sm">
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
      Plan National d'Adaptation au Changement Climatique (PNACC 3) : La mesure
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
      le retrait gonflement des argiles (RGA) impacte désormais tout le
      territoire métropolitain à l’exception de la Bretagne et de la Normandie.
      Il touche surtout les maisons individuelles anciennes. Mais les routes,
      les écoles, les canalisations ou les équipements municipaux peuvent aussi
      être affectés, mettant en jeu la sécurité et l’attractivité du territoire.
    </Body>
    <Body size="sm">
      Si le phénomène est incontestablement amplifié par le changement
      climatique, la qualité des constructions est aussi en cause. La fréquence
      des sinistres RGA des maisons construites après 1975 est cinq fois
      supérieure à celle des maisons construites avant 1975, alors même que ces
      dernières ont subi davantage de cycles de RGA. Multifactoriel, le RGA est
      donc un sujet complexe qui nécessite une approche combinée sols, bâtiment,
      urbanisme…
    </Body>
    <Body size="sm">
      Il y a urgence à mieux prendre en compte le RGA dans les politiques
      d’aménagement car son coût explose : de 400 millions d’euros par an
      (1989-2015) à 1 milliard d’euros par an (2016-2020), pour atteindre en
      2022 un record à 3,5 milliards d’euros. Il représente 52 % du total des
      indemnisations versées au titre du régime des catastrophes naturelles sur
      les dix dernières années, devenant non seulement le péril naturel le plus
      coûteux devant les inondations mais mettant en péril l’équilibre même du
      régime CatNat. Il est temps de sortir d’une logique « dommages ⇒
      indemnisations » alors qu’il existe un certain nombre d’actions de
      prévention qui pourraient éviter ou réduire l’apparition de dommages.
    </Body>
    <Body size="sm">
      ⇒ En France métropolitaine, 48 % du territoire est exposé à un risque RGA
      moyen ou fort. Cela représente 10,4 millions de logements (près de la
      moitié du parc de logements) et 20 millions de Français.
    </Body>
    <Body size="sm">
      ⇒ En 2022, le nombre de maisons individuelles touchées par le RGA a été
      deux fois supérieur au nombre de maisons individuelles construites en
      2024.
    </Body>
    <Body size="sm">
      - - - - Plan national d’adaptation au changement climatique (PNACC 3) :
      <li>
        Protéger la population des désordres sur les bâtiments liés au
        retrait-gonflement des argiles (mesure 5)
      </li>
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
      Ces données, fournies par le CEREMA, couvrent 88 aires urbaines en France
      métropolitaine. Sur les 12 000 communes étudiées, plus de 5 millions
      d’habitants vivent dans des quartiers très sensibles aux fortes chaleurs.
    </Body>

    <Body style={{ marginTop: '1rem', color: 'var(--gris-dark)' }}>
      Rendez-vous sur le site du{' '}
      <a
        href="https://doc.cerema.fr/Default/doc/SYRACUSE/600739/cartographie-nationale-de-donnees-de-zones-climatiques-locales-guide-utilisateurs"
        target="_blank"
        rel="noreferrer"
      >
        Cerema
      </a>{' '}
      pour en savoir plus sur leur méthodologie.
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
