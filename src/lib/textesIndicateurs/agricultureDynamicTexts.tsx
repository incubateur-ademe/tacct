import { Body } from "@/design-system/base/Textes";
import { TableCommuneModel } from "../postgres/models";
import { Round } from "../utils/reusableFunctions/round";

export const PartExploitationSeniorsDynamicText = ({
  partOver55,
  type,
}: {
  partOver55: TableCommuneModel[];
  type: string;
}) => {
  const nombreSecretStatistique = partOver55.filter(tc => tc.agriculture_part_over_55 === "NaN" && tc.otex_12_postes !== "Sans exploitation").length;
  const communeSansExploitation = type === "commune" ? partOver55[0]?.otex_12_postes === "Sans exploitation" : false;
  const meanPartOver55 = type === "commune"
    ? Number(partOver55[0]?.agriculture_part_over_55)
    : partOver55.filter(
      tc => tc.agriculture_part_over_55 !== "NaN"
    ).reduce(
      (acc, curr) => acc + Number(curr.agriculture_part_over_55 || 0), 0
    ) / partOver55.length;

  return (
    <>
      {
        partOver55.length ? (
          <>
            {
              type === "commune" ? (
                communeSansExploitation ?
                  <Body weight="bold" style={{ color: "var(--gris-dark)", paddingBottom: '1rem' }}>
                    D’après le recensement agricole de 2020, aucun chef d’exploitation n’a été identifié sur votre territoire.
                    Cette absence peut refléter une limite du recensement ou une réalité locale spécifique.
                  </Body>
                  : isNaN(meanPartOver55) ?
                    <Body weight="bold" style={{ color: "var(--gris-dark)", paddingBottom: '1rem' }}>
                      Cette donnée est sous secret statistique. Cette règle s'applique aux statistiques agrégées si elles
                      rendent possible la déduction d'informations individuelles.
                    </Body>
                    : <Body weight="bold" style={{ color: "var(--gris-dark)", paddingBottom: '1rem' }}>
                      En 2020, {Round(meanPartOver55, 1)} % des exploitations de votre commune étaient dirigées par des agriculteurs
                      de plus de 55 ans – un enjeu clé pour l’avenir.
                    </Body>
              ) : type === "departement" ? (
                <Body weight="bold" style={{ color: "var(--gris-dark)" }}>
                  En 2020, {Round(meanPartOver55, 1)} % des exploitations de votre département étaient dirigées par des agriculteurs
                  de plus de 55 ans – un enjeu clé pour l’avenir.
                </Body>
              ) : (
                <>
                  <Body weight="bold" style={{ color: "var(--gris-dark)" }}>
                    En 2020, votre territoire comptait en moyenne {Round(meanPartOver55, 1)} % de chefs d’exploitation de plus de 55 ans.
                  </Body>
                  {nombreSecretStatistique > 0 && (
                    <Body size="sm" style={{ marginTop: "-0.5rem" }}>
                      <br></br>À noter : {nombreSecretStatistique} donnée(s) communale(s), soumises au secret
                      statistique, ne sont pas incluses dans ce calcul.
                    </Body>
                  )}
                </>
              )
            }
          </>
        ) : <Body weight='bold' style={{ color: "var(--gris-dark)" }}>Il n’y a pas de données référencées sur le territoire que vous avez sélectionné</Body>
      }
    </>
  );
}

