# Website

Site vitrine statique de PNS avec plusieurs sections.

Documentation à faire...

## Prérequis

- [Bun](https://bun.com)

## Stack technique

- Bun
- Astro
- Sass
- Node.js (pour déploiement uniquement)

# Développement

Une fois les dépendences installées avec `bun install`, le serveur de développement se lance avec `bun run dev`.

# Déploiement

L'application peut être construite avec Docker à la racine du monolithe (afin de pouvoir importer toutes les dépendences) :

`docker build -t pns-core-website -f apps/website/Dockerfile .`

et exécutée `docker run -d -p 3000:4321 pns-core-website`

Accès via http://localhost:3000.
