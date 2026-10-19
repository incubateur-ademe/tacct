import { Body } from '@/design-system/base/Textes';

{
  /* Santé */
}

type ClasseAmbroisie = '1-10' | '11-50' | '51-100' | '100+';

const classesAmbroisie: Record<
  ClasseAmbroisie,
  { chiffre: string; communes: string; zone: 1 | 2 | 3; rang: number }
> = {
  '1-10': { chiffre: '1 à 10', communes: '1 à 10 communes', zone: 3, rang: 1 },
  '11-50': { chiffre: '11 à 50', communes: '11 à 50 communes', zone: 2, rang: 2 },
  '51-100': { chiffre: '51 à 100', communes: '51 à 100 communes', zone: 1, rang: 3 },
  '100+': { chiffre: '> 100', communes: '100 communes ou plus', zone: 1, rang: 4 }
};

const zonesAmbroisie = {
  1: { nom: 'infestée', objectif: 'de limiter la prolifération de la plante' },
  2: { nom: 'front de colonisation', objectif: 'd’éradiquer les populations d’ambroisie' },
  3: {
    nom: 'pas ou peu infestée',
    objectif: 'de surveiller et d’éradiquer les nouvelles populations'
  }
};

const estClasseAmbroisie = (classe: string): classe is ClasseAmbroisie =>
  classe in classesAmbroisie;

// Sources du texte :
// « Entre 2005 et 2025 » : Observatoire des ambroisies – FREDON France, carte nationale V7, titre, https://ambroisie-risque.info/wp-content/uploads/2026/05/carte-nationale-artemisiifolia-V7-scaled.png — « Etat des connaissances sur la présence de l’Ambroisie à feuilles d’armoise (Ambrosia artemisiifolia) en France entre 2005 et 2025 »
// « a été signalée dans {communes} » : classe du département dans src/lib/data/presence_ambroisie.json, lue sur la carte nationale V7 par etl/ambroisie/extract_ambroisie.py ; carte V7, légende — « Nombre de communes touchées dans le département » : « 1 - 10 », « 11 - 50 », « 51 - 100 », « 100 ou plus » ; Vade-mecum d’aide à l’élaboration de plan local d’action contre l’Ambroisie à feuilles d’armoise, juillet 2024, fiche technique 4, p. 28, https://ambroisie-risque.info/wp-content/uploads/2023/06/Vade-mecum_ambroisie.pdf — « le nombre de communes dans lesquelles il y a eu au moins un signalement d’Ambroisie à feuilles d’armoise »
// « relève ainsi de la zone {zone}, « {nom} », du zonage de l’Observatoire des ambroisies » : vade-mecum, fiche technique 4, p. 28 — « 1-10 Zone 3 : pas ou peu infestée / 11-50 Zone 2 : front de colonisation / >50 Zone 1 : infestée »
// « l’objectif y est {objectif} » : instruction interministérielle n° DGS/EA1/DGCL/DGALN/DGITM/DGAL/2018/201 du 20 août 2018, annexe 3, p. 19-20 du PDF, https://sante.gouv.fr/fichiers/bo/2018/18-09/ste_20180009_0000_0078.pdf — zones 1 : « Objectif: limiter la prolifération » ; zones 2 : « Objectif: Eradiquer les populations d’ambroisie » ; zones 3 : « objectif: Surveiller et éradiquer les nouvelles populations d’ambroisie »
// « Cette donnée ne dit pas si la plante est présente dans votre commune » : la donnée est un nombre de communes par département (carte V7, légende) ; les communes touchées ne sont publiées qu’en image
// Département(s) du territoire : deux premiers caractères des codes Insee des communes du territoire, communes d’outre-mer (97, 98) exclues ; chiffre affiché : classe du département le plus touché
// « Cette donnée n’est disponible que pour la France métropolitaine. » : formule de O3AirDynamicText ; la carte V7 ne couvre que l’Hexagone et la Corse
// « Il n’y a pas de données référencées […] » : formule standard du site, reprise de SurfacesEnHerbeDynamicText
// Points de vigilance :
// La zone est déduite de la classe, selon la règle du vade-mecum ; le plan départemental peut l’affiner : instruction du 20 août 2018, § 3.4.2, p. 8 du PDF — « le critère du nombre de communes infestées par département peut, en tant que de besoin, être complété par les critères d’ancienneté de la colonisation et de densité de pieds d’ambroisie ».
// Les zones publiées dans le bilan d’activités 2025 de l’Observatoire (40 départements en zone 1, 27 en zone 2, 29 en zone 3) viennent d’une édition antérieure de la carte ; l’édition 2005-2025 donne 44, 28 et 24.
export const AmbroisieDynamicText = ({
  departements,
  isOutreMer,
  type
}: {
  departements: { code: string; nom: string; classe: string }[];
  isOutreMer: boolean;
  type: string;
}) => {
  if (isOutreMer) {
    return (
      <Body>
        Cette donnée n’est disponible que pour la France métropolitaine.
      </Body>
    );
  }
  const connus = departements
    .flatMap(({ code, nom, classe }) =>
      estClasseAmbroisie(classe) ? [{ code, nom, classe }] : []
    )
    .sort(
      (a, b) =>
        classesAmbroisie[b.classe].rang - classesAmbroisie[a.classe].rang ||
        a.nom.localeCompare(b.nom)
    );
  if (connus.length === 0) {
    return (
      <Body>
        Il n’y a pas de données référencées sur le territoire que vous avez
        sélectionné
      </Body>
    );
  }
  const chiffre = (
    <Body weight="bold" style={{ fontSize: '28px', whiteSpace: 'nowrap' }}>
      {classesAmbroisie[connus[0].classe].chiffre}
    </Body>
  );

  if (connus.length > 1) {
    return (
      <>
        {chiffre}
        <Body htmlTag="div">
          Votre territoire s’étend sur {connus.length} départements. Entre 2005
          et 2025, l’ambroisie à feuilles d’armoise y a été signalée dans :
          <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
            {connus.map(({ code, nom, classe }) => {
              const { communes, zone } = classesAmbroisie[classe];
              return (
                <li key={code}>
                  {nom} : {communes} (zone {zone}, « {zonesAmbroisie[zone].nom} »)
                </li>
              );
            })}
          </ul>
        </Body>
      </>
    );
  }

  const { nom, classe } = connus[0];
  const { communes, zone } = classesAmbroisie[classe];
  const zonage = `la zone ${zone}, « ${zonesAmbroisie[zone].nom} », du zonage de l’Observatoire des ambroisies : l’objectif y est ${zonesAmbroisie[zone].objectif}.`;
  const lieu = type === 'commune' ? 'votre commune' : 'votre territoire';
  return (
    <>
      {chiffre}
      <Body>
        {type === 'departement' ? (
          <>
            Entre 2005 et 2025, l’ambroisie à feuilles d’armoise a été signalée
            dans {communes} de votre département. Il relève ainsi de {zonage}
          </>
        ) : (
          <>
            Entre 2005 et 2025, l’ambroisie à feuilles d’armoise a été signalée
            dans {communes} du département où se situe {lieu} ({nom}). Ce
            département relève ainsi de {zonage} Cette donnée ne dit pas si la
            plante est présente dans {lieu}.
          </>
        )}
      </Body>
    </>
  );
};
