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
        capture_pageview: false,
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
