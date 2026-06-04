'use client';

import { Round } from '@/lib/utils/reusableFunctions/round';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, styled } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses
} from '@mui/material/AccordionSummary';
import { Progress } from 'antd';
import { useState } from 'react';
import styles from './charts.module.scss';

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  backgroundColor: 'white',
  borderRadius: '0',
  alignItems: 'center',
  flexDirection: 'row-reverse',
  height: '5rem',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transition: 'none',
    webkitTransition: 'none'
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    transition: 'none',
    webkitTransition: 'none',
    marginRight: '8px',
    marginLeft: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: '0',
    display: 'flex',
    alignItems: 'center'
  }
}));

const SubAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: 'white',
  border: 'none',
  '&:not(:last-child)': {
    borderRight: 0,
    borderLeft: 0
  },
  '&::before': {
    display: 'none'
  },
  borderBottom: "1px solid #D6D6F0",
}));

type graphDataItem = {
  [key: string]: {
    id: string;
    value: number | null;
    color: string;
  }[];
}

export const SubAccordionGraph = ({
  graphDataItem,
  superficieSau,
  isDefaultExpanded = false
}: {
  graphDataItem: graphDataItem;
  superficieSau: number;
  isDefaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(isDefaultExpanded);
  const accordionTitle = Object.keys(graphDataItem)[0];
  const sortedData = Object.values(graphDataItem)[0].toSorted((a, b) => Number(b.value) - Number(a.value));
  return (
    <SubAccordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        expandIcon={
          <>
            {!expanded ? (
              <ExpandMoreIcon sx={{ fontSize: '2rem', transform: 'rotate(-90deg)' }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: '2rem', transform: 'rotate(180deg)' }} />
            )}
          </>
        }
        onClick={() => setExpanded(!expanded)}
      >
        <p style={{ margin: '0', textTransform: "uppercase", fontSize: '14px' }}>
          <b style={{ color: "#666666" }}>{accordionTitle}</b>
        </p>
      </AccordionSummary>
      <div style={{ padding: '0 0 1rem' }}>
        {sortedData.map((item, index) => (
          <AccordionDetails key={index}>
            <div className={styles.progressDataWrapperSurfacesAgricoles}>
              <div className={styles.progressDesign}>
                <div className={styles.progressBar}>
                  <p>{item.id}</p>
                  <div>
                    <Progress
                      percent={100 * Number(item.value) / superficieSau}
                      showInfo={false}
                      strokeColor={item.color}
                      size={['100%', 12]}
                      style={{ width: '95%' }}
                      type="line"
                      trailColor="#F9F9FF"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.progressNumbers}>
                <p>
                  {
                    item.value === null
                      ? "Secret statistique"
                      : <b>{`${Round(item.value, 1)} ha`}</b>
                  }
                </p>
              </div>
            </div>
          </AccordionDetails>
        ))}
      </div>

    </SubAccordion>
  );
};
