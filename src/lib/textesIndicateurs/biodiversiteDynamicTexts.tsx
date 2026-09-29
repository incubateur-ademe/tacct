import { Body } from '@/design-system/base/Textes';
import { SurfacesAgricolesModel, TableCommuneModel } from '../postgres/models';
import { Round } from '../utils/reusableFunctions/round';

{
  /* Biodiversité */
}
export const SolsImpermeabilisesBiodiversiteDynamicText = ({
  sumNaf,
  atlasBiodiversite,
  type
}: {
  sumNaf: number;
  atlasBiodiversite: TableCommuneModel[];
  type: string;
}) => {
  return (
    <>
      {atlasBiodiversite.length === 0 ? (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Entre 2011 et 2025, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
          naturels, agricoles ou forestiers ont été consommés sur votre
          territoire.
        </Body>
      ) : atlasBiodiversite.length > 0 && type !== 'commune' ? (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Entre 2011 et 2025, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
          naturels, agricoles ou forestiers ont été consommés sur votre
          territoire. Face à ce constat, les Atlas de la biodiversité communale
          (ABC) apportent un outil précieux : {atlasBiodiversite.length}{' '}
          communes disposent (ou disposeront sous peu) d'un inventaire
          cartographié de leur faune, flore et habitats. Cet outil d'aide à la
          décision leur permet d'intégrer concrètement la biodiversité dans
          leurs politiques d'aménagement et constitue un levier privilégié pour
          limiter l'artificialisation des sols.
        </Body>
      ) : atlasBiodiversite.length > 0 && type === 'commune' ? (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Entre 2011 et 2025, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
          naturels, agricoles ou forestiers ont été consommés sur votre commune.
          Face à cet enjeu, l'Atlas de la biodiversité communale lancé en{' '}
          {atlasBiodiversite[0].atlas_biodiversite_annee_debut}{' '}
          {atlasBiodiversite[0].atlas_biodiversite_avancement === 'Fini'
            ? 'apporte'
            : 'apportera'}{' '}
          une réponse concrète : un inventaire cartographié détaillé de la
          faune, la flore et des habitats qui vous{' '}
          {atlasBiodiversite[0].atlas_biodiversite_avancement === 'Fini'
            ? 'permet'
            : 'permettra'}{' '}
          d'intégrer concrètement la biodiversité dans votre politique
          d'aménagement et{' '}
          {atlasBiodiversite[0].atlas_biodiversite_avancement === 'Fini'
            ? 'constitue'
            : 'constituera'}{' '}
          un levier privilégié pour limiter l'artificialisation des sols.
        </Body>
      ) : (
        ''
      )}
    </>
  );
};

export const SurfacesEnHerbeDynamicText = ({
  surfacesAgricoles,
  pourcentageSurfacesToujoursEnHerbe,
  type,
  territoiresPartiellementCouverts
}: {
  surfacesAgricoles: SurfacesAgricolesModel[];
  pourcentageSurfacesToujoursEnHerbe: number;
  type: string;
  territoiresPartiellementCouverts: string[] | undefined;
}) => {
  return (
    <>
      {surfacesAgricoles.length ? (
        <>
          {type === 'commune' ? (
            <Body
              weight="bold"
              style={{ color: 'var(--gris-dark)', paddingBottom: '1rem' }}
            >
              Bien que cette donnée ne soit disponible qu'à l'échelle
              intercommunale, elle reste révélatrice : avec{' '}
              {Round(pourcentageSurfacesToujoursEnHerbe, 1)} % de surfaces
              toujours en herbe, votre EPCI dispose d'un indicateur clé de
              l'état de sa biodiversité : plus cette part est élevée, plus les
              écosystèmes sont préservés.
            </Body>
          ) : type === 'ept' ? (
            <Body
              weight="bold"
              style={{ color: 'var(--gris-dark)', paddingBottom: '1rem' }}
            >
              Bien que cette donnée n’existe qu’à l’échelle de la Métropole du
              Grand Paris, dont dépend votre EPT, elle reste révélatrice : avec{' '}
              {Round(pourcentageSurfacesToujoursEnHerbe, 1)}&nbsp;% de surfaces
              toujours en herbe, la Métropole dispose d’un indicateur clé de
              l’état de sa biodiversité : plus cette part est élevée, plus les
              écosystèmes sont préservés.
            </Body>
          ) : (
            <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
              Avec {Round(pourcentageSurfacesToujoursEnHerbe, 1)} % de surfaces
              toujours en herbe, votre territoire dispose d'un indicateur clé de
              l'état de sa biodiversité : plus cette part est élevée, plus les
              écosystèmes sont préservés.
            </Body>
          )}
          {territoiresPartiellementCouverts &&
            (type === 'departement' || type === 'pnr') && (
              <>
                <Body htmlTag="div" style={{ color: 'var(--gris-dark)' }}>
                  <br></br>
                  <b>À noter</b> : Ces données ne sont disponibles qu’à
                  l’échelle intercommunale. Ces{' '}
                  {territoiresPartiellementCouverts?.length} EPCI débordent de
                  votre périmètre :
                  <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                    {territoiresPartiellementCouverts?.map((epci, index) => (
                      <li key={index}>
                        <Body style={{ color: 'var(--gris-dark)' }}>
                          {epci}
                        </Body>
                      </li>
                    ))}
                  </ul>
                </Body>
              </>
            )}
        </>
      ) : (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Il n’y a pas de données référencées sur le territoire que vous avez
          sélectionné
        </Body>
      )}
    </>
  );
};

