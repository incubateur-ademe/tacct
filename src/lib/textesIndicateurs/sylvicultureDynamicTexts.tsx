import { Body } from '@/design-system/base/Textes';
import { numberWithSpacesRegex } from '@/lib/utils/regex';
import { Round } from '@/lib/utils/reusableFunctions/round';

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

// Sources du texte (Insee, Flores 2024, DS_FLORES_A88_2024, mesure EMPL3112, divisions 02 + 16, téléchargé en novembre 2026) :
// « En France, cette part est de 0,3 % » : (23 920 + 61 778) / 26 604 745 = 0,32 %
// « moins de 0,1 % » : 90 EPCI entre 0 et 0,05 %, qui s’afficheraient 0,0 % au dixième
// « Aucun poste salarié […] n’est recensé » : 95 EPCI sans poste dans les divisions 02 et 16
// « Cette donnée n’est fiable que pour des territoires de plusieurs milliers de salariés » : Insee, https://www.insee.fr/fr/statistiques/8266010 — « à cette échelle géographique, les données n’ont pas fait l’objet d’une validation par des experts » ; « les analyses doivent porter sur des territoires « de taille suffisante » (plusieurs milliers de salariés) » ; à l’échelle de la commune, part et postes sont ceux de l’EPCI
// « dans votre commune » : communes sans EPCI (table databases_v2.emplois_sylviculture, epci = 'ZZZZZZZZZ', libelle_epci « Sans objet ») : Île-de-Bréhat (22016), Île-de-Sein (29083), Ouessant (29155), L’Île-d’Yeu (85113) ; part et postes sont ceux de la commune
// « Il n’y a pas de données référencées […] » : formule standard du site
export const EmploisSylvicultureDynamicText = ({
  part,
  postes,
  type,
  sansEpci
}: {
  part: number | null;
  postes: number | null;
  type: string;
  sansEpci: boolean;
}) => {
  const style = { color: 'var(--gris-dark)' };
  const lieu =
    type !== 'commune'
      ? 'sur votre territoire'
      : sansEpci
        ? 'dans votre commune'
        : 'dans votre EPCI';
  if (part === null || postes === null) {
    return (
      <Body weight="bold" style={style}>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  const avertissementCommune =
    type === 'commune'
      ? 'Cette donnée n’est fiable que pour des territoires de plusieurs milliers de salariés. '
      : '';
  if (postes === 0) {
    return (
      <Body weight="bold" style={style}>
        {avertissementCommune}Aucun poste salarié de la sylviculture, de
        l’exploitation forestière ou du travail du bois n’est recensé {lieu}. En
        France, ces secteurs représentent 0,3&nbsp;% des postes salariés.
      </Body>
    );
  }
  return (
    <Body weight="bold" style={style}>
      {avertissementCommune}
      {lieu.charAt(0).toUpperCase() + lieu.slice(1)}, la
      sylviculture, l’exploitation forestière et le travail du bois
      représentent {part < 0.1 ? 'moins de 0,1' : Round(part, 1)}&nbsp;% des
      postes salariés, soit {numberWithSpacesRegex(postes)}{' '}
      {postes === 1 ? 'poste' : 'postes'}. En France, cette part est de
      0,3&nbsp;%.
    </Body>
  );
};
