# Tiệm Len Nhà Kiều — Admin Dashboard (`fe-admin`)

> Bảng điều khiển quản trị trung tâm dành cho chủ shop và đội ngũ nhân sự vận hành Tiệm Len Nhà Kiều. Xây dựng bằng **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, thiết kế chuẩn mực theo phong cách **Theme Dark Navy Slate + Màu chủ đạo Xanh Emerald (`#10B981`)**.
> 
> 🌐 **Trang quản trị trực tuyến**: [https://tiemlen-admin.lesitoan.io.vn/](https://tiemlen-admin.lesitoan.io.vn/)

---

## 📑 Mục Lục

- [1. Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
- [2. Tính Năng Nổi Bật](#2-tính-năng-nổi-bật)
- [3. Công Nghệ Sử Dụng (Tech Stack)](#3-công-nghệ-sử-dụng-tech-stack)
- [4. Danh Sách Màn Hình & Tuyến Đường (Sitemap)](#4-danh-sách-màn-hình--tuyến-đường-sitemap)
- [5. Cấu Trúc Thư Mục](#5-cấu-trúc-thư-mục)
- [6. Hướng Dẫn Cài Đặt & Khởi Chạy](#6-hướng-dẫn-cài-đặt--khởi-chạy)
- [7. Cấu Hình Biến Môi Trường (`.env`)](#7-cấu-hình-biến-môi-trường-env)
- [8. Quản Lý Trạng Thái & Tích Hợp API](#8-quản-lý-trạng-thái--tích-hợp-api)
- [9. Bản Đồ Ảnh Chụp Giao Diện Thực Tế](#9-bản-đồ-ảnh-chụp-giao-diện-thực-tế)

---

## 1. Giới Thiệu Tổng Quan

`fe-admin` là hệ thống quản trị chuyên sâu phục vụ toàn bộ các hoạt động theo dõi kinh doanh, xử lý đơn hàng, kiểm soát kho hàng, phân quyền nhân viên và tự động hóa vận hành.

---

## 2. Tính Năng Nổi Bật

- **Dashboard Phân Tích Kinh Doanh Trực Quan**:
  - 4 Thẻ KPI thống kê tức thời: Doanh thu hôm nay (đ), Đơn hàng mới, Đơn chờ thanh toán, Khách hàng mới.
  - Biểu đồ sóng trực quan (Recharts) phản ánh xu hướng doanh thu và số lượng đơn theo mốc: Hôm nay, 7 ngày qua, Tháng này.
  - Bảng "Đơn hàng gần đây", danh sách "Top sản phẩm bán chạy" và cảnh báo nhanh "Sản phẩm sắp hết hàng (< 5 món)".
  - Nút xuất dữ liệu báo cáo kinh doanh nhanh.
- **Quản Lý Đơn Hàng Toàn Diện (`/orders`)**:
  - Thanh Tabs phân loại nhanh theo 8 trạng thái: Tất cả, Chờ thanh toán, Đã thanh toán, Đang đóng gói, Đang giao hàng, Hoàn tất, Yêu cầu hủy, Đã hủy.
  - Bộ lọc kết hợp: Tìm kiếm mã đơn/SĐT/tên khách, khoảng thời gian đặt hàng, sắp xếp mới nhất.
  - Xuất dữ liệu danh sách đơn hàng sang file Excel.
  - **Màn hình chi tiết đơn hàng (`/orders/[id]`)**:
    - Hiển thị danh sách sản phẩm, số lượng, phân loại và đơn giá.
    - Timeline tiến trình xử lý đơn hàng chi tiết từng mốc thời gian.
    - Thông tin thanh toán (ngân hàng nhận, STK, thời gian khớp tiền tự động).
    - Nút thao tác chuyển nhanh trạng thái tiếp theo (ví dụ: "Chuyển trạng thái: Đang đóng gói") và nút Hủy đơn hàng kèm lý do.
- **Quản Lý Sản Phẩm & Danh Mục (`/products`, `/categories`)**:
  - Bảng sản phẩm hiển thị ảnh, mã SKU, danh mục, giá niêm yết/khuyến mãi.
  - **Chỉnh sửa tồn kho tức thì (Inline Edit)** ngay trên bảng danh sách mà không cần mở trang sửa.
  - Switch bật/tắt hiển thị trạng thái "Đang bán" trực tiếp.
  - Drawer trượt thêm mới/chỉnh sửa sản phẩm: Thiết lập phân loại màu sắc, kích thước, gắn nhãn nổi bật (`HOT_PRODUCT`, `TODAY_DEAL`, `HOT_TIKTOK`), upload tối đa 6 ảnh lên Cloudinary.
  - Quản lý danh mục: Tự động tạo slug và tải ảnh đại diện danh mục.
- **Quản Lý Khách Hàng (`/customers`)**:
  - Theo dõi danh sách khách hàng, nguồn đăng nhập (MANUAL hoặc GOOGLE).
  - Khóa/mở khóa tài khoản khách hàng chỉ bằng 1 thao tác toggle.
  - Trang chi tiết khách hàng (`/customers/[id]`): Xem hồ sơ liên hệ, lịch sử toàn bộ đơn hàng đã mua và lịch sử tích/tiêu điểm thưởng.
- **Quản Lý Nhân Viên & Phân Quyền (`/staff`)**:
  - Quản lý danh sách nhân sự với các vai trò chuyên biệt: `SUPER_ADMIN`, `ADMIN`, `ORDER_STAFF` (CTV check đơn), `CONTENT_STAFF` (CTV đăng bài).
  - Drawer thêm mới và chỉnh sửa nhân viên; Modal độc lập để đặt lại mật khẩu cho nhân viên.
  - Khóa quyền truy cập tức thì bằng toggle trạng thái tài khoản.
- **Cấu Hình Hệ Thống & Tự Động Hóa (`/settings`)**:
  - **Tab Tài Khoản Ngân Hàng**: Cài đặt thông tin nhận tiền chuyển khoản (Ngân hàng MB Bank/BIDV, STK, Tên chủ tài khoản, mẫu VietQR) đi kèm khung **Xem Trước Mã QR Ngân Hàng (Live Preview)** theo số tiền giả lập.
  - **Tab Đơn Hàng & Phí Vận Chuyển**: Cấu hình thời gian giữ đơn chờ thanh toán (mặc định 15 phút), cơ chế tự hủy đơn giải phóng tồn kho qua BullMQ, phí vận chuyển toàn quốc và mốc đơn hàng miễn phí giao hàng (Freeship).
  - **Tab Telegram & Thông Báo**: Cài đặt Telegram Bot Token, Chat ID nhóm Admin, nút kiểm tra gửi tin thử nghiệm và công tắc bật/tắt thông báo cho từng sự kiện đơn hàng.

---

## 3. Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15 (App Router) | Tối ưu hóa render trang quản trị, routing tốc độ cao |
| **UI Library** | React 19, TypeScript 5 | Giao diện Type-safe chặt chẽ |
| **Styling** | Tailwind CSS 3 | Hệ thống Dark Navy Slate Design System |
| **State & API Management**| Redux Toolkit, RTK Query | Quản lý Server State, tự động invalidate cache khi cập nhật dữ liệu |
| **Biểu đồ số liệu** | Recharts 3 | Biểu đồ doanh thu và xu hướng đơn hàng trực quan |
| **Biểu mẫu & Form** | React Hook Form | Quản lý form nhập liệu trong Drawer và Modal |
| **Icons & Media Carousel** | Lucide React, Swiper | Bộ icon kỹ thuật số hiện đại, trình chiếu ảnh |
| **Thông báo hệ thống** | React Toastify | Toast thông báo phản hồi thao tác |

---

## 4. Danh Sách Màn Hình & Tuyến Đường (Sitemap)

```txt
fe-admin/src/app/
├── login/page.tsx                     # Đăng nhập quản trị (/login)
├── page.tsx                           # Dashboard tổng quan (/)
├── orders/
│   ├── page.tsx                       # Danh sách & Lọc đơn hàng (/orders)
│   └── [id]/page.tsx                  # Chi tiết tiến trình đơn hàng (/orders/[id])
├── products/page.tsx                  # Quản lý danh sách sản phẩm & kho (/products)
├── categories/page.tsx                # Quản lý danh mục sản phẩm (/categories)
├── customers/
│   ├── page.tsx                       # Quản lý danh sách khách hàng (/customers)
│   └── [id]/page.tsx                  # Chi tiết hồ sơ khách hàng (/customers/[id])
├── staff/page.tsx                     # Quản lý nhân viên & phân quyền (/staff)
├── settings/page.tsx                  # Cấu hình ngân hàng, ship, Telegram (/settings)
├── promotions/page.tsx                # Mã giảm giá (khuyến mãi)
├── rewards/config/page.tsx            # Cấu hình tích điểm thưởng
└── blog/page.tsx                      # Quản lý bài viết blog
```

---

## 5. Cấu Trúc Thư Mục

```txt
fe-admin/
├── public/                      # Tệp tĩnh (logo, favicon)
├── src/
│   ├── app/                     # Next.js App Router (định nghĩa route và render screens)
│   ├── screens/                 # Giao diện và logic của từng màn hình dashboard
│   │   ├── dashboard/           # Màn hình Dashboard tổng quan
│   │   ├── orders/              # Màn hình Danh sách & Chi tiết đơn hàng
│   │   ├── products/            # Màn hình Sản phẩm & Drawer thêm mới
│   │   ├── categories/          # Màn hình Danh mục & Drawer tạo danh mục
│   │   ├── customers/           # Màn hình Khách hàng & Chi tiết hồ sơ
│   │   ├── staff/               # Màn hình Nhân sự, Phân quyền & Modal đổi pass
│   │   └── settings/            # Màn hình Cấu hình hệ thống (Ngân hàng, Ship, Telegram)
│   ├── components/              # Các thành phần giao diện tái sử dụng
│   │   ├── common/              # Nút bấm, badge trạng thái, toggle, input
│   │   ├── layout/              # Sidebar điều hướng, Topbar thông báo & tài khoản
│   │   └── modals/              # Drawer trượt và modal xác nhận
│   ├── constants/               # Hằng số hệ thống, mappers trạng thái đơn, options
│   ├── hooks/                   # Custom Hooks quản lý bảng, debounce tìm kiếm
│   ├── services/api/            # RTK Query API slices
│   │   ├── baseApi.ts           # Cấu hình kết nối API chung, gắn Token Admin
│   │   ├── orderApi.ts          # API quản lý đơn hàng
│   │   ├── productApi.ts        # API sản phẩm, danh mục, tồn kho
│   │   ├── customerApi.ts       # API khách hàng
│   │   ├── staffApi.ts          # API nhân sự
│   │   └── settingApi.ts        # API cấu hình hệ thống
│   ├── store/                   # Redux Store & authSlice cho Admin
│   ├── types/                   # Định nghĩa TypeScript Types riêng cho Admin
│   └── utils/                   # Hàm tiện ích format tiền tệ, thời gian, xuất file
├── .env.example                 # Mẫu cấu hình môi trường
├── next.config.mjs              # Cấu hình Next.js
├── tailwind.config.ts           # Cấu hình Dark Navy Slate theme
└── tsconfig.json                # Cấu hình TypeScript
```

---

## 6. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Cài đặt thư viện
```bash
# Từ thư mục gốc của project
npm --prefix fe-admin install

# Hoặc di chuyển trực tiếp vào fe-admin
cd fe-admin
npm install
```

### Bước 2: Tạo tệp cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

### Bước 3: Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
```
> Mặc định ứng dụng Admin chạy tại cổng `3001`: `http://localhost:3001`

### Bước 4: Kiểm tra và đóng gói Production
```bash
# Kiểm tra cú pháp Lint
npm run lint

# Đóng gói tối ưu hóa cho Production
npm run build

# Khởi chạy bản build tại cổng 3001
npm run start
```

---

## 7. Cấu Hình Biến Môi Trường (`.env`)

| Biến môi trường | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Có | `http://localhost:4000/api/v1` | Đường dẫn máy chủ Backend API v1 |

---

## 8. Quản Lý Trạng Thái & Tích Hợp API

- **RTK Query Auto-Caching**: Mọi thay đổi dữ liệu (như đổi trạng thái đơn, thêm sản phẩm, cập nhật tồn kho inline) tự động kích hoạt `invalidatesTags`, giúp giao diện đồng bộ mới nhất mà không cần tải lại toàn trang.
- **Tự động đính kèm Token**: `baseApi.ts` tự động gắn tiêu đề `Authorization: Bearer <admin_token>` từ Redux State vào tất cả các yêu cầu gửi đến backend.
- **Tooltip cho văn bản rút gọn**: Tất cả các mã định danh dài (Mã đơn hàng, mã khách hàng, tên dài) đều được gắn `title` để hiển thị tooltip khi rê chuột vào.

---

## 9. Hình Ảnh Demo Giao Diện Thực Tế (Screenshots Showcase)

Toàn bộ hình ảnh thực tế của bảng điều khiển quản trị (`fe-admin`) với phong cách thiết kế **Theme Dark Navy Slate + Màu chủ đạo Xanh Emerald (`#10B981`)**.


---

### 9.1 Dashboard Tổng Quan (Overview — `/`)

#### Phần trên: 4 Thẻ KPI số liệu nhanh & Biểu đồ doanh thu sóng Recharts
> Cung cấp cái nhìn tức thì về doanh thu hôm nay, đơn hàng mới, đơn chờ thanh toán, khách hàng mới; biểu đồ sóng phân tích tăng trưởng theo ngày/tuần/tháng; nút xuất báo cáo.
![Dashboard - KPI Cards & Biểu đồ](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_154946_m9if98.png)

#### Phần dưới: Đơn hàng gần đây, Top sản phẩm bán chạy & Cảnh báo tồn kho
> Danh sách đơn mới đặt cập nhật realtime; top mặt hàng đan len bán chạy nhất; cảnh báo kho hàng sắp hết (< 5 món).
![Dashboard - Đơn gần đây & Tồn kho](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_154959_a7atji.png)

---

### 9.2 Quản Lý Đơn Hàng (Orders Management)

#### Danh Sách Đơn Hàng & Bộ Lọc Trạng Thái (`/orders`)
> Thanh Tabs lọc 8 trạng thái (Tất cả, Chờ thanh toán, Đã thanh toán, Đang đóng gói, Đang giao, Hoàn tất, Yêu cầu hủy, Đã hủy); bộ lọc ngày; nút Xuất Excel.
![Danh sách đơn hàng](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155025_eqpd5c.png)

#### Chi Tiết Đơn Hàng & Tiến Trình Xử Lý (`/orders/[id]`)
> Xem hồ sơ khách hàng, chi tiết giỏ hàng; timeline lịch sử trạng thái; thông tin thanh toán VietQR tự động; nút chuyển nhanh trạng thái tiếp theo ("Chuyển trạng thái: Đang đóng gói") và nút Hủy đơn hàng.
![Chi tiết đơn hàng](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155114_pomona.png)

---

### 9.3 Quản Lý Sản Phẩm & Danh Mục

#### Danh Sách Sản Phẩm & Chỉnh Sửa Tồn Kho Nhanh (`/products`)
> Bảng dữ liệu sản phẩm hỗ trợ **chỉnh sửa số lượng tồn kho inline** trực tiếp trên bảng, toggle trạng thái "Đang bán", lọc danh mục và tìm kiếm mã SKU.
![Danh sách sản phẩm](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155133_iy923q.png)

#### Drawer Thêm Sản Phẩm Mới (Create Product)
> Form trượt bên phải (Side Drawer) nhập tên, tự sinh slug, chọn danh mục, gắn nhãn nổi bật (`HOT_PRODUCT`, `TODAY_DEAL`, `HOT_TIKTOK`), thiết lập phân loại màu/size và tải lên tối đa 6 ảnh Cloudinary.
![Drawer thêm sản phẩm mới](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167249/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155259_v0h9am.png)

#### Danh Sách Danh Mục Sản Phẩm (`/categories`)
> Quản lý cây danh mục sản phẩm, đường dẫn slug và trạng thái hiển thị.
![Danh sách danh mục](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155330_rqnqrs.png)

#### Drawer Thêm Danh Mục Mới (Create Category)
> Form trượt nhập tên danh mục, đường dẫn thân thiện URL (slug) và tải lên hình ảnh đại diện.
![Drawer thêm danh mục mới](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155340_zmr9ly.png)

---

### 9.4 Quản Lý Khách Hàng (Customers)

#### Danh Sách Khách Hàng (`/customers`)
> Theo dõi tài khoản khách hàng, email, nguồn đăng nhập (MANUAL / GOOGLE), ngày tham gia và switch toggle khóa tài khoản.
![Danh sách khách hàng](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155356_cll3ep.png)

#### Chi Tiết Hồ Sơ Khách Hàng (`/customers/[id]`)
> Xem hồ sơ cá nhân của khách, nút cộng điểm thưởng, tab lịch sử các đơn hàng đã mua và trạng thái từng đơn.
![Chi tiết khách hàng](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155416_cqqz8l.png)

---

### 9.5 Quản Lý Nhân Sự & Phân Quyền (`/staff`)

#### Danh Sách Nhân Viên & Quyền Hạn
> Quản lý tài khoản đội ngũ vận hành: Super Admin, Admin, CTV check đơn, CTV đăng bài; theo dõi lần đăng nhập gần nhất; nút ma trận phân quyền.
![Danh sách nhân viên](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155436_otukty.png)

#### Drawer Thêm Mới Nhân Viên
> Form trượt tạo tài khoản nhân sự mới: Nhập họ tên, email, số điện thoại, mật khẩu ban đầu, phân vai trò và upload ảnh đại diện.
![Drawer thêm nhân viên](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155450_q8zzoj.png)

#### Modal Đổi Mật Khẩu Nhân Viên
> Popup modal căn giữa màn hình cho phép quản trị viên cấp quyền đổi mật khẩu an toàn cho nhân sự được chọn.
![Modal đổi mật khẩu nhân viên](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167250/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155500_bnsve6.png)

#### Drawer Chỉnh Sửa Thông Tin Nhân Viên
> Cập nhật họ tên, email, vai trò chức vụ, ảnh đại diện và switch trạng thái kích hoạt tài khoản.
![Drawer sửa thông tin nhân viên](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155512_ikizrq.png)

---

### 9.6 Cấu Hình Hệ Thống & Tự Động Hóa (`/settings`)

#### Tab 1: Tài Khoản Ngân Hàng & Xem Trước Mã QR (Live Preview)
> Cấu hình ngân hàng nhận tiền chuyển khoản (MB Bank, STK, Tên chủ tài khoản, mẫu VietQR) đi kèm khung Live Preview xem trước mã VietQR giả lập theo số tiền.
![Cấu hình ngân hàng & VietQR Live Preview](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155534_y3xmtj.png)

#### Tab 2: Đơn Hàng & Phí Vận Chuyển Toàn Quốc
> Thiết lập thời gian giữ đơn chờ thanh toán (mặc định 15 phút) kích hoạt hủy đơn tự động qua BullMQ; cấu hình phí ship đồng giá 25.000đ và mốc đơn hàng miễn phí vận chuyển (Freeship từ 300.000đ).
![Cấu hình đơn hàng & Phí ship](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155543_hyfyhm.png)

#### Tab 4: Telegram Bot & Cài Đặt Thông Báo Tự Động
> Cấu hình Bot Token, Admin Chat ID, nút "Gửi tin nhắn thử nghiệm qua Telegram", và công tắc kích hoạt thông báo tự động khi có Đơn hàng mới hoặc khi Đã thanh toán.
![Cấu hình Telegram Bot & Thông báo](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167251/demo-tiemlennhakieu/admin/Screenshot_2026-08-31_155550_shkk0d.png)

