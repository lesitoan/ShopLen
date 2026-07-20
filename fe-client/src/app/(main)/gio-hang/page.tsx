import { Metadata } from "next";
import CartScreen from "@/screens/cart";

export const metadata: Metadata = {
  title: "Giỏ hàng của bạn | Tiệm Len Nhà Kiều",
  description: "Xem lại danh sách sản phẩm móc khóa len thủ công, nhập mã giảm giá và tiến hành thanh toán đơn hàng tại Tiệm Len Nhà Kiều.",
};

export default function CartPage() {
  return <CartScreen />;
}
