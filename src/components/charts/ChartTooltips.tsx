import { Body, H4 } from '@/design-system/base/Textes';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Any } from '@/lib/utils/types';
import { BarDatum, BarTooltipProps } from '@nivo/bar';
import { DefaultRawDatum, PieTooltipProps } from '@nivo/pie';
import {
  espacesNAFBarChartLegend,
  RgaEvolutionLegend,
  RgaRepartitionLegend
} from '../maps/legends/datavizLegends';
import styles from './charts.module.scss';

export const simplePieChartTooltip = ({
  datum,
  unite
}: {
  datum: PieTooltipProps<DefaultRawDatum>['datum'];
  unite?: string;
}) => {
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <div className={styles.itemWrapper}>
        <div className={styles.titre}>
          <div
            className={styles.colorSquare}
            style={{ background: datum.color }}
          />
          <Body size="sm">
            {datum.id ? datum.id : datum.label} :{' '}
            <b>
              {Round(Number(datum.value), 1)} {unite ?? null}
            </b>
          </Body>
        </div>
      </div>
    </div>
  );
};

type PieChartCount = {
  arc: Any;
  color: string;
  data: {
    id: string;
    label: string;
    value: number;
    count: number;
  };
  id: number;
  label: number;
  value: number;
  hidden: boolean;
  formattedValue: string;
};

export const simplePieChartCountTooltip = ({
  datum,
  unite,
  arrondi = 1
}: {
  datum: PieChartCount;
  unite?: string;
  arrondi?: number;
}) => {
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <div className={styles.itemWrapper}>
        <div className={styles.titre}>
          <div
            className={styles.colorSquare}
            style={{ background: datum.color }}
          />
          <Body size="sm">
            {datum.id ? datum.id : datum.label} :{' '}
            <b>
              {Round(Number(datum.data.count), arrondi)} {unite ?? null}
            </b>{' '}
            ({Round(Number(datum.value), 1)} %)
          </Body>
        </div>
      </div>
    </div>
  );
};

export const simpleBarChartTooltip = ({
  data,
  legende,
  unite,
  multiplicateur,
  arrondi = 2
}: {
  data: BarDatum;
  legende: Array<{ value: string; color: string }>;
  unite?: string;
  multiplicateur?: number;
  arrondi?: number;
}) => {
  const dataArray = Object.entries(data).map((el) => {
    return {
      titre: el[0],
      value: el[1],
      color: legende.find((e) => e.value === el[0])?.color
    };
  });
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <H4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
        {dataArray.at(-1)?.value}
      </H4>
      {dataArray.slice(0, -1).map((el, i) => {
        return (
          <div className={styles.itemWrapper} key={i}>
            <div className={styles.titre}>
              <div
                className={styles.colorSquare}
                style={{ background: el.color }}
              />
              <Body size="sm">{el.titre} :</Body>
              {multiplicateur ? (
                <Body size="sm" weight="bold">
                  {Round(multiplicateur * Number(el.value), arrondi)}{' '}
                  {unite ?? null}
                </Body>
              ) : (
                <Body size="sm" weight="bold">
                  {Round(Number(el.value), arrondi)} {unite ?? null}
                </Body>
              )}
            </div>
            <div className={styles.value}></div>
          </div>
        );
      })}
    </div>
  );
};

export const RgaRepartitionTooltip = ({
  data,
  type
}: {
  data: BarTooltipProps<BarDatum>;
  type: string;
}) => {
  const dataArray = Object.entries(data.data).map((el) => {
    return {
      titre:
        el[0] === 'territoire' && type === 'commune'
          ? 'Commune'
          : el[0] === 'territoire' && type === 'epci'
            ? 'EPCI'
            : el[0] === 'territoireSup' && type === 'commune'
              ? 'EPCI'
              : el[0] === 'territoireSup' && type === 'epci'
                ? 'Département'
                : '',
      value: el[1],
      color: RgaRepartitionLegend.find((e) => e.variable === el[0])?.couleur
    };
  });
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <H4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
        {dataArray.at(-1)?.value}
      </H4>
      {dataArray.slice(0, -1).map((el, i) => {
        return (
          <div className={styles.itemWrapper} key={i}>
            <div className={styles.titre}>
              <div
                className={styles.colorSquare}
                style={{ background: el.color }}
              />
              <Body size="sm">{el.titre}</Body>
            </div>
            <div className={styles.value}>
              <Body size="sm" weight="bold">
                {Round(Number(el.value), 1)} %
              </Body>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RgaEvolutionTooltip = ({ data }: BarTooltipProps<BarDatum>) => {
  const dataArray = Object.entries(data).map((el) => {
    return {
      titre:
        el[0] === 'nb_logement_alea_faible'
          ? 'Exposition faible'
          : 'Exposition moyenne / forte',
      value: el[1],
      color: RgaEvolutionLegend.find((e) => e.variable === el[0])?.couleur
    };
  });
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <H4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
        {dataArray.at(-1)?.value}
      </H4>
      {dataArray.slice(0, -1).map((el, i) => {
        return (
          <div className={styles.itemWrapper} key={i}>
            <div className={styles.titre}>
              <div
                className={styles.colorSquare}
                style={{ background: el.color }}
              />
              <Body size="sm">{el.titre}</Body>
            </div>
            <div className={styles.value}>
              <Body size="sm" weight="bold">
                {Round(Number(el.value), 0)} logements
              </Body>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const espacesNAFBarChartTooltip = ({
  data
}: BarTooltipProps<BarDatum>) => {
  const dataArray = Object.entries(data).map((el) => {
    return {
      titre: el[0],
      value: el[1],
      color: espacesNAFBarChartLegend.find((e) => e.value === el[0])?.color
    };
  });
  return (
    <div className={styles.tooltipEvolutionWrapper}>
      <Body weight="bold" size="sm" style={{ marginBottom: '0.5rem' }}>
        Années {dataArray.at(-1)?.value}
      </Body>
      {dataArray.slice(0, -1).map((el, i) => {
        return (
          <div className={styles.itemWrapper} key={i}>
            <div className={styles.titre}>
              <div
                className={styles.colorSquare}
                style={{ background: el.color }}
              />
              <Body size="sm">{el.titre}</Body>
            </div>
            <div className={styles.value}>
              <Body size="sm" weight="bold">
                {Round(Number(el.value), 1)} ha
              </Body>
            </div>
          </div>
        );
      })}
    </div>
  );
};
