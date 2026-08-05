import React from "react";
import { notFound } from "next/navigation";
import BlogDetailScreen from "@/screens/blogDetail";
import type { BlogDetailApiItem } from "@/types/blog.type";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchBlogDetailServer(slug: string): Promise<BlogDetailApiItem | null> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) return null;
    const res = await fetch(`${apiBase}/blog/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogDetailServer(slug);
  if (!post) {
    return {
      title: "Không tìm thấy bài viết | Tiệm Len Nhà Kiều",
      description: "Bài viết không tồn tại hoặc đã bị xóa.",
    };
  }

  const title = post.metaTitle || `${post.title} | Tiệm Len Nhà Kiều`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      authors: [post.author || "Tiệm Len Nhà Kiều"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogDetailServer(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailScreen slug={slug} initialPost={post} />;
}
