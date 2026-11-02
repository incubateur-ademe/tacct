import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const connectionString = process.env.SCALINGO_POSTGRESQL_URL;
const cleanConnectionString = connectionString?.split('?')[0];
const caPemPath = path.join(__dirname, '../../../../ca.pem');
const caPem = fs.readFileSync(caPemPath, 'utf8');
const ca = caPem ?? process.env.POSTGRES_CA;

const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: {
    ca,
    rejectUnauthorized: false
  }
});

jest.setTimeout(120000);

let expectedMap: Map<string, string>;

beforeAll(async () => {
  const result = await pool.query(
    'SELECT code_pnr, pnr FROM databases_v2.liste_pnr'
  );
  expectedMap = new Map<string, string>(
    result.rows.map((row) => [row.code_pnr, row.pnr])
  );
});

afterAll(async () => {
  await pool.end();
});

const expectedBrehat: [string, string] = ['22016', 'Île-de-Bréhat'];

const normalizeLabel = (label: string): string => {
  return label;
  // .toLowerCase()
  // .normalize('NFD')
  // .replace(/[\u0300-\u036f]/g, '')
  // .replace(/^pnr\s+(de\s+la|du|des|d'|de l'|de)\s+/i, 'pnr')
  // .replace(/[^a-z0-9]/g, '');
};

describe('PNR code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in collectivites_searchbar', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.collectivites_searchbar WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR collectivites_searchbar] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR collectivites_searchbar] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('consommation_espaces_naf code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in consommation_espaces_naf', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.consommation_espaces_naf WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR consommation_espaces_naf] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR consommation_espaces_naf] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('arretes_catnat code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in arretes_catnat', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.arretes_catnat WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR arretes_catnat] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR arretes_catnat] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('inconfort_thermique code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in inconfort_thermique', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.confort_thermique WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR inconfort_thermique] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR inconfort_thermique] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('feux_foret code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in feux_foret', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.feux_foret WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR feux_foret] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR feux_foret] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('ressources_eau code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in ressources_eau', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.prelevements_eau_new WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR ressources_eau] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR ressources_eau] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('rga code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in rga', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.rga WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR rga] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR rga] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('agriculture code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in agriculture', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.agriculture WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR agriculture] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR agriculture] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('communes_drom code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in postgis.communes_drom', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM postgis_v2.communes_drom WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR communes_drom] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR communes_drom] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('Atlas biodiversité code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in atlas_biodiversite', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.atlas_biodiversite WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR atlas_biodiversite] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR atlas_biodiversite] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe("Export cours d'eau code/libelle correspondance", () => {
  it('should have correct code_pnr/libelle_pnr pairs in export_cours_d_eau', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.export_cours_d_eau WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR export_cours_d_eau] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR export_cours_d_eau] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('lcz_couverture code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in lcz_couverture', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.lcz_couverture WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR lcz_couverture] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR lcz_couverture] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('secheresses code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in secheresses', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.secheresses WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR secheresses] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR secheresses] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('table_commune code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in table_commune', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.table_commune WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR table_commune] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR table_commune] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});
describe('table_territoires code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in table_territoires', async () => {
    const result = await pool.query(
      'SELECT DISTINCT code_pnr, libelle_pnr FROM databases_v2.table_territoires WHERE code_pnr IS NOT NULL'
    );
    for (const row of result.rows) {
      const expected = expectedMap.get(row.code_pnr);
      if (!expected) {
        console.log(
          `[ERREUR table_territoires] Code PNR "${row.code_pnr}" absent de la table de référence liste_pnr`
        );
      }
      expect(expected).toBeDefined();
      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(expected ?? '');
      if (normalized1 !== normalized2) {
        console.log(`[ERREUR table_territoires] ${row.code_pnr}:`);
        console.log(`  DB:  "${row.libelle_pnr}" → "${normalized1}"`);
        console.log(`  Ref: "${expected}" → "${normalized2}"`);
      }
      expect(normalized1).toBe(normalized2);
    }
  });
});

{
  /* Test pour la présence de l'île de Bréhat */
}

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in collectivites_searchbar', async () => {
    const result = await pool.query(
      'SELECT code_geographique, libelle_geographique FROM databases_v2.collectivites_searchbar WHERE code_geographique = $1',
      [expectedBrehat[0]]
    );
    expect(result.rows[0]).toEqual({
      code_geographique: expectedBrehat[0],
      libelle_geographique: expectedBrehat[1]
    });
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in consommation_espaces_naf', async () => {
    const result = await pool.query(
      'SELECT code_geographique, libelle_geographique FROM databases_v2.consommation_espaces_naf WHERE code_geographique = $1',
      [expectedBrehat[0]]
    );
    expect(result.rows[0]).toEqual({
      code_geographique: expectedBrehat[0],
      libelle_geographique: expectedBrehat[1]
    });
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in consommation_espaces_naf', async () => {
    const result = await pool.query(
      'SELECT code_geographique, libelle_geographique FROM databases_v2.arretes_catnat WHERE code_geographique = $1',
      [expectedBrehat[0]]
    );
    expect(result.rows[0]).toEqual({
      code_geographique: expectedBrehat[0],
      libelle_geographique: expectedBrehat[1]
    });
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in inconfort_thermique', async () => {
    const result = await pool.query(
      'SELECT code_geographique, libelle_geographique FROM databases_v2.confort_thermique WHERE code_geographique = $1',
      [expectedBrehat[0]]
    );
    expect(result.rows[0]).toEqual({
      code_geographique: expectedBrehat[0],
      libelle_geographique: expectedBrehat[1]
    });
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in rga', async () => {
    const result = await pool.query(
      'SELECT code_geographique, libelle_geographique FROM databases_v2.rga WHERE code_geographique = $1',
      [expectedBrehat[0]]
    );
    expect(result.rows[0]).toEqual({
      code_geographique: expectedBrehat[0],
      libelle_geographique: expectedBrehat[1]
    });
  });
});

