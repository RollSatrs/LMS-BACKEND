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
COPY --from=builder /app/dist/ ./dist/

EXPOSE 10000
ENV PORT=10000
# Показать содержимое dist и запустить (Nest может положить main.js в dist или dist/src)
CMD ["sh", "-c", "ls -la /app/dist && ls -la /app/dist/src 2>/dev/null; node /app/dist/main.js 2>/dev/null || node /app/dist/src/main.js"]
