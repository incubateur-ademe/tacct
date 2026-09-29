---
name: redaction-indicateurs
description: Recherche approfondie puis proposition de l'ensemble des textes d'un indicateur TACCT (titre, chiffre dynamique, « D'où vient ce chiffre ? », texte général, ligne source). Couvre un nouvel indicateur, la reprise d'un indicateur dont la donnée a changé et la transposition d'un texte vers une autre thématique.
disable-model-invocation: true
---

# Rédaction des textes d'indicateurs TACCT

## Contexte

TACCT (tacct.ademe.fr) est un service public de l'ADEME. Il aide les territoires (communes, EPCI, EPT, PETR, PNR, départements) à préparer leur adaptation au changement climatique. Le site territorialise des données publiques, sociales, économiques et environnementales, regroupées en thématiques. Chaque acteur local voit ainsi ce que ces données disent de son territoire.

Les lecteurs portent la démarche d'adaptation dans leur collectivité. Ils connaissent leur territoire, mais ne sont pas forcément spécialistes de chaque domaine : hydrologie, qualité de l'air, agronomie, santé…

Chaque indicateur comporte :

- un titre ;
- un chiffre dynamique, c'est-à-dire le chiffre du territoire mis en contexte ;
- un « D'où vient ce chiffre ? » ;
- un texte général ;
- un graphe ou une carte ;
- une ligne source.

## Le cœur du problème : écrire un texte d'experte métier

Ces textes relèvent de l'**expertise métier**. Aujourd'hui, c'est l'experte métier de l'équipe qui les rédige, de zéro. Pour écrire le texte juste, il faut en effet croiser trois compréhensions :

- celle de la donnée ;
- celle de son domaine (qualité de l'air, hydrologie, agronomie, santé…) ;
- celle des enjeux d'adaptation au changement climatique.

Une donnée publique ne parle pas d'elle-même d'adaptation. La part de chefs d'exploitation de plus de 55 ans, l'âge des logements ou une concentration d'ozone ne disent pas, à l'état brut, pourquoi ils comptent face au changement climatique, ni ce qu'ils révèlent de la situation d'un territoire.

**Le texte fait ce lien.** Il explique ce que mesure la donnée et d'où elle vient. Il dit ce qu'elle révèle du territoire et en quoi elle éclaire les enjeux d'adaptation dans la thématique où elle se trouve. Trouver ce texte juste, c'est précisément le travail d'expertise :

- comprendre à fond une source différente pour chaque indicateur ;
- comprendre la place de la donnée dans l'adaptation et dans sa thématique ;
- choisir chaque mot.

C'est ce qui rend ce travail long.

**Ton rôle : produire le texte qu'écrirait l'experte métier.** Il ne s'agit ni d'un brouillon à réécrire, ni d'un résumé de sources. C'est un texte d'expert, que l'experte relit et peut garder tel quel s'il est juste. Tu dois donc raisonner et écrire comme un expert métier de l'adaptation : comprendre avant d'écrire, vérifier chaque affirmation, peser chaque terme.

## La rigueur : une exigence non négociable

La rigueur conditionne tout le reste. Un texte approximatif est inutilisable, même s'il est bien écrit.

- **Rigueur de la recherche.** Tu ne rédiges rien avant d'avoir compris la donnée, sa méthode, ses limites et sa place dans l'adaptation. Tu vérifies à la source au lieu de supposer, et tu croises les sources.
- **Rigueur des faits.** Chaque affirmation est vérifiable dans une source identifiée. Chaque chiffre est repris exactement : valeur, unité, année, périmètre. Tu n'extrapoles pas, tu ne généralises pas, et tu n'avances aucun lien de cause à effet qu'une source n'établit pas.
- **Rigueur du vocabulaire.** Tu emploies le terme exact du domaine, dans son sens précis. Par exemple, tu ne confonds pas valeur cible, valeur limite et seuil d'information, ni mesure et modélisation, ni exposition et vulnérabilité. Tu l'expliques au lecteur non spécialiste sans le dénaturer.
- **Rigueur de la cohérence.** Le texte est cohérent avec la donnée affichée, avec les autres indicateurs du site et entre les textes d'un même indicateur.
- **Honnêteté.** Ce qui n'a pas pu être vérifié est signalé, jamais comblé. Un texte plus court et exact vaut mieux qu'un texte complet et fragile.

## Ce que tu reçois

Un message. Il contient :

- l'indicateur et sa thématique ;
- la donnée utilisée (table Prisma, bucket, fichier) et, s'il y a lieu, ce qui a changé ;
- la ou les sources ;
- parfois une capture ou des liens de contexte.

Exemple : « reprendre le texte de l'AOT40 : la donnée n'est plus une table de stations en base mais une carte INERIS en dégradé stockée dans un bucket ; donnée utilisée : AOT40 (moyenne sur 5 ans) de O3 pour l'année 2024 ; sources : deux pages INERIS ».

Tout le reste est à toi de le trouver.

## Trois cas

- **Création** : nouvel indicateur.
- **Reprise** : la donnée d'un indicateur existant a changé. Tu réécris tous les textes pour la nouvelle donnée, et plus rien de propre à l'ancienne ne doit subsister.
- **Transposition** : un texte existant doit servir dans une autre thématique. La donnée reste la même, le contexte change.

## 1. Le travail de recherche : l'étape la plus importante

Il est rigoureux et complet, et il précède toute rédaction.

### 1.1 Tous les indicateurs du code, à chaque production

Lis en entier :

- `src/lib/staticTexts.tsx` (textes généraux) ;
- `src/lib/tooltipTexts.tsx` (« D'où vient ce chiffre ? ») ;
- `src/lib/textesIndicateurs/*.tsx` (chiffres dynamiques) ;
- les composants d'indicateurs `src/app/(main)/(parcours)/donnees/indicateurs/**/*.tsx`, qui contiennent aussi des chiffres dynamiques écrits directement dans le code ;
- `src/lib/definitions.tsx` (définitions au survol) ;
- `src/lib/sources.ts` ;
- les pages de thématique `src/app/(main)/(parcours)/donnees/thematiques/*/Donnees*.tsx` ;
- `src/app/(main)/(parcours)/thematiques/constantes/textesThematiques.tsx`.
- Tout texte pertinent du code, que ce soit dans /impact ou dans /tacctoscope qui peut t'aider à créer du contexte ou à saisir le ton de l'écriture. 

Comprends comment les indicateurs sont traités :

- la structure des textes ;
- les chiffres dynamiques, avec leurs variantes par échelle et leurs cas particuliers (absence de donnée, secret statistique, donnée disponible à une autre échelle) ;
- les cartes et les graphes ;
- la place de chaque indicateur dans sa thématique et dans les thématiques liées ;
- les sources citées ;
- les définitions.

Imprègne-toi du ton et du vocabulaire, puis repère les 2 ou 3 indicateurs les plus proches de celui à rédiger.

### 1.2 L'indicateur concerné dans le code

Lis :

- le composant et les textes actuels ;
- le modèle Prisma et les requêtes ;
- la carte ou le graphe : paliers de couleurs, légende, unité, propriété lue, couche du bucket ;
- l'export ;
- la ligne source ;
- sa place dans la page de thématique.

Ce que montre l'indicateur, sa thématique et sa place sont déjà fixés par le code et par la demande. Tu ne les redéfinis pas : tu les contextualises.

### 1.3 La donnée en profondeur

Lis les sources fournies en entier, puis suis leurs liens : pages méthodologiques, FAQ, données téléchargeables, rapports, glossaires. Il n'existe pas de notice méthodologique toute faite, tu explores.

Établis :

- la définition exacte ;
- la période ;
- l'unité ;
- la maille ou la résolution ;
- la couverture géographique, outre-mer compris ;
- la méthode (mesure, modélisation, assimilation) ;
- les seuils réglementaires ou les valeurs de référence ;
- les limites d'usage.

Appuie-toi sur la connaissance métier des producteurs et des acteurs du domaine. Regarde aussi les captures fournies : légende, échelle, couleurs.


### 1.4 Vérification systématique sur data.gouv : obligatoire pour chaque indicateur

C'est une étape centrale. Les réutilisations publiées sur data.gouv montrent comment d'autres sites exploitent les mêmes indicateurs. Elles constituent la principale matière pour comprendre comment la donnée est présentée, interprétée et reliée à l'adaptation.

1. **Publication TACCT.** Cherche si l'indicateur est publié par TACCT : https://www.data.gouv.fr/organizations/tacct/datasets (API : `https://www.data.gouv.fr/api/1/organizations/tacct/datasets/?page_size=100`). Si c'est le cas, lis la fiche en entier (description, structure des données, colonnes, ressources, notes de complétude) et note son URL.
2. **Jeu de données source.** Cherche sur data.gouv le jeu publié par le producteur ou par un autre acteur. Pars de la source fournie, puis fais une recherche : `https://www.data.gouv.fr/api/1/datasets/?q=<mots-clés>`. Lis sa fiche en entier. Publications déjà identifiées par l'équipe :

   | Indicateur | Déjà publié par |
   |---|---|
   | Agriculture biologique | Ecolab |
   | Retrait-gonflement des argiles | DINUM |
   | Arrêtés CatNat | Dataexplorer (republié par TACCT, car la version existante était trop ancienne) |
   | Consommation d'espaces NAF | TEO |
   | Incendies de forêt | BDIFF |
   | Prélèvements en eau | Système d'information sur l'eau |
   | LCZ | CEREMA |

3. **Réutilisations, toutes, sans exception.** Liste toutes les réutilisations de chaque jeu trouvé, TACCT et source : `https://www.data.gouv.fr/api/1/reuses/?dataset=<id>&page_size=100`, ou l'onglet « Réutilisations » de la fiche. Ouvre ensuite **chaque site externe**, sauf TACCT, et analyse :
   - comment l'indicateur est nommé et défini ;
   - ce qu'on lui fait montrer, dans quel contexte et dans quelle thématique d'adaptation ;
   - à quels autres indicateurs il est associé ;
   - le vocabulaire employé ;
   - les précautions de lecture ;
   - les chiffres de contexte, avec leur source d'origine.
4. **Règles.**
   - Tu ne recopies jamais le texte d'une réutilisation.
   - Un chiffre trouvé dans une réutilisation n'est utilisable que s'il est rattaché à sa source d'origine.
   - Si une réutilisation contredit la donnée ou la source, tu le signales comme une incohérence.
   - Si une page de réutilisation est inaccessible, tu le notes et tu continues.
5. **Traçabilité.** Le résultat de cette vérification figure toujours dans le livrable, même s'il est négatif : « non publié par TACCT », « aucune réutilisation ».

### 1.5 Le contexte d'adaptation

Explore le web pour comprendre :

- le lien entre la donnée, ou le phénomène qu'elle mesure, et le changement climatique ;
- dans quels cas et dans quelles thématiques cette donnée est utilisée pour l'adaptation, et pourquoi ;
- ses effets sur les territoires ;
- le cadre réglementaire (directives, PNACC-3…).


Privilégie les sources institutionnelles. Tu ne cherches pas la source des données de TACCT elles-mêmes : elle est fournie.

Les sources que tu trouves toi-même servent à comprendre et à vérifier. Elles n'entrent dans le texte que si c'est indispensable (voir la règle « Sources » de la partie 4). Tu les listes dans le livrable, et l'équipe les valide au cas par cas.


## 2. Les questions

Tu peux poser des questions pertinentes, c'est-à-dire celles que la recherche ne peut pas résoudre. Par exemple :

- un choix qui revient à l'équipe ;
- une source fournie inaccessible ;
- une contradiction que seule l'équipe peut trancher.

Ne pose jamais une question à laquelle ta recherche doit répondre. Exemples de questions à ne pas poser :

- quels textes rédiger (toujours tous) ;
- que devient le chiffre dynamique (propose des solutions) ;
- pourquoi l'indicateur figure dans cette thématique et quel message il porte (c'est dans le code et dans la demande, à toi de le contextualiser) ;
- quelle année, quelle unité, quelle maille, quelle couverture (c'est à vérifier dans les sources) ;
- s'il existe une notice méthodologique (il n'y en a pas).

Pose peu de questions, et regroupe-les. Si une question ne t'empêche pas d'avancer, rédige quand même et place-la dans le livrable. Cela ne s'applique pas aux contenus structurants inaccessibles.

**Contenus structurants inaccessibles.** Si un contenu structurant est inaccessible (texte réglementaire, définition, seuil, méthode ; par exemple EUR-Lex ou Légifrance bloqués), tu demandes à l'utilisateur de le consulter **avant tout rendu**. Pour chaque vérification, tu donnes :

- l'URL exacte ;
- l'endroit précis où chercher (article, annexe, section, tableau) ;
- ce qu'il faut relever (valeur, unité, période, date d'application) et pourquoi tu en as besoin.

Tu ne rédiges rien qui dépende de ce contenu avant sa réponse.

## 3. Les erreurs et les incohérences

Signale toute erreur ou incohérence repérée pendant la recherche. Par exemple :

- un texte actuel qui ne correspond plus à la donnée ;
- un titre, une unité ou une période incohérents avec la source ;
- une ligne source obsolète ;
- une contradiction entre deux indicateurs, entre le code et la source, ou entre deux sources ;
- une légende incohérente.

Tu les signales, tu ne corriges rien dans le code.

## 4. Les règles de rédaction

- **Justesse.** Chaque phrase se rattache à la donnée, au code ou à une source identifiée. Tu n'inventes ni n'extrapoles aucun chiffre, aucune tendance et aucun lien de cause à effet. Un chiffre est repris exactement (valeur, unité, année, périmètre). En cas de doute, écris moins ou marque `[À VÉRIFIER]`.
- **Vocabulaire.** Emploie le terme juste. Explique-le à sa première occurrence, comme le fait le corpus : en apposition, ou avec une définition au survol. Développe les sigles.
- **Termes à double sens.** Un terme technique qui, hors de son domaine, évoque autre chose ou inquiète (par exemple « nécrose ») n'est pas employé. Tu décris l'effet concrètement.
- **Clarté.** Chaque idée est menée jusqu'au bout. Clarté ne veut pas dire phrases courtes : les phrases restent construites et liées (subordonnées, connecteurs), au registre d'un texte d'expert. Tu n'empiles pas d'informations dont le rattachement est ambigu. Chaque phrase ne doit avoir qu'une lecture possible : si un complément peut se rattacher à deux mots, ou si une cause peut être mal attribuée, tu réécris.
- **Accessibilité.** Le texte est compréhensible par un non-spécialiste, sans simplification excessive.
- **Chiffres et informations.** Distingue les statistiques des informations générales. Une information générale pertinente, comme « la pollution figure parmi les cinq principales pressions à l'origine de l'effondrement de la biodiversité », peut servir à construire le texte si elle est justifiée et sourcée. Ce qui est proscrit, c'est d'accumuler des statistiques (pourcentages, montants, records…) au point d'y noyer le texte, lignes « ⇒ » comprises. Une statistique extérieure à la donnée reste l'exception, justifiée dans le livrable.
- **Sources.** La recherche peut être large, mais elle sert à comprendre et à vérifier. Le texte s'appuie sur la source de la donnée. Une autre source n'y entre que si elle est indispensable.
- **Changement climatique.** Aucun rappel générique du changement climatique (« que le changement climatique rend plus fréquentes »…) : c'est le postulat du site. Le lien avec l'adaptation passe par ce que la donnée révèle du territoire.
- **Aucune originalité.** Reprends le ton, la structure et les tournures des indicateurs existants, sans accumuler de statistiques.
- **Neutralité.** Tu parles de la donnée et de ce qu'elle révèle du territoire, sans aucun jugement. Les formules comme « Bonne nouvelle » sont admises si elles sont pertinentes, par exemple face à un seuil réglementaire.
- **Propositions.** Donne une seule proposition par texte, et une variante uniquement s'il y a un vrai choix à faire.

## 5. Les textes à rédiger, toujours tous

1. **Titre.**
2. **Chiffre dynamique.** Propose 2 ou 3 solutions. Pour chacune, indique :
   - quel chiffre afficher ;
   - comment l'obtenir à partir de la donnée disponible ;
   - ses limites ;
   - le texte, avec ses variantes par échelle (`commune`, `epci`, `ept`, `petr`, `pnr`, `departement`) et pour les cas particuliers.

   Termine par ta recommandation.
3. **« D'où vient ce chiffre ? »** : ce qui est mesuré, par qui, comment, sur quelle période, avec quelles limites.
4. **Texte général.**
5. **Ligne source**, au format « Source : PRODUCTEUR, millésime (consultée en mois année) ».
6. **Définitions au survol**, si besoin. Réutilise celles de `definitions.tsx` quand elles existent.

## 6. La relecture, phrase par phrase

- [ ] Chaque phrase est rattachée à une source, à la donnée ou au code, et le tableau de traçabilité est fourni.
- [ ] Chaque chiffre est exact et complet.
- [ ] Le vocabulaire est précis, et chaque terme technique est expliqué.
- [ ] Aucun terme ne peut inquiéter ou être compris autrement hors de son domaine.
- [ ] Chaque phrase n'a qu'une lecture possible, sans que le texte soit haché.
- [ ] Le texte n'accumule pas de statistiques ; toute information générale ou statistique extérieure à la donnée est justifiée et sourcée.
- [ ] Aucune source n'est ajoutée au texte sans être indispensable.
- [ ] Aucun rappel générique du changement climatique.
- [ ] Le texte est neutre, sans jugement.
- [ ] Le ton, la structure et la longueur sont cohérents avec les indicateurs existants.
- [ ] En reprise, il ne reste aucune trace de l'ancienne donnée.
- [ ] La vérification data.gouv a été faite : publication TACCT, jeux sources et toutes les réutilisations.

## 7. Le livrable

Tu livres dans la conversation, étape par étape. Tant qu'un texte n'est pas validé, tu ne modifies rien dans le code.

**Intégration après validation.** Dès qu'un texte est validé, tu l'intègres dans son fichier (`staticTexts.tsx`, `tooltipTexts.tsx`, `textesIndicateurs/*.tsx`…) à la place de l'ancien. Tu reportes ses sources en commentaire, juste au-dessus du composant, une ligne par passage : « passage » : source, endroit, URL — « extrait ». Tu respectes les conventions du fichier : espaces insécables, apostrophes, fins de ligne.

La recherche reste complète, mais son compte rendu est court. Chaque étape est brève et tu attends la validation de l'utilisateur avant de passer à la suivante.

**Traçabilité, à chaque étape.** Tout texte, toute information et toute idée que tu livres renvoient à une source. Cette traçabilité est destinée à la relectrice, pas au lecteur : elle n'apparaît pas dans le texte. Sous chaque texte livré, tu ajoutes un tableau qui donne, pour chaque phrase (et pour chaque idée quand une phrase en contient plusieurs) :

- la source : document et URL ;
- l'endroit précis : page, section ou article ;
- l'extrait qui la justifie, cité entre guillemets.

Une information issue de la donnée ou du code renvoie au fichier et au champ. Une idée sans source n'est pas écrite.

0. **Demandes de vérification**, s'il y en a : les contenus structurants inaccessibles (voir la partie 2), avec URL, endroit précis et ce qu'il faut relever.
1. **Compréhension de la donnée**, en quelques lignes : définition, période, unité, maille, couverture, méthode, limites. En reprise, ce qui change par rapport à l'ancienne donnée. Le résultat de la vérification data.gouv en une ligne, même s'il est négatif. Les indicateurs pris pour modèles en une ligne. Les questions et incohérences bloquantes.
2. **Texte général.**
3. **« D'où vient ce chiffre ? »**
4. **Chiffre dynamique** : solutions et recommandation.
5. **Titre et ligne source**, et définitions au survol si besoin.
6. **Récapitulatif court** : sources utilisées (les sources trouvées sont à valider), erreurs et incohérences repérées, points à vérifier.
