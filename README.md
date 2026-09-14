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
| `api` | REST API, workers, and real-time service | 4000 |

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
           ├── REST API / Socket.IO ── api ── PostgreSQL
fe-admin  ─┘                            ├── Redis / BullMQ
                                       └── VietQR, SePay, Cloudinary,
                                           Resend, Telegram, Google
```

## Local setup

Requires Node.js 20.19+, PostgreSQL, and Redis.

```bash
npm install
npm run install:apps
```

Copy each `.env.example` file to the matching local environment file, then initialize the database:

```bash
npm --prefix api run prisma:generate
npm --prefix api run db:migrate
npm run dev
```

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

The storefront and admin dashboard are deployed by Vercel. The API is built by GitHub Actions and deployed to the matching Portainer stack through its API:

| Git branch | Portainer stack | Image tag |
| --- | --- | --- |
| `develop` | `shoplen-dev` | `ghcr.io/lesitoan/shoplen-api:dev` |
| `main` | `shoplen-v2` | `ghcr.io/lesitoan/shoplen-api:production` |

Before enabling the workflow, configure the GitHub environments `Development` and `Production`. Each requires `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and `PORTAINER_API_TOKEN`. Configure GHCR as a registry in Portainer before its stacks use the private image.

The workflow preserves each stack's existing Portainer environment variables. Add or change runtime variables in the matching Portainer stack, and record required keys without secret values in `api/.env.example`.

## Documentation

- [API](api/README.md)
- [Customer storefront](fe-client/README.md)
- [Admin dashboard](fe-admin/README.md)
