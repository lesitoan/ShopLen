import React from "react";
import Image from "next/image";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message }: PageLoaderProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] select-none">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-[72px] h-[72px] rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin" />
        <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-surface">
          <Image
            src="/logo.png"
            alt="Tiệm Len Nhà Kiều"
            width={48}
            height={48}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {message && (
        <p className="mt-5 text-[13px] text-text-secondary font-medium">{message}</p>
      )}
    </div>
  );
}
