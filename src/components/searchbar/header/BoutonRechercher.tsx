"use client";

import LoupeIcon from '@/assets/icons/magnifying_glass_icon_white.svg';
import { HtmlTooltip } from "@/components/utils/Tooltips";
import { couleursPrincipales } from "@/design-system/couleurs";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { handleChangementTerritoireRedirection } from "../fonctions";

export const BoutonRechercherHeader = ({
  searchLibelle,
  setIsTerritoryChanging,
  searchCode,
  typeTerritoire,
}: {
  searchLibelle: string;
  setIsTerritoryChanging: (value: boolean) => void;
  searchCode: string;
  typeTerritoire: TerritoireType;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const thematique = params.get('thematique') || undefined;

  return (
    searchLibelle === '' ? (
      <HtmlTooltip title="Sélectionnez un territoire">
        <Image
          aria-hidden="true"
          alt=""
          src={LoupeIcon}
          height={34}
          width={34}
          style={{
            backgroundColor: couleursPrincipales.vert,
            borderRadius: '30px',
            padding: '4px',
            flexShrink: 0,
          }}
        />
      </HtmlTooltip>
    ) : (
      <button
        aria-label="Rechercher ce territoire"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (searchLibelle === '') return;
          (document.activeElement as HTMLElement | null)?.blur();
          setIsTerritoryChanging(false);
          handleChangementTerritoireRedirection({
            searchCode,
            searchLibelle,
            typeTerritoire,
            router,
            page: pathname.split('/')[1] || '',
            thematique
          })
        }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Image
          aria-hidden="true"
          alt=""
          src={LoupeIcon}
          height={34}
          width={34}
          style={{
            backgroundColor: couleursPrincipales.vert,
            borderRadius: '30px',
            padding: '4px',
          }}
        />
      </button>
    )
  )
}
