import { Body } from '@/design-system/base/Textes';

{
  /* Air */
}

// Sources du texte :
// « Sur 2022-2024 » : SDES, La pollution de l’air par l’ozone (O₃), mise à jour du 30 juin 2026, section « Les concentrations d’O₃ au regard de la réglementation pour la protection de la santé, en cartes », https://www.statistiques.developpement-durable.gouv.fr/la-pollution-de-lair-par-lozone-o3 — « En moyenne sur 2022-2024 » ; fichier INERIS Reanalysed_FRA_2024_O3_t120_3y, attribut Times_bnds — « 20220101 ; 20241231 »
// « jours par an où l’ozone a dépassé 120 µg/m³ sur 8 heures » : INERIS, méthodologie, tableau « Synthèse des indicateurs statistiques cartographiés », https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/20-ans-evolution-qualite-air — « Nombre de jours pour lesquels la moyenne glissante sur 8h dépasse 120 µg.m-3 (en moyenne sur 3 ans) »
// « en moyenne {moyenne} […] jusqu’à {max} » : moyenne et maximum de la propriété valeur des tuiles seuils_reglementaires_o3 (couche o3), relevée tous les 1 km à l’intérieur du territoire, calculés par valeursSurTerritoire dans src/components/maps/valeursSurTerritoire.ts
// « plafond de 18 jours par an que fixera la valeur cible européenne pour la santé à partir de 2030 » : directive (UE) 2024/2881, annexe I, section 2 B, https://eur-lex.europa.eu/eli/dir/2024/2881/oj — « 120 μg/m3 à ne pas dépasser plus de 18 jours par année civile, moyenne calculée sur trois ans »
// « 25 jours aujourd’hui » et « plafond actuel de 25 jours par an » : directive (UE) 2024/2881, annexe I, note (5) — « Jusqu’au 1er janvier 2030, 120 μg/m3 à ne pas dépasser plus de 25 jours par année civile, moyenne calculée sur trois ans »
// « est dépassé dans le secteur le plus exposé » et « est dépassé en moyenne sur {lieu} » : comparaison de la carte à la valeur cible, comme le fait le SDES pour cette même carte, section « Les concentrations d’O₃ au regard de la réglementation pour la protection de la santé, en cartes » — « En moyenne sur 2022-2024, les régions Auvergne-Rhône-Alpes, Grand Est, Occitanie et Provence-Alpes-Côte d’Azur sont concernées par des dépassements »
// « France métropolitaine » : INERIS, cartothèque, https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine — « sur l’ensemble du territoire métropolitain et la Corse »
// « Il n’y a pas de données référencées […] » : formule standard du site, reprise de SurfacesEnHerbeDynamicText
export const O3AirDynamicText = ({
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
        Cette donnée n’est disponible que pour la France métropolitaine.
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
  const jours = (valeur: number) => (valeur < 2 ? 'jour' : 'jours');
  const comparaison =
    max > 25 ? (
      <>
        Le plafond de 25&nbsp;jours par an fixé par la valeur cible européenne
        pour la santé est dépassé{' '}
        {moyenne > 25 ? `en moyenne sur ${lieu}` : 'dans le secteur le plus exposé'}.
      </>
    ) : max > 18 ? (
      <>
        Le plafond actuel de 25&nbsp;jours par an fixé par la valeur cible
        européenne pour la santé est respecté, mais celui de 18&nbsp;jours, qui
        s’appliquera à partir de 2030, est dépassé{' '}
        {moyenne > 18 ? `en moyenne sur ${lieu}` : 'dans le secteur le plus exposé'}.
      </>
    ) : (
      <>
        {max > moyenne ? 'Ces valeurs ne dépassent' : 'Cette valeur ne dépasse'}{' '}
        pas le plafond de 18&nbsp;jours par an que fixera la valeur cible
        européenne pour la santé à partir de 2030 (25&nbsp;jours aujourd’hui).
      </>
    );
  return (
    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
      Sur 2022-2024, {lieu} a compté en moyenne {moyenne}&nbsp;{jours(moyenne)}{' '}
      par an où l’ozone a dépassé 120&nbsp;µg/m³ sur 8&nbsp;heures
      {max > moyenne ? (
        <>
          , et jusqu’à {max}&nbsp;{jours(max)} dans son secteur le plus exposé
        </>
      ) : null}
      .{' '}
      {comparaison}
    </Body>
  );
};
