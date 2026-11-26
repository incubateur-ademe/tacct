'use client';

import type { ResultatCarte } from '@/lib/queries/metabase/types';
import { ResponsivePie, type PieCustomLayerProps, type PieTooltipProps } from '@nivo/pie';
import styles from '../metabase.module.scss';
import { formaterNombre, formaterValeur, versNombre } from '../formatage';
import { InfoBulle } from './InfoBulle';
import { COULEUR_AUTRES, PALETTE_CATEGORIES, THEME_NIVO } from './theme';

type Part = { id: string; label: string; value: number; color: string };

const AUTRES = '__autres__';
const PARTS_MAX = PALETTE_CATEGORIES.length;

const pourcentage = (valeur: number, total: number) =>
  formaterNombre(total ? Math.round((1000 * valeur) / total) / 10 : 0, ' %');

export const Donut = ({
  resultat,
  categorie,
  valeur,
  libelles = {},
  couleurs = {},
  suffixeCategorie = ''
}: {
  resultat: ResultatCarte;
  categorie: string;
  valeur: string;
  libelles?: Record<string, string>;
  couleurs?: Record<string, string>;
  suffixeCategorie?: string;
}) => {
  const regroupees = new Map<string, { libelle: string; total: number }>();
  for (const ligne of resultat.lignes) {
    const brute = ligne[categorie] ?? null;
    const cle = String(brute ?? '—');
    const existante = regroupees.get(cle);
    const montant = versNombre(ligne[valeur] ?? null);
    if (existante) existante.total += montant;
    else regroupees.set(cle, { libelle: libelles[cle] ?? `${formaterValeur(brute)}${suffixeCategorie}`, total: montant });
  }

  let entrees = [...regroupees].map(([cle, { libelle, total }]) => ({ cle, libelle, total })).filter((e) => e.total > 0);
  if (entrees.length > PARTS_MAX) {
    const triees = [...entrees].sort((a, b) => b.total - a.total);
    const gardees = new Set(triees.slice(0, PARTS_MAX - 1).map((e) => e.cle));
    const reste = triees.slice(PARTS_MAX - 1).reduce((somme, e) => somme + e.total, 0);
    entrees = [...entrees.filter((e) => gardees.has(e.cle)), { cle: AUTRES, libelle: 'Autres', total: reste }];
  }

  const total = entrees.reduce((somme, e) => somme + e.total, 0);
  const parts: Part[] = entrees.map((e, index) => ({
    id: e.cle,
    label: e.libelle,
    value: e.total,
    color: couleurs[e.cle] ?? (e.cle === AUTRES ? COULEUR_AUTRES : PALETTE_CATEGORIES[index])
  }));

  const Centre = ({ centerX, centerY }: PieCustomLayerProps<Part>) => (
    <text x={centerX} y={centerY} textAnchor="middle" className={styles.donutCentre}>
      <tspan x={centerX} dy="-0.2em" className={styles.donutTotal}>
        {formaterNombre(total)}
      </tspan>
      <tspan x={centerX} dy="1.5em" className={styles.donutLibelle}>
        Total
      </tspan>
    </text>
  );

  const Info = ({ datum }: PieTooltipProps<Part>) => (
    <InfoBulle
      couleur={datum.color}
      libelle={datum.data.label}
      valeur={`${formaterNombre(datum.value)} (${pourcentage(datum.value, total)})`}
    />
  );

  return (
    <div className={styles.donut}>
      <ul className={styles.legende}>
        {parts.map((part) => (
          <li key={part.id} className={styles.legendeElement}>
            <span className={styles.pastille} style={{ background: part.color }} aria-hidden="true" />
            <span className={styles.legendeLibelle}>{part.label}</span>
            <span className={styles.legendeValeur}>{pourcentage(part.value, total)}</span>
          </li>
        ))}
      </ul>
      <div className={styles.donutGraphique}>
        <div className={styles.graphiqueInterieur}>
          <ResponsivePie<Part>
            data={parts}
            colors={{ datum: 'data.color' }}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            innerRadius={0.62}
            padAngle={1}
            cornerRadius={2}
            activeOuterRadiusOffset={4}
            borderWidth={0}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            layers={['arcs', Centre]}
            tooltip={Info}
            theme={THEME_NIVO}
            role="img"
          />
        </div>
      </div>
    </div>
  );
};
