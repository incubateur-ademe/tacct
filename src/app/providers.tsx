'use client';
import { resoudreExclusionNavigateur } from '@/lib/analytics/exclusionNavigateur';
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
      // Doit être résolu avant init : sinon le premier $pageview part quand même.
      const navigateurExclu = resoudreExclusionNavigateur();
      const consent = cookieConsentGiven();
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: consent === 'all' ? 'localStorage+cookie' : 'memory',
        capture_pageview: false,
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
