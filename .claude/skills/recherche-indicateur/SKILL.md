---
name: recherche-indicateur
description: Exploration approfondie, notamment sur internet, de la donnée d'un indicateur TACCT potentiel qui n'est pas encore sur le site — existence, accès, format, contenu réel, maille, couverture, mise à jour, biais et exploitabilité. Ne rédige aucun texte d'indicateur.
disable-model-invocation: true
---

# Recherche de la donnée d'un nouvel indicateur TACCT

## Contexte

TACCT (tacct.ademe.fr) est un service public de l'ADEME. Il aide les territoires (communes, EPCI, EPT, PETR, PNR, départements) à préparer leur adaptation au changement climatique. Le site territorialise des données publiques, regroupées en thématiques.

Ce skill intervient en amont de `redaction-indicateurs`. L'équipe a une idée d'indicateur : un sujet, une thématique, parfois quelques liens. Elle ne sait pas encore si une donnée existe, si elle est exploitable, ni ce qu'elle permettrait de montrer.

**Ton rôle : établir les faits sur la donnée, pour que l'équipe décide si l'indicateur est intégrable.** Tu ne rédiges aucun texte d'indicateur et tu ne modifies rien dans le code. Si l'équipe décide de créer l'indicateur, la rédaction relève de `redaction-indicateurs`.

## La rigueur : une exigence non négociable

