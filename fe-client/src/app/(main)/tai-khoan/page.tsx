import React, { Suspense } from "react";
import type { Metadata } from "next";
import UserProfileScreen from "@/screens/userProfile";
import UserProfileSkeleton from "@/components/skeletons/userProfile/UserProfileSkeleton";

export const metadata: Metadata = {
  title: "Tài khoản cá nhân | Tiệm Len Nhà Kiều",
  description:
    "Quản lý thông tin tài khoản cá nhân, theo dõi lịch sử đơn hàng và cập nhật sổ địa chỉ giao nhận tại Tiệm Len Nhà Kiều.",
};

export default function UserProfilePage() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfileScreen />
    </Suspense>
  );
}
