import { Metadata } from "next";
import AuthScreen from "@/screens/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Khôi phục mật khẩu | Tiệm Len Nhà Kiều",
  description: "Khôi phục mật khẩu tài khoản Tiệm Len Nhà Kiều nhanh chóng qua mã xác nhận OTP 6 số gửi về email.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen initialMode="FORGOT_PASSWORD" />
    </Suspense>
  );
}