- **Vérifier à la source.** Tu ouvres les fichiers, tu lis les légendes, tu comptes toi-même. Une affirmation de seconde main (article de presse, réponse parlementaire, réutilisation) n'est qu'une piste.
- **Un résumé d'outil n'est pas une source.** Le texte renvoyé par un outil de lecture de page ou par un moteur de recherche peut déformer ou inventer une unité, une date, un classement. Toute information qui compte est vérifiée dans le document lui-même, extrait à l'appui.
- **Chaque chiffre est complet** : valeur, unité, période, périmètre, source, date de consultation. Un comptage que tu as fait toi-même est signalé comme tel.
- **Distinguer** :
  - une donnée (fichier, API) d'une image ou d'un PDF qu'il faudrait recopier ;
  - une donnée publiée d'une donnée qui existe sans être publiée (brouillon, espace réservé, base interne) ;
  - une mesure, une modélisation, un signalement déclaratif et une décision administrative (un arrêté dit qu'un préfet a décidé, pas que le phénomène est présent) ;
  - une présence observée d'une absence constatée.
- **Honnêteté.** « Je n'ai rien trouvé » ne veut pas dire « rien n'existe » : tu dis où tu as cherché. Ce qui n'a pas pu être vérifié est marqué comme tel. Tu ne spécules pas sur une cause, par exemple sur la raison pour laquelle une donnée n'est plus mise à jour : si elle n'est pas documentée, tu le dis et tu nommes qui peut répondre.

## Ce que tu reçois

Un sujet, une thématique, parfois des liens. Exemple : « indicateur potentiel sur l'ambroisie et les chenilles processionnaires, thématique santé ; seules informations : la liste des arrêtés préfectoraux et la carte des signalements de l'Observatoire ».

Tout le reste est à toi de le trouver.

## 1. Le cadrage dans le code

Il est bref : il sert à connaître les standards du site, pas à rédiger.

- Vérifie que la donnée n'est pas déjà sur le site, en cherchant les mots-clés dans `src/`.
- Lis la page de la thématique (`src/app/(main)/(parcours)/donnees/thematiques/*/Donnees*.tsx`), son sommaire (`src/app/(main)/(parcours)/thematiques/constantes/textesThematiques.tsx`) et les un ou deux indicateurs les plus proches (`src/app/(main)/(parcours)/donnees/indicateurs/**`). Note la maille utilisée, le type de carte ou de graphe et la source affichée.

## 2. Les sources fournies

- Lis-les en entier et suis leurs liens.
- **Un tableau en ligne** : récupère la page et compte toi-même les lignes (territoires couverts, territoires absents). Relève les erreurs : liens qui ouvrent le fichier d'un autre territoire, dates incohérentes, entrées vides.
- **Une carte** : télécharge le PDF ou l'image et relève la légende exacte. Note ce qui est compté (pieds, observations, communes…), l'unité, les classes, la période et les sources. Vérifie si l'unité change d'une version de la carte à l'autre.
- Note le format réel : tableau HTML, PDF, image ou fichier téléchargeable.

## 3. La recherche, partout

Cherche avec plusieurs formulations : nom courant, nom scientifique, synonymes, sigles, nom des producteurs, en français et en anglais.

1. **data.gouv.fr, obligatoire.**
   - **Publication TACCT** : `https://www.data.gouv.fr/api/1/organizations/tacct/datasets/?page_size=100`.
   - **Jeux de données** : `https://www.data.gouv.fr/api/1/datasets/?q=<mots-clés>&page_size=50`, avec plusieurs requêtes. Pour chaque jeu pertinent, lis la fiche : producteur, ressources et formats, licence, couverture temporelle et spatiale, fréquence, date de mise à jour.
   - **Réutilisations, toutes** : `https://www.data.gouv.fr/api/1/reuses/?dataset=<id>&page_size=100`. Ouvre chaque site et note comment la donnée y est utilisée, et si ses chiffres sont rattachés à leur source.
2. **Producteurs et acteurs du domaine** : observatoires, agences (Anses, Santé publique France, INRAE, OFB, Météo-France, Cerema…), ministères, ARS, ORS, associations de surveillance de la qualité de l'air, conservatoires botaniques… Cherche leurs pages de données, leurs géoportails (flux WMS ou WFS, requête `GetCapabilities`) et leurs API.
3. **Entrepôts de recherche** : Recherche Data Gouv (`https://entrepot.recherche.data.gouv.fr/api/search?q=<mots-clés>&type=dataset`), HAL, Zenodo. Une page institutionnelle peut renvoyer vers un jeu encore en brouillon par un lien privé (`privateurl.xhtml?token=…`). Ses métadonnées et sa liste de fichiers se lisent alors par `https://entrepot.recherche.data.gouv.fr/api/v1/datasets/privateUrlDatasetVersion/<token>`.
4. **Biodiversité** : INPN, OpenObs, plateformes régionales du système d'information sur la nature et les paysages (SINP) et GBIF.
   - Sur GBIF, utilise `https://api.gbif.org/v1/species/match`, puis `occurrence/search` avec des facettes (année, jeu de données, département) et `dataset/search`.
   - L'archive source d'un jeu (Darwin Core Archive) se télécharge souvent sans compte depuis le serveur du publieur (champ `endpoints` de la fiche du jeu).
5. **Plateformes de signalement et outils métier** (Atlasanté…) : cherche un export, une API ou un flux. S'il n'y en a pas, note que la donnée reste dans un espace réservé et qui le gère.
6. **Textes réglementaires et instructions** (Légifrance, bulletins officiels) : ils peuvent définir un critère, un zonage ou un seuil qui structure l'indicateur. Par exemple, l'instruction ambroisie de 2018 définit trois zones selon le nombre de communes infestées par département.
7. **Rapports d'expertise et bilans** (Anses, HCSP, bilans d'activité des observatoires) : ils décrivent les données existantes, leur méthode et leurs limites.

**Pages inaccessibles.** Essaie une autre adresse de la même page, une copie archivée ou le PDF direct, puis réessaie plus tard : une page qui refuse la connexion peut répondre quelques heures après. Si un contenu structurant reste inaccessible, demande à l'utilisateur de le consulter. Donne l'URL exacte, l'endroit précis, ce qu'il faut relever et pourquoi.

**Outils pratiques.**
- Les PDF se lisent après téléchargement avec `pdftotext -layout`.
- Les fichiers xlsx et zip s'ouvrent avec le module `zipfile` de Python.
- Les fichiers téléchargés vont dans le scratchpad, chacun dans son propre dossier, et Python se lance avec `-I`.

## 4. La fiche d'identité de chaque donnée

