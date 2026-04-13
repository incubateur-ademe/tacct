import 'dotenv/config';
import { Pool } from 'pg';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const connectionString = process.env.SCALINGO_POSTGRESQL_URL;

// Nettoyer l'URL : retirer les paramètres après ?
const cleanConnectionString = connectionString?.split('?')[0];

let sslConfig;
const caPath = join(process.cwd(), 'ca.pem');

// En production, Scalingo injecte le certificat dans le système
// En dev local, on utilise le fichier ca.pem
if (existsSync(caPath)) {
  const ca = readFileSync(caPath, 'utf8');
  sslConfig = {
    ca: ca,
    rejectUnauthorized: false
  };
} else {
  // En production sur Scalingo, ssl: true suffit (certificats système)
  sslConfig = true;
}

const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: sslConfig,
  max: 5,
  idleTimeoutMillis: 20000
});

jest.setTimeout(60000);

describe('Integration: biodiversite queries', () => {
  it('agriculture_bio returns expected results for EPCI 200054781', async () => {
    const result = await pool.query(
      `SELECT * FROM databases_v2.agriculture_bio WHERE epci = $1`,
      ['200054781']
    );
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(5);
    expect(result.rows[0]).toHaveProperty(
      'LIBELLE_SOUS_CHAMP',
      'Surface certifiée'
    );
  });

  it('consommation_espaces_naf returns expected results for EPCI 200054781', async () => {
    const result = await pool.query(
      `SELECT * FROM databases_v2.consommation_espaces_naf WHERE epci = $1`,
      ['200054781']
    );
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(150);
    const uniqueDepartements = new Set(
      result.rows.map((item) => item.libelle_departement)
    );
    expect(uniqueDepartements.size).toBe(6);
  });

  it('aot_40 returns expected results', async () => {
    const result = await pool.query(`SELECT * FROM databases_v2.aot_40`);
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(291);
    expect(result.rows[0]).toHaveProperty('valeur brute', 9487.38664050025);
  });
});

describe('Integration: confort_thermique queries', () => {
  it('confort_thermique returns array for EPCI 200070555', async () => {
    const result = await pool.query(
      `SELECT * FROM databases_v2.confort_thermique WHERE epci = $1`,
      ['200070555']
    );
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(18);
  });

  it('confort_thermique returns expected value for code_geographique 13055', async () => {
    const result = await pool.query(
      'SELECT precarite_logement FROM databases_v2.confort_thermique WHERE code_geographique = $1',
      ['13055']
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].precarite_logement).toBe(0.08537360366198976);
  });

  it('confort_thermique returns expected value for code_geographique 75056', async () => {
    const result = await pool.query(
      'SELECT precarite_logement FROM databases_v2.confort_thermique WHERE code_geographique = $1',
      ['75056']
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].precarite_logement).toBe(0.056940444530448095);
  });

  it('confort_thermique returns expected value for code_geographique 69123', async () => {
    const result = await pool.query(
      'SELECT precarite_logement FROM databases_v2.confort_thermique WHERE code_geographique = $1',
      ['69123']
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].precarite_logement).toBe(0.06629419113240076);
  });
});

describe('Integration: query functions to check if collectivites_searchbar has right structure', () => {
  it('collectivites_searchbar table has expected checksum', async () => {
    const result = await pool.query(
      `SELECT md5(string_agg(t::text, '')) AS checksum
       FROM (
         SELECT * FROM databases_v2.collectivites_searchbar ORDER BY index
       ) t`
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].checksum).toBe('fd5eaba6e8fac7fc35f4544bbe688ca2');
  });
});

