# API Implementation Plan v1 - Tiệm Len Nhà Kiều

> Bản v1 này ghi nhận các quyết định đã chốt cho API v1. File này là nguồn tham chiếu chính khi bắt đầu code API.
>
> Mục tiêu v1: nối được luồng bán hàng thật, quản trị sản phẩm/danh mục/đơn/khách hàng cơ bản, thanh toán QR, webhook thanh toán, socket trạng thái đơn. Những phần chưa cần sẽ không tạo bảng/endpoint để tránh phình scope.

> Thiết kế DB chi tiết nằm ở `api/docs/databaseDesignV1.md`.

## 1. Quyết định phạm vi v1

### 1.1. Làm trong v1

- Auth client bằng email.
- Phone trong hồ sơ khách hàng là optional.
- Checkout vẫn yêu cầu số điện thoại người nhận để giao hàng/liên hệ; tra cứu đơn nằm trong tài khoản đã đăng nhập.
- Cart lưu ở `localStorage` client, API không lưu cart.
- Product/category public API.
- Product option đơn giản theo từng sản phẩm, hiện hỗ trợ màu sắc và kích thước.
- Product images tách bảng riêng, có cờ đánh dấu thumbnail.
- Không dùng đánh giá sao, bỏ `ratingAvg`, `ratingCount`.
- Order lưu snapshot sản phẩm tại thời điểm đặt hàng để không lỗi khi sản phẩm bị sửa/xóa.
- Tách `customer` và `user`:
  - `customers`: tài khoản khách hàng website client.
  - `users`: tài khoản nhân sự/admin trong trang quản trị.
- Admin quản lý order, product, category, customer, user/staff.
- Payment QR, webhook, xác nhận thanh toán thủ công.
- Socket cho order/payment/stock.

### 1.2. Không làm trong v1

- Không cần banner/hero slide API.
- Không tạo API cart.
- Không làm promotions trong v1; client có thể ẩn UI voucher/promotion.
- Không tạo bảng `settings` trong v1.
- Không cần `source` trong order.
- Không làm cơ chế rating sao/review sao.

### 1.3. Cấu hình không dùng bảng settings trong v1

Vì v1 chưa tạo bảng `settings`, các giá trị sau lấy từ `.env` hoặc file config trong `api/src/config`:

- Bank/VietQR: bank bin, account number, account name, QR template.
- Shipping fee.
- Free shipping threshold nếu vẫn dùng ở client.
- Order hold minutes.
- Telegram bot token/chat id.
- Loyalty rate nếu loyalty được bật.
- Google login: Google client ID.
- Cloudinary upload: cloud name, API key, API secret, upload folder.

Env API cần có cho Google/Cloudinary:

```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=tiem-len
```

Không đưa `CLOUDINARY_API_SECRET` vào frontend. `GOOGLE_CLIENT_ID` được phép public ở frontend dưới tên `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, nhưng API vẫn cần `GOOGLE_CLIENT_ID` để verify idToken.

Khi qua v2/v3 sản phẩm thật ổn định, có thể migrate các cấu hình này sang bảng `systemSettings`.

## 2. Chuẩn enum chính

### 2.1. OrderStatus

API v1 dùng UPPER_SNAKE_CASE để khớp admin FE:

```ts
type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PACKING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";
```

Mapping hiển thị client:

- `PENDING_PAYMENT`: Chờ thanh toán.
- `PAID`: Đã thanh toán.
- `PACKING`: Đang móc/đóng gói thủ công.
- `SHIPPING`: Đang giao hàng.
- `COMPLETED`: Hoàn tất.
- `CANCELLED`: Đã hủy.

Không thêm `CRAFTING` trong DB/API v1. Nếu client muốn label “Đang móc thủ công” thì map từ `PACKING`.

### 2.2. PaymentStatus

```ts
type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "MISMATCHED"
  | "FAILED"
  | "REFUNDED";
```

### 2.3. ProductStatus

```ts
type ProductStatus = "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";
```

### 2.4. CategoryStatus

```ts
type CategoryStatus = "ACTIVE" | "HIDDEN";
```

### 2.5. CustomerStatus và UserStatus

```ts
type AccountStatus = "ACTIVE" | "LOCKED";
```

## 3. Thiết kế bảng dữ liệu v1

Tên bảng DB có thể dùng snake_case. Tên field trong code/API dùng camelCase.

### 3.1. customers

Tài khoản khách hàng website client. Không dùng bảng này cho admin.

```ts
type Customer = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  emailVerified: boolean;
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  googleAccountId?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: Date;
  avatar?: string;
  status: "ACTIVE" | "LOCKED";
  rewardPoints: number;
  totalSpent: number;
  totalOrders: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Rule:

- `email` là unique và là định danh chính của customer.
- `passwordHash` optional vì customer có thể chỉ đăng nhập bằng Google.
- `isManualLogin = true` khi customer có thể đăng nhập bằng email/password.
- `isGoogleLogin = true` khi customer đã từng đăng nhập/liên kết Google.
- `googleAccountId` lưu Google `sub`, unique nullable, dùng để nhận diện chính xác tài khoản Google khi đăng nhập lại.
- `phone` optional trong profile, nhưng nếu nhập thì nên unique nullable.
- V1 không hỗ trợ guest checkout.
- Khách phải đăng nhập mới được tạo đơn hàng.

Rule link tài khoản:

