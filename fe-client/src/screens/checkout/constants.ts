import { CartItem } from "@/types/cart.type";

export const SINGLE_PAYMENT_METHOD = {
  id: "qr_bank",
  name: "Chuyển khoản Ngân hàng (Mã QR tự động)",
  subtitle: "Thanh toán trước 100% qua VietQR để shop tiến hành làm đơn hàng thủ công",
  icon: "/images/icons/vietqr.png",
};

export const INITIAL_CHECKOUT_ITEMS: CartItem[] = [];
