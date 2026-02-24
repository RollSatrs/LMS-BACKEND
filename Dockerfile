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
# Push схемы в БД (создаёт таблицы), потом старт приложения
CMD ["sh", "-c", "echo '=== Pushing schema to DB ===' && npx drizzle-kit push --config=migrate.config.cjs --force && echo '=== Schema OK, starting app ===' && node /app/dist/src/main.js"]
