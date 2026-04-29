"use client";
import { LoaderText } from '@/components/ui/loader';
import { Body } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { useEffect, useState } from 'react';

const MetabaseComponent = () => {
  const [src, setSrc] = useState<string>("");
  const [isIFrameLoaded, setIsIFrameLoaded] = useState(false);

  useEffect(() => {
    const params = { dashboardId: 5 };
    fetch(`/api/metabase?params=${JSON.stringify(params)}`)
      .then(r => r.json())
      .then(({ embedUrl }) => setSrc(embedUrl))
      .catch(console.error);
  }, []);

  if (!src) return <NewContainer size="xl"><LoaderText text='Chargement du tableau de bord' /></NewContainer>;

  return (
    <>
      <NewContainer size="xl">
        <Body>
          <i>
            Cette page présente les statistiques d’utilisation du site TACCT.
            Veuillez noter qu’il s’agit d’une page en cours de construction, de
            nouvelles données viendront progressivement l’enrichir.
          </i>
        </Body>
      </NewContainer>
      {!isIFrameLoaded && <NewContainer size="xl"><LoaderText text='Chargement du tableau de bord' /></NewContainer>}
      <iframe
        src={src}
        title="Tableau de bord stats"
        width="100%"
        height="3100"
        onLoad={() => setIsIFrameLoaded(true)}
        className='border-none'
        style={{ display: isIFrameLoaded ? 'block' : 'none' }}
      />
    </>
  );
};

export default MetabaseComponent;
