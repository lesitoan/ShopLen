# Quy ước đặt tên & Cập nhật cấu trúc (camelCase + API theo MVC)

> Tài liệu này **bổ sung/ghi đè** phần đặt tên và cấu trúc API trong `fe-source-structure.md`.
> Áp dụng cho cả 3 source: `fe-client`, `fe-admin`, `api`.

---

> CẬP NHẬT V1: Cấu trúc dưới đây là khung tổng quát. Khi triển khai API hiện tại, ưu tiên `api/docs/apiImplementationPlanV1.md`.
> - Không bắt buộc tạo `promotionRoutes`, `promotionService`, `promotionModel`, settings routes/model trong v1.
> - Không tạo `productVariantModel` cho v1; dùng `productOptionModel` với values `jsonb`.
> - Cần thêm/cập nhật model theo v1: `customerModel`, `productImageModel`, `productOptionModel`, order item có `productSnapshot jsonb`.
> - Auth client dùng email/password + Google login trong bảng `customers`; admin dùng bảng `users`.
> - Cart không có route API v1.
> - API v1 mount dưới `/api/v1`.
> - Trong `api/src`, dùng path alias `@/*` trỏ tới `src/*` cho mọi import nội bộ.
> - `routes/`, `controllers/`, `services/`, `dto/` tách nhánh `admin/` và `client/` khi domain có thể phân biệt.
> - `dto/` chứa request/response schema hoặc DTO theo API contract; `types/` chứa type nội bộ dùng chung; `models/` chỉ chứa entity/schema DB.

## 1. Quy ước đặt tên (bắt buộc)

**Không dùng kebab-case** (dạng `product-detail`, `order-lookup`...) cho thư mục/file.
**Tất cả đặt tên theo camelCase.**

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Thư mục (folder) | camelCase | `productDetail/`, `orderLookup/`, `paymentQr/` |
| File component (FE) | camelCase, đuôi `.tsx` | `productCard.tsx`, `orderTimeline.tsx` |
| File thường (ts/js) | camelCase | `axiosClient.ts`, `formatCurrency.ts` |
| Biến, hàm | camelCase | `orderStatus`, `getProductById()` |
| Component React (tên export/dùng trong JSX) | **PascalCase** (giữ nguyên chuẩn React, không đổi) | `<ProductCard />`, `<OrderTimeline />` — file chứa nó vẫn đặt tên camelCase: `productCard.tsx` |
| Hằng số cố định (constant value) | UPPER_SNAKE_CASE (chuẩn JS cho const cố định, không tính là "đặt tên file/folder" nên không vi phạm quy ước) | `MAX_CART_ITEMS`, `ORDER_TIMEOUT_MINUTES` |
| Class (BE) | PascalCase, file camelCase | file `orderService.ts` chứa `class OrderService` |
| Database table/column (nếu SQL) | tùy DB convention, thường snake_case ở DB nhưng map qua camelCase ở tầng code (ORM tự động map) | DB: `order_status`, Code (entity/model): `orderStatus` |

> Lý do ngoại lệ DB: quy ước camelCase áp dụng cho **code** (thư mục, file, biến trong TS/JS). Tên cột DB vẫn theo chuẩn phổ biến của DB (Postgres thường snake_case) — ORM (TypeORM/Prisma/Sequelize) sẽ tự map snake_case cột ↔ camelCase field trong code, đây không phải là "đặt tên file/folder" nên không tính vi phạm.

---

## 2. Cập nhật cấu trúc `fe-client/` và `fe-admin/` theo camelCase

Tất cả folder trong `screens/`, `app/` (route folder không đổi được vì Next.js dùng route thực tế tiếng Việt có dấu gạch ngang do URL, xem lưu ý bên dưới), `components/`, `hooks/` đổi lại camelCase:

```
src/
├── screens/
│   ├── home/
│   ├── productListing/
│   ├── productDetail/
│   ├── cart/
│   ├── checkout/
│   ├── paymentQr/
│   ├── orderSuccess/
│   ├── orderLookup/
│   ├── blogListing/
│   ├── blogDetail/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgotPassword/
│   └── account/
│       ├── overview/
│       ├── orderHistory/
│       ├── orderDetail/
│       ├── address/
│       └── loyalty/
│
├── components/
│   ├── ui/
│   ├── product/
│   │   └── productCard.tsx
│   ├── order/
│   │   └── orderTimeline.tsx
│   └── layout/
│       ├── header.tsx
│       └── footer.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useSocket.ts
│   └── useDebounce.ts
│
├── lib/
│   ├── axiosClient.ts
│   └── seoHelper.ts
│
├── services/
│   └── api/
│       ├── productApi.ts
│       ├── orderApi.ts
│       ├── authApi.ts
│       ├── blogApi.ts
│       └── loyaltyApi.ts
│
├── stores/
│   ├── cartStore.ts
│   └── authStore.ts
│
├── constants/                     ← MỚI: text/message dùng chung nhiều nơi
│   ├── siteInfo.ts                 # tên web, slogan, hotline, địa chỉ shop, social link
│   ├── messages.ts                 # message lặp lại: lỗi form, thông báo thành công/thất bại
│   ├── orderStatus.ts              # label + màu badge cho từng trạng thái đơn
│   └── routes.ts                   # object chứa toàn bộ path route, tránh hardcode string url rải rác
│
└── types/
    ├── product.ts
    ├── order.ts
    ├── user.ts
    └── blog.ts
```

