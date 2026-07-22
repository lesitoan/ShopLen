"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { ProductItem } from "../constants";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

interface ProductSectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  products: ProductItem[];
  promoBgImage?: string;
}

export default function ProductSection({
  title,
  description,
  ctaText,
  ctaLink,
  products,
  promoBgImage,
}: ProductSectionProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {promoBgImage ? (
          <div className="lg:col-span-3 relative overflow-hidden rounded-lg border border-border p-6 flex flex-col min-h-[280px] group/promo-section">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promoBgImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover/promo-section:scale-105"
            />
            <div className="absolute inset-0 bg-black/45 z-10" />
            
            <div className="z-20 flex flex-col justify-between h-full w-full items-start flex-1">
              <div>
                <h2 className="text-[20px] md:text-[22px] font-bold text-white mb-2 leading-tight">
                  {title}
                </h2>
                <p className="text-[12px] md:text-[13px] text-white/90 leading-relaxed mb-6">
                  {description}
                </p>
              </div>
              <Link href={ctaLink} className="w-full sm:w-auto mt-auto">
                <Button
                  variant="primary"
                  className="rounded-md px-5 py-2.5 font-semibold text-[13px] inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span>{ctaText}</span>
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex flex-col items-start text-left lg:pr-4 justify-center">
            <div>
              <h2 className="text-[20px] md:text-[22px] font-bold text-text-primary mb-2 leading-tight">
                {title}
              </h2>
              <p className="text-[12px] md:text-[13px] text-text-secondary leading-relaxed mb-6">
                {description}
              </p>
            </div>
            <Link href={ctaLink} className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="rounded-md px-5 py-2.5 font-semibold text-[13px] inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span>{ctaText}</span>
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
        )}

        <div className="lg:col-span-9 w-full">
          <div className="sm:hidden grid grid-cols-2 gap-4 w-full py-2">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                image={product.image}
                badge={product.badge}
                badgeLabel={product.badgeLabel}
                onAddToCart={() => console.log("Added to cart:", product.name)}
              />
            ))}
          </div>

          <div className="hidden sm:block relative group/carousel w-full">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={3}
              loop={products.length > 3}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="w-full !px-1 py-2 product-carousel"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="h-full">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviews={product.reviews}
                    image={product.image}
                    badge={product.badge}
                    badgeLabel={product.badgeLabel}
                    onAddToCart={() => console.log("Added to cart:", product.name)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {products.length > 3 && (
              <>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background active:bg-border transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background active:bg-border transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