// Sources du texte :
// « un atout pour votre démarche d’adaptation » : Haut Conseil pour le climat, Accélérer la transition climatique avec un système alimentaire bas carbone, résilient et juste, recommandations, janvier 2024, p. 6, https://www.hautconseilclimat.fr/wp-content/uploads/2024/01/2024_HCC_Alimentation_Agriculture-Recommandations.pdf — « Renforcer le rôle des projets alimentaires territoriaux comme vecteurs de la transition bas carbone et de l'adaptation au changement climatique des territoires »
// « repose sur un diagnostic partagé de l’agriculture et de l’alimentation locales » : Code rural et de la pêche maritime, article L111-2-2, avant-dernier alinéa, https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043978779 — « Ils s'appuient sur un diagnostic partagé de l'agriculture et de l'alimentation sur le territoire »
// « une base pour analyser la sensibilité de votre système alimentaire au changement climatique » : DGAL, document préparatoire à la reconnaissance de niveau 2, version 4 du 10/06/2025, p. 11, https://draaf.bretagne.agriculture.gouv.fr/IMG/pdf/notice_de_reconnaissance_n2.pdf — « Données relatives à l'environnement (y compris biodiversité et climat) »
// « les acteurs avec qui construire les réponses : agriculteurs, collectivités, associations » : Code rural et de la pêche maritime, article L111-2-2, deuxième alinéa — « A l'initiative de l'Etat et de ses établissements publics, des collectivités territoriales, des associations, des groupements d'intérêt économique et environnemental définis à l'article L. 315-1, des agriculteurs et d'autres acteurs du territoire »
// « le Plan National d’Adaptation au Changement Climatique (PNACC-3) prévoit justement d’y renforcer l’intégration de ces enjeux » : PNACC-3, mesure 37, action 14, p. 279, https://www.ecologie.gouv.fr/sites/default/files/documents/PNACC3.pdf — « Renforcer l'intégration des enjeux d'adaptation dans les Projets alimentaires Territoriaux (PAT) »
// « appelés à coopérer entre eux » : DGAL, Reconnaissance officielle des PAT, p. 6, https://agriculture.gouv.fr/telecharger/125564 — « Coopération inter-PAT » ; DGAL, document préparatoire à la reconnaissance de niveau 2, p. 10 — « Le PAT s'inscrit en bonne coopération avec les PAT supra, infra et/ou voisins »
// « la reconnaissance de niveau 1 du ministère de l’Agriculture accompagne les projets en construction » : ministère de l'Agriculture, Projets alimentaires territoriaux reconnus par le ministère, https://agriculture.gouv.fr/projets-alimentaires-territoriaux-reconnus-par-le-ministere — « Le niveau 1 permet d'identifier et d'accompagner les PAT émergents dans leur construction. »
// « une démarche alimentaire locale qui ne figure pas dans ce recensement » : France PAT, Vademecum de l'Observatoire, juin 2025, https://france-pat.fr/app/uploads/2025/06/France-PAT_Vademecum_Observatoire.pdf — « Cet Observatoire, depuis 2024 et le passage à France PAT, recense uniquement les PAT reconnus par le Ministère » ; CGAAER, rapport Marchand-Chabanet « Plus vite, plus haut, plus fort », juillet 2022, p. 14, https://www.pat-cvl.fr/wp-content/uploads/2022/09/rapport-Marchand.pdf — « projets agricoles et alimentaires communaux (non labellisés) »
// Nom et nombre des PAT, « ne couvre(nt) toutefois pas toutes les communes », « Leurs périmètres se superposent », « Certaines communes relèvent de plusieurs PAT » : colonne projets_alimentaires_territoriaux de databases_v2.table_commune, issue du fichier France PAT pats-20250710 (colonne communes_code_insee), https://www.data.gouv.fr/datasets/pat-projets-alimentaires-territoriaux-description
export const ProjetsAlimentairesTerritoriauxDynamicText = ({
  pats,
  toutesCommunesCouvertes,
  superposition,
  type
}: {
  pats: string[];
  toutesCommunesCouvertes: boolean;
  superposition: boolean;
  type: string;
}) => {
  if (pats.length === 0) {
    return (
      <Body weight="bold" style={{ color: "var(--gris-dark)" }}>
        Aucun projet alimentaire territorial (PAT) n’est recensé sur{' '}
        {type === 'commune' ? 'votre commune' : 'votre territoire'}. Votre
        démarche d’adaptation ne peut donc pas s’appuyer sur ce levier, qui
        apporte un diagnostic partagé de l’agriculture et de l’alimentation
        locales et réunit les acteurs avec qui construire les réponses. Lancer
        un PAT reste possible : la reconnaissance de niveau 1 du ministère de
        l’Agriculture accompagne les projets en construction. Il peut aussi
        exister une démarche alimentaire locale qui ne figure pas dans ce
        recensement.
      </Body>
    );
  }
  const pluriel = pats.length > 1;
  const debut = pluriel
    ? type === 'commune'
      ? 'Votre commune fait partie de plusieurs projets alimentaires territoriaux (PAT)'
      : `Votre territoire fait partie de ${pats.length} projets alimentaires territoriaux (PAT)`
    : `Votre ${type === 'commune' ? 'commune' : 'territoire'} fait partie d’un projet alimentaire territorial (PAT), « ${pats[0]} »`;
  const couverturePartielle = type !== 'commune' && !toutesCommunesCouvertes
    ? pluriel
      ? ' Ces PAT ne couvrent toutefois pas toutes les communes de votre territoire.'
      : ' Ce PAT ne couvre toutefois pas toutes les communes de votre territoire.'
    : '';
  const cooperation = type === 'commune'
    ? pluriel
      ? ' Leurs périmètres se superposent : ces PAT sont appelés à coopérer entre eux.'
      : ''
    : superposition
      ? ' Certaines communes relèvent de plusieurs PAT, appelés à coopérer entre eux.'
      : '';

  return (
    <>
      <Body weight="bold" style={{ color: "var(--gris-dark)" }}>
        {debut} : un atout pour votre démarche d’adaptation.{' '}
        {pluriel ? 'Ces projets reposent' : 'Ce projet repose'} sur un
        diagnostic partagé de l’agriculture et de l’alimentation locales : une
        base pour analyser la sensibilité de votre système alimentaire au
        changement climatique. {pluriel ? 'Ils réunissent' : 'Il réunit'} aussi
        les acteurs avec qui construire les réponses : agriculteurs,
        collectivités, associations…{' '}
        {pluriel ? 'Leurs plans d’actions peuvent' : 'Son plan d’actions peut'}{' '}
        enfin accueillir vos actions d’adaptation : le Plan National
        d’Adaptation au Changement Climatique (PNACC-3) prévoit justement d’y
        renforcer l’intégration de ces enjeux.
        {couverturePartielle}
        {cooperation}
      </Body>
      {pluriel && (
        <Body htmlTag="div" weight="bold" style={{ color: "var(--gris-dark)" }}>
          <br></br>Voici la liste des PAT présents sur votre territoire :
          <ul style={{ margin: "0.5rem 0 0 1.5rem" }}>
            {pats.map((pat) => (
              <li key={pat}>{pat}</li>
            ))}
          </ul>
        </Body>
      )}
    </>
  );
};

