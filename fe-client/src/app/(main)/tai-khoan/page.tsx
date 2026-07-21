import type { Metadata } from "next";
import UserProfileScreen from "@/screens/userProfile";

export const metadata: Metadata = {
  title: "Tài khoản cá nhân | Tiệm Len Nhà Kiều",
  description: "Quản lý thông tin tài khoản cá nhân, theo dõi lịch sử đơn hàng và cập nhật sổ địa chỉ giao nhận tại Tiệm Len Nhà Kiều.",
};

export default function UserProfilePage() {
  return <UserProfileScreen />;
}
