# Kieu's Crochet Shop

Full-stack e-commerce platform for handmade crochet products. The repository contains three independent applications connected through REST APIs and Socket.IO.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6+-DC382D?style=flat&logo=redis)](https://redis.io/)

## Live demo

- [Customer storefront](https://tiemlen.lesitoan.io.vn/)
- [Admin dashboard](https://tiemlen-admin.lesitoan.io.vn/)

| Storefront | Admin dashboard |
| :---: | :---: |
| [![Storefront](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167296/demo-tiemlennhakieu/client/Screenshot_jihyzy.png)](https://tiemlen.lesitoan.io.vn/) | [![Admin dashboard](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_154946_m9if98.png)](https://tiemlen-admin.lesitoan.io.vn/) |

## Applications

| Source | Purpose | Default port |
| --- | --- | ---: |
| `fe-client` | Customer storefront | 3000 |
| `fe-admin` | Operations dashboard | 3001 |
| `apiNest` | NestJS REST API, workers, and real-time service | 4000 |

## Highlights

- Email/password and Google authentication.
- Local-storage cart with authenticated checkout.
- VietQR payment and SePay webhook processing.
- Product recommendations for detail and cart pages.
- Redis caching for public catalog and blog data.
- BullMQ order-expiry and notification jobs.
- Real-time order and stock updates with Socket.IO.
- Product, order, customer, staff, and blog management.

## Architecture

```text
fe-client ─┐
           ├── REST API / Socket.IO ── apiNest ── PostgreSQL
fe-admin  ─┘                                ├── Redis / BullMQ
                                           └── VietQR, SePay, Cloudinary,
                                               Resend, Telegram, Google
```

## Local setup

Use Node.js 22 to match CI and the Docker image, with PostgreSQL and Redis.

```bash
npm install
npm run install:apps
```

Copy each application's `.env.example` to its `.env`, configure PostgreSQL and Redis, then generate the Prisma client and start development:

```bash
npm --prefix apiNest run prisma:generate
npm run dev
```

For a new database, run `npx prisma migrate deploy` from `apiNest` to apply the existing migration history. Existing databases retain their schema and migration history; framework migration does not require a reset or a new business migration.

The default backend entrypoint serves HTTP and Socket.IO without starting queue workers. To run the API with notification and order-expiry workers, build the backend and run `node dist/mainWithWorkers.js` from `apiNest` against the intended environment.

## Commands

```bash
npm run dev
npm run dev:api
npm run dev:client
npm run dev:admin
npm run build
npm run typeCheck
```

## API deployment

The storefront and admin dashboard are deployed by Vercel. The backend source is `apiNest`.

- `apiNestVerify.yml` installs dependencies, generates Prisma, runs lint and type-checking, builds the backend, and runs unit tests. It supports pull requests, pushes to `main`, `develop` and `codex/**`, and manual runs.
- `apiNestImage.yml` runs manually after verification, builds the Docker image, and checks container health, authentication boundaries and shutdown. Publishing is disabled by default; selecting `publish=true` publishes `ghcr.io/<owner>/shoplen-api-nest:<commit SHA>`.
- `apiNest/docker-compose.staging.yml` is a deployment template using an immutable image reference. It starts the HTTP entrypoint and binds to loopback port 5002 by default.

There is no automatic server deployment workflow. The current preview was loaded and started separately on the server; repository cleanup does not replace running containers or change Nginx routing. Runtime secrets remain outside the image and Git, with required variable names recorded in `apiNest/.env.example`.

## Documentation

- [Backend source](apiNest/)
- [Customer storefront](fe-client/README.md)
- [Admin dashboard](fe-admin/README.md)
