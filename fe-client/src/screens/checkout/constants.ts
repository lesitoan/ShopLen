import { CheckoutCartItem } from "./types";


export const SINGLE_PAYMENT_METHOD = {
  id: "qr_bank",
  name: "Chuyển khoản Ngân hàng (Mã QR tự động)",
  subtitle: "Thanh toán trước 100% qua VietQR để shop tiến hành làm đơn hàng thủ công",
  icon: "/images/icons/vietqr.png",
};

export const INITIAL_CHECKOUT_ITEMS: CheckoutCartItem[] = [
  {
    id: 1,
    name: "Móc khóa Thỏ Bông Len Handmade",
    color: "Hồng nhạt",
    price: 45000,
    quantity: 2,
    image: "/images/products/moc-khoa-tho.png",
  },
  {
    id: 2,
    name: "Móc khóa Hoa Tinh Tú Sắc Màu",
    color: "Vàng chanh",
    price: 35000,
    quantity: 1,
    image: "/images/products/moc-khoa-hoa.png",
  },
];
