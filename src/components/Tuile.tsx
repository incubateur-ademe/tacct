"use client";

import ClockIcon from "@/assets/icons/clock_icon_black.svg";
import DocIcon from "@/assets/icons/doc_icon_white.png";
import LienExterneIcon from "@/assets/icons/fr-icon-external-link-line.png";
import useWindowDimensions from "@/hooks/windowDimensions";
import { MinuteToHours } from "@/lib/utils/reusableFunctions/MinuteToHours";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./Tuile.module.scss";

interface Props {
  titre: string;
  description?: string;
  image: StaticImageData;
  lien?: string;
  lienExterne?: boolean;
  tags?: React.ReactNode[];
  tempsLecture?: number;
  nombreArticles?: number;
}

export const TuileVerticale = ({
  titre,
  description,
  image,
  lien,
  lienExterne,
  tags = [],
  tempsLecture
}: Props) => {
  const processedTags = React.useMemo(() => {
    const tagTexts = tags.map(tag => {
      if (React.isValidElement(tag) && tag.props && typeof (tag.props as { texte?: string }).texte === 'string') {
        return (tag.props as { texte: string }).texte;
      }
      return '';
    });

    const hasRetourExperience = tagTexts.includes("Retour d'expérience");
    const hasMethodo = tagTexts.includes("Support méthodo");
    // const hasArticle = tagTexts.includes("Article");

    if (hasRetourExperience) {
      return tags.map(tag => {
        if (React.isValidElement(tag) && tag.props && (tag.props as { texte?: string }).texte === "Retour d'expérience") {
          return React.cloneElement(tag as React.ReactElement<{ texte: string }>, { ...tag.props, texte: "REX" });
        }
        return tag;
      });
    }
    if (hasMethodo) {
      return tags.map(tag => {
        if (React.isValidElement(tag) && tag.props && (tag.props as { texte?: string }).texte === "Support méthodo") {
          return React.cloneElement(tag as React.ReactElement<{ texte: string }>, { ...tag.props, texte: "Méthodo" });
        }
        return tag;
      });
    }

    return tags;
  }, [tags]);

  const content = (
    <div className={styles.tuile} tabIndex={lien ? -1 : 0} role="article">
      <div className={styles.imageContainer}>
        <Image src={image} alt={titre} fill />
      </div>
      <div className={styles.contenu}>
        {processedTags.length > 0 && (
          <div className={styles.tags}>
            {processedTags.map((tag, index) => (
              <span key={index}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className={styles.titre}>
          {titre}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.footer}>
        {tempsLecture && (
          <div className={styles.tempsLecture}>
            <Image src={ClockIcon} alt="Temps de lecture" width={16} height={16} />
            <span>{MinuteToHours(tempsLecture)}</span>
          </div>
        )}
        {
          lien && (
            <div className={styles.lien}>
              {
                lienExterne ? <Image src={LienExterneIcon} alt="" width={24} height={24} /> :
                  <span className={`fr-icon-arrow-right-line ${styles.arrow}`} aria-hidden="true"></span>
              }
            </div>
          )
        }
      </div>
    </div>
  );

  if (lien) {
    return (
      <Link
        href={lien}
        target={lienExterne ? "_blank" : "_self"}
        rel={lienExterne ? "noopener noreferrer" : undefined}
        className={styles.tuileLink}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export const TuileHorizontale = ({
  titre,
  image,
  lien,
  tags = [],
  tempsLecture
}: Props) => {
  const lienExterne = lien ? lien.startsWith('http') : false;
  const content = (
    <div className={styles.tuileHorizontale} tabIndex={lien ? -1 : 0} role="article">
      <div className={styles.imageContainer}>
        <Image src={image} alt={titre} fill style={{ objectFit: 'none', objectPosition: 'top' }} />
      </div>

      <div className={styles.contenu}>
        <div className={styles.titre}>
          {titre}
        </div>

        <div className={styles.footer}>
          <div className={styles.leftSection}>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag, index) => (
                  <span key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {tempsLecture && (
              <div className={styles.tempsLecture}>
                <Image src={ClockIcon} alt="Temps de lecture" width={16} height={16} />
                <span>{MinuteToHours(tempsLecture)}</span>
              </div>
            )}
          </div>
          {
            lien && (
              lienExterne ? <Image src={LienExterneIcon} alt="" width={24} height={24} /> :
                <span className={`fr-icon-arrow-right-line ${styles.arrow}`} aria-hidden="true"></span>
            )
          }
        </div>
      </div>
    </div>
  );

  if (lien) {
    return (
      <Link
        href={lien}
        target={lienExterne ? "_blank" : "_self"}
        rel={lienExterne ? "noopener noreferrer" : undefined}
        className={styles.tuileLink}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export const TuileHorizontaleCollection = ({
  titre,
  image,
  lien,
  tempsLecture,
  nombreArticles
}: Props) => {
  const windowDimensions = useWindowDimensions();

  const content = (
    <div className={styles.tuileHorizontaleCollection} tabIndex={lien ? -1 : 0} role="collection">
      <div className={styles.contenu}>
        <div className={styles.titre}>
          {titre}
        </div>

        <div className={styles.footer}>
          <div className={styles.leftSection}>
            {nombreArticles && (
              <div className={styles.tempsLecture}>
                <Image
                  src={DocIcon}
                  alt="Nombre d'articles"
                  width={16}
                  height={16}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span>
                  {nombreArticles}
                </span>
              </div>
            )}
            {tempsLecture && (
              <div className={styles.tempsLecture}>
                <Image
                  src={ClockIcon}
                  alt="Temps de lecture"
                  width={16}
                  height={16}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span>{MinuteToHours(tempsLecture)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={styles.imageContainer}
        style={windowDimensions.width && windowDimensions.width <= 768 ? { maxWidth: 100 } : undefined}
      >
        <Image
          src={image}
          alt={titre}
          fill
          style={{
            objectFit: windowDimensions.width && windowDimensions.width <= 768 ? 'contain' : 'cover',
            objectPosition: windowDimensions.width && windowDimensions.width <= 768 ? 'center' : 'top',
          }}
        />
      </div>
    </div>
  );

  if (lien) {
    return (
      <Link
        href={lien}
        target={"_self"}
        className={styles.tuileLinkCollection}
      >
        {content}
      </Link>
    );
  }

  return content;
}
