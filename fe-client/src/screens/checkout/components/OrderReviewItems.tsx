import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Edit3 } from "lucide-react";
import { CartItem } from "@/types/cart.type";

interface OrderReviewItemsProps {
  items: CartItem[];
}

export default function OrderReviewItems({ items }: OrderReviewItemsProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="bg-surface border-y md:border border-border rounded-none md:rounded-xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
          <ShoppingBag size={18} className="text-secondary" />
          <span>Đơn hàng của bạn ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
        </h2>
        <Link
          href="/gio-hang"
          className="text-[12px] font-semibold text-secondary hover:underline flex items-center gap-1"
        >
          <Edit3 size={13} />
          <span>Sửa giỏ hàng</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-b-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/80 shrink-0 bg-background">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute top-0 right-0 bg-primary text-surface text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                x{item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold text-text-primary truncate">
                {item.name}
              </h3>
              {item.color &&
                item.color !== "Mặc định" &&
                item.color.toUpperCase() !== "DEFAULT" && (
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Phân loại: {item.color}
                  </p>
                )}
            </div>

            <span className="text-[13.5px] font-bold text-secondary shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
