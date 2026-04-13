import { GeoGeometryObjects } from 'd3';

export type VegetalisationDto = {
  clc_1_artificialise: number;
  clc_2_agricole: number;
  clc_3_foret_semiNaturel: number;
  clc_4_humide: number;
  clc_5_eau: number;
  superf_choro: number;
  code_geographique: string;
  epci: string;
  libelle_epci: string;
  libelle_geographique: string;
  ept: string | null;
  libelle_petr: string | null;
  libelle_pnr: string | null;
  code_pnr: string | null;
  departement: string;
  libelle_departement: string;
};

export type AgeBatiDto = {
  code_geographique: string;
  libelle_geographique: string;
  epci: string;
  libelle_epci: string;
  ept: string | null;
  libelle_petr: string | null;
  libelle_pnr: string | null;
  code_pnr: string | null;
  departement: string;
  libelle_departement: string;
  age_bati_pre_19: number;
  age_bati_19_45: number;
  age_bati_46_90: number;
  age_bati_91_05: number;
  age_bati_post06: number;
};

export type travailExtDto = {
  NA5AZ_sum: number;
  NA5BE_sum: number;
  NA5FZ_sum: number;
  NA5GU_sum: number;
  NA5OQ_sum: number;
  code_geographique: string;
  epci: string;
  libelle_epci: string;
  libelle_geographique: string;
  ept: string | null;
  libelle_petr: string | null;
  libelle_pnr: string | null;
  code_pnr: string | null;
  departement: string;
  libelle_departement: string;
};

export type GrandAgeDto = {
  code_geographique: string;
  epci: string;
  libelle_epci: string;
  libelle_geographique: string;
  code_pnr: string | null;
  libelle_pnr: string | null;
  ept: string | null;
  libelle_petr: string | null;
  departement: string;
  libelle_departement: string;
  over_75_sum_1968?: number;
  over_75_sum_1975?: number;
  over_75_sum_1982?: number;
  over_75_sum_1990?: number;
  over_75_sum_1999?: number;
  over_75_sum_2006?: number;
  over_75_sum_2011?: number;
  over_75_sum_2016?: number;
  over_75_sum_2022?: number;
  to_75_sum_1968?: number;
  to_75_sum_1975?: number;
  to_75_sum_1982?: number;
  to_75_sum_1990?: number;
  to_75_sum_1999?: number;
  to_75_sum_2006?: number;
  to_75_sum_2011?: number;
  to_75_sum_2016?: number;
  to_75_sum_2022?: number;
  under_4_sum_1968?: number;
  under_4_sum_1975?: number;
  under_4_sum_1982?: number;
  under_4_sum_1990?: number;
  under_4_sum_1999?: number;
  under_4_sum_2006?: number;
  under_4_sum_2011?: number;
  under_4_sum_2016?: number;
  under_4_sum_2022?: number;
};

export type CommunesIndicateursDto = {
  type: string;
  properties: {
    catnat?: {
      Inondations?: number;
      'Grêle / neige'?: number;
      Sécheresse?: number;
      'Cyclones / Tempêtes'?: number;
      'Retrait-gonflement des argiles'?: number;
      'Mouvements de terrain'?: number;
      Avalanche?: number;
      sumCatnat?: number;
      indexName?: string;
    };
    epci: string;
    libelle_epci: string;
    libelle_geographique: string;
    code_geographique: string;
    ept: string;
    libelle_petr: string;
    code_pnr: string;
    libelle_pnr: string;
    departement: string;
    libelle_departement: string;
    precarite_logement: number;
    coordinates: string;
    naf?: number | null;
    surfacesIrriguees?: number;
    incendiesForet?: number | null;
    rga?: number;
  };
  geometry: {
    coordinates: number[][][][];
    type: string;
  };
};

export type CommunesContoursDto = {
  type: string;
  properties: {
    epci: string;
    libelle_epci: string;
    libelle_geographique: string;
    code_geographique: string;
    coordinates: string;
  };
  geometry: {
    coordinates: number[][][][];
    type: string;
  };
};

export type ClcDto = {
  geometry: GeoGeometryObjects;
  properties: {
    centroid: string;
    label: string;
  };
  type: string;
};

export type ErosionCotiereDto = {
  geometry: {
    coordinates: number[][][];
    type: string;
  };
  type: string;
  properties: {
    taux: number;
  };
};

export type EpciContoursDto = {
  geometry: {
    coordinates: number[][][][];
    type: string;
  };
  type: string;
  properties: {
    epci_code: string;
  };
};

type SurfacesProtegessChildren = {
  name: string;
  color: string;
  loc: number;
};

export type SurfacesProtegeesDto = {
  name: string;
  color: string;
  children: {
    name: string;
    color: string;
    loc?: number;
    children?: SurfacesProtegessChildren[];
  }[];
};

export type EtatCoursDeauDto = {
  geometry: {
    coordinates: number[][][];
    type: string;
  };
  type: string;
  properties: {
    etateco: string | null;
    name: string;
  };
};

export type RGADto = {
  type: string;
  properties: {
    code_geographique: string;
    alea: string;
  };
  geometry: {
    coordinates: number[][][][];
    type: string;
  };
};

export type DebroussaillementDto = {
  geometry: GeoGeometryObjects;
  properties: {};
  type: string;
};
