# Kieu's Crochet Shop Storefront

Customer-facing handmade crochet shop built with Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit, and RTK Query.

[Open the live storefront](https://tiemlen.lesitoan.io.vn/)

## Features

- Product browsing, search, category, color, price, and sort filters.
- Product gallery, options, stock information, and care instructions.
- Content-based recommendations on product detail and cart pages.
- Local-storage cart with server-side price and stock refresh.
- Authenticated checkout and VietQR payment flow.
- Email/password and Google sign-in.
- Customer profile, addresses, and order history.
- SEO-friendly blog listing and article pages.

## Main routes

| Route | Screen |
| --- | --- |
| `/` | Home |
| `/san-pham` | Products |
| `/san-pham/[slug]` | Product detail |
| `/gio-hang` | Cart |
| `/thanh-toan` | Checkout |
| `/thanh-toan/qr/[orderId]` | VietQR payment |
| `/bai-viet` | Blog |
| `/bai-viet/[slug]` | Blog article |
| `/tai-khoan` | Customer account |

## Demo

### Home

![Home hero and best sellers](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167296/demo-tiemlennhakieu/client/Screenshot_jihyzy.png)
![Categories and today's deals](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167295/demo-tiemlennhakieu/client/Screenshot_1_auwk6h.png)
![Blog and footer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167295/demo-tiemlennhakieu/client/Screenshot_2_vclzn2.png)

### Shopping

![Product listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167294/demo-tiemlennhakieu/client/Screenshot_3_tgcnfz.png)
![Product detail](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167294/demo-tiemlennhakieu/client/Screenshot_4_c6rukg.png)
![Product information and recommendations](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167293/demo-tiemlennhakieu/client/Screenshot_5_kwox80.png)
![Shopping cart](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167292/demo-tiemlennhakieu/client/Screenshot_6_ahqmql.png)
![Checkout](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167292/demo-tiemlennhakieu/client/Screenshot_7_pfectn.png)
![VietQR payment](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167291/demo-tiemlennhakieu/client/Screenshot_8_mqe1am.png)

### Blog and account

![Blog listing](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167291/demo-tiemlennhakieu/client/Screenshot_9_hfmi4j.png)
![Blog article](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167290/demo-tiemlennhakieu/client/Screenshot_10_c7vqfq.png)
![Customer profile](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167289/demo-tiemlennhakieu/client/Screenshot_11_pah1yz.png)
![Order history](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167289/demo-tiemlennhakieu/client/Screenshot_12_oj0cum.png)
![Saved addresses](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167288/demo-tiemlennhakieu/client/Screenshot_13_pfqdlt.png)
![Change password](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167288/demo-tiemlennhakieu/client/Screenshot_14_b3vmuz.png)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `http://localhost:3000`.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```
