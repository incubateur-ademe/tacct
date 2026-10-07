import { GuillemetIcon } from '@/assets/svg/home/homeIcones';
import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { verbatimCards } from '@/lib/homeCards';
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
                <GuillemetIcon className={styles.guillemetIcon} />
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
