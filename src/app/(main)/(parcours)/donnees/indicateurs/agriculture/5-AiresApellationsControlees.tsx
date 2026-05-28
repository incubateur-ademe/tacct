'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import PieChartAiresAppellationsControlees from '@/components/charts/agriculture/pieChartAiresAppellationsControlees';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { TableCommuneModel } from '@/lib/postgres/models';
import { AiresAppellationsControleesText } from '@/lib/staticTexts';
import { airesAppellationsControleesTooltipText } from '@/lib/tooltipTexts';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';

const parsePostgresArray = (pgArray: string | null): string[] => {
  if (!pgArray || pgArray === '{}') return [];
  const content = pgArray.slice(1, -1);
  if (!content) return [];
  const items: string[] = [];
  let currentItem = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      items.push(currentItem.trim());
      currentItem = '';
    } else {
      currentItem += char;
    }
  }
  if (currentItem) {
    items.push(currentItem.trim());
  }
  return items;
};

export const AiresAppellationsControlees = (props: {
  tableCommune: TableCommuneModel[];
}) => {
  const { tableCommune } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const tableCommuneFiltered =
    type === 'commune'
      ? tableCommune.filter((el) => el.code_geographique === code)
      : type === 'epci'
        ? tableCommune.filter((el) => el.epci === code)
        : type === 'departement'
          ? tableCommune.filter((el) => el.departement === code)
          : type === 'pnr'
            ? tableCommune.filter((el) => el.code_pnr === code)
            : type === 'ept'
              ? tableCommune.filter((el) => el.ept === libelle)
              : type === 'petr'
                ? tableCommune.filter((el) => el.libelle_petr === libelle)
                : tableCommune;

  const airesAppellationsControleesMap = new Map<string, string>();
  tableCommuneFiltered
    .filter((el) => el.aires_appellations_controlees_nom !== null)
    .forEach((el) => {
      const noms = Array.isArray(el.aires_appellations_controlees_nom)
        ? el.aires_appellations_controlees_nom
        : parsePostgresArray(el.aires_appellations_controlees_nom);

      const signes = Array.isArray(el.aires_appellations_controlees_signe)
        ? el.aires_appellations_controlees_signe
        : parsePostgresArray(el.aires_appellations_controlees_signe);

      noms.forEach((nom, index) => {
        if (!airesAppellationsControleesMap.has(nom)) {
          airesAppellationsControleesMap.set(nom, signes[index] || '');
        }
      });
    });
  const airesAppellationsControlees = Array.from(
    airesAppellationsControleesMap.entries()
  ).map(([nom, signe]) => ({
    nom,
    signe
  }));
  const countAOC = airesAppellationsControlees.filter(
    (el) => el.signe === 'AOC'
  ).length;
  const countIGP = airesAppellationsControlees.filter(
    (el) => el.signe === 'IGP'
  ).length;

  const exportData = airesAppellationsControlees.sort((a, b) => {
    if (a.signe === b.signe) {
      return a.nom.localeCompare(b.nom);
    }
    return a.signe.localeCompare(b.signe);
  });

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroNumberCircle
              valeur={airesAppellationsControlees.length}
              arrondi={1}
              unite=""
              ariaLabel="Nombre d'aires d'appellations contrôlées sur votre territoire"
            />
            {tableCommune !== undefined ? (
              <>
                <div className={styles.text}>
                  {airesAppellationsControlees.length > 0 ? (
                    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                      Votre territoire compte{' '}
                      {countAOC && countIGP
                        ? `${countAOC} AOC et ${countIGP} IGP`
                        : countAOC
                          ? `${countAOC} AOC`
                          : countIGP
                            ? `${countIGP} IGP`
                            : 'aucune appellation'}
                      , véritables marqueurs de son identité, de son économie et
                      de son attractivité.
                    </Body>
                  ) : (
                    <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                      Sans disposer d’appellations reconnues, votre territoire
                      peut néanmoins être structurellement lié à la notoriété, à
                      l’attractivité touristique et aux retombées économiques
                      des AOC et IGP environnantes.
                    </Body>
                  )}
                  <CustomTooltipNouveauParcours
                    title={airesAppellationsControleesTooltipText}
                    texte="Définition"
                  />
                  <a
                      className="fr-sr-only"
                      href="https://agriculture.gouv.fr/bien-connaitre-les-produits-de-lorigine-et-de-la-qualite"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consulter la page sur les signes d&apos;identification de qualité et d&apos;origine sur agriculture.gouv.fr (nouvelle fenêtre)
                    </a>
                </div>
              </>
            ) : (
              <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                Il n'y a pas de données référencées sur le territoire que vous
                avez sélectionné
              </Body>
            )}
          </div>
          <AiresAppellationsControleesText />
        </div>
        <div
          className={styles.datavizWrapper}
          style={{ borderRadius: '1rem 0 0 1rem', height: 'fit-content' }}
        >
          <div className={styles.dataWrapper}>
            {airesAppellationsControlees.length > 0 ? (
              <PieChartAiresAppellationsControlees
                airesAppellationsControlees={airesAppellationsControlees}
              />
            ) : (
              <div className="p-10 flex flex-row justify-center">
                <DataNotFoundForGraph image={DataNotFound} />
              </div>
            )}
          </div>
          <div
            className={styles.sourcesExportWrapper}
            style={{
              borderTop: '1px solid var(--gris-medium)',
              borderRadius: '0 0 0 1rem'
            }}
          >
            <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
              Source : Institut national de l’origine et de la qualité - INAO,
              2026 (consultée en janvier 2026)
            </Body>
            <ExportButton
              data={exportData}
              baseName="aires_appellations_controlees"
              type={type}
              libelle={libelle}
              code={code}
              sheetName="Appellations contrôlées"
              anchor="Appellations contrôlées"
            />
          </div>
        </div>
      </div>
    </>
  );
};
