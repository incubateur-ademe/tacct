'use client';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import styles from './main.module.scss';

export const cookieConsentGiven = () => {
  const stored = localStorage.getItem('cookie_consent');
  if (!stored) return 'undecided';
  if (stored !== 'all' && stored !== 'essential') {
    localStorage.removeItem('cookie_consent');
    return 'undecided';
  }
  return stored;
};

export const CookieBanner = () => {
  const [consentGiven, setConsentGiven] = useState('');
  const posthog = usePostHog();

  useEffect(() => {
    setConsentGiven(cookieConsentGiven());
  }, []);

  useEffect(() => {
    if (consentGiven !== '') {
      if (consentGiven === 'all') {
        posthog.set_config({
          persistence: 'localStorage+cookie',
          disable_session_recording: false,
          capture_heatmaps: true
        });
        posthog.startSessionRecording();
      } else {
        posthog.set_config({
          persistence: 'memory',
          disable_session_recording: true,
          capture_heatmaps: false
        });
      }
    }
  }, [consentGiven, posthog]);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setConsentGiven('all');
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setConsentGiven('essential');
  };

  return (
    <div>
      {consentGiven === 'undecided' && (
        <div className={styles.cookieConsentWrapper}>
          <p>
            Ce site utilise des cookies nécessaires à son bon fonctionnement.
            Pour améliorer votre expérience, certaines fonctionnalités s’appuient
            sur des services proposés par des tiers. Pour toute information
            supplémentaire, veuillez consulter notre{' '}
            <a
              href="/politique-des-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique des cookies
            </a>
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button
              type="button"
              onClick={handleAcceptAll}
              className={styles.acceptCookieBtn}
            >
              Accepter tous les cookies
            </button>
            <button
              type="button"
              onClick={handleAcceptEssential}
              className={styles.declineCookieBtn}
            >
              Cookies essentiels seulement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
