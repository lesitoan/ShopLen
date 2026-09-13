# Kieu's Crochet Shop Admin

Operations dashboard for Kieu's Crochet Shop. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit, RTK Query, Recharts, and TipTap.

[Open the live admin dashboard](https://tiemlen-admin.lesitoan.io.vn/)

## Features

- Revenue, order, customer, and inventory overview.
- Order filtering, payment review, status updates, and cancellation handling.
- Product, image, option, stock, and category management.
- Customer and staff account management.
- Blog and rich-text content management.
- Analytics, reward, promotion, and configuration screens.

## Main routes

| Route | Screen |
| --- | --- |
| `/` | Dashboard |
| `/orders` | Orders |
| `/products` | Products |
| `/categories` | Categories |
| `/customers` | Customers |
| `/staff` | Staff |
| `/blog` | Blog |
| `/analytics` | Analytics |
| `/settings` | Settings |

## Demo

### Dashboard and orders

![Dashboard KPIs and revenue chart](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_154946_m9if98.png)
![Recent orders and inventory](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_154959_a7atji.png)
![Order listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155025_eqpd5c.png)
![Order detail](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155114_pomona.png)

### Catalog and customers

![Product listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155133_iy923q.png)
![Create product drawer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155259_v0h9am.png)
![Category listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155330_rqnqrs.png)
![Create category drawer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155340_zmr9ly.png)
![Customer listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155356_cll3ep.png)
![Customer detail](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155416_cqqz8l.png)

### Staff and settings

![Staff listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155436_otukty.png)
![Create staff drawer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155450_q8zzoj.png)
![Change staff password](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155500_bnsve6.png)
![Edit staff drawer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155512_ikizrq.png)
![Bank and VietQR settings](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155534_y3xmtj.png)
![Order and shipping settings](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155543_hyfyhm.png)
![Telegram notification settings](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155550_shkk0d.png)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dashboard runs at `http://localhost:3001`.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```
