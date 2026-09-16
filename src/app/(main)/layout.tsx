import { type PropsWithChildren } from 'react';
import { LayoutSite, metadataSite } from '../LayoutSite';

export const metadata = metadataSite;

const LayoutMain = ({ children }: PropsWithChildren) => (
  <LayoutSite>{children}</LayoutSite>
);

export default LayoutMain;
