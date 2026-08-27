// Regroupe les ETL qui ne doivent tourner QUE sur l'app Scalingo de production
// (ex: la table Baserow "CdM" n'a pas à être répliquée depuis les apps dev/staging).
// Importé par etl/index.mjs, donc exécuté par le même cron nocturne.

import { run as runBaserowCdm } from './runBaserowCdm.mjs';

(async () => {
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
        await runBaserowCdm({ apply: true });
    } else {
        console.log(
            `[etl/prod] NEXT_PUBLIC_ENV=${process.env.NEXT_PUBLIC_ENV ?? '(non défini)'} : ETL production ignorés.`
        );
    }
})().catch((err) => {
    console.error('[etl/prod] échec :', err);
    process.exit(1);
});
