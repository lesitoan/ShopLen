import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/dist/photoswipe.css";
import type { ProductDetailImage } from "@/types/product.type";
import Skeleton from "@/components/skeletons/Skeleton";

interface GalleryProps {
  productName: string;
  images?: ProductDetailImage[] | string[];
  mainImage?: string;
  galleryImages?: string[];
  isLoading?: boolean;
}

export default function Gallery({
  productName,
  images,
  mainImage: initialMainImage,
  galleryImages: initialGalleryImages,
  isLoading = false,
}: GalleryProps) {
  const imageList = useMemo(() => {
    if (initialGalleryImages && initialGalleryImages.length > 0) {
      return initialGalleryImages;
    }
    if (images && images.length > 0) {
      return images.map((img) => (typeof img === "string" ? img : img.url));
    }
    if (initialMainImage) {
      return [initialMainImage];
    }
    return ["/logo.png"];
  }, [images, initialMainImage, initialGalleryImages]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeIndex = selectedIndex < imageList.length ? selectedIndex : 0;
  const activeImage = imageList[activeIndex] || imageList[0] || "/logo.png";

  useEffect(() => {
    if (isLoading) return;
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#product-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex gap-2.5 py-1">
          <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
          <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
          <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        </div>
      </div>
    );
  }

  const handleMainImageClick = () => {
    if (activeIndex !== -1) {
      const link = document.getElementById(`pswp-link-${activeIndex}`);
      link?.click();
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (activeIndex - 1 + imageList.length) % imageList.length;
    setSelectedIndex(prevIdx);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeIndex + 1) % imageList.length;
    setSelectedIndex(nextIdx);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={handleMainImageClick}
        className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface border border-border/60 cursor-zoom-in group/image"
        title="Bấm vào để phóng to hình ảnh"
      >
        <Image
          src={activeImage}
          alt={productName}
          fill
          sizes="(max-w-768px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
        />
        <div className="absolute right-3 bottom-3 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <Maximize2 size={16} />
        </div>

        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 hover:bg-black/60 active:scale-95 transition-all z-10"
              title="Ảnh trước"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 hover:bg-black/60 active:scale-95 transition-all z-10"
              title="Ảnh sau"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <style>{`
        .pswp__button--arrow {
          visibility: visible !important;
        }
      `}</style>

      <div id="product-gallery" className="hidden">
        {imageList.map((img, idx) => (
          <a
            key={idx}
            id={`pswp-link-${idx}`}
            href={img}
            data-pswp-width="1200"
            data-pswp-height="1200"
            target="_blank"
            rel="noreferrer"
          >
            <img src={img} alt={`${productName} gallery image ${idx}`} />
          </a>
        ))}
      </div>

      {imageList.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 select-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border bg-surface flex-shrink-0 transition-all duration-200 ${
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/20 scale-95"
                  : "border-border/60 hover:border-text-secondary/50"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
