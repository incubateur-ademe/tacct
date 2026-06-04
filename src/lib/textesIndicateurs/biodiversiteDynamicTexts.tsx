import { Body } from '@/design-system/base/Textes';
import { Feature, MultiPoint, Point } from 'geojson';
import { SurfacesAgricolesModel, TableCommuneModel } from '../postgres/models';
import { Round } from '../utils/reusableFunctions/round';
import { Any } from '../utils/types';

interface NearestPoint extends Feature<Point> {
  properties: {
    featureIndex: number;
    distanceToPoint: number;
    [key: string]: Any;
  };
}

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
          Entre 2009 et 2023, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
          naturels, agricoles ou forestiers ont été consommés sur votre
          territoire.
        </Body>
      ) : atlasBiodiversite.length > 0 && type !== 'commune' ? (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Entre 2009 et 2023, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
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
          Entre 2009 et 2023, {Round(sumNaf / 10000, 1)} hectare(s) d'espaces
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

export const AOT40DynamicText = ({
  stationWithMaxValue,
  nearestPoint
}: {
  stationWithMaxValue:
  | Feature<
    Point | MultiPoint,
    {
      value: number;
      nom_site: string;
    }
  >[]
  | null;
  nearestPoint: NearestPoint;
}) => {
  return (
    <>
      {stationWithMaxValue == null ? (
        <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
          Nous ne disposons pas de données pour les stations proches de votre
          territoire
        </Body>
      ) : (
        <>
          <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
            Plusieurs stations peuvent apparaître sur la carte. C'est la station
            ayant la valeur la plus élevée dans un rayon de{' '}
            {Round(nearestPoint.properties.distanceToPoint + 20, 1)} km qui est
            retenue. Dans votre cas, il s’agit de la station{' '}
            {stationWithMaxValue[0].properties.nom_site}, avec un seuil mesuré
            de {Round(stationWithMaxValue[0].properties.value, 0)} µg/m³.
          </Body>
          <br></br>
          {stationWithMaxValue[0].properties.value < 6000 ? (
            <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
              Bonne nouvelle : votre territoire anticipe l'objectif 2050 avec un
              seuil de 6 000 µg/m³ par heure déjà respecté. Ce résultat
              favorable pour la végétation nécessite toutefois de rester
              vigilant face aux évolutions de la pollution à l’ozone.
            </Body>
          ) : stationWithMaxValue[0].properties.value > 18000 ? (
            <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
              Le cumul d’ozone enregistré ces 5 dernières années pendant la
              période de végétation risque d’engendrer des réactions de la part
              des végétaux de votre territoire (croissance réduite, perte de
              rendement, altération des feuilles). Une vigilance accrue est
              nécessaire pour limiter l’exposition de la végétation.
            </Body>
          ) : (
            <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
              Le seuil actuel de 18 000 µg/m³ par heure est respecté, mais le
              cumul d'ozone dépasse encore l'objectif de 6 000 µg/m³ fixé pour
              2050. Poursuivez vos efforts !
            </Body>
          )}
        </>
      )}
    </>
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
