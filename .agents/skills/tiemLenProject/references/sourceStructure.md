# Cấu trúc Source Code — Tách riêng FE Client & FE Admin (pattern app/ + screens/)

> Áp dụng theo pattern tham khảo: `app/` chỉ chứa route + `page.tsx` (import từ `screens/`),
> toàn bộ logic/UI riêng của từng màn hình nằm trong `screens/<tên-màn>`, còn cái gì dùng
> chung nhiều màn mới đưa lên `components/` và `hooks/` gốc.
> **Không dùng shared-types package dùng chung giữa client/admin/api** — mỗi source tự định nghĩa
> type riêng trong `types/` của chính nó, đồng bộ thủ công qua tài liệu API contract (tránh lỗi
> phụ thuộc chéo, tránh 1 source build fail kéo theo source khác).

---

## 0. Quy ước chung cho cả 2 source (client & admin)

**Nguyên tắc bắt buộc**:
1. `app/**/page.tsx` **chỉ làm 2 việc**: định nghĩa route + render component từ `screens/`. Không viết logic, không viết fetch data, không viết state trực tiếp trong `page.tsx`.
   ```tsx
   // app/(dashboard)/campaign/page.tsx
   import CampaignScreen from "@/screens/campaign";
   export default function Page() {
     return <CampaignScreen />;
   }
   ```
2. Mỗi màn hình có 1 folder riêng trong `screens/<ten-man>/` chứa: component chính, sub-component chỉ dùng riêng màn đó, hook riêng màn đó, logic xử lý riêng màn đó.
3. `components/` (gốc, ngoài screens) chỉ chứa component **dùng ở từ 2 màn trở lên** (Button, Table, Modal, Badge, ProductCard nếu xuất hiện ở cả Home lẫn Listing...).
4. `hooks/` (gốc) chỉ chứa hook **dùng chung nhiều màn** (useAuth, useCart, useSocket, useDebounce...). Hook chỉ phục vụ 1 màn thì để trong `screens/<ten-man>/hooks/`.
5. `services/api/` chứa toàn bộ hàm gọi API (theo domain: `product.api.ts`, `order.api.ts`...) — screens không tự viết `fetch`/`axios` trực tiếp, luôn qua lớp này.
6. `types/` chứa type của riêng source đó, chia theo domain — copy tay/đối chiếu theo tài liệu API contract, không import type từ package ngoài.
7. `stores/` chứa Zustand store dùng chung toàn app (cart, auth session...).

---

## 1. Cấu trúc `fe-client/` (FE Client — Storefront)

