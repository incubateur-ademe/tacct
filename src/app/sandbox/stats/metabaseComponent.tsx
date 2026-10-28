"use client";
import { LoaderText } from '@/components/ui/loader';
import { NewContainer } from '@/design-system/layout';
import { useEffect, useState } from 'react';

const MetabaseComponent = ({ dashboardId, titre }: { dashboardId: number; titre: string }) => {
  const [src, setSrc] = useState<string>("");
  const [isIFrameLoaded, setIsIFrameLoaded] = useState(false);

  useEffect(() => {
    const params = { dashboardId };
    fetch(`/api/metabase?params=${JSON.stringify(params)}`)
      .then(r => r.json())
      .then(({ embedUrl }) => setSrc(embedUrl))
      .catch(console.error);
  }, [dashboardId]);

  if (!src) return <NewContainer size="xl"><LoaderText text='Chargement du tableau de bord' /></NewContainer>;

  return (
    <>
      {!isIFrameLoaded && <NewContainer size="xl"><LoaderText text='Chargement du tableau de bord' /></NewContainer>}
      <iframe
        src={src}
        title={`Tableau de bord ${titre}`}
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