- Register email/password: request không cần `fullName`; backend tự set `fullName` mặc định từ phần trước `@` của email hoặc `"Khách hàng"`, tạo `customers`, set `passwordHash`, `isManualLogin = true`, `isGoogleLogin = false`.
- Login Google:
  - Verify Google ID token ở backend.
  - Lấy `sub`, `email`, `email_verified`, `name`, `picture`.
  - Nếu đã có customer theo `googleAccountId = sub`, login vào customer đó.
  - Nếu chưa có `googleAccountId` nhưng có customer cùng `email` và Google email đã verified, cập nhật customer đó: `isGoogleLogin = true`, `googleAccountId = sub`, `emailVerified = true`.
  - Nếu chưa có customer cùng email, tạo customer mới, `passwordHash = null`, `isManualLogin = false`, `isGoogleLogin = true`, `googleAccountId = sub`, `emailVerified = true`.
- Nếu Google email chưa verified thì không auto link vào customer có sẵn.
- Nếu customer đăng nhập Google trước, sau đó muốn đặt mật khẩu thì chỉ cần cập nhật `customers.passwordHash`.

### 3.2. customerAddresses

```ts
type CustomerAddress = {
  id: string;
  customerId: string;
  fullName: string;
  phone: string;
  addressLine: string;
  provinceName: string;
  districtName?: string;
  wardName?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 3.3. users

Tài khoản admin/nhân sự quản trị. Không dùng cho khách hàng.

```ts
type User = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT";
  status: "ACTIVE" | "LOCKED";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Rule:

- `email` unique.
- Chỉ `users` được vào `/api/admin/**`.
- Token admin và token customer nên có claim phân biệt, ví dụ `tokenType: "ADMIN" | "CUSTOMER"`.

### 3.4. categories

```ts
type Category = {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  status: "ACTIVE" | "HIDDEN";
  createdAt: Date;
  updatedAt: Date;
};
```

### 3.5. products

```ts
type Product = {
  id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription?: string;
  descriptionHtml?: string;
  careInstructionHtml?: string;
  originalPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";
  highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK";
  soldCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
```

Rule:

- Product được phép xóa mềm bằng `deletedAt`.
- Public API chỉ trả product `ACTIVE` và `deletedAt = null`.
- Admin có thể xem cả `ACTIVE`, `HIDDEN`, `OUT_OF_STOCK`; product đã xóa mềm tùy UI v1 có cần thùng rác hay không.
- Không lưu `thumbnail` trực tiếp trong products, thumbnail lấy từ `productImages.isThumbnail = true`.
- Không có `ratingAvg`, `ratingCount`.

### 3.6. productImages

Tách ảnh sản phẩm ra bảng riêng để dễ quản lý nhiều ảnh, thứ tự hiển thị và thumbnail.

```ts
type ProductImage = {
  id: string;
  productId: string;
  url: string;
  publicId?: string;
  altText?: string;
  displayOrder: number;
  isThumbnail: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

Rule:

- Mỗi product nên có tối đa 1 image `isThumbnail = true`.
- Nếu admin không chọn thumbnail, API tự lấy ảnh `displayOrder` nhỏ nhất làm thumbnail.
- Khi xóa mềm product, không bắt buộc xóa ảnh khỏi cloud ngay; chỉ ngừng trả ở public API.

### 3.7. productOptions

V1 không tạo nhiều bảng filter/variant phức tạp. Khi admin thêm/sửa sản phẩm, phần option của sản phẩm lưu trong một bảng duy nhất. Mỗi loại option của một sản phẩm là một bản ghi.

Hiện tại chỉ config 2 loại:

- `COLOR`: màu sắc.
- `SIZE`: kích thước.

```ts
type ProductOptionType = "COLOR" | "SIZE";

type ProductOptionValue = {
  code: string;
  label: string;
  colorHex?: string;
  priceDiff?: number;
  isDefault?: boolean;
};

type ProductOption = {
  id: string;
  productId: string;
  optionType: ProductOptionType;
  name: string;
  displayOrder: number;
  values: ProductOptionValue[];
  createdAt: Date;
  updatedAt: Date;
};
```

DB PostgreSQL:

- `values` dùng kiểu `jsonb`.
- Có thể thêm unique index `(product_id, option_type)` để mỗi sản phẩm không có 2 bản ghi màu sắc trùng nhau.

Ví dụ sản phẩm A có chọn màu và chọn kích thước thì lưu 2 bản ghi:

```json
[
  {
    "productId": "prod_a",
    "optionType": "COLOR",
    "name": "Màu sắc",
    "displayOrder": 1,
    "values": [
      { "code": "PINK", "label": "Hồng", "colorHex": "#F9B4C7", "isDefault": true },
      { "code": "CREAM", "label": "Kem", "colorHex": "#FEF3C7" }
    ]
  },
  {
    "productId": "prod_a",
    "optionType": "SIZE",
    "name": "Kích thước",
    "displayOrder": 2,
    "values": [
      { "code": "S", "label": "Size S" },
      { "code": "M", "label": "Size M", "priceDiff": 10000 }
    ]
  }
]
```

Rule:

- Product có thể có 0, 1 hoặc 2 option trong v1.
- Max v1 là 2 option/product.
- Không tạo bảng variant theo tổ hợp màu x size trong v1.
- Tồn kho v1 vẫn quản lý ở cấp product bằng `products.stockQuantity`.
- Nếu sau này cần tồn kho/giá theo từng tổ hợp màu x size, lúc đó migrate sang bảng variant riêng.

### 3.8. Product highlight type

V1 chưa tạo bảng badge riêng và bỏ `isFeatured`. Tạm dùng 1 field enum nullable trong bảng `products` để đánh dấu nhóm marketing chính của sản phẩm.

```ts
type ProductHighlightType =
  | "HOT_PRODUCT"
  | "TODAY_DEAL"
  | "HOT_TIKTOK";
