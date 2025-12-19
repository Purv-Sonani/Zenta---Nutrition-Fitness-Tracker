# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app

# --------------------
# Dependencies
# --------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --------------------
# Build
# --------------------
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema + config FIRST
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
# Generate Prisma Client
RUN npx prisma generate

# Copy rest of source
COPY tsconfig.json ./
COPY src ./src
COPY tests ./tests
COPY jest.config.cjs ./

# Build TypeScript
RUN npm run build

# --------------------
# Runtime
# --------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src 
COPY --from=build /app/tests ./tests
COPY --from=build /app/jest.config.cjs ./jest.config.cjs
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]