// Sources du texte :
// « Sur 2020-2024 » : SDES, La pollution de l'air par l'ozone (O₃), mise à jour du 30 juin 2026, https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « Pour la protection de la végétation, la réglementation fixe une norme en moyenne sur cinq ans. Sur la période 2020-2024 […] » ; titre de la carte INERIS — « AOT 40 (moyenne sur 5 ans) de O3 pour l'année 2024 »
// « l’exposition moyenne des cultures à l’ozone (AOT40) » : AEE, indicateur Exposure of Europe’s ecosystems to ozone, publié le 11/06/2026, section Methodology, https://www.eea.europa.eu/en/analysis/indicators/exposure-of-europes-ecosystems-to-ozone — « The period is from May to July for the protection of vegetation and crops. »
// « atteint {moyenne} […] jusqu’à {max} » : moyenne et maximum de la propriété valeur des tuiles aot40, relevée tous les 1 km à l’intérieur du territoire, calculés par valeursSurTerritoire dans src/components/maps/valeursSurTerritoire.ts
// « objectif à long terme de 6 000 µg/m³.h » : directive (UE) 2024/2881, annexe I, section 2 C — « Objectifs à long terme pour l'ozone (O3) devant être atteints au plus tard le 1er janvier 2050 […] Protection de la végétation […] 6 000 μg/m3 × h »
// « aligné sur le niveau de protection des cultures » : AEE, même indicateur — « The long-term objective is in line with the critical level of ozone for the protection of crops defined by the United Nations Economic Commission for Europe (UNECE) Convention on Long-range Transboundary Air Pollution »
// « valeur cible européenne de 18 000 µg/m³.h » : directive (UE) 2024/2881, annexe I, section 2 B — « 18 000 μg/m3 × h, moyenne calculée sur cinq ans »
// « France métropolitaine » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « sur l'ensemble du territoire métropolitain et la Corse »
// « Il n’y a pas de données référencées […] » : formule standard du site, reprise de AOT40DynamicText
// Points de vigilance :
// L’objectif à long terme se calcule par année (Airparif, Ozone, état des connaissances en Île-de-France, juillet 2022, p. 14 du PDF, https://www.airparif.fr/sites/default/files/pdf/Note_O3.pdf — « Objectif à long terme : 6 000 µg/m3.h-1 en moyenne sur une année »), alors que la donnée est une moyenne 2020-2024 : si cette moyenne dépasse 6 000, au moins une année l’a dépassé, d’où la formulation « dépasse ».
// La moyenne porte sur tout le territoire (forêts et zones bâties comprises), alors que l’AEE ne retient que les surfaces agricoles : AEE, Exposure of agricultural areas to ozone in EEA member countries, https://www.eea.europa.eu/en/analysis/maps-and-charts/exposure-agricultural-areas-ozone/ — « The figure shows the percentage of agricultural areas in the EEA-32 countries exposed to ozone, expressed as AOT40. »
// Piste non retenue pour l’instant (solution 2) : ajouter « Selon l’étude APollO, le blé tendre et les prairies sont, parmi les productions étudiées, les plus touchées par l’ozone en France. Sur votre territoire, les céréales et les surfaces toujours en herbe couvrent Z % de la surface agricole utile. » — APollO, synthèse, mai 2019, p. 17 du PDF, https://librairie.ademe.fr/air/327-cout-economique-pour-l-agriculture-des-impacts-de-la-pollution-de-l-air-par-l-ozone.html — « les pertes les plus importantes (quantifiées sur la base des prix de vente des produits) ont été estimées pour le blé tendre et pour les prairies en France » ; données : superficie_sau_terres_arables_cereales et superficie_sau_herbe (recensement agricole 2020, échelle EPCI). Limites : les céréales incluent aussi le maïs et l’orge, moins sensibles ; donnée intercommunale uniquement ; secret statistique.
export const AOT40AgricultureDynamicText = ({
  valeurs,
  isOutreMer,
  type
}: {
  valeurs: { moyenne: number; max: number } | null | undefined;
  isOutreMer: boolean;
  type: string;
}) => {
  if (isOutreMer) {
    return (
      <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
        Cette donnée n’est disponible que pour la France
        métropolitaine.
      </Body>
    );
  }
  if (valeurs === undefined) return null;
  if (valeurs === null) {
    return (
      <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  const lieu = type === 'commune' ? 'votre commune' : 'votre territoire';
  const moyenne = Math.round(valeurs.moyenne);
  const max = Math.round(valeurs.max);
  const comparaisonObjectif = max <= 6000
    ? `${max > moyenne ? 'Ces valeurs restent' : 'Cette valeur reste'} sous l’objectif à long terme de 6 000 µg/m³.h, aligné sur le niveau de protection des cultures.`
    : moyenne <= 6000
      ? 'L’objectif à long terme de 6 000 µg/m³.h, aligné sur le niveau de protection des cultures, est dépassé dans le secteur le plus exposé.'
      : 'Ce niveau dépasse l’objectif à long terme de 6 000 µg/m³.h, aligné sur le niveau de protection des cultures.';
  const comparaisonValeurCible = max <= 18000
    ? ''
    : moyenne <= 18000
      ? ' La valeur cible européenne de 18 000 µg/m³.h est également dépassée dans le secteur le plus exposé.'
      : ` La valeur cible européenne de 18 000 µg/m³.h est également dépassée en moyenne sur ${lieu}.`;
  return (
    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
      Sur 2020-2024, l’exposition moyenne des cultures à l’ozone (AOT40)
      atteint {Round(moyenne, 0)} µg/m³.h sur {lieu}
      {max > moyenne ? (
        <>
          , et jusqu’à {Round(max, 0)} µg/m³.h dans son secteur le plus
          exposé
        </>
      ) : null}
      .{' '}
      {comparaisonObjectif}
      {comparaisonValeurCible}
    </Body>
  );
};
