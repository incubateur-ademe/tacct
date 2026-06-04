import { Button } from '@codegouvfr/react-dsfr/Button';
import { ModalProps } from '@codegouvfr/react-dsfr/Modal';
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch';
import { JSX, useState } from 'react';
import styles from './main.module.scss';

type CookieModalProps = {
  modal: {
    buttonProps: {
      id: string;
      'aria-controls': string;
      'data-fr-opened': boolean;
    };
    Component: (props: ModalProps) => JSX.Element;
    close: () => void;
    open: () => void;
    isOpenedByDefault: boolean;
    id: string;
  };
  setConsentGiven?: (value: string) => void;
};

const CookieModal = ({ modal, setConsentGiven }: CookieModalProps) => {
  const [areTermAccepted, setAreTermAccepted] = useState(true);
  const handleValidateCookies = () => {
    if (areTermAccepted) {
      localStorage.setItem('cookie_consent', 'all');
      setConsentGiven?.('all');
    } else {
      localStorage.setItem('cookie_consent', 'essential');
      setConsentGiven?.('essential');
    }
    modal.close();
  };

  return (
    <>
      {modal ? (
        <modal.Component title="Personnalisation des préférences">
          <div className={styles.cookieModalConsentContainer}>
            <div className={styles.cookieModalConsentWrapper}>
              <h2>Cookies obligatoires</h2>
              <p>
                Ces cookies sont nécessaires au bon fonctionnement du site. Vous
                ne pouvez pas les désactiver. Il sont utiles pour mesurer l'audience
                du site de façon anonyme.
              </p>
              <div
                className="container"
                style={{
                  width: '100%'
                }}
              >
                <ToggleSwitch
                  defaultChecked
                  disabled
                  helperText=""
                  inputTitle="the-title"
                  label="Cookies obligatoires"
                  labelPosition="right"
                  showCheckedHint
                />
              </div>
            </div>
            <div className={styles.cookieModalConsentWrapper}>
              <h2>Cookies facultatifs</h2>
              <p>
                Ces cookies correspondent aux enregistrements de session et de heatmaps réalisés par PostHog.
              </p>
              <div
                className="container"
                style={{
                  width: '100%'
                }}
              >
                <ToggleSwitch
                  helperText=""
                  inputTitle="the-title"
                  label="Cookies de suivi avec PostHog"
                  labelPosition="right"
                  showCheckedHint
                  checked={areTermAccepted}
                  onChange={(checked) => {
                    setAreTermAccepted(checked);
                  }}
                />
              </div>
            </div>
            <div className="self-center">
              <Button
                onClick={handleValidateCookies}
                priority="primary"
                size="medium"
                style={{ display: 'flex' }}
              >
                Valider mes choix
              </Button>
            </div>
          </div>
        </modal.Component>
      ) : (
        ''
      )}
    </>
  );
};

export default CookieModal;
