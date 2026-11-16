import type { HauteurMoyenneCanopee } from '@/components/maps/mapCanopee';
import { Body } from '@/design-system/base/Textes';

{
  /* Forêts */
}

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
      Dans les forêts de {lieu}, la canopée mesure en moyenne{' '}
      {Math.round(hauteurMoyenne)}&nbsp;m de haut.
    </Body>
  );
};