export const EtatCoursDeauDynamicText = () => {
  return (
    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
      La carte ci-contre illustre l’état écologique des cours d’eau de votre
      territoire. Elle intègre aussi la qualité des sites de baignade dont les
      usages récréatifs (baignade, kayak, etc.) affectent les écosystèmes
      aquatiques.
    </Body>
  );
};

// Sources du texte :
// « Sur 2020-2024 » : SDES, La pollution de l'air par l'ozone (O₃), mise à jour du 30 juin 2026, https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « Pour la protection de la végétation, la réglementation fixe une norme en moyenne sur cinq ans. Sur la période 2020-2024 […] »
// « l'exposition moyenne de la végétation à l'ozone (AOT40) » : INERIS, Quelques enseignements sur l'évolution de la qualité de l'air de 2000 à 2019, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/20-ans-evolution-qualite-air-0 — « Les indicateurs d'exposition des écosystèmes (AOT40) »
// « atteint {moyenne} […] jusqu'à {max} » : moyenne et maximum de la propriété valeur des tuiles aot40, relevée tous les 1 km à l'intérieur du territoire, calculés par valeursSurTerritoire dans src/components/maps/mapTilesAOT40.tsx
// « valeur cible européenne de 18 000 µg/m³ × h » : directive (UE) 2024/2881, annexe I, section 2 B — « 18 000 μg/m3 × h, moyenne calculée sur cinq ans »
// « France métropolitaine » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « sur l'ensemble du territoire métropolitain et la Corse »
// « Il n'y a pas de données référencées […] » : formule standard du site, reprise de SurfacesEnHerbeDynamicText
export const AOT40DynamicText = ({
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
  return (
    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
      Sur 2020-2024, l’exposition moyenne de la végétation à l’ozone (AOT40)
      atteint {Round(moyenne, 0)} µg/m³.h sur {lieu}
      {max > moyenne ? (
        <>
          , et jusqu’à {Round(max, 0)} µg/m³.h dans son secteur le plus
          exposé
        </>
      ) : null}
      .{' '}
      {max <= 18000
        ? `${max > moyenne ? 'Ces valeurs restent' : 'Cette valeur reste'} en deçà de la valeur cible européenne de 18 000 µg/m³.h.`
        : moyenne <= 18000
          ? 'La valeur cible européenne de 18 000 µg/m³.h est dépassée dans le secteur le plus exposé.'
          : `La valeur cible européenne de 18 000 µg/m³.h est dépassée en moyenne sur ${lieu}.`}
    </Body>
  );
};

export const O3DynamicText = () => {
  return (
    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
      Au niveau européen, la valeur cible pour la protection de la santé humaine 
      est fixé à un maximum journalier de la moyenne sur 8 h de 120 µg/m3, à ne 
      pas dépasser plus de <b>25 jours par an</b> (en moyenne sur 3 ans).
    </Body>
  )
};
