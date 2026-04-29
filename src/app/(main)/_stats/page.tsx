"use client";
import { LoaderText } from '@/components/ui/loader';
import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { useEffect, useState } from 'react';

const CACHE_KEY = 'metabase-embed-cache';

const Page = () => {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isIFrameLoaded, setIsIFrameLoaded] = useState(false);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const params = { dashboardId: 4 };
        const response = await fetch(`/api/metabase?params=${JSON.stringify(params)}`);
        const { embedUrl, exp }: { embedUrl: string; exp: number } = await response.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify({ embedUrl, exp }));

        setSrc(embedUrl);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { embedUrl, exp }: {
        embedUrl: string;
        exp: number;
      } = JSON.parse(cached);
      const now = Math.floor(Date.now() / 1000);
      if (exp > now + 60) {
        setSrc(embedUrl);
        setLoading(false);
        fetchEmbedUrl();
        return;
      }
    }

    fetchEmbedUrl();
  }, []);

  if (loading && !isIFrameLoaded) {
    return (
      <>
        <NewContainer size="xl">
          <H1>Statistiques</H1>
          <div style={{ minHeight: 300, maxWidth: 1200, margin: 'auto' }}>
            <LoaderText text='Chargement du tableau de bord' />
          </div>
        </NewContainer>
      </>
    );
  }

  return (
    <>
      <NewContainer size="xl">
        <H1>Statistiques</H1>
        <Body>
          <i>
            Cette page présente les statistiques d'utilisation du site TACCT.
            Veuillez noter qu'il s'agit d'une page en cours de construction, de
            nouvelles données viendront progressivement l'enrichir.
          </i>
        </Body>
        {
          src &&
          <iframe
            src={src}
            title="Tableau de bord stats"
            width="100%"
            height="1800"
            onLoad={() => setIsIFrameLoaded(true)}
            className='border-none'
          />
        }
      </NewContainer>
    </>
  );
};

export default Page;
