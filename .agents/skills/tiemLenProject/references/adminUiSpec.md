# Đặc tả giao diện Admin Dashboard — Website bán móc khóa len handmade

> Tài liệu dùng để agent (AI coding assistant) implement phần **Admin Dashboard**.
> Đi kèm với `client-ui-spec.md` (phần Client). Backend API/Socket được giả định đã có,
> cần confirm lại contract thực tế trước khi code (xem mục 9).

---

## 0. Tech stack đề xuất

- **Framework**: Next.js (App Router) hoặc React + Vite (admin không cần SEO nên SSR không bắt buộc, ưu tiên tốc độ dev)
- **UI Kit**: TailwindCSS + shadcn/ui hoặc Ant Design (Ant Design phù hợp cho dashboard nhiều bảng/form, ít công sức tự build)
- **State/data fetching**: React Query (cache, refetch, optimistic update)
- **Table**: TanStack Table (sort, filter, pagination server-side)
- **Form**: React Hook Form + Zod
- **Chart**: Recharts hoặc Chart.js (doanh thu, thống kê)
- **Realtime**: socket.io-client — nhận thông báo đơn mới, thanh toán thành công
- **Rich text editor** (viết blog): TipTap hoặc Quill
- **Auth**: JWT, có phân quyền role (Admin / Nhân viên) — xem mục 8

Nguyên tắc chung:
- **Design System & Theme**: Sử dụng duy nhất **Theme Dark Navy Slate + Màu chủ đạo Xanh Emerald (`#10B981`)** quy định tại **`references/adminDesignSystem.md`** (không code logic Light/Dark mode).
- Toàn bộ dữ liệu bảng (đơn hàng, sản phẩm, khách hàng) phải **phân trang + filter phía server**, không load hết về client.
- Mọi hành động thay đổi trạng thái quan trọng (hủy đơn, xác nhận thanh toán thủ công, xóa sản phẩm) đều cần **modal xác nhận**.
- Áp dụng optimistic UI cho các thao tác nhỏ (đổi trạng thái), nhưng phải rollback nếu API lỗi.
- Responsive tối thiểu ở mức desktop + tablet (admin thường dùng trên máy tính, không cần tối ưu mobile sâu như client).

---

## 1. Danh sách màn hình (Sitemap)

```
/login                         Login
/                              Dashboard tổng quan
/orders                        Danh sách đơn hàng
/orders/[id]                   Chi tiết đơn hàng
/products                      Danh sách sản phẩm
/products/new                  Thêm sản phẩm
/products/[id]                 Sửa sản phẩm
/categories                    Quản lý danh mục
/customers                     Danh sách khách hàng
/customers/[id]                Chi tiết khách hàng
/promotions                    Mã giảm giá / khuyến mãi
/rewards/config                Cấu hình tích điểm
/blog                          Danh sách bài viết
/blog/new                      Viết bài mới
/blog/[id]                     Sửa bài viết
/staff                         Quản lý tài khoản nhân viên (phân quyền)
/settings                      Cấu hình chung (ngân hàng, ship, thông báo)
/analytics                     Báo cáo/thống kê nâng cao
```

---

## 2. Layout chung

**Sidebar trái** (collapsible):
- Logo shop
- Menu: Dashboard / Đơn hàng (badge số đơn mới) / Sản phẩm / Danh mục / Khách hàng / Khuyến mãi / Điểm thưởng / Blog / Nhân viên / Cấu hình / Thống kê

**Top bar**:
- Breadcrumb
- Icon chuông thông báo **realtime** (đơn mới, thanh toán thành công) — badge đỏ số lượng chưa đọc, click mở dropdown danh sách thông báo gần nhất
- Avatar admin → dropdown: Thông tin tài khoản / Đăng xuất

**Toàn bộ trang danh sách (list)** dùng chung 1 pattern:
- Thanh search + bộ lọc phía trên
- Bảng dữ liệu (table) với cột hành động (xem/sửa/xóa)
- Phân trang dưới cùng
- Nút "+ Thêm mới" góc phải trên (nếu áp dụng)

---

## 3. Dashboard tổng quan (`/`)

**Mục đích**: cái nhìn nhanh về tình hình kinh doanh khi admin mở trang.

**Bố cục**:
- 4 card số liệu nhanh (top row): Doanh thu hôm nay, Đơn hàng mới (chưa xử lý), Đơn chờ thanh toán, Khách hàng mới trong ngày
- Biểu đồ doanh thu theo ngày/tuần/tháng (line/bar chart, có toggle khoảng thời gian)
- Bảng "Đơn hàng gần đây" (10 đơn mới nhất, link sang chi tiết)
- Top sản phẩm bán chạy (list hoặc bar chart ngang)
- Sản phẩm sắp hết hàng (cảnh báo, link sang trang sản phẩm để nhập thêm)