```
fe-client/
├── public/
│   └── images/
│       ├── products/
│       ├── categories/
│       ├── banner/
│       ├── blog/
│       └── icons/
│
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx                         → screens/home
│   │   │   ├── san-pham/
│   │   │   │   ├── page.tsx                     → screens/product-listing
│   │   │   │   └── [slug]/page.tsx              → screens/product-detail
│   │   │   ├── gio-hang/page.tsx                → screens/cart
│   │   │   ├── thanh-toan/
│   │   │   │   ├── page.tsx                     → screens/checkout
│   │   │   │   └── qr/[orderId]/page.tsx        → screens/payment-qr
│   │   │   ├── don-hang/thanh-cong/[orderId]/page.tsx → screens/order-success
│   │   │   ├── tra-cuu-don-hang/page.tsx        → screens/order-lookup
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                     → screens/blog-listing
│   │   │   │   └── [slug]/page.tsx              → screens/blog-detail
│   │   │   ├── gioi-thieu/page.tsx
│   │   │   └── lien-he/page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── dang-nhap/page.tsx               → screens/auth/login
│   │   │   ├── dang-ky/page.tsx                 → screens/auth/register
│   │   │   └── quen-mat-khau/page.tsx           → screens/auth/forgot-password
│   │   │
│   │   ├── (account)/
│   │   │   └── tai-khoan/
│   │   │       ├── page.tsx                     → screens/account/overview
│   │   │       ├── don-hang/
│   │   │       │   ├── page.tsx                 → screens/account/order-history
│   │   │       │   └── [id]/page.tsx            → screens/account/order-detail
│   │   │       ├── dia-chi/page.tsx             → screens/account/address
│   │   │       └── diem-thuong/page.tsx         → screens/account/loyalty
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── screens/
│   │   ├── home/
│   │   │   ├── index.tsx                        # component chính của màn Home
│   │   │   ├── components/                      # sub-component CHỈ dùng ở Home (HeroBanner, CategoryCircleList...)
│   │   │   └── hooks/                            # hook CHỈ dùng ở Home (useHomeBanners...)
│   │   │
│   │   ├── product-listing/
│   │   │   ├── index.tsx
│   │   │   ├── components/                      # FilterSidebar, SortDropdown, ProductGrid
│   │   │   └── hooks/                             # useProductFilter, useInfiniteScrollProducts
│   │   │
│   │   ├── product-detail/
│   │   │   ├── index.tsx
│   │   │   ├── components/                       # Gallery, VariantSelector, ReviewTab
│   │   │   └── hooks/                             # useProductStockSocket
│   │   │
│   │   ├── cart/
│   │   │   ├── index.tsx
│   │   │   ├── components/                        # CartItem, CartSummary
│   │   │   └── hooks/
│   │   │
│   │   ├── checkout/
│   │   │   ├── index.tsx
│   │   │   ├── components/                        # ShippingForm, OrderReview
│   │   │   └── hooks/                              # useCheckoutForm
│   │   │
│   │   ├── payment-qr/
│   │   │   ├── index.tsx
│   │   │   ├── components/                        # QrCard, CountdownTimer
│   │   │   └── hooks/                              # useOrderPaymentSocket
│   │   │
│   │   ├── order-success/
│   │   │   └── index.tsx
│   │   │
│   │   ├── order-lookup/
│   │   │   ├── index.tsx
│   │   │   └── hooks/                              # useOrderLookupSocket
│   │   │
│   │   ├── blog-listing/
│   │   │   └── index.tsx
│   │   │
│   │   ├── blog-detail/
│   │   │   ├── index.tsx
│   │   │   └── components/                         # RelatedPosts, ShareButtons, ProductMentionCard
│   │   │
│   │   ├── auth/
│   │   │   ├── login/index.tsx
│   │   │   ├── register/index.tsx
│   │   │   └── forgot-password/index.tsx
│   │   │
│   │   └── account/
│   │       ├── overview/index.tsx
│   │       ├── order-history/index.tsx
│   │       ├── order-detail/index.tsx
│   │       ├── address/index.tsx
│   │       └── loyalty/index.tsx
│   │
│   ├── components/                # DÙNG CHUNG >= 2 màn — không đặt logic riêng 1 màn ở đây
│   │   ├── ui/                    # Button, Input, Badge, Modal, Skeleton (base component)
│   │   ├── product/
│   │   │   └── ProductCard.tsx     # dùng ở Home, Listing, Related products
│   │   ├── order/
│   │   │   └── OrderTimeline.tsx   # dùng ở Order Lookup + Account Order Detail
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── hooks/                     # DÙNG CHUNG toàn app
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useSocket.ts            # khởi tạo socket instance dùng chung
│   │   └── useDebounce.ts
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx
│   │
│   ├── lib/
│   │   ├── axios.ts                 # instance axios + interceptor token
│   │   └── seo.ts
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── SocketProvider.tsx
│   │
│   ├── services/
│   │   └── api/
│   │       ├── product.api.ts
│   │       ├── order.api.ts
│   │       ├── auth.api.ts
│   │       ├── blog.api.ts
│   │       └── loyalty.api.ts
│   │
│   ├── stores/
│   │   ├── cart.store.ts
│   │   └── auth.store.ts
│   │
│   └── types/
│       ├── product.type.ts
│       ├── order.type.ts
│       ├── user.type.ts
│       └── blog.type.ts
│
├── .env.local.example
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Cấu trúc `fe-admin/` (FE Admin — Dashboard)

```
fe-admin/
├── public/
│   └── images/
│       ├── admin/
│       └── icons/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx                          → screens/dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                      → screens/orders/list
│   │   │   │   └── [id]/page.tsx                 → screens/orders/detail
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                      → screens/products/list
│   │   │   │   ├── new/page.tsx                  → screens/products/create
│   │   │   │   └── [id]/page.tsx                 → screens/products/edit
│   │   │   ├── categories/page.tsx               → screens/categories
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx                      → screens/customers/list
│   │   │   │   └── [id]/page.tsx                 → screens/customers/detail
│   │   │   ├── promotions/page.tsx               → screens/promotions
│   │   │   ├── rewards/config/page.tsx           → screens/loyalty-config
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                      → screens/blog/list
│   │   │   │   ├── new/page.tsx                  → screens/blog/create
│   │   │   │   └── [id]/page.tsx                 → screens/blog/edit
│   │   │   ├── staff/page.tsx                    → screens/staff
│   │   │   ├── settings/page.tsx                 → screens/settings
│   │   │   └── analytics/page.tsx                → screens/reports
│   │   │
│   │   ├── login/page.tsx                        → screens/auth/login
│   │   └── layout.tsx
│   │
│   ├── screens/
│   │   ├── dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── components/                        # RevenueChart, QuickStatCard, RecentOrdersTable
│   │   │   └── hooks/                              # useDashboardSocket
│   │   │
│   │   ├── orders/
│   │   │   ├── list/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── components/                     # OrderFilterBar
│   │   │   │   └── hooks/                           # useOrderListSocket
│   │   │   └── detail/
│   │   │       ├── index.tsx
│   │   │       ├── components/                     # ConfirmPaymentButton, StatusStepper, InternalNote
│   │   │       └── hooks/
│   │   │
│   │   ├── products/
│   │   │   ├── list/index.tsx
│   │   │   ├── create/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/                     # VariantFormGroup, ImageUploader
│   │   │   └── edit/index.tsx
│   │   │
│   │   ├── categories/index.tsx
│   │   │
│   │   ├── customers/
│   │   │   ├── list/index.tsx
│   │   │   └── detail/index.tsx
│   │   │
│   │   ├── promotions/index.tsx
│   │   ├── loyalty-config/index.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── list/index.tsx
│   │   │   ├── create/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/                     # RichTextEditor, ProductMentionPicker
│   │   │   └── edit/index.tsx
│   │   │
│   │   ├── staff/index.tsx
│   │   ├── settings/index.tsx
│   │   ├── reports/index.tsx
│   │   │
│   │   └── auth/
│   │       └── login/index.tsx
│   │
│   ├── components/                  # DÙNG CHUNG >= 2 màn admin
│   │   ├── ui/                       # Button, Input, Badge (có thể trùng style client nhưng code riêng)
│   │   ├── data-table/
│   │   │   └── DataTable.tsx          # dùng ở Orders, Products, Customers, Blog list...
│   │   ├── confirm-dialog/
│   │   │   └── ConfirmDialog.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Topbar.tsx
│   │       └── NotificationBell.tsx
│   │
│   ├── hooks/
│   │   ├── useAuthAdmin.ts
│   │   ├── useSocketAdmin.ts
│   │   └── useRoleGuard.ts
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   │
│   ├── lib/
│   │   └── axios.ts
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── SocketProvider.tsx
│   │
│   ├── services/
│   │   └── api/
│   │       ├── order.api.ts
│   │       ├── product.api.ts
│   │       ├── customer.api.ts
│   │       ├── promotion.api.ts
│   │       ├── blog.api.ts
│   │       └── staff.api.ts
│   │
│   ├── stores/
│   │   └── auth.store.ts
│   │
│   └── types/
│       ├── order.type.ts
│       ├── product.type.ts
│       ├── customer.type.ts
│       └── staff.type.ts
│
├── middleware.ts                      # check auth + role trước khi vào (dashboard)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

