import { Body } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';
import styles from './mapsComponents.module.scss';

export const LegendBlockColor: React.FC<{ color: string; value: string; textStyle?: React.CSSProperties }> = ({
  color,
  value,
  textStyle
}: { color: string; value: string; textStyle?: React.CSSProperties }) => {
  return (
    <div className={styles.legendItem}>
      <div
        className={styles.legendColor}
        style={{ backgroundColor: color, opacity: '1' }}
      ></div>
      <Body size='sm' style={textStyle}>{value}</Body>
    </div>
  );
};

export const LegendBlockIcons: React.FC<{
  icon: StaticImageData;
  value: string;
}> = ({ icon, value }: { icon: StaticImageData; value: string }) => {
  return (
    <div className={styles.legendItem}>
      <div className={styles.legenIcon}>
        <Image src={icon} alt="" />
      </div>
      <Body size='sm'>{value}</Body>
    </div>
  );
};