**Realtime**: khi có đơn mới/thanh toán thành công → card số liệu và bảng "đơn hàng gần đây" tự cập nhật không cần F5 (event `order:created`, `order:paid` — xem mục 9).

---

## 4. Quản lý đơn hàng

### 4.1 Danh sách đơn hàng (`/orders`)

**Bộ lọc**:
- Trạng thái: Chờ thanh toán / Đã thanh toán / Đang đóng gói / Đang giao / Hoàn tất / Đã hủy
- Khoảng thời gian đặt hàng
- Search theo mã đơn / SĐT khách

**Bảng hiển thị**: Mã đơn, Khách hàng, SĐT, Tổng tiền, Trạng thái (badge màu), Ngày đặt, Hành động (Xem chi tiết)

**Realtime**: đơn mới tự thêm vào đầu bảng kèm hiệu ứng highlight ngắn (vd nền vàng nhạt 2s) để admin dễ nhận biết; đồng thời phát âm thanh thông báo nhỏ (có thể tắt trong cấu hình).

### 4.2 Chi tiết đơn hàng (`/orders/[id]`)

**Bố cục**:
- Thông tin khách hàng & địa chỉ giao hàng
- Danh sách sản phẩm trong đơn (ảnh, tên, biến thể, SL, giá)
- Thông tin thanh toán: đã thanh toán chưa, số tiền, thời gian, (nếu tự động) mã giao dịch ngân hàng
- **Nút "Xác nhận đã thanh toán" (thủ công)** — chỉ hiện nếu đơn chưa match tự động qua webhook, cần modal xác nhận trước khi bấm
- Timeline trạng thái đơn (giống bên client) + **dropdown đổi trạng thái tiếp theo** (đang đóng gói → đang giao → hoàn tất), mỗi lần đổi bắn realtime cho khách + optionally Telegram
- Ghi chú nội bộ (admin note, khách không thấy)
- Nút "Hủy đơn" (yêu cầu nhập lý do hủy)

---

## 5. Quản lý sản phẩm

### 5.1 Danh sách sản phẩm (`/products`)
- Bộ lọc: danh mục, trạng thái (còn hàng/hết hàng/ẩn), search tên
- Bảng: Ảnh, Tên, Danh mục, Giá, Tồn kho, Trạng thái, Hành động (Sửa/Ẩn/Xóa)
- Nút "+ Thêm sản phẩm"
- Thao tác nhanh đổi tồn kho ngay trên bảng (inline edit) để nhập hàng nhanh không cần vào trang sửa

### 5.2 Thêm/Sửa sản phẩm (`/products/new`, `/products/[id]`)
**Form gồm**:
- Tên sản phẩm, slug (tự sinh, cho sửa tay)
- Danh mục (select, có thể multi nếu 1 sản phẩm thuộc nhiều category)
- Mô tả (rich text)
- Ảnh (upload nhiều ảnh, kéo thả sắp xếp thứ tự, chọn ảnh đại diện)
- Giá gốc / giá khuyến mãi
- Biến thể (variant): thêm nhóm biến thể (màu/size), mỗi biến thể có giá riêng (nếu cần) + tồn kho riêng
- Tồn kho tổng (nếu không dùng biến thể)
- Trạng thái: Hiển thị / Ẩn
- SEO fields (meta title, meta description) — vì sản phẩm cũng cần SEO

---

## 6. Quản lý danh mục (`/categories`)
- Danh sách danh mục (tên, ảnh/icon, số sản phẩm thuộc danh mục, thứ tự hiển thị)
- Thêm/sửa/xóa, kéo thả sắp xếp thứ tự hiển thị trên trang client

---

## 7. Quản lý khách hàng

### 7.1 Danh sách (`/customers`)
- Bảng: Tên, SĐT/Email, Tổng số đơn, Tổng chi tiêu, Điểm hiện có, Ngày tham gia
- Search theo tên/SĐT

### 7.2 Chi tiết khách hàng (`/customers/[id]`)
- Thông tin cá nhân, địa chỉ đã lưu
- Lịch sử đơn hàng của khách
- Lịch sử điểm tích/tiêu
- Nút điều chỉnh điểm thủ công (cộng/trừ, yêu cầu ghi lý do — audit log)

---

## 8. Khuyến mãi & Điểm thưởng

### 8.1 Mã giảm giá (`/promotions`)
- Danh sách mã: code, loại giảm (%, số tiền cố định), điều kiện áp dụng (đơn tối thiểu), thời gian hiệu lực, số lượt dùng còn lại, trạng thái
- Thêm/sửa/vô hiệu hóa mã

### 8.2 Cấu hình tích điểm (`/rewards/config`)
- Tỷ lệ tích điểm (vd 1.000đ = 1 điểm)
- Tỷ lệ quy đổi điểm → giảm giá (vd 100 điểm = 10.000đ)
- Điều kiện tối thiểu để dùng điểm

