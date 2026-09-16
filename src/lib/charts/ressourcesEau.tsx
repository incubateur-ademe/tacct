import eclair_icon_black from '@/assets/icons/themes/eclair_icon_black.svg';
import flocon_icon_black from '@/assets/icons/themes/flocon_icon_black.svg';
import robinet_icon_black from '@/assets/icons/themes/robinet_icon_black.svg';
import tracteur_icon_black from '@/assets/icons/themes/tracteur_icon_black.svg';
import usine_icon_black from '@/assets/icons/themes/usine_icon_black.svg';
import vagues_icon_black from '@/assets/icons/themes/vagues_icon_black.svg';
import Image from "next/image";
import { RessourcesEau } from "../postgres/models";
import { Sum } from "../utils/reusableFunctions/sum";

const SumFiltered = (
  data: RessourcesEau[],
  code: string,
  libelle: string,
  type: string,
  champ: string
) => {
  const columnCode = type === 'epci'
    ? 'epci'
    : type === 'commune'
      ? 'code_geographique'
      : type === "departement"
        ? "departement"
        : undefined

  const columnLibelle = type === "petr"
    ? "libelle_petr"
    : type === "pnr"
      ? "libelle_pnr"
      : "ept"

  return Sum(
    data
      .filter((obj) => columnCode ? obj[columnCode] === code : obj[columnLibelle] === libelle
      )
      .filter((item) => item.LIBELLE_SOUS_CHAMP?.includes(champ))
      .map((e) => e.A2020)
      .filter((value): value is number => value !== null)
  );
};

export const ProgressBarsPNRDataPrelevementEau = ({
  ressourcesEau,
  code,
  libelle,
  type
}: {
  ressourcesEau: RessourcesEau[];
  code: string;
  libelle: string;
  type: string;
}) => {
  return (
    [
      {
        titre: 'Agriculture',
        icon: <Image src={tracteur_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'agriculture'
        ),
        color: '#00C190'
      },
      {
        titre: 'Eau potable',
        icon: <Image src={robinet_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'potable'
        ),
        color: '#009ADC'
      },
      {
        titre: 'Industrie et autres usages économiques',
        icon: <Image src={usine_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'industrie'
        ),
        color: '#7A49BE'
      },
      {
        titre: 'Refroidissement des centrales électriques',
        icon: <Image src={flocon_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'refroidissement'
        ),
        color: '#BB43BD'
      },
      {
        titre: 'Alimentation des canaux',
        icon: <Image src={vagues_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'alimentation'
        ),
        color: '#00C2CC'
      },
      {
        titre: "Production hydro-électriques",
        icon: <Image src={eclair_icon_black} alt="" />,
        sumTerritoire: SumFiltered(
          ressourcesEau,
          code,
          libelle,
          type,
          'production'
        ),
        color: '#FFCF5E'
      }
    ]
  )
}
