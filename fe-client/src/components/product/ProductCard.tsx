import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  id?: number | string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  soldCount?: number;
  image: string;
  badge?: "new" | "bestSeller" | "hotTiktok" | "sale" | "limited" | "soldOut";
  badgeLabel?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  reviews,
  soldCount,
  image,
  badge,
  badgeLabel,
}: ProductCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const cardContent = (
    <>
      <div className="relative aspect-square w-full bg-background overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {badge && (
          <div className="absolute left-2.5 top-2.5">
            <Badge variant={badge}>
              {badgeLabel ||
                (badge === "new"
                  ? "MỚI"
                  : badge === "bestSeller"
                  ? "BÁN CHẠY"
                  : badge === "hotTiktok"
                  ? "HOT TIKTOK"
                  : badge === "sale"
                  ? "GIẢM GIÁ"
                  : badge === "limited"
                  ? "GIỚI HẠN"
                  : "HẾT HÀNG")}
            </Badge>
          </div>
        )}

        <div
          className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border/80 flex items-center justify-center text-text-secondary group-hover:text-secondary group-hover:bg-primary-light group-hover:border-primary/30 transition-all duration-200 z-2 shadow-sm"
          title="Xem chi tiết sản phẩm"
        >
          <ShoppingCart size={15} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[14px] font-medium text-text-primary mb-1 line-clamp-2 min-h-[40px] group-hover:text-primary active:text-primary-active transition-colors">
          {name}
        </h3>

        <div className="flex items-center text-[12px] text-text-secondary mb-3 font-medium">
          <span>Đã bán {soldCount ?? reviews ?? 0}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[11px] text-text-secondary line-through mb-0.5">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-[15px] font-bold text-secondary">
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const productHref = slug ? `/san-pham/${slug}` : id ? `/san-pham/${id}` : "#";

  if (slug || id) {
    return (
      <Link
        href={productHref}
        className="group relative bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group relative bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {cardContent}
    </div>
  );
}
