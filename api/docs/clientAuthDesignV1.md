# Client Auth API Design V1

Tài liệu này thiết kế API auth cho khách hàng website client trước khi code backend. Phạm vi chỉ là customer auth của storefront, không áp dụng cho admin.

Base path API: `/api/v1`.

## 1. Phạm vi

V1 hỗ trợ:

- Đăng ký bằng email/password, không bắt buộc nhập họ tên.
- Đăng nhập bằng email/password.
- Đăng nhập bằng Google bằng Google ID token.
- Hai cách đăng nhập cùng email verified phải về cùng một bản ghi `customers`.
- Lấy thông tin customer hiện tại.
- Refresh token.
- Logout.
- Quên mật khẩu, verify OTP, sau đó đặt lại mật khẩu.
- Cập nhật profile customer.
- Đổi hoặc tạo mật khẩu cho customer.

V1 không hỗ trợ:

- `rememberMe` ở backend.
- Guest checkout.
- Login bằng phone/password.
- API cart.
- Nhiều social provider ngoài Google.
- Bảng social auth provider riêng.

## 2. Nguyên tắc dữ liệu

Customer auth dùng bảng `customers`.

Các field auth chính:

```ts
type Customer = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  passwordHash?: string | null;
  emailVerified: boolean;
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  googleAccountId?: string | null;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  birthday?: Date | null;
  avatar?: string | null;
  status: "ACTIVE" | "LOCKED";
  rewardPoints: number;
  totalSpent: number;
  totalOrders: number;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
```

Rule:

- `email` unique và là định danh đăng nhập chính.
- `passwordHash` nullable vì customer có thể chỉ login bằng Google.
- `isManualLogin = true` khi customer có mật khẩu và được phép login email/password.
- `isGoogleLogin = true` khi customer đã từng login/link bằng Google.
- `googleAccountId` lưu Google `sub`, unique nullable.
- Không trả `passwordHash` hoặc `googleAccountId` ra API response.
- Customer bị `LOCKED` không được login, refresh token, checkout hoặc gọi route protected.

## 3. Response format

Success:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {}
}
```

`message` là optional nhưng nên có ở auth endpoints để FE hiển thị toast.

Error:

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng",
  "errorCode": "INVALID_CREDENTIALS",
  "internalMessage": "Password compare failed for customer id ..."
}
```

Rule:

- Không có field `details`.
- `internalMessage` chỉ trả ở `development` hoặc `test`.
- Production chỉ trả `success`, `message`, `errorCode`.

## 4. Session response

Auth endpoints trả cùng cấu trúc:

```ts
type CustomerSession = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  birthday?: string | null;
  avatar?: string | null;
  status: "ACTIVE" | "LOCKED";
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  rewardPoints: number;
  totalSpent: number;
  totalOrders: number;
};

type AuthData = {
  customer: CustomerSession;
  accessToken: string;
  refreshToken: string;
};
```

JWT access token nên có claim:

```ts
type CustomerAccessTokenPayload = {
  sub: string;
  tokenType: "CUSTOMER";
  email: string;
};
```

Không nhận `customerId` từ body ở bất kỳ protected client endpoint nào. Backend lấy customer từ access token.

## 5. Endpoints

### 5.1. Register

`POST /api/v1/auth/register`

Request:

