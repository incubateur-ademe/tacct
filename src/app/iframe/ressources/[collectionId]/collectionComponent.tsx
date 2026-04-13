"use client";

import ClockIcon from "@/assets/icons/clock_icon_white.png";
import DocIcon from '@/assets/icons/doc_icon_white.png';
import FlagIcon from '@/assets/icons/flag_icon_orange.png';
import message3Icone from '@/assets/icons/message_3_icon_black.png';
import ShareIcon from '@/assets/icons/share_icon_white.svg';
import { TuileHorizontale, TuileVerticale } from '@/components/Tuile';
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { TagsIcone } from "@/design-system/base/Tags";
import { Body, H1, H2 } from '@/design-system/base/Textes';
import { NewContainer } from "@/design-system/layout";
import useWindowDimensions from "@/hooks/windowDimensions";
import { FiltresOptions } from "@/lib/ressources/toutesRessources";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../ressources.module.scss";
import { CollectionsData } from './collectionsData';

type CollectionComponentProps = {
  collectionId: string;
};

export const CollectionComponent = ({ collectionId }: CollectionComponentProps) => {
  const collection = CollectionsData.find(c => c.slug === collectionId);
  const articlesSorted = collection?.articles.toSorted((a, b) => a.ordreCollection - b.ordreCollection);
  const territoireOptions = FiltresOptions.find(f => f.titre === 'Territoire')?.options || [];
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const windowDimensions = useWindowDimensions();
  const tempsLecture = collection?.articles.reduce((total, article) => total + article.tempsLecture, 0) || 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    e.currentTarget.blur();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTimeout(() => setCopied(false), 100);
    }, 700);
  };

  return (
    <>
      <div className={styles.collectionTopBlocContainer}>
        <NewContainer size="xl" style={{ padding: "32px 0" }}>
          <div className={styles.collectionTopBlocWrapper}>
            <div className={styles.texteWrapper}>
              <Body style={{ color: "#ffffff" }}>Collection</Body>
              <H1 style={{ color: "#ffffff", margin: 0 }}>{collection?.titre}</H1>
              <div className={styles.collectionMeta}>
                <div className={styles.tempsLecture}>
                  <Image src={DocIcon} alt="Nombre de ressources" width={24} height={24} />
                  <Body size="lg" weight="bold" style={{ color: "#FFFFFF" }}>
                    {collection?.articles.length} ressources
                  </Body>
                </div>
                <div className={styles.tempsLecture}>
                  <Image src={ClockIcon} alt="Temps de lecture" width={24} height={24} />
                  <Body size="lg" weight="bold" style={{ color: "#FFFFFF" }}>
                    {
                      collection?.titre === "Démarrer le diagnostic de vulnérabilité"
                        ? <span>47 min</span>
                        : <span>{tempsLecture} min</span>
                    }
                  </Body>
                </div>
              </div>
              {collection?.texte}
            </div>
            <div className={styles.imageCropped}>
              <Image
                //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                src={collection?.image!}
                width={windowDimensions.width && windowDimensions.width <= 768 ? 300 : 550}
                alt=""
              />
            </div>
          </div>
        </NewContainer>
      </div>
      <div className={styles.collectionArticlesContainer}>
        <NewContainer size="xl" style={{ padding: "32px 0" }}>
          <div className="flex flex-row justify-between items-center">
            <H2 style={{ color: "#161616", fontSize: "22px", marginBottom: 8 }}>
              Notre sélection
            </H2>
            <div className={styles.boutonPartage}>
              <BoutonPrimaireClassic
                onClick={handleCopy}
                icone={copied ? null : ShareIcon}
                size='sm'
                text={copied ? 'Lien copié' : 'Partager la collection'}
                disabled={copied}
              />
            </div>
          </div>
          <div className={styles.separator} />
          <div className={styles.boutonPartageMobile}>
            <BoutonPrimaireClassic
              onClick={handleCopy}
              icone={copied ? null : ShareIcon}
              size='sm'
              text={copied ? 'Lien copié' : 'Partager la collection'}
              disabled={copied}
            />
          </div>
          <div className={styles.selections}>
            <div className={styles.collectionArticlesWrapper}>
              {
                articlesSorted?.map((article) => {
                  const isExternalLink = article.lien.startsWith('https://');
                  const lien = isExternalLink
                    ? article.lien
                    : `/iframe/ressources/${collectionId}/${article.slug}`;

                  return (
                    <div key={article.id} style={{ width: isMobile ? "auto" : "100%" }}>
                      {isMobile ? (
                        <TuileVerticale
                          titre={article.titre}
                          description={article.description}
                          tags={article.filtres?.filter(filtre => !territoireOptions.includes(filtre)).map((filtre, index) => (
                            <TagsIcone
                              key={index}
                              texte={filtre}
                              filtre={filtre as "Article" | "Retour d'expérience" | "M'inspirer" | "Me former" | "Agir"}
                              taille="small"
                            />
                          ))}
                          image={article.image}
                          lien={lien}
                          tempsLecture={article.tempsLecture}
                          lienExterne={article.lien && article.lien.startsWith('/ressources') ? false : true}
                        />
                      ) : (
                        <TuileHorizontale
                          titre={article.titre}
                          image={article.image}
                          tags={article.filtres?.filter(filtre => !territoireOptions.includes(filtre)).map((filtre, index) => (
                            <TagsIcone
                              key={index}
                              texte={filtre}
                              filtre={filtre as "Article" | "Retour d'expérience" | "M'inspirer" | "Me former" | "Agir"}
                              taille="small"
                            />
                          ))}
                          lien={lien}
                          tempsLecture={article.tempsLecture}
                        />
                      )}
                    </div>
                  );
                })
              }
              <div className={styles.question}>
                <div className={styles.titre}>
                  <Image src={message3Icone} alt="" width={24} />
                  <H2 style={{ fontSize: "20px", lineHeight: "28px" }}>
                    Une question, une suggestion ?
                  </H2>
                </div>
                <Body>
                  Notre produit est encore en construction : vos retours sont précieux !
                  N'hésitez pas à nous écrire pour nous en faire part.
                </Body>
                <Link href="https://tally.so/r/mJGELz" target="_blank" rel="noopener noreferrer" className={styles.contact}>
                  Nous contacter
                  <span className={`fr-icon-arrow-right-line ${styles.arrow}`} aria-hidden="true"></span>
                </Link>
              </div>
            </div>
            <div className={styles.blocDroit}>
              <div className={styles.seLancer}>
                <div className={styles.titre}>
                  <Image src={FlagIcon} alt="" width={24} />
                  <Body weight="bold" style={{ fontSize: "20px", lineHeight: "28px", margin: 0, color: "#7E5202" }}>
                    Et si vous vous lanciez ?
                  </Body>
                </div>
                <Body style={{ color: "#7E5202", padding: "1rem 0 1rem 2rem" }}>
                  Si ces ressources vous ont été utiles, vous pouvez dès maintenant commencer votre diagnostic de vulnérabilité !
                </Body>
                <Link href="/iframe/recherche-territoire" className={styles.bouton}>
                  Explorer les données
                  <span className={`fr-icon-arrow-right-line ${styles.arrow}`} aria-hidden="true"></span>
                </Link>
              </div>
            </div>
          </div>
        </NewContainer>
      </div>
    </>
  );
}
