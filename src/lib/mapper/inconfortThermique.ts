import {
  AgeBatiDto,
  GrandAgeDto,
  travailExtDto,
  type VegetalisationDto
} from '../dto';
import { ConfortThermique } from '../postgres/models';

export const vegetalisationMapper = (
  vegetalisation: ConfortThermique | Partial<ConfortThermique>
): VegetalisationDto => ({
  code_geographique: vegetalisation.code_geographique!,
  libelle_geographique: vegetalisation.libelle_geographique!,
  epci: vegetalisation.epci!,
  libelle_epci: vegetalisation.libelle_epci!,
  ept: vegetalisation.ept!,
  libelle_petr: vegetalisation.libelle_petr!,
  libelle_pnr: vegetalisation.libelle_pnr!,
  code_pnr: vegetalisation.code_pnr!,
  departement: vegetalisation.departement!,
  libelle_departement: vegetalisation.libelle_departement!,
  clc_1_artificialise: Number(vegetalisation.clc_1_artificialise),
  clc_2_agricole: Number(vegetalisation.clc_2_agricole),
  clc_3_foret_semiNaturel: Number(vegetalisation.clc_3_foret_semiNaturel),
  clc_4_humide: Number(vegetalisation.clc_4_humide),
  clc_5_eau: Number(vegetalisation.clc_5_eau),
  superf_choro: Number(vegetalisation.superf_choro)
});

export const ageBatiMapper = (ageBati: ConfortThermique): AgeBatiDto => ({
  code_geographique: ageBati.code_geographique,
  libelle_geographique: ageBati.libelle_geographique,
  epci: ageBati.epci,
  libelle_epci: ageBati.libelle_epci,
  ept: ageBati.ept,
  libelle_petr: ageBati.libelle_petr,
  libelle_pnr: ageBati.libelle_pnr,
  code_pnr: ageBati.code_pnr,
  departement: ageBati.departement,
  libelle_departement: ageBati.libelle_departement,
  age_bati_pre_19: Number(ageBati.age_bati_pre_19),
  age_bati_19_45: Number(ageBati.age_bati_19_45),
  age_bati_46_90: Number(ageBati.age_bati_46_90),
  age_bati_91_05: Number(ageBati.age_bati_91_05),
  age_bati_post06: Number(ageBati.age_bati_post06)
});

export const travailExtMapper = (
  travailExt: ConfortThermique
): travailExtDto => ({
  code_geographique: travailExt.code_geographique,
  libelle_geographique: travailExt.libelle_geographique,
  epci: travailExt.epci,
  libelle_epci: travailExt.libelle_epci,
  ept: travailExt.ept,
  libelle_pnr: travailExt.libelle_pnr,
  code_pnr: travailExt.code_pnr,
  libelle_petr: travailExt.libelle_petr,
  departement: travailExt.departement,
  libelle_departement: travailExt.libelle_departement,
  NA5AZ_sum: Number(travailExt.NA5AZ_sum),
  NA5BE_sum: Number(travailExt.NA5BE_sum),
  NA5FZ_sum: Number(travailExt.NA5FZ_sum),
  NA5GU_sum: Number(travailExt.NA5GU_sum),
  NA5OQ_sum: Number(travailExt.NA5OQ_sum)
});

export const grandAgeMapper = (grandAge: ConfortThermique): GrandAgeDto => ({
  code_geographique: grandAge.code_geographique,
  libelle_geographique: grandAge.libelle_geographique,
  epci: grandAge.epci,
  libelle_epci: grandAge.libelle_epci,
  code_pnr: grandAge.code_pnr,
  libelle_pnr: grandAge.libelle_pnr,
  ept: grandAge.ept,
  libelle_petr: grandAge.libelle_petr,
  departement: grandAge.departement,
  libelle_departement: grandAge.libelle_departement,
  under_4_sum_1968: Number(grandAge.under_4_sum_1968),
  to_75_sum_1968: Number(grandAge['4_to_75_sum_1968']),
  over_75_sum_1968: Number(grandAge.over_75_sum_1968),
  under_4_sum_1975: Number(grandAge.under_4_sum_1975),
  to_75_sum_1975: Number(grandAge['4_to_75_sum_1975']),
  over_75_sum_1975: Number(grandAge.over_75_sum_1975),
  under_4_sum_1982: Number(grandAge.under_4_sum_1982),
  to_75_sum_1982: Number(grandAge['4_to_75_sum_1982']),
  over_75_sum_1982: Number(grandAge.over_75_sum_1982),
  under_4_sum_1990: Number(grandAge.under_4_sum_1990),
  to_75_sum_1990: Number(grandAge['4_to_75_sum_1990']),
  over_75_sum_1990: Number(grandAge.over_75_sum_1990),
  under_4_sum_1999: Number(grandAge.under_4_sum_1999),
  to_75_sum_1999: Number(grandAge['4_to_75_sum_1999']),
  over_75_sum_1999: Number(grandAge.over_75_sum_1999),
  under_4_sum_2006: Number(grandAge.under_4_sum_2006),
  to_75_sum_2006: Number(grandAge['4_to_75_sum_2006']),
  over_75_sum_2006: Number(grandAge.over_75_sum_2006),
  under_4_sum_2011: Number(grandAge.under_4_sum_2011),
  to_75_sum_2011: Number(grandAge['4_to_75_sum_2011']),
  over_75_sum_2011: Number(grandAge.over_75_sum_2011),
  under_4_sum_2016: Number(grandAge.under_4_sum_2016),
  to_75_sum_2016: Number(grandAge['4_to_75_sum_2016']),
  over_75_sum_2016: Number(grandAge.over_75_sum_2016),
  under_4_sum_2022: Number(grandAge.under_4_sum_2022),
  to_75_sum_2022: Number(grandAge['4_to_75_sum_2022']),
  over_75_sum_2022: Number(grandAge.over_75_sum_2022)
});
