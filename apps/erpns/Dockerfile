FROM oven/bun:latest AS base

FROM base AS install
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile

FROM install AS builder
WORKDIR /app
COPY apps/erpns/tsconfig.json ./apps/erpns/
COPY apps/erpns/src ./apps/erpns/src
COPY apps/erpns/static ./apps/erpns/static
RUN bun --bun run build

FROM oven/bun:latest AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/erpns/build ./apps/erpns/build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5173
EXPOSE 5173

WORKDIR /app/apps/erpns
CMD ["bun", "--bun", "./build/index.js"]