**Lưu ý riêng về route Next.js (`app/`)**: URL public (`/san-pham`, `/thanh-toan`...) vẫn giữ dạng có dấu gạch ngang vì đây là **URL hiển thị cho SEO/người dùng**, không phải tên file code thông thường — quy ước camelCase áp dụng cho code logic (`screens/`, `components/`...), không bắt buộc áp lên URL slug công khai. Nếu muốn đồng bộ tuyệt đối, có thể đổi URL sang không dấu không gạch (vd `/sanpham`) nhưng sẽ giảm khả năng đọc URL cho SEO — khuyến nghị giữ nguyên URL có gạch ngang, chỉ áp camelCase cho phần code bên trong.

Ví dụ file `constants/siteInfo.ts`:
```ts
export const SITE_NAME = "Tiệm Len Nhà Kiều";
export const SITE_HOTLINE = "0987654321";
export const BANK_TRANSFER_NOTE_PREFIX = "DH"; // dùng khi generate nội dung chuyển khoản
```

Ví dụ file `constants/messages.ts`:
```ts
export const MESSAGES = {
  ORDER_SUCCESS: "Đặt hàng thành công! Vui lòng lưu lại mã đơn hàng để tra cứu.",
  ORDER_EXPIRED: "Đơn hàng đã hết hạn thanh toán.",
  INVALID_PHONE: "Số điện thoại không hợp lệ.",
  CART_EMPTY: "Giỏ hàng của bạn đang trống.",
};
```

Ví dụ file `constants/routes.ts` (tránh hardcode url rải rác nhiều component):
```ts
export const ROUTES = {
  home: "/",
  productListing: "/san-pham",
  productDetail: (slug: string) => `/san-pham/${slug}`,
  cart: "/gio-hang",
  checkout: "/thanh-toan",
  paymentQr: (orderId: string) => `/thanh-toan/qr/${orderId}`,
  orderLookup: "/tra-cuu-don-hang",
};
```

`fe-admin/` áp dụng y hệt nguyên tắc — đổi toàn bộ `screens/` sang camelCase (`orders/list` → `orders/list` giữ nguyên vì đã là 1 từ, `promotions`, `loyaltyConfig` thay vì `loyalty-config`...) và thêm `constants/` riêng (label trạng thái đơn, message thông báo admin, route nội bộ).

---

## 3. Cấu trúc `api/` theo MVC (thay cho tổ chức theo NestJS module domain trước đó)

Áp dụng MVC rõ ràng: **Route → Controller → Service (business logic) → Model**. Vẫn có thể dùng NestJS (NestJS hỗ trợ tốt pattern này qua Controller/Service/Entity) hoặc Express + TypeScript nếu muốn thuần MVC hơn. Cấu trúc dưới đây trung lập, áp dụng được cho cả 2:

