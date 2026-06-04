'use client';

import { Body } from '@/design-system/base/Textes';
import './legend.css';
import styles from './mapsComponents.module.scss';

interface Props {
  data: string;
  typeRisqueValue: string;
  catnatData: { code: string; name: string; catnat: {
      sumCatnat: number;
      indexName: string;
      Inondations?: number | undefined;
      'Gr\u00EAle / neige'?: number | undefined;
      Sécheresse?: number | undefined;
      'Cyclones / Temp\u00EAtes'?: number | undefined;
      'Retrait-gonflement des argiles'?: number | undefined;
      'Mouvements de terrain'?: number | undefined;
      Avalanche?: number | undefined;
    } }[];
}

export const colorsCatnat: { [key: string]: string[] } = {
  'Tous types': ['#FFECEE', '#FF9699', '#E8323B', '#B5000E', '#680000'],
  Inondations: ['#D8EFFA', '#6EC7F7', '#009ADC', '#0072B5', '#003F70'],
  Sécheresse: ['#FFFBE8', '#FEE29C', '#FFCF5E', '#D19800', '#533B00'],
  'Mouvements de terrain': [
    '#FFEEE5',
    '#FFAF84',
    '#F66E19',
    '#B64800',
    '#5E2000'
  ],
  'Retrait-gonflement des argiles': [
    '#F8E0F8',
    '#DB7BDD',
    '#BB43BD',
    '#89078E',
    '#560057'
  ],
  'Cyclones / Tempêtes': [
    '#DAFDFF',
    '#5EEDF3',
    '#00C2CC',
    '#00949D',
    '#005055'
  ],
  'Grêle / neige': ['#EBFDF6', '#6AEEC6', '#00C190', '#009770', '#004F3D'],
  Avalanche: ['#E9E2FA', '#A67FE1', '#7A49BE', '#5524A0', '#270757']
};

const getIntegersBetweenFloats = (minValue: number, maxValue: number) => {
  const list = [];
  for (let i = minValue; i <= maxValue + 1; i++) {
    const rounded = Math.round(i);
    if (minValue <= rounded) {
      if (maxValue > rounded) {
        list.push(rounded);
      }
    } else {
    }
  }
  return list;
};

const LegendBlock: React.FC<{ color: string; value: number }> = ({
  color,
  value
}: { color: string; value: number }) => {
  return (
    <div className={styles.legendItem}>
      <div
        className={styles.legendColor}
        style={{ backgroundColor: color, opacity: '1' }}
      ></div>
      <p>{value}</p>
    </div>
  );
};

