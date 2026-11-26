import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.METABASE_URL ?? 'https://metabase.tacct.ademe.fr';
const API_KEY = process.env.METABASE_MIGRATION_KEY;
if (!API_KEY) {
  console.error('METABASE_MIGRATION_KEY manquante');
  process.exit(1);
}

const racine = fileURLToPath(new URL('.', import.meta.url));
const dossierExport = join(racine, 'export');
const dossierSql = join(racine, 'sql');

const appel = async (chemin, options = {}) => {
  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });
  if (!reponse.ok) {
    const corps = await reponse.text();
    throw new Error(`${options.method ?? 'GET'} ${chemin} → ${reponse.status} ${corps.slice(0, 300)}`);
  }
  return reponse.json();
};

const enListe = (resultat) => (Array.isArray(resultat) ? resultat : (resultat?.data ?? []));

const slug = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const sqlNatif = (datasetQuery) => {
  if (typeof datasetQuery?.native?.query === 'string') return datasetQuery.native.query;
  const etapeNative = datasetQuery?.stages?.find((etape) => typeof etape?.native === 'string');
  return etapeNative?.native ?? null;
};

const ecrireJson = (nom, donnees) =>
  writeFile(join(dossierExport, nom), `${JSON.stringify(donnees, null, 2)}\n`, 'utf8');

await mkdir(dossierExport, { recursive: true });
await mkdir(dossierSql, { recursive: true });

const bases = enListe(await appel('/api/database')).map((base) => ({
  id: base.id,
  name: base.name,
  engine: base.engine
}));

const collections = enListe(await appel('/api/collection')).map((collection) => {
  const personnelle = collection.personal_owner_id != null;
  return {
    id: collection.id,
    name: personnelle ? 'Collection personnelle' : collection.name,
    location: collection.location ?? null,
    personnelle,
    archived: collection.archived ?? false
  };
});

const cartesBrutes = enListe(await appel('/api/card?f=all'));
const cartes = [];
const erreursCompilation = [];

for (const carte of cartesBrutes) {
  let sql = sqlNatif(carte.dataset_query);
  const natif = sql !== null;
  if (!natif) {
    try {
      const compile = await appel('/api/dataset/native', {
        method: 'POST',
        body: JSON.stringify({ ...carte.dataset_query, pretty: true })
      });
      sql = compile.query ?? null;
    } catch (erreur) {
      erreursCompilation.push({ id: carte.id, name: carte.name, erreur: String(erreur.message) });
    }
  }

  cartes.push({
    id: carte.id,
    name: carte.name,
    description: carte.description ?? null,
    type: carte.type ?? null,
    display: carte.display,
    collection_id: carte.collection_id ?? null,
    database_id: carte.database_id ?? null,
    archived: carte.archived ?? false,
    sql_natif: natif,
    sql,
    dataset_query: carte.dataset_query,
    parameters: carte.parameters ?? [],
    visualization_settings: carte.visualization_settings ?? {},
    colonnes: (carte.result_metadata ?? []).map((colonne) => ({
      name: colonne.name,
      display_name: colonne.display_name,
      base_type: colonne.base_type
    })),
    created_at: carte.created_at ?? null,
    updated_at: carte.updated_at ?? null
  });

  if (sql) {
    await writeFile(join(dossierSql, `${carte.id}-${slug(carte.name)}.sql`), `${sql.trim()}\n`, 'utf8');
  }
}

let listeDashboards;
try {
  listeDashboards = enListe(await appel('/api/dashboard?f=all'));
} catch {
  listeDashboards = enListe(await appel('/api/search?models=dashboard'));
}

const dashboards = [];
for (const { id } of listeDashboards) {
  const dashboard = await appel(`/api/dashboard/${id}`);
  dashboards.push({
    id: dashboard.id,
    name: dashboard.name,
    description: dashboard.description ?? null,
    collection_id: dashboard.collection_id ?? null,
    archived: dashboard.archived ?? false,
    enable_embedding: dashboard.enable_embedding ?? false,
    embedding_params: dashboard.embedding_params ?? null,
    parameters: dashboard.parameters ?? [],
    tabs: (dashboard.tabs ?? []).map((onglet) => ({
      id: onglet.id,
      name: onglet.name,
      position: onglet.position
    })),
    dashcards: (dashboard.dashcards ?? dashboard.ordered_cards ?? []).map((dashcard) => ({
      id: dashcard.id,
      card_id: dashcard.card_id ?? null,
      dashboard_tab_id: dashcard.dashboard_tab_id ?? null,
      row: dashcard.row,
      col: dashcard.col,
      size_x: dashcard.size_x,
      size_y: dashcard.size_y,
      series: (dashcard.series ?? []).map((serie) => serie.id),
      parameter_mappings: dashcard.parameter_mappings ?? [],
      visualization_settings: dashcard.visualization_settings ?? {}
    }))
  });
}

let snippets = [];
try {
  snippets = enListe(await appel('/api/native-query-snippet')).map((snippet) => ({
    id: snippet.id,
    name: snippet.name,
    description: snippet.description ?? null,
    content: snippet.content
  }));
} catch (erreur) {
  console.warn(`Snippets non récupérés : ${erreur.message}`);
}

await ecrireJson('databases.json', bases);
await ecrireJson('collections.json', collections);
await ecrireJson('cards.json', cartes);
await ecrireJson('dashboards.json', dashboards);
await ecrireJson('snippets.json', snippets);
await ecrireJson('erreurs-compilation.json', erreursCompilation);

console.log(`Bases : ${bases.length}`);
console.log(`Collections : ${collections.length}`);
console.log(`Questions : ${cartes.length} (SQL natif : ${cartes.filter((c) => c.sql_natif).length}, éditeur visuel : ${cartes.filter((c) => !c.sql_natif).length}, échecs de compilation : ${erreursCompilation.length})`);
console.log(`Dashboards : ${dashboards.length} (embarqués : ${dashboards.filter((d) => d.enable_embedding).length})`);
console.log(`Snippets : ${snippets.length}`);