Pour chaque donnée trouvée, établis :

- **producteur, diffuseur et contacts** : les organismes, et les noms seulement s'ils figurent dans des métadonnées publiques ;
- **statut** : en open data, diffusée seulement en image ou en PDF, ou existante mais non publiée (brouillon, espace réservé, base interne) ;
- **accès** : URL exacte, compte requis ou non, API, format (CSV et son séparateur, Darwin Core Archive, GeoTIFF, WMS…), taille, licence ;
- **contenu réel** :
  - quand le fichier est publié, ouvre-le, compte les lignes et liste les colonnes ;
  - relève la période, le nombre de communes et de départements, et la façon d'identifier la commune : code INSEE, simple nom (attention aux homonymes) ou coordonnées ;
  - un jeu non publié (brouillon) se décrit à partir de ses métadonnées, sans télécharger ses fichiers ;
- **ce que dit une ligne**, en une phrase. Par exemple : « à telle date, à tel endroit, de l'ambroisie a été signalée puis confirmée par un référent » ;
- **méthode** : mesure, modélisation, signalement ou décision administrative. Précise aussi la validation et qui la fait : un champ de validation peut contredire la description du jeu ;
- **maille et couverture** (métropole, outre-mer), **période, fréquence et dernière mise à jour** ;
- **ce qu'elle ne dit pas** : quantité, absence, exposition, effet sur la santé, situation actuelle… ;
- **biais** :
  - concentration géographique : calcule la part des principales régions ou des principaux départements ;
  - effort d'observation qui se confond avec le phénomène ;
  - identifications automatiques ;
  - doublons entre sources.

## 5. L'exploitabilité selon les standards TACCT

Juge chaque donnée sur ces critères :

- **vraie donnée** : un fichier ou une API, et non une image à recopier à l'œil ;
- **couverture nationale** ;
- **maille** : la commune idéalement, le département au minimum. La donnée doit aussi distinguer les territoires : si presque tous ont la même valeur, elle ne dit rien ;
- **actualité** : période couverte et rythme de mise à jour ;
- **fiabilité** : peut-on interpréter l'absence, et le biais d'observation domine-t-il ?
- **rattachement aux territoires** : code INSEE, ou coordonnées à rattacher aux communes ;
- **licence**.

Conclus chaque donnée par un verdict :
- **intégrable** ;
- **intégrable avec réserves** ;
- **pas exploitable en l'état** ;
- **existe mais à demander** : précise à qui, et ce qu'on obtiendrait.

## 6. Les questions

Tu poses seulement les questions que la recherche ne peut pas résoudre : un contenu structurant inaccessible, ou un choix qui revient à l'équipe. Tu les regroupes.

## 7. Le livrable

L'utilisateur veut des réponses directes. Tu ne décris pas en détail ce qui ne sert pas la décision.

- **Commence par le verdict**, par sujet. Par exemple : « ambroisie : intégrable au département, avec réserves » ; « chenilles : rien d'exploitable en l'état ».
- **Donne ensuite l'essentiel de chaque source** : ce qu'est la donnée, comment l'obtenir, ce qu'elle contient, ce qu'elle dit et ne dit pas, ses limites. Regroupe les sources ainsi :
  - les sources fournies ;
  - les données ouvertes trouvées ;
  - les données existantes non publiées, avec leur producteur, leur contenu et le contact.
- **Rédige en phrases**, à l'intérieur de puces si besoin, sans tableau.
- **Traçabilité** : chaque fait renvoie à sa source (lien, et page, section, champ ou légende). Ce que tu as compté toi-même est signalé, et ce qui n'est pas vérifié est marqué « non vérifié ».
- **Erreurs et incohérences** des sources : signale-les brièvement.

L'utilisateur creuse ensuite par questions. Réponds à chacune directement, sans reprendre le reste, puis arrête-toi : pas de liste de pistes ni de suggestions en fin de réponse.

S'il demande un résumé de l'exploration, reprends la même organisation : le verdict par sujet, puis les sources fournies, les données ouvertes et les données non publiées.