export const LegendCatnat = (props: Props) => {
  const { typeRisqueValue, catnatData } = props;

  const minMaxValue = () => {
    if (typeRisqueValue === 'Tous types') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.sumCatnat ? el.catnat?.sumCatnat : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.sumCatnat ? el.catnat?.sumCatnat : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Sécheresse') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.['Sécheresse']
            ? el.catnat?.['Sécheresse']
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.['Sécheresse']
            ? el.catnat?.['Sécheresse']
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Cyclones / Tempêtes') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.['Cyclones / Tempêtes']
            ? el.catnat?.['Cyclones / Tempêtes']
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.['Cyclones / Tempêtes']
            ? el.catnat?.['Cyclones / Tempêtes']
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Retrait-gonflement des argiles') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.['Retrait-gonflement des argiles']
            ? el.catnat?.['Retrait-gonflement des argiles']
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.['Retrait-gonflement des argiles']
            ? el.catnat?.['Retrait-gonflement des argiles']
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Mouvements de terrain') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.['Mouvements de terrain']
            ? el.catnat?.['Mouvements de terrain']
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.['Mouvements de terrain']
            ? el.catnat?.['Mouvements de terrain']
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Inondations') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.Inondations
            ? el.catnat?.Inondations
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.Inondations
            ? el.catnat?.Inondations
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Grêle / neige') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.['Grêle / neige']
            ? el.catnat?.['Grêle / neige']
            : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.['Grêle / neige']
            ? el.catnat?.['Grêle / neige']
            : 0
        )
      );
      return [minValue, maxValue];
    } else if (typeRisqueValue === 'Avalanche') {
      const maxValue = Math.max(
        ...catnatData.map((el) =>
          el.catnat?.Avalanche ? el.catnat?.Avalanche : 0
        )
      );
      const minValue = Math.min(
        ...catnatData.map((el) =>
          el.catnat?.Avalanche ? el.catnat?.Avalanche : 0
        )
      );
      return [minValue, maxValue];
    } else {
      return [0, 0];
    }
  };
  const minMax = minMaxValue();
  const step0 = getIntegersBetweenFloats(0.1, (1 / 5) * minMax[1]);
  const step1 = getIntegersBetweenFloats(
    (1 / 5) * minMax[1],
    (2 / 5) * minMax[1]
  );
  const step2 = getIntegersBetweenFloats(
    (2 / 5) * minMax[1],
    (3 / 5) * minMax[1]
  );
  const step3 = getIntegersBetweenFloats(
    (3 / 5) * minMax[1],
    (4 / 5) * minMax[1]
  );
  const step4 = getIntegersBetweenFloats(
    (4 / 5) * minMax[1],
    (5 / 5) * minMax[1]
  );

  return (
    <div className={styles.legendItemsWrapper}>
      {minMax[1] > 5 ? (
        colorsCatnat[typeRisqueValue].map((color, index) => {
          return (
            <div className={styles.legendItem} key={index}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: color, opacity: '1' }}
              ></div>
              {index === 0 ? (
                step0.at(-1) === 1 ? (
                  <Body size="sm">1</Body>
                ) : (
                  <Body size="sm">&#8804;{step0.at(-1)}</Body>
                )
              ) : index === 1 ? (
                step1.at(0) === step1.at(-1) ? (
                  <Body size="sm">{step1.at(0)}</Body>
                ) : (
                  <Body size="sm">
                    {step1.at(0)}-{step1.at(-1)}
                  </Body>
                )
              ) : index === 2 ? (
                step2.at(0) === step2.at(-1) ? (
                  <Body size="sm">{step2.at(0)}</Body>
                ) : (
                  <Body size="sm">
                    {step2.at(0)}-{step2.at(-1)}
                  </Body>
                )
              ) : index === 3 ? (
                step3.at(0) === step3.at(-1) ? (
                  <Body size="sm">{step3.at(0)}</Body>
                ) : (
                  <Body size="sm">
                    {step3.at(0)}-{step3.at(-1)}
                  </Body>
                )
              ) : (
                <Body size="sm">&#x2265;{step4.at(0)}</Body>
              )}
            </div>
          );
        })
      ) : minMax[1] === 1 ? (
        <LegendBlock color={colorsCatnat[typeRisqueValue][2]} value={minMax[1]} />
      ) : minMax[1] === 2 ? (
        <>
          <LegendBlock color={colorsCatnat[typeRisqueValue][1]} value={1} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][3]} value={2} />
        </>
      ) : minMax[1] === 3 ? (
        <>
          <LegendBlock color={colorsCatnat[typeRisqueValue][0]} value={1} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][2]} value={2} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][4]} value={3} />
        </>
      ) : minMax[1] === 4 ? (
        <>
          <LegendBlock color={colorsCatnat[typeRisqueValue][0]} value={1} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][2]} value={2} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][3]} value={3} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][4]} value={4} />
        </>
      ) : (
        <>
          <LegendBlock color={colorsCatnat[typeRisqueValue][0]} value={1} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][1]} value={2} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][2]} value={3} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][3]} value={4} />
          <LegendBlock color={colorsCatnat[typeRisqueValue][4]} value={5} />
        </>
      )}
    </div>
  );
};
