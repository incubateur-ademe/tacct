import { NewContainer } from "@/design-system/layout";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { sharedMetadata } from "../../shared-metadata";
import { BlocCollections, BlocCollectionsResponsive } from "../blocs/blocCollections";
import { ModaleToutesCollections } from "../blocs/ModaleToutesCollections";
import styles from "../ressources.module.scss";
import { CollectionComponent } from "./collectionComponent";
import { CollectionsData } from "./collectionsData";
import { collectionsIframeCartes } from "../cartes";

export async function generateMetadata({ params }: { params: Promise<{ collectionId: string }> }): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = CollectionsData.find(c => c.slug === collectionId);

  if (!collection) {
    return {
      ...sharedMetadata,
      title: "Boîte à outils - TACCT",
      description: "Découvrez notre boîte à outils pour l'adaptation au changement climatique"
    };
  }
  const url = `https://www.tacct.ademe.fr/iframe/ressources/${collection.slug}`;

  return {
    ...sharedMetadata,
    title: collection.titre,
    description: collection.metadescription,
    openGraph: {
      ...sharedMetadata.openGraph,
      title: collection.titre,
      description: collection.metadescription,
      url,
      images: [
        {
          url: collection.image.src,
          width: collection.image.width,
          height: collection.image.height,
          alt: collection.titre
        }
      ]
    },
    alternates: {
      canonical: url
    }
  };
}

const Collections = async ({ params }: { params: Promise<{ collectionId: string }> }) => {
  const { collectionId } = await params;
  const collection = CollectionsData.find(c => c.slug === collectionId);

  if (!collection) {
    redirect('/iframe/ressources');
  }

  return (
    <>
      <NewContainer size="xl" style={{ padding: 0 }}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            currentPageLabel={collection?.titre}
            homeLinkProps={{ href: '/iframe' }}
            segments={[{ label: 'Boîte à outils', linkProps: { href: '/iframe/ressources' } }]}
          />
        </div>
      </NewContainer>
      <CollectionComponent collectionId={collectionId} />
      <div className={styles.desktopOnly}>
        <BlocCollections collectionsCartes={collectionsIframeCartes.filter(c => !c.lien.includes(collectionId))} />
      </div>
      <div className={styles.mobileOnly}>
        <BlocCollectionsResponsive collectionsCartes={collectionsIframeCartes.filter(c => !c.lien.includes(collectionId))} />
      </div>
      <ModaleToutesCollections collectionsCartes={collectionsIframeCartes} />
    </>
  )
};

export default Collections;
