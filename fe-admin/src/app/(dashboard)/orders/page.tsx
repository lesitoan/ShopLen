import { OrdersListScreen } from "@/screens/orders/list";

export const metadata = {
  title: "Quản lý Đơn hàng | Tiệm Len Nhà Kiều",
  description: "Danh sách đơn hàng và xử lý đơn hàng",
};

export default function OrdersPage() {
  return <OrdersListScreen />;
}
