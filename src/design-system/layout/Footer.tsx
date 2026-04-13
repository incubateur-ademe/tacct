"use client";

import Image from "next/image";

export default function AppFooter() {
  return (
    <footer
      className="fr-footer !mt-0 !pt-0 bg-white relative"
      role="contentinfo"
      id="footer"
      style={{ zIndex: 999, boxShadow: "none" }}
    >
      <hr className="pb-6" />
      <div className="fr-container">
        <div className="fr-footer__body">
          {/* Logos/Images */}
          <div className="fr-footer__brand-logos flex flex-row flex-wrap items-center gap-8">
            <div className="fr-logo !text-[1rem]">
              République
              <br />
              Française
            </div>
            <Image
              className="fr-footer__logo"
              height={200}
              width={80}
              src={"/logo-ademe.png"}
              alt={"ADEME logo"}
            />
            <Image
              className="fr-footer__logo max-w-[8rem]"
              height={200}
              width={95}
              src={"/logo-meteo-france.jpg"}
              alt={"Logo Météo France"}
            />
          </div>
          <div className="fr-footer__content">
            {/* Description */}
            <p className="fr-footer__content-desc">
              TACCT est un service porté par l’Agence de la transition écologique
              (ADEME), en partenariat avec Météo France.
              <br></br>
              Notre mission : Aider chaque territoire à initier ou renforcer sa démarche 
              d’adaptation au changement climatique.
              TACCT met à disposition les données climatiques du patch 4°C,
              mesure 23 du plan national d’adaptation au changement climatique (PNACC 3).
            </p>
            {/* Liste de liens */}
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  title="Agir pour la transition - nouvelle fenêtre"
                  href="https://agirpourlatransition.ademe.fr"
                >
                  agirpourlatransition.ademe.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  title="Data Gouv - nouvelle fenêtre"
                  href="https://data.gouv.fr"
                >
                  data.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  title="ADEME - nouvelle fenêtre"
                  href="https://www.ademe.fr"
                >
                  ademe.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  title="Beta Gouv - nouvelle fenêtre"
                  href="https://beta.gouv.fr"
                >
                  beta.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="https://tally.so/r/mJGELz" rel="noopener noreferrer external" target="_blank">
                Contactez-nous
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/accessibilite">
                Accessibilité : non conforme
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/mentions-legales">
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/politique-de-confidentialite">
                Politique de confidentialité
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/politique-des-cookies">
                Politique des cookies
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/statistiques">
                Statistiques
              </a>
            </li>
            {/* <li className="fr-footer__bottom-item">
              <button {...headerFooterDisplayItem.buttonProps}
                className="fr-footer__bottom-link"
                id='fr-theme-modal-control-button'
                aria-controls='fr-theme-modal'
                data-fr-opened={false}
              >
                <span
                  className={headerFooterDisplayItem.iconId}
                  style={{ marginRight: '0.5rem' }}
                  aria-hidden="true"
                />
                <style jsx>{`
            .${headerFooterDisplayItem.iconId}::before {
            width: 1rem;
            }
          `}</style>
                {headerFooterDisplayItem.text}
              </button>
            </li> */}
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont
              proposés sous{" "}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="noopener noreferrer external"
                title="Voir la licence Etalab 2.0 - nouvelle fenêtre"
                target="_blank"
              >
                licence etalab-2.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
