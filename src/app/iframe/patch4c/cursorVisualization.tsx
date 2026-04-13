"use client";
import InfoIcon from '@/assets/icons/info_round_icon_black.svg';
import { HtmlTooltip } from '@/components/utils/Tooltips';
import { Body } from "@/design-system/base/Textes";
import Image from "next/image";
import { agravationItems } from './components/constantes';
import styles from './patch4c.module.scss';

const CursorVisualization = ({
  isMap
}: {
  isMap: boolean;
}) => {
  return (
    <div className={styles.CursorVisualizationBarColor} style={{ margin: isMap ? "0 auto !important" : "0 12.5rem 0 auto" }}>
      {
        agravationItems.map((item, index) => (
          <div key={index}>
            <div className={styles.barColorText} style={{ left: `calc(${index * 25}% + ${item.offset}px)` }}>
              <div className='flex flex-row items-center'>
                <Body size="sm">
                  {item.label}
                </Body>
                <HtmlTooltip
                  title={item.hover}
                  placement="top"
                >
                  <Image
                    src={InfoIcon}
                    alt="hover d'information"
                    width={20}
                    height={20}
                    className={styles.infoIcon}
                  />
                </HtmlTooltip>
              </div>
            </div>
            <div className={styles.cursor} style={{ left: item.values }} />
          </div>
        ))
      }
    </div>
  );
}

export default CursorVisualization;
