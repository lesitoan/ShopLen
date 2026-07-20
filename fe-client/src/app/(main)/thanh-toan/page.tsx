import { Metadata } from "next";
import CheckoutScreen from "@/screens/checkout";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng | Tiệm Len Nhà Kiều",
  description: "Nhập thông tin giao hàng và quét mã QR ngân hàng để hoàn tất đặt hàng sản phẩm móc khóa len handmade tại Tiệm Len Nhà Kiều.",
};

export default function CheckoutPage() {
  return <CheckoutScreen />;
}
