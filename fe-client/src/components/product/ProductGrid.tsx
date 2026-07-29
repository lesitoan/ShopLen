import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  title?: string;
}

export default function ProductGrid({ products, title = "SẢN PHẨM TƯƠNG TỰ" }: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-border/80 text-left">
      <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary mb-6 select-none">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
        {products.map((p) => (
          <ProductCard
            key={p.slug || p.id}
            id={p.id}
            slug={p.slug}
            name={p.name}
            price={p.price ?? p.salePrice ?? p.originalPrice ?? 0}
            originalPrice={p.salePrice && p.originalPrice ? p.originalPrice : undefined}
            rating={p.rating}
            reviews={p.reviews}
            image={p.thumbnail?.url || p.image || (p.images && p.images[0]?.url) || "/logo.png"}
            badge={
              p.highlightType === "TODAY_DEAL"
                ? "sale"
                : p.highlightType === "HOT_TIKTOK"
                ? "hotTiktok"
                : p.badge
            }
            badgeLabel={p.highlightLabel || p.badgeLabel}
            onAddToCart={() => console.log("Added to cart:", p.name)}
          />
        ))}
      </div>
    </div>
  );
}