---

## 9. Blog (CMS)

### 9.1 Danh sách bài viết (`/blog`)
- Bảng: Tiêu đề, Tag, Trạng thái (Nháp/Đã đăng), Lượt xem, Ngày đăng
- Nút "+ Viết bài mới"

### 9.2 Soạn bài viết (`/blog/new`, `/blog/[id]`)
- Tiêu đề, slug
- Rich text editor (chèn ảnh, video embed)
- Chọn tag/category blog
- Gắn sản phẩm liên quan (search & chọn sản phẩm để hiển thị CTA trong bài — quan trọng cho conversion)
- SEO fields: meta title, meta description, ảnh đại diện (OG image)
- Trạng thái: Nháp / Đăng ngay / Hẹn giờ đăng

---

## 10. Quản lý nhân viên & phân quyền (`/staff`)

- Danh sách tài khoản nhân viên, vai trò (Admin toàn quyền / Nhân viên xử lý đơn / Nhân viên viết blog)
- Thêm tài khoản, gán quyền theo module (đơn hàng, sản phẩm, blog...)
- Đây là phần tốt để "khoe" RBAC (Role-Based Access Control) trong CV nếu bạn muốn đầu tư kỹ hơn về backend.

---

## 11. Cấu hình chung (`/settings`)

- Thông tin ngân hàng nhận QR (số TK, tên NH, chủ TK) — dùng để generate QR động
- Thời gian giữ đơn trước khi tự hủy (phút)
- Cấu hình Telegram (bot token, chat_id nhận thông báo) — có nút "Test gửi thử"
- Cấu hình phí vận chuyển (cố định hoặc theo khu vực)
- Bật/tắt âm thanh thông báo đơn mới

---

## 12. Thống kê nâng cao (`/analytics`)

- Doanh thu theo khoảng thời gian tùy chọn, so sánh kỳ trước
- Top sản phẩm/danh mục bán chạy
- Tỷ lệ đơn hủy / đơn hoàn tất
- Nguồn traffic (nếu có tracking UTM từ TikTok) — hiển thị đơn hàng đến từ campaign nào
- Export báo cáo ra Excel/CSV

---

## 13. Socket.IO — events admin cần lắng nghe (contract giả định, confirm lại với BE)

| Event | Chiều | Payload (ví dụ) | Dùng ở màn hình |
|---|---|---|---|
| `join:admin` | client → server | `{ adminId }` | Toàn bộ admin (join room chung `admin_room`) |
| `order:created` | server → client | `{ orderId, customerName, total }` | Dashboard, Danh sách đơn hàng, Top bar notification |
| `order:paid` | server → client | `{ orderId, paidAt, amount }` | Dashboard, Danh sách đơn hàng, Chi tiết đơn |
| `order:status_changed` | server → client | `{ orderId, status }` | Chi tiết đơn (nếu 2 admin cùng xem) |
| `stock:low` | server → client | `{ productId, stockLeft }` | Dashboard (cảnh báo sắp hết hàng) |

> Khi nhận `order:created`/`order:paid`, top bar phải: tăng badge số thông báo chưa đọc, phát âm thanh (nếu bật), thêm vào dropdown notification list, và nếu đang ở đúng trang danh sách đơn thì tự thêm dòng mới không cần refresh.

---

## 14. Ghi chú cho Agent khi code

1. Thứ tự implement đề xuất: **Auth/Login → Layout (sidebar/topbar) → Dashboard → Đơn hàng (list + detail) → Sản phẩm → Danh mục → Khách hàng → Khuyến mãi/Điểm thưởng → Blog CMS → Nhân viên/Phân quyền → Cấu hình → Thống kê nâng cao**.
2. Toàn bộ bảng dữ liệu dùng chung 1 component `DataTable` tái sử dụng (search, filter, pagination, sort) — tránh code lặp lại từng trang.
3. Modal xác nhận dùng chung 1 component `ConfirmDialog` cho mọi hành động phá hủy/không thể hoàn tác (xóa, hủy đơn, vô hiệu hóa mã giảm giá).
4. Socket instance dùng chung toàn admin app (1 kết nối duy nhất từ lúc login), không tạo mới ở từng trang.
5. Phân quyền (RBAC) nên check ở cả **route level** (ẩn menu nếu không có quyền) và **API level** (BE) — không chỉ ẩn UI vì không đủ bảo mật.
6. Các action ảnh hưởng tiền/tồn kho (xác nhận thanh toán thủ công, điều chỉnh điểm, đổi tồn kho) cần ghi **audit log** (ai làm, lúc nào, giá trị trước/sau) để phục vụ tra soát sau này — đây cũng là điểm cộng tốt cho CV backend.
