import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog.type";
import { BLOG_TAG_LABELS } from "../constants";

interface ArticleCardProps {
  post: BlogPost;
  isFeatured?: boolean;
}

export default function ArticleCard({ post, isFeatured = false }: ArticleCardProps) {
  if (isFeatured) {
    return (
      <Link
        href={`/bai-viet/${post.slug}`}
        className="flex flex-col md:flex-row gap-4 p-3 md:p-4 bg-primary-light/30 rounded-lg border border-border/60 hover:bg-primary-light/50 transition-colors group w-full"
      >
        <div className="relative w-full md:w-[48%] shrink-0 rounded-md overflow-hidden border border-border aspect-video">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
          <span className="text-[11px] font-semibold bg-primary-light text-secondary px-2.5 py-0.5 rounded w-fit">
            {BLOG_TAG_LABELS[post.tag] ?? post.tag}
          </span>

          <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>

          <p className="text-[13px] text-text-secondary line-clamp-3 hidden md:block leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-auto pt-1 flex-wrap">
            <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border shrink-0">
              <Image src={post.authorAvatar} alt={post.author} fill sizes="16px" className="object-cover" />
            </div>
            <span className="font-medium">{post.author}</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/bai-viet/${post.slug}`}
      className="flex gap-3 py-4 hover:bg-primary-light/40 rounded-md px-2 -mx-2 transition-colors"
    >
      <div className="relative w-28 md:w-36 shrink-0 rounded-md overflow-hidden border border-border" style={{ aspectRatio: "4/3" }}>
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 112px, 144px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[11px] font-semibold bg-primary-light text-secondary px-2 py-0.5 rounded w-fit">
          {BLOG_TAG_LABELS[post.tag] ?? post.tag}
        </span>

        <h3 className="text-[14px] font-semibold text-text-primary line-clamp-2 leading-snug">
          {post.title}
        </h3>

        <p className="text-[12px] text-text-secondary line-clamp-2 hidden md:block">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-auto pt-1 flex-wrap">
          <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border shrink-0">
            <Image src={post.authorAvatar} alt={post.author} fill sizes="16px" className="object-cover" />
          </div>
          <span className="font-medium">{post.author}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
