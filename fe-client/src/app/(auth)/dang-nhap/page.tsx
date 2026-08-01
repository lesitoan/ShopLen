import { Metadata } from "next";
import AuthScreen from "@/screens/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập | Tiệm Len Nhà Kiều",
  description: "Đăng nhập tài khoản Tiệm Len Nhà Kiều để xem lịch sử đơn hàng, tích điểm thưởng và mua sắm dễ dàng.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen initialMode="LANDING" />
    </Suspense>
  );
}
