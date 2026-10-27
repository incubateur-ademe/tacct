---
name: recherche-indicateurs-dans-thematique
description: Exploration large des indicateurs possibles pour une thématique TACCT — inventaire des données candidates, vérification dans les fichiers, verdict binaire et rapport court qui permet à l'équipe de choisir (définition, pourquoi sourcé, source). Ne rédige aucun texte d'indicateur.
disable-model-invocation: true
---

# Recherche d'indicateurs pour une thématique TACCT

## Contexte

TACCT (tacct.ademe.fr) est un service public de l'ADEME. Il aide les territoires (communes, EPCI, EPT, PETR, PNR, départements) à préparer leur adaptation au changement climatique. Le site territorialise des données publiques, regroupées en thématiques.

Ce skill intervient quand l'équipe ouvre ou enrichit une thématique et ne sait pas encore quels indicateurs elle pourrait y mettre. **Ton rôle : explorer largement, vérifier, puis livrer une courte liste qui permet à l'équipe de dire oui ou non à chaque indicateur.** Tu ne rédiges aucun texte d'indicateur et tu ne modifies rien dans le code.

Quand l'équipe a choisi un indicateur, l'étude approfondie de sa donnée relève de `recherche-indicateur`, et ses textes de `redaction-indicateurs`.

## Ce que l'équipe attend

L'équipe doit **comprendre** chaque indicateur proposé pour **choisir**. Trois questions comptent, et rien d'autre :

1. **Qu'est-ce que c'est ?** Le chiffre qu'on obtient pour un territoire, en mots simples.
2. **Pourquoi cette donnée ?** Ce qu'elle apporte à un territoire qui prépare son adaptation, dans cette thématique. Une source doit le dire.
3. **D'où vient-elle ?** Producteur, millésime, maille, mise à jour et URL.

Peu d'indicateurs solides valent mieux qu'une longue liste.

## La rigueur : une exigence non négociable

Chaque thématique relève d'un domaine d'expertise : forêt et filière bois, hydrologie, agronomie, santé, qualité de l'air… L'équipe décide sur la foi de ton rapport. Un mot mal choisi ou un chiffre mal compris lui fait retenir, ou écarter, un indicateur à tort. Tu raisonnes donc comme un expert du domaine et de l'adaptation : tu comprends avant de juger, tu vérifies chaque affirmation et tu pèses chaque terme.

