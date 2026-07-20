import { Metadata } from "next";
import PaymentQrScreen from "@/screens/paymentQr";

export const metadata: Metadata = {
  title: "Quét mã QR thanh toán | Tiệm Len Nhà Kiều",
  description: "Màn hình chuyển khoản qua mã QR VietQR tự động cho đơn hàng mua móc khóa len tại Tiệm Len Nhà Kiều.",
};

interface PaymentQrPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function PaymentQrPage({ params }: PaymentQrPageProps) {
  const { orderId } = await params;
  return <PaymentQrScreen orderId={orderId} />;
}
