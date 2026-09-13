# Kieu's Crochet Shop API

Backend service for the Kieu's Crochet Shop storefront and admin dashboard. The API is built with Express, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, and Socket.IO. All routes use the `/api/v1` prefix.

## Main features

- Separate JWT authentication for customers and staff.
- Email/password and Google customer login.
- Product, category, blog, customer, staff, and order management.
- Local-cart checkout with server-side price, option, and stock validation.
- VietQR payment flow and SePay webhook processing.
- Order expiry, stock restoration, email, and Telegram background jobs.
- Real-time order and stock updates with Socket.IO.

## Redis caching

Redis is used for read-heavy public data and BullMQ jobs.

| Data | TTL | Invalidation |
| --- | ---: | --- |
| Categories | 24 hours | Category create, update, or delete |
| Home blog posts | 24 hours | Blog or tag changes |
| Home product sections | 10 minutes | Product changes and stock restoration |

Cached reads use a short Redis lock to prevent duplicate database work. Public category, blog, and home-product responses also send HTTP cache headers. Product recommendations are not cached in V1.

## Product recommendations

Product detail and cart pages use the same content-based ranking service.

```text
score = category × 50%
      + price similarity × 25%
      + shared colors × 10%
      + popularity × 10%
      + freshness × 5%
```

- `GET /products/:slug` includes `relatedProducts`.
- `POST /products/recommendations` accepts up to 10 reference product IDs.
- Cart candidates use their highest similarity to any cart product.
- Reference, deleted, inactive, and out-of-stock products are excluded.
- Empty or invalid references fall back to popularity and freshness.
- V1 does not use customer history, collaborative filtering, or recommendation caching.

```json
{
  "productIds": ["product-uuid"],
  "limit": 4
}
```

## API groups

| Area | Prefix |
| --- | --- |
| Authentication | `/auth` |
| Products and categories | `/products`, `/categories` |
| Cart product refresh | `/cart/products` |
| Orders and payments | `/orders`, `/payments` |
| Customer profile and addresses | `/customers`, `/addresses` |
| Blog | `/blog` |
| Administration | `/admin/*` |

## Local setup

Requires Node.js 20.19+, PostgreSQL, and Redis.

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:migrate
npm run dev
```

The API runs at `http://localhost:4000/api/v1` by default.

## Commands

```bash
npm run dev
npm run typeCheck
npm run build
npm run start
```
