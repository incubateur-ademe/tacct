import { Body } from '@/design-system/base/Textes';
import { StationSki } from '@/lib/postgres/models';

{
  /* Tourisme */
}

// Sources du texte (table databases_v2.stations_ski) :
// « dont le parc de remontées mécaniques a en moyenne […] ans » : moyenne de stations_age_parc des stations du territoire, pondérée par stations_moment_puissance, chaque station comptée une fois
// « En France, la moitié des stations ont un parc de moins de 35 ans » : recalcul du 06/11/2026 à partir des fichiers sources du notebook stations_ski (CAIRN au 1er août 2026 et fichiers INRAE) — sur 236 stations rattachées à une commune, 117 ont un parc de moins de 35 ans, 6 de 35 ans et 113 de plus de 35 ans
export const StationsSkiDynamicText = ({
  stations,
  ageParc,
  type
}: {
  stations: StationSki[];
  ageParc: number | null;
  type: string;
}) => {
  const style = { color: 'var(--gris-dark)' };
  if (!stations.length || ageParc === null) {
    return (
      <Body weight="bold" style={style}>
        Votre commune n’accueille aucune station de ski. La carte présente
        celles des autres communes de votre EPCI.
      </Body>
    );
  }
  const lieu =
    type === 'commune'
      ? 'Votre commune'
      : type === 'epci'
        ? 'Votre EPCI'
        : 'Votre territoire';
  return (
    <Body weight="bold" style={style}>
      {lieu} accueille{' '}
      {stations.length === 1 ? (
        <>une station de ski, {stations[0].nom},</>
      ) : (
        <>{stations.length} stations de ski,</>
      )}{' '}
      dont le parc de remontées mécaniques a en moyenne {ageParc}&nbsp;ans.
      En France, la moitié des stations ont un parc de moins de 35&nbsp;ans.
    </Body>
  );
};
