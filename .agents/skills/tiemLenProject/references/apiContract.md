# API Contract — Nguồn chân lý cho FE-BE

> Vì `fe-client`, `fe-admin`, `api` không share type, đây là tài liệu **duy nhất** để đối chiếu
> field/response giữa FE và BE. Mọi thay đổi request/response đều phải cập nhật file này TRƯỚC,
> agent code FE và BE phải cùng tham chiếu đúng 1 bản này.

Base URL: `https://api.tiemlennhakieu.com/v1` (thay bằng domain thật khi deploy)
Format lỗi chung: `{ success: false, message: string, errorCode?: string }`
Format thành công chung: `{ success: true, data: <tùy endpoint> }`

---

## 1. Auth

### `POST /auth/register`
Request:
```json
{ "phone": "0987654321", "password": "123456", "fullName": "Nguyễn Thảo Vy" }
```
Response:
```json
{ "success": true, "data": { "userId": "u_001", "accessToken": "...", "refreshToken": "..." } }
```

### `POST /auth/login`
Request: `{ "phone": "0987654321", "password": "123456" }`
Response: giống register.

### `POST /auth/otp/request` — gửi OTP (dùng cho login OTP hoặc register verify)
Request: `{ "phone": "0987654321", "purpose": "register" | "login" | "resetPassword" }`
Response: `{ "success": true, "data": { "otpId": "otp_001", "expiresIn": 300 } }`

### `POST /auth/otp/verify`
Request: `{ "otpId": "otp_001", "code": "123456" }`
Response: `{ "success": true, "data": { "verified": true } }`

### `POST /auth/refresh`
Request: `{ "refreshToken": "..." }`
Response: `{ "success": true, "data": { "accessToken": "..." } }`

### `POST /auth/logout`
Header: `Authorization: Bearer <accessToken>`
Response: `{ "success": true }`

---

## 2. Products

