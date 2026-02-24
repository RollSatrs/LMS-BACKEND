FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build && find /app/dist -type f

FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod
RUN pnpm add drizzle-kit dotenv
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/drizzle ./drizzle
COPY migrate.config.cjs ./

EXPOSE 10000
ENV PORT=10000
# Сначала миграции, потом старт приложения (echo чтобы в логах Render было видно)
CMD ["sh", "-c", "echo '=== Running migrations ===' && npx drizzle-kit migrate --config=migrate.config.cjs && echo '=== Migrations OK, starting app ===' && node /app/dist/src/main.js"]
