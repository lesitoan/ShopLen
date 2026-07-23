"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Plus, Trash2, Star, Eye } from "lucide-react";
import { SwiperImageModal } from "./SwiperImageModal";

export interface ImageUploaderProps {
  label?: string;
  value?: string | string[];
  values?: string[];
  onChange: (urls: any) => void;
  maxFiles?: number;
  error?: string;
  className?: string;
}

export function ImageUploader({
  label = "Hình ảnh sản phẩm",
  value,
  values,
  onChange,
  maxFiles = 8,
  error,
  className = "",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize image list
  const imageList: string[] = React.useMemo(() => {
    if (Array.isArray(values)) return values;
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }, [value, values]);

  const notifyChange = (newList: string[]) => {
    if (Array.isArray(values)) {
      onChange(newList);
    } else {
      onChange(newList);
    }
  };

  const handleFilesSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      alert("Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP)");
      return;
    }

    const readers = validFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newUrls) => {
      const filteredNew = newUrls.filter(Boolean);
      const combined = [...imageList, ...filteredNew].slice(0, maxFiles);
      notifyChange(combined);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveIndex = (index: number) => {
    const updated = imageList.filter((_, i) => i !== index);
    notifyChange(updated);
  };

  const handleSetMainIndex = (index: number) => {
    if (index === 0) return;
    const target = imageList[index];
    const rest = imageList.filter((_, i) => i !== index);
    notifyChange([target, ...rest]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-medium text-text-secondary">{label}</label>
            <span className="text-[11px] text-text-muted">
              ({imageList.length}/{maxFiles} ảnh)
            </span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelect(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      {/* Upload & Grid Area */}
      {imageList.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-surface-muted/50 border border-border">
          {imageList.map((url, idx) => (
            <div
              key={`${url.slice(0, 30)}-${idx}`}
              className="relative group aspect-square rounded-lg bg-surface border border-border overflow-hidden shadow-sm"
            >
              <Image
                src={url}
                alt={`Product Image ${idx + 1}`}
                fill
                unoptimized
                className="object-cover"
              />

              {/* Main Badge */}
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-bg-deep text-[9px] font-extrabold shadow-md z-10">
                  Ảnh chính
                </div>
              )}

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-1 z-20">
                <button
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  title="Xem ảnh phóng to (Swiper)"
                  className="p-1.5 rounded-lg bg-surface-hover hover:bg-primary text-text-primary hover:text-bg-deep transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMainIndex(idx)}
                    title="Đặt làm ảnh chính"
                    className="p-1.5 rounded-lg bg-surface-hover hover:bg-surface-active text-text-primary transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-status-warning" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveIndex(idx)}
                  title="Xóa ảnh này"
                  className="p-1.5 rounded-lg bg-status-danger/20 text-status-danger hover:bg-status-danger/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Tile */}
          {imageList.length < maxFiles && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none text-center p-2 ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/60 bg-surface-muted/40 hover:bg-surface-muted"
              }`}
            >
              <Plus className="w-5 h-5 text-primary" />
              <span className="text-[11px] font-bold text-text-secondary">Thêm ảnh</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-surface-muted/40 hover:bg-surface-muted"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary">
              Nhấp để chọn tệp từ máy tính hoặc kéo thả nhiều hình ảnh vào đây
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Hỗ trợ tải nhiều tệp cùng lúc (PNG, JPG, WEBP - Tối đa {maxFiles} ảnh)
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-status-danger font-medium">{error}</p>}

      {/* Swiper Image Modal */}
      <SwiperImageModal
        isOpen={previewIndex !== null}
        initialIndex={previewIndex || 0}
        images={imageList}
        onClose={() => setPreviewIndex(null)}
      />
    </div>
  );
}
