/* eslint typescript-sort-keys/interface: error */
import { StaticImageData } from 'next/image';
import { type ReactNode } from 'react';

type SearchResult = {
  children: ReactNode;
  id: string;
  prefix?: ReactNode;
  route: string;
};

type SearchParams = Promise<{
  code: string;
  libelle: string;
  thematique: string;
  type: string;
  title?: string;
}>;

type GenericObject = {
  [key: string]: string | string[] | number | bigint | null;
};

type CatnatTypes =
  | 'Inondations'
  | 'Grêle / neige'
  | 'Sécheresse'
  | 'Cyclones / Tempêtes'
  | 'Retrait-gonflement des argiles'
  | 'Mouvements de terrain'
  | 'Tous types'
  | 'Avalanche';

type DataByCodeGeographique = {
  indexName: string;
  Inondations?: number;
  'Grêle / neige'?: number;
  Sécheresse?: number;
  'Cyclones / Tempêtes'?: number;
  'Retrait-gonflement des argiles'?: number;
  'Mouvements de terrain'?: number;
  Avalanche?: number;
};
type TabIcons = {
  name: string;
  iconNotSelected: StaticImageData;
  iconSelected: StaticImageData;
};

type PrelevementsEauYears =
  | 'A2008'
  | 'A2009'
  | 'A2010'
  | 'A2011'
  | 'A2012'
  | 'A2013'
  | 'A2014'
  | 'A2015'
  | 'A2016'
  | 'A2017'
  | 'A2018'
  | 'A2019'
  | 'A2020';

interface RichText {
  type: string;
  text: {
    content: string;
    link?: { url: string };
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text?: string;
  href?: string;
}

interface BlockType {
  rich_text?: RichText[];
  caption?: RichText[];
  type?: string;
  file?: {
    url: string;
    expiry_time: string;
  };
  external?: { url: string };
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  color?: string;
}

interface Block {
  object: string;
  id: string;
  parent: {
    type: string;
    page_id: string;
  };
  created_time: string;
  last_edited_time: string;
  created_by: { object: string; id: string };
  last_edited_by: { object: string; id: string };
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
  type:
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'image'
    | 'callout'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'column_list'
    | 'column'
    | 'quote'
    | 'table'
    | 'table_row';
  paragraph?: { rich_text: RichText[]; color: string };
  callout?: {
    rich_text: RichText[];
    icon?: {
      type: 'emoji' | 'external' | 'file';
      emoji?: string;
      external?: { url: string };
      file?: { url: string };
    };
    color: string;
  };
  heading_1?: { rich_text: RichText[]; is_toggleable?: boolean; color: string };
  heading_2?: { rich_text: RichText[]; is_toggleable?: boolean; color: string };
  heading_3?: { rich_text: RichText[]; is_toggleable?: boolean; color: string };
  image?: {
    caption: RichText[];
    type: string;
    file?: { url: string };
    external?: { url: string };
  };
  bulleted_list_item?: { rich_text: RichText[]; color: string };
  numbered_list_item?: { rich_text: RichText[]; color: string };
  column_list?: Record<string, never>;
  column?: Record<string, never>;
  quote?: { rich_text: RichText[]; color: string };
  table?: { table_width: number; has_column_header: boolean; has_row_header: boolean };
  table_row?: { cells: RichText[][] };
}