describe('databases_v2_arretes_catnat row count', () => {
  it('should have more than 260600 rows', async () => {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM databases_v2.arretes_catnat'
    );
    const count = parseInt(result.rows[0].count);
    expect(count).toBeGreaterThan(260600);
  });
});

describe('Vérification commune par commune', () => {
  it('should have matching PNR data for each commune in collectivites_searchbar', async () => {
    const result = await pool.query(`
      SELECT 
        cs.code_geographique,
        cs.libelle_geographique,
        cs.code_pnr,
        cs.libelle_pnr,
        lp.code_pnr as ref_code_pnr,
        lp.pnr as ref_pnr
      FROM databases_v2.collectivites_searchbar cs
      LEFT JOIN databases_v2.liste_pnr lp ON cs.code_geographique = lp.code_geographique
      WHERE cs.code_geographique IS NOT NULL AND cs.code_pnr IS NOT NULL
    `);

    const errors: string[] = [];

    for (const row of result.rows) {
      if (!row.ref_code_pnr) {
        const error = `[ERREUR collectivites_searchbar] Commune ${row.code_geographique} (${row.libelle_geographique}) absente de liste_pnr`;
        console.log(error);
        errors.push(error);
        continue;
      }

      if (row.code_pnr !== row.ref_code_pnr) {
        const error = `[ERREUR collectivites_searchbar] Commune ${row.code_geographique} (${row.libelle_geographique}) - PNR "${row.code_pnr}" dans table vs "${row.ref_code_pnr}" dans liste_pnr`;
        console.log(error);
        errors.push(error);
      }

      const normalized1 = normalizeLabel(row.libelle_pnr);
      const normalized2 = normalizeLabel(row.ref_pnr ?? '');
      if (normalized1 !== normalized2) {
        const error = `[ERREUR collectivites_searchbar] Commune ${row.code_geographique} (${row.libelle_geographique}) - Libellé "${row.libelle_pnr}" dans table vs "${row.ref_pnr}" dans liste_pnr`;
        console.log(error);
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      console.log(
        `\n=== RÉSUMÉ: ${errors.length} erreur(s) trouvée(s) dans collectivites_searchbar ===`
      );
      errors.forEach((err) => console.log(err));
    }
    expect(errors.length).toBe(0);
  });

  it('should have matching commune count per PNR', async () => {
    const excludedCommunes = [
      '26371',
      '34093',
      '95282',
      '59070',
      '80830',
      '25347',
      '25620'
    ];

    const csResult = await pool.query(`
      SELECT code_pnr, COUNT(*) as nb_communes
      FROM databases_v2.collectivites_searchbar
      WHERE code_geographique IS NOT NULL AND code_pnr IS NOT NULL
      GROUP BY code_pnr
      ORDER BY code_pnr
    `);

    const lpResult = await pool.query(`
      SELECT code_pnr, COUNT(*) as nb_communes
      FROM databases_v2.liste_pnr
      WHERE code_geographique NOT IN (${excludedCommunes.map((c) => `'${c}'`).join(', ')})
      GROUP BY code_pnr
      ORDER BY code_pnr
    `);

    const csMap = new Map(
      csResult.rows.map((row) => [row.code_pnr, parseInt(row.nb_communes)])
    );
    const lpMap = new Map(
      lpResult.rows.map((row) => [row.code_pnr, parseInt(row.nb_communes)])
    );

    const errors: string[] = [];
    const allCodes = new Set([...csMap.keys(), ...lpMap.keys()]);

    for (const code of allCodes) {
      const csCount = csMap.get(code) || 0;
      const lpCount = lpMap.get(code) || 0;

      if (csCount !== lpCount) {
        const error = `[DIFF] PNR ${code}: ${csCount} communes dans collectivites_searchbar vs ${lpCount} dans liste_pnr`;
        console.log(error);
        errors.push(error);

        const detailResult = await pool.query(
          `
          SELECT 
            COALESCE(cs.code_geographique, lp.code_geographique) as code_geo,
            CASE 
              WHEN cs.code_geographique IS NULL THEN 'Manquant dans collectivites_searchbar'
              WHEN lp.code_geographique IS NULL THEN 'Manquant dans liste_pnr'
              ELSE 'Présent dans les deux'
            END as statut
          FROM 
            (SELECT code_geographique FROM databases_v2.collectivites_searchbar 
             WHERE code_pnr = $1 AND code_geographique IS NOT NULL) cs
          FULL OUTER JOIN 
            (SELECT code_geographique FROM databases_v2.liste_pnr 
             WHERE code_pnr = $1 AND code_geographique NOT IN (${excludedCommunes.map((c) => `'${c}'`).join(', ')})) lp
          ON cs.code_geographique = lp.code_geographique
          WHERE cs.code_geographique IS NULL OR lp.code_geographique IS NULL
          ORDER BY code_geo
        `,
          [code]
        );

        if (detailResult.rows.length > 0) {
          console.log(`  Communes différentes pour PNR ${code}:`);
          detailResult.rows.forEach((row) => {
            console.log(`    - ${row.code_geo}: ${row.statut}`);
          });
        }
      }
    }

    if (errors.length > 0) {
      console.log(
        `\n=== RÉSUMÉ: ${errors.length} PNR avec des différences de nombre de communes ===`
      );
      errors.forEach((err) => console.log(err));
    }
    expect(errors.length).toBe(0);
  });
});
