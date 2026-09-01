# Tiệm Len Nhà Kiều — Customer Storefront (`fe-client`)

> Giao diện website thương mại điện tử dành cho khách hàng mua sắm các sản phẩm móc khóa và đồ len thủ công. Được xây dựng trên nền tảng **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, tích hợp quản lý trạng thái bằng **Redux Toolkit** và gọi API tự động đồng bộ qua **RTK Query**.
> 
> 🌐 **Website trực tuyến**: [https://tiemlen.lesitoan.io.vn/](https://tiemlen.lesitoan.io.vn/)

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

`fe-client` là giao diện bán hàng trực tiếp của Tiệm Len Nhà Kiều, được tối ưu hóa đặc biệt theo triết lý **Mobile-First** nhằm đón đầu lượng truy cập lớn từ kênh TikTok và mạng xã hội, đồng thời bảo đảm trải nghiệm mượt mà, trực quan trên cả máy tính để bàn (Desktop).

---

## 2. Tính Năng Nổi Bật

- **Trang chủ hiện đại, thu hút**:
  - Banner Slider nghệ thuật trình chiếu các bộ sưu tập len nổi bật.
  - Danh mục sản phẩm dạng thẻ tròn/lưới giúp định hướng mua sắm nhanh.
  - Section "Sản phẩm bán chạy" và "Ưu đãi hôm nay" kích thích chuyển đổi.
  - Khối bài viết cẩm nang handmade và liên kết mạng xã hội phong phú.
- **Duyệt & Lọc sản phẩm thông minh**:
  - Lọc đa tiêu chí: Lọc theo danh mục, khoảng giá trượt linh hoạt, bảng màu sắc và loại sản phẩm.
  - Bộ sắp xếp sản phẩm: Mới nhất, Bán chạy nhất, Giá tăng dần / giảm dần.
- **Trang chi tiết sản phẩm tối ưu SEO**:
  - Thư viện ảnh tương tác cao với hiệu ứng trượt Swiper và phóng to chi tiết với PhotoSwipe.
  - Chọn biến thể thuộc tính (màu sắc, kích cỡ) kèm trạng thái tồn kho tức thời.
  - Hai nút kêu gọi hành động CTA rõ ràng: **"Thêm vào giỏ"** và **"Mua ngay"**.
  - Mô tả phong phú, hướng dẫn bảo quản đồ len và danh sách sản phẩm liên quan.
- **Quy trình Giỏ hàng & Thanh toán chuẩn xác**:
  - Quản lý giỏ hàng: Cập nhật số lượng, xóa từng món, áp dụng mã khuyến mãi Voucher.
  - Chọn địa chỉ giao hàng đã lưu hoặc nhập địa chỉ mới trong sổ địa chỉ.
  - Màn hình quét mã QR VietQR tự động kèm đồng hồ đếm ngược giữ đơn (30 phút).
- **Trang Blog kiến thức & Tối ưu SEO**:
  - Bài viết tiêu điểm, bộ lọc theo chuyên mục (Hướng dẫn móc len, Ý tưởng quà tặng, Chăm sóc len).
  - Mục lục nội dung tự động (Table of Contents) cuộn mượt đến từng phần.
  - Banner quảng bá kênh TikTok thu hút tương tác chéo.
- **Quản lý Tài khoản cá nhân**:
  - Cập nhật thông tin cá nhân (Họ tên, SĐT, Email, Giới tính, Ngày sinh).
  - Quản lý sổ địa chỉ giao hàng (Thêm mới, đặt địa chỉ mặc định, xóa).
  - Theo dõi lịch sử đơn hàng theo từng trạng thái (Tất cả, Chờ thanh toán, Đang đóng gói, Đang giao, Đã giao).
  - Đổi mật khẩu tài khoản an toàn.

---

## 3. Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15 (App Router) | Khung ứng dụng React Server Components & SSR/SSG |
| **UI Library** | React 19, TypeScript 5 | Xây dựng giao diện an toàn kiểu dữ liệu |
| **Styling** | Tailwind CSS 3 | Hệ thống Utility-first CSS theo Design Token |
| **State & API Management**| Redux Toolkit, RTK Query | Quản lý Server State (cache) và Client State (giỏ hàng, auth) |
| **Biểu mẫu & Kiểm thực** | React Hook Form | Xử lý Form hiệu năng cao, validate mượt mà |
| **Xác thực mạng xã hội** | `@react-oauth/google` | Đăng nhập nhanh bằng tài khoản Google |
| **Icons & Media Carousel** | Lucide React, Swiper, PhotoSwipe | Biểu tượng vector hiện đại, trình chiếu và zoom ảnh |
| **Thông báo** | React Toastify | Toast thông báo trạng thái thao tác |

---

## 4. Danh Sách Màn Hình & Tuyến Đường (Sitemap)

```txt
fe-client/src/app/
├── (storefront)/
│   ├── page.tsx                           # Trang chủ (/)
│   ├── san-pham/
│   │   ├── page.tsx                       # Danh sách sản phẩm (/san-pham)
│   │   └── [slug]/page.tsx                # Chi tiết sản phẩm (/san-pham/[slug])
│   ├── gio-hang/page.tsx                  # Giỏ hàng (/gio-hang)
│   ├── thanh-toan/
│   │   ├── page.tsx                       # Thanh toán đặt hàng (/thanh-toan)
│   │   └── qr/[orderId]/page.tsx          # Màn hình quét mã VietQR (/thanh-toan/qr/:orderId)
│   ├── bai-viet/
│   │   ├── page.tsx                       # Danh sách bài viết Blog (/bai-viet)
│   │   └── [slug]/page.tsx                # Chi tiết bài viết Blog (/bai-viet/[slug])
│   ├── tai-khoan/
│   │   ├── page.tsx                       # Hồ sơ cá nhân (/tai-khoan)
│   │   ├── don-hang/page.tsx              # Lịch sử đơn hàng (/tai-khoan/don-hang)
│   │   ├── dia-chi/page.tsx               # Sổ địa chỉ (/tai-khoan/dia-chi)
│   │   └── doi-mat-khau/page.tsx          # Đổi mật khẩu (/tai-khoan/doi-mat-khau)
│   ├── tra-cuu-don/page.tsx               # Tra cứu trạng thái đơn hàng (/tra-cuu-don)
│   ├── gioi-thieu/page.tsx                # Trang giới thiệu thương hiệu (/gioi-thieu)
│   ├── lien-he/page.tsx                   # Trang liên hệ hỗ trợ (/lien-he)
│   └── chinh-sach/                        # Các trang chính sách mua hàng & bảo mật
```

---

## 5. Cấu Trúc Thư Mục

Cấu trúc mã nguồn tuân thủ nghiêm ngặt quy tắc tách biệt tầng:

```txt
fe-client/
├── public/                      # Tệp tĩnh (logo, favicon, banner)
├── src/
│   ├── app/                     # Next.js App Router (chỉ định nghĩa route & gọi screens)
│   ├── screens/                 # Toàn bộ mã nguồn & giao diện của từng trang
│   │   ├── home/                # Giao diện Trang chủ
│   │   ├── products/            # Giao diện Danh sách sản phẩm
│   │   ├── productDetail/       # Giao diện Chi tiết sản phẩm
│   │   ├── cart/                # Giao diện Giỏ hàng
│   │   ├── checkout/            # Giao diện Thanh toán & VietQR
│   │   ├── blog/                # Giao diện Danh sách & Chi tiết Blog
│   │   └── account/             # Giao diện Quản lý tài khoản
│   ├── components/              # Các UI Component dùng chung (Header, Footer, Modals, Card...)
│   │   ├── common/              # Nút bấm, input, badge, spinner dùng chung
│   │   ├── layout/              # Header, Footer, BottomNavigation di động
│   │   └── modals/              # Các modal chức năng (Tìm kiếm, Đăng nhập, Giỏ hàng nhanh)
│   ├── constants/               # Hằng số hệ thống, dữ liệu mappers, màu sắc design token
│   ├── hooks/                   # Custom React Hooks dùng chung
│   ├── services/api/            # RTK Query: baseApi.ts & injectEndpoints theo domain
│   │   ├── baseApi.ts           # Cấu hình baseUrl, prepareHeaders, tagTypes
│   │   ├── authApi.ts           # API đăng nhập, đăng ký, thông tin tài khoản
│   │   ├── productApi.ts        # API sản phẩm, danh mục
│   │   ├── orderApi.ts          # API tạo đơn, lịch sử đơn hàng
│   │   └── blogApi.ts           # API bài viết blog
│   ├── store/                   # Redux Store cấu hình Slices (authSlice, cartSlice)
│   ├── types/                   # Định nghĩa TypeScript interface / type của Client
│   └── utils/                   # Hàm tiện ích format tiền tệ (VND), ngày tháng, chuỗi
├── .env.example                 # Mẫu cấu hình môi trường
├── next.config.mjs              # Cấu hình Next.js
├── tailwind.config.ts           # Cấu hình theme Tailwind theo Design Token
└── tsconfig.json                # Cấu hình TypeScript
```

---

## 6. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Cài đặt thư viện
```bash
# Từ thư mục gốc của project
npm --prefix fe-client install

# Hoặc di chuyển trực tiếp vào fe-client
cd fe-client
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
> Ứng dụng sẽ mở tại địa chỉ: `http://localhost:3000`

### Bước 4: Kiểm tra và đóng gói Production
```bash
# Kiểm tra lỗi Lint
npm run lint

# Đóng gói tối ưu hóa cho Production
npm run build

# Khởi chạy bản build
npm run start
```

---

## 7. Cấu Hình Biến Môi Trường (`.env`)

| Biến môi trường | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Có | `http://localhost:4000/api/v1` | URL trỏ tới Backend API v1 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Tùy chọn | - | Mã Client ID tích hợp đăng nhập Google |

---

## 8. Quản Lý Trạng Thái & Tích Hợp API

### 8.1 Phân định rõ ràng 2 loại State
1. **Server State (Dữ liệu từ máy chủ)**:
   - Do **RTK Query** quản lý hoàn toàn tại `src/services/api/`.
   - Cơ chế tự động lưu bộ nhớ đệm (cache), tự động cập nhật lại dữ liệu (invalidation) qua `tagTypes: ["Product", "Category", "Order", "Customer", "Blog"]`.
2. **Client Local State (Dữ liệu trình duyệt)**:
   - Do **Redux Toolkit Slices** (`src/store/slices/`) phụ trách:
     - `cartSlice`: Quản lý danh sách món hàng, cập nhật số lượng, lưu tự động vào `localStorage`.
     - `authSlice`: Quản lý thông tin phiên làm việc của khách hàng (`token`, `customer`).

### 8.2 Quy tắc gọi API trong Component
- Khai thác RTK Query Hook trực tiếp tại subcomponent phụ trách hành động (ví dụ: nút "Lưu địa chỉ" trong tab Địa chỉ tự gọi mutation `useAddAddressMutation()`), tránh truyền callback props qua nhiều cấp trung gian.

---

## 9. Hình Ảnh Demo Giao Diện Thực Tế (Screenshots Showcase)

Toàn bộ hình ảnh thực tế của ứng dụng khách hàng (`fe-client`) được chụp từ hệ thống đang chạy theo từng luồng màn hình.


---

### 9.1 Trang Chủ (Home Page — `/`)

#### Phần trên: Header, Hero Slider & Sản phẩm bán chạy
![Trang chủ - Hero Slider & Sản phẩm bán chạy](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167296/demo-tiemlennhakieu/client/Screenshot_jihyzy.png)

#### Phần giữa: Danh mục sản phẩm & Ưu đãi hôm nay
![Trang chủ - Danh mục & Ưu đãi hôm nay](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167295/demo-tiemlennhakieu/client/Screenshot_1_auwk6h.png)

#### Phần dưới: Kiến thức & Gợi ý quà tặng (Blog nổi bật) & Footer hoàn chỉnh
![Trang chủ - Blog & Footer](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167295/demo-tiemlennhakieu/client/Screenshot_2_vclzn2.png)

---

### 9.2 Mua Sắm Sản Phẩm (Shopping Flow)

#### Danh Sách Sản Phẩm (Product Listing — `/san-pham`)
> Bộ lọc thông minh theo khoảng giá, danh mục, màu sắc; sắp xếp theo độ bán chạy; lưới sản phẩm 4 cột responsive.
![Danh sách sản phẩm](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167294/demo-tiemlennhakieu/client/Screenshot_3_tgcnfz.png)

#### Chi Tiết Sản Phẩm (Product Detail — `/san-pham/[slug]`)
> Gallery hình ảnh tương tác cao với PhotoSwipe, giá bán nổi bật, số lượng đã bán, cam kết dịch vụ và 2 nút CTA "Thêm vào giỏ" & "Mua ngay".
![Chi tiết sản phẩm - Phần trên](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167294/demo-tiemlennhakieu/client/Screenshot_4_c6rukg.png)

> Bảng thông số chi tiết (chất liệu sợi len Milk Cotton, kích thước, lõi bông đàn hồi) và gợi ý sản phẩm tương tự.
![Chi tiết sản phẩm - Thông số & Sản phẩm tương tự](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167293/demo-tiemlennhakieu/client/Screenshot_5_kwox80.png)

---

### 9.3 Giỏ Hàng & Thanh Toán VietQR Tự Động

#### Giỏ Hàng Trực Tuyến (Shopping Cart — `/gio-hang`)
> Quản lý sản phẩm trong giỏ (lưu localStorage), nhập mã giảm giá Voucher, tóm tắt tổng thanh toán và section "Có thể bạn cũng thích".
![Giỏ hàng](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167292/demo-tiemlennhakieu/client/Screenshot_6_ahqmql.png)

#### Đặt Hàng & Thanh Toán (Checkout — `/thanh-toan`)
> Chọn địa chỉ nhận hàng từ sổ địa chỉ, ghi chú đơn, phương thức chuyển khoản ngân hàng VietQR tự động.
![Thanh toán](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167292/demo-tiemlennhakieu/client/Screenshot_7_pfectn.png)

#### Quét Mã VietQR Thanh Toán Tức Thì (`/thanh-toan/qr/[orderId]`)
> Đồng hồ đếm ngược giữ đơn 30 phút, mã QR VietQR SePay sinh động theo đơn, bảng thông tin chuyển khoản kèm nút sao chép nhanh một chạm.
![Quét mã VietQR](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167291/demo-tiemlennhakieu/client/Screenshot_8_mqe1am.png)

---

### 9.4 Blog Kiến Thức & Cẩm Nang Handmade

#### Danh Sách Bài Viết (Blog Listing — `/bai-viet`)
> Bài viết tiêu điểm lớn, thanh tab phân loại chủ đề (Hướng dẫn móc, Ý tưởng quà tặng, Chăm sóc len), banner video TikTok.
![Danh sách bài viết](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167291/demo-tiemlennhakieu/client/Screenshot_9_hfmi4j.png)

#### Chi Tiết Bài Viết (Blog Detail — `/bai-viet/[slug]`)
> Giao diện đọc bài chuẩn SEO, tích hợp mục lục nội dung (Table of Contents) tự động cuộn mượt và banner quà tặng.
![Chi tiết bài viết](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167290/demo-tiemlennhakieu/client/Screenshot_10_c7vqfq.png)

---

### 9.5 Khu Vực Khách Hàng Cá Nhân (`/tai-khoan`)

#### Tab 1: Thông Tin Cá Nhân
> Cập nhật họ tên, số điện thoại, email, giới tính, ngày sinh.
![Thông tin cá nhân](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167289/demo-tiemlennhakieu/client/Screenshot_11_pah1yz.png)

#### Tab 2: Đơn Hàng Của Tôi
> Bộ lọc đơn theo trạng thái (Tất cả, Chờ thanh toán, Chờ xác nhận, Đang giao...) kèm chi tiết mã đơn và trạng thái.
![Đơn hàng của tôi](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167289/demo-tiemlennhakieu/client/Screenshot_12_oj0cum.png)

#### Tab 3: Sổ Địa Chỉ Nhận Hàng
> Quản lý danh sách địa chỉ giao hàng, nhãn địa chỉ mặc định và xóa địa chỉ.
![Sổ địa chỉ](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167288/demo-tiemlennhakieu/client/Screenshot_13_pfqdlt.png)

#### Tab 4: Đổi Mật Khẩu
> Form cập nhật mật khẩu mới với nút ẩn/hiện mật khẩu bảo mật.
![Đổi mật khẩu](https://res.cloudinary.com/dfwvndqqw/image/upload/v1788167288/demo-tiemlennhakieu/client/Screenshot_14_b3vmuz.png)

