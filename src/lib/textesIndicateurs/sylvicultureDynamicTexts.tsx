import { Body } from '@/design-system/base/Textes';
import { numberWithSpacesRegex } from '@/lib/utils/regex';

{
  /* Sylviculture */
}

const hectares = (valeur: number) => numberWithSpacesRegex(Math.round(valeur));
const auSingulier = (valeur: number) => Math.round(valeur) === 1;

// Sources du texte (table databases_v2.forets_communales, requêtes du 04/11/2026) :
// « comme une commune sur cinq » : 6 850 communes sous 0,01 ha et 6 954 entre 0,01 et 1 ha, sur 34 875 communes renseignées
// « la moitié des communes qui possèdent de la forêt en possèdent moins de 8 ha, et 90 % moins de 265 ha » : médiane (8,1 ha) et 9e décile (264,6 ha) des 28 025 communes qui possèdent au moins 0,01 ha
// « pour la moitié des EPCI, cette surface est inférieure à 302 ha » : médiane de la somme de surface_foret_possedee_ha par EPCI (1 256 EPCI)
// « situés sur d’autres communes » : surface_foret_possedee_ha − surface_foret_possedee_sur_territoire_ha
// « Il n’y a pas de données référencées […] » : formule standard du site
export const ForetsCommunalesDynamicText = ({
  surface,
  surfaceExterieur,
  type
}: {
  surface: number | null;
  surfaceExterieur: number;
  type: string;
}) => {
  const style = { color: 'var(--gris-dark)' };
  if (surface === null) {
    return (
      <Body weight="bold" style={style}>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  if (type === 'commune') {
    if (surface < 0.01) {
      return (
        <Body weight="bold" style={style}>
          Votre commune ne possède pas de forêt, comme une commune sur cinq sur le territoire français.
        </Body>
      );
    }
    if (surface < 1) {
      return (
        <Body weight="bold" style={style}>
          Votre commune possède moins d’un hectare de forêt, comme une commune
          sur cinq.
        </Body>
      );
    }
    return (
      <Body weight="bold" style={style}>
        {hectares(surface)}&nbsp;ha de forêt{' '}
        {auSingulier(surface) ? 'appartient' : 'appartiennent'} à votre
        commune.{' '}
        {surfaceExterieur >= 1 && (
          <>
            Parmi cette surface, {hectares(surfaceExterieur)}&nbsp;ha{' '}
            {auSingulier(surfaceExterieur) ? 'est situé' : 'sont situés'} sur
            d’autres communes que la vôtre.{' '}
          </>
        )}
        En France, la moitié des communes qui possèdent de la forêt en
        possèdent moins de 8&nbsp;ha, et 90&nbsp;% moins de 265&nbsp;ha.
      </Body>
    );
  }
  const lieu = type === 'epci' ? 'votre EPCI' : 'votre territoire';
  if (surface < 0.01) {
    return (
      <Body weight="bold" style={style}>
        Aucune commune de {lieu} ne possède de forêt.
      </Body>
    );
  }
  if (surface < 1) {
    return (
      <Body weight="bold" style={style}>
        Les communes de {lieu} possèdent moins d’un hectare de forêt.
      </Body>
    );
  }
  return (
    <Body weight="bold" style={style}>
      {hectares(surface)}&nbsp;ha de forêt{' '}
      {auSingulier(surface) ? 'appartient' : 'appartiennent'} aux communes de{' '}
      {lieu}.{' '}
      {surfaceExterieur >= 1 && (
        <>
          Sur cette surface, {hectares(surfaceExterieur)}&nbsp;ha{' '}
          {auSingulier(surfaceExterieur) ? 'est situé' : 'sont situés'} sur
          d’autres communes que celles qui les possèdent.{' '}
        </>
      )}
      {type === 'epci' && (
        <>
          En France, pour la moitié des EPCI, cette surface est inférieure à
          302&nbsp;ha.
        </>
      )}
    </Body>
  );
};
