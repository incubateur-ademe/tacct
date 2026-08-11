'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { cookieConsentGiven } from './(main)/cookieBanner';

export const PHProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (
      !window.location.host.includes('127.0.0.1') &&
      !window.location.host.includes('localhost')
    ) {
      const consent = cookieConsentGiven();
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: consent === 'all' ? 'localStorage+cookie' : 'memory',
        // Les $pageview sont capturés manuellement (PostHogPageView.tsx) pour
        // suivre les navigations client de l'App Router. `capture_pageleave`
        // vaut par défaut 'if_capture_pageview' : sans ce `true` explicite, il
        // est désactivé en même temps que la capture automatique, et PostHog
        // ne peut plus calculer taux de rebond ni durée de session.
        capture_pageview: false,
        capture_pageleave: true,
        // Les profils Person ne sont créés qu'avec le consentement complet :
        // c'est ce qui alimente les analyses par personne (dashboard « Cycle
        // de vie »). Sans consentement, la persistance est en mémoire, donc un
        // profil serait recréé à chaque chargement de page.
        person_profiles: consent === 'all' ? 'always' : 'identified_only',
        disable_session_recording: consent !== 'all',
        capture_heatmaps: consent === 'all'
      });

      if (consent === 'all') {
        posthog.startSessionRecording();
      }
    }
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
