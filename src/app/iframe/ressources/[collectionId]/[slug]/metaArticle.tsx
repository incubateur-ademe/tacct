"use client";

import { Block } from "@/app/(main)/types";
import ClockIcon from "@/assets/icons/clock_icon_black.svg";
import LocationIcon from "@/assets/icons/location_icon_black.svg";
import { TagsIcone } from "@/design-system/base/Tags";
import { Body, H1 } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { FiltresOptions, toutesLesRessources } from "@/lib/ressources/toutesRessources";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from './articles.module.scss';

export const MetaArticleResponsive = ({
  getBlocksContent,
  slug
}: {
  getBlocksContent: Block[];
  slug: string;
}) => {
  const windowDimensions = useWindowDimensions();
  const territoireOptions = FiltresOptions.find(f => f.titre === 'Territoire')?.options || [];
  const article = toutesLesRessources.find(a => a.slug === slug);
  if (!article) {
    notFound();
  }
  const titrePrincipal = getBlocksContent.find(block => block.type === 'heading_1');

  return (
    <div className={styles.articleTopBlocContainer}>
      <div className={styles.articleTopBlocImage} style={{ width: '384px', height: '281px' }}>
        <Image
          src={article.image!}
          alt={article.titre!}
          fill
          style={{
            borderRadius: "2rem 2rem 2rem 0",
            objectFit: "cover",
          }}
        />
      </div>
      <div className={styles.articleTopBlocMeta}>
        <div className={styles.content}>
          <div className={styles.articleMetaBadge}>
            {article.filtres?.filter(filtre => !territoireOptions.includes(filtre)).map((filtre, index) => (
              <TagsIcone
                key={index}
                texte={filtre}
                filtre={filtre as "Article" | "Retour d'expérience" | "M'inspirer" | "Me former" | "Agir"}
                taille="small"
              />
            ))}
          </div>
          <H1 style={{
            color: "#2B4B49",
            margin: 0,
            fontSize: (windowDimensions.width && windowDimensions.width <= 992) ? "32px" : "40px",
            lineHeight: (windowDimensions.width && windowDimensions.width <= 992) ? "40px" : "3rem"
          }}>
            {titrePrincipal?.heading_1?.rich_text?.[0]?.plain_text}
          </H1>
          <div className={styles.articleMetaInfo}>
            <div className={styles.tempsLecture}>
              <Image src={ClockIcon} alt="Temps de lecture" width={24} height={24} />
              <Body weight="bold" size="lg">{article.tempsLecture} min</Body>
            </div>
            {
              article.filtres?.filter(filtre => territoireOptions.includes(filtre)).length > 0 && (
                <div className={styles.localisation}>
                  <Image src={LocationIcon} alt="Localisation" width={24} height={24} />
                  <Body weight="bold" size="lg">{article.filtres?.filter(filtre => territoireOptions.includes(filtre))}</Body>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
