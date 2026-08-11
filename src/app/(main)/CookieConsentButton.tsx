'use client';

import CookieModal from '@/app/(main)/cookieModal';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';

const modal = createModal({
  id: 'cookie-modal',
  isOpenedByDefault: false
});

export const CookieConsentButton = () => {
  const posthog = usePostHog();

  const handleConsentChange = useCallback((consent: string) => {
    if (consent === 'all') {
      posthog.set_config({
        persistence: 'localStorage+cookie',
        person_profiles: 'always',
        disable_session_recording: false,
        capture_heatmaps: true
      });
      posthog.startSessionRecording();
    } else {
      posthog.set_config({
        persistence: 'memory',
        person_profiles: 'identified_only',
        disable_session_recording: true,
        capture_heatmaps: false
      });
    }
  }, [posthog]);

  return (
    <>
      <CookieModal modal={modal} setConsentGiven={handleConsentChange} />
      <button onClick={() => modal.open()}>ICI</button>
    </>
  );
};
