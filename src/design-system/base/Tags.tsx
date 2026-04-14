import agirIcon from "@/assets/icons/agir_icon_green.svg";
import articleIcon from "@/assets/icons/article_icon_green.svg";
import meFormerIcon from "@/assets/icons/formation_icon_green.svg";
import formationIcon from "@/assets/icons/formation_icon_orange.svg";
import inspirerIcon from "@/assets/icons/inspirer_icon_green.svg";
import quizIcon from "@/assets/icons/quiz_icon_yellow.svg";
import REXIcon from "@/assets/icons/retour_exp_icon_red.svg";
import SupportIcon from "@/assets/icons/support_icon_blue.svg";
import videoIcon from "@/assets/icons/video_icon_purple.svg";
import Image from "next/image";
import { Body } from "./Textes";

export const TagsSimples = ({
  texte,
  couleur,
  couleurTexte,
  taille,
  icone,
  closeable,
  handleClose
}: {
  texte: string;
  couleur: string;
  couleurTexte: string;
  taille?: 'small' | 'medium';
  icone?: React.ReactNode;
  closeable?: boolean;
  handleClose?: () => void;
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: couleur,
        borderRadius: '16px',
        padding: taille === 'small' ? '4px 4px 4px 8px' : '8px 16px',
        fontSize: taille === 'small' ? '14px' : '16px',
        fontWeight: 500,
        color: couleurTexte,
        gap: '4px',
        cursor: closeable ? 'pointer' : undefined,
      }}
      onClick={closeable ? handleClose : undefined}
    >
      {icone && <span>{icone}</span>}
      <Body size={taille === 'small' ? 'sm' : 'md'} style={{ color: couleurTexte }}>
        {texte}
      </Body>
      {closeable && <span style={{ padding: '2px 8px 2px 8px' }}>×</span>}
    </div>
  );
};

export const TagsIcone = ({
  texte,
  filtre,
  taille,
}: {
  texte: string;
  filtre: 'Article' |
  'Retour d\'expérience' |
  "Agir" |
  "Me former" |
  "M'inspirer" |
  "Quiz" |
  "Formation" |
  "Vidéo" |
  "Support méthodo";
  taille?: 'small' | 'medium';
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: filtre === "Article"
          ? "#E3FAF9"
          : filtre === "Retour d'expérience"
            ? "#FFC9E4"
            : filtre === "Quiz"
              ? "#F6F69B"
              : filtre === "Formation"
                ? "#FFE2AE"
                : filtre === "Vidéo"
                  ? "#F2E4FF"
                  : filtre === "Support méthodo"
                    ? "#D8EFFA"
                    : "#E3FAF9",
        borderRadius: '16px',
        padding: taille === 'small' ? '4px 8px' : '8px 16px',
        fontSize: taille === 'small' ? '14px' : '16px',
        fontWeight: 500,
        color: filtre === "Article"
          ? "var(--boutons-primaire-3)"
          : filtre === "Retour d'expérience"
            ? "#971356"
            : filtre === "Quiz"
              ? "#5A5A10"
              : filtre === "Formation"
                ? "#7E5202"
                : filtre === "Vidéo"
                  ? "#6E3F99"
                  : filtre === "Support méthodo"
                    ? "#055FA5"
                    : "var(--boutons-primaire-3)",
        gap: '4px',
      }}
    >
      {<Image src={
        filtre === "Article"
          ? articleIcon
          : filtre === "Retour d'expérience"
            ? REXIcon
            : filtre === "Quiz"
              ? quizIcon
              : filtre === "Formation"
                ? formationIcon
                : filtre === "Vidéo"
                  ? videoIcon
                  : filtre === "M'inspirer"
                    ? inspirerIcon
                    : filtre === "Agir"
                      ? agirIcon
                      : filtre === "Support méthodo"
                        ? SupportIcon
                        : meFormerIcon
      } alt="" />}
      <Body
        size={taille === 'small' ? 'sm' : 'md'}
        style={{ color: filtre === "Article" ? "var(--boutons-primaire-3)" : "var(--text-default)" }}
      >
        {texte}
      </Body>
    </div>
  );
};
