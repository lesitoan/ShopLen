import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, AlertCircle } from "lucide-react";
import { CartItem } from "@/types/cart.type";

interface CartItemListProps {
  items: CartItem[];
  onQtyChange: (id: string | number, delta: number) => void;
  onRemoveItem: (id: string | number) => void;
  onClearAll: () => void;
}

export default function CartItemList({
  items,
  onQtyChange,
  onRemoveItem,
  onClearAll,
}: CartItemListProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const hasOutOfStockItem = items.some(
    (item) => !item.isAvailable || (item.stock !== undefined && item.stock <= 0)
  );

  return (
    <div className="flex flex-col gap-4">
      {hasOutOfStockItem && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-error border border-red-200 rounded-lg text-[13px]">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng xóa bớt sản phẩm hết hàng để tiếp tục thanh toán.
          </span>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-[16px] font-bold text-text-primary">
            Sản phẩm trong giỏ ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>
          <button
            onClick={onClearAll}
            className="text-[12px] font-medium text-text-secondary hover:text-error transition-colors"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-border text-[12px] font-bold text-text-secondary uppercase">
          <div className="col-span-6">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-right">Tạm tính</div>
        </div>

        <div className="divide-y divide-border/60">
          {items.map((item) => {
            const isOutOfStock = !item.isAvailable || (item.stock !== undefined && item.stock <= 0);
            const itemStock = item.stock ?? 99;

            return (
              <div
                key={item.id}
                className={`py-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                  isOutOfStock ? "opacity-75 bg-background/50 rounded-lg p-2 md:p-0" : ""
                }`}
              >
                <div className="col-span-6 w-full flex items-center gap-3.5">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-border/80 shrink-0 bg-background">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover"
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                        Hết hàng
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <Link
                      href={item.productId ? `/san-pham/${item.productId}` : `/san-pham/${item.id}`}
                      className="text-[13.5px] font-bold text-text-primary hover:text-secondary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11.5px] text-text-secondary mt-1">
                      Phân loại: <span className="font-semibold text-text-primary">{item.color}</span>
                    </p>
                    
                    {itemStock > 0 && itemStock <= 5 && (
                      <span className="inline-block mt-1 text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Chỉ còn {itemStock} sản phẩm
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto flex md:flex-col justify-between md:justify-center items-center text-center">
                  <span className="md:hidden text-[12px] text-text-secondary">Đơn giá:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13.5px] font-bold text-text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[11px] text-text-secondary line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto flex md:justify-center items-center justify-between">
                  <span className="md:hidden text-[12px] text-text-secondary">Số lượng:</span>
                  <div className="flex items-center border border-border rounded-md bg-surface overflow-hidden">
                    <button
                      onClick={() => onQtyChange(item.id, -1)}
                      disabled={isOutOfStock}
                      className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-background text-xs font-bold disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-[12px] font-bold text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onQtyChange(item.id, 1)}
                      disabled={isOutOfStock || item.quantity >= itemStock}
                      className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-background text-xs font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
                  <span className="md:hidden text-[12px] text-text-secondary">Tạm tính:</span>
                  <span className="text-[14px] font-bold text-secondary">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-text-secondary/60 hover:text-error p-1.5 rounded-md hover:bg-background transition-colors ml-2"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
