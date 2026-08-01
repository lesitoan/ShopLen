import { Metadata } from "next";
import AuthScreen from "@/screens/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Tiệm Len Nhà Kiều",
  description: "Tạo tài khoản mới tại Tiệm Len Nhà Kiều để nhận nhiều ưu đãi và ưu tiên đặt móc khóa len thủ công theo yêu cầu.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen initialMode="REGISTER" />
    </Suspense>
  );
}
