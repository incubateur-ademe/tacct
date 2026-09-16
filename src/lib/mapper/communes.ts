import { CommunesContoursDto, CommunesIndicateursDto } from '../dto';
import { CarteCommunes } from '../postgres/models';

export const CommunesIndicateursMapper = (
  commune: CarteCommunes
): CommunesIndicateursDto => {
  const data = {
    type: 'Feature',
    properties: {
      catnat: commune.catnat,
      epci: commune.epci,
      libelle_epci: commune.libelle_epci,
      libelle_geographique: commune.libelle_geographique,
      code_geographique: commune.code_geographique,
      departement: commune.departement,
      libelle_departement: commune.libelle_departement,
      ept: commune.ept,
      libelle_petr: commune.libelle_petr,
      code_pnr: commune.code_pnr,
      libelle_pnr: commune.libelle_pnr,
      precarite_logement: commune.precarite_logement ?? NaN,
      coordinates: commune.coordinates,
      naf: commune.naf,
      surfacesIrriguees: commune.surfacesIrriguees ?? NaN,
      incendiesForet: commune.incendiesForet ?? NaN
    },
    geometry: JSON.parse(commune.geometry)
  };
  return data;
};

export const CommunesContourMapper = (
  commune: CarteCommunes
): CommunesContoursDto => ({
  type: 'Feature',
  properties: {
    epci: commune.epci,
    libelle_epci: commune.libelle_epci,
    libelle_geographique: commune.libelle_geographique,
    code_geographique: commune.code_geographique,
    coordinates: commune.coordinates
  },
  geometry: JSON.parse(commune.geometry)
});
