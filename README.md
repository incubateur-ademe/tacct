## Getting Started

This is a Next.js project runnning with pnpm

First, run the development server:

```bash
pnpm dev
```

## Projet TACCT

Notre mission : Aider chaque territoire à initier ou renforcer sa démarche d’adaptation au changement climatique.

## Flow pour l'intégration d'un indicateur

Après le choix d'une thématique et des indicateurs pertinents en lien avec cette thématique, nous devons récupérer cette donnée et l'adapter pour retourner l'information de façon cohérente pour une collectivité.

Le nettoyage et le prétraitement de la donnée par rapport à la base original se fait par Notebook python. L'intérêt est de limiter la taille des tables pour obtenir de meilleures performances.

Ensuite, cette donnée est intégrée à Postgres et requêtée par le frontend.

<p align="center">
  <img src="./public/flowIntegration.svg" />
</p>

## Structure des bases de données

Nous utilisons PostgreSQL pour le stockage de nos données (cf adr 001-stack).

La donnée stockée correspond à des données socio-économiques spécifiques à une thématique.

Le schéma databases regroupe les différentes thématiques et un schéma séparé est utilisé pour stocker les données géographiques qui nécessitent l'extension postgis.

![alt text](./public/postgresStructure.svg)

## Indexation

Lorsque cela est nécessaire pour améliorer les performances, par exemple lorsque la table dans la base de données a une structure particulière, nous réalisons une indexation. L'indexation peut être selon les colonnes du code géographique, du code epci ou du département. Si la table est ordonnée de façon croissante dans les valeurs de ces colonnes, nous utilisons l'agorithme BRIN ("BRIN indexes [...] are most effective for columns whose values are well-correlated with the physical order of the table rows.") dont la documentation est disponible ici : https://www.postgresql.org/docs/current/indexes-types.html