> Nếu vẫn muốn dùng Vite thay vì Next.js cho admin, cấu trúc `screens/` `components/` `hooks/` giữ nguyên, chỉ khác `app/` → `src/pages/` (React Router) thay vì Next.js App Router. Pattern tách biệt logic vẫn áp dụng y hệt.

---

## 2.1. Quy chuẩn cấu trúc Call API bằng RTK Query & Redux Toolkit trong FE (`fe-client` & `fe-admin`)

Cấu trúc thư mục API layer theo chuẩn Clean Architecture:

```
src/
├── store/                          # Redux Store chính
│   ├── index.ts                    # configureStore, nạp baseApi.reducer & middleware
│   ├── rootReducer.ts              # Gom reducers
│   ├── hooks.ts                    # Typed hooks (useAppDispatch, useAppSelector)
│   └── slices/                     # Local Client State
│       ├── cartSlice.ts            # State giỏ hàng (lưu LocalStorage qua Middleware)
│       └── authSlice.ts            # State session User/Customer hiện tại
│
├── services/api/                   # RTK Query API Layer
│   ├── baseApi.ts                  # createApi duy nhất với fetchBaseQuery chung (baseUrl, prepareHeaders, tagTypes)
│   ├── authApi.ts                  # baseApi.injectEndpoints ({ login, register, getMe })
│   ├── productApi.ts               # baseApi.injectEndpoints ({ getProducts, getProductBySlug })
│   ├── categoryApi.ts              # baseApi.injectEndpoints ({ getCategories })
│   ├── orderApi.ts                 # baseApi.injectEndpoints ({ createOrder, getOrderLookup })
│   └── bannerApi.ts                # baseApi.injectEndpoints ({ getBannersByPosition })
```

