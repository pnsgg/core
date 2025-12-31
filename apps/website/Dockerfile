FROM oven/bun AS build
WORKDIR /app

COPY . .
RUN bun install

WORKDIR /app/apps/website
RUN bun run build

FROM node:lts-slim AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/website/dist ./apps/website/dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

WORKDIR /app/apps/website
CMD ["node", "./dist/server/entry.mjs"]