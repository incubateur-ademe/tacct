import type { HauteurMoyenneCanopee } from '@/components/maps/mapCanopee';
import { DefinitionTooltip } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { canopee } from '@/lib/definitions';
import { numberWithSpacesRegex } from '@/lib/utils/regex';

{
  /* Forêts */
}

const pourcent = (taux: number) => Math.round(taux * 100);

// Sources du texte :
// « La forêt couvre {taux} % de la surface de {lieu} » : surface_foret_ha / surface_commune_ha (databases_v2.table_commune) ; au-dessus de la commune, somme des surfaces de forêt rapportée à la somme des surfaces des communes (arrondissements exclus), calculé dans src/app/(main)/(parcours)/donnees/indicateurs/foret/3-SurfaceForet.tsx
// « soit {ha} ha » : somme de surface_foret_ha sur les communes du territoire
// « Selon les communes, ce taux va de {min} % à {max} % » : minimum et maximum du taux de boisement des communes du territoire (plafonné à 100 %), 3-SurfaceForet.tsx
// « moins de 1 % » : taux arrondi à 0 % alors que de la forêt est recensée
// « Aucune forêt n’est recensée » : surface_foret_ha nulle (135 communes de métropole, canopee.ipynb, cellule 32) ; formule de HauteurCanopeeDynamicText
// « Cette donnée n’est disponible que pour la France métropolitaine » : IGN, Masque Forêt v1 – Descriptif de contenu et de livraison, septembre 2025, § 1.2.4, p. 4, https://data.geopf.fr/annexes/ressources/documentation/DC_DL_Masque_Foret_v1.pdf — « Les départements et régions d’outre-mer (DROM) ne sont en revanche pas couverts » ; formule de HauteurCanopeeDynamicText
// « Il n’y a pas de données référencées […] » : formule standard du site
export const SurfaceForetDynamicText = ({
  taux,
  surfaceForet,
  ecart,
  isOutreMer,
  type
}: {
  taux: number | null;
  surfaceForet: number | null;
  ecart: { min: number; max: number } | null;
  isOutreMer: boolean;
  type: string;
}) => {
  const style = { color: 'var(--gris-dark)' };
  if (isOutreMer) {
    return (
      <Body weight="bold" style={style}>
        Cette donnée n’est disponible que pour la France métropolitaine.
      </Body>
    );
  }
  if (taux === null || surfaceForet === null) {
    return (
      <Body weight="bold" style={style}>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  const lieu =
    type === 'commune' ? 'votre commune' : type === 'epci' ? 'votre EPCI' : 'votre territoire';
  if (surfaceForet === 0) {
    return (
      <Body weight="bold" style={style}>
        Aucune forêt n’est recensée sur {lieu}.
      </Body>
    );
  }
  return (
    <Body weight="bold" style={style}>
      La forêt couvre {pourcent(taux) < 1 ? 'moins de 1' : pourcent(taux)}
      &nbsp;% de la surface de {lieu}, soit{' '}
      {surfaceForet < 1 ? (
        'moins d’un hectare'
      ) : (
        <>{numberWithSpacesRegex(Math.round(surfaceForet))}&nbsp;ha</>
      )}
      .
      {ecart && pourcent(ecart.min) !== pourcent(ecart.max) && (
        <>
          {' '}Selon les communes, ce taux va de {pourcent(ecart.min)}&nbsp;% à{' '}
          {pourcent(ecart.max)}&nbsp;%.
        </>
      )}
    </Body>
  );
};

// Sources du texte :
// « la canopée mesure en moyenne {hauteur} m de haut » : moyenne des pixels de forêt (valeur > 0) du COG FORMS-T_2024_Forest_COG.tif situés dans le contour du territoire, calculée par hauteurMoyenneDansContour dans src/components/maps/mapCanopee.tsx
// « Aucune forêt n’est recensée » : aucun pixel de forêt du Masque Forêt v1 (IGN) dans le contour du territoire (canopee.ipynb, cellule 23 : hors forêt = 0)
// « Cette donnée n’est disponible que pour la France métropolitaine » : formule de O3AirDynamicText ; FORMS-T et Masque Forêt v1 couvrent la France métropolitaine seulement
// « Il n’y a pas de données référencées […] » : formule standard du site
export const HauteurCanopeeDynamicText = ({
  hauteurMoyenne,
  isOutreMer,
  type
}: {
  hauteurMoyenne: HauteurMoyenneCanopee;
  isOutreMer: boolean;
  type: string;
}) => {
  const style = { color: 'var(--gris-dark)' };
  if (isOutreMer) {
    return (
      <Body weight="bold" style={style}>
        Cette donnée n’est disponible que pour la France métropolitaine.
      </Body>
    );
  }
  if (hauteurMoyenne === 'indisponible') {
    return (
      <Body weight="bold" style={style}>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  const lieu =
    type === 'commune' ? 'votre commune' : type === 'epci' ? 'votre EPCI' : 'votre territoire';
  if (hauteurMoyenne === 'aucune-foret') {
    return (
      <Body weight="bold" style={style}>
        Aucune forêt n’est recensée sur {lieu}.
      </Body>
    );
  }
  return (
    <Body weight="bold" style={style}>
      Dans les forêts de {lieu}, la{' '}
      <DefinitionTooltip title={canopee}>canopée</DefinitionTooltip> mesure en
      moyenne{' '}
      {Math.round(hauteurMoyenne)}&nbsp;m de haut.
    </Body>
  );
};
