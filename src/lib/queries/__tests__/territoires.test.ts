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

// const pool = new Pool({
//   connectionString: process.env.SCALINGO_POSTGRESQL_URL,
//   ssl: { rejectUnauthorized: false }
// });

jest.setTimeout(120000);

afterAll(async () => {
  await pool.end();
});

const expectedPNR: [string, string][] = [
  ['FR8000015', 'PNR du haut Jura'],
  ['FR8000033', 'PNR du Verdon'],
  ['FR8000003', 'PNR du Luberon'],
  ['FR8000002', 'PNR du Queyras'],
  ['FR8000052', 'PNR des Baronnies provençales'],
  ['FR8000049', "PNR des Préalpes d'Azur"],
  ['FR8000041', "PNR des monts d'Ardèche"],
  ['FR8000048', 'PNR des Ardennes'],
  ['FR8000047', 'PNR des Pyrénées ariégeoises'],
  ['FR8000013', "PNR de la Forêt d'Orient"],
  ['FR8000059', 'PNR Corbières-Fenouillèdes'],
  ['FR8000042', 'PNR de la Narbonnaise en Méditerranée'],
  ['FR8000014', 'PNR des Grands Causses'],
  ['FR8000054', "PNR de l'Aubrac"],
  ['FR8000011', 'PNR de Camargue'],
  ['FR8000046', 'PNR des Alpilles'],
  ['FR8000053', 'PNR de la Sainte-Baume'],
  ['FR8000021', 'PNR des Marais du Cotentin et du Bessin'],
  ['FR8000028', "PNR des Volcans d'Auvergne"],
  ['FR8000050', 'PNR du marais poitevin'],
  ['FR8000045', 'PNR de Millevaches en Limousin'],
  ['FR8000025', 'PNR du Morvan'],
  ['FR8000060', "PNR de la Vallée de la Rance - Côte d'Emeraude"],
  ['FR8000035', 'PNR Périgord-Limousin'],
  ['FR8000058', 'PNR du Doubs Horloger'],
  ['FR8000001', 'PNR du Vercors'],
  ['FR8000010', 'PNR des Boucles de la Seine Normande'],
  ['FR8000034', 'PNR du Perche'],
  ['FR8000005', "PNR d'Armorique"],
  ['FR8000012', 'PNR de Corse'],
  ['FR8000055', 'PNR Medoc'],
  ['FR8000018', 'PNR des Landes de Gascogne'],
  ['FR8000016', 'PNR du Haut-Languedoc'],
  ['FR8000008', 'PNR de la Brenne'],
  ['FR8000032', 'PNR Loire-Anjou-Touraine'],
  ['FR8000004', 'PNR de Chartreuse'],
  ['FR8000027', 'PNR du Pilat'],
  ['FR8000019', 'PNR Livradois-Forez'],
  ['FR8000009', 'PNR de Brière'],
  ['FR8000039', 'PNR des Causses du Quercy'],
  ['FR8000026', 'PNR Normandie-Maine'],
  ['FR8000024', 'PNR de la Montagne de Reims'],
  ['FR8000020', 'PNR de Lorraine'],
  ['FR8000051', 'PNR du Golfe du Morbihan'],
  ['FR8000029', 'PNR des Vosges du Nord'],
  ['FR8000036', "PNR de l'Avesnois"],
  ['FR8000037', 'PNR Scarpe-Escaut'],
  ['FR8000007', "PNR des Caps et Marais d'Opale"],
  ['FR8000043', 'PNR Oise-Pays de France'],
  ['FR8000044', 'PNR des Pyrénées catalanes'],
  ['FR8000006', 'PNR des Ballons des Vosges'],
  ['FR8000031', 'PNR du Massif des Bauges'],
  ['FR8000031 et FR8000004', 'PNR du Massif des Bauges et PNR de Chartreuse'],
  ['FR8000038', 'PNR du Gâtinais français'],
  ['FR8000017', 'PNR de la Haute-Vallée de Chevreuse'],
  ['FR8000030', 'PNR du Vexin français'],
  ['FR8000057', 'PNR Baie de Somme - Picardie maritime'],
  ['FR8000056', 'PNR du Mont Ventoux'],
  ['FR8000023', 'PNR de Martinique'],
  ['FR8000040', 'PNR de Guyane']
];

const expectedBrehat: [string, string] = ['22016', 'Île-de-Bréhat'];

{
  /* Test pour la correspondance PNR libelle-code */
}
const expectedMap = new Map<string, string>(expectedPNR);

async function checkPnrCorrespondance(table: string) {
  const result = await pool.query(
    `SELECT code_pnr, libelle_pnr FROM ${table} WHERE code_pnr IS NOT NULL`
  );
  for (const row of result.rows) {
    if (expectedMap.has(row.code_pnr)) {
      expect(row.libelle_pnr).toBe(expectedMap.get(row.code_pnr));
    }
  }
}

async function checkBrehat(table: string) {
  const result = await pool.query(
    `SELECT code_geographique, libelle_geographique FROM ${table} WHERE code_geographique = $1 LIMIT 1`,
    [expectedBrehat[0]]
  );
  expect(result.rows[0]).toEqual({
    code_geographique: expectedBrehat[0],
    libelle_geographique: expectedBrehat[1]
  });
}

describe('PNR code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in collectivites_searchbar', async () => {
    await checkPnrCorrespondance('databases_v2.collectivites_searchbar');
  });
});
describe('consommation_espaces_naf code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in consommation_espaces_naf', async () => {
    await checkPnrCorrespondance('databases_v2.consommation_espaces_naf');
  });
});
describe('arretes_catnat code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in arretes_catnat', async () => {
    await checkPnrCorrespondance('databases_v2.arretes_catnat');
  });
});
describe('inconfort_thermique code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in inconfort_thermique', async () => {
    await checkPnrCorrespondance('databases_v2.confort_thermique');
  });
});
describe('feux_foret code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in feux_foret', async () => {
    await checkPnrCorrespondance('databases_v2.feux_foret');
  });
});
describe('ressources_eau code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in ressources_eau', async () => {
    await checkPnrCorrespondance('databases_v2.prelevements_eau');
  });
});
describe('rga code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in rga', async () => {
    await checkPnrCorrespondance('databases_v2.rga');
  });
});
describe('agriculture code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in agriculture', async () => {
    await checkPnrCorrespondance('databases_v2.agriculture');
  });
});
describe('communes_drom code/libelle correspondance', () => {
  it('should have correct code_pnr/libelle_pnr pairs in postgis.communes_drom', async () => {
    await checkPnrCorrespondance('postgis_v2.communes_drom');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in collectivites_searchbar', async () => {
    await checkBrehat('databases_v2.collectivites_searchbar');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in consommation_espaces_naf', async () => {
    await checkBrehat('databases_v2.consommation_espaces_naf');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in arretes_catnat', async () => {
    await checkBrehat('databases_v2.arretes_catnat');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in inconfort_thermique', async () => {
    await checkBrehat('databases_v2.confort_thermique');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in rga', async () => {
    await checkBrehat('databases_v2.rga');
  });
});

describe('Île de Bréhat presence', () => {
  it('should have Île de Bréhat in ressources_eau', async () => {
    await checkBrehat('databases_v2.prelevements_eau');
  });
});

describe('databases_v2_arretes_catnat row count', () => {
  it('should have more than 260600 rows', async () => {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM databases_v2.arretes_catnat`
    );
    expect(parseInt(result.rows[0].count)).toBeGreaterThan(260600);
  });
});