describe('Integration: territorial coherence tests', () => {
  it('territorial hierarchy is consistent for Marseille (13055)', async () => {
    const result = await pool.query(
      `SELECT code_geographique, epci, departement, region 
       FROM databases_v2.table_commune 
       WHERE code_geographique = $1`,
      ['13055']
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].epci).toBe('200054807');
    expect(result.rows[0].departement).toBe('13');
    expect(result.rows[0].region).toBe(93);
  });

  it('territorial hierarchy is consistent for Paris (75056)', async () => {
    const result = await pool.query(
      `SELECT code_geographique, epci, departement, region 
       FROM databases_v2.table_commune 
       WHERE code_geographique = $1`,
      ['75056']
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].epci).toBe('200054781');
    expect(result.rows[0].departement).toBe('75');
    expect(result.rows[0].region).toBe(11);
  });

  it('all communes have valid EPCI codes (9 characters)', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as invalid_count 
       FROM databases_v2.table_commune 
       WHERE epci IS NULL OR epci = '' OR LENGTH(epci) != 9`
    );
    expect(result.rows[0].invalid_count).toBe('0');
  });

  it('all communes have valid department codes (2-3 characters)', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as invalid_count 
       FROM databases_v2.table_commune 
       WHERE departement IS NULL OR departement = '' 
       OR LENGTH(departement) < 2 OR LENGTH(departement) > 3`
    );
    expect(result.rows[0].invalid_count).toBe('0');
  });

  it('all communes have valid region codes', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as invalid_count 
       FROM databases_v2.table_commune 
       WHERE region IS NULL OR region <= 0`
    );
    expect(result.rows[0].invalid_count).toBe('0');
  });
});

describe('Integration: data quality tests', () => {
  it('precarite_logement values are between 0 and 1', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as invalid_count 
       FROM databases_v2.confort_thermique 
       WHERE precarite_logement IS NOT NULL 
       AND (precarite_logement < 0 OR precarite_logement > 1)`
    );
    expect(result.rows[0].invalid_count).toBe('0');
  });

  it('no duplicate communes in confort_thermique', async () => {
    const result = await pool.query(
      `SELECT code_geographique, COUNT(*) as count 
       FROM databases_v2.confort_thermique 
       GROUP BY code_geographique 
       HAVING COUNT(*) > 1`
    );
    expect(result.rows.length).toBe(0);
  });

  it('no duplicate communes in table_commune', async () => {
    const result = await pool.query(
      `SELECT code_geographique, COUNT(*) as count 
       FROM databases_v2.table_commune 
       GROUP BY code_geographique 
       HAVING COUNT(*) > 1`
    );
    expect(result.rows.length).toBe(0);
  });

  it('critical fields are never null in table_commune', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as null_count 
       FROM databases_v2.table_commune 
       WHERE libelle_geographique IS NULL 
       OR code_geographique IS NULL 
       OR epci IS NULL`
    );
    expect(result.rows[0].null_count).toBe('0');
  });

  it('age_bati percentages sum to approximately 100% for Marseille', async () => {
    const result = await pool.query(
      `SELECT 
        (COALESCE(age_bati_post06, 0) + COALESCE(age_bati_91_05, 0) + 
         COALESCE(age_bati_46_90, 0) + COALESCE(age_bati_19_45, 0) + 
         COALESCE(age_bati_pre_19, 0)) as total
       FROM databases_v2.confort_thermique 
       WHERE code_geographique = '13055'`
    );
    expect(result.rows).toHaveLength(1);
    const total = parseFloat(result.rows[0].total);
    expect(total).toBeGreaterThan(98.9);
    expect(total).toBeLessThan(101);
  });

  it('agriculture_bio surfaces are positive values', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as invalid_count 
       FROM databases_v2.agriculture_bio 
       WHERE surface_2023 < 0 OR surface_2022 < 0 OR surface_2021 < 0`
    );
    expect(result.rows[0].invalid_count).toBe('0');
  });
});

describe('Integration: query performance tests', () => {
  it('query by code_geographique is fast (< 100ms)', async () => {
    const start = Date.now();
    await pool.query(
      `SELECT * FROM databases_v2.confort_thermique WHERE code_geographique = $1`,
      ['13055']
    );
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('EPCI query with LIMIT is fast (< 200ms)', async () => {
    const start = Date.now();
    await pool.query(
      `SELECT * FROM databases_v2.confort_thermique WHERE epci = $1 LIMIT 200`,
      ['200054781']
    );
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });

  it('searchbar query is fast (< 150ms)', async () => {
    const start = Date.now();
    await pool.query(
      `SELECT * FROM databases_v2.collectivites_searchbar 
       WHERE search_libelle ILIKE $1 LIMIT 10`,
      ['%marseille%']
    );
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(150);
  });

  it('departement query is fast (< 300ms)', async () => {
    const start = Date.now();
    await pool.query(
      `SELECT * FROM databases_v2.table_commune WHERE departement = $1`,
      ['13']
    );
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(300);
  });
});

afterAll(async () => {
  await pool.end();
});
