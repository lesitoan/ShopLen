# Tiệm Len Nhà Kiều — Backend RESTful API & Realtime Service (`api`)

> Dịch vụ Backend cốt lõi cung cấp toàn bộ RESTful API (chuẩn MVC), xử lý nghiệp vụ đơn hàng, tích hợp thanh toán VietQR tự động, xử lý hàng đợi BullMQ/Redis, phát thông báo Real-time Socket.IO và gửi tin Telegram Bot cho hệ thống Tiệm Len Nhà Kiều.

---

## 📑 Mục Lục

- [1. Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
- [2. Tính Năng Nổi Bật](#2-tính-năng-nổi-bật)
- [3. Công Nghệ Sử Dụng (Tech Stack)](#3-công-nghệ-sử-dụng-tech-stack)
- [4. Kiến Trúc Hệ Thống (MVC Architecture)](#4-kiến-trúc-hệ-thống-mvc-architecture)
- [5. Cấu Trúc Thư Mục](#5-cấu-trúc-thư-mục)
- [6. Yêu Cầu Môi Trường](#6-yêu-cầu-môi-trường)
- [7. Hướng Dẫn Cài Đặt & Khởi Chạy](#7-hướng-dẫn-cài-đặt--khởi-chạy)
- [8. Cấu Hình Biến Môi Trường (`.env`)](#8-cấu-hình-biến-môi-trường-env)
- [9. Danh Sách API Endpoints (v1)](#9-danh-sách-api-endpoints-v1)
- [10. Xử Lý Real-time & Tự Động Hóa](#10-xử-lý-real-time--tự-động-hóa)
- [11. Quy Chuẩn Code & Đóng Góp](#11-quy-chuẩn-code--đóng-góp)

---

## 1. Giới Thiệu Tổng Quan

Hệ thống Backend được thiết kế theo mô hình **MVC (Model - View - Controller / Service - Repository)** chặt chẽ bằng **TypeScript + Express**, kết hợp cơ sở dữ liệu **PostgreSQL** thông qua **Prisma ORM**. Toàn bộ API v1 được định tuyến dưới tiền tố chuẩn `/api/v1`.

### Điểm đặc thù trong nghiệp vụ:
- **100% thanh toán trước qua chuyển khoản ngân hàng**: Tích hợp mã VietQR động sinh theo mã đơn hàng; tự động khớp giao dịch qua Webhook (SePay) hoặc xác nhận thủ công từ Admin.
- **Bắt buộc đăng nhập để mua hàng**: Không áp dụng guest checkout; giỏ hàng lưu `localStorage` tại Client, API chỉ tiếp nhận danh sách `items` khi bấm đặt hàng.
- **Product Snapshot trong Order**: Mỗi dòng sản phẩm trong đơn hàng lưu snapshot JSON đầy đủ tại thời điểm đặt, đảm bảo đơn hàng lịch sử không bị sai lệch dữ liệu khi sản phẩm bị cập nhật hay xóa.
- **Giữ đơn & Giải phóng tồn kho tự động**: Sử dụng Redis + BullMQ để lập lịch hủy đơn tự động sau `orderHoldMinutes` (mặc định 15-30 phút) nếu khách chưa thanh toán, tự động hoàn lại số lượng tồn kho.

---

## 2. Tính Năng Nổi Bật

- **Xác thực & Phân quyền (Auth & RBAC)**:
  - Hệ thống JWT phân tách rõ ràng giữa Khách hàng (`customers`) và Quản trị viên/Nhân viên (`users`).
  - Hỗ trợ đăng nhập truyền thống (Email/Password) và Google OAuth 2.0.
  - Phân quyền nhân sự chi tiết: `SUPER_ADMIN`, `ADMIN`, `ORDER_STAFF` (CTV check đơn), `CONTENT_STAFF` (CTV viết bài).
- **Quản lý sản phẩm & biến thể linh hoạt**:
  - Hỗ trợ các phân loại thuộc tính (`COLOR`, `SIZE`) lưu cấu trúc `jsonb`.
  - Quản lý kho hàng tập trung và gắn nhãn nổi bật (`HOT_PRODUCT`, `TODAY_DEAL`, `HOT_TIKTOK`).
- **Quản lý đơn hàng & Lịch sử trạng thái**:
  - Vòng đời đơn hàng khép kín: `PENDING_PAYMENT` → `PAID` → `PREPARING` → `SHIPPING` → `COMPLETED` / `CANCELLED`.
  - Lưu trữ tiến trình thay đổi trạng thái kèm thời gian và người thực hiện.
- **Tự động hóa thông báo & Báo cáo**:
  - **Telegram Bot**: Bắn tin nhắn trực tiếp vào nhóm quản trị khi có đơn hàng mới hoặc khi đơn thanh toán thành công.
  - **Socket.IO**: Phát sự kiện realtime về biến động tồn kho và trạng thái đơn hàng tới màn hình Client và Admin mà không cần F5 trang.
  - **Email giao dịch**: Gửi email xác nhận đặt hàng và thông báo thanh toán qua **Resend**.
- **Quản lý Media & Tải tệp**:
  - Tải ảnh sản phẩm, danh mục, avatar nhân viên lên **Cloudinary** thông qua luồng Multer an toàn từ máy chủ, không để lộ Secret Key lên Frontend.

---

## 3. Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **Runtime & Language** | Node.js (>= 20.19), TypeScript 5 | Nền tảng thực thi Type-safe |
| **Web Framework** | Express 4 | HTTP RESTful API Server |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 | Quản lý dữ liệu quan hệ, Migration |
| **Caching & Message Queue**| Redis (ioredis), BullMQ 6 | Lập lịch hủy đơn, xử lý hàng đợi ngầm |
| **Realtime Engine** | Socket.IO 4 | Kết nối 2 chiều cập nhật đơn/kho |
| **Bảo mật & Xác thực** | JWT (jsonwebtoken), bcryptjs, Helmet, Rate-limit | Mã hóa mật khẩu, bảo vệ API |
| **Validation** | Zod | Kiểm thực Schema request/response |
| **Tích hợp bên ngoài** | Telegraf (Telegram), Resend, Google Auth Library | Bot thông báo, Email, OAuth |
| **Lưu trữ Media** | Cloudinary SDK, Multer | Upload và quản lý ảnh đám mây |
| **Logging** | Pino, pino-http | Ghi nhật ký có cấu trúc hiệu năng cao |

---

## 4. Kiến Trúc Hệ Thống (MVC Architecture)

Mỗi yêu cầu từ client được xử lý tuần tự qua các tầng chuyên biệt:

```
[Request] ──> [Routes] ──> [Middlewares] ──> [Controllers] ──> [Services] ──> [Prisma/DB]
                                                 │                 │
                                                 ├──> [DTO/Zod]    ├──> [BullMQ / Redis]
                                                 │                 ├──> [Socket.IO]
                                                 └──> [Mappers]    └──> [Telegram / Resend]
```

- **Routes (`src/routes/`)**: Định nghĩa URL endpoint, phương thức HTTP, gắn middleware xác thực & phân quyền. Tách nhánh `admin/` và `client/`.
- **Controllers (`src/controllers/`)**: Tiếp nhận request, gọi validator kiểm tra dữ liệu đầu vào, điều phối gọi Service và trả về response chuẩn. Không chứa logic nghiệp vụ.
- **Services (`src/services/`)**: Nơi tập trung toàn bộ business logic, giao dịch DB, phát event Socket và gửi tin nhắn bot.
- **Models (`prisma/schema.prisma` & `src/models/`)**: Định nghĩa thực thể dữ liệu và quan hệ cơ sở dữ liệu.
- **DTOs (`src/dto/`)**: Schema và Type quy định khuôn mẫu dữ liệu gửi lên và dữ liệu trả về cho từng endpoint.
- **Types (`src/types/`)**: Định nghĩa interface/type nội bộ dùng chung trong toàn bộ backend.

---

## 5. Cấu Trúc Thư Mục

```txt
api/
├── prisma/
│   ├── schema.prisma            # Khai báo cấu trúc bảng & quan hệ DB
│   └── migrations/              # Lịch sử các đợt migrate cơ sở dữ liệu
├── src/
│   ├── app.ts                   # Cấu hình Express app, middleware chung
│   ├── server.ts                # Khởi tạo HTTP server & lắng nghe Socket.IO
│   ├── config/                  # Nạp và kiểm tra các biến môi trường env
│   ├── constants/               # Hằng số hệ thống, enum, mã lỗi
│   ├── controllers/             # Tiếp nhận và điều hướng HTTP Request
│   │   ├── admin/               # Controllers dành riêng cho Admin
│   │   └── client/              # Controllers dành cho Khách hàng
│   ├── database/                # Khởi tạo Prisma Client & kết nối DB
│   ├── dto/                     # Data Transfer Objects & Zod schemas
│   │   ├── admin/
│   │   └── client/
│   ├── emails/                  # Templates và dịch vụ gửi email (Resend)
│   ├── jobs/                    # Định nghĩa các tác vụ hàng đợi nền
│   ├── mappers/                 # Chuyển đổi dữ liệu DB sang dữ liệu trả về
│   ├── middlewares/             # Xác thực JWT, phân quyền, kiểm tra lỗi, rate limit
│   ├── queues/                  # Khởi tạo BullMQ Queues
│   ├── routes/                  # Định tuyến API (/api/v1)
│   │   ├── admin/               # Tuyến đường quản trị
│   │   └── client/              # Tuyến đường khách hàng
│   ├── services/                # Nghiệp vụ kinh doanh (Business Logic)
│   │   ├── admin/
│   │   └── client/
│   ├── sockets/                 # Xử lý kết nối, rooms và sự kiện Socket.IO
│   ├── types/                   # Type & Interface nội bộ
│   ├── utils/                   # Hàm tiện ích dùng chung (hashing, jwt, helpers)
│   ├── validators/              # Bộ thẩm định dữ liệu đầu vào bằng Zod
│   └── workers/                 # Worker thực thi các job ngầm của BullMQ
├── .env.example                 # Mẫu cấu hình môi trường
├── Dockerfile                   # Dockerfile triển khai container
├── package.json                 # Khai báo thư viện và script
└── tsconfig.json                # Cấu hình TypeScript compiler
```

---

## 6. Yêu Cầu Môi Trường

- **Node.js**: Phiên bản `>= 20.19.0`
- **npm**: `>= 10.0.0`
- **PostgreSQL**: Phiên bản 14 trở lên
- **Redis**: Phiên bản 6 trở lên (dành cho hàng đợi BullMQ)

---

## 7. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Cài đặt thư viện dependencies
```bash
# Từ thư mục gốc của project
npm --prefix api install

# Hoặc di chuyển trực tiếp vào thư mục api
cd api
npm install
```

### Bước 2: Thiết lập file môi trường
Sao chép tệp mẫu và chỉnh sửa các giá trị thực tế:
```bash
cp .env.example .env
```

### Bước 3: Tạo và đồng bộ cơ sở dữ liệu
```bash
# Sinh mã nguồn Prisma Client
npm run prisma:generate

# Chạy migration để khởi tạo các bảng trong PostgreSQL
npm run db:migrate
```

*(Tùy chọn) Khởi chạy giao diện trực quan hóa dữ liệu Prisma Studio:*
```bash
npm run db:studio
```

### Bước 4: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
> Server sẽ tự động lắng nghe tại: `http://localhost:4000` (hoặc cổng cấu hình trong `PORT`).

### Bước 5: Build và chạy Production
```bash
# Biên dịch TypeScript sang JavaScript
npm run build

# Khởi chạy ứng dụng production
npm run start
```

---

## 8. Cấu Hình Biến Môi Trường (`.env`)

| Biến môi trường | Bắt buộc | Mặc định | Ý nghĩa |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Có | `development` | Chế độ môi trường (`development` / `production`) |
| `PORT` | Có | `4000` | Cổng lắng nghe của API Server |
| `CORS_ORIGINS` | Có | `http://localhost:3000,http://localhost:3001` | Danh sách URL Frontend được phép gọi API |
| `DATABASE_URL` | Có | - | Chuỗi kết nối PostgreSQL (ví dụ: `postgresql://user:pass@localhost:5432/shoplen`) |
| `REDIS_URL` | Có | `redis://localhost:6379` | Chuỗi kết nối Redis cho BullMQ |
| `JWT_SECRET` | Có | - | Khóa bí mật ký token JWT chung |
| `JWT_ACCESS_SECRET` | Có | - | Khóa bí mật Access Token |
| `JWT_REFRESH_SECRET` | Có | - | Khóa bí mật Refresh Token |
| `JWT_ACCESS_EXPIRES_IN` | Không | `15m` | Thời hạn sống của Access Token |
| `JWT_REFRESH_EXPIRES_IN`| Không | `30d` | Thời hạn sống của Refresh Token |
| `GOOGLE_CLIENT_ID` | Không | - | Khóa Client ID xác thực Google Sign-In |
| `CLOUDINARY_CLOUD_NAME` | Có | - | Tên Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Có | - | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Có | - | Cloudinary API Secret Key |
| `CLOUDINARY_UPLOAD_FOLDER`| Không | `tiem-len` | Thư mục lưu trữ ảnh trên Cloudinary |
| `TELEGRAM_ENABLED` | Không | `false` | Bật/tắt gửi thông báo qua Telegram Bot |
| `TELEGRAM_BOT_TOKEN` | Tùy chọn | - | Mã Token của Telegram Bot từ BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Tùy chọn | - | ID nhóm chat hoặc cá nhân nhận thông báo |
| `BANK_ACCOUNT_NUMBER` | Có | - | Số tài khoản ngân hàng nhận tiền |
| `BANK_ACCOUNT_NAME` | Có | - | Tên chủ tài khoản ngân hàng (viết hoa không dấu) |
| `BANK_CODE` | Có | `BIDV` / `MB` | Mã ngân hàng nhận chuyển khoản VietQR |
| `RESEND_API_KEY` | Không | - | API Key dịch vụ gửi mail Resend |
| `RESEND_FROM_EMAIL` | Không | `Tiệm Len Nhà Kiều <...>` | Email đại diện gửi thông báo |
| `FRONTEND_URL` | Không | `http://localhost:3000` | Đường dẫn trang khách hàng |

---

## 9. Danh Sách API Endpoints (v1)

Tất cả các route đều bắt đầu bằng `/api/v1`:

### 9.1 Phân Hệ Khách Hàng (`/api/v1/client`)
- **Xác thực (`/auth`)**:
  - `POST /auth/register` — Đăng ký tài khoản khách hàng mới.
  - `POST /auth/login` — Đăng nhập bằng email và mật khẩu.
  - `POST /auth/google` — Đăng nhập qua tài khoản Google.
  - `POST /auth/refresh-token` — Làm mới phiên đăng nhập.
  - `GET /auth/me` — Lấy thông tin tài khoản hiện tại.
- **Sản phẩm & Danh mục (`/products`, `/categories`)**:
  - `GET /categories` — Lấy danh sách danh mục sản phẩm đang mở bán.
  - `GET /products` — Tìm kiếm, lọc và phân trang danh sách sản phẩm.
  - `GET /products/:slug` — Xem thông tin chi tiết một sản phẩm theo slug.
- **Đơn hàng & Thanh toán (`/orders`, `/payments`)**:
  - `POST /orders` — Tạo đơn hàng mới (yêu cầu Access Token của khách).
  - `GET /orders/my-orders` — Lấy danh sách đơn hàng đã mua của khách.
  - `GET /orders/:id` — Xem chi tiết đơn hàng và thông tin chuyển khoản VietQR.
  - `POST /payments/webhook` — Endpoint tiếp nhận Webhook ngân hàng (SePay).
- **Hồ sơ & Sổ địa chỉ (`/profile`, `/addresses`)**:
  - `PUT /profile` — Cập nhật thông tin cá nhân (họ tên, ngày sinh, giới tính).
  - `PUT /profile/password` — Đổi mật khẩu tài khoản.
  - `GET /addresses` — Lấy danh sách sổ địa chỉ nhận hàng.
  - `POST /addresses` — Thêm mới địa chỉ nhận hàng.
  - `DELETE /addresses/:id` — Xóa một địa chỉ khỏi sổ địa chỉ.

### 9.2 Phân Hệ Quản Trị (`/api/v1/admin`)
- **Xác thực (`/auth`)**:
  - `POST /auth/login` — Đăng nhập quản trị viên / nhân viên.
  - `GET /auth/me` — Kiểm tra thông tin phiên làm việc hiện tại.
- **Dashboard & Báo cáo (`/dashboard`)**:
  - `GET /dashboard/kpi` — Thống kê nhanh doanh thu, đơn hàng, khách hàng hôm nay.
  - `GET /dashboard/revenue-chart` — Dữ liệu biểu đồ doanh thu theo chu kỳ thời gian.
  - `GET /dashboard/top-products` — Top các sản phẩm bán chạy nhất.
  - `GET /dashboard/low-stock` — Danh sách sản phẩm sắp hết hàng.
- **Quản lý Đơn hàng (`/orders`)**:
  - `GET /orders` — Lọc, tìm kiếm và phân trang toàn bộ đơn hàng.
  - `GET /orders/:id` — Xem chi tiết hồ sơ đơn, lịch sử tiến trình và thông tin giao dịch.
  - `PATCH /orders/:id/status` — Cập nhật bước xử lý đơn (Đang đóng gói, Đang giao, Hoàn tất).
  - `PATCH /orders/:id/confirm-payment` — Xác nhận đã thanh toán thủ công.
  - `PATCH /orders/:id/cancel` — Hủy đơn hàng và nhập lý do.
- **Quản lý Sản phẩm & Danh mục (`/products`, `/categories`)**:
  - `GET /products` & `POST /products` — Danh sách & Tạo mới sản phẩm.
  - `PUT /products/:id` & `DELETE /products/:id` — Cập nhật & Xóa sản phẩm.
  - `PATCH /products/:id/stock` — Chỉnh sửa nhanh số lượng tồn kho (inline edit).
  - `CRUD /categories` — Quản lý danh mục sản phẩm và slug.
- **Quản lý Khách hàng & Nhân sự (`/customers`, `/staff`)**:
  - `GET /customers` — Xem danh sách, nguồn đăng nhập và lịch sử khách hàng.
  - `PATCH /customers/:id/status` — Bật/tắt khóa tài khoản khách.
  - `CRUD /staff` — Thêm mới nhân viên, gán vai trò quyền hạn, đổi mật khẩu nhân viên.
- **Cấu hình & Tải tệp (`/settings`, `/uploads`)**:
  - `GET /settings` & `PUT /settings` — Cấu hình STK ngân hàng, phí ship, thời gian giữ đơn, Telegram bot.
  - `POST /uploads/image` — Tải ảnh lên Cloudinary và trả về Secure URL.

---

## 10. Xử Lý Real-time & Tự Động Hóa

### 10.1 Sự kiện Socket.IO
- `order:created`: Bắn tới room Admin khi có khách đặt đơn hàng mới.
- `order:paid`: Bắn realtime tới Client và Admin khi đơn hàng được khớp thanh toán thành công.
- `order:status_updated`: Thông báo bước trạng thái đơn thay đổi theo thời gian thực.
- `stock:updated`: Cập nhật lại số lượng tồn kho tức thì trên trang danh sách và chi tiết sản phẩm của khách hàng.

### 10.2 Tác Vụ Hàng Đợi (BullMQ Background Jobs)
- `autoCancelExpiredOrder`: Định thời kiểm tra các đơn hàng chưa thanh toán vượt quá số phút quy định (`orderHoldMinutes`), tự động chuyển trạng thái đơn sang `CANCELLED`, hoàn lại tồn kho và thông báo qua Socket.IO.

---

## 11. Quy Chuẩn Code & Đóng Góp

1. **Tuân thủ mô hình MVC**: Tuyệt đối không viết logic truy vấn DB trong Controller hay Route. Mọi nghiệp vụ phải nằm trong tầng `services/`.
2. **Import chuẩn Path Alias**: Luôn sử dụng alias `@/*` (trỏ về `src/*`), ví dụ `import { prisma } from "@/database/client"`. Không dùng đường dẫn tương đối dài dạng `../../utils/...`.
3. **Quy tắc đặt tên**: Sử dụng `camelCase` cho file, thư mục, hàm, biến; `UPPER_SNAKE_CASE` cho Enums/Constants; `PascalCase` cho Classes/Types.
4. **Validation**: Mọi dữ liệu đầu vào từ Body, Query, Params phải được validate chặt chẽ thông qua Zod Schema trước khi xử lý.
5. **Kiểm tra kiểu dữ liệu (Type-checking)**:
   ```bash
   npm run typeCheck
   ```
