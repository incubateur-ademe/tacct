import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import illustration from '@/assets/images/je-ne-sais-pas-bloc.png';
import { Body, H2 } from '@/design-system/base/Textes';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { NO_ANSWER_HELP_ID } from './NoAnswerHelpLink';

const LIEN_COLLECTION = '/ressources/demarrer-diagnostic-vulnerabilite';
const LIEN_CONTACT = 'https://tally.so/r/mJGELz';

const Item = ({ children }: { children: ReactNode }) => (
  <li>
    <Body htmlTag="span" size="md" color="#3d3d3d" style={{ lineHeight: '1.5rem' }}>
      {children}
    </Body>
  </li>
);

export const NoAnswerHelpBlock = () => (
  <section id={NO_ANSWER_HELP_ID} className={styles.noAnswerHelp}>
    <div className={styles.noAnswerHelpContent}>
      <H2
        color="#038278"
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          letterSpacing: 'normal',
          textAlign: 'center',
          margin: 0
        }}
      >
        Vous avez répondu “<em>Je ne sais pas</em>” à plusieurs questions
      </H2>
      <Body size="md" color="#3d3d3d" style={{ lineHeight: '1.5rem' }}>
        Voici des pistes pour trouver les réponses et compléter votre feuille de
        route :
      </Body>
      <ul className={styles.noAnswerHelpList}>
        <Item>
          <strong>Relisez vos documents</strong> de diagnostic, annexes incluses
        </Item>
        <Item>
          <strong>Échangez avec l’ancienne équipe projet</strong> : certaines
          informations n’ont peut-être pas été écrites
        </Item>
        <Item>
          <strong>Formez-vous à</strong> l’adaptation et la méthode TACCT -
          consultez notre collection thématique{' '}
          <Link href={LIEN_COLLECTION} className={styles.noAnswerHelpTextLink}>
            Démarrer le diagnostic de vulnérabilité
          </Link>
        </Item>
        <Item>
          <strong>Posez-nous</strong> vos questions directement{' '}
          <a
            href={LIEN_CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            title="Contacter l’équipe TACCT - nouvelle fenêtre"
            className={styles.noAnswerHelpTextLink}
          >
            en contactant l’équipe TACCT
          </a>
        </Item>
      </ul>
      <Image
        src={illustration}
        alt=""
        className={styles.noAnswerHelpIllustration}
      />
    </div>
  </section>
);