```json
{
  "email": "ha@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

Validation:

- `email` required, lowercase, đúng format, unique.
- `password` required, tối thiểu 6 ký tự.
- `confirmPassword` phải trùng `password`.

Behavior:

- Tạo customer mới.
- `fullName` không nhận từ request. Backend tự set mặc định để thỏa DB non-null, ưu tiên phần trước `@` của email, fallback `"Khách hàng"`.
- Hash password.
- Set `isManualLogin = true`.
- Set `isGoogleLogin = false`.
- Set `emailVerified = false` nếu chưa làm verify email thủ công trong V1.
- Tạo access token và refresh token.
- Update `lastLoginAt`.

Response:

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "customer": {
      "id": "customer-id",
      "code": "CUS000001",
      "fullName": "ha",
      "email": "ha@example.com",
      "emailVerified": false,
      "phone": null,
      "gender": null,
      "birthday": null,
      "avatar": null,
      "status": "ACTIVE",
      "isManualLogin": true,
      "isGoogleLogin": false,
      "rewardPoints": 0,
      "totalSpent": 0,
      "totalOrders": 0
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 5.2. Login email/password

`POST /api/v1/auth/login`

Request:

```json
{
  "email": "ha@example.com",
  "password": "123456"
}
```

Backend không nhận và không xử lý `rememberMe`.

Validation:

- `email` required, lowercase, đúng format.
- `password` required.

Behavior:

- Tìm customer theo email.
- Customer phải có `isManualLogin = true` và `passwordHash` tồn tại.
- So sánh password.
- Customer `status` phải là `ACTIVE`.
- Tạo access token và refresh token.
- Update `lastLoginAt`.

Lỗi thường gặp:

- Sai email/password: `INVALID_CREDENTIALS`.
- Tài khoản chỉ có Google login và chưa đặt mật khẩu: `PASSWORD_LOGIN_NOT_ENABLED`.
- Customer bị khóa: `CUSTOMER_LOCKED`.

Response giống register.

### 5.3. Login Google

`POST /api/v1/auth/google`

Request:

```json
{
  "idToken": "google-id-token"
}
```

Validation:

- `idToken` required.
- Backend verify token với Google bằng `GOOGLE_CLIENT_ID`.
- Token audience phải khớp Google client ID của dự án.

Behavior:

1. Verify Google ID token.
2. Lấy `sub`, `email`, `email_verified`, `name`, `picture`.
3. Nếu có customer theo `googleAccountId = sub`, login vào customer đó.
4. Nếu chưa có `googleAccountId` nhưng có customer cùng email và `email_verified = true`, link Google vào customer đó.
5. Nếu chưa có customer cùng email, tạo customer mới.
6. Nếu Google email chưa verified, không auto link vào customer có sẵn.
7. Customer `status` phải là `ACTIVE`.
8. Tạo access token và refresh token.
9. Update `lastLoginAt`.

Khi link Google vào customer có sẵn:

- Set `isGoogleLogin = true`.
- Set `googleAccountId = sub`.
- Set `emailVerified = true`.
- Có thể cập nhật `avatar` nếu đang null.

Khi tạo customer mới bằng Google:

- Set `passwordHash = null`.
- Set `isManualLogin = false`.
- Set `isGoogleLogin = true`.
- Set `googleAccountId = sub`.
- Set `emailVerified = true`.
- `fullName` lấy từ Google `name`, fallback bằng phần trước `@` của email.
- `avatar` lấy từ Google `picture` nếu có.

Response giống register.

### 5.4. Get me

`GET /api/v1/auth/me`

Header:

```http
Authorization: Bearer <customerAccessToken>
```

Behavior:

- Verify access token.
- `tokenType` phải là `CUSTOMER`.
- Customer phải tồn tại và `ACTIVE`.
- Trả `CustomerSession`.

Response:

```json
{
  "success": true,
  "data": {
    "id": "customer-id",
    "code": "CUS000001",
    "fullName": "Nguyễn Thu Hà",
    "email": "ha@example.com",
    "emailVerified": true,
    "phone": null,
    "gender": null,
    "birthday": null,
    "avatar": "https://...",
    "status": "ACTIVE",
    "isManualLogin": true,
    "isGoogleLogin": true,
    "rewardPoints": 0,
    "totalSpent": 0,
    "totalOrders": 0
  }
}
```

### 5.5. Refresh token

`POST /api/v1/auth/refresh`

Request:

```json
{
  "refreshToken": "..."
}
```

Behavior:

- Verify refresh token.
- Token phải thuộc customer.
- Customer phải `ACTIVE`.
- Trả access token mới.
- Có thể rotate refresh token nếu backend triển khai token store.

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 5.6. Logout

`POST /api/v1/auth/logout`

Request:

```json
{
  "refreshToken": "..."
}
```

V1 nếu chưa có token store/blacklist thì endpoint có thể chỉ trả success để FE clear local session.

Response:

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### 5.7. Forgot password

`POST /api/v1/auth/password/forgot`

Request:

```json
{
  "email": "ha@example.com"
}
```

Behavior:

- Luôn trả message trung tính để không lộ email có tồn tại hay không.
- Nếu customer tồn tại và có thể login manual, gửi OTP/reset token qua email.
- OTP reset password luu trong Redis voi TTL 10 phut, key theo email; khong luu PostgreSQL.
- Nếu customer chỉ có Google login, có thể vẫn gửi flow tạo mật khẩu nếu muốn cho phép đặt mật khẩu.

Response:

```json
{
  "success": true,
  "message": "Nếu email hợp lệ, mã xác nhận sẽ được gửi đến hộp thư của bạn"
}
```

### 5.8. Verify password OTP

`POST /api/v1/auth/password/otp/verify`

Request:

```json
{
  "email": "ha@example.com",
  "otpCode": "123456"
}
```

Behavior:

- Verify OTP/reset token.
- Doc OTP tu Redis, tang attempts khi nhap sai va giu nguyen TTL con lai.
- OTP đúng thì trả success để FE chuyển sang form nhập mật khẩu mới.
- Không đổi mật khẩu ở endpoint này.
- Không auto login.
- Có thể trả `resetToken` ngắn hạn nếu backend không muốn FE gửi lại OTP ở bước reset.

Response đơn giản nếu reset vẫn dùng lại `otpCode`:

```json
{
  "success": true,
  "message": "Mã xác nhận hợp lệ"
}
```

Response nếu dùng reset token ngắn hạn:

```json
{
  "success": true,
  "message": "Mã xác nhận hợp lệ",
  "data": {
    "resetToken": "short-lived-reset-token"
  }
}
```

V1 ưu tiên cách đơn giản: FE verify OTP xong vẫn gửi lại `email + otpCode + newPassword + confirmPassword` ở bước reset. Backend verify OTP lại khi reset để tránh đổi mật khẩu nếu FE bị bypass.

### 5.9. Reset password

`POST /api/v1/auth/password/reset`

Request:

```json
{
  "email": "ha@example.com",
  "otpCode": "123456",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

Behavior:

- Verify lại OTP/reset token.
- Hash password mới.
- Set `isManualLogin = true`.
- Set `passwordHash`.
- Xoa Redis key OTP sau khi reset thanh cong.
- Không auto login trong V1.

Response:

```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công"
}
```

### 5.10. Get customer profile

`GET /api/v1/customers/me`

Protected customer route.

Response giống `GET /api/v1/auth/me`.

### 5.11. Update customer profile

`PATCH /api/v1/customers/me`

Request:

```json
{
  "fullName": "Nguyễn Thu Hà",
  "phone": null,
  "gender": "FEMALE",
  "birthday": "2000-01-01"
}
```

Rule:

- `phone` optional và có thể set null/empty.
- Avatar khong cap nhat qua endpoint nay; dung endpoint upload avatar rieng.
- Không cho đổi email qua endpoint này trong V1.
- Không cho client cập nhật `rewardPoints`, `totalSpent`, `totalOrders`, `status`, `isManualLogin`, `isGoogleLogin`, `googleAccountId`.

### 5.12. Update customer avatar

`PATCH /api/v1/customers/me/avatar`

Protected customer route.

Request:

- Content-Type: `multipart/form-data`
- Field file: `avatar`
- Allowed mime types: `image/jpeg`, `image/png`, `image/webp`
- Max size: 2MB

Behavior:

- Upload avatar len Cloudinary trong folder `${CLOUDINARY_UPLOAD_FOLDER}/avatars`.
- Cap nhat `customers.avatar` bang Cloudinary secure URL.
- Response chi tra `success` va `message`; FE goi lai `/customers/me` hoac invalidate cache neu can profile moi.

### 5.13. Change or create password

`PATCH /api/v1/customers/me/password`

Request khi customer đã có manual login:

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

Request khi customer chỉ login Google và muốn tạo mật khẩu:

```json
{
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

Behavior:

- Nếu `isManualLogin = true`, bắt buộc verify `currentPassword`.
- Nếu `isManualLogin = false` và `isGoogleLogin = true`, cho phép tạo mật khẩu không cần `currentPassword`.
- Sau khi thành công, set `isManualLogin = true` và update `passwordHash`.

## 6. Auth middleware

Client protected middleware:

- Đọc `Authorization: Bearer <token>`.
- Verify JWT.
- Check `tokenType = CUSTOMER`.
- Check customer tồn tại.
- Check customer `status = ACTIVE`.
- Gắn `req.customer` hoặc `req.auth.customerId`.

Không dùng middleware admin cho route client.

## 7. Checkout dependency

Checkout V1 phụ thuộc auth:

- `POST /api/v1/orders` bắt buộc customer token.
- Backend lấy `customerId` từ token.
- Body order không có `customerId`.
- Phone người nhận trong order vẫn bắt buộc dù `customers.phone` optional.
- Cart items lấy từ localStorage FE và gửi lên khi checkout.

## 8. Env API

API cần:

```env
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

Không cần Google client secret cho flow FE gửi Google ID token lên API.

## 9. Error codes

| errorCode | HTTP | Khi nào |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | Body không hợp lệ |
| `EMAIL_ALREADY_EXISTS` | 409 | Register email đã tồn tại |
| `INVALID_CREDENTIALS` | 401 | Sai email/password |
| `PASSWORD_LOGIN_NOT_ENABLED` | 400 | Tài khoản chỉ có Google login, chưa có mật khẩu |
| `GOOGLE_TOKEN_INVALID` | 401 | Google ID token sai/hết hạn/sai audience |
| `GOOGLE_EMAIL_NOT_VERIFIED` | 400 | Google email chưa verified trong case cần link |
| `OTP_INVALID` | 400 | OTP không đúng |
| `OTP_EXPIRED` | 400 | OTP hết hạn |
| `UNAUTHORIZED` | 401 | Thiếu/sai access token |
| `TOKEN_EXPIRED` | 401 | Access token hết hạn |
| `REFRESH_TOKEN_INVALID` | 401 | Refresh token sai/hết hạn |
| `CUSTOMER_LOCKED` | 403 | Customer bị khóa |
| `INTERNAL_SERVER_ERROR` | 500 | Lỗi ngoài dự kiến |

## 10. Checklist code backend

1. Tạo `dto/client/authDto.ts`.
2. Tạo `types/clientAuth.type.ts` nếu cần type nội bộ cho token/session.
3. Tạo `services/client/authService.ts`.
4. Tạo `controllers/client/authController.ts`.
5. Tạo `routes/client/authRoutes.ts`.
6. Tạo middleware verify customer JWT.
7. Tạo helper hash/compare password.
8. Tạo helper sign/verify access token và refresh token.
9. Tạo helper verify Google ID token.
10. Tạo helper tạo, lưu, verify và invalidate OTP reset password.
11. Mount route dưới `/api/v1/auth`.
12. Bảo vệ `/api/v1/customers/me` và `/api/v1/orders` bằng customer auth middleware.
