'use server';

import { CarteCommunes, ErosionCotiere } from '@/lib/postgres/models';
import { eptRegex } from '@/lib/utils/regex';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

export const GetCommunes = async (
  code: string,
  libelle: string,
  type: string
): Promise<CarteCommunes[]> => {
  //race Promise pour éviter un crash de la requête lorsqu'elle est trop longue
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 6000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.postgis_v2_communes_drom.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        if (type === 'commune') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
            epci, 
            libelle_epci,
            libelle_geographique,
            code_geographique,
            ept,
            libelle_petr,
            code_pnr,
            libelle_pnr,
            departement,
            libelle_departement,
            region,
            coordinates, 
            precarite_logement,
            surface,
            ST_AsGeoJSON(geometry) geometry 
            FROM postgis_v2."communes_drom" 
            WHERE epci = (
              SELECT epci FROM postgis_v2."communes_drom" WHERE code_geographique = ${code} LIMIT 1
              );`;
          return value;
        } else if (type === 'ept' && eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              epci, 
              libelle_epci,
              libelle_geographique,
              code_geographique,
              ept,
              libelle_petr,
              code_pnr,
              libelle_pnr,
              departement,
              libelle_departement,
              region,
              coordinates, 
              precarite_logement,
              surface,
              ST_AsGeoJSON(geometry) geometry 
              FROM postgis_v2."communes_drom" WHERE epci='200054781';`;
          return value;
        } else if (type === 'epci' && !eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
            epci, 
            libelle_epci,
            libelle_geographique,
            code_geographique,
            ept,
            departement,
            libelle_departement,
            coordinates, 
            precarite_logement,
            surface,
            ST_AsGeoJSON(geometry) geometry 
            FROM postgis_v2."communes_drom" WHERE epci=${code};`;
          return value;
        } else if (type === 'pnr') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT 
            libelle_geographique,
            code_geographique,
            code_pnr,
            libelle_pnr,
            departement,
            libelle_departement,
            coordinates, 
            precarite_logement,
            surface,
            ST_AsGeoJSON(geometry) geometry 
            FROM postgis_v2."communes_drom" WHERE code_pnr IS NOT NULL AND code_pnr=${code};`;
          return value;
        } else if (type === 'petr') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              libelle_geographique,
              code_geographique,
              departement,
              libelle_departement,
              coordinates, 
              precarite_logement,
              surface,
              ST_AsGeoJSON(geometry) geometry 
              FROM postgis_v2."communes_drom" WHERE libelle_petr IS NOT NULL AND libelle_petr=${libelle};`;
          return value;
        } else {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              code_geographique,
              departement,
              libelle_departement,
              coordinates,
              precarite_logement,
              surface,
              ST_AsGeoJSON(geometry) geometry 
              FROM postgis_v2."communes_drom" WHERE departement=${code};`;
          return value;
        }
      }
    } catch (error) {
      console.error(error);
      console.error('Database connection error occurred.');
      return [];
    }
  })();

  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetCommunesCoordinates = async (
  code: string,
  libelle: string,
  type: string
): Promise<{
  codes: string[];
  bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
} | null> => {
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, 6000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return null;
      const exists = await prisma.postgis_v2_communes_drom.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return null;

      // Construire la requête selon le type de territoire
      let result;

      if (type === 'commune') {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE epci = (SELECT epci FROM postgis_v2."communes_drom" WHERE code_geographique = ${code} LIMIT 1)
        `;
      } else if (type === 'ept' && eptRegex.test(libelle)) {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE epci='200054781'
        `;
      } else if (type === 'epci' && !eptRegex.test(libelle)) {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE epci = ${code}
        `;
      } else if (type === 'pnr') {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE code_pnr IS NOT NULL AND code_pnr = ${code}
        `;
      } else if (type === 'petr') {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE libelle_petr IS NOT NULL AND libelle_petr = ${libelle}
        `;
      } else {
        result = await prisma.$queryRaw<
          Array<{
            codes: string[];
            minlng: number;
            minlat: number;
            maxlng: number;
            maxlat: number;
          }>
        >`
          SELECT 
            array_agg(code_geographique) as codes,
            ST_XMin(ST_Extent(geometry)) as minLng,
            ST_YMin(ST_Extent(geometry)) as minLat,
            ST_XMax(ST_Extent(geometry)) as maxLng,
            ST_YMax(ST_Extent(geometry)) as maxLat
          FROM postgis_v2."communes_drom"
          WHERE departement = ${code}
        `;
      }

      if (!result || result.length === 0 || !result[0].codes) return null;
      return {
        codes: result[0].codes,
        bbox: {
          minLng: result[0].minlng,
          minLat: result[0].minlat,
          maxLng: result[0].maxlng,
          maxLat: result[0].maxlat
        }
      };
    } catch (error) {
      console.error(error);
      console.error('Database connection error occurred.');
      return null;
    }
  })();

  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetErosionCotiere = async (
  code: string,
  libelle: string,
  type: string
): Promise<[ErosionCotiere[], string] | []> => {
  const distance =
    type === 'commune'
      ? 0.28 // calcul fait pour la plus vaste commune : Arles
      : type === 'epci'
        ? 0.6 // calcul fait pour la plus vaste epci : pays Basque
        : type === 'pnr'
          ? 0.8 // calcul fait pour le PNR de Corse
          : type === 'petr'
            ? 0.6
            : type === 'departement'
              ? 1
              : 0.3;
  const timeoutPromise = new Promise<[ErosionCotiere[], string] | []>(
    (resolve) =>
      setTimeout(() => {
        console.log(
          'GetErosionCotiere: Timeout reached (5 seconds), returning empty array.'
        );
        resolve([]);
      }, 5000)
  );
  //(string | ErosionCotiere[])[]
  const dbQuery: Promise<[ErosionCotiere[], string] | []> = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      if (type === 'commune') {
        const commune = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT
          code_geographique,
          ST_AsText(geometry) geometry
          FROM postgis_v2."communes_drom" 
          WHERE code_geographique=${code} LIMIT 1;`;
        if (commune.length !== 0) {
          const intersect = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT
          ST_AsGeoJSON(geometry) geometry
          FROM postgis_v2."erosion_cotiere"
          WHERE ST_Intersects(geometry, ST_GeomFromText(${commune[0].geometry}, 4326)) LIMIT 1;`;
          if (intersect.length) {
            const value = await prisma.$queryRaw<ErosionCotiere[]>`
              SELECT
              taux,
              ST_AsGeoJSON(geometry) geometry
              FROM postgis_v2."erosion_cotiere" 
              WHERE ST_DWithin(geometry, ST_PointFromText(ST_AsText(ST_Centroid(${commune[0].geometry})), 4326), ${distance});
            `;
            const envelope = await prisma.$queryRaw<{ envelope: string }[]>`
              SELECT ST_AsGeoJSON(ST_Envelope(ST_Collect(geometry))) as envelope
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_Intersects(geometry, ST_GeomFromText(${commune[0].geometry}, 4326));
            `;
            if (!envelope || !envelope[0].envelope) return [];
            return [value, envelope[0].envelope];
          } else return [];
        }
        return [];
      } else if (type === 'epci' && !eptRegex.test(libelle)) {
        const epci = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT
          ST_AsText(ST_Union(geometry)) as geometry
          FROM postgis_v2."communes_drom" WHERE epci=${code};`;
        if (epci.length !== 0) {
          const intersect = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT
          ST_AsGeoJSON(geometry) geometry
          FROM postgis_v2."erosion_cotiere"
          WHERE ST_Intersects(geometry, ST_GeomFromText(${epci[0].geometry}, 4326))`;
          if (intersect.length) {
            const value = await prisma.$queryRaw<ErosionCotiere[]>`
            SELECT
            taux,
            ST_AsGeoJSON(geometry) geometry
            FROM postgis_v2."erosion_cotiere" 
            WHERE ST_DWithin(geometry, ST_PointFromText(ST_AsText(ST_Centroid(${epci[0].geometry})), 4326), ${distance});
            `;
            const envelope = await prisma.$queryRaw<{ envelope: string }[]>`
              SELECT ST_AsGeoJSON(ST_Envelope(ST_Collect(geometry))) as envelope
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_Intersects(geometry, ST_GeomFromText(${epci[0].geometry}, 4326));
            `;
            if (!envelope || !envelope[0].envelope) return [];
            return [value, envelope[0].envelope];
          } else return [];
        }
        return [];
      } else if (type === 'pnr') {
        const pnr = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT 
          ST_AsText(ST_Union(geometry)) as geometry
          FROM postgis_v2."communes_drom" WHERE code_pnr=${code};`;
        if (pnr.length !== 0) {
          const intersect = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT
            ST_AsGeoJSON(geometry) geometry
            FROM postgis_v2."erosion_cotiere"
            WHERE ST_Intersects(geometry, ST_GeomFromText(${pnr[0].geometry}, 4326))`;
          if (intersect.length) {
            const value = await prisma.$queryRaw<ErosionCotiere[]>`
              SELECT
              taux,
              ST_AsGeoJSON(geometry) geometry
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_DWithin(geometry, ST_PointFromText(ST_AsText(ST_Centroid(${pnr[0].geometry})), 4326), ${distance});
            `;
            const envelope = await prisma.$queryRaw<{ envelope: string }[]>`
              SELECT ST_AsGeoJSON(ST_Envelope(ST_Collect(geometry))) as envelope
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_Intersects(geometry, ST_GeomFromText(${pnr[0].geometry}, 4326));
            `;
            if (!envelope || !envelope[0].envelope) return [];
            return [value, envelope[0].envelope];
          } else return [];
        } else return [];
      } else if (type === 'petr') {
        const petr = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT 
          ST_AsText(ST_Union(geometry)) as geometry
          FROM postgis_v2."communes_drom" WHERE libelle_petr=${libelle};`;
        if (petr.length !== 0) {
          const intersect = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT
            ST_AsGeoJSON(geometry) geometry
            FROM postgis_v2."erosion_cotiere"
            WHERE ST_Intersects(geometry, ST_GeomFromText(${petr[0].geometry}, 4326)) LIMIT 1`;
          if (intersect.length) {
            const value = await prisma.$queryRaw<ErosionCotiere[]>`
              SELECT
              taux,
              ST_AsGeoJSON(geometry) geometry
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_DWithin(geometry, ST_PointFromText(ST_AsText(ST_Centroid(${petr[0].geometry})), 4326), ${distance});
            `;
            const envelope = await prisma.$queryRaw<{ envelope: string }[]>`
              SELECT ST_AsGeoJSON(ST_Envelope(ST_Collect(geometry))) as envelope
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_Intersects(geometry, ST_GeomFromText(${petr[0].geometry}, 4326));
            `;
            if (!envelope || !envelope[0].envelope) return [];
            return [value, envelope[0].envelope];
          } else return [];
        } else return [];
      } else if (type === 'departement') {
        const departement = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT 
          ST_AsText(ST_Union(geometry)) as geometry
          FROM postgis_v2."communes_drom" WHERE departement=${code};`;
        if (departement.length !== 0) {
          const intersect = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT
            ST_AsGeoJSON(geometry) geometry
            FROM postgis_v2."erosion_cotiere"
            WHERE ST_Intersects(geometry, ST_GeomFromText(${departement[0].geometry}, 4326))`;
          if (intersect.length) {
            const value = await prisma.$queryRaw<ErosionCotiere[]>`
              SELECT
              taux,
              ST_AsGeoJSON(geometry) geometry
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_DWithin(geometry, ST_PointFromText(ST_AsText(ST_Centroid(${departement[0].geometry})), 4326), ${distance});
            `; //ST_Intersects(geometry, ST_GeomFromText(${departement[0].geometry}, 4326));
            const envelope = await prisma.$queryRaw<{ envelope: string }[]>`
              SELECT ST_AsGeoJSON(ST_Envelope(ST_Collect(geometry))) as envelope
              FROM postgis_v2."erosion_cotiere"
              WHERE ST_Intersects(geometry, ST_GeomFromText(${departement[0].geometry}, 4326));
            `;
            if (!envelope || !envelope[0].envelope) return [];
            return [value, envelope[0].envelope];
          } else return [];
        } else return [];
      } else return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetCommunesContours = async (
  code: string,
  libelle: string,
  type: string
): Promise<{ geometry: string } | null> => {
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, 6000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return null;
      const exists = await prisma.postgis_v2_communes_drom.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return null;

      let result;

      if (type === 'commune') {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(geometry, 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE code_geographique = ${code} LIMIT 1
        `;
      } else if (type === 'ept' && eptRegex.test(libelle)) {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(ST_Union(geometry), 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE epci='200054781'
        `;
      } else if (type === 'epci' && !eptRegex.test(libelle)) {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(ST_Union(geometry), 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE epci = ${code}
        `;
      } else if (type === 'pnr') {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(ST_Union(geometry), 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE code_pnr IS NOT NULL AND code_pnr = ${code}
        `;
      } else if (type === 'petr') {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(ST_Union(geometry), 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE libelle_petr IS NOT NULL AND libelle_petr = ${libelle}
        `;
      } else {
        result = await prisma.$queryRaw<Array<{ geometry: string }>>`
          SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(ST_Union(geometry), 0.001)
          ) as geometry
          FROM postgis_v2."communes_drom"
          WHERE departement = ${code}
        `;
      }

      if (!result || result.length === 0 || !result[0].geometry) return null;
      return { geometry: result[0].geometry };
    } catch (error) {
      console.error(error);
      console.error('Database connection error occurred.');
      return null;
    }
  })();

  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetCommunesGeometries = async (
  code: string,
  libelle: string,
  type: string
): Promise<CarteCommunes[]> => {
  //race Promise pour éviter un crash de la requête lorsqu'elle est trop longue
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 3000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.postgis_v2_communes_drom.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        if (type === 'commune') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
            ST_AsText(geometry) as geometry 
            FROM postgis_v2."communes_drom" 
            WHERE code_geographique = ${code} LIMIT 1
          ;`;
          return value;
        } else if (type === 'ept' && eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              ST_AsText(ST_Union(geometry)) as geometry
              FROM postgis_v2."communes_drom" WHERE ept IS NOT NULL AND ept=${libelle};`;
          return value;
        } else if (type === 'epci' && !eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
            ST_AsText(ST_Union(geometry)) as geometry 
            FROM postgis_v2."communes_drom" WHERE epci IS NOT NULL AND epci=${code};`;
          return value;
        } else if (type === 'pnr') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
          SELECT 
            ST_AsText(ST_Union(geometry)) as geometry
            FROM postgis_v2."communes_drom" WHERE code_pnr IS NOT NULL AND code_pnr=${code};`;
          return value;
        } else if (type === 'petr') {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              ST_AsText(ST_Union(geometry)) as geometry
              FROM postgis_v2."communes_drom" WHERE libelle_petr IS NOT NULL AND libelle_petr=${libelle};`;
          return value;
        } else {
          const value = await prisma.$queryRaw<CarteCommunes[]>`
            SELECT 
              ST_AsText(ST_Union(geometry)) as geometry
              FROM postgis_v2."communes_drom" WHERE departement IS NOT NULL AND departement=${code};`;
          return value;
        }
      }
    } catch (error) {
      console.error(error);
      console.error('Database connection error occurred.');
      return [];
    }
  })();

  return Promise.race([dbQuery, timeoutPromise]);
};
