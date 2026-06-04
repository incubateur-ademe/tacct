# Explanation

## Objectif

L'objectif de cette section est de permettre aux utilisateurs d'acquérir une connaissance approfondie de l'outil numérique, de comprendre le framework utilisé, et de développer un modèle mental clair de son fonctionnement. Elle vise également à décrire l'architecture et la philosophie du projet pour fournir un contexte global et une compréhension approfondie.

## Technologies

- Le projet utilise **Next.js**
- Tailwind
- Prisma
- DSFR
- PostgreSql et Postgis
- Leaflet
- TypeScript
- Posthog

## Architecture

L'architecture du projet est modulaire et suit les principes de séparation des préoccupations :

- **src/** : Contient le code source principal, organisé en modules comme `components`, `hooks`, et `lib`.
- **public/** : Contient les ressources statiques comme les images et les icônes.
- **prisma/** : Contient le schéma de la base de données et les migrations.
- **doc/** : Fournit la documentation structurée selon le modèle Diataxis.

Par ailleurs, la section adr/ de la doc fournit davantage de détails sur les choix effectués lors de la construction du projet.

## Sécurité

Nous avons mis en place un Web Application Firewall (WAF) sur Scalingo. Ce WAF utilise **nginx** avec une configuration spécifique qui active **modsecurity**. Un fichier `secrules.conf` est utilisé pour lister et gérer les règles de sécurité afin de protéger l'application contre les menaces courantes.
