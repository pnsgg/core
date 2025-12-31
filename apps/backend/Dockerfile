FROM oven/bun:latest AS base

FROM base AS install
WORKDIR /app
COPY package.json bun.lock tsconfig.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/api-client/package.json ./packages/api-client/
RUN bun install

FROM install AS builder
WORKDIR /app
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src
RUN bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server apps/backend/src/index.ts

FROM base AS runner
ENV NODE_ENV=production
USER bun
WORKDIR /app
COPY --from=builder /app/server ./
EXPOSE 3000
ENTRYPOINT [ "/app/server" ]
