import 'dotenv/config';
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

// Envoie le mail de bienvenue réel (SMTP Brevo du .env) à l'adresse choisie.
//   node scripts/envoyer-mail-bienvenue.mjs <email> <profil>
// profil : cdm | elu | responsable | be | entreprise | admin | etat | autre

const [email, profil] = process.argv.slice(2);

const racine = path.resolve(import.meta.dirname, '..');
const sortie = path.join(racine, 'node_modules', '.cache', 'envoyer-mail-bienvenue.cjs');
mkdirSync(path.dirname(sortie), { recursive: true });

// Compile les modules TypeScript du mail (alias `@/` via tsconfig) ; `server-only`
// n'a de sens que dans Next, on le neutralise.
await build({
  stdin: {
    contents: `
      export { envoyerMailBienvenue } from './src/lib/mail/bienvenue';
      export { PROFILS, estProfil } from './src/lib/questionnaire-de-connexion/types';
    `,
    resolveDir: racine,
    loader: 'ts'
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  outfile: sortie,
  logLevel: 'error',
  plugins: [
    {
      name: 'server-only-vide',
      setup(b) {
        b.onResolve({ filter: /^server-only$/ }, () => ({ path: 'server-only', namespace: 'vide' }));
        b.onLoad({ filter: /.*/, namespace: 'vide' }, () => ({ contents: '' }));
      }
    }
  ]
});

const { envoyerMailBienvenue, PROFILS, estProfil } = createRequire(import.meta.url)(sortie);

if (!email || !profil || !estProfil(profil)) {
  console.error('Usage : node scripts/envoyer-mail-bienvenue.mjs <email> <profil>');
  console.error(`Profils : ${PROFILS.map((p) => p.value).join(' | ')}`);
  process.exit(1);
}

const envoye = await envoyerMailBienvenue(email, profil);
console.log(envoye ? `Mail envoyé à ${email} (profil ${profil}).` : 'Échec de l’envoi (voir le message ci-dessus).');
process.exit(envoye ? 0 : 1);
