import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Link as LinkIcon, MessageCircle } from "lucide-react";
import type { BlogDetail } from "@/types/blog.type";

interface ArticleHeaderProps {
  post: BlogDetail;
}

const BLOG_TAG_LABELS: Record<string, string> = {
  "huong-dan-moc": "Hướng dẫn móc",
  "y-tuong-qua-tang": "Ý tưởng quà tặng",
  "cham-soc-len": "Chăm sóc len",
  "cam-hung-sang-tao": "Cảm hứng sáng tạo",
  "meo-hay": "Mẹo hay",
};

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-border">
      <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Trang chủ
        </Link>
        <span>›</span>
        <Link href="/bai-viet" className="hover:text-text-primary transition-colors">
          Bài viết
        </Link>
        <span>›</span>
        <span className="text-text-primary font-medium line-clamp-1 max-w-[200px] md:max-w-xs">
          {post.title}
        </span>
      </nav>

      <span className="text-[11px] font-semibold bg-primary-light text-secondary px-2.5 py-0.5 rounded w-fit">
        {BLOG_TAG_LABELS[post.tag] ?? post.tag}
      </span>

      <h1 className="text-[22px] md:text-[28px] font-bold text-text-primary leading-tight">
        {post.title}
      </h1>

      <p className="text-[14px] text-text-secondary leading-relaxed font-medium">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between gap-4 pt-2 flex-wrap text-[12px] text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
            <Image src={post.authorAvatar} alt={post.author} fill sizes="28px" className="object-cover" />
          </div>
          <span className="font-semibold text-text-primary">{post.author}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium hidden sm:inline">Chia sẻ:</span>
          <button
            type="button"
            title="Chia sẻ lên Facebook"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, "_blank")}
            className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-secondary hover:border-secondary transition-colors"
          >
            <Facebook size={14} />
          </button>
          <button
            type="button"
            title="Chia sẻ lên Zalo"
            onClick={handleCopyLink}
            className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-secondary hover:border-secondary transition-colors"
          >
            <MessageCircle size={14} />
          </button>
          <button
            type="button"
            title="Sao chép đường dẫn"
            onClick={handleCopyLink}
            className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-secondary hover:border-secondary transition-colors"
          >
            <LinkIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
