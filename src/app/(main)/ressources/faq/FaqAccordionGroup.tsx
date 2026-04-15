"use client";

import { CustomAccordion } from '@/design-system/base/Accordion';
import { H2 } from '@/design-system/base/Textes';
import { type FaqItem, type NotionRichText } from '@/lib/queries/notion/notion';
import { normalizeText } from '@/lib/utils/reusableFunctions/NormalizeTexts';
import { useState } from 'react';

type GroupedFaq = Record<string, FaqItem[]>;

const RichText = ({ richText }: { richText: NotionRichText[] }) => (
  <span style={{ whiteSpace: 'pre-line' }}>
    {richText.map((segment, i) => {
      let node: React.ReactNode = segment.plain_text;
      if (segment.annotations.bold) node = <strong key={i}>{node}</strong>;
      if (segment.annotations.italic) node = <em key={i}>{node}</em>;
      if (segment.annotations.strikethrough) node = <s key={i}>{node}</s>;
      if (segment.annotations.underline) node = <u key={i}>{node}</u>;
      if (segment.annotations.code) node = <code key={i}>{node}</code>;
      if (segment.href) node = <a key={i} href={segment.href} target="_blank" rel="noopener noreferrer">{node}</a>;
      return <span key={i}>{node}</span>;
    })}
  </span>
);

export const FaqAllGroups = ({ grouped }: { grouped: GroupedFaq }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {Object.entries(grouped).map(([categorie, faqItems]) => {
        const anchorId = normalizeText(categorie);
        const sorted = [...faqItems].sort((a, b) => {
          if (a.ordre === null) return 1;
          if (b.ordre === null) return -1;
          return a.ordre - b.ordre;
        });
        return (
          <section
            key={categorie}
            id={anchorId}
            style={{ marginBottom: '56px', scrollMarginTop: '2rem' }}
          >
            <H2 style={{ overflowWrap: 'normal', fontSize: '28px' }}>
              {categorie}
            </H2>
            <div style={{ width: '3rem', borderBottom: '1px solid #DDDDDD', marginBottom: '1.5rem' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sorted.map((item) => (
                <CustomAccordion
                  label={item.question}
                  key={item.id}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                >
                  <RichText richText={item.reponse} />
                </CustomAccordion>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
};
