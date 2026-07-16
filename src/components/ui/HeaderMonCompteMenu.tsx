"use client";

import MonCompteIcone from '@/assets/icons/mon-compte-icon-green.svg';
import { Body } from '@/design-system/base/Textes';
import useWindowDimensions from '@/hooks/windowDimensions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useState } from 'react';
import styles from './Header.module.scss';

export const accountItemComp = (
  user: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
  } | null
) => {
  const posthog = usePostHog();
  const router = useRouter();
  const windowDimensions = useWindowDimensions();
  const wide = !!windowDimensions.width && windowDimensions.width > 700;
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    user ?
      (
        <div key="account-name" className={styles.accountWrapper}>
          <button
            type="button"
            className={styles.accountButton}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((value) => !value)}
          >
            <Image
              src={MonCompteIcone}
              alt=""
              width={wide ? 16 : 24}
              height={wide ? 16 : 24}
            />
            {wide && (
              <Body
                style={{ marginLeft: '0.5rem', color: 'var(--principales-vert)' }}
              >
                {`${user.firstname} ${user.lastname}`}
              </Body>
            )}
          </button>
          {accountMenuOpen && (
            <>
              <div
                className={styles.accountBackdrop}
                onClick={() => setAccountMenuOpen(false)}
                aria-hidden="true"
              />
              <div className={styles.accountMenu} role="menu">
                <Link
                  href="/mon-espace"
                  role="menuitem"
                  className={styles.accountMenuItem}
                  onClick={() => setAccountMenuOpen(false)}
                >
                  <span aria-hidden="true">→</span>
                  Accéder à mon espace
                </Link>
                <a
                  href="/api/proconnect/logout"
                  role="menuitem"
                  className={styles.accountMenuItem}
                  onClick={() => setAccountMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={wide ? 16 : 24}
                    height={wide ? 16 : 24}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 15H6V20H18V4H6V9H4V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"
                      fill="#161616"
                    />
                  </svg>
                  Se déconnecter
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          className="flex flex-row items-center"
          onClick={() => {
            posthog.capture('click_bouton_mon_compte_header', { date: new Date() });
            router.push('/mon-compte');
          }}
          key="mon-compte-header"
          aria-label="Mon compte"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={wide ? 16 : 24}
            height={wide ? 16 : 24}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 15H6V20H18V4H6V9H4V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"
              fill="#038278"
            />
          </svg>
          {wide && (
            <Body
              style={{ marginLeft: '0.5rem', color: 'var(--principales-vert)' }}
            >
              Se connecter
            </Body>
          )}
        </button>
      )
  )
};
