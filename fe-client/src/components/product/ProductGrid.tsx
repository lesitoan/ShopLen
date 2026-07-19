import React from "react";
import ProductCard from "./ProductCard";

interface ProductItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "new" | "bestSeller" | "hotTiktok" | "sale" | "limited" | "soldOut";
  badgeLabel?: string;
  category: string;
  color: string;
}

interface ProductGridProps {
  products: ProductItem[];
  title?: string;
}

export default function ProductGrid({ products, title = "SẢN PHẨM TƯƠNG TỰ" }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-border/80 text-left">
      <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary mb-6 select-none">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            originalPrice={p.originalPrice}
            rating={p.rating}
            reviews={p.reviews}
            image={p.image}
            badge={p.badge}
            badgeLabel={p.badgeLabel}
            onAddToCart={() => console.log("Added to cart:", p.name)}
          />
        ))}
      </div>
    </div>
  );
}
