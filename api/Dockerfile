FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Prisma config requires DATABASE_URL while generating the client.
# This value is used only during image build; runtime receives the real URL from .env.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY scripts ./scripts
COPY src ./src

RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