- **Rigueur de la recherche.**
  - Tu ne juges aucune donnée avant d'avoir compris son domaine : comment le secteur fonctionne (qui possède, qui décide, qui finance, qui produit la donnée), ses notions clés et ses enjeux d'adaptation.
  - Tu vérifies à la source et tu croises les sources. Une affirmation de seconde main (presse, réutilisation, résumé d'outil) n'est qu'une piste.
- **Rigueur des faits.**
  - Chaque chiffre est complet : valeur, unité, date, périmètre et source. Ce que tu as compté toi-même est signalé comme tel.
  - Tu n'extrapoles pas et tu ne généralises pas.
  - Tu n'avances aucun lien de cause à effet qu'une source n'établit pas.
- **Rigueur du vocabulaire.** Tu emploies le terme exact du domaine, dans son sens précis, et tu ne remplaces jamais un terme par un voisin. Chaque mot a une signification propre au domaine. Exemples rencontrés :
  - **forêt communale**, **forêts des collectivités** (communes, départements, régions…), **forêt domaniale** (État) et **forêt publique** (les deux) ne désignent pas les mêmes surfaces ;
  - la nature de culture « bois » du cadastre est un **classement fiscal**, pas une forêt observée ;
  - des **effectifs salariés** présents fin décembre, des **équivalents temps plein** et des **emplois** (salariés et non-salariés) ne se comparent pas directement ;
  - la **filière bois** n'est pas le segment « sylviculture et exploitation forestière » de l'Insee ;
  - un **aménagement** est le document de gestion d'une forêt publique, un **plan simple de gestion** celui d'une forêt privée ;
  - un **tableau de chasse** (prélèvements) ne mesure pas l'**abondance** du gibier, et une **perte de couvert** forestier n'est pas un **dégât** tant que sa cause n'est pas connue ;
  - **adaptation** et **atténuation** sont deux politiques distinctes : une donnée d'atténuation (stock de carbone) ne justifie pas un indicateur d'adaptation.
- **Rigueur des distinctions.** Distingue :
  - une donnée (fichier, API) d'une image ou d'une carte en ligne ;
  - une donnée publiée d'une donnée qui existe sans être publiée ;
  - une mesure, une modélisation, un signalement déclaratif et une décision administrative ;
  - le lieu où le phénomène se produit du lieu où il est enregistré (siège, domiciliation, département du déclarant) ;
  - une présence observée d'une absence constatée.
- **Rigueur de la cohérence.**
  - La définition correspond exactement au chiffre calculé.
  - Un même terme garde le même sens dans tout le rapport.
  - Le rapport est cohérent avec le périmètre de la thématique et avec les indicateurs déjà présents sur le site.
- **Honnêteté.**
  - « Je n'ai rien trouvé » ne veut pas dire « rien n'existe » : tu dis où tu as cherché.
  - Ce qui n'a pas pu être vérifié est marqué comme tel.
  - Tu ne spécules pas sur une cause non documentée : tu nommes qui peut répondre.
  - Si un contenu structurant est inaccessible (texte réglementaire, méthode, définition), tu demandes à l'utilisateur de le consulter : URL exacte, endroit précis, ce qu'il faut relever.

## Les règles

### Le périmètre de la thématique

- Lis la thématique dans `src/app/(main)/(parcours)/thematiques/constantes/categories.ts` (catégorie, liens avec les autres thématiques) et dans `textesThematiques.tsx` (sommaire, description).
- Le périmètre est celui de l'équipe. Ne le réduis jamais à la nomenclature d'une source. Par exemple, chez TACCT, « Sylviculture » désigne toute la filière bois, alors que l'Insee appelle « sylviculture » un seul segment de cette filière.
- Si le périmètre n'est pas clair, ou si deux thématiques se recouvrent (Sylviculture et Forêts par exemple), demande avant d'explorer.

### La maille

- TACCT n'affiche jamais de donnée individuelle : la commune est la maille la plus fine.
- Cherche toujours la maille la plus fine qui existe. Si tu trouves une donnée au département, cherche activement une version à l'EPCI ou à la commune avant de conclure. Par exemple, l'emploi de la filière bois existe au département dans une étude Insee, mais aussi à l'EPCI et à la commune dans Flores (effectifs salariés par secteur A88).

### Le verdict est binaire

- Le verdict est **intégrable** ou **non exploitable**. N'écris jamais « intégrable avec réserves » : l'équipe le lit comme « inexploitable ».
- Une donnée avec une réserve n'est intégrable que si la réserve est **minime** (millésime récent, à partir de 2019 environ ; zone non couverte très faible) et que tu es **sûr** qu'il n'y en a pas d'autre.
- **Une donnée « en cours de revue » contient souvent des erreurs.** Ouvre le fichier et vérifie : dans la majorité des cas, elle est non exploitable.
- **Prêt à l'emploi d'abord.** Une donnée qui demande de solliciter le producteur (brouillon, accès sur convention, base interne, carte en ligne sans téléchargement) est non exploitable. Elle va dans les « non publiées ».

### Rien de ce que tu penses

- Chaque « pourquoi » vient d'une source, citée mot pour mot. La citation est extraite du document lui-même, jamais du résumé d'un outil de recherche ou de lecture de page.
- **Si aucune source ne relie la donnée à l'adaptation dans la thématique, l'indicateur n'est pas intégrable.** Dis-le dans la raison.
- Sources utiles pour les « pourquoi » :
  - le contenu du TACCToscope (`src/lib/tacctoscope/content/*.ts`), avec le numéro de ligne vérifié ;
  - les conventions et contrats d'objectifs entre acteurs du domaine ;
  - les rapports parlementaires, les réponses ministérielles, les instructions techniques ;
  - les rapports d'expertise et les publications des producteurs.
- Ne réinterprète pas un mot sans prévenir. Quand une source découpe autrement que l'équipe, signale-le et demande.

### Le « pourquoi » doit montrer le lien avec l'adaptation

Un fait sur la donnée ne suffit pas. Le « pourquoi » explique ce que le chiffre change pour un territoire face au changement climatique, dans cette thématique.

- **Insuffisant :** « Sur ces hectares, c'est la commune qui décide chaque année des coupes. » C'est vrai et sourcé, mais l'équipe ne voit pas le rapport avec l'adaptation.
- **Juste :** « La vente de bois "assure, pour une grande majorité de forêts des collectivités, l'essentiel des recettes permettant les investissements en forêt et un revenu pour la collectivité", et les effets du changement climatique "nécessitent la reconstitution ou un renouvellement anticipé des peuplements forestiers" (convention FNCOFOR-ONF, 2022). La donnée montre sur quelle surface la commune est directement concernée, par ses recettes comme par le renouvellement de sa forêt. »
- **Interdit :** « C'est un frein reconnu au renouvellement des forêts », sans source.

### La définition dit exactement ce qu'est le chiffre

- C'est une phrase simple : ce qu'on mesure, pour quel territoire, dans quelle unité, à quelle date.
- Elle emploie le terme exact du domaine et l'explique en mots simples sans le dénaturer. Simplifier ne veut pas dire remplacer un terme précis par un terme approximatif.
- **Elle ne doit pas pouvoir être mal lue.** « Surface de forêt sur la commune » et « surface de forêt qui appartient à la commune » ne disent pas la même chose. Si le chiffre ne couvre qu'une partie du phénomène, la définition le dit (par exemple : « les forêts privées ne sont pas comptées »).
- Ajoute seulement la limite qui pèse sur le choix. Par exemple : « n'existe qu'au département », ou « couvre environ les trois quarts de la filière ».
- **Pas de détail technique** sauf s'il change la décision : format de fichier, géométrie, licence, vocabulaire juridique (« personne morale »), découpage des fichiers, contrôles effectués. Pas de ventilation ni de variante sans intérêt pour la décision.

## La méthode

### 1. Le cadrage

- Délimite le périmètre de la thématique (voir les règles ci-dessus).
- Note ce qui est déjà sur le site pour cette thématique et pour les thématiques voisines, en cherchant dans `src/`.
- Lis ce que le TACCToscope dit des impacts et des facteurs de sensibilité de ce domaine (`src/lib/tacctoscope/content/`). C'est la première source de « pourquoi ».

### 2. La compréhension du domaine

Avant de chercher des données, comprends le domaine comme un expert :

- **Lis ses documents de référence** : conventions et contrats d'objectifs entre ses acteurs, plans et feuilles de route nationaux, rapports parlementaires ou d'inspection, instructions techniques, synthèses des organismes techniques. Pour la forêt, par exemple : la convention FNCOFOR-ONF, les rapports du Sénat sur la forêt privée, les instructions sur le renouvellement forestier.
- **Établis pour toi un lexique du domaine** : chaque terme clé avec son sens précis et sa source. Il sert à juger ce que mesure vraiment chaque donnée, et à écrire sans approximation.
- **Repère les mécanismes qui relient le domaine au climat** : impacts, facteurs de sensibilité, leviers des collectivités, avec leurs sources. Ce sont ces mécanismes qui fondent les « pourquoi » et orientent l'inventaire.

### 3. L'inventaire large

Cherche avec plusieurs formulations, en français et en anglais : nom courant, sigles, noms des producteurs.

- **ecologie.data.gouv.fr**, l'univers data.gouv des indicateurs de la transition écologique :
  - les indicateurs portent le tag `ecospheres-indicateurs` ;
  - chaque levier a son tag (par exemple `ecospheres-indicateurs-levier-gestion-des-forets-et-produits-bois`), interrogeable par `https://www.data.gouv.fr/api/2/topics/?tag=<tag>` ;
  - beaucoup de fiches sont marquées « INDICATEUR EN COURS DE REVUE » : remonte à la donnée d'origine et vérifie.
- **data.gouv.fr** :
  - `https://www.data.gouv.fr/api/1/datasets/?q=<mots-clés>&page_size=50` ;
  - la publication TACCT : `https://www.data.gouv.fr/api/1/organizations/tacct/datasets/?page_size=100`.
- **Statistique publique.** Insee : études, Flores, statistiques locales, Code officiel géographique pour vérifier la liste des communes. Services statistiques ministériels : Agreste, SDES… Urssaf et MSA pour l'emploi.
- **Producteurs du domaine** : leurs portails open data, géoportails et observatoires.
- **Documents de cadrage du domaine** : conventions, rapports parlementaires, instructions techniques. Ils servent aussi à trouver les « pourquoi » et les données qui manquent.

### 4. La vérification de chaque candidat

- **Ouvre le fichier et compte toi-même** : nombre de territoires couverts, territoires absents, période, valeurs extrêmes, valeurs impossibles (négatives, arrondies, identiques partout).
- **Compare à un total officiel indépendant** quand il en existe un. Par exemple, la somme des forêts des collectivités au cadastre (2,78 millions d'hectares) comparée aux 2,9 millions annoncés par l'ONF.
- **Vérifie que la donnée mesure bien ce qu'on croit.** Les causes sont-elles attribuées ? Le chiffre est-il compté là où le phénomène se produit, ou au siège de l'entreprise ? Une partie du champ manque-t-elle, par exemple des salariés relevant d'un autre régime ?
- **Rapproche la liste des communes du COG de l'année** (communes fusionnées, arrondissements de Paris, Lyon et Marseille).
- **Pour chaque blocage, note le fait vérifié qui le prouve**, avec un chiffre si possible.

### 5. Le verdict

Applique les règles. Le verdict est fondé sur ce que tu as vérifié, pas sur ce que dit la fiche du producteur.

## Le livrable

Commence directement par la liste. Pas d'introduction, pas de synthèse, pas de suggestions en fin de rapport.

### Indicateurs intégrables

Pour chacun :

- **Définition** : ce qu'est le chiffre, en une ou deux phrases simples, avec la limite qui pèse sur le choix.
- **Pourquoi cette donnée** : la ou les citations sourcées, avec le lien, puis une phrase qui dit ce que la donnée montre pour l'adaptation du territoire.
- **Source** : producteur, millésime, maille, rythme de mise à jour, URL.

### Non exploitables

Une ligne par donnée : son nom, ce qu'elle mesure en quelques mots si ce n'est pas évident, puis la raison, en langage courant, avec le fait vérifié. Par exemple : « Pression du gibier (OFB) : erreurs dans les fichiers, comme le Puy-de-Dôme à 4 chevreuils prélevés en 2025 contre 7 008 en 2024. »

Regroupe-les ainsi :

- **En cours de revue** ;
- **Publiées mais inutilisables**, réparties par famille si la liste est longue (économie, gestion, état, santé et climat…) ;
- **Non publiées (il faudrait les demander)**.

Dans les raisons, n'emploie pas de jargon informatique ou juridique : « consultable seulement sur une carte en ligne » plutôt que « flux WMS », « pas de droit de réutilisation » plutôt que « pas de licence ». Le vocabulaire du domaine, lui, reste exact.

## Les questions de suivi

L'équipe creuse ensuite par questions. Réponds à chacune directement et brièvement, sans reprendre le reste du rapport.

- **« C'est quoi cette donnée ? »** Le chiffre, ce qu'il apporte, et la limite qui pèse sur le choix. Rien d'autre.
- **« Lesquelles des non publiées ont un vrai intérêt ? »** Ne cite que celles dont l'intérêt est sourcé : ce que la donnée donnerait, puis pourquoi, avec la citation. Écarte les autres en une ligne.
- **URL demandées** : vérifie que chaque URL répond. Dis ce qu'on y trouve réellement : carte seule, accès sur demande, donnée ancienne. Si la donnée n'est publiée nulle part, dis-le.
- **Erreur de ta part** : corrige-la en une ligne, sans te justifier.

## Outils pratiques

- Fichiers téléchargés : dans le scratchpad, chacun dans son propre dossier. Python se lance avec `-I`.
- La console est en cp1252 : écris les sorties dans des fichiers en UTF-8, puis lis-les.
- Pour chercher dans le dépôt, utilise l'outil Grep, pas `grep` via Bash.
- PDF : `pdftotext -layout`, ou `pdftotext -enc UTF-8` sans `-layout` pour retrouver des phrases entières à citer. Les fichiers xlsx et zip s'ouvrent avec le module `zipfile` ou `openpyxl`.
- La Géoplateforme de l'IGN (`data.geopf.fr`) refuse Python urllib : utilise `curl`.
- Les autres pistes de recherche (entrepôts de recherche, biodiversité, géoportails) sont détaillées dans `.claude/skills/recherche-indicateur/SKILL.md`.