**Nguyên tắc cốt lõi**:
1. Một `baseApi.ts` tập trung chịu trách nhiệm về `baseUrl`, chèn Header Auth Token tự động và quản lý `tagTypes` phục vụ **Automatic Re-fetching / Cache Invalidation**.
2. Dùng `baseApi.injectEndpoints()` cho từng domain (`productApi.ts`, `orderApi.ts`, `authApi.ts`).
3. RTK Query quản lý **Server State** (tự động cache & invalidates tags). Redux Slices quản lý **Client Local State** (`cartSlice` tự lưu `localStorage`).
4. Screen components tại `src/screens/<ten-man>/` chỉ import và sử dụng trực tiếp các Auto-Generated React Hooks sinh ra từ RTK Query (ví dụ `useGetProductsQuery()`, `useCreateOrderMutation()`). Không gọi `fetch` hay `axios` trực tiếp trong UI components.

---

## 3. Vì sao KHÔNG dùng shared-types package (theo yêu cầu)

So với cách dùng `packages/shared-types` chung 1 repo:

| | Shared package | Tự định nghĩa riêng từng source (chọn cách này) |
|---|---|---|
| Ưu điểm | Không lệch type | Mỗi source độc lập, sửa 1 bên không lo build fail bên kia |
| Nhược điểm | 1 source sửa type sai kéo lỗi build toàn bộ; cần hiểu workspace/versioning | Có thể lệch type nếu không kỷ luật đồng bộ tay |
| Phù hợp khi | Team lớn, nhiều dev, CI/CD chuẩn | Fresher/team nhỏ, ưu tiên đơn giản, dễ debug từng phần độc lập |

**Cách giảm rủi ro lệch type khi tách riêng**:
1. Có 1 file **API contract** (mục đã hẹn làm tiếp) là nguồn chân lý duy nhất (source of truth) — mọi thay đổi field/response phải update file này trước.
2. Đặt tên field/enum **giống hệt** giữa 3 source (vd `orderStatus: "pending" | "paid" | "packing" | "shipping" | "completed" | "cancelled"`) để dễ so sánh bằng mắt khi review code.
3. Viết test tích hợp (integration test) ở BE cho từng endpoint quan trọng (orders, payments) — nếu BE đổi response mà quên báo FE, ít nhất test BE catch được sai lệch hợp đồng.
4. Khi review PR, luôn đối chiếu type FE với API contract thay vì đối chiếu với code BE trực tiếp.

---

## 4. Tổng kết 3 source độc lập

```
tiemlen-project/
├── fe-client/     (Next.js — độc lập, tự có node_modules, tự deploy Vercel)
├── fe-admin/      (Next.js hoặc Vite — độc lập, tự deploy)
└── api/           (NestJS — độc lập, tự deploy Railway/Render/VPS)
```

Có thể để 3 folder này trong **3 repo Git riêng biệt** (khuyến nghị nếu muốn tách bạch hoàn toàn CI/CD, quyền truy cập) hoặc **1 repo cha chứa 3 folder nhưng KHÔNG dùng workspace/package chung** (chỉ để tiện quản lý, mỗi folder tự `package.json`, tự `node_modules`, không có `pnpm-workspace.yaml`) — tùy bạn muốn quản lý tập trung hay tách quyền truy cập rõ ràng.

---

## 5. Việc cần làm tiếp theo

1. Khởi tạo skeleton `fe-client`, `fe-admin`, `api` — mỗi cái 1 project độc lập
2. Viết file **API Contract** (endpoint, request/response mẫu, socket payload) làm nguồn chân lý chung
3. Code `fe-client` theo `client-ui-spec.md`, áp dụng đúng pattern `app/` chỉ chứa `page.tsx` + `screens/<ten-man>`
4. Code `fe-admin` theo `admin-ui-spec.md`, cùng pattern
5. Code `api` theo cấu trúc module NestJS đã thiết kế trước đó
