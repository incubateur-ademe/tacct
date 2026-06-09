import { H1, H2 } from '@/design-system/base/Textes';
import { Container } from '@/design-system/server';
import { type Metadata } from 'next';
import { sharedMetadata } from '../shared-metadata';

const title = 'Plan du site';
const url = '/plan-du-site';

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    url
  },
  alternates: {
    canonical: url
  }
};

const PlanDuSite = () => (
  <Container my="4w">
    <H1>Plan du site</H1>
    <p style={{ marginBottom: '2.5rem', maxWidth: '52rem' }}>
      Cette page liste les pages principales de Facili-TACCT. Certaines pages
      ne sont accessibles qu&apos;après avoir sélectionné un territoire via le
      moteur de recherche : elles sont signalées ci-dessous par la mention
      <em> « territoire requis »</em>.
    </p>

    <nav aria-label="Plan du site">
      <H2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pages principales</H2>
      <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
        <li style={{ marginBottom: '0.75rem' }}>
          <a href="/">Accueil</a>
        </li>
        <li style={{ marginBottom: '0.75rem' }}>
          Explorer les données de mon territoire
          <ul style={{ listStyle: 'circle', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/recherche-territoire">Rechercher mon territoire</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Thématiques <em>(territoire requis)</em>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Données de votre territoire <em>(territoire requis)</em>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Diagnostiquer les impacts <em>(territoire requis)</em>
            </li>
          </ul>
        </li>
        <li style={{ marginBottom: '0.75rem' }}>
          Patch 4°C
          <ul style={{ listStyle: 'circle', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/recherche-territoire-patch4">Rechercher mon territoire</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Patch 4°C <em>(territoire requis)</em>
            </li>
          </ul>
        </li>
        <li style={{ marginBottom: '0.75rem' }}>
          <a href="/ressources">Boîte à outils</a>
        </li>
        <li style={{ marginBottom: '0.75rem' }}>
          <a
            href="https://tally.so/r/n0LrEZ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Communauté (nouvelle fenêtre)
          </a>
        </li>
      </ul>

      <H2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Informations légales et accessibilité
      </H2>
      <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>
          <a href="/accessibilite">Déclaration d&apos;accessibilité</a>
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <a href="/mentions-legales">Mentions légales</a>
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <a href="/politique-de-confidentialite">Politique de confidentialité</a>
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <a href="/politique-des-cookies">Politique des cookies</a>
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <a href="/statistiques">Statistiques</a>
        </li>
      </ul>
    </nav>
  </Container>
);

export default PlanDuSite;
