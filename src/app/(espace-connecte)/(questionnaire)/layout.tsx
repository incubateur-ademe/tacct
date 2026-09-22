import { type PropsWithChildren } from 'react';
import { LayoutSite, metadataSite } from '../../LayoutSite';

export const metadata = metadataSite;

const LayoutQuestionnaire = ({ children }: PropsWithChildren) => (
  <LayoutSite variante="epure">{children}</LayoutSite>
);

export default LayoutQuestionnaire;
