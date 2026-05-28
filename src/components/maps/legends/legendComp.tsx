import { StaticImageData } from 'next/image';
import { LegendBlockColor, LegendBlockIcons } from './legendBlocks';
import styles from './mapsComponents.module.scss';

type LegendColor = {
  color: string;
  value: string;
};

type LegendIcon = {
  icon: StaticImageData;
  value: string;
};

export const LegendCompColor = (
  {
    legends, style, textStyle
  }: {
    legends: LegendColor[], style?: React.CSSProperties; textStyle?: React.CSSProperties;
  }) => {
  return (
    <div className={styles.legendItemsWrapper} style={style}>
      {legends.map((el, index) => (
        <LegendBlockColor key={index} color={el.color} value={el.value} textStyle={textStyle} />
      ))}
    </div>
  );
};

export const LegendCompIcons = ({ legends }: { legends: LegendIcon[] }) => {
  return (
    <div className={styles.legendItemsWrapper}>
      {legends.map((el, index) => (
        <LegendBlockIcons key={index} icon={el.icon} value={el.value} />
      ))}
    </div>
  );
};

export const LegendCompColorLCZ = ({ legends }: { legends: LegendColor[] }) => {
  return (
    <div className={styles.legendItemsLCZWrapper}>
      {legends.map((el, index) => (
        <LegendBlockColor key={index} color={el.color} value={el.value} />
      ))}
    </div>
  );
};
