import React from "react";
import BlogCard from "@/components/blog/BlogCard";
import { useGetFeaturedPostQuery } from "@/services/api/blogApi";
import BlogCardSkeleton from "@/components/skeletons/blog/BlogCardSkeleton";

export default function FeaturedPostSection() {
  const { data: featuredPost, isLoading } = useGetFeaturedPostQuery();

  if (isLoading) {
    return <BlogCardSkeleton isFeatured={true} />;
  }

  if (!featuredPost) return null;

  return <BlogCard post={featuredPost} isFeatured={true} />;
}