```
api/
├── src/
│   ├── routes/                       # định nghĩa endpoint, map qua controller — KHÔNG chứa logic
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── promotionRoutes.ts
│   │   ├── loyaltyRoutes.ts
│   │   ├── blogRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   ├── adminOrderRoutes.ts
│   │   ├── adminDashboardRoutes.ts
│   │   └── index.ts                   # gom toàn bộ route, mount vào app chính
│   │
│   ├── controllers/                  # nhận request, validate input cơ bản, gọi service, trả response
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── paymentController.ts       # bao gồm webhook nhận từ SePay/Casso
│   │   ├── categoryController.ts
│   │   ├── promotionController.ts
│   │   ├── loyaltyController.ts
│   │   ├── blogController.ts
│   │   ├── userController.ts
│   │   ├── uploadController.ts
│   │   ├── adminOrderController.ts
│   │   └── adminDashboardController.ts
│   │
│   ├── services/                     # business logic thật sự nằm ở đây, controller không tự xử lý logic
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   ├── vietQrService.ts            # generate chuỗi QR ngân hàng
│   │   ├── promotionService.ts
│   │   ├── loyaltyService.ts
│   │   ├── blogService.ts
│   │   ├── telegramService.ts
│   │   ├── uploadService.ts
│   │   └── auditLogService.ts
│   │
│   ├── models/                       # entity/schema (TypeORM entity, Prisma model, hoặc Mongoose schema)
│   │   ├── userModel.ts
│   │   ├── productModel.ts
│   │   ├── productVariantModel.ts
│   │   ├── categoryModel.ts
│   │   ├── orderModel.ts
│   │   ├── orderItemModel.ts
│   │   ├── paymentModel.ts
│   │   ├── promotionModel.ts
│   │   ├── loyaltyTransactionModel.ts
│   │   ├── blogPostModel.ts
│   │   └── auditLogModel.ts
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts           # verify JWT
│   │   ├── roleMiddleware.ts           # kiểm tra quyền admin/nhân viên
│   │   ├── validateMiddleware.ts       # validate dto (Zod/Joi) trước khi vào controller
│   │   ├── errorHandlerMiddleware.ts   # bắt lỗi tập trung
│   │   └── webhookSignatureMiddleware.ts # verify chữ ký webhook thanh toán
│   │
│   ├── validators/                    # schema validate request (Zod/Joi), tách khỏi controller
│   │   ├── authValidator.ts
│   │   ├── productValidator.ts
│   │   └── orderValidator.ts
│   │
│   ├── sockets/
│   │   ├── orderSocket.ts              # emit order:created, order:paid, order:statusChanged
│   │   ├── productSocket.ts            # emit stock:update
│   │   └── socketServer.ts             # khởi tạo Socket.IO + Redis adapter
│   │
│   ├── jobs/
│   │   ├── orderExpiryJob.ts            # tự hủy đơn quá hạn (cron/BullMQ)
│   │   └── queueSetup.ts
│   │
│   ├── config/
│   │   ├── databaseConfig.ts
│   │   ├── redisConfig.ts
│   │   └── envValidation.ts
│   │
│   ├── constants/                     ← MỚI: text/message dùng chung nhiều nơi trong API
│   │   ├── messages.ts                 # message trả về response (lỗi/thành công) dùng chung nhiều controller
│   │   ├── orderStatus.ts              # enum + label trạng thái đơn dùng chung service/controller
│   │   └── siteInfo.ts                 # tên shop dùng trong nội dung thông báo Telegram/email
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── generateOrderCode.ts
│   │   └── hashPassword.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── app.ts                          # khởi tạo Express/Nest app, mount middleware + routes
│   └── server.ts                       # entry point, listen port
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env
├── tsconfig.json
└── package.json
```

**Luồng xử lý 1 request theo MVC** (ví dụ xác nhận thanh toán):
```
orderRoutes.ts (POST /orders/:id/confirmPayment)
      ↓
orderController.confirmPayment()      # nhận req, validate cơ bản
      ↓
orderService.confirmPayment()          # business logic: đổi trạng thái, trừ tồn kho, cộng điểm
      ↓
orderModel                              # lưu DB
      ↓
orderService gọi tiếp → orderSocket.emitOrderPaid() + telegramService.notify()
      ↓
orderController trả response về client
```

Ví dụ `constants/messages.ts` (BE) — dùng chung để tránh lặp string response ở nhiều controller:
```ts
export const MESSAGES = {
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
  ORDER_ALREADY_PAID: "Đơn hàng đã được thanh toán trước đó.",
  INVALID_CREDENTIALS: "Sai tài khoản hoặc mật khẩu.",
  UNAUTHORIZED: "Bạn không có quyền thực hiện hành động này.",
};
```

---

## 4. Bảng đối chiếu nhanh: trước (kebab-case/module NestJS) → sau (camelCase/MVC)

| Trước | Sau |
|---|---|
| `screens/product-detail/` | `screens/productDetail/` |
| `payments.controller.ts` (trong `modules/payments/`) | `controllers/paymentController.ts` |
| `payments.service.ts` | `services/paymentService.ts` |
| `orders.gateway.ts` | `sockets/orderSocket.ts` |
| Không có nơi tập trung text lặp | `constants/messages.ts`, `constants/siteInfo.ts`, `constants/orderStatus.ts` |
| `packages/shared-types` (đã bỏ trước đó) | vẫn giữ nguyên: mỗi source tự có `types/`/`models/` riêng |

---

## 5. Việc cần làm tiếp theo

1. Áp dụng lại toàn bộ tên thư mục/file trong `fe-source-structure.md` trước đó sang camelCase theo bảng mục 2
2. Viết `constants/` đầu tiên ở cả 3 source trước khi code màn hình/API — vì đây là nơi nhiều file khác sẽ import vào
3. Viết file **API Contract** (endpoint + request/response mẫu) theo đúng route đặt tên ở mục 3 (`orderRoutes.ts`, `productRoutes.ts`...) để agent code khớp ngay từ đầu
