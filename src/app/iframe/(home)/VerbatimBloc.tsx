import GuillemetIcon from '@/assets/icons/guillemet_icon_white.svg';
import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { verbatimCards } from '@/lib/homeCards';
import Image from 'next/image';
import styles from './home.module.scss';

export const VerbatimBloc = () => {
  return (
    <div className={styles.verbatimContainer}>
      <NewContainer size="xl">
        <H2 style={{ color: 'white' }}>Vos témoignages</H2>
        <div className={styles.verbatimCardsWrapper}>
          {verbatimCards.map((card, index) => (
            <div key={index} className={styles.verbatimCard}>
              <div className={styles.quote}>
                <Image
                  src={GuillemetIcon}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.guillemetIcon}
                />
                <Body style={{ color: 'white', fontStyle: 'italic' }}>{card.description}</Body>
              </div>
              <Body
                size="sm"
                weight='bold'
                style={{
                  color: 'white',
                  textAlign: 'right',
                }}
              >
                {card.personne}
              </Body>
            </div>
          ))}
        </div>
      </NewContainer>
    </div>
  );
};
