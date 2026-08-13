# Tiem Len Nha Kieu

A handmade crochet keychain e-commerce project with a customer storefront, an admin dashboard, and a backend API. The project is split into 3 independent sources so each part can be developed, deployed, and maintained separately.

- Client: [https://tiemlennhakieu.io.vn/](https://tiemlennhakieu.io.vn/)
- Admin: [https://tiemlennhakieu-admin.vercel.app/](https://tiemlennhakieu-admin.vercel.app/)

## Demo Images

Screenshots can be added here later.

```md
![Home page](./docs/images/client-home.png)
![Product listing](./docs/images/client-products.png)
![Admin dashboard](./docs/images/admin-dashboard.png)
```

## Main Features

### Customer Website

- Browse the home page, categories, product listing, and product detail pages.
- Search and filter products by category, color, price, and highlight group.
- Store cart data in the browser with `localStorage`.
- Register and log in with email/password or Google.
- Require login before checkout.
- Pay by bank transfer using QR payment information.
- Track order status, view order details, and view payment information.
- Manage customer profile, shipping addresses, and order history.
- Content pages for about, contact, FAQ, policies, and blog.

### Admin Dashboard

- Admin/staff login.
- Dashboard for revenue, orders, top products, and low-stock products.
- Product, product image, category, status, and stock management.
- Order management with status updates, manual payment confirmation, and cancellation.
- Customer, staff, basic role/permission, and operation screens.

### Backend API

- Versioned REST API under `/api/v1`.
- MVC architecture with `routes`, `controllers`, `services`, `models`, `dto`, and `types`.
- JWT authentication separated for customers and admins.
- Product snapshots stored in order items so historical orders are not affected when products are edited or deleted.
- Integrations for Prisma/PostgreSQL, Redis/BullMQ, Socket.IO, Cloudinary, Google Auth, email, and Telegram notifications.
- Payment webhook, bank transfer QR information, and real-time order status updates.

## Tech Stack

### Frontend Client

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit, RTK Query, React Redux
- React Hook Form
- Google OAuth
- Lucide React, Swiper, PhotoSwipe, React Toastify

### Frontend Admin

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Recharts
- Lucide React, Swiper

### Backend API

- Node.js 20+
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis, BullMQ
- Socket.IO
- JWT, bcryptjs
- Zod
- Cloudinary, Multer
- Google Auth Library
- Resend, Telegraf
- Pino logger

## Project Structure

```txt
ShopLen/
+-- api/          # Backend API using MVC
+-- fe-client/    # Customer storefront
+-- fe-admin/     # Admin dashboard
+-- package.json  # Root scripts for all sources
+-- README.md
```

## Requirements

- Node.js `>= 20.19`
- npm
- PostgreSQL
- Redis
- Service accounts or configuration for optional integrations:
  - Google OAuth
  - Cloudinary
  - Resend
  - Telegram Bot
  - Bank/VietQR information

## Getting Started

### 1. Install dependencies

Run from the project root:

```bash
npm install
npm run install:apps
```

Or install each source separately:

```bash
npm --prefix api install
npm --prefix fe-client install
npm --prefix fe-admin install
```

### 2. Configure environment variables

Create `api/.env` from `api/.env.example` and fill in the required values:

```env
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=tiem-len
TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
BANK_ACCOUNT_NUMBER=
BANK_ACCOUNT_NAME=
BANK_CODE=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
FRONTEND_URL=http://localhost:3000
```

For the customer frontend, create `fe-client/.env` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

For the admin frontend, create `fe-admin/.env` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Prepare the database

Run Prisma generate and migrations inside the API source:

```bash
npm --prefix api run prisma:generate
npm --prefix api run db:migrate
```

Open Prisma Studio when you need to inspect data:

```bash
npm --prefix api run db:studio
```

### 4. Run development servers

Run the API, client, and admin together from the project root:

```bash
npm run dev
```

Or run each part separately:

```bash
npm run dev:api
npm run dev:client
npm run dev:admin
```

Default local URLs:

- API: `http://localhost:4000`
- Client: `http://localhost:3000`
- Admin: `http://localhost:3001`

### 5. Build for production

Build the entire project:

```bash
npm run build
```

Build each source separately:

```bash
npm run build:api
npm run build:client
npm run build:admin
```

### 6. Start production builds

```bash
npm run start:api
npm run start:client
npm run start:admin
```

## Useful Scripts

```bash
npm run typeCheck      # Check TypeScript for the API
npm run lint:client    # Lint the customer frontend
npm run lint:admin     # Lint the admin frontend
```

## Development Notes

- `fe-client` and `fe-admin` are independent sources and do not share internal components, hooks, types, or packages.
- Frontend API calls should go through RTK Query, not direct `fetch` or `axios` calls inside UI components.
- Backend business logic belongs in `services`; controllers should only handle requests and orchestration.
- API responses should return enough data for the current screen/use case without sending unnecessarily large objects.
- Mutations should return `success` and `message` when the frontend does not need the updated data immediately.
