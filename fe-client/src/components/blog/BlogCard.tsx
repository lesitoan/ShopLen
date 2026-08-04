import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost, BlogPostApiItem } from "@/types/blog.type";

export interface BlogCardProps {
  post: BlogPost | BlogPostApiItem | Record<string, any>;
  variant?: "vertical" | "horizontal" | "responsive";
  isFeatured?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export default function BlogCard({
  post,
  variant = "vertical",
  isFeatured = false,
  showAuthor = false,
  className = "",
}: BlogCardProps) {
  const postTitle = post?.title ?? "";
  const postDescription = post?.excerpt ?? "";

  const postImage =
    typeof post?.thumbnail === "string"
      ? post.thumbnail
      : post?.thumbnail?.url || "/logo.png";

  const displayTag =
    typeof post?.tag === "string" ? post.tag : post?.tag?.label;

  const postDate = post?.publishedAt
    ? post.publishedAt.includes("T")
      ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : post.publishedAt
    : "";

  const postReadTime = post?.readTimeMinutes ? `${post.readTimeMinutes} phút đọc` : "";
  const targetHref = post?.slug ? `/${post.slug}` : "#";
  const postAuthor = post?.author;
  const postAuthorAvatar = post?.authorAvatar;

  // 1. Featured Horizontal Layout
  if (isFeatured) {
    return (
      <Link
        href={targetHref}
        className={`flex flex-col md:flex-row gap-4 md:gap-6 group w-full ${className}`}
      >
        <div className="relative w-full md:w-[48%] shrink-0 rounded-md overflow-hidden border border-border aspect-video">
          <Image
            src={postImage}
            alt={postTitle}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
          {displayTag && (
            <span className="text-[11px] font-semibold bg-primary-light text-secondary px-2.5 py-0.5 rounded w-fit">
              {displayTag}
            </span>
          )}

          <h2
            className="text-[16px] md:text-[18px] font-bold text-text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug"
            title={postTitle}
          >
            {postTitle}
          </h2>

          {postDescription && (
            <p className="text-[13px] text-text-secondary line-clamp-3 hidden md:block leading-relaxed">
              {postDescription}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-auto pt-1 flex-wrap">
            {showAuthor && postAuthor && (
              <>
                {postAuthorAvatar && (
                  <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border shrink-0">
                    <Image src={postAuthorAvatar} alt={postAuthor} fill sizes="16px" className="object-cover" />
                  </div>
                )}
                <span className="font-medium">{postAuthor}</span>
                {(postDate || postReadTime) && <span>·</span>}
              </>
            )}
            {postDate && <span>{postDate}</span>}
            {postDate && postReadTime && <span>·</span>}
            {postReadTime && <span>{postReadTime}</span>}
          </div>
        </div>
      </Link>
    );
  }

  // 2. Standard Horizontal Layout
  if (variant === "horizontal") {
    return (
      <Link
        href={targetHref}
        className={`flex gap-3 py-4 hover:bg-primary-light/40 rounded-md px-2 -mx-2 transition-colors group ${className}`}
      >
        <div
          className="relative w-28 md:w-36 shrink-0 rounded-md overflow-hidden border border-border"
          style={{ aspectRatio: "4/3" }}
        >
          <Image
            src={postImage}
            alt={postTitle}
            fill
            sizes="(max-width: 768px) 112px, 144px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {displayTag && (
            <span className="text-[11px] font-semibold bg-primary-light text-secondary px-2 py-0.5 rounded w-fit">
              {displayTag}
            </span>
          )}

          <h3
            className="text-[14px] font-semibold text-text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug"
            title={postTitle}
          >
            {postTitle}
          </h3>

          {postDescription && (
            <p className="text-[12px] text-text-secondary line-clamp-2 hidden md:block">
              {postDescription}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-auto pt-1 flex-wrap">
            {showAuthor && postAuthor && (
              <>
                {postAuthorAvatar && (
                  <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border shrink-0">
                    <Image src={postAuthorAvatar} alt={postAuthor} fill sizes="16px" className="object-cover" />
                  </div>
                )}
                <span className="font-medium">{postAuthor}</span>
                {(postDate || postReadTime) && <span>·</span>}
              </>
            )}
            {postDate && <span>{postDate}</span>}
            {postDate && postReadTime && <span>·</span>}
            {postReadTime && <span>{postReadTime}</span>}
          </div>
        </div>
      </Link>
    );
  }

  // 3. Responsive Layout (Horizontal on mobile, Vertical on desktop)
  if (variant === "responsive") {
    return (
      <>
        {/* Mobile Horizontal Card */}
        <Link
          href={targetHref}
          className={`flex md:hidden gap-3 py-3 border-b border-border/60 last:border-b-0 hover:bg-primary-light/40 rounded-md px-1 transition-colors group ${className}`}
        >
          <div
            className="relative w-28 shrink-0 rounded-md overflow-hidden border border-border"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={postImage}
              alt={postTitle}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0 flex-1">
            {displayTag && (
              <span className="text-[10px] font-semibold bg-primary-light text-secondary px-2 py-0.5 rounded w-fit">
                {displayTag}
              </span>
            )}

            <h3
              className="text-[13px] font-semibold text-text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug"
              title={postTitle}
            >
              {postTitle}
            </h3>

            <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-auto pt-1 flex-wrap">
              {showAuthor && postAuthor && (
                <>
                  {postAuthorAvatar && (
                    <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border shrink-0">
                      <Image src={postAuthorAvatar} alt={postAuthor} fill sizes="16px" className="object-cover" />
                    </div>
                  )}
                  <span className="font-medium">{postAuthor}</span>
                  {(postDate || postReadTime) && <span>·</span>}
                </>
              )}
              {postDate && <span>{postDate}</span>}
              {postDate && postReadTime && <span>·</span>}
              {postReadTime && <span>{postReadTime}</span>}
            </div>
          </div>
        </Link>

        {/* Desktop Vertical Card */}
        <Link
          href={targetHref}
          className={`hidden md:flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden group hover:border-primary transition-all duration-300 cursor-pointer ${className}`}
        >
          <div className="relative aspect-[16/10] w-full bg-background overflow-hidden">
            <Image
              src={postImage}
              alt={postTitle}
              fill
              sizes="(max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {displayTag && (
              <div className="absolute left-3 bottom-3 z-10">
                <span className="text-[9px] font-bold text-secondary bg-primary-light border border-primary/20 px-2.5 py-1 rounded-md tracking-wider">
                  {displayTag}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1 justify-between">
            <div>
              <h3
                className="text-[14px] font-bold text-text-primary leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2"
                title={postTitle}
              >
                {postTitle}
              </h3>
              {postDescription && (
                <p className="text-[12px] text-text-secondary leading-relaxed mb-4 line-clamp-2">
                  {postDescription}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
              {postDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-text-secondary/70" />
                  <span>{postDate}</span>
                </div>
              )}
              {postReadTime && (
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-text-secondary/70" />
                  <span>{postReadTime}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </>
    );
  }

  // 4. Default Vertical Layout
  return (
    <Link
      href={targetHref}
      className={`flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden group hover:border-primary transition-all duration-300 cursor-pointer ${className}`}
    >
      <div className="relative aspect-[16/10] w-full bg-background overflow-hidden">
        <Image
          src={postImage}
          alt={postTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {displayTag && (
          <div className="absolute left-3 bottom-3 z-10">
            <span className="text-[9px] font-bold text-secondary bg-primary-light border border-primary/20 px-2.5 py-1 rounded-md tracking-wider">
              {displayTag}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3
            className="text-[14px] font-bold text-text-primary leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2"
            title={postTitle}
          >
            {postTitle}
          </h3>
          {postDescription && (
            <p className="text-[12px] text-text-secondary leading-relaxed mb-4 line-clamp-2">
              {postDescription}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
          {postDate && (
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-text-secondary/70" />
              <span>{postDate}</span>
            </div>
          )}
          {postReadTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-text-secondary/70" />
              <span>{postReadTime}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