```

Field trong `products`:

```ts
type Product = {
  highlightType?: ProductHighlightType;
};
```

Ý nghĩa:

- `HOT_PRODUCT`: sản phẩm hot.
- `TODAY_DEAL`: sản phẩm ưu đãi hôm nay.
- `HOT_TIKTOK`: sản phẩm hot TikTok.
- `null`: sản phẩm thường, không nằm trong nhóm marketing đặc biệt.

Rule:

- Mỗi product chỉ có tối đa 1 `highlightType` trong v1.
- Admin có thể lọc/sửa field này trong form sản phẩm.
- Client home có thể gọi product listing theo `highlightType` để tạo các group như “Sản phẩm hot”, “Ưu đãi hôm nay”, “Hot TikTok”.
- Sau này nếu chỉ thêm nhóm marketing mới thì thêm value vào enum/config. Nếu thật sự cần nhiều nhãn trên cùng một product hoặc admin tự tạo nhãn tự do, khi đó mới cân nhắc migrate sang bảng riêng.

### 3.9. orders

```ts
type Order = {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  customerNote?: string;
  adminNotes?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  usedPoints: number;
  earnedPoints: number;
  paymentMethod: "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING_PAYMENT" | "PAID" | "PACKING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  expiresAt: Date;
  paidAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  shippingUnit?: string;
  trackingCode?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Rule:

- Không có field `source`.
- `customerId` bắt buộc vì v1 không cho mua hàng khi chưa đăng nhập.
- `customerPhone` bắt buộc trong order dù customer profile phone optional.
- Order giữ snapshot thông tin khách và sản phẩm, không phụ thuộc product còn tồn tại hay không.

### 3.10. orderItems

Đây là phần quan trọng để product có thể xóa/sửa mà order cũ không lỗi.

```ts
type OrderItem = {
  id: string;
  orderId: string;
  productId?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productSnapshot: {
    productId: string;
    code: string;
    slug: string;
    name: string;
    imageUrl?: string;
    categoryId?: string;
    categoryName?: string;
    originalPrice?: number;
    salePrice?: number;
    unitPrice: number;
    selectedOptions?: {
      optionType: "COLOR" | "SIZE";
      optionName: string;
      valueCode: string;
      valueLabel: string;
      colorHex?: string;
      priceDiff?: number;
    }[];
  };
  createdAt: Date;
};
```

Rule:

- Khi tạo order, copy cứng thông tin sản phẩm tại thời điểm mua vào `productSnapshot`.
- `productId` chỉ để truy vết/analytics, nên nullable hoặc `onDelete SET NULL`.
- Không join product để render order detail cũ.
- Nếu product bị xóa, order vẫn hiển thị đúng dữ liệu đã mua.

### 3.11. payments

```ts
type Payment = {
  id: string;
  orderId: string;
  provider: "VIETQR" | "SEPAY" | "CASSO" | "MANUAL";
  method: "BANK_TRANSFER";
  bankName: string;
  bankBin: string;
  accountNo: string;
  accountName: string;
  amount: number;
  transferContent: string;
  qrImageUrl?: string;
  transactionRef?: string;
  rawWebhookPayload?: unknown;
  isMatched: boolean;
  status: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

### 3.12. loyaltyTransactions

Nếu v1 chưa làm điểm thưởng thì có thể để giai đoạn sau. Nếu giữ UI điểm thưởng/tích điểm, dùng bảng này.

```ts
type LoyaltyTransaction = {
  id: string;
  customerId: string;
  orderId?: string;
  change: number;
  type: "EARN" | "REDEEM" | "REFUND" | "ADJUST";
  reason: string;
  balanceAfter: number;
  actorUserId?: string;
  createdAt: Date;
};
```

### 3.13. auditLogs

```ts
type AuditLog = {
  id: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  createdAt: Date;
};
```

Audit bắt buộc cho:

- Admin xác nhận thanh toán thủ công.
- Admin đổi trạng thái đơn.
- Admin hủy đơn.
- Admin chỉnh tồn kho.
- Admin chỉnh điểm khách hàng nếu loyalty bật.
- Admin xóa mềm product.

## 4. API contract v1

Base path chuẩn của API v1 là `/api/v1`.

Các endpoint trong tài liệu nếu ghi dạng `/api/...` thì khi triển khai thực tế phải gọi dưới prefix version: `/api/v1/...`.

### 4.1. Response format

Success:

```json
{
  "success": true,
  "message": "Thao tác thành công.",
  "data": {}
}
```

`message` là optional. Với các API query như list/detail có thể không trả `message`; với các API mutation như tạo/sửa/xóa/xác nhận thanh toán nên trả `message` để FE hiển thị toast nếu cần.

Paginated:

```json
{
  "success": true,
  "message": "Lấy danh sách thành công.",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Request không hợp lệ.",
  "internalMessage": "Zod validation failed at body.items[0].quantity",
  "errorCode": "VALIDATION_ERROR"
}
```

`internalMessage` là optional và chỉ được trả khi `NODE_ENV` là `development` hoặc `test`. Production không trả field này để tránh lộ thông tin kỹ thuật, stack trace, query nội bộ hoặc cấu trúc hệ thống.

### 4.2. Customer auth

Client auth hỗ trợ email/password và Google login. Cả hai cách đăng nhập phải map về cùng một bản ghi `customers` nếu cùng email đã xác thực.

#### `POST /api/auth/register`

Request:

```json
{
  "email": "ha@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

Register không yêu cầu `fullName`. Backend tự set tên mặc định để thỏa `customers.fullName` non-null; khách có thể sửa lại trong profile.

Response:

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_01",
      "fullName": "ha",
      "email": "ha@example.com",
      "phone": null
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### `POST /api/auth/login`

Request:

```json
{
  "email": "ha@example.com",
  "password": "123456"
}
```

#### `POST /api/auth/google`

FE đăng nhập Google xong gửi Google ID token lên API. Backend verify token với Google, sau đó tự tìm hoặc tạo customer.

Request:

```json
{
  "idToken": "google-id-token"
}
```

Response giống login email/password:

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_01",
      "fullName": "Nguyễn Thu Hà",
      "email": "ha@example.com",
      "phone": null,
      "avatar": "https://..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Rule:

- Backend không nhận `customerId` từ FE trong Google login.
- Nếu đã có customer theo `googleAccountId = sub`, login vào customer đó.
- Nếu chưa có `googleAccountId` nhưng đã có customer cùng email và Google `email_verified = true`, cập nhật customer đó: `isGoogleLogin = true`, `googleAccountId = sub`, `emailVerified = true`.
- Nếu chưa có customer cùng email, tạo customer mới với `isManualLogin = false`, `isGoogleLogin = true`, `googleAccountId = sub`.
- Nếu Google email chưa verified, không auto link vào customer có sẵn.

#### `POST /api/auth/password/forgot`

Request:

```json
{
  "email": "ha@example.com"
}
```

#### `POST /api/auth/password/otp/verify`

FE gọi endpoint này sau khi user nhập OTP. Chỉ khi API trả success thì FE mới hiện form nhập mật khẩu mới.

Request:

```json
{
  "email": "ha@example.com",
  "otpCode": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Mã xác nhận hợp lệ"
}
```

#### `POST /api/auth/password/reset`

Request:

```json
{
  "email": "ha@example.com",
  "otpCode": "123456",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

Backend vẫn verify lại OTP khi reset để tránh đổi mật khẩu nếu FE bị bypass.

#### Các endpoint khác

- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### 4.3. Admin auth

Admin dùng bảng `users`.

- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`
- `POST /api/admin/auth/logout`

Response `me`:

```json
{
  "success": true,
  "data": {
    "id": "user_01",
    "fullName": "Kiều Như Ý",
    "email": "admin@tiemlennhakieu.vn",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "permissions": ["order:read", "order:update", "product:read"]
  }
}
```

### 4.4. Products public

#### `GET /api/products`

Query:

- `search`
- `categorySlug`
- `optionFilters`
- `highlightType`
- `sort`: `NEWEST`, `PRICE_ASC`, `PRICE_DESC`, `BEST_SELLING`
- `page`
- `limit`

Response item:

```json
{
  "id": "prod_01",
  "code": "SP-LEN-001",
  "name": "Móc khóa len Thỏ Mập Tai Dài",
  "slug": "moc-khoa-len-tho-map-tai-dai",
  "category": {
    "id": "cat_01",
    "name": "Móc khóa len",
    "slug": "moc-khoa-len"
  },
  "thumbnail": {
    "id": "img_01",
    "url": "https://..."
  },
  "originalPrice": 75000,
  "salePrice": 65000,
  "price": 65000,
  "stockQuantity": 24,
  "status": "ACTIVE",
  "highlightType": "HOT_TIKTOK",
  "highlightLabel": "Hot TikTok",
  "options": [
    {
      "id": "opt_color",
      "optionType": "COLOR",
      "name": "Màu sắc",
      "displayOrder": 1,
      "values": [
        { "code": "PINK", "label": "Hồng", "colorHex": "#F9B4C7" },
        { "code": "CREAM", "label": "Kem", "colorHex": "#FEF3C7" }
      ]
    }
  ]
}
```

#### `GET /api/products/:slug`

Response cần có:

- Thông tin product cơ bản.
- `images` từ bảng `productImages`, có `isThumbnail`, `displayOrder`.
- `options`.
- `highlightType`.
- `relatedProducts` nếu có thể làm ngay; nếu chưa thì trả mảng rỗng.

Không trả `ratingAvg`, `ratingCount`.

### 4.5. Categories public

- `GET /api/categories`

Public chỉ trả category `ACTIVE`.

### 4.6. Order client

Cart không có API. Khi checkout, FE gửi items từ localStorage lên `POST /api/orders`. Endpoint này bắt buộc customer đã đăng nhập.

#### `POST /api/orders`

Header bắt buộc:

- `Authorization: Bearer <customerAccessToken>`

Request:

```json
{
  "items": [
    {
      "productId": "prod_01",
      "selectedOptions": [
        { "optionType": "COLOR", "valueCode": "PINK" },
        { "optionType": "SIZE", "valueCode": "M" }
      ],
      "quantity": 2
    }
  ],
  "recipient": {
    "fullName": "Nguyễn Thu Hà",
    "phone": "0987654321",
    "email": "ha@example.com",
    "addressLine": "45 Lê Văn Lương",
    "provinceName": "Hà Nội",
    "districtName": "Thanh Xuân",
    "wardName": "Nhân Chính",
    "note": "Giao trong giờ hành chính"
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "orderId": "ord_01",
    "orderCode": "TLK-99015",
    "orderStatus": "PENDING_PAYMENT",
    "paymentStatus": "PENDING",
    "expiresAt": "2026-07-24T10:30:00.000Z",
    "financial": {
      "subtotal": 210000,
      "shippingFee": 25000,
      "discountAmount": 0,
      "pointsDiscount": 0,
      "totalAmount": 235000
    },
    "payment": {
      "bankName": "MB Bank",
      "bankBin": "970422",
      "accountNo": "0381000123456",
      "accountName": "TIEM LEN NHA KIEU",
      "amount": 235000,
      "transferContent": "TLK-99015",
      "qrImageUrl": "https://..."
    }
  }
}
```

Order service khi tạo đơn phải:

- Verify customer token và lấy `customerId` từ token, không nhận `customerId` từ body.
- Validate product đang bán và selected options hợp lệ với `productOptions`.
- Validate tồn kho.
- Tính tiền từ DB, không tin giá client gửi lên.
- Copy snapshot sản phẩm sang `orderItems`.
- Reserve tồn kho ngay.
- Tạo payment QR.
- Emit `order:created`.

#### `GET /api/orders/:id/payment`

Dùng cho trang QR.

### 4.8. Customer profile

- `GET /api/customers/me`
- `PATCH /api/customers/me`
- `PATCH /api/customers/me/password`
- `GET /api/customers/me/orders`
- `GET /api/customers/me/orders/:id`
- `GET /api/customers/me/addresses`
- `POST /api/customers/me/addresses`
- `PATCH /api/customers/me/addresses/:id`
- `DELETE /api/customers/me/addresses/:id`
- `PATCH /api/customers/me/addresses/:id/default`

`PATCH /api/customers/me` cho phép `phone` null/empty.

### 4.9. Payment

- `POST /api/payments/webhook/sepay`
- `POST /api/payments/webhook/casso`

V1 có thể chỉ implement 1 provider trước, route còn lại để sau.

Webhook rule:

- Verify signature nếu provider hỗ trợ.
- Idempotent theo `transactionRef`/`referenceCode`.
- Match `transferContent` với `orderCode`.
- Match amount chính xác với `totalAmount`.
- Nếu match: order `PAID`, payment `PAID`.
- Nếu không match: payment `MISMATCHED`, order chưa đổi trạng thái.

### 4.10. Admin products

- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PATCH /api/admin/products/:id`
- `PATCH /api/admin/products/:id/status`
- `PATCH /api/admin/products/:id/stock`
- `DELETE /api/admin/products/:id`

`DELETE` là xóa mềm:

- Set `deletedAt`.
- Public API không trả product nữa.
- Order cũ không lỗi vì đã có snapshot ở `orderItems`.

Create/update product request cần hỗ trợ:

- Basic product info.
- `categoryId`.
- `images`: danh sách URL, alt, displayOrder, isThumbnail.
- `options`: tối đa 2 bản ghi option gồm màu sắc/kích thước, mỗi bản ghi có `values` jsonb.
- `highlightType`.
- SEO.

### 4.11. Admin product options

- `GET /api/admin/products/:id/options`
- `PUT /api/admin/products/:id/options`

`PUT /api/admin/products/:id/options` nhận toàn bộ option mới của sản phẩm và replace danh sách cũ trong transaction.

Request:

```json
{
  "options": [
    {
      "optionType": "COLOR",
      "name": "Màu sắc",
      "displayOrder": 1,
      "values": [
        { "code": "PINK", "label": "Hồng", "colorHex": "#F9B4C7", "isDefault": true },
        { "code": "CREAM", "label": "Kem", "colorHex": "#FEF3C7" }
      ]
    },
    {
      "optionType": "SIZE",
      "name": "Kích thước",
      "displayOrder": 2,
      "values": [
        { "code": "S", "label": "Size S" },
        { "code": "M", "label": "Size M", "priceDiff": 10000 }
      ]
    }
  ]
}
```

Rule:

- Product có thể có 0 option.
- Product có thể có 1 option.
- Product có thể có 2 option.
- Product không được có quá 2 option trong v1.
- `optionType` hiện chỉ nhận `COLOR` hoặc `SIZE`.
- Không cần API quản lý filter global trong v1.

### 4.12. Admin categories

- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/:id`
- `PATCH /api/admin/categories/:id/status`
- `DELETE /api/admin/categories/:id`
- `PATCH /api/admin/categories/reorder`

Nếu category có product:

- Không hard delete.
- Chỉ cho `HIDDEN` hoặc soft delete nếu đã quyết định toàn bộ product trong category xử lý thế nào.

### 4.13. Admin orders

- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`
- `POST /api/admin/orders/:id/confirm-payment`
- `POST /api/admin/orders/:id/cancel`
- `PATCH /api/admin/orders/:id/admin-notes`

Admin order detail phải đọc từ `orders` + `orderItems` snapshot, không phụ thuộc product hiện tại.

### 4.14. Admin customers

- `GET /api/admin/customers`
- `GET /api/admin/customers/:id`
- `PATCH /api/admin/customers/:id/status`
- `GET /api/admin/customers/:id/orders`
- `GET /api/admin/customers/:id/points`
- `POST /api/admin/customers/:id/points/adjust` nếu loyalty bật trong v1
- `GET /api/admin/customers/:id/notes`
- `POST /api/admin/customers/:id/notes`

### 4.15. Admin users/staff

- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/roles`
- `GET /api/admin/permissions/matrix`

Tên route dùng `users` vì bảng user chỉ dành cho admin. FE có thể vẫn gọi màn hình là staff.

### 4.16. Dashboard

- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/revenue`
- `GET /api/admin/dashboard/recent-orders`
- `GET /api/admin/dashboard/top-products`
- `GET /api/admin/dashboard/low-stock`

### 4.17. Upload

- `POST /api/uploads/images`

Dùng cho product/category/avatar/blog về sau.

## 5. Luồng nghiệp vụ v1

### 5.1. Tạo đơn

1. FE đọc cart từ localStorage.
2. FE gửi productId/selectedOptions/quantity lên `POST /api/orders`.
3. API lấy product và productOptions từ DB.
4. API tính giá bằng DB.
5. API validate stock.
6. API tạo order `PENDING_PAYMENT`.
7. API tạo order items snapshot.
8. API reserve tồn kho.
9. API tạo payment QR.
10. API emit `order:created`.

### 5.2. Xóa/sửa product sau khi đã có order

Vấn đề: nếu order chỉ join product hiện tại thì product bị xóa/sửa sẽ làm order cũ sai hoặc lỗi.

Cách xử lý v1:

- Product dùng soft delete.
- `orderItems` lưu snapshot đầy đủ:
  - Tên sản phẩm.
  - Tên biến thể.
  - Ảnh tại thời điểm mua.
  - Giá tại thời điểm mua.
  - Danh mục/filter cần hiển thị.
- `orderItems.productId` nullable và chỉ dùng truy vết.
- Order detail không join product để lấy dữ liệu hiển thị.

Kết quả:

- Xóa product không làm order cũ lỗi.
- Sửa tên/giá/ảnh product không làm order cũ thay đổi.
- Báo cáo vẫn có thể thống kê theo `productId` nếu product chưa bị hard delete; nếu product bị null thì vẫn có snapshot name/code.

### 5.3. Thanh toán

1. Khách chuyển khoản theo QR.
2. Webhook provider gọi API.
3. API verify và match order.
4. Nếu đúng tiền/nội dung: update payment/order sang paid.
5. Emit `order:paid`.
6. Admin hoặc client QR nhận real-time update.

### 5.4. Hết hạn thanh toán

1. Job quét order `PENDING_PAYMENT` quá `expiresAt`.
2. Update order `CANCELLED`.
3. Release tồn kho đã reserve.
4. Emit `order:expired`.

Vì v1 chưa có settings table, `orderHoldMinutes` lấy từ env/config.

## 6. Socket.IO v1

Client emit:

- `order:join` với `{ orderId }`
- `order:leave` với `{ orderId }`
- `admin:join` với `{ rooms: ["admin:orders", "admin:dashboard"] }`

Server emit:

- `order:created`
- `order:paid`
- `order:expired`
- `order:statusChanged`
- `stock:updated`
- `dashboard:summaryUpdated`

Payload `order:statusChanged`:

```json
{
  "orderId": "ord_01",
  "orderCode": "TLK-99015",
  "oldStatus": "PAID",
  "newStatus": "PACKING",
  "changedAt": "2026-07-24T10:30:00.000Z"
}
```

## 7. Error codes v1

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `EMAIL_ALREADY_EXISTS`
- `INVALID_CREDENTIALS`
- `CUSTOMER_LOCKED`
- `USER_LOCKED`
- `OUT_OF_STOCK`
- `PRODUCT_NOT_AVAILABLE`
- `ORDER_NOT_FOUND`
- `ORDER_EXPIRED`
- `ORDER_ALREADY_PAID`
- `ORDER_STATUS_INVALID`
- `PAYMENT_AMOUNT_MISMATCHED`
- `WEBHOOK_SIGNATURE_INVALID`
- `UPLOAD_FAILED`

Không cần promotion error code trong v1.

## 8. Route cần có trong v1

### Public/client

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/otp/verify`
- `POST /api/auth/password/reset`
- `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/orders`
- `GET /api/orders/:id/payment`
- `GET /api/customers/me`
- `PATCH /api/customers/me`
- `PATCH /api/customers/me/password`
- `GET /api/customers/me/orders`
- `GET /api/customers/me/orders/:id`
- `GET /api/customers/me/addresses`
- `POST /api/customers/me/addresses`
- `PATCH /api/customers/me/addresses/:id`
- `DELETE /api/customers/me/addresses/:id`

### Payment

- `POST /api/payments/webhook/sepay`

### Admin

- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`
- `POST /api/admin/auth/logout`
- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/revenue`
- `GET /api/admin/dashboard/recent-orders`
- `GET /api/admin/dashboard/top-products`
- `GET /api/admin/dashboard/low-stock`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`
- `POST /api/admin/orders/:id/confirm-payment`
- `POST /api/admin/orders/:id/cancel`
- `PATCH /api/admin/orders/:id/admin-notes`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PATCH /api/admin/products/:id`
- `PATCH /api/admin/products/:id/status`
- `PATCH /api/admin/products/:id/stock`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/products/:id/options`
- `PUT /api/admin/products/:id/options`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/:id`
- `PATCH /api/admin/categories/:id/status`
- `DELETE /api/admin/categories/:id`
- `PATCH /api/admin/categories/reorder`
- `GET /api/admin/customers`
- `GET /api/admin/customers/:id`
- `PATCH /api/admin/customers/:id/status`
- `GET /api/admin/customers/:id/orders`
- `GET /api/admin/customers/:id/points`
- `POST /api/admin/customers/:id/points/adjust`
- `GET /api/admin/customers/:id/notes`
- `POST /api/admin/customers/:id/notes`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/roles`
- `GET /api/admin/permissions/matrix`
- `POST /api/uploads/images`

## 9. Route không làm trong v1

- `/api/home`
- `/api/banners`
- `/api/cart/**`
- `/api/promotions/**`
- `/api/admin/promotions/**`
- `/api/admin/settings/**`
- `/api/settings/public`
- Blog CMS nếu chưa triển khai ngay.
- Product rating/review sao.

## 10. Ưu tiên triển khai

1. Chuẩn hóa enum/status/constants theo v2.
2. Tạo DB schema/migrations cho customer, user, category, product, productImage, productOption, order, orderItem, payment, audit.
3. Auth customer bằng email và admin auth bằng users.
4. Public product/category API, trong product detail trả kèm product options.
5. Admin product/category/product option API.
6. Order create + snapshot + reserve stock + QR.
7. Payment webhook + manual confirm.
8. Customer order detail + QR page API + socket.
9. Admin orders.
10. Dashboard cơ bản.
11. Customer profile/orders/address.

### Client categories public update

`GET /api/v1/categories`

Public endpoint, khong can auth.

Dung cho:

- Trang chu: hien thi danh muc co anh.
- Trang san pham: hien thi bo loc loai san pham.

Khong phan trang. Chi tra category `ACTIVE`.

Sort:

1. `displayOrder` tang dan.
2. `name` tang dan.

Response `data[]`:

```ts
type PublicCategory = {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
};
```

Khong tra `status`, `createdAt`, `updatedAt`.

### Client product list API update

`GET /api/v1/products`

Public endpoint, khong can auth.

Query params:

- `page`: number, default `1`, min `1`.
- `limit`: number, default `12`, min `1`, max `60`.
- `sort`: `NEWEST` | `PRICE_ASC` | `PRICE_DESC` | `BEST_SELLING`, default `NEWEST`.
- `categoryIds`: danh sach UUID category, ho tro dang comma `id1,id2` hoac repeated query `categoryIds=id1&categoryIds=id2`.
- `search`: tim theo `name`, `code`, `shortDescription`.
- `colorCodes`: danh sach code mau, ho tro dang comma `RED,GREEN` hoac repeated query `colorCodes=RED&colorCodes=GREEN`.
- `highlightType`: `HOT_PRODUCT` | `TODAY_DEAL` | `HOT_TIKTOK`.
- `minPrice`: number, filter theo gia hien thi `salePrice ?? originalPrice`.
- `maxPrice`: number, filter theo gia hien thi `salePrice ?? originalPrice`.

Rules:

- Chi tra product `ACTIVE` va `deletedAt = null`.
- Loc danh muc chi dung `categoryIds`; neu loc 1 danh muc van truyen 1 id trong `categoryIds`.
- Loc mau dung `colorCodes` theo `productOptions.optionType = COLOR` va `values[].code`; khong loc theo label hien thi.
- Khong tra field SEO/detail HTML trong list.
- Thumbnail lay tu `productImages.isThumbnail = true`.

Response:

```ts
type ProductListResponse = {
  items: Array<{
    id: string;
    code: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    thumbnail: {
      id: string;
      url: string;
      altText?: string | null;
    } | null;
    originalPrice: number;
    salePrice?: number | null;
    price: number;
    stockQuantity: number;
    soldCount: number;
    highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK" | null;
    highlightLabel?: string | null;
  }>;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
```

### Client product detail API update

`GET /api/v1/products/:slug`

Public endpoint, khong can auth.

Rules:

- Lay product theo `slug`.
- Chi tra product `ACTIVE` va `deletedAt = null`.
- Neu khong tim thay tra 404 `PRODUCT_NOT_FOUND`.
- Detail duoc phep tra `descriptionHtml`, `careInstructionHtml`, tat ca anh va product options de FE render man chi tiet.

Response `data`:

```ts
type ProductDetailResponse = {
  id: string;
  code: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    altText?: string | null;
    displayOrder: number;
    isThumbnail: boolean;
  }>;
  options: Array<{
    id: string;
    optionType: "COLOR" | "SIZE";
    name: string;
    displayOrder: number;
    values: unknown;
  }>;
  originalPrice: number;
  salePrice?: number | null;
  price: number;
  stockQuantity: number;
  soldCount: number;
  highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK" | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};
```

### Client cart products API

`POST /api/v1/cart/products`

Public endpoint, khong can auth. Dung cho trang gio hang khi cart dang luu localStorage; FE gui danh sach product id trong cart, API tra product hien tai de FE map lai gia, ton kho va option.

Request:

```ts
type CartProductListRequest = {
  ids: string[];
};
```

Rules:

- Chi nhan danh sach `ids`, khong nhan gia/ten/anh tu FE.
- Response giu dung thu tu `ids` FE gui len.
- Neu id khong ton tai, van tra 1 item voi `isAvailable = false` va `unavailableReason = "PRODUCT_NOT_FOUND"` de FE xu ly.
- API nay chi refresh du lieu cart, khong giu hang va khong thay the validate khi checkout/order.

Response `data`:

```ts
type CartProductListResponse = {
  items: Array<{
    id: string;
    code: string | null;
    name: string | null;
    slug: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
    image: string | null;
    imageAlt: string | null;
    originalPrice: number | null;
    salePrice: number | null;
    price: number;
    stockQuantity: number;
    isAvailable: boolean;
    unavailableReason:
      | "PRODUCT_NOT_FOUND"
      | "PRODUCT_UNAVAILABLE"
      | "OUT_OF_STOCK"
      | null;
    options: Array<{
      id: string;
      optionType: "COLOR" | "SIZE";
      name: string;
      displayOrder: number;
      values: unknown;
    }>;
  }>;
};
```

### Client create order API

`POST /api/v1/orders`

Protected endpoint, bat buoc customer da dang nhap. FE gui danh sach san pham trong cart localStorage va thong tin giao hang; API tu validate lai product, option, ton kho va tu tinh gia theo DB.

Request:

```ts
type CreateOrderRequest = {
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptions?: Array<{
      optionType: "COLOR" | "SIZE";
      code: string;
    }>;
  }>;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  customerNote?: string;
  shippingFee?: number;
};
```

Rules:

- Khong nhan `customerId` tu body, lay tu access token.
- Khong tin gia/ten/anh/ton kho tu FE.
- Product phai ton tai, `ACTIVE`, `deletedAt = null`.
- Tong so luong theo tung product phai nho hon hoac bang `stockQuantity`.
- Neu product co option `COLOR` hoac `SIZE`, FE phai gui option code tuong ung.
- Option code phai con ton tai trong `productOptions.values[].code`.
- Khi tao order thanh cong, API tru ton kho trong transaction.
- `orderItems.productSnapshot` luu json gom thong tin product, gia va selected options tai thoi diem dat hang.
- Tao payment `PENDING` voi noi dung chuyen khoan bang `orderCode`.
- FE co the dung payment info tra ve de hien thi thong tin chuyen khoan hoac goi API QR rieng sau.

Response `data`:

```ts
type CreateOrderResponse = {
  id: string;
  orderCode: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentMethod: "BANK_TRANSFER";
  paymentStatus: "PENDING";
  orderStatus: "PENDING_PAYMENT";
  expiresAt: string;
  items: Array<{
    id: string;
    productId?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productSnapshot: unknown;
  }>;
  payments: Array<{
    id: string;
    provider: "VIETQR" | "SEPAY" | "CASSO" | "MANUAL";
    method: "BANK_TRANSFER";
    bankName: string;
    bankBin: string;
    accountNo: string;
    accountName: string;
    amount: number;
    transferContent: string;
    status: "PENDING";
  }>;
};
```

Error codes:

- `PRODUCT_NOT_FOUND`
- `PRODUCT_UNAVAILABLE`
- `PRODUCT_OUT_OF_STOCK`
- `PRODUCT_OPTION_REQUIRED`
- `PRODUCT_OPTION_INVALID`

### Client list orders API

`GET /api/v1/orders`

Protected endpoint, lay tat ca don hang cua customer dang dang nhap. Khong phan trang trong v1.

Query:

```ts
type ListOrdersQuery = {
  status?:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PACKING"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED";
};
```

Response `data`:

```ts
type ListOrdersResponse = Array<{
  id: string;
  orderCode: string;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PACKING"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED";
  expiresAt: string;
  createdAt: string;
  items: Array<{
    id: string;
    productId?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productSnapshot: unknown;
  }>;
}>;
```

### Client order detail API

`GET /api/v1/orders/:id`

Protected endpoint, lay chi tiet don hang cua customer dang dang nhap. API chi tra don thuoc customer hien tai.

Response `data`:

```ts
type OrderDetailResponse = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  shippingProvince?: string | null;
  shippingDistrict?: string | null;
  shippingWard?: string | null;
  customerNote?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentMethod: "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PACKING"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED";
  expiresAt: string;
  paidAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  shippingUnit?: string | null;
  trackingCode?: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productSnapshot: unknown;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    provider: "VIETQR" | "SEPAY" | "CASSO" | "MANUAL";
    method: "BANK_TRANSFER";
    bankName: string;
    bankBin: string;
    accountNo: string;
    accountName: string;
    amount: number;
    transferContent: string;
    qrImageUrl?: string | null;
    transactionRef?: string | null;
    isMatched: boolean;
    status: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};
```

### Client payment QR API

`GET /api/v1/payments/:orderId/qr`

Lay thong tin QR chuyen khoan cho don hang. API dung env ngan hang va tao QR theo `vietqr.app`.

Response `data`:

```ts
type PaymentQrResponse = {
  orderId: string;
  orderCode: string;
  amount: number;
  transferContent: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  qrImageUrl: string;
  paymentStatus: "PENDING" | "PAID" | "MISMATCHED" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PACKING"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED";
};
```

### SePay payment webhook

`POST /api/v1/payments/sepay/webhook`

Public endpoint cho SePay goi khi co giao dich tien vao. Endpoint nay tra response rieng theo yeu cau SePay, khong dung wrapper `sendSuccess`.

Required headers khi `SEPAY_WEBHOOK_AUTH_TYPE=HMAC`:

```txt
x-sepay-signature: sha256=<hex>
x-sepay-timestamp: <unix_seconds>
```

Signature rule:

```txt
sha256=<HMAC_SHA256(SEPAY_WEBHOOK_SECRET, timestamp + "." + raw_body)>
```

Webhook rules:

- API bat buoc verify HMAC bang raw body truoc khi xu ly payload.
- API lay ma don tu `payload.code`, neu khong co thi tim trong `payload.content`/`payload.description` theo prefix `SITE_INFO.bankTransferNotePrefix`.
- Neu khong tim thay ma don hoac khong tim thay payment pending, van tra `{ success: true }` de SePay khong retry vo ich.
- Neu so tien nhan duoc nho hon payment amount, update payment `MISMATCHED`, khong update order paid.
- Neu so tien hop le, update payment `PAID`, `isMatched=true`, luu `transactionRef`, `rawWebhookPayload`, va update order sang `paymentStatus=PAID`, `orderStatus=PAID`.

Success response:

```json
{ "success": true }
```