### `GET /products`
Query: `?category=hoa&sort=priceAsc|priceDesc|newest|bestSelling&page=1&limit=24&minPrice=&maxPrice=`
Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "p_001",
        "slug": "moc-khoa-meo-beo",
        "name": "Móc khóa mèo béo",
        "price": 89000,
        "originalPrice": 120000,
        "thumbnail": "https://...",
        "stockLeft": 15,
        "badge": "hot",
        "ratingAvg": 4.8,
        "ratingCount": 128
      }
    ],
    "total": 126,
    "page": 1,
    "limit": 24
  }
}
```

### `GET /products/:slug`
Response:
```json
{
  "success": true,
  "data": {
    "id": "p_001",
    "slug": "moc-khoa-meo-beo",
    "name": "Móc khóa mèo béo",
    "description": "<p>...</p>",
    "images": ["https://...", "https://..."],
    "price": 89000,
    "originalPrice": 120000,
    "stockLeft": 15,
    "variants": [
      { "id": "v_001", "type": "color", "label": "Kem hồng", "stockLeft": 8, "priceDiff": 0 }
    ],
    "ratingAvg": 4.8,
    "ratingCount": 128,
    "relatedProducts": ["p_002", "p_003"]
  }
}
```

### `GET /categories`
Response: `{ "success": true, "data": [ { "id": "c_001", "name": "Động vật", "slug": "dong-vat" } ] }`

---

## 3. Cart & Orders (Client)

### `POST /orders` — tạo đơn hàng (guest hoặc user)
Header (optional): `Authorization: Bearer <accessToken>` — nếu có thì gắn userId vào đơn
Request:
```json
{
  "items": [{ "productId": "p_001", "variantId": "v_001", "quantity": 2 }],
  "recipient": {
    "fullName": "Nguyễn Thảo Vy",
    "phone": "0987654321",
    "address": "123 Trần Trãi, Phường Bến Thành",
    "province": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Thành",
    "note": "Giao giờ hành chính giúp mình nhé"
  },
  "promoCode": "SALE10",
  "usePoints": 200
}
```
Response:
```json
{
  "success": true,
  "data": {
    "orderId": "ord_100523",
    "orderCode": "NK100523",
    "total": 341000,
    "expiresAt": "2026-07-14T10:45:00Z",
    "paymentInfo": {
      "bankName": "Techcombank",
      "accountNumber": "NK100523",
      "accountName": "NGUYEN THAO VY",
      "amount": 341000,
      "transferContent": "NK100523",
      "qrImageUrl": "https://..."
    }
  }
}
```
Lỗi thường gặp: `errorCode: "OUT_OF_STOCK"`, `"INVALID_PROMO_CODE"`, `"INVALID_PHONE"`

### `GET /orders/lookup` — tra cứu đơn (guest)
Query: `?orderCode=NK100523&phone=0987654321`
Response:
```json
{
  "success": true,
  "data": {
    "orderCode": "NK100523",
    "status": "shipping",
    "total": 341000,
    "items": [...],
    "timeline": [
      { "status": "pending", "label": "Đặt hàng thành công", "at": "2026-07-14T10:30:00Z" },
      { "status": "paid", "label": "Đã xác nhận đơn hàng", "at": "2026-07-14T11:15:00Z" }
    ]
  }
}
```

### `GET /orders/:id` — chi tiết đơn (yêu cầu login, chỉ xem đơn của chính mình)
Response: giống `orders/lookup` nhưng có thêm field liên quan tài khoản (điểm nhận được từ đơn này...).

### `GET /orders` — lịch sử đơn (yêu cầu login)
Query: `?status=&page=1&limit=10`
Response: danh sách rút gọn giống `GET /products` (có `items`, `total`, `page`, `limit`).

---

## 4. Payments

### `POST /payments/webhook` — nhận từ SePay/Casso (không qua JWT, verify signature riêng)
Request (tùy nhà cung cấp, ví dụ SePay):
```json
{ "content": "NK100523", "transferAmount": 341000, "referenceCode": "FT2607..." }
```
Response: `{ "success": true }` (luôn trả 200 nếu nhận được, xử lý idempotent theo `referenceCode`)

### `POST /orders/:id/confirmPaymentManual` — admin xác nhận thủ công
Header: `Authorization: Bearer <adminAccessToken>`
Response: `{ "success": true, "data": { "status": "paid" } }`

---

## 5. Loyalty & Promotions

### `GET /loyalty/me` (yêu cầu login)
Response: `{ "success": true, "data": { "points": 200, "history": [ { "type": "earn", "amount": 89, "orderId": "ord_100523", "at": "..." } ] } }`

### `POST /promotions/validate`
Request: `{ "code": "SALE10", "orderTotal": 341000 }`
Response: `{ "success": true, "data": { "discountAmount": 20000 } }`
Lỗi: `errorCode: "PROMO_EXPIRED" | "PROMO_NOT_FOUND" | "PROMO_MIN_ORDER_NOT_MET"`

---

## 6. Blog

### `GET /blog/posts`
Query: `?tag=&page=1&limit=12`
Response: danh sách rút gọn (title, slug, thumbnail, excerpt, publishedAt).

### `GET /blog/posts/:slug`
Response: `{ "success": true, "data": { "title": "...", "content": "<p>...</p>", "relatedProducts": [...], "metaTitle": "...", "metaDescription": "..." } }`

---

## 7. Admin — Orders

### `GET /admin/orders`
Query: `?status=&from=&to=&search=&page=1&limit=20`
Response: danh sách đầy đủ hơn client (kèm SĐT, tổng tiền, trạng thái thanh toán).

### `PATCH /admin/orders/:id/status`
Request: `{ "status": "packing" | "shipping" | "completed" | "cancelled", "reason"?: "string (bắt buộc nếu cancelled)" }`
Response: `{ "success": true, "data": { "status": "packing" } }`

---

## 8. Admin — Products

### `POST /admin/products`
Request:
```json
{
  "name": "Móc khóa mèo béo",
  "categoryIds": ["c_001"],
  "description": "<p>...</p>",
  "price": 89000,
  "originalPrice": 120000,
  "images": ["https://..."],
  "variants": [{ "type": "color", "label": "Kem hồng", "stock": 15 }],
  "metaTitle": "...",
  "metaDescription": "..."
}
```
Response: `{ "success": true, "data": { "id": "p_001" } }`

### `PATCH /admin/products/:id` — sửa (cùng shape với create, các field optional)
### `PATCH /admin/products/:id/stock` — cập nhật nhanh tồn kho
Request: `{ "variantId": "v_001", "stock": 20 }`

---

## 9. Admin — Dashboard

### `GET /admin/dashboard/summary`
Query: `?range=today|week|month`
Response:
```json
{
  "success": true,
  "data": {
    "revenue": 3410000,
    "newOrders": 12,
    "pendingPaymentOrders": 3,
    "newCustomers": 5,
    "topProducts": [{ "productId": "p_001", "name": "Móc khóa mèo béo", "sold": 42 }]
  }
}
```

---

## 10. Mã lỗi chung (errorCode) dùng xuyên suốt

| errorCode | Ý nghĩa |
|---|---|
| `UNAUTHORIZED` | Chưa đăng nhập hoặc token hết hạn |
| `FORBIDDEN` | Không đủ quyền (role) |
| `NOT_FOUND` | Không tìm thấy resource |
| `OUT_OF_STOCK` | Sản phẩm/biến thể hết hàng khi đặt |
| `ORDER_EXPIRED` | Đơn quá hạn thanh toán |
| `ORDER_ALREADY_PAID` | Đơn đã thanh toán trước đó (tránh xử lý webhook trùng) |
| `INVALID_PROMO_CODE` | Mã giảm giá không hợp lệ/hết hạn |
| `VALIDATION_ERROR` | Request thiếu/sai field, kèm `details` liệt kê field lỗi |

---

## 11. Ghi chú cho Agent

- FE luôn kiểm tra `success` trước khi đọc `data`; khi `success: false` hiển thị `message` (đã dịch tiếng Việt sẵn từ BE) cho người dùng, không tự chế message khác ở FE.
- BE khi thêm field mới vào response phải cập nhật file này trong cùng lúc, không để lệch — vì đây là hợp đồng thay thế cho shared-types package.
- Toàn bộ endpoint admin (`/admin/**`) bắt buộc qua `authMiddleware` + `roleMiddleware`, kiểm tra ở tầng BE chứ không chỉ ẩn UI.
