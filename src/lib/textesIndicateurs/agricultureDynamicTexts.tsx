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
