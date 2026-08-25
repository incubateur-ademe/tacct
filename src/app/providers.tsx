'use client';
import { resoudreExclusionNavigateur } from '@/lib/analytics/exclusionNavigateur';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { cookieConsentGiven } from './(main)/cookieBanner';

export const PHProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // TEMPORAIRE (recette survey TACCToscope) : rétablir l'exclusion du local
    // en repassant AUTORISER_POSTHOG_EN_LOCAL à false.
    const AUTORISER_POSTHOG_EN_LOCAL = true;
    const enLocal =
      window.location.host.includes('127.0.0.1') ||
      window.location.host.includes('localhost');

    if (!enLocal || AUTORISER_POSTHOG_EN_LOCAL) {
      // Doit être résolu avant init : sinon le premier $pageview part quand même.
      const navigateurExclu = resoudreExclusionNavigateur();
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
        disable_session_recording: navigateurExclu || consent !== 'all',
        capture_heatmaps: !navigateurExclu && consent === 'all',
        opt_out_capturing_by_default: navigateurExclu,
        // Coupe aussi les appels /flags et /array/<token>/config
        advanced_disable_flags: navigateurExclu
      });

      if (!navigateurExclu && consent === 'all') {
        posthog.startSessionRecording();
      }
    }
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
