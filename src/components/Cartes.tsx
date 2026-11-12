import LienExterneIcon from "@/assets/icons/external_link_icon.svg";
import { Body } from "@/design-system/base/Textes";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import styles from "./Cartes.module.scss";

export const CarteHoverLink = ({
  titre,
  description,
  icone,
  lien
}: {
  titre: string;
  description: string;
  icone: StaticImageData;
  lien: string;
}) => {
  const lienExterne = lien.startsWith('https');

  const content = (
    <div className={styles.carteHoverContainer} >
      <div className={styles.contentWrapper}>
        <div className={styles.left}>
          <Image src={icone} alt="" className={styles.icon} />
          <div className={styles.title}>
            <p>{titre}</p>
          </div>
          <div className={styles.description}>
            <Body size='xs' style={{ color: "#3D3D3D", lineHeight: "16px" }}>
              {description}
            </Body>
          </div>
        </div>
        {lien && (
          lienExterne ? (
            <Image src={LienExterneIcon} alt="" width={24} height={24} style={{ alignSelf: "flex-end" }} />
          ) : (
            <span
              className="fr-icon-arrow-right-line"
              aria-hidden="true"
              style={{ color: "var(--boutons-primaire-3)", alignSelf: "flex-end" }}>
            </span>
          )
        )}
      </div>
    </div>
  );

  if (lien) {
    return (
      <Link
        href={lien}
        target={lienExterne ? "_blank" : "_self"}
        rel={lienExterne ? "noopener noreferrer" : undefined}
        className={styles.carteLink}
      >
        {content}
      </Link>
    );
  }

  return content;
}
